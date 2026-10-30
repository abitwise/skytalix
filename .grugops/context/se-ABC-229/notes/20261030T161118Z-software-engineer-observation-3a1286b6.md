---
id: 20261030T161118Z-software-engineer-observation-3a1286b6
kind: observation
by: software-engineer
at: 2026-10-30T16:11:18Z
verified_by: 
confidence: high for lint, typecheck, build, test, G1, G9 and the deep lanes as run; G8 delta UNKNOWN - verify; G5 real clock and G6 are QE's
refs:
  - se-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - f6ff1c4a
  - 01c37946
  - G1
  - G5
  - G8
  - G9
  - NFR-004
  - NFR-008
supersedes: 
seal: sha256:29be35c9334f2dc67da21421d73325ea34962c7f74a75ce9ef006a25ed9f8031
---

# Software Engineer observation, se-ABC-229: the gates at f6ff1c4a

Own `npm ci --ignore-scripts` in the worktree. The gates ran via `npm run …`. No game was played and no `cutechess-cli` ran.

## Mandatory gates
- `npm run lint` exit 0 (after `npm run lint:fix` formatted two of the SE's files). `npm run typecheck` exit 0. `npm run build` exit 0.
- **`npm test`:** 63 files, **2 270 / 2 270** passed. Base `01c37946` read 2 245 in the same session (`git archive` plus the worktree's `node_modules`), so this ticket adds **+25 rows**.
- Skips 0 (`.test-results/last-run.json`). `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.`

## Ticket gates
- **G1:** `PUZZLE_DEEP` 18/18, **54/58 against a baseline of 54/58**. No row was newly solved or newly missed.
  - Run at heap 400 with the local binary, `node ./node_modules/vitest/vitest.mjs run … --reporter=default --silent=false`. This follows `se-ABC-228`'s precedent: the npm scripts pin heap 128, and this is not `npx`.
  - Under this host's agent environment the solved line prints only with `--reporter=default`.
- **G5:** by construction. Quiet-promotion nodes go through `visit` (`budget.visit`, so `countNode` and the clock). `ENGINE_DEEP` engine 77/77 and levels 45/45 are green. The real-clock read is QE's.
- **G8 (informal):** `npm test` durations, all ALONE, in one session:
  - head 9.38 / 9.35 / 9.32 s;
  - base 9.06 / 9.13 s.
  - The delta is about +0.25 s. `quiescence.test.ts` + `gameend.nfr.test.ts` together add about 80 ms of test time (172 against 90 ms). The rest of the delta is `UNKNOWN - verify` (it may be noise).
  - The new default rows are fixed-depth or frozen-clock, and none reads the real clock. QE grades `G8`.
- **G9:** met. `src/levels.ts`, `LEVELS`, `DEFAULT_BUDGET_MS` and `HARD_CEILING_MS` are untouched. `tools/` and `data/` are untouched.
- **G6:** NOT graded here. The forecast is the separate observation. The graded `G6` (both sides at 4 000 ms) and the smokes (`A5`) are QE's.

## Deep lanes (one file each; `raw/deep/summary.txt`)
- **SEARCH_DEEP:** quiescence 116/116, search.null-move 44/44, transposition 40/40, search 57/57, search.ordering 43/43, search.pvs-lmr 29/29.
- **ENGINE_DEEP:** engine 77/77, quiescence 99/99, transposition 26/26, search.ordering 30/30, search.pvs-lmr 21/21, levels 45/45 (577 s).
- **CLI_DEEP** 11/11; **UCI_DEEP** 5/5.
