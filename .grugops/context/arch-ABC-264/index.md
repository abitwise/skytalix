<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-264

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T00:33:52Z | decision | architect-design | high on the measured choices (margin, guard, return, order, PV); the Elo value stays an estimate until C2' reads it; acceptance is the owner's |  | # ADR-0059 (PROPOSED): reverse futility in both recursions at null-window nodes, remaining depth 1-3, margin 120 cp a ply, returns beta and stores nothing; guards root / \|beta\| >= MATE_FLOOR / in check / fewer than three non-pawn pieces; A4 replaced by <= 0.75x in both recursions; A3 gains a 160 cp cap; ABC-264 DoR 10/10 on reading (b) |
| 2026-11-02T00:33:52Z | observation | architect-design | high (deterministic fixed-depth and frozen-clock runs on a scratch copy of main ecc0331f; door counts reproduce se-ABC-238's to the node); wall times informal |  | # ABC-264 probe: reverse futility at 120 cp a ply, depth 1-3, guard 3, returning beta at null-window nodes needs 0.59-0.64x the door's nodes at depth 8 (both recursions); drift 97.33 % within 25 cp, max 107; mate floor 0/189; zugzwang 7/7; G1 54/58 |
| 2026-11-02T00:33:52Z | observation | architect-design | high (records written on grugops/arch-ABC-264; corrections quote sealed measurements) |  | # Artifacts (published as an observation: an artifact-ref needs a gate_run this records-only hop cannot have): ADR-0059 new; ADR-0056 two dated lines (D2: T3 rationale corrected to 17-23 % of exact cuts, P2 -> ABC-264 / ADR-0059; D6: Phase 1 paused, Phase 2 next, pending the owner) |
