---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:26:44Z
subtask: arch-adr0056-owner-answers
role: architect-design
ref: .grugops/context/arch-adr0056-owner-answers/
branch: new grugops/arch-adr0056-owner-answers from main (worktree .claude/worktrees/arch-adr0056-owner-answers)
width: records only, beside qe-ABC-254 (tests under the lock), se-ABC-249, and bapm-owner-answers (plans/ only).
---
# Architect: fold the owner's three answers into ADR-0056 D5
## Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T152518Z-orchestrator-decision-43098cef.md
"1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."
## Do
1. Per-epic read (replaces your D5 200+200 vs SF): 400 games HEAD-TO-HEAD, epic's closing build vs its starting build, 100 ms each, openings with both colours, one at a time, restart=on, 50 ms margin; pass rule and resolution (~±24 Elo) stated; wall ~1.5 h (pre-approved by owner). Outside opponent now = the smoke (item 3) + the 40/15 claim reading.
2. GAIN/NEUTRAL bars: mark owner-accepted.
3. Smoke vs Stockfish: kept, 10 games at 0.5 s per move (not 4 s); SF settings per C1 at that control; when it is owed (per strength change beside the 100-game read, and per epic). Write the owner's condition as a rule: test controls are harness/config only — no engine code path keyed on the control, budget or a test flag; and validation must show the engine still plays correctly across its difficulty settings (skill levels and time controls in use) — name the cheapest existing lane/harness check that proves it (look in src/ tests and tools/ for skill-level rows) or state what is missing so BA/PM can cut it.
## Fences
memory-bank/50-decisions/ADR-0056* and your notes only. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task arch-adr0056-owner-answers, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.
