---
task: frame-merge-order-2026-08-11
subtask: refinement-ABC-019-clause9
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-019-clause9/
parent_ref: .grugops/context/frame-merge-order-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T01:32:00Z
branch: grugops/frame-merge-order-2026-08-11
---

# Subtask: `ABC-019` owes two criteria from `ADR-0009` clause 9, which landed after it was promoted

`ABC-019` is in `Ready` and is HELD there — the Orchestrator did not gate it into `Ready for Dev`
because of this gap. `ABC-016` and `ABC-017` are already gated. Closing this is the last step before
`ABC-019` can be pulled.

`ADR-0009` clause 9 (`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`) was amended
after `ABC-019`'s promotion hop and flags two criteria for you:

1. **9d — the stub row counts must NOT be 3/8, and two shapes are wanted.** The measured reason, and it
   is the whole point: **a 3/8 stub is GREEN at `ABC-019`'s own gate and breaks only at the rebase onto
   the real panels.** It arms a landmine. 2/5 or 4/9 go red *at this ticket's own gate* instead, and 4/9
   additionally exercises the append branch that a 3/8 stub never touches. Architect/Design's ruling
   records that stubs already written at 3/8 are **a defect, not a preference**.
2. **9e — the session-height invariant.**

Also inherited from the same ruling, and it changes how this ticket's stubs must be written: **a
consumer of panel rows must not name a row count at all.** The single definition is the delivered rows,
read as `.length`. `DECLARED` fails five of six mutants and on two of them emits 25 rows into a 24-row
viewport; `IMPORTED` is mechanically impossible against unbuilt panels (`TS2307` ×2, exit 2, because the
typecheck is project-wide and blocking); `DERIVED` is the only form both buildable against stubs and
correct at the swap. Make sure this ticket's stub seam cannot be built the wrong way and still pass.

Keep it tight — this is a targeted amendment, not a re-refinement. The ticket's 25 defects were already
fixed and its size (`L`) and priority (`P0`) were re-derived and held; do not re-open settled ground. If
adding these criteria changes the size, say so, and `XL` (8) is a `SPLIT_REQUIRED` back to you.

You may write `plans/tickets/ABC-019-turn-loop-skeleton.md` and `plans/traceability.md`. You may NOT
write `plans/board.md` (the Orchestrator's), `plans/nfr-catalog.md`, or `memory-bank/50-decisions/`.

No other agent is running, so the branch is yours — but still stage only your own paths, and note that
`git commit` takes the whole INDEX unless you pass `-- <pathspec>` (the Orchestrator got this wrong this
round and swept up another role's work).

Report the DoR status when done: is `ABC-019` gateable to `Ready for Dev`, and if not, what is missing.
