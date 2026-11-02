<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-268

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T18:09:01Z | decision | software-engineer | high: as committed in df984484; ADR-0061 d1-d5 as written, no deviation |  | # se-ABC-268 design: ADR-0061 decisions 1-5 built as written, no deviation; futilityNode / futileMove, switch `futility`, doors searchWithoutFutility / chooseMoveWithoutFutility |
| 2026-11-02T18:09:01Z | observation | software-engineer | high: pointer note (filed as observation; artifact-ref needs gate_run) |  | # se-ABC-268 artifacts (filed as observation; artifact-ref needs a gate_run): branch grugops/ABC-268, claim aa652215, code df984484 |
| 2026-11-02T18:09:01Z | observation | software-engineer | high: deterministic cross-build, fixed-depth, maxNodes and scratch-audit readings under the lock; every head, door and audit count equals the probe's; raw in raw/ |  | # se-ABC-268 acceptance: A1 met (cross-build node-equal), A2 met (21 plants red), A3 met (drift max 10 / 0 cp, mate 0/189, zugzwang 7/7, cut audit 0 of 2 943), A4 met; every head, door and audit count reproduces the probe exactly |
| 2026-11-02T18:09:01Z | observation | software-engineer | high: every gate run under the lock; G8 interleaved x3; G6 is the SE's reading, QE grades; QE-owned gates and A6 not run |  | # se-ABC-268 gates: lint, typecheck, build exit 0; npm test 2 407 passed (base 2 376), skips 0; skip-integrity and lane inventory clean; 14 deep lanes green; G1 54/58; G8 head 8.68 s; G6 (SE reading) >= base on both boards; G9 met |
