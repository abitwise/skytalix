---
task: ticket-to-pr-ABC-015
subtask: bapm-abc015-promote
role: ba-pm
workflow: agent-factory/workflows/07-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-015/
enqueued_by: orchestrator
enqueued_at: 2026-08-08T18:12:00Z
---

Decide whether `ABC-015` is promoted `Backlog` → `Ready`. That column exit is yours, not the
Orchestrator's, which is why this is a subtask and not a board edit someone else made.

Work on branch `grugops/ticket-to-pr-ABC-015`, which already exists and is cut from merged `main`
(`f1743a3`). Never commit on `main`.

Read the `ref:` context folder FIRST (Workflow 16) — the Orchestrator published its routing decision
there, including what this request displaces on the pull order and what the pre-check found.
**Nothing is inlined here on purpose.** Then read the ticket, the board and the merged source
yourself; do not take the Orchestrator's pre-check on trust — re-check it, and say so if it is wrong.

The decision is yours to make either way. A refusal to promote, with the missing input named, is a
valid and useful outcome — this subtask is not a request to rubber-stamp.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-015-promote/` → `done/` by hand and say so in a `claim.md`
registry record beside it. Hand-write notes into the `ref:` folder's `notes/` in the schema's exact
shape. `finding` is NOT admissible — no §14 gate exists here to issue a stamp. Never self-stamp.

Do not implement anything, do not touch `src/`, and do not move the ticket past `Ready`.
