---
id: 20260813T212621Z-software-engineer-claim-the-lane-cost-is-below-median-weight-and-the-instrument-cannot-resolve-it-9a602a43
kind: claim
by: software-engineer
at: 2026-08-13T21:26:21Z
verified_by: 
confidence: medium
refs:
  - ABC-041
  - src/render-seam.test.ts
  - plans/nfr-catalog.md
  - plans/metrics.md
supersedes: 
---

# The lane cost: 1 file, 13 ms of its own test time. The paired delta reads 170 ms and the NOISE FLOOR IS THE SAME SIZE.

`N8-LANE` is inherited by name (≤ **650 ms CPU**, scope = every file the branch adds under `src/`)
and the subtask carries a stop condition: *the lane cost lands above one median-weight test file →
stop and say so*. **It does not fire.** The confidence on this note is `medium` and the reason is in
the second half.

## What was measured

Paired, interleaved, n = 7: full suite versus the same suite with
`--exclude '**/render-seam.test.ts'` (which reproduces the baseline exactly — 28 files, 816 tests).
CPU is user+sys from `/usr/bin/time -p`. Node v24.12.0, vitest 3.2.7.

```
round   with     without   delta
1       9420     9040      380
2       9300     9210       90
3       9340     9170      170
4       9360     9190      170
5       9440     9200      240
6       9520     9450       70
7       9560     9390      170
                 MEDIAN    170 ms
```

**Identity null control (same command both sides, 3 pairs): 180 ms (2.03%), −50 ms (−0.56%),
−120 ms (−1.30%).** The method's own bar is ≤ 1.5% and one pair **misses it**.

## The honest reading

The null control's spread (±50–180 ms) is **the same order as the signal (170 ms)**. At n = 7 this
instrument cannot cleanly resolve one test file's marginal cost on this machine, so **170 ms is an
upper bound, not a measurement**, and the definitive `N8-LANE` reading belongs to Security/NFR's
out-of-tree instrument — the same split the ticket already makes for `NFR-002`'s wall clock.

## Why the stop condition still does not fire, on axes the instrument DOES resolve

- **File count — the quantity `N8-LANE` actually binds.** This branch adds **exactly 1** file under
  `src/`. The ticket allots 1. The Orchestrator's decision note says running `ABC-041` and `ABC-042`
  leaves 8 of ~10; **that number is unchanged.**
- **The file's own content weight.** vitest reports `src/render-seam.test.ts` at **13 ms** of test
  time (8 tests). QE's weight analysis, quoted on the ticket, puts the per-file median at **94.2 ms**
  and the mean at 309 ms. At 13 ms this is **far lighter than median-weight**, which is the axis the
  stop condition names. No corpus, no spawn, no perft, no `vi.mock`.
- **The rest of the 170 ms is the lane's fixed per-file slope, not this file.** `vitest.config.ts`
  records the slope at **138.9 ms/file** under `pool: "threads"`. 139 + 13 ≈ 152 ms, which the
  measured median brackets. A *median-weight* file would cost ≈ 139 + 94 ≈ 233 ms; this one is below
  that.
- **Against the budget itself.** Full-suite CPU with the file is ~**9.4 s** against `NFR-008`'s
  **13 s** clause — consistent with the 9.51 s median already in `plans/metrics.md`. The ticket
  predicted ≈160 ms and ≈1.2% of the clause; the measurement agrees within its own noise.

**Not claimed:** that this discharges `H5`, that it is an `NFR-008` measurement, or that 170 ms is
this file's true marginal cost. The runs were interleaved but the null control did not clear 1.5%.
