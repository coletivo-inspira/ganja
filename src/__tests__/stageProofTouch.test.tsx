import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { StageProofSection } from '../components/StageProofSection';
import { COARSE_POINTER_QUERY } from '../components/useCoarsePointer';

function mockMatchMedia(coarse: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: coarse && query === COARSE_POINTER_QUERY,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe('Issue 2 — Stage Proof on touch devices', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('coarse pointer (hover: none)', () => {
    beforeEach(() => mockMatchMedia(true));

    it('renders rows as collapsed accordions without the floating preview', () => {
      render(<StageProofSection />);
      expect(screen.queryByTestId('stage-rollover-preview')).toBeNull();
      const row = screen.getByTestId('stage-row-anitta');
      expect(row).toHaveAttribute('aria-expanded', 'false');
      expect(row).toHaveAttribute('aria-controls', 'stage-accordion-panel-anitta');
      expect(screen.queryByTestId('stage-accordion-panel-anitta')).toBeNull();
    });

    it('opens the tapped artist inline with image and metadata, and closes on second tap', () => {
      render(<StageProofSection />);
      const row = screen.getByTestId('stage-row-marina-sena');
      fireEvent.click(row);

      expect(row).toHaveAttribute('aria-expanded', 'true');
      const panel = screen.getByTestId('stage-accordion-panel-marina-sena');
      expect(panel.querySelector('img')).toHaveAttribute('src', expect.stringContaining('marina-sena.svg'));
      expect(panel).toHaveTextContent(/\[MARINA SENA \/\/ .+ \/\/ 2023–2024 \/\/ .+\]/);
      expect(panel).toHaveStyle({ border: '1px solid #F4F3EF', borderRadius: '0px' });

      fireEvent.click(row);
      expect(row).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('stage-accordion-panel-marina-sena')).toBeNull();
    });

    it('keeps a single artist open at a time and toggles from the keyboard', () => {
      render(<StageProofSection />);
      fireEvent.click(screen.getByTestId('stage-row-anitta'));
      fireEvent.keyDown(screen.getByTestId('stage-row-kendrick-lamar'), { key: 'Enter' });

      expect(screen.queryByTestId('stage-accordion-panel-anitta')).toBeNull();
      expect(screen.getByTestId('stage-accordion-panel-kendrick-lamar')).toBeInTheDocument();
      expect(screen.getByTestId('stage-row-kendrick-lamar')).toHaveAttribute('data-active', 'true');
    });
  });

  describe('fine pointer (desktop)', () => {
    beforeEach(() => mockMatchMedia(false));

    it('keeps the cursor-following preview and no accordion attributes', () => {
      render(<StageProofSection />);
      const row = screen.getByTestId('stage-row-anitta');
      expect(row).not.toHaveAttribute('aria-expanded');
      fireEvent.mouseEnter(row, { clientX: 200, clientY: 240 });
      expect(screen.getByTestId('stage-rollover-preview')).toHaveAttribute('data-hovering', 'true');
      fireEvent.click(row);
      expect(screen.queryByTestId('stage-accordion-panel-anitta')).toBeNull();
    });
  });
});
