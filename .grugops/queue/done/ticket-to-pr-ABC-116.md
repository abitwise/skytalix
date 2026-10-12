---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-116
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
ref: .grugops/context/ticket-to-pr-ABC-116/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-116-t2-carrier
base: main @ cc2d4cdc (re-read at claim)
---

# Subtask: deliver `ABC-116`. Carry the `T2` re-measure trigger in the `ChildOptions` / `childOf` comment block. YOU ARE THE ONLY HOP RUNNING (width 1).

XS, P2, DoR 10/10. The ticket page is the contract. Comment prose only: 0 production lines, 0 assertions, 0 new spawns.
- **A1:** the block attached to `ChildOptions` / `childOf` states all four parts (i)–(iv), and `grep -n "T2" src/cli.test.ts` hits inside it.
- **A2 is a quiet-window measurement, and the reason you run alone.** Re-measure the one-line substitution-hook deletion's cost YOURSELF: base copy
  and mutant, both OUTSIDE the repository (scratchpad), `node_modules` symlinked. Use today's stack: vitest 4.1.11, `maxWorkers: 2`, module runner
  off (ADR-0040 add. 2, ADR-0042). Alternate base/mutant runs (≥ 5 pairs, ABAB…), 60 s idle before the first and ≥ 20 s between runs; report medians
  and the paired differences for wall AND CPU (user+sys of the vitest process tree, e.g. `/usr/bin/time -l` or the harness the ADR-0040 window used).
  Before AND after every run, log `uptime` load1, `sysctl -n kern.thermalpressurelevel` or `com.apple.system.thermalpressurelevel` (never
  `CPU_Speed_Limit`), any foreign `vitest` processes (`pgrep -fl vitest`), and the power source (`pmset -g batt | head -1`). **If a foreign vitest
  process is running (the owner's other session at /Users/olgeroeselg/Projects/public/grugops sometimes runs one), wait until it is gone; never grade
  a run taken while one ran — record and discard it.** ADR-0017's +2.68 s wall / +2.60 s CPU was taken on vitest 3.2.7 at a different worker count:
  expect disagreement, state THIS hop's numbers in the comment, and write the disagreement down. Copying the ADR's figure without a run FAILS A2.
- **A3/A4:** the `N8-SPAWN` row form with `T1`/`T2` inline on this page, quoted verbatim in § Security / NFR triggers of the delivery; the A4
  propagation sentence in the delivery note.
- **A5:** the NFR-row hash on the page (`63f66795…`) is stale: it has been `c74e7426…0d3b` since the 2026-10-10 re-score. Record base AND head and grade
  base == head on 8 lines; write the drift down. `plans/nfr-catalog.md` and `AGENTS.md` are NOT touched — the `nfr-catalog.md` pointer edit is
  NAMED and NOT MADE (owner Architect/Design); say so.
- **A6:** `--dir src` counts before and after; `spawned`, `Object.keys(CHILDREN)` unchanged, `const N8_SPAWN` byte-identical; `T2` does NOT fire on
  this delivery, with the reason. Do not claim a re-measure you did not owe (the A2 measurement is of the MUTANT's cost, not a T2 re-measure).

## Fences
Never merge or push. Do not touch `plans/board.md`, `plans/nfr-catalog.md`, `AGENTS.md`, or any `src/` file but `src/cli.test.ts` (comment lines
only). Own worktree as a SIBLING of the repo (`git worktree add ../cli-chess-example-ABC-116 -b grugops/ABC-116-t2-carrier main`), `node_modules`
symlinked. No `update-ref` on another branch, no `--force`, `-D`, `reset --hard`. Gates before your last commit: lint, typecheck, build, `npm test`
with `.test-results/last-run.json` success:true — run them AFTER the A2 window, never interleaved with it. `diff` is a git wrapper; use `/usr/bin/diff`
or `cmp`. Notes per Workflow 16 (raw TSV of every timed run under `ref:`), a trace row at the END of `plans/traceability.md`, § Delivery on the page.
Queue: move THIS FILE to `.grugops/queue/done/ticket-to-pr-ABC-116.md` and write `.grugops/queue/done/ticket-to-pr-ABC-116.claim.md` (flat files,
not a directory); leave them uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktrees when done. Report: tip, gates,
each criterion with its reading, the A2 table (medians, paired diffs, thermal and load per run, discarded runs), UAT-waiver reading, board move.
