---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:20:12Z
subtask: arch-phase2-p3
role: architect-design
ref: .grugops/context/arch-phase2-p3/
branch: new grugops/arch-phase2-p3 from main (at dispatch) — worktree .claude/worktrees/arch-phase2-p3
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# Measure the other Phase 2 items on main; design the best as a fallback
## Read
EPIC-011 Phase 2 rows (P3, P4, P5, P6), ADR-0056 D2 (order now P1 → P4 → P3 → P5 → P6), ADR-0059 (dropped: the depth-1 cut under a piece's value likely skipped forks — heed it), arch-phase2-p1 probe (P3 0.88–0.91×, P5 0.83–0.99× on the old ABC-264 base).
## Do
- On main, measure P4 (late-move/move-count pruning), P3 (futility near leaves), P5 (null move R by depth), P6 (razoring) alone: nodes at depth 8 (both recursions), reach at 47 000 nodes, depth-5 drift, mate floor, zugzwang. Treat ABC-264's lesson as a design constraint (margins vs threats; the drift check cannot see forks — propose a cheap tactical check that can).
- Pick the best Elo-per-cost item that stands independent of P1 and write its ADR (PROPOSED) with pre-registered bars and falsifiers, intent named. Another hop is re-opening ADR-0060 in parallel — use the next free ADR number after checking memory-bank/50-decisions at commit time; don't edit ADR-0060.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025/0060. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-phase2-p3, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
