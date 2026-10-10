---
task: wave-2026-09-25
subtask: qe-ABC-140
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-140-composer-tripwire-call-and-comparator-are-unpinned.md
ref: .grugops/context/qe-ABC-140/
source_refs: .grugops/context/ticket-to-pr-ABC-140/ (notes …f8b6efb4, …1d12c309; probe/RUN.txt) — on the ticket branch; .grugops/context/design-qe137-2026-10-10/ (plant.mjs), .grugops/context/qe-ABC-137/ (your own harness)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T17:06:16Z
branch: grugops/ABC-140-composer-tripwire-pins (tip dcc8dcca)
---

# Subtask: QE `ABC-140` — the composer tripwire's call and comparator are pinned (ADR-0011 R5d)

Verify A1–A6 independently with your own harness (base `6dde3261`, code `795adca4`). Add your own narrowings of
the composer call and comparator that keep the gate clean (other matcher swaps, operand reshapes, a helper
indirection) — which stay green? Check the docblock's new three-instrument wording against the file and
ADR-0029 decision 2. Confirm the five existing pins and the raw-reader declarations unchanged. If committed
probe scripts are refused, say so and use your own harness.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, gaps with severity, gates, branch + sha.
