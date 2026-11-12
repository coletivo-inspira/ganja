import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HeroSection } from '../components/HeroSection';
import { ArenaMoodboard } from '../components/ArenaMoodboard';
import { LONG_PRESS_MS } from '../components/useTouchDragGate';

const STICKER = 'draggable-sticker-sticker-gsh-2168';
const touch = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 7, pointerType: 'touch' });

describe('Issue 1 — touch-safe sticker and moodboard dragging', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses pan-y so a touch swipe over a sticker scrolls the page', () => {
    render(<HeroSection />);
    expect(screen.getByTestId(STICKER).style.touchAction).toBe('pan-y');
  });

  it('ignores a quick touch swipe that starts on a sticker', () => {
    render(<HeroSection />);
    const sticker = screen.getByTestId(STICKER);

    fireEvent.pointerDown(sticker, touch(40, 40));
    fireEvent.pointerMove(sticker, touch(42, 140));
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    fireEvent.pointerMove(sticker, touch(42, 220));
    fireEvent.pointerUp(sticker, touch(42, 220));

    expect(sticker).toHaveAttribute('data-offset-x', '0');
    expect(sticker).toHaveAttribute('data-offset-y', '0');
  });

  it('drags a sticker after a still long-press', () => {
    render(<HeroSection />);
    const sticker = screen.getByTestId(STICKER);

    fireEvent.pointerDown(sticker, touch(40, 40));
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    fireEvent.pointerMove(sticker, touch(100, 90));
    fireEvent.pointerUp(sticker, touch(100, 90));

    expect(sticker).toHaveAttribute('data-offset-x', '60');
    expect(sticker).toHaveAttribute('data-offset-y', '50');
  });

  it('releases before the long-press completes without arming a drag', () => {
    render(<HeroSection />);
    const sticker = screen.getByTestId(STICKER);

    fireEvent.pointerDown(sticker, touch(40, 40));
    fireEvent.pointerUp(sticker, touch(40, 40));
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    fireEvent.pointerMove(sticker, touch(100, 90));

    expect(sticker).toHaveAttribute('data-offset-x', '0');
  });

  it('resets every sticker to its original position', () => {
    render(<HeroSection />);
    const sticker = screen.getByTestId(STICKER);
    fireEvent.pointerDown(sticker, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(sticker, { clientX: 70, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(sticker, { clientX: 70, clientY: 50, pointerId: 1 });
    expect(sticker).toHaveAttribute('data-offset-x', '60');

    fireEvent.click(screen.getByTestId('reset-stickers'));

    const restored = screen.getByTestId(STICKER);
    expect(restored).toHaveAttribute('data-offset-x', '0');
    expect(restored).toHaveAttribute('data-offset-y', '0');
    expect(screen.getByTestId('reset-stickers')).toHaveTextContent('[RESETAR MESA // LIMPAR STICKERS]');
  });

  it('applies the same long-press gate to moodboard cards', () => {
    render(<ArenaMoodboard />);
    const board = screen.getByTestId('arena-moodboard');
    const card = board.querySelector<HTMLElement>('[data-testid^="moodboard-card-"]')!;
    expect(card.style.touchAction).toBe('pan-y');

    fireEvent.pointerDown(card, touch(30, 40));
    fireEvent.pointerMove(board, touch(32, 160));
    expect(card).toHaveAttribute('data-offset-y', '0');
    fireEvent.pointerUp(board, touch(32, 160));

    fireEvent.pointerDown(card, touch(30, 40));
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    fireEvent.pointerMove(board, touch(80, 70));
    fireEvent.pointerUp(board, touch(80, 70));
    expect(card).toHaveAttribute('data-offset-x', '50');
    expect(card).toHaveAttribute('data-offset-y', '30');
  });
});
