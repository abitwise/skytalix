---
id: 20261029T220404Z-software-engineer-observation-cf540c21
kind: observation
by: software-engineer
at: 2026-10-29T22:04:04Z
verified_by: 
confidence: high on counts as run; G2/G6 SE-indicative only
refs:
  - ABC-235
  - EPIC-010
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - grugops/ABC-235
  - a37f1d87
  - dcbad73d
  - 7f3f0fda
  - f9576af3
  - EPIC-008
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - ADR-0026
  - src/puzzle-suite.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:496f5625318f363da296c7d4ce2dc99deb2a677bd7733be2fa88b299680112e3
---

# Software Engineer observation, se-ABC-235: the gates as far as an SE runs them, and what QE owes

All counts are as they ran in the worktree at the named commit. Load1 was 2-4 throughout, because other agents' work was running.

## Mandatory gates, at every cut commit
| cut | `npm run lint` | `npm run typecheck` | `npm test` | `npm run build` |
|---|---|---|---|---|
| 1 `dcbad73d` | exit 0 (129 files) | exit 0 | 63 files, 2 130 passed | exit 0 |
| 3 `7f3f0fda` | exit 0 (after `npm run format -- src/moves.test.ts`) | exit 0 | 63 files, 2 135 passed | exit 0 |
| 5 `f9576af3` | exit 0 | exit 0 | 63 files, 2 139 passed | exit 0 |

Base `a37f1d87` is 2 128 by arithmetic (+2, +5, +4 lane rows added; no row removed). Skip-count capture at the tip (`./node_modules/.bin/vitest run --reporter=json | jq`): 0. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`

## Deep lanes run by the SE
- **Cut 1:** `ENGINE_DEEP=1` `src/legal.test.ts` 40/40 (193 s).
- **Cut 3:** `ENGINE_DEEP=1` `src/moves.test.ts` 38/38, `src/gameend.nfr.test.ts` 9/9, `src/legal.test.ts` 40/40.
- **Cut 5:** `ENGINE_DEEP=1` `src/evaluate.pawns.test.ts` 44/44, `src/transposition.test.ts` 26/26 (the `NFR-009` growth row included).
- **Tip `f9576af3` (G4):**
  - `ENGINE_DEEP=1` `src/engine.test.ts` 60/60 (ABC-078 A3 identity sweep);
  - `SEARCH_DEEP=1` `src/search.pvs-lmr.test.ts` 29/29 (the `ADR-0026` bounded oracle);
  - `SEARCH_DEEP=1` `src/search.null-move.test.ts` 44/44;
  - `SEARCH_DEEP=1` `src/search.test.ts` 57/57;
  - `SEARCH_DEEP=1` `src/quiescence.test.ts` 37/37;
  - `SEARCH_DEEP=1` `src/transposition.test.ts` 40/40;
  - `ENGINE_DEEP=1` `src/levels.test.ts` 41/41 (545 s; real-clock rows ran under load1 about 2.4).

## EPIC-008 gates
- **G1:** `PUZZLE_DEEP=1` at the tip, 18/18 tests. Solved 54, missed 4 (the baseline's four), no NEWLY line. Out of tree, all 58 rows' move, score, depth and nodes are byte-equal to base (`virtualClock(1)`, budget 25; sha256 prefix `ade68870a257d78c` both).
- **G2:** SE-indicative only, not the binding read. Same session, interleaved, 3 pairs, `evaluate` warm over G3's 184 plus mirrors: base 500.7 / 490.1 / 483.1 ns, tip 347.6 / 340.7 / 344.2 ns per call. **QE owes the binding read and the cache-cold (miss-path) mean as INFO, pre-registered** (`arch-ABC-235/…eebca902`).
- **G3:** green in `npm test` (A1 mirror exact, A2-A4, A6 purity), plus cut 5's cold/warm `Object.is` rows on the mirror corpus.
- **G4:** A1 above (every door node-equal to base) and the deep lanes above.
- **G5:** clock reads byte-equal in A1 (2 408 `chooseMove`-family rows). The real-clock `NFR-004` read is **QE's**.
- **G6:** SE-indicative only. Depth equal in every one of the 30 tip-vs-base runs (kiwipete 8, position-6 10). **QE owes the 5 interleaved runs per its pre-registration.**
- **G7:** (a) `tableByteLength() + key array + pawnCacheByteLength()` ≤ 16 MiB, with the memo fixed at 384 KiB (asserted). (b)/(c) growth green under `ENGINE_DEEP=1` (`src/transposition.test.ts`).
- **G8:** `npm test` wall 8.81 s and 8.65 s at load1 2.33 / 2.43 (bar ≤ 10 s).
- **G9:** `git diff a37f1d87 -- src/levels.ts` is empty.

## A5
S2, value-identical, no smoke, no games. No process named `cutechess-cli` was started by this task.

## What QE owes (named)
- **A3:** 5 interleaved runs per board per build at 3 000 ms, at the tip against the merge base. This decides the ≥ 1.10x / 1.00x bar and each cut's ≥ 3 %.
- **G2's** binding read, plus the cache-cold mean as INFO, pre-registered.
- **G6's** 5 interleaved runs per its reading rule.
- **A1 at the tip**, re-run by QE. The harness is described in the identity observation; QE may rebuild it or ask for the scratch script.
- A ruling on the unpruned doors' A1 depth (2, not 5).
- The `OD-235-1` owner INFO stays the Orchestrator's to report.
