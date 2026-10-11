---
id: 20261011T124750Z-security-nfr-observation-abc144-window-b-heat-1ff56629
kind: observation
by: security-nfr
at: 2026-10-11T12:47:50Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - NFR-008
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-warm.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cooled.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cli-narrow.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/winb.thermal.tsv
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-observation-abc144-window-a-heat-power-and-caveats-41ff7c05.md
supersedes:
---

# `ABC-144` Window B: heat. **Moderate thermal pressure (level 1) still occurs at k = 3** when lane runs go back to back. It does not occur with 90 s of idle between runs

This note is hand-authored and unsealed. The owner's goal is "choking cpu and generating heat". This is the
heat half.

## The instrument

- `notifyutil -g com.apple.system.thermalpressurelevel`, read by the harness copy `probe/lane144b.mjs`
  immediately **before** and immediately **after** every one of the 81 runs (columns `thermal_before`,
  `thermal_after`). Levels: 0 nominal, 1 moderate, 2 heavy and above.
- A 15 s sampler over the whole window (`probe/sampler.sh` → `probe/winb.thermal.tsv`, 194 samples,
  11:57:18Z–12:46:06Z).
- **It is a system-wide level, not a per-process reading.** B, H and T run interleaved, so the level at
  any run reflects the heat of the runs before it, from every arm. It cannot charge heat to one arm.
- `pmset -g therm` prints no `CPU_Speed_Limit` line on this M3. The `speed_limit` column reads `none` on
  all 81 runs and all 194 samples. **It is not a reading**, and "no speed limit below 100" must not be
  written.

## Distribution, base vs head (scored rounds 1–8, n = 8 per arm; before / after each run)

| state | B (base, 7 workers) | H (head, 3 workers) | T (twin of base) |
|---|---|---|---|
| warm (back to back, ~10 s per run) | before 0:6, 1:2 · after 0:6, 1:2 | before 0:6, 1:2 · after 0:6, 1:2 | before 0:6, 1:2 · after 0:5, 1:3 |
| cooled (90 s idle before each run) | 0:8 · 0:8 | 0:8 · 0:8 | 0:8 · 0:8 |
| `src/cli.test.ts` narrow (back to back, ~4 s per run) | 0:8 · 0:8 | 0:8 · 0:8 | 0:8 · 0:8 |

- All 162 harness reads (81 runs × 2, round 0 included): **warm 41 × 0 and 13 × 1; cooled 54 × 0;
  narrow 54 × 0.** No level ≥ 2 was ever read.
- Sampler: **0 → 1 at 11:59:50Z, 1 → 0 at 12:01:21Z.** Warm segment 10 × 0, 3 × 1. Cooled segment
  167 × 0. Narrow segment 8 × 0.

## When it happened

- The warm state started at 11:57:18Z, at load1 3.56 and level 0.
- The level flipped to 1 **during the 21st back-to-back run** (round 6, T: `0 → 1`), about 2.5 min into
  the warm state. Load1 had climbed from 3.5 to over 10 by then, all of it the window's own runs
  (`foreign_vitest` 0 before and after every run).
- **Every run of rounds 7 and 8 started and ended at level 1.** That is two H runs, two B runs and two T runs.
- The level dropped back to 0 at 12:01:21Z, inside the 90 s idle gap before the first cooled run. It did
  not return for the rest of the window: 45 min of cooled runs, then 27 back-to-back narrow runs of
  `src/cli.test.ts` (~4 s each, CPU/wall ~1.4).

## What this says, and what it does not

- **At k = 3, moderate pressure persists under back-to-back full-lane runs.** H's own runs in rounds 7–8
  ran at level 1, the same as B's and T's. **Said plainly: the cap did not stop the fanless M3 from
  reaching moderate thermal pressure.** Per `ABC-144`'s queue note, the k = 2 option goes back to the owner.
- **The window cannot say whether a head-only workload stays nominal.** Two of every three runs in the warm
  state were uncapped (B, T at 7 workers), so the heat that tipped the level came from a mix. A sequence
  of H runs alone, back to back, would answer that question. It was not pre-registered, and it was not run.
- **Per run, head costs less energy-proxy:** CPU-seconds fell −16.05 % warm and −15.85 % cooled (the
  readings note). With no power meter, CPU-seconds are the only proxy on record, and they are not watts.
- **Heat raises CPU-seconds.** Warm (hot) runs billed more CPU than cooled runs on the same tree: B 28.35 vs
  26.49 s (+7.0 %), H 24.01 vs 22.26 s (+7.9 %). Warm also carried higher load1 (B median 7.21 vs 2.55), so
  heat and contention are confounded here.
- **Window A comparison (descriptive only):** Window A reached level 1 after ~6 min of back-to-back runs,
  with 4 of its 6 arms capped. Window B reached it after ~2.5 min, with 2 of 3 arms uncapped. At Window B's
  start the battery was charging (98 %, "charging"; 100 % "charged" by 12:29Z), which adds heat. The two
  windows are not comparable as a heat experiment.

## For the owner (questions, not rulings)

1. Is "moderate after ~2.5 min of back-to-back lanes, gone after ~90 s idle" the heat you mean by
   "generating heat"?
2. If yes, the levers on record are: k = 2 (Window A: −22.71 % CPU, wall 8.23 s), Orchestrator width, and
   `VITEST_MAX_THREADS=2` for agent hops (`ADR-0040` § Consequences; the pin allows lowering). None is ruled
   here.
