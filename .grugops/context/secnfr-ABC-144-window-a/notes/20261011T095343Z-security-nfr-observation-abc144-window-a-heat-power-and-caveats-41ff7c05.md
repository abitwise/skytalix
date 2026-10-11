---
id: 20261011T095343Z-security-nfr-observation-abc144-window-a-heat-power-and-caveats-41ff7c05
kind: observation
by: security-nfr
at: 2026-10-11T09:53:43Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - .grugops/context/design-ABC-144/probe/lane144.mjs
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.thermal.tsv.txt
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-sampler.sh.txt
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-window-once.txt
supersedes:
---

# `ABC-144` Window A: heat, power, and what limits the readings

This note is hand-authored and unsealed. Nothing below made a reading inadmissible. Each item is a
limit that the next reader should know about.

## 1. `CPU_Speed_Limit` does not exist on this machine. The plan's heat column is empty

- `pmset -g therm` on this Mac15,13 (M3, macOS Darwin 25.5.0) prints only "No thermal warning level / No
  performance warning level / No CPU power status has been recorded". It has no `CPU_Speed_Limit` line.
  The harness therefore logged `speed_limit = none` on all 54 runs.
- **So `…ff54a750` readings-owed item 7 ("`CPU_Speed_Limit` per run, the first heat evidence") is not
  delivered by that instrument.** "No speed limit below 100 was observed" would be a false reading. The
  field was never there to read.
- **Supplementary instrument** (my own, not in the plan; `raw-sampler.sh.txt`): every 15 s, it read
  `notifyutil -g com.apple.system.thermalpressurelevel` with no sudo, plus load1 and the power source. That
  gave 31 samples (`raw-abc144-frontier-warm.thermal.tsv.txt`):
  - level **0** (nominal) from 09:44:47Z through 09:50:48Z;
  - level **1** (moderate) from 09:51:03Z to the last sample at 09:52:18Z. That covers round 7 from K1
    onwards (K1, B) and all of round 8: 8 of the 48 scored runs, 9 if round 7's K2 is counted. The sample
    before 09:51:03Z was 0.
- It is a 15-second sample of a system-wide level. It is not per run, and not a clock speed. It shows that
  about 6 minutes of back-to-back lane runs moved the fanless M3 from nominal to moderate thermal pressure.
  It does not show what any single arm did to heat.

## 2. Power

`AC Power` on all 54 runs and all 31 samples. Battery 100 %, charged. `lowpowermode 0`. No battery-state
reading was taken.

## 3. Load

- load1 was 2.48 before the first run and rose under the window's own runs. The largest value logged by the
  harness was 8.98, and the largest from the sampler was 9.24. `foreign_vitest` was **0 before every one of
  the 54 runs**. No `last-run.json` anywhere under `~/Projects`, and none in any of this repo's worktrees,
  changed during the window, except the arms' own.
- Two `vitest` command lines showed up in one `ps` read at about 09:52:5xZ, after the last run had finished.
  They were gone at the next read, and I could not trace where they came from. They fall outside the window.
  The harness checks for foreign runs only **before** each run, so a run that started and ended inside one
  of my runs would not show. Nothing in the data points to one: the per-arm spreads are tight (wall IQR
  ≤ 0.2 s).

## 4. The twin's wall has a one-sided offset (CPU is unaffected)

- T−B wall is +0.105 s median, **sign 8/8**, interval [+0.010, +0.150]. The CPU sign is 5/8.
- `ADR-0035` d1 defines admissibility on CPU, so the twin stays admissible. The wall R it feeds into
  `ADR-0040` d2 (c) is 0.150 s. Compared with K3's 2.63 s of margin, it cannot change an eligibility cell.
- **A likely cause, not tested:** the harness rotates a fixed cycle, so neighbour order never changes. T
  runs directly after B in 6 of 8 scored rounds, and the K arms always follow the same neighbour. Paired
  deltas may carry a small position effect. Window B's design (B, H, T) has the same property.

## 5. Not run

- `K4m1`. The subtask fixed 6 arms.
- Nothing cooled. Window A is warm only, per the plan.
- No `lane-inventory.js` in the archive trees. Per the plan, the harness's count assertion stands in for it.

## Untouched

`src/`, `vitest.config.ts`, `plans/board.md`, `memory-bank/` (the `ADR-0040` addendum is owed elsewhere).
Nothing was merged or pushed.
