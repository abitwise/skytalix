---
id: 20261010T150216Z-software-engineer-decision-abc131-swap-only-first-two-8b02d7e4
kind: decision
by: software-engineer
at: 2026-10-10T15:02:16Z
verified_by:
confidence: high
refs:
  - ABC-131
  - QE-131-b
  - commit:b31ce2bb
  - src/puzzle-suite.baseline.json
supersedes:
---

# Correct the order only. Keep the original measurements, and do not re-record the baseline

The brief asks for the field to be corrected to match the existing raw readings. So the fix reorders the
three `Duration` values the engineer measured, and this run's 29.87 s is not written into the baseline.
`measuredAt`, `measuredOn` and `load` still describe those three processes, so the baseline's provenance
stays one coherent measurement. This run's `PUZZLE_DEEP=1` reading only confirms the gate. It is logged
in the artifact-ref and is not part of the signed file.
