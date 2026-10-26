---
subtask: arch-design-ABC-208
role: architect-design
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/arch-design-ABC-208/
branch: new grugops/arch-design-ABC-208 from main, worktree ../wt-arch-design-ABC-208
width: 2 of 3 (beside arch-source-ABC-211; no real-clock timing, no G6, no games)
---

# Design ABC-208: null-move pruning (PROPOSED ADR) + ADR-0026 door pair

## Do
- Per BA/PM `bapm-ready-ABC-208/…75bf6402` and Orchestrator `orch-2026-10-26c/…d25ab770`, rule the design on `main` and write the **new ADR as PROPOSED**. The owner accepts it; do not mark it accepted. Rule on:
  - R and any verification search, and the zugzwang guard.
  - The ADR-0026 off-door pair: names, one per recursion.
  - ADR-0026 d9's drift rows, re-pointed so that 118 cp keeps measuring LMR alone. If that needs a bound move, write it as an owner question; do not move it.
  - The A2 zugzwang positions, choosing ones that keep non-pawn material.
- Moved-pin probe on a scratch clone: list every row that moves, with its route. An ADR-0026 level or NFR bound move → STOP.
- Frozen-clock d7/d8 counts (kiwipete, position-6; base and head) with a G6 prediction, for the record.
- Size check (M; split if it grows).
- Write the ruling into the page's `## Design ruling`.

## Fences
- Only your worktree, scratch clones and `<scratchpad>/arch208/`. No product code is committed. Default and deterministic deep lanes only; no real-clock rows. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-design-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
