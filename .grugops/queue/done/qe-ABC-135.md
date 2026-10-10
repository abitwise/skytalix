---
task: wave-2026-09-25
subtask: qe-ABC-135
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-135-a8-instrument-reads-comments-as-specifiers.md
ref: .grugops/context/qe-ABC-135/
source_refs: .grugops/context/ticket-to-pr-ABC-135/notes/ (…75495e30, …f07216ef, …fc504450)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:03:42Z
branch: grugops/ABC-135-a8-comment-specifiers (tip e7123236)
---

# Subtask: QE `ABC-135` — A8's consumer instrument no longer reads comments as specifiers

Verify A1–A4 independently against the page. Re-run the engineer's mutants and add your own: comment
spellings the shared `withoutComments` strip could mishandle (a `//` or `/*` inside a string literal, a
`*/` in a line comment, a URL in a specifier), and any over-strip that would drop a real consumer. Re-derive
A3's real-tree map yourself (1,190 pairs / 92 consumers expected) at base and tip. Judge the decision to
put the six rows in a sibling `it` rather than the existing test.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, gaps with severity, gates, branch + sha.
