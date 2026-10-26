<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-208

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-26T12:23:50Z | decision | qe-e2e | high: every criterion read by QE at 3a87f9d7; one pre-registered run; S1 GAIN on d1 |  | # ABC-208 QE verdict: PASS at merge 3a87f9d7. A1–A6 MET; G6 MET with +1 ply on both boards (kiwipete 7 → 8, position-6 8 → 9); G2 642.5 / 647.0 ns; D d1 GAIN +38.4 ± 23.3, so S1 is MET without the extension. QE-208-a/b/c are closed. UAT signed on this verdict (…5aaf7cec item 2) |
| 2026-10-26T12:23:50Z | observation | qe-e2e | high: gates and lanes as run at 3a87f9d7; plants on a scratch copy restored and cmp-verified; real-clock rows run on a quiet host |  | # ABC-208 QE gate at merge 3a87f9d7: the QE-208-a/b/c plants all red their rows (6 of 6, head 2 128/2 128 green); gates green; the static verdict stands unmoved; the 10 real-clock rows run and green; G5, G8, G9, G10 MET; N8-LANE 46.0 s |
| 2026-10-26T12:23:50Z | observation | qe-e2e | high: pre-registered single session, 0 of 20 G6 runs overlapped, deterministic pre-check counts |  | # ABC-208 pre-check, G2 and G6 (NFR-005 at 3 s, ≥ base): pre-check counts equal the ruling's, no miss predicted; G2 MET (642.5 / 647.0 ns); G6 MET with a gain of one ply on both boards (kiwipete 7 → 8, position-6 8 → 9, all 20 runs), clean host. G11 reported: head changes one of five choices (10.Ne4: exd6 → Be2) |
| 2026-10-26T12:23:50Z | observation | qe-e2e | high: cutechess-cli's own line, reproduced by QE's elo.cpp port; 400 of 400 games, 0 faults; grade unchanged overlap-free and load-free |  | # ABC-208 D (A5, ship rule S1): d1 GAIN, +38.4 ± 23.3 (116/72/212, 400 of 400, 0 faults). S1 is MET without the extension. The grade holds without the 18 games a foreign vitest met (+40.2 ± 23.9) and without the 78 games that touched load1 > 8 (+30.3 ± 25.7) |
