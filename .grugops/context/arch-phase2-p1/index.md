<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-phase2-p1

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T14:47:13Z | decision | architect-design | high on the measured premise; the Elo effect is an estimate until C2' reads it |  | # P1 confirmed as the next Phase 2 item; ADR-0060 (PROPOSED): log-table LMR, PV -1, cap 2 plies, child depth >= 1, behind searchWithoutLogReductions / chooseMoveWithoutLogReductions; history term deferred to O1h; A4 bars <= 0.85x at depth 8 (both recursions) and >= +0.25 ply at 47 000 nodes; intent GAIN |
| 2026-11-02T14:47:13Z | observation | architect-design | high (deterministic fixed-depth, maxDepth and maxNodes runs on a scratch copy of 4d1c0616; door counts reproduce ADR-0059's head counts to the node); P3/P5 forms untuned, ranking only |  | # P1 probe: a log-table LMR (1.0 + ln d x ln m / 2.0, PV -1, cap 2 plies, child depth >= 1) needs 0.68-0.80x the flat rule's nodes at depth 8 in both recursions and reaches +0.305 ply at 47 000 nodes; drift 100 % (max 18 cp), mate floor 0/163 one ply deeper, zugzwang 7/7, G1 54/58. P3 and P5 save less (0.88-0.91x, 0.83-0.99x) |
| 2026-11-02T14:47:13Z | observation | architect-design | high (files in this branch) |  | # Artifacts of arch-phase2-p1: ADR-0060 (PROPOSED, P1 log-table LMR), dated pointers in ADR-0026 d6 and ADR-0056 D2, raw probe under raw/probe/ |
