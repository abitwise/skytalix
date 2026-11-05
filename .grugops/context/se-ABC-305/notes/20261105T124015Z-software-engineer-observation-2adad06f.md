---
id: 20261105T124015Z-software-engineer-observation-2adad06f
kind: observation
by: software-engineer
at: 2026-11-05T12:40:15Z
verified_by: 
confidence: high: read from the harness's files; the read itself is void and grades nothing
refs:
  - se-ABC-305
  - ABC-305
  - NFR-008
  - R-CEN-1
  - ADR-0035
  - a321b45e
  - a21136b0
  - se-ABC-305/20261105T123410Z-software-engineer-decision-a175246b
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
supersedes: 
seal: sha256:5122d1b39948a3a278e51171036c19ed0ca62ed9cf61e3e1accf7dce92b267dc
---

# se-ABC-305: the `N8-LANE` read is **VOID, not ALONE. All 8 scored rounds are flagged.** Under the PREREG and the brief it grades nothing, gets no re-read here, and the hop STOPS

Software Engineer, under PREREG `…a175246b`. Records: `raw/out/n8-void/`.

## What happened
- One hold, 12:34:41Z to 12:39:07Z, 266 s. The five-sample clear check passed, with wait-clear 0 s. 9 rounds, n = 8 complete scored rounds, every run exit 0 with its expected counts (B 71 / 2 709, H and H2 71 / 2 710, 0 skipped, 0 failed). No output file was empty.
- **Foreign load.** Another project's vitest (`grugops`) started with the hold and ran through it, outside this lock. It was seen in 213 sample rows of 88 samples, and all 8 scored rounds are flagged (`flags.out`), so **0 rounds are unflagged and there is no sensitivity.** `foreign_cpu_s`: median 14.57 s, min 3.94, max 17.57. load1 rose 1.55 → 5.38. The host gate (load1 ≤ 8) held, so every run stayed scored.
- **Nothing was touched.** Those processes were only read.

## The figures, ungraded, for the record only
H = `a321b45e`, B = `a21136b0`. H 9.67 s [9.58, 9.86], max 9.97. H2 9.85 s [9.62, 9.97], max 10.10. B 9.71 s [9.65, 9.84], max 9.89. H − B paired −0.020 s wall [−0.260, +0.210], −0.195 s CPU. Twin CPU +0.055 s, 0.17 %, sign 4 / 8; twin wall median +0.135 s, R 0.370 s.

**`grade.out` prints "NFR-008 MET, graded" and "BUDGET … MET". The grader does not read the flags. Those two lines are void and may not be cited.** The PREREG's rule decides this, not the figures: more than 2 of 8 flagged rounds means no A5 verdict. **The −0.020 s is not a pass against +0.10 s.** H2 sits 0.135 s from its identical tree, more than the whole budget, so this session could not have resolved it.

## Rows (from the same runs, so ungraded as durations; H and H2, 16 runs)
- **Added:** `ABC-301 P1` … `on 44 of 44`, 1.5 ms. **Changed:** the seams row (`QE-271-g`), 2.2 ms; the FEN source row, 3.0 ms. Sum 6.7 ms against the 90 ms aim. H has 3 row names B lacks, and B has 2 H lacks, so + 1 net.
- **No row of these files is ≥ 50 ms.** The slowest in the three files is `king-mobility` A6, 36.8 ms, unchanged from B's 38.6 ms. No new test file: 71 and 71.

## Not run, because the hop stopped here
Gates and deep lanes: A4 (bar the two preflight counts), A6, A7's green, lint, typecheck, build, skip capture. `UNKNOWN - verify`.

## The call for the Orchestrator
A re-read needs the host clear for the whole hold, about 5 minutes. A clear check at the start cannot give that: this one passed and the load began with the hold, which is `R-CEN-1`. `…f40ce634` ruling 4 says the owner may hold the other project for timing reads. The arms and harness are ready, and the same PREREG can be run again on a new output directory.
