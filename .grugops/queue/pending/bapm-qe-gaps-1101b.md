---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:28:55Z
subtask: bapm-qe-gaps-1101b
role: ba-pm
ref: .grugops/context/bapm-qe-gaps-1101b/
branch: new grugops/bapm-qe-gaps-1101b from main (worktree .claude/worktrees/bapm-qe-gaps-1101b)
width: records only, beside se-ABC-250.
---
# BA/PM: route the second batch of QE gaps (all LOW/INFO)
## Gaps (notes on main)
- QE-260-a LOW (qe-ABC-260 …be1935aa): regex literals holding a quote or \/\/ can still hide code from the source scans; none exists today. Orchestrator ruling: no ticket — add a dated review note on ABC-251 (beside QE-259-c's note).
- QE-261-a LOW (qe-ABC-261 …c385f9a2): early-exit row reads only a king-move-first board; add a pawns-first board (e.g. 4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1).
- QE-261-b LOW: promotion row is white-only; add colour-mirrored boards.
- QE-261-c LOW: add a dated note on ABC-250 (and ABC-251/252 if they touch generation order): a generator reorder breaks ABC-261's precondition — re-board, never drop the bar.
- QE-255-a LOW (qe-ABC-255 …f41a5b6e): no offline row covers machine.txt's control: line.
## Do
Decide: bundle QE-261-a/b (+ QE-255-a if natural) into one XS test-only ticket, or decline with reason (diminishing returns is an acceptable reason; say which plants then stay uncaught). Add the notes to ABC-250/251(/252). Keep DoR honest; tag EPIC-010 milestone 1b only if it must land before ABC-251, else EPIC-011 M0.
## Fences
plans/tickets/ (named + new), plans/epics/EPIC-010*/EPIC-011* (rows only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-qe-gaps-1101b, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.
