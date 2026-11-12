import { expect, test } from '@playwright/test';

test.describe('Issue 3 — header index accessible names', () => {
  test('A01: every header cell exposes a readable accessible name and keeps its glued visible label', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Índice Arquivístico GANJA STUDIO' });
    const cases: Array<[string, string]> = [
      ['GANJA STUDIO — início', 'GANJASTUDIO'],
      ['01. De onde veio?', 'DEONDEVEIO?(01)'],
      ['02. Público-alvo', 'PUBLICOALVO(02)'],
      ['03. Atuação da marca', 'ATUAÇÃODAMARCA(03)'],
      ['04. Frentes de criação', 'FRENTESDECRIAÇÃO(04)'],
      ['05. Proposta de desfile', 'PROPOSTADEDESFILE(05)'],
      ['06. Contato', 'CONTATO(06)'],
    ];
    for (const [name, visible] of cases) {
      const button = nav.getByRole('button', { name, exact: true });
      await expect(button).toBeVisible();
      await expect(button).toHaveText(visible);
    }
  });

  test('A03: letter-spaced Section 01 copy and the marquee are exposed as words, not single letters', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#origem-01');
    const snapshot = await section.ariaSnapshot();
    expect(snapshot).toContain('heading "DE ONDE VEIO? 01"');
    expect(snapshot).toContain('CRIADA EM 2022');
    expect(snapshot).not.toMatch(/D E O N D E|C R I A D A/);

    const marquee = page.getByTestId('kinetic-marquee');
    const marqueeSnapshot = await marquee.ariaSnapshot();
    expect(marqueeSnapshot).toContain('CRIADA EM 2022 — DE ONDE VEIO?');
    expect(marqueeSnapshot).not.toMatch(/C R I A D A/);

    const srOnly = await marquee.locator('.sr-only').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, width: cs.width, overflow: cs.overflow };
    });
    expect(srOnly).toEqual({ position: 'absolute', width: '1px', overflow: 'hidden' });
  });

  test('A02: activating "05. Proposta de desfile" by its accessible name scrolls to the lookbook', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '05. Proposta de desfile', exact: true }).click();
    await expect
      .poll(async () => page.locator('#desfile-05').evaluate((el) => Math.abs(el.getBoundingClientRect().top)))
      .toBeLessThan(120);
  });
});
