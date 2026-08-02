---
task: ticket-to-pr-ABC-011
subtask: architect-abc011-ep-availability
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-011/
enqueued_by: orchestrator
enqueued_at: 2026-08-02T21:40:00Z
---

Design hop for `ABC-011` — settle the open design question the ticket assigns to this role by name
("hand to Architect/Design at the design hop, do not decide in dev"), then move the ticket
`Ready → In Design → Ready for Dev`.

Read the `ref:` context folder first (Workflow 16). Everything this subtask needs is behind that
pointer or on the ticket; nothing is inlined here.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-011/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
