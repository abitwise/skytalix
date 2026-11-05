---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T21:48:45Z
subtask: arch-ABC-307-records
role: architect-design
ref: .grugops/context/arch-ABC-307-records/
branch: new grugops/arch-ABC-307-records from main — worktree .claude/worktrees/arch-ABC-307-records
width: the records owed after ABC-307's merge. No src, no test.
---
# Records after ABC-307
1. F1 on the run rule: the 23rd line (…ad217a34 3; page § Open 4). Name the line and where it lives. If it needs an AGENTS.md edit, do not make it: hand the exact words to the Orchestrator for the Scribe, with the byte cost against the 18,432 B cap.
2. ADR-0046's stale qe-hop 35 and row 10: bring them to what merged at bce24018.
3. ADR-0075's undated 640 KiB lines: date them.
4. K5's half of ADR-0075 F2, needed before K4's PREREG: write it, or say what it waits on.
Dated insertions, never a rewrite of history. If any item would move a bar or a level, stop and say so.
Fences: ADRs and your records only. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
