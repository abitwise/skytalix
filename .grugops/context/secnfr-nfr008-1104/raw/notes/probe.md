# secnfr-nfr008-1104 probe (an estimate, never a grade): **the seven form-S rows (P1) save −0.26 s of wall [−0.54, −0.13], 8 / 8. Adding the two critical-path rows whose files have no deep gate (P2) saves −0.555 s [−0.69, −0.29], 8 / 8.** Those two rows alone are worth about −0.30 s

Security/NFR, task `secnfr-nfr008-1104`. Arms and rows as sealed in the probe plan `…39f73707`. Records: `raw/out/probe/` (`a8.tsv`, `grade.out`, `probe.console`), plus `raw/out/probe-P1.diff` and `raw/out/probe-P2-over-P1.diff` (each changed line is one `it(` → `it.skip(`). Scripts: `raw/scripts/probe.sh` and `probe-grade.py`.

## The session
- **ONE `flock <scratch>/host-test.lock` hold**, 2026-11-04 17:15:15Z → 17:19:35Z. The wait-clear took 0 s (load1 0.35).
- 9 rounds, rotated H P1 P2 / P1 P2 H / P2 H P1. Round 0 was discarded, so n = 8 complete scored rounds and k = 2.
- Every run exited 0 with its expected counts (H 2 687 passed; P1 2 680 + 7 skipped; P2 2 678 + 9 skipped; 71 files each).
- load1 0.35–3.75 and 0 foreign vitest in every row.
- **Time on the host for both sessions: 8 min 46 s of lock holds**, against the brief's 1 h.

## Readout (`probe-grade.py`)
| arm | wall median [x(2), x(7)] | max | CPU median | − H, wall (paired) | − H, CPU (paired) |
|---|---|---:|---:|---|---|
| H (`main`) | 9.82 s [9.73, 9.84] | 10.00 | 33.11 s | — | — |
| **P1** (R1–R7 skipped; 632 ms in-thread) | 9.52 s [9.30, 9.69] | 9.71 | 32.42 s | **−0.260 s [−0.540, −0.130], 8 / 8 negative** | −0.910 s [−1.080, +0.130], 5 / 8 |
| **P2** (P1 + 2 rows; 935 ms in-thread) | 9.25 s [9.15, 9.44] | 9.60 | 31.66 s | **−0.555 s [−0.690, −0.290], 8 / 8 negative** | −1.400 s [−1.860, −0.820], 8 / 8 |

- **H reproduces session 1:** 9.82 s here against 9.84 s graded. This was a separate hold, 4 minutes later.
- **Wall per in-thread ms is not uniform.**
  - P1's seven rows return about 0.41 s of wall per in-thread second. That is near the ÷ 2 of two workers, less the per-file start-up that stays.
  - The two P2 rows return about 0.30 s for 303 ms, roughly one for one. `src/cli.test.ts`'s worker is the lane's critical path: its collect-time children (3.4 s at `…f925027f`) plus its 0.77 s slot. Rows in that worker shorten the wall directly.
- **What the probe does not show.**
  - A skip keeps the row's collection and any describe setup, so a real move saves a little more.
  - A form-S remnant keeps a little, so it saves less. ABC-281's remnants kept about 6 % (`ADR-0046` § Dated 2026-11-04), and its graded −0.37 s matched the probe's −0.38 s.
  - **Expected with remnants:** P1 about −0.24 s; P2 about −0.50 s.
