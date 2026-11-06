---
id: 20261106T202400Z-orchestrator-decision-8cab4ca4
kind: decision
by: orchestrator
at: 2026-11-06T20:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ADR-0075
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
supersedes: 
seal: sha256:6a1027f891913a6dfe6cd6cadedbfe101928a8aac58e1bbba7a9542c4f140fa4
---

# se-ABC-291's STOP routed; K1's fixture freeze was missed at dispatch

- Tip 63af973e, path check clean, nothing of the engineer's running (ps). ABC-291 stays In Development.
- arch-ABC-291-stop rules the six ABC-282 A0-3 pins, K1 (h) against d4, the two named SE calls, and owes ADR-0056 D6's line.
- **Orchestrator's miss:** ADR-0075 K1 (c) and test note 1 ask QE to freeze seam fixtures before the build. I dispatched the build without it. A freeze now is after the build and is recorded as such. qe-ABC-291-k1 derives its fixtures blind from d1, d2, seals them, then compares with SEAM_ROWS.
- Drift at d5 (96.79 %, largest 89, against the probe's 100 %, 24) has no bar, but the same values read differently, so QE explains it and states defect or none.
- BA/PM's owed lines wait for the ruling, so one hop carries both. K4, K5 and the read wait for the STOP to clear; the window and W are asked then.
