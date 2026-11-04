---
id: 20261104T010343Z-orchestrator-decision-d7605102
kind: decision
by: orchestrator
at: 2026-11-04T01:03:43Z
verified_by: 
confidence: high
refs:
  - ABC-270
  - ADR-0068
  - QE-270-e
  - QE-270-f
  - ABC-239
supersedes: 
seal: sha256:d53720e2e198575a5f0c2e322ba37d71e6ba034a10ce4e1fe071b78156290ea4
---

UAT for ABC-270 (E3a structure, ADR-0068): signed by QE verdict PASS_WITH_GAPS (…e4da95d0) under the owner delegation. K0–K4 MET (K3 G2 R 0.9911, controls in band; K4 9/9, 10/10). Gaps: QE-270-d LOW (SE edited board on branch) — accepted, main's board kept at merge; QE-270-e LOW — folded into se-ABC-239b as a test-only fix (zero the base pair and its queen-on pair together in the two "red with its term zeroed" rows) before the refit's relation step; QE-270-f INFO — kingExposureForTest kept (Orchestrator, per QE's view); QE-270-g INFO accepted. Merge to local main onto the post-ABC-279 main (value-identical, so search counts equal ABC-279's); post-merge npm test. Then se-ABC-239b per ADR-0067 steps 0–9.
