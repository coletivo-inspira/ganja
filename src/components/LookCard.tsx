import React, { useState } from 'react';
import type { LookItem } from '../types/ganja';

export interface LookCardProps {
  look: LookItem;
  onSelect: (look: LookItem) => void;
}

export const LookCard: React.FC<LookCardProps> = ({ look, onSelect }) => {
  const [viewMode, setViewMode] = useState<'silhouette' | 'macro'>('silhouette');

  const cardTestId = look.id.replace('look-', 'look-card-');
  const activeImage = viewMode === 'macro' ? look.macroImage : look.silhouetteImage;

  return (
    <article
      data-testid={cardTestId}
      data-look-code={look.code}
      data-cursor-look={look.cursorMaterialTag}
      data-view-mode={viewMode}
      tabIndex={0}
      role="button"
      aria-label={`${look.code} — ${look.title} (${look.statusBadge})`}
      onMouseEnter={() => setViewMode('macro')}
      onMouseLeave={() => setViewMode('silhouette')}
      onClick={() => onSelect(look)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(look);
        }
      }}
      className="flex flex-col justify-between bg-[#FFFFFF] text-[#111111] border-r border-b border-[#111111] cursor-pointer brutal-interactive"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0px',
        transitionDuration: '0ms',
      }}
    >
      {/* Top Archival Metadata Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#111111] text-[#F4F3EF] font-mono-tech text-xs">
        <span className="font-bold">
          {look.code} ({look.shortCode})
        </span>
        <span className="text-[#F5C400]">{look.frontLabel}</span>
      </div>

      {/* 3:4 Vertical Portrait Visual (Instant Silhouette <-> Macro Toggle) */}
      <div className="relative w-full aspect-[3/4] bg-[#FFFFFF] border-b border-[#111111] overflow-hidden">
        <img
          src={activeImage}
          alt={`${look.code} — ${look.title} (${viewMode})`}
          className="w-full h-full object-cover block"
          style={{ transitionDuration: '0ms' }}
        />

        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#111111] text-[#F4F3EF] font-mono-tech text-[10px] font-bold">
          {viewMode === 'macro' ? 'MODO: MACRO TEXTURA 4:1' : 'MODO: SILHUETA 3:4'}
        </div>

        {look.isWorkInProgress ? (
          <div
            data-testid={`wip-badge-${look.id}`}
            className="absolute bottom-2 left-2 right-2 p-2 bg-[#F5C400] text-[#111111] brutal-border brutal-shadow font-mono-tech text-xs font-bold"
            style={{ borderRadius: '0px' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span>ATELIÊ VIVO // {look.code}</span>
              <span>{look.statusBadge}</span>
            </div>
            <div className="w-full h-2 bg-[#FFFFFF] border border-[#111111]">
              <div
                className="h-full bg-[#D92B2B]"
                style={{ width: `${look.completionPercent}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Card Footer */}
      <div className="p-4 flex flex-col justify-between gap-2 bg-[#FFFFFF]">
        <div>
          <h3 className="font-display-compressed text-lg sm:text-xl font-extrabold uppercase">
            {look.title}
          </h3>
          <p className="font-mono-tech text-[11px] text-[#111111]/80 mt-1 line-clamp-2">
            {look.rawMaterials[0]}
          </p>
        </div>

        <div className="pt-2 border-t border-[#111111] flex items-center justify-between font-mono-tech text-xs font-bold">
          <span className={look.isWorkInProgress ? 'text-[#D92B2B]' : 'text-[#008055]'}>
            {look.statusBadge}
          </span>
          <span className="px-2 py-0.5 bg-[#F4F3EF] border border-[#111111]">
            [INSPECIONAR FICHA →]
          </span>
        </div>
      </div>
    </article>
  );
};
