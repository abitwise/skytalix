<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-282

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T21:26:17Z | decision | qe-e2e | high: bars copied from ticket ABC-282 A0-A6 and ADR-0071 D10, D11 before any game, timing read or offline read; builds, commands, order, estimates and verdict rules fixed; nothing loosened |  | # qe-ABC-282 PREREG, sealed and committed before any game and before any QE run. A6 is 100 games at `d --tc 40/8` (40 moves in 8 SECONDS), W1 against main's merge-base, GAIN ≥ 50.0 / 100, estimated 30–45 min, so it runs. A miss is final: no re-play. A4 is the 5-game 40/15 check, estimated 3.3–3.7 h, over the 1 h line, so this hop does NOT run it: STOP and report, only the owner approves it |
| 2026-11-04T21:30:29Z | decision | qe-e2e | high: launch failures reproduced and recorded; no game played before this note; no bar, build or control changed |  | # qe-ABC-282 PREREG amendment, sealed before any game: A6's harness runs from a small `--shared` checkout, and this is launch 3. No bar, command token, build or control changes. Also a count fix: the A3 (b) sweep is 1 140 go lines, not 2 280 |
