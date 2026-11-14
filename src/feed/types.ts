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
  /** Vitrine is serving its last valid projection because the latest sync failed. */
  stale?: boolean;
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
  /** Public error code from Vitrine, e.g. `FEED_UNAVAILABLE` or `INVALID_CURSOR`. */
  readonly code?: string;

  constructor(reason: FeedError['reason'], message: string, status?: number, code?: string) {
    super(message);
    this.name = 'FeedError';
    this.reason = reason;
    this.status = status;
    this.code = code;
  }
}

/** The owner's Instagram connection in Vitrine is missing, revoked or expired. */
export class FeedDisconnectedError extends Error {
  constructor(message = 'Conta Instagram desconectada no Vitrine') {
    super(message);
    this.name = 'FeedDisconnectedError';
  }
}
