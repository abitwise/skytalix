---
id: 20261009T155500Z-orchestrator-decision-3b8e51d0
kind: decision
by: orchestrator
at: 2026-10-09T15:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-102
  - ABC-086
  - ABC-082
supersedes: 
---

Owner (Olger Oeselg), 2026-10-09, verbatim: "you pick ticket(s), run 3 in parallel"

Picked three lanes, width 3 (= `queue.wip_limit`, `In Development` limit 3):
- `ABC-102` `undo` (S, P1, EPIC-006) — DoR 7/10 at cut; both blockers since discharged on the record: `ABC-120` (arms) and `ABC-046` (`COMMAND_TABLE`, `ADR-0021` ruling) are Done; EPIC-004's engine reply exists (`ABC-078`…`ABC-081` Done).
- `ABC-086` deterministic move selection under a fixed seed (S, P0, EPIC-004) — DoR 8/10; `ABC-078` Done; search now carries PVS/LMR (`ABC-121`, `ADR-0026`).
- `ABC-082` evaluation — pawn structure (S, P1, EPIC-004) — DoR 9/10; `ABC-076` Done.
Not picked: `ABC-084` (P0) — its ⚠️(10) is who runs an opt-in gate and at which transition, an owner call; put to the owner at the next report.
Each lane: BA/PM re-score (WF07) → if `Ready`, Engineer (WF04) → QE (WF05) → `Ready for UAT`. The Orchestrator does not re-score another role's DoR. Lanes stop at `Ready for UAT`; acceptance is the owner's.
Overlap: `ABC-086` and `ABC-082` both sit in EPIC-004 engine code; a value-changing evaluation can move merged search bars — merge order decided when both are built.
Stale claims `qe-ABC-080`, `rescore-abc081` (2026-09-25) left in place: both tickets are Done; a sweep would re-pend finished work.
