---
id: 20261115T020500Z-orchestrator-decision-2bfa1b06
kind: decision
by: orchestrator
at: 2026-11-15T02:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-324
  - ABC-323
  - qe-ABC-323/20261115T015501Z-qe-e2e-decision-f1531600
  - orch-2026-10-30a/20261111T044438Z-orchestrator-decision-152bb16f
  - arch-ABC-318/20261111T074410Z-architect-design-decision-d82c4579
  - README.md
  - CHANGELOG.md
supersedes: 
seal: sha256:0d6e5fd0aff18e3043316ff4f69171312f6babb2fe92873c131933617a742f66
---

Owner, 2026-11-15: "A" — re-project L6 and L7 from L5's measured figure (QE …f1531600 medium gap, option A) before the README and CHANGELOG change. This cuts ABC-324, in three hops, in order:
1. arch-ABC-324 (Architect/Design): re-derive the L6 (10 s) and L7 (30 s) projections anchored on measured L4 2 094.3 ± 47.9 (1 s) and L5 2 412.9 ± 51.1 (4 s), replacing the model of …152bb16f / …d82c4579. Must state the implied gain per doubling, how the unmeasured Stockfish time-scale effect enters (it may inflate the L4→L5 slope; give a range that covers both readings), outward rounding as before, and a decision note. No games, no code.
2. se-ABC-324: README Levels table/text and Strength section, CHANGELOG [Unreleased], per QE …f1531600's recommended wording and the architect's new L6/L7 ranges. Docs only; no src/ change.
3. qe-ABC-324: check figures and wording against the records and the architect note.
No release in this ticket; a release waits on the owner's word.
