---
task: wave-2026-09-25
subtask: qe-ABC-114
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
ref: .grugops/context/qe-ABC-114/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-114-instrument-comments (tip 8895a9a0; code 67296100; base 7411f73a)
---

# Subtask: QE on `ABC-114`. You are A7's validator.

The Engineer wrote every replacement sentence and validated none of them. **You validate each one by re-running its
own reading: never by reading the Engineer's notes and agreeing.** The build notes are under
`.grugops/context/ticket-to-pr-ABC-114/notes/` on the branch.

## Rule on these
1. **A1–A7, each re-read independently.** That includes the planted M9 / D3 / D4 / M15 builds (revert each one and confirm porcelain is empty).
2. **The substituted control.** `main:` is byte-identical to the tip for both files, because ABC-113 is on main. The Engineer used `cc037b3e^`, the pre-ABC-113 files, as the row-level control instead, and read 2 unrelated drift reds row by row. Is that a valid control for the ticket's clause? If not, what is?
3. **A4 STRIKE on measurement.** The hoisted G03 build played the move in 6 of 6 FIFO runs, so the move-eaten outcome was never seen. Is STRIKE right, and is "in Node" the correct scope? The Engineer says the pre-registered trigger fired, so the ticket re-sizes to XS. Confirm it, and name the re-size for BA/PM. Do not edit the page's size.

## Fences
Do not touch production `src/`, `plans/board.md`, or the ticket's front matter. Take no timing readings for grading; the machine is loaded.
FIFO runs are behaviour, not timing, so they are allowed. Never merge or push. Commit on the ticket branch, in your own worktree.

## Publish
Publish notes per Workflow 16 with a verdict of PASS / PASS_WITH_GAPS / FAIL, and a trace row at the END of `plans/traceability.md`, plus a § QE section on the
ticket. Move the queue file pending → claimed → done by hand, in the main checkout, uncommitted.
