---
id: 20261030T071717Z-software-engineer-observation-e87dea4a
kind: observation
by: software-engineer
at: 2026-10-30T07:17:17Z
verified_by: 
confidence: high for lint, typecheck, test, build, G1 and G9 as run; G8 delta UNKNOWN - verify; G5 real clock is QE's
refs:
  - se-ABC-228
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 9bd3c519
  - 61d5d629
  - G1
  - G5
  - G7
  - G8
  - G9
  - NFR-004
  - NFR-008
supersedes: 
seal: sha256:fe837b95abb1600d9ed5581922a313a1675b80859bba8299b0f10e59c4401554
---

# Software Engineer observation, se-ABC-228: the gates at 9bd3c519

Own `npm ci --ignore-scripts`. Linters, typecheck, build and the default lane ran via `npm run …`. No game was played, and no `cutechess-cli` ran.

## Mandatory gates (at the code commit `9bd3c519`; re-run before the records commit)
- `npm run lint` exit 0. `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test`: 63 files, **2 211 / 2 211** passed (base 2 178; +33 rows).
- The skip count (`.test-results/last-run.json`, `numPendingTests + numTodoTests`) is 0. `test-skip-integrity.js --skip-count 0` reports `No findings.`

## Ticket gates
- **G1:** `PUZZLE_DEEP` 18/18. **54/58 solved, against a baseline of 54/58**: no row was newly solved or newly missed.
  - Through `npm run test:watch` (heap 128) the lane's worker died (`Worker exited unexpectedly`).
  - Re-run at heap 400 with the local binary, `node ./node_modules/vitest/vitest.mjs run` (the `AGENTS.md` line without `npx`, because the npm scripts pin heap 128). Output: `raw/deep/PUZZLE_DEEP-puzzle-suite-heap400.txt`.
- **G5:** by construction, evasion nodes go through `visit` (`budget.visit`, so `countNode` and the clock) like any quiescence node. `ENGINE_DEEP` `engine` 77/77 and `levels` 44/44 are green, and so are `CLI_DEEP` 11/11 and `UCI_DEEP` 5/5. **The real-clock read of level 5 is QE's.**
- **G7 (not owed by `ADR-0053`):** no new per-search state. The two records are module constants, recursion stays bounded by `QUIESCENCE_MAX_PLY`, and `ABC-122` capacity rows pass with the shipped rules.
- **G8:** `npm test` durations of **8.78 / 8.91 / 8.97 s**, three runs on this host, after the deep lanes, with load1 about 1. `qe-ABC-230` read 8.48 s at `main` `dad753dc`. Base was not timed in this session, so the delta is `UNKNOWN - verify` (QE's read). The new default rows run at fixed depth or on a frozen clock, and none reads the real clock. `src/quiescence.test.ts` runs in about 0.2 s.
- **G9:** met. `src/levels.ts` is untouched. `DEFAULT_BUDGET_MS`, `HARD_CEILING_MS` and every `LEVELS` value are byte-identical to base. `tools/` and `data/` are untouched.
- **G6:** NOT read here. The `A8` forecast is the separate observation. The graded `G6` and the smokes (`A6`) are QE's.

## Deep lanes (one file each; `raw/deep/summary.txt`, `raw/deep/*.txt`)
- **SEARCH_DEEP:** quiescence 80/80, search.null-move 44/44, transposition 40/40, search 57/57, search.ordering 43/43, search.pvs-lmr 29/29.
- **ENGINE_DEEP:** engine 77/77, transposition 26/26, quiescence 67/67, search.ordering 30/30, search.pvs-lmr 21/21, levels 44/44 (547 s).
- **CLI_DEEP** 11/11; **UCI_DEEP** 5/5.
- **Not run:** PERFT, ZOBRIST, and ENGINE_DEEP legal/moves/gameend/evaluate.pawns. They touch no search code.

## The npm-only rule, reported
- The deep lanes ran as `npm run test:watch -- run <file>` (heap 128), except the puzzle suite above.
- One early single-file run used `npm exec -- vitest run src/quiescence.test.ts`. That is npx-equivalent and was not repeated. Nothing was fetched (`--offline`).
