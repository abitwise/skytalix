---
task: wave-2026-09-24
subtask: rescore-abc080-081
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (DoR re-score)
tickets:
  - plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
ref: .grugops/context/rescore-abc080-081/
owner_word_ref: .grugops/context/wave-2026-09-24/notes/20260925T104000Z-orchestrator-decision-36b66fbd.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T11:00:00Z
branch: grugops/rescore-abc080-081
base: grugops/wave-2026-09-24 (tip after the ABC-079 Done commit)
---

# Subtask: re-score `ABC-080` and `ABC-081` against the Definition of Ready

Both sit in Backlog: `ABC-080` DoR 8/10 ("needs ABC-078"), `ABC-081` DoR 7/10 ("needs ABC-075 +
ABC-077"). All three dependencies are now Done and on the wave branch; `ABC-079` (quiescence,
`ADR-0024`) also landed and changed the search both tickets extend. Score each ticket against
`agent-factory/checklists/definition-of-ready.md` against the CURRENT wave tree, not the page.

## Must account for
1. **The owner's word (`owner_word_ref:`):** `NFR-005`'s depth-6 floor is KEPT for game quality
   and binds these two tickets. Today: kiwipete d3, position-6 d3 at the default budget. Say
   what each ticket's acceptance criteria must claim toward depth 6, and whether the two
   together can plausibly reach it. If neither can, name it plainly for the owner; do not
   re-level.
2. **`ABC-079`'s landing:** MVV-LVA already exists inside `quiesce` (`mvvLvaKey`, `ADR-0024`).
   `ABC-080` reuses the key; check its scope and size for overlap. QE's G4 (the promotion term
   unguarded) was pointed at `ABC-080`.
3. **`NFR-008`:** the owner accepted `ABC-079`'s charge, but the lane is 22.29 s CPU against
   15 s and `ADR-0019` trigger (a) has fired. Each ticket's `N8-LANE` line must be realistic.
4. **Rulings owed:** any contract question (for example, where the TT lives relative to the
   Zobrist seam `ADR-0020`, and repetition vs `ABC-081`) that needs Architect/Design. Name it
   as a blocker with its owner; do not rule it yourself.
5. Sizing: no XL into dev. `SPLIT_REQUIRED` if either is really XL.

## Fences
No files under `src/`. Do not touch `plans/board.md`, `AGENTS.md`, or NFR bars. Never merge;
never push. Work in your own `git worktree`. Commit messages via a scratchpad file and
`git commit -F`.

## Publish
A `decision` note per ticket (score, each ⚠️ with its owner), a trace row, and a § DoR re-score
section on each ticket page. Queue pending → claimed → done per Workflow 17. Report: per ticket
the score out of 10, each open item with its owner, the size, whether it is pullable today, the
recommended pull order, sha, numstat.
