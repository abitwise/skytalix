<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-207

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-26T00:51:19Z | decision | qe-e2e | high (every criterion read at 3d39c8ff by QE; readings pre-registered and run once) |  | # ABC-207 QE verdict: FAIL at merge 3d39c8ff. A1–A4 MET (G6 MET: position-6 8 = 8, kiwipete 7 = 7; G2 660.7 / 661.7 ns); A5 NOT MET: D d1 NEUTRAL −15.6 ± 22.8, the S1 extension ran, pooled 800 games −18.3 ± 16.5 is LOSS. Not merged; back to BA/PM. UAT not signed |
| 2026-10-26T00:51:19Z | failed-attempt | qe-e2e | high |  | # Failed attempt: ABC-207 at 3d39c8ff (mobility N4 B4 R2 Q1 K4, early-queen 25 cp) is not GAIN under S1: d1 −15.6 ± 22.8, pooled 800 games −18.3 ± 16.5 (LOSS). Do not re-read it as is |
| 2026-10-26T00:51:19Z | observation | qe-e2e | high (every command run by QE at 3d39c8ff; pre-registered; raw files read) |  | # ABC-207 D (A5, ship rule S1): d1 NEUTRAL −15.6 ± 22.8, so the one extension ran; d2 NEUTRAL −20.9 ± 23.8; pooled 800 games −18.3 ± 16.5, LOSS. Not GAIN, so S1 is NOT MET |
| 2026-10-26T00:51:19Z | observation | qe-e2e | high (every command run by QE at 3d39c8ff; pre-registered; raw files read) |  | # ABC-207 QE gate at merge 3d39c8ff: A1–A3 MET by QE's own checks; the 12 moved rows are exactly the ruling's set (cross-run both ways); the A4 re-find holds on base and branch; 25 of 29 plants red their rows, 4 survive (named) |
| 2026-10-26T00:51:19Z | observation | qe-e2e | high (every command run by QE at 3d39c8ff; pre-registered; raw files read) |  | # ABC-207 pre-check, G2 and G6 (NFR-005 at 3 s, ≥ base): pre-check counts equal the design's, no miss predicted; G2 MET (660.7 / 661.7 ns); G6 MET (kiwipete 7 = 7, position-6 8 = 8, all 20 runs), clean host. G11 reported: head's five choices equal base's |
