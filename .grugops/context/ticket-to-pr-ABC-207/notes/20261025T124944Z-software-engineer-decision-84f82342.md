---
id: 20261025T124944Z-software-engineer-decision-84f82342
kind: decision
by: software-engineer
at: 2026-10-25T12:49:44Z
verified_by: 
confidence: high: every after-value measured on base and head by node scripts; equal to the ruling
refs:
  - ABC-207
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - grugops/ABC-207
  - 26c43d28
  - 5050cce9
  - src/search.ordering.test.ts
  - src/search.pvs-lmr.test.ts
  - src/transposition.test.ts
  - src/quiescence.test.ts
  - QE-215-d
supersedes: 
seal: sha256:440a01e64a9ff507052136f04d95ab23735b4f0ff1afaaeb0553d93d5c0b4a78
---

# ABC-207 moved pins: exactly the ruling's 12 rows in 4 files, each by its stated route (10 re-pins, 1 ADR-0028 d2 re-find, the oracle rule on 2), every value equal to the ruling; 0 relations, 0 levels

Every "after" value was read by a node script on base (`main` `26c43d28` `src/`) and head before any literal changed. None was copied from a failure message alone. Each row carries a `RE-PINNED` / `RE-FOUND at ABC-207` comment with before → after.

| # | row | before → after (measured on head) | route | = ruling |
|---|---|---|---|---|
| 1 | `search.ordering.test.ts` `A4` position-6 d2 none / MVV-LVA / + killers | 10 371 / 3 266 / 3 177 → 11 220 / 1 317 / 1 317 | re-pin. The stale "12%" is named in the docblock this re-pin edits (`QE-215-d`). `A3` guard 11.74 % (≤ 65 %) | yes |
| 2 | `search.ordering.test.ts` `G1` position-3, 3 ticks | 342 → 364 (depth 3) | re-pin; `N3` re-planted reads 361 | yes |
| 3 | `search.pvs-lmr.test.ts` `A4` `search()` | premise lost on 1. Rb3 Rd5 (shipped 10, unreduced 2) → re-found `A4_SEARCH_FEN` = position-3 after 1. Rb3 Kg5 (`8/2p5/3p4/KP4kr/5p2/1R6/4P1P1/8 w - - 2 2`), pin −1 / b3c3 | `ADR-0028` d2 re-find: `ticket-to-pr-ABC-083/probe/a4scan.ts` at fixed depth 4, 467 positions, 2 hits; the first was taken. Reference recursion: `noLmrResearch` and `noResearch` read −12 / g2g3 | yes (route) |
| 4 | `search.pvs-lmr.test.ts` `A4` `chooseMove()` | −7 / b3f3 → −12 / b3h3 (re-search > 0, equals unreduced) | re-pin | yes |
| 5 | `transposition.test.ts` `A1` knight-g1 w K and w − | 939 → 911, table on and off (2 rows) | re-pin. d5 reads 916 vs 911 | yes |
| 6 | `transposition.test.ts` `A1` position-3 d4 | 1 377 → 1 355 with the table; table-off re-read 1 533 → 1 512 (same row) | re-pin | yes |
| 7 | `transposition.test.ts` `A5` nodes; the depth-3 score | 7 295 → 7 629; −485 → −498 (2 rows) | re-pin | yes |
| 8 | `quiescence.test.ts` `A4` position-6 d3 bare leaf `[deep]` | 2 398 → 2 358, c3d5 | re-pin | yes |
| 9 | `quiescence.test.ts` `A5` `ORACLE_AT_DEPTH_3` `[deep]` | kiwipete 8 → 20 / e2a6; position-6 85 → 78 / c3d5 (2 rows) | the oracle rule: `searchWithoutPruning(p, 3)` 70 389 552 and 14 332 220 nodes, equal to `searchWithoutPvsOrReductions` and `search()` on score and move on both boards | yes |

- 12 rows in 4 files. No relation row, no level and no other row moved. The promotion-capture 232 row was re-read and is unchanged.
- One value the ruling left to be re-read: row 6's table-off count, 1 533 → 1 512. It sits in the same row.
