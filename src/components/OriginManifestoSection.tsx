import React, { useEffect, useState } from 'react';
import { kineticLetterSpacingEm, subscribeStudioScroll } from '../scroll/studioScroll';
import { KineticMarquee } from './KineticMarquee';

export const OriginManifestoSection: React.FC = () => {
  const [trackingEm, setTrackingEm] = useState<number>(() =>
    kineticLetterSpacingEm(typeof window !== 'undefined' ? window.scrollY || 0 : 0)
  );

  useEffect(() => {
    const apply = (scrollY: number) => {
      const next = kineticLetterSpacingEm(scrollY);
      setTrackingEm((prev) => (prev === next ? prev : next));
    };
    apply(window.scrollY || 0);
    return subscribeStudioScroll(apply);
  }, []);

  return (
    <section
      id="origem-01"
      data-testid="section-origem-01"
      aria-label="Seções 01 e 02 — De Onde Veio e Público-Alvo"
      className="w-full bg-[#F4F3EF] text-[#111111] border-b border-[#111111]"
      style={{ borderRadius: '0px' }}
    >
      <KineticMarquee />

      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        {/* Verticalized Spaced Left Margin Column */}
        <div className="lg:col-span-3 p-6 sm:p-8 bg-[#FFFFFF] border-b lg:border-b-0 lg:border-r border-[#111111] flex flex-col justify-between">
          <div>
            <span
              aria-hidden="true"
              className="font-mono-tech text-xs font-bold px-2 py-1 bg-[#D92B2B] text-[#FFFFFF] inline-block mb-4"
            >
              DEONDEVEIO?(01)
            </span>
            <h2
              data-testid="kinetic-title-origem"
              data-letter-spacing={`${trackingEm}em`}
              className="font-display-expanded text-2xl sm:text-3xl font-extrabold uppercase leading-tight break-words"
              style={{
                letterSpacing: `${trackingEm}em`,
              }}
            >
              <span className="sr-only">DE ONDE VEIO? 01</span>
              <span aria-hidden="true">D E O N D E V E I O ? 01</span>
            </h2>
          </div>

          <div className="mt-8 pt-4 border-t border-[#111111] font-mono-tech text-xs">
            <div>
              <span className="sr-only">CRIADA EM 2022</span>
              <span aria-hidden="true">C R I A D A E M 2 0 2 2</span>
            </div>
            <div className="text-[#008055] font-bold mt-1">GANDRA → GANJA</div>
          </div>
        </div>

        {/* Right Narrative + Publico Alvo (02) Column */}
        <div className="lg:col-span-9 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#FFFFFF] brutal-border brutal-shadow">
              <div className="font-mono-tech text-xs font-bold text-[#D92B2B] mb-2">
                01.A // MATRIZ DUPLA: UFMG & SENAI (2022)
              </div>
              <p className="text-sm sm:text-base leading-relaxed">
                Fundada em <strong>2022</strong> por <strong>Isaque Gandra (@isaquex)</strong>,
                inicialmente como Trabalho de Conclusão de Curso (TCC) na graduação em Design de Moda
                pela <strong>Escola de Belas Artes da UFMG</strong>, somada ao domínio
                técnico-industrial de modelagem e montagem adquirido no curso de Moda e Confecção pelo{' '}
                <strong>Senai</strong>.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] brutal-border brutal-shadow">
              <div className="font-mono-tech text-xs font-bold text-[#008055] mb-2">
                01.B // ENGENHARIA REVERSA & TROCADILHO GANDRA → GANJA
              </div>
              <p className="text-sm sm:text-base leading-relaxed">
                Nascido como um trocadilho fonético e gráfico com o sobrenome do criador (
                <strong>Gandra → Ganja</strong>), o projeto assume a sustentabilidade como linguagem
                de forma e volume: na Ganja Studio, o upcycling opera como{' '}
                <strong>engenharia reversa do vestuário</strong>, onde tecidos e aviamentos
                descartados ditam estruturalmente a peça.
              </p>
            </div>
          </div>

          {/* Section 02: PUBLICOALVO(02) Technical Demographic Frame */}
          <div
            id="publico-02"
            data-testid="section-publico-02"
            className="pt-6 border-t border-[#111111]"
          >
            <div
              data-testid="demographic-frame"
              className="p-6 bg-[#111111] text-[#F4F3EF] brutal-border brutal-shadow font-mono-tech"
              style={{ borderRadius: '0px' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#F4F3EF]">
                <span className="text-[#F5C400] font-bold text-sm">
                  PUBLICOALVO(02) // QUADRO TÉCNICO DE DEMOGRAFIA & COMPORTAMENTO
                </span>
                <span className="text-xs px-2 py-0.5 bg-[#D92B2B] text-[#FFFFFF]">
                  CONTRACULTURA URBANA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-bold">
                <div className="p-4 bg-[#1A1A1A] border border-[#F4F3EF]">
                  <div className="text-xs text-[#F5C400] mb-1">FAIXA ETÁRIA</div>
                  <div>IDADE: 18-35 ANOS</div>
                </div>
                <div className="p-4 bg-[#1A1A1A] border border-[#F4F3EF]">
                  <div className="text-xs text-[#F5C400] mb-1">PERFIL CULTURAL</div>
                  <div>PÚBLICO: JOVEM, URBANO E UNDERGROUND</div>
                </div>
                <div className="p-4 bg-[#1A1A1A] border border-[#F4F3EF]">
                  <div className="text-xs text-[#F5C400] mb-1">TERRITÓRIO</div>
                  <div>LOCAL: DE SÃO PAULO PARA O MUNDO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
