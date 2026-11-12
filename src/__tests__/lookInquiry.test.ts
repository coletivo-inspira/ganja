import { describe, expect, it } from 'vitest';
import { LOOKS_CATALOG } from '../data/collection';
import { getLookInquiry } from '../data/lookInquiry';

describe('Contato comercial dos looks', () => {
  it.each(LOOKS_CATALOG)('inclui identificação e intenção de $code', (look) => {
    const inquiry = getLookInquiry(look, 'M');
    const url = new URL(inquiry.href);
    expect(url.searchParams.get('body')).toContain(look.code);
    expect(url.searchParams.get('subject')).toContain(inquiry.label);
    if (look.isWorkInProgress) expect(inquiry.label).toContain('PRÉ-RESERVA');
    else if (look.frontId === 'autoral-experimental') expect(inquiry.label).toContain('AUTORAL');
    else if (look.frontId === 'upcycling-1of1') expect(inquiry.label).toContain('AQUISIÇÃO');
    else expect(inquiry.label).toContain('TIRAGEM');
    expect(url.searchParams.get('body')?.includes('Tamanho de interesse: M')).toBe(look.frontId === 'pequena-escala');
  });
  it('permite consultar tamanho ainda não definido', () => {
    const look = LOOKS_CATALOG.find(item => item.frontId === 'pequena-escala')!;
    expect(new URL(getLookInquiry(look).href).searchParams.get('body')).toContain('A confirmar');
  });
});
