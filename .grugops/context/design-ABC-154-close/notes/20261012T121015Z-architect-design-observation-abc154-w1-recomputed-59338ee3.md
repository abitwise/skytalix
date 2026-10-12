---
id: 20261012T121015Z-architect-design-observation-abc154-w1-recomputed-59338ee3
kind: observation
by: architect-design
task: design-ABC-154-close
at: 2026-10-12T12:10:15Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - RISK-ABC105-LANE
  - QE-154-c
  - QE-154-d
  - .grugops/context/qe-ABC-154/probe/w1/n8-qe5.tsv
  - .grugops/context/qe-ABC-154/probe/w1/sampler.tsv
  - .grugops/context/design-ABC-154-close/probe/recompute.out.txt
  - 20261012T113700Z-qe-e2e-observation-abc154-n8-lane-met-4e153e76
supersedes:
---

# `qe-ABC-154` w1, recomputed from the raw TSV: QE's figures hold to the last digit

This note is hand-authored and unsealed (`AGENTS.md`). This hop took **no timing reading**. It recomputed every
figure with its own script, `probe/recompute.py`, and did not run QE's readout. The output is in
`probe/recompute.out.txt`.

## How

- **Units.** Each row is read in integer centiseconds. On all 27 rows, `cpu` = `user` + `sys`.
- **Rounds.** Round 0 is discarded, so n = 8. k = 2 gives x(2)..x(7), and R is the larger magnitude of the twin's
  x(2) and x(7).
- **Void checks.** Every row: status `ok`, counts (1, 1) for B and T and (1, 32) for H, 0 foreign before and
  after, thermal 0, AC power.
- **Sampler.** `probe/samplerwin.py` checks the rows inside [first run − 5 s, last run end + 5 s].

## w1 at `0f8036f9`

| | CPU | wall |
|---|---|---|
| B / H / T median | 0.575 / 0.960 / 0.570 s | 0.415 / 0.730 / 0.420 s |
| twin T − B | −0.005 s (−0.870 %), +1/−4 with 3 zeros, p 0.375 (old convention 0.070), R 0.030 s | 0.000 s, +2/−3 with 3 zeros, p 1.000, R 0.030 s |
| H − B | **+0.380 s, +0.350..+0.410** | +0.300 s, +0.280..+0.330 |

- **Void and sampler.** 0 void rows. In the lane interval, 6 sampler rows and 0 bad.
- **Grade.** A1 is met: 5 ms ≤ max(8.62, 10) ms, and the sign is at chance. The pre-A1 rule is also met. R 0.030
  ≤ 0.650. The median is ≤ 0.650, and the lower end is not > 0.650. **The state is MET.**

## The other R values the floor depends on (same script)

| window | twin CPU R | wall R | admissible as graded | lane interval sampler |
|---|---|---|---|---|
| `qe-ABC-105` | 0.010 s | 0.010 s | yes | 0 bad of 6 |
| QE3 w3 | 0.020 s | 0.020 s | yes | 0 bad of 6 |
| QE4 w2 | 0.030 s | 0.020 s | **no** (1.754 %, pre-A1) | 0 bad of 6 |

- The whole-window samplers of `qe-ABC-105` and QE3 w3 carry rows with foreign runners, all **outside** the lane
  interval. They were in the gate's wait.

## Load (QE-154-d)

Per round, CPU:

| round | load1 before (B / H / T) | H − B | T − B |
|---|---|---|---|
| 1 | 3.21 / 3.21 / 3.21 | +0.41 | −0.01 |
| 2 | 3.21 / 8.88 / 3.21 | +0.41 | +0.02 |
| 3 | 8.88 | +0.37 | 0.00 |
| 4 | 8.33 / 8.88 / 8.88 | +0.35 | 0.00 |
| 5 | 8.33 | +0.39 | 0.00 |
| 6 | 8.33 | +0.34 | −0.04 |
| 7 | 7.90 | +0.35 | −0.03 |
| 8 | 7.90 | +0.42 | −0.02 |

- The high-load rounds do not read a larger treatment.
- The twin's three negative deltas sit in rounds 6–8, so R carries the load.
- The sampler's load1 runs 3.21 at 11:26:14Z, 8.88 at 11:26:19Z, then 8.33, 7.90 and 7.51 at 11:26:35Z.
