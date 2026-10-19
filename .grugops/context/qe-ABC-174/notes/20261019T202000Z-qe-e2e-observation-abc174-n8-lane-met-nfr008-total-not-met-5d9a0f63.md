---
id: 20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63
kind: observation
by: qe-e2e
task: qe-ABC-174
at: 2026-10-19T20:20:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0008
  - R-173-1
  - QE-174-b
  - .grugops/context/qe-ABC-174/probe/window.mjs
  - .grugops/context/qe-ABC-174/probe/sampler174.mjs
  - .grugops/context/qe-ABC-174/probe/lane174.mjs
  - .grugops/context/qe-ABC-174/probe/readings.sh
  - .grugops/context/qe-ABC-174/probe/readout174.py
  - .grugops/context/qe-ABC-174/probe/readout-nfr008-174.py
  - .grugops/context/qe-ABC-174/probe/attempt1/
  - .grugops/context/qe-ABC-174/probe/attempt2/
supersedes:
---

# ABC-174 timing at `be6a5599`: `N8-LANE` **MET** (+0.115 s CPU, R 0.160 s). The `NFR-008` total is **NOT MET** at 10.01 s wall (R 0.28 s), and this ticket did not cause it

Hand-authored and unsealed. Every figure below was read in a foreground-verified quiet window. Nothing was estimated.

**Host:** Mac.lan, Apple M3 (Mac15,13), 8 cores, Darwin 25.5.0, node v26.11.1, vitest 4.1.11, `maxWorkers: 2`, heap cap
on. This is the declared stack.

## Windows (`probe/window.mjs`: a foreground 180 s window, 1 s polls)
The window copies `qe-ABC-173`'s script with two changes: the own-line exclusion names this file, and the distinct
foreign lines are listed. A poll fails on any vitest, any `oeselg-labs/platform` process, or any other hop.

| window | start (UTC) | foreign polls | what | procs before/after | load1 |
|---|---|---:|---|---|---|
| 1 | 19:18:13 | 181 | my own `tee` (self-match; the window was invalid), plus 1 platform poll | 494 / 507 | 2.58–4.29 |
| 2 | 19:21:25 | 40 | a `Projects/public/grugops` `vitest run scripts/…` from another session | 499 / 498 | 3.14–4.93 |
| 3 | 19:24:32 | **0** | quiet; not used, because the harness was not ready (the sampler had to be rebuilt) | 501 / 493 | 2.39–4.88 |
| 4 | 19:28:49 | 1 | another session's shell naming `oeselg-labs/platform` | 493 / 496 | — |
| 5 | 19:31:59 | 1 | the same | 489 / 453 | — |
| 6 | 19:56:26 | 1 | the same | 467 / 467 | 2.22–2.93 |
| 7 | 19:59:48 | **0** | quiet → **attempt 1** started at 20:02:49 | 466 / 438 | 2.10–2.91 |
| 8 | 20:09:38 | **0** | quiet → **attempt 2** started at 20:12:39 | 427 / 429 | 2.12–4.05 |

The host's process limit was never approached: the peak was 516 user processes against `ulimit -u` 2666.

## Instrument
- **Arms:** out-of-tree `git archive` trees in the session scratchpad, with `node_modules` symlinked. B and its twin T
  are `bd480c99`. H and its twin H2 are `be6a5599`. `diff -rq` shows B = T and H = H2.
- **Harness:** `probe/lane174.mjs`, a byte copy of `qe-ABC-173/probe/lane173.mjs` (sha256 `e2074cdb…3e40`). It uses
  9 rounds with round 0 discarded, rotated order and GAP 0, and reads CPU as user + sys from `/usr/bin/time -p`.
- **Sampler:** `probe/sampler174.mjs`, one `ps` every 5 s. It counts every foreign vitest, platform process or other
  hop that is not descended from the driver.
- **Readouts:** `readout174.py` and `readout-nfr008-174.py`. Each is a `qe-ABC-173` readout with one change, for this
  sampler's columns. A round with a foreign sample is discarded, and n must be 8.
- **N8-LANE narrow set:** the three modified test files plus
  `npx vitest related --run src/levels.ts src/cli-options.ts src/uci-session.ts src/cli.ts`. That gives 7 files:
  `book-engine`, `book`, `cli`, `engine`, `ladder`, `levels` and `uci-session`. It is the same set at B and H, and the
  tests number 327 at B and 343 at H.
  - Command: `NODE_OPTIONS=--max-old-space-size=128 npx vitest run <7 files>`, the SUITE shape.
  - No file is added, so no placeholder was needed and the floor account is not charged.
- **NFR-008 total:** `npm test` as spelled, H vs H2.

## Attempt 1 (20:02:49–20:08:56Z): **VOID** and **NOT APPLICABLE**
- **Narrow set: VOID.** At 20:03:59Z the sampler caught iTerm's `pidinfo --git-state …/oeselg-labs/platform`, inside
  round 3, so round 3 was discarded and n = 7. load1 also jumped from 4.4 to 11.5 in that round. Its summary is kept in
  `probe/attempt1/` and is **not a reading**.
- **Full lane: NOT APPLICABLE.** The run was admissible and had no foreign sample, but load1 was above 8 before 4 runs
  (8.39–10.45), and the clause is read at load1 ≤ 8. For the record, the H median wall was 9.95 s.

## Attempt 2 (20:12:39–20:18:52Z): **the reading**
74 sampler rows, **0 foreign**, load1 ≤ 7.79, at most 435 user processes, 0 harness errors, thermal 0 on every run.
- **`N8-LANE` (narrow set, n = 8, k = 2): MET at 650 ms CPU.**
  - B median 15.325 s, H 15.430 s, T 15.295 s.
  - Twin T−B CPU: median −0.030 s (−0.20 % of B), sign +2/−6 (p 0.289), **R 0.160 s → admissible**.
  - **H−B CPU: median +0.115 s, interval +0.020..+0.170 s.** R ≤ 650 ms and median ≤ 650 ms, so the state is
    MET.
  - Wall, reported: H−B median +0.030 s, interval −0.050..+0.130 s, twin R 0.070 s.
  - load1 before scored runs: 2.77–4.26.
  - This is the set's first admissible reading on vitest 4.1.11 with the cap. Under `ADR-0035`'s per-set rule it
    replaces the provisional 16 % `F` (2.452 s). This set's `F` is now R = 0.160 s CPU / 0.070 s wall. Recording that
    is Architect/Design's job.
- **`NFR-008` total (`npm test`, H vs H2, n = 8, k = 2): NOT MET at 10 s wall.**
  - **H median wall 10.010 s** (range 9.85–10.28), and H2 median 10.090 s.
  - Twin H2−H wall: median +0.065 s, **R 0.280 s**. CPU: median +0.040 s (sign +4/−4, p 1.000), R 0.390 s, so the run is
    **admissible**.
  - **CPU reported: H median 27.73 s** (27.36–28.35).
  - load1 before scored runs: 3.10–6.01, all ≤ 8.
  - The readout state is **NOT MET**: the wall median is 10.01 s against 10 s, and R 0.28 s ≤ 10 s.

## What the total means for this ticket (`QE-174-b`)
- **The breach is the lane's, not this ticket's.** The per-ticket instrument, the narrow set, charges ABC-174
  +0.115 s CPU and +0.030 s wall, and is MET. No full-lane base arm (`bd480c99`) was run: `ADR-0035` reads the total at
  the head only. So the full-lane delta of this ticket is **not measured**.
- **The two attempts disagree by 0.06 s.** Attempt 1 read 9.95 s but is not applicable. The lane sits at the 10 s bar
  within its own R.
- **This is the first full-lane figure on the capped stack (`R-173-1`, `ABC-173` A9 owed).**
  - Its twin R (0.390 s CPU / 0.280 s wall) is the first capped full-lane twin R. Under `ADR-0035`'s 2026-10-12 floors
    paragraph, it replaces the pre-cap `F` (1.72 s / 3.25 s).
  - Recording that is Architect/Design's job.
- **Route:** Security/NFR at this ticket's gate rules on the `NFR-008` state, and Architect/Design is the row's owner.
  QE does not grade the bar away and does not move it.
