export type FeedMediaType = 'image' | 'carousel' | 'video';

/** `static` = hand-curated images in the bundle; never presented as a synced feed. */
export type FeedSourceKind = 'static' | 'vitrine';

export interface FeedProfile {
  handle: string;
  profileUrl: string;
  displayName?: string;
}

export interface FeedItem {
  id: string;
  type: FeedMediaType;
  /** Photo, first carousel slide, or video cover. Videos are never autoplayed. */
  imageUrl: string;
  caption: string;
  permalink: string;
  publishedAt?: string;
  /** Number of slides, for carousels. */
  childCount?: number;
  tag?: string;
}

export interface FeedPage {
  source: FeedSourceKind;
  profile: FeedProfile;
  items: FeedItem[];
  nextCursor: string | null;
  syncedAt?: string | null;
}

export interface FeedSource {
  readonly kind: FeedSourceKind;
  getPage(cursor?: string | null, options?: { signal?: AbortSignal }): Promise<FeedPage>;
  /** First page available synchronously (static data only), so the footer renders without a flash. */
  snapshot?(): FeedPage | null;
}

export class FeedError extends Error {
  readonly reason: 'network' | 'http' | 'invalid';
  readonly status?: number;

  constructor(reason: FeedError['reason'], message: string, status?: number) {
    super(message);
    this.name = 'FeedError';
    this.reason = reason;
    this.status = status;
  }
}

/** The owner's Instagram connection in Vitrine is missing, revoked or expired. */
export class FeedDisconnectedError extends Error {
  constructor(message = 'Conta Instagram desconectada no Vitrine') {
    super(message);
    this.name = 'FeedDisconnectedError';
  }
}
