---
task: wave-2026-09-25
subtask: bapm-cut-abc147-lever
role: ba-pm
ref: .grugops/context/bapm-cut-abc147-lever/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
---

# Subtask: cut the P1 lever ticket that ABC-147's pre-registered rule calls for

ABC-147 (branch `grugops/ABC-147-vitest-overhead-probe` @ 4c634f09; decision note `…d689c50d`, A2/A3 `…a6122481`, caveats `…144c6b5d`) reads:
- recoverable R = 34.2 % of lane CPU, band 29.7–35.8 % (cold-call lower edge 26.0 %);
- vitest runs production code at 4.93–5.38x plain node per node, with the same output digests;
- the ≥ 15 % arm says: cut a **P1 lever ticket, routed to Architect/Design**.

Cut it (ABC-150):
- First, a diagnosis: WHY is it ~5x? The cause is untested; candidates for the Architect are transform/sourcemaps, worker thread flags, and module interop.
- Then a measurable lever with a pre-registered bar against ABC-144's base. It must compose with ADR-0040 (k = 3) and keep `isolate` on (ADR-0008 d7).
- Name the owner's goal: "choking CPU and generating heat".
- Carry the profiler-hang caveat (5/18 `--cpu-prof` runs hit 60 s).

Also note on ABC-146 that the same factor is why its verdict moves to node, and sync ABC-146's stale "addendum PROPOSED" (it was accepted 2026-10-11).
Do not touch `src/` or `plans/board.md`. Take no measurements. Never merge or push. Work in your own worktree. Recommend the board moves.
