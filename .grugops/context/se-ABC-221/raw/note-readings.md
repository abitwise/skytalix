# `ABC-221` readings at code commit `c48a6f83` (base `d58f2d77`): gates, test count, red checks, informal `G8`, `ENGINE_DEEP` A10, `UCI_DEEP` A11 row 2

All figures below come from runs in the worktree under plain `node` v26.12.1. Raw output is in `raw/runs/`.

## Mandatory gates (via `npm run`)
- `npm run lint`: exit 0 (131 files). `npm run typecheck`: exit 0. `npm run build`: exit 0.
- `npm test`: 63 files, **2 363 passed**, 0 failed, 0 pending, 0 todo (`last-run.json`). Base `d58f2d77` reads
  **2 333** on the same host, so the change is +30: 31 added, 1 removed.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `node tools/grugops/lane-inventory.js`: 63 = 63, "No findings.", exit 0.

## Red checks (one mutant at a time on `src/uci-session.ts` or `src/engine.ts`; restored and `cmp`-identical after each)
Each was run against `src/uci-session.test.ts`, `src/engine.test.ts` and `src/levels.test.ts`. Every mutant turned
at least one row red:

| mutant | rows red |
|---|---|
| CAP22: `CLOCK_MODE_MAX_BUDGET_MS` = 22 000 | 11 (A1 ×3, A2, A3, A4, A6 ×2, A7 ×2, A7 real) |
| CAP60: the cap = the ceiling, 60 000 | 2 (A7 3600000/40 and movetime 90000) |
| NOCAPMT: `movetime` uncapped in the mode | 1 (A7 movetime 90000) |
| CLAMP32: `HARD_CEILING_MS` back to 32 000 | 6 (engine RF-1 pin, levels clause B, ABC-220 A8 constants, A7 ×2, A7 real) |
| NOTOKCAP: the no-token budget = the cap (59 500) | 2 (A7 `go`, `go infinite`) |
| QM4 in the mode: `winc` for either side | 2 (ABC-221 A12, the two Black rows) |
| QM4 in `simple-tournament` | 2 (ABC-220 A7 block, A12's two Black rows) |
| LEVELCAP: the level cap applied in the mode | 15 |
| NOSHARE: C replaced by t ÷ m in the mode | 12 (A2, A3, A4, A5 ×3, A6 ×2, A12 ×4) |

## Values (virtual clock, δ = 31 ms; the rows pin them)
- **A2:** the budget is 22 375 on move 1 and is `min(59 500, C)` on every move. The closest call is 1 069 ms, after
  move 40, and 99.9 % of the period is used (0.99881).
- **A3:** move 7 gets 26 341 ms (the banked time). 1 069 ms are left after move 40, and 99.9 % is used.
- **A4:** each period ends at 1 069 ms. The periods use 99.88 %, 100.0 % and 100.0 % of 900 s.
- **A5:** 1 900 ms and 1 069 ms left. `wtime 800` gives 1 ms. The real engine at step 10 plays depth 1, `time` 20.
- **A6:** as worded, 17 205 ms are left after move 80. alloc.txt's shape (+900 000 after move 40) gives 117 735 ms
  after move 40. See SE-221-a.
- **A7:** 59 500 / 59 500 / 5 000 / 22 000 / 22 000. C on the 1-hour clock is 89 875. The real engine at step
  5 000: `time` in [59 500, 69 500].
- **A12:** 2 800 / 800 / 2 800 / 800 in both modes.

## Informal `G8` wall (NOT a reading; QE owns A9/`G8`)
- **Method:** host clear (no other vitest, checked with `ps`). Six `npm test` runs, interleaved b h h b b h with 5 s
  between them. Base was a `git archive d58f2d77` tree in scratch, using the worktree's `node_modules`. load1 went
  from 1.05 to 2.40.
- **Base:** 8.91 / 9.01 / 9.11 s (vitest Duration), **median 9.01 s**.
- **Head:** 9.11 / 9.23 / 9.17 s, **median 9.17 s**. That is +0.16 s, n = 3 per arm.
- **Against QE's 9.41 s at `ABC-242`'s `G8`:** 9.41 + 0.16 = **9.57 s**. That is under the 9.6 s tranche-2 trigger and
  far under 10 s, but inside the window spread. The 33 new rows sum to 39 ms in-thread (vitest JSON), about 0.02 s of
  wall on 2 slots. `UNKNOWN - verify` until QE's `G8`.
- Other single head runs: 9.00 s and 8.61 s (vitest Duration). The base read 8.94 s alone at the start.
- No fix was attempted, per the brief.

## `ENGINE_DEEP` A10 (ALONE: no other vitest, load1 about 1)
- Command: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run
  src/uci-session.test.ts -t "ABC-221 A10" --silent=false --reporter=verbose`.
- **Run 3: PASS, 179.6 s.** This is the reading.

  | position | wall | depth | nodes | `time` | heapUsed after | arrayBuffers after |
  |---|---|---|---|---|---|---|
  | start | 59 499.5 ms | 13 | 37 238 804 | 59 500 | 9.34 MiB | 4.51 MiB |
  | italian | 59 499.8 ms | 11 | 38 437 932 | 59 500 | 9.36 MiB | 4.51 MiB |
  | kiwipete | 59 501.1 ms | 11 | 44 009 197 | 59 501 | 9.36 MiB | 4.51 MiB |

  - The first read, after the 1 s warm search, was heapUsed 9.24 MiB and arrayBuffers 4.51 MiB.
  - **Growth:** heapUsed at most +0.12 MiB, and arrayBuffers 0. Both bounds are ≤ 1 MiB, and arrayBuffers is 4.51 MiB
    against ≤ 16 MiB. **`NFR-009` holds at 59.5 s.**
  - **Max wall 59 501.1 ms ≤ 60 000.** The overshoot past 59 500 is 1.1 ms, against `AR-NFR004-A`'s ≤ ~31 ms.
  - **Max completed depth 13.** The `KEY_ARRAY_CAPACITY` tripwire (100) is not reached, so nothing goes to the Architect.
- **Runs 1 and 2, reported as they ran:**
  - **Run 1** passed (179.9 s), but the default reporter hid the console lines, so it gave no figures.
  - **Run 2** (verbose) **failed on an assertion I had added myself**, which is not in A10: `wall ≥ 59 500`. The start
    position's wall read 59 499.4 ms on `performance.now`, while the engine's `Date.now` read 59 500. `Date.now` counts
    whole ms, so the wall can sit up to 1 ms under the budget. The row stopped at the first position.
  - **Fix (test-only, before the commit):** the lower bound now reads the engine's own `time` ≥ 59 500. A10's
    ≤ 60 000 wall bound is unchanged. Run 3 is that row.
  - The run-2 log is kept as `raw/runs/a10-run2-own-bound-red.log`.

## `UCI_DEEP` A11 row 2 (A14a in the mode)
- `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/uci.real-engine.test.ts -t "ABC-221
  A11"`: **4 / 4 passed**. The child ran spawn to exit in 2 088 ms (not a latency), at load1 0.99.
- The whole `UCI_DEEP` lane, run once afterwards: **13 / 13 passed**. That is the default-lane row, `ABC-168` ×4,
  `ABC-220` A14 ×4 (the existing `simple-tournament` row, now reading the three-value line) and `ABC-221` A11 ×4.
- **A11 row 3 (A14b)** is QE's probe and was not run here.
