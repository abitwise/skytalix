<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-fix-ABC-204

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25T03:16:26Z | decision | qe-e2e | high (verdict on the evidence in this task's observations) |  | # QE/E2E verdict: ABC-204 fix PASS_WITH_GAPS. QE-204-b and QE-204-a are closed; the readings stand; one new LOW (QE-204-h), pre-existing and not blocking |
| 2026-10-25T03:16:26Z | observation | qe-e2e | high (probes c8/c9 run at base and head; realpath variants measured on this host) |  | # QE/E2E: QE-204-h (LOW, pre-existing, not blocking). The out-dir guard compares path strings, so a path alias into the checkout gets through |
| 2026-10-25T03:16:26Z | observation | qe-e2e | high (each command run by QE on 2026-10-25 in the worktree and scratchpad; outputs read) |  | # QE/E2E: ABC-204 fix re-check. Hash proof, guard probes, diff read and gates, as they ran |
