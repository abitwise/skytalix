---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-acceptance
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T10:32:47Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: correct `ABC-009`'s acceptance in place, inside `Ready`

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here** —
the Orchestrator's decision note carries the Definition-of-Ready result, the four named defects with
the measurements behind each, and the substrate ruling that governs how you claim and how you record.

`ABC-009` was promoted to `Ready` on 2026-07-31 and is still there. This is **not** a promotion — it
is an in-place correction of a ticket already in `Ready`, so it takes **no board move** and `Ready`
stays 3/8.

The Orchestrator's gate came back **AMBER** and named four defects. Defect 1 is the blocking one: the
acceptance criteria do not require fixing the harm the ticket's own `P1` escalation was written about,
so a correct-to-acceptance fix can ship green and leave it live. Fix them where they live — in
`plans/tickets/ABC-009-legalmoves-position-mutation.md` — and name the rejected alternative wherever
you rule between two readings, the way the `ABC-018` correction block does.

Four defects is the floor, not the ceiling. The `ABC-018` precedent on this board is that BA/PM found
five where the pre-check named three; two of them no pre-check had seen. Re-derive rather than
accepting the Orchestrator's numbers — that note's own "what this does NOT establish" section says
plainly that it did not audit the ticket line by line.

Defect 3 touches `ABC-022`'s boundary. `ABC-022` is the sibling ticket in `Ready` and it already names
this seam one-directionally; the reciprocal fence belongs on `ABC-009`. Do not edit `ABC-022`'s
acceptance to close a gap in `ABC-009` — that inversion is the mistake the `ABC-018` correction
explicitly rejected in its own item 2.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task** — see the substrate
ruling in the Orchestrator's note for why, and for what to record instead. Nothing self-stamped.

Hand back when the corrected ticket stands on its own. The Orchestrator re-runs the
Definition-of-Ready gate against it and owns the `Ready → In Development` exit; do not take that exit
yourself, and do not enqueue the engineer.
