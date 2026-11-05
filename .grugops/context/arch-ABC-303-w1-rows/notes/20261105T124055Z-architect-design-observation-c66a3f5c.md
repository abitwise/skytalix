---
id: 20261105T124055Z-architect-design-observation-c66a3f5c
kind: observation
by: architect-design
at: 2026-11-05T12:40:55Z
verified_by: 
confidence: high: each figure read from sealed output; the arithmetic reproduces the sealed reads it was tried on; nothing run
refs:
  - arch-ABC-303-w1-rows
  - grugops/arch-ABC-303-w1-rows
  - ABC-303
  - ABC-282
  - ABC-286
  - ABC-288
  - ABC-078
  - EPIC-011
  - ADR-0071
  - ADR-0072
  - ADR-0073
  - ADR-0056
  - ADR-0067
  - ADR-0064
  - 2fd5243b
  - c0c5b84c
  - 572edf13
  - a21136b0
  - se-ABC-303-main/20261105T122839Z-software-engineer-failed-attempt-c31e9a54
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-main/20261105T122839Z-software-engineer-decision-1893d3c5
  - se-ABC-303-main/20261105T122845Z-software-engineer-observation-42aa51f1
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261104T234244Z-orchestrator-decision-681c6363
supersedes: 
seal: sha256:cdf9d86c0c31f3ea507db3b21c9f3c0dea5ff97e8df54ea36efe0b97250cc8df
---

# arch-ABC-303-w1-rows observation: what `se-ABC-303-main`'s sealed outputs and the code say about the 19 rows, by arithmetic

Architect/Design, records only, on `grugops/arch-ABC-303-w1-rows` from `main` `a21136b0`. `src/` and `tools/` are unmoved from `572edf13`, so `se-ABC-303-main`'s base reads stand. Read with `git show` from `grugops/ABC-303` at `2fd5243b`. Nothing was run: no test, build, engine, vitest, tsc or lint. The arithmetic below was done by hand from sealed figures.

Sources: `raw/out/p1p2-head.jsonl` (tip `c0c5b84c`), `p1p2-base.jsonl` (`572edf13`), `w1probe.jsonl`, `a0-3-head.jsonl`, `failed-rows.txt`; `src/engine.ts` at `2fd5243b` (`deepen`, `runIteration`, `countNode`); `src/virtual-clock.ts`.

## 1. The clock's arithmetic

`virtualClock(1)` reads 0, 1, 2, … The first iteration is unclocked. `deepen` reads once at entry, once at each boundary, and at node N(1) + 1024 k for k = 1, 2, …
- The reading at the boundary before iteration i is i − 1 + ⌊(N(i − 1) − N(1)) / 1024⌋.
- The reading at check k, inside iteration i, is i + k − 1.

This reproduces every sealed figure it was tried on:

| row | arithmetic | sealed read |
|---|---|---|
| position-6 H = 6, shipped, soft | before 4: 3 + 1 = 4 ≥ 2.61, stop | depth 3, 1 262 |
| position-6 H = 6, shipped, no soft | check 2 121 reads 5 < 6; before 5: 4 + 2 = 6 ≥ 6, stop | depth 4, 2 197 |
| position-6 H = 6, all-off, no soft | check 3 145 in iteration 4 reads 6, abort | depth 3, 3 145 |
| b09#8 H = 5, both arms | check 3 125 in iteration 3 reads 5, abort | 3 125 |
| kiwipete 50 / 200 | k = 45 / 194 | 47 384 / 199 960 |
| position-6 50 / 200 / 75 | k = 43 / 192 / 68 | 44 105 / 196 681 / 69 705 |

Shipped N(d), position-6: 73, 801, 1 262, 2 197, 3 963, 10 513, 39 268, 94 911. Kiwipete: 1 304, 2 678, 5 386, 11 783, 33 116, 104 780, 244 677, 573 518.

## 2. A1 (a): the base no longer aborts inside d + 1 at H = 6

- At H = 6 on the shipped path the base COMPLETES iteration 4 at node 2 197 and stops at the boundary. 2 197 is N(4), not a check node (checks are 1 097, 2 121, 3 145). No iteration is aborted.
- So the head's stop at depth 3 skipped an iteration that would have finished. Pinning `base.depth` to 4 leaves the row green and false: `ADR-0071` D9 fixes it "on a row where the base aborts inside d + 1", and its own comment says so.
- **H = 5 on the same position restores the case with no asserted figure moved.** Head: soft 2.17, before 3 reads 2, iteration 3 starts; before 4 reads 4, stop; depth 3, 1 262 = N(3). Base: 4 < 5, iteration 4 starts; check 2 121 reads 5 ≥ 5, abort, 76 nodes short of N(4). Depth 3, 2 121.
- H = 5 is the only budget with d = 3: H = 4 stops the base at the boundary, H = 7 to 9 let it complete d + 1, and from H = 10 the head starts iteration 4.

## 3. A2 (a) and D5: `a1f6`, 475 is still a kept partial move

- `w1probe.jsonl`, shipped: head `a1f6`, 475, depth 2, 3 125 nodes, `partial` true; base `a1e5`, 484, depth 2, 3 125 nodes. `softMs` 5 reads the same. So all of the row's assertions but the `kept` literal hold on the tip. The test stops at the first failing `expect`; the probe reads the rest.
- Iteration 3 starts (before 3 reads 2 < 2.17) and is aborted at 3 125, inside it: N(3) is 3 506 on the tip. It runs a full window, since iteration 3 < `ASPIRATION_FROM`.
- **The frozen depth-3 line settles the comparison on its own.** `p1p2-head.jsonl`, `base/b09#8`: d = 2 `a1e5` 484; d = 3 `a1f6` 475. The root loop displaces on strict `>`, so `a1f6`'s completed 475 is strictly above `a1e5`'s own depth-3 score. The frozen run and the clocked run are the same tree up to node 3 125.
- **`main` agrees.** `p1p2-base.jsonl`: d = 3 `a1f6` 475 at N(3) = 4 276. The move and score are `main`'s own depth-3 answer, not a figure the bundle made. The old row's `a1b1`, 450 was an earlier beat in that iteration. The bundle's smaller tree gets further down the same root list in the same 3 125 nodes.
- In code, `budget.beaten` is written only under `incumbentExact && score > best`, so `partial` true is D4's clauses 1 to 3. The merge left this code alone: `runIteration`'s root `orderMoves` call takes no countermove, and P4 needs `ply > 0`.
- **One difference from the old row:** the kept move is now also the iteration's final best, 381 nodes before the iteration ends. D4 does not claim otherwise. The row still tells an aborted iteration from a completed one: depth 2, `partial`, 3 125 < 3 506.

## 4. A0-2 and five A0-3 rows: nodes did not move, and those nodes are what would show a leak

- Abort nodes depend on N(1), the budget and the iteration index i. N(1) does not move and i is the same on these rows. So `depth`, `move`, `nodes`, `time` and `nps` are unchanged and only the score moves (`a0-3-head.jsonl`, `p1p2-head.jsonl` P2v).
- A W1 leak at soft = H / 2.3 would stop each row earlier on the new tree:

| row | soft | stopping boundary | leak reads | pinned |
|---|---|---|---|---|
| kiwipete 50 | 21.7 | before 6, 36 | 33 116 | 47 384 |
| kiwipete 200 | 87.0 | before 7, 107 | 104 780 | 199 960 |
| position-6 50 | 21.7 | before 8, 45 | 39 268 | 44 105 |
| position-6 200 (and the `D8` line) | 87.0 | before 9, 100 | 94 911 | 196 681 |
| budget 75 (the `D7` line) | 32.6 | before 8, 45 | 39 268 | 69 705 |

- The last row is the W1-on row's read: `uci-clock-mode` `go wtime 8000 …` reads 39 268 = N(7), and "D3's row reads less than the base did" stays green at 39 268 < 69 705.
- `go depth 6` never reaches a clock on any tree (budget 22 000, about 17 virtual ms), so it could not see a leak on the base either. Its `nodes` is a pure tree pin, and its new figure 10 513 is N(6).
- New `cp` figures agree with the frozen rows: 43 at d7, 45 at d8, 87 at d6.

## 5. A0-1

- A frozen clock never reaches a soft limit (D8 says so). So a literal in A0-1 cannot see W1 firing; the part of the row that reads W1 is `softMs` absent ≡ `softMs: 1`.
- The new d8 figures, 573 518 / 94 911, are `ADR-0072` d9's instrument counts and R7's, and d8 kiwipete's `e2a6` is `ADR-0072` § Context's root-move line.
- `chooseMove` and every door differ only in the `heuristics` argument to `deepen`, where `softMs` is read. So the all-off door with `softMs` absent walks the W1-off code path the shipped path walks.
- `src/search.bundle.test.ts` P0 and `src/engine.test.ts` A3 already re-point to the same door with "figures unchanged".

## 6. Rows green on the tip, checked for a silent loss of case

- A1 (b): before 4 reads 4 < 4.35, iteration 4 starts. Case holds.
- The seven other A2 rows assert kept, depth and nodes literally, and are green, so each case holds.
- A1 (c), D5's no-line row, and the default-lane "hands no soft limit" rows read no tree figure that moved.
