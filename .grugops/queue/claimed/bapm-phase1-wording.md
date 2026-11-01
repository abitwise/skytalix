---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T23:12:17Z
subtask: bapm-phase1-wording
role: ba-pm
ref: .grugops/context/bapm-phase1-wording/
branch: new grugops/bapm-phase1-wording from main (worktree .claude/worktrees/bapm-phase1-wording)
width: records only, beside se-ABC-238 (src only).
---
# BA/PM: Phase 1 page wording after ADR-0058 / ADR-0025 T2, plus owed LOW cleanups
## Inputs
arch-epic011-phase1 observation …1dcdd8c7 (wording changes for BA/PM), decisions …2c2c1df6 (T1), …3209a6d0 (T2).
## Do
1. ABC-238: DoR row 10 met (reading (b): build may start; read/merge wait for owner acceptance); priority P2 consistent; drop stale "ABC-253 changes the TT keys first" lines; acceptance aligned to ADR-0058 (doors, drift check, falsifiers, reads). ABC-237: ADR half met, hold "ABC-238 merged or closed" stays; acceptance aligned to the T2 amendment (A2/A3, T6/T7; the 100-game read is a breakage guard at 100 ms — state the limit). ABC-257: carry the three re-checks. ABC-236: note the instability coupling. ABC-081: dated line (A1 revised by ADR-0058, binds older doors).
2. LOW cleanups: stale lane figures in EPIC-010 (l.~79–83) and EPIC-011 (l.~292–296) → Levels 57 / 577 s, ladder 18 / 23 s, UCI 241 / 291 s; ABC-253 front matter → dropped/Done.
## Fences
plans/tickets/ (named), plans/epics/EPIC-010*/EPIC-011* (named lines/rows), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main. Queue moves inside your worktree.
## Publish
Sealed notes (task bapm-phase1-wording, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.
