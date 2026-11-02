---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T21:36:26Z
subtask: arch-E1
role: architect-design
ref: .grugops/context/arch-E1/
branch: new grugops/arch-E1 from main (at dispatch) — worktree .claude/worktrees/arch-E1
width: records; probes ≤ 5 min each wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; node counts + the arch-next-pull eval instrument; no timing.
---
# Design E1: full tapered evaluation, folding ABC-231 (king by phase) and ABC-232 (passed pawns by phase)
Read arch-next-pull notes (…4de572aa, …d0f1a5fc, …7e3ace66 — ranking, eval instrument), ADR-0056 (E1/E2, Q-3K-4 open), ABC-231/232 pages, ABC-205 history (died on G6 cost), src/evaluate.ts.
- Write E1's ADR (PROPOSED): phase computation, which terms taper (PST mg/eg pairs, king table, passed pawns by rank+phase, others as you judge), per-node cost budget, off-door pair, pre-registered bars (drift vs E1 is expected — use play-relevant bars: mate floor, zugzwang, G1, the eval instrument as INFORMATION only, a node-cost bar for G6), intent GAIN, falsifiers.
- Design for BOTH Q-3K-4 outcomes: default "G6 ≥ base binds" (so cost per node must be near zero — say how, e.g. incremental phase/PST); and the alternative (judged on play with NFR-005's depth-6 floor). State the cost you measure.
- Pre-wire for E2 (ABC-239 tuning): parameters in one table.
- Fix owed LOW: ADR-0056 D2 P1 row "parked after P3" (if not already present).
- Name what BA/PM needs to cut the E1 ticket (ABC-231/232 folded).
Fences: memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Delete scratch; leave nothing running.
Publish: sealed notes (task arch-E1, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
