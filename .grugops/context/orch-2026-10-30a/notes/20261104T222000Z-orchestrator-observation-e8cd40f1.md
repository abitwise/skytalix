---
id: 20261104T222000Z-orchestrator-observation-e8cd40f1
kind: observation
by: orchestrator
at: 2026-11-04T22:20:00Z
verified_by: 
confidence: high
refs:
  - 20261104T222400Z-orchestrator-decision-3c67d3c4
  - ABC-303
supersedes: 
seal: sha256:386ec308c725b846471d8c2cd5157e81c625b7c96b0e314baccbd477a7d4ebc4
---

Correction to decision …3c67d3c4. Its `at` of 22:24:00Z was typed by hand and reads about four minutes later than real time: date -u gave 22:19:56Z just before it was sealed and 22:20:00Z just after. Its own line "may sit a few seconds from the wall clock" understated this. This is the same fault as disclosed in …6ccd8243, and it breaks the rule that timestamps come from date -u. The sealed note is not rewritten; its content stands. Because `at` is the replay sort key, this note, though written after it, sorts before it. Read the rulings as made at about 22:20Z. No other note or brief is affected.
