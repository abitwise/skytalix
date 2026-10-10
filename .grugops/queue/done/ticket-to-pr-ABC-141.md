---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-141
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-141-comments-abc010-leaves-stale-six-queens-count-and-fullmove-bound-pointer.md
ref: .grugops/context/ticket-to-pr-ABC-141/
source_refs: .grugops/context/bapm-fold-book-chain-2026-10-10/notes/ (…46534e0b: ABC-141 re-score, count 7), .grugops/context/wave-2026-09-25/notes/*owner-word-uat-q4-5c8e2a17.md (comment-only waiver), .grugops/context/qe-ABC-132/probe/exit132.mjs, memory-bank/50-decisions/ADR-0011* (P8 trigger)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:42:36Z
branch: grugops/ABC-141-stale-comments
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-141` — the comments ABC-010 left stale

XS, P3, DoR 10/10. The ticket page is the contract (three comment spans: `src/move-input.ts`,
`src/move-input.test.ts`, `src/history-pane.ts`). Re-verify the premise at the current tip first (derive count
on a `git archive` copy, never in the worktree's `src/`); if stale, STOP and report.

## Stop conditions
- Comments only. Prove it with BOTH owner-Q4 measures: every changed line is a comment (parser-based), and
  comment-stripped `transpileModule` output is identical for each production file (`exit132.mjs`).
- `src/history-pane.ts` is guarded by `src/history-pane.nfr.test.ts` text pins (ADR-0011 R5–R5d, P8 trigger).
  If your edit lands inside any pinned span or an `it` body, STOP and report.
- Any other path — STOP.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR
worktree only (`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC
stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`).
Committed probe scripts may be run with node/bash/python3; if refused, say so and use your own harness.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence, both
Q4 measures, `src/` numstat, branch + sha.
