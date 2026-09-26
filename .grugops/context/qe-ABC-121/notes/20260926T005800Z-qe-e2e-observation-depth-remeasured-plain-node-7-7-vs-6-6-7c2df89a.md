---
id: 20260926T005800Z-qe-e2e-observation-depth-remeasured-plain-node-7-7-vs-6-6-7c2df89a
kind: observation
by: qe-e2e
at: 2026-09-26T00:58:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - NFR-005
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200000Z-software-engineer-observation-abc121-a1-a6-readings-depth-7-7-node-drift-45cp-mate-floor-0-4acb5c4b.md
---

# `A2` depth-in-3s re-measured independently on plain node, 3 rounds, kiwipete + position-6, with load — matches the build

Hand-authored, no `seal`. Apple M3, node v24.12.0. Own script (not the build's
`probe/depth.ts`), importing `chooseMove` / `chooseMoveWithoutPvsOrReductions` directly from
this worktree's `src/engine.ts` and running under plain `node`, never `vitest` (`NFR-005`'s
runner).

| round | kiwipete build / door (nodes) | position-6 build / door (nodes) | load1 |
|---|---|---|---|
| 1 | 7 (766716) / 6 (895754) | 7 (812457) / 6 (851230) | 3.31–3.34 |
| 2 | 7 (775932) / 6 (907018) | 7 (810409) / 6 (848158) | 3.32–3.35 |
| 3 | 7 (775932) / 6 (892682) | 7 (795049) / 6 (848158) | 3.32–3.38 |

7/7 build against 6/6 pre-`ABC-121` door, every round, both positions — matches the build's own
plain-node reading (`…4acb5c4b`: "7/7 vs 6/6, both for the pre-`ABC-121` door and the base
build, every round"). This run's load (3.2–3.4) is much lower than the build's (4.2–5.7) and
the lane re-hop's (16–32); the depth result is unaffected by that range on this machine — the
margin at this load reads wider (kiwipete 766716–775932 / 532363 = 1.44x–1.46x; position-6
795049–812457 / 467461 = 1.70x–1.74x — close to the build's own 1.46x–1.76x band, using the
node counts recorded at the deep companion row this hop reproduced,
`…dc82fb03`). Node counts differ from the build's own round-by-round figures (both readings
are wall-clock-bounded, not seed-fixed, so exact node counts vary run to run) but the DEPTH
figure — the bar `A2` actually tests — is identical: 7 against 6, at every round, on both
positions, independently.
