---
id: 20261104T132230Z-orchestrator-decision-730399e5
kind: decision
by: orchestrator
at: 2026-11-04T13:22:30Z
verified_by: 
confidence: high
refs:
  - ADR-0070
  - ADR-0067
  - R-281-a
  - ABC-271
  - EPIC-011
supersedes: 
seal: sha256:1b0dc8ab74f0939dc064c0ac7e74b38d6521fa533e7ea5eaf4c6ce77d538ac1e
---

arch-ADR-0070-accept merged (notes …212d6a4c, …c7cd07e0). Rulings on its two calls:
1. The door reading is confirmed. Form (a) follows ADR-0068: no new switch or door pair. "The door pair" bar means every existing door reads its pre-ticket counts.
2. U held at 0 for the second pull: accepted, with the reasons in ADR-0070 and ADR-0067 d6.
3. R-281-a is applied by the Orchestrator. Every QE brief whose diff touches a lane input or one of the four moved-row test files carries the four `-t` lines with their expected passed counts, starting with qe-ABC-283 and qe-ABC-271. One run on main at each epic's close. A pointer line in memory-bank/40-contributing.md § Conventions is owed to the next records task.
4. Split the owed BA/PM lines to avoid EPIC-011 conflicts with the running bapm-W1-bundle-cut:
   - the ABC-271 page lines go now (bapm-ABC-271-ready, ticket page only);
   - the EPIC-011 E4/E2/Phase 4 lines fold into the next EPIC-011 cut task.
