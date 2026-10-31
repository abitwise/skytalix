<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-247

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T07:30:55Z | decision | qe-e2e | high: A1-A4 run in this hop as pre-registered (PREREG 3050c636); A2 ALONE, 6 games, thermal stop never near |  | # qe-ABC-247 verdict: QE PASS. rpair gives skytalix `Skill Level` 6 on both builds; base `ca6e675c` and head both search 4 000 ms under block 01's argv, and the control without the token reads 3 000 ms |
| 2026-10-31T07:30:55Z | observation | qe-e2e | high on what was run; none blocking; QE-247-d's dist identity UNKNOWN - verify (low stakes) |  | # qe-ABC-247 findings: none blocking. Five INFO, no HIGH, MEDIUM or LOW |
| 2026-10-31T07:30:55Z | observation | qe-e2e | high: 3 cutechess runs ALONE on the dry run's own argv; PGN clocks cross-checked with the engine's info time lines |  | # qe-ABC-247 A2, ALONE: block 01's argv through cutechess-cli at `-rounds 1`. Base and head both read 4.0 s on every skytalix search move (84 and 125, none at 3.0 s); the control without the token reads 3.0 s (95, none at 4.0 s) |
| 2026-10-31T07:30:55Z | observation | qe-e2e | high: every check and gate run by QE at cec9c252; mutations in a scratch clone, never committed |  | # qe-ABC-247 A1 and A4: the pin, the mutations, the r/d byte-equality and the gates, re-run by QE at `cec9c252` |
| 2026-10-31T07:30:55Z | observation | qe-e2e | high: read in git at both SHAs; agrees with A2's engine behaviour |  | # qe-ABC-247 A3 spot-check: the SE's file:line readings (`se-ABC-247` `…e9efa27d`) hold at `ca6e675c` and at the head |
| 2026-10-31T07:30:55Z | observation | qe-e2e | high: files listed are committed on grugops/qe-ABC-247 (an observation, not an artifact-ref: no §14-gate run to bind) |  | # qe-ABC-247 artifacts (an observation, not an artifact-ref: no §14-gate run to bind) |
