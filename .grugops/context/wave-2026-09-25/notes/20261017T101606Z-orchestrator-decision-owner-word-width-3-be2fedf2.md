---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-17T10:16:06Z
sealed: false
refs: [ABC-155, ABC-056, ABC-039]
---

# Owner word, 2026-10-17 — width 3

The owner said verbatim: **"you can run 3 at the same time as well"**. This lifts the width-1 rule of 2026-10-12.

- In flight now: `qe-ABC-155` (QE), `ticket-to-pr-ABC-056` (Release Manager), `ticket-to-pr-ABC-039` (SE), each in its own worktree.
- Every hop appends to `plans/traceability.md`; the Orchestrator resolves those conflicts at merge (keep both, in date order).
- ABC-039's one board clause stays the Orchestrator's: made on its branch after the register lands, while no other hop writes `plans/board.md` (hops never do).
- Timing readings stay quiet-window only; none of these three takes one.
