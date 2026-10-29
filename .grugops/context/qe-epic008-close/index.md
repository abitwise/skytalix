<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-epic008-close

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-28T21:22:09Z | observation | qe-e2e | high: pre-registration, written before game 1; nothing in it is a measurement |  | # PREREG, qe-epic008-close: two M1 R readings on this host (option B), then the M3 gate reads |
| 2026-10-29T01:43:41Z | observation | qe-e2e | high: the tool line and the raw files read; QE elo.cpp port equal to the tool |  | # Reading 1, R(baseline) at 3497aad2 on this host: 1 910 + 188.5 ± 54.8 = 2 098.5 ± 54.8, score 74.8 % (in band), 200/200, 0 faults; one run, final |
| 2026-10-29T06:30:12Z | decision | qe-e2e | high on the readings and gates as run; M1 grading is BA/PM's; host throttling UNKNOWN - verify |  | # QE verdict, qe-epic008-close: PASS. Both M1 readings are valid, final results; M3 is MET; the gates are green. M1 inputs: −82.9 ± 73.8 (BA/PM grades it) |
| 2026-10-29T06:30:12Z | observation | qe-e2e | high: the tool line and the raw files read; QE elo.cpp port equal to the tool |  | # Reading 2, R(close) at 38536a34 on this host: 1 910 + 105.6 ± 49.5 = 2 015.6 ± 49.5, score 64.75 % (in band), 200/200, 0 faults; one run, final |
| 2026-10-29T06:30:12Z | observation | qe-e2e | high: every instrument run as stated on 38536a34; outputs read |  | # M3 on the close sha 38536a34, read after both R readings: G1, G5, G6, G8, G9 all MET; the gates are green |
