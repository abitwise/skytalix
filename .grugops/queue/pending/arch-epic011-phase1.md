---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T22:59:12Z
subtask: arch-epic011-phase1
role: architect-design
ref: .grugops/context/arch-epic011-phase1/
branch: new grugops/arch-epic011-phase1 from main (worktree .claude/worktrees/arch-epic011-phase1)
width: records only, beside arch-adr0057-fix (ADR-0057/0056 only — do not edit those).
---
# Architect: EPIC-011 Phase 1 design — T1 (ABC-238) and T2 (ABC-237)
## Read
EPIC-011 (Phase 1 rows 3–6, C-rows, § The per-change rule); ADR-0056 (D5 100-game GAIN/NEUTRAL read at 100 ms, smoke at 0.5 s, R-TC, Levels lane per strength ticket; "changes that only act deep" note); ADR-0025 (TT) and its d4; ABC-081 (A1); plans/tickets/ABC-238*, ABC-237*, ABC-257*, ABC-258*; src/transposition.ts, src/search.ts as they are on main.
## Do
1. Write the ADR (new, or an amendment — your call) that revises ABC-081 A1 so a deeper stored entry may cut off a shallower search (T1), with value-safety analysis (mate scores, bounds, repetition/50-move interaction, the pre-root repetition scan), and its falsifiers.
2. Write the ADR-0025 amendment for depth-preferred replacement (T2).
3. State the read each ticket owes under ADR-0056 D5 (GAIN bar, smoke, Levels lane) and whether 100 ms (depth ~6) can see the effect; if not, what the ticket's design names.
4. Say what ABC-238/237 DoR row is now met, so BA/PM can move them to Ready. Note any ADR-0057 coupling (shared-table layout) without deciding it.
## Fences
memory-bank/50-decisions/ (new ADR and ADR-0025 amendment only), your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-epic011-phase1, contextRoot = worktree's .grugops/context, never the plugin cache; queue moves inside your worktree), commit, ## Result + trace row, brief + claim to done/.
