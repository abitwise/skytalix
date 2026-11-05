---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T12:30:40Z
subtask: bapm-rows-cut-1105
role: ba-pm
ref: .grugops/context/bapm-rows-cut-1105/
branch: new grugops/bapm-rows-cut-1105 from main — worktree .claude/worktrees/bapm-rows-cut-1105
width: records only; nothing run. No test, build or engine.
---
# Cut the row-move ticket
Read Security/NFR's decision …19cea480 and readings …e5e57903, the Orchestrator's latest decision note, and ABC-302's page for the form.
Cut ABC-307: the nine named rows move to deep lanes with remnants, then a graded NFR-008 re-read. The qe-hop trio moves together or not at all. It merges before or with the next lane-adding merge. Bars from the census: skip-probe bar −0.31 s, kill parity per row, ABC-241 A7's own mutant read. Remnants and kill parity are the Architect's, owed; say so on the page and score DoR honestly. The NFR-008 catalog line (9.515 s) rides with its graded read. Update ABC-303's and ABC-305's § Dependencies with one dated line each, and EPIC-011 § Tickets. While on EPIC-011, fix rows 43, 55, 57 and the reads-queue line; ABC-305 DoR row 10; ABC-291 DoR row 5 (dated wording, per bapm-lines-1105c's unsettled list).
No bar on another ticket moves. Fences: plans/tickets, plans/epics and your records only. No ADR, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-rows-cut-1105, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
