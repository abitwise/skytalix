---
id: 20261011T191345Z-security-nfr-observation-abc151-window-heat-a5-363fc14c
kind: observation
by: security-nfr
at: 2026-10-11T19:13:45Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ADR-0040
  - RISK-ABC144-HEAT
  - .grugops/context/secnfr-ABC-151-window/probe/abc151-heat-k2.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/abc151-heat-k3.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/sequences.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/gate.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/w151.thermal.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/readout.out.txt
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-heat-1ff56629.md
supersedes:
---

# `ABC-151` `A5`: heat, k = 2 against k = 3. **Said plainly: k = 2 did NOT reach moderate heat later or less than k = 3.** It reached it one run earlier and on two more reads. Both reached heavy (level 2)

This note is hand-authored and unsealed.

## The instrument

- The level is `notifyutil -g com.apple.system.thermalpressurelevel` (0 nominal, 1 moderate, 2 heavy).
  - `lane144b.mjs`, unchanged, read it immediately before and after every run.
  - A 15 s sampler read it alongside (`probe/w151.thermal.tsv`).
- **It is a system-wide level, not a clock speed, and not a per-process reading.**
- `pmset -g therm` prints no `CPU_Speed_Limit` line on this M3. The column reads `none` on every run, so it is never a reading.

## The sequences, in addendum 2's fixed order

Each sequence was 27 back-to-back `npm test` runs of one tree, GAP 0. Each started only after the gate had read
level 0 on 4 consecutive 15 s samples (`probe/gate.tsv`).

| | k = 2 (H, `612b7b6d`) | k = 3 (B, `f439c8fd`) |
|---|---|---|
| preceded by | step 1, warm paired: 27 runs, two thirds of them at k = 3. It ended at level 1 | the k = 2 sequence, which ended at level 1 after 15 runs at level 2 |
| previous run's end → first run | 17:22:25Z → 17:23:56Z, **92 s idle** | 17:28:47Z → 17:31:34Z, **167 s idle** |
| gate | 3 samples at 1, then 4 at 0. Passed at 17:23:56Z | 8 samples at 1, then 4 at 0. Passed at 17:31:33Z |
| battery, load1 at launch | battery 95 %, discharging; load1 4.03 | battery 92 %, discharging; load1 3.90 |
| level at launch | 0 | 0 |
| **first read at level ≥ 1** | **run 5** (after it), 54 s in | **run 6** (after it), 49 s in |
| **reads at level ≥ 1, of 54** | **45** | **43** |
| first read at level 2 | run 12 (after it), 127 s in | run 13 (after it), 111 s in |
| reads at level 2, of 54 | 28 | 28 |
| sampler at ≥ 1 during the sequence | 16 of 19 samples; first 58 s in | 13 of 16; first 56 s in |
| duration of 27 runs | 291 s | 247 s |
| wall median (range) | 10.27 s (9.94–12.48) | 8.65 s (7.43–10.49) |
| CPU median (range) | 26.51 s (25.42–31.19) | 28.52 s (25.46–34.60) |
| total CPU-seconds over 27 runs | 728.9 | 797.7 (k = 2 is −8.6 %) |
| CPU-seconds per second | 2.51 | 3.23 |
| runs with a foreign runner process before them | 20 of 27 (runs 1–20) | 27 of 27 |
| harness errors | 0 (56 files, 1740 tests on every run) | 0 |

Each run's wall, CPU, load1 and level before and after are in `probe/readout.out.txt` § A5 and in the raw `.tsv`.

## What this says

- **By the page's measures (run index, and count of reads), k = 2 reached level ≥ 1 no later than k = 3, and on no
  fewer reads.** On the page's rule, that goes to the owner: **k = 2 did not buy the heat he asked for.**
- **By clock time, k = 2 was 5 s later to level 1 and 17 s later to level 2.**
  - A k = 2 run is longer, so the same run index falls later on the clock.
  - 5 s is under one 15 s sample, and 17 s is under two k = 2 runs. **This is not a separation in k = 2's favour**, and it is not called one.
- **"Not separable" does not apply.** That reading is for the case where neither sequence reaches level 1. Both reached level 2.
- **The cut in CPU-seconds is real, and it did not show up as less heat.**
  - k = 2 spent 8.6 % fewer CPU-seconds on the same 27 lanes, at a lower rate (2.51 vs 3.23 CPU-s/s).
  - Even so, the fanless M3 reached the same pressure levels on about the same clock.
  - One reading consistent with this, **not measured**: the level tracks sustained package load at any parallelism above about 2, so a lower rate over a longer time lands in the same place within 1–2 minutes.
- **Heat raises CPU-seconds** on both trees:
  - H's CPU median was 26.51 s here, against 23.08 s in the warm paired step (+15 %);
  - B's was 28.52 s against 25.86 s (+10 %);
  - B's per-run CPU rose from 25.5 s to 34.6 s across its sequence.

## What it does not say, and the confounds

- **Foreign load (`RISK-ABC151-FOREIGN`):**
  - Another project's test runner was alive before runs 1–20 of k = 2 and before all 27 of k = 3.
  - Its CPU in these minutes is **not measured**. The CPU logger started at 17:36:46Z, after both sequences.
  - It touched k = 3 more (27 runs against 20), which, if anything, would heat k = 3 more. **k = 2 still did not come out ahead.**
- **Order and idle:**
  - The fixed order put k = 2 after the paired step and k = 3 after k = 2.
  - k = 3 got 75 s more idle, but followed a hotter state: level 2 had held for 15 runs.
  - The gate shows the level and not the chassis temperature, so the direction of any residual bias is **not measured**.
  - The order was not re-run (Test note 2).
- **Power:** both sequences ran on battery, discharging (95 % at the k = 2 launch, 92 % at the k = 3 launch). Window B ran on AC and charging. So the two windows are not one heat experiment. Window B never read level 2.
- **The level is system-wide.** It is not a temperature and not a clock speed. "No speed limit was observed" is not written here.

## Also seen in this window (descriptive)

- **Warm paired step (B, H and T interleaved):** level 1 from the 20th run (an H run, `0 → 1`). 15 of 54 reads were at 1, and none at 2.
- **Cooled step (90 s idle before each run):** 54 of 54 reads at 0.
- **Lanes:** level 1 was read at the end of `ENGINE_DEEP` (H) and `LADDER_DEEP=1` (H), and around `ENGINE_DEEP` (B).
- **Sampler, whole window (540 samples):** 334 at level 0, 144 at 1 and 62 at 2.

## For the owner (questions, not rulings)

1. On this machine, 27 back-to-back lanes reach moderate in under a minute and heavy in about two, at k = 2 and at
   k = 3 alike. 90 s of idle between runs kept every read at 0. Is the heat you mean the back-to-back case, which is
   mostly agent hops?
2. If so, the lever with an effect on record is **idle between runs, or fewer runs at once** (Orchestrator width).
   The cap is not that lever. k = 2 keeps a −9 % CPU cut at +1.3–1.7 s of wall. Return to k = 3 is addendum 2's
   Rollback. None of these is ruled here.
