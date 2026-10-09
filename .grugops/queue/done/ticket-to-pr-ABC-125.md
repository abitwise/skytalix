---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-125
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-125-two-live-virtual-clocks-at-different-steps.md
ref: .grugops/context/ticket-to-pr-ABC-125/
source_refs: .grugops/context/qe-ABC-086/ (G-QE-1, mutant M5)  .grugops/context/cut-followups-2026-10-09/
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:19:27Z
branch: grugops/ABC-125-two-clocks
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-125` — two live virtual clocks at different steps

DoR 10/10, XS. The ticket page is the contract: one default-lane row in `src/engine.test.ts`
reading `virtualClock(1)` and `virtualClock(0.5)` interleaved → `[0,0,1,0.5,2,1]`; show it RED with
QE's mutant `M5` planted (step held in module state) and green on the shipped module.

## Stop conditions
Any change outside `src/engine.test.ts` under `src/`; `N8-LANE` over its line.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Own
worktree under `.claude/worktrees/`; link `node_modules` into YOUR worktree only. Commit messages via
a scratchpad file + `git commit -F`. Real UTC stamps. `ABC-084` builds in parallel (it moves the
quiescence corpus, not `src/engine.test.ts`).

## Publish
`claim` + `observation` notes under `ref:`, trace row, ticket § Delivery. Queue pending → claimed →
done per Workflow 17. Report: gates, mutant result, `N8-LANE`, `src/` numstat, branch + sha.
