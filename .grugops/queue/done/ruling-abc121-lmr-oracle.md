---
task: wave-2026-09-25
subtask: ruling-abc121-lmr-oracle
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling owed to a ticket's DoR)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/ruling-abc121-lmr-oracle/
prior_ruling_ref: .grugops/context/ruling-abc080-081/   (R5, candidate C1, probe)
adr_refs: ADR-0002, ADR-0024, ADR-0025
enqueued_by: orchestrator
enqueued_at: 2026-09-25T19:40:00Z
branch: grugops/ruling-abc121
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule the test oracle for `ABC-121` (PVS + LMR)

Owner's word, verbatim: *"i would set up second parallel flow if possible"*. `ABC-121`'s build
waits for `ABC-122` (gate hardening); this ruling runs now so BA/PM can re-score it.

## The question
PVS is score-preserving at fixed depth; LMR is not (a reduced move can change the result). The
existing identity rows — `ABC-077` `A1` (pruned vs unpruned), `ABC-078` `A3` (engine vs
`search()`, move AND score, equal-score licence), `ABC-081` `A1` (table on vs `searchWithoutTable`)
— assume score identity. Rule:
1. Which identity rows stay binding, and against which reference (e.g. LMR off via a test-only
   door, per `ADR-0024` decision 7 / `ADR-0025` decision 6 precedent).
2. What replaces identity for LMR on (e.g. depth-in-budget gain, a tactical/strength check such
   as `ABC-084`'s suite if it exists, bounded score deviation) — measurable criteria BA/PM can
   write.
3. Whether PVS and LMR must land in both recursions at once (the ticket says yes) and whether
   they should be split into two tickets (PVS identity-preserving first, LMR second).
4. Any ADR owed. Write it as **proposed**; the owner accepts.

Probe if it settles a question (node scripts, no `src/` change); cite numbers.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`. Never merge; never push. Own
`git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
`decision` note(s) under `ref:`, a proposed ADR if owed, a trace row. Queue pending → claimed →
done per Workflow 17. Report: each ruling in one line, any ADR, what the owner must decide, sha,
numstat.
