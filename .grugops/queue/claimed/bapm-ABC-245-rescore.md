---
subtask: bapm-ABC-245-rescore
role: ba-pm
ticket: ABC-245
ref: .grugops/context/bapm-ABC-245-rescore/
branch: new grugops/bapm-ABC-245-rescore from main (worktree .claude/worktrees/bapm-ABC-245-rescore)
width: records only; no vitest, no timing (an SE shares the host).
---
# BA/PM (records): re-score ABC-245 on the QE-242-a ruling
## Read
plans/tickets/ABC-245-*.md; ADR-0046 § Ruling 2026-10-31 (merged 10492743) and arch-qe242a-ruling's notes on main.
## Do
- Fold the ruling into ABC-245: the row's step is read per level call (level 1's 100 ms; step 10 admitted unless the row asserts child depth or reads an unreferenced in-child property, per the ruling's limit). R1 census line per row.
- Re-score DoR row 10. If it reaches 10/10, say Ready. The board move is the Orchestrator's.
## Fences
Records only: that ticket page (and EPIC-010's table row for it, if its state changes). No board, ADR, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-245-rescore`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
