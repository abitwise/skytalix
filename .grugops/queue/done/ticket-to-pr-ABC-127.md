---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-127
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
ref: .grugops/context/ticket-to-pr-ABC-127/
source_refs: .grugops/context/cut-harder-puzzles/ (decision …5fefe3f1, probes)  .grugops/context/qe-ABC-084/ (the 17 weakenings, weakenings.mjs, indep-oracle.mjs)  .grugops/context/secnfr-ABC-084/ (F1)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:00:52Z
branch: grugops/ABC-127-harder-puzzles
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-127` — harder puzzles that catch the weakenings `ABC-084` misses

DoR 9/10. The Orchestrator reads the one ⚠️ (item 3: `A3`'s ≥ 6-of-10 bar unmeasured until rows
exist) as non-blocking — it is measurable, it is YOURS to measure, and it carries a stop rule (same
reading as `ABC-122`). The ticket page is the contract (`A1`–`A9`).

Order with `ABC-126`: `ABC-126` will change 2 of the 40 existing rows (the in-check pair). It is NOT
building now. `A1`'s "40 existing rows byte-identical" means byte-identical to this base; `ABC-126`
follows you and re-reads the suite.

## Stop conditions (hand up, do not trim or widen)
- `A3` < 6 of the 10 survivors red, or any of W1/W1b/W4/W5 survives: report the count and STOP —
  do not lower the bar, do not tune the engine.
- Any answer not provable by an oracle that imports no engine/search/evaluate/quiescence/
  transposition code (`A2`).
- Any production change outside the puzzle files (no `src/engine.ts`, `src/search*.ts`,
  `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`).
- `A7` over its readings: report, do not cut rows to fit; `N8-LANE` > 650 ms: stop.

## Fences
Never merge; never push. No `plans/board.md` (a board audit is open), `AGENTS.md` (`A9` is the
Scribe's — draft the line in your note), `plans/nfr-catalog.md`, ADRs. Own worktree; link
`node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory;
`git commit -F`. The baseline re-record is its OWN commit with a reason (`A5`). Real UTC stamps.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, trace row, ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates, `A1` row counts by tag, `A3` per-weakening
table, `A4` headroom, `A6` three-process result, `A7`/`A8` readings, drafted `AGENTS.md` line,
`src/` numstat, branch + sha.
