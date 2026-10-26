---
id: 20261026T023232Z-architect-design-observation-bae20026
kind: observation
by: architect-design
at: 2026-10-26T02:32:32Z
verified_by: 
confidence: high: deterministic counts on scratch clones of 93d79b2d; base reproduces arch-design-ABC-207 and qe-ABC-215 counts exactly; no real-clock reading
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0034
  - ADR-0024
  - ADR-0020
  - NFR-005
  - NFR-004
  - NFR-008
  - NFR-009
  - G1
  - G6
  - A1
  - A2
  - A3
  - OD-205-2
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - bapm-ready-ABC-208/20261026T010656Z-ba-pm-decision-75bf6402
  - bapm-ready-ABC-208/20261026T010715Z-ba-pm-observation-a77866c6
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-a34270bf
  - grugops/arch-design-ABC-208
  - 93d79b2d
supersedes: 
seal: sha256:bf26212f9d3dd38ec35f3b2abc73db235207b680a4676d45fae0594db54ffd06
---

# Architect/Design: ABC-208 design probes. Null-move variants (R, guard size, verification, window, eval), 12 planted mutants, frozen-clock d6–d9, d5/d6 drift, mate floor, A2 rows, G1, and the moved-pin lanes on scratch clones. No real-clock timing

Task `arch-design-ABC-208`, records only. The trees are `git clone`s of `main` `93d79b2d` in `<scratchpad>/arch208/trees/`:
`base`; `h` (the design with probe-only env switches for variants and mutants); `hd` (the design, R = 3 and a three-piece
guard, no switches). `probe/patch.mjs` and `probe/patch-final.mjs` wrote them, never into a worktree. Plain node v26.11.1.
Scripts (not committed), in `<scratchpad>/arch208/probe/`: `a1.mts`, `nodes.mts`, `zz.mts`, `a2.mts`, `drift.mts`,
`mutants.sh`, `deep.sh`, `fails.sh`, `mixed.py`, `tb.sh`, `tbscan*.py`.

## Doors (A1 premise)
- `hd`/`h` door against `base`'s same door, and `searchWithoutNullMove`/`chooseMoveWithoutNullMove` against base's
  `search()`/`chooseMove`: **222/222 cells node-, score- and move-equal.** Six perft roots; 7 search doors at d1–4; 3
  engine doors at maxDepth 3/5/6. Shipped `chooseMove` differs from base on 6/6 roots at d6.

## Frozen-clock nodes to complete depth k (`chooseMove`, `now: () => 0`, `maxDepth: k`)
| tree | kiwipete d6 / d7 / d8 | position-6 d6 / d7 / d8 |
|---|---|---|
| base | 248 056 / 609 900 / 1 735 339 | 180 658 / 586 333 / 1 355 149 |
| R2 | 314 332 / 662 699 / 1 412 497 | 71 875 / 206 632 / 505 644 |
| R3 (= `hd`) | 309 541 / 590 489 / 1 259 463 | 52 265 / 180 941 / 355 565 |
| adaptive (3 at depth ≥ 7) | 314 332 / 662 699 / 1 364 331 | 71 875 / 206 632 / 441 926 |
| R3 + eval ≥ beta | 306 284 / 583 447 / 1 154 722 | 52 042 / 179 863 / 345 313 |
| R3, min depth 3 | 222 656 / 515 164 / 1 172 602 | 61 697 / 191 412 / 414 036 |
| R3, min depth 4 | 245 616 / 588 258 / 1 481 894 | 74 401 / 375 255 / 649 204 |
| R2, null at all finite-beta nodes | 314 414 / 662 806 / 1 412 668 | 71 875 / 206 625 / 505 639 |
| R3, node-local verify (VER 1) | 311 378 / 595 734 / 1 284 103 | 54 924 / 194 038 / 381 175 |
- Guards of 1, 2, 3 and 4 pieces give identical counts at d6–d8 on both boards (R2 and R3 checked).
- `hd` d9: kiwipete 2 907 475; position-6 940 109.
- Base equals `arch-design-ABC-207` `…439d6f8c`'s base row and `qe-ABC-215` `…a34270bf`'s head row.

## Zugzwang rows (CPW "Null Move Test-Positions"; chooseMove, frozen clock, fixed depth)
- Base solves: `.001` Rf1 from d9; `.002` Kh6 from d6; `.004` Qxh4 at d11; `.005` Nxd5 at d12; `.003` g5 not by d12.
- Guard 1 with R2, R3 or adaptive, and with R2 or R3 plus eval ≥ beta: `.001`, `.004`, `.005` lost through d12. `.002` solved by
  every variant.
- Node-local verification (R2/R3; from depth 1, 4, 6) and ply-window verification (R3 from depth 1 or 4; R2 from 1):
  recover at most `.001` at d12.
- Guard 2: `.001` from d9 (= base, node-equal), `.004` at d12 only, `.005` lost. Guard 3: all three at base's depth.
- K+P v K, Lichess Syzygy tablebase scan (two scans; category read per move): 20 unique-win positions. Base solves five
  at d8 (b6c6, c6d6, d6d7, d6e6, e6f6) and g4f5 at d10. R3 with no guard loses b6c6, c6d6, d6e6, e6f6 and g4f5, and
  keeps d6d7. The four d8 rows it loses are taken.
- Stockfish 19, 1 thread, depth 26: `.001` root e1f1 +258. `.004` root g7f6 0.00; searchmoves h3h4 +671. `.005` root d6d8
  −45; searchmoves f4d5 0.00.

## G1 (`PUZZLE_DEEP=1`, virtual clock, per-row lines)
- base 54/58 (misses seeds 24, 234, 288, 580).
- R3 guard 1: **50/58**, NEWLY-MISSED seeds 1, 1632, 1163 (mate-in-3; the defender has one knight) and 5464.
- R3 guard 2: 53/58 (5464). R2 guard 2: 53/58 (5464).
- R3 guard 3: **54/58**, the same four misses as base. R2 guard 3: 54/58.
- Seed 5464 (`8/8/3B1K1N/8/k7/2p5/8/4b3 b`, key e1d2): base from d5; R3 guard 2 from d8; R2 guard 2 from d7; guard 3 =
  base, node-equal.

## Drift (ABC-121's 190) and the mate floor (the 287), R3 guard 3
- d5: `search()` vs `searchWithoutNullMove` 100 % within 25 cp, max 25 (position-5/e1f2). `chooseMove` vs
  `chooseMoveWithoutNullMove` 100 %, max 8. 0 mate flips.
- d6: 99.47 %, max 26; 97.86 %, max 34. R2 guard 2 d6: 98.93 %, 26; 98.93 %, 30. R2 guard 2 d5: 98.93 %, 36; 100 %, 8.
- Unpointed `ADR-0026` d9 pair on `h` (`search()`/`chooseMove` vs the `…WithoutReductions` doors): 97.86 % / 97.33 %,
  max 63, the same as base.
- Mate floor `searchWithoutNullMove` d → `search()`: d4→d4 0 of 163; d4→d5 0 of 163; d5→d5 0 of 189.

## Planted mutants on R3 guard 3 (d5 drift + mate floor, A2 7 rows, G1)
| mutant | d5 drift (search / chooseMove) | mate floor d5→d5 | A2 | G1 |
|---|---|---|---|---|
| design | 100 %, 25 / 100 %, 8 | 0/189 | 7/7 | 54 |
| null in check | = design | 0 | 7/7 | 54 |
| double null | = design | 0 | 7/7 | 54 |
| return null score | 100 %, 4 / 100 %, 8 | 0 | 7/7 | 54 |
| no halfmove reset | = design | 0 | 7/7 | 54 |
| no material guard | 100 %, 25 / 100 %, 13; 1 flip | **60/189** | **0/7** | **49** |
| guard 1 | = design | 0 | **4/7** | **50** |
| guard 2 | = design | 0 | **5/7** | **53** |
| R 5 | = design | 0 | 7/7 | 54 |
| null at all finite-beta nodes | = design | 0 | 7/7 | 54 |
| cut without searching | **42.78 %, 790 / 86.10 %, 350** | 0 | — | — |
| sign error on the null score | **41.71 %, 644 / 83.42 %, 416** | 0 | — | — |
- At d6, R 4, R 5, null in check, double null and null at all finite-beta nodes give scores identical to the design's
  on the 190; R 5 changes the work (kiwipete d6 307 307 against 309 541). No guard and guard 1 differ on one row
  (position-3/b4d4, 22 cp), inside the bars. Return-null-score at d6: 100 %, 19 / 98.40 %, 34.

## Lanes (main's tests; `deep.sh` filters `real clock|REAL clock|wall clock|NFR-005`)
- Default (`vitest run`, heap 128): base 2 090/2 090; `hd` 2 088 (2 reds: `search.test.ts` `ABC-077` `A6` and
  `engine.test.ts` `ABC-078` `A4`, both export lists).
- Deep (`PUZZLE_DEEP`; `SEARCH_DEEP` search, ordering, transposition, quiescence, pvs-lmr; `ENGINE_DEEP` engine,
  levels, transposition): base all green (10 real-clock rows filtered). `hd`: the same 2 export rows, nothing else.
- Rows that call the shipped path and a door in one block (`mixed.py`, a coarse parser): 26 in 7 files. Of these, the
  12 in `search.pvs-lmr.test.ts` are `ABC-121`'s and re-point (decision 4).
- On `main`, the `ABC-121` d5 drift rows assert ≤ 75 cp (`ADR-0026` d9 reads 118 since `OD-205-2`).

## Not run
- Any real-clock search, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D, `N8-LANE`, the ladder lane, and the real-clock rows named
  above.
