---
id: 20261025T123439Z-orchestrator-decision-6eda769c
kind: decision
by: orchestrator
at: 2026-10-25T12:34:39Z
verified_by: 
confidence: high
refs:
  - ABC-207
  - ADR-0048
  - ADR-0031
  - ADR-0028
  - NFR-005
  - EPIC-008
supersedes: 
seal: sha256:1353e1094cde34a9f20a8e4e6f3e80ecf51ffdeba836558e57a03a8b4ec0fb17
---

# Architect hops merged; ABC-207 → In Development

- **arch-adr0048-status (…1592f0ba):** accepted and merged. ADR-0048 § Status has a dated line saying the carve-out ended at 5c91e2e4.
- **arch-design-ABC-207 (…a21b7cc9, …439d6f8c):** accepted and merged. The ruling:
  - MOBILITY_WEIGHT [0,0,4,4,2,1,4] (the king stays at 4, flagged and out of scope).
  - Early-queen term: 25 cp per side while the queen is off its home square and at least 2 minors are home. It sits outside the clamp.
  - The form stays inside ADR-0031 d2, so no ADR change.
  - 12 moved rows in 4 files, by re-pin, ADR-0028 d2 re-find or the oracle rule. 0 relations, 0 levels, 0 NFR bounds.
  - Frozen-clock position-6 d8 −18.02 %, so G6 is predicted MET (record only).
  - Size: S at its upper edge, no split. Relabelling S → M is optional for BA/PM; not routed.
- **Delivery call:** the branch was cut from 0e2358ce, not 5c91e2e4. Its src/ is byte-identical, so this is accepted.
- **Next:** ABC-207 In Design → Ready for Dev → In Development (1/3), via `ticket-to-pr-ABC-207` (SE). It is built exactly to the ruling. Any relation red, any row outside the 12, or any level red → STOP to Architect. No real-clock timing at build.
- **After the build:** qe-ABC-207 runs ALONE — the QE gate, G2, the Test note 4 pre-check, G6 under the EPIC-008 reading rule (n = 5, median), and D under ship rule S1. This is ABC-207's own single reading (…4c3f7639 scope reading, veto open). D base = its merge-base on main.
