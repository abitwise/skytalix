---
id: 20261010T084149Z-architect-design-observation-r1-r3-measured-mobility-forms-root-window-price-blunder-rules-748b4f7b
kind: observation
by: architect-design
at: 2026-10-10T08:41:49Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-087
  - ADR-0031
  - ADR-0032
  - ADR-0003
  - ADR-0026
  - ADR-0027
  - AR-NFR005-082
  - NFR-004
  - NFR-005
  - src/evaluate.ts
  - src/engine.ts
  - src/search.ts
  - .grugops/context/ruling-abc083-abc087/probe/RUN.txt
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
  - .grugops/context/secnfr-ABC-082/notes/20261009T173202Z-security-nfr-decision-abc082-pass-with-risks-nfr005-depth7-ar-drafted-for-owner-no-security-finding-c04abe30.md
supersedes:
---

# What was measured for R1 and R3: three mobility forms, the price of a widened root, and what each blunder rule plays

This note is hand-authored and unsealed. It is an observation, not a stamp. All runs are out of tree and read
only the worktree's `src/` at `a5c185b`. No `src/` file in any checkout was modified. Apple M3, Darwin 25.5.0,
Node v26.11.0, plain node, 2026-10-10 08:32–08:45Z. **Load was high**: load1 7.5–14.2, and the 5-minute average
was 50 at the start, because two builds were running. So every timing row is upper-ish. Every node count,
ratio and score row is deterministic and does not depend on load. Commands and raw output are in `../probe/`
(`RUN.txt`).

## R1 (`ABC-083`): the complete evaluation's cost per call

The terms are PROTOTYPES (`probe/r1-cost.mjs`), the cheapest honest shape for each, not the build. The method
is `ABC-076`'s: best of 5 × 1,000,000 calls per root (100,000 for the legal form) after a warm-up. Six perft
roots, one variant per fresh process, two rounds with the order reversed.

| variant | round 1 mean | round 2 mean | worst cell |
|---|---:|---:|---:|
| base (merged) | 372.5 | 389.9 | 478.4 startpos |
| + king safety | 493.5 | 472.8 | 584.1 startpos |
| + king safety + attack-map | 901.8 | 815.4 | 1,009.9 startpos |
| + king safety + pseudo-legal | 2,188.3 | 1,883.8 | 3,132.1 kiwipete |
| + king safety + legal | 14,144.9 | 12,166.1 | 18,697.8 kiwipete |

- Base reads 2–9% above Security/NFR's 357.8–366.1 ns at load 4 (`…c04abe30`). The table is upper-ish.
- The legal form reads above `ADR-0003`'s 2 × 2.1–5.4 µs. Why is `UNKNOWN - verify`: the high load, the
  flipped second count, or both. It misses by an order of magnitude either way.
- `evaluate` is called **0.887–0.938 times per search node** (`search()` depth 5 and 6 on `kiwipete` and
  `position-6`; `probe/r3-evalcalls.out.jsonl`). It is counted on the patched copy.
- **The per-node arithmetic, `UNKNOWN - verify` on the build:**
  - Security/NFR read 640k–686k nodes per 3 s on `kiwipete`, which is 4.37–4.69 µs per node.
  - Attack-map plus king safety adds 425–529 ns per call. At 0.89 calls per node that is about 378–471 ns
    per node, **+8–11% node time**, from cost alone.
  - King safety alone adds 83–121 ns per call, +1.6–2.5%.
  - The depth-7 margin on `kiwipete` is 1.05–1.12x.

## R3 (`ABC-087`)

The copy is a `git archive` of the worktree's `src/`, with `probe/r3-copy.patch` applied. The patch adds a
probe-only `fullRoot` switch in `searchRoot`, a `SCORED` list, and an `evaluate` counter. **The copy's
`search()` matches the worktree's node for node and score for score on 12 of 12 cells** (six roots, depths 3
and 4; `probe/r3-identity.out.jsonl`).

- **The price of construction (b)**: every root move on the full window, against the shipped `search()`. The
  table is the node ratio (`probe/r3-cost.out.jsonl`):

  | position | d3 | d4 | d5 |
  |---|---:|---:|---:|
  | startpos | 5.948 | 2.486 | 7.685 |
  | kiwipete | 11.166 | 5.730 | 13.303 |
  | position-3 | 8.704 | 6.950 | 8.124 |
  | position-4 | 1.490 | 1.624 | 1.869 |
  | position-5 | 5.614 | 3.673 | 6.873 |
  | position-6 | 12.383 | 5.887 | 6.784 |

  The best root score is the same in all 18 cells. The page's "+3.3–5.2%" is `ADR-0027`'s `best - 1` window,
  which only makes ties exact.
- **What each blunder rule plays**, on exact depth-3 per-move scores. The corpora are `buildCorpus()` (184) and
  `PUZZLES` (40). See `probe/r3-scores-d3.out.jsonl` and `probe/r3-aggregate-d3.out.jsonl`:

  | | corpus184 | puzzles40 |
  |---|---:|---:|
  | rank 2 ties the best | 30 | 15 |
  | no strict-second candidate | 1 | 0 |
  | strict second-best: median loss | 55 cp | 100 cp |
  | strict second-best: share losing ≥ 300 cp | 0.109 | 0.425 |
  | uniform between best and worst: mean share ≥ 300 cp | 0.604 | 0.550 |
  | uniform over non-worst (best included): mean share ≥ 300 cp | 0.582 | 0.503 |

- **Construction (a) on the shipped `chooseMove`** (`probe/r3-split-*.out.jsonl`):
  - virtual clock at step 5, which is about 606k nodes per 3,000 virtual ms;
  - one shared deadline, child `i` at `start + B(i+1)/N`;
  - startpos / kiwipete / position-6.

  | budget | main depth | child depth min / median / max | elapsed, main / (a) |
  |---|---|---|---|
  | 3,000 | 8 / 6 / 7 | 5/5/6, 1/3/3, 3/3/4 | 3,005 / 3,015 |
  | 1,000 | 8 / 5 / 6 | 4/4/4, 1/1/2, 1/1/2 | 1,005 / 1,015 |

  - The children's total nodes are lower than the main search's (kiwipete: 357,758 vs 608,850 at 3,000).
  - Part of that is the virtual clock. Each child's fixed readings (entry, each iteration boundary, return)
    cost one step each, and the wall clock does not charge for them.
