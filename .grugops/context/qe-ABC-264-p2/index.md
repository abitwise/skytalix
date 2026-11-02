<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-264-p2

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T13:44:13Z | decision | qe-e2e | high: fixed before any part-2 result was read |  | # qe-ABC-264-p2 PREREG (part 2): how A6 (the 100-game read, the Stockfish smoke, the Levels deep lane) is read, fixed before any result is read |
| 2026-11-02T14:28:16Z | decision | qe-e2e | high: verdict by the PREREG rule (a63b4c37); A6 NOT MET at 44.0 < 50.0 |  | # qe-ABC-264-p2 verdict: FAIL. A6 NOT MET: the 100-game read at 100 ms scored 44.0 / 100 (W/D/L 30/28/42, Elo -41.9 +/- 58.5), below the GAIN bar of 50.0. Smoke MET (7.0 / 10), Levels MET (57 / 57), gates green |
| 2026-11-02T14:28:16Z | observation | qe-e2e | high: paths, commits and window as recorded (observation: an artifact-ref needs a gate_run) |  | # qe-ABC-264-p2 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got) |
| 2026-11-02T14:28:16Z | observation | qe-e2e | high: every run as stated under the lock; figures from cutechess-cli's own lines and the vitest summary; raw under raw/ |  | # qe-ABC-264-p2 per row (part 2): A6 read 44.0 / 100 NOT MET (W/D/L 30/28/42, Elo -41.9 +/- 58.5, 0 time losses, 0 faults); smoke 7.0 / 10 MET (pooled S′ 25.0 / 30 = 83.3 %, re-pin does not fire); Levels 57 / 57 MET; gates green |
| 2026-11-02T14:28:16Z | observation | qe-e2e | high: gaps named from this hop's readings |  | # qe-ABC-264-p2 gaps (part 2): QE-264-p2-a HIGH (A6 NOT MET, 44.0 < 50.0, blocks the merge), QE-264-p2-b INFO (the harness labels 44.0 "NEUTRAL"), QE-264-p2-c INFO (colour asymmetry); QE-264-b LOW carried |
