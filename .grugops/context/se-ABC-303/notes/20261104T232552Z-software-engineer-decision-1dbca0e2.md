---
id: 20261104T232552Z-software-engineer-decision-1dbca0e2
kind: decision
by: software-engineer
at: 2026-11-04T23:25:52Z
verified_by: 
confidence: high on the form, which reproduces the probe to the count
refs:
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - R-BUNDLE-1
  - R-283-LMR
  - NFR-005
  - NFR-008
  - NFR-009
  - orch-2026-10-30a/20261104T222400Z-orchestrator-decision-3c67d3c4
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:59b585e6b51dc13913e4aea48b4f4490102a25d8adda89cdbcc721b3d4dab91f
---

# se-ABC-303 decision: bundle 1 built as `ADR-0072` M3 and `ADR-0073` C1; five build choices the ADRs leave to the engineer

Code `ea580358`, rows `de1adcc5` and `de15cfb2`, on `grugops/ABC-303` from `main` `1bcdbf2d`. Nothing tuned, no form changed, no game played. The rule and the table follow the ADRs line by line, and they match `arch-bundle-1`'s probe to the count (see the readings note).

1. **`previous` is a `Move | null` argument** on `negamax` and `searchMove` in both recursions (`ADR-0073` d3), null at a null move's child. The root has no read: it passes 0 to `ordered` and `orderMoves`' default stands.
2. **`clearHistory(countermove = false)`.** `ADR-0073` d4 clears with the history table, d6 says off means nothing is written, and F5 calls a door's change a defect. So the table clears only under the search's own switch: `clearHistory(switches.countermove)`. A separate export would have broken A6's "grow by seven".
3. **`countermoveAt` is also the recursions' read.** `ADR-0073` d7 calls it a read-only probe for the update row. Engine needs one read across the module line, and a new export would make A6 eight. It writes nothing. Flagged, not a form change.
4. **`moveCountFrom` runs only when `moveCountNode` answered above 0.** The probe read it first, unconditionally. `moveCountNode` does not touch `ORDER_KEYS`, so the value is the same and the scan is skipped at ineligible nodes. Both still run before any recursion.
5. **The malus takes `firstSkipped`, the two new parameters default,** so every older five-argument `recordHistoryCutoff` call and row reads as before (`ADR-0072` d3).

**One re-point is a judgement, for the Architect: `ABC-279` A3 (a).** See the rows note.
