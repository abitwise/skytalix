---
task: wave-2026-09-25
subtask: qe-ABC-139
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-139-cadence-comment-quotes-the-formula-its-cite-disowns.md
ref: .grugops/context/qe-ABC-139/
source_refs: .grugops/context/ticket-to-pr-ABC-139/ (notes …5b2e91c4, …8d4a07e3; probe/) — on the ticket branch; .grugops/context/qe-ABC-129/notes/ (QE-129-a)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:20:15Z
branch: grugops/ABC-139-cadence-comment (tip daa5184a)
---

# Subtask: QE `ABC-139` — the cadence comment now quotes the formula its cite states

Verify A1–A4 independently. Judge the new arithmetic against the code (`runLines`' outcomes, `eof` →
`exiting`, `turn-loop.ts` "The render cadence") — is "= 4" exactly right and complete? Judge the extra
in-block wording change ("one more frame per `board`, three in all"). Re-take both owner-Q4 comment-only
measures yourself with a positive control that fits this file. If committed probe scripts are refused, say
so and use your own harness.

## Fences
Comment-only fixes inside the ticket's block only if a sentence is wrong (then say so); no other `src/`.
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
comment-only measures, gaps with severity, gates, branch + sha.
