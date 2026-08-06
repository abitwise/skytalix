---
task: ticket-to-pr-ABC-014
subtask: qe-abc014-break
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-014/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T09:10:00Z
depends_on: ticket-to-pr-ABC-014-dev
---

Break `ABC-014` on branch `grugops/ticket-to-pr-ABC-014` after the Software Engineer has published.
The exit you own is the `In Review` exit.

Read the `ref:` context folder first (Workflow 16) — the pull decision and everything the Engineer
published are there. Nothing is inlined here.

Do NOT start until `ticket-to-pr-ABC-014-dev` is in `done/`. This is a chain, not a race.

NOTE — degraded substrate: no `scripts/claim.js`, no `scripts/context-io.ts`. Move this file
`pending/` → `claimed/ticket-to-pr-ABC-014-qe/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
