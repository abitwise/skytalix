---
id: 20260919T080200Z-architect-design-observation-probe-table-variants-d1-d4-kiwipete-position6-4b8d1a63
kind: observation
by: architect-design
at: 2026-09-19T08:02:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-080
  - ADR-0024
  - ADR-0003
  - NFR-005
  - src/quiescence.ts
  - src/search.ts
  - .grugops/context/ruling-abc079-multiplier/probe079.ts
supersedes:
---

# The probe: quiescence variants → same-depth node ratio, kiwipete and position-6, depths 1–4

Script: `../probe079.ts` (out-of-tree; imports `src/` by path, changes nothing; `SRC=<abs>/src/ node
probe079.ts <maxDepth> <variants> [minDepth]`). It carries a copy of `src/search.ts`'s negamax/root
with the leaf quiescence pluggable, and the variants below. Ratio = nodes with the variant /
`searchWithoutQuiescence` nodes at the same depth, `SearchResult.nodes` convention (one per position
entered, q-nodes included). Apple M3, Node v24.12.0, **load 3.0–6.5 throughout with two sibling hops
live** (`ABC-120` on `src/turn-loop.ts`, Security/NFR on `ABC-034`): node counts are deterministic
and load-independent; the ms column is not comparable to anything.

Variants: `bare` = no quiescence; `shipped` = `src/quiescence.ts` as built at `e2c3af5`;
`ref` = an independent textbook reimplementation (stand-pat lower bound, alpha raised, fail-soft,
captures filtered from `legalMoves`, cap 8); `ref-nocap` = ref with cap 64; `mvv` = ref + MVV-LVA
sort of the capture list; `mvv-nocap`; `mvv+delta` = + delta pruning (skip a capture when standPat
+ victim + 200 < alpha; stand pat when standPat + 1100 < alpha); `mvv+delta+badcap` = + SEE-lite
(skip a capture by a piece worth more than its victim onto a square the opponent attacks — LOSSY,
changes scores); `delta-only` = delta pruning without ordering.

## Harness check

`shipped` through the probe's copied negamax == `search()` from `src/search.ts` in nodes AND score
at every cell (`(=src search)` in the raw output). `ref` == `shipped` to the node, per-ply histogram
included, at d1–d3 on both positions. So the build is what a from-scratch stand-pat quiescence is.

## Ratios (score / move identical to `shipped` unless marked)

| position | d | bare nodes | shipped | ref | ref-nocap | mvv | mvv-nocap | mvv+delta | mvv+delta+badcap | delta-only |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| kiwipete | 1 | 49 | 702.06x | 702.06x | 13 729.5x (score 70≠145) | 120.16x | 193.59x (score 70≠145) | 86.29x | 24.14x (score 175) | 497.98x |
| kiwipete | 2 | 313 | 877.65x | 877.65x | 20 870.9x | 33.17x | 39.65x | 22.11x | 6.91x (score 175≠70) | 740.81x |
| kiwipete | 3 | 9 016 | 1 482.70x | 1 482.70x | not run | 45.02x | 75.69x | 30.74x | 11.99x (score 55≠50) | 1 083.47x |
| kiwipete | 4 | 38 023 | 1 540.33x (58 567 981 nodes — REPRODUCED here, `=src search`; 173 s loaded) | not run | not run | 26.35x | not run | 19.28x | 8.27x (score 55≠50) | not run |
| position-6 | 1 | 47 | 61.68x | 61.68x | 789.26x | 6.32x | 6.57x | 4.34x | 1.17x | 50.66x |
| position-6 | 2 | 562 | 377.20x | 377.20x | 12 553.9x | 17.44x | 24.88x | 13.20x | 1.38x (score 25≠30) | 304.06x |
| position-6 | 3 | 14 565 | 119.52x | 119.52x | not run | 8.26x | 10.21x | 6.04x | 1.22x | 97.57x |
| position-6 | 4 | 222 697 | 166.7x (Engineer) | not run | not run | 7.47x | not run | 5.84x | 1.03x | not run |

Absolute ordered counts the re-hop will fixture against: kiwipete `mvv` 5 888 / 10 382 / 405 922 /
1 001 903 nodes at d1–d4; position-6 `mvv` 297 / 9 804 / 120 239 / 1 663 775.

## Per-capture-ply histograms (q-nodes at plies 1..8) — why the tree explodes

```
kiwipete d1  shipped    75 / 466 / 491 / 1924 / 2007 / 6485 / 8053 / 14851   (43% at the cap)
kiwipete d1  mvv        60 / 383 / 279 / 1207 /  544 / 1373 /  883 /  1110
kiwipete d3  shipped    11327 / 44146 / 90110 / 370752 / 644937 / 2181060 / 3406493 / 6613547
kiwipete d3  mvv        6016 / 21362 / 17871 / 52501 / 37635 / 92722 / 73517 / 98646  (25% at the cap)
position-6 d3 shipped   10224 / 24827 / 47261 / 90688 / 179332 / 284215 / 516396 / 577711
position-6 d3 mvv       7745 / 16564 / 19204 / 17453 / 18658 / 11016 / 12682 / 6788   (6% at the cap)
```

Unordered, the count per ply rises ~2x per ply; a real capture sequence should thin out as pieces
leave the board. The mechanism: a losing capture is refuted only when its child reaches the
recapture, and every capture generated before the recapture is searched to its own subtree first.
Ordered, the ply-8 mass stops dominating and lifting the cap is a 1.2–1.7x change, not a 20x one.

## Two things the probe did NOT find

- No sign-convention, window or alpha-raise defect (`ref` == `shipped`).
- No cost from the capture generator in the COUNT: `legalMoves` + filter pays legality per q-node
  in TIME (≈2.4 µs per q-node here, loaded), which is `ADR-0003` (c1) territory, not a node issue.
