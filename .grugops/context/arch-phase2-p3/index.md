<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-phase2-p3

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T17:14:13Z | decision | architect-design | high on the measured premise and bars; the Elo effect is an estimate until C2' reads it; the cause of ABC-264's loss stays unmeasured |  | # P3 futility is the Phase 2 item that stands without P1; ADR-0061 (PROPOSED): skip quiet non-checking moves after the first at null-window nodes of remaining depth 1-3 when eval + 150/350/550 cp <= alpha, behind searchWithoutFutility / chooseMoveWithoutFutility; bars A4 (a) <= 0.88x at depth 8 both recursions, (b) >= +0.20 ply at 47 000 nodes, A3 drift all within 25 cp, mate 0, zugzwang 7/7, cut audit <= 0.5 % flips and 0 >= 200 cp; intent GAIN |
| 2026-11-02T17:14:13Z | observation | architect-design | high (deterministic fixed-depth, maxDepth and maxNodes runs on a scratch copy of main src f2388e40; the door reproduces ADR-0059's door counts and the rebuilt reverse-futility knob 4d1c0616's head counts to the node); the audit samples the 190-row corpus, not games |  | # Phase 2 on main, each item alone: P3 futility (150/350/550, d<=3) 0.79-0.83x at depth 8, +0.279 ply at 47 000 nodes, every safety row clean; P4 drifts (87.7 %) with 11.5 % audit flips; P5 depth-gated (+0.06 ply); P6 loses zugzwang.004 and drifts 345 cp. A cut audit finds reverse futility (ABC-264) right at 99.92 % of its cuts |
| 2026-11-02T17:14:13Z | observation | architect-design | high (files in this branch) |  | # Artifacts of arch-phase2-p3: ADR-0061 (PROPOSED, P3 futility), dated lines in ADR-0056 D2 and ADR-0059 Status, raw probe; inputs for BA/PM and the Orchestrator |
