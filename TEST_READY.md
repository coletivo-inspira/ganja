# TEST_READY — GANJA STUDIO

Recorded on the Instagram feed branch (`cursor/instagram-feed-ganja-aa38`) rebased on `main` at `d3bbb58`, which includes the #12–#16 verification (#22) and the release tooling (#21). Counts are the reporter totals, not estimates.

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
| **Total** | **103** | **0** |

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
| `tests/e2e/feed-page.spec.ts` | 9 | 0 |
| **Total** | **263** | **0** |

The suite reported `263 passed` (about 50s) in two of three full runs after the rebase. In the other run, `tier4-scenarios.spec.ts` S07 timed out scrolling to a lookbook element that re-rendered mid-scroll; it then passed 8/8 with `--repeat-each=8`. Before the rebase, `touch-stage-proof.spec.ts` T02 failed once by reading the stage image's `naturalWidth` before it loaded under parallel load. Neither test touches the feed code. `npm run test:unit` reported `103 passed`. `npm run build` (`tsc -b && vite build`) completes with base `/`.

`issues-12-16-verification.spec.ts` runs at 1440×900 with a mouse and at 390×844 with `hasTouch`/`isMobile` and real CDP `Input.dispatchTouchEvent` gestures. It covers the Mesa de Luz reset (swipe scrolls, 450ms long-press drags, reset restores), a sub-300ms sticker hold that must not drag, and the drawer per front: 1/1 seal and measurement table, `[P] [M] [G] [GG]` selector, and the WIP pre-reserve CTA with its mailto. Every element inside the drawer and the new reset button is checked for 0px radius and no blur.

`feed-page.spec.ts` uses two dev servers. Port 5173 serves the site as deployed, with no `VITE_VITRINE_FEED_URL`, so the feed reads the static archive. Port 5174 sets `VITE_VITRINE_FEED_URL=https://vitrine-feed.test/v1/sites/ganja/feed`, and the spec mocks that host with `page.route` using the provisional contract in `src/feed/vitrineFeedSource.ts`. The `FV*` tests check that contract and the page states, not a real Vitrine. FV01 also checks that feed requests carry no `Authorization` header, cookies or token parameters. The `#/feed` page was checked at 1440×900 and 390×844 with the static archive, mocked Vitrine data (photo, carousel, video cover) and the disconnected state. Keyboard focus goes to the heading when the page opens and to the first new tile after each "Carregar mais".

## Live audit

The GitHub Pages origin (`curl --resolve ganja.inspira.dev.br:443:185.199.108.153`, which serves a `*.github.io` certificate behind Cloudflare) returned the same asset hashes as a local build of `main` (`index-BJqxRLOe.js`, `index-BZtq5Ytw.css`). A standalone Playwright audit with 47 checks at 1440 and 390 (touch) passed 45 on the live origin. The two misses were the missing Mesa de Luz reset, and the drawer details showed the old WIP CTA text, no 1/1 seal or table, and unbracketed sizes. The same audit passed 47/47 on a `vite preview` of this branch.

## Browser walk

Header jumps, sticker drag, stage rollover, look swap, drawer, moodboard, and footer links were exercised in Chrome at 1440×900 and 390×844. The +INSPIRA seal sits centered at the end of the footer: 64px orb, 20px (1.25rem) margin, then a 1px `#111111` rule, then the Coletivo Inspira copyright. The seal’s own radius stays 50% and its backdrop-filter stays `none`; the full-DOM radius scan skips `.inspira-orb`.
