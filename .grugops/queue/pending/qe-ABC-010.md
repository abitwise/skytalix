---
task: wave-2026-09-25
subtask: qe-ABC-010
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-010-fen-semantic-validation.md
ref: .grugops/context/qe-ABC-010/
source_refs: .grugops/context/ticket-to-pr-ABC-010/ (notes …5b986289 incl. PR-note fixture table, …386fd214; probe/RUN.txt) — on the ticket branch; memory-bank/50-decisions/ADR-0033-…md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:26:30Z
branch: grugops/ABC-010-fen-semantic-validation (tip 2344c015; code 1304cc2c)
---

# Subtask: QE `ABC-010` — FEN semantic validation (ADR-0033)

Break it. Verify every acceptance row and criterion 9 (a)–(f) independently. Hunt for FENs the new rules
wrongly accept (side not to move in check, impossible castling/en-passant, pawn on rank 1/8, king counts,
clock edge cases) and legal FENs they wrongly reject (mutation-test `src/fen.ts`'s rules: drop each check
in turn — which rows red?). Review the fixture re-authoring table: does each re-authored FEN still test what
its row claims (esp. `SIX_QUEENS_FEN` now ending in `#`, and the renamed `san.parse` A4)? Re-run the deep
lanes the fence triggers (at least PUZZLE_DEEP and PERFT_DEEP; load1 logged) and re-read NFR-002 yourself.
Note the engineer also edited `memory-bank/30-architecture.md` (ADR-0033 consequence) — confirm that is
what the ADR requires. If committed probe scripts are refused, say so and use your own harness.

Production (`src/fen.ts`): the owner signs after you — no waiver.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/` edits. Never merge;
never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree
only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, fixture review, deep lanes, NFR-002, gaps with severity, gates, branch + sha.
