<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-302

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T17:52:27Z | decision | architect-design | high: a pre-registration; the 28 anchors were dry-applied (each exactly once, restored byte-identical) and no mutant has been run |  | # arch-ABC-302 PREREG: 28 mutants and the rules that turn their kill sets into a form per row, sealed before the first mutant read |
| 2026-11-04T18:13:01Z | decision | architect-design | high: every form rests on a measured kill set under the sealed PREREG; the wall figure is a forecast scaled from Security/NFR's probe, which A8 grades |  | # arch-ABC-302 decision: ABC-302's DoR row 10 is met. R1, R2, R4, R5, R8 and R9 take form S; R3, R6 and R7 take W. R8 goes to uci-session's ENGINE_DEEP, and R9 takes option (ii). Option (b) does not bind, and there is no owner question. The forecast is about −0.50 s of wall |
| 2026-11-04T18:13:01Z | observation | architect-design | high: whole default lane per mutant at base and on a tip sketch, under the host lock on a scratch copy of src tree af2b77dc, 27 of 27 killed at both; durations are single in-thread reads, an estimate |  | # arch-ABC-302 observation: under the PREREG's 27 killed mutants, a tip sketch with six remnants keeps default-lane parity. R2, R8 and R9 each hold a guard no staying row holds, and R3 kills nothing on the list |
