---
id: 20260919T093200Z-software-engineer-observation-rehop-a5-ratios-and-criteria-a1-a6-rerun-1c3e5a72
kind: observation
by: software-engineer
at: 2026-09-19T09:32:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ADR-0024
  - NFR-005
  - src/quiescence.test.ts
  - src/quiescence.ts
  - src/engine.test.ts
supersedes: 20260919T073500Z-software-engineer-observation-criteria-a1-a6-verdicts-3c5e7a91
---

# `A5` measured at depths 1–3 against the `ADR-0024` levels, and `A1`–`A4`, `A6` re-run (not re-argued) at `700730b`

Node counts are deterministic and load-independent; every number below is from the test lane's
own `console.log` lines or the equivalent out-of-tree run, and reproduces run to run.

## `A5` — the same-depth multiplier `search()` / `searchWithoutQuiescence()`, MVV-LVA ordered

| position | depth | with | without | measured | ADR-0024 ordered | level (1.5x) | lane | verdict |
|---|---:|---:|---:|---:|---:|---:|---|---|
| kiwipete | 1 | 5 878 | 49 | **119.96x** | 120.16x | ≤ 180x | default | under |
| kiwipete | 2 | 10 249 | 313 | **32.74x** | 33.17x | ≤ 50x | deep | under |
| kiwipete | 3 | 405 945 | 9 016 | **45.02x** | 45.02x | ≤ 70x | deep | under |
| position-6 | 1 | 297 | 47 | **6.32x** | 6.32x | ≤ 10x | default | under |
| position-6 | 2 | 9 804 | 562 | **17.44x** | 17.44x | ≤ 26x | deep | under |
| position-6 | 3 | 120 239 | 14 565 | **8.26x** | 8.26x | ≤ 13x | deep | under |

Unordered at `e2c3af5` the same cells read 702x / 878x / 1 483x and 62x / 377x / 120x. The
kiwipete counts are 10 / 133 / 23 nodes under the probe's (promotion term — decision note §2);
position-6 is the probe to the node. **`A5` MET at every cell, still asserted, still a stop.**
Depth 4 not re-measured here (the ruling's 26.4x / 7.5x stand as its figures).

## `A1`–`A4`, `A6` — re-run, verdicts unchanged

| # | measured at `700730b` | verdict |
|---|---|---|
| `A1` | 24 positions; depth 1: **0/24** losing with quiescence, **24/24** without; depth 3 (deep): 0/24 and 0/24, reported | MET, unchanged |
| `A2` | 4 quiet positions equal by `Object.is`, 0 q-nodes, `search(p, 0)` equal through the seam; hanging pawn strictly greater; defended pawn equal (capture searched and declined) | MET, unchanged |
| `A3` | default corpus ≥ 200, deepest ≤ 8; sixteen-queens rig reaches exactly 8; deep: six roots + all one-ply children, deepest 8 | MET, unchanged |
| `A4` | bare kings / K+P vs far K / two far pawns at depths 1–4 and startpos at 1: same score, move AND node count; door reproduces 562 / g5f6 and (deep) 14 565 / c3d5 | MET, unchanged |
| `A6` | 0 mutated over the ≥ 200 corpus, 0 over 24 positions both arms, 0 on the throwing visitor at ply 3, deep 0 over 190 | MET, unchanged |

Ordering is lossless as the ruling said: `search()` returns the same score and move as the
unordered build at every cell measured (kiwipete 145 / 70 / 50 e2a6; position-6 10 / 30 / 30
c3d5). The `A1` depth-3 arm is still reported rather than asserted worse, for the reason the
first hop gave.

## Collateral in `src/engine.test.ts`, re-run

The three first-hop reds are green: `A2` node bound 9 973 ≤ 10 240 (bound unchanged); `A3`
"aborts INSIDE depth 3" and "returns the completed depth-2 move" on the new fixture (decision
note §3). The `A3` identity sweeps (engine copy == `search()` in move AND score) are green in
both lanes, which is what says the engine's recursion picked up the sort through the shared leaf
without a second copy of it.
