---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:25:07Z
subtask: arch-ABC-234
role: architect-design
ref: .grugops/context/arch-ABC-234/
branch: grugops/arch-ABC-234 — worktree .claude/worktrees/arch-ABC-234 (from main 149bc2ef)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Other hops share the lock (an Engineer build may run) — expect waits; no wall-clock timing reads (node counts, depth and move choice only) unless you note the window was alone. Any single run you'd plan over 1 h: stop and return the question.
---
# Design ABC-234 (SEE orders captures, ordering only)
Owner 2026-11-03: "do design one-by-one for ABC-234, ABC-236 and ABC-239". This is the first; ABC-236 follows after you return.
Read plans/tickets/ABC-234*.md, ADR-0056 (EPIC-011 path, S′ / per-change GAIN 50.0 / NEUTRAL 43.0 rules), ADR-0061 (futility, merged; cut audit), ADR-0063 (history premise not met — killers take ~90 % of quiet cutoffs; reuse its probe shape), src/search.ts, src/quiescence.ts, src/move-ordering (orderMoves).
- Measure the premise on main FIRST, with a PREREG note sealed before any run: how often losing captures (by SEE) sit ahead of quiets today and are refuted; nodes at fixed depth (d8) on the standard corpus; for ordering-only changes the pay gate is ≤ 0.95× nodes or the NEUTRAL route if the ticket qualifies. Include the zugzwang set as a hard gate and the cut-audit if any cut changes.
- Consider SEE also in quiescence (if it already prunes there, say so) — but scope stays the ticket's unless you rule otherwise.
- If the premise holds: write ADR-0065 PROPOSED (test-only off-door pair, file list, test rows, falsifiers, effort). If not: record it like ADR-0063 (proposed, premise not met) and recommend park.
- Note E1 (ABC-269) is being built in parallel and changes evaluate.ts/evaluate-params.ts only; do not depend on it.
Fences: memory-bank/50-decisions + your records + scratch probes (no committed src). Do NOT edit ADR-0056, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-234, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.
