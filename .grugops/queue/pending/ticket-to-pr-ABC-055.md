---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-055
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-055-board-renders-ten-of-thirteen-columns.md
ref: .grugops/context/ticket-to-pr-ABC-055/
source_refs: .grugops/factory.config.json (#wip_limits), plans/board.md (FORMAT comment, columns table), memory-bank/50-decisions/ADR-0036-…md (§ Canonical clause (b), cited by the page's Security section)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:43:55Z
branch: grugops/ABC-055-board-headings
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-055` — add the `In Analysis` and `In Design` headings to `plans/board.md`

XS, P1. The ticket page is the contract. The Orchestrator is HOLDING its own board writes while you work,
so the board will not move under you — keep the diff to the page's scope (two headings in flow order
between `Ready` and `Ready for Dev` with `(WIP live/limit)` read from `.grugops/factory.config.json`, the
skip statement, the FORMAT comment's config-path correction, one invariant line). Re-verify the premise at
the current tip first (heading count vs the table; the dial's limits); if stale, STOP and report.

## Stop conditions
- Do not move, add or remove any ticket row, `_Updated:` line or other column heading/count.
- Any `src/` file — STOP (0 production files per the page).

## Fences
Never merge; never push. No ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: per-criterion evidence, the
`plans/board.md` diff, gates (lint + test), branch + sha.
