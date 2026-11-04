<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-300

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T14:44:14Z | decision | qe-e2e | high: A1-A5 and A7 MET on QE's own runs (83-case dry-run matrix cut vs branch, 14-refusal process probe, cut rows vs branch 39/40, one fake-tool real run, 7 mutants, gates); A6 UNKNOWN - verify by design; merge stays human or Orchestrator-on-green |  | # qe-ABC-300 verdict: PASS_WITH_GAPS. A1–A5 and A7 MET on QE's own runs; A6 `UNKNOWN - verify` carried to `ABC-282` A6 (QE-300-a); QE-300-b LOW, QE-300-c and QE-300-d INFO. Nothing blocks merge |
| 2026-11-04T14:44:14Z | observation | qe-e2e | high: commands as run under the host lock, offline only (no game), 2026-11-04 ~14:28-14:44Z |  | # qe-ABC-300 runs: commands, test data and flaky risk (offline; no game; nothing left running) |
| 2026-11-04T14:44:14Z | observation | qe-e2e | high on the facts (run and probed); severities are QE's judgement: LOW for two correct-today behaviours with no row, INFO for an inherited flag rule and a unit misreading in a note |  | # qe-ABC-300 gaps: QE-300-a (A6, carried to ABC-282 A6), QE-300-b LOW, QE-300-c and QE-300-d INFO. None blocks merge |
