<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-fix-ABC-208

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-26T04:11:21Z | decision | software-engineer | high: test-only rows, each shown red on its plant and green at head; deterministic |  | # se-fix-ABC-208: three test-only rows close QE-208-a, -b and -c; behaviour rows for a and b, a source row for c; all default lane, all deterministic |
| 2026-10-26T04:11:21Z | observation | software-engineer | high: plants on a scratch copy restored and cmp-verified; gates as run; durations are not readings |  | # se-fix-ABC-208 evidence: the six QE plants survive head's old tests (0 of 2 123 each) and each goes red on exactly one new row; head green; gates green (npm test 2 128/2 128, Duration 8.02 s) |
