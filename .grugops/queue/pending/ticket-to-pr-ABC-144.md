---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-144
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/ticket-to-pr-ABC-144/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-144-cap-test-workers
base: grugops/wave-2026-09-25 (tip after this enqueue)
hold: dispatch when a slot frees
---

# Subtask: build `ABC-144` per ADR-0040, now ACCEPTED at k = 3. The build only; Window B is a separate width-1 hop.

M, P1. The ticket page plus `ADR-0040` and its Window A addendum are the contract.
- `vitest.config.ts`: `test.maxWorkers: 3`, in the plain-object form (`satisfies ViteUserConfig`, a type-only import). Run `npm run typecheck` on it; the Architect left that unchecked.
  The `threads` pool stays, `isolate` keeps its default (true), and there is no `poolOptions`.
- The pin: one new `it` in its own `describe` in `src/cli.test.ts`. It asserts pool `threads`; `maxWorkers` `toBe(3)`; `fileParallelism` and `isolate` not `false`; no
  `poolOptions`; and `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS`, if set, ≤ 3. No timing assertion.
- **Show these reds on a scratch copy:** cap deleted; `isolate: false`; `VITEST_MAX_THREADS=8`; `VITEST_MAX_THREADS=4` (r3b). If an env red stays green, remove the env
  check and record the gap.
- A6 reads files = base and tests = base + 1.
- **Take NO timing readings.** Window B owns them, at width 1, after this build. Report lane cost as "not graded".

## Fences
Never merge or push. Do not touch `plans/board.md`, ADRs or `AGENTS.md`. The `test` script in `package.json` is not yours (ADR-0040). Work in your own worktree, with
`node_modules` linked into it only. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff`.
Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and § Delivery. Move the queue file pending → claimed → done by hand.
