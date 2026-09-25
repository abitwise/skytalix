---
task: wave-2026-09-24
subtask: refine-abc080-081-cut-c1
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold rulings into criteria, re-score, cut)
tickets:
  - plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/refine-abc080-081-cut-c1/
ruling_ref: .grugops/context/ruling-abc080-081/   (five decision notes, R1–R5)
rescore_ref: .grugops/context/rescore-abc080-081/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T13:30:00Z
branch: grugops/refine-abc080-081-cut-c1
base: grugops/wave-2026-09-24 (tip after this enqueue)
---

# Subtask: fold the Architect's rulings into `ABC-080`/`ABC-081`, re-score, cut C1

Architect/Design ruled every open item (`ruling_ref:`). The rulings are on the ticket pages as
§ Ruling sections; the CRITERIA have not changed yet. That pen is yours.

## Do
1. **`ABC-080`:** re-state `A3` at ≤ 4% (R1) and `A4` read at depth 5 on both positions; name
   both `src/search.ts` and `src/engine.ts` in scope; carry `ABC-079` QE G4 in test notes.
   Re-score. If 10/10, say so; the Orchestrator makes the board move.
2. **`ABC-081`:** re-state `A3` in the engine's shape (cumulative iterative deepening, table +
   hash move, `ABC-080` landed first, per R3's reading); fold in `ADR-0025`'s shape (R3),
   `ADR-0006`'s `G6` falsifier (R2), and the `ABC-078` identity row accepting an equally scored
   move. `NFR-009` (R4) is NOT in the catalogue: leave item 10 ⚠️ with its owner (Security/NFR
   pen on the owner's word). Re-score.
3. **Cut C1 (PVS + late-move reductions)** from R5 as a new ticket (next free id; check the
   board and `plans/tickets/` so the id is not already used on any branch). Criteria for
   game quality, not identity (R5 says it changes scores). Its dependencies are `ABC-080` and
   `ABC-081`. Size it. C2–C4 are NOT to be cut. List them in your decision note as candidates only.

## Fences
No files under `src/`. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, or
any ADR. Never merge; never push. Own `git worktree`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
`decision` notes (one per ticket, one for the cut), a trace row per ticket, updated ticket pages.
Queue pending → claimed → done per Workflow 17. Report: per ticket the score out of 10 and
each open item with its owner; the new ticket's id, size, priority and DoR score; sha; numstat.
