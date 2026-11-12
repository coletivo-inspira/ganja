# Test Infrastructure Specification (`TEST_INFRA.md`)

## 1. Overview & Architecture
- **Project**: GANJA STUDIO — Plataforma Web Oficial (*Brutalismo Editorial Tátil & Anti-Design Arquivístico*)
- **Test Methodology**: 4-Tier Requirement-Driven Opaque-Box E2E Suite (paired with Milestone M4 Tier 5 White-Box Adversarial Hardening)
- **E2E Framework**: `@playwright/test`
- **Browser Engine**: Pre-installed System Chromium (`/usr/lib/chromium/chromium`, `v156.0.8078.79`)
- **Launch Options**:
  ```ts
  launchOptions: {
    executablePath: '/usr/lib/chromium/chromium',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  }
  ```
- **Application Server**:
  - Command: `npm run dev`
  - Base URL: `http://localhost:5173`
  - Playwright `webServer` config:
    ```ts
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 60000,
    }
    ```

---

## 2. How to Run the E2E Test Suite

### Full E2E Suite (All 4 Tiers)
```bash
npx playwright test
# or via package.json script:
npm run test:e2e
```

### Individual Tiers
```bash
# Tier 1: Feature Coverage (F01–F20 in isolation, >= 100 test cases)
npx playwright test tests/e2e/tier1-features.spec.ts

# Tier 2: Boundary, Corner, Viewport & Anti-Pattern Enforcement (>= 100 test cases)
npx playwright test tests/e2e/tier2-boundaries.spec.ts

# Tier 3: Cross-Feature Pairwise Combinations (>= 20 test cases)
npx playwright test tests/e2e/tier3-combinations.spec.ts

# Tier 4: Real-World Persona & End-to-End Scenarios (>= 10 test cases)
npx playwright test tests/e2e/tier4-scenarios.spec.ts
```

### List & Typecheck Verification (Dry-Run / Pre-Server Gate)
```bash
npx playwright test --list
npx tsc --noEmit -p tsconfig.json
```

---

## 3. 4-Tier Test Suite Organization & Quantitative Targets

With $N = 20$ features (`F01`–`F20` in `PROJECT.md § Feature Inventory`), the mandatory minimum threshold is:
$$\text{Total Tests} \ge 11 \times N + 10 = 11 \times 20 + 10 = 230$$

| Tier | Spec File | Focus | Target Count |
| :--- | :--- | :--- | :--- |
| **Tier 1** | `tests/e2e/tier1-features.spec.ts` | Isolated verification of every feature `F01`–`F20` against `ORIGINAL_REQUEST.md` and `PROJECT.md` DOM contracts (`≥5` tests per feature). | `≥ 100` tests (`20 × 5`) |
| **Tier 2** | `tests/e2e/tier2-boundaries.spec.ts` | Boundary/edge cases, viewport extremes (`320px`, `375px`, `768px`, `1440px`, `1920px`), zero horizontal overflow, rapid state transitions, drag bounds, `Escape` handling, `prefers-reduced-motion`, and strict zero-tolerance anti-pattern audits (`border-radius: 0px`, `backdrop-filter: none`, `1px solid #111111`, `4px 4px 0px #111111` shadow, `80%`/`95%` WIP bars). | `≥ 100` tests (`20 × 5`) |
| **Tier 3** | `tests/e2e/tier3-combinations.spec.ts` | Pairwise and multi-feature interaction workflows (e.g., Sticky Header nav + Lenis scroll + Section 03 `#0D0D0D` transition + Stage Rollover Preview; Dual Architecture split hover + Lookbook silhouette/macro toggle + Custom Crosshair Cursor material tag + Technical Drawer + Are.na moodboard drag). | `≥ 20` tests |
| **Tier 4** | `tests/e2e/tier4-scenarios.spec.ts` | Realistic end-to-end user personas (Casa de Criadores curator, international stage producer, 1-of-1 upcycling collector, streetwear buyer, UFMG/Senai fashion researcher, mobile underground visitor, accessibility/keyboard navigator, art director auditing brutalist tokens, stylist inspecting stage archive, full-site archival walkthrough). | `≥ 10` tests |
| **Total** | `tests/e2e/*.spec.ts` | Complete requirement-driven E2E verification across `F01`–`F20`. | **≥ 230 tests** |

---

## 4. Canonical DOM & `data-testid` Contract Reference

All E2E tests interact with the application exclusively through standard browser APIs and the shared DOM contract defined in `PROJECT.md`:
- **Navigation & Global**:
  - `[data-testid="sticky-header"]`
  - `[data-testid="nav-cell-brand"]`, `[data-testid="nav-cell-01"]` .. `[data-testid="nav-cell-06"]`
  - `[data-testid="nav-rollover-preview"]`
  - `[data-testid="custom-cursor"]`, `[data-testid="custom-cursor-label"]`
- **Section 00 — Hero (`#hero-00` / `[data-testid="section-hero-00"]`)**:
  - `[data-testid="hero-manifesto-col"]`, `[data-testid="brand-mark-svg"]`, `[data-testid="hero-scroll-gallery"]`
  - `[data-testid="draggable-sticker-sticker-gsh-2168"]`, `[data-testid="draggable-sticker-sticker-ganja-25g"]`, `[data-testid="draggable-sticker-sticker-ozempic"]`, `[data-testid="draggable-sticker-sticker-caminhao"]`, `[data-testid="draggable-sticker-sticker-ganja-star"]`
  - `[data-testid="sticker-gloss-layer"]`
- **Sections 01 & 02 — Origem & Público-Alvo (`#origem-01` / `[data-testid="section-origem-01"]`, `#publico-02` / `[data-testid="section-publico-02"]`)**:
  - `[data-testid="kinetic-title-origem"]`, `[data-testid="kinetic-marquee"]`, `[data-testid="demographic-frame"]`
- **Section 03 — Prova de Palco (`#atuacao-03` / `[data-testid="section-atuacao-03"]`)**:
  - `[data-testid="stage-row-anitta"]`, `[data-testid="stage-row-marina-sena"]`, `[data-testid="stage-row-pedro-sampaio"]`, `[data-testid="stage-row-kendrick-lamar"]`
  - `[data-testid="stage-rollover-preview"]`
- **Section 04 — Arquitetura Dual (`#frentes-04` / `[data-testid="section-frentes-04"]`)**:
  - `[data-testid="dual-split-container"]`, `[data-testid="dual-side-upcycling"]`, `[data-testid="dual-side-pequena-escala"]`
- **Section 05 — Mostruário Interativo, Technical Drawer & Moodboard (`#desfile-05` / `[data-testid="section-desfile-05"]`)**:
  - `[data-testid="lookbook-grid"]`, `[data-testid="look-card-01"]` .. `[data-testid="look-card-10"]` (`data-cursor-look`, `data-view-mode="silhouette" | "macro"`)
  - `[data-testid="wip-badge-look-03"]` (`80% CONCLUIDO`), `[data-testid="wip-badge-look-04"]` (`95% CONCLUIDO`)
  - `[data-testid="look-technical-drawer"]`, `[data-testid="drawer-look-title"]`, `[data-testid="drawer-macro-zoom"]`, `[data-testid="drawer-material-sheet"]`, `[data-testid="drawer-progress-bar"]`, `[data-testid="drawer-inquiry-cta"]`, `[data-testid="drawer-close-btn"]`
  - `[data-testid="arena-moodboard"]`, `[data-testid^="moodboard-card-"]`
- **Section 06 — Criador, Feed & Contato (`#contato-06` / `[data-testid="section-contato-06"]`)**:
  - `[data-testid="creator-catalog-card"]`, `[data-testid="instagram-contact-strip"]`, `[data-testid^="ig-strip-item-"]`
  - `[data-testid="brutalist-footer"]`, `[data-testid="footer-link-ganjastudio"]`, `[data-testid="footer-link-isaquex"]`, `[data-testid="footer-link-email"]`
