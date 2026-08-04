---
task: ticket-to-pr-ABC-012
subtask: security-nfr-abc012-gate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-012/
enqueued_by: orchestrator
enqueued_at: 2026-08-04T18:00:00Z
---

Gate `ABC-012` on branch `grugops/ticket-to-pr-ABC-012`. The ticket is in `In Security/NFR`; the
exit you own is `In Security/NFR → Ready for UAT`.

Read the `ref:` context folder first (Workflow 16) — eleven notes are there from the Orchestrator,
the Software Engineer and QE/E2E. Everything you need is behind that pointer or on the ticket;
nothing is inlined here.

The NFR trigger is five numeric bars on the ticket; the ticket states there is NO security trigger
and gives its reason. Test that statement rather than inheriting it. QE handed you four items BY
NAME, one of which is a hazard in an instrument YOUR column runs. Read its notes for them.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-012-sec/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
