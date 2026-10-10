---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-128
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-128-the-take-back-edge-has-no-keyhistory-guard.md
ref: .grugops/context/ticket-to-pr-ABC-128/
source_refs: .grugops/context/cut-followups-2026-10-10/ (decision …8ba05150, probe/)  .grugops/context/qe-ABC-051/ (M9)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:27:02Z
branch: grugops/ABC-128-take-back-guard
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-128` — the take-back edge's `keyHistory` guard

DoR 10/10, XS, cut today. The ticket page is the contract.

## Stop conditions
- Any file other than `src/turn-loop.test.ts` (and the page's own list) would change — STOP.
- `src/turn-loop.ts`, `src/turn-loop.nfr.test.ts` (ABC-051 awaiting UAT), `src/command-input*`
  (ABC-036), puzzle files (ABC-127) — never touched.
- `N8-LANE` > 650 ms CPU — STOP and report.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md`, ADRs. Own worktree; link
`node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory.
Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence (M9 red before/after), N8-LANE,
`src/` numstat, branch + sha.
