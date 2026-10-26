---
id: 20261026T023422Z-orchestrator-decision-749ff988
kind: decision
by: orchestrator
at: 2026-10-26T02:34:22Z
verified_by: 
confidence: high
refs:
  - ABC-208
  - ADR-0050
  - ADR-0026
  - EPIC-008
supersedes: 
seal: sha256:813d718459298f99d44979cb7b4630e9fd495a05bf43266db331e3211d108d6f
---

# ABC-208 design accepted; ADR-0050 PROPOSED to owner; BA/PM page amendment next

- **arch-design-ABC-208 (…012b1053, …bae20026) accepted and merged** (b1238ec5):
  - ADR-0050 PROPOSED: null move at null-window nodes, R = 3 at depth ≥ 2. Never in check, never twice in a row, never at the root, never below three non-pawn pieces.
  - Door pair `searchWithoutNullMove` / `chooseMoveWithoutNullMove` (222/222 equal to the shipped search).
  - The d9 drift rows and 12 ABC-121 rows re-point to the doors, so 118/75 cp keeps measuring LMR alone.
  - A3 oracle: d5 drift ≤ 37 cp with ≥ 95 % ≤ 25 cp; no mate-floor loss.
  - A2: 7 zugzwang rows.
  - Moved pins: 2 export-list rows. No value pin, relation, level or bound moves.
  - Frozen-clock position-6 d8 −73.8 %, kiwipete d8 −27.4 %. G6 predicted MET (record only).
  - M, no split. G1 54/58 with the 3-piece guard.
- **ADR-0050 goes to the owner as a yes/no.**
- **Gate on the owner's answer** (per …d25ab770): build may proceed; the ALONE reading and the merge wait on his acceptance.
- **Next: `bapm-amend-ABC-208`** (records only), carrying the Architect's five page lines:
  - Scope 2 guard → three non-pawn pieces;
  - A2 at per-row depth, 7 rows;
  - A3 mate clause at d5;
  - A1 cross-build out of tree;
  - Scope 1 adds apply.ts and zobrist.ts.
  - No criterion's bar changes. Then DoR → Ready for Dev → In Development (ticket-to-pr-ABC-208).
- **Backlog note (LOW, Architect's):** ADR-0026 d9 reads 118 cp, but on main the ABC-121 drift rows assert ≤ 75 cp. The 118 rode ABC-205's unmerged branch. That is safe (the rows are stricter than the ADR), but the ADR text overstates what shipped. A dated "not in force" line, like the ADR-0031 one, is owed at the Architect's next hop.
