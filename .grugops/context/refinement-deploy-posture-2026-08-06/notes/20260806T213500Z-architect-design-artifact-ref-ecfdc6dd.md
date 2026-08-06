---
id: 20260806T213500Z-architect-design-artifact-ref-ecfdc6dd
kind: artifact-ref
by: architect-design
at: 2026-08-06T21:35:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - architect-deploy-posture
  - 20260806T212500Z-architect-design-decision-40352dd5
  - 20260806T212800Z-architect-design-observation-c9b5e699
  - 20260806T213200Z-architect-design-observation-75e59a37
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - memory-bank/30-architecture.md
  - memory-bank/70-runbook.md
  - .grugops/factory.config.json
supersedes: 
---

# Artifacts produced by `architect-deploy-posture` — every file touched, and nothing else

Written on branch `grugops/refinement-deploy-posture-2026-08-06`. Nothing merged, nothing deployed.

| Artifact | Change |
|---|---|
| `memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` | **NEW.** *"This project deploys nowhere and runs locally — the posture, and what stays standing for the day it changes."* Status **`accepted`**, ratified by this role under the owner's standing directive of 2026-08-03; six decision clauses, five alternatives with reasons, and a **seven-row falsifier table** (`D1`–`D7`) |
| `memory-bank/30-architecture.md` | **NEW section** `## Deployment posture — deploys nowhere, runs locally` appended after `## Tech context`, plus the `_Updated:_` line. The as-built fact and the measured evidence; the *why* points at `ADR-0007` per this file's own FORMAT rule. **No existing section, table row or sentence was altered** |
| `memory-bank/70-runbook.md` | **FIRST FILL** — was the shipped empty template. All four shipped headings kept (`Operate` / `Deploy` / `Roll back` / `On-call and escalation`) and the FORMAT comment preserved. States honestly that there is nothing to operate, deploy or roll back; **contains no command at all** and points at `AGENTS.md § Commands` as the single source, so nothing was guessed |
| `.grugops/factory.config.json` | **EXACTLY TWO LINES.** `default_stack.deploy`: `"kubernetes-ready"` → `"none-local-only"`; `environments`: `["dev","staging","prod"]` → `["local"]`. File re-parsed after the edit; **`production_requires_human_confirmation` re-read and still `true`**; the `nfr` block byte-unchanged |
| `.grugops/context/refinement-deploy-posture-2026-08-06/notes/` | Four notes: this one plus one `decision` (the ruling) and two `observation`s (verification evidence; the four flagged-not-fixed gaps) |
| `.grugops/queue/` | `architect-deploy-posture.md` moved `pending/` → `claimed/architect-deploy-posture/` → `done/architect-deploy-posture/`, with a hand-written `claim.md` registry record |

## Files deliberately NOT touched

`AGENTS.md` (Scribe's, next hop) · `plans/nfr-catalog.md` and the config's `nfr` block (Security/NFR's,
next hop) · `plans/board.md` · `plans/traceability.md` · `memory-bank/00-index.md` ·
`memory-bank/60-progress.md` · `plans/releases/**` · every file under `agent-factory/` (KIT,
read-only) · every role adapter under `.claude/agents/` (each carries the never-deploy hard limit) ·
all of `src/` — **no production code changed.**

## Substrate degradation

No `scripts/claim.js` and no `scripts/context-io.ts` in this install (there is no `scripts/` directory
at all). The queue transitions and the `claim.md` record were done **by hand**; these notes were
**hand-authored** into `notes/` in the schema's exact shape. No `index.md` / `index.jsonl` render was
produced, because the tool that produces them does not exist here — consistent with every other task
folder in this repo. **`finding` was not used and nothing was self-stamped**: `verified_by` is empty
on all four notes, which the schema permits for `decision` / `observation` / `artifact-ref`.
