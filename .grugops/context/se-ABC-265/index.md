<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-265

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T15:29:00Z | decision | software-engineer | high: as committed in e5694864; the ADR-0025 amendment as written |  | # se-ABC-265 design: the ADR-0025 shared-table amendment built as written; no call site changed |
| 2026-11-02T15:29:00Z | observation | software-engineer | high: pointer note (filed as observation; artifact-ref needs gate_run) |  | # se-ABC-265 artifacts: branch grugops/ABC-265 @ e5694864 (+ records commit); raw evidence in raw/ |
| 2026-11-02T15:29:00Z | observation | software-engineer | high: deterministic cross-build and unit readings under the lock; G6/profile are SE readings, graded G6 is QE's; per-call figures are estimates |  | # se-ABC-265 acceptance: A1, A2 (incl. T10 x2), A3, A4, A5 all met as read; ABC-081/122/208 rows ran unedited |
| 2026-11-02T15:29:00Z | observation | software-engineer | high: every gate run under the lock at e5694864; QE-owned gates not run |  | # se-ABC-265 gates: lint/typecheck/build 0; npm test 64 files 2 387 passed, skips 0; G1 54/58; G9 empty |
