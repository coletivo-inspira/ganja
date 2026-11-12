import React, { useState } from 'react';
import { NAV_CELLS } from '../data/creator';
import type { NavCellItem } from '../types/ganja';

export interface StickyHeaderProps {
  onNavigate?: (targetSectionId: string) => void;
  activeSectionId?: string;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  onNavigate,
  activeSectionId = 'hero-00',
}) => {
  const [hoveredCell, setHoveredCell] = useState<NavCellItem | null>(null);

  const handleCellClick = (cell: NavCellItem) => {
    if (onNavigate) {
      onNavigate(cell.targetSectionId);
    } else if (typeof document !== 'undefined') {
      const target = document.getElementById(cell.targetSectionId);
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const previewCell = hoveredCell ?? NAV_CELLS[0];

  return (
    <header
      data-testid="sticky-header"
      className="sticky top-0 z-50 w-full bg-[#F4F3EF] text-[#111111] border-b border-[#111111]"
      style={{
        borderRadius: '0px',
        borderBottom: '1px solid #111111',
      }}
    >
      <nav
        aria-label="Índice Arquivístico GANJA STUDIO"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 w-full"
      >
        {NAV_CELLS.map((cell) => {
          const testId = cell.id.replace('nav-', 'nav-cell-');
          const isBrand = cell.id === 'nav-brand';
          const isHovered = hoveredCell?.id === cell.id;
          const isActive = activeSectionId === cell.targetSectionId;

          return (
            <button
              key={cell.id}
              type="button"
              data-testid={testId}
              data-target-section={cell.targetSectionId}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => handleCellClick(cell)}
              onMouseEnter={() => setHoveredCell(cell)}
              onMouseLeave={() => setHoveredCell(null)}
              onFocus={() => setHoveredCell(cell)}
              onBlur={() => setHoveredCell(null)}
              className="brutal-interactive flex items-center justify-between px-3 py-3 text-left border-r border-b lg:border-b-0 border-[#111111] cursor-pointer"
              style={{
                borderRadius: '0px',
                transitionDuration: '0ms',
                backgroundColor: isHovered
                  ? '#111111'
                  : isBrand
                  ? '#0D0D0D'
                  : '#F4F3EF',
                color: isHovered || isBrand ? '#F4F3EF' : '#111111',
              }}
            >
              <span className="inline-flex items-baseline tracking-tight leading-none">
                <span className="font-display-compressed text-xs sm:text-sm tracking-[-0.04em]">
                  {cell.labelPart}
                </span>
                {cell.indexPart ? (
                  <span
                    className="font-mono-tech text-[11px] sm:text-xs font-bold"
                    style={{
                      color: isHovered ? '#F5C400' : '#D92B2B',
                    }}
                  >
                    {cell.indexPart}
                  </span>
                ) : null}
              </span>

              {isBrand ? (
                <img
                  src="/assets/brand/ganja-star-mark.svg"
                  alt="G★NJ★"
                  className="h-4 w-auto ml-2 select-none invert"
                />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Martine Rose-Inspired Instant Navigation Rollover Preview */}
      <div
        data-testid="nav-rollover-preview"
        data-active={hoveredCell ? 'true' : 'false'}
        data-preview-target={previewCell.targetSectionId}
        aria-hidden={!hoveredCell}
        className={`fixed right-4 top-14 z-50 w-80 bg-[#F4F3EF] text-[#111111] brutal-border brutal-shadow pointer-events-none ${
          hoveredCell ? 'block' : 'hidden'
        }`}
        style={{
          borderRadius: '0px',
          border: '1px solid #111111',
          boxShadow: '4px 4px 0px #111111',
          transitionDuration: '0ms',
        }}
      >
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#111111] text-[#F4F3EF] font-mono-tech text-[11px]">
          <span>PREVIEW // {previewCell.rawText}</span>
          <span className="text-[#F5C400]">#{previewCell.targetSectionId}</span>
        </div>
        <div className="p-2 bg-[#FFFFFF] border-b border-[#111111]">
          <img
            src={previewCell.previewImage}
            alt={previewCell.previewTitle}
            className="w-full h-36 object-contain bg-[#F4F3EF] border border-[#111111]"
          />
        </div>
        <div className="p-2.5 bg-[#F4F3EF] font-mono-tech text-[11px] leading-snug text-[#111111]">
          {previewCell.previewTitle}
        </div>
      </div>
    </header>
  );
};
