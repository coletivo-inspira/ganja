import React from 'react';
import { CREATOR_PROFILE, INSTAGRAM_STRIP_ITEMS } from '../data/creator';

export const CreatorContactFooter: React.FC = () => {
  return (
    <section
      id="contato-06"
      data-testid="section-contato-06"
      aria-label="Seção 06 — Sobre Mim, Feed Curado e Contato"
      className="w-full bg-[#F4F3EF] text-[#111111]"
      style={{ borderRadius: '0px' }}
    >
      {/* Part 1: Creator Catalog Index Card (Ficha Catalográfica) */}
      <div className="p-6 sm:p-10 lg:p-12 border-b border-[#111111]">
        <div
          data-testid="creator-catalog-card"
          className="bg-[#FFFFFF] text-[#111111] brutal-border brutal-shadow p-6 sm:p-8"
          style={{ borderRadius: '0px' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#111111] font-mono-tech text-xs font-bold">
            <span className="px-2.5 py-1 bg-[#111111] text-[#F5C400]">
              SOBREMIM & CONTATO(06) // FICHA CATALOGRÁFICA DO CRIADOR
            </span>
            <span>ARQUIVO SP // FUNDAÇÃO: {CREATOR_PROFILE.foundedYear}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3 font-mono-tech text-xs border-b lg:border-b-0 lg:border-r border-[#111111] pb-6 lg:pb-0 lg:pr-6">
              <div className="text-2xl font-display-compressed font-extrabold text-[#111111]">
                {CREATOR_PROFILE.name} ({CREATOR_PROFILE.handle})
              </div>
              <div>
                <strong>IDADE:</strong> {CREATOR_PROFILE.ageLabel}
              </div>
              <div>
                <strong>BASE OPERACIONAL:</strong> {CREATOR_PROFILE.location}
              </div>
              <div>
                <strong>MATRIZ ACADÊMICA:</strong> {CREATOR_PROFILE.academicMatrix}
              </div>
              <div>
                <strong>MATRIZ INDUSTRIAL:</strong> {CREATOR_PROFILE.technicalMatrix}
              </div>
              <div>
                <strong>SEMIÓTICA DO NOME:</strong> {CREATOR_PROFILE.nameEtymology}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {CREATOR_PROFILE.biographyParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Curated Horizontal Photographic Contact Strip (@ganjastudio.br) */}
      <div className="p-6 sm:p-10 lg:p-12 border-b border-[#111111] bg-[#FFFFFF]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 font-mono-tech text-xs font-bold">
          <span>
            FITA DE CONTATO FOTOGRÁFICO // CURADORIA {CREATOR_PROFILE.brandHandle} (P&B → COR NO
            HOVER)
          </span>
          <span className="text-[#D92B2B]">TRANSIÇÃO SECA INSTANTÂNEA (0MS)</span>
        </div>

        <div
          data-testid="instagram-contact-strip"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {INSTAGRAM_STRIP_ITEMS.map((item) => (
            <a
              key={item.id}
              data-testid={`ig-strip-item-${item.id}`}
              href={item.permalink}
              target="_blank"
              rel="noreferrer"
              className="block bg-[#F4F3EF] brutal-border brutal-shadow p-2 ig-strip-filter"
              style={{ borderRadius: '0px' }}
            >
              <div className="font-mono-tech text-[10px] font-bold pb-1 mb-1 border-b border-[#111111] truncate">
                {item.tag}
              </div>
              <img
                src={item.imagePath}
                alt={item.caption}
                className="w-full aspect-[4/5] object-cover border border-[#111111]"
              />
              <div className="font-mono-tech text-[10px] mt-1.5 line-clamp-2">{item.caption}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Part 3: Monumental Brutalist Footer (#0D0D0D) */}
      <footer
        data-testid="brutalist-footer"
        className="w-full bg-[#0D0D0D] text-[#F4F3EF] px-6 sm:px-10 lg:px-12 py-12"
        style={{
          backgroundColor: '#0D0D0D',
          color: '#F4F3EF',
          borderRadius: '0px',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#F4F3EF]/30 items-center">
          <div className="lg:col-span-7">
            <img
              src="/assets/brand/ganja-star-mark.svg"
              alt="GANJA STUDIO Monumental Footer Mark"
              className="w-full max-w-lg h-auto invert mb-4"
            />
            <p className="font-mono-tech text-xs text-[#F4F3EF]/80 max-w-xl">
              GANJA STUDIO — BRUTALISMO EDITORIAL TÁTIL // GALERIA DE ARTE URBANA, ARQUIVO DE
              UPCYCLING 1/1 & MOSTRUÁRIO INTERATIVO CASA DE CRIADORES.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 font-mono-tech text-sm font-bold">
            <a
              data-testid="footer-link-ganjastudio"
              href={CREATOR_PROFILE.instagramBrandUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#1A1A1A] text-[#F4F3EF] border border-[#F4F3EF] flex items-center justify-between hover:bg-[#F5C400] hover:text-[#111111]"
              style={{ borderRadius: '0px', transitionDuration: '0ms' }}
            >
              <span>INSTAGRAM OFICIAL DA MARCA</span>
              <span>{CREATOR_PROFILE.brandHandle}</span>
            </a>

            <a
              data-testid="footer-link-isaquex"
              href={CREATOR_PROFILE.instagramCreatorUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#1A1A1A] text-[#F4F3EF] border border-[#F4F3EF] flex items-center justify-between hover:bg-[#D92B2B] hover:text-[#FFFFFF]"
              style={{ borderRadius: '0px', transitionDuration: '0ms' }}
            >
              <span>DIREÇÃO CRIATIVA & STYLING</span>
              <span>{CREATOR_PROFILE.handle}</span>
            </a>

            <a
              data-testid="footer-link-email"
              href={CREATOR_PROFILE.mailtoUrl}
              className="p-4 bg-[#F5C400] text-[#111111] border border-[#F4F3EF] flex items-center justify-between hover:bg-[#008055] hover:text-[#FFFFFF]"
              style={{ borderRadius: '0px', transitionDuration: '0ms' }}
            >
              <span>CONTATO DIRETO & ENCOMENDAS</span>
              <span>{CREATOR_PROFILE.email}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-[#F4F3EF]/70">
          <span>© 2022–2026 GANJA STUDIO (@ganjastudio.br) — ISAQUE GANDRA (@isaquex)</span>
          <span>SÃO PAULO // UFMG + SENAI // BÉTON BRUT DIGITAL</span>
        </div>
      </footer>
    </section>
  );
};
