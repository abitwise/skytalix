---
task: wave-2026-09-25
subtask: fix-ABC-104
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (fix-forward before UAT)
ticket: plans/tickets/ABC-104-coordinate-move-totality-claim.md
ref: .grugops/context/fix-ABC-104/
source_refs: .grugops/context/qe-ABC-104/notes/20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19.md (QE-104-a/b/c)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:36:48Z
branch: grugops/ABC-104-coordinate-move-docblock (tip 227853a4)
---

# Subtask: fix-forward `ABC-104` — close QE-104-a/b/c in the same docblock before UAT

The owner signs this exact docblock, so it must be exact. Close the three LOW gaps in QE's register (read
it and the probe output; re-run the probe yourself after editing):
- **a** — the `:25` caller-obligation count must agree with the obligations the docblock now states.
- **b** — attribute to `ADR-0004` clause 2 only what clause 2 states; anything else is this file's own.
- **c** — the "wrong type throws" sentence must not claim more than the behaviour (QE measured six
  wrong-type calls that return); the two quoted throwing calls stay exact.

A1–A3 must still hold (A3: comment-only, inside the header; stripped-compile output identical to base).

## Fences
Comment-only, `src/coordinate-move.ts` only. No tests. No ADR edits (QE-104-d is routed to the Architect).
Never merge; never push. No `plans/board.md`, `AGENTS.md`. Own NEW worktree (old ones are removed);
link `node_modules` into it only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC
stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery addendum. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: per-gap before→after text, A1–A3
re-check, gates, numstat, sha.
