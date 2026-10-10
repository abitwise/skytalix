---
task: wave-2026-09-25
subtask: qe-ABC-136
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-136-licence-guard-operands-are-unpinned.md
ref: .grugops/context/qe-ABC-136/
source_refs: .grugops/context/ticket-to-pr-ABC-136/notes/ (…5b359211, …881e15e2) — on the ticket branch; .grugops/context/qe-ABC-057/ (your earlier gap register + planter)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:49:34Z
branch: grugops/ABC-136-licence-operands (tip 520fa185)
---

# Subtask: QE `ABC-136` — the licence guard's two operands are pinned (ADR-0011 R5b)

Verify A1–A5 independently. Re-run the kill ledger yourself and add your own operand narrowings that keep
the gate clean (other `.filter` forms, a narrowed `directory`, a renamed binding, a moved statement) —
which stay green? Confirm ABC-057's seven spans are byte-identical and the `biome-ignore` line is justified
and scoped to one statement. Re-take the cost reading (narrow set `src/history-pane.nfr.test.ts`, base
`c715b3c2`/head/twin) when load allows; if inadmissible, say so with load1.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, gaps with severity, cost state, gates, branch + sha.
