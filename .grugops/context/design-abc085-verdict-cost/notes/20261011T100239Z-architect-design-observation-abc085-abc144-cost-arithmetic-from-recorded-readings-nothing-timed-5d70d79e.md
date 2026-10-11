---
id: 20261011T100239Z-architect-design-observation-abc085-abc144-cost-arithmetic-from-recorded-readings-nothing-timed-5d70d79e
kind: observation
by: architect-design
at: 2026-10-11T10:02:39Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-144
  - ADR-0038
  - ADR-0040
  - .grugops/context/ticket-to-pr-ABC-085/probe/RUN.txt
  - .grugops/context/ticket-to-pr-ABC-085/probe/short-run-2-d5b0f0e2.out.txt
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.tsv.txt
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.thermal.tsv.txt
supersedes:
---

# The arithmetic behind both rulings. Every input is a recorded reading, and nothing was timed at this hop

This note is hand-authored and unsealed. A QE hop and an Engineer hop were running, so this hop took no timing
or CPU measurement. It ran arithmetic over committed files only.

## 1. The runner ratio (`ABC-085`, from `RUN.txt` item 4)

| runner | ms for 145 765 nodes | ms per 1 024 nodes |
|---|---|---|
| plain `node` | 782 / 791 | 5.49 / 5.56 |
| vitest `threads` | 3 473 / 3 379 | 24.40 / 23.74 |
| vitest `forks` | 3 344 / 3 490 | 23.49 / 24.52 |

- The ratio is **4.23–4.46x, with a mean of 4.35x.**
- Plain `node`'s 5.5 ms is inside `ADR-0038`'s 3.5–6.5 ms cost band and inside its 2–8 ms Rollback band.

## 2. The verdict's cost, step 4, by two routes that agree

- **Route 1, `ADR-0038`'s formula** (plain-`node` ms per reading): ~10 h (7–13). Times 4.35 inside vitest,
  that is ~43.5 h (band 7 × 4.23 to 13 × 4.46 = 30–58 h).
- **Route 2, the Engineer's:** vitest step-120 per-game wall (`short-run-2-d5b0f0e2.out.txt`, pair `wallS`
  ÷ games) × 30 × the verdict game count. Divide by 4.35 for `node`.

| pair | step-120 wall, vitest | games at step 4 | vitest, h | plain `node`, h |
|---|---|---:|---:|---:|
| 3v4 | 234.0 s / 4 | 20 | 9.75 | 2.24 |
| 4v5 | 246.5 s / 4 | 20 | 10.27 | 2.36 |
| 2v3 | 100.3 s / 4 | 20 | 4.18 | 0.96 |
| 1v2 | 14.1 s / 4 | 20 | 0.59 | 0.14 |
| 1v5 (`A1`) | 224.8 s / 10 | 100 | 18.73 | 4.31 |
| **total** | | | **43.5** | **10.0** |

- **Limits of this estimate.** Plies at step 4 are `UNKNOWN - verify`. ×30 assumes cost ∝ readings, which is
  rough for level 1, because at step 120 it sits on the depth-1 floor.
- **Option (b)'s wall floor is the 1v5 `it`:** ~18.7 h inside vitest and ~4.3 h under `node`, because one
  `it` cannot be split by `-t`.
- **Equivalence check, projection:** the short mode is 848.3 s in vitest (recorded). Under `node` it projects
  to 848.3 ÷ 4.35 ≈ 195 s. That is a projection, not a reading.

## 3. Window A, re-checked from the raw `.tsv` (`ABC-144`)

- **All 8 scored rounds:** the paired CPU medians reproduce `…a898a14a` exactly.

  | arm | paired CPU median |
  |---|---|
  | T | +0.72 % |
  | K4 | −10.66 % |
  | K3 | −16.48 % |
  | K2 | −22.71 % |
  | K1 | −29.26 % |

- **Rounds 1–6 only.** Every run in them started at or before 09:50:48Z, the last sample at thermal level 0.
  Round 7 started at 09:50:36Z and its K2 at 09:50:57Z.

  | arm | paired CPU median (base median 27.09 s) | wall median |
  |---|---|---|
  | T | +0.30 % | — |
  | K4 | −10.74 % | 6.54 s |
  | K3 | −16.85 % | 7.18 s |
  | K2 | −22.75 % | 8.20 s |
  | K1 | −29.25 % | — |

  Eligibility does not change.
- **Per worker removed** (differences of paired medians, all 8 rounds):

  | step | CPU cut |
  |---|---|
  | 7 → 4 | −10.66 points, about −3.6 per worker |
  | 4 → 3 | −5.82 points |
  | 3 → 2 | −6.23 points |
  | 2 → 1 | −6.55 points |

  There is no knee at 4.
