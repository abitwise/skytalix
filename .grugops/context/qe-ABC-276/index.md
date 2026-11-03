<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-276

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T15:17:50Z | decision | qe-e2e | high: A1-A7 MET on QE's own runs (20 real r/d runs with fake tools incl. executed-argv cmp, 36-argv dry-run matrix, 23-vector cutechessArgs JSON, 0 src lines, 40/40 + gates); merge stays human |  | # qe-ABC-276 verdict: PASS_WITH_GAPS. A1–A7 MET on QE's own runs; QE-276-a/b LOW, QE-276-c/d INFO; nothing blocks merge |
| 2026-11-03T15:17:50Z | observation | qe-e2e | high on the facts (run and probed); severities are QE's judgement: LOW for an uncovered call site that is correct today and an inherited word-pass that cannot bite on this host |  | # qe-ABC-276 gaps: QE-276-a and QE-276-b LOW, QE-276-c and QE-276-d INFO. Nothing blocks merge |
| 2026-11-03T15:17:50Z | observation | qe-e2e | high: commands as run under the host lock, offline only, 2026-11-03 ~15:05-15:16Z |  | # qe-ABC-276 runs: commands, test data and flaky risk (offline; no game, no real engine match; nothing left running) |
