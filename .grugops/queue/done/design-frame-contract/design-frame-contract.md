---
task: frame-merge-order-2026-08-11
subtask: design-frame-contract
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/design-frame-contract/
parent_ref: .grugops/context/frame-merge-order-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T21:20:28Z
branch: grugops/frame-merge-order-2026-08-11
---

# Subtask: who owns the frame's row constants, and does `ABC-017`'s `A1` create an import edge

Read `parent_ref:` first — the Orchestrator's `observation` note there carries the measurement this
subtask exists because of, and the `decision` note carries the merge order it feeds.

Two tickets in `Ready` assert the same frame identity from opposite sides, and `ABC-017` states in its
own text that "when both land, neither ticket owns the 8 alone." Neither constant exists in merged
`src/` yet. Settle the contract.

**The ruling that is owed, because a downstream BA/PM hop and a branch decision are both waiting on
it:** does `ABC-017`'s `A1` import `STATUS_ROWS` from `ABC-016`'s module, or not — and therefore do
`ABC-016` and `ABC-017` land as one contract on one branch, or as two tickets in sequence?

Also yours at this hop: the `NFR-002` catalog row that `ABC-016`'s refinement flagged **for
Architect/Design specifically** and did not edit.

Do not smooth the contradiction by choosing whichever reading makes the tickets look clean. If the
honest answer is that the constants belong in a third place that neither ticket currently owns, say
that and say what it costs.

`plans/nfr-catalog.md` is yours to write. `plans/board.md` is NOT — board moves are the
Orchestrator's, and another agent shares this branch. Flag, do not take, anything outside your lane.
