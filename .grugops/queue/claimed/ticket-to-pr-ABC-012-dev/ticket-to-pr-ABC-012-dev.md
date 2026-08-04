---
task: ticket-to-pr-ABC-012
subtask: engineer-abc012-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-012/
enqueued_by: orchestrator
enqueued_at: 2026-08-04T12:00:00Z
---

Implement `ABC-012` — the game history module `src/history.ts` — on branch
`grugops/ticket-to-pr-ABC-012`, which already exists and is branched from merged `main` (`39e260d`).
The ticket is in `In Development`; the exit you own is `In Development → In Review`.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator published its pull decision
there, including ONE correction you need before you write test 1. Nothing is inlined here.

This ticket had NO design hop and needs none: its two seams were closed by Architect/Design at
decomposition and the ticket's `## Source` says it implements those decisions and does not re-open
them. The seam notes live in `.grugops/context/epic-to-tickets-EPIC-002/notes/` — read them there
rather than accepting any summary of them.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-012-dev/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
