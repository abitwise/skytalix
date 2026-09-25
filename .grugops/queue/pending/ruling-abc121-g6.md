---
task: wave-2026-09-25
subtask: ruling-abc121-g6
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling on a build stop)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/ruling-abc121-g6/
build_ref: .grugops/context/ticket-to-pr-ABC-121/   (G6 decision …0da3f1a5; row inventory …d9a84a04)
adr_refs: ADR-0026 (accepted, amended — decisions 4 and 7)  ADR-0006 (falsifier G6)
enqueued_by: orchestrator
enqueued_at: 2026-09-26T03:30:00Z
branch: grugops/ruling-abc121-g6
base: grugops/ABC-121-pvs-lmr (tip after this enqueue)
---

# Subtask: rule the `G6` re-point — `ADR-0026` decision 4 vs decision 7

The Engineer re-pointed `ADR-0006`'s `G6` knight-pair row (castling-rights key) to the
pre-`ABC-121` door, literals unchanged. On the shipped path LMR moves `knight-g1 w -` from 820 to
830 at depth 4, so both halves of the pair read 830 — the very equality `G6` exists to catch.
Decision 4 (merged work rows re-point to the door) licenses it; decision 7 may be read as keeping
correctness rows on the shipped path. Rule:
1. Which reading binds, and is `G6` a work row or a correctness row?
2. If the shipped path must still carry `G6`'s guarantee, what row does (e.g. a pair that LMR does
   not collapse, or the pair at a depth/position LMR leaves distinct) — name it measurably. Probe
   if needed (no `src/` edit).
3. Does `ADR-0026` need a clarifying amendment? If yes, write it as **proposed** text in your note
   (do not edit the ADR); the owner accepts ADR changes.

Also rule the Engineer's second flag: `pvsNoResearch` is not caught by the mate floor (the
reference door shares the PVS code). Does `ADR-0026`'s Consequences text overclaim, and does
anything beyond the rows that already catch it (ABC-077 `A1`, `A4`, drift) need adding?

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADR files. Never merge; never
push. Own `git worktree` under `.claude/worktrees/ruling-abc121-g6` (symlink `node_modules`);
commit messages via a scratchpad file and `git commit -F`. An Engineer re-hop runs in parallel on
another branch off the same base.

## Publish
`decision` note(s) under `ref:`, a trace row. Queue pending → claimed → done per Workflow 17.
Report: each ruling in one line, any proposed ADR text, what the Engineer must change (exactly),
sha, numstat.
