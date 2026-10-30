<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-225-w1

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T20:36:18Z | decision | qe-e2e | high (written and sealed before any game; A1-A4 and gates already re-run by QE) |  | # qe-ABC-225-w1 pre-registration: one real `rpair --rounds 10 --concurrency 1` (40 games, ALONE, width 1) reads A5 and A6; one 4-game `start=51` probe reads the `start=S` point; the Elo figure is INFO |
| 2026-10-30T22:31:27Z | observation | qe-e2e | high: every check and gate run by QE as stated at 933d9f35; no engine, no game |  | # qe-ABC-225-w1: A1–A4 and the gates re-run by QE at `933d9f35` (code `3dca0e67`): all MET, no defect; the SE's LOW ruled |
| 2026-10-30T22:31:27Z | observation | qe-e2e | high: one real run, read against the sealed PREREG bars by QE's own scripts; Elo is INFO |  | # qe-ABC-225-w1 A5 and A6: the real 40-game smoke at `--concurrency 1` ran to the end ALONE. A5 MET on all 6 points; A6 MET: 1.846 h play wall, 21.67 games/h, 400-game pair at width 1 projected at 18.5 h. The `start=51` probe is MET |
| 2026-10-30T22:31:34Z | decision | qe-e2e | high: by the pre-registered verdict rule (PREREG 6d1d5bff) |  | # qe-ABC-225-w1 verdict: PASS_WITH_GAPS. A1–A6 all MET; the real 40-game `rpair` ran at width 1 to the end, ALONE, with a Tctl median of 74.1 °C (max 78.8 °C); no tool defect; gaps are non-blocking |
