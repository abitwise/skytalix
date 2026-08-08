---
task: ticket-to-pr-ABC-015
subtask: engineer-abc015-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-015/
enqueued_by: orchestrator
enqueued_at: 2026-08-08T18:30:00Z
---

Implement `ABC-015` — glyph mode selection — on branch `grugops/ticket-to-pr-ABC-015`, which already
exists and carries two commits of delivery-state work (no `src/` change). The ticket is in
`In Development`; the exit you own is `In Development → In Review`.

Read the `ref:` context folder FIRST (Workflow 16). The Orchestrator published its routing decision
and its pull decision there, and BA/PM published the two acceptance corrections it made at the
`Backlog → Ready` exit. **Nothing is inlined here** — no data is relayed to you through the
Orchestrator.

**Read the ticket in full, including its `CORRECTED IN PLACE 2026-08-08` block.** The ticket you are
building against is NOT the one that sat in `Backlog`: an input tuple gained a stated output, and the
session criterion was replaced because the old one could not fail.

This ticket had **no design hop and needs none**. One structural choice is explicitly yours and is
deliberately not pre-decided anywhere: **where the session's cached value lives**, given that
acceptance criterion 10 requires the *rule* to read no ambient global while the NFR bar permits the
*session accessor* to read `process.stdout.isTTY` and `process.env`. Both must hold at once. Decide
it, and record the decision as a note.

The NFR bar is measurable and it is yours to meet: **zero filesystem operations and zero process
operations** to reach the answer. There is no µs bar — the ticket says why, and inventing one would
be ceremony.

`AGENTS.md` has the real commands and the 12 coding rules. `quality.mandatory_gates` are lint,
typecheck, unit and build; `gate_enforcement` is `blocking`; `self_fix_attempts` is 2.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Workflow 17 step 2's atomic claim cannot be executed and Workflow 16's sanctioned writer does not
exist. Width is 1 and no contention is possible; move this file
`pending/` → `claimed/ticket-to-pr-ABC-015-dev/` → `done/` by hand with a `claim.md` registry record
beside it, and say so. Hand-write notes into the `ref:` folder's `notes/` in the schema's exact
shape. **`finding` is NOT admissible — no §14 gate exists here to issue a stamp. Never self-stamp.**

Never commit on `main`. Never merge and never deploy — a human holds both.
