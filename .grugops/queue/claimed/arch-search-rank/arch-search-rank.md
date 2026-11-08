---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T18:08:56Z
subtask: arch-search-rank
role: architect-design
ref: .grugops/context/arch-search-rank/
branch: new grugops/arch-search-rank from main — worktree .claude/worktrees/arch-search-rank
width: records only; one ranking read for the owner. Nothing run. No ADR status change, no ticket, EPIC, board or src.
---
# Which held search ticket, if any, is worth the next try
The owner skipped P1 (my note at 2026-11-08T18:08:56Z under orch-2026-10-30a) and wants step-by-step gains at 100 ms. Read your …569849c4 and …9ae6cff1, ADR-0056 D2/D6, and each page: X1 ABC-296, X2 ABC-297, V3 ABC-298, T3 ABC-257, P5 ABC-285, P6 ABC-287, T4 ABC-258 / ABC-237.
For each, on today's main: what it is in one line; the rows that have caught this kind of change before (zugzwang 7/7, both mate floors, drift cap, G1, node ratios, NFR-008); whether a reason beyond a guess says it passes them; whether 100 ms can see its gain; cost (ADR, freeze, probe, build, 100 games); and odds, honestly.
Then rank them and pick one, or say plainly that none is worth host time. Plain words, a table, under a page, in a sealed decision note. If a pick needs an ADR, say so; do not write it in this hop.
Fences: your records and one trace row. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
