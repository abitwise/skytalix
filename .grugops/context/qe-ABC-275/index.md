<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-275

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T13:03:42Z | decision | qe-e2e | high: A1-A5 and A7 MET on QE's own offline runs (whole-vector diff, 34-argv before/after diff, refusals, 0 src lines, 38/38 + gates); 4/4 mutants killed; A6 UNKNOWN - verify at R1 by ruling; merge stays human |  | # qe-ABC-275 verdict: **PASS_WITH_GAPS** on ABC-275 (R1 harness, tools only). QE's verdict signs acceptance (no UAT, ticket Test notes 3). 1 LOW gap, 3 INFO; none blocks merge. Merge stays human |
| 2026-11-03T13:03:42Z | observation | qe-e2e | high on the facts (read and run); severity is QE's judgement: LOW for a doc-only stale usage line the ticket's A3 item 3 pins |  | # qe-ABC-275 gaps: QE-275-a LOW (stale usage text), QE-275-b/c/d INFO. Nothing blocks merge |
| 2026-11-03T13:03:42Z | observation | qe-e2e | high: commands as run under the host lock, offline only, at 2026-11-03 ~12:59-13:03Z |  | # qe-ABC-275 runs: commands, test data and flaky risk (offline only; nothing left running) |
