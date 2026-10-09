---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-084
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/ticket-to-pr-ABC-084/
source_refs: .grugops/context/fold-abc084-gate-b/ (decision …28f56967, probes)  .grugops/context/qe-ABC-086/ (G-QE-2)
adr_refs: ADR-0027 (accepted), ADR-0028 (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:07:11Z
branch: grugops/ABC-084-puzzle-suite
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-084` — the tactical puzzle suite (strength regression gate)

DoR 10/10, 0 ⚠️ (BA/PM `0ebe63f`), M, P0. The ticket page is the contract (`A1`–`A8`, `## The
trigger`, Scope, fences, test notes). Notable: the 24 `ABC-079` rows move BYTE-IDENTICAL out of
`src/quiescence.test.ts` into one non-test data module and `ABC-079` `A1` keeps reading only its 24;
`A3`'s weakened engine needs NO production door; the runner refuses a step below `budgetMs/1000`;
the suite is opt-in (`*_DEEP` shape), NOT in the default lane; answers are independently sourced
(`A6`) — never the engine's own output.

## Stop conditions (hand up, do not trim or widen)
- `A1` < 10/10 or `A2` < 19/20 on the merged engine: STOP and report — do not tune the engine,
  do not swap puzzles to pass (the baseline is evidence).
- Any production change outside the page's Scope (notably `src/engine.ts`, `src/search.ts`,
  `src/evaluate.ts`), or `ABC-079`'s `A1` reading anything but its 24 rows.
- `N8-LANE` over its line for anything you add to the default lane: measure and report.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md` (`A8`'s line is the Scribe's — draft its
text in your note), `plans/nfr-catalog.md`, ADRs, `.grugops/factory.config.json`. Own worktree
under `.claude/worktrees/`; link `node_modules` into YOUR worktree only. Commit messages via a
scratchpad file + `git commit -F`. Real UTC stamps. BA/PM cuts follow-up tickets in parallel (no
`src/`).

## Publish
`decision` + `observation` + `claim` notes under `ref:`, trace row, ticket § Delivery, the
baseline file (`A7`). Queue pending → claimed → done per Workflow 17. Report: gates, the suite's
three-process result, `A1`/`A2`/`A3` readings, `A5` wall, baseline, the drafted `AGENTS.md` line,
`src/` numstat, branch + sha.
