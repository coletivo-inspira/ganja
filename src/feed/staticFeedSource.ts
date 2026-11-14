import { CREATOR_PROFILE, INSTAGRAM_STRIP_ITEMS } from '../data/creator';
import type { InstagramStripItem } from '../types/ganja';
import type { FeedItem, FeedPage, FeedProfile, FeedSource } from './types';

export const STATIC_PROFILE: FeedProfile = {
  handle: CREATOR_PROFILE.brandHandle,
  profileUrl: CREATOR_PROFILE.instagramBrandUrl,
  displayName: 'GANJA STUDIO',
};

export function stripItemToFeedItem(item: InstagramStripItem): FeedItem {
  return {
    id: item.id,
    type: 'image',
    imageUrl: item.imagePath,
    caption: item.caption,
    permalink: item.permalink,
    tag: item.tag,
  };
}

export class StaticFeedSource implements FeedSource {
  readonly kind = 'static' as const;
  private readonly items: FeedItem[];
  private readonly pageSize: number;

  constructor(
    items: InstagramStripItem[] = INSTAGRAM_STRIP_ITEMS,
    options: { pageSize?: number } = {}
  ) {
    this.items = items.map(stripItemToFeedItem);
    this.pageSize = Math.max(1, options.pageSize ?? 12);
  }

  private pageAt(cursor?: string | null): FeedPage {
    const parsed = cursor ? Number.parseInt(cursor, 10) : 0;
    const offset = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    const end = offset + this.pageSize;
    return {
      source: 'static',
      profile: STATIC_PROFILE,
      items: this.items.slice(offset, end),
      nextCursor: end < this.items.length ? String(end) : null,
      syncedAt: null,
    };
  }

  snapshot(): FeedPage {
    return this.pageAt(null);
  }

  getPage(cursor?: string | null): Promise<FeedPage> {
    return Promise.resolve(this.pageAt(cursor));
  }
}
