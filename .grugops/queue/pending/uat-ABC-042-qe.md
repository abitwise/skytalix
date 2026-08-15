---
task: uat-ABC-042-2026-08-15
subtask: uat-ABC-042-qe
role: qe-e2e
workflow: agent-factory/workflows/06-uat-pack.md
ref: .grugops/context/uat-ABC-042-qe/
parent_ref: .grugops/context/uat-ABC-042-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T10:58:00Z
branch: grugops/uat-ABC-042-qe
base: grugops/uat-ABC-042-pack @ TIP — branch by NAME, not by sha
phase: 2
---

# Subtask: validate that the tests back the `ABC-042` UAT scenarios

Workflow 06 step 3. **Read the pack from `.grugops/context/uat-ABC-042-pack/` (Workflow 16), never
from another agent — nothing is relayed.** Read the parent ref first for the stop conditions.

## The question this subtask answers

**Which UAT scenarios are backed by an automated test, and which are not** — scenario → test file
and case, by name. Where a scenario rests only on the UAT run, say so; that is a coverage gap, not a
defect.

## Scope fences

- **Write ONLY your own `ref:` notes folder.** No board, no traceability, no metrics, no ticket page.
- **No new test files and no test edits on this hop.** Gaps are reported, not filled — filling them
  is a ticket the Orchestrator cuts.
- **Do not sign off.** No agent records a human acceptance signature.
