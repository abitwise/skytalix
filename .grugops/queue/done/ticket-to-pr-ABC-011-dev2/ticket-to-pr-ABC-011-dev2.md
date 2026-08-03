---
task: ticket-to-pr-ABC-011
subtask: engineer-abc011-fix-purity
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-011/
enqueued_by: orchestrator
enqueued_at: 2026-08-03T13:00:00Z
---

Second dev pass on `ABC-011`, branch `grugops/ticket-to-pr-ABC-011`. Fix the MEDIUM purity defect
the owner declined to merge with. The ticket is in `In Development`; the exit you own is
`In Development → In Review`.

Read the `ref:` context folder first (Workflow 16). Nine notes are there across four roles,
including the second design hop's ruling and the Orchestrator's note carrying the owner's
instruction verbatim. Everything you need is behind that pointer or on the ticket; nothing is
inlined here.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-011-dev2/` → `done/` by hand and say so. Hand-write notes
into `notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
