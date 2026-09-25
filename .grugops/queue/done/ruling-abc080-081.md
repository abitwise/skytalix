---
task: wave-2026-09-24
subtask: ruling-abc080-081
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design rulings owed to DoR)
tickets:
  - plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/ruling-abc080-081/
rescore_ref: .grugops/context/rescore-abc080-081/
owner_word_ref: .grugops/context/wave-2026-09-24/notes/20260925T104000Z-orchestrator-decision-36b66fbd.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T12:30:00Z
branch: grugops/ruling-abc080-081
base: grugops/wave-2026-09-24 (tip after this enqueue)
---

# Subtask: rule the open DoR items on `ABC-080` and `ABC-081`, and map the depth-6 path

BA/PM re-scored both (`rescore_ref:`): `ABC-080` 9/10, `ABC-081` 8/10, neither Ready. Every open
item is yours. Probe before you rule; measurements beat literature figures (`ADR-0024` lesson).

## Rule
1. **`ABC-080` ⚠️(10):** `A3`'s "≤ 40% nodes" is a generic figure. Measure what full-width
   ordering (MVV-LVA + killers + hash move, or a faithful out-of-tree prototype) does on this
   codebase at fixed depth, and confirm or re-level the bar from the reading.
2. **`ABC-081` ⚠️(5a):** `ADR-0006`'s castling-rights caveat — rule it.
3. **`ABC-081` ⚠️(5b):** TT storage vs `ADR-0020`'s per-ply key array — shared or separate;
   rule the shape.
4. **`ABC-081` ⚠️(10):** there is no memory NFR row for `A7`'s bound. Propose the row's
   level and its verifier. The catalogue edit is Security/NFR's pen and the owner's word;
   draft it only in your notes.
5. **The depth-6 path (owner's word: floor KEPT, for game quality).** Today kiwipete d3,
   position-6 d3 at the default budget. BA/PM reads the two tickets' bars as about 3.6x fewer
   nodes at fixed depth, which is not enough. Estimate from measured branching what depth each
   ticket plausibly buys, and what ELSE the path needs (for example PVS/aspiration, null move,
   LMR, a faster move generator, or budget). Name candidate tickets for BA/PM to cut. Rank
   them by depth per point of size. Do not re-level `NFR-005`.

## Fences
No files under `src/` (scratch probes live outside the tree, and are reverted). Do not touch
`plans/board.md`, `AGENTS.md`, or `plans/nfr-catalog.md`. Never merge; never push. Own
`git worktree`; commit messages via a scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` notes (one per ruling), `observation` notes (probe numbers), an ADR amendment or a
new proposed ADR where a contract changes, a § Ruling section on each ticket page, and a trace
row. Queue pending → claimed → done per Workflow 17. Report: each ruling in one or two
sentences, the ordering and depth readings, the depth-6 path table, what now blocks each
ticket (if anything), sha, numstat.
