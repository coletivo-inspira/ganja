import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { StickyHeader } from '../components/StickyHeader';
import { CustomCursor } from '../components/CustomCursor';
import { LOOKS_CATALOG } from '../data/collection';
import { STAGE_PERFORMANCES, STYLING_LINEAGE_CONTEXT } from '../data/performances';
import { URBAN_STICKERS } from '../data/stickers';
import { MOODBOARD_ARTIFACTS } from '../data/moodboard';
import { CREATOR_PROFILE, INSTAGRAM_STRIP_ITEMS, NAV_CELLS } from '../data/creator';

const ROOT_DIR = path.resolve(__dirname, '../..');

describe('Milestone 1 — Foundation, Design Tokens, Brand/Visual Assets, Data Models & Global Shell (F01–F10)', () => {
  describe('1. Official Brand Mark & Editorial Asset Pipeline (F06)', () => {
    it('extracts ganja-star-mark.svg with viewBox="92 242 847 187" and 6 semantic <g> groups', () => {
      const svgPath = path.join(ROOT_DIR, 'public/assets/brand/ganja-star-mark.svg');
      expect(fs.existsSync(svgPath)).toBe(true);
      const content = fs.readFileSync(svgPath, 'utf-8');
      expect(content).toContain('<svg');
      expect(content).toContain('viewBox="92 242 847 187"');
      for (const groupId of [
        'glyph-G',
        'glyph-STAR-1',
        'spatter-mid',
        'glyph-N',
        'glyph-J',
        'glyph-STAR-2',
      ]) {
        expect(content).toContain(`id="${groupId}"`);
      }
    });

    it('extracts isolated ganja-star-star.svg with viewBox="258 257 163 157"', () => {
      const starSvgPath = path.join(ROOT_DIR, 'public/assets/brand/ganja-star-star.svg');
      expect(fs.existsSync(starSvgPath)).toBe(true);
      const starSvg = fs.readFileSync(starSvgPath, 'utf-8');
      expect(starSvg).toContain('viewBox="258 257 163 157"');
      expect(starSvg).toContain('<path d="M');
    });

    it('extracts cropped 847x187 ganja-star-mark.png with valid PNG header and non-zero size', () => {
      const pngPath = path.join(ROOT_DIR, 'public/assets/brand/ganja-star-mark.png');
      expect(fs.existsSync(pngPath)).toBe(true);
      const buf = fs.readFileSync(pngPath);
      expect(buf.length).toBeGreaterThan(5000);
      expect(buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
    });

    it('generates all 10 Lookbook silhouette SVG plates (look-01-silhouette.svg .. look-10-silhouette.svg)', () => {
      for (let i = 1; i <= 10; i++) {
        const num = String(i).padStart(2, '0');
        const sil = path.join(ROOT_DIR, `public/assets/looks/look-${num}-silhouette.svg`);
        expect(fs.existsSync(sil)).toBe(true);
        expect(fs.readFileSync(sil, 'utf-8')).toContain('viewBox="0 0 600 800"');
      }
    });

    it('generates all 10 Lookbook macro zoom SVG plates (look-01-macro.svg .. look-10-macro.svg)', () => {
      for (let i = 1; i <= 10; i++) {
        const num = String(i).padStart(2, '0');
        const mac = path.join(ROOT_DIR, `public/assets/looks/look-${num}-macro.svg`);
        expect(fs.existsSync(mac)).toBe(true);
        expect(fs.readFileSync(mac, 'utf-8')).toContain('MACRO ZOOM');
      }
    });

    it('generates all 4 Stage Proof plates, 6 Moodboard plates, and 6 Instagram contact strip plates', () => {
      for (const slug of ['anitta', 'marina-sena', 'pedro-sampaio', 'kendrick-lamar']) {
        expect(fs.existsSync(path.join(ROOT_DIR, `public/assets/stage/${slug}.svg`))).toBe(true);
      }
      for (let i = 1; i <= 6; i++) {
        const num = String(i).padStart(2, '0');
        expect(fs.existsSync(path.join(ROOT_DIR, `public/assets/moodboard/moodboard-${num}.svg`))).toBe(true);
        expect(fs.existsSync(path.join(ROOT_DIR, `public/assets/instagram/ig-${num}.svg`))).toBe(true);
      }
    });
  });

  describe('2. Brutalismo Editorial Tátil Design Tokens & Anti-Pattern Enforcement (F01–F05)', () => {
    const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');
    const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');

    it('declares primary surface tokens (#F4F3EF Off-white cru & #FFFFFF Branco puro 032c)', () => {
      expect(cssContent).toContain('--surface-paper: #F4F3EF;');
      expect(cssContent).toContain('--surface-white: #FFFFFF;');
    });

    it('declares secondary dark surface tokens (#0D0D0D Preto absoluto & #1A1A1A Cinza chumbo) and structural ink (#111111)', () => {
      expect(cssContent).toContain('--surface-stage: #0D0D0D;');
      expect(cssContent).toContain('--surface-charcoal: #1A1A1A;');
      expect(cssContent).toContain('--ink-structural: #111111;');
    });

    it('declares Ganja Star semiotic accent palette (#D92B2B, #F5C400, #008055)', () => {
      expect(cssContent).toContain('--accent-red: #D92B2B;');
      expect(cssContent).toContain('--accent-yellow: #F5C400;');
      expect(cssContent).toContain('--accent-green: #008055;');
    });

    it('enforces 0px border-radius, 1px solid #111111 borders, and 4px 4px 0px #111111 hard shadows', () => {
      expect(cssContent).toContain('--border-brutal: 1px solid #111111;');
      expect(cssContent).toContain('--shadow-brutal: 4px 4px 0px #111111;');
      expect(cssContent).toContain('--radius-brutal: 0px;');
      expect(cssContent).toContain('border-radius: 0px !important;');
    });

    it('strictly prohibits Liquid Glass backdrop-filter blur and provides Vinyl/Mylar/Acrylic semiotic sheen classes', () => {
      expect(cssContent).not.toContain('backdrop-filter: blur(');
      expect(cssContent).toContain('backdrop-filter: none !important;');
      expect(cssContent).toContain('.sheen-vinyl-sticker');
      expect(cssContent).toContain('.sheen-mylar-archive');
      expect(cssContent).toContain('.sheen-scratched-acrylic');
    });

    it('configures 3-tier typography tokens in index.css and Google Fonts in index.html', () => {
      expect(cssContent).toContain("--font-display: 'Syne', 'Archivo Black', 'Bebas Neue'");
      expect(cssContent).toContain("--font-body: 'Plus Jakarta Sans', 'Inter'");
      expect(cssContent).toContain("--font-mono: 'Space Mono', 'JetBrains Mono'");
      expect(htmlContent).toContain('Syne');
      expect(htmlContent).toContain('Plus+Jakarta+Sans');
      expect(htmlContent).toContain('Space+Mono');
      expect(htmlContent).toContain('/assets/brand/ganja-star-star.svg');
    });
  });

  describe('3. Canonical Data Catalogs Integrity (Collection, Performances, Stickers, Moodboard, Creator)', () => {
    it('exports all 10 GANJA STAR looks in sequential order LOOK 01 to LOOK 10', () => {
      expect(LOOKS_CATALOG).toHaveLength(10);
      expect(LOOKS_CATALOG.map((l) => l.code)).toEqual([
        'LOOK 01',
        'LOOK 02',
        'LOOK 03',
        'LOOK 04',
        'LOOK 05',
        'LOOK 06',
        'LOOK 07',
        'LOOK 08',
        'LOOK 09',
        'LOOK 10',
      ]);
    });

    it('verifies exact Portuguese titles for LOOK 01 through LOOK 10 from ORIGINAL_REQUEST.md', () => {
      expect(LOOKS_CATALOG[0].title).toBe('Macacão Cargo');
      expect(LOOKS_CATALOG[1].title).toBe('Calça Cargo + Camiseta Ozempic');
      expect(LOOKS_CATALOG[2].title).toBe('Conjunto "Adesivos de Caminhão"');
      expect(LOOKS_CATALOG[3].title).toBe('Short Guerrilha + Regatinha Ganja Star');
      expect(LOOKS_CATALOG[4].title).toBe('Moletom Legalize Já');
      expect(LOOKS_CATALOG[5].title).toBe('Conjunto feito a partir de retalhos de couro e pelúcia');
      expect(LOOKS_CATALOG[6].title).toBe('Conjunto feito a partir de retalhos de couro');
      expect(LOOKS_CATALOG[7].title).toBe('Vestido feito a partir de retalhos');
      expect(LOOKS_CATALOG[8].title).toBe('Conjunto');
      expect(LOOKS_CATALOG[9].title).toBe('Jaqueta Puffer + Bermuda Cargo + Boné');
    });

    it('registers Ateliê Vivo work-in-progress status on LOOK 03 (80% CONCLUIDO) and LOOK 04 (95% CONCLUIDO)', () => {
      const look03 = LOOKS_CATALOG[2];
      expect(look03.completionPercent).toBe(80);
      expect(look03.statusBadge).toBe('80% CONCLUIDO');
      expect(look03.isWorkInProgress).toBe(true);

      const look04 = LOOKS_CATALOG[3];
      expect(look04.completionPercent).toBe(95);
      expect(look04.statusBadge).toBe('95% CONCLUIDO');
      expect(look04.isWorkInProgress).toBe(true);

      const completedLooks = LOOKS_CATALOG.filter((l) => l.number !== 3 && l.number !== 4);
      expect(completedLooks.every((l) => l.completionPercent === 100 && !l.isWorkInProgress)).toBe(true);
    });

    it('formats custom cursor material tags on all 10 looks including exact LOOK 06 tag', () => {
      expect(LOOKS_CATALOG[5].cursorMaterialTag).toBe(
        '[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]'
      );
      for (const look of LOOKS_CATALOG) {
        expect(look.cursorMaterialTag).toMatch(/^\[.+ \/\/ INSPECIONAR LOOK \d{2}\]$/);
      }
    });

    it('exports all 4 Stage Proof artists and styling lineage citing Fenômeno Natural, Rock in Rio, Mariana Cavanellas, and Clara Tannure', () => {
      expect(STAGE_PERFORMANCES.map((s) => s.displayLabel)).toEqual([
        'ANITTA (SHOWS)',
        'MARINA SENA (VIDEOCLIPE & PALCO)',
        'PEDRO SAMPAIO (FIGURINO BALLET)',
        'KENDRICK LAMAR (FIGURINO BALLET)',
      ]);
      expect(STYLING_LINEAGE_CONTEXT.summary).toContain('Fenômeno Natural');
      expect(STYLING_LINEAGE_CONTEXT.summary).toContain('Rock in Rio');
      expect(STYLING_LINEAGE_CONTEXT.summary).toContain('Mariana Cavanellas');
      expect(STYLING_LINEAGE_CONTEXT.summary).toContain('Clara Tannure');
    });

    it('exports all 5 urban stickers with semiotic codes (GSH-2168, GANJA 25G, GOD SAVE BEARS FROM OZEMPIC, Não me siga estou perdida, G★NJ★)', () => {
      expect(URBAN_STICKERS).toHaveLength(5);
      expect(URBAN_STICKERS.map((s) => s.code)).toEqual([
        'GSH-2168',
        'GANJA 25G',
        'GOD SAVE BEARS FROM OZEMPIC',
        'Não me siga estou perdida',
        'G★NJ★',
      ]);
    });

    it('exports 6 moodboard artifacts, 6 Instagram strip items, and creator profile for Isaque Gandra (@isaquex)', () => {
      expect(MOODBOARD_ARTIFACTS).toHaveLength(6);
      expect(INSTAGRAM_STRIP_ITEMS).toHaveLength(6);
      expect(CREATOR_PROFILE.name).toBe('Isaque Gandra');
      expect(CREATOR_PROFILE.handle).toBe('@isaquex');
      expect(CREATOR_PROFILE.brandHandle).toBe('@ganjastudio.br');
      expect(CREATOR_PROFILE.email).toBe('gandraisaque@hotmail.com');
      expect(CREATOR_PROFILE.age).toBe(30);
    });
  });

  describe('4. StickyHeader & Navigation Rollover Preview (F07 & F08)', () => {
    it('renders all 7 unspaced uppercase cells matching Casa de Criadores summary index', () => {
      render(<StickyHeader />);
      expect(screen.getByTestId('nav-cell-brand').textContent).toBe('GANJASTUDIO');
      expect(screen.getByTestId('nav-cell-01').textContent).toBe('DEONDEVEIO?(01)');
      expect(screen.getByTestId('nav-cell-02').textContent).toBe('PUBLICOALVO(02)');
      expect(screen.getByTestId('nav-cell-03').textContent).toBe('ATUAÇÃODAMARCA(03)');
      expect(screen.getByTestId('nav-cell-04').textContent).toBe('FRENTESDECRIAÇÃO(04)');
      expect(screen.getByTestId('nav-cell-05').textContent).toBe('PROPOSTADEDESFILE(05)');
      expect(screen.getByTestId('nav-cell-06').textContent).toBe('CONTATO(06)');
    });

    it('activates Navigation Rollover Preview instantaneously on hover and hides on mouseLeave', () => {
      render(<StickyHeader />);
      const preview = screen.getByTestId('nav-rollover-preview');
      expect(preview).toHaveAttribute('data-active', 'false');

      const cell03 = screen.getByTestId('nav-cell-03');
      fireEvent.mouseEnter(cell03);
      expect(preview).toHaveAttribute('data-active', 'true');
      expect(preview).toHaveAttribute('data-preview-target', 'atuacao-03');

      fireEvent.mouseLeave(cell03);
      expect(preview).toHaveAttribute('data-active', 'false');
    });

    it('invokes onNavigate with targetSectionId when clicking any navigation cell', () => {
      const onNavigate = vi.fn();
      render(<StickyHeader onNavigate={onNavigate} />);

      for (const cell of NAV_CELLS) {
        const testId = cell.id.replace('nav-', 'nav-cell-');
        fireEvent.click(screen.getByTestId(testId));
        expect(onNavigate).toHaveBeenCalledWith(cell.targetSectionId);
      }
    });
  });

  describe('5. CustomCursor Studio Crosshair (+) & Material Inspection Tag (F09)', () => {
    it('renders + crosshair by default with expanded=false', () => {
      render(<CustomCursor />);
      expect(screen.getByTestId('custom-cursor-crosshair').textContent).toBe('+');
      expect(screen.getByTestId('custom-cursor')).toHaveAttribute('data-expanded', 'false');
      expect(screen.getByTestId('custom-cursor-label')).toHaveAttribute('data-active', 'false');
    });

    it('tracks pointer coordinates on mousemove and expands label on [data-cursor-look] hover', () => {
      render(
        <div>
          <CustomCursor />
          <div
            data-testid="mock-look-06"
            data-cursor-look="[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]"
          >
            Look 06 Card
          </div>
          <div data-testid="outside-zone">Outside</div>
        </div>
      );

      const cursor = screen.getByTestId('custom-cursor');
      const label = screen.getByTestId('custom-cursor-label');
      const lookEl = screen.getByTestId('mock-look-06');

      fireEvent.mouseMove(lookEl, { clientX: 240, clientY: 360 });
      expect(cursor).toHaveAttribute('data-x', '240');
      expect(cursor).toHaveAttribute('data-y', '360');
      expect(cursor).toHaveAttribute('data-expanded', 'true');
      expect(label).toHaveAttribute('data-active', 'true');
      expect(label.textContent).toBe('[COURO RECICLADO + PELÚCIA // INSPECIONAR LOOK 06]');

      fireEvent.mouseOver(screen.getByTestId('outside-zone'));
      expect(cursor).toHaveAttribute('data-expanded', 'false');
      expect(label).toHaveAttribute('data-active', 'false');
    });
  });

  describe('6. Full Application Shell & Canonical Section Anchors (F10)', () => {
    it('mounts App cleanly and exposes all 7 canonical section IDs (#hero-00 through #contato-06)', () => {
      render(<App />);
      for (const id of [
        'hero-00',
        'origem-01',
        'publico-02',
        'atuacao-03',
        'frentes-04',
        'desfile-05',
        'contato-06',
      ]) {
        expect(document.getElementById(id)).not.toBeNull();
      }
    });

    it('renders all 10 Lookbook cards with instant silhouette/macro hover toggle and WIP badges on Look 03 & Look 04', () => {
      render(<App />);
      expect(screen.getByTestId('wip-badge-look-03').textContent).toContain('80% CONCLUIDO');
      expect(screen.getByTestId('wip-badge-look-04').textContent).toContain('95% CONCLUIDO');

      const card01 = screen.getByTestId('look-card-01');
      expect(card01).toHaveAttribute('data-view-mode', 'silhouette');
      fireEvent.mouseEnter(card01);
      expect(card01).toHaveAttribute('data-view-mode', 'macro');
      fireEvent.mouseLeave(card01);
      expect(card01).toHaveAttribute('data-view-mode', 'silhouette');
    });

    it('opens the lateral Technical Inspection Drawer on Look card click and closes on Escape', () => {
      render(<App />);
      fireEvent.click(screen.getByTestId('look-card-06'));
      expect(screen.getByTestId('look-technical-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('drawer-look-title').textContent).toContain('LOOK 06');

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByTestId('look-technical-drawer')).toBeNull();
    });
  });
});
