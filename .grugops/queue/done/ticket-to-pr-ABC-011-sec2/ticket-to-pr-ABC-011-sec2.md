---
task: ticket-to-pr-ABC-011
subtask: security-nfr-abc011-regate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-011/
enqueued_by: orchestrator
enqueued_at: 2026-08-03T16:00:00Z
---

Second risk/NFR gate on `ABC-011`, branch `grugops/ticket-to-pr-ABC-011`. Re-gate the MEDIUM purity
defect fix. The ticket is in `In Security/NFR`; the exit you own is
`In Security/NFR → Ready for UAT` on a PASS.

Read the `ref:` context folder first (Workflow 16). Seventeen notes are there across four roles —
including your own first-pass gate, which sized the defect being fixed, and QE's second review,
which handed two items to this column. Everything is behind that pointer or on the ticket; nothing
is inlined here.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-011-sec2/` → `done/` by hand and say so. Hand-write notes
into `notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
