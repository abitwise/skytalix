---
id: 20261029T063012Z-qe-e2e-decision-bdbccbbf
kind: decision
by: qe-e2e
at: 2026-10-29T06:30:12Z
verified_by: 
confidence: high on the readings and gates as run; M1 grading is BA/PM's; host throttling UNKNOWN - verify
refs:
  - EPIC-008
  - ABC-204
  - M1
  - M3
  - G1
  - G5
  - G6
  - G8
  - G9
  - 3497aad2
  - 38536a34
  - b5c67ab7
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - se-tools-rating-host/20261028T211542Z-software-engineer-decision-f55b4cdf
  - bapm-epic008-hostB/20261028T211452Z-ba-pm-decision-f0c8fedb
  - owner-word-2026-10-24/…4c3f7639
  - owner-word-2026-10-26b/…2ae5fc12
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - grugops/qe-epic008-close
  - ADR-0049
  - qe-epic008-close/20261028T212209Z-qe-e2e-observation-8fb860a9
  - qe-epic008-close/20261029T014341Z-qe-e2e-observation-e8d5c13a
supersedes: 
seal: sha256:f400fa20ba7ad1946e1c70265d3a7c17bd8a823861c02574ee20694e6547ab8f
---

# QE verdict, qe-epic008-close: PASS. Both M1 readings are valid, final results; M3 is MET; the gates are green. M1 inputs: −82.9 ± 73.8 (BA/PM grades it)

The notes this verdict rests on: PREREG `20261028T212209Z-qe-e2e-observation-8fb860a9`; reading 1 `20261029T014341Z-qe-e2e-observation-e8d5c13a`; and the reading 2 and M3 observations sealed with this note (task `qe-epic008-close`).

## What QE decides
- **Reading 1, R(baseline) at `3497aad2` = 1 910 + 188.5 ± 54.8 = 2 098.5 ± 54.8**, score 74.75 %, 200/200, 0 faults. This is a result, not UNRESOLVED. It is in band.
- **Reading 2, R(close) at `38536a34` (src/data = `b5c67ab7`) = 1 910 + 105.6 ± 49.5 = 2 015.6 ± 49.5**, score 64.75 %, 200/200, 0 faults. This is a result, not UNRESOLVED. It is in band.
- Each ran once, as pre-registered, and each written result is final. No E step was needed or taken. Owner Q3 does not arise, because neither reading is off-band and neither is degenerate.
- **Overlap-free figures:** 0 of 200 games overlapped foreign load in either reading (0 foreign vitest, 0 foreign cutechess, 0 load1 > 8 samples). The overlap-free and load-free figures equal the all-games figures: 188.54 ± 54.82 and 105.63 ± 49.48.
- **M1 inputs, reported and not graded:** R2 − R1 = **−82.9**; √(Y1² + Y2²) = **73.8**.
- **M3 on `38536a34`: `G1` 54/58, `G5`, `G6` (kiwipete 8 ≥ 7, position-6 10 ≥ 8, floor 6 held), `G8` 8.32 s, `G9` identical. All MET.**
- **Gates:** lint, typecheck, build 0; `npm test` 63/2 128, `last-run.json` success; skips 0, `No findings.`
- **Verdict: PASS** for this hop. It delivered the two readings and M3 as the brief and EPIC-008 step 3′ ask. There is no blocking gap. `M1`'s grade is BA/PM's (step 4) and is not part of this verdict.

## Gaps and flags, named (none blocking)
- **For BA/PM, step 4 (not a QE grade):** the point estimate is negative. The close sha reads 82.9 below the baseline on this host, while it searches about one ply deeper at 3 s (mean completed depth 10.09 against 9.13; `raw/depths.txt`). The same baseline sha read 2 061.3 ± 50.3 on the previous host and reads 2 098.5 ± 54.8 here. That is context only, not a comparison under option B.
- **Reading 1 sits 0.25 points inside the band** (74.75 % against 75 %). It is in band as the page reads it. Y1 is wider than Y2 because of that score.
- **Host:** CPU temperature reached a median of 82–83 °C and a max of 87 °C under the 2-game load in both readings, with the `powersave` governor and EPP `balance_performance`. The protocol reads none of this. Whether the CPU throttled is `UNKNOWN - verify`; it applied alike to both readings, which ran back to back.
- **G1 disclosure:** the count was read on a second, verbose run of the deterministic lane, because the default reporter printed no rows. Green both times.
- **Not run (not owed by M3):** `G2`, `G3`, `G4`, `G7`, `G10`, `G11`.
- Prose that is stale, and not this role's to edit: ABC-204's A-criteria line still says "chip, Darwin". The EPIC-008 § Out of scope "owner's Mac" line was flagged by BA/PM.

## Owed
- BA/PM (step 4): grade `M1`–`M4` and write the epic's close from these notes.
- Orchestrator: merge the records of `grugops/qe-epic008-close` (context notes and raw only; no `src/` or `tools/` change), then the board and the trace.
