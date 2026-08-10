---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-bapm
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T14:46:30Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: cut `ABC-025` — close `ABC-013`'s five proven criteria gaps — to Definition of Ready

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
The opening decision note names the exact `ABC-013` context files that carry the evidence, the shape
of the gap, and one scoping error of mine you are explicitly not bound by.

Claim this subtask per `agent-factory/workflows/17-task-claim.md` before you start. `scripts/claim.js`
does not exist in this install — prior hops verified that at the source and took the claim by hand
with a plain atomic `mkdir`. Verify it yourself rather than inheriting it, then do the same.

## What "done" means for this hop

`plans/tickets/ABC-025-<slug>.md` exists and **passes every line of
`agent-factory/checklists/definition-of-ready.md`**, or the lines it fails are recorded explicitly as
failures with a reason — the `ABC-024` precedent, where you recorded 8-of-10 rather than rounding up.
I will run that checklist against your output before pulling it into `In Development`.

## The bar this project holds you to, stated plainly

You have found acceptance defects at the pull gate on every recent ticket, several of them
unsatisfiable-by-construction or witnessed by wrong builds that passed every original criterion. That
is the standard here, and it applies to a ticket you author yourself.

**The specific trap:** this ticket's whole subject is *criteria that failed to catch wrong builds*.
Acceptance criteria that merely re-state the five mutants would close five holes and leave the class
open. Derive the criteria from the property, then check the property against the mutants — not the
other way round. If a criterion cannot be witnessed by a build that fails it, say so.

## Explicit non-instructions

- I set **no file-count bar** and **no row-count bar** on this or any later hop.
- I do **not** tell you the size, the priority, or how many criteria there should be. Size it, and if
  it sizes XL, emit `SPLIT_REQUIRED` and stop — no XL enters dev.
- I do **not** assert that this ticket delivers zero production lines. The opening note records that
  expectation and its basis; if you measure otherwise, that is a finding and it outranks my
  expectation.
- Do not re-open `ABC-013`, `ADR-0004`, or `EPIC-003`'s `parseSan` contract. `src/san.ts` is merged
  and its md5 is on the record.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only — a `finding` needs a real stamp and
you will not have one on this hop, so soft results are `claim` / `observation`. Update
`plans/board.md` (one line per ticket row — read the format rule at the top of that file) and
`plans/traceability.md` for the row you create. Mark the subtask done per Workflow 17.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
