---
task: wave-2026-09-25
subtask: qe-ABC-055
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-055-board-renders-ten-of-thirteen-columns.md
ref: .grugops/context/qe-ABC-055/
source_refs: .grugops/context/ticket-to-pr-ABC-055/notes/ (…5fe79e2e, …252c5012) — on the ticket branch; .grugops/factory.config.json
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:50:20Z
branch: grugops/ABC-055-board-headings (tip 86926927)
---

# Subtask: QE `ABC-055` — `plans/board.md` renders all 13 columns

Verify A1–A5 independently on the branch's `plans/board.md` (headings = table rows, same order; every
`(WIP live/limit)` limit = the dial; live counts = row counts; only the FORMAT comment and two headings
changed; one `_Updated:` line). Judge the skip statement (four skippable columns; `Ready for Dev` left off)
against the kit's workflows. Note: the wave's board has moved since the branch was cut (the Orchestrator
resolves the merge) — verify on the branch, and say what must hold after merge (heading/limit invariants).

## Fences
No `src/`. Docs fixes on the branch only if a criterion fails. Never merge; never push. No ADRs,
`AGENTS.md`. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
post-merge invariants to check, gaps with severity, gates (lint + test), branch + sha.
