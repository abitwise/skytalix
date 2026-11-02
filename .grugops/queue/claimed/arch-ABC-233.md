---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T21:01:36Z
subtask: arch-ABC-233
role: architect-design
ref: .grugops/context/arch-ABC-233/
branch: new grugops/arch-ABC-233 from main (at dispatch) — worktree .claude/worktrees/arch-ABC-233
width: records; probes ≤ 5 min each wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# (1) S′ step to E1810; (2) design ABC-233 (history heuristic, O1h)
Read Orchestrator ruling …8ce2fd23, arch-post-268 notes (…9a7f24af, …1bc554fb), ADR-0056 (S′ re-pin, D2 ordering O1h), plans/tickets/ABC-233*.md, ADR-0060 (P1 parked; history term deferred to O1h) and ADR-0061.
1. ADR-0056: dated amendment — the upward step aims at the trigger band's centre, so the S′ opponent is **E1810**, not E1980; command `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`; pool starts empty at 1810. Keep the rule symmetric for future steps.
2. ABC-233: write its ADR (PROPOSED): history table shape/indexing, update rule (bonus/malus, depth², aging/clear per search), where it orders (after killers), interaction with LMR (ADR-0060's deferred history term — say whether this ticket only orders, and what a later P1 re-measure would add), off-door pair per ADR-0026, pre-registered bars (node A4, reach at 47 000, drift, mate floor, zugzwang, G1, cut audit as info), intent GAIN or NEUTRAL named, falsifiers. Measure on today's main (futility in force).
3. Name what BA/PM needs for ABC-233 DoR 10/10.
Fences: memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Delete scratch; leave nothing running.
Publish: sealed notes (task arch-ABC-233, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
