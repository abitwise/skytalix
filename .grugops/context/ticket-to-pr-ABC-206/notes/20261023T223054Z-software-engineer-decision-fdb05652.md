---
id: 20261023T223054Z-software-engineer-decision-fdb05652
kind: decision
by: software-engineer
at: 2026-10-23T22:30:54Z
verified_by: 
confidence: high (every gate run by the SE at the tip; exit codes and counts read; no timing taken)
refs:
  - ABC-206
  - EPIC-008
  - ABC-078
  - ABC-205
  - ABC-212
  - NFR-001
  - NFR-004
  - ADR-0003
  - ADR-0026
  - plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
  - arch-design-ABC-206/20261023T220816Z-architect-design-decision-e3ff760b
  - arch-design-ABC-206/20261023T220929Z-architect-design-decision-90b06dec
  - grugops/ABC-206
  - 268ff42a
  - ee77a62d
  - 5ff2a129
  - 26dacbf6
  - NFR-008
  - af4a934c
supersedes: 
seal: sha256:a43fa605ed6e62f42435c70fa48c3d735fb23a6b252fb82f8ee34ab4bd6cf325
---

# ABC-206 gates green at the tip, count guards proved to bite, no timing taken; three things for the next hop

Software Engineer, task `ticket-to-pr-ABC-206`, at `grugops/ABC-206` `26dacbf6`.

## Gates at the tip (commands as in AGENTS.md)
- `npm run lint` clean; `npm run typecheck` exit 0; `npm run build` exit 0.
- `npm test` exit 0: 62 files, **2 045 passed** (base 2 038; +7 rows). `.test-results/last-run.json` success true,
  exitCode 0, 0 failed, 0 pending, 0 todo. Each commit's `npm test` was also green (2 041, 2 043, 2 045).
- Skip count 0; `test-skip-integrity.js` "No findings.", exit 0.
- Deep, opt-in: `ENGINE_DEEP=1` legal.test.ts 37 passed (the three depth-3 A2 rows) and gameend.test.ts 47 passed;
  `ENGINE_DEEP=1` engine.test.ts `-t "A3 (identity)"` 3 passed (the deep identity sweep only, so no wall-clock row
  ran); `SEARCH_DEEP=1` search.pvs-lmr.test.ts 29 passed.
- **Not run:** any timing reading (A4, G6, G8, perft rate), `PUZZLE_DEEP` (G1), `npm run perft`. Those are QE's.

## Tests added (only legal.test.ts, gameend.test.ts, gameend.nfr.test.ts)
- A2 lane rows at depth 1 plus the terminal FENs, depth 3 behind `ENGINE_DEEP=1` (defined only when set, so the skip
  count stays 0). Each asserts a denominator. The `givesCheck` row adds three fixtures where a castle, a promotion
  and an en passant give check, because no flagged move gives check within depth 1 of the corpus.
- Spied count guards in gameend.nfr.test.ts (legal.ts spies plus a pass-through `apply.ts` `makeMove` spy).
  **Each was mutation-checked:** reintroducing `legalMoves` in `leafEndReason`, the old filter in `quiesce`, and
  make/unmake in `lateMoveReduction` each turned its guard red while every value row stayed green. Removing
  `givesCheck`'s flagged fallback turned the A2 row red.

## For the next hop
1. **Droppability is logical, not textual for (i) and (ii).** Reverting (iii) from the tip is clean (tsc, lint and
   seven lane files green). Reverting (i) or (ii) alone conflicts on adjacent insertions in legal.ts, the two test
   files and the search.ts import. The resolution is mechanical. The OD-206-1 veto fallback (drop (ii) and (iii))
   is the tip-down revert of `26dacbf6` then `5ff2a129`, then (i) rebuilt to the rejected shape.
2. `main` moved to `af4a934c` during the build with **no `src/` change**, so `268ff42a` is still the right A1 base.
   No merge of `main` into the branch was made. Merge order stays 212, then 206, then 205.
3. Flagged, not edited: gameend.ts's module header still says `gameStatus` "is built to be cheap at a search leaf".
   That goes stale like NFR-001's row text, which is Security/NFR's dated note. OD-206-1 is still open with the owner.
