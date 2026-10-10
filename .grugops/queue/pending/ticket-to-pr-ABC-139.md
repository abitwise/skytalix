---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-139
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-139-cadence-comment-quotes-the-formula-its-cite-disowns.md
ref: .grugops/context/ticket-to-pr-ABC-139/
source_refs: .grugops/context/bapm-abc010-qe129a-2026-10-10/notes/ (…6e1b4d27 item 2), .grugops/context/qe-ABC-129/notes/ (…83afd95b QE-129-a), .grugops/context/qe-ABC-132/probe/exit132.mjs (comment-only measure)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:15:39Z
branch: grugops/ABC-139-cadence-comment
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-139` — the cadence comment quotes the formula its cite disowns

XS, P3, DoR 10/10. The ticket page is the contract: one comment in `src/command-input.test.ts` (~`:412`).
Re-verify the premise at the current tip first; if stale, STOP and report. Comment-only: prove it with both
owner-Q4 measures (comment lines + comment-stripped compile identity) — if the committed `exit132.mjs` is
refused by the permission layer, say so and use your own; do not ask anyone else to run it.

## Fences
`src/command-input.test.ts` only, comments only. Never merge; never push. No `plans/board.md`, ADRs,
`AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE
scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence,
comment-only proof, `src/` numstat, branch + sha.
