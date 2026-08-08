---
task: ticket-to-pr-ABC-015
subtask: security-nfr-abc015-gate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-015/
enqueued_by: orchestrator
enqueued_at: 2026-08-08T19:38:00Z
---

Gate `ABC-015` on branch `grugops/ticket-to-pr-ABC-015`. The ticket is in `In Security/NFR`; that
exit is yours — forward it, or send it back with the required fix named.

Read the `ref:` context folder FIRST (Workflow 16). BA/PM (twice), the Software Engineer, QE and the
Orchestrator have all published there. **Nothing is inlined here** — no data is relayed to you
through the Orchestrator.

Two things are explicitly NOT pre-decided for you, and neither should be taken from any note:

- **The ticket's "no security trigger" claim.** This module reads `process.env`, which is a real
  ambient data source. `ABC-014`'s gate CORRECTED such a claim rather than ratifying the ticket's
  wording. Re-derive it and say what actually holds the property, not what the ticket says holds it.
- **`NFR-007`'s bar — zero filesystem and zero process operations.** Do not cite the delivered
  guard: QE found that guard blind to `node:fs/promises` and widened it. A guard that was wrong once
  is a thing to re-derive on your own harness.

The acceptance criteria were amended TWICE today and are settled as of commit `e93b084` — 15
criteria. No renumbering occurred, so citations in earlier notes still resolve.

On UAT: read what `ABC-014` did and why, and rule honestly. This module has zero runtime importers
and there is no CLI entry point until `EPIC-006`.

`security.asvs_level` is `L1`, `security.block_on` is `high`, `compliance_regime` is `[]`.
`AGENTS.md` has the real commands.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Move this file `pending/` → `claimed/ticket-to-pr-ABC-015-sec/` → `done/` by hand with a `claim.md`
registry record beside it, and say so. Hand-write notes into the `ref:` folder's `notes/` in the
schema's exact shape. **`finding` is NOT admissible — no §14 gate exists here to issue a stamp.
Never self-stamp.**

Never commit on `main`. Never merge and never deploy — a human holds both.
