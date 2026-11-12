import type { StagePerformanceItem } from '../types/ganja';

export const STAGE_PERFORMANCES: StagePerformanceItem[] = [
  {
    id: 'anitta',
    displayLabel: 'ANITTA (SHOWS)',
    artist: 'ANITTA',
    eventContext: 'Múltiplos Shows & Turnê Internacional',
    year: '2023–2025',
    garmentUsed: 'Peças Custom Upcycling 1/1 & Streetwear Utilitário Ganja Studio',
    metadataLine: 'ANITTA / MÚLTIPLOS SHOWS / 2023–2025 / CUSTOM UPCYCLING & CARGO GANJA STUDIO',
    previewMedia: '/assets/stage/anitta.svg',
    accentColor: '#D92B2B',
  },
  {
    id: 'marina-sena',
    displayLabel: 'MARINA SENA (VIDEOCLIPE & PALCO)',
    artist: 'MARINA SENA',
    eventContext: 'Videoclipes & Banda do Espetáculo Fenômeno Natural no Rock in Rio',
    year: '2023–2024',
    garmentUsed: 'Figurino Autoral & Styling de Palco (Fenômeno Natural / Rock in Rio)',
    metadataLine: 'MARINA SENA / VIDEOCLIPE & FENÔMENO NATURAL (ROCK IN RIO) / 2023–2024 / STYLING & CONFECÇÃO AUTORAL',
    previewMedia: '/assets/stage/marina-sena.svg',
    accentColor: '#F5C400',
  },
  {
    id: 'pedro-sampaio',
    displayLabel: 'PEDRO SAMPAIO (FIGURINO BALLET)',
    artist: 'PEDRO SAMPAIO',
    eventContext: 'Shows & Grandes Festivais — Figurino Completo do Ballet de Palco',
    year: '2024',
    garmentUsed: 'Linha Utilitária de Alta Mobilidade, Cargos & Patchwork Ganja Studio',
    metadataLine: 'PEDRO SAMPAIO / FIGURINO BALLET DE PALCO / 2024 / CARGOS & PATCHWORK DE ALTA MOBILIDADE',
    previewMedia: '/assets/stage/pedro-sampaio.svg',
    accentColor: '#008055',
  },
  {
    id: 'kendrick-lamar',
    displayLabel: 'KENDRICK LAMAR (FIGURINO BALLET)',
    artist: 'KENDRICK LAMAR',
    eventContext: 'Performance Global — Figurino do Ballet de Palco',
    year: '2023–2024',
    garmentUsed: 'Composição de Figurino do Ballet de Palco em Reconstrução Têxtil',
    metadataLine: 'KENDRICK LAMAR / FIGURINO BALLET DE PALCO / 2023–2024 / RECONSTRUÇÃO TÊXTIL & STREETWEAR',
    previewMedia: '/assets/stage/kendrick-lamar.svg',
    accentColor: '#D92B2B',
  },
];

export const STYLING_LINEAGE_CONTEXT = {
  headline: 'CAPITAL CULTURAL FONOGRÁFICO & AUDIOVISUAL // DA RUA AO GRANDE ESPETÁCULO POP MUNDIAL',
  summary:
    'A presença da GANJA STUDIO em grandes palcos globais nasce da trajetória prévia e paralela de Isaque Gandra (@isaquex) como stylist na indústria fonográfica e audiovisual brasileira — tendo assinado o styling para projetos de artistas como Marina Sena (incluindo a banda do espetáculo Fenômeno Natural no Rock in Rio), Mariana Cavanellas e Clara Tannure.',
  referencedArtists: ['Anitta', 'Marina Sena', 'Pedro Sampaio', 'Kendrick Lamar', 'Mariana Cavanellas', 'Clara Tannure'],
  landmarkEvent: 'Fenômeno Natural no Rock in Rio',
};
