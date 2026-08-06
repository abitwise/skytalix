---
task: ticket-to-pr-ABC-014
subtask: security-nfr-abc014-gate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-014/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T09:10:00Z
depends_on: ticket-to-pr-ABC-014-qe
---

Gate `ABC-014` on branch `grugops/ticket-to-pr-ABC-014` after QE/E2E has published. The exit you own
is the `In Security/NFR` exit.

Read the `ref:` context folder first (Workflow 16) — the pull decision and everything the Engineer
and QE published are there. Nothing is inlined here.

This ticket has ONE NFR trigger and NO security trigger; the ticket states both, with the reason for
the second. Do not accept either on this note's word — the ticket's `## Security / NFR triggers`
section is the source, and re-deriving whether the "no security trigger" ruling still holds against
what actually got built is your call, not the Orchestrator's.

Do NOT start until `ticket-to-pr-ABC-014-qe` is in `done/`. This is a chain, not a race.

NOTE — degraded substrate: no `scripts/claim.js`, no `scripts/context-io.ts`. Move this file
`pending/` → `claimed/ticket-to-pr-ABC-014-sec/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
