import { test, expect } from '@playwright/test';
import {
  DESIGN_TOKENS,
  NAV_CELLS,
  HERO_STICKERS,
  STAGE_ROWS,
  CANONICAL_LOOKS,
  assertZeroBorderRadius,
  assertNoBackdropBlur,
  assertNoHorizontalOverflow,
  isHardDropShadow,
  dragElementBy,
  hasActiveGrayscaleFilter,
} from './helpers';

test.describe('Tier 4 — Real-World User Persona & End-to-End Scenarios (S01–S12)', () => {
  test('S01: Casa de Criadores (CDC) Curator full portfolio walkthrough & Look 01–10 audit', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Sticky Header indices (01)-(06) from original CDC dossier
    for (const cell of NAV_CELLS) {
      const loc = page.getByTestId(cell.testId);
      await expect(loc).toBeVisible();
      const raw = (await loc.textContent())?.replace(/\s+/g, '') || '';
      expect(raw).toContain(cell.rawText);
    }

    // 2. Navigate to PROPOSTADEDESFILE(05) and audit all 10 GANJA STAR looks
    await page.getByTestId('nav-cell-05').click();
    await expect(page.getByTestId('section-desfile-05')).toBeVisible();

    for (const look of CANONICAL_LOOKS) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      const text = await card.textContent();
      expect(text).toMatch(look.titlePattern);
    }

    // 3. Verify Look 03 (80% CONCLUIDO) and Look 04 (95% CONCLUIDO) WIP transparency
    await expect(page.getByTestId('wip-badge-look-03')).toContainText('80% CONCLUIDO');
    await expect(page.getByTestId('wip-badge-look-04')).toContainText('95% CONCLUIDO');
  });

  test('S02: 1-of-1 Upcycling Collector inspecting Look 06, opening Technical Drawer, inspecting macro zoom & material sheet, and verifying consultation CTA', async ({ page }) => {
    await page.goto('/');

    // 1. Navigate to Dual Architecture and inspect Lado A (1/1 Upcycling)
    await page.getByTestId('nav-cell-04').click();
    const sideA = page.getByTestId('dual-side-upcycling');
    await sideA.hover();
    await expect(sideA).toContainText(/couro|pel[úu]cia/i);

    // 2. Scroll to Look 06 and verify Custom Studio Crosshair Cursor material tag
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    await expect(card06).toHaveAttribute('data-view-mode', 'macro');
    await expect(page.getByTestId('custom-cursor-label')).toContainText('[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]');

    // 3. Open Technical Inspection Drawer (Marine Serre "Education Before Consumerism")
    await card06.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId('drawer-look-title')).toContainText(/retalhos de couro e pel[úu]cia/i);

    // 4. Inspect Macro Texture Zoom and Material Spec Sheet
    const macroZoom = page.getByTestId('drawer-macro-zoom');
    await expect(macroZoom).toBeVisible();
    await macroZoom.click();

    const specSheet = page.getByTestId('drawer-material-sheet');
    await expect(specSheet).toContainText(/couro|pel[úu]cia/i);

    // 5. Verify Direct Consultation/Order CTA
    const cta = page.getByTestId('drawer-inquiry-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /mailto:gandraisaque@hotmail\.com|instagram\.com\/ganjastudio\.br/i);
  });

  test('S03: International Stage Producer verifying Kendrick Lamar, Anitta, Marina Sena (Fenômeno Natural Rock in Rio), and Pedro Sampaio stage credentials in Section 03 (#0D0D0D)', async ({ page }) => {
    await page.goto('/');

    // 1. Preview ATUAÇÃODAMARCA(03) in Sticky Header Rollover and jump to Section 03
    const nav03 = page.getByTestId('nav-cell-03');
    await nav03.hover();
    await expect(page.getByTestId('nav-rollover-preview')).toContainText('(03)');
    await nav03.click();

    const sec03 = page.getByTestId('section-atuacao-03');
    await expect(sec03).toBeVisible();
    const bg = await sec03.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe(DESIGN_TOKENS.surfaceStageRgb);

    // 2. Verify styling trajectory context (Rock in Rio, Fenômeno Natural, Mariana Cavanellas, Clara Tannure)
    await expect(sec03).toContainText(/Fen[ôo]meno Natural/i);
    await expect(sec03).toContainText(/Rock in Rio/i);
    await expect(sec03).toContainText(/Mariana Cavanellas/i);
    await expect(sec03).toContainText(/Clara Tannure/i);

    // 3. Hover all 4 monumental artist rows and inspect floating Stage Rollover Previews
    for (const row of STAGE_ROWS) {
      const loc = page.getByTestId(row.testId);
      await loc.scrollIntoViewIfNeeded();
      await loc.hover();
      const preview = page.getByTestId('stage-rollover-preview');
      await expect(preview).toBeVisible();
      await expect(preview).toContainText(row.artistPattern);
    }
  });

  test('S04: Fashion Design Researcher (UFMG / Senai) studying origin manifesto, demographic specs, kinetic typography, and rearranging the Are.na light-table moodboard', async ({ page }) => {
    await page.goto('/');

    // 1. Jump to DEONDEVEIO?(01) and verify UFMG + Senai reverse garment engineering thesis
    await page.getByTestId('nav-cell-01').click();
    const sec01 = page.getByTestId('section-origem-01');
    await expect(sec01).toContainText('2022');
    await expect(sec01).toContainText('UFMG');
    await expect(sec01).toContainText('Senai');
    await expect(sec01).toContainText(/engenharia reversa/i);

    // 2. Verify kinetic typography & continuous marquee
    await expect(page.getByTestId('kinetic-title-origem')).toBeVisible();
    await expect(page.getByTestId('kinetic-marquee')).toBeVisible();

    // 3. Verify PUBLICOALVO(02) technical demographic frame
    const demoFrame = page.getByTestId('demographic-frame');
    await expect(demoFrame).toContainText('IDADE: 18-35 ANOS');
    await expect(demoFrame).toContainText('PÚBLICO: JOVEM, URBANO E UNDERGROUND');
    await expect(demoFrame).toContainText('LOCAL: DE SÃO PAULO PARA O MUNDO');

    // 4. Scroll to Are.na Moodboard in Section 05 and rearrange research cutouts on the digital light table
    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);

    const dragRes = await dragElementBy(page, cards.first(), 65, 40);
    expect(Math.abs(dragRes.deltaX) > 10 || Math.abs(dragRes.deltaY) > 10 || dragRes.beforeTransform !== dragRes.afterTransform).toBe(true);
  });

  test('S05: São Paulo Underground Streetwear Enthusiast interacting with all 5 Hero SVG urban stickers and verifying Vinyl Sticker Gloss physics', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('section-hero-00');
    await expect(hero).toBeVisible();
    await expect(page.getByTestId('brand-mark-svg')).toBeVisible();

    // Drag and inspect each of the 5 urban stickers
    const offsets = [
      { dx: 50, dy: 30 },
      { dx: -40, dy: 35 },
      { dx: 45, dy: -30 },
      { dx: -55, dy: -25 },
      { dx: 30, dy: 45 },
    ];

    for (let i = 0; i < HERO_STICKERS.length; i++) {
      const stickerContract = HERO_STICKERS[i];
      const loc = page.getByTestId(stickerContract.testId);
      await expect(loc).toBeVisible();
      await expect(loc).toContainText(stickerContract.textPattern);
      await expect(loc.getByTestId('sticker-gloss-layer')).toBeAttached();
      await assertNoBackdropBlur(loc);

      const res = await dragElementBy(page, loc, offsets[i].dx, offsets[i].dy);
      expect(Math.abs(res.deltaX) > 10 || Math.abs(res.deltaY) > 10 || res.beforeTransform !== res.afterTransform).toBe(true);
    }
  });

  test('S06: Commercial Streetwear Buyer comparing Peças Únicas vs Pequena Escala in Section 04 and inspecting Camiseta Ozempic (Look 02), Moletom Legalize Já (Look 05), and Puffer/Cargo (Look 10)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // 1. Expand Lado B (Pequena Escala) in Section 04
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideB.scrollIntoViewIfNeeded();
    await sideB.hover();
    await page.waitForTimeout(50);
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(boxB!.width).toBeGreaterThan(boxA!.width);

    // 2. Inspect Look 02 (Camiseta Ozempic), Look 05 (Moletom Legalize Já), and Look 10 (Jaqueta Puffer + Bermuda Cargo + Boné)
    for (const target of [
      { testId: 'look-card-02', pattern: /Ozempic/i },
      { testId: 'look-card-05', pattern: /Moletom Legalize J[áa]/i },
      { testId: 'look-card-10', pattern: /Jaqueta Puffer/i },
    ]) {
      const card = page.getByTestId(target.testId);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await expect(card).toHaveAttribute('data-view-mode', 'macro');
      await card.click();

      const drawer = page.getByTestId('look-technical-drawer');
      await expect(drawer).toBeVisible();
      await expect(page.getByTestId('drawer-look-title')).toContainText(target.pattern);
      await expect(page.getByTestId('drawer-progress-bar')).toContainText('100%');
      await page.getByTestId('drawer-close-btn').click();
      await expect(drawer).toBeHidden();
    }
  });

  test('S07: "Ateliê Vivo" Work-in-Progress Auditor verifying LOOK 03 (80% CONCLUIDO) and LOOK 04 (95% CONCLUIDO) vs completed 100% looks across grid badges and Technical Drawer', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-05').click();

    // 1. Verify Look 03 (80% CONCLUIDO) in grid and drawer
    const badge03 = page.getByTestId('wip-badge-look-03');
    await badge03.scrollIntoViewIfNeeded();
    await expect(badge03).toBeVisible();
    await expect(badge03).toContainText('80% CONCLUIDO');

    await page.getByTestId('look-card-03').click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('80%');
    await page.getByTestId('drawer-close-btn').click();

    // 2. Verify Look 04 (95% CONCLUIDO) in grid and drawer
    const badge04 = page.getByTestId('wip-badge-look-04');
    await expect(badge04).toBeVisible();
    await expect(badge04).toContainText('95% CONCLUIDO');

    await page.getByTestId('look-card-04').click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('95%');
    await page.getByTestId('drawer-close-btn').click();

    // 3. Verify Look 01 (100% completed) in drawer
    await page.getByTestId('look-card-01').click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('100%');
    await page.getByTestId('drawer-close-btn').click();
  });

  test('S08: Mobile Underground Visitor (375x812 viewport) navigating the entire platform from Hero to Footer with zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);

    // 1. Verify Hero and Sticky Header on mobile
    await expect(page.getByTestId('sticky-header')).toBeVisible();
    await expect(page.getByTestId('section-hero-00')).toBeVisible();

    // 2. Scroll through Origin, Stage Proof, Dual Architecture, Lookbook, and Footer checking overflow at each stop
    for (const secId of [
      'section-origem-01',
      'section-atuacao-03',
      'section-frentes-04',
      'section-desfile-05',
      'section-contato-06',
    ]) {
      const sec = page.getByTestId(secId);
      await sec.scrollIntoViewIfNeeded();
      await expect(sec).toBeVisible();
      await assertNoHorizontalOverflow(page);
    }

    // 3. Open and close Technical Drawer on mobile
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.getByTestId('drawer-close-btn').click();
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();
  });

  test('S09: Awwwards Brutalist Jury Member auditing anti-patterns (0px border-radius, none backdrop-filter, 1px solid #111111 grid, 4px hard shadows, dry 0ms transitions)', async ({ page }) => {
    await page.goto('/');

    // 1. Audit zero Liquid Glass (backdrop-filter: blur) across entire DOM
    const blurCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter((el) => {
        const s = window.getComputedStyle(el);
        return (s.backdropFilter || '').toLowerCase().includes('blur(');
      }).length;
    });
    expect(blurCount).toBe(0);

    // 2. Audit 0px border-radius across all key containers
    for (const tid of [
      'sticky-header',
      'nav-cell-brand',
      'nav-cell-01',
      'demographic-frame',
      'look-card-01',
      'look-card-06',
      'arena-moodboard',
      'creator-catalog-card',
      'brutalist-footer',
    ]) {
      await assertZeroBorderRadius(page.getByTestId(tid));
    }

    // 3. Audit hard 4px 4px 0px #111111 drop shadows
    const stickerShadow = await page.getByTestId('draggable-sticker-sticker-gsh-2168').evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(isHardDropShadow(stickerShadow)).toBe(true);

    // 4. Audit dry 0s/0ms transition duration on interactive elements
    const navTransition = await page.getByTestId('nav-cell-01').evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(navTransition);
  });

  test('S10: Stylist & Press Contact Reviewer inspecting Isaque Gandra catalog card, hovering B&W-to-color @ganjastudio.br strip, and verifying direct contact links', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-06').click();

    // 1. Inspect Creator Catalog Card (ficha catalográfica)
    const creatorCard = page.getByTestId('creator-catalog-card');
    await expect(creatorCard).toBeVisible();
    await expect(creatorCard).toContainText('Isaque Gandra');
    await expect(creatorCard).toContainText('30');
    await expect(creatorCard).toContainText('UFMG');
    await expect(creatorCard).toContainText('Senai');

    // 2. Hover B&W-to-color Instagram Contact Strip
    const igItems = page.locator('[data-testid^="ig-strip-item-"]');
    const firstIg = igItems.first();
    await firstIg.scrollIntoViewIfNeeded();
    await page.mouse.move(10, 10);
    expect(await hasActiveGrayscaleFilter(firstIg)).toBe(true);
    await firstIg.hover();
    expect(await hasActiveGrayscaleFilter(firstIg)).toBe(false);

    // 3. Verify Monumental Brutalist Footer links
    const footer = page.getByTestId('brutalist-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('footer-link-ganjastudio')).toHaveAttribute('href', /instagram\.com\/ganjastudio\.br/i);
    await expect(page.getByTestId('footer-link-isaquex')).toHaveAttribute('href', /instagram\.com\/isaquex/i);
    await expect(page.getByTestId('footer-link-email')).toHaveAttribute('href', /mailto:gandraisaque@hotmail\.com/i);
  });

  test('S11: Keyboard & Accessibility Navigator using Sticky Header links, opening multiple Look drawers in sequence, and dismissing via Escape key and close button', async ({ page }) => {
    await page.goto('/');

    // 1. Navigate across sections via Sticky Header cells
    for (const cell of NAV_CELLS.slice(1)) {
      const navLoc = page.getByTestId(cell.testId);
      await navLoc.focus();
      await navLoc.click();
      await expect(page.getByTestId(cell.sectionTestId)).toBeVisible();
    }

    // 2. Open Look 01 Drawer and dismiss with Escape key
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();

    // 3. Open Look 08 Drawer and dismiss with close button
    const card08 = page.getByTestId('look-card-08');
    await card08.scrollIntoViewIfNeeded();
    await card08.click();
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId('drawer-look-title')).toContainText(/Vestido/i);
    await page.getByTestId('drawer-close-btn').click();
    await expect(drawer).toBeHidden();
  });

  test('S12: Full-Cycle Brand Immersion Journey combining Sticky Header Rollover, Hero Sticker Dragging, Stage Proof Rollover, Dual Split Expansion, Lookbook Macro Swap, Drawer Inspection, Moodboard Dragging, and Footer Contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Step 1: Sticky Header Rollover Preview
    await page.getByTestId('nav-cell-01').hover();
    await expect(page.getByTestId('nav-rollover-preview')).toBeVisible();
    await page.mouse.move(600, 500);

    // Step 2: Hero Sticker Dragging
    await dragElementBy(page, page.getByTestId('draggable-sticker-sticker-ganja-star'), 45, 30);

    // Step 3: Stage Proof Rollover in Section 03
    const rowMarina = page.getByTestId('stage-row-marina-sena');
    await rowMarina.scrollIntoViewIfNeeded();
    await rowMarina.hover();
    await expect(page.getByTestId('stage-rollover-preview')).toContainText(/Marina Sena/i);

    // Step 4: Dual Creation Split Expansion in Section 04
    const sideUpcycling = page.getByTestId('dual-side-upcycling');
    await sideUpcycling.scrollIntoViewIfNeeded();
    await sideUpcycling.hover();
    await page.waitForTimeout(50);
    const boxUp = await sideUpcycling.boundingBox();
    const boxScale = await page.getByTestId('dual-side-pequena-escala').boundingBox();
    expect(boxUp!.width).toBeGreaterThan(boxScale!.width);

    // Step 5: Lookbook Macro Swap + Custom Cursor + Technical Drawer in Section 05
    const card07 = page.getByTestId('look-card-07');
    await card07.scrollIntoViewIfNeeded();
    await card07.hover();
    await expect(card07).toHaveAttribute('data-view-mode', 'macro');
    await expect(page.getByTestId('custom-cursor-label')).toContainText('LOOK 07');
    await card07.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();

    // Step 6: Are.na Process Moodboard Dragging
    const moodCard = page.locator('[data-testid^="moodboard-card-"]').first();
    await dragElementBy(page, moodCard, 55, 25);

    // Step 7: Section 06 Instagram Contact Strip & Footer verification
    const igItem = page.locator('[data-testid^="ig-strip-item-"]').first();
    await igItem.scrollIntoViewIfNeeded();
    await igItem.hover();
    expect(await hasActiveGrayscaleFilter(igItem)).toBe(false);
    await expect(page.getByTestId('footer-link-ganjastudio')).toBeVisible();
  });
});
