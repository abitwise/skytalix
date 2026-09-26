---
id: 20260926T220100Z-qe-e2e-observation-a2-depth-floor-plain-node-three-rounds-80a5e0a0
kind: observation
by: qe-e2e
at: 2026-09-26T22:01:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - A2
  - NFR-005
supersedes:
---

# `A2` depth floor re-measured independently, plain node, three rounds — 7/7 build vs 6/6 door, both positions, every round

Hand-authored, unsealed. Own script (not `probe/depth.ts`, not the build's or QE's own script),
importing `chooseMove` / `chooseMoveWithoutPvsOrReductions` and `DEFAULT_BUDGET_MS` directly from
this worktree's `src/engine.ts`, and `parseFen` from `src/fen.ts`, run under plain `node`
(`node --experimental-strip-types`), never `vitest` — `NFR-005`'s binding runner.

| round | kiwipete build (nodes) | kiwipete door (nodes) | position-6 build (nodes) | position-6 door (nodes) | load1 |
|---|---|---|---|---|---|
| 1 | 7 (672508) | 6 (765706) | 7 (701865) | 6 (749854) | 8.68 |
| 2 | 7 (666364) | 6 (779018) | 7 (711081) | 6 (758046) | 8.02 |
| 3 | 7 (649980) | 6 (744202) | 7 (692649) | 6 (745758) | 7.99 |

7/7 on the build against 6/6 on the pre-`ABC-121` door, every round, both positions — matches the
build's own reading (`…4acb5c4b`), QE's (`…7c2df89a`) and Security/NFR's (`…76eb826c`): "7/7/7"
kiwipete and position-6 vs the door's 6/6/6. This session's load (8.0–8.7) sits between QE's
(3.2–3.4) and the build's/lane's higher readings; the DEPTH figure (7 vs 6) is unaffected across
that whole range on this machine, consistent with every prior reading.
