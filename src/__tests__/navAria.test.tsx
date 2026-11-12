import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StickyHeader } from '../components/StickyHeader';
import { OriginManifestoSection } from '../components/OriginManifestoSection';
import { KineticMarquee } from '../components/KineticMarquee';

const EXPECTED = [
  ['nav-cell-brand', 'GANJA STUDIO — início', 'GANJASTUDIO'],
  ['nav-cell-01', '01. De onde veio?', 'DEONDEVEIO?(01)'],
  ['nav-cell-02', '02. Público-alvo', 'PUBLICOALVO(02)'],
  ['nav-cell-03', '03. Atuação da marca', 'ATUAÇÃODAMARCA(03)'],
  ['nav-cell-04', '04. Frentes de criação', 'FRENTESDECRIAÇÃO(04)'],
  ['nav-cell-05', '05. Proposta de desfile', 'PROPOSTADEDESFILE(05)'],
  ['nav-cell-06', '06. Contato', 'CONTATO(06)'],
] as const;

describe('Issue 3 — letter-spaced typography stays readable for screen readers', () => {
  it('announces the Section 01 heading as words while keeping the spaced glyphs visible', () => {
    render(<OriginManifestoSection />);
    const heading = screen.getByRole('heading', { name: 'DE ONDE VEIO? 01' });
    expect(heading).toBe(screen.getByTestId('kinetic-title-origem'));
    expect(heading.querySelector('[aria-hidden="true"]')).toHaveTextContent('D E O N D E V E I O ? 01');
    expect(screen.getByText('CRIADA EM 2022')).toHaveClass('sr-only');
  });

  it('hides the animated marquee row and exposes one readable copy', () => {
    render(<KineticMarquee />);
    const marquee = screen.getByTestId('kinetic-marquee');
    const readable = marquee.querySelector('.sr-only');
    expect(readable).toHaveTextContent(
      'CRIADA EM 2022 — DE ONDE VEIO? — UFMG + SENAI — ENGENHARIA REVERSA DO VESTUÁRIO — GANJA STAR'
    );
    expect(marquee.querySelector('.animate-brutal-marquee')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Issue 3 — readable screen-reader names for the glued header index', () => {
  it.each(EXPECTED)('%s is announced as "%s" while still showing %s', (testId, label, visible) => {
    render(<StickyHeader />);
    const cell = screen.getByTestId(testId);
    expect(cell).toHaveAttribute('aria-label', label);
    expect(cell.textContent).toBe(visible);
    expect(screen.getByRole('button', { name: label })).toBe(cell);
  });
});
