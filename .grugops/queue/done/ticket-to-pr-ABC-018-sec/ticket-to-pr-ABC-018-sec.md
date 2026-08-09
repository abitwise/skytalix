---
task: ticket-to-pr-ABC-018
subtask: security-nfr-abc018-gate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-018/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T09:50:00Z
branch: grugops/ticket-to-pr-ABC-018
---

# Subtask: gate `ABC-018` and take the `In Security/NFR` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). Nothing is inlined here — ten
notes from BA/PM, the Engineer and QE are in there, and **two of them route an open question to this
gate by name**. Read them at the source.

`In Security/NFR` is 1/2. The exit is yours.

This ticket carries the epic's one real security trigger and it is named in the ticket itself, with a
measurable bar. It also carries `NFR-002`'s write half — the half the catalog records as
`UNKNOWN - verify` and which nothing had measured before this ticket.

Re-derive the bars on your own instruments. The Engineer measured and QE declined to re-derive; a
number you did not produce is not a number you may report as gated.

Publish typed notes per Workflow 16. `finding` is not admissible on this task — see the substrate
section of the Orchestrator's first note.
