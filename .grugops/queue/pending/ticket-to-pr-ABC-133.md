---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-133
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-133-count-the-spawn-pin-over-the-parser-view-not-a-stripped-string.md
ref: .grugops/context/ticket-to-pr-ABC-133/
source_refs: .grugops/context/qe-ABC-059/notes/ (same file just changed), .grugops/context/ticket-to-pr-ABC-059/notes/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:47:14Z
branch: grugops/ABC-133-spawn-pin-parser-view
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-133` — count the spawn pin over the parser view, not a stripped string

S, P3. The ticket page is the contract. `ABC-059` just merged into the same file (`src/cli.test.ts`, one
new `it` after ABC-065's `describe`, `4c33b72b`) — re-verify the page's premise, line anchors and the
`N8_SPAWN` figure (27) at the current tip first; if stale, STOP and report.

## Stop conditions
- Any production file — STOP (test-only ticket).
- Do not alter ABC-059's `it` or ABC-065's `describe` / ABC-042's A1 row (hash them before/after).
- Cost per `ADR-0035` (proposed): narrow set + twin, report R and load1; if inadmissible, say so.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence
(mutants red before/after), cost, `src/` numstat, branch + sha.
