# Project: GANJA STUDIO — Plataforma Web Oficial (Brutalismo Editorial Tátil)

## Architecture

- **Product Vision**: Official digital platform, urban art gallery, upcycling archive, and interactive lookbook for **GANJA STUDIO (`@ganjastudio.br`)**, founded in 2022 by **Isaque Gandra (`@isaquex`)** at the intersection of UFMG conceptual fashion design and Senai industrial garment engineering in downtown São Paulo.
- **Visual Paradigm**: **Brutalismo Editorial Tátil & Anti-Design Arquivístico** (benchmarked against Martine Rose, 032c, Balenciaga, Marine Serre, Brain Dead, Studio Brot, Are.na, and EXRCST).
- **Strict Anti-Patterns (Zero Tolerance)**:
  - **NO Liquid Glass / Glassmorphism**: `backdrop-filter: blur(...)` is strictly forbidden across all containers. Any layer sheen must simulate **Película Adesiva Vinílica (`Sticker Gloss`)**, **Acrílico Industrial Riscado**, or **Embalagem Mylar a Vácuo**.
  - **NO Rounded Corners**: Every container, card, button, badge, drawer, and input MUST have `border-radius: 0px`.
  - **NO Diffuse Shadows or Pastel Gradients**: All elevated elements use hard zero-blur drop shadows (`4px 4px 0px #111111`) and exposed `1px solid #111111` structural grid borders.
  - **NO Slow Opacity Fades on Interactive Controls**: State transitions on menus, buttons, lookbook silhouette/macro toggles, and the B&W-to-color Instagram strip must be dry and instantaneous (`0ms` / stepped), paired with weighted inertial page scrolling (`Lenis`).
- **Tech Stack**:
  - **Framework & Bundler**: Vite + React 19 + TypeScript (initialized with `npm` in `/home/antigravity/coletivo-inspira/ganja`).
  - **Styling**: Vanilla CSS + Tailwind CSS custom design tokens in `src/index.css` with Google Fonts (`Syne` 800 ExtraBold, `Archivo Black` / `Bebas Neue`, `Plus Jakarta Sans` 400/600, `Space Mono` 400/700).
  - **Motion & Digital Physics**: `lenis` (controlled inertial scroll) + `gsap` / pointer physics (scroll-driven kinetic `letter-spacing`, Section 03 `#0D0D0D` dark mode scroll transition, draggable SVG urban stickers with Vinyl Sticker Gloss physics, Are.na draggable moodboard blocks).
  - **Testing**: `vitest` + `@testing-library/react` (`jsdom`) for unit/component tests; `@playwright/test` configured with `executablePath: '/usr/lib/chromium/chromium'` and `args: ['--no-sandbox', '--disable-dev-shm-usage']` for E2E verification.

---

## Feature Inventory

Every feature from the Phase 0 Survey (`explorer_survey_1`, `explorer_survey_2`, `spec_miner_survey_3`) appears below with its assigned milestone. Zero features are left unassigned.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Brutalismo Editorial Tátil Structural Grid & Geometry | Exposed `1px solid #111111` architectural grid lines, mandatory `0px` border-radius on all elements, `4px 4px 0px #111111` hard drop-shadows, halftone/xerox/asphalt/Mylar tactile textures. | M1 | survey (`ORIGINAL_REQUEST.md` §2, §5 Bloco 1 & 2) |
| F02 | Liquid Glass Prohibition & Vinyl/Mylar Semiotic Sheen | Zero `backdrop-filter: blur` anywhere; depth/specular sheen on stickers and archival seals uses Vinyl Adhesive Film (`Sticker Gloss`), Scratched Industrial Acrylic, or Vacuum Mylar packaging. | M1, M2 | survey (`ORIGINAL_REQUEST.md` §2, §5 Bloco 1 & 4) |
| F03 | Surface Color Token System | Exact CSS variables & surfaces: Primary `#F4F3EF` (Off-white cru) & `#FFFFFF` (Branco puro 032c isolation); Secondary `#0D0D0D` (Preto absoluto) & `#1A1A1A` (Cinza chumbo); Structural ink `#111111`. | M1 | survey (`ORIGINAL_REQUEST.md` §5 Bloco 2) |
| F04 | Semiotic Accent Palette (`Ganja Star`) | Flat signaling colors: Vermelho Manifesto `#D92B2B`, Amarelo Sinalização `#F5C400`, Verde Placa `#008055`. | M1 | survey (`ORIGINAL_REQUEST.md` §3, §4, §5 Bloco 2) |
| F05 | 3-Tier Typography Hierarchy | Display: `Syne` (800 ExtraBold) / `Archivo Black` / `Bebas Neue` uppercase (`-0.04em` compressed & `0.5em` expanded tracking); Body: `Plus Jakarta Sans` / `Inter` (400/600); Technical: `Space Mono` / `JetBrains Mono` for `(01)`–`(06)`, `80%`/`95%`, and material tags. | M1 | survey (`ORIGINAL_REQUEST.md` §2, §4, §5 Bloco 2) |
| F06 | Official `G★NJ★` Brand Mark Asset Pipeline | Conversion of `/home/antigravity/abd85765-12c0-40e8-af30-600407e94f25.svg` (1024×682 RGBA PNG, active bbox `92,242 -> 938,428`) into true 6-group XML `<svg viewBox="92 242 847 187">` (`ganja-star-mark.svg`), isolated star SVG (`ganja-star-star.svg`), and cropped `847×187` PNG (`ganja-star-mark.png`), plus Look 01–10 & Stage Proof visual plates. | M1 | survey (`explorer_survey_1`, `explorer_survey_2`) |
| F07 | Brutalist Sticky Header (`Barra de Navegação Superior Fixa`) | Fixed top bar divided into `1px solid #111111` cells with verbatim unspaced uppercase strings: `GANJASTUDIO`, `DEONDEVEIO?(01)`, `PUBLICOALVO(02)`, `ATUAÇÃODAMARCA(03)`, `FRENTESDECRIAÇÃO(04)`, `PROPOSTADEDESFILE(05)`, `CONTATO(06)`, dry instant hover inversion, and smooth scroll jump. | M1 | survey (`ORIGINAL_REQUEST.md` §4, §5 Bloco 3 & 4) |
| F08 | Navigation Rollover Preview | Martine Rose-inspired instant visual preview card with monospace metadata floating when hovering navigation cells in the Sticky Header. | M1 | survey (`ORIGINAL_REQUEST.md` §3, §5 Bloco 3) |
| F09 | Custom Studio Crosshair Cursor (`+`) & Material Inspection Tag | Replaces native pointer on fine-pointer devices with technical crosshair (`+`); on hovering any Look (`[data-cursor-look]`), instantaneously expands into rectangular monospace label `[<MATÉRIA-PRIMA> // INSPECIONAR LOOK <XX>]` (e.g., `[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]`). | M1 | survey (`ORIGINAL_REQUEST.md` §3, §5 Bloco 4) |
| F10 | Lenis Inertial Smooth Scroll & Dry Instantaneous State Changes | Weighted inertial scroll via `Lenis` calibrated for sculptural fashion imagery, combined with `0ms` dry instantaneous state changes on menus, buttons, and image swaps. | M1 | survey (`ORIGINAL_REQUEST.md` §5 Bloco 1 & 4) |
| F11 | Section 00 — Asymmetric 12-Column Hero ("O Corpo como Superfície") | 12-column exposed-grid Hero with monumental `G★NJ★ STAR` typography + official `ganja-star-mark.svg` and styling/upcycling manifesto on the left, and Martine Rose-style `Hero Scroll Gallery` on the right. | M2 | survey (`ORIGINAL_REQUEST.md` §4, §5 Bloco 3) |
| F12 | Section 00 — Draggable SVG Urban Stickers with Vinyl Sticker Physics | 5 interactive pointer-draggable vector stickers over the Hero Scroll Gallery (`GSH-2168` / `GFM / GSH-2168`, `GANJA 25G`, `"GOD SAVE BEARS FROM OZEMPIC"`, `"Não me siga estou perdida"`, `G★NJ★` / `GNJ`) with `#D92B2B`/`#F5C400`/`#008055` accents, `4px 4px 0px #111111` shadow, and pointer-reactive Vinyl `Sticker Gloss` specular highlight. | M2 | survey (`ORIGINAL_REQUEST.md` §1, §2, §4, §5 Bloco 2–4) |
| F13 | Sections 01 & 02 — Origin & Manifesto (`DEONDEVEIO?(01)` + `PUBLICOALVO(02)`) | Asymmetric 2-column layout with verticalized spaced left margin (`D E O N D E V E I O ? 01`), UFMG TCC 2022 + Senai industrial construction narrative, `Gandra -> Ganja` pun, reverse garment engineering thesis, and technical monospace demographic frame (`IDADE: 18-35 ANOS`, `PÚBLICO: JOVEM, URBANO E UNDERGROUND`, `LOCAL: DE SÃO PAULO PARA O MUNDO`). | M2 | survey (`ORIGINAL_REQUEST.md` §1, §4, §5 Bloco 2 & 3) |
| F14 | Continuous Marquees & Scroll-Driven Kinetic Letter-Spacing | Deconstructed strings (`C R I A D A E M 2 0 2 2...`, `D E O N D E V E I O ?`) rendered as continuous brutalist marquees and scroll-reactive kinetic titles expanding `letter-spacing` toward `0.5em`. | M2 | survey (`ORIGINAL_REQUEST.md` §4, §5 Bloco 2 & 3) |
| F15 | Section 03 — Stage Proof (`ATUAÇÃODAMARCA(03)`) & Dark Mode Scroll Transition | Scroll-triggered `Color Change Scroll` to `#0D0D0D` / `#1A1A1A`; monumental edge-to-edge roster (`ANITTA (SHOWS)`, `MARINA SENA (VIDEOCLIPE & PALCO)` incl. *Fenômeno Natural* Rock in Rio + Mariana Cavanellas & Clara Tannure context, `PEDRO SAMPAIO (FIGURINO BALLET)`, `KENDRICK LAMAR (FIGURINO BALLET)`) with cursor-following **Rollover Preview** (grainy visual/looping cut + `Artista / Evento / Ano / Peça utilizada` metadata). | M2 | survey (`ORIGINAL_REQUEST.md` §1, §4 Camada 2, §5 Bloco 2 & 3) |
| F16 | Section 04 — Dual Creation Architecture (`FRENTESDECRIAÇÃO(04)`) | 50% / 50% vertically split screen with dynamic hover expansion: `Lado A — Peças Únicas (1/1 Upcycling)` (Looks 03, 06, 07, 08) vs. `Lado B — Pequena Escala` (Camiseta Ozempic Look 02, Regatinha Ganja Star Look 04, Moletom Legalize Já Look 05, Cargos & Puffer Looks 01, 02, 04, 10). | M2 | survey (`ORIGINAL_REQUEST.md` §1, §5 Bloco 3) |
| F17 | Section 05 — Interactive Lookbook (`PROPOSTADEDESFILE(05)` — 10 Looks of `GANJA STAR`) | Editorial opening with `Ganja Star` Casa de Criadores concept + 3-column modular grid (`#FFFFFF` pure white 032c isolation, `1px solid #111111` borders, `3:4` vertical cards) registering all 10 Looks (`LOOK 01` to `LOOK 10`), instant silhouette-to-macro hover image swap, and explicit "Ateliê Vivo" progress bars & badges on `LOOK 03` (`80% CONCLUIDO`) and `LOOK 04` (`95% CONCLUIDO`). | M3 | survey (`ORIGINAL_REQUEST.md` §1, §4, §5 Bloco 2 & 3) |
| F18 | Section 05 — Technical Inspection Drawer (Marine Serre "Education Before Consumerism") | Straight-bordered lateral Drawer (`0px` radius, `1px solid #111111`, `4px 4px 0px #111111` shadow) opened on clicking any Look (`LOOK 01`–`LOOK 10`), featuring interactive Macro Texture Zoom viewer, Upcycling Material Spec Sheet (`ficha de materiais de upcycling`), completion status bar (`100%`, `80% CONCLUIDO`, `95% CONCLUIDO`), and Direct Inquiry/Order CTA (`Encomenda / Consulta Direta`). | M3 | survey (`ORIGINAL_REQUEST.md` §3, §4, §5 Bloco 3) |
| F19 | Section 05 — Are.na-Style Interactive Process Moodboard (`Mesa de Luz Digital`) | Layer 3 of Instagram curation ("Processo e Conceito"): interactive digital light table where visitors drag-and-drop (`arrastar`) urban research cutouts (truck stickers, `GSH-2168` license plate, Senai pattern paper, leather/plush offcuts) and inspect which `GANJA STAR` look each artifact inspired. | M3 | survey (`ORIGINAL_REQUEST.md` §3, §4 Camada 3) |
| F20 | Section 06 — Creator Catalog Card, B&W-to-Color Instagram Strip & Brutalist Footer (`SOBREMIM & CONTATO(06)`) | Catalog index card (`ficha catalográfica`) of Isaque Gandra (`30 anos`, centro de SP, UFMG/Senai, stylist trajectory), curated `@ganjastudio.br` horizontal contact strip in high-contrast B&W (`grayscale(100%) contrast(125%)`) snapping to full color on hover, and `#0D0D0D` monumental footer with direct links to `@ganjastudio.br`, `@isaquex`, and `gandraisaque@hotmail.com`. | M3 | survey (`ORIGINAL_REQUEST.md` §1, §4, §5 Bloco 2 & 3) |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| M1 | **Foundation, Design Tokens, Brand/Visual Assets, Data Models & Global Shell** (`sub_orch_m1`) | Scaffold Vite+React+TS+Tailwind+GSAP+Lenis+Vitest; convert `abd85765-12c0-40e8-af30-600407e94f25.svg` into `ganja-star-mark.svg`/`.png` & `ganja-star-star.svg`; generate/construct Look 01–10, Stage Proof, Moodboard & IG strip visual assets in `public/assets/`; implement `src/index.css` brutalist design tokens (F01–F05); implement typed data catalogs (`src/types/ganja.ts`, `src/data/*`); implement `StickyHeader.tsx` (F07, F08), `CustomCursor.tsx` (F09), `Lenis` scroll wrapper (F10), `src/App.tsx` shell with section component mounts, and `src/__tests__/foundation.test.tsx`. | none | IN_PROGRESS (`c5b810bf564577bf15ba355e1029a1aa`) |
| M2 | **Hero, Draggable Stickers, Origin/Manifesto, Stage Proof & Dual Architecture — Sections 00–04** (`sub_orch_m2`) | Implement `HeroSection.tsx` & `DraggableSticker.tsx` (F02, F11, F12: 12-col Hero, Hero Scroll Gallery, 5 draggable SVG stickers with Vinyl Sticker Gloss physics); `OriginManifestoSection.tsx` & `KineticMarquee.tsx` (F13, F14: `DEONDEVEIO?(01)`, `PUBLICOALVO(02)`, scroll kinetic letter-spacing, continuous marquees, demographic frame); `StageProofSection.tsx` (F15: `#0D0D0D` scroll transition, Anitta/Marina Sena/Pedro Sampaio/Kendrick Lamar monumental roster + cursor Rollover Preview); `DualArchitectureSection.tsx` (F16: 50/50 split `1/1 Upcycling` vs `Pequena Escala` with dynamic hover expansion); and `src/__tests__/sections00to04.test.tsx`. | M1 | PLANNED |
| M3 | **Interactive Lookbook (Looks 01–10), Technical Drawer, Are.na Moodboard & Contact Footer — Sections 05–06** (`sub_orch_m3`) | Implement `LookbookSection.tsx` & `LookCard.tsx` (F17: `PROPOSTADEDESFILE(05)`, 3-col `#FFFFFF` 032c grid for `LOOK 01`–`LOOK 10`, instant silhouette/macro hover swap, `80% CONCLUIDO` on Look 03 & `95% CONCLUIDO` on Look 04); `LookTechnicalDrawer.tsx` (F18: straight-bordered lateral drawer with Macro Texture Zoom, Upcycling Material Spec Sheet, status progress bar, and direct inquiry CTA); `ArenaMoodboard.tsx` (F19: Are.na draggable digital light table); `CreatorContactFooter.tsx` (F20: Isaque Gandra catalog card, B&W-to-color `@ganjastudio.br` contact strip, `#0D0D0D` footer with `@ganjastudio.br`, `@isaquex`, `gandraisaque@hotmail.com`); and `src/__tests__/sections05to06.test.tsx`. | M1 | PLANNED |
| M4 | **Final Milestone — Full E2E Verification (Tiers 1–4) & Adversarial Coverage Hardening (Tier 5)** (`sub_orch_m4`) | Phase 1: Execute full E2E test suite (`TEST_READY.md`) across Tiers 1–4 and fix any defects until 100% pass. Phase 2: White-box Tier 5 adversarial coverage hardening (`Challenger` with `test-coverage-audit` → `Worker` → `Reviewer` → `Auditor` loop) until zero gaps remain. | M1, M2, M3, E2E_TRACK | PLANNED |
| E2E | **E2E Testing Track — Opaque-Box Requirement-Driven Test Suite** (`sub_orch_e2e`) | Build Playwright E2E harness (`playwright.config.ts` with `/usr/lib/chromium/chromium`, `TEST_INFRA.md`) and 4-tier requirement-driven test suite (`tests/e2e/tier1-features.spec.ts`, `tier2-boundaries.spec.ts`, `tier3-combinations.spec.ts`, `tier4-scenarios.spec.ts`) covering all 20 features (`≥11×20 + 10 = ≥230` test assertions/cases); publish `TEST_READY.md`. | none | IN_PROGRESS (`7e7e10e5bb19add32784eacf48205402`) |

---

## Interface Contracts

### 1. Canonical TypeScript Data Contracts (`src/types/ganja.ts`)

```ts
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
```

### 2. DOM, Section ID & `data-testid` Contract (Shared by Implementation Track & E2E Testing Track)

To ensure deterministic, opaque-box E2E testing and seamless cross-module integration, the application MUST expose the following semantic DOM anchors and `data-testid` attributes:

- **Dev & Preview Server**:
  - `npm run dev` serves at `http://localhost:5173` (configured in `vite.config.ts` with `server: { port: 5173, strictPort: false, host: true }`).
  - `npm run build` outputs production bundle to `dist/`.
  - `npm run test:unit` runs `vitest run`.
  - `npm run test:e2e` runs `playwright test`.
- **Global & Navigation Elements**:
  - Sticky Header `<header data-testid="sticky-header">`:
    - Brand cell: `[data-testid="nav-cell-brand"]` containing `GANJASTUDIO` and `<svg>` / `<img>` of `G★NJ★`.
    - Indexed cells: `[data-testid="nav-cell-01"]` (`DEONDEVEIO?(01)`), `[data-testid="nav-cell-02"]` (`PUBLICOALVO(02)`), `[data-testid="nav-cell-03"]` (`ATUAÇÃODAMARCA(03)`), `[data-testid="nav-cell-04"]` (`FRENTESDECRIAÇÃO(04)`), `[data-testid="nav-cell-05"]` (`PROPOSTADEDESFILE(05)`), `[data-testid="nav-cell-06"]` (`CONTATO(06)`).
    - Navigation Rollover Preview container: `[data-testid="nav-rollover-preview"]`.
  - Custom Studio Crosshair Cursor: `[data-testid="custom-cursor"]` displaying `+` by default and `[data-testid="custom-cursor-label"]` with `[<MATÉRIA-PRIMA> // INSPECIONAR LOOK <XX>]` when hovering any `[data-cursor-look]` element.
- **Section 00 — Hero (`<section id="hero-00" data-testid="section-hero-00">`)**:
  - Left manifesto column (`[data-testid="hero-manifesto-col"]`) with `G★NJ★ STAR` headline and official `G★NJ★` vector mark (`[data-testid="brand-mark-svg"]`).
  - Right Hero Scroll Gallery (`[data-testid="hero-scroll-gallery"]`).
  - Draggable SVG Urban Stickers (`[data-testid="draggable-sticker-sticker-gsh-2168"]`, `[data-testid="draggable-sticker-sticker-ganja-25g"]`, `[data-testid="draggable-sticker-sticker-ozempic"]`, `[data-testid="draggable-sticker-sticker-caminhao"]`, `[data-testid="draggable-sticker-sticker-ganja-star"]`), each supporting pointer drag (`pointerdown` -> `pointermove` -> `pointerup` updates transform/position coordinates) and Vinyl `Sticker Gloss` specular layer (`[data-testid="sticker-gloss-layer"]`).
- **Sections 01 & 02 — Origem & Público-Alvo (`<section id="origem-01" data-testid="section-origem-01">` & `<div id="publico-02" data-testid="section-publico-02">`)**:
  - Kinetic spaced title (`[data-testid="kinetic-title-origem"]`) containing `D E O N D E V E I O ?` and continuous marquee (`[data-testid="kinetic-marquee"]`) containing `C R I A D A E M 2 0 2 2`.
  - Origin narrative citing `2022`, `UFMG`, `Senai`, `Isaque Gandra`, `Ganja`, and `engenharia reversa do vestuário`.
  - Technical Demographic Frame (`[data-testid="demographic-frame"]`) displaying `IDADE: 18-35 ANOS`, `PÚBLICO: JOVEM, URBANO E UNDERGROUND`, `LOCAL: DE SÃO PAULO PARA O MUNDO`.
- **Section 03 — Prova de Palco (`<section id="atuacao-03" data-testid="section-atuacao-03">`)**:
  - Dark mode surface (`#0D0D0D` / `rgb(13, 13, 13)`).
  - Artist rows: `[data-testid="stage-row-anitta"]` (`ANITTA (SHOWS)`), `[data-testid="stage-row-marina-sena"]` (`MARINA SENA (VIDEOCLIPE & PALCO)`), `[data-testid="stage-row-pedro-sampaio"]` (`PEDRO SAMPAIO (FIGURINO BALLET)`), `[data-testid="stage-row-kendrick-lamar"]` (`KENDRICK LAMAR (FIGURINO BALLET)`), plus styling context mentioning `Fenômeno Natural`, `Rock in Rio`, `Mariana Cavanellas`, and `Clara Tannure`.
  - Floating Stage Rollover Preview (`[data-testid="stage-rollover-preview"]`) showing visual media + technical metadata (`Artista`, `Evento`, `Ano`, `Peça`).
- **Section 04 — Arquitetura Dual (`<section id="frentes-04" data-testid="section-frentes-04">`)**:
  - Split container (`[data-testid="dual-split-container"]`) with `[data-testid="dual-side-upcycling"]` (`Peças Únicas 1/1 Upcycling`: Looks 03, 06, 07, 08) and `[data-testid="dual-side-pequena-escala"]` (`Pequena Escala`: Looks 01, 02, 04, 05, 10), expanding the active/hovered side dynamically.
- **Section 05 — Mostruário Interativo, Technical Drawer & Moodboard (`<section id="desfile-05" data-testid="section-desfile-05">`)**:
  - Lookbook 3-column grid (`[data-testid="lookbook-grid"]`) containing 10 cards: `[data-testid="look-card-01"]` through `[data-testid="look-card-10"]` (with `data-cursor-look` attribute set to the look's `cursorMaterialTag`).
  - Work-in-progress badges & progress bars: `[data-testid="wip-badge-look-03"]` (`80% CONCLUIDO`) and `[data-testid="wip-badge-look-04"]` (`95% CONCLUIDO`).
  - Hovering any Look card instantaneously toggles between silhouette view (`data-view-mode="silhouette"`) and macro close-up view (`data-view-mode="macro"`).
  - Clicking any Look card opens the lateral **Technical Inspection Drawer** (`[data-testid="look-technical-drawer"]`), which contains:
    - Look code & title (`[data-testid="drawer-look-title"]`)
    - Interactive Macro Texture Zoom area (`[data-testid="drawer-macro-zoom"]`)
    - Upcycling Material Spec Sheet (`[data-testid="drawer-material-sheet"]`)
    - Completion progress bar (`[data-testid="drawer-progress-bar"]`)
    - Direct consultation/order CTA link (`[data-testid="drawer-inquiry-cta"]`)
    - Close button (`[data-testid="drawer-close-btn"]`) + `Escape` key handler.
  - Are.na-Style Interactive Process Moodboard (`[data-testid="arena-moodboard"]`) with draggable research cards (`[data-testid^="moodboard-card-"]`).
- **Section 06 — Criador, Feed & Contato (`<section id="contato-06" data-testid="section-contato-06">`)**:
  - Creator Catalog Card (`[data-testid="creator-catalog-card"]`) featuring `Isaque Gandra`, `30 anos`, `São Paulo`, `UFMG`, `Senai`.
  - Horizontal Photographic Contact Strip (`[data-testid="instagram-contact-strip"]`) with items (`[data-testid^="ig-strip-item-"]`) that render in B&W by default and snap to full color on hover.
  - Monumental Brutalist Footer (`[data-testid="brutalist-footer"]`) on `#0D0D0D` with direct links to `@ganjastudio.br` (`[data-testid="footer-link-ganjastudio"]`), `@isaquex` (`[data-testid="footer-link-isaquex"]`), and `gandraisaque@hotmail.com` (`[data-testid="footer-link-email"]`).

---

## Code Layout

All source code, assets, and tests reside inside `/home/antigravity/coletivo-inspira/ganja` (NEVER inside `.agents/teamwork/`):

```text
/home/antigravity/coletivo-inspira/ganja/
├── PROJECT.md
├── TEST_INFRA.md                           # Owned by E2E Testing Track (sub_orch_e2e)
├── TEST_READY.md                           # Published by E2E Testing Track upon completion
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts                    # Owned by E2E Testing Track (sub_orch_e2e)
├── index.html
├── scripts/
│   └── build-assets.py                     # Extracts G★NJ★ SVG/PNG & generates editorial SVG/PNG plates
├── public/
│   └── assets/
│       ├── brand/
│       │   ├── ganja-star-mark.svg         # True 6-group XML SVG traced from abd85765-12c0-40e8-af30-600407e94f25.svg
│       │   ├── ganja-star-star.svg         # Isolated star emblem SVG (favicon & stamps)
│       │   └── ganja-star-mark.png         # Cropped 847x187 RGBA PNG
│       ├── looks/                          # Look 01–10 silhouette & macro texture plates
│       ├── stage/                          # Stage Proof visuals (Anitta, Marina Sena, Pedro Sampaio, Kendrick Lamar)
│       ├── moodboard/                      # Are.na light-table research cutouts
│       └── instagram/                      # Curated @ganjastudio.br contact strip plates
├── src/
│   ├── main.tsx                            # Owned by M1
│   ├── App.tsx                             # Owned by M1 (wires StickyHeader, CustomCursor, Sections 00–06)
│   ├── index.css                           # Owned by M1 (Design Tokens, 0px radius, 1px solid #111111, 4px hard shadow)
│   ├── types/
│   │   └── ganja.ts                        # Owned by M1 (Canonical TypeScript interfaces)
│   ├── data/
│   │   ├── collection.ts                   # Owned by M1 (All 10 GANJA STAR looks + 80%/95% WIP status)
│   │   ├── performances.ts                 # Owned by M1 (Anitta, Marina Sena, Pedro Sampaio, Kendrick Lamar)
│   │   ├── stickers.ts                     # Owned by M1 (5 urban stickers: GSH-2168, GANJA 25G, Ozempic, Caminhão, G★NJ★)
│   │   ├── moodboard.ts                    # Owned by M1 (Are.na research cutouts)
│   │   └── creator.ts                      # Owned by M1 (Isaque Gandra catalog bio, navigation items, IG strip)
│   ├── components/
│   │   ├── StickyHeader.tsx                # Owned by M1
│   │   ├── CustomCursor.tsx                # Owned by M1
│   │   ├── HeroSection.tsx                 # Owned by M2 (skeleton created in M1)
│   │   ├── DraggableSticker.tsx            # Owned by M2 (skeleton created in M1)
│   │   ├── OriginManifestoSection.tsx      # Owned by M2 (skeleton created in M1)
│   │   ├── KineticMarquee.tsx              # Owned by M2 (skeleton created in M1)
│   │   ├── StageProofSection.tsx           # Owned by M2 (skeleton created in M1)
│   │   ├── DualArchitectureSection.tsx     # Owned by M2 (skeleton created in M1)
│   │   ├── LookbookSection.tsx             # Owned by M3 (skeleton created in M1)
│   │   ├── LookCard.tsx                    # Owned by M3 (skeleton created in M1)
│   │   ├── LookTechnicalDrawer.tsx         # Owned by M3 (skeleton created in M1)
│   │   ├── ArenaMoodboard.tsx              # Owned by M3 (skeleton created in M1)
│   │   └── CreatorContactFooter.tsx        # Owned by M3 (skeleton created in M1)
│   └── __tests__/
│       ├── foundation.test.tsx             # Owned by M1
│       ├── sections00to04.test.tsx         # Owned by M2
│       └── sections05to06.test.tsx         # Owned by M3
└── tests/
    └── e2e/                                # Owned exclusively by E2E Testing Track (sub_orch_e2e)
        ├── tier1-features.spec.ts
        ├── tier2-boundaries.spec.ts
        ├── tier3-combinations.spec.ts
        └── tier4-scenarios.spec.ts
```
