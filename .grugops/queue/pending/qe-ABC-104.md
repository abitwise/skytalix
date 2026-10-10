---
task: wave-2026-09-25
subtask: qe-ABC-104
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-104-coordinate-move-totality-claim.md
ref: .grugops/context/qe-ABC-104/
source_refs: .grugops/context/ticket-to-pr-ABC-104/ (…30823a98, …a2addac5)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:30:05Z
branch: grugops/ABC-104-coordinate-move-docblock (tip 76237852)
---

# Subtask: QE `ABC-104` — verify the comment-only header repair in `src/coordinate-move.ts`

Verify A1–A3 independently against the page. Re-run the two throwing calls and the control yourself.
Confirm the diff is comment-only (every changed line in `src/` is inside the block comment) and that the
new text is accurate against `ADR-0004` clause 2. Judge the engineer's flag: the `:25` heading
"ONE CALLER OBLIGATION" may now read as contradicting the new type-level obligation — report it as a gap
with severity, do not fix it.

## Fences
No `src/` production edits (the page forbids adding a test; if you believe one is owed, report it as a
gap). Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Commit only on the ticket branch
from your OWN worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE
scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict (PASS / PASS_WITH_GAPS /
FAIL), per-criterion evidence, gaps with severity, gates, branch + sha.
