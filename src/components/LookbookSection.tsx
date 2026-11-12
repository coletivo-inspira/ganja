import React, { useState } from 'react';
import { LOOKS_CATALOG } from '../data/collection';
import type { LookItem } from '../types/ganja';
import { ArenaMoodboard } from './ArenaMoodboard';
import { LookCard } from './LookCard';
import { LookTechnicalDrawer } from './LookTechnicalDrawer';

export const LookbookSection: React.FC = () => {
  const [selectedLook, setSelectedLook] = useState<LookItem | null>(null);

  return (
    <section
      id="desfile-05"
      data-testid="section-desfile-05"
      aria-label="Seção 05 — Proposta de Desfile e Mostruário Interativo (Coleção Ganja Star)"
      className="w-full bg-[#F4F3EF] text-[#111111] border-b border-[#111111]"
      style={{ borderRadius: '0px' }}
    >
      {/* Editorial Opening */}
      <div className="px-6 sm:px-10 lg:px-12 py-10 border-b border-[#111111] bg-[#F4F3EF]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="font-mono-tech text-xs font-bold px-3 py-1 bg-[#111111] text-[#F5C400]">
            PROPOSTADEDESFILE(05) // CASA DE CRIADORES (CDC)
          </span>
          <span className="font-mono-tech text-xs font-bold text-[#D92B2B]">
            10 LOOKS DOCUMENTADOS // ATELIÊ VIVO (LOOK 03: 80% | LOOK 04: 95%)
          </span>
        </div>

        <h2 className="font-display-compressed text-4xl sm:text-6xl font-extrabold uppercase mb-4">
          COLEÇÃO GANJA STAR — MOSTRUÁRIO INTERATIVO (LOOK 01 AO LOOK 10)
        </h2>
        <p className="text-base sm:text-lg max-w-3xl leading-relaxed">
          Isolamento visual sobre branco puro (<code>#FFFFFF</code>, padrão 032c). Passe o cursor
          sobre qualquer look para alternar instantaneamente entre o fit completo na silhueta e o
          close-up macro da costura de upcycling; clique para abrir a gaveta técnica lateral.
        </p>
      </div>

      {/* 3-Column Modular Grid */}
      <div
        data-testid="lookbook-grid"
        className="lookbook-grid grid w-full border-l border-[#111111] bg-[#FFFFFF]"
        style={{ borderRadius: '0px' }}
      >
        {LOOKS_CATALOG.map((look) => (
          <LookCard key={look.id} look={look} onSelect={(item) => setSelectedLook(item)} />
        ))}
      </div>

      {/* Technical Inspection Drawer */}
      <LookTechnicalDrawer look={selectedLook} onClose={() => setSelectedLook(null)} />

      {/* Are.na Interactive Process Moodboard */}
      <ArenaMoodboard />
    </section>
  );
};
