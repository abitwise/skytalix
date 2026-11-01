<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-262

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T20:34:02Z | decision | qe-e2e | high: every A-row re-read under the lock or from git; raw evidence in raw/ |  | # qe-ABC-262 verdict: PASS_WITH_GAPS (A4 waived by the Orchestrator); QE-262-a LOW, QE-262-b INFO, QE-262-c INFO; none blocking |
| 2026-11-01T20:34:02Z | observation | qe-e2e | high: 7 plant trees run under the lock; diffs and logs in raw/plants |  | # qe-ABC-262 plants: QX1, PL3a, QX2 red on the early-exit row; QB green on the row and red on the ENGINE_DEEP walk; QE's QBe and QKb red on the black row |
| 2026-11-01T20:34:02Z | observation | qe-e2e | high: gaps read from the plant runs and the code |  | # qe-ABC-262 gaps: QE-262-a (LOW), QE-262-b (INFO), QE-262-c (INFO, host); none blocking |
| 2026-11-01T20:34:02Z | observation | qe-e2e | high: src/legal.ts read at 39a6237e; QB deep-walk log in raw/plants |  | # qe-ABC-262 A4 waiver re-read: src/legal.ts:429 is correct in production; QB is masked by the epoch-0 alias and caught by ENGINE_DEEP |
| 2026-11-01T20:34:02Z | observation | qe-e2e | high: gates and G8 window run under the lock; outputs in raw/gates and raw/g8 |  | # qe-ABC-262 gates: npm test 2 376 ×3 (base 2 374 ×3), 0 skips; lint, typecheck, build rc 0; rows 0.29 ms; G8 H 8.94 s / B 8.94 s, ALONE ×6; merged tree 2 376 |
