import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StickyHeader } from '../components/StickyHeader';

const EXPECTED = [
  ['nav-cell-brand', 'GANJA STUDIO — início', 'GANJASTUDIO'],
  ['nav-cell-01', '01. De onde veio?', 'DEONDEVEIO?(01)'],
  ['nav-cell-02', '02. Público-alvo', 'PUBLICOALVO(02)'],
  ['nav-cell-03', '03. Atuação da marca', 'ATUAÇÃODAMARCA(03)'],
  ['nav-cell-04', '04. Frentes de criação', 'FRENTESDECRIAÇÃO(04)'],
  ['nav-cell-05', '05. Proposta de desfile', 'PROPOSTADEDESFILE(05)'],
  ['nav-cell-06', '06. Contato', 'CONTATO(06)'],
] as const;

describe('Issue 3 — readable screen-reader names for the glued header index', () => {
  it.each(EXPECTED)('%s is announced as "%s" while still showing %s', (testId, label, visible) => {
    render(<StickyHeader />);
    const cell = screen.getByTestId(testId);
    expect(cell).toHaveAttribute('aria-label', label);
    expect(cell.textContent).toBe(visible);
    expect(screen.getByRole('button', { name: label })).toBe(cell);
  });
});
