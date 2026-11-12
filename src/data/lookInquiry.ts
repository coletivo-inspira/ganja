import type { LookItem } from '../types/ganja';

export const INQUIRY_SIZES = ['P', 'M', 'G', 'GG'] as const;
export type InquirySize = typeof INQUIRY_SIZES[number];

export function getLookInquiry(look: LookItem, size?: InquirySize) {
  const labels = {
    'upcycling-1of1': 'SOLICITAR AQUISIÇÃO / ACERVO DE STYLING',
    'pequena-escala': 'ENCOMENDAR TIRAGEM LIMITADA',
    'autoral-experimental': 'CONSULTAR PROJETO AUTORAL / STYLING',
  };
  const label = look.isWorkInProgress
    ? 'SOLICITAR PRÉ-RESERVA DO ATELIÊ'
    : labels[look.frontId];
  const acceptsSize = look.frontId === 'pequena-escala';
  const body = [
    `Olá! Tenho interesse em ${look.code} — ${look.title}.`,
    `Solicitação: ${label}.`,
    `Frente: ${look.frontLabel}.`,
    `Produção: ${look.completionPercent}%.`,
    ...(acceptsSize ? [`Tamanho de interesse: ${size ?? 'A confirmar'}.`] : []),
    'Gostaria de confirmar medidas, disponibilidade, valores e prazos.',
  ].join('\n');
  return {
    label,
    acceptsSize,
    href: `mailto:gandraisaque@hotmail.com?subject=${encodeURIComponent(`${look.code} — ${label}`)}&body=${encodeURIComponent(body)}`,
  };
}
