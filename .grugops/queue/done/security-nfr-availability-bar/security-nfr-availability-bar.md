---
task: refinement-deploy-posture-2026-08-06
subtask: security-nfr-availability-bar
role: security-nfr
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-deploy-posture-2026-08-06/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T22:00:00Z
---

Rule the `nfr.availability` bar against a project that deploys nowhere, and check whether any other
NFR row or accepted risk depends on a deploy target.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator's decision note and the
Architect's published notes from the hop before you. Nothing is relayed to you; read them.

You own the `nfr` block of `.grugops/factory.config.json` and `plans/nfr-catalog.md`, nothing else.
`AGENTS.md` is the Scribe's and runs beside you — do not write it.

NOTE — degraded substrate: no `scripts/claim.js`, no `scripts/context-io.ts`. Move this file
`pending/` → `claimed/security-nfr-availability-bar/` → `done/` by hand and say so. Hand-write notes
into `notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here.
Never self-stamp.
