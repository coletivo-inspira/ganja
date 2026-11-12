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
| `tests/e2e/tier1-features.spec.ts` | 101 | 0 |
| `tests/e2e/tier2-boundaries.spec.ts` | 100 | 0 |
| `tests/e2e/tier3-combinations.spec.ts` | 24 | 0 |
| `tests/e2e/tier4-scenarios.spec.ts` | 12 | 0 |
| **Total** | **237** | **0** |

The suite reported `237 passed` in 42.0s after the Coletivo Inspira seal was added. `npm run test:unit` stayed at 35 passed. `npm run build` (`tsc -b && vite build`) completed with base `/ganja/`.

Tier 1 `F20.6` always checks the footer mount and the copyright link to `https://inspira.dev.br/`. The mounted-orb checks run only when `brandbook.inspira.dev.br` loads. The full-DOM radius scan skips `.inspira-orb` so the official 50% seal does not fail the brutalist audit. Blur audits still scan every element.

## Browser walk

Header jumps, sticker drag, stage rollover, look swap, drawer, moodboard, and footer links were exercised in Chrome at 1440×900 and 390×844. The +INSPIRA seal sits centered at the end of the footer: 64px orb, 20px (1.25rem) margin, then a 1px `#111111` rule, then the Coletivo Inspira copyright. Hover raises the plus to full opacity. Touch emulation (`hover: none`) leaves the plus visible at opacity 0.85. `prefers-reduced-motion: reduce` sets `data-reduced-motion` and the plus still appears on hover. The same seal renders from the `/ganja/` production preview at 1440 and 390. The seal’s own radius stays 50% and its backdrop-filter stays `none`.
