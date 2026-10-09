---
task: wave-2026-09-25
subtask: qe-ABC-125
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-125-two-live-virtual-clocks-at-different-steps.md
ref: .grugops/context/qe-ABC-125/
build_ref: .grugops/context/ticket-to-pr-ABC-125/   (on the build branch)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:29:52Z
branch: grugops/qe-ABC-125
base: grugops/ABC-125-two-clocks @ ca3ca0f
diff_under_review: 928c83b...ca3ca0f (src/engine.test.ts +8, test-only)
---

# Subtask: QE gate for `ABC-125` (two live virtual clocks) — small, test-only

Build: 1531/1531, 0 skips; M5 reds the row; `N8-LANE` met. Reproduce the criteria independently.
Focus: (1) re-plant M5 yourself; (2) the OPPOSITE mutant the build left `UNKNOWN - verify` — the
FIRST factory call's step wins; (3) one more of your own (e.g. a shared reading counter with
per-clock step); (4) is `toEqual` on the six readings exact enough (float equality is safe for
dyadic steps — say so or not). Keep it short; this is an XS test-only ticket.

## Fences
Zero lines under `src/` (probes under `ref:`), `tools/`, `package.json`. No `plans/board.md`,
`AGENTS.md`, ADRs. Never merge; never push. Own worktree; link `node_modules` into YOUR worktree
only. Commit messages via a scratchpad file + `git commit -F`. Real UTC stamps.

## Publish
`decision` note under `ref:`, trace row, ticket § QE. Queue pending → claimed → done per Workflow 17.
Report: verdict, mutant results, gaps, sha.
