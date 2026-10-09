---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-086-rehop
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/ticket-to-pr-ABC-086/
recut_ref: .grugops/context/recut-abc086-lane/   (decision …826f019a, on the build branch)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T19:51:26Z
branch: grugops/ABC-086-virtual-clock (continue; worktree .claude/worktrees/ABC-086-virtual-clock)
base: grugops/ABC-086-virtual-clock @ c16447c, then merge grugops/wave-2026-09-25 tip (contains ABC-082)
---

# Subtask: apply BA/PM's lane re-cut to `ABC-086` on the merged tree

1. Merge the wave tip into the build branch first (`git merge grugops/wave-2026-09-25`) — it now
   carries `ABC-082`'s evaluator. Resolve any trace/ticket conflict by keeping both sides.
2. Apply the page as re-cut at `c16447c`: default `A1` = 15 positions × 2 at budget **2**, step 1,
   fresh shipped clock per run, identical 30/30 and root depth ≥ 2 on 15/15; drop the old 30 × 2
   row; move `A6`'s 10/10 interleaved row under `ENGINE_DEEP` (clock-state row stays default).
3. Re-read on the merged tree: `ENGINE_DEEP` (`A1` 300/300 + depth-4 floor, `A2`, `A6`), `npm test`,
   lint, typecheck, build, skip integrity.
4. `N8-LANE` with the standing instrument (null control, sign, load). ≤ 450 ms: ship. 450–650:
   you may take BA/PM's 10 × 2 fallback. > 650: stop.

## Stop conditions
`A1` not 300/300 or the depth floor red on the merged tree; `N8-LANE` > 650 ms; any change to
`src/engine.ts` beyond comments or to `src/search.ts`.

## Fences
Never merge into the wave; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`,
ADRs, criteria. Commit messages via a scratchpad file + `git commit -F`. Real UTC stamps.
NOTE: the Orchestrator is running `SEARCH_DEEP` `src/search.pvs-lmr.test.ts` in the main checkout
until ~20:05Z — record load with every timing.

## Publish
`claim` + `observation` notes under `ref:`, § Delivery update, trace row. Queue pending → claimed →
done per Workflow 17. Report: gates, `ENGINE_DEEP`, `N8-LANE` (net, null, sign, load), sha.
