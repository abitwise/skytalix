---
id: 20260924T195300Z-architect-design-observation-oracle-options-probe-table-under-vitest-5c2f8a91
kind: observation
by: architect-design
at: 2026-09-24T19:53:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.ts
  - .grugops/context/ruling-abc079-oracle/probe/
supersedes:
---

# The four oracle options, timed per case UNDER THE RUNNER, with node counts and pass/fail against the existing timeouts

Environment: Apple M3, Node v24.12.0, vitest 3.2.7 (`pool: "threads"`, as `vitest.config.ts` sets
it), branch `grugops/ruling-abc079-oracle` off `fa80923` (the code is `700730b`). Load was 3.4–10
throughout, with sibling hops live. Every case ran once, in a fresh vitest or node process. Node
counts and scores are deterministic; the seconds are not.

## Fidelity first: the probe equals `src/`, and the harness equals the real file

- **To the node.** `probe-oracle.ts fidelity` compares the copy against `search`,
  `searchWithoutQuiescence` and `searchWithoutPruning` at depths 1–2 on all six roots, and also
  checks cap 0 against quiescence off on both sides. Every comparison covers nodes, score and
  move: **0 mismatches.**
- **On time.** Under vitest, `src/`'s own `search` + `searchWithoutPruning` on `position-4` at
  depth 3 took **22 019 ms**. The copy took **22 150 ms**, and the real `src/search.test.ts`
  case (`-t`) took **22 925 ms**.
- **Why node times are never used for a verdict.** Plain node runs the same pair in **4 506 ms**,
  and `position-5` d3 in 9.2 s against 44.3 s under vitest. That is a **~5x runner factor**;
  every pass/fail below was taken under vitest.

## The table: per case, the wall time under vitest, then its timeout and the verdict

Retired cells are marked. "Pair" is `search`-side plus `unpruned`-side, run on one position
object as `searchPair` does.

| option | case | pruned / unpruned nodes | wall (vitest) | timeout | verdict |
|---|---|---:|---:|---:|---|
| **as built** (quiescence on, cap 8) | `A1` kiwipete d3 | 405 945 / **62 706 867** | 1 016 367 ms (Engineer, load 10→4) | 30 s | **FAIL** |
| | `A1` position-5 d3 | 42 542 / 2 462 223 | 44 253 ms (real file, `-t`, load 5.3) | 30 s | **FAIL** |
| | `A1` position-6 d3 | 120 239 / **11 261 137** | 195 169 ms (Engineer) | 30 s | **FAIL** |
| | `A1` position-4 d3 | 14 727 / 2 103 430 | 22 925 ms (real file, load 6.5) | 30 s | pass, **76%** |
| | `A7` roots d3, pruned + unpruned | — | 1 280 721 ms (Engineer) | 120 s | **FAIL** |
| | `A2` kiwipete d3 | ratio **0.65%** | memoised from `A1` | 30 s | pass (it waits on `A1`) |
| **(a) bare leaf both sides** | `A1` kiwipete d3 | 9 016 / **99 950** | **3 435 ms** | 30 s | **pass, 11%** |
| | `A1` position-5 d3 | 11 595 / 63 910 | **1 857 ms** | 30 s | pass, 6% |
| | `A1` position-6 d3 | 14 565 / 92 016 | **2 983 ms** | 30 s | pass, 10% |
| | `A1` position-4 d3 | 813 / 9 738 | **380 ms** | 30 s | pass, 1% |
| | `A1` startpos d3 / position-3 d3 | 1 098 / 9 323 · 530 / 3 018 | 182 ms · 53 ms | 30 s | pass |
| | `A7` roots: `search` d3 + bare unpruned d3 | — | **16 072 ms** (kiwipete 8 396) | 120 s | pass, 13% |
| | `A2` kiwipete d3 | ratio **9.02%** (< 40%) | memoised | 30 s | pass |
| **(b) depth −1** (quiescence on, d2) | `A1` kiwipete d2 | 10 249 / 844 078 | **10 979 ms** | 30 s | pass, 37% |
| | `A1` position-5 d2 | 5 523 / 60 518 | 1 158 ms | 30 s | pass |
| | `A1` position-6 d2 | 9 804 / 212 095 | 2 996 ms | 30 s | pass |
| | `A1` position-4 d2 | 2 298 / 27 151 | 326 ms | 30 s | pass |
| | `A7` roots: `search` d3 + unpruned d2 | — | **23 178 ms** (kiwipete 16 089) | 120 s | pass, 19% |
| | `A2` kiwipete d2 | ratio 1.21% | memoised | 30 s | pass — but NOT the merged criterion's depth |
| **(c) quiescence capped, cap 1** | `A1` kiwipete d3 | 10 467 / 857 113 | 8 124 ms | 30 s | pass, 27% |
| | `A1` position-5 d3 | 14 186 / 360 063 | 4 167 ms | 30 s | pass |
| | `A1` position-6 d3 | 44 697 / 532 404 | 7 416 ms | 30 s | pass |
| | `A1` position-4 d3 | 3 050 / 141 131 | 1 056 ms | 30 s | pass |
| | `A7` roots | — | 27 698 ms | 120 s | pass |
| **(c) cap 2** | `A1` kiwipete d3 | 17 684 / 2 208 498 | **31 588 ms** | 30 s | **FAIL** |
| | `A1` position-6 d3 | 24 878 / 1 032 241 | 16 979 ms | 30 s | pass, 57% |
| | `A1` position-5 d3 / position-4 d3 | 13 258 / 644 533 · 5 490 / 224 120 | 13 252 · 2 552 ms | 30 s | pass |
| | `A7` roots | — | 72 310 ms | 120 s | pass, 60% |
| **(d) raise the timeout** | the four failing cases as built | as built | as built | ≥ 1 016 s / ≥ 1 281 s | — a ~45-minute lane |

**Cells that also matter to the lane, and that NO option changes:**
- **`A4`'s deep case** (shipped `search` over the corpora at depths 1–2) read **60 386 ms against
  120 s** from the real file at load 4.2 (50%). The Engineer read 82.7 s at load 10→4.
- **Kiwipete's quiescence-on d2 pair** reads 10 979 ms, and the chosen ruling KEEPS it.

## What the numbers say

- **The cost sits in the unpruned tree's quiescence, not its main tree.** On kiwipete d3, the
  bare-leaf unpruned tree is 99 950 nodes and the quiescence-on unpruned tree is 62 706 867, a
  **627x** multiplier. The pruned side's multiplier is 45x, which is `A5`'s own figure. The
  oracle pays 14x the shipped search's quiescence cost, because `searchWithoutPruning` never
  raises `alpha`, so every leaf opens `quiesce` at (−∞, +∞).
- **Scores agree in every cell of every option** (`A1` EQUAL throughout). No option found a
  window bug; the choice between them is about what each leaves unasserted, not what they found.
- **Ordering does not shrink the gap.** All cells above are MVV-LVA ordered (`700730b`).
- **Option (a)'s kiwipete d3 reads exactly `ABC-077`'s recorded 99 950 unpruned nodes** (the
  file header's figure) and 9.02% against its recorded 9.0%. The bare-leaf pair IS `ABC-077`'s
  merged measurement, reproduced to the node.
