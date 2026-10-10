---
task: wave-2026-09-25
subtask: qe-ABC-131
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-131-drop-the-four-budget-edge-puzzle-rows-for-a-0p8x-margin.md
ref: .grugops/context/qe-ABC-131/
source_refs: .grugops/context/ticket-to-pr-ABC-131/notes/ (on the ticket branch), memory-bank/50-decisions/ADR-0034-…md (decision 5 = (b) at 0.8x)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:38:44Z
branch: grugops/ABC-131-drop-edge-puzzles (tip 96f3168d)
---

# Subtask: QE `ABC-131` — four budget-edge puzzle rows dropped for a 0.8x margin

Verify A1–A8 independently against the page. `PUZZLE_DEEP=1` at base `679e847d` and tip yourself (load1
logged); re-derive the 0.8x margin (step 1.25 and beyond) and the weakening ledger (17 weakenings; which
survive). Check the baseline file's provenance (`measuredAt` cites `506d80c6`) and that the A6/A8 checks
fail first on the mutants named. Note the engineer's W9 recount (44 not 45 — ABC-126 rewrote a row).

Production files change (`src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json`): no UAT waiver; the
owner signs after you.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/` edits. Never merge;
never push. No `plans/board.md`, ADRs, `AGENTS.md`, `plans/nfr-catalog.md`. Own worktree; link
`node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real
UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
PUZZLE_DEEP readings + margin, gaps with severity, gates, branch + sha.
