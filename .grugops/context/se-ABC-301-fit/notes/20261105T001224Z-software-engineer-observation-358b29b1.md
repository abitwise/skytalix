---
id: 20261105T001224Z-software-engineer-observation-358b29b1
kind: observation
by: software-engineer
at: 2026-11-05T00:12:24Z
verified_by: 
confidence: high on every figure, all run outputs; the class of the 115 reds is a read of their messages, not a row-by-row ruling
refs:
  - se-ABC-301-fit
  - se-ABC-301-fit-2
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - F3
  - QE-301-b
  - QE-301-e
  - grugops/ABC-301
  - dd88560f
  - b297ab89
  - e763119c
  - se-ABC-301-fit/20261104T235610Z-software-engineer-decision-e33f11bd
  - src/evaluate-params.ts
supersedes: 
seal: sha256:18300ea55c8af7c207f1bfee3574fcce26cf3962f8d6614271177d890e3135dc
---

# se-ABC-301-fit results: the one fit is feasible, 0.9872 ×, byte-identical on a second run, the gate clean on the emitted file, 26 of 26 relation rows green. zugzwang.001 is red (…failed-attempt note), so scope 4 was not taken

Emission at dd88560f, src/evaluate-params.ts sha256 8ca6744f28846563872bd09e40ba0fa04c7958ec911968d42e7fd2140745cb06, tool e763119c, PREREG …e33f11bd sealed at b297ab89 before the fit. Raw under this task's raw/.

**The fit.** C-F, λ 1e-8 (inner 0.580536 against C-S 0.581856, above the 0.1 % rule). 7 Newton steps, all bounded, stopped by relative change. K_own 0.618440, K_lichess 0.825967. Feasible: no STOP. Extract 3:47, peak 1 552 MiB. Fit 88 s, peak 491 MiB, heap flag 3 000 MB. Second run's fit 64 s.

**Three of the 26 rows are active,** each μ > 0: row 5, the phase-24 g-pawn twin (read -4); row 13, pawns A2's gap ≤ 50 (read 48); row 17, A8's right neighbour (read -19). The other 23 are slack.

| bar | reading |
|---|---|
| B-T0 | manifest 02708263…, 37 files; Lichess pin and licence as in the PREREG |
| B-T1 | base values: 1 494 610 gated, 0 misses, worst 0.9583 cp |
| d5 check 2 | on the emitted file: 1 532 990 gated, 0 misses, worst 0.9583 cp. The count differs because the quiet filter reads the emitted evaluate, so its rows differ from B-T1's: own training 174 227, own validation 47 309 |
| B-T2 | **0.9872 ×** (validation 0.586076 → 0.578550; training 0.583943 → 0.575918). Lichess rows 0.591612 → 0.584776. Reported beside: the own-only fit, C-S, 0.9871 × |
| B-T3 | a full second extract, fit and emit from a clone at b297ab89: **byte-identical**; rows.jsonl and fit.json also identical |
| QE-301-b | tableOf(emission) equals fit.json's table: 0 mismatches over 422 terms in each half, and both mobility weights and the cap |
| F3 | **26 of 26 relation rows green on the emission,** read by the engine, the seam for rows 6 and 9, and evaluate less evaluateWithoutMobility for row 11. Each equals the tool's read. Two of them sit behind red test rows, see below |
| B-T4 | the src/ diff at dd88560f is src/evaluate-params.ts alone. No mirror row is red in the default lane. **G2 and the endgame G2: not read,** stopped first |
| B-T5 | **zugzwang.001 RED,** the other six zugzwang rows green. Mate floor, G1 and the futility audit: not read, stopped first |
| B-T6-B-T8 | not read |

**ADR-0070 F4, dead weight:** PASSED_KING_OWN eg at R = 1 is at its 0 bound. No other E4a eg half is. KE 5, 10, 16, 28, 47, 63; KO 0, 3, 6, 24, 33, 52; FP 45, 17, 29, 46, 49, 113. U 0 in both halves. Mobility 4 / 9. The other E4a halves are held by the fit, not chosen by me.

**The lane.** One worker, one read each, ungraded and not comparable with the 10 s limit (QE-301-e). At b297ab89, before the emission: 2 685 passed, 71 files, 17.74 s. At dd88560f: 2 570 passed, **115 failed**, 13 files, 18.02 s. No default-lane row or file was added by this hop: the count stands at 2 685 and only one helper in src/evaluate.king-mobility.test.ts changed. The N8-LANE read of ≤ +0.10 s is the gate's and was not taken.

**The 115 reds are the re-pins scope 4 owes, plus the safety row** (raw/lane-tip-reds.txt names each). I read them for class, not one by one, and moved none. By class: B1 (e) 34, B1 (d) pin literals 6 (the relation inside each row is green, rows 21-26), the rule rows, K1 (b), K1 (c) of ABC-270, node and score pins in the search and engine files, and zugzwang.001. Two are worth naming:
- "white, with substantially more moves": evaluateWithoutMobility(MOBILE_WHITE) reads -4, not 0. That is the premise the PREREG forecast on C-F, a lost fixture property under my reading. Its relation, row 10, is green.
- B1 (a)'s "the frozen rows span…" is red on M-negzero-a, a -0 trap fixture, not on a mirror. It is a lost fixture property or a pin; not settled here.
