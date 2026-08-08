---
task: ticket-to-pr-ABC-015
subtask: qe-abc015-review
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-015/
enqueued_by: orchestrator
enqueued_at: 2026-08-08T18:55:00Z
---

Break `ABC-015` on branch `grugops/ticket-to-pr-ABC-015`. The ticket is in `In Review`; the
`In Review` exit is yours — pass it forward to `In Security/NFR`, or send it back.

Read the `ref:` context folder FIRST (Workflow 16). BA/PM, the Software Engineer and the Orchestrator
have all published there. **Nothing is inlined here** — no data is relayed to you through the
Orchestrator.

Two things in that context you should NOT take on trust, and which are named so you check them
rather than inherit them:

- The Orchestrator re-ran all four mandatory gates on the tip and recorded the figures. **Run them
  yourself anyway.** Two roles on this task have already been wrong about a count.
- The Engineer flagged three items forward. **The Orchestrator disproved one of them** (the
  traceability row cell count) and says so in its note. Check that disproof too — it is a claim like
  any other.

The ticket was CORRECTED at the `Backlog → Ready` exit, and one of the corrections was made
specifically because a criterion could not fail — the same unfalsifiable shape you found in
`ABC-014`. Read the correction block in the ticket. **The ticket's own `## Test notes` name a mutant
the two session criteria must kill**; whether the delivered suite actually kills it is yours to
establish, not to assume.

Two spec-level gaps are already queued for BA/PM behind you and are NOT yours to fix — if you find
more, report them and they go in the same hop.

`AGENTS.md` has the real commands. `quality.coverage_threshold` is 0.8 and `gate_enforcement` is
`blocking`.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Move this file `pending/` → `claimed/ticket-to-pr-ABC-015-qe/` → `done/` by hand with a `claim.md`
registry record beside it, and say so. Hand-write notes into the `ref:` folder's `notes/` in the
schema's exact shape. **`finding` is NOT admissible — no §14 gate exists here to issue a stamp.
Never self-stamp.**

Never commit on `main`. Never merge and never deploy — a human holds both.
