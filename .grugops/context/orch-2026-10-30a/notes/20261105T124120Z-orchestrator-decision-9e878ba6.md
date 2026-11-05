---
id: 20261105T124120Z-orchestrator-decision-9e878ba6
kind: decision
by: orchestrator
at: 2026-11-05T12:41:20Z
verified_by: 
confidence: high
refs:
  - ABC-305
  - ABC-307
  - NFR-008
  - R-CEN-1
supersedes: 
seal: sha256:1a17556de0e353b14475da760389b2cc6e2e8277521b56197cd565e1256f8598
---

se-ABC-305 stopped at a VOID N8-LANE read (…2adad06f): foreign vitest through the whole hold, all 8 rounds flagged. No verdict exists, so this is not a miss. Its figures and grade.out's MET lines are not to be cited.

Ruling: a re-read is allowed, on the same harness in a new output directory, under a new PREREG stating the void. It waits for ABC-307's merge. ABC-305 lands on that base anyway, so reading now would need repeating. Gates and deep lanes run in the same later hop, after main is merged into grugops/ABC-305. The branch stands at 148c42e9, grugops/ABC-305 is kept, and se-ABC-305's pending copy stays until landing.

R-CEN-1 has now voided two timing sessions, so LOW understates its nuisance though not its risk to any figure, since voids work as designed. The clear check at the start of a hold cannot guard the rest of it. I will ask the owner to hold the other project's test runs for named windows of a few minutes. Nothing foreign is touched.
