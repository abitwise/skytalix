<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-264

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T01:09:54Z | decision | software-engineer | high: as committed in 358b5f4a; ADR-0059 d1-d5 as written, one allowed helper |  | # se-ABC-264 design: ADR-0059 decisions 1-5 built as written, no deviation; one shared zugzwang-guard helper |
| 2026-11-02T01:09:54Z | observation | software-engineer | high: pointer note (filed as observation; artifact-ref needs gate_run) |  | # se-ABC-264 artifacts (filed as observation; artifact-ref needs a gate_run): branch grugops/ABC-264, claim 5efaa6c6, code 358b5f4a |
| 2026-11-02T01:09:54Z | observation | software-engineer | high: deterministic cross-build and fixed-depth readings under the lock; A4 counts equal the probe's to the node; raw in raw/ |  | # se-ABC-264 acceptance: A1 met (cross-build node-equal), A2 met, A3 met (97.33 % / max 107 cp in both recursions, mate floor 0/189, zugzwang 7/7), A4 met with the probe's counts to the node (0.5901 / 0.6373 / 0.6173 / 0.6282) |
| 2026-11-02T01:09:54Z | observation | software-engineer | high: every gate run under the lock; G8 interleaved x3; QE-owned gates not run |  | # se-ABC-264 gates: lint, typecheck and build exit 0; npm test 2 403 passed, skips 0; skip-integrity and lane inventory clean; 14 deep lanes green; G1 54/58; G8 head 8.93 s; G9 met |
