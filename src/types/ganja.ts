export type CreationFrontId = 'upcycling-1of1' | 'pequena-escala' | 'autoral-experimental';

export interface LookItem {
  id: string;                // e.g. 'look-01' .. 'look-10'
  code: string;              // 'LOOK 01' .. 'LOOK 10'
  shortCode: string;         // 'LOOK 1' .. 'LOOK 10'
  number: number;            // 1 .. 10
  title: string;             // Exact Portuguese title from ORIGINAL_REQUEST.md
  frontId: CreationFrontId;
  frontLabel: string;        // 'PEÇA ÚNICA (1/1 UPCYCLING)' | 'PEQUENA ESCALA' | 'AUTORAL / EXPERIMENTAL'
  completionPercent: number; // 100 for most; 80 for LOOK 03; 95 for LOOK 04
  statusBadge: string;       // '100% CONCLUIDO' | '80% CONCLUIDO' | '95% CONCLUIDO'
  isWorkInProgress: boolean; // true for LOOK 03 (80%) and LOOK 04 (95%)
  cursorMaterialTag: string; // e.g. '[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]'
  rawMaterials: string[];    // Detailed upcycling / textile raw materials list
  upcyclingTechnique: string;// UFMG conceptual + Senai industrial reverse-engineering description
  silhouetteImage: string;   // Path in /assets/looks/look-XX-silhouette.svg (or .png)
  macroImage: string;        // Path in /assets/looks/look-XX-macro.svg (or .png)
  featuredStickers?: string[];
  inquirySubject: string;    // Pre-filled subject for direct consultation CTA
}

export interface StagePerformanceItem {
  id: string;                // 'anitta' | 'marina-sena' | 'pedro-sampaio' | 'kendrick-lamar'
  displayLabel: string;      // 'ANITTA (SHOWS)' | 'MARINA SENA (VIDEOCLIPE & PALCO)' | 'PEDRO SAMPAIO (FIGURINO BALLET)' | 'KENDRICK LAMAR (FIGURINO BALLET)'
  artist: string;
  eventContext: string;      // e.g. 'Fenômeno Natural no Rock in Rio & Videoclipes'
  year: string;
  garmentUsed: string;
  metadataLine: string;      // 'Artista / Evento / Ano / Peça utilizada' formatted string
  previewMedia: string;      // Path in /assets/stage/
  accentColor: '#D92B2B' | '#F5C400' | '#008055';
}

export interface UrbanStickerItem {
  id: string;                // 'sticker-gsh-2168' | 'sticker-ganja-25g' | 'sticker-ozempic' | 'sticker-caminhao' | 'sticker-ganja-star'
  code: string;              // 'GSH-2168' | 'GANJA 25G' | 'GOD SAVE BEARS FROM OZEMPIC' | 'Não me siga estou perdida' | 'G★NJ★'
  secondaryText: string;
  primaryColor: '#D92B2B' | '#F5C400' | '#008055' | '#F4F3EF' | '#0D0D0D';
  textColor: '#0D0D0D' | '#F4F3EF' | '#FFFFFF' | '#F5C400';
  initialX: number;          // Percentage 0..80 within Hero gallery container
  initialY: number;          // Percentage 0..80 within Hero gallery container
  initialRotation: number;   // Degrees
  linkedLookCode: string;    // e.g. 'LOOK 03', 'LOOK 05', 'LOOK 02', 'LOOK 04'
}

export interface MoodboardArtifact {
  id: string;
  title: string;
  category: 'GARIMPO TÊXTIL' | 'SINALIZAÇÃO VIÁRIA' | 'MODELAGEM SENAI' | 'ESTÉTICA UFMG' | 'ATELIÊ SP';
  sourceNote: string;
  linkedLookCode: string;    // 'LOOK 01' .. 'LOOK 10'
  imagePath: string;
  initialX: number;
  initialY: number;
}

export interface NavCellItem {
  id: string;                // 'nav-brand' | 'nav-01' .. 'nav-06'
  rawText: string;           // 'GANJASTUDIO' | 'DEONDEVEIO?(01)' | 'PUBLICOALVO(02)' | 'ATUAÇÃODAMARCA(03)' | 'FRENTESDECRIAÇÃO(04)' | 'PROPOSTADEDESFILE(05)' | 'CONTATO(06)'
  labelPart: string;         // 'DEONDEVEIO?' etc.
  indexPart?: string;        // '(01)' .. '(06)'
  targetSectionId: string;   // 'hero-00' | 'origem-01' | 'publico-02' | 'atuacao-03' | 'frentes-04' | 'desfile-05' | 'contato-06'
  previewTitle: string;
  previewImage: string;
}

export interface InstagramStripItem {
  id: string;
  handle: string;
  caption: string;
  tag: string;
  imagePath: string;
  permalink: string;
  linkedLookCode: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  brandHandle: string;
  email: string;
  age: number;
  ageLabel: string;
  location: string;
  foundedYear: number;
  academicMatrix: string;
  technicalMatrix: string;
  nameEtymology: string;
  stylingLineage: string[];
  biographyParagraphs: string[];
  instagramBrandUrl: string;
  instagramCreatorUrl: string;
  mailtoUrl: string;
}
