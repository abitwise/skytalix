---
task: wave-2026-09-25
subtask: qe-ABC-116
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
ref: .grugops/context/qe-ABC-116/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-116-t2-carrier (tip d39618d1; carrier 9b8c38ec; base 3c38a8ea)
---

# Subtask: QE on `ABC-116`, the `T2` carrier comment. YOU ARE THE ONLY HOP RUNNING (width 1).

Verify A1–A6 independently; the build notes and raw probe are under `.grugops/context/ticket-to-pr-ABC-116/` on the branch.
- **A1:** read the `ChildOptions` JSDoc yourself against (i)–(iv). Check every claim in it is TRUE of the code: the named fields (`args` /
  `productArgv`, `input`, `hook`, `timeout`) exist on `ChildOptions` and are what a child's argv, stdin script, substitution hook and settle are.
- **A2 — independent spot re-measure, short:** your own base and mutant trees OUTSIDE the repo (`node_modules` symlinked), the same one-line
  hook deletion, `/usr/bin/time -l npx vitest run src/cli.test.ts`, ≥ 4 alternating pairs, 60 s idle first, ≥ 20 s between runs, load1 / thermal
  pressure (`notifyutil -g com.apple.system.thermalpressurelevel`) / foreign `vitest` processes / power logged before and after each run. Discard and
  re-take any run with a foreign vitest present. Grade: your paired mutant − base median is within ±0.5 s of the Engineer's +3.08 s wall / +3.12 s CPU
  and the sign holds in every pair. Then audit the Engineer's raw TSV: do its medians and intervals recompute from the rows; were the discards
  honest; is the mutant the one-line hook deletion and nothing else. Judge whether the comment's dated figure and disagreement sentence are worded
  truly (no causal claim beyond what was measured).
- **A3/A4:** trigger sentences identical in the canonical row and the § Security / NFR triggers quote; the A4 sentence present.
- **A5:** fence from git against `3c38a8ea`; NFR-row hash base == head; catalog and AGENTS.md untouched; the pointer edit named and not made.
- **A6:** `npm test` counts base vs head; `N8_SPAWN` byte-identical; `T2` not fired, and the A2 mutant run not claimed as a T2 re-measure.
- The force-added `*.log` files: say whether committing ignored logs is acceptable record or should be renamed to an un-ignored extension.
Measure the UAT-waiver reading yourself. Gates at the tip, run AFTER your timed runs, never interleaved.

## Fences
Do not touch `src/`, `plans/board.md`, `plans/nfr-catalog.md`, `AGENTS.md`. Own worktree (sibling of the repo) on `grugops/qe-ABC-116` off the tip
— NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or
`cmp`. Notes per Workflow 16 (raw TSV under `ref:`) with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`,
a § QE section on the ticket. Queue: move THIS FILE to `.grugops/queue/done/qe-ABC-116.md` and write `.grugops/queue/done/qe-ABC-116.claim.md`
(flat files); leave them uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktrees and scratch trees when done.
Report tip, verdict, readings (with the A2 pair table), gaps.
