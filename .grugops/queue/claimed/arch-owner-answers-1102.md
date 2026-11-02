---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T13:42:00Z
subtask: arch-owner-answers-1102
role: architect-design
ref: .grugops/context/arch-owner-answers-1102/
branch: new grugops/arch-owner-answers-1102 from main (5695ec63+) — worktree .claude/worktrees/arch-owner-answers-1102
width: records only; no test, build or engine run.
---
# Fold the owner's answers into the ADRs (note …81ae2db4)
## Do (memory-bank/50-decisions only)
- ADR-0059 → ACCEPTED. Also fix QE-264-b: the "static eval < 10 000" wording is false at extremes (−10 535 measured with nine queens) — state the true bound or drop the claim.
- ADR-0058 → ACCEPTED, NOT IN FORCE (switched on only if ABC-257 T1+T3 meets A8′ ≤ 0.93×).
- ADR-0025 T2 amendment → PARKED with ABC-258.
- ADR-0056 → record C: NEUTRAL bar (≥ 43.0/100) allowed for changes invisible at 100 ms, together with the ticket's own measured bar; say who names a ticket as NEUTRAL (its page, before the read).
- ADR-0057 → ACCEPTED with OQ-1 yes (incl. ADR-0044 D5 reversal for thread tickets; amending ADR with the worker-pool ticket), OQ-2 a, OQ-3 c (Threads 1 first), OQ-4 a, OQ-5 no, OQ-6 later. Add a status line to ADR-0044 pointing at the coming amendment. Name the inputs BA/PM needs to cut the ~3 thread tickets (shared table, worker pool + Threads option, lanes) and where they sit in EPIC-011's order now that phase 1 is paused.
## Fences
Records only; no src/tools/tests, no board/plans edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-owner-answers-1102, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
