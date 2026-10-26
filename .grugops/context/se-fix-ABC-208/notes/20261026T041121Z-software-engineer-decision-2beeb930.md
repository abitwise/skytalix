---
id: 20261026T041121Z-software-engineer-decision-2beeb930
kind: decision
by: software-engineer
at: 2026-10-26T04:11:21Z
verified_by: 
confidence: high: test-only rows, each shown red on its plant and green at head; deterministic
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - NFR-008
  - QE-208-a
  - QE-208-b
  - QE-208-c
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-decision-8c4f3e57
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-observation-98174381
  - orch-2026-10-26h/20261026T040103Z-orchestrator-decision-42479486
  - grugops/ABC-208
  - 80345eb9
  - 2d3db645
supersedes: 
seal: sha256:b776356f6ffbc6f3f91e608e2ebef9938561de581f033e88f68abcaa352486ba
---

# se-fix-ABC-208: three test-only rows close QE-208-a, -b and -c; behaviour rows for a and b, a source row for c; all default lane, all deterministic

Task `se-fix-ABC-208` on `grugops/ABC-208`, from `80345eb9`; test commit **`2d3db645`**. One file, `src/search.null-move.test.ts` (+154 / -5). **Zero production lines** (the standing measurement over `80345eb9..2d3db645` is empty). No value pin, relation, level or bound moved; no STOP condition met. No real-clock timing.

## The rows (5 new; all in the default lane)
- **QE-208-a (1 row):** `chooseMove` on position-6 under a virtual clock that reads 0 until its k-th reading and far past the deadline from then on, k = 3..25. Each root must come back byte-identical (the side to move is checked by name first). Non-vacuity: at least 3 of the turning readings land with a null move open. The `apply.ts` mock now counts `makeNullMove` up and `unmakeNullMove` down (`instrument.open`). Head: 6 of 23 land under a pass.
- **QE-208-b (2 rows):** a call-through module mock of `src/transposition.ts`. Every `probeTable` key must equal `zobristKey` of the caller's position at that moment; both recursions search that object in place. Rows: `search()` at depth 6 and `chooseMove` deepened to 6, position-6 on a frozen clock. Depth 6 is the least depth at which a null child is a full-width node and so probes the table (6 - 1 - 1 - 3 = 1). Non-vacuity: probes under an open null move > 0.
- **QE-208-c (2 rows, one per module):** a source row. In `search.ts` and `engine.ts`, every exported function that calls `searchRoot(...)` or `deepen(...)` carries exactly one `nullMove:` literal. The map is pinned whole: `search` and `chooseMove` true, the 9 search doors and 3 engine doors false.

## Choices
1. **a by a clock that turns on a counted reading, not `tickingClock` or `maxNodes`:** the abort lands on an exact check, and the reading records whether a null move was open at that moment. That makes non-vacuity measurable rather than assumed. Sweep cut to one board (position-6, k <= 25) for lane cost. Kiwipete made only 3 hits in k <= 30.
2. **b by an invariant, not a node-count pin:** no new magic number. It fails on any stale key a probe reads, wherever the write goes missing.
3. **c by a source row (QE's suggested form):** with PVS off, null-window nodes are coincidences, so a behaviour row would bite only by chance. The existing door comment said such nodes "cannot show"; it was corrected to match QE's measurement (test comment only).
4. Kept: every existing row, title and value. The two new mocks are call-through, and the 33 prior default rows read as before.
