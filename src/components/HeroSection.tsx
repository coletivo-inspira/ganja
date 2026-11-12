import React, { useState } from 'react';
import { LOOKS_CATALOG } from '../data/collection';
import { URBAN_STICKERS } from '../data/stickers';
import { withBase } from '../withBase';
import { DraggableSticker } from './DraggableSticker';

export const HeroSection: React.FC = () => {
  const [stickerOrder, setStickerOrder] = useState<string[]>(
    URBAN_STICKERS.map((s) => s.id)
  );

  const [resetKey, setResetKey] = useState(0);

  const bringToFront = (id: string) => {
    setStickerOrder((prev) => [...prev.filter((item) => item !== id), id]);
  };

  const resetStickers = () => {
    setStickerOrder(URBAN_STICKERS.map((s) => s.id));
    setResetKey((key) => key + 1);
  };

  const heroLooks = LOOKS_CATALOG.slice(0, 6);

  return (
    <section
      id="hero-00"
      data-testid="section-hero-00"
      aria-label="Seção 00 — O Corpo como Superfície"
      className="w-full bg-[#F4F3EF] text-[#111111] border-b border-[#111111]"
      style={{
        borderRadius: '0px',
        borderBottom: '1px solid #111111',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        {/* Left Column (7 cols): Monumental G★NJ★ STAR Typography & Manifesto */}
        <div
          data-testid="hero-manifesto-col"
          className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#111111]"
          style={{ borderRadius: '0px' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-[#111111] text-[#F4F3EF] font-mono-tech text-xs font-bold brutal-shadow">
              <span>ZONA 00 // GALERIA DE ARTE URBANA & ARQUIVO DE UPCYCLING</span>
              <span className="text-[#F5C400]">SP — 2022/2026</span>
            </div>

            {/* Official G★NJ★ Vector Wordmark */}
            <div className="mb-4">
              <img
                data-testid="brand-mark-svg"
                src={withBase('/assets/brand/ganja-star-mark.svg')}
                alt="G★NJ★ Official Brand Mark"
                className="w-full max-w-xl h-auto block select-none"
              />
            </div>

            <h1 className="font-display-compressed text-[1.65rem] sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-[-0.04em] leading-[0.88] mb-6 break-words">
              G★NJ★ STAR — O CORPO COMO SUPERFÍCIE DE COMUNICAÇÃO
            </h1>

            <p className="text-base sm:text-lg leading-relaxed font-normal max-w-2xl mb-6">
              Fundada em 2022 por <strong>Isaque Gandra (@isaquex)</strong> no centro de São Paulo,
              a <strong>GANJA STUDIO (@ganjastudio.br)</strong> opera na interseção entre o rigor
              conceitual, artístico e político da <strong>Escola de Belas Artes da UFMG</strong> e o
              domínio técnico-industrial de modelagem e montagem do <strong>Senai</strong>.
            </p>

            <p className="text-sm sm:text-base leading-relaxed max-w-2xl p-4 bg-[#FFFFFF] brutal-border brutal-shadow font-mono-tech">
              MANIFESTO DE EXPERIMENTAÇÃO ENTRE STYLING E CRIAÇÃO DE PEÇAS: Na Ganja Studio, o
              upcycling opera como <strong>engenharia reversa do vestuário</strong>, na qual o
              reaproveitamento de tecidos, retalhos de couro, pelúcia e aviamentos descartados dita
              estruturalmente as formas, os volumes e os acabamentos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-10 pt-6 border-t border-[#111111] font-mono-tech text-xs">
            <div className="p-3 bg-[#FFFFFF] brutal-border">
              <div className="text-[#D92B2B] font-bold">MATRIZ 01</div>
              <div className="font-bold mt-1">UFMG + SENAI</div>
            </div>
            <div className="p-3 bg-[#FFFFFF] brutal-border">
              <div className="text-[#008055] font-bold">COLEÇÃO CDC</div>
              <div className="font-bold mt-1">GANJA STAR (10 LOOKS)</div>
            </div>
            <div className="p-3 bg-[#F5C400] brutal-border">
              <div className="text-[#111111] font-bold">INTERAÇÃO</div>
              <div className="font-bold mt-1">ARRASTE OS STICKERS →</div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Martine Rose-Style Hero Scroll Gallery + Draggable Stickers */}
        <div
          data-testid="hero-scroll-gallery"
          className="lg:col-span-5 relative min-h-[620px] max-h-[820px] overflow-y-auto bg-[#1A1A1A] text-[#F4F3EF] p-4 sm:p-6"
          style={{ borderRadius: '0px' }}
        >
          <div className="relative z-50 flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F4F3EF] font-mono-tech text-xs">
            <span>HERO SCROLL GALLERY // COLEÇÃO GANJA STAR</span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[#F5C400]">[STICKERS ARRASTÁVEIS]</span>
              <button
                type="button"
                data-testid="reset-stickers"
                onClick={resetStickers}
                className="brutal-interactive px-2 py-1 bg-[#F4F3EF] text-[#111111] border border-[#F4F3EF] font-mono-tech text-[11px] font-bold cursor-pointer hover:bg-[#F5C400]"
                style={{ borderRadius: '0px', transitionDuration: '0ms' }}
              >
                [RESETAR MESA // LIMPAR STICKERS]
              </button>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {heroLooks.map((look) => (
              <article
                key={look.id}
                data-cursor-look={look.cursorMaterialTag}
                className="bg-[#FFFFFF] text-[#111111] brutal-border brutal-shadow p-2"
                style={{ borderRadius: '0px' }}
              >
                <div className="flex items-center justify-between px-2 py-1 bg-[#111111] text-[#F4F3EF] font-mono-tech text-[11px]">
                  <span>{look.code}</span>
                  <span className="text-[#F5C400]">{look.statusBadge}</span>
                </div>
                <img
                  src={look.silhouetteImage}
                  alt={`${look.code} — ${look.title}`}
                  className="w-full aspect-[3/4] object-cover block border-t border-b border-[#111111]"
                />
                <div className="pt-2 px-1">
                  <div className="font-display-compressed text-xs font-extrabold">{look.title}</div>
                  <div className="font-mono-tech text-[10px] text-[#D92B2B]">{look.frontLabel}</div>
                </div>
              </article>
            ))}
          </div>

          {/* Interactive Draggable SVG Urban Stickers */}
          {URBAN_STICKERS.map((sticker) => {
            const orderIdx = stickerOrder.indexOf(sticker.id);
            return (
              <DraggableSticker
                key={`${sticker.id}-${resetKey}`}
                sticker={sticker}
                zIndex={20 + (orderIdx >= 0 ? orderIdx : 0)}
                onBringToFront={bringToFront}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
