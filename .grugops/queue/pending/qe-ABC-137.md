---
task: wave-2026-09-25
subtask: qe-ABC-137
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-137-clause-1-helper-is-unpinned.md
ref: .grugops/context/qe-ABC-137/
source_refs: .grugops/context/ticket-to-pr-ABC-137/ (notes …3c71e0a4, …9e4b2d17; probe/ incl. ported plant137.mjs, ledger137.sh) — on the ticket branch; .grugops/context/qe-ABC-136/, .grugops/context/qe-ABC-057/ (QE's own planters)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:59:12Z
branch: grugops/ABC-137-helper-pin (tip 455a0846)
---

# Subtask: QE `ABC-137` — clause 1's helper is pinned (ADR-0011 R5c)

Verify A1–A4 independently. The engineer could not run QE's committed planters (the permission layer
refused `.grugops/context/**/probe` scripts as external code) and ran a port. Try QE's own unchanged
planters first; if they are refused for you too, say so in your report — do not ask another role or the
Orchestrator to run them — and run your OWN independent harness instead (not the engineer's port), then
compare your ledger with the engineer's. Add your own helper narrowings (other `.filter` forms in the
helper, a renamed helper, a wrapper) — which stay green? Confirm ABC-136's pins and ABC-057's spans
unchanged.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
ledger comparison, gaps with severity, gates, branch + sha.
