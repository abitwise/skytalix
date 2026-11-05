---
id: 20261104T235610Z-software-engineer-decision-e33f11bd
kind: decision
by: software-engineer
at: 2026-11-04T23:56:10Z
verified_by: 
confidence: high on the counts and reads, all run outputs; the premise reading is mine, for QE to check
refs:
  - se-ABC-301-fit
  - se-ABC-301-fit-2
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - E2
  - E4a
  - B-T1
  - B-T4
  - F3
  - QE-271-f
  - QE-301-b
  - grugops/ABC-301
  - e763119c
  - 8527e49f
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-4917f0f7
  - tools/tune/bounds.ts
  - tools/tune/tune.ts
supersedes: 
seal: sha256:f699b39d25acfd3737b4c7dc0d1ea3ef96974504df03b84a955dda4884cf785a
---

# se-ABC-301-fit PREREG, sealed before any fit: 26 relation rows bounded at once, free set 57 (C-S) or 429 (C-F), data manifest 02708263, base main 8527e49f, tool e763119c, one fit, no refit

Software Engineer, task se-ABC-301-fit (resumed as se-ABC-301-fit-2), on grugops/ABC-301. No fit has run on this pull's tool. What has run: the tool's deep lane and one extract, at tools/tune commit e763119c, under the host lock. ADR-0067 d6's amendment step 1, ABC-301 scope 2, P4.

## Base and tool
- Base: main 8527e49f, merged into the branch. src/evaluate-params.ts sha256 e74ff3e932271506926734c8eafc83d9d246645b116669930cba9146c320f7a9, E1's rule values, queen-on pairs and E4a's terms at 0. B-T7's base is main at the candidate freeze; that read is QE's.
- Tool: tools/tune at e763119c60044f3d0e06fc56791c641e15bf215b. TUNE_DEEP read 25 passed of 25 at that commit (the condition of ADR-0067 d5's dated line). A later change to tools/tune before the fit voids this note's tool line.

## Data
- Own: every PGN tracked at the fit commit whose two players are both this engine. Players: skytalix / base / skytalix-a / skytalix-b / sky-a / sky-b. 5 968 games read, 3 780 kept (1 571 by player, 617 duplicates). 284 459 positions kept.
- Lichess: the pinned 2017-03 export, CC0 (owner's Q-3K-7 (a)), 2 169 142 067 bytes, sha256 b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320. 288 867 games kept of 11 346 745; 1 000 000 rows at the cap, above the 250 000 stop. Replay drops 0. No Stockfish-labelled position, and no game against Stockfish, is training data.
- Rows: own training 172 019 (inner validation 49 783), own validation 46 688, Lichess 1 000 000. Own weight 0.5. Manifest sha256 027082638eff3f5169d5fc241f3794e641fce8a24f63af01e5f8ded79c4d67cd, 37 files, the same manifest as scope 0's B-T1 read.
- B-T1 at the base values, read by this extract: 1 494 610 positions gated, 0 misses, worst 0.9583 cp.

## Free set (ADR-0067 d6 with its dated lines)
- Free, each ≥ 0: PASSED R 1-6, DOUBLED, ISOLATED, KING_SHELTER_MISSING, KING_FILE_HALF_OPEN, KING_FILE_OPEN (mg and eg, 22); MOBILITY_WEIGHT (mg and eg, 2); the three queen-on mg halves (3); PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE eg at R 1-6 (18). That is 45.
- PSTs: C-S, 12 scales, ≥ 0, n = 57; or C-F, 384 tied cells with the L2 pull, n = 429. The rule re-runs on this data: lower inner-validation loss wins, a difference under 0.1 % goes to C-S, λ from {1e-8, 1e-7, 1e-6}.
- Held: material, phase constants, MOBILITY_CAP, the three queen-on eg halves at 0, every E4a mg half, E4a's R 0 and 7 entries, PASSED_UNSTOPPABLE both halves at 0.
- R1 (the king's rank symmetry) is not added.

## The bound set: 26 rows
Every row is one linear inequality Σ coef · evaluate(fen) ≤ right side, each with ruling (b)'s margin: ½ ‖a‖₁, plus 1 per position with 0 < w < 24 (per |coef|), plus 1 if strict. a below is the row's non-zero terms as written, mobility unclamped, PST cells before tying. Read is the row on the base table. FENs are constants in tools/tune/bounds.ts, each checked against its test file (or src/evaluate.taper-corpus.ts for B1 (d)) by the FEN source row. No row is non-linear under d4's model: the mobility clamp is its active set, as ruling (b) says.

| # | file | row | right side | margin C-S / C-F | read | a |
|---|---|---|---|---|---|---|
| 1 | evaluate.test.ts | scores startpos-minus-a-black-knight between +250 and +400 for white [score >= 250] | -250 | 2 / 2 | -309 | MATERIAL[knight].mg -0.958333, MATERIAL[knight].eg -0.041667, PST.knight[b1].mg -0.958333, PST.knight[b1].eg -0.041667, MOBILITY_WEIGHT.mg -0.958333, MOBILITY_WEIGHT.eg -0.041667 |
| 2 | evaluate.test.ts | scores startpos-minus-a-black-knight between +250 and +400 for white [score <= 400] | 400 | 2 / 2 | 309 | MATERIAL[knight].mg 0.958333, MATERIAL[knight].eg 0.041667, PST.knight[b1].mg 0.958333, PST.knight[b1].eg 0.041667, MOBILITY_WEIGHT.mg 0.958333, MOBILITY_WEIGHT.eg 0.041667 |
| 3 | evaluate.test.ts | prefers a white knight on e4 to the same knight on b1 | 0 strict | 6.5 / 6.5 | -70 | PST.knight[b1].mg 0.041667, PST.knight[b1].eg 0.958333, MOBILITY_WEIGHT.mg -0.208333, MOBILITY_WEIGHT.eg -4.791667, PST.knight[e4].mg -0.041667, PST.knight[e4].eg -0.958333 |
| 4 | evaluate.king-mobility.test.ts | g2 removed from f2/g2/h2 scores strictly lower for white (the criterion as written) | 0 strict | 4 / 4 | -141 | MATERIAL[pawn].eg -1, PST.pawn[g2].eg -1, ISOLATED.eg -2, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, MOBILITY_WEIGHT.eg 1 |
| 5 | evaluate.king-mobility.test.ts | at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find) | 0 strict | 3.5 / 3.5 | -3 | PST.pawn[g6].mg 1, PST.pawn[g2].mg -1, KING_SHELTER_MISSING.mg -1, KING_SHELTER_MISSING_QUEEN.mg -1, MOBILITY_WEIGHT.mg 1 |
| 6 | evaluate.king-mobility.test.ts | the phase-24 twin bites: with the shelter term zeroed, g6 no longer scores lower (red without the term) | 0 | 1.5 / 1.5 | -12 | MOBILITY_WEIGHT.mg -1, PST.pawn[g6].mg -1, PST.pawn[g2].mg 1 |
| 7 | evaluate.king-mobility.test.ts | no f-pawn (black f7 remains) scores strictly lower than f2 for white (the criterion as written) | 0 strict | 3 / 3 | -121 | MATERIAL[pawn].eg -1, PST.pawn[f2].eg -1, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, MOBILITY_WEIGHT.eg 1 |
| 8 | evaluate.king-mobility.test.ts | at EQUAL material, shelter equal, at phase 24: the f-pawn on e5 (f half-open) scores lower than on f5 (ABC-270 re-find) | 0 strict | 5 / 5 | -2 | PST.pawn[e5].mg 1, ISOLATED.mg -1, KING_FILE_HALF_OPEN.mg -1, KING_FILE_HALF_OPEN_QUEEN.mg -1, MOBILITY_WEIGHT.mg 3, PST.pawn[f5].mg -1 |
| 9 | evaluate.king-mobility.test.ts | the phase-24 twin bites: with the half-open term zeroed, e5 no longer scores lower (red without the term) | 0 | 3 / 3 | -8 | PST.pawn[f5].mg 1, MOBILITY_WEIGHT.mg -3, PST.pawn[e5].mg -1, ISOLATED.mg 1 |
| 10 | evaluate.king-mobility.test.ts | white, with substantially more moves at equal material, scores strictly higher | 0 strict | 10.5 / 10.5 | -60 | PST.rook[d4].mg -0.166667, PST.rook[d4].eg -0.833333, PST.rook[h1].mg 0.166667, PST.rook[h1].eg 0.833333, MOBILITY_WEIGHT.mg -2.5, MOBILITY_WEIGHT.eg -12.5 |
| 11 | evaluate.king-mobility.test.ts | never exceeds ±100 cp — on the four-queen rig and over the whole corpus, both colours to move [mobilityTerm(rig) > 0] | 0 strict | 39 / 39 | -100 | MOBILITY_WEIGHT.mg -48, MOBILITY_WEIGHT.eg -24 |
| 12 | evaluate.pawns.test.ts | c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50 [gap > 0] | 0 strict | 3.5 / 3.5 | -33 | PST.pawn[c4].eg 1, DOUBLED.eg -1, ISOLATED.eg -2, PST.pawn[d3].eg -1 |
| 13 | evaluate.pawns.test.ts | c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50 [gap <= 50] | 50 | 2.5 / 2.5 | 33 | PST.pawn[d3].eg 1, PST.pawn[c4].eg -1, DOUBLED.eg 1, ISOLATED.eg 2 |
| 14 | evaluate.pawns.test.ts | d4 with c3/e3 removed scores strictly lower for white (the criterion as written) | 0 strict | 12.5 / 12.5 | -265 | MATERIAL[pawn].eg -2, PASSED[1].eg -2, ISOLATED.eg -1, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, PASSED_KING_ENEMY[1].eg -4, PASSED_KING_OWN[1].eg 10, PASSED_FREE[1].eg -2, PST.pawn[c3].eg -1, PST.pawn[e3].eg -1 |
| 15 | evaluate.pawns.test.ts | at EQUAL material too: c3/e3 moved to a3/g3, isolating all three, scores strictly lower | 0 strict | 5.5 / 5.5 | -63 | PST.pawn[a3].eg 1, PST.pawn[g3].eg 1, ISOLATED.eg -3, KING_SHELTER_MISSING.eg -1, KING_FILE_HALF_OPEN.eg -1, PST.pawn[c3].eg -1, PST.pawn[e3].eg -1 |
| 16 | evaluate.pawns.test.ts | d4 with its only neighbour on the LEFT (c3) scores higher than d4 with a3, both isolated | 0 strict | 3 / 3 | -24 | PST.pawn[a3].eg 1, ISOLATED.eg -2, PASSED_UNSTOPPABLE.eg 1, PST.pawn[c3].eg -1 |
| 17 | evaluate.pawns.test.ts | d4 with its only neighbour on the RIGHT (e3) scores higher than d4 with b4, both isolated | 0 strict | 14 / 14 | -2 | PST.pawn[b4].eg 1, PASSED[3].eg 1, ISOLATED.eg -2, PASSED_KING_ENEMY[3].eg 5, PASSED_KING_OWN[3].eg -5, PASSED_FREE[3].eg 1, PASSED_UNSTOPPABLE.eg 1, PST.pawn[e3].eg -1, PASSED[2].eg -1, PASSED_KING_ENEMY[2].eg -3, PASSED_KING_OWN[2].eg 5, PASSED_FREE[2].eg -1 |
| 18 | evaluate.pawns.test.ts | a7 scores strictly higher than a5 | 0 strict | 13 / 13 | -130 | PST.pawn[a5].eg 1, PASSED[4].eg 1, PASSED_KING_ENEMY[4].eg 4, PASSED_KING_OWN[4].eg -5, PASSED_FREE[4].eg 1, PST.pawn[a7].eg -1, PASSED[6].eg -1, PASSED_KING_ENEMY[6].eg -4, PASSED_KING_OWN[6].eg 5, PASSED_FREE[6].eg -1 |
| 19 | evaluate.pawns.test.ts | both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material [a5 > stopped] | 0 strict | 12.5 / 12.5 | -62 | PST.pawn[b3].eg -1, PST.pawn[h2].eg 1, PASSED[1].eg 1, PASSED[4].eg -1, PASSED_KING_ENEMY[1].eg 3, PASSED_KING_ENEMY[4].eg -4, PASSED_KING_OWN[1].eg -5, PASSED_KING_OWN[4].eg 5, PASSED_FREE[1].eg 1, PASSED_FREE[4].eg -1, PASSED_UNSTOPPABLE.eg -1 |
| 20 | evaluate.pawns.test.ts | both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material [a7 > stopped] | 0 strict | 13.5 / 13.5 | -192 | PST.pawn[a5].eg 1, PST.pawn[b3].eg -1, PST.pawn[a7].eg -1, PST.pawn[h2].eg 1, PASSED[1].eg 1, PASSED[6].eg -1, PASSED_KING_ENEMY[1].eg 3, PASSED_KING_ENEMY[6].eg -4, PASSED_KING_OWN[1].eg -5, PASSED_KING_OWN[6].eg 5, PASSED_FREE[1].eg 1, PASSED_FREE[6].eg -1, PASSED_UNSTOPPABLE.eg -1 |
| 21 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D1] | -20 | 4.5 / 4.5 | -75 | PST.king[d4].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 1, MOBILITY_WEIGHT.eg -5, PST.king[a1].eg 1 |
| 22 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D2] | -20 | 7 / 7 | -34 | PST.king[e5].eg -1, KING_SHELTER_MISSING.eg 2, KING_FILE_OPEN.eg 3, MOBILITY_WEIGHT.eg -6, PST.king[h1].eg 1, KING_FILE_HALF_OPEN.eg -1 |
| 23 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D3] | -20 | 5.5 / 5.5 | -85 | PST.king[e5].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_HALF_OPEN.eg 1, PASSED_KING_ENEMY[3].eg 2, MOBILITY_WEIGHT.eg -5, PST.king[h1].eg 1 |
| 24 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D4] | -20 | 6.5 / 6.5 | -44 | PST.king[d4].eg -1, KING_SHELTER_MISSING.eg 2, KING_FILE_OPEN.eg 2, PASSED_KING_OWN[1].eg -1, MOBILITY_WEIGHT.eg -6, PST.king[a1].eg 1 |
| 25 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D5] | -20 | 5 / 5 | -55 | PST.king[e4].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 2, MOBILITY_WEIGHT.eg -5, PST.king[h8].eg 1 |
| 26 | evaluate.taper.test.ts | ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings [D6] | -20 | 10 / 10 | -35 | PST.king[d5].eg -1, KING_SHELTER_MISSING.eg 1, KING_FILE_OPEN.eg 3, PASSED_KING_ENEMY[1].eg -2, PASSED_KING_ENEMY[2].eg -1, PASSED_KING_OWN[3].eg 5, PASSED_FREE[3].eg -1, PASSED_UNSTOPPABLE.eg -2, MOBILITY_WEIGHT.eg -5, PST.king[a8].eg 1 |

E4a's weights enter rows 14, 17-20, 23, 24 and 26, read from the traces at this step, as d6's amendment asks.

Three rows read a term removed. Rows 6 and 9 run inside the seam with the family's two pairs at 0; row 11 is evaluate less evaluateWithoutMobility. On a table with non-zero queen-on halves the tool's read equals the seam's on rows 6 and 9 (-12 and -8), and on the rig it reads minus the mobility term (100), run once from scratch.

## Not in the set, by class
- Hold on every table: the mirror rows, start = 0, |mobility| ≤ cap (the clamp), B1 (b) at phase 24.
- Fixed values through the seam: ABC-270 K1 (c), ABC-271 K1 (c), P1, ABC-274 A3. K1 (c) of ABC-270 takes form (A) at scope 4 if red.
- Pins under B-T4: scores, node counts, literals of the old table, among them B1 (c), B1 (d)'s mainCentreMinusCorner and K1 (b).
- Retired by name: E1's differ assertion, B1 (e) whole, ABC-215 A2's rule rows, the "every part is 0" row, K0's seven rows.
- Read on the emission, not bounded: ABC-274 A9, the int16 range.
- **A premise, not a relation (my reading, for QE to check):** "white, with substantially more moves" also asserts evaluateWithoutMobility(MOBILE_WHITE) = 0, the row's measured premise that every other term cancels. Its order, evaluate > 0, is row 10. The equality cannot be a bound: with a margin above 0 on both sides it has no feasible form. It holds on every C-S table, where the two rook cells stay 0. On C-F the two cells are free and it may go red. Then it is B-T4's lost fixture property, re-found under ADR-0028 d2 and listed in the PR table, never loosened and never a reason to refit.

## Procedure
extract (done) → fit → emit, once. Relation rows run on the emission; a red relation is a defect, fixed in the tool, and the same procedure re-runs. An infeasible bound set is a STOP to Architect/Design with the rows the solve names; no row is dropped. zugzwang.001 is not bounded: if it or any safety row is red, STOP and report, no refit. fit.json's table is checked against tableOf(emission) (QE-301-b). The gate runs once more on the emitted file (d5 check 2).

## Bars
B-T0 to B-T8 at their levels, by reference to ADR-0067's table and its dated line of 2026-11-04, F3 in the amended form. ADR-0070 F4: each E4a eg half left at 0 is recorded as dead weight. Intent GAIN, C2' ≥ 50.0 of 100.

**The endgame G2 row (QE-271-f, P4):** on qe-ABC-271's endgame report set (six positions, phases 3-8, each with a passer), evaluateAtPhase per call ≤ 1.02 × the pull's base, by the A5 instrument: two sessions in reverse order, a main-copy control. A reading above 1.02 × is a B-T4 miss. Reported, not graded: ns per node in search on the same six at depth 9.
