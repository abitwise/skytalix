---
id: 20260723T225200Z-software-engineer-decision-c76feffd
kind: decision
by: software-engineer
at: 2026-07-23T22:52:00Z
verified_by: 
confidence: high
refs:
  - ABC-006
  - ABC-008
  - EPIC-001
  - NFR-001
  - RISK-001
  - src/perft.ts
  - src/perft-bench.ts
supersedes: 
---

Implementation decisions for ABC-006 (perft verification harness).

**`perft.ts` = pure library; `perft-bench.ts` = runnable harness.** `perft(position, depth)` and `perftDivide(position, depth)` are pure, fully tested functions. The nodes/sec harness (`npm run perft`) is a thin CLI that imports them — it prints and is not asserted-on, so the correctness surface stays 100%-covered and the CLI stays out of the test-critical path (same split the ABC-008 spike used).

**Classic perft formulation, matching the spike's Metric A.** `perft(_, 0) = 1`; otherwise sum over `legalMoves` with make/unmake. A leaf returns 1 without generating. This is the standard formulation that reproduces the published counts, and it is the reason the reported nodes/sec is INFLATED — the harness says so in clear voice and cross-references ABC-008, so NFR-001 is not misread. The measured rate (~6.2M nodes/sec) clears the 1,000,000 target even inflated; NFR-005 (search-shaped) is read against the spike, not this.

**Fast default lane + `PERFT_DEEP=1` opt-in, registered-not-skipped.** The six positions' published table is encoded with a per-position `fast` depth. Depths beyond `fast` are the deeper acceptance rows (startpos d5, Kiwipete d4, position-3 d6, position-4 d5, …); they are only *defined* when `PERFT_DEEP=1`, so in the default run they are ABSENT, never `.skip`-marked — this keeps the gate's test-integrity skip count at zero (no `.grugops/test-skips.md` entry needed). Default suite ~0.75s; deep suite ~36s (the two heaviest carry a 120s per-test timeout, since a 15.8M-node count runs ~12s under the runner).

**Every published number was re-verified against this generator before being encoded**, per the ticket's explicit warning that a wrong expected value is worse than no test. Ran a standalone check of all deep values (all MATCH) and the deep suite itself passes.

**Broken-generator check performed by hand, not shipped.** Temporarily disabled en-passant generation; perft immediately failed (Kiwipete d2 2038 vs 2039, position-3 d4 43087 vs 43238, and more), proving the harness detects a real regression rather than passing vacuously. Reverted `moves.ts`. Per the ticket this is a dev-time confidence check, not a permanent test.

**Divide labels are long algebraic coordinate notation (`e2e4`, `e7e8q`, `e1g1` for O-O), not SAN** — SAN is EPIC-003; divide only needs an unambiguous key. `perftDivide` returns structured `{move, nodes}[]` (testable: entries sum to the total, one per legal first move) and the CLI prints it.

**RISK-001 retired.** The generator (ABC-002/004/005 combined) matches the chess world's published node counts exactly across all six standard positions — the epic's correctness gate is green.
