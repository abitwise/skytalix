---
task: wave-2026-09-25
subtask: qe-ABC-133
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-133-count-the-spawn-pin-over-the-parser-view-not-a-stripped-string.md
ref: .grugops/context/qe-ABC-133/
source_refs: .grugops/context/ticket-to-pr-ABC-133/notes/ (…a530d175, …ccb75b95)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:09:05Z
branch: grugops/ABC-133-spawn-pin-parser-view (tip 82104f70)
---

# Subtask: QE `ABC-133` — the spawn pin counted over the TypeScript parser's view

Verify A1–A5 independently against the page; re-run the plant table yourself (Q8–Q14, P1, P-DYN, E-MS1/2,
string control) and add your own: other `child_process` spellings (`node:` vs bare, default/namespace
import, `require` with a template literal, re-export), call shapes the callee resolution might miss or
over-count (optional call `?.()`, `.call`/`.apply`, computed member). Re-measure A4's in-file cost
yourself (load1 logged). Judge the engineer's decisions: binding-list specifiers, callee resolution, and
loading `typescript` via `createRequire` inside the `it` (the ESM import cost gap is measured, not
explained — say whether that matters).

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
plants, gaps with severity, A4 reading, gates, branch + sha.
