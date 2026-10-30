---
id: 20261030T013022Z-software-engineer-observation-78815fa3
kind: observation
by: software-engineer
at: 2026-10-30T01:30:22Z
verified_by: 
confidence: high on counts as run; G5 real-clock and G6 owed to QE
refs:
  - ABC-240
  - EPIC-010
  - ABC-235
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - bapm-ABC-235-split
  - grugops/ABC-240
  - 0e0ef856
  - 69e19fc4
  - 7913499d
  - EPIC-008
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - src/transposition.test.ts
  - src/search.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:7728a56f5e52aebc9509d40d8ced85957ac54fa08f36c9f7e65d7af399c6fa22
---

# Software Engineer observation, se-ABC-240: the gates as far as an SE runs them, and what QE owes

All counts are as they ran in the worktree, Node v26.12.1.

## Mandatory gates, at each commit
| commit | `npm run lint` | `npm run typecheck` | `npm test` | `npm run build` |
|---|---|---|---|---|
| item 1 `69e19fc4` | exit 0 (129 files) | exit 0 | 63 files, 2 144 passed | exit 0 |
| item 2 `7913499d` | exit 0 | exit 0 | 63 files, 2 148 passed | exit 0 |

- The first `npm test` at item 1 was red (2 143 / 2 144). `src/search.test.ts` A6's export inventory lacked `orderScratchByteLength`. The inventory and its comment were updated before the commit; the commit is green.
- Base `0e0ef856` is 2 139 by arithmetic: +5 lane rows at item 1, +4 at item 2, none removed.
- Skip count at the tip: 0 (`vitest run --reporter=json | jq`). `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- Tooling: only `npm run …` and `./node_modules/.bin/vitest`. No bare `npx` was run in this task.

## Deep lanes at the tip `7913499d`, one file at a time
- `ENGINE_DEEP=1`:
  - `search.ordering` 30/30 (P1, 285 074-node walk)
  - `quiescence` 34/34 (P2, 285 074-node walk)
  - `transposition` 26/26 (`NFR-009` growth)
  - `engine` 60/60 (ABC-078 A3 sweep, 136 s)
  - `search.pvs-lmr` 21/21
  - `levels` 41/41 (544 s)
- `SEARCH_DEEP=1`:
  - `search` 57/57
  - `search.null-move` 44/44
  - `search.ordering` 43/43
  - `quiescence` 41/41
  - `search.pvs-lmr` 29/29
  - `transposition` 40/40
- `PUZZLE_DEEP=1` `puzzle-suite` 18/18: solved 54/58, baseline 54/58, no NEWLY line.

## EPIC-008 gates
- **G1**: 54/58. All 58 rows' move, score, depth and nodes are byte-equal to base out of tree (see the identity observation).
- **G2, G3**: not owed, because `evaluate` is untouched (`git diff 0e0ef856 -- src/evaluate.ts` is empty). G3 is green in `npm test` anyway.
- **G4**: A1 byte-equal at both commits, plus the deep lanes above.
- **G5**: clock reads are byte-equal in A1's 2 408 `chooseMove`-family rows. The real-clock `NFR-004` read is **QE's**.
- **G6**: SE-indicative only. Completed depth is equal in all 15 base/tip pairs: kiwipete 8, position-6 10, start 10, so the floor of 6 is held. **QE owes G6's 5 interleaved runs, named.**
- **G7**: two fixed scratches, `orderMoves`' and `orderCaptures`' 256 float64 slots each, 2 × 2 048 bytes. Both are counted in (a)'s byte sum in `src/transposition.test.ts` and asserted at 2 048 each. (b)/(c) growth is green under `ENGINE_DEEP=1` (`src/transposition.test.ts` 26/26).
- **G8**: `npm test` wall 7.93 s and 7.76 s at load1 0.30–1.44 (bar ≤ 10 s). An earlier run while A1 was running in the background read 11.81 s at load1 above 5; that run is not the G8 reading.
- **G9**: `git diff 0e0ef856 -- src/levels.ts` is empty.
- **Perft**: `src/moves.ts` and `src/legal.ts` are untouched, so perft is not owed. Not run.

## A5
S2, value-identical, no smoke. No games were played and no `cutechess-cli` was started by this task.

## What QE owes (named)
- **A3**: 5 interleaved runs per board per build at 3 000 ms, at the tip against `0e0ef856`. This decides the ≥ 1.03x / 1.00x bar.
- **G6**: the 5 interleaved runs per its pre-registration.
- **A1 at the tip**, re-run by QE. The harness is `se-ABC-235/raw/a1.mjs` and `run-a1.sh`, with `se-ABC-240/raw/a1pair.sh` and `sample.sh`.
- **G5**: the real-clock read.
