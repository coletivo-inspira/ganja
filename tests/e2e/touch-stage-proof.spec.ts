import { expect, test } from '@playwright/test';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });

test.describe('Issue 2 — Stage Proof accordion on a 375px touch screen', () => {
  test('T01: the device matches (hover: none) and (pointer: coarse) and shows no floating preview', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches)).toBe(true);
    await expect(page.getByTestId('stage-rollover-preview')).toHaveCount(0);
    await expect(page.getByTestId('stage-row-anitta')).toHaveAttribute('aria-expanded', 'false');
  });

  test('T02: tapping an artist opens the stage image and metadata inline, tapping again closes it', async ({ page }) => {
    await page.goto('/');
    const row = page.getByTestId('stage-row-pedro-sampaio');
    await row.scrollIntoViewIfNeeded();
    await row.tap();

    const panel = page.getByTestId('stage-accordion-panel-pedro-sampaio');
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel.locator('img')).toBeVisible();
    expect(await panel.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(panel).toContainText(/\[PEDRO SAMPAIO \/\/ .+ \/\/ .+ \/\/ .+\]/);

    const box = (await panel.boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(375);

    await row.tap();
    await expect(panel).toHaveCount(0);
    await expect(row).toHaveAttribute('aria-expanded', 'false');
  });

  test('T03: opening another artist collapses the previous one', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('stage-row-anitta').tap();
    await page.getByTestId('stage-row-kendrick-lamar').tap();
    await expect(page.getByTestId('stage-accordion-panel-anitta')).toHaveCount(0);
    await expect(page.getByTestId('stage-accordion-panel-kendrick-lamar')).toBeVisible();
  });
});
