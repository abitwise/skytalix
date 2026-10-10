---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-131
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-131-drop-the-four-budget-edge-puzzle-rows-for-a-0p8x-margin.md
ref: .grugops/context/ticket-to-pr-ABC-131/
source_refs: memory-bank/50-decisions/ADR-0034-a-puzzle-red-on-an-evaluation-ticket-is-classed-per-row-and-only-budget-drift-goes-to-the-owner.md (decision 5 = (b) at 0.8x, owner 2026-10-10), plans/nfr-catalog.md (RISK-003 section)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:19:04Z
branch: grugops/ABC-131-drop-edge-puzzles
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-131` — drop the four budget-edge puzzle rows for a 0.8x margin

XS, P1. The ticket page is the contract. `ABC-126` (corpus repairs) is merged (`f8aa31cf`) and `ABC-087`
too (`b696d8e8`). Re-verify the premise at the current tip first: baseline reads 58/62 today (Orchestrator
ran PUZZLE_DEEP on the merged tip: 17 passed, solved 58/62 = baseline); the four rows the page names are
the ones to drop. If stale, STOP and report.

## Notes
- `src/puzzle-corpus.ts` is a PRODUCTION file: this ticket is not waived — owner UAT word at the end.
- Run `PUZZLE_DEEP=1` at base and tip (ADR-0034 option B trigger); report load1, wall, solved/total and
  the budget margin under ADR-0034 decision 5 (0.8x) — the catalog's RISK-003 figure reads
  `UNKNOWN - verify` until this ticket's reading exists.
- Do not touch `ABC-083`'s scope (it follows this ticket).

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`, `plans/nfr-catalog.md`. Own worktree;
link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory.
Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence,
PUZZLE_DEEP readings, cost, `src/` numstat, branch + sha.
