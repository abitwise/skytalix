---
task: ticket-to-pr-ABC-018
subtask: qe-abc018-review
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-018/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T09:15:00Z
branch: grugops/ticket-to-pr-ABC-018
---

# Subtask: break `ABC-018` and take the `In Review` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). Nothing is inlined here — the
Engineer published five notes, and **one of them hands over an open gap it found and did not close**.
Read them at the source.

`In Review` is 1/3. The exit is yours: forward to `In Security/NFR`, or back to `In Development`.

Two things this ticket makes easy to fake, both named in its own `## Test notes`:
- the screen-model criteria can be degraded into byte assertions that prove a sequence was *sent*
  rather than that the display is *clean*;
- the escape-stripping criteria can be asserted on the sanitizer's return value rather than on the
  emitted stream, which passes even if the writer bypasses the sanitizer.

The ticket was corrected at its `Backlog → Ready` exit — five acceptance defects fixed in place
before promotion. Read the correction block under `## Acceptance`; a criterion that reads oddly
probably reads that way on purpose.

Publish typed notes per Workflow 16. `finding` is not admissible on this task — see the substrate
section of the Orchestrator's first note.
