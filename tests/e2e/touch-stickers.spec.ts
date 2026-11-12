import { expect, test, type CDPSession, type Page } from '@playwright/test';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });

const STICKER = 'draggable-sticker-sticker-gsh-2168';

async function touchPath(
  client: CDPSession,
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
  holdMs = 0
) {
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
  if (holdMs) await page.waitForTimeout(holdMs);
  const steps = 10;
  for (let i = 1; i <= steps; i += 1) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        {
          x: from.x + ((to.x - from.x) * i) / steps,
          y: from.y + ((to.y - from.y) * i) / steps,
        },
      ],
    });
    await page.waitForTimeout(16);
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function scrollPositions(page: Page) {
  return page.evaluate(() => ({
    window: window.scrollY,
    gallery: document.querySelector('[data-testid="hero-scroll-gallery"]')?.scrollTop ?? 0,
  }));
}

test.describe('Issue 1 — touch-safe stickers on a 375px touch screen', () => {
  test('T01: a vertical swipe starting on a sticker scrolls instead of dragging it', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId(STICKER);
    await sticker.scrollIntoViewIfNeeded();
    const box = (await sticker.boundingBox())!;
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const before = await scrollPositions(page);

    const client = await page.context().newCDPSession(page);
    await touchPath(client, page, start, { x: start.x, y: Math.max(10, start.y - 300) });
    await page.waitForTimeout(300);

    const after = await scrollPositions(page);
    expect(after.window + after.gallery).toBeGreaterThan(before.window + before.gallery);
    await expect(sticker).toHaveAttribute('data-offset-x', '0');
    await expect(sticker).toHaveAttribute('data-offset-y', '0');
  });

  test('T02: a long-press then drag moves the sticker without scrolling', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId(STICKER);
    await sticker.scrollIntoViewIfNeeded();
    const box = (await sticker.boundingBox())!;
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const before = await scrollPositions(page);

    const client = await page.context().newCDPSession(page);
    await touchPath(client, page, start, { x: start.x + 40, y: start.y + 60 }, 450);

    const dy = Number(await sticker.getAttribute('data-offset-y'));
    expect(dy).toBeGreaterThan(30);
    expect(await scrollPositions(page)).toEqual(before);
  });

  test('T03: stickers render at 0.75 scale below 768px and reset restores them', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId(STICKER);
    const scale = await sticker.evaluate((el) => getComputedStyle(el).getPropertyValue('--sticker-scale').trim());
    expect(scale).toBe('0.75');

    await sticker.scrollIntoViewIfNeeded();
    const box = (await sticker.boundingBox())!;
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const client = await page.context().newCDPSession(page);
    await touchPath(client, page, start, { x: start.x + 40, y: start.y + 60 }, 450);
    expect(Number(await sticker.getAttribute('data-offset-y'))).toBeGreaterThan(30);

    await page.getByTestId('reset-stickers').tap();
    await expect(page.getByTestId(STICKER)).toHaveAttribute('data-offset-x', '0');
    await expect(page.getByTestId(STICKER)).toHaveAttribute('data-offset-y', '0');
  });
});
