---
id: 20261106T201944Z-software-engineer-observation-f0c9e801
kind: observation
by: software-engineer
at: 2026-11-06T20:19:44Z
verified_by: 
confidence: high: read as run; K0 (b) at S2's depths only
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
seal: sha256:0548265dd0d779116c69ce9b8a6ee93ef98aeaaa02c28f444432d6e534ae3c73
---

# se-ABC-291 observation: K0 (a) 7 of 7, K0 (b) 70 of 70, K0 (c) re-derived; K3 read on this P4 tree: mate floor 0, zugzwang 7 / 7, G1 54 / 58 no NEWLY-MISSED, row 1632 at 16 838 of 20 534

Read on the built tree, base `main` `8e115110`, `src/` tree `bba42fb7`. `raw/out/`, `raw/scripts/k0.ts`, `raw/scripts/row1632.ts`.

## K0
- **(a), 7 of 7 exact:** the off doors against the base's `chooseMove` and `search()`: nodes, score, move.
- **(b), 70 of 70 exact:** all 35 base doors, 20 `search` and 15 `chooseMove`, the six of bundle 1 among them, on kiwipete and position-6, in `se-ABC-303`'s S2 shape: `search` doors at d5, the unpruned at d3, `chooseMove` doors at d6. Not read deeper.
- **(c), the head, both sets:**

| row | at `cc6e64d1` (the probe) | at `8e115110` (here) |
|---|---|---|
| `chooseMove` kiwipete d8 | 693 584, −87, d5e6 | 570 174, −116, e2a6 |
| `chooseMove` kiwipete d9 | 1 517 556, −110, e2a6 | 1 236 991, −116, e2a6 |
| `chooseMove` position-6 d8 | 120 104, 74, c3d5 | 81 563, 74, c3d5 |
| `chooseMove` position-6 d9 | 250 777, 74, c3d5 | 201 352, 65, c3d5 |
| `chooseMove` position-6 d10 | 511 558, 75, c3d5 | 398 375, 70, c3d5 |
| `search()` kiwipete d8 | 521 532, −87, d5e6 | 314 231, −83, e2a6 |
| `search()` position-6 d8 | 271 572, 74, c3d5 | 159 750, 74, c3d5 |

The patch without the cut and the build with it read the same seven rows, byte for byte.

## K3, all on
- **Mate floor:** door d4 → head d5, 0 of 163. d5 → d5, 0 of 191. On the 287.
- **Zugzwang:** 7 / 7 at recorded depths, `zugzwang.001` among them. The played move only.
- **`G1`:** 54 / 58, ON and OFF. No NEWLY-MISSED line, none outside the baseline's four.
- **Row 1632, "mate in 3, seed 1632":** solved at 1×, d5, `e7e2`, 29 995, **16 838 of 20 534 nodes, 82.0 %**. Head, off door and base read the same to the node: the row has no pawn the terms touch. 0.8× misses it, `e7f6` 1 520 at d4, as `main` does. +5 %, +10 %, +25 % and 2× solve it. Never re-pinned.

## Beside K3, reports only
- PR2's sets 230 pairs, 0 mismatches. The probe's labeller over 28 126 positions, 0 mismatches, hot 0. Memo 28 126, 1 068 collisions, 0 bad. These are on the build with the cut.
- Reach at 47 000: 7.016 → 7.042.
- **Drift at d5 moved against the probe:** 96.79 % within 25 cp, largest 89 (position-6/e2d2 12 → 101), against 100 % and 24 at `cc6e64d1`. Drift is a report on this page, so no bar reads it. Mate flips 0, sign flips 0, 5 moves differ.
