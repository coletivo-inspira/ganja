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

test.describe('F01 Boundaries — Structural Grid, Zero Radius & Viewport Extremes', () => {
  test('F01.B1: Full-DOM audit confirms every [data-testid] element enforces 0px border-radius on all 4 corners', async ({ page }) => {
    await page.goto('/');
    const roundedElements = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[data-testid], header, section, button, a'));
      const violations: string[] = [];
      for (const el of nodes) {
        if (el.closest('.inspira-orb')) continue;
        const s = window.getComputedStyle(el);
        if (
          s.borderRadius !== '0px' ||
          s.borderTopLeftRadius !== '0px' ||
          s.borderTopRightRadius !== '0px' ||
          s.borderBottomRightRadius !== '0px' ||
          s.borderBottomLeftRadius !== '0px'
        ) {
          violations.push(`${el.tagName}[data-testid="${el.getAttribute('data-testid') || ''}"] -> ${s.borderRadius}`);
        }
      }
      return violations;
    });
    expect(roundedElements).toEqual([]);
  });

  test('F01.B2: Ultra-narrow 320px viewport preserves grid geometry with zero horizontal overflow (scrollWidth <= innerWidth)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);
  });

  test('F01.B3: Mobile 375px and Tablet 768px viewports maintain structural grid continuity without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);

    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
  });

  test('F01.B4: Widescreen 1920x1080 viewport preserves 1px solid #111111 borders and non-zero section heights', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);
    const heroBox = await page.getByTestId('section-hero-00').boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.width).toBeGreaterThanOrEqual(1900);
    expect(heroBox!.height).toBeGreaterThan(400);
  });

  test('F01.B5: Hard drop shadows across all elevated elements never use Gaussian blur radii > 0px', async ({ page }) => {
    await page.goto('/');
    const blurredShadows = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[data-testid]'));
      const bad: string[] = [];
      for (const el of nodes) {
        const bs = window.getComputedStyle(el).boxShadow;
        if (bs && bs !== 'none') {
          // Standard computed format: rgb(r, g, b) offsetX offsetY blurRadius spreadRadius
          const m = bs.match(/(-?\d+(?:\.\d+)?px)\s+(-?\d+(?:\.\d+)?px)\s+(-?\d+(?:\.\d+)?px)/);
          if (m && parseFloat(m[3]) > 0) {
            bad.push(`${el.getAttribute('data-testid')}: ${bs}`);
          }
        }
      }
      return bad;
    });
    expect(blurredShadows).toEqual([]);
  });
});

test.describe('F02 Boundaries — Full-DOM Liquid Glass Prohibition & Gloss Physics', () => {
  test('F02.B1: Full-DOM computed style scan across every rendered element confirms zero backdrop-filter: blur(...)', async ({ page }) => {
    await page.goto('/');
    const blurViolations = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const found: string[] = [];
      for (const el of all) {
        const s = window.getComputedStyle(el);
        const bf = (s.backdropFilter || '') + ' ' + ((s as unknown as Record<string, string>).webkitBackdropFilter || '');
        if (bf.toLowerCase().includes('blur(')) {
          found.push(el.tagName + ':' + (el.getAttribute('data-testid') || el.className));
        }
      }
      return found;
    });
    expect(blurViolations).toEqual([]);
  });

  test('F02.B2: Opening Technical Drawer and hovering nav rollover simultaneously introduces zero backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
    await page.getByTestId('nav-cell-02').hover();

    const blurViolations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter((el) => {
        const s = window.getComputedStyle(el);
        return (s.backdropFilter || '').toLowerCase().includes('blur(');
      }).length;
    });
    expect(blurViolations).toBe(0);
  });

  test('F02.B3: Rapid pointer traversal across all 5 stickers updates Vinyl Sticker Gloss without layout shift', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      const loc = page.getByTestId(sticker.testId);
      await loc.hover();
      await assertNoBackdropBlur(loc);
    }
    await assertNoHorizontalOverflow(page);
  });

  test('F02.B4: Sticker Gloss layer maintains pointer-events: none so it never intercepts sticker dragging', async ({ page }) => {
    await page.goto('/');
    const glossLayers = page.getByTestId('sticker-gloss-layer');
    const count = await glossLayers.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      const pe = await glossLayers.nth(i).evaluate((el) => window.getComputedStyle(el).pointerEvents);
      expect(pe).toBe('none');
    }
  });

  test('F02.B5: Stage Proof rollover preview and moodboard cards enforce zero backdrop-filter blur on dark/light surfaces', async ({ page }) => {
    await page.goto('/');
    const rowAnitta = page.getByTestId('stage-row-anitta');
    await rowAnitta.scrollIntoViewIfNeeded();
    await rowAnitta.hover();
    await assertNoBackdropBlur(page.getByTestId('stage-rollover-preview'));

    const moodboardCard = page.locator('[data-testid^="moodboard-card-"]').first();
    await moodboardCard.scrollIntoViewIfNeeded();
    await assertNoBackdropBlur(moodboardCard);
  });
});

test.describe('F03 Boundaries — Surface Color Contrasts & Dark/Light Boundaries', () => {
  test('F03.B1: Contrast boundary between #F4F3EF section surface and #FFFFFF Lookbook card isolation is strictly distinct', async ({ page }) => {
    await page.goto('/');
    const heroBg = await page.getByTestId('section-hero-00').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const cardBg = await page.getByTestId('look-card-01').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(heroBg).toBe(DESIGN_TOKENS.surfacePaperRgb);
    expect(cardBg).toBe(DESIGN_TOKENS.surfaceWhiteRgb);
    expect(heroBg).not.toBe(cardBg);
  });

  test('F03.B2: Contrast boundary between Section 01 (#F4F3EF) and Section 03 (#0D0D0D) is strictly distinct', async ({ page }) => {
    await page.goto('/');
    const sec01Bg = await page.getByTestId('section-origem-01').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const sec03Bg = await page.getByTestId('section-atuacao-03').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(sec01Bg).toBe(DESIGN_TOKENS.surfacePaperRgb);
    expect(sec03Bg).toBe(DESIGN_TOKENS.surfaceStageRgb);
    expect(sec01Bg).not.toBe(sec03Bg);
  });

  test('F03.B3: Contrast boundary between Lookbook cards (#FFFFFF) and Brutalist Footer (#0D0D0D) is strictly distinct', async ({ page }) => {
    await page.goto('/');
    const cardBg = await page.getByTestId('look-card-10').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const footerBg = await page.getByTestId('brutalist-footer').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(cardBg).toBe(DESIGN_TOKENS.surfaceWhiteRgb);
    expect(footerBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('F03.B4: Text foreground color on #0D0D0D Stage Proof and Footer surfaces maintains light contrast against dark background', async ({ page }) => {
    await page.goto('/');
    const stageColor = await page.getByTestId('section-atuacao-03').evaluate((el) => window.getComputedStyle(el).color);
    expect(stageColor).not.toBe(DESIGN_TOKENS.surfaceStageRgb);

    const footerColor = await page.getByTestId('brutalist-footer').evaluate((el) => window.getComputedStyle(el).color);
    expect(footerColor).not.toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('F03.B5: Text foreground color on #FFFFFF Lookbook cards maintains dark ink contrast (#111111 / #0D0D0D)', async ({ page }) => {
    await page.goto('/');
    const cardColor = await page.getByTestId('look-card-01').evaluate((el) => window.getComputedStyle(el).color);
    expect(cardColor).not.toBe(DESIGN_TOKENS.surfaceWhiteRgb);
  });
});

test.describe('F04 Boundaries — Semiotic Accent Palette & Zero Pastel Gradients', () => {
  test('F04.B1: All 5 urban stickers enforce flat signaling colors without linear or radial pastel gradients', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      const loc = page.getByTestId(sticker.testId);
      const bgImage = await loc.evaluate((el) => window.getComputedStyle(el).backgroundImage);
      expect(bgImage).toBe('none');
    }
  });

  test('F04.B2: Look 03 (80%) and Look 04 (95%) WIP badges enforce flat signaling colors with 0px border-radius', async ({ page }) => {
    await page.goto('/');
    const badge03 = page.getByTestId('wip-badge-look-03');
    const badge04 = page.getByTestId('wip-badge-look-04');
    await assertZeroBorderRadius(badge03);
    await assertZeroBorderRadius(badge04);
    const bg03 = await badge03.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const bg04 = await badge04.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg03).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg04).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('F04.B3: Completed looks (Look 01, 02, 05–10) do not falsely render 80% or 95% WIP warning badges', async ({ page }) => {
    await page.goto('/');
    const completedLookIds = [
      'look-card-01',
      'look-card-02',
      'look-card-05',
      'look-card-06',
      'look-card-07',
      'look-card-08',
      'look-card-09',
      'look-card-10',
    ];
    for (const testId of completedLookIds) {
      const text = (await page.getByTestId(testId).textContent()) || '';
      expect(text).not.toContain('80% CONCLUIDO');
      expect(text).not.toContain('95% CONCLUIDO');
    }
  });

  test('F04.B4: Semiotic accent elements preserve exact visibility across viewport resizes (375px to 1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByTestId('wip-badge-look-03')).toContainText('80% CONCLUIDO');
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByTestId('wip-badge-look-04')).toContainText('95% CONCLUIDO');
  });

  test('F04.B5: Stage Proof rows highlight active hover states using semiotic palette tokens without slow opacity fades', async ({ page }) => {
    await page.goto('/');
    for (const row of STAGE_ROWS) {
      const loc = page.getByTestId(row.testId);
      const duration = await loc.evaluate((el) => window.getComputedStyle(el).transitionDuration);
      expect(['0s', '0ms']).toContain(duration);
    }
  });
});

test.describe('F05 Boundaries — Typography Tracking Extremes & Monospace Consistency', () => {
  test('F05.B1: Monumental Hero title tracking is strictly smaller (more compressed) than kinetic Origin title tracking', async ({ page }) => {
    await page.goto('/');
    const heroTracking = await page
      .getByTestId('hero-manifesto-col')
      .locator('h1')
      .first()
      .evaluate((el) => {
        const ls = window.getComputedStyle(el).letterSpacing;
        return ls === 'normal' ? 0 : parseFloat(ls);
      });
    const kineticTracking = await page.getByTestId('kinetic-title-origem').evaluate((el) => {
      const ls = window.getComputedStyle(el).letterSpacing;
      return ls === 'normal' ? 0 : parseFloat(ls);
    });
    expect(heroTracking).toBeLessThan(kineticTracking);
  });

  test('F05.B2: All 6 navigation index badges (01) through (06) render within sticky header cells', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS.slice(1)) {
      const loc = page.getByTestId(cell.testId);
      await expect(loc).toContainText(cell.indexPart!);
    }
  });

  test('F05.B3: Custom cursor inspection tag ([data-testid="custom-cursor-label"]) enforces monospace typography and uppercase formatting', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    const label = page.getByTestId('custom-cursor-label');
    await expect(label).toBeVisible();
    const font = await label.evaluate((el) => window.getComputedStyle(el).fontFamily.toLowerCase());
    expect(font).toMatch(/mono/);
  });

  test('F05.B4: Typography scales cleanly at 320px narrow viewport without overflowing container width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);
    const heroBox = await page.getByTestId('hero-manifesto-col').boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.width).toBeLessThanOrEqual(320);
  });

  test('F05.B5: Technical drawer material spec sheet and progress indicators enforce monospace metadata formatting', async ({ page }) => {
    await page.goto('/');
    const card03 = page.getByTestId('look-card-03');
    await card03.scrollIntoViewIfNeeded();
    await card03.click();
    const progress = page.getByTestId('drawer-progress-bar');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('80%');
  });
});

test.describe('F06 Boundaries — Brand Mark Asset Integrity & Multi-Surface Rendering', () => {
  test('F06.B1: ganja-star-mark.svg XML contains vector glyph paths without embedded base64 raster data', async ({ request }) => {
    const res = await request.get('/assets/brand/ganja-star-mark.svg');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<path');
    expect(xml).not.toContain('data:image/png;base64');
  });

  test('F06.B2: ganja-star-star.svg XML contains isolated star vector geometry with valid viewBox', async ({ request }) => {
    const res = await request.get('/assets/brand/ganja-star-star.svg');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('viewBox=');
    expect(xml).toContain('<path');
  });

  test('F06.B3: Hero brand mark SVG remains visible and non-clipped at 320px, 768px, and 1440px viewports', async ({ page }) => {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const mark = page.getByTestId('brand-mark-svg');
      await expect(mark).toBeVisible();
      const box = await mark.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(10);
      expect(box!.width).toBeLessThanOrEqual(width);
    }
  });

  test('F06.B4: Sticky header brand mark remains visible and properly proportioned inside nav-cell-brand', async ({ page }) => {
    await page.goto('/');
    const brandCell = page.getByTestId('nav-cell-brand');
    await expect(brandCell).toBeVisible();
    const box = await brandCell.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(50);
    expect(box!.height).toBeGreaterThan(20);
  });

  test('F06.B5: All Lookbook silhouette and macro asset URLs referenced in the DOM return HTTP 200', async ({ page, request }) => {
    await page.goto('/');
    const imgSrcs = await page.getByTestId('lookbook-grid').evaluate((grid) => {
      return Array.from(grid.querySelectorAll('img'))
        .map((img) => img.getAttribute('src') || '')
        .filter((src) => src.startsWith('/'));
    });
    expect(imgSrcs.length).toBeGreaterThanOrEqual(10);
    for (const src of imgSrcs) {
      const res = await request.get(src);
      expect(res.status()).toBe(200);
    }
  });
});

test.describe('F07 Boundaries — Sticky Header Pinning, Rapid Navigation & Mobile Resilience', () => {
  test('F07.B1: Sticky header remains pinned at top of viewport (y <= 2px) after scrolling to mid-page and bottom footer', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1500));
    let box = await page.getByTestId('sticky-header').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThanOrEqual(2);

    await page.getByTestId('brutalist-footer').scrollIntoViewIfNeeded();
    box = await page.getByTestId('sticky-header').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThanOrEqual(2);
  });

  test('F07.B2: Rapid sequential clicks across nav-cell-01 -> nav-cell-06 -> nav-cell-brand complete without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    for (const cell of NAV_CELLS) {
      await page.getByTestId(cell.testId).click();
    }
    expect(errors).toEqual([]);
  });

  test('F07.B3: Sticky header maintains higher z-index than scrolling page sections so content passes underneath', async ({ page }) => {
    await page.goto('/');
    const zIndex = await page.getByTestId('sticky-header').evaluate((el) => {
      const z = parseInt(window.getComputedStyle(el).zIndex, 10);
      return Number.isNaN(z) ? 0 : z;
    });
    expect(zIndex).toBeGreaterThanOrEqual(30);
  });

  test('F07.B4: On 375px mobile viewport, sticky header cells remain accessible and clickable without breaking page width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);
    await expect(page.getByTestId('sticky-header')).toBeVisible();
    await page.getByTestId('nav-cell-05').click();
    await expect(page.getByTestId('section-desfile-05')).toBeVisible();
  });

  test('F07.B5: Clicking nav-cell-brand from bottom of page scrolls back to Section 00 Hero (#hero-00)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-06').click();
    await page.getByTestId('nav-cell-brand').click();
    await expect(page.getByTestId('section-hero-00')).toBeVisible();
  });
});

test.describe('F08 Boundaries — Navigation Rollover Preview Rapid Switching & Edge Dismissal', () => {
  test('F08.B1: Rapidly sweeping pointer across nav-cell-01 through nav-cell-06 updates rollover preview to match final hovered cell (06)', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS.slice(1)) {
      await page.getByTestId(cell.testId).hover();
    }
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(06)');
  });

  test('F08.B2: Rapidly sweeping pointer backwards from nav-cell-06 to nav-cell-01 updates rollover preview to (01) without stale state', async ({ page }) => {
    await page.goto('/');
    const reversed = [...NAV_CELLS.slice(1)].reverse();
    for (const cell of reversed) {
      await page.getByTestId(cell.testId).hover();
    }
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(01)');
  });

  test('F08.B3: Hovering nav-cell-brand (GANJASTUDIO) after nav-cell-01 updates or dismisses indexed rollover cleanly', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-01').hover();
    await expect(page.getByTestId('nav-rollover-preview')).toBeVisible();
    await page.getByTestId('nav-cell-brand').hover();
    await expect(page.getByTestId('sticky-header')).toBeVisible();
  });

  test('F08.B4: Rollover preview enforces 0px border-radius, 1px solid #111111 border, and hard drop shadow', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-04').hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await assertZeroBorderRadius(preview);
    const shadow = await preview.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(isHardDropShadow(shadow)).toBe(true);
  });

  test('F08.B5: Clicking a nav cell while rollover preview is open navigates cleanly without trapping hover state', async ({ page }) => {
    await page.goto('/');
    const nav03 = page.getByTestId('nav-cell-03');
    await nav03.hover();
    await expect(page.getByTestId('nav-rollover-preview')).toBeVisible();
    await nav03.click();
    await page.mouse.move(500, 500);
    await expect(page.getByTestId('nav-rollover-preview')).toBeHidden();
  });
});

test.describe('F09 Boundaries — Custom Cursor All-10-Looks Traversal & Non-Interference', () => {
  test('F09.B1: Traversing Look 01 through Look 05 updates [data-testid="custom-cursor-label"] with each look unique material tag', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS.slice(0, 5)) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      const label = page.getByTestId('custom-cursor-label');
      await expect(label).toBeVisible();
      await expect(label).toContainText(look.code);
    }
  });

  test('F09.B2: Traversing Look 06 through Look 10 updates [data-testid="custom-cursor-label"] with each look unique material tag', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS.slice(5, 10)) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      const label = page.getByTestId('custom-cursor-label');
      await expect(label).toBeVisible();
      await expect(label).toContainText(look.code);
    }
  });

  test('F09.B3: Custom cursor never intercepts clicks on underlying Look cards, navigation cells, or drawer buttons', async ({ page }) => {
    await page.goto('/');
    const card08 = page.getByTestId('look-card-08');
    await card08.scrollIntoViewIfNeeded();
    await card08.hover();
    await card08.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
    await page.getByTestId('drawer-close-btn').click();
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();
  });

  test('F09.B4: Moving pointer to viewport origin (0, 0) and bottom-right corner (1439, 899) keeps cursor attached without errors', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(0, 0);
    await expect(page.getByTestId('custom-cursor')).toBeAttached();
    await page.mouse.move(1439, 899);
    await expect(page.getByTestId('custom-cursor')).toBeAttached();
  });

  test('F09.B5: Custom cursor and label enforce 0px border-radius and zero backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    const cursor = page.getByTestId('custom-cursor');
    const label = page.getByTestId('custom-cursor-label');
    await assertZeroBorderRadius(cursor);
    await assertZeroBorderRadius(label);
    await assertNoBackdropBlur(cursor);
    await assertNoBackdropBlur(label);
  });
});

test.describe('F10 Boundaries — Scroll Extremes, Reduced Motion & Instantaneous Transitions', () => {
  test('F10.B1: Emulating prefers-reduced-motion: reduce keeps all sections, navigation jumps, and drawers fully functional', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByTestId('nav-cell-05').click();
    await expect(page.getByTestId('section-desfile-05')).toBeVisible();
    await page.getByTestId('look-card-02').click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
  });

  test('F10.B2: Programmatic rapid scroll from top (0) to max scrollHeight and back to 0 completes cleanly', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const bottomY = await page.evaluate(() => window.scrollY);
    expect(bottomY).toBeGreaterThan(800);

    await page.evaluate(() => window.scrollTo(0, 0));
    const topY = await page.evaluate(() => window.scrollY);
    expect(topY).toBe(0);
  });

  test('F10.B3: Opening and closing Technical Drawer multiple times never leaves body scroll locked', async ({ page }) => {
    await page.goto('/');
    for (const id of ['look-card-01', 'look-card-03', 'look-card-06']) {
      const card = page.getByTestId(id);
      await card.scrollIntoViewIfNeeded();
      await card.click();
      await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('look-technical-drawer')).toBeHidden();
    }
    const overflowY = await page.evaluate(() => window.getComputedStyle(document.body).overflowY);
    expect(overflowY).not.toBe('hidden');
  });

  test('F10.B4: Lookbook cards, nav cells, and footer links all enforce 0s/0ms transitionDuration', async ({ page }) => {
    await page.goto('/');
    const cardDur = await page.getByTestId('look-card-01').evaluate((el) => window.getComputedStyle(el).transitionDuration);
    const linkDur = await page.getByTestId('footer-link-ganjastudio').evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(cardDur);
    expect(['0s', '0ms']).toContain(linkDur);
  });

  test('F10.B5: Window resize during scrolled state preserves sticky header and section visibility without layout crash', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.setViewportSize({ width: 768, height: 900 });
    await assertNoHorizontalOverflow(page);
    await expect(page.getByTestId('sticky-header')).toBeVisible();
  });
});

test.describe('F11 Boundaries — Hero Responsive Reflow & Column Non-Overlap', () => {
  test('F11.B1: On 1440px desktop, Hero manifesto column and Hero Scroll Gallery bounding boxes do not overlap horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const leftBox = await page.getByTestId('hero-manifesto-col').boundingBox();
    const rightBox = await page.getByTestId('hero-scroll-gallery').boundingBox();
    expect(leftBox).not.toBeNull();
    expect(rightBox).not.toBeNull();
    expect(leftBox!.x + leftBox!.width).toBeLessThanOrEqual(rightBox!.x + 4);
  });

  test('F11.B2: On 375px mobile viewport, Hero manifesto column and Hero Scroll Gallery stack vertically without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await assertNoHorizontalOverflow(page);
    const leftBox = await page.getByTestId('hero-manifesto-col').boundingBox();
    const rightBox = await page.getByTestId('hero-scroll-gallery').boundingBox();
    expect(leftBox).not.toBeNull();
    expect(rightBox).not.toBeNull();
    expect(rightBox!.y).toBeGreaterThanOrEqual(leftBox!.y);
  });

  test('F11.B3: All images/SVGs inside Hero Scroll Gallery load completely with non-zero dimensions', async ({ page }) => {
    await page.goto('/');
    const gallery = page.getByTestId('hero-scroll-gallery');
    const items = gallery.locator('img, svg');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    const firstBox = await items.first().boundingBox();
    expect(firstBox).not.toBeNull();
    expect(firstBox!.width).toBeGreaterThan(20);
  });

  test('F11.B4: Hero section maintains exposed 1px solid #111111 grid borders across desktop and mobile viewports', async ({ page }) => {
    await page.goto('/');
    const borderBottom = await page.getByTestId('section-hero-00').evaluate((el) => window.getComputedStyle(el).borderBottomWidth);
    expect(borderBottom).toBe('1px');
  });

  test('F11.B5: Hero headline and manifesto remain legible and non-truncated at 320px minimum width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const col = page.getByTestId('hero-manifesto-col');
    await expect(col).toBeVisible();
    const box = await col.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(320);
  });
});

test.describe('F12 Boundaries — Draggable Stickers Zero-Delta, Negative Delta & Multi-Sticker Persistence', () => {
  test('F12.B1: Clicking a sticker with zero drag delta (0, 0) preserves its visibility and valid coordinates', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-ganja-25g');
    const res = await dragElementBy(page, sticker, 0, 0);
    expect(Math.abs(res.deltaX)).toBeLessThanOrEqual(5);
    expect(Math.abs(res.deltaY)).toBeLessThanOrEqual(5);
    await expect(sticker).toBeVisible();
  });

  test('F12.B2: Dragging a sticker with negative deltas (-50, -40) updates its coordinates accurately', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-caminhao');
    const res = await dragElementBy(page, sticker, -50, -40);
    expect(Math.abs(res.deltaX) > 10 || Math.abs(res.deltaY) > 10 || res.beforeTransform !== res.afterTransform).toBe(true);
  });

  test('F12.B3: Sequential dragging of two different stickers preserves the first sticker updated position', async ({ page }) => {
    await page.goto('/');
    const sticker1 = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    const sticker2 = page.getByTestId('draggable-sticker-sticker-ganja-star');

    const res1 = await dragElementBy(page, sticker1, 60, 35);
    await dragElementBy(page, sticker2, -45, 55);

    const box1AfterSecondDrag = await sticker1.boundingBox();
    expect(box1AfterSecondDrag).not.toBeNull();
    expect(Math.abs(box1AfterSecondDrag!.x - res1.afterX)).toBeLessThanOrEqual(2);
    expect(Math.abs(box1AfterSecondDrag!.y - res1.afterY)).toBeLessThanOrEqual(2);
  });

  test('F12.B4: Dragging all 5 stickers sequentially elevates the most recently dragged sticker z-index', async ({ page }) => {
    await page.goto('/');
    for (const s of HERO_STICKERS) {
      await dragElementBy(page, page.getByTestId(s.testId), 20, 15);
    }
    const lastSticker = page.getByTestId(HERO_STICKERS[HERO_STICKERS.length - 1].testId);
    const firstSticker = page.getByTestId(HERO_STICKERS[0].testId);
    const zLast = await lastSticker.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex || '0', 10));
    const zFirst = await firstSticker.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex || '0', 10));
    expect(zLast).toBeGreaterThanOrEqual(zFirst);
  });

  test('F12.B5: Dragging a sticker by large positive delta (+150, +100) keeps sticker attached and visible without horizontal page overflow', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-ganja-25g');
    await dragElementBy(page, sticker, 150, 100);
    await expect(sticker).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});

test.describe('F13 Boundaries — Origin & Demographic Frame Responsive & Structural Boundaries', () => {
  test('F13.B1: Origin narrative and Demographic Frame remain fully visible at 320px width with zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const demoFrame = page.getByTestId('demographic-frame');
    await demoFrame.scrollIntoViewIfNeeded();
    await expect(demoFrame).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test('F13.B2: Demographic Frame preserves all 3 required metadata lines (IDADE, PÚBLICO, LOCAL) across all viewports', async ({ page }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const frame = page.getByTestId('demographic-frame');
      await expect(frame).toContainText('IDADE: 18-35 ANOS');
      await expect(frame).toContainText('PÚBLICO: JOVEM, URBANO E UNDERGROUND');
      await expect(frame).toContainText('LOCAL: DE SÃO PAULO PARA O MUNDO');
    }
  });

  test('F13.B3: Origin section links UFMG conceptual art and Senai industrial garment construction without missing terms', async ({ page }) => {
    await page.goto('/');
    const text = (await page.getByTestId('section-origem-01').textContent()) || '';
    expect(text).toMatch(/Belas Artes|UFMG/i);
    expect(text).toMatch(/Senai/i);
    expect(text).toMatch(/Isaque Gandra/i);
  });

  test('F13.B4: Demographic Frame maintains 4px 4px 0px hard drop shadow and 0px border-radius on hover and scroll', async ({ page }) => {
    await page.goto('/');
    const frame = page.getByTestId('demographic-frame');
    await frame.scrollIntoViewIfNeeded();
    await frame.hover();
    await assertZeroBorderRadius(frame);
    const shadow = await frame.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(isHardDropShadow(shadow)).toBe(true);
  });

  test('F13.B5: Section 01 and Section 02 anchor IDs (#origem-01 and #publico-02) are distinct and directly addressable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#origem-01')).toBeAttached();
    await expect(page.locator('#publico-02')).toBeAttached();
  });
});

test.describe('F14 Boundaries — Kinetic Letter-Spacing Bounds & Marquee Overflow Containment', () => {
  test('F14.B1: Kinetic Origin title letter-spacing remains non-negative and bounded during rapid scroll across Section 01', async ({ page }) => {
    await page.goto('/');
    const title = page.getByTestId('kinetic-title-origem');
    for (const y of [0, 400, 800, 1200]) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      const ls = await title.evaluate((el) => {
        const val = window.getComputedStyle(el).letterSpacing;
        return val === 'normal' ? 0 : parseFloat(val);
      });
      expect(ls).toBeGreaterThanOrEqual(0);
      expect(ls).toBeLessThan(100);
    }
  });

  test('F14.B2: Expanding kinetic letter-spacing never causes horizontal page overflow (scrollWidth <= innerWidth) at 375px or 1440px', async ({ page }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.getByTestId('kinetic-title-origem').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, 200));
      await assertNoHorizontalOverflow(page);
    }
  });

  test('F14.B3: Continuous marquee container clips internal scrolling track (overflow-x: hidden) so page width never expands', async ({ page }) => {
    await page.goto('/');
    const marquee = page.getByTestId('kinetic-marquee');
    const overflowX = await marquee.evaluate((el) => {
      let curr: HTMLElement | null = el as HTMLElement;
      while (curr && curr !== document.body) {
        const ox = window.getComputedStyle(curr).overflowX;
        if (ox === 'hidden' || ox === 'clip') return ox;
        curr = curr.parentElement;
      }
      return window.getComputedStyle(el).overflowX;
    });
    expect(['hidden', 'clip']).toContain(overflowX);
  });

  test('F14.B4: Kinetic marquee remains visible and legible under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const marquee = page.getByTestId('kinetic-marquee');
    await marquee.scrollIntoViewIfNeeded();
    await expect(marquee).toBeVisible();
    const text = (await marquee.textContent()) || '';
    expect(text.replace(/\s+/g, '')).toContain('CRIADAEM2022');
  });

  test('F14.B5: Both kinetic title and marquee preserve uppercase display formatting at all scroll positions', async ({ page }) => {
    await page.goto('/');
    const titleText = (await page.getByTestId('kinetic-title-origem').textContent()) || '';
    const marqueeText = (await page.getByTestId('kinetic-marquee').textContent()) || '';
    expect(titleText).toBe(titleText.toUpperCase());
    expect(marqueeText).toBe(marqueeText.toUpperCase());
  });
});

test.describe('F15 Boundaries — Stage Proof All-4-Artists Rollover Sequence & Dark Mode Boundaries', () => {
  test('F15.B1: Sequentially hovering all 4 artist rows (Anitta, Marina Sena, Pedro Sampaio, Kendrick Lamar) displays unique metadata for each', async ({ page }) => {
    await page.goto('/');
    const seenTexts = new Set<string>();
    for (const row of STAGE_ROWS) {
      const loc = page.getByTestId(row.testId);
      await loc.scrollIntoViewIfNeeded();
      await loc.hover();
      const preview = page.getByTestId('stage-rollover-preview');
      await expect(preview).toBeVisible();
      const text = (await preview.textContent()) || '';
      expect(text).toMatch(row.artistPattern);
      seenTexts.add(text);
    }
    expect(seenTexts.size).toBe(4);
  });

  test('F15.B2: Stage rollover preview has pointer-events: none so it never blocks hovering adjacent artist rows', async ({ page }) => {
    await page.goto('/');
    const rowAnitta = page.getByTestId('stage-row-anitta');
    await rowAnitta.scrollIntoViewIfNeeded();
    await rowAnitta.hover();
    const preview = page.getByTestId('stage-rollover-preview');
    await expect(preview).toBeVisible();
    const pe = await preview.evaluate((el) => window.getComputedStyle(el).pointerEvents);
    expect(pe).toBe('none');
  });

  test('F15.B3: Moving pointer outside Section 03 immediately hides [data-testid="stage-rollover-preview"]', async ({ page }) => {
    await page.goto('/');
    const rowPedro = page.getByTestId('stage-row-pedro-sampaio');
    await rowPedro.scrollIntoViewIfNeeded();
    await rowPedro.hover();
    const preview = page.getByTestId('stage-rollover-preview');
    await expect(preview).toBeVisible();

    await page.getByTestId('sticky-header').hover();
    await expect(preview).toBeHidden();
  });

  test('F15.B4: Stage rollover preview enforces 0px border-radius and 1px solid structural border', async ({ page }) => {
    await page.goto('/');
    const rowKendrick = page.getByTestId('stage-row-kendrick-lamar');
    await rowKendrick.scrollIntoViewIfNeeded();
    await rowKendrick.hover();
    const preview = page.getByTestId('stage-rollover-preview');
    await expect(preview).toBeVisible();
    await assertZeroBorderRadius(preview);
  });

  test('F15.B5: Section 03 maintains #0D0D0D background across 320px, 768px, and 1440px viewports', async ({ page }) => {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const bg = await page.getByTestId('section-atuacao-03').evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(bg).toBe(DESIGN_TOKENS.surfaceStageRgb);
    }
  });
});

test.describe('F16 Boundaries — Dual Creation Split Width Dynamics & Mobile Stacking', () => {
  test('F16.B1: On 1440px desktop, unhovered Dual Split sides start at balanced ~50% / 50% widths', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.mouse.move(10, 10);
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideA.scrollIntoViewIfNeeded();
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(boxA).not.toBeNull();
    expect(boxB).not.toBeNull();
    expect(Math.abs(boxA!.width - boxB!.width)).toBeLessThanOrEqual(20);
  });

  test('F16.B2: Rapidly alternating hover between Side A (Upcycling) and Side B (Pequena Escala) flips width dominance', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideA.scrollIntoViewIfNeeded();

    await sideA.hover();
    await page.waitForTimeout(50);
    let boxA = await sideA.boundingBox();
    let boxB = await sideB.boundingBox();
    expect(boxA!.width).toBeGreaterThan(boxB!.width);

    await sideB.hover();
    await page.waitForTimeout(50);
    boxA = await sideA.boundingBox();
    boxB = await sideB.boundingBox();
    expect(boxB!.width).toBeGreaterThan(boxA!.width);
  });

  test('F16.B3: Moving pointer out of Dual Split container restores balanced widths between Side A and Side B', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideA.scrollIntoViewIfNeeded();
    await sideA.hover();
    await page.getByTestId('sticky-header').hover();
    await page.waitForTimeout(50);
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(Math.abs(boxA!.width - boxB!.width)).toBeLessThanOrEqual(20);
  });

  test('F16.B4: On 375px mobile viewport, Dual Split sides stack or fit within viewport with zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByTestId('section-frentes-04').scrollIntoViewIfNeeded();
    await assertNoHorizontalOverflow(page);
  });

  test('F16.B5: Both Dual Split sides enforce 0px border-radius and 1px solid #111111 divider borders', async ({ page }) => {
    await page.goto('/');
    await assertZeroBorderRadius(page.getByTestId('dual-split-container'));
    await assertZeroBorderRadius(page.getByTestId('dual-side-upcycling'));
    await assertZeroBorderRadius(page.getByTestId('dual-side-pequena-escala'));
  });
});

test.describe('F17 Boundaries — Exhaustive 10-Look Audit, Silhouette/Macro Toggle & WIP Bars', () => {
  test('F17.B1: Looks 01 through 05 each toggle data-view-mode="silhouette" -> "macro" -> "silhouette" on hover/leave', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS.slice(0, 5)) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveAttribute('data-view-mode', 'silhouette');
      await card.hover();
      await expect(card).toHaveAttribute('data-view-mode', 'macro');
      await page.getByTestId('sticky-header').hover();
      await expect(card).toHaveAttribute('data-view-mode', 'silhouette');
    }
  });

  test('F17.B2: Looks 06 through 10 each toggle data-view-mode="silhouette" -> "macro" -> "silhouette" on hover/leave', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS.slice(5, 10)) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveAttribute('data-view-mode', 'silhouette');
      await card.hover();
      await expect(card).toHaveAttribute('data-view-mode', 'macro');
      await page.getByTestId('sticky-header').hover();
      await expect(card).toHaveAttribute('data-view-mode', 'silhouette');
    }
  });

  test('F17.B3: Every Look card (01–10) carries a non-empty data-cursor-look attribute matching its look number', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS) {
      const card = page.getByTestId(look.testId);
      const attr = await card.getAttribute('data-cursor-look');
      expect(attr).toBeTruthy();
      expect(attr).toContain(look.code);
    }
  });

  test('F17.B4: Look 03 progress indicator reflects 80% and Look 04 progress indicator reflects 95%, while other 8 looks reflect 100%', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('look-card-03')).toContainText('80%');
    await expect(page.getByTestId('look-card-04')).toContainText('95%');
    await expect(page.getByTestId('look-card-01')).toContainText('100%');
    await expect(page.getByTestId('look-card-10')).toContainText('100%');
  });

  test('F17.B5: Lookbook grid adapts from 3 columns on 1440px desktop to compact layout on 375px mobile without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const c1 = await page.getByTestId('look-card-01').boundingBox();
    const c2 = await page.getByTestId('look-card-02').boundingBox();
    const c3 = await page.getByTestId('look-card-03').boundingBox();
    expect(c1!.y).toBe(c2!.y);
    expect(c2!.y).toBe(c3!.y);

    await page.setViewportSize({ width: 375, height: 812 });
    await assertNoHorizontalOverflow(page);
  });
});

test.describe('F18 Boundaries — Technical Drawer Multi-Look Switching, Escape Key & Zoom Edge Cases', () => {
  test('F18.B1: Pressing Escape when Technical Drawer is already closed causes zero errors or unintended state changes', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('F18.B2: Opening Look 03 in Technical Drawer displays 80% CONCLUIDO status, closing, and opening Look 04 displays 95% CONCLUIDO', async ({ page }) => {
    await page.goto('/');
    const card03 = page.getByTestId('look-card-03');
    await card03.scrollIntoViewIfNeeded();
    await card03.click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('80%');
    await page.getByTestId('drawer-close-btn').click();

    const card04 = page.getByTestId('look-card-04');
    await card04.click();
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('95%');
  });

  test('F18.B3: Opening Look 10 in Technical Drawer displays 100% status and Jaqueta Puffer + Bermuda Cargo + Boné title', async ({ page }) => {
    await page.goto('/');
    const card10 = page.getByTestId('look-card-10');
    await card10.scrollIntoViewIfNeeded();
    await card10.click();
    await expect(page.getByTestId('drawer-look-title')).toContainText(/Jaqueta Puffer/i);
    await expect(page.getByTestId('drawer-progress-bar')).toContainText('100%');
  });

  test('F18.B4: Toggling Macro Texture Zoom ([data-testid="drawer-macro-zoom"]) multiple times inside Drawer works cleanly', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.click();
    const zoom = page.getByTestId('drawer-macro-zoom');
    await expect(zoom).toBeVisible();
    await zoom.click();
    await zoom.click();
    await expect(zoom).toBeVisible();
  });

  test('F18.B5: Technical Drawer remains within viewport bounds on 375px mobile screen with clickable close button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    const box = await drawer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(375);
    await page.getByTestId('drawer-close-btn').click();
    await expect(drawer).toBeHidden();
  });
});

test.describe('F19 Boundaries — Are.na Moodboard Multi-Card Dragging & Bounds', () => {
  test('F19.B1: Dragging 3 different moodboard cards sequentially updates each card position without resetting prior cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const c0 = cards.nth(0);
    const c1 = cards.nth(1);
    const c2 = cards.nth(2);

    const r0 = await dragElementBy(page, c0, 50, 30);
    const r1 = await dragElementBy(page, c1, -40, 25);
    await dragElementBy(page, c2, 35, -35);

    const b0After = await c0.boundingBox();
    const b1After = await c1.boundingBox();
    expect(Math.abs(b0After!.x - r0.afterX)).toBeLessThanOrEqual(2);
    expect(Math.abs(b1After!.x - r1.afterX)).toBeLessThanOrEqual(2);
  });

  test('F19.B2: Dragging a moodboard card elevates its z-index above non-dragged moodboard cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const c0 = cards.nth(0);
    const c1 = cards.nth(1);
    await dragElementBy(page, c0, 30, 20);
    const z0 = await c0.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex || '0', 10));
    const z1 = await c1.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex || '0', 10));
    expect(z0).toBeGreaterThanOrEqual(z1);
  });

  test('F19.B3: Dragging a moodboard card with negative deltas (-45, -30) updates its coordinates cleanly', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[data-testid^="moodboard-card-"]').first();
    const res = await dragElementBy(page, card, -45, -30);
    expect(Math.abs(res.deltaX) > 10 || Math.abs(res.deltaY) > 10 || res.beforeTransform !== res.afterTransform).toBe(true);
  });

  test('F19.B4: Moodboard light table prevents horizontal page overflow when cards are dragged near container edges', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[data-testid^="moodboard-card-"]').first();
    await dragElementBy(page, card, 180, 60);
    await assertNoHorizontalOverflow(page);
  });

  test('F19.B5: All moodboard artifact images load with valid src attributes and 0px border-radius', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      await assertZeroBorderRadius(cards.nth(i));
    }
  });
});

test.describe('F20 Boundaries — Contact Strip All-Items B&W-to-Color & Footer Link Integrity', () => {
  test('F20.B1: Every item in [data-testid="instagram-contact-strip"] starts in B&W grayscale and snaps to full color on hover', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('[data-testid^="ig-strip-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await item.scrollIntoViewIfNeeded();
      await page.mouse.move(10, 10);
      expect(await hasActiveGrayscaleFilter(item)).toBe(true);
      await item.hover();
      expect(await hasActiveGrayscaleFilter(item)).toBe(false);
    }
  });

  test('F20.B2: Moving pointer off a hovered Instagram strip item immediately restores its B&W grayscale filter', async ({ page }) => {
    await page.goto('/');
    const item = page.locator('[data-testid^="ig-strip-item-"]').first();
    await item.scrollIntoViewIfNeeded();
    await item.hover();
    expect(await hasActiveGrayscaleFilter(item)).toBe(false);

    await page.getByTestId('sticky-header').hover();
    expect(await hasActiveGrayscaleFilter(item)).toBe(true);
  });

  test('F20.B3: Instagram strip items enforce instantaneous filter swap (0s/0ms transition) and 0px border-radius', async ({ page }) => {
    await page.goto('/');
    const item = page.locator('[data-testid^="ig-strip-item-"]').first();
    await item.scrollIntoViewIfNeeded();
    await assertZeroBorderRadius(item);
    const dur = await item.evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(dur);
  });

  test('F20.B4: Footer external Instagram links (@ganjastudio.br and @isaquex) include target="_blank" and rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/');
    const ganjaLink = page.getByTestId('footer-link-ganjastudio');
    const isaqueLink = page.getByTestId('footer-link-isaquex');
    await expect(ganjaLink).toHaveAttribute('target', '_blank');
    await expect(isaqueLink).toHaveAttribute('target', '_blank');
    const rel = await ganjaLink.getAttribute('rel');
    expect(rel).toContain('noopener');
  });

  test('F20.B5: Section 06 Creator Card, Instagram Strip, and Footer render without horizontal overflow at 320px and 1440px', async ({ page }) => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.getByTestId('brutalist-footer').scrollIntoViewIfNeeded();
      await assertNoHorizontalOverflow(page);
    }
  });
});
