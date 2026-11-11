---
id: 20261111T081049Z-orchestrator-decision-c8863988
kind: decision
by: orchestrator
at: 2026-11-11T08:10:49Z
verified_by: 
confidence: high
refs:
  - ABC-318
  - 20261111T081006Z-qe-e2e-decision-387f257c
  - 20261111T073837Z-orchestrator-decision-f1dce7dd
supersedes: 
seal: sha256:5bdc5142fc7e8bde12bbb3dab04cfdf5b9df0255ad7bb8b77f9e9a6a2ed4c8f1
---

ABC-318 Done. Merged to main at f30aeb0b; its tree equals the QE-gated tip bd9bb5e9, so QE's gates stand for main:
- lint;
- typecheck;
- unit, 2740/2740;
- build;
- pair-check, 52/52;
- the levels deep lane, 58/58 (L6 real clock 10 000–10 002 ms against a 12 000 ceiling);
- the UCI A8′ row.

UAT is signed by QE PASS_WITH_GAPS …387f257c per the 2026-10-22 ruling; this ticket has production lines, so there is no waiver. Level 6 thinks 10 s a move from this merge. ADR-0045, ADR-0044, ADR-0052 and NFR-004 are amended; the L6 ceiling is 12 s.

Gaps carried to the next docs pass:
- (1) L6's top edge: the method gives 2413.1, which rounds outward to 2420. The README shows 2410, from my cut note.
- (2) `src/levels.test.ts` lines 395 and 404 say "3 s" in text; this is stale since ABC-228 and no assertion is wrong.
- (3) The SE note …ca282d42's lane claim was wrong; QE ran both rows, so nothing is open.

Release v1.1.0 (MINOR, a level retuned) waits on the owner's word. Nothing is pushed.
