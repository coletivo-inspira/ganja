import { test, expect } from '@playwright/test';
import {
  DESIGN_TOKENS,
  NAV_CELLS,
  HERO_STICKERS,
  STAGE_ROWS,
  assertZeroBorderRadius,
  assertNoBackdropBlur,
  isHardDropShadow,
  dragElementBy,
  hasActiveGrayscaleFilter,
} from './helpers';

test.describe('Tier 3 — Cross-Feature Pairwise & Multi-Feature Combinations (C01–C24)', () => {
  test('C01 (F01 + F06 + F07 + F08): Sticky header structural grid + brand mark + navigation rollover preview + section jump', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('sticky-header');
    await assertZeroBorderRadius(header);
    await expect(page.getByTestId('nav-cell-brand')).toContainText('GANJASTUDIO');

    const nav01 = page.getByTestId('nav-cell-01');
    await nav01.hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(01)');

    await nav01.click();
    await expect(page.getByTestId('section-origem-01')).toBeVisible();
  });

  test('C02 (F01 + F08): Navigation rollover preview geometry audit (0px radius, 1px solid border, 4px hard shadow) across all 6 nav cells', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS.slice(1)) {
      await page.getByTestId(cell.testId).hover();
      const preview = page.getByTestId('nav-rollover-preview');
      await expect(preview).toBeVisible();
      await assertZeroBorderRadius(preview);
      await assertNoBackdropBlur(preview);
      const shadow = await preview.evaluate((el) => window.getComputedStyle(el).boxShadow);
      expect(isHardDropShadow(shadow)).toBe(true);
    }
  });

  test('C03 (F02 + F06 + F11 + F12): Hero 12-column grid + brand mark + draggable stickers + zero Liquid Glass blur audit', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('section-hero-00');
    await expect(hero).toBeVisible();
    await expect(page.getByTestId('brand-mark-svg')).toBeVisible();

    const sticker = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    await dragElementBy(page, sticker, 55, 35);
    await assertNoBackdropBlur(hero);
    await assertNoBackdropBlur(sticker);
  });

  test('C04 (F02 + F04 + F11 + F12): Hero Scroll Gallery + all 5 urban stickers semiotic palette + Vinyl Sticker Gloss pointer interaction', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-scroll-gallery')).toBeVisible();
    for (const s of HERO_STICKERS) {
      const loc = page.getByTestId(s.testId);
      await loc.hover();
      await expect(loc.getByTestId('sticker-gloss-layer')).toBeAttached();
      await assertZeroBorderRadius(loc);
    }
  });

  test('C05 (F03 + F07 + F10 + F15): Sticky header jump to ATUAÇÃODAMARCA(03) + smooth scroll + #0D0D0D dark surface transition', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-03').click();
    const sec03 = page.getByTestId('section-atuacao-03');
    await expect(sec03).toBeVisible();
    const bg = await sec03.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe(DESIGN_TOKENS.surfaceStageRgb);

    const headerBox = await page.getByTestId('sticky-header').boundingBox();
    expect(headerBox!.y).toBeLessThanOrEqual(2);
  });

  test('C06 (F03 + F13 + F15 + F20): Multi-section surface progression (#F4F3EF Origin -> #0D0D0D Stage Proof -> #FFFFFF Lookbook -> #0D0D0D Footer)', async ({ page }) => {
    await page.goto('/');
    const originBg = await page.getByTestId('section-origem-01').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const stageBg = await page.getByTestId('section-atuacao-03').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const cardBg = await page.getByTestId('look-card-01').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const footerBg = await page.getByTestId('brutalist-footer').evaluate((el) => window.getComputedStyle(el).backgroundColor);

    expect(originBg).toBe(DESIGN_TOKENS.surfacePaperRgb);
    expect(stageBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
    expect(cardBg).toBe(DESIGN_TOKENS.surfaceWhiteRgb);
    expect(footerBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('C07 (F04 + F16): Dual Creation Architecture hover expansion + semiotic accent badges and look cross-references', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideA.scrollIntoViewIfNeeded();

    await sideA.hover();
    await page.waitForTimeout(50);
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(boxA!.width).toBeGreaterThan(boxB!.width);
    await expect(sideA).toContainText(/LOOK\s*0?3|LOOK\s*0?6/i);
    await expect(sideB).toContainText(/LOOK\s*0?2|LOOK\s*0?5/i);
  });

  test('C08 (F05 + F13 + F14): Origin narrative typography hierarchy + kinetic spaced title + continuous marquee scroll interaction', async ({ page }) => {
    await page.goto('/');
    const title = page.getByTestId('kinetic-title-origem');
    const marquee = page.getByTestId('kinetic-marquee');
    const demo = page.getByTestId('demographic-frame');

    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeVisible();
    await expect(marquee).toBeVisible();
    await expect(demo).toBeVisible();

    const monoFont = await demo.evaluate((el) => window.getComputedStyle(el).fontFamily.toLowerCase());
    expect(monoFont).toMatch(/mono/);
  });

  test('C09 (F05 + F09 + F17): Lookbook card hover triggers simultaneous monospace custom cursor material tag and silhouette-to-macro swap', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await expect(card06).toHaveAttribute('data-view-mode', 'silhouette');

    await card06.hover();
    await expect(card06).toHaveAttribute('data-view-mode', 'macro');
    const cursorLabel = page.getByTestId('custom-cursor-label');
    await expect(cursorLabel).toBeVisible();
    await expect(cursorLabel).toContainText('[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]');
  });

  test('C10 (F07 + F10 + F14): Navigating via sticky header from Hero through Origin triggers kinetic letter-spacing update while header stays pinned', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-01').click();
    await page.evaluate(() => window.scrollBy(0, 180));
    await page.waitForTimeout(50);

    const headerBox = await page.getByTestId('sticky-header').boundingBox();
    expect(headerBox!.y).toBeLessThanOrEqual(2);
    const ls = await page.getByTestId('kinetic-title-origem').evaluate((el) => parseFloat(window.getComputedStyle(el).letterSpacing || '0'));
    expect(ls).toBeGreaterThan(0);
  });

  test('C11 (F01 + F09 + F16 + F17 + F18): Dual Architecture Upcycling exploration -> Look 06 cursor inspection -> Look 06 Technical Drawer open', async ({ page }) => {
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    await sideA.scrollIntoViewIfNeeded();
    await sideA.hover();
    await expect(sideA).toContainText(/couro|pel[úu]cia/i);

    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    await expect(page.getByTestId('custom-cursor-label')).toContainText('INSPECIONAR LOOK 06');

    await card06.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await assertZeroBorderRadius(drawer);
    await expect(page.getByTestId('drawer-look-title')).toContainText(/LOOK\s*0?6/i);
  });

  test('C12 (F02 + F12 + F19): Dragging Hero urban stickers and Are.na moodboard cards in sequence with zero backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-ganja-25g');
    const sRes = await dragElementBy(page, sticker, 50, 30);
    expect(Math.abs(sRes.deltaX) > 5 || Math.abs(sRes.deltaY) > 5 || sRes.beforeTransform !== sRes.afterTransform).toBe(true);
    await assertNoBackdropBlur(sticker);

    const moodCard = page.locator('[data-testid^="moodboard-card-"]').first();
    const mRes = await dragElementBy(page, moodCard, 60, 40);
    expect(Math.abs(mRes.deltaX) > 5 || Math.abs(mRes.deltaY) > 5 || mRes.beforeTransform !== mRes.afterTransform).toBe(true);
    await assertNoBackdropBlur(moodCard);
  });

  test('C13 (F03 + F15 + F20): Dark mode surface parity between Section 03 Stage Proof (#0D0D0D) and Section 06 Brutalist Footer (#0D0D0D)', async ({ page }) => {
    await page.goto('/');
    const stageSec = page.getByTestId('section-atuacao-03');
    const footer = page.getByTestId('brutalist-footer');
    const stageBg = await stageSec.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const footerBg = await footer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(stageBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
    expect(footerBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('C14 (F04 + F09 + F17 + F18): WIP Look 03 (80% CONCLUIDO) and Look 04 (95% CONCLUIDO) cursor inspection, badge check, and Drawer progress bar verification', async ({ page }) => {
    await page.goto('/');
    const card03 = page.getByTestId('look-card-03');
    await card03.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('wip-badge-look-03')).toContainText('80% CONCLUIDO');
    await card03.hover();
    await expect(page.getByTestId('custom-cursor-label')).toContainText('LOOK 03');
    await card03.click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('80%');
    await page.getByTestId('drawer-close-btn').click();

    const card04 = page.getByTestId('look-card-04');
    await expect(page.getByTestId('wip-badge-look-04')).toContainText('95% CONCLUIDO');
    await card04.hover();
    await expect(page.getByTestId('custom-cursor-label')).toContainText('LOOK 04');
    await card04.click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('95%');
  });

  test('C15 (F01 + F10 + F18): Opening Technical Drawer from scrolled Lookbook position, interacting with macro zoom, closing via Escape, and resuming scroll', async ({ page }) => {
    await page.goto('/');
    const card05 = page.getByTestId('look-card-05');
    await card05.scrollIntoViewIfNeeded();
    await card05.click();

    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await page.getByTestId('drawer-macro-zoom').click();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();

    await page.getByTestId('brutalist-footer').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('brutalist-footer')).toBeVisible();
  });

  test('C16 (F05 + F13 + F14 + F19): UFMG/Senai conceptual-industrial narrative in Section 01 paired with Are.na process moodboard artifact categories in Section 05', async ({ page }) => {
    await page.goto('/');
    const sec01 = page.getByTestId('section-origem-01');
    await expect(sec01).toContainText('UFMG');
    await expect(sec01).toContainText('Senai');

    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    const moodText = await moodboard.textContent();
    expect(moodText).toMatch(/SENAI|UFMG|GARIMPO|SINALIZA[ÇC][ÃA]O|ATELI[ÊE]/i);
  });

  test('C17 (F06 + F11 + F20): Brand identity continuity from Hero G★NJ★ SVG mark and Sticky Header to Section 06 Creator Card and Footer links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('brand-mark-svg')).toBeVisible();
    await expect(page.getByTestId('nav-cell-brand')).toContainText('GANJASTUDIO');

    const creatorCard = page.getByTestId('creator-catalog-card');
    await creatorCard.scrollIntoViewIfNeeded();
    await expect(creatorCard).toContainText('Isaque Gandra');

    const footer = page.getByTestId('brutalist-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('footer-link-ganjastudio')).toHaveAttribute('href', /ganjastudio\.br/);
    await expect(page.getByTestId('footer-link-isaquex')).toHaveAttribute('href', /isaquex/);
  });

  test('C18 (F07 + F08 + F15 + F20): Hovering nav-cell-03 preview -> clicking to Stage Proof rollover -> hovering nav-cell-06 preview -> clicking to Footer', async ({ page }) => {
    await page.goto('/');
    const nav03 = page.getByTestId('nav-cell-03');
    await nav03.hover();
    await expect(page.getByTestId('nav-rollover-preview')).toContainText('(03)');
    await nav03.click();

    const rowKendrick = page.getByTestId('stage-row-kendrick-lamar');
    await rowKendrick.hover();
    await expect(page.getByTestId('stage-rollover-preview')).toContainText(/Kendrick Lamar/i);

    const nav06 = page.getByTestId('nav-cell-06');
    await nav06.hover();
    await expect(page.getByTestId('nav-rollover-preview')).toContainText('(06)');
    await nav06.click();
    await expect(page.getByTestId('section-contato-06')).toBeVisible();
  });

  test('C19 (F09 + F16 + F17): Comparing Pequena Escala items in Section 04 (Look 02, 04, 05, 10) and inspecting each in Section 05 Lookbook with custom cursor', async ({ page }) => {
    await page.goto('/');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideB.scrollIntoViewIfNeeded();
    await expect(sideB).toContainText(/Ozempic/i);

    for (const lookId of ['look-card-02', 'look-card-04', 'look-card-05', 'look-card-10']) {
      const card = page.getByTestId(lookId);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await expect(card).toHaveAttribute('data-view-mode', 'macro');
      await expect(page.getByTestId('custom-cursor-label')).toBeVisible();
    }
  });

  test('C20 (F17 + F18 + F19): Rearranging Are.na moodboard artifact linked to a Look, then hovering and opening that Look in Technical Drawer', async ({ page }) => {
    await page.goto('/');
    const moodCard = page.locator('[data-testid^="moodboard-card-"]').first();
    await dragElementBy(page, moodCard, 45, 25);
    const cardText = (await moodCard.textContent()) || '';
    expect(cardText).toMatch(/LOOK\s*0?[1-9]|LOOK\s*10/i);

    const lookCard01 = page.getByTestId('look-card-01');
    await lookCard01.scrollIntoViewIfNeeded();
    await lookCard01.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
  });

  test('C21 (F08 + F09 + F15): Pointer transition from Sticky Header rollover preview to Stage Proof rollover preview to Lookbook custom cursor tag', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-02').hover();
    await expect(page.getByTestId('nav-rollover-preview')).toBeVisible();

    const rowAnitta = page.getByTestId('stage-row-anitta');
    await rowAnitta.scrollIntoViewIfNeeded();
    await rowAnitta.hover();
    await expect(page.getByTestId('nav-rollover-preview')).toBeHidden();
    await expect(page.getByTestId('stage-rollover-preview')).toBeVisible();

    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    await expect(page.getByTestId('stage-rollover-preview')).toBeHidden();
    await expect(page.getByTestId('custom-cursor-label')).toContainText('[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]');
  });

  test('C22 (F12 + F17 + F18): Hero sticker "GOD SAVE BEARS FROM OZEMPIC" drag interaction paired with Look 02 (Camiseta Ozempic) macro toggle and Drawer inspection', async ({ page }) => {
    await page.goto('/');
    const ozempicSticker = page.getByTestId('draggable-sticker-sticker-ozempic');
    await expect(ozempicSticker).toContainText('GOD SAVE BEARS FROM OZEMPIC');
    await dragElementBy(page, ozempicSticker, 40, 30);

    const card02 = page.getByTestId('look-card-02');
    await card02.scrollIntoViewIfNeeded();
    await expect(card02).toContainText(/Ozempic/i);
    await card02.hover();
    await expect(card02).toHaveAttribute('data-view-mode', 'macro');
    await card02.click();
    await expect(page.getByTestId('drawer-look-title')).toContainText(/Ozempic/i);
  });

  test('C23 (F12 + F17 + F18): Hero stickers "Não me siga estou perdida" & "GSH-2168" drag paired with Look 03 (Adesivos de Caminhão 80% CONCLUIDO) Drawer inspection', async ({ page }) => {
    await page.goto('/');
    await dragElementBy(page, page.getByTestId('draggable-sticker-sticker-caminhao'), 35, -25);
    await dragElementBy(page, page.getByTestId('draggable-sticker-sticker-gsh-2168'), -30, 40);

    const card03 = page.getByTestId('look-card-03');
    await card03.scrollIntoViewIfNeeded();
    await expect(card03).toContainText(/Adesivos de Caminh[ãa]o/i);
    await expect(page.getByTestId('wip-badge-look-03')).toContainText('80% CONCLUIDO');
    await card03.click();
    await expect(page.getByTestId('drawer-look-title')).toContainText(/Adesivos de Caminh[ãa]o/i);
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('80%');
  });

  test('C24 (F18 + F19 + F20): Full bottom-half workflow — closing Look Drawer, dragging Are.na moodboard card, hovering B&W-to-color IG strip, and verifying email CTA', async ({ page }) => {
    await page.goto('/');
    const card09 = page.getByTestId('look-card-09');
    await card09.scrollIntoViewIfNeeded();
    await card09.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await page.getByTestId('drawer-close-btn').click();
    await expect(drawer).toBeHidden();

    const moodCard = page.locator('[data-testid^="moodboard-card-"]').first();
    await dragElementBy(page, moodCard, 40, 20);

    const igItem = page.locator('[data-testid^="ig-strip-item-"]').first();
    await igItem.scrollIntoViewIfNeeded();
    await igItem.hover();
    expect(await hasActiveGrayscaleFilter(igItem)).toBe(false);

    const emailLink = page.getByTestId('footer-link-email');
    await expect(emailLink).toHaveAttribute('href', /mailto:gandraisaque@hotmail\.com/i);
  });
});
