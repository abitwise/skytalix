---
task: refinement-2026-08-04
subtask: ba-pm-generator-defect-and-abc014-knot
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-2026-08-04/
enqueued_by: orchestrator
enqueued_at: 2026-08-04T09:00:00Z
---

Two items, both unowned, both blocking the next pull order from being fixed honestly. Size and rank
the first; untie the second; state the resulting pull order.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator's decision note there states
what is owed and why this comes before `ABC-012`. The evidence for item 1 lives in the
`ticket-to-pr-ABC-011` context folder; read it there rather than accepting any summary of it.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/refinement-2026-08-04/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to
issue a stamp. Never self-stamp.
