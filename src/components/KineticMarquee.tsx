import React from 'react';

export interface KineticMarqueeProps {
  text?: string;
  /** Screen-reader copy; the letter-spaced `text` is hidden from assistive tech. */
  readableText?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  text = 'C R I A D A E M 2 0 2 2 // D E O N D E V E I O ? // U F M G + S E N A I // E N G E N H A R I A R E V E R S A D O V E S T U Á R I O // G ★ N J ★ S T A R',
  readableText = 'CRIADA EM 2022 — DE ONDE VEIO? — UFMG + SENAI — ENGENHARIA REVERSA DO VESTUÁRIO — GANJA STAR',
}) => {
  return (
    <div
      data-testid="kinetic-marquee"
      className="w-full overflow-hidden bg-[#111111] text-[#F4F3EF] border-t border-b border-[#111111] py-3 select-none"
      style={{ borderRadius: '0px' }}
    >
      <span className="sr-only">{readableText}</span>
      <div aria-hidden="true" className="animate-brutal-marquee flex items-center gap-12 whitespace-nowrap font-display-expanded text-sm sm:text-base font-extrabold">
        <span>{text}</span>
        <span className="text-[#F5C400]">★</span>
        <span>{text}</span>
        <span className="text-[#F4F3EF]">★</span>
      </div>
    </div>
  );
};
