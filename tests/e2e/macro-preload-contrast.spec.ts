import { expect, test, type Page } from '@playwright/test';

async function failingRedOnDark(page: Page) {
  return page.evaluate(() => {
    type Rgb = { r: number; g: number; b: number; a: number };
    const parse = (c: string): Rgb | null => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(',').map(Number);
      return { r, g, b, a };
    };
    const lum = ({ r, g, b }: Rgb) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const bgOf = (el: Element): Rgb => {
      for (let n: Element | null = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0.5) return c;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const failures: string[] = [];
    for (const el of document.querySelectorAll('body *')) {
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
      if (!hasText) continue;
      const fg = parse(getComputedStyle(el).color);
      if (!fg || fg.r !== 217 || fg.g !== 43 || fg.b !== 43) continue;
      const bg = bgOf(el);
      if (lum(bg) > 0.2) continue;
      const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
      if (ratio < 4.5) failures.push(`${ratio.toFixed(2)}:1 "${el.textContent?.trim().slice(0, 40)}"`);
    }
    return failures;
  });
}

test.describe('Issue 6 — macro preload and red-on-dark contrast', () => {
  test('P01: every Lookbook macro plate is already decoded before the first hover', async ({ page }) => {
    await page.goto('/');
    const grid = page.getByTestId('lookbook-grid');
    await grid.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        grid.evaluate((g) =>
          Array.from(g.querySelectorAll<HTMLImageElement>('img[data-plate="macro"]')).map(
            (img) => img.complete && img.naturalWidth > 0
          )
        )
      )
      .toEqual(Array(10).fill(true));

    const card = page.getByTestId('look-card-06');
    await card.hover();
    await expect(card).toHaveAttribute('data-view-mode', 'macro');
    const shown = await card.evaluate((el) =>
      Array.from(el.querySelectorAll<HTMLImageElement>('img[data-plate]'))
        .filter((img) => getComputedStyle(img).opacity === '1')
        .map((img) => img.dataset.plate)
    );
    expect(shown).toEqual(['macro']);
  });

  test('P02: no Vermelho Manifesto text sits below 4.5:1 on a dark background', async ({ page }) => {
    await page.goto('/');
    expect(await failingRedOnDark(page)).toEqual([]);

    await page.getByTestId('stage-row-anitta').hover();
    expect(await failingRedOnDark(page)).toEqual([]);

    await page.getByTestId('look-card-03').click();
    await expect(page.getByTestId('drawer-inquiry-cta')).toBeVisible();
    expect(await failingRedOnDark(page)).toEqual([]);
  });
});
