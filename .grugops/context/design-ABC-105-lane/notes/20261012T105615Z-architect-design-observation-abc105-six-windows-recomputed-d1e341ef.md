---
id: 20261012T105615Z-architect-design-observation-abc105-six-windows-recomputed-d1e341ef
kind: observation
by: architect-design
task: design-ABC-105-lane
at: 2026-10-12T10:56:15Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - QE-105-ab
  - QE-105-x
  - .grugops/context/qe-ABC-105/probe/n8-105.tsv
  - .grugops/context/qe3-ABC-105-lane/probe/
  - .grugops/context/qe4-ABC-105/probe/
  - .grugops/context/design-ABC-105-lane/probe/recompute.out.txt
supersedes:
---

# The six `ABC-105` `N8-LANE` windows, recomputed from the raw TSVs: QE's graded figures hold to the last digit

This note is hand-authored and unsealed (`AGENTS.md`). This hop took **no timing reading**. It recomputed every
figure with its own script, `probe/recompute.py`, and did not run QE's readouts. The output is in
`probe/recompute.out.txt`.

## How

- **Integer centiseconds throughout.** Medians are exact fractions, so no float rounding enters a 1.5 %
  comparison.
- **`cpu` = `user` + `sys` on every row** of all six TSVs (27 rows each).
- **The discard rules are QE's:** status, counts, foreign runner before or after, thermal, power, and the 5 s
  sampler within [start − 5 s, end + 5 s].
- **The order statistic:** k is the largest index with binomial coverage ≥ 92 %, which is k = 2 at n = 8.
- **The sign test is computed two ways:** QE's convention (positives against the rest) and the conventional
  one (zeros dropped).

## The figures (CPU unless stated)

| window | code | n | B median | twin median (% of B) | signs + / − / 0 | p (QE conv. / zeros dropped) | R | H − B median, x(2)..x(7) |
|---|---|---|---|---|---|---|---|---|
| `qe-ABC-105` | `60415a8a` | 8 | 0.575 | +0.000 (0.000 %) | 3 / 3 / 2 | 0.727 / 1.000 | 0.010 | +0.475, +0.460..+0.520 |
| QE3 w1 | `db1cfb6c` | 8 | 0.575 | +0.010 (1.739 %) | 7 / 1 / 0 | 0.070 / 0.070 | 0.010 | +0.670, +0.660..+0.700 |
| QE3 w2 | `db1cfb6c` | 0 | — | void | — | — | — | — |
| QE3 w3 | `db1cfb6c` | 8 | 0.570 | +0.000 (0.000 %) | 2 / 2 / 4 | 0.289 / 1.000 | 0.020 | +0.690, +0.670..+0.700 |
| QE4 w1 | `8fd0c233` | 2 | — | void (rounds 3–8 discarded) | — | — | — | — |
| QE4 w2 | `8fd0c233` | 8 | 0.570 | +0.010 (1.754 %) | 5 / 2 / 1 | 0.727 / 0.453 | 0.030 | +0.370, +0.370..+0.400 |

- **The 1.5 % limit is 8.63 ms at a 0.575 s base and 8.55 ms at 0.570 s.** Both are under the 10 ms tick.
- **Wall twins:**

  | window | median | R | admissible at 1.5 % |
  |---|---|---|---|
  | `qe-ABC-105` | −0.005 s (−1.163 %) | 0.010 s | yes |
  | QE3 w1 | +0.010 s (2.381 %) | 0.010 s | no |
  | QE3 w3 | +0.000 s | 0.020 s | yes |
  | QE4 w2 | +0.010 s (2.381 %) | 0.020 s | no |

- **The two sign conventions agree on admissibility** in every window here.
- **They differ in general.** With 6 positive and 2 zero deltas, QE's convention gives p 0.289 and the
  zeros-dropped test gives p 0.031.
- **Load1 over the scored runs:**
  - `qe-ABC-105`: 5.10–5.31;
  - QE3 w1: 2.44–2.64;
  - QE3 w3: 3.13–3.28;
  - QE4 w2: 3.30–3.91.
  - QE's notes quote w3 as 3.08–3.28. That range includes round 0, and it is not a discrepancy.

## Agreement with QE

- **Every figure QE graded or listed matches:** the medians, signs, R, the treatment intervals, the 1.74 % and
  1.75 %, and the void counts.
- **QE3 w1's wall treatment median** (+0.545 s) is not quoted by QE. It is recorded here and grades nothing.
