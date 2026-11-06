---
id: 20261106T201944Z-software-engineer-observation-668c63b4
kind: observation
by: software-engineer
at: 2026-11-06T20:19:44Z
verified_by: 
confidence: high on the counts; the walls are ungraded single readings
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
supersedes: 
seal: sha256:1203e3d4e8fc1fba5a0f8030a538fc6584e91121d7548eed89ce6ece457cf569
---

# se-ABC-291 observation: gates green at the tip, 2 789 of 2 789; 25 deep lanes read by count, one red; the lane grows 55 rows, no new file

## Gates, at `e76d22f3`
`npm run typecheck` 0, `npm run lint` 0, `npm run build` 0. `npm test`: 71 files, 2 789 of 2 789. Skip count 0, `test-skip-integrity` "No findings."

## Deep lanes, each by count
| lane | file | passed |
|---|---|---|
| `TUNE_DEEP` (K7) | `tools/tune/tune.test.ts` | 28 / 28 |
| `SEARCH_DEEP` | `evaluate.taper` | 171 / 171 |
| | `evaluate.passer` | 29 / 29 |
| | `search.bundle` | 51 / 51 |
| | `transposition` | 40 / 40 |
| | `quiescence` | 116 / 116 |
| | `search.null-move` | 46 / 46 |
| | `search.futility` | 53 / 53 |
| | `search` | 57 / 57 |
| | `search.pvs-lmr` | 29 / 29 |
| | `see` | 52 / 52 |
| | `search.ordering` | 43 / 43 |
| | `engine` | 79 / 79 |
| `ENGINE_DEEP` | `transposition` | 26 / 26 |
| | `quiescence` | 99 / 99 |
| | `engine.capacity` | 2 / 2 |
| | `evaluate.pawns` | 96 / 96 |
| | `search.pvs-lmr` | 21 / 21 |
| | `search.ordering` | 30 / 30 |
| | `engine` | 105 / 105 |
| | `book` | 36 / 36 |
| | **`uci-session`** | **264 / 270, 6 red: the STOP** |
| `PUZZLE_DEEP` | `puzzle-suite` | 18 / 18 |
| `UCI_DEEP` | `uci.real-engine` | 13 / 13 |
| `CLI_DEEP` | `cli.real-engine` | 11 / 11 |

`TUNE_DEEP`, `search.bundle`, both `engine` lanes and `evaluate.pawns` were read at or after the tool line. The others ran at `aec95beb` plus test edits; no production line changed after it. 

**Not run:** Levels, which is K6's, after the read. The ladder, which plays games. Perft, zobrist, input and the `ENGINE_DEEP` rows of `moves`, `legal`, `gameend`, `cli` and `qe-hop-integrity`, which read no evaluation.

## Lane cost against `NFR-008`
2 734 → 2 789 rows, **+55**: 52 in `src/evaluate.pawns.test.ts`, 1 in `evaluate.taper`, 2 in `search.bundle`. No new file. The new rows take about 25 ms in-thread, the largest 6.8 ms, none near 50 ms. Two ungraded `npm test` walls read 9.50 s and 8.74 s. These are not a read; `NFR-008`'s last read is 9.085 s.
