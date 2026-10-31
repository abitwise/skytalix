<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-222

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T23:21:26Z | decision | qe-e2e | high (written and sealed before any game; pins verified by QE; bars copied from ABC-222 A1-A7 as folded and confirmed) |  | # qe-ABC-222 pre-registration: the `simple-tournament` smoke at 40/15: 5 games of the tip build against itself in `cutechess-cli` 1.5.1, ALONE, width 1; A1–A7 bars, derivations, thermal stop and the VOID rule |
| 2026-10-31T02:51:28Z | observation | qe-e2e | high: one real run, read against the sealed PREREG bars by QE's own reader; figures copied from raw/run/read.txt |  | # qe-ABC-222 reading: 5 games of `simple-tournament` at 40/15, ALONE, run to the end. A1–A5 and A7 MET, A6 reported: 0 losses on time, closest call 19 991 ms, worst period use 88.00 % over 10 side-periods, longest move 22 002 ms (+2 ms) |
| 2026-10-31T02:51:28Z | observation | qe-e2e | high: paths, hashes and commands as run |  | # qe-ABC-222 artifacts: branch, commits, scripts, commands and raw records |
| 2026-10-31T02:51:28Z | observation | qe-e2e | high for the measured facts; severities by QE |  | # qe-ABC-222 observations and gaps, with severity: none blocking, no defect |
| 2026-10-31T02:51:44Z | decision | qe-e2e | high: by the pre-registered verdict rule (PREREG 63f93685) |  | # qe-ABC-222 verdict: PASS. `simple-tournament` plays 40/15 over UCI with 0 losses on time (closest call 19 991 ms), ≥ 88.00 % clock use over 10 side-periods, and a longest move of 22 002 ms (< 22 500); ALONE, Tctl median 73.9 °C, max 76.1 °C |
