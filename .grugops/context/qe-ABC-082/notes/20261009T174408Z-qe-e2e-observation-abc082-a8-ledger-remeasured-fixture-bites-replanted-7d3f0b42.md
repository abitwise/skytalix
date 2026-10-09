---
id: 20261009T174408Z-qe-e2e-observation-abc082-a8-ledger-remeasured-fixture-bites-replanted-7d3f0b42
kind: observation
by: qe-e2e
at: 2026-10-09T17:44:08Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-078
  - ABC-121
  - ADR-0026
  - ADR-0028
  - src/search.ordering.test.ts
  - src/transposition.test.ts
  - src/quiescence.test.ts
  - src/search.pvs-lmr.test.ts
  - src/engine.test.ts
  - .grugops/context/qe-ABC-082/probe/pins.ts
  - .grugops/context/qe-ABC-082/probe/pair.ts
  - .grugops/context/qe-ABC-082/probe/mutants-f.mjs
  - 20261009T163130Z-software-engineer-observation-abc082-a8-repin-ledger-and-fixture-bites-b92fa204
  - 20261009T164755Z-architect-design-decision-ruling1-row21-mislabelled-replace-the-pair-level-unchanged-f0115510
  - 20261009T164755Z-architect-design-decision-ruling3-row8-keep-the-refound-search-fixture-4fdb96bc
supersedes:
---

# `A8` ledger: 8 pin rows re-measured by QE's own script on base and branch, every value matches. 5 named F-class mutants re-planted, all red. Row 21's new pair and row 8's (b) fixture bite; the engine-side discard mutant the ruling left unplanted is red too

Hand-authored, no `seal`. Probes are QE's, written from the test rows' call shapes, not from the
Engineer's `rows.ts` / `mutants.mjs`. Trees: `git archive` copies of base `5ebe1d8` and tip
`873911d` (and `720b92d` where the tip commit matters). Apple M3, plain node v26.11.0, load1
3.0–5.1 (node-deterministic readings). Run 2026-10-09T17:05–17:11Z.

## Exact pins (`node probe/pins.ts <tree>`, `DEEP=1`; raw `pins-5ebe1d8.jsonl`, `pins-873911d.jsonl`)

| ledger # | row | base (QE) | branch (QE) | branch pin in tree | match |
|---|---|---|---|---|---|
| 1 | `search.ordering` `A4` position-6 d2 none / MVV-LVA / full | 9 804 / 3 391 / 2 467 | **9 319 / 3 286 / 2 429** | 9 319 / 3 286 / 2 429 | yes |
| 2 | `search.ordering` `G4` promotion-capture d3 | 261 | 261 | 261 | yes |
| 3 | `search.ordering` `G1` position-3, 3 ticks | d3, 358 | **d3, 360** | d3, 360 | yes |
| 4 | `transposition` `A1` position-3 d4 on / off (score) | 1 123 / 1 299 (90) | **1 319 / 1 474 (80)** | 1 319 / 1 474 | yes |
| 5 | `transposition` `A5` perpetual: score, move, pre-121 nodes, d3 | 0, f7f8, 7 241, −470 | 0, f7f8, **7 251**, −470 | 0, f7f8, 7 251, −470 | yes |
| 6 | `quiescence` `A4` bare leaf position-6 d2 / d3 | 136 g5f6 / 2 273 c3d5 | 136 g5f6 / 2 273 c3d5 | unchanged | yes |
| 8 | `search.pvs-lmr` `A4` `search()` row on `A4_SEARCH_FEN` | −15 b1b4 | **10 b1c1** (= `searchWithoutReductions`) | `[10, "b1c1"]` | yes |
| 12 | `engine` `A4` kp-vs-k at 5 / 10 / 40 ticks | 5 / 7 / 10 | **4 / 6 / 9** | ≥ 6 at 10 | yes, **at the bound** |

Row 7 (the oracle) is re-run in the lanes note `…e81c6a95`. Every pin above that moved was set to
the value QE's script reads; none disagrees with the Engineer's ledger.

## F-class named mutants re-planted (`node probe/mutants-f.mjs <tip> <scratch>`; raw `mutants-f.part1.jsonl`)

QE's own exact-string edits in a scratch copy of `873911d`; the row's own file, default lane.

| row | mutant | reads | red? |
|---|---|---|---|
| 3 | `N3` engine records a killer on every move | `G1` 357 vs 360 | **red** |
| 10 | `M11` engine root unordered | tie row e7f7 vs f8f7; `G1` 635 | **red** |
| 11 | `M1` in-recursion clock check deleted | 67 176 > 10 240 | **red** |
| 12 | `ceiling4` `if (iteration > 4) break` | 4 not > 4 | **red** |
| 13 | `repetitionBlind` engine ignores the path | −380 vs 0 | **red** |

Baseline (no edit) green: `search.ordering.test.ts` 24 / 24 default.

## Row 21: the re-found `HANGING_CORPUS` pair (`node probe/pair.ts <tree>`; raw `pair-*.jsonl`)

| pair | tree | in check | `search` d1 / d3 | bare d1 / d3 | losing d3 | best other d3 | margin |
|---|---|---|---|---|---:|---:|---:|
| new (+g7 / +g2) | base | no | e1f1 / e1f1 | **b1b2** / e1f1 | −430 | −60 | **370** |
| new (+g7 / +g2) | branch | no | e1f1 / e1f1 | **b1b2** / e1f1 | −425 | −145 | **280** |
| old | base | no | e1f1 / e1f1 | b1b2 / e1f1 | 0 | 50 | 50 |
| old | branch | no | e1f1 / **b1b2** | b1b2 / e1f1 | 0 | −40 | **−40** |

(Mirror rows read identically.) The Architect's 370 / 280 and 50 / −40 reproduce exactly. The new
pair is legal, not in check, declined by quiescence at d1 and d3, and **played by the bare leaf at
d1**, so it adds to the mutant's count. Mutants (`mutants-f.part2.jsonl`), `SEARCH_DEEP=1`:

- A1's with-quiescence arms swapped to the bare leaf (the Architect's): **red** at depth 1.
- QE's production twin, `leafScore` never runs quiescence (`src/search.ts`): **red** at depth 1.
- The depth-3 row does not red under either, as its own comment says (both arms see the
  recapture at depth 3). Pre-existing, unchanged by the swap.

## Row 8: `A4_SEARCH_FEN` (b) and `A4_FEN` on the `chooseMove` row (`mutants-f.part2.jsonl`)

| mutant | `search()` row | `chooseMove` row |
|---|---|---|
| `noLmrResearch` (search.ts + engine.ts) | **red** (re-search count 0) | **red** (count 0) |
| discard the re-search, `search.ts` only (the Architect's) | **red**: −20 vs 10 | green |
| discard the re-search, **`engine.ts` only** (the residual ruling 3 named and did not plant) | green | **red**: 50 vs 95 |
| discard, `search.ts`, fixture reverted to (a) `A4_FEN [95, h5e5]` | **survives** | green |

So ruling 3 is confirmed independently: (b) is the only fixture that reds a `search()` that
re-searches and ignores the answer, and the `chooseMove` row does red the engine twin. The
residual in `…4fdb96bc` / `…156f09f2` is closed by measurement.
