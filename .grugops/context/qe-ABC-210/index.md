<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-210

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-27T19:30:59Z | decision | qe-e2e | high: gate read by QE at d71fc369; S1 graded as pre-registered |  | # QE verdict ABC-210: FAIL on A5 (S1 NOT MET: pooled NEUTRAL −4.78 ± 16.21 over 800 games) at merge `d71fc369`. A1–A4 and A6 MET; the gate, G2 and G6 pass; UAT NOT signed; not merged |
| 2026-10-27T19:30:59Z | failed-attempt | qe-e2e | high: S1 graded as pre-registered; one run, final |  | # Failed attempt: ABC-210's check extension at the horizon (ADR-0051) is not GAIN under S1. d1 −1.7 ± 22.8, d2 −7.8 ± 23.0, pooled −4.78 ± 16.21 over 800 games, all NEUTRAL |
| 2026-10-27T19:30:59Z | observation | qe-e2e | high: one pre-registered session per reading; host sampled every 10 s |  | # QE ABC-210 readings before D: pre-check 8/8 equal to the ruling's table; G2 MET; G6 MET against "≥ base" (8 = 8, 9 = 9, n = 5); G11 choices equal; real-clock rows green; G5, G7, G9 MET, G10 none |
| 2026-10-27T19:30:59Z | observation | qe-e2e | high: deterministic probes, lanes and plants as run at d71fc369; raw/ holds every output |  | # QE gate ABC-210 at merge `d71fc369`: A1 6 156/6 156 cells out of tree, A2 and A3 as ruled, P1 bites at depth 2, the moved rows are exactly the ruled set, 26/26 plants red; the LOW has no value effect found |
| 2026-10-27T19:30:59Z | observation | qe-e2e | high: the tool's own lines, checked equal by QE's elo.cpp port; raw/ holds the redacted outputs |  | # QE ABC-210 D under S1: d1 NEUTRAL −1.7 ± 22.8, d2 NEUTRAL −7.8 ± 23.0, pooled NEUTRAL −4.78 ± 16.21 over 800 games, so S1 is NOT MET; D exercised the change; the grade is the same every way |
