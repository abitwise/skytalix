---
id: 20261021T130200Z-orchestrator-decision-18e4ada0
kind: decision
by: orchestrator
at: 2026-10-21T13:02:00Z
verified_by: 
confidence: high
refs:
  - ABC-164
  - ABC-186
  - 20261021T125315Z-agents-md-scribe-decision-38d2af93
  - 20261021T124920Z-ba-pm-decision-45c39699
supersedes: 
seal: sha256:5534bbd9e5c14ca0a3a7c71b8831efa429148f8bde42646e4e8f75b3607fb083
---

Owner decisions (Olger Oeselg, 2026-10-21, verbatim): "My decision is option A ; ABC-164 priority keep P2 ; Start ABC-186".

- AGENTS.md split: Option A of the Scribe audit (…38d2af93) — all 17 vitest commands stay as bare lines in AGENTS.md; their comments, the governance sections and lane traps move out (memory-bank/45-standing-rulings.md new, 90-agents-md-command-log.md, 40-contributing.md, 00-index.md pointers). Option B (moving 15 command lines, editing ABC-173 A3) is NOT taken.
- ABC-164 stays P2. BA/PM folds Option A into the page and re-scores; the ≤ 18,432 B target stands (the audit estimates ~14,400 B).
- Not yet decided by the owner: lowering the 24,576 B guard after the split; ABC-185's fate after ABC-186. Both stay open.
- ABC-186 pulled now (SE, then QE).
