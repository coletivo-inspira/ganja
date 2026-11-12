import { expect, type Locator, type Page } from '@playwright/test';

export const DESIGN_TOKENS = {
  surfacePaperHex: '#F4F3EF',
  surfacePaperRgb: 'rgb(244, 243, 239)',
  surfaceWhiteHex: '#FFFFFF',
  surfaceWhiteRgb: 'rgb(255, 255, 255)',
  surfaceStageHex: '#0D0D0D',
  surfaceStageRgb: 'rgb(13, 13, 13)',
  surfaceCharcoalHex: '#1A1A1A',
  surfaceCharcoalRgb: 'rgb(26, 26, 26)',
  structuralInkHex: '#111111',
  structuralInkRgb: 'rgb(17, 17, 17)',
  accentRedHex: '#D92B2B',
  accentRedRgb: 'rgb(217, 43, 43)',
  accentYellowHex: '#F5C400',
  accentYellowRgb: 'rgb(245, 196, 0)',
  accentGreenHex: '#008055',
  accentGreenRgb: 'rgb(0, 128, 85)',
} as const;

export interface NavCellContract {
  testId: string;
  rawText: string;
  labelPart: string;
  indexPart?: string;
  targetSectionId: string;
  sectionTestId: string;
}

export const NAV_CELLS: readonly NavCellContract[] = [
  {
    testId: 'nav-cell-brand',
    rawText: 'GANJASTUDIO',
    labelPart: 'GANJASTUDIO',
    targetSectionId: 'hero-00',
    sectionTestId: 'section-hero-00',
  },
  {
    testId: 'nav-cell-01',
    rawText: 'DEONDEVEIO?(01)',
    labelPart: 'DEONDEVEIO?',
    indexPart: '(01)',
    targetSectionId: 'origem-01',
    sectionTestId: 'section-origem-01',
  },
  {
    testId: 'nav-cell-02',
    rawText: 'PUBLICOALVO(02)',
    labelPart: 'PUBLICOALVO',
    indexPart: '(02)',
    targetSectionId: 'publico-02',
    sectionTestId: 'section-publico-02',
  },
  {
    testId: 'nav-cell-03',
    rawText: 'ATUAÇÃODAMARCA(03)',
    labelPart: 'ATUAÇÃODAMARCA',
    indexPart: '(03)',
    targetSectionId: 'atuacao-03',
    sectionTestId: 'section-atuacao-03',
  },
  {
    testId: 'nav-cell-04',
    rawText: 'FRENTESDECRIAÇÃO(04)',
    labelPart: 'FRENTESDECRIAÇÃO',
    indexPart: '(04)',
    targetSectionId: 'frentes-04',
    sectionTestId: 'section-frentes-04',
  },
  {
    testId: 'nav-cell-05',
    rawText: 'PROPOSTADEDESFILE(05)',
    labelPart: 'PROPOSTADEDESFILE',
    indexPart: '(05)',
    targetSectionId: 'desfile-05',
    sectionTestId: 'section-desfile-05',
  },
  {
    testId: 'nav-cell-06',
    rawText: 'CONTATO(06)',
    labelPart: 'CONTATO',
    indexPart: '(06)',
    targetSectionId: 'contato-06',
    sectionTestId: 'section-contato-06',
  },
] as const;

export interface StickerContract {
  testId: string;
  id: string;
  label: string;
  textPattern: RegExp;
}

export const HERO_STICKERS: readonly StickerContract[] = [
  {
    testId: 'draggable-sticker-sticker-gsh-2168',
    id: 'sticker-gsh-2168',
    label: 'GSH-2168',
    textPattern: /GSH-2168/i,
  },
  {
    testId: 'draggable-sticker-sticker-ganja-25g',
    id: 'sticker-ganja-25g',
    label: 'GANJA 25G',
    textPattern: /GANJA\s*25G/i,
  },
  {
    testId: 'draggable-sticker-sticker-ozempic',
    id: 'sticker-ozempic',
    label: 'GOD SAVE BEARS FROM OZEMPIC',
    textPattern: /GOD SAVE BEARS FROM OZEMPIC/i,
  },
  {
    testId: 'draggable-sticker-sticker-caminhao',
    id: 'sticker-caminhao',
    label: 'Não me siga estou perdida',
    textPattern: /N[ãa]o me siga estou perdida/i,
  },
  {
    testId: 'draggable-sticker-sticker-ganja-star',
    id: 'sticker-ganja-star',
    label: 'G★NJ★',
    textPattern: /G★NJ★|GNJ|GANJA/i,
  },
] as const;

export interface StageRowContract {
  testId: string;
  id: string;
  displayLabel: string;
  artistName: string;
  artistPattern: RegExp;
  rolePattern: RegExp;
}

export const STAGE_ROWS: readonly StageRowContract[] = [
  {
    testId: 'stage-row-anitta',
    id: 'anitta',
    displayLabel: 'ANITTA (SHOWS)',
    artistName: 'Anitta',
    artistPattern: /ANITTA/i,
    rolePattern: /SHOWS/i,
  },
  {
    testId: 'stage-row-marina-sena',
    id: 'marina-sena',
    displayLabel: 'MARINA SENA (VIDEOCLIPE & PALCO)',
    artistName: 'Marina Sena',
    artistPattern: /MARINA SENA/i,
    rolePattern: /VIDEOCLIPE\s*&\s*PALCO/i,
  },
  {
    testId: 'stage-row-pedro-sampaio',
    id: 'pedro-sampaio',
    displayLabel: 'PEDRO SAMPAIO (FIGURINO BALLET)',
    artistName: 'Pedro Sampaio',
    artistPattern: /PEDRO SAMPAIO/i,
    rolePattern: /FIGURINO BALLET/i,
  },
  {
    testId: 'stage-row-kendrick-lamar',
    id: 'kendrick-lamar',
    displayLabel: 'KENDRICK LAMAR (FIGURINO BALLET)',
    artistName: 'Kendrick Lamar',
    artistPattern: /KENDRICK LAMAR/i,
    rolePattern: /FIGURINO BALLET/i,
  },
] as const;

export interface LookContract {
  number: number;
  testId: string;
  code: string;
  shortCode: string;
  titlePattern: RegExp;
  completionPercent: number;
  isWorkInProgress: boolean;
  wipBadgeTestId?: string;
  wipBadgeText?: string;
  exactCursorTag?: string;
}

export const CANONICAL_LOOKS: readonly LookContract[] = [
  {
    number: 1,
    testId: 'look-card-01',
    code: 'LOOK 01',
    shortCode: 'LOOK 1',
    titlePattern: /Macac[ãa]o Cargo/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 2,
    testId: 'look-card-02',
    code: 'LOOK 02',
    shortCode: 'LOOK 2',
    titlePattern: /Cal[çc]a Cargo.*Ozempic|Camiseta Ozempic/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 3,
    testId: 'look-card-03',
    code: 'LOOK 03',
    shortCode: 'LOOK 3',
    titlePattern: /Adesivos de Caminh[ãa]o/i,
    completionPercent: 80,
    isWorkInProgress: true,
    wipBadgeTestId: 'wip-badge-look-03',
    wipBadgeText: '80% CONCLUIDO',
  },
  {
    number: 4,
    testId: 'look-card-04',
    code: 'LOOK 04',
    shortCode: 'LOOK 4',
    titlePattern: /Short Guerrilha.*Regatinha Ganja Star/i,
    completionPercent: 95,
    isWorkInProgress: true,
    wipBadgeTestId: 'wip-badge-look-04',
    wipBadgeText: '95% CONCLUIDO',
  },
  {
    number: 5,
    testId: 'look-card-05',
    code: 'LOOK 05',
    shortCode: 'LOOK 5',
    titlePattern: /Moletom Legalize J[áa]/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 6,
    testId: 'look-card-06',
    code: 'LOOK 06',
    shortCode: 'LOOK 6',
    titlePattern: /retalhos de couro e pel[úu]cia/i,
    completionPercent: 100,
    isWorkInProgress: false,
    exactCursorTag: '[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]',
  },
  {
    number: 7,
    testId: 'look-card-07',
    code: 'LOOK 07',
    shortCode: 'LOOK 7',
    titlePattern: /retalhos de couro/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 8,
    testId: 'look-card-08',
    code: 'LOOK 08',
    shortCode: 'LOOK 8',
    titlePattern: /Vestido.*retalhos/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 9,
    testId: 'look-card-09',
    code: 'LOOK 09',
    shortCode: 'LOOK 9',
    titlePattern: /Conjunto/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
  {
    number: 10,
    testId: 'look-card-10',
    code: 'LOOK 10',
    shortCode: 'LOOK 10',
    titlePattern: /Jaqueta Puffer.*Bermuda Cargo.*Bon[ée]/i,
    completionPercent: 100,
    isWorkInProgress: false,
  },
] as const;

export async function assertZeroBorderRadius(locator: Locator): Promise<void> {
  const radii = await locator.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      topLeft: s.borderTopLeftRadius,
      topRight: s.borderTopRightRadius,
      bottomRight: s.borderBottomRightRadius,
      bottomLeft: s.borderBottomLeftRadius,
    };
  });
  expect(radii.borderRadius).toBe('0px');
  expect(radii.topLeft).toBe('0px');
  expect(radii.topRight).toBe('0px');
  expect(radii.bottomRight).toBe('0px');
  expect(radii.bottomLeft).toBe('0px');
}

export async function assertNoBackdropBlur(locator: Locator): Promise<void> {
  const filters = await locator.evaluate((el) => {
    const s = window.getComputedStyle(el);
    const webkit = (s as unknown as Record<string, string>).webkitBackdropFilter || 'none';
    return {
      backdropFilter: s.backdropFilter || 'none',
      webkitBackdropFilter: webkit,
    };
  });
  expect(filters.backdropFilter.toLowerCase()).not.toContain('blur(');
  expect(filters.webkitBackdropFilter.toLowerCase()).not.toContain('blur(');
}

export function isHardDropShadow(boxShadow: string): boolean {
  if (!boxShadow || boxShadow === 'none') {
    return false;
  }
  // Browser normalizes box-shadow to e.g. "rgb(17, 17, 17) 4px 4px 0px 0px" or "4px 4px 0px rgb(17, 17, 17)"
  const has4pxOffset = /4px\s+4px\s+0px/.test(boxShadow);
  return has4pxOffset;
}

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
}

export interface DragResult {
  beforeX: number;
  beforeY: number;
  afterX: number;
  afterY: number;
  deltaX: number;
  deltaY: number;
  beforeTransform: string;
  afterTransform: string;
}

export async function dragElementBy(
  page: Page,
  locator: Locator,
  dx: number,
  dy: number
): Promise<DragResult> {
  await locator.scrollIntoViewIfNeeded();
  const beforeBox = await locator.boundingBox();
  expect(beforeBox).not.toBeNull();
  const bBox = beforeBox!;
  const beforeTransform = await locator.evaluate((el) => window.getComputedStyle(el).transform);

  const startX = bBox.x + bBox.width / 2;
  const startY = bBox.y + bBox.height / 2;
  const endX = startX + dx;
  const endY = startY + dy;

  // Dispatch pointer and mouse sequence for universal React pointer/mouse handler support
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dx / 2, startY + dy / 2, { steps: 4 });
  await page.mouse.move(endX, endY, { steps: 4 });
  await page.mouse.up();

  const afterBox = await locator.boundingBox();
  expect(afterBox).not.toBeNull();
  const aBox = afterBox!;
  const afterTransform = await locator.evaluate((el) => window.getComputedStyle(el).transform);

  return {
    beforeX: bBox.x,
    beforeY: bBox.y,
    afterX: aBox.x,
    afterY: aBox.y,
    deltaX: aBox.x - bBox.x,
    deltaY: aBox.y - bBox.y,
    beforeTransform,
    afterTransform,
  };
}

export async function hasActiveGrayscaleFilter(locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => {
    const candidates: Element[] = [el, ...Array.from(el.querySelectorAll('*'))];
    return candidates.some((node) => {
      const f = window.getComputedStyle(node).filter || '';
      if (!f || f === 'none') return false;
      const match = f.match(/grayscale\(([^)]+)\)/i);
      if (!match) return false;
      const val = parseFloat(match[1]);
      return !Number.isNaN(val) && val > 0;
    });
  });
}
