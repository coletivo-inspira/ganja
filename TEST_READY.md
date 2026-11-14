# TEST_READY — GANJA STUDIO

Recorded on 14/11/2026 on `cursor/piloto-instagram-contrato-vitrine-babb`, branched from `main` at `d16093a` (v1.0.1). This branch adds the Vitrine `schemaVersion: 1` contract and the Instagram pilot tooling. Counts are the reporter totals, not estimates.

## Unit (`npm run test:unit`, Vitest)

| File | Passed | Failed |
| --- | ---: | ---: |
| `src/__tests__/foundation.test.tsx` | 27 | 0 |
| `src/__tests__/sections00to04.test.tsx` | 4 | 0 |
| `src/__tests__/sections05to06.test.tsx` | 4 | 0 |
| `src/__tests__/pagesBase.test.ts` | 4 | 0 |
| `src/__tests__/touchDrag.test.tsx` | 6 | 0 |
| `src/__tests__/stageProofTouch.test.tsx` | 4 | 0 |
| `src/__tests__/navAria.test.tsx` | 9 | 0 |
| `src/__tests__/lookCardPreload.test.tsx` | 3 | 0 |
| `src/__tests__/lookInquiry.test.ts` | 11 | 0 |
| `src/__tests__/lookDrawerInquiry.test.tsx` | 1 | 0 |
| `src/__tests__/issuesVerification.test.tsx` | 6 | 0 |
| `src/__tests__/feedSource.test.ts` | 12 | 0 |
| `src/__tests__/feedPage.test.tsx` | 12 | 0 |
| `src/__tests__/vitrineContract.test.tsx` | 22 | 0 |
| `src/__tests__/instagramPilotCheck.test.ts` | 9 | 0 |
| **Total** | **134** | **0** |

## Playwright (`npx playwright test`, Chromium)

| File | Passed | Failed |
| --- | ---: | ---: |
| `tests/e2e/tier1-features.spec.ts` | 101 | 0 |
| `tests/e2e/tier2-boundaries.spec.ts` | 100 | 0 |
| `tests/e2e/tier3-combinations.spec.ts` | 24 | 0 |
| `tests/e2e/tier4-scenarios.spec.ts` | 12 | 0 |
| `tests/e2e/touch-stickers.spec.ts` | 3 | 0 |
| `tests/e2e/touch-stage-proof.spec.ts` | 3 | 0 |
| `tests/e2e/nav-aria.spec.ts` | 3 | 0 |
| `tests/e2e/macro-preload-contrast.spec.ts` | 2 | 0 |
| `tests/e2e/cursor-touch.spec.ts` | 1 | 0 |
| `tests/e2e/issues-12-16-verification.spec.ts` | 5 | 0 |
| `tests/e2e/feed-page.spec.ts` | 12 | 0 |
| **Total** | **266** | **0** |

The full suite reported `266 passed` in each of three consecutive runs (50.5s, 52.1s, 51.1s). No test failed or was retried. The two known flakes were run again with `--repeat-each=10`: `touch-stage-proof.spec.ts` (including T02, which once read `naturalWidth` before the image loaded) and `tier4-scenarios.spec.ts` (including S07, which once timed out scrolling to a lookbook element that re-rendered). Together they reported `150 passed`, 0 failed. `npm run test:unit` reported `134 passed`. `npx tsc -b` exits 0, and `npm run build` (`tsc -b && vite build`) completes with base `/`.

`issues-12-16-verification.spec.ts` runs at 1440×900 with a mouse and at 390×844 with `hasTouch`/`isMobile` and real CDP `Input.dispatchTouchEvent` gestures. It covers the Mesa de Luz reset (swipe scrolls, 450ms long-press drags, reset restores), a sub-300ms sticker hold that must not drag, and the drawer per front: 1/1 seal and measurement table, `[P] [M] [G] [GG]` selector, and the WIP pre-reserve CTA with its mailto. Every element inside the drawer and the new reset button is checked for 0px radius and no blur.

`feed-page.spec.ts` uses two dev servers. Port 5173 serves the site as deployed, with no `VITE_VITRINE_FEED_URL`, so the feed reads the static archive. Port 5174 sets `VITE_VITRINE_FEED_URL=https://vitrine-feed.test/data/vitrines/ganja/instagram-feed.json`, which is the route documented by Vitrine. The spec mocks that host with `page.route`, using `schemaVersion: 1` payloads (`pageInfo`, `publishedAt`, `children`) and the documented error bodies (`404 FEED_NOT_FOUND`, `503 FEED_UNAVAILABLE`, `400 INVALID_CURSOR`). The `FV*` tests check that contract and the page states, not a real Vitrine. FV01 also checks that feed requests carry no `Authorization` header, cookies or token parameters. FV06 covers a `stale` projection, labeled on the page and in the footer strip. FV07 checks that a projection with another storefront's `slug` is never rendered. FV08 checks that `INVALID_CURSOR` on "Carregar mais" keeps the loaded posts. Keyboard focus goes to the heading when the page opens and to the first new tile after each "Carregar mais".

`vitrineContract.test.tsx` validates the fixtures in `tests/fixtures/vitrine-feed-v1/` with `scripts/instagram-pilot/vitrine-contract.mjs`, which is the same validator the pilot script uses. It then runs them through `VitrineFeedSource`, `FeedPage` and the footer strip. `instagramPilotCheck.test.ts` (Node environment) runs `scripts/instagram-pilot/check-feed.mjs` against an in-memory Vitrine with a CORS allowlist, ETag/304 and a second storefront that rejects foreign cursors. It also runs the CLI against a local HTTP server and checks the Markdown report and the snapshot file.

The `#/feed` page was checked visually at 1440×900 and 390×844 with the `schemaVersion: 1` fixtures and with the `stale` fixture. The screenshots are in the Project store under `artifacts/` (`feed-v1-contrato-*.png`, `feed-stale-*.png` and `faixa-rodape-stale-1440.png`). Every element keeps radius 0 and no blur, with 1px `#111111` borders and 4px hard shadows.

None of this exercises the real Instagram or Vitrine. The pilot in ganja #6 is not executed. See `docs/instagram-pilot-validation.md`.

## Live audit (historical, recorded on the feed branch before #23 merged)

The GitHub Pages origin (`curl --resolve ganja.inspira.dev.br:443:185.199.108.153`, which serves a `*.github.io` certificate behind Cloudflare) returned the same asset hashes as a local build of `main` (`index-BJqxRLOe.js`, `index-BZtq5Ytw.css`). A standalone Playwright audit with 47 checks at 1440 and 390 (touch) passed 45 on the live origin. The two misses were the missing Mesa de Luz reset, and the drawer details showed the old WIP CTA text, no 1/1 seal or table, and unbracketed sizes. The same audit passed 47/47 on a `vite preview` of this branch.

## Browser walk

Header jumps, sticker drag, stage rollover, look swap, drawer, moodboard, and footer links were exercised in Chrome at 1440×900 and 390×844. The +INSPIRA seal sits centered at the end of the footer: 64px orb, 20px (1.25rem) margin, then a 1px `#111111` rule, then the Coletivo Inspira copyright. The seal’s own radius stays 50% and its backdrop-filter stays `none`; the full-DOM radius scan skips `.inspira-orb`.
