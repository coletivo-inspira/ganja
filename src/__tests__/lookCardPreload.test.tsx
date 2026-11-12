import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LookCard } from '../components/LookCard';
import { KineticMarquee } from '../components/KineticMarquee';
import { LOOKS_CATALOG } from '../data/collection';

const look = LOOKS_CATALOG.find((item) => item.id === 'look-06')!;

describe('Issue 6 — macro preload and red-on-dark contrast', () => {
  it('mounts silhouette and macro plates together so the macro is fetched before hover', () => {
    render(<LookCard look={look} onSelect={vi.fn()} />);
    const card = screen.getByTestId('look-card-06');
    const silhouette = card.querySelector<HTMLImageElement>('img[data-plate="silhouette"]')!;
    const macro = card.querySelector<HTMLImageElement>('img[data-plate="macro"]')!;

    expect(silhouette.getAttribute('src')).toBe(look.silhouetteImage);
    expect(macro.getAttribute('src')).toBe(look.macroImage);
    expect(silhouette).toHaveStyle({ opacity: '1' });
    expect(macro).toHaveStyle({ opacity: '0' });
    expect(macro).toHaveAttribute('aria-hidden', 'true');
    expect(macro).toHaveAttribute('alt', '');
  });

  it('swaps plates with a dry 0ms opacity cut and keeps a single announced image', () => {
    render(<LookCard look={look} onSelect={vi.fn()} />);
    const card = screen.getByTestId('look-card-06');
    fireEvent.mouseEnter(card);

    expect(card).toHaveAttribute('data-view-mode', 'macro');
    const silhouette = card.querySelector<HTMLImageElement>('img[data-plate="silhouette"]')!;
    const macro = card.querySelector<HTMLImageElement>('img[data-plate="macro"]')!;
    expect(macro).toHaveStyle({ opacity: '1', transitionDuration: '0ms' });
    expect(silhouette).toHaveStyle({ opacity: '0' });
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveAttribute('alt', `${look.code} — ${look.title} (macro)`);

    fireEvent.mouseLeave(card);
    expect(card).toHaveAttribute('data-view-mode', 'silhouette');
    expect(silhouette).toHaveStyle({ opacity: '1' });
  });

  it('keeps the dark kinetic marquee free of Vermelho Manifesto text', () => {
    render(<KineticMarquee text="G★NJ★ STAR" />);
    const marquee = screen.getByTestId('kinetic-marquee');
    expect(marquee.innerHTML).not.toContain('#D92B2B');
  });
});
