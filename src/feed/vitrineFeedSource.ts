import { FeedDisconnectedError, FeedError } from './types';
import type { FeedItem, FeedMediaType, FeedPage, FeedProfile, FeedSource } from './types';

/*
 * Vitrine public feed contract, schemaVersion 1, as specified in
 * vitrine docs/instagram/interface-publica-feed.md (vitrine #51). Vitrine holds
 * every token and serves an unauthenticated, read-only projection:
 *
 *   GET /data/vitrines/:slug/instagram-feed.json?limit=12&cursor=<opaque>
 *   200 {
 *     schemaVersion: 1, slug, status: 'active' | 'empty' | 'stale', stale?, revision, hash, syncedAt,
 *     profile: { username, displayName?, profileUrl, avatarUrl? },
 *     pageInfo: { limit, hasNextPage, nextCursor: string | null },
 *     items: [{ id, mediaType: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO', mediaUrl, thumbnailUrl?,
 *               caption?, permalink, publishedAt, children?: [{ id, mediaType, mediaUrl, thumbnailUrl? }] }]
 *   }
 *   404 { error: 'FEED_NOT_FOUND', status: 'disconnected' } -> owner must reconnect in the panel.
 *   503 { error: 'FEED_UNAVAILABLE', status: 'unavailable' } -> no snapshot yet; retry later.
 *   400 { error: 'INVALID_CURSOR' } -> cursor issued for another storefront.
 *
 * The earlier provisional shape (status 'connected', top-level nextCursor,
 * timestamp, childrenCount, profile.name, 410) is still read so a Vitrine
 * build that predates the spec keeps working.
 */

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface VitrineChildPayload {
  mediaType?: unknown;
  mediaUrl?: unknown;
  thumbnailUrl?: unknown;
}

interface VitrineItemPayload {
  id?: unknown;
  mediaType?: unknown;
  mediaUrl?: unknown;
  thumbnailUrl?: unknown;
  caption?: unknown;
  permalink?: unknown;
  publishedAt?: unknown;
  timestamp?: unknown;
  children?: unknown;
  childrenCount?: unknown;
}

const MEDIA_TYPES: Record<string, FeedMediaType> = {
  IMAGE: 'image',
  CAROUSEL_ALBUM: 'carousel',
  VIDEO: 'video',
};

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

function baseHref(): string | undefined {
  return typeof window !== 'undefined' ? window.location.href : undefined;
}

/** Only http(s) media; rejects javascript:, data: and other schemes. */
export function safeMediaUrl(value: unknown): string | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw, baseHref());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Original-post links must point at Instagram over https. */
export function safeInstagramUrl(value: unknown): string | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const isInstagram = host === 'instagram.com' || host.endsWith('.instagram.com');
    return url.protocol === 'https:' && isInstagram ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Storefront slug from a `/data/vitrines/:slug/...` endpoint, if the URL follows that route. */
export function slugFromEndpoint(endpoint: string): string | undefined {
  try {
    const match = new URL(endpoint, baseHref()).pathname.match(/\/vitrines\/([^/]+)\//);
    return match ? decodeURIComponent(match[1]).toLowerCase() : undefined;
  } catch {
    return undefined;
  }
}

function childCover(child: VitrineChildPayload): string | undefined {
  return asString(child.mediaType) === 'VIDEO'
    ? safeMediaUrl(child.thumbnailUrl)
    : safeMediaUrl(child.mediaUrl) ?? safeMediaUrl(child.thumbnailUrl);
}

function toItem(raw: VitrineItemPayload, fallbackPermalink: string): FeedItem | null {
  const id = asString(raw.id);
  const type = MEDIA_TYPES[asString(raw.mediaType) ?? ''];
  if (!id || !type) return null;

  const children: VitrineChildPayload[] = Array.isArray(raw.children)
    ? raw.children.map(asRecord).filter((child): child is Record<string, unknown> => child !== undefined)
    : [];

  let cover: string | undefined;
  if (type === 'video') {
    cover = safeMediaUrl(raw.thumbnailUrl);
  } else {
    cover = safeMediaUrl(raw.mediaUrl) ?? safeMediaUrl(raw.thumbnailUrl);
    if (!cover && type === 'carousel') cover = children.map(childCover).find(Boolean);
  }
  if (!cover) return null;

  let childCount: number | undefined;
  if (type === 'carousel') {
    if (children.length > 0) childCount = children.length;
    else if (typeof raw.childrenCount === 'number' && raw.childrenCount > 0) childCount = Math.floor(raw.childrenCount);
  }

  return {
    id,
    type,
    imageUrl: cover,
    caption: asString(raw.caption) ?? '',
    permalink: safeInstagramUrl(raw.permalink) ?? fallbackPermalink,
    publishedAt: asString(raw.publishedAt) ?? asString(raw.timestamp),
    childCount,
  };
}

async function readJson(response: Response): Promise<Record<string, unknown> | undefined> {
  try {
    return asRecord(await response.json());
  } catch {
    return undefined;
  }
}

function isDisconnectedBody(body: Record<string, unknown> | undefined): boolean {
  return body?.status === 'disconnected' || body?.error === 'FEED_NOT_FOUND';
}

export class VitrineFeedSource implements FeedSource {
  readonly kind = 'vitrine' as const;
  private readonly endpoint: string;
  private readonly pageSize: number;
  private readonly fetchImpl: FetchLike;
  private readonly fallbackProfile: FeedProfile;
  private readonly slug?: string;

  constructor(options: {
    endpoint: string;
    fallbackProfile: FeedProfile;
    pageSize?: number;
    /** Expected storefront; defaults to the slug in a `/data/vitrines/:slug/` endpoint. */
    slug?: string;
    fetch?: FetchLike;
  }) {
    this.endpoint = options.endpoint;
    this.fallbackProfile = options.fallbackProfile;
    this.pageSize = Math.min(24, Math.max(1, options.pageSize ?? 12));
    this.slug = options.slug?.trim().toLowerCase() || slugFromEndpoint(options.endpoint);
    this.fetchImpl = options.fetch ?? ((input, init) => fetch(input, init));
  }

  private urlFor(cursor?: string | null): string {
    const url = new URL(this.endpoint, baseHref());
    url.searchParams.set('limit', String(this.pageSize));
    if (cursor) url.searchParams.set('cursor', cursor);
    return url.href;
  }

  async getPage(cursor?: string | null, options: { signal?: AbortSignal } = {}): Promise<FeedPage> {
    let response: Response;
    try {
      response = await this.fetchImpl(this.urlFor(cursor), {
        method: 'GET',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
        signal: options.signal,
      });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') throw error;
      throw new FeedError('network', 'Falha de rede ao consultar o Vitrine');
    }

    if (response.status === 410) throw new FeedDisconnectedError();
    if (!response.ok) {
      const errorBody = await readJson(response);
      if (response.status === 404 && isDisconnectedBody(errorBody)) throw new FeedDisconnectedError();
      throw new FeedError(
        'http',
        `Vitrine respondeu ${response.status}`,
        response.status,
        asString(errorBody?.error)
      );
    }

    const body = await readJson(response);
    if (!body) throw new FeedError('invalid', 'Resposta do Vitrine não é um objeto JSON');
    if (isDisconnectedBody(body)) throw new FeedDisconnectedError();
    if (body.status === 'unavailable') {
      throw new FeedError('http', 'Feed do Vitrine ainda indisponível', 503, 'FEED_UNAVAILABLE');
    }
    const bodySlug = asString(body.slug)?.toLowerCase();
    if (this.slug && bodySlug && bodySlug !== this.slug) {
      throw new FeedError('invalid', `Feed pertence à vitrine "${bodySlug}", esperado "${this.slug}"`, undefined, 'SLUG_MISMATCH');
    }
    if (!Array.isArray(body.items)) {
      throw new FeedError('invalid', 'Resposta do Vitrine sem lista de publicações');
    }

    const rawProfile = asRecord(body.profile) ?? {};
    const username = asString(rawProfile.username);
    const profile: FeedProfile = {
      handle: username ? `@${username.replace(/^@/, '')}` : this.fallbackProfile.handle,
      profileUrl: safeInstagramUrl(rawProfile.profileUrl) ?? this.fallbackProfile.profileUrl,
      displayName: asString(rawProfile.displayName) ?? asString(rawProfile.name) ?? this.fallbackProfile.displayName,
    };

    const items = (body.items as unknown[])
      .map((raw) => {
        const record = asRecord(raw);
        return record ? toItem(record, profile.profileUrl) : null;
      })
      .filter((item): item is FeedItem => item !== null);

    const pageInfo = asRecord(body.pageInfo);
    const nextCursor =
      pageInfo?.hasNextPage === false ? null : asString(pageInfo?.nextCursor) ?? asString(body.nextCursor) ?? null;

    return {
      source: 'vitrine',
      profile,
      items,
      nextCursor,
      syncedAt: asString(body.syncedAt) ?? null,
      stale: body.stale === true || body.status === 'stale',
    };
  }
}
