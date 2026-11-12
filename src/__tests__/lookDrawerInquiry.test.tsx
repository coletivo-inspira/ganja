import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LookTechnicalDrawer } from '../components/LookTechnicalDrawer';
import { LOOKS_CATALOG } from '../data/collection';

describe('Consulta no drawer', () => {
  it('aplica o tamanho ao e-mail e limpa a seleção ao trocar de look', () => {
    const look04 = LOOKS_CATALOG.find((look) => look.code === 'LOOK 04')!;
    const look02 = LOOKS_CATALOG.find((look) => look.code === 'LOOK 02')!;
    const { rerender } = render(<LookTechnicalDrawer look={look04} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'M' }));
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true');
    let link = screen.getByTestId('drawer-inquiry-cta') as HTMLAnchorElement;
    expect(new URL(link.href).searchParams.get('body')).toContain('Tamanho de interesse: M');
    expect(link).toHaveTextContent('PRÉ-RESERVA');
    rerender(<LookTechnicalDrawer look={look02} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'false');
    link = screen.getByTestId('drawer-inquiry-cta') as HTMLAnchorElement;
    expect(new URL(link.href).searchParams.get('body')).toContain('Tamanho de interesse: A confirmar');
    expect(link).toHaveTextContent('ENCOMENDAR TIRAGEM LIMITADA');
  });
});
