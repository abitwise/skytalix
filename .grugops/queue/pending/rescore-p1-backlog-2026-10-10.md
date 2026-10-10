---
task: wave-2026-09-25
subtask: rescore-p1-backlog-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/rescore-p1-backlog-2026-10-10/
source_refs: plans/board.md (Backlog rows for ABC-085, ABC-093, ABC-094, ABC-095; EPIC-004, EPIC-005), memory-bank/50-decisions/ (ADR-0027, ADR-0028, ADR-0031, ADR-0032, ADR-0034 — accepted), src/levels.ts (ABC-087, merged)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:59:15Z
branch: grugops/rescore-p1-backlog-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM — re-verify and re-score the P1 backlog: ABC-085, ABC-093, ABC-094, ABC-095

These are the P1 tickets left in Backlog (August scoring). Re-verify every premise at the current wave tip
first — August premises have gone stale before (ABC-051, ABC-010, ABC-119). Since they were cut: ABC-087
(difficulty levels) merged; ADR-0031/0032/0034 accepted; ABC-131 (puzzle rows, awaiting owner UAT) and
ABC-083 (king safety/mobility, blocked behind ABC-131) are in flight. For each ticket: DoR re-score, size,
priority, dependencies and pull order, files touched (and overlaps with ABC-083, ABC-010 and ABC-141), the
production-file/UAT expectation, and any Architect design question that must route via `In Design` first.
Note the ABC-085 risk recorded on the board (levels 3/4/5 may not separate).

## Fences
Docs only: the four ticket pages (no column changes), your notes. No `src/`, `plans/board.md`, ADRs,
`AGENTS.md`. Never merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory.
Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. If committed probe scripts
are refused, say so and use your own harness.

## Publish
Notes per Workflow 16, trace rows at the END of `plans/traceability.md`. Queue pending → claimed → done (by
hand, main checkout, uncommitted). Report per ticket: DoR, size, priority, dependencies, recommended column
(Ready / Ready for Dev / In Design / stays Backlog) and pull order; owner questions; branch + sha + numstat.
