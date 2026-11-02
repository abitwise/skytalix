---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:05:34Z
subtask: arch-phase2-p1
role: architect-design
ref: .grugops/context/arch-phase2-p1/
branch: new grugops/arch-phase2-p1 from main (0d7b9d2f) — worktree .claude/worktrees/arch-phase2-p1. Probes may build on grugops/ABC-264-fix (4d1c0616, reverse futility, QE part 2 running) in a scratch checkout.
width: records; any probe ≤ 5 min and wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; deterministic node counts only, no timing (a game read holds the host).
---
# Design the next Phase 2 ticket: P1 (LMR by a log table, history-adjusted)
## Read
EPIC-011 Phase 2 rows (P1, P3–P6), ADR-0056 D2/D5/C2′, ADR-0026, ABC-121 (flat 1-ply LMR), ADR-0050, ADR-0059 (accepted; ABC-264 in QE), src/search.ts on grugops/ABC-264-fix.
## Do
- Confirm P1 is the next best Elo-per-cost Phase 2 item (vs P5/P3/P6) on top of ABC-264; if not, design the one that is and say why.
- Write its ADR (PROPOSED; amending ABC-121's LMR / ADR-0026 doors as needed): formula, depth/move-index ranges, exclusions (checks, captures, killers, PV), off-door pair, pre-registered A4 node bar and falsifier, expected GAIN vs NEUTRAL intent (C2′: page names it before the read).
- Note: code waits until ABC-264 merges (shared src/search.ts).
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-phase2-p1, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
