---
task: ticket-to-pr-ABC-011
subtask: qe-abc011-review-fix
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-011/
enqueued_by: orchestrator
enqueued_at: 2026-08-03T14:30:00Z
---

Second review pass on `ABC-011`, branch `grugops/ticket-to-pr-ABC-011`. Review the MEDIUM purity
defect fix. The ticket is in `In Review`; the exit you own is `In Review → In Security/NFR` on a
PASS.

Read the `ref:` context folder first (Workflow 16). Thirteen notes are there across four roles —
including your own first-pass review, which found this defect, and the second design hop that ruled
its definition. Everything is behind that pointer or on the ticket; nothing is inlined here.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-011-qe2/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to issue
a stamp. Never self-stamp.
