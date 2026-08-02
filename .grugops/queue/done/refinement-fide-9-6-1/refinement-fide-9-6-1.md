---
task: refinement-fide-9-6-1
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-fide-9-6-1/
enqueued_by: orchestrator
enqueued_at: 2026-08-02T20:54:54Z
---

Settle FIDE 9.6.1 — open question 1 in `memory-bank/60-progress.md`, recorded against merged code.

Read the `ref:` context folder first (Workflow 16). Everything this subtask needs is behind that
pointer; nothing is inlined here.

NOTE — degraded substrate: this install has no `scripts/claim.js`, so the atomic claim of
Workflow 17 step 2 cannot be executed. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/refinement-fide-9-6-1/` → `done/` by hand and say so.
