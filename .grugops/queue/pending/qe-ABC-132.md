---
task: wave-2026-09-25
subtask: qe-ABC-132
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-132-three-production-docblocks-cite-the-deleted-frame-producers-list.md
ref: .grugops/context/qe-ABC-132/
source_refs: .grugops/context/ticket-to-pr-ABC-132/notes/ (…02fdd27a, …b830b38d) — on the ticket branch; .grugops/context/qe-ABC-129/probe/ (exit-probe.mjs, controls.mjs)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:34:55Z
branch: grugops/ABC-132-stale-docblocks (tip 9f8db35a)
---

# Subtask: QE `ABC-132` — three production docblocks no longer cite the deleted frame-producers list

Verify A1–A4 independently, and judge each new sentence against the code and ADR-0029 (is `render-seam.ts`
really the declared `COMPOSITION_ROOT`; is "only `src/cli.ts` imports it" true for `result-screen.ts`; is the
`cli.ts` census line accurate?). Re-take BOTH owner exit measures yourself on the three production files
with a negative control — the UAT waiver rests on your reading.

## Fences
Comment-only fixes inside the ticket's sites only if a sentence is wrong (then say so); no other `src/` edits.
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
exit measurements per file, gaps with severity, gates, branch + sha.
