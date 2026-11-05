---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: arch-ABC-303-w1-rows
role: architect-design
ref: .grugops/context/arch-ABC-303-w1-rows/
branch: new grugops/arch-ABC-303-w1-rows from main — worktree .claude/worktrees/arch-ABC-303-w1-rows
width: records only; nothing run. No test, build or engine.
---
# Which form do ABC-282's 19 rows take with the bundle on?
Read grugops/ABC-303 at 2fd5243b: se-ABC-303-main's notes …1893d3c5, …bd60978c, …c31e9a54, …42aa51f1 and raw/out/failed-rows.txt. Read ADR-0071 (D7, D12), ADR-0072 d7 and d11, ABC-303's test note 4, and the Orchestrator's pins-versus-bars ruling …42c82347.
The STOP: A1 (a), A2 (a) and D5 in the default lane; A0-1, A0-2, A0-3 (16 rows) in deep lanes. They pin W1 on the shipped path and read differently with the bundle on. A scratch diagnosis on the off door reads the pinned figures. The doors take no softMs.
1. Rule each row, or each group: a pin re-pinned old → new and listed, or a row that needs a new position or form because the bundle's new figures no longer exercise what the row tests. For each, name what the row proves and show it still proves that with the new figure. A2 (a) and D5 need this most: a kept partial-iteration move must still be that case.
2. Say whether any row is a bar, or an identity or relation row, which is never re-pinned.
3. Say whether a production change or a door is needed. If one is, say so plainly and stop there: that changes the read's form.
4. Give the engineer one exact list. Reason from code and records; mark what needs a run as `UNKNOWN - verify`. Say if any of this is an owner call.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-303-w1-rows, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
