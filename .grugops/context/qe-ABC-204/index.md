<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-204

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25T02:58:33Z | decision | qe-e2e | high (every criterion read at the merge; A5 UNRESOLVED by a battery stop, graded as the page says) |  | # ABC-204 QE verdict: PASS_WITH_GAPS at merge e546e124. A1–A4 and A6 MET, A5 UNRESOLVED (battery stop at 99/100, not re-run). M1 baseline R = 2 061.3 ± 50.3 at E 1 910. D budget B = 1 500 ms |
| 2026-10-25T02:58:33Z | observation | qe-e2e | high (raw .out/.pgn read; interval QE-computed with a port of elo.cpp checked against a tool line; reading stopped by battery, so UNRESOLVED) |  | # ABC-204 A5 (A/A D at 3 000 ms): UNRESOLVED, stopped by a battery switch at 99 of 100 games; 0 faults; A6's D wall 330 s, so B = 1 500 ms |
| 2026-10-25T02:58:33Z | observation | qe-e2e | high (raw .out/.pgn read; tool figures re-derived; clean host for the baseline) |  | # ABC-204 A4 baseline R: 2 061.3 ± 50.3 at UCI_Elo E = 1 910 (frozen), 200 games, 0 faults, on a clean host; A6 R 4.40 h ≤ 10 h |
| 2026-10-25T02:58:33Z | observation | qe-e2e | high (every command run by QE at the merge; outputs read; probes cleaned up) |  | # ABC-204 QE gate: A1–A3 MET at merge e546e124; openings reproduce byte-for-byte; two harness record defects found (QE-204-a LOW, QE-204-b MEDIUM) |
