# se-ABC-238 gates: lint, typecheck, build exit 0; npm test 2 386 = base 2 376 + 10; skips 0; G1 54/58; G7, G8, G9 met; deep lanes green

Every run was under the host lock (`flock …/host-test.lock`) at code `3abaefdd`. Raw files are in `raw/gates/` and `raw/deep/`.

## Host
- load1 was 0.9–2.5 throughout; Tctl 77.9–79.9 °C (under the 85 °C stop).
- A foreign `vitest` from another repository (pid 3594620, `/app/…platform-tooling-testing`, up 11 h) ran the whole time. It was logged and not touched.

## Mandatory gates
- **lint** (`npm run lint`): exit 0, "Checked 131 files … No fixes applied".
- **typecheck** (`npm run typecheck`): exit 0.
- **build** (`npm run build`): exit 0.
- **unit** (`npm test`): exit 0, 63 files, **2 386 passed**. Base `b19af469` reads 2 376 in the same session; the 10 new rows are 7 predicate rows, 2 literal rows and 1 liveness row.

## Test integrity
- **Skip count:** 0. It was read with the local binary at heap 128 piped to `jq`, the AGENTS.md command with `npx` swapped for `node ./node_modules/vitest/vitest.mjs`.
- `test-skip-integrity.js --skip-count 0`: "No findings.", exit 0.
- `lane-inventory.js`: "No findings.", exit 0.

## Strength and NFR gates
- **G1 (`PUZZLE_DEEP`):** solved **54/58**, which equals the baseline.
- **G4:** A1 cross-build identity holds (acceptance note). The ADR-0026 and older bounded oracles are green in the deep lanes.
- **G5:** the existing ENGINE_DEEP engine instruments are green, 78/78. The level-5 real-clock reading and the Levels deep lane are QE's (ticket A6); they were not run.
- **G6:** QE's (5 interleaved real-clock runs per board per build). It was not run. A4's fixed-depth reading above is the deterministic proxy, and it gives no grounds to expect a depth gain.
- **G7 (`NFR-009`, ENGINE_DEEP transposition A7):** kiwipete, 1 s (d7) against 4 s (d9): heapUsed 9.14 -> 9.15 MiB, arrayBuffers 4.51 -> 4.51 MiB. Within <= 1 MiB growth and <= 16 MiB. `tableByteLength` is unchanged; no array was added.
- **G8 (`NFR-008`):** 3 rounds, interleaved, base first in odd rounds.
  - Head: 8.38 / 8.50 / 8.55 s, median **8.50 s**.
  - Base: 8.55 / 8.60 / 8.61 s, median **8.60 s**.
  - Both are <= 10 s at load1 <= 2.5.
- **G9:** `git diff b19af469 -- src/levels.ts` is empty.
- **G10:** no level row reddened.

## Deep lanes (local binary, heap 400): all exit 0
| lane | file | tests |
|---|---|---|
| SEARCH_DEEP | transposition | 57/57 |
| SEARCH_DEEP | search | 57/57 |
| SEARCH_DEEP | quiescence | 116/116 |
| SEARCH_DEEP | search.null-move | 44/44 |
| SEARCH_DEEP | search.ordering | 43/43 |
| SEARCH_DEEP | search.pvs-lmr | 29/29 |
| ENGINE_DEEP | engine | 78/78 |
| ENGINE_DEEP | quiescence | 99/99 |
| ENGINE_DEEP | transposition | 36/36 |
| ENGINE_DEEP | search.ordering | 30/30 |
| ENGINE_DEEP | search.pvs-lmr | 21/21 |
| CLI_DEEP | cli.real-engine | 11/11 |
| UCI_DEEP | uci.real-engine | 13/13 |
| PUZZLE_DEEP | puzzle-suite | 18/18 |

- The ENGINE_DEEP Levels lane and the uci-session lane were not run. Levels is QE's under A6.
