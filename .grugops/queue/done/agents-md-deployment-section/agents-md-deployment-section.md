---
task: refinement-deploy-posture-2026-08-06
subtask: agents-md-deployment-section
role: agents-md-scribe
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-deploy-posture-2026-08-06/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T22:00:00Z
---

Write the deployment posture into `AGENTS.md` so the first file every role reads stops implying a
deploy target this project does not have.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator's decision note and the
Architect's published notes from the hop before you. Nothing is relayed to you; read them.

You own `AGENTS.md` and nothing else. The config's `nfr` block and `plans/nfr-catalog.md` belong to
Security/NFR, running beside you — do not write them.

NOTE — degraded substrate: no `scripts/claim.js`, no `scripts/context-io.ts`. Move this file
`pending/` → `claimed/agents-md-deployment-section/` → `done/` by hand and say so. Hand-write notes
into `notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here.
Never self-stamp.
