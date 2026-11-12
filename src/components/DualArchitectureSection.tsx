import React, { useState } from 'react';
import { LOOKS_CATALOG } from '../data/collection';

export const DualArchitectureSection: React.FC = () => {
  const [activeSide, setActiveSide] = useState<'upcycling' | 'pequena-escala' | null>(null);

  const upcyclingLooks = LOOKS_CATALOG.filter((l) => l.frontId === 'upcycling-1of1');
  const pequenaEscalaLooks = LOOKS_CATALOG.filter((l) => l.frontId === 'pequena-escala');

  const upcyclingWidth =
    activeSide === 'upcycling' ? 'lg:w-[65%]' : activeSide === 'pequena-escala' ? 'lg:w-[35%]' : 'lg:w-1/2';
  const pequenaWidth =
    activeSide === 'pequena-escala' ? 'lg:w-[65%]' : activeSide === 'upcycling' ? 'lg:w-[35%]' : 'lg:w-1/2';

  return (
    <section
      id="frentes-04"
      data-testid="section-frentes-04"
      aria-label="Seção 04 — Frentes de Criação (Arquitetura Dual)"
      className="w-full bg-[#F4F3EF] text-[#111111] border-b border-[#111111]"
      style={{ borderRadius: '0px' }}
    >
      <div className="px-6 sm:px-10 lg:px-12 py-6 border-b border-[#111111] flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <span className="font-mono-tech text-xs font-bold px-2 py-1 bg-[#111111] text-[#F5C400] inline-block mb-2">
            FRENTESDECRIAÇÃO(04) // ARQUITETURA DUAL (50% / 50%)
          </span>
          <h2 className="font-display-compressed text-3xl sm:text-4xl font-extrabold uppercase">
            DUAS FRENTES DE CRIAÇÃO COMPLEMENTARES
          </h2>
        </div>
        <div className="font-mono-tech text-xs">
          PASSE O CURSOR OU CLIQUE PARA EXPANDIR CADA FRENTE OPERACIONAL
        </div>
      </div>

      <div
        data-testid="dual-split-container"
        data-active-side={activeSide ?? 'balanced'}
        className="flex flex-col lg:flex-row w-full min-h-[520px]"
      >
        {/* Lado A: Peças Únicas (1/1 Upcycling) */}
        <div
          data-testid="dual-side-upcycling"
          data-expanded={activeSide === 'upcycling' ? 'true' : 'false'}
          tabIndex={0}
          role="region"
          aria-label="Lado A — Peças Únicas 1/1 Upcycling"
          onMouseEnter={() => setActiveSide('upcycling')}
          onMouseLeave={() => setActiveSide(null)}
          onClick={() => setActiveSide('upcycling')}
          className={`${upcyclingWidth} p-6 sm:p-10 bg-[#F4F3EF] border-b lg:border-b-0 lg:border-r border-[#111111] flex flex-col justify-between cursor-pointer`}
          style={{ borderRadius: '0px' }}
        >
          <div>
            <div className="inline-block px-3 py-1 bg-[#D92B2B] text-[#FFFFFF] font-mono-tech text-xs font-bold mb-4">
              LADO A // PEÇAS ÚNICAS (1/1 UPCYCLING)
            </div>
            <h3 className="font-display-compressed text-2xl sm:text-4xl font-extrabold uppercase mb-4">
              ENGENHARIA REVERSA & GARIMPO TÊXTIL IRREPETÍVEL
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-6">
              Artefatos únicos (1-of-1) nos quais cada peça carrega uma história irrepetível de
              garimpo e reconstrução têxtil no centro de São Paulo — exemplificada pelos conjuntos de
              retalhos de couro e pelúcia (Looks 06, 07 e 08) e pelo conjunto Adesivos de Caminhão
              (Look 03).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#111111] font-mono-tech text-xs">
            {upcyclingLooks.map((look) => (
              <div key={look.id} className="p-2.5 bg-[#FFFFFF] brutal-border">
                <div className="font-bold text-[#D92B2B]">{look.code}</div>
                <div className="truncate font-bold">{look.title}</div>
                <div className="text-[11px]">{look.statusBadge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado B: Pequena Escala */}
        <div
          data-testid="dual-side-pequena-escala"
          data-expanded={activeSide === 'pequena-escala' ? 'true' : 'false'}
          tabIndex={0}
          role="region"
          aria-label="Lado B — Pequena Escala"
          onMouseEnter={() => setActiveSide('pequena-escala')}
          onMouseLeave={() => setActiveSide(null)}
          onClick={() => setActiveSide('pequena-escala')}
          className={`${pequenaWidth} p-6 sm:p-10 bg-[#FFFFFF] flex flex-col justify-between cursor-pointer`}
          style={{ borderRadius: '0px' }}
        >
          <div>
            <div className="inline-block px-3 py-1 bg-[#008055] text-[#FFFFFF] font-mono-tech text-xs font-bold mb-4">
              LADO B // PEQUENA ESCALA (TIRAGENS LIMITADAS)
            </div>
            <h3 className="font-display-compressed text-2xl sm:text-4xl font-extrabold uppercase mb-4">
              ALCANCE COMERCIAL & POTÊNCIA GRÁFICA UTILITÁRIA
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-6">
              Criação em pequena escala que mantém o caráter experimental e político da marca, porém
              viabilizando a reprodução comercial e a ampliação de alcance — onde se inserem a
              Camiseta Ozempic (Look 02), a Regatinha Ganja Star (Look 04), o Moletom Legalize Já
              (Look 05) e a linha de Cargos e Puffer (Looks 01, 02, 04 e 10).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#111111] font-mono-tech text-xs">
            {pequenaEscalaLooks.map((look) => (
              <div key={look.id} className="p-2.5 bg-[#F4F3EF] brutal-border">
                <div className="font-bold text-[#008055]">{look.code}</div>
                <div className="truncate font-bold">{look.title}</div>
                <div className="text-[11px]">{look.statusBadge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
