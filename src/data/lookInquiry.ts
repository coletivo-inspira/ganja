import type { LookItem } from '../types/ganja';

export const INQUIRY_SIZES = ['P', 'M', 'G', 'GG'] as const;
export type InquirySize = typeof INQUIRY_SIZES[number];

export const UNIQUE_PIECE_SEAL = '[PEÇA ÚNICA 1/1 // ARQUIVO VIVO]';
export const MEASUREMENT_FIELDS = ['BUSTO', 'CINTURA', 'QUADRIL', 'COMPRIMENTO'] as const;
export const MEASUREMENT_PENDING = 'SOB CONSULTA';

/** Fixed measurements of a 1/1 piece; fields the brand has not supplied read "SOB CONSULTA". */
export function getUniquePieceMeasurements(look: LookItem) {
  return MEASUREMENT_FIELDS.map((field) => ({
    field,
    value: look.measurements?.[field] ?? MEASUREMENT_PENDING,
  }));
}

export function getLookInquiry(look: LookItem, size?: InquirySize) {
  const labels = {
    'upcycling-1of1': 'SOLICITAR AQUISIÇÃO / ACERVO DE STYLING',
    'pequena-escala': 'ENCOMENDAR TIRAGEM LIMITADA',
    'autoral-experimental': 'CONSULTAR PROJETO AUTORAL / STYLING',
  };
  const label = look.isWorkInProgress
    ? 'ENTRAR NA FILA DE PRÉ-RESERVA DO ATELIÊ'
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
