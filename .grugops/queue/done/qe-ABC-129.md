---
task: wave-2026-09-25
subtask: qe-ABC-129
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-129-cite-turn-loop-by-symbol-not-by-line.md
ref: .grugops/context/qe-ABC-129/
source_refs: .grugops/context/ticket-to-pr-ABC-129/notes/ (…0ec65506, …7c970961) — on the ticket branch
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:19:39Z
branch: grugops/ABC-129-turn-loop-cites-by-symbol (tip 0ee6424e)
---

# Subtask: QE `ABC-129` — `turn-loop.ts` cited by symbol, not by line

Verify A1–A4 independently. Judge every new cite against what its sentence says (does the named symbol /
quoted phrase carry the claim?). Rule on the engineer's deviation at site #10 (`InputSeam` instead of the
table's `PromptOutcome`, traced to `69bb1e38`) — accept, or say it must follow the table.

**Exit measurement (owner's comment-only ruling):** re-take BOTH measures yourself on each of the 6
production files — every changed line is a comment line, AND the `transpileModule` (`removeComments: true`)
output is byte-identical at base `dc90f42d` and tip — and run a negative control. The UAT waiver rests on
your reading. `CLI_DEEP` and the levels lane are your call.

## Fences
Comment-only fixes inside the ticket's sites only if a cite is wrong (then say so); no other `src/` edits.
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
site #10 ruling, exit measurements per file, gaps with severity, gates, branch + sha.
