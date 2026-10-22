---
id: 20261022T190056Z-software-engineer-observation-c662ec3c
kind: observation
by: software-engineer
at: 2026-10-22T19:00:56Z
verified_by: 
confidence: high
refs:
  - ABC-199
  - QE-198-a
  - ABC-170
  - ABC-167
  - ADR-0046
  - 08d42d01
  - 3d6856db
  - 20261022T172640Z-ba-pm-decision-479ce351
  - 20261022T172634Z-ba-pm-observation-1563f813
  - 20261022T171339Z-qe-e2e-observation-0751bfeb
  - 20261019T153000Z-orchestrator-decision-owner-word-abc173-lighten-rows-keep-cap-6e1d9b47
supersedes: 
seal: sha256:ea74eee3472cb391346a0207333c74abeee379c0ce0ddab13d9879343386503e
---

# ABC-199 A1–A3: node census at base and tip, and the K1–K4 plants. Nodes only, no timing

Software Engineer, task `ticket-to-pr-ABC-199`, 2026-10-22. Base `main` `08d42d01` (ABC-178 not yet merged; see the decision note). Tip commit `3d6856db` on `grugops/ABC-199`. Scratch only (`…/scratchpad/se199/`), production never edited in the worktree.

## Census instrument
Scratch copies `cen-base` and `cen-tip` (`git archive` of `08d42d01`; `cen-tip` with the tip's two test files). `deepen`'s return appends `deepen <reached> <budget.nodes>` to a file, and `search()` appends `search <depth> <nodes>` (row 2's reference). Each row ran alone (`-t`, one file, heap 400). The first 214 lines (engine file) and 84 lines (uci file) are collection-phase calls, byte-identical at base and tip; each row's own reading is the tail after them.

| row | base | tip | tip / base |
|---|---|---|---|
| `ABC-170 A2` row 1 | `deepen 3 20058` = 20 058 | `deepen 2 6746` = 6 746 | 33.6 % |
| `ABC-170 A2` row 2 (three searches) | 20 058 + 9 119 + `search 3` 6 582 = **35 759** | 6 746 + 2 538 + `search 2` 1 937 = **11 221** | **31.4 %** |
| `ABC-167 A7` row 1 (free + capped) | `deepen 6 55317` + `deepen 3 655` = **55 972** | `deepen 5 25621` + `deepen 3 655` = **26 276** | **46.9 %** |

Kiwipete iteration boundaries (Node type-stripping probe on the same source): depth 1 completes at 602, depth 2 at 2 538, depth 3 at 9 119. The node checks after depth 1 fall at 1 626, 2 650, 3 674, 4 698, 5 722, 6 746, 7 770, 8 794, …. Every N ≥ about 9 119 completes depth 3 and reads a row-2 census ≥ 26 543 (> 60 % of 35 759), so A1's target forces d = 2.

UCI probe: step 50 free depth 6 / 55 317; step 100 free depth 5 / 25 621; step 1 000 free depth 3 / 655 (confirms the page: step 1 000 cannot reach 4). `go depth 3` reads depth 3 / 655 at step 50 and at step 100.

## Plants (scratch copies `K1`–`K4`, one production edit each, red-first at base, then the tip's test files copied in)
- **K1**: `runIteration` records `{move, score}` on each root displacement into `budget.partial` (reset per iteration); `deepen`'s ABORTED catch replaces `best` with it when set. Depth stays `reached`.
- **K2**: `deepen` sets `maxNodes: Number.POSITIVE_INFINITY`.
- **K3**: `parseGo` drops the `depth` value (`void value`).
- **K4**: `parseGo` sets `depth = value + 1`.

| plant | row | base | tip |
|---|---|---|---|
| K1 | `ABC-170 A2` row 2 | **GREEN** (rc 0, 1 passed) | RED: `expected 70 to be 109` |
| K2 | `ABC-170 A2` row 1 | RED: `expected 5112410 to be less than or equal to 21024` | RED: `… to be less than or equal to 7024` |
| K3 | `ABC-167 A7` row 1 | RED: `expected 6 to be 3` | RED: `expected 6 to be 3` |
| K4 | `ABC-167 A7` row 1 | RED: `expected 4 to be 3` | RED: `expected 4 to be 3` |

K1 green at base, why (probe): at N 20 000 the abort lands in depth 4 and the partial is e2a6 / 70, equal to `search(kiwipete, 3)` = e2a6 / 70. Under A3 it is **reported and not counted**. At the tip (N 6 000, abort at 6 746) the partial is e2a6 / 70 against `search(kiwipete, 2)` = e2a6 / 109, so it reds. K1 probe sweep, row 2 outcome under the plant: red for N 4 000–8 500 (abort 4 698–8 794); green for N 2 600–3 500 (abort 2 650 / 3 674, partial equal to depth 2's 109) and at 20 000.

Not timing: no wall or CPU figure is read or claimed here.
