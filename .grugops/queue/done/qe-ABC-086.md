---
task: wave-2026-09-25
subtask: qe-ABC-086
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/qe-ABC-086/
build_ref: .grugops/context/ticket-to-pr-ABC-086/   recut_ref: .grugops/context/recut-abc086-lane/   (on the build branch)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T20:11:55Z
branch: grugops/qe-ABC-086
base: grugops/ABC-086-virtual-clock @ 82cccba
diff_under_review: 1eae90c...82cccba (src: virtual-clock.ts new, engine.ts comments only, engine.test.ts)
worktree: .claude/worktrees/qe-ABC-086
result_commit: grugops/qe-ABC-086 @ 7c8fd3c
done_at: 2026-10-09T20:37:48Z
done_by: qe-e2e
result: PASS WITH FINDINGS
---

# Subtask: QE gate for `ABC-086` (deterministic mode on a virtual clock)

Build on the merged tree (contains `ABC-082`): gates green 49 / 1530 / 0 skips; `ENGINE_DEEP`
45/45 (`A1` 300/300, depth-4 floor 24/30 vs 15, `A6` 10/10); `N8-LANE` +35 ms (sign 4/8, load ~23).
Reproduce `A1`, `A2`, `A4`–`A7` independently. Security/NFR NOT triggered: no shipped-path change
(`src/cli.ts` does not import the module — confirm that as `A5`).

Focus:
1. Determinism across SEPARATE PROCESSES (not only in-process): the same move at the same virtual
   budget from two `node` processes, on at least 10 positions.
2. `A7` step guard: `0`, negatives, `NaN`, `±Infinity`, plus `Number.MIN_VALUE`, huge finite
   steps, non-number input — does any make a search hang or silently misbehave?
3. The default slice sits EXACTLY at its depth ≥ 2 floor on 15/15: is the floor a meaningful guard
   (mutant: a clock that jumps the budget in one read) or a tautology? Plant it.
4. `A4` grep: is it robust to aliasing (`globalThis.Date.now`, `const n = Date.now`, `performance`
   via import)? Report, don't widen the ticket.
5. Mutants of your own in `src/virtual-clock.ts` and the `A1`/`A6` rows — at least four.

## Fences
Zero lines under `src/` (probes under `ref:`), `tools/`, `package.json`. No `plans/board.md`,
`AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push. Own worktree under
`.claude/worktrees/`. Commit messages via scratchpad file + `git commit -F`. Real UTC stamps.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, trace row, ticket
§ QE. Queue pending → claimed → done per Workflow 17. Report: verdict, criteria readings, the five
focus results, mutants, gaps, sha, numstat.
