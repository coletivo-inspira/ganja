import { expect, test } from '@playwright/test';

test('the custom cursor is hidden on touch and visible for a mouse', async ({ browser }) => {
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const touchPage = await touch.newPage();
  await touchPage.goto('/');
  await expect(touchPage.getByTestId('custom-cursor')).toBeHidden();
  await touch.close();

  const mouse = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mousePage = await mouse.newPage();
  await mousePage.goto('/');
  await expect(mousePage.getByTestId('custom-cursor')).toBeVisible();
  await mouse.close();
});
