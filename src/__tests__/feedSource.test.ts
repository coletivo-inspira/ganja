import { describe, expect, it, vi } from 'vitest';
import { INSTAGRAM_STRIP_ITEMS } from '../data/creator';
import {
  createFeedSource,
  DEFAULT_VITRINE_MANAGE_URL,
  FeedDisconnectedError,
  FeedError,
  routeFromHash,
  safeInstagramUrl,
  safeMediaUrl,
  STATIC_PROFILE,
  StaticFeedSource,
  VitrineFeedSource,
  vitrineManageUrl,
} from '../feed';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function vitrine(fetchImpl: (input: string, init?: RequestInit) => Promise<Response>, pageSize = 3) {
  return new VitrineFeedSource({
    endpoint: 'https://vitrine.example/v1/sites/ganja/feed',
    fallbackProfile: STATIC_PROFILE,
    pageSize,
    fetch: fetchImpl,
  });
}

const CONNECTED_PAGE = {
  status: 'connected',
  profile: { username: 'ganjastudio.br', profileUrl: 'https://www.instagram.com/ganjastudio.br/' },
  items: [
    {
      id: 'p1',
      mediaType: 'IMAGE',
      mediaUrl: 'https://cdn.example/p1.jpg',
      caption: 'Foto',
      permalink: 'https://www.instagram.com/p/AAA/',
      timestamp: '2026-11-01T12:00:00Z',
    },
    {
      id: 'p2',
      mediaType: 'CAROUSEL_ALBUM',
      mediaUrl: 'https://cdn.example/p2.jpg',
      caption: 'Carrossel',
      permalink: 'https://www.instagram.com/p/BBB/',
      childrenCount: 4,
    },
    {
      id: 'p3',
      mediaType: 'VIDEO',
      mediaUrl: 'https://cdn.example/p3.mp4',
      thumbnailUrl: 'https://cdn.example/p3-cover.jpg',
      caption: 'Reel',
      permalink: 'https://www.instagram.com/reel/CCC/',
    },
  ],
  nextCursor: 'cursor-2',
  syncedAt: '2026-11-14T10:00:00Z',
};

describe('StaticFeedSource', () => {
  it('maps INSTAGRAM_STRIP_ITEMS to photo items in a single page', async () => {
    const page = await new StaticFeedSource().getPage();
    expect(page.source).toBe('static');
    expect(page.items).toHaveLength(INSTAGRAM_STRIP_ITEMS.length);
    expect(page.items.every((item) => item.type === 'image')).toBe(true);
    expect(page.items[0]).toMatchObject({
      id: INSTAGRAM_STRIP_ITEMS[0].id,
      imageUrl: INSTAGRAM_STRIP_ITEMS[0].imagePath,
      permalink: INSTAGRAM_STRIP_ITEMS[0].permalink,
      tag: INSTAGRAM_STRIP_ITEMS[0].tag,
    });
    expect(page.nextCursor).toBeNull();
    expect(page.syncedAt).toBeNull();
    expect(page.profile.handle).toBe('@ganjastudio.br');
  });

  it('paginates with an offset cursor and exposes the first page synchronously', async () => {
    const source = new StaticFeedSource(undefined, { pageSize: 4 });
    expect(source.snapshot().items).toHaveLength(4);
    const first = await source.getPage(null);
    expect(first.nextCursor).toBe('4');
    const second = await source.getPage(first.nextCursor);
    expect(second.items.map((item) => item.id)).toEqual(['ig-item-05', 'ig-item-06']);
    expect(second.nextCursor).toBeNull();
  });
});

describe('createFeedSource', () => {
  it('uses the static archive when VITE_VITRINE_FEED_URL is unset or blank', () => {
    expect(createFeedSource({}).kind).toBe('static');
    expect(createFeedSource({ VITE_VITRINE_FEED_URL: '   ' }).kind).toBe('static');
  });

  it('uses Vitrine only when VITE_VITRINE_FEED_URL is set', () => {
    expect(createFeedSource({ VITE_VITRINE_FEED_URL: 'https://vitrine.example/feed' }).kind).toBe('vitrine');
  });

  it('points the manage link at the Vitrine panel, overridable by env', () => {
    expect(vitrineManageUrl({})).toBe(DEFAULT_VITRINE_MANAGE_URL);
    expect(vitrineManageUrl({ VITE_VITRINE_MANAGE_URL: 'https://painel.example/ganja' })).toBe(
      'https://painel.example/ganja'
    );
  });
});

describe('VitrineFeedSource', () => {
  it('requests the public projection with limit and cursor, without credentials or tokens', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(CONNECTED_PAGE));
    await vitrine(fetchImpl).getPage('abc');
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const parsed = new URL(url);
    expect(parsed.searchParams.get('limit')).toBe('3');
    expect(parsed.searchParams.get('cursor')).toBe('abc');
    expect(init.credentials).toBe('omit');
    expect(JSON.stringify(init.headers)).not.toMatch(/authorization|token/i);
    expect(url).not.toMatch(/token/i);
  });

  it('maps photos, carousels and video covers and keeps the next cursor', async () => {
    const page = await vitrine(async () => jsonResponse(CONNECTED_PAGE)).getPage();
    expect(page.source).toBe('vitrine');
    expect(page.items.map((item) => item.type)).toEqual(['image', 'carousel', 'video']);
    expect(page.items[1].childCount).toBe(4);
    expect(page.items[2].imageUrl).toBe('https://cdn.example/p3-cover.jpg');
    expect(page.items[2].permalink).toBe('https://www.instagram.com/reel/CCC/');
    expect(page.nextCursor).toBe('cursor-2');
    expect(page.syncedAt).toBe('2026-11-14T10:00:00Z');
    expect(page.profile.handle).toBe('@ganjastudio.br');
  });

  it('drops unsafe or incomplete items and never links outside Instagram', async () => {
    const page = await vitrine(async () =>
      jsonResponse({
        status: 'connected',
        profile: { username: 'ganjastudio.br' },
        items: [
          { id: 'x1', mediaType: 'IMAGE', mediaUrl: 'javascript:alert(1)', permalink: 'https://www.instagram.com/p/X/' },
          { id: 'x2', mediaType: 'VIDEO', mediaUrl: 'https://cdn.example/v.mp4', permalink: 'https://www.instagram.com/p/Y/' },
          { id: 'x3', mediaType: 'STORY', mediaUrl: 'https://cdn.example/s.jpg' },
          { id: 'x4', mediaType: 'IMAGE', mediaUrl: 'https://cdn.example/ok.jpg', permalink: 'https://evil.example/p/Z/' },
        ],
        nextCursor: null,
      })
    ).getPage();
    expect(page.items.map((item) => item.id)).toEqual(['x4']);
    expect(page.items[0].permalink).toBe(STATIC_PROFILE.profileUrl);
    expect(page.nextCursor).toBeNull();
  });

  it('reports a disconnected account on 410 or status "disconnected"', async () => {
    await expect(vitrine(async () => jsonResponse({}, 410)).getPage()).rejects.toBeInstanceOf(
      FeedDisconnectedError
    );
    await expect(
      vitrine(async () => jsonResponse({ status: 'disconnected', items: [] })).getPage()
    ).rejects.toBeInstanceOf(FeedDisconnectedError);
  });

  it('reports HTTP, network and payload failures as FeedError', async () => {
    await expect(vitrine(async () => jsonResponse({}, 503)).getPage()).rejects.toMatchObject({
      reason: 'http',
      status: 503,
    });
    await expect(
      vitrine(async () => {
        throw new TypeError('Failed to fetch');
      }).getPage()
    ).rejects.toMatchObject({ reason: 'network' });
    await expect(
      vitrine(async () => new Response('<html>', { status: 200 })).getPage()
    ).rejects.toBeInstanceOf(FeedError);
    await expect(vitrine(async () => jsonResponse({ status: 'connected' })).getPage()).rejects.toMatchObject({
      reason: 'invalid',
    });
  });
});

describe('URL guards and routing', () => {
  it('accepts only http(s) media and https Instagram permalinks', () => {
    expect(safeMediaUrl('data:image/png;base64,AAAA')).toBeUndefined();
    expect(safeMediaUrl('https://cdn.example/a.jpg')).toBe('https://cdn.example/a.jpg');
    expect(safeInstagramUrl('http://www.instagram.com/p/A/')).toBeUndefined();
    expect(safeInstagramUrl('https://instagram.com.evil.example/p/A/')).toBeUndefined();
    expect(safeInstagramUrl('https://www.instagram.com/p/A/')).toBe('https://www.instagram.com/p/A/');
  });

  it('routes only #/feed to the feed page', () => {
    expect(routeFromHash('#/feed')).toBe('feed');
    expect(routeFromHash('#/feed/')).toBe('feed');
    expect(routeFromHash('')).toBe('home');
    expect(routeFromHash('#/')).toBe('home');
    expect(routeFromHash('#contato-06')).toBe('home');
  });
});
