---
id: 20260925T184200Z-software-engineer-observation-abc121-every-repointed-row-one-line-each-d9a84a04
kind: observation
by: software-engineer
at: 2026-09-25T18:42:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ADR-0026
  - .grugops/context/ruling-abc121-lmr-oracle/notes/20260925T141021Z-architect-design-decision-r1-identity-rows-stay-binding-against-pre-abc121-doors-c41d9e07.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/door-faithful.ts
supersedes:
---

# Every merged row `ABC-121` re-pointed, one line each (test note 5) — for QE to check against the tree

Hand-authored, no `seal`. Read from the diff `15c6eb0..39ce7a2`. **No bar, ratio, pin or
literal changed value in any row below.** Each row's merged figure was reproduced on its new door
by the lanes, and the doors were proved equal to the base build node for node:
`probe/door-faithful.ts` compared 292 search cells and 144 engine cells against the main checkout
at `15c6eb0`, with 0 mismatches.

## Pre-`ABC-121` search door, `searchWithoutPvsOrReductions` (work rows, `ADR-0026` decision 4)

1. `search.test.ts` `ABC-077` `A2`, startpos depth 2: the pruned side of the < 40% ratio.
2. `search.ordering.test.ts` `ABC-080`: the `full` helper, which feeds `A1` (default d3 and deep
   d3/d4 identity), `A3` (default p6 d2 ≤ 40.5%, deep d4 ≤ 4%) and `A4` (p6 d2 pin 2 467; deep
   d4/d5 hash column).
3. `search.ordering.test.ts` `ABC-080` `A4`: the promotion-capture pin, 261.
4. `transposition.test.ts` `ABC-081` `A1`, deep: table on vs off at d4 on the five roots.
5. `transposition.test.ts` `ABC-081` `A1`: position-3 d4 pins 1 123 / 1 299.
6. `transposition.test.ts` `ABC-081` `A1`: the G6 knight pair, 830 / 820. **Not on the ruling's
   list — see the decision note `…0da3f1a5`.**
7. `transposition.test.ts` `ABC-081` `A2`: hit rate, default position-3 d4 and deep kiwipete /
   position-6 d5 fixed.
8. `transposition.test.ts` `ABC-081` `A5`: the 7 241 node pin only. The score 0 and the move
   f7f8 stay on `search()`.
9. `quiescence.test.ts` `ABC-079` `A1`: the bare-leaf strictly-worse comparison only. The
   losing-capture count stays on `search()`.
10. `quiescence.test.ts` `ABC-079` `A4`: the quiet-position rows (score, move and node count vs
    the bare leaf), 13 cells.
11. `quiescence.test.ts` `ABC-079` `A5`: the multiplier (default d1 on both boards; deep d2/d3,
    including the oracle-checked d3 answers 50/e2a6 and 30/c3d5).

## Pre-`ABC-121` engine door, `chooseMoveWithoutPvsOrReductions` (work rows, decision 4)

12. `search.ordering.test.ts` `ABC-080` `G1`: position-3 at 3 ticks, depth 3 in 358 nodes.
13. `transposition.test.ts`'s `deepenTo` helper, which feeds `ABC-081` `A2` deep (the deepened hit
    rate, printed) and `A3` (default position-3 to d4 ≤ 70%; deep kiwipete / position-6 to d5).
14. `transposition.test.ts` `ABC-081` `A4`, deep rook ending: the depth-10-at-160-ticks half and
    the `searchWithoutTable(…, 10)` comparison. The −29 992 literal ALSO stays on the shipped
    `chooseMove` (decision 7's split; decision note `…0da3f1a5`).

## The drift detectors, the `…WithoutReductions` pair (decision 5)

15. `search.test.ts` `ABC-077` `A1`: the quiescence-leaf pairs' pruned side is
    `searchWithoutReductions` (default d2 × 3 and d3 position-3; deep d2 × 3 and d3 startpos).
    The bare-leaf deep pairs compare two older doors and are untouched.
16. `engine.test.ts` `ABC-078` `A3` identity sweep: `chooseMoveWithoutReductions` vs
    `searchWithoutReductions`, and `rootMoveScore`'s reference (default: four endgames at
    budgets 3 and 5; deep: endgames with children, and the broad corpus).
17. `engine.test.ts` `ABC-078` `A3` abort row: its two `search()` references (the node sum and
    the depth-2 move/score) are `searchWithoutReductions`. The aborted engine stays the shipped
    `chooseMove`.
18. `engine.test.ts` deep `A3` literal row: `searchWithoutReductions(A3_FEN, 3).move` is g4g5.

## Export lists

19. `search.test.ts` `ABC-077` `A6`: grows by `searchWithoutReductions`,
    `searchWithoutPvsOrReductions` and `lateMoveReduction`, with a `Function.length` row for each.
20. `engine.test.ts` `ABC-078` `A4`: grows by `chooseMoveWithoutReductions` and
    `chooseMoveWithoutPvsOrReductions`, with a `Function.length` of 2 for each.

## Deliberately NOT re-pointed (value and behaviour rows on the shipped path, decision 7)

- `search.test.ts` `A3` (all five mate rows), `A4`, `A5`, `A7`. The `A7` depth-3 row GAINED an
  explicit `search()` check, because its pair's pruned side is now a door.
- `search.qe.test.ts` QE-G1–G3.
- `quiescence.test.ts` `A1` (the count), `A2`, `A3`, `A6`.
- `transposition.test.ts` `A5` (score and move at d3/d4, `chooseMove` at 6 ticks, the deep
  perpetual rows at d5/d6), `A6`, `A7`.
- `search.ordering.test.ts` Scope rows and `A6` killer rows.
- Every `engine.test.ts` clock, abort, budget, ceiling and seam row.
- `search.capacity.test.ts` and `engine.capacity.test.ts`. Branching 1 means neither PVS nor LMR
  fires there; both pins are unchanged.
