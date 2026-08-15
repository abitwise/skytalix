---
task: uat-ABC-042-2026-08-15
subtask: uat-ABC-042-pack
role: uat-planner
workflow: agent-factory/workflows/06-uat-pack.md
ref: .grugops/context/uat-ABC-042-pack/
parent_ref: .grugops/context/uat-ABC-042-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T10:58:00Z
branch: grugops/uat-ABC-042-pack
base: grugops/uat-ABC-042 @ TIP — branch by NAME, not by sha
phase: 1
---

# Subtask: build the `ABC-042` UAT pack, then RUN it against `main`

**Read the authority and the routing from the parent ref — do not take them from this file.** The
Orchestrator decision at `parent_ref` states what an agent-run UAT is, what it is not, and the four
stop conditions. Read it first (Workflow 16), then the ticket, then work.

## What this subtask delivers

1. **The UAT pack**, per `agent-factory/checklists/uat-checklist.md`: business scenarios, test data,
   pass/fail criteria, the signoff checklist naming the human, and the known limitations.
2. **The run** — execute the scenarios against `main` and report the result.

## Scope fences

- **Base branch is `main`'s content** — `ABC-042` is merged there @ `dbaf972`. Run the delivered
  product, not a branch tip.
- **Write ONLY your own `ref:` notes folder.** No board row, no `plans/traceability.md`, no
  `plans/metrics.md`, no edit to `ABC-042`'s ticket page. The Orchestrator owns those at close.
- **No new production code and no new test files.** This subtask exercises what shipped.
