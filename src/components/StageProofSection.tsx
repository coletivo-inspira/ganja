import React, { useState } from 'react';
import { STAGE_PERFORMANCES, STYLING_LINEAGE_CONTEXT } from '../data/performances';
import type { StagePerformanceItem } from '../types/ganja';
import { useCoarsePointer } from './useCoarsePointer';

export const StageProofSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<StagePerformanceItem>(STAGE_PERFORMANCES[0]);
  const [isHoveringRow, setIsHoveringRow] = useState<boolean>(false);
  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 24, y: 24 });
  const isCoarse = useCoarsePointer();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const trackPointer = (event: React.MouseEvent) => {
    const width = 360;
    const height = 300;
    const x = Math.max(8, Math.min(event.clientX + 18, window.innerWidth - width - 8));
    const y = Math.max(56, Math.min(event.clientY + 18, window.innerHeight - height - 8));
    setPointer({ x, y });
  };

  return (
    <section
      id="atuacao-03"
      data-testid="section-atuacao-03"
      aria-label="Seção 03 — Atuação da Marca (Prova de Palco)"
      className="w-full bg-[#0D0D0D] text-[#F4F3EF] border-b border-[#111111] py-12 sm:py-16"
      style={{
        backgroundColor: '#0D0D0D',
        color: '#F4F3EF',
        borderRadius: '0px',
      }}
    >
      <div className="px-6 sm:px-10 lg:px-12 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#F4F3EF]/30 pb-6">
        <div>
          <span className="font-mono-tech text-xs font-bold px-2.5 py-1 bg-[#D92B2B] text-[#FFFFFF] inline-block mb-2">
            ATUAÇÃODAMARCA(03) // MODO STAGE PROOF (#0D0D0D)
          </span>
          <h2 className="font-display-compressed text-3xl sm:text-5xl font-extrabold uppercase">
            PROVA DE PALCO — DO CENTRO DE SP AO ESPETÁCULO POP MUNDIAL
          </h2>
        </div>
        <div className="font-mono-tech text-xs text-[#F5C400] max-w-md">
          {STYLING_LINEAGE_CONTEXT.headline}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 px-6 sm:px-10 lg:px-12 gap-8 items-start">
        {/* Monumental Edge-to-Edge Artist Roster */}
        <div className="lg:col-span-7 border-t border-[#F4F3EF]">
          {STAGE_PERFORMANCES.map((item) => {
            const isSelected = activeStage.id === item.id;
            const isExpanded = isCoarse && expandedId === item.id;
            const panelId = `stage-accordion-panel-${item.id}`;
            const pointerHandlers = isCoarse
              ? {}
              : {
                  onMouseEnter: (event: React.MouseEvent) => {
                    setActiveStage(item);
                    setIsHoveringRow(true);
                    trackPointer(event);
                  },
                  onMouseMove: trackPointer,
                  onMouseLeave: () => setIsHoveringRow(false),
                  onFocus: () => {
                    setActiveStage(item);
                    setIsHoveringRow(true);
                  },
                };
            const select = () => {
              setActiveStage(item);
              if (isCoarse) setExpandedId((current) => (current === item.id ? null : item.id));
            };
            return (
              <React.Fragment key={item.id}>
                <div
                  data-testid={`stage-row-${item.id}`}
                  data-active={isSelected ? 'true' : 'false'}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isCoarse ? isExpanded : undefined}
                  aria-controls={isCoarse ? panelId : undefined}
                  {...pointerHandlers}
                  onClick={select}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      select();
                    }
                  }}
                  className="w-full py-6 px-4 border-b border-[#F4F3EF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer brutal-interactive"
                  style={{
                    borderRadius: '0px',
                    transitionDuration: '0ms',
                    backgroundColor: isSelected ? '#1A1A1A' : '#0D0D0D',
                  }}
                >
                  <div className="font-display-compressed text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {item.displayLabel}
                  </div>
                  <div className="flex items-center justify-between gap-3 font-mono-tech text-xs text-[#F5C400]">
                    <span>
                      [{item.year}] // {item.eventContext}
                    </span>
                    {isCoarse ? (
                      <span aria-hidden="true" className="font-bold">
                        {isExpanded ? '[−]' : '[+]'}
                      </span>
                    ) : null}
                  </div>
                </div>

                {isExpanded ? (
                  <div
                    id={panelId}
                    data-testid={panelId}
                    role="region"
                    aria-label={`Registro de palco — ${item.artist}`}
                    className="bg-[#1A1A1A] p-4 border-b border-[#F4F3EF]"
                    style={{ borderRadius: '0px', border: '1px solid #F4F3EF', transitionDuration: '0ms' }}
                  >
                    <img
                      src={item.previewMedia}
                      alt={item.displayLabel}
                      className="w-full aspect-[16/10] object-cover border border-[#F4F3EF] mb-3"
                    />
                    <div className="font-mono-tech text-xs leading-relaxed text-[#F4F3EF]">
                      <span className="text-[#F5C400] font-bold">
                        [{item.artist} // {item.eventContext} // {item.year} // {item.garmentUsed}]
                      </span>
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}

          {/* Styling Lineage Context */}
          <div className="mt-6 p-4 bg-[#1A1A1A] border border-[#F4F3EF] font-mono-tech text-xs leading-relaxed">
            <div className="text-[#F5C400] font-bold mb-1">
              LINHAGEM DE STYLING & DIREÇÃO DE IMAGEM (@ISAQUEX)
            </div>
            <p>{STYLING_LINEAGE_CONTEXT.summary}</p>
          </div>
        </div>

        {/* Cursor-following Stage Rollover Preview — hidden until a row is inspected */}
        {isCoarse ? null : (
          <div
            data-testid="stage-rollover-preview"
            data-artist-id={activeStage.id}
            data-hovering={isHoveringRow ? 'true' : 'false'}
            aria-hidden={!isHoveringRow}
            className={`pointer-events-none bg-[#1A1A1A] border border-[#F4F3EF] p-4 brutal-shadow-inv ${
              isHoveringRow ? 'block' : 'hidden'
            }`}
            style={{
              borderRadius: '0px',
              position: 'fixed',
              left: pointer.x,
              top: pointer.y,
              width: 360,
              maxWidth: 'calc(100vw - 16px)',
              zIndex: 40,
              pointerEvents: 'none',
              transitionDuration: '0ms',
            }}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F4F3EF] font-mono-tech text-xs">
              <span className="text-[#F5C400] font-bold">STAGE ROLLOVER PREVIEW</span>
              <span>{activeStage.year}</span>
            </div>
            <img
              src={activeStage.previewMedia}
              alt={activeStage.displayLabel}
              className="w-full aspect-[16/10] object-cover border border-[#F4F3EF] mb-3"
            />
            <div className="font-mono-tech text-xs space-y-1">
              <div className="text-[#F5C400] font-bold">{activeStage.metadataLine}</div>
              <div>
                <strong>Artista:</strong> {activeStage.artist}
              </div>
              <div>
                <strong>Evento:</strong> {activeStage.eventContext}
              </div>
              <div>
                <strong>Ano:</strong> {activeStage.year}
              </div>
              <div>
                <strong>Peça utilizada:</strong> {activeStage.garmentUsed}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
