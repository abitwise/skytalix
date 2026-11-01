---
subtask: bapm-epic011-dedupe
role: ba-pm
ref: .grugops/context/bapm-epic011-dedupe/
branch: new grugops/bapm-epic011-dedupe from main (worktree .claude/worktrees/bapm-epic011-dedupe)
width: records only (no vitest, no engine, no games). qe-ABC-223 holds the host STRICTLY ALONE. An Architect hop folds the owner's answers into ADR-0056 beside you (ADRs only).
---
# BA/PM: new epic for the 3 000 path; close-out plan for the open epics; dedupe all epics and tickets (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T124000Z-orchestrator-decision-022fb66f.md (verbatim inside), and …74216a44 (goal 3 000; O1 chosen). ADR-0056 (PROPOSED → accepted in direction), ADR-0055 (ACCEPTED O1).
## Do
1. **Audit every epic and ticket** (EPIC-001…010, every plans/tickets page in Backlog/Ready/Blocked/Dropped and the board's Backlog/Ready): find work that duplicates or conflicts with ADR-0056's path or with each other (same technique cut twice; a Backlog ticket fenced by one epic and wanted by another; dropped tickets ADR-0056 wants re-tried — e.g. ABC-209 after ABC-238, ABC-207/210 forms). Produce a table: ticket/epic, overlaps with, verdict (keep where it is / move to the new epic / merge into X / supersede / drop), reason. No work is done twice.
2. **Close-out plan for the open epics** (owner: finish the others first): EPIC-006, EPIC-009, EPIC-010 (status backlog today). For each: what remains to Done, which remaining tickets are really 3 000-path work (move them to the new epic instead of blocking the close), and the exit reading each still owes. Keep milestone 1b (ABC-250…254, O1) wherever ADR-0055/0056 order says — say where and why.
3. **Create EPIC-011** (the 3 000 Elo classical path, ADR-0056): goal 3 000 read at 40/15 on Stockfish UCI_Elo (scale as ADR-0056 proposes; any part the owner has not confirmed stays marked), fast routine readings at shorter time controls down to 0.5 s/move (owner's word), milestones per ADR-0056 (2 200 … 3 000), phases, the tickets that move in (renumber nothing; re-home with dated lines), and new tickets as titles-only stubs where ADR-0056 names gaps with no ticket (cut full pages only for the first phase's items). Status: backlog, starts after the open epics close. Open owner calls listed: Q-3K-2 (SPRT in the per-change rule), Q-3K-3 (cores), Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8, Q-SP-3 (ABC-254).
## Fences
- plans/epics, plans/tickets only (plus your notes). No board, trace, ADRs, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-epic011-dedupe`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/. Hand the Orchestrator the board moves to make.
