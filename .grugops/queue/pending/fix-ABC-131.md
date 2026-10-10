---
task: wave-2026-09-25
subtask: fix-ABC-131
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (fix-forward before UAT)
ticket: plans/tickets/ABC-131-drop-the-four-budget-edge-puzzle-rows-for-a-0p8x-margin.md
ref: .grugops/context/fix-ABC-131/
source_refs: .grugops/context/qe-ABC-131/notes/ (gap register …5e358534: QE-131-b) — on the ticket branch
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:00:04Z
branch: grugops/ABC-131-drop-edge-puzzles (tip cb4a14e4)
---

# Subtask: fix-forward `ABC-131` — QE-131-b, the baseline's `laneWallSeconds` order

The owner signs `src/puzzle-suite.baseline.json`, so its provenance must be exact. QE found the first two
`laneWallSeconds` values swapped against the raw `Duration` lines. Re-read the raw readings yourself and
correct the field to match them, in its own commit, touching nothing else in the file (`solved`,
`unsolved`, `budget`, `step`, `measuredAt`, `reason` unchanged — prove it with a JSON diff). A1–A8 must
still hold; re-run `PUZZLE_DEEP=1` once on the result (load1 logged) and the default gates.

## Fences
`src/puzzle-suite.baseline.json` only (one field). Never merge; never push. No `plans/board.md`, ADRs,
`AGENTS.md`, `plans/nfr-catalog.md`. Own NEW worktree; link `node_modules` into it only. Commit-message
file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery addendum. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: before → after field, JSON diff,
gates, PUZZLE_DEEP reading, sha.
