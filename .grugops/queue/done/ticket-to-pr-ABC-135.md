---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-135
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-135-a8-instrument-reads-comments-as-specifiers.md
ref: .grugops/context/ticket-to-pr-ABC-135/
source_refs: .grugops/context/bapm-owed-batch-2026-10-10/ (…26ea8322, probe/), .grugops/context/qe-ABC-054/notes/ (…ee331683)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:56:05Z
branch: grugops/ABC-135-a8-comment-specifiers
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-135` — `A8`'s consumer instrument reads a comment as a specifier; pin two properties

DoR 10/10, XS, P3. The ticket page is the contract. Test-only, ONE path: `src/render-seam.test.ts`.
Re-verify the premise at the current tip first (the four comment spellings over-count; the two unpinned
properties hold); if stale, STOP and report. BA/PM's feasibility probe is a pointer, not a design.

## Stop conditions
- Any path other than `src/render-seam.test.ts` — STOP (includes `src/history-pane.nfr.test.ts`, which is
  fenced by the page).
- The real-tree consumer readings (1,190 pairs / 92 consumers per BA/PM) must not change; if they do, STOP.
- Cost per `ADR-0035` (proposed, per-set floor amendment): narrow set + twin, report R and load1.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence
(mutants red before/after), cost, `src/` numstat, branch + sha.
