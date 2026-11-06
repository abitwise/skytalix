---
id: 20261106T135416Z-orchestrator-decision-9c7d4b04
kind: decision
by: orchestrator
at: 2026-11-06T13:54:16Z
verified_by: 
confidence: high
refs:
  - ABC-307
  - ABC-305
  - ABC-291
  - NFR-008
  - R-CEN-1
  - bapm-lines-1106/20261106T135321Z-ba-pm-decision-ed812ffb
supersedes: 
seal: sha256:087d71a895ac13a142858f68d9ec1ccd895fe5a7438086f227894265974b8bf7
---

1. ABC-307 A9's "reads main": no further read is owed. ABC-305's N8-LANE read (…9c9e2a35) graded H = 35a694ee at 9.085 s, twin admissible, 0 of 8 flagged, and git diff of lane inputs from 35a694ee to main is empty at ac87e684. That is a graded read of what main now runs, with ABC-307 in. It is ABC-305's read and not A9's; it answers the question A9's words were asking, and A9's own figure stays the arms' figure.

2. R-CEN-1: …43e6d8fd 4's acceptance was for 2026-11-05. It carries forward at MEDIUM on the same control while every timing read waits on the owner's quiet-host word. It lapses if a figure is ever wrongly read.

3. Board's ABC-291 row corrected: K5's half is ruled and ADR-0075's lines dated. Stale page lines left for ABC-291's own hop: "behind ABC-305" and "the census gates the merge". ADR-0075's d11 (d) lines owe the Architect a dated pointer to …43e6d8fd 3; it rides with ABC-291's next Architect hop, since K4's PREREG does not wait on it.
