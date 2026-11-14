import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ArenaMoodboard } from '../components/ArenaMoodboard';
import { LookTechnicalDrawer } from '../components/LookTechnicalDrawer';
import { LONG_PRESS_MS } from '../components/useTouchDragGate';
import { LOOKS_CATALOG } from '../data/collection';
import { MOODBOARD_ARTIFACTS } from '../data/moodboard';
import { getLookInquiry, getUniquePieceMeasurements, MEASUREMENT_FIELDS } from '../data/lookInquiry';

const lookByCode = (code: string) => LOOKS_CATALOG.find((look) => look.code === code)!;

describe('#12 — Mesa de Luz reset', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns every dragged moodboard card to its original position', () => {
    render(<ArenaMoodboard />);
    const card = screen.getByTestId(`moodboard-card-${MOODBOARD_ARTIFACTS[0].id}`);
    const touch = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 3, pointerType: 'touch' });

    fireEvent.pointerDown(card, touch(10, 10));
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    fireEvent.pointerMove(card, touch(70, 90));
    fireEvent.pointerUp(card, touch(70, 90));
    expect(card).toHaveAttribute('data-offset-y', '80');

    const reset = screen.getByTestId('reset-moodboard');
    expect(reset).toHaveTextContent('[RESETAR MESA DE LUZ]');
    expect(reset.className).toContain('font-mono-tech');
    fireEvent.click(reset);
    expect(card).toHaveAttribute('data-offset-x', '0');
    expect(card).toHaveAttribute('data-offset-y', '0');
  });
});

describe('#15 — drawer by front and WIP', () => {
  it('uses the "fila de pré-reserva" CTA for every WIP look and keeps the look ID in the e-mail', () => {
    for (const look of LOOKS_CATALOG.filter((item) => item.isWorkInProgress)) {
      const inquiry = getLookInquiry(look);
      expect(inquiry.label).toBe('ENTRAR NA FILA DE PRÉ-RESERVA DO ATELIÊ');
      const url = new URL(inquiry.href);
      expect(url.pathname).toBe('gandraisaque@hotmail.com');
      expect(url.searchParams.get('subject')).toContain(look.code);
    }
  });

  it('shows the 1/1 seal and a fixed measurement table on unique pieces, "sob consulta" until the brand supplies data', () => {
    render(<LookTechnicalDrawer look={lookByCode('LOOK 06')} onClose={vi.fn()} />);
    expect(screen.getByTestId('drawer-unique-seal')).toHaveTextContent('[PEÇA ÚNICA 1/1 // ARQUIVO VIVO]');
    const table = screen.getByTestId('drawer-measurements');
    const rows = within(table).getAllByRole('row');
    expect(rows.map((row) => within(row).getByRole('rowheader').textContent)).toEqual([...MEASUREMENT_FIELDS]);
    rows.forEach((row) => expect(within(row).getByRole('cell')).toHaveTextContent('SOB CONSULTA'));
    expect(screen.queryByTestId('drawer-size-selector')).toBeNull();
    expect(screen.getByTestId('drawer-inquiry-cta')).toHaveTextContent('SOLICITAR AQUISIÇÃO / ACERVO DE STYLING');
  });

  it('fills the table from brand measurements when present', () => {
    const look = { ...lookByCode('LOOK 07'), measurements: { BUSTO: '96 cm' } };
    expect(getUniquePieceMeasurements(look)[0]).toEqual({ field: 'BUSTO', value: '96 cm' });
    expect(getUniquePieceMeasurements(look)[1].value).toBe('SOB CONSULTA');
  });

  it('renders the small-batch size selector as [P] [M] [G] [GG] and hides the 1/1 table', () => {
    render(<LookTechnicalDrawer look={lookByCode('LOOK 01')} onClose={vi.fn()} />);
    const selector = screen.getByTestId('drawer-size-selector');
    expect(within(selector).getAllByRole('button').map((b) => b.textContent)).toEqual(['[P]', '[M]', '[G]', '[GG]']);
    expect(within(selector).getByRole('button', { name: 'GG' })).toBeInTheDocument();
    expect(screen.queryByTestId('drawer-measurements')).toBeNull();
    expect(screen.getByTestId('drawer-inquiry-cta')).toHaveTextContent('ENCOMENDAR TIRAGEM LIMITADA');
  });

  it('gives a WIP unique piece both the seal and the pre-reserve CTA with its progress bar', () => {
    render(<LookTechnicalDrawer look={lookByCode('LOOK 03')} onClose={vi.fn()} />);
    expect(screen.getByTestId('drawer-unique-seal')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-progress-bar')).toHaveAttribute('data-percent', '80');
    expect(screen.getByTestId('drawer-inquiry-cta')).toHaveTextContent('ENTRAR NA FILA DE PRÉ-RESERVA DO ATELIÊ — LOOK 03');
  });
});
