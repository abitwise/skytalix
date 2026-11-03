---
id: 20261103T131102Z-software-engineer-observation-dfb8e1ba
kind: observation
by: software-engineer
at: 2026-11-03T13:11:02Z
verified_by: 
confidence: high: every reading run under the host lock and copied from vitest output; deep lanes not re-run (UNKNOWN - verify)
refs:
  - se-ABC-274-fix
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - arch-ABC-274-seam/20261103T130452Z-architect-design-decision-3169a174
  - S1
  - S2
  - S3
  - A3
  - Q1
  - withParametersForTest
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - c131ecd0
  - 7daae342
supersedes: 
seal: sha256:bb226b44740a5b46e70d4234022ff2de9b1c4585993ca50b272b835d86a916be
---

# se-ABC-274-fix readings: S1–S3 rows green; S2 red before the seam move; both mobility mutants red; unequal halves keep A3 green where c131ecd0's A3 reddened; npm test 2 588/2 588

Raw: `.grugops/context/se-ABC-274-fix/raw/out/runs.txt`.

| row | result |
| --- | --- |
| S1 counter = engine at 1/1, cap 1e6, whole A3 corpus | green |
| S1 probe: params MOBILITY_WEIGHT {4,6} cap {100,80} (temp) | repaired A3 20/20; c131ecd0 A3 reds MOBILITY_WEIGHT + MOBILITY_CAP |
| S1 probe: MOBILITY_WEIGHT {0,4} (temp) | repaired A3 20/20; c131ecd0 A3 reds both mobility families |
| S2 throwing run + throwing loader, Object.is after | red before the move (loader case), green after |
| S3 source pin | green |
| mutant M1 eg mobility reads mg weight/cap | MOBILITY_WEIGHT, MOBILITY_CAP red (2/2) |
| mutant M2 mobility out of egDelta | MOBILITY_WEIGHT, MOBILITY_CAP red (2/2) |
| npm test | 2 588/2 588 (2 585 + 3 added, 0 moved), 66 files |
| biome / tsc | clean / exit 0 |

Mutants and probes were restored by copy; `grep MUTANT`/`PROBE` 0; `src/evaluate-params.ts` byte-unchanged. Deep lanes not re-run: the repair touches only the seam body and one test file (`UNKNOWN - verify` if QE wants them).
