<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-268-p2

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T20:02:26Z | decision | qe-e2e | high: fixed before any part-2 game was started |  | # qe-ABC-268-p2 PREREG (part 2): how the QE-268-a/b/c re-check and A6 (the 100-game read, the Stockfish smoke, the Levels deep lane) are read, fixed before any game is started |
| 2026-11-02T20:47:14Z | decision | qe-e2e | high: verdict by the PREREG rule (e2d24e3d); A6 MET at 58.0 >= 50.0; one LOW gap |  | # qe-ABC-268-p2 verdict: PASS_WITH_GAPS. A6 MET: the 100-game read at 100 ms scored 58.0 / 100 (W/D/L 41/34/25, Elo +56.1 +/- 56.1, 0 time losses, 0 faults) against the GAIN bar of 50.0. Smoke MET (8.0 / 10), Levels MET (57 / 57), QE-268-a/b/c closed, gates green; one LOW gap (QE-268-p2-a: the host was not alone for part of the read) |
| 2026-11-02T20:47:14Z | observation | qe-e2e | high: gaps named from this hop's readings; the foreign-load window from the harness's own host.log |  | # qe-ABC-268-p2 gaps (part 2): QE-268-a/b/c CLOSED; QE-268-p2-a LOW (the host was not alone for games 24-64 of the read and 2-3 of the smoke); QE-268-p2-b/c/d/e INFO; QE-268-d/e/f/g INFO carried |
| 2026-11-02T20:47:14Z | observation | qe-e2e | high: paths, commits and window as recorded (observation: an artifact-ref needs a gate_run) |  | # qe-ABC-268-p2 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got) |
| 2026-11-02T20:47:14Z | observation | qe-e2e | high: every run as stated under the lock; figures from cutechess-cli's own lines and the vitest summary; raw under raw/ |  | # qe-ABC-268-p2 per row (part 2): QE-268-a/b/c CLOSED (QP2-QP6 red, head 270/270); A6 58.0 / 100 MET (W/D/L 41/34/25, Elo +56.1 +/- 56.1, 0 time losses, 0 faults); smoke 8.0 / 10 MET; Levels 57 / 57 MET; gates green |
