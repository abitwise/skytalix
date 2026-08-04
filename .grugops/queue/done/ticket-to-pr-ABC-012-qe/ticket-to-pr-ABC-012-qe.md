---
task: ticket-to-pr-ABC-012
subtask: qe-abc012-review
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-012/
enqueued_by: orchestrator
enqueued_at: 2026-08-04T15:00:00Z
---

Review `ABC-012` on branch `grugops/ticket-to-pr-ABC-012`. The ticket is in `In Review`; the exit
you own is the `In Review` exit — `In Review → In Security/NFR` on a PASS, since this ticket carries
five numeric NFR bars.

Read the `ref:` context folder first (Workflow 16). The Software Engineer published five notes there
and the Orchestrator published its pull decision. Everything you need is behind that pointer or on
the ticket; nothing is inlined here.

THREE ITEMS THE ENGINEER HANDED FORWARD RATHER THAN ABSORBED are recorded in its notes, including
one acceptance criterion it reports CANNOT be satisfied as worded. Adjudicate them from the evidence
rather than from the Engineer's framing — the `ABC-011` reviews found real defects by doing exactly
that, twice.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-012-qe/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
