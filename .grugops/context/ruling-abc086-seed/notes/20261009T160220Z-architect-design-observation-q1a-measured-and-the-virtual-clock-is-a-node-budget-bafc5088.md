---
id: 20261009T160220Z-architect-design-observation-q1a-measured-and-the-virtual-clock-is-a-node-budget-bafc5088
kind: observation
by: architect-design
at: 2026-10-09T16:02:20Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-078
  - ABC-121
  - ADR-0026
  - ADR-0027
  - NFR-004
  - NFR-005
  - .grugops/context/ruling-abc086-seed/probe/engine-seeded.ts
  - .grugops/context/ruling-abc086-seed/probe/run.ts
  - .grugops/context/ruling-abc086-seed/probe/ceiling.ts
  - .grugops/context/ruling-abc086-seed/probe/faithful.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d3-small.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d4-small.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d5-small.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d4-broad.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d5-broad.jsonl
  - .grugops/context/ruling-abc086-seed/probe/budget-8.jsonl
  - .grugops/context/ruling-abc086-seed/probe/budget-32.jsonl
  - .grugops/context/ruling-abc086-seed/probe/ceiling.jsonl
supersedes:
---

# Q1(a) is value-changing under LMR and work-changing; the virtual clock is already a node budget

Hand-authored, no `seal`. Node counts and scores are exact and deterministic. The single
real-clock figure is marked as load-dependent.

## The probe is the shipped engine

- `probe/engine-seeded.ts` is a copy of `src/engine.ts` at `092f647`. The header is stripped and
  the imports are re-pointed at `src/`.
- `runIteration` gains two switches: `wideRoot` (Q1(a)'s window) and a seeded draw among the
  equal-best set.
- With both off, the copy matches `chooseMove` and `chooseMoveWithoutReductions` on move, score,
  depth and nodes: **240 of 240 cells** (30 positions × 4 virtual budgets × 2 configurations;
  `faithful.jsonl`).

## Q1(a)'s construction, as probed

- Every root move after the first is searched against `best - 1` instead of `best`. A tie then
  fails high on the null window and is re-searched to an exact score.
- The equal-best set is the moves whose score equals `best`.
- S is the shipped engine. W is the window only, with the first of the set chosen (the shipped
  choice). K is the window plus a seeded draw, seeds 1–5. The R suffix means LMR off.

## Equal depth (deepening stopped after iteration d)

| corpus, d | W ≠ S score (LMR on) | K ≠ S score, runs (LMR on) | any ≠ with LMR off | W/S nodes | WR/SR nodes | ≥ 2 moves across 5 seeds |
|---|---|---|---|---|---|---|
| 30, d3 | 0 | 0 / 150 | 0 | 1.045 | 1.045 | 8 / 30 |
| 30, d4 | 0 | 0 / 150 | 0 | 1.033 | 1.042 | 6 / 30 |
| 30, d5 | 1 (5 cp) | 5 / 150 (5 cp) | 0 | 1.051 | 1.035 | 7 / 30 |
| 190, d4 | 2 (5 cp) | 10 / 950 (5 cp) | 0 | 1.043 | 1.049 | 22 / 190 |
| 190, d5 | 2 (10 cp) | 10 / 950 (20 cp) | 0 | 1.052 | 1.037 | 28 / 190 |

- **Example:** `startpos/g1h3` at depth 5 reads S `b8c6` 35, W `g8f6` 40. `startpos/b2b4` at
  depth 5 reads S 55, W 65, and K up to 75.
- **With LMR off: 0 divergences everywhere.** The value change is LMR's order dependence
  (`ADR-0026` Context), reached through the widened root window and the stored root move
  (`src/engine.ts:404`). The `UNKNOWN - verify` on BA/PM's page is answered: **(a) is
  value-changing.**

## Same virtual budget (`ticking(1)`, 30 corpus)

- 8 ticks: W completes a different depth on 1/30 positions; K on 5/150 runs. Mean depth is 3.60
  for S and 3.57 for W.
- 32 ticks: W on 3/30; K on 12/150 runs. Mean depth is 4.90 for S and 4.80 for W.

## The virtual clock is a node budget (`ceiling.jsonl`, kiwipete)

- The clock is read every 1 024 nodes inside the recursion (`src/engine.ts:202-208`), plus at
  entry, at each iteration boundary and at return. Measured: 1 013–1 022 nodes per reading.
- `ticking(1)` at budget 5 000 and at 1e9 (clamped) give the same result: 5 002 readings,
  5 112 572 nodes, depth 8. The clamp holds in virtual time.
- `ticking(4)` at budget 3 000: 752 readings, 761 596 nodes, depth 7.
- Real clock (`Date.now`), budget 3 000: 616 188 nodes, depth 7, 3 001 ms wall. This was read
  while another probe ran, so it is load-dependent and serves as scale only.
