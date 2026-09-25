---
id: 20260925T200000Z-software-engineer-observation-abc121-a1-a6-readings-depth-7-7-node-drift-45cp-mate-floor-0-4acb5c4b
kind: observation
by: software-engineer
at: 2026-09-25T20:00:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - NFR-005
  - NFR-009
  - .grugops/context/ticket-to-pr-ABC-121/probe/oracle-build.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/depth.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/depth-node.jsonl
  - .grugops/context/ticket-to-pr-ABC-121/probe/door-faithful.ts
  - .grugops/context/ticket-to-pr-ABC-121/probe/g6.ts
supersedes:
---

# ABC-121 `A1`–`A6` as measured on the build (`9823c27`): all six MET; depth 7 / 7 on plain node against 6 / 6

Hand-authored, no `seal`. Apple M3, node v24.12.0. Every figure below came from the build's own
`src/` (or the suite's own rows), not the review's probe. Where the probe gave a figure, this build
reproduces it exactly.

| criterion | bar | reading | verdict |
|---|---|---|---|
| `A1` drift, `search()` vs `searchWithoutReductions`, fixed d5, 190 corpus | ≥ 95% within 25 cp, max ≤ 75 | **99.47%** of 187, **max 45 cp** (position-6/f3h4 565 → 610); d4 for reference 98.40% / 50 | MET |
| `A1` drift, `chooseMove` vs `chooseMoveWithoutReductions`, each deepened to d5 | same | **99.47%** of 187, **max 45 cp** (same position) | MET |
| `A1` mate floor, mate corpus (287): mate at d4 on the reference → `search()` at d5 same sign, no longer | 0 violations | **0 of 180**; d5 → d6 for reference **0 of 205**; "no longer" checked for BOTH signs | MET |
| `A1` 190-corpus mate-status flips | REPORT, not a bar | **0** (fixed d5 and deepened d5) | reported |
| `A1` five pinned mate rows + depth-10 rook ending, shipped path | literals unchanged | all green (`SEARCH_DEEP`); rook ending −29 992 on shipped `chooseMove` (now depth 11 at 160 ticks) | MET |
| `A2` depth in 3 s, plain node, same process, 3 rounds | ≥ pre-`C1` | **7 / 7** vs **6 / 6**, both for the pre-`ABC-121` door and the base build at `15c6eb0`, every round; load 4.2–5.7 | MET |
| `A2` vitest (reported) | — | **5 / 5** vs **4 / 5**, every round; load 3.6–4.9 | reported |
| `A2` clock-free companion, cumulative nodes to d7 | report | kiwipete **532 363** vs 1 922 235; position-6 **467 461** vs 1 923 320 (the probe's figures, to the node) | reported |
| `A3` predicate table + source assertion | as written | 9 rows + fixture bite + 2 source rows, green | MET |
| `A4` null-window fail-high re-searched, answer = unreduced | as written | position-3 after 1. Rb1, d4: at least one null-window reduced fail-high re-searched one ply deeper; 95 / h5e5 = `searchWithoutReductions`, in `search()` AND `chooseMove` | MET |
| `A5` nodes fall on kiwipete / position-6, d4 | lower | **17 911 / 22 323 = 80.2%**, **20 402 / 28 829 = 70.8%** (ticket's figures) | MET |
| `A6` bounded memory (`NFR-009`) | no growth | `transposition.test.ts` `A7`, `ENGINE_DEEP`: kiwipete 1 s (d6) vs 3 s (d7) heapUsed 7.96 → 7.96 MiB, arrayBuffers 4.01 → 4.01 MiB | MET |

## The depth table (`A2`, `NFR-005`) — binding runner plain node

| round | kiwipete: build / door / base | position-6: build / door / base | load1 |
|---|---|---|---|
| 1 | **7** (777 980 n) / 6 (901 898) / 6 (907 018) | **7** (818 601) / 6 (859 422) / 6 (858 398) | 4.9–5.7 |
| 2 | **7** (786 172) / 6 (920 330) / 6 (916 234) | **7** (822 697) / 6 (859 422) / 6 (858 398) | 5.0–5.6 |
| 3 | **7** (806 652) / 6 (933 642) / 6 (921 354) | **7** (814 505) / 6 (858 398) / 6 (857 374) | 4.2–4.8 |

- **The node RATE fell**, which the ruling assumed it would not (`…0f93c6b1` item 3). Kiwipete
  ran at 259–269 k nodes/s against 300–311 k; position-6 at 271–274 k against 285–286 k. That is
  about 13% and 5%, the price of the predicate's `isInCheck` and make/unmake on late quiet moves.
- **Margin at depth 7, this build's own 3 s capacity:** kiwipete 777 980–806 652 / 532 363 =
  **1.46x–1.52x**, position-6 814 505–822 697 / 467 461 = **1.74x–1.76x**. On the ticket's
  formula (QE `ABC-081`'s capacity) it reads 1.68x / 1.83x. The build's own figure is the honest
  one. It is thinner on kiwipete than the ruling forecast, and still clear.
- `NFR-005` is Security/NFR's to rule. This is the reading, not the verdict.

## Identity and door faithfulness

- **PVS identity link (new, decision 8):** `searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`,
  **0 / 190** at depth 4 (`SEARCH_DEEP`, 21 s plain node).
- **Every pre-`ABC-121` door is the base build, node for node:** 292 search cells (seven doors,
  d1–d4, twelve positions) and 144 engine cells (`chooseMoveWithoutPvsOrReductions` vs the base
  `chooseMove`, 1–12 ticks), **0 mismatches** (`probe/door-faithful.ts`).
- Every re-pointed merged row reads its merged figure exactly. Examples: `ABC-081` `A2`
  15.95% / 15.38%, `A3` 63.94% / 49.90%; `ABC-080` `A4` pin 2 467; `A3` d4 2.25% / 1.73%.
