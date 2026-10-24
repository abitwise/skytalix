<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-206

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-24T14:00:02Z | decision | qe-e2e | high (one run under the owner rule; every window precondition-checked and 1 s monitored; pre-registered) |  | # ABC-206 timing readings, one run: A4 MET at 0.438 and 0.419; G6 depth 7 = base on both; G1 54/58 row-identical; perft counts equal, 5.05 M/s |
| 2026-10-24T14:00:02Z | decision | qe-e2e | high (every criterion read at the merge; A6 not readable and owed) |  | # qe-ABC-206 verdict: PASS_WITH_GAPS at merge b8a30264; A4 MET (0.438 / 0.419); A6 not readable (ABC-204 not Done); UAT signed, waiver does not apply |
| 2026-10-24T14:00:02Z | decision | qe-e2e | high (deterministic differentials compared with cmp; plants run on a scratch copy) |  | # ABC-206 identity and plants: A1 byte-identical over 7 664 rows; A2 0 mismatches; the SE's three guards bite; two lane gaps found by plants |
