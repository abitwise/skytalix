---
task: refinement-deploy-posture-2026-08-06
subtask: architect-deploy-posture
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-deploy-posture-2026-08-06/
enqueued_by: orchestrator
enqueued_at: 2026-08-06T21:00:00Z
---

Rule this project's deployment posture as an architecture fact and record it where it binds.

Read the `ref:` context folder first (Workflow 16) — the Orchestrator's decision note there carries
the owner's verbatim instruction, the reading, the hard constraint, and what is explicitly out of
scope. Do not accept any summary of it.

You own, and nothing else: `default_stack.deploy` and `environments` in `.grugops/factory.config.json`,
`memory-bank/30-architecture.md`, `memory-bank/70-runbook.md`, and an ADR if one is warranted.
The `nfr` block and `plans/nfr-catalog.md` are Security/NFR's and `AGENTS.md` is the Scribe's — both
run after you and read your notes. Do not write their files.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 on this hop and no contention is possible; move this file
`pending/` → `claimed/architect-deploy-posture/` → `done/` by hand and say so. Hand-write notes into
`notes/` in the schema's exact shape. `finding` is NOT admissible — no §14 gate exists here to issue
a stamp. Never self-stamp.
