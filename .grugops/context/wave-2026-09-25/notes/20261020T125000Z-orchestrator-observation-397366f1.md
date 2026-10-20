---
id: 20261020T125000Z-orchestrator-observation-397366f1
kind: observation
by: orchestrator
at: 2026-10-20T12:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-175
  - ABC-174
  - ABC-085
  - ADR-0045
  - 84c0f2d9
  - f6b63c1c
supersedes: 
seal: sha256:cfdd8b4867d797990ae845cf23a9c81039da2b04ccad39f85f53ae74cd96ee4f
---

ABC-175 A2/A3 reading. Run tree: grugops/ABC-175 @ f6b63c1c, a worktree in ../wt-ABC-175. The records are commit 84c0f2d9 on that branch. Every figure below is from raw/verdict.out.txt and verdict.meta.txt.

**A2 holds.**
- Exit 0; `Tests 17 passed (17)`.
- 5 LADDER PAIR lines and 180 LADDER GAME lines.
- Game counts per pair: 3v4 20, 4v5 20, 2v3 20, 1v2 20, 1v5 100.
- The PAIR lines run in the order 3v4, 4v5, 2v3, 1v2, 1v5, and every one reads "verdict mode, step 4".
- Every commit is f6b63c1c, with no dirty suffix.
- The meta file records the command verbatim, with flag 400. The run went from 07:45:11Z to 12:47:29Z, a meta wall of 5 h 02 m. vitest reports Duration 18137.10 s. load1 was 3.47 at the start. Node is v26.11.1 and vitest is 4.1.11. Power was AC and the lid was open at both start and end.
- The output contains no `heap out of memory` and no `Worker exited`. So the 496 MiB cap held for all 180 games, which closes OQ-175-H1's unknown.

**A3, the reading.** Step 4. The stronger side's win/draw/loss and score:

| pair | stronger side W/D/L | score | bar | verdict | claimed draws | wallS | load1 |
|---|---|---|---|---|---|---|---|
| 3v4 | 17/3/0 | 18.5/20 (92.5 %) | > 50 % | MET | 3 | 1371.4 | 3.35→4.56 |
| 4v5 | 9/10/1 | 14/20 (70 %) | > 50 % | MET | 9 (+1 insufficient material) | 4871.2 | 4.56→3.14 |
| 2v3 | 17/1/2 | 17.5/20 (87.5 %) | > 50 % | MET | 1 | 442.5 | 3.14→3.5 |
| 1v2 | 18/0/2 | 18/20 (90 %) | > 50 % | MET | 0 | 199.8 | 3.5→2.7 |
| 1v5 (ABC-085 A1) | 100/0/0 | 100/100 | ≥ 90 % | MET | 0 | 11251.6 | 2.7→4.97 |

- The pre-registered prediction was MET on all five (UNKNOWN - verify). The reading is MET on all five.
- On the old table, run 2 was RED on 3v4 and 4v5. It is not compared here, because it played a different table.
- The 4v5 pair is the narrowest: 14/20, with 9 claimed threefold draws.

**A5 is still owed.** The tree check runs when ABC-174 merges.
