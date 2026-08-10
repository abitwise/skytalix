---
task: frame-merge-order-2026-08-11
subtask: refinement-ABC-019
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-019/
parent_ref: .grugops/context/frame-merge-order-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T21:20:28Z
branch: grugops/frame-merge-order-2026-08-11
---

# Subtask: `ABC-019` `Backlog` → `Ready` — the loop that sequences every other component

Read `parent_ref:` first for the merge order this ticket sits last in, then
`plans/tickets/ABC-019-turn-loop-skeleton.md`.

`ABC-019` is `L` (5) and `P0`. Its own Definition-of-Ready block claims every item ✅ and says
promotion is a separate BA/PM step. **Test that claim rather than inheriting it.** The last three
refinement hops on this board found 16, 16 and 18 defects on tickets whose DoR blocks also read
clean, and nine of those were witnessed by wrong builds constructed and run against merged `src/`
that passed every criterion the ticket had.

Known board-state input, already measured by the Orchestrator: the board row's
`blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020` are **stale on all four**
— `ABC-020` merged 2026-08-02, `ABC-012` 2026-08-06, `ABC-014` 2026-08-08, `ABC-018` 2026-08-09. This
is the fourth stale `blocked-until` row found on this board. Board hygiene is the Orchestrator's to
apply; the ticket's own Dependencies block is yours.

**One item is owed to this ticket from `ABC-016`'s hop and was explicitly flagged for the
Orchestrator, who is routing it here:** `ABC-016` line 410 — *"What is owed is one line on `ABC-019`'s
side saying its render seam passes the status it just computed."* `ABC-016` deleted its per-frame
`gameStatusOf` call, which is what makes this ticket's `rejected` and non-mutating-`board` criteria
satisfiable at all; before that deletion both were false. Make sure this ticket's text reflects the
seam it actually gets.

Re-derive size and priority. `L` (5) is at the edge: the ticket's own note says *"re-size at the design
hop if the stubs turn out to need more than merged `src/` provides."* If it is `XL` (8), say so — that
is a `SPLIT_REQUIRED` and it routes back to you, not forward.

No deliberate defect list is supplied. This project has recorded twice that the Orchestrator's short
pre-check lists act as anchors, and the hop that was handed zero candidates found the most.

`plans/board.md` is NOT yours — board moves are the Orchestrator's and another agent shares this
branch. Flag, do not take, anything outside your lane.
