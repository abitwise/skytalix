---
task: wave-2026-09-25
subtask: ruling-abc086-seed
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling owed on a Backlog ticket)
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/ruling-abc086-seed/
source_refs: .grugops/context/rescore-abc086/  memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md  memory-bank/50-decisions/ (ADR-0024)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:20:00Z
branch: grugops/ruling-abc086-seed
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule `ABC-086`'s ⚠️(10) — Q1 (does the seed reach move selection?) and Q2 (deterministic budget)

BA/PM re-scored `ABC-086` at 9/10 (`4e44656`, note `…edddff77`); the one open ⚠️ is yours. The two
questions, the code sites and BA/PM's probe are in `.grugops/context/rescore-abc086/` — read them,
do not re-derive.

- **Q1:** seeded root tie-break (a) — and if so, how the equal-best set is found without changing
  the shipped score, and whether it is value-/work-changing under `ADR-0026` decision 10 — or (b) no
  seed in move selection; the seed's first consumer becomes `ABC-087`. BA/PM prefers (b) as product
  position; it is your ruling.
- **Q2:** the deterministic budget — the existing `Clock` on virtual time (contract says
  "real-time", `engine.ts:109`; virtual-clock cap 5000 readings, `:459`) or a node budget — reachable
  by the `ABC-084`/`ABC-085` harnesses outside a test file without breaking `ABC-078` `A4`'s export
  pin or `ADR-0024` decision 7.

Measure what you can (the `UNKNOWN - verify` on (a)'s value-changing question especially). If the
ruling needs an ADR, write it `proposed` — acceptance is the owner's. Say plainly what the ticket
page must change after your ruling (BA/PM folds it; you do not edit the ticket's criteria).

## Fences
No `src/` production edits (probes under `ref:` only), no `plans/board.md`, no `AGENTS.md`, no
ticket criteria. Never merge; never push. Own `git worktree` under `.claude/worktrees/` (symlink
`node_modules`). Commit messages via a scratchpad file and `git commit -F`. Other agents
(Engineer on `ABC-102`, BA/PM on `ABC-082`) run on other branches; append trace rows at the end of
the table only.

## Publish
`decision` note(s) under `ref:`, an ADR if needed (`proposed`), a trace row. Queue pending →
claimed → done per Workflow 17. Report: Q1 and Q2 rulings one line each, ADR id/status if any,
what BA/PM must fold, branch + sha, numstat.
