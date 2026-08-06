---
task: ticket-to-pr-ABC-014
subtask: engineer-abc014-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-014/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T09:10:00Z
---

Implement `ABC-014` — the board frame renderer — on branch `grugops/ticket-to-pr-ABC-014`, which
already exists and is branched from merged `main` (`ed42d26`). The ticket is in `In Development`;
the exit you own is `In Development → In Review`.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator published its pull decision
there, including the no-design-hop ruling and what it does NOT authorize. Nothing is inlined here.

This ticket had NO design hop and needs none. The three cross-ticket contracts are already settled
in `EPIC-002` (amendments `[A4]`, `[A1]`/acceptance `2b`, and acceptance `4a`) — read them at the
epic, not from any summary. Acceptance `4a` explicitly leaves the exact row split to you.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-014-dev/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
