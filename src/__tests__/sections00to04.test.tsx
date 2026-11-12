import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { publishStudioScroll } from '../scroll/studioScroll';

describe('Sections 00–04 — Hero, Origin, Stage Proof, Dual Architecture', () => {
  it('drags an urban sticker and updates its offset coordinates', () => {
    render(<App />);
    const sticker = screen.getByTestId('draggable-sticker-sticker-gsh-2168');
    expect(sticker).toHaveAttribute('data-offset-x', '0');
    expect(sticker).toHaveAttribute('data-offset-y', '0');
    expect(sticker.querySelector('[data-testid="sticker-gloss-layer"]')).not.toBeNull();

    fireEvent.pointerDown(sticker, { clientX: 40, clientY: 40, pointerId: 1 });
    fireEvent.pointerMove(sticker, { clientX: 120, clientY: 95, pointerId: 1 });
    fireEvent.pointerUp(sticker, { clientX: 120, clientY: 95, pointerId: 1 });

    expect(sticker.getAttribute('data-offset-x')).toBe('80');
    expect(sticker.getAttribute('data-offset-y')).toBe('55');
  });

  it('tracks kinetic letter-spacing from the shared scroll signal and from window scroll', () => {
    render(<App />);
    const title = screen.getByTestId('kinetic-title-origem');
    expect(title).toHaveAttribute('data-letter-spacing', '0.08em');
    expect(title.style.letterSpacing).toBe('0.08em');
    expect(title.textContent?.replace(/\s+/g, '')).toContain('DEONDEVEIO?');
    expect(screen.getByTestId('kinetic-marquee').textContent?.replace(/\s+/g, '')).toContain('CRIADAEM2022');

    act(() => {
      publishStudioScroll(900);
    });
    expect(title).toHaveAttribute('data-letter-spacing', '0.5em');
    expect(title.style.letterSpacing).toBe('0.5em');

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 450 });
    fireEvent.scroll(window);
    expect(title).toHaveAttribute('data-letter-spacing', '0.29em');
    expect(title.style.letterSpacing).toBe('0.29em');

    const frame = screen.getByTestId('demographic-frame');
    expect(frame).toHaveTextContent('IDADE: 18-35 ANOS');
    expect(frame).toHaveTextContent('PÚBLICO: JOVEM, URBANO E UNDERGROUND');
    expect(frame).toHaveTextContent('LOCAL: DE SÃO PAULO PARA O MUNDO');
  });

  it('reveals the stage rollover for the hovered artist and hides it on leave', () => {
    render(<App />);
    const preview = screen.getByTestId('stage-rollover-preview');
    expect(preview).toHaveAttribute('data-hovering', 'false');
    expect(preview.className).toContain('hidden');
    expect(preview).toHaveStyle({ pointerEvents: 'none' });

    const marina = screen.getByTestId('stage-row-marina-sena');
    fireEvent.mouseEnter(marina, { clientX: 200, clientY: 240 });
    expect(preview).toHaveAttribute('data-hovering', 'true');
    expect(preview).toHaveAttribute('data-artist-id', 'marina-sena');
    expect(preview).toHaveTextContent(/Marina Sena/i);
    expect(preview).toHaveTextContent('Evento');
    expect(preview).toHaveTextContent('Peça');
    expect(preview.className).not.toContain('hidden');

    fireEvent.mouseEnter(screen.getByTestId('stage-row-kendrick-lamar'), { clientX: 220, clientY: 280 });
    expect(preview).toHaveTextContent(/Kendrick Lamar/i);

    fireEvent.mouseLeave(screen.getByTestId('stage-row-kendrick-lamar'));
    expect(preview).toHaveAttribute('data-hovering', 'false');
    expect(preview.className).toContain('hidden');
  });

  it('starts the dual architecture at a 50/50 split and expands the hovered side', () => {
    render(<App />);
    const split = screen.getByTestId('dual-split-container');
    const upcycling = screen.getByTestId('dual-side-upcycling');
    const pequena = screen.getByTestId('dual-side-pequena-escala');

    expect(split).toHaveAttribute('data-active-side', 'balanced');
    expect(upcycling).toHaveAttribute('data-expanded', 'false');
    expect(pequena).toHaveAttribute('data-expanded', 'false');
    expect(upcycling).toHaveStyle({ '--dual-share': '50%' });
    expect(pequena).toHaveStyle({ '--dual-share': '50%' });
    expect(upcycling).toHaveTextContent('LOOK 03');
    expect(upcycling).toHaveTextContent('LOOK 06');
    expect(pequena).toHaveTextContent('LOOK 02');
    expect(pequena).toHaveTextContent('LOOK 05');

    fireEvent.mouseEnter(upcycling);
    expect(split).toHaveAttribute('data-active-side', 'upcycling');
    expect(upcycling).toHaveAttribute('data-expanded', 'true');
    expect(upcycling).toHaveStyle({ '--dual-share': '65%' });
    expect(pequena).toHaveStyle({ '--dual-share': '35%' });

    fireEvent.mouseEnter(pequena);
    expect(split).toHaveAttribute('data-active-side', 'pequena-escala');
    expect(pequena).toHaveAttribute('data-expanded', 'true');
    expect(pequena).toHaveStyle({ '--dual-share': '65%' });
    expect(upcycling).toHaveStyle({ '--dual-share': '35%' });

    fireEvent.mouseLeave(pequena);
    expect(split).toHaveAttribute('data-active-side', 'balanced');
  });
});
