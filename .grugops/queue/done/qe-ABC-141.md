---
task: wave-2026-09-25
subtask: qe-ABC-141
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-141-comments-abc010-leaves-stale-six-queens-count-and-fullmove-bound-pointer.md
ref: .grugops/context/qe-ABC-141/
source_refs: .grugops/context/ticket-to-pr-ABC-141/ (notes + probe) — on the ticket branch; .grugops/context/qe-ABC-132/probe/exit132.mjs; memory-bank/50-decisions/ADR-0011* (P8)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:49:51Z
branch: grugops/ABC-141-stale-comments (tip 4bfc7b3e)
---

# Subtask: QE `ABC-141` — stale comments after ABC-010

Verify A1–A3 independently (base `957a85c3`, code `f92868f6`): re-count the six-queens derives on a
`git archive` copy with your own counter; check the fullmove paragraph against `parseFen` at the tip. Re-take
both owner-Q4 measures yourself. Confirm the `history-pane.ts` edit is outside every R5–R5d pin and `it` body.

**Flake:** the engineer saw ONE unnamed test failure in one JSON-reporter `npm test` run at the tip (two reruns
clean); ABC-083 was building in parallel. The diff has no executable code, so this is a suite flake, not this
ticket. Run `npm test` at least 5 times (JSON reporter, keep the logs), name any failing test, and record
load1 per run. If it reproduces, log it as a gap with severity and an owner.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never push.
No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only
(`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`).

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence, Q4
measures, flake result, gaps, branch + sha.
