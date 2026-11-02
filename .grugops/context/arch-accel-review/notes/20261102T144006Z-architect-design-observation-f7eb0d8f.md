---
id: 20261102T144006Z-architect-design-observation-f7eb0d8f
kind: observation
by: architect-design
at: 2026-11-02T14:40:06Z
verified_by: 
confidence: measured (informal); counts, not timings; four positions, depth 7, one run
refs:
  - arch-accel-review
  - grugops/arch-accel-review
  - 2ef3aadc
  - EPIC-011
  - ADR-0057
  - ADR-0056
  - ADR-0055
  - ADR-0025
  - ADR-0026
  - ADR-0044
  - ABC-263
  - ABC-265
  - ABC-266
  - ABC-267
  - ABC-236
  - memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md
  - f0a1b494
  - src/quiescence.ts
  - src/evaluate.ts
supersedes: 
seal: sha256:9d62cf2023c7d63a4caaf31f37893ebc61562863ad0efe064ee7a793a79ada50
---

# PR-1: stand-pat band shares on main 2ef3aadc, search(position, 7), scratch copy of src/ with one counter at the quiescence stand-pat

## Command and window
flock host-test.lock timeout 300 node probe.mjs <scratch src> 7 ; 2026-11-02T14:33:23Z-14:34:06Z (43 s). Scratch only (deleted at hop end); repository untouched; nothing timed.

## Readings (stand-pats / at null window / outside [a-120, b+120] / outside +-200 / without-mobility outside +-200 / max |full - without mobility|)
- start position: 29 277 / 99.5 % / 40.6 % / 30.6 % / 28.6 % / 100
- kiwipete: 515 518 / 98.2 % / 83.0 % / 71.9 % / 70.0 % / 100
- position 3 (endgame): 22 746 / 98.6 % / 50.8 % / 34.0 % / 32.7 % / 100
- position 6: 503 356 / 97.9 % / 78.2 % / 69.9 % / 68.1 % / 100

## Reading
- The analysis's "about 85 % of leaves outside the +-120 band" is position-dependent here: 41-83 %.
- The 100 cap is MOBILITY_CAP in src/evaluate.ts (by construction), so a +-100 lazy skip of mobility is exact for the stand-pat >= beta test.

## Scope
Informal probe for ADR-0057 D8.1; not a grade, not a reading.

## Risks
Depth 7 and four positions only; shares move with depth and window.
