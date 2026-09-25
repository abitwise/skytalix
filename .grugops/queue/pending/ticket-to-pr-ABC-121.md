---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-121
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/ticket-to-pr-ABC-121/
adr_refs: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md (accepted, amended)  ADR-0025  ADR-0024
ruling_refs: .grugops/context/ruling-abc121-lmr-oracle/  .grugops/context/validate-adr0026/  (probes: lmr.ts, oracle.ts, matecorpus.ts — reference only, not production code)
enqueued_by: orchestrator
enqueued_at: 2026-09-26T00:40:00Z
branch: grugops/ABC-121-pvs-lmr
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-121` — PVS + LMR in both recursions

Owner's word, verbatim: *"1. yes"* (build `ABC-121`). DoR 10/10. The ticket page is the contract;
`ADR-0026` (accepted, amended) is the shape: two test-only doors per recursion
(`searchWithoutPvsOrReductions`/`chooseMoveWithoutPvsOrReductions` for the merged work rows;
`searchWithoutReductions`/`chooseMoveWithoutReductions` for the drift detectors), one pure
reduction predicate returning plies, the bounded oracle at d5, the one-extra-ply mate floor on
the frozen `src/search.mate-corpus.ts`, `A4` at a null-window node.

**Two commits, PVS first** (R3): commit 1 = PVS + doors, every merged identity row green against
its re-pointed door; commit 2 = LMR + predicate + oracle rows.

## Stop conditions (hand up, do not trim or widen)
- A merged row fails against its `ADR-0026` door (that is a real regression, not a re-pin).
- Any bar in the ticket fails as measured (drift, mate floor, `A2` depth, `A5` nodes).
- `N8-LANE` over its line with the default-lane rows: measure; propose which rows go deep-lane,
  do not trim.
- Anything outside Scope, including `AGENTS.md` (the deep-lane line is a later Scribe pass).

## Report the depth reading
Depth completed in 3 s (`chooseMove`, default budget), kiwipete and position-6, this build vs the
base, same process, ≥ 3 rounds, plain node (binding, `NFR-005`) and vitest (reported), with load.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Own
`git worktree` under `.claude/worktrees/` (symlink `node_modules`). Commit messages via a
scratchpad file and `git commit -F`; probes as node scripts. `npm test` is bounded at 60 s — stop
it only with Ctrl-C/SIGTERM. A BA/PM hop on `ABC-109` runs in parallel on another branch.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates, each criterion MET or not with its
reading, the depth table, the drift/mate-floor readings, planted-variant results (which row reds
each), mutants, `N8-LANE` with load, deep-lane placement, sha per commit, numstat.
