---
id: 20261103T220500Z-orchestrator-decision-401c3d09
kind: decision
by: orchestrator
at: 2026-11-03T22:05:00Z
verified_by: 
confidence: high
refs:
  - ADR-0068
  - ADR-0069
  - ADR-0024
  - ADR-0067
  - ABC-270
  - ABC-239
  - Q1
supersedes: 
seal: sha256:25559b6aae3b1b32419aa9c0af458f7a72fe6f6769fa74e1ac64a9c969ba00b0
---

Owner 2026-11-03 (verbatim): "yes, accept ADR-0068 and ADR-0069".
- ADR-0068 ACCEPTED: ABC-270 (E3a) lands as structure only — three queen-on exposure pairs at {0,0}, value-identical and node-identical to main (K0–K4), no games; size S; ABC-239's first pull fits the new pairs (queen-on mg halves free ≥ 0, eg halves held at 0); one read (ABC-239's B-T7/B-T8) covers both. Orchestrator ruling: ABC-270 S2 nps exempt (reported only), as ABC-274.
- ADR-0069 ACCEPTED: Q1 — quiescence skips a SEE-losing capture out of check (form QS), main search unchanged, test-only off-door pair; amends ADR-0024 d4 (SEE pruning enters quiescence; delta pruning and quiet checks stay fenced). Ships only on its own per-change read: 100 games at 100 ms GAIN ≥ 50.0, S′ smoke vs E1810, Levels deep lane.
Order: ABC-270 build and Q1 build run beside ABC-239's tool build; ABC-239's fit is taken on a main containing ABC-270; Q1 merges (or misses) before ABC-239's candidate is frozen for B-T7/B-T8.
