---
task: ticket-to-pr-ABC-018
subtask: bapm-abc018-promote
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-018/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T08:16:15Z
branch: grugops/ticket-to-pr-ABC-018
---

# Subtask: rule on `ABC-018`'s acceptance, then decide `Backlog → Ready`

Read the shared verified context at `ref:` first (Workflow 16 step 1). Nothing is inlined here —
the Orchestrator's routing decision, its Definition-of-Ready pre-check, the discharged blockers and
the three flagged acceptance items all live in that folder and are read at the source, not relayed.

Own the `Backlog → Ready` exit for `ABC-018`. That exit is yours; the Orchestrator did not take it.

Do not inherit the pre-check — re-derive it. The `acceptance testable` row is left AMBER by the
Orchestrator with three named specifics; the last time this gate ran (`ABC-015`, 2026-08-08) it
found two real defects in a ticket whose own Definition-of-Ready block ticked every row green.
`ABC-018`'s block was written 2026-07-30 and has never been re-checked.

Publish typed notes per Workflow 16. `finding` is not admissible on this task — see the substrate
section of the Orchestrator's note.
