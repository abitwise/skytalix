---
task: ticket-to-pr-ABC-011
subtask: architect-abc011-defect-definition-and-ratify
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-011/
enqueued_by: orchestrator
enqueued_at: 2026-08-03T11:35:00Z
---

Second design hop on `ABC-011`, branch `grugops/ticket-to-pr-ABC-011`. The ticket moved backward
`Ready for UAT → In Design` on the project owner's explicit instruction. You own the `In Design`
exit.

Read the `ref:` context folder first (Workflow 16). The Orchestrator's decision note of
2026-08-03 carries the owner's ruling **verbatim** and states what is owed here; QE's and
Security/NFR's notes carry the defect, its reproductions and its severity ruling. Everything is
behind that pointer or on the ticket; nothing is inlined here.

Also read `memory-bank/60-progress.md` § "Standing directive — who decides" **before** you rule on
`ADR-0005`. Your authority changed on 2026-08-03.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-011-design2/` → `done/` by hand and say so. Hand-write notes
into `notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
