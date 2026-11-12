import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');

describe('Sections 05–06 — Lookbook, Technical Drawer, Moodboard, Contact', () => {
  it('shows 80% and 95% CONCLUIDO badges and swaps silhouette to macro', () => {
    render(<App />);
    expect(screen.getByTestId('wip-badge-look-03')).toHaveTextContent('80% CONCLUIDO');
    expect(screen.getByTestId('wip-badge-look-04')).toHaveTextContent('95% CONCLUIDO');

    const card03 = screen.getByTestId('look-card-03');
    expect(card03).toHaveAttribute('data-view-mode', 'silhouette');
    fireEvent.mouseEnter(card03);
    expect(card03).toHaveAttribute('data-view-mode', 'macro');
    fireEvent.mouseLeave(card03);
    expect(card03).toHaveAttribute('data-view-mode', 'silhouette');
  });

  it('opens the technical drawer with the material sheet, progress, and inquiry link', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('look-card-03'));

    const drawer = screen.getByTestId('look-technical-drawer');
    expect(drawer).toBeInTheDocument();
    expect(screen.getByTestId('drawer-look-title')).toHaveTextContent('LOOK 03');
    expect(screen.getByTestId('drawer-macro-zoom')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-material-sheet')).toHaveTextContent(/upcycling|matéria|materia/i);
    expect(screen.getByTestId('drawer-progress-bar')).toHaveAttribute('data-percent', '80');
    expect(screen.getByTestId('drawer-progress-bar')).toHaveTextContent('80% CONCLUIDO');

    const inquiry = screen.getByTestId('drawer-inquiry-cta');
    expect(inquiry.getAttribute('href') || '').toMatch(/mailto:gandraisaque@hotmail\.com/i);

    fireEvent.click(screen.getByTestId('drawer-close-btn'));
    expect(screen.queryByTestId('look-technical-drawer')).toBeNull();

    fireEvent.click(screen.getByTestId('look-card-04'));
    expect(screen.getByTestId('drawer-progress-bar')).toHaveAttribute('data-percent', '95');
    expect(screen.getByTestId('drawer-look-title')).toHaveTextContent('LOOK 04');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('look-technical-drawer')).toBeNull();
  });

  it('drags an Are.na moodboard card across the light table', () => {
    render(<App />);
    const board = screen.getByTestId('arena-moodboard');
    const card = screen.getByTestId('moodboard-card-artifact-placa-gsh-2168');
    expect(card).toHaveAttribute('data-linked-look', 'LOOK 03');
    expect(card).toHaveAttribute('data-offset-x', '0');

    fireEvent.pointerDown(card, { clientX: 30, clientY: 40, pointerId: 3 });
    fireEvent.pointerMove(board, { clientX: 110, clientY: 90, pointerId: 3 });
    fireEvent.pointerUp(board, { pointerId: 3 });

    expect(card.getAttribute('data-offset-x')).toBe('80');
    expect(card.getAttribute('data-offset-y')).toBe('50');
  });

  it('renders the B&W Instagram strip and brutalist footer links', () => {
    render(<App />);
    const strip = screen.getByTestId('instagram-contact-strip');
    const items = strip.querySelectorAll('[data-testid^="ig-strip-item-"]');
    expect(items.length).toBe(6);
    for (const item of items) {
      expect(item.className).toContain('ig-strip-filter');
    }
    expect(css).toContain('grayscale(100%) contrast(125%)');
    expect(css).toContain('grayscale(0%) contrast(100%)');
    expect(css).not.toContain('backdrop-filter: blur(');

    expect(screen.getByTestId('creator-catalog-card')).toHaveTextContent('Isaque Gandra');
    expect(screen.getByTestId('footer-link-ganjastudio').getAttribute('href') || '').toMatch(
      /instagram\.com\/ganjastudio\.br/i
    );
    expect(screen.getByTestId('footer-link-isaquex').getAttribute('href') || '').toMatch(
      /instagram\.com\/isaquex/i
    );
    expect(screen.getByTestId('footer-link-email').getAttribute('href') || '').toMatch(
      /mailto:gandraisaque@hotmail\.com/i
    );

    const mount = screen.getByTestId('coletivo-inspira-orb');
    expect(mount).toHaveAttribute('data-inspira-orb-mount');
    const copy = screen.getByRole('link', { name: 'Coletivo Inspira' });
    expect(copy).toHaveAttribute('href', 'https://inspira.dev.br/');
    expect(copy).toHaveAttribute('target', '_blank');
    expect(copy.getAttribute('rel') || '').toContain('noopener');
  });
});
