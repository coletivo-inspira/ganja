import { FeedDisconnectedError, FeedError } from './types';
import type { FeedItem, FeedMediaType, FeedPage, FeedProfile, FeedSource } from './types';

/*
 * Provisional public contract, pending vitrine #51. Vitrine holds every token
 * and serves an unauthenticated, read-only projection:
 *
 *   GET <VITE_VITRINE_FEED_URL>?limit=12&cursor=<opaque>
 *   200 {
 *     status: 'connected' | 'disconnected',
 *     profile: { username, profileUrl?, name? },
 *     items: [{ id, mediaType: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO', mediaUrl?,
 *               thumbnailUrl?, caption?, permalink, timestamp?, childrenCount? }],
 *     nextCursor: string | null,
 *     syncedAt?: string
 *   }
 *   410 or status 'disconnected' -> owner must reconnect in the Vitrine panel.
 */

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface VitrineItemPayload {
  id?: unknown;
  mediaType?: unknown;
  mediaUrl?: unknown;
  thumbnailUrl?: unknown;
  caption?: unknown;
  permalink?: unknown;
  timestamp?: unknown;
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

function toItem(raw: VitrineItemPayload, fallbackPermalink: string): FeedItem | null {
  const id = asString(raw.id);
  const type = MEDIA_TYPES[asString(raw.mediaType) ?? ''];
  if (!id || !type) return null;

  const cover =
    type === 'video'
      ? safeMediaUrl(raw.thumbnailUrl)
      : safeMediaUrl(raw.mediaUrl) ?? safeMediaUrl(raw.thumbnailUrl);
  if (!cover) return null;

  const childCount =
    type === 'carousel' && typeof raw.childrenCount === 'number' && raw.childrenCount > 0
      ? Math.floor(raw.childrenCount)
      : undefined;

  return {
    id,
    type,
    imageUrl: cover,
    caption: asString(raw.caption) ?? '',
    permalink: safeInstagramUrl(raw.permalink) ?? fallbackPermalink,
    publishedAt: asString(raw.timestamp),
    childCount,
  };
}

export class VitrineFeedSource implements FeedSource {
  readonly kind = 'vitrine' as const;
  private readonly endpoint: string;
  private readonly pageSize: number;
  private readonly fetchImpl: FetchLike;
  private readonly fallbackProfile: FeedProfile;

  constructor(options: {
    endpoint: string;
    fallbackProfile: FeedProfile;
    pageSize?: number;
    fetch?: FetchLike;
  }) {
    this.endpoint = options.endpoint;
    this.fallbackProfile = options.fallbackProfile;
    this.pageSize = Math.max(1, options.pageSize ?? 12);
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
      throw new FeedError('http', `Vitrine respondeu ${response.status}`, response.status);
    }

    let body: Record<string, unknown>;
    try {
      body = (await response.json()) as Record<string, unknown>;
    } catch {
      throw new FeedError('invalid', 'Resposta do Vitrine não é JSON');
    }
    if (!body || typeof body !== 'object') {
      throw new FeedError('invalid', 'Resposta do Vitrine vazia');
    }
    if (body.status === 'disconnected') throw new FeedDisconnectedError();
    if (!Array.isArray(body.items)) {
      throw new FeedError('invalid', 'Resposta do Vitrine sem lista de publicações');
    }

    const rawProfile = (body.profile ?? {}) as Record<string, unknown>;
    const username = asString(rawProfile.username);
    const profile: FeedProfile = {
      handle: username ? `@${username.replace(/^@/, '')}` : this.fallbackProfile.handle,
      profileUrl: safeInstagramUrl(rawProfile.profileUrl) ?? this.fallbackProfile.profileUrl,
      displayName: asString(rawProfile.name) ?? this.fallbackProfile.displayName,
    };

    const items = (body.items as VitrineItemPayload[])
      .map((raw) => (raw && typeof raw === 'object' ? toItem(raw, profile.profileUrl) : null))
      .filter((item): item is FeedItem => item !== null);

    return {
      source: 'vitrine',
      profile,
      items,
      nextCursor: asString(body.nextCursor) ?? null,
      syncedAt: asString(body.syncedAt) ?? null,
    };
  }
}
