# TEST_READY — GANJA STUDIO

Recorded from the verification run on this branch. Counts are the reporter totals, not estimates.

## Unit (`npm run test:unit`, Vitest)

| File | Passed | Failed |
| --- | ---: | ---: |
| `src/__tests__/foundation.test.tsx` | 27 | 0 |
| `src/__tests__/sections00to04.test.tsx` | 4 | 0 |
| `src/__tests__/sections05to06.test.tsx` | 4 | 0 |
| **Total** | **35** | **0** |

## Playwright (`npx playwright test`, Chromium)

| File | Passed | Failed |
| --- | ---: | ---: |
| `tests/e2e/tier1-features.spec.ts` | 100 | 0 |
| `tests/e2e/tier2-boundaries.spec.ts` | 100 | 0 |
| `tests/e2e/tier3-combinations.spec.ts` | 24 | 0 |
| `tests/e2e/tier4-scenarios.spec.ts` | 12 | 0 |
| **Total** | **236** | **0** |

The suite reported `236 passed` in 40.1s. `npm run build` (`tsc -b && vite build`) completed with base `/ganja/`.

## Browser walk

Header jumps to sections 01–06 and back to 00, sticker drag, stage rollover, look silhouette/macro swap, technical drawer open/close and inquiry link, moodboard drag, and footer mail/Instagram links were exercised in Chrome at 1440×900 and 390×844. Kinetic `data-letter-spacing` moved with scroll (`0.082em` near the top on desktop, `0.129em` after the mobile walk). Computed `border-radius` stayed `0px` and no `backdrop-filter: blur` was found on the contract nodes.
