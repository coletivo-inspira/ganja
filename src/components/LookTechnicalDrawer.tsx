import React, { useEffect, useState } from 'react';
import type { LookItem } from '../types/ganja';

export interface LookTechnicalDrawerProps {
  look: LookItem | null;
  onClose: () => void;
}

export const LookTechnicalDrawer: React.FC<LookTechnicalDrawerProps> = ({ look, onClose }) => {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOrigin, setPanOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    setZoomScale(1);
    setPanOrigin({ x: 50, y: 50 });
  }, [look?.id]);

  useEffect(() => {
    if (!look) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [look, onClose]);

  if (!look) return null;

  const mailtoHref = `mailto:gandraisaque@hotmail.com?subject=${encodeURIComponent(
    look.inquirySubject
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0D0D0D]/75"
      onClick={onClose}
      style={{ borderRadius: '0px' }}
    >
      <aside
        data-testid="look-technical-drawer"
        data-look-code={look.code}
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha Técnica de Upcycling — ${look.code}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full overflow-y-auto bg-[#F4F3EF] text-[#111111] border-l-2 border-[#111111] brutal-shadow flex flex-col justify-between"
        style={{
          borderRadius: '0px',
          borderLeft: '2px solid #111111',
          boxShadow: '-4px 0px 0px #111111',
        }}
      >
        <div>
          {/* Top Drawer Bar */}
          <div className="flex items-center justify-between p-4 bg-[#111111] text-[#F4F3EF] border-b border-[#111111]">
            <div className="font-mono-tech text-xs font-bold">
              ARQUIVO DOCUMENTAL MARINE SERRE // EDUCATION BEFORE CONSUMERISM
            </div>
            <button
              type="button"
              data-testid="drawer-close-btn"
              onClick={onClose}
              className="px-3 py-1 bg-[#D92B2B] text-[#FFFFFF] font-mono-tech text-xs font-bold cursor-pointer brutal-interactive"
              style={{ borderRadius: '0px' }}
            >
              [FECHAR X]
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Look Code & Title */}
            <div className="border-b border-[#111111] pb-4">
              <div className="font-mono-tech text-xs font-bold text-[var(--accent-red-text)] mb-1">
                {look.frontLabel} // {look.statusBadge}
              </div>
              <h2
                data-testid="drawer-look-title"
                className="font-display-compressed text-2xl sm:text-4xl font-extrabold uppercase"
              >
                {look.code} — {look.title}
              </h2>
            </div>

            {/* Interactive Macro Texture Zoom Area */}
            <div
              data-testid="drawer-macro-zoom"
              data-zoom-scale={zoomScale}
              onClick={() => setZoomScale((z) => (z === 1 ? 2 : 1))}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setPanOrigin({ x, y });
                }
              }}
              className="relative w-full aspect-[4/3] overflow-hidden bg-[#0D0D0D] brutal-border brutal-shadow cursor-zoom-in"
              style={{ borderRadius: '0px' }}
            >
              <img
                src={look.macroImage}
                alt={`Macro Textura — ${look.code}`}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${panOrigin.x}% ${panOrigin.y}%`,
                  transitionDuration: '0ms',
                }}
              />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#F5C400] text-[#111111] font-mono-tech text-xs font-bold brutal-border">
                ZOOM MACRO: {zoomScale}X (CLIQUE PARA ALTERNAR)
              </div>
            </div>

            {/* Completion Progress Bar */}
            <div
              data-testid="drawer-progress-bar"
              data-percent={look.completionPercent}
              className="p-4 bg-[#FFFFFF] brutal-border"
              style={{ borderRadius: '0px' }}
            >
              <div className="flex items-center justify-between font-mono-tech text-xs font-bold mb-2">
                <span>STATUS DE PRODUÇÃO (ATELIÊ VIVO)</span>
                <span className="text-[var(--accent-red-text)]">
                  {look.code} - {look.statusBadge} ({look.completionPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#F4F3EF] border border-[#111111]">
                <div
                  className="h-full bg-[#008055]"
                  style={{ width: `${look.completionPercent}%` }}
                />
              </div>
            </div>

            {/* Upcycling Material Spec Sheet */}
            <div
              data-testid="drawer-material-sheet"
              className="p-5 bg-[#FFFFFF] brutal-border brutal-shadow space-y-4 font-mono-tech text-xs"
              style={{ borderRadius: '0px' }}
            >
              <div className="font-bold text-sm border-b border-[#111111] pb-2">
                FICHA DE MATERIAIS DE UPCYCLING & ENGENHARIA REVERSA
              </div>
              <div>
                <div className="font-bold text-[var(--accent-red-text)] mb-1">MATÉRIAS-PRIMAS CATALOGADAS:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {look.rawMaterials.map((mat, idx) => (
                    <li key={idx}>{mat}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-bold text-[#008055] mb-1">
                  TÉCNICA DE CONSTRUÇÃO (MATRIZ UFMG + SENAI):
                </div>
                <p className="leading-relaxed">{look.upcyclingTechnique}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Inquiry / Order CTA */}
        <div className="p-6 bg-[#111111] text-[#F4F3EF] border-t border-[#111111]">
          <a
            data-testid="drawer-inquiry-cta"
            href={mailtoHref}
            className="block w-full py-3.5 px-4 bg-[#F5C400] text-[#111111] text-center font-mono-tech text-sm font-bold uppercase brutal-border brutal-shadow"
            style={{ borderRadius: '0px' }}
          >
            ENCOMENDA / CONSULTA DIRETA — {look.code} (@GANJASTUDIO.BR)
          </a>
        </div>
      </aside>
    </div>
  );
};
