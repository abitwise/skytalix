<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-238

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T23:37:11Z | decision | software-engineer | high: as committed in 3abaefdd; the design is ADR-0058 d1-d5 as written |  | # se-ABC-238 design: one `deeper` argument on `tableCutoff`, one `deeperCutoffs` switch per recursion, two test-only doors (ADR-0058 d1-d4, as written) |
| 2026-11-01T23:37:11Z | failed-attempt | software-engineer | high on the readings (deterministic, two instruments agree); UNKNOWN - verify on the cause |  | # se-ABC-238 STOP on A4 / ADR-0058 falsifier F4: at fixed depth 8 the rule saves 0.6 % and 0.4 % of nodes, against a bar of 5 % |
| 2026-11-01T23:37:11Z | observation | software-engineer | high: deterministic cross-build and fixed-depth readings under the lock; raw in raw/ |  | # se-ABC-238 acceptance: A1 (G4) met, A2 met, A3 met, the mate floor met, A4 NOT MET (F4), firing rate 0.2 % |
| 2026-11-01T23:37:11Z | observation | software-engineer | high: pointer note (filed as observation; artifact-ref needs gate_run) |  | # se-ABC-238 artifacts: branch grugops/ABC-238, code 3abaefdd |
| 2026-11-01T23:37:11Z | observation | software-engineer | high: every gate run under the lock; outputs in raw/gates and raw/deep |  | # se-ABC-238 gates: lint, typecheck, build exit 0; npm test 2 386 = base 2 376 + 10; skips 0; G1 54/58; G7, G8, G9 met; deep lanes green |
