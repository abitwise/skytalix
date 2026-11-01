---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:26:44Z
subtask: bapm-owner-answers
role: ba-pm
ref: .grugops/context/bapm-owner-answers/
branch: new grugops/bapm-owner-answers from main (worktree .claude/worktrees/bapm-owner-answers)
width: records only, beside qe-ABC-254, se-ABC-249, and arch-adr0056-owner-answers (ADR-0056 only).
---
# BA/PM: align pages to the owner's answers (follow the owner word; the Architect folds ADR-0056 in parallel)
## Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T152518Z-orchestrator-decision-43098cef.md
"1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."
## Orchestrator rulings on your bapm-100-400-rule questions
- R smoke: owner answered — KEEP a 10-game smoke vs Stockfish at 0.5 s per move beside each strength change's 100-game read (restore it where you dropped it, at 0.5 s not 4 s), and at epic close.
- EPIC-010's close owes the per-epic read: YES — now 400 games head-to-head (head = main after milestone 1b vs base ca6e675c) at 100 ms.
- ABC-255 may be pulled before EPIC-010 closes (C12): yes.
## Do
1. EPIC-010 and EPIC-011: per-epic read = 400 games head-to-head (closing build vs starting build) at 100 ms, ~±24 Elo, pass = per ADR-0056 (if not yet on main, "point estimate ≥ 0, pending ADR-0056 owner-answers fold"); smoke rule (10 games vs SF at 0.5 s); the owner's condition: test controls are config only, no engine code path keyed on them; validation shows the engine works across difficulty settings.
2. Re-check C13 (ABC-256 merged into EPIC-010's close reading) and ABC-255 scope now that the epic read is head-to-head, not vs SF: adjust (the 100 ms control is needed on the head-to-head path; the rpair/r SF path at 0.5 s for the smoke). Keep DoR honest.
3. Tickets whose reading rows you aligned (ABC-231..234, 236..239, 257, 258): add the 0.5 s SF smoke beside the 100-game read; ABC-239's 400-game outside pair: re-word per item 1.
4. If no existing ticket ensures "works across difficulty settings", say so in your Result (the Architect names the check; do not cut a ticket yet).
## Fences
plans/epics/EPIC-010*, EPIC-011*, plans/tickets/ for the tickets above, plans/traceability.md (append), your notes. Not plans/board.md, not memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task bapm-owner-answers, contextRoot = worktree; never the plugin cache), commit, ## Result + trace row here, brief + claim to done/.
