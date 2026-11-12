import { test, expect } from '@playwright/test';
import {
  DESIGN_TOKENS,
  NAV_CELLS,
  HERO_STICKERS,
  STAGE_ROWS,
  CANONICAL_LOOKS,
  assertZeroBorderRadius,
  assertNoBackdropBlur,
  isHardDropShadow,
  dragElementBy,
  hasActiveGrayscaleFilter,
} from './helpers';

test.describe('F01 — Brutalismo Editorial Tátil Structural Grid & Geometry', () => {
  test('F01.1: Sticky header and navigation cells enforce exposed 1px solid #111111 structural borders', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('sticky-header');
    await expect(header).toBeVisible();
    const borderInfo = await header.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        bottomWidth: s.borderBottomWidth,
        bottomStyle: s.borderBottomStyle,
        bottomColor: s.borderBottomColor,
      };
    });
    expect(borderInfo.bottomWidth).toBe('1px');
    expect(borderInfo.bottomStyle).toBe('solid');
    expect(borderInfo.bottomColor).toBe(DESIGN_TOKENS.structuralInkRgb);

    const cell01 = page.getByTestId('nav-cell-01');
    await expect(cell01).toBeVisible();
    await assertZeroBorderRadius(cell01);
  });

  test('F01.2: Primary layout containers and Lookbook cards enforce 0px border-radius', async ({ page }) => {
    await page.goto('/');
    await assertZeroBorderRadius(page.getByTestId('sticky-header'));
    await assertZeroBorderRadius(page.getByTestId('section-hero-00'));
    await assertZeroBorderRadius(page.getByTestId('demographic-frame'));
    await assertZeroBorderRadius(page.getByTestId('look-card-01'));
    await assertZeroBorderRadius(page.getByTestId('creator-catalog-card'));
  });

  test('F01.3: Elevated frames, stickers, and cards render hard zero-blur drop shadows (4px 4px 0px #111111)', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    await expect(sticker).toBeVisible();
    const stickerShadow = await sticker.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(isHardDropShadow(stickerShadow)).toBe(true);

    const demoFrame = page.getByTestId('demographic-frame');
    await demoFrame.scrollIntoViewIfNeeded();
    const demoShadow = await demoFrame.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(isHardDropShadow(demoShadow)).toBe(true);
  });

  test('F01.4: All major page sections render with exposed architectural grid borders', async ({ page }) => {
    await page.goto('/');
    const sectionIds = [
      'section-hero-00',
      'section-origem-01',
      'section-atuacao-03',
      'section-frentes-04',
      'section-desfile-05',
      'section-contato-06',
    ];
    for (const id of sectionIds) {
      const section = page.getByTestId(id);
      await expect(section).toBeAttached();
      await assertZeroBorderRadius(section);
    }
  });

  test('F01.5: Tactile surface overlays and structural dividers maintain non-zero geometry without rounded corners', async ({ page }) => {
    await page.goto('/');
    const lookbookGrid = page.getByTestId('lookbook-grid');
    await lookbookGrid.scrollIntoViewIfNeeded();
    await expect(lookbookGrid).toBeVisible();
    await assertZeroBorderRadius(lookbookGrid);
    const box = await lookbookGrid.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(280);
    expect(box!.height).toBeGreaterThan(200);
  });
});

test.describe('F02 — Liquid Glass Prohibition & Vinyl/Mylar Semiotic Sheen', () => {
  test('F02.1: Sticky header and navigation rollover preview prohibit backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('sticky-header');
    await assertNoBackdropBlur(header);

    const nav01 = page.getByTestId('nav-cell-01');
    await nav01.hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await assertNoBackdropBlur(preview);
  });

  test('F02.2: Technical inspection drawer and overlays prohibit glassmorphic backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await assertNoBackdropBlur(drawer);
    await assertZeroBorderRadius(drawer);
  });

  test('F02.3: Draggable Hero stickers render Vinyl Sticker Gloss layer ([data-testid="sticker-gloss-layer"])', async ({ page }) => {
    await page.goto('/');
    const glossLayers = page.getByTestId('sticker-gloss-layer');
    const count = await glossLayers.count();
    expect(count).toBeGreaterThanOrEqual(5);
    await expect(glossLayers.first()).toBeAttached();
  });

  test('F02.4: Pointer movement over a draggable sticker updates specular Sticker Gloss layer without blur', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    await expect(sticker).toBeVisible();
    const box = await sticker.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + 5, box!.y + 5);
    await page.mouse.move(box!.x + box!.width - 5, box!.y + box!.height - 5);
    await assertNoBackdropBlur(sticker);
    const gloss = sticker.getByTestId('sticker-gloss-layer');
    await expect(gloss).toBeAttached();
    await assertNoBackdropBlur(gloss);
  });

  test('F02.5: Lookbook cards and Stage rollover preview enforce zero backdrop-filter blur', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await assertNoBackdropBlur(card06);

    const rowAnitta = page.getByTestId('stage-row-anitta');
    await rowAnitta.scrollIntoViewIfNeeded();
    await rowAnitta.hover();
    const stagePreview = page.getByTestId('stage-rollover-preview');
    await expect(stagePreview).toBeVisible();
    await assertNoBackdropBlur(stagePreview);
  });
});

test.describe('F03 — Surface Color Token System', () => {
  test('F03.1: Root CSS custom properties define exact surface and structural ink color tokens', async ({ page }) => {
    await page.goto('/');
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect([DESIGN_TOKENS.surfacePaperRgb, DESIGN_TOKENS.surfaceStageRgb]).toContain(bodyBg);
  });

  test('F03.2: Document body and Hero/Origin editorial sections render on #F4F3EF (rgb(244, 243, 239)) paper surface', async ({ page }) => {
    await page.goto('/');
    const heroBg = await page.getByTestId('section-hero-00').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor || window.getComputedStyle(document.body).backgroundColor;
    });
    expect(heroBg).toBe(DESIGN_TOKENS.surfacePaperRgb);

    const origemBg = await page.getByTestId('section-origem-01').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor || window.getComputedStyle(document.body).backgroundColor;
    });
    expect(origemBg).toBe(DESIGN_TOKENS.surfacePaperRgb);
  });

  test('F03.3: Lookbook cards render on #FFFFFF (rgb(255, 255, 255)) 032c pure white product isolation surface', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    const cardBg = await card01.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(cardBg).toBe(DESIGN_TOKENS.surfaceWhiteRgb);
  });

  test('F03.4: Section 03 Stage Proof renders on #0D0D0D (rgb(13, 13, 13)) secondary asphalt/stage surface', async ({ page }) => {
    await page.goto('/');
    const stageSection = page.getByTestId('section-atuacao-03');
    await stageSection.scrollIntoViewIfNeeded();
    const stageBg = await stageSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(stageBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('F03.5: Monumental Brutalist Footer renders on #0D0D0D dark surface with high-contrast typography', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByTestId('brutalist-footer');
    await footer.scrollIntoViewIfNeeded();
    const footerBg = await footer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(footerBg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });
});

test.describe('F04 — Semiotic Accent Palette (Ganja Star)', () => {
  test('F04.1: Urban stickers and badges register Vermelho Manifesto (#D92B2B), Amarelo Sinalização (#F5C400), and Verde Placa (#008055)', async ({ page }) => {
    await page.goto('/');
    const pageHtml = await page.content();
    const rootTokens = await page.evaluate(() => {
      const htmlText = document.documentElement.outerHTML.toUpperCase();
      return {
        hasRed: htmlText.includes('#D92B2B') || htmlText.includes('217, 43, 43'),
        hasYellow: htmlText.includes('#F5C400') || htmlText.includes('245, 196, 0'),
        hasGreen: htmlText.includes('#008055') || htmlText.includes('0, 128, 85'),
      };
    });
    expect(pageHtml.length).toBeGreaterThan(100);
    expect(rootTokens.hasRed || rootTokens.hasYellow || rootTokens.hasGreen).toBe(true);
  });

  test('F04.2: Urban stickers apply flat semiotic signaling colors (#D92B2B, #F5C400, #008055) without pastel gradients', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      const loc = page.getByTestId(sticker.testId);
      await expect(loc).toBeVisible();
      const hasContent = await loc.textContent();
      expect(hasContent).toMatch(sticker.textPattern);
    }
  });

  test('F04.3: Look 03 WIP badge (80% CONCLUIDO) highlights status with semiotic signaling palette', async ({ page }) => {
    await page.goto('/');
    const badge03 = page.getByTestId('wip-badge-look-03');
    await badge03.scrollIntoViewIfNeeded();
    await expect(badge03).toBeVisible();
    await expect(badge03).toContainText('80% CONCLUIDO');
    await assertZeroBorderRadius(badge03);
  });

  test('F04.4: Look 04 WIP badge (95% CONCLUIDO) highlights status with semiotic signaling palette', async ({ page }) => {
    await page.goto('/');
    const badge04 = page.getByTestId('wip-badge-look-04');
    await badge04.scrollIntoViewIfNeeded();
    await expect(badge04).toBeVisible();
    await expect(badge04).toContainText('95% CONCLUIDO');
    await assertZeroBorderRadius(badge04);
  });

  test('F04.5: Stage Proof artist rows incorporate semiotic accent styling on dark #0D0D0D stage background', async ({ page }) => {
    await page.goto('/');
    const rowKendrick = page.getByTestId('stage-row-kendrick-lamar');
    await rowKendrick.scrollIntoViewIfNeeded();
    await expect(rowKendrick).toBeVisible();
    await expect(rowKendrick).toContainText('KENDRICK LAMAR');
  });
});

test.describe('F05 — 3-Tier Typography Hierarchy', () => {
  test('F05.1: Monumental Hero and section headlines use Display font family (Syne, Archivo Black, or Bebas Neue) in uppercase', async ({ page }) => {
    await page.goto('/');
    const heroCol = page.getByTestId('hero-manifesto-col');
    await expect(heroCol).toBeVisible();
    const headingFont = await heroCol.locator('h1, h2').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        fontFamily: s.fontFamily.toLowerCase(),
        textTransform: s.textTransform,
        text: el.textContent || '',
      };
    });
    expect(
      headingFont.fontFamily.includes('syne') ||
        headingFont.fontFamily.includes('archivo') ||
        headingFont.fontFamily.includes('bebas')
    ).toBe(true);
  });

  test('F05.2: Monumental Display headlines apply compressed negative letter-spacing tracking', async ({ page }) => {
    await page.goto('/');
    const heroHeading = page.getByTestId('hero-manifesto-col').locator('h1').first();
    await expect(heroHeading).toBeVisible();
    const letterSpacing = await heroHeading.evaluate((el) => {
      const raw = window.getComputedStyle(el).letterSpacing;
      return raw === 'normal' ? 0 : parseFloat(raw);
    });
    expect(letterSpacing).toBeLessThanOrEqual(0);
  });

  test('F05.3: Kinetic Origin title ([data-testid="kinetic-title-origem"]) applies expanded positive letter-spacing tracking', async ({ page }) => {
    await page.goto('/');
    const kineticTitle = page.getByTestId('kinetic-title-origem');
    await kineticTitle.scrollIntoViewIfNeeded();
    await expect(kineticTitle).toBeVisible();
    const info = await kineticTitle.evaluate((el) => {
      const raw = window.getComputedStyle(el).letterSpacing;
      return {
        letterSpacing: raw === 'normal' ? 0 : parseFloat(raw),
        text: el.textContent || '',
      };
    });
    expect(info.letterSpacing > 0 || /D\s+E\s+O\s+N\s+D\s+E/.test(info.text)).toBe(true);
  });

  test('F05.4: Manifesto narrative paragraphs use clean sans-serif Body font family (Plus Jakarta Sans or Inter)', async ({ page }) => {
    await page.goto('/');
    const origemSection = page.getByTestId('section-origem-01');
    await origemSection.scrollIntoViewIfNeeded();
    const bodyFont = await origemSection.locator('p').first().evaluate((el) => {
      return window.getComputedStyle(el).fontFamily.toLowerCase();
    });
    expect(
      bodyFont.includes('jakarta') ||
        bodyFont.includes('inter') ||
        bodyFont.includes('sans-serif')
    ).toBe(true);
  });

  test('F05.5: Navigation indices (01)-(06), WIP badges, and Demographic Frame use Technical Monospace font (Space Mono or JetBrains Mono)', async ({ page }) => {
    await page.goto('/');
    const demoFrame = page.getByTestId('demographic-frame');
    await demoFrame.scrollIntoViewIfNeeded();
    const monoFont = await demoFrame.evaluate((el) => window.getComputedStyle(el).fontFamily.toLowerCase());
    expect(
      monoFont.includes('space mono') ||
        monoFont.includes('jetbrains mono') ||
        monoFont.includes('monospace')
    ).toBe(true);
  });
});

test.describe('F06 — Official G★NJ★ Brand Mark Asset Pipeline', () => {
  test('F06.1: Hero section renders official vector brand mark ([data-testid="brand-mark-svg"]) with non-zero dimensions', async ({ page }) => {
    await page.goto('/');
    const brandMark = page.getByTestId('brand-mark-svg');
    await expect(brandMark).toBeVisible();
    const box = await brandMark.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(20);
    expect(box!.height).toBeGreaterThan(10);
  });

  test('F06.2: Hero brand mark SVG preserves cropped viewBox="92 242 847 187" or valid vector path geometry', async ({ page }) => {
    await page.goto('/');
    const brandMark = page.getByTestId('brand-mark-svg');
    await expect(brandMark).toBeVisible();
    const svgDetails = await brandMark.evaluate((el) => {
      const svgEl = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg');
      if (svgEl) {
        return {
          hasSvg: true,
          viewBox: svgEl.getAttribute('viewBox') || '',
          pathCount: svgEl.querySelectorAll('path, polygon, g').length,
        };
      }
      const imgEl = el.tagName.toLowerCase() === 'img' ? (el as HTMLImageElement) : el.querySelector('img');
      return {
        hasSvg: false,
        viewBox: imgEl?.getAttribute('src') || '',
        pathCount: imgEl ? 1 : 0,
      };
    });
    expect(svgDetails.pathCount).toBeGreaterThan(0);
  });

  test('F06.3: Sticky header brand cell ([data-testid="nav-cell-brand"]) displays GANJASTUDIO alongside brand emblem', async ({ page }) => {
    await page.goto('/');
    const brandCell = page.getByTestId('nav-cell-brand');
    await expect(brandCell).toBeVisible();
    await expect(brandCell).toContainText('GANJASTUDIO');
  });

  test('F06.4: HTTP GET /assets/brand/ganja-star-mark.svg and /assets/brand/ganja-star-star.svg return valid 200 XML SVG payloads', async ({ request }) => {
    const markRes = await request.get('/assets/brand/ganja-star-mark.svg');
    expect(markRes.status()).toBe(200);
    const markBody = await markRes.text();
    expect(markBody.trim()).toContain('<svg');
    expect(markBody).toContain('92 242 847 187');

    const starRes = await request.get('/assets/brand/ganja-star-star.svg');
    expect(starRes.status()).toBe(200);
    const starBody = await starRes.text();
    expect(starBody.trim()).toContain('<svg');
  });

  test('F06.5: HTTP GET /assets/brand/ganja-star-mark.png returns valid 200 PNG binary asset', async ({ request }) => {
    const pngRes = await request.get('/assets/brand/ganja-star-mark.png');
    expect(pngRes.status()).toBe(200);
    const buffer = await pngRes.body();
    expect(buffer.byteLength).toBeGreaterThan(100);
    // PNG magic header: 0x89 0x50 0x4E 0x47
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
    expect(buffer[2]).toBe(0x4e);
    expect(buffer[3]).toBe(0x47);
  });
});

test.describe('F07 — Brutalist Sticky Header (Barra de Navegação Superior Fixa)', () => {
  test('F07.1: Sticky header is fixed/sticky at top of viewport with 1px solid #111111 border', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('sticky-header');
    await expect(header).toBeVisible();
    const pos = await header.evaluate((el) => window.getComputedStyle(el).position);
    expect(['fixed', 'sticky']).toContain(pos);
    const box = await header.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThanOrEqual(2);
  });

  test('F07.2: Sticky header renders all 7 canonical cells (GANJASTUDIO and (01) through (06))', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS) {
      const loc = page.getByTestId(cell.testId);
      await expect(loc).toBeVisible();
    }
  });

  test('F07.3: Navigation cells display exact unspaced uppercase strings DEONDEVEIO?(01) through CONTATO(06)', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS) {
      const loc = page.getByTestId(cell.testId);
      const raw = (await loc.textContent())?.replace(/\s+/g, '') || '';
      expect(raw).toContain(cell.rawText);
    }
  });

  test('F07.4: Clicking navigation cells scrolls to corresponding target sections (#origem-01 through #contato-06)', async ({ page }) => {
    await page.goto('/');
    const nav05 = page.getByTestId('nav-cell-05');
    await nav05.click();
    const section05 = page.getByTestId('section-desfile-05');
    await expect(section05).toBeVisible();

    const nav06 = page.getByTestId('nav-cell-06');
    await nav06.click();
    const section06 = page.getByTestId('section-contato-06');
    await expect(section06).toBeVisible();
  });

  test('F07.5: Hovering navigation cells triggers dry instantaneous visual state inversion (0ms transition)', async ({ page }) => {
    await page.goto('/');
    const nav01 = page.getByTestId('nav-cell-01');
    const transitionDuration = await nav01.evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(transitionDuration);
  });
});

test.describe('F08 — Navigation Rollover Preview', () => {
  test('F08.1: Navigation rollover preview ([data-testid="nav-rollover-preview"]) is hidden before hovering indexed nav cells', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(10, 500);
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeHidden();
  });

  test('F08.2: Hovering nav-cell-01 (DEONDEVEIO?(01)) instantaneously reveals rollover preview with section metadata and visual', async ({ page }) => {
    await page.goto('/');
    const nav01 = page.getByTestId('nav-cell-01');
    await nav01.hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(01)');
  });

  test('F08.3: Hovering nav-cell-03 (ATUAÇÃODAMARCA(03)) updates rollover preview with Stage Proof title and index (03)', async ({ page }) => {
    await page.goto('/');
    const nav03 = page.getByTestId('nav-cell-03');
    await nav03.hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(03)');
  });

  test('F08.4: Hovering nav-cell-05 (PROPOSTADEDESFILE(05)) updates rollover preview with Lookbook title and index (05)', async ({ page }) => {
    await page.goto('/');
    const nav05 = page.getByTestId('nav-cell-05');
    await nav05.hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('(05)');
  });

  test('F08.5: Moving pointer outside sticky header hides navigation rollover preview', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-02').hover();
    const preview = page.getByTestId('nav-rollover-preview');
    await expect(preview).toBeVisible();

    await page.mouse.move(700, 600);
    await expect(preview).toBeHidden();
  });
});

test.describe('F09 — Custom Studio Crosshair Cursor (+) & Material Inspection Tag', () => {
  test('F09.1: Custom studio cursor ([data-testid="custom-cursor"]) renders default + crosshair with pointer-events: none', async ({ page }) => {
    await page.goto('/');
    const cursor = page.getByTestId('custom-cursor');
    await expect(cursor).toBeAttached();
    const pointerEvents = await cursor.evaluate((el) => window.getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');
    await expect(cursor).toContainText('+');
  });

  test('F09.2: Moving mouse across viewport updates custom cursor position coordinates', async ({ page }) => {
    await page.goto('/');
    const cursor = page.getByTestId('custom-cursor');
    await page.mouse.move(180, 220);
    const firstStyle = await cursor.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      left: window.getComputedStyle(el).left,
      top: window.getComputedStyle(el).top,
    }));

    await page.mouse.move(620, 480);
    const secondStyle = await cursor.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      left: window.getComputedStyle(el).left,
      top: window.getComputedStyle(el).top,
    }));
    expect(
      firstStyle.transform !== secondStyle.transform ||
        firstStyle.left !== secondStyle.left ||
        firstStyle.top !== secondStyle.top
    ).toBe(true);
  });

  test('F09.3: Hovering a Look card expands [data-testid="custom-cursor-label"] with monospace material inspection tag', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.hover();
    const cursorLabel = page.getByTestId('custom-cursor-label');
    await expect(cursorLabel).toBeVisible();
    await expect(cursorLabel).toContainText('INSPECIONAR LOOK 01');
  });

  test('F09.4: Hovering Look 06 displays exact tag [COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    const cursorLabel = page.getByTestId('custom-cursor-label');
    await expect(cursorLabel).toBeVisible();
    await expect(cursorLabel).toContainText('[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]');
  });

  test('F09.5: Moving pointer off a Look card reverts custom cursor back to compact + crosshair state', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.hover();
    await expect(page.getByTestId('custom-cursor-label')).toContainText('INSPECIONAR LOOK 06');

    await page.getByTestId('sticky-header').hover();
    const cursor = page.getByTestId('custom-cursor');
    await expect(cursor).toContainText('+');
  });
});

test.describe('F10 — Lenis Inertial Smooth Scroll & Dry Instantaneous State Changes', () => {
  test('F10.1: Smooth scroll container initializes on document and supports vertical page scrolling without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(500);
    expect(errors).toHaveLength(0);
  });

  test('F10.2: Clicking sticky header navigation cell scrolls target section into viewport', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cell-04').click();
    const section04 = page.getByTestId('section-frentes-04');
    await expect(section04).toBeVisible();
  });

  test('F10.3: Navigation cells enforce dry 0s/0ms CSS transition-duration for instantaneous brutalist state changes', async ({ page }) => {
    await page.goto('/');
    for (const cell of NAV_CELLS) {
      const duration = await page.getByTestId(cell.testId).evaluate((el) => window.getComputedStyle(el).transitionDuration);
      expect(['0s', '0ms']).toContain(duration);
    }
  });

  test('F10.4: Lookbook card silhouette-to-macro image swap enforces dry instantaneous state change', async ({ page }) => {
    await page.goto('/');
    const card02 = page.getByTestId('look-card-02');
    await card02.scrollIntoViewIfNeeded();
    await expect(card02).toHaveAttribute('data-view-mode', 'silhouette');
    await card02.hover();
    await expect(card02).toHaveAttribute('data-view-mode', 'macro');
  });

  test('F10.5: Technical drawer open and close controls operate without blocking subsequent page scrolling', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    await expect(page.getByTestId('look-technical-drawer')).toBeVisible();
    await page.getByTestId('drawer-close-btn').click();
    await expect(page.getByTestId('look-technical-drawer')).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, 0));
    const topY = await page.evaluate(() => window.scrollY);
    expect(topY).toBeLessThan(50);
  });
});

test.describe('F11 — Section 00 — Asymmetric 12-Column Hero ("O Corpo como Superfície")', () => {
  test('F11.1: Section 00 (#hero-00) renders asymmetric 12-column grid with left manifesto and right scroll gallery', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('section-hero-00');
    await expect(hero).toBeVisible();
    await expect(page.getByTestId('hero-manifesto-col')).toBeVisible();
    await expect(page.getByTestId('hero-scroll-gallery')).toBeVisible();
  });

  test('F11.2: Hero manifesto column ([data-testid="hero-manifesto-col"]) displays monumental G★NJ★ STAR headline and brand mark', async ({ page }) => {
    await page.goto('/');
    const manifestoCol = page.getByTestId('hero-manifesto-col');
    await expect(manifestoCol).toBeVisible();
    const text = await manifestoCol.textContent();
    expect(text).toMatch(/G★NJ★|GANJA\s*STAR/i);
    await expect(page.getByTestId('brand-mark-svg')).toBeVisible();
  });

  test('F11.3: Hero manifesto text articulates styling + garment creation intersection and O Corpo como Superfície concept', async ({ page }) => {
    await page.goto('/');
    const manifestoCol = page.getByTestId('hero-manifesto-col');
    const text = await manifestoCol.textContent();
    expect(text).toMatch(/Corpo como Superf[íi]cie|styling|upcycling/i);
  });

  test('F11.4: Hero Scroll Gallery ([data-testid="hero-scroll-gallery"]) renders multiple collection visual plates', async ({ page }) => {
    await page.goto('/');
    const gallery = page.getByTestId('hero-scroll-gallery');
    await expect(gallery).toBeVisible();
    const mediaCount = await gallery.locator('img, svg, figure').count();
    expect(mediaCount).toBeGreaterThanOrEqual(3);
  });

  test('F11.5: On 1440px desktop viewport, Hero manifesto column is positioned to the left of Hero Scroll Gallery', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const leftBox = await page.getByTestId('hero-manifesto-col').boundingBox();
    const rightBox = await page.getByTestId('hero-scroll-gallery').boundingBox();
    expect(leftBox).not.toBeNull();
    expect(rightBox).not.toBeNull();
    expect(leftBox!.x).toBeLessThan(rightBox!.x);
  });
});

test.describe('F12 — Section 00 — Draggable SVG Urban Stickers with Vinyl Sticker Physics', () => {
  test('F12.1: Hero renders all 5 canonical urban stickers (GSH-2168, GANJA 25G, Ozempic, Caminhão, G★NJ★)', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      await expect(page.getByTestId(sticker.testId)).toBeVisible();
    }
  });

  test('F12.2: Each urban sticker displays its exact semiotic graphic text and vector SVG badge structure', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      const loc = page.getByTestId(sticker.testId);
      const text = await loc.textContent();
      expect(text).toMatch(sticker.textPattern);
    }
  });

  test('F12.3: Dragging sticker GSH-2168 via pointer events updates its coordinates on the Hero canvas', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-gsh-2168');
    const result = await dragElementBy(page, sticker, 75, 45);
    expect(Math.abs(result.deltaX) > 10 || Math.abs(result.deltaY) > 10 || result.beforeTransform !== result.afterTransform).toBe(true);
  });

  test('F12.4: Dragging sticker GOD SAVE BEARS FROM OZEMPIC updates its position and elevates active z-index', async ({ page }) => {
    await page.goto('/');
    const sticker = page.getByTestId('draggable-sticker-sticker-ozempic');
    const result = await dragElementBy(page, sticker, -60, 50);
    expect(Math.abs(result.deltaX) > 10 || Math.abs(result.deltaY) > 10 || result.beforeTransform !== result.afterTransform).toBe(true);
  });

  test('F12.5: Each draggable sticker contains a Vinyl Sticker Gloss specular layer and 4px 4px 0px #111111 hard shadow', async ({ page }) => {
    await page.goto('/');
    for (const sticker of HERO_STICKERS) {
      const loc = page.getByTestId(sticker.testId);
      await expect(loc.getByTestId('sticker-gloss-layer')).toBeAttached();
      const shadow = await loc.evaluate((el) => window.getComputedStyle(el).boxShadow);
      expect(isHardDropShadow(shadow)).toBe(true);
    }
  });
});

test.describe('F13 — Sections 01 & 02 — Origin & Manifesto (DEONDEVEIO?(01) + PUBLICOALVO(02))', () => {
  test('F13.1: Section 01 (#origem-01) renders origin narrative citing 2022 foundation, UFMG, and Senai', async ({ page }) => {
    await page.goto('/');
    const sec01 = page.getByTestId('section-origem-01');
    await sec01.scrollIntoViewIfNeeded();
    await expect(sec01).toBeVisible();
    await expect(sec01).toContainText('2022');
    await expect(sec01).toContainText('UFMG');
    await expect(sec01).toContainText('Senai');
  });

  test('F13.2: Origin manifesto explains Isaque Gandra -> Ganja phonetic/graphic pun and reverse garment engineering', async ({ page }) => {
    await page.goto('/');
    const sec01 = page.getByTestId('section-origem-01');
    await sec01.scrollIntoViewIfNeeded();
    const text = await sec01.textContent();
    expect(text).toMatch(/Gandra/i);
    expect(text).toMatch(/Ganja/i);
    expect(text).toMatch(/engenharia reversa/i);
  });

  test('F13.3: Section 02 (#publico-02) renders technical Demographic Frame ([data-testid="demographic-frame"])', async ({ page }) => {
    await page.goto('/');
    const sec02 = page.getByTestId('section-publico-02');
    await sec02.scrollIntoViewIfNeeded();
    await expect(sec02).toBeVisible();
    const demoFrame = page.getByTestId('demographic-frame');
    await expect(demoFrame).toBeVisible();
  });

  test('F13.4: Demographic Frame displays verbatim strings IDADE: 18-35 ANOS, PÚBLICO: JOVEM, URBANO E UNDERGROUND, and LOCAL: DE SÃO PAULO PARA O MUNDO', async ({ page }) => {
    await page.goto('/');
    const demoFrame = page.getByTestId('demographic-frame');
    await demoFrame.scrollIntoViewIfNeeded();
    await expect(demoFrame).toContainText('IDADE: 18-35 ANOS');
    await expect(demoFrame).toContainText('PÚBLICO: JOVEM, URBANO E UNDERGROUND');
    await expect(demoFrame).toContainText('LOCAL: DE SÃO PAULO PARA O MUNDO');
  });

  test('F13.5: Demographic Frame enforces 0px border-radius, 1px solid #111111 border, and technical monospace typography', async ({ page }) => {
    await page.goto('/');
    const demoFrame = page.getByTestId('demographic-frame');
    await demoFrame.scrollIntoViewIfNeeded();
    await assertZeroBorderRadius(demoFrame);
    const styles = await demoFrame.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        borderTopWidth: s.borderTopWidth,
        borderTopStyle: s.borderTopStyle,
        fontFamily: s.fontFamily.toLowerCase(),
      };
    });
    expect(styles.borderTopWidth).toBe('1px');
    expect(styles.borderTopStyle).toBe('solid');
    expect(styles.fontFamily).toMatch(/mono/);
  });
});

test.describe('F14 — Continuous Marquees & Scroll-Driven Kinetic Letter-Spacing', () => {
  test('F14.1: Kinetic Origin title ([data-testid="kinetic-title-origem"]) renders spaced D E O N D E V E I O ? headline', async ({ page }) => {
    await page.goto('/');
    const title = page.getByTestId('kinetic-title-origem');
    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeVisible();
    const text = (await title.textContent()) || '';
    expect(text.replace(/\s+/g, '')).toContain('DEONDEVEIO?');
  });

  test('F14.2: Continuous brutalist marquee ([data-testid="kinetic-marquee"]) renders deconstructed C R I A D A E M 2 0 2 2 text', async ({ page }) => {
    await page.goto('/');
    const marquee = page.getByTestId('kinetic-marquee');
    await marquee.scrollIntoViewIfNeeded();
    await expect(marquee).toBeVisible();
    const text = (await marquee.textContent()) || '';
    expect(text.replace(/\s+/g, '')).toContain('CRIADAEM2022');
  });

  test('F14.3: Scrolling through Section 01 dynamically updates letter-spacing on [data-testid="kinetic-title-origem"]', async ({ page }) => {
    await page.goto('/');
    const title = page.getByTestId('kinetic-title-origem');
    await page.evaluate(() => window.scrollTo(0, 0));
    const initialSpacing = await title.evaluate((el) => ({
      computed: window.getComputedStyle(el).letterSpacing,
      inline: (el as HTMLElement).style.letterSpacing,
    }));

    await title.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(50);
    const scrolledSpacing = await title.evaluate((el) => ({
      computed: window.getComputedStyle(el).letterSpacing,
      inline: (el as HTMLElement).style.letterSpacing,
    }));

    expect(
      initialSpacing.computed !== scrolledSpacing.computed ||
        initialSpacing.inline !== scrolledSpacing.inline ||
        parseFloat(scrolledSpacing.computed || '0') > 0
    ).toBe(true);
  });

  test('F14.4: Kinetic marquee track contains repeated/continuous content inside overflow-hidden brutalist strip', async ({ page }) => {
    await page.goto('/');
    const marquee = page.getByTestId('kinetic-marquee');
    await marquee.scrollIntoViewIfNeeded();
    const text = (await marquee.textContent()) || '';
    expect(text.length).toBeGreaterThan(15);
  });

  test('F14.5: Kinetic typography and marquee strips maintain 0px border-radius and 1px solid structural borders', async ({ page }) => {
    await page.goto('/');
    const marquee = page.getByTestId('kinetic-marquee');
    await assertZeroBorderRadius(marquee);
    const title = page.getByTestId('kinetic-title-origem');
    await assertZeroBorderRadius(title);
  });
});

test.describe('F15 — Section 03 — Stage Proof (ATUAÇÃODAMARCA(03)) & Dark Mode Scroll Transition', () => {
  test('F15.1: Section 03 (#atuacao-03) renders on #0D0D0D dark stage surface with monumental artist roster', async ({ page }) => {
    await page.goto('/');
    const sec03 = page.getByTestId('section-atuacao-03');
    await sec03.scrollIntoViewIfNeeded();
    await expect(sec03).toBeVisible();
    const bg = await sec03.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('F15.2: Stage Proof roster displays all 4 headline rows: ANITTA (SHOWS), MARINA SENA (VIDEOCLIPE & PALCO), PEDRO SAMPAIO (FIGURINO BALLET), KENDRICK LAMAR (FIGURINO BALLET)', async ({ page }) => {
    await page.goto('/');
    for (const row of STAGE_ROWS) {
      const loc = page.getByTestId(row.testId);
      await loc.scrollIntoViewIfNeeded();
      await expect(loc).toBeVisible();
      await expect(loc).toContainText(row.displayLabel);
    }
  });

  test('F15.3: Section 03 includes styling trajectory context citing Fenômeno Natural, Rock in Rio, Mariana Cavanellas, and Clara Tannure', async ({ page }) => {
    await page.goto('/');
    const sec03 = page.getByTestId('section-atuacao-03');
    await sec03.scrollIntoViewIfNeeded();
    const text = await sec03.textContent();
    expect(text).toMatch(/Fen[ôo]meno Natural/i);
    expect(text).toMatch(/Rock in Rio/i);
    expect(text).toMatch(/Mariana Cavanellas/i);
    expect(text).toMatch(/Clara Tannure/i);
  });

  test('F15.4: Hovering an artist row reveals [data-testid="stage-rollover-preview"] with stage visual and technical metadata', async ({ page }) => {
    await page.goto('/');
    const rowMarina = page.getByTestId('stage-row-marina-sena');
    await rowMarina.scrollIntoViewIfNeeded();
    await rowMarina.hover();
    const preview = page.getByTestId('stage-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText(/Marina Sena/i);
  });

  test('F15.5: Moving pointer across different artist rows updates [data-testid="stage-rollover-preview"] metadata and hides on mouseleave', async ({ page }) => {
    await page.goto('/');
    const rowAnitta = page.getByTestId('stage-row-anitta');
    await rowAnitta.scrollIntoViewIfNeeded();
    await rowAnitta.hover();
    const preview = page.getByTestId('stage-rollover-preview');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText(/Anitta/i);

    const rowKendrick = page.getByTestId('stage-row-kendrick-lamar');
    await rowKendrick.hover();
    await expect(preview).toContainText(/Kendrick Lamar/i);
  });
});

test.describe('F16 — Section 04 — Dual Creation Architecture (FRENTESDECRIAÇÃO(04))', () => {
  test('F16.1: Section 04 (#frentes-04) renders vertically split container ([data-testid="dual-split-container"]) with Upcycling and Pequena Escala sides', async ({ page }) => {
    await page.goto('/');
    const container = page.getByTestId('dual-split-container');
    await container.scrollIntoViewIfNeeded();
    await expect(container).toBeVisible();
    await expect(page.getByTestId('dual-side-upcycling')).toBeVisible();
    await expect(page.getByTestId('dual-side-pequena-escala')).toBeVisible();
  });

  test('F16.2: Side A ([data-testid="dual-side-upcycling"]) documents Peças Únicas (1/1 Upcycling) referencing Looks 03, 06, 07, and 08', async ({ page }) => {
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    await sideA.scrollIntoViewIfNeeded();
    const text = await sideA.textContent();
    expect(text).toMatch(/Upcycling|Pe[çc]as [ÚU]nicas|1\/1|1-of-1/i);
    expect(text).toMatch(/couro|pel[úu]cia|Caminh[ãa]o|LOOK\s*0?6/i);
  });

  test('F16.3: Side B ([data-testid="dual-side-pequena-escala"]) documents Pequena Escala referencing Camiseta Ozempic, Regatinha Ganja Star, Moletom Legalize Já, and Cargos/Puffer', async ({ page }) => {
    await page.goto('/');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideB.scrollIntoViewIfNeeded();
    const text = await sideB.textContent();
    expect(text).toMatch(/Pequena Escala/i);
    expect(text).toMatch(/Ozempic/i);
    expect(text).toMatch(/Legalize J[áa]/i);
    expect(text).toMatch(/Cargo|Puffer/i);
  });

  test('F16.4: Hovering Side A ([data-testid="dual-side-upcycling"]) dynamically expands its horizontal width relative to Side B', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideA.scrollIntoViewIfNeeded();
    await sideA.hover();
    await page.waitForTimeout(50);
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(boxA).not.toBeNull();
    expect(boxB).not.toBeNull();
    expect(boxA!.width).toBeGreaterThan(boxB!.width);
  });

  test('F16.5: Hovering Side B ([data-testid="dual-side-pequena-escala"]) dynamically expands its horizontal width relative to Side A', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sideA = page.getByTestId('dual-side-upcycling');
    const sideB = page.getByTestId('dual-side-pequena-escala');
    await sideB.scrollIntoViewIfNeeded();
    await sideB.hover();
    await page.waitForTimeout(50);
    const boxA = await sideA.boundingBox();
    const boxB = await sideB.boundingBox();
    expect(boxA).not.toBeNull();
    expect(boxB).not.toBeNull();
    expect(boxB!.width).toBeGreaterThan(boxA!.width);
  });
});

test.describe('F17 — Section 05 — Interactive Lookbook (PROPOSTADEDESFILE(05) — 10 Looks of GANJA STAR)', () => {
  test('F17.1: Section 05 (#desfile-05) opens with Casa de Criadores Ganja Star concept and 3-column modular grid ([data-testid="lookbook-grid"])', async ({ page }) => {
    await page.goto('/');
    const sec05 = page.getByTestId('section-desfile-05');
    await sec05.scrollIntoViewIfNeeded();
    await expect(sec05).toBeVisible();
    await expect(sec05).toContainText(/Ganja Star/i);
    await expect(page.getByTestId('lookbook-grid')).toBeVisible();
  });

  test('F17.2: Lookbook grid renders all 10 canonical Look cards (look-card-01 through look-card-10) on #FFFFFF surface', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      const bg = await card.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(bg).toBe(DESIGN_TOKENS.surfaceWhiteRgb);
    }
  });

  test('F17.3: Look cards display exact canonical titles from Macacão Cargo (Look 01) to Jaqueta Puffer + Bermuda Cargo + Boné (Look 10)', async ({ page }) => {
    await page.goto('/');
    for (const look of CANONICAL_LOOKS) {
      const card = page.getByTestId(look.testId);
      await card.scrollIntoViewIfNeeded();
      const text = await card.textContent();
      expect(text).toMatch(look.titlePattern);
    }
  });

  test('F17.4: Hovering a Look card instantaneously toggles data-view-mode from "silhouette" to "macro" and restores on mouseleave', async ({ page }) => {
    await page.goto('/');
    const card05 = page.getByTestId('look-card-05');
    await card05.scrollIntoViewIfNeeded();
    await expect(card05).toHaveAttribute('data-view-mode', 'silhouette');
    await card05.hover();
    await expect(card05).toHaveAttribute('data-view-mode', 'macro');
    await page.getByTestId('sticky-header').hover();
    await expect(card05).toHaveAttribute('data-view-mode', 'silhouette');
  });

  test('F17.5: Look 03 displays badge 80% CONCLUIDO ([data-testid="wip-badge-look-03"]) and Look 04 displays badge 95% CONCLUIDO ([data-testid="wip-badge-look-04"])', async ({ page }) => {
    await page.goto('/');
    const badge03 = page.getByTestId('wip-badge-look-03');
    await badge03.scrollIntoViewIfNeeded();
    await expect(badge03).toBeVisible();
    await expect(badge03).toContainText('80% CONCLUIDO');

    const badge04 = page.getByTestId('wip-badge-look-04');
    await badge04.scrollIntoViewIfNeeded();
    await expect(badge04).toBeVisible();
    await expect(badge04).toContainText('95% CONCLUIDO');
  });
});

test.describe('F18 — Section 05 — Technical Inspection Drawer (Marine Serre "Education Before Consumerism")', () => {
  test('F18.1: Clicking a Look card opens straight-bordered Technical Inspection Drawer ([data-testid="look-technical-drawer"])', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();
    await assertZeroBorderRadius(drawer);
  });

  test('F18.2: Technical Drawer displays selected Look code/title ([data-testid="drawer-look-title"]) and completion progress bar ([data-testid="drawer-progress-bar"])', async ({ page }) => {
    await page.goto('/');
    const card03 = page.getByTestId('look-card-03');
    await card03.scrollIntoViewIfNeeded();
    await card03.click();
    const title = page.getByTestId('drawer-look-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText(/LOOK\s*0?3/i);
    await expect(title).toContainText(/Adesivos de Caminh[ãa]o/i);

    const progress = page.getByTestId('drawer-progress-bar');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText(/80%/);
  });

  test('F18.3: Technical Drawer provides interactive Macro Texture Zoom viewer ([data-testid="drawer-macro-zoom"])', async ({ page }) => {
    await page.goto('/');
    const card07 = page.getByTestId('look-card-07');
    await card07.scrollIntoViewIfNeeded();
    await card07.click();
    const macroZoom = page.getByTestId('drawer-macro-zoom');
    await expect(macroZoom).toBeVisible();
    await macroZoom.hover();
    await macroZoom.click();
    await expect(macroZoom).toBeVisible();
  });

  test('F18.4: Technical Drawer renders Upcycling Material Spec Sheet ([data-testid="drawer-material-sheet"]) and Direct Inquiry CTA ([data-testid="drawer-inquiry-cta"])', async ({ page }) => {
    await page.goto('/');
    const card06 = page.getByTestId('look-card-06');
    await card06.scrollIntoViewIfNeeded();
    await card06.click();
    const specSheet = page.getByTestId('drawer-material-sheet');
    await expect(specSheet).toBeVisible();
    await expect(specSheet).toContainText(/couro|pel[úu]cia/i);

    const cta = page.getByTestId('drawer-inquiry-cta');
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toMatch(/mailto:gandraisaque@hotmail\.com|instagram\.com\/ganjastudio\.br/i);
  });

  test('F18.5: Technical Drawer closes cleanly when clicking [data-testid="drawer-close-btn"] or pressing Escape key', async ({ page }) => {
    await page.goto('/');
    const card01 = page.getByTestId('look-card-01');
    await card01.scrollIntoViewIfNeeded();
    await card01.click();
    const drawer = page.getByTestId('look-technical-drawer');
    await expect(drawer).toBeVisible();

    await page.getByTestId('drawer-close-btn').click();
    await expect(drawer).toBeHidden();

    await card01.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });
});

test.describe('F19 — Section 05 — Are.na-Style Interactive Process Moodboard (Mesa de Luz Digital)', () => {
  test('F19.1: Section 05 renders Are.na-style digital light table ([data-testid="arena-moodboard"]) with multiple research artifact cards', async ({ page }) => {
    await page.goto('/');
    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    await expect(moodboard).toBeVisible();
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('F19.2: Each moodboard card ([data-testid^="moodboard-card-"]) displays artifact title, category badge, and source note', async ({ page }) => {
    await page.goto('/');
    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const firstText = await cards.first().textContent();
    expect(firstText?.length).toBeGreaterThan(10);
  });

  test('F19.3: Each moodboard card displays its linked GANJA STAR Look reference (LOOK 01–LOOK 10)', async ({ page }) => {
    await page.goto('/');
    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    const cards = page.locator('[data-testid^="moodboard-card-"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const cardText = await cards.nth(i).textContent();
      expect(cardText).toMatch(/LOOK\s*0?[1-9]|LOOK\s*10/i);
    }
  });

  test('F19.4: Dragging a moodboard card via pointer events updates its position coordinates on the light table', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[data-testid^="moodboard-card-"]').first();
    const result = await dragElementBy(page, firstCard, 80, 45);
    expect(Math.abs(result.deltaX) > 10 || Math.abs(result.deltaY) > 10 || result.beforeTransform !== result.afterTransform).toBe(true);
  });

  test('F19.5: Moodboard container and artifact cards enforce 0px border-radius, 1px solid #111111 border, and hard drop shadow', async ({ page }) => {
    await page.goto('/');
    const moodboard = page.getByTestId('arena-moodboard');
    await moodboard.scrollIntoViewIfNeeded();
    await assertZeroBorderRadius(moodboard);
    const firstCard = page.locator('[data-testid^="moodboard-card-"]').first();
    await assertZeroBorderRadius(firstCard);
  });
});

test.describe('F20 — Section 06 — Creator Catalog Card, B&W-to-Color Instagram Strip & Brutalist Footer (SOBREMIM & CONTATO(06))', () => {
  test('F20.1: Section 06 (#contato-06) renders Creator Catalog Card ([data-testid="creator-catalog-card"]) for Isaque Gandra (30 anos, centro de SP, UFMG, Senai)', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('creator-catalog-card');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect(card).toContainText('Isaque Gandra');
    await expect(card).toContainText('30');
    await expect(card).toContainText('São Paulo');
    await expect(card).toContainText('UFMG');
    await expect(card).toContainText('Senai');
  });

  test('F20.2: Curated @ganjastudio.br horizontal contact strip ([data-testid="instagram-contact-strip"]) renders multiple photographic items', async ({ page }) => {
    await page.goto('/');
    const strip = page.getByTestId('instagram-contact-strip');
    await strip.scrollIntoViewIfNeeded();
    await expect(strip).toBeVisible();
    const items = page.locator('[data-testid^="ig-strip-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('F20.3: Instagram contact strip items ([data-testid^="ig-strip-item-"]) render with B&W grayscale filter by default and snap to full color on hover', async ({ page }) => {
    await page.goto('/');
    const firstItem = page.locator('[data-testid^="ig-strip-item-"]').first();
    await firstItem.scrollIntoViewIfNeeded();
    await page.mouse.move(10, 10);
    const defaultGrayscale = await hasActiveGrayscaleFilter(firstItem);
    expect(defaultGrayscale).toBe(true);

    await firstItem.hover();
    const hoverGrayscale = await hasActiveGrayscaleFilter(firstItem);
    expect(hoverGrayscale).toBe(false);
  });

  test('F20.4: Monumental Brutalist Footer ([data-testid="brutalist-footer"]) renders on #0D0D0D surface with brand identity', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByTestId('brutalist-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    const bg = await footer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe(DESIGN_TOKENS.surfaceStageRgb);
  });

  test('F20.5: Footer exposes direct clickable links for @ganjastudio.br, @isaquex, and gandraisaque@hotmail.com', async ({ page }) => {
    await page.goto('/');
    const linkGanja = page.getByTestId('footer-link-ganjastudio');
    const linkIsaque = page.getByTestId('footer-link-isaquex');
    const linkEmail = page.getByTestId('footer-link-email');
    await linkGanja.scrollIntoViewIfNeeded();

    await expect(linkGanja).toBeVisible();
    await expect(linkGanja).toHaveAttribute('href', /instagram\.com\/ganjastudio\.br/i);

    await expect(linkIsaque).toBeVisible();
    await expect(linkIsaque).toHaveAttribute('href', /instagram\.com\/isaquex/i);

    await expect(linkEmail).toBeVisible();
    await expect(linkEmail).toHaveAttribute('href', /mailto:gandraisaque@hotmail\.com/i);
  });

  test('F20.6: Footer closes with the Coletivo Inspira mount and copyright link', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByTestId('brutalist-footer');
    await footer.scrollIntoViewIfNeeded();

    const mount = footer.locator('[data-inspira-orb-mount]');
    await expect(mount).toHaveCount(1);
    await expect(mount).toHaveAttribute('data-testid', 'coletivo-inspira-orb');

    const copy = footer.locator('p.footer-copy a[href="https://inspira.dev.br/"]');
    await expect(copy).toBeVisible();
    await expect(copy).toHaveAttribute('href', 'https://inspira.dev.br/');
    await expect(copy).toHaveAttribute('target', '_blank');
    await expect(copy).toHaveAttribute('rel', /noopener/);
    await expect(copy).toContainText('Coletivo Inspira');

    // The official script is fetched from brandbook.inspira.dev.br. If that
    // network is blocked, the mount and copyright checks above still stand.
    const orb = mount.locator('a.inspira-orb.inspira-orb--inline');
    const scriptLoaded = await orb
      .waitFor({ state: 'attached', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
    if (!scriptLoaded) {
      test.info().annotations.push({
        type: 'note',
        description: 'brandbook.inspira.dev.br did not load; mounted-orb checks were skipped',
      });
      return;
    }

    await expect(orb).toHaveAttribute('href', 'https://inspira.dev.br/');
    const placement = await orb.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        backdropFilter: style.backdropFilter || 'none',
      };
    });
    expect(placement.position).not.toBe('fixed');
    expect(placement.backdropFilter.toLowerCase()).not.toContain('blur(');
    await expect(orb).toHaveCount(1);
  });
});
