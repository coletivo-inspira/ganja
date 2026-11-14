import { expect, test, type CDPSession, type Locator, type Page } from '@playwright/test';

async function touchPath(
  client: CDPSession,
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
  holdMs = 0
) {
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
  if (holdMs) await page.waitForTimeout(holdMs);
  for (let i = 1; i <= 10; i += 1) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: from.x + ((to.x - from.x) * i) / 10, y: from.y + ((to.y - from.y) * i) / 10 }],
    });
    await page.waitForTimeout(16);
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function centerOf(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = (await locator.boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function expectBrutalist(locator: Locator) {
  const styles = await locator.evaluate((root) =>
    [root, ...root.querySelectorAll('*')].map((el) => {
      const cs = getComputedStyle(el);
      return { radius: cs.borderRadius, blur: cs.backdropFilter, filter: cs.filter };
    })
  );
  for (const s of styles) {
    expect(s.radius).toBe('0px');
    expect(s.blur === 'none' || s.blur === '').toBe(true);
    expect(s.filter).not.toContain('blur');
  }
}

async function openDrawer(page: Page, id: string) {
  const card = page.getByTestId(`look-card-${id}`);
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
  return page.getByTestId('look-technical-drawer');
}

async function checkDrawers(page: Page) {
  let drawer = await openDrawer(page, '06');
  await expect(drawer.getByTestId('drawer-unique-seal')).toHaveText('[PEÇA ÚNICA 1/1 // ARQUIVO VIVO]');
  await expect(drawer.getByTestId('drawer-measurements').locator('td')).toHaveText(Array(4).fill('SOB CONSULTA'));
  await expect(drawer.getByTestId('drawer-size-selector')).toHaveCount(0);
  await expect(drawer.getByTestId('drawer-inquiry-cta')).toHaveText('SOLICITAR AQUISIÇÃO / ACERVO DE STYLING — LOOK 06');
  await expectBrutalist(drawer);
  await page.keyboard.press('Escape');

  drawer = await openDrawer(page, '01');
  const sizes = drawer.getByTestId('drawer-size-selector').getByRole('button');
  await expect(sizes).toHaveText(['[P]', '[M]', '[G]', '[GG]']);
  await drawer.getByRole('button', { name: 'G', exact: true }).click();
  await expect(drawer.getByRole('button', { name: 'G', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const cta = drawer.getByTestId('drawer-inquiry-cta');
  await expect(cta).toHaveText('ENCOMENDAR TIRAGEM LIMITADA — LOOK 01');
  expect(new URL((await cta.getAttribute('href'))!).searchParams.get('body')).toContain('Tamanho de interesse: G.');
  await expect(drawer.getByTestId('drawer-measurements')).toHaveCount(0);
  await expectBrutalist(drawer);
  await page.keyboard.press('Escape');

  for (const [id, percent] of [['03', '80'], ['04', '95']]) {
    drawer = await openDrawer(page, id);
    await expect(drawer.getByTestId('drawer-progress-bar')).toHaveAttribute('data-percent', percent);
    const wipCta = drawer.getByTestId('drawer-inquiry-cta');
    await expect(wipCta).toHaveText(`ENTRAR NA FILA DE PRÉ-RESERVA DO ATELIÊ — LOOK ${id}`);
    const href = new URL((await wipCta.getAttribute('href'))!);
    expect(href.protocol).toBe('mailto:');
    expect(href.pathname).toBe('gandraisaque@hotmail.com');
    expect(href.searchParams.get('subject')).toContain(`LOOK ${id}`);
    await page.keyboard.press('Escape');
  }
}

test.describe('Issues #12–#16 at 1440px (mouse)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('V01 #12: Mesa de Luz reset restores a mouse-dragged card', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[data-testid^="moodboard-card-"]').first();
    const c = await centerOf(card);
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.mouse.move(c.x + 80, c.y + 40, { steps: 5 });
    await page.mouse.up();
    expect(Number(await card.getAttribute('data-offset-x'))).toBeGreaterThan(40);

    const reset = page.getByTestId('reset-moodboard');
    await expectBrutalist(reset);
    expect(await reset.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/mono/i);
    await reset.click();
    await expect(card).toHaveAttribute('data-offset-x', '0');
    await expect(card).toHaveAttribute('data-offset-y', '0');
  });

  test('V02 #15: drawer seal, measurements, sizes and WIP CTA by front', async ({ page }) => {
    await page.goto('/');
    await checkDrawers(page);
  });
});

test.describe('Issues #12–#16 at 390px (real touch)', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('V03 #12: swipe over a moodboard card scrolls; long-press drags; reset restores it', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches)).toBe(true);
    const card = page.locator('[data-testid^="moodboard-card-"]').first();
    const client = await page.context().newCDPSession(page);

    let c = await centerOf(card);
    const before = await page.evaluate(() => window.scrollY);
    await touchPath(client, page, c, { x: c.x, y: Math.max(10, c.y - 250) });
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
    await expect(card).toHaveAttribute('data-offset-y', '0');

    c = await centerOf(card);
    await touchPath(client, page, c, { x: c.x + 20, y: c.y + 50 }, 450);
    expect(Number(await card.getAttribute('data-offset-y'))).toBeGreaterThan(30);

    await page.getByTestId('reset-moodboard').tap();
    await expect(card).toHaveAttribute('data-offset-x', '0');
    await expect(card).toHaveAttribute('data-offset-y', '0');
  });

  test('V04 #12: a sticker held for less than 300ms does not drag at 390px', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    const client = await page.context().newCDPSession(page);
    const c = await centerOf(sticker);
    await touchPath(client, page, c, { x: c.x + 30, y: c.y + 50 }, 150);
    await expect(sticker).toHaveAttribute('data-offset-x', '0');
    await expect(sticker).toHaveAttribute('data-offset-y', '0');
  });

  test('V05 #15: drawer seal, measurements, sizes and WIP CTA fit and work on touch', async ({ page }) => {
    await page.goto('/');
    await checkDrawers(page);
    const drawer = await openDrawer(page, '06');
    const table = (await drawer.getByTestId('drawer-measurements').boundingBox())!;
    expect(table.x + table.width).toBeLessThanOrEqual(390);
  });
});
