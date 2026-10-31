<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-242

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T05:13:32Z | decision | qe-e2e | high: A1-A8, plants, oracle and G8 run in this hop as pre-registered (PREREG 5da281c9) |  | # QE on `ABC-242` at `6884d61a` (base `4387d4e8`): **PASS_WITH_GAPS.** A1–A7 MET and A8 confirmed. `G8` H 9.41 s (B 9.21 s). The gap is QE-242-a (MEDIUM): an `ABC-244` condition-2 ruling is owed for the step-10 lane form. UAT signed by this verdict |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high: G8 ALONE, wait-clear by PID before each of 6 runs, admissible; deep lanes once each, ALONE |  | # `ABC-242` gates, deep lanes and `G8` at head `6884d61a` (base `4387d4e8`): A7 MET. `G8` H 9.41 s (B 9.21 s, +0.21 s), so `NFR-008` is MET and ABC-244's tranche-2 trigger (> 9.6 s) does NOT fire |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high on the handed budgets (counting shim); the condition-2 reading is a ruling owed, not a fault |  | # `ABC-242` R1 census and the step-10 choice: the census lines exist and the code reads them, but on the budgets actually handed, step 10 does not meet `ABC-244` condition 2 as written (QE-242-a, MEDIUM, a ruling is owed) |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high: 20 plants, whole lane each, on a scratch tree; all as pre-registered; equivalence by reasoning |  | # `ABC-242` plants at head `6884d61a` (base `4387d4e8`): every pre-registered red holds. 7 lane survivors: 4 are equivalent, and 3 are not (cap 8, cap 50, a clock read) |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high on what was run; none blocking |  | # `ABC-242` QE findings: one MEDIUM (an R2 / condition-2 ruling is owed), one LOW, the rest INFO; none is a build fault |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-242 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # `qe-ABC-242` artifacts (committed on `grugops/qe-ABC-242` under `.grugops/context/qe-ABC-242/raw/`) |
| 2026-10-31T05:13:32Z | observation | qe-e2e | high: oracle run out of tree against the real base and head trees; 362 checks, 0 FAIL |  | # `ABC-242` A1, A2, A3, A5 and A6, read against the REAL base tree `4387d4e8` (out of tree), plus a 1 099-root differential sweep: 362 checks, 0 FAIL |
