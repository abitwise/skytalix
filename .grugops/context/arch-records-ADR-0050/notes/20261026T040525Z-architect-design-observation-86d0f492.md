---
id: 20261026T040525Z-architect-design-observation-86d0f492
kind: observation
by: architect-design
at: 2026-10-26T04:05:25Z
verified_by: 
confidence: high: a records correction; the 5/6 count is QE's measurement at ddc307a9 (…8c4f3e57), not re-run here
refs:
  - ABC-208
  - ADR-0050
  - ADR-0026
  - QE-208-d
  - QE-208-e
  - orch-2026-10-26h/20261026T040103Z-orchestrator-decision-42479486
  - orch-2026-10-26e/20261026T023422Z-orchestrator-decision-749ff988
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-decision-8c4f3e57
  - A1
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - ddc307a9
  - 42f33a7a
supersedes: 20261026T023232Z-architect-design-observation-bae20026
seal: sha256:b04672f08ba35c10ce2fecd56a07325b37c722e567f73bcf33840b217f6d0a6b
---

# Architect/Design: correction to `arch-design-ABC-208` `…bae20026` § Doors. Shipped `chooseMove` differs from base on 5/6 roots at d6, not 6/6. Position-3 is guarded out by the three-piece rule. No pin, value, bound or criterion depends on it

Task `arch-records-ADR-0050`, records only, at `main` `42f33a7a`. This note supersedes
`arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026` for ONE sentence. It corrects `QE-208-d` (QE
`…8c4f3e57`, routed by Orchestrator `…42479486` item 2). No probe was re-run: the count is QE's measurement at `ddc307a9`.
It is cited here, not re-measured.

## § Doors, corrected (supersedes the same section of `…bae20026`)
- `hd`/`h` door against `base`'s same door, and `searchWithoutNullMove`/`chooseMoveWithoutNullMove` against base's
  `search()`/`chooseMove`: **222/222 cells node-, score- and move-equal.** Six perft roots; 7 search doors at d1–4; 3
  engine doors at maxDepth 3/5/6. (Unchanged.)
- **Corrected:** shipped `chooseMove` differs from base on **5/6** roots at d6 (QE: also at maxDepth 3 and 5).
  `…bae20026` read "6/6", which was wrong.
- **Why position-3 is equal:** each side has one non-pawn piece, and at most two are reachable by promotion inside the
  horizon. So `ADR-0050` decision 6's three-piece guard rules out every null move there, and the board is node-equal
  at every depth (QE `…8c4f3e57` § Ruling).
- **What depends on it: nothing.** It is a descriptive count of how often the comparison bites. It is not a pin,
  value, bound or criterion. `A1` is met as written (QE ruling). The ticket page and `ADR-0050` never carried "6/6".
  Bite on the `A3` corpus (QE): 82/440 search cells and 38/393 engine cells.

## Everything else in `…bae20026` stands
The frozen-clock table, the zugzwang rows, `G1`, the drift and mate floor, the planted mutants, the lanes and "Not
run" are unchanged and are not restated. Read them in `…bae20026`.

## Reader note: the supersede link crosses tasks
The writer folds a superseded note out only within one task's `readContext`. So
`arch-design-ABC-208`'s own read still shows `…bae20026`. Read its § Doors through this note.
