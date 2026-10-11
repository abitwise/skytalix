---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-147
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
ref: .grugops/context/ticket-to-pr-ABC-147/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-147-vitest-overhead-probe
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: run the `ABC-147` probe. How much of the default lane's CPU is vitest's per-node overhead?

XS, P2, DoR 10/10. The ticket page is the contract, and its decision rule is pre-registered: ≥ 15 % → a P1 lever ticket, 5–15 % → the owner, < 5 % → close.
It needs no quiet window (A1 reads proportions, A2 paired ratios), but log load1 and the thermal pressure level before every run, as the page says.
Two QE agents are running in parallel right now. Record any run at load1 > 8, and never grade on it.
Read-only probe: **0 changes to `src/`, `package.json` or `vitest.config.ts`.** Probe scripts go under `ref:`. Apply the rule and report the band. Do not cut
the lever ticket yourself; that is BA/PM's job.

## Fences
Never merge or push. Do not touch `plans/board.md`. Work in your own worktree, with `node_modules` linked into it only. End each commit with a `Co-Authored-By:` trailer naming the model you
actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff`. Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and § Delivery.
Move the queue file pending → claimed → done by hand.
