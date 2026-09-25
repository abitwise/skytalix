---
id: 20260919T073500Z-software-engineer-observation-criteria-a1-a6-verdicts-3c5e7a91
kind: observation
by: software-engineer
at: 2026-09-19T07:35:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-084
  - src/quiescence.test.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
supersedes:
---

# `ABC-079` criteria `A1`–`A6`, each with the number it asked for, as measured at the branch tip

All in `src/quiescence.test.ts`. Default lane: 29 cases, **27 pass, 2 fail (both `A5`)**. Deep
lane (`SEARCH_DEEP=1`): see the gate-results claim for the counts and the time it took.

| # | criterion | asked | measured | verdict |
|---|---|---|---|---|
| `A1` | the losing capture is not chosen in ≥ 19/20, and the no-quiescence arm is strictly worse, same test | ≥ 20 positions | **24 positions** (12 white-to-move, 12 hand-mirrored black-to-move; the `evaluate.test.ts` mirror helper is not exported, by its own design). Depth 1: **0/24** losing with quiescence, **24/24** losing without — the bare leaf takes the material in every row. Depth 3 (deep lane): 0/24 and 0/24 — at depth 3 the bare leaf sees the recapture too, so the baseline is reported there, not asserted worse | **MET** at depth 1, both arms in one test |
| `A2` | quiet position: quiescence value == static evaluation EXACTLY; a winning capture: strictly greater | exact / strict | 4 quiet positions: equal by `Object.is`, 0 quiescence nodes entered, and `search(p, 0).score` equal through the seam. Hanging pawn `4k3/8/8/3p4/8/8/8/3QK3 w`: 905 > 775. A DEFENDED pawn: value == static (the capture searched and declined) | **MET** |
| `A3` | terminates on ≥ 200 corpus positions incl. capture-dense; observed depth never exceeds the cap | ≥ 200, ≤ cap | default corpus **≥ 200** (six roots incl. kiwipete/position-4/5/6 + startpos 1-ply + position-3 2-ply), deepest observed ≤ 8; sixteen-queens rig reaches **exactly 8** — the cap binds and is not exceeded; deep lane: six roots + all 184 one-ply children, deepest 8 | **MET** |
| `A4` | quiet-neighbourhood positions score identically to the pre-quiescence build | identical | bare kings, K+P vs far K, two far pawns at depths 1–4 and startpos at 1: same score, same move, **same node count** (proof no quiescence node was entered). The door IS the old build: position-6 depth 2 reproduces `ABC-078`'s recorded **562 nodes / g5f6**, depth 3 (deep lane) **14 565 / c3d5** | **MET** |
| `A5` | multiplier on kiwipete and position-6 reported; > 4x = stop | ≤ 4x | **702.1x / 61.7x at depth 1** (default lane), 877.7x / 377.2x at 2, 1 482.7x / 119.5x at 3 — see the stop note | **NOT MET — STOP CONDITION, halted and reported** |
| `A6` | input `Position` byte-identical after every search, over the corpus | 0 mutated | 0 mutated over the ≥ 200 corpus (quiescence from a full window), 0 over the 24-position set in both arms, 0 when the visitor THROWS at ply 3 (the engine's abort path); deep lane 0 over 190 | **MET** |

Two trapped fixtures were caught by the test itself and replaced before the run above: a
"quiet" rook-vs-rook position with the non-mover in check (illegal; `legalMoves` offered a king
capture), and a K+P vs K where the pawn could step next to the king inside the horizon. `A1`'s
first case now asserts every losing capture is LEGAL for the side to move, so the check-trap
cannot recur silently.

`ABC-084` extends `HANGING_CORPUS` in `src/quiescence.test.ts`; it does not fork it.
