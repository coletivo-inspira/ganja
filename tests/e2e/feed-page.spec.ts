import path from 'node:path';
import { expect, test, type Page, type Route } from '@playwright/test';
import { assertNoBackdropBlur, assertNoHorizontalOverflow, assertZeroBorderRadius, isHardDropShadow } from './helpers';

const VITRINE_APP = 'http://localhost:5174';
const FEED_ENDPOINT = 'https://vitrine-feed.test/v1/sites/ganja/feed**';
const CDN = 'https://vitrine-cdn.test';
const ASSETS = path.resolve(process.cwd(), 'public/assets/instagram');

function vitrineItem(n: number, mediaType: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO') {
  const cover = `${CDN}/ig-0${((n - 1) % 6) + 1}.svg`;
  return {
    id: `post-${n}`,
    mediaType,
    mediaUrl: mediaType === 'VIDEO' ? `${CDN}/clip-${n}.mp4` : cover,
    thumbnailUrl: mediaType === 'VIDEO' ? cover : undefined,
    caption: `Publicação ${n} do ateliê`,
    permalink: `https://www.instagram.com/p/POST${n}/`,
    timestamp: `2026-11-${String(14 - n).padStart(2, '0')}T12:00:00Z`,
    childrenCount: mediaType === 'CAROUSEL_ALBUM' ? 3 : undefined,
  };
}

const PAGE_ONE = {
  status: 'connected',
  profile: { username: 'ganjastudio.br', profileUrl: 'https://www.instagram.com/ganjastudio.br/' },
  items: [vitrineItem(1, 'IMAGE'), vitrineItem(2, 'CAROUSEL_ALBUM'), vitrineItem(3, 'VIDEO'), vitrineItem(4, 'IMAGE')],
  nextCursor: 'page-2',
  syncedAt: '2026-11-14T09:30:00Z',
};

const PAGE_TWO = {
  ...PAGE_ONE,
  items: [vitrineItem(5, 'VIDEO'), vitrineItem(6, 'IMAGE')],
  nextCursor: null,
};

async function serveCdn(page: Page): Promise<void> {
  await page.route(`${CDN}/**`, (route) => {
    const name = new URL(route.request().url()).pathname.slice(1);
    return route.fulfill({ path: path.join(ASSETS, name), contentType: 'image/svg+xml' });
  });
}

async function mockFeed(page: Page, handler: (route: Route, cursor: string | null) => Promise<void> | void) {
  await serveCdn(page);
  await page.route(FEED_ENDPOINT, (route) => handler(route, new URL(route.request().url()).searchParams.get('cursor')));
}

test.describe('Feed page — static archive (no VITE_VITRINE_FEED_URL)', () => {
  test('FP01: the footer strip is labeled static and links to #/feed, which renders the archive', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('instagram-strip-source')).toHaveText(
      'ARQUIVO ESTÁTICO — NÃO SINCRONIZADO COM O INSTAGRAM'
    );
    await page.getByTestId('instagram-strip-feed-link').click();
    await expect(page).toHaveURL(/#\/feed$/);
    await expect(page.getByTestId('feed-page')).toHaveAttribute('data-feed-source', 'static');
    await expect(page.getByTestId('feed-source-badge')).toHaveText('ARQUIVO ESTÁTICO — NÃO SINCRONIZADO');
    await expect(page.locator('[data-testid^="feed-tile-ig-item-"]')).toHaveCount(6);
    await expect(page.getByTestId('feed-end')).toContainText('FIM DO ARQUIVO ESTÁTICO');
    await expect(page).toHaveTitle('Feed Instagram — GANJA STUDIO');

    await page.getByTestId('feed-back-link').click();
    await expect(page.getByTestId('section-contato-06')).toBeAttached();
    await expect(page.getByTestId('feed-page')).toHaveCount(0);
  });

  test('FP02: keeps the brutalist rules — radius 0, no blur, 1px #111 tiles, 4px hard shadows, Syne and Space Mono', async ({ page }) => {
    await page.goto('/#/feed');
    const tile = page.locator('[data-testid^="feed-tile-"]').first();
    await expect(tile).toBeVisible();
    await assertZeroBorderRadius(tile);
    await assertNoBackdropBlur(tile);
    const style = await tile.evaluate((el) => {
      const s = getComputedStyle(el);
      return { border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, shadow: s.boxShadow };
    });
    expect(style.border).toBe('1px solid rgb(17, 17, 17)');
    expect(isHardDropShadow(style.shadow)).toBe(true);

    const audit = await page.getByTestId('feed-page').evaluate((root) => {
      const nodes = [root, ...Array.from(root.querySelectorAll('*'))];
      return {
        rounded: nodes.filter((n) => getComputedStyle(n).borderTopLeftRadius !== '0px').length,
        blurred: nodes.filter((n) => /blur\(/.test(getComputedStyle(n).backdropFilter || '')).length,
      };
    });
    expect(audit).toEqual({ rounded: 0, blurred: 0 });

    const heading = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily);
    expect(heading).toMatch(/Syne/);
    const badge = await page.getByTestId('feed-source-badge').evaluate((el) => getComputedStyle(el).fontFamily);
    expect(badge).toMatch(/Space Mono/);
  });

  test('FP03: 390px layout has two columns and no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/feed');
    await expect(page.locator('[data-testid^="feed-tile-"]').first()).toBeVisible();
    await assertNoHorizontalOverflow(page);
    const columns = await page
      .getByTestId('feed-grid')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(2);
    const manage = await page.getByTestId('feed-manage-link').boundingBox();
    expect(manage!.x + manage!.width).toBeLessThanOrEqual(391);
  });

  test('FP04: keyboard reaches the back link, the manage link and every tile, and Enter opens the original post', async ({ page, context }) => {
    await context.route('https://www.instagram.com/**', (route) => route.fulfill({ status: 200, body: 'ok' }));
    await page.goto('/#/feed');
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('feed-manage-link')).toBeFocused();
    await expect(page.getByTestId('feed-manage-link')).toHaveAttribute('href', 'https://painel.inspira.dev.br/');
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('feed-back-link')).toBeFocused();

    await page.getByRole('heading', { level: 1 }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('feed-profile-link')).toBeFocused();
    await page.keyboard.press('Tab');
    const firstTile = page.getByTestId('feed-tile-ig-item-01');
    await expect(firstTile).toBeFocused();
    const outline = await firstTile.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).toBe('solid');

    const [popup] = await Promise.all([context.waitForEvent('page'), page.keyboard.press('Enter')]);
    expect(popup.url()).toMatch(/^https:\/\/www\.instagram\.com\/ganjastudio\.br\//);
  });
});

test.describe('Feed page — Vitrine adapter (mocked public projection)', () => {
  test('FV01: loading, then photo, carousel and video-cover tiles, paginated by cursor without credentials', async ({ page }) => {
    const requests: Array<{ url: string; auth?: string; cookie?: string }> = [];
    await mockFeed(page, async (route, cursor) => {
      const headers = route.request().headers();
      requests.push({ url: route.request().url(), auth: headers.authorization, cookie: headers.cookie });
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({ json: cursor === 'page-2' ? PAGE_TWO : PAGE_ONE, headers: { 'Access-Control-Allow-Origin': '*' } });
    });

    await page.goto(`${VITRINE_APP}/#/feed`);
    await expect(page.getByTestId('feed-loading')).toBeVisible();
    await expect(page.getByTestId('feed-source-badge')).toHaveText('SINCRONIZADO VIA VITRINE');
    await expect(page.getByTestId('feed-tile-type')).toHaveText(['FOTO', 'CARROSSEL · 3', 'VÍDEO · CAPA', 'FOTO']);
    await expect(page.getByTestId('feed-tile-post-3').locator('video')).toHaveCount(0);
    await expect(page.getByTestId('feed-tile-post-3').getByTestId('feed-tile-video-mark')).toBeVisible();
    await expect(page.getByTestId('feed-tile-post-2')).toHaveAttribute('href', 'https://www.instagram.com/p/POST2/');

    await page.getByTestId('feed-load-more').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('feed-tile-post-5')).toBeFocused();
    await expect(page.locator('[data-testid^="feed-tile-post-"]')).toHaveCount(6);
    await expect(page.getByTestId('feed-end')).toContainText('FIM DO HISTÓRICO ACESSÍVEL // 6');

    const feedRequests = requests.filter((r) => r.url.includes('/feed'));
    expect(feedRequests.map((r) => new URL(r.url).searchParams.get('cursor'))).toContain('page-2');
    for (const request of feedRequests) {
      expect(new URL(request.url).searchParams.get('limit')).toBe('12');
      expect(request.auth).toBeUndefined();
      expect(request.cookie).toBeUndefined();
      expect(request.url).not.toMatch(/token/i);
    }
  });

  test('FV02: empty account shows the empty state', async ({ page }) => {
    await mockFeed(page, (route) =>
      route.fulfill({ json: { ...PAGE_ONE, items: [], nextCursor: null }, headers: { 'Access-Control-Allow-Origin': '*' } })
    );
    await page.goto(`${VITRINE_APP}/#/feed`);
    await expect(page.getByTestId('feed-empty')).toContainText('Nenhuma publicação');
  });

  test('FV03: an API failure shows the error state and retry recovers', async ({ page }) => {
    let failing = true;
    await mockFeed(page, (route) =>
      failing
        ? route.fulfill({ status: 503, body: 'down', headers: { 'Access-Control-Allow-Origin': '*' } })
        : route.fulfill({ json: PAGE_TWO, headers: { 'Access-Control-Allow-Origin': '*' } })
    );
    await page.goto(`${VITRINE_APP}/#/feed`);
    await expect(page.getByTestId('feed-error')).toBeVisible();
    failing = false;
    await page.getByTestId('feed-retry').click();
    await expect(page.getByTestId('feed-tile-post-5')).toBeVisible();
  });

  test('FV04: a disconnected account shows the reconnect guidance with the manage link and no tiles', async ({ page }) => {
    await mockFeed(page, (route) =>
      route.fulfill({ status: 410, json: { status: 'disconnected' }, headers: { 'Access-Control-Allow-Origin': '*' } })
    );
    await page.goto(`${VITRINE_APP}/#/feed`);
    await expect(page.getByTestId('feed-disconnected')).toContainText('Conta desconectada');
    await expect(page.getByTestId('feed-source-badge')).toHaveText('CONTA DESCONECTADA');
    await expect(page.getByTestId('feed-disconnected-manage-link')).toHaveAttribute('href', 'https://painel.inspira.dev.br/');
    await expect(page.locator('[data-testid^="feed-tile-"]')).toHaveCount(0);
  });

  test('FV05: the footer strip shows synced items, and falls back to the labeled archive when Vitrine fails', async ({ page }) => {
    await mockFeed(page, (route) => route.fulfill({ json: PAGE_ONE, headers: { 'Access-Control-Allow-Origin': '*' } }));
    await page.goto(VITRINE_APP);
    await expect(page.getByTestId('instagram-strip-source')).toHaveText('FEED SINCRONIZADO VIA VITRINE');
    await expect(page.locator('[data-testid^="ig-strip-item-post-"]')).toHaveCount(4);

    await page.unroute(FEED_ENDPOINT);
    await page.route(FEED_ENDPOINT, (route) => route.abort('failed'));
    await page.reload();
    await expect(page.getByTestId('instagram-strip-source')).toHaveText(
      'FEED INDISPONÍVEL — EXIBINDO ARQUIVO ESTÁTICO, NÃO SINCRONIZADO'
    );
    await expect(page.locator('[data-testid^="ig-strip-item-ig-item-"]')).toHaveCount(6);
  });
});
