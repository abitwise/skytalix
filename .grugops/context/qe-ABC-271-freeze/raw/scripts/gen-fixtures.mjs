// qe-ABC-271-freeze: writes fixtures.json from the HAND table below. Every number here was derived by
// hand from ADR-0070 decision 1 / 2 (not from code; no ABC-271 code exists):
//   R = the passer's own rank index (1 = its start rank, 6 = one step from promotion); white R = rank - 1,
//   black R = 8 - rank. Q = the queening square (f8 white, f1 black). d = Chebyshev distance.
//   Only the FRONTMOST passer of each file is read (a rear passer of a doubled pair is not).
//   kd   += PASSED_KING_ENEMY[R] * min(d(enemy king, Q), 5) - PASSED_KING_OWN[R] * min(d(own king, Q), 5)
//   free += PASSED_FREE[R] when every square ahead, up to and including Q, is empty (any piece, a king too)
//   un    = PASSED_UNSTOPPABLE, once per side, at phase 0 only, when some passer of that side has a free
//           path and moves < d(defending king, Q) - (1 if the defender is to move); moves = 5 on R 1, else 7 - R.
//           d here is NOT capped (the cap is king distance's).
// Probed values (ADR-0070 d1; K1 (c)'s seam values): KE 0,1,2,4,7,12,20; KO 0,0,1,2,3,6,10; F 0,5,10,20,35,60,100; U 400.
// Passer literal p(square, R, dEnemyRaw, dOwnRaw, free). Seam literal s(kd, free, un) in cp, eg, at the probed values.
// usage: node gen-fixtures.mjs > fixtures.json
const p = (sq, R, dE, dO, free) => ({ sq, R, dE, dO, free });
const s = (kd, free, un) => ({ kd, free, un });
const none = { passers: [], U: 0, seam: s(0, 0, 0) };
const side = (passers, U, seam) => ({ passers, U, seam });
const VALUES = {
  PASSED_KING_ENEMY: [0, 1, 2, 4, 7, 12, 20],
  PASSED_KING_OWN: [0, 0, 1, 2, 3, 6, 10],
  PASSED_FREE: [0, 5, 10, 20, 35, 60, 100],
  PASSED_UNSTOPPABLE: 400,
};
function features(sd) {
  const E = [0, 0, 0, 0, 0, 0, 0], O = [0, 0, 0, 0, 0, 0, 0], F = [0, 0, 0, 0, 0, 0, 0];
  for (const x of sd.passers) { E[x.R] += Math.min(x.dE, 5); O[x.R] += Math.min(x.dO, 5); F[x.R] += x.free; }
  return { PASSED_KING_ENEMY: E, PASSED_KING_OWN: O, PASSED_FREE: F, PASSED_UNSTOPPABLE: sd.U };
}
// f(id, group, pair, half, fen, phase, white, black, why)
const rows = [];
const f = (id, group, pair, half, fen, phase, white, black, why) => rows.push({ id, group, pair, half, fen, phase, white, black, why });

// ---- U: the rule of the square (phase 0 pawn endings; twins with the defending king one step inside) ----
f("U1-out", "U", "U1", "A", "8/5k2/8/8/P7/8/8/7K w - - 0 1", 0, side([p("a4", 3, 5, 7, 1)], 1, s(10, 20, 400)), none,
  "a4, moves 4, attacker to move: 4 < d(f7,a8)=5 -> U");
f("U1-in", "U", "U1", "B", "8/4k3/8/8/P7/8/8/7K w - - 0 1", 0, side([p("a4", 3, 4, 7, 1)], 0, s(6, 20, 0)), none,
  "Kf7 -> Ke7, one step inside: 4 < 4 false");
f("U2-out", "U", "U2", "A", "8/8/8/8/8/8/2P5/K5k1 b - - 0 1", 0, side([p("c2", 1, 7, 7, 1)], 1, s(5, 5, 400)), none,
  "c2 on its start rank: moves 5 (double step), DEFENDER to move: 5 < d(g1,c8)=7 - 1 -> U. Needs d uncapped; 7 - R = 6 reads 0");
f("U2-in", "U", "U2", "B", "8/8/8/8/8/8/2P3k1/K7 b - - 0 1", 0, side([p("c2", 1, 6, 7, 1)], 0, s(5, 5, 0)), none,
  "Kg1 -> Kg2: 5 < 6 - 1 false. Also a king step beyond the cap (7 -> 6): kd unchanged");
f("U3-out", "U", "U3", "A", "7k/8/8/8/5p2/8/1K6/8 b - - 0 1", 0, none, side([p("f4", 4, 4, 7, 1)], 1, s(13, 35, 400)),
  "black f4 (R 4), moves 3, attacker to move: 3 < d(b2,f1)=4 -> U");
f("U3-in", "U", "U3", "B", "7k/8/8/8/5p2/8/2K5/8 b - - 0 1", 0, none, side([p("f4", 4, 3, 7, 1)], 0, s(6, 35, 0)),
  "Kb2 -> Kc2: 3 < 3 false");
f("U4-out", "U", "U4", "A", "k7/8/8/8/3K4/7p/8/8 w - - 0 1", 0, none, side([p("h3", 5, 4, 7, 1)], 1, s(18, 60, 400)),
  "black h3 (R 5), moves 2, DEFENDER (white) to move: 2 < d(d4,h1)=4 - 1 -> U");
f("U4-in", "U", "U4", "B", "k7/8/8/8/4K3/7p/8/8 w - - 0 1", 0, none, side([p("h3", 5, 3, 7, 1)], 0, s(6, 60, 0)),
  "Kd4 -> Ke4: 2 < 3 - 1 false");
f("U5-out", "U", "U5", "A", "8/4k1P1/8/8/8/8/8/K7 w - - 0 1", 0, side([p("g7", 6, 2, 7, 1)], 1, s(-10, 100, 400)), none,
  "g7 (R 6), moves 1, attacker to move: 1 < d(e7,g8)=2 -> U; kd negative");
f("U5-in", "U", "U5", "B", "8/5kP1/8/8/8/8/8/K7 w - - 0 1", 0, side([p("g7", 6, 1, 7, 1)], 0, s(-30, 100, 0)), none,
  "Ke7 -> Kf7: 1 < 1 false");
f("U6-stm", "U", null, null, "8/5k2/8/8/P7/8/8/7K b - - 0 1", 0, side([p("a4", 3, 5, 7, 1)], 0, s(10, 20, 0)), none,
  "U1-out with only the side to move flipped: the defender to move -> 4 < 5 - 1 false");
f("U7-both", "U", null, null, "7k/8/P7/8/8/7p/8/K7 w - - 0 1", 0,
  side([p("a6", 5, 7, 7, 1)], 1, s(30, 60, 400)), side([p("h3", 5, 7, 7, 1)], 1, s(30, 60, 400)),
  "both sides unstoppable: U per side (they cancel only in the net); black's defender (white) is to move: 2 < 7 - 1");
f("U8-two", "U", null, null, "8/8/P6P/8/8/3k4/8/4K3 w - - 0 1", 0,
  side([p("a6", 5, 5, 7, 1), p("h6", 5, 5, 7, 1)], 1, s(60, 120, 400)), none,
  "two unstoppable passers, one side: U once (400, not 800)");
f("U9-ownking", "U", null, null, "8/8/3K4/8/3P4/8/8/7k w - - 0 1", 0, side([p("d4", 3, 7, 2, 0)], 0, s(16, 0, 0)), none,
  "outside the square (4 < 7) but its own king stands on d6: path not free -> U 0, free 0");
f("U10-phase1", "U", null, null, "8/5k2/8/8/P7/8/7N/7K w - - 0 1", 1, side([p("a4", 3, 5, 7, 1)], 0, s(10, 20, 0)), none,
  "U1-out plus a white knight: phase 1 -> U 0; kd and free unchanged");

// ---- KD: king-distance pairs that differ only by one king step ----
f("KD1-A", "KD", "KD1", "A", "r7/8/8/4P3/7k/8/2K5/R7 w - - 0 1", 4, side([p("e5", 4, 4, 6, 1)], 0, s(13, 35, 0)), none,
  "enemy king h4, d(h4,e8)=4");
f("KD1-B", "KD", "KD1", "B", "r7/8/8/4P2k/8/8/2K5/R7 w - - 0 1", 4, side([p("e5", 4, 3, 6, 1)], 0, s(6, 35, 0)), none,
  "enemy king h4 -> h5 (d 4 -> 3): kd moves by KE[4] = 7");
f("KD2-A", "KD", "KD2", "A", "8/7k/8/8/2P1K3/8/8/n7 w - - 0 1", 1, side([p("c4", 3, 5, 4, 1)], 0, s(12, 20, 0)), none,
  "own king e4, d(e4,c8)=4");
f("KD2-B", "KD", "KD2", "B", "8/7k/8/4K3/2P5/8/8/n7 w - - 0 1", 1, side([p("c4", 3, 5, 3, 1)], 0, s(14, 20, 0)), none,
  "own king e4 -> e5 (d 4 -> 3): kd moves by KO[3] = 2");
f("KD3-A", "KD", "KD3", "A", "r7/8/8/8/8/1P4k1/8/2K5 w - - 0 1", 2, side([p("b3", 2, 5, 7, 1)], 0, s(5, 10, 0)), none,
  "enemy king g3, d(g3,b8)=5 (at the cap)");
f("KD3-B", "KD", "KD3", "B", "r7/8/8/8/8/1P5k/8/2K5 w - - 0 1", 2, side([p("b3", 2, 6, 7, 1)], 0, s(5, 10, 0)), none,
  "enemy king g3 -> h3 (d 5 -> 6), a step beyond the cap: kd moves by 0 (a cap at 6 reads +2)");
f("KD4-A", "KD", "KD4", "A", "r7/8/8/8/5k2/1P6/8/2K5 w - - 0 1", 2, side([p("b3", 2, 4, 7, 1)], 0, s(3, 10, 0)), none,
  "enemy king f4, d(f4,b8)=4");
f("KD4-B", "KD", "KD4", "B", "r7/8/8/8/6k1/1P6/8/2K5 w - - 0 1", 2, side([p("b3", 2, 5, 7, 1)], 0, s(5, 10, 0)), none,
  "enemy king f4 -> g4 (d 4 -> 5), the last step inside the cap: kd moves by KE[2] = 2 (a cap at 4 reads 0)");
f("KD5-A", "KD", "KD5", "A", "r7/8/4k3/8/4p3/1K6/8/7R b - - 0 1", 4, none, side([p("e4", 4, 3, 5, 1)], 0, s(6, 35, 0)),
  "black e4, own king e6, d(e6,e1)=5 (at the cap); the white rook on h1 attacks e1, which is not read");
f("KD5-B", "KD", "KD5", "B", "r7/4k3/8/8/4p3/1K6/8/7R b - - 0 1", 4, none, side([p("e4", 4, 3, 6, 1)], 0, s(6, 35, 0)),
  "own king e6 -> e7 (d 5 -> 6), beyond the cap: kd moves by 0");
f("KD6-A", "KD", "KD6", "A", "7N/8/8/8/3k4/2p5/7K/8 b - - 0 1", 1, none, side([p("c3", 5, 5, 3, 1)], 0, s(42, 60, 0)),
  "black c3 (R 5), own king d4, d(d4,c1)=3");
f("KD6-B", "KD", "KD6", "B", "7N/8/8/8/8/2pk4/7K/8 b - - 0 1", 1, none, side([p("c3", 5, 5, 2, 1)], 0, s(48, 60, 0)),
  "own king d4 -> d3 (d 3 -> 2): kd moves by KO[5] = 6");
f("KD7-A", "KD", "KD7", "A", "r7/2k5/8/7K/4p3/8/8/R7 b - - 0 1", 4, none, side([p("e4", 4, 4, 6, 1)], 0, s(13, 35, 0)),
  "mirrorPosition(KD1-A): colours swap");
f("KD7-B", "KD", "KD7", "B", "r7/2k5/8/8/4p2K/8/8/R7 b - - 0 1", 4, none, side([p("e4", 4, 3, 6, 1)], 0, s(6, 35, 0)),
  "mirrorPosition(KD1-B)");
f("KD8-A", "KD", "KD8", "A", "7r/8/7k/3P4/8/3P4/8/RK6 w - - 0 1", 4, side([p("d5", 4, 4, 7, 1)], 0, s(13, 35, 0)), none,
  "doubled passers d3 / d5: only the front d5 is read (reading d3 too gives 16)");
f("KD8-B", "KD", "KD8", "B", "7r/8/6k1/3P4/8/3P4/8/RK6 w - - 0 1", 4, side([p("d5", 4, 3, 7, 1)], 0, s(6, 35, 0)), none,
  "enemy king h6 -> g6 (d 4 -> 3): kd moves by KE[4] = 7 (reading d3 too gives 7, a move of 9)");
f("KD9-A", "KD", "KD9", "A", "8/7N/8/1P2k3/6p1/8/K7/8 w - - 0 1", 1,
  side([p("b5", 4, 3, 6, 1)], 0, s(6, 35, 0)), side([p("g4", 4, 6, 4, 1)], 0, s(23, 35, 0)),
  "a passer each side: the black king is white's enemy king and black's own king");
f("KD9-B", "KD", "KD9", "B", "8/7N/8/1P6/4k1p1/8/K7/8 w - - 0 1", 1,
  side([p("b5", 4, 4, 6, 1)], 0, s(13, 35, 0)), side([p("g4", 4, 6, 3, 1)], 0, s(26, 35, 0)),
  "black king e5 -> e4, one step: white kd +KE[4] = 7 (d 3 -> 4), black kd +KO[4] = 3 (d 4 -> 3)");

// ---- FP: free-path pairs that differ only by a piece on a square ahead of the passer (U 0: phase > 0) ----
f("FP1-A", "FP", "FP1", "A", "7r/8/3n3k/3P4/8/8/8/R5K1 w - - 0 1", 5, side([p("d5", 4, 4, 7, 0)], 0, s(13, 0, 0)), none,
  "a black knight on d6, the stop square: not free");
f("FP1-B", "FP", "FP1", "B", "7r/8/7k/3P4/8/8/8/R5K1 w - - 0 1", 4, side([p("d5", 4, 4, 7, 1)], 0, s(13, 35, 0)), none,
  "no knight: free (the black rook on h8 attacks d8, which is not read)");
f("FP2-A", "FP", "FP2", "A", "6n1/1B6/5k2/8/1P6/8/4K3/8 w - - 0 1", 2, side([p("b4", 3, 4, 6, 0)], 0, s(6, 0, 0)), none,
  "an OWN bishop on b7, mid-path: not free");
f("FP2-B", "FP", "FP2", "B", "6n1/8/5k2/8/1P6/8/4K3/8 w - - 0 1", 1, side([p("b4", 3, 4, 6, 1)], 0, s(6, 20, 0)), none,
  "no bishop: free");
f("FP3-A", "FP", "FP3", "A", "n7/8/8/7k/8/1K3p2/8/5R2 b - - 0 1", 3, none, side([p("f3", 5, 4, 4, 0)], 0, s(24, 0, 0)),
  "black f3: a white rook on f1, the queening square itself: not free (a walk that stops before Q reads 60)");
f("FP3-B", "FP", "FP3", "B", "n7/8/8/7k/8/1K3p2/8/8 b - - 0 1", 1, none, side([p("f3", 5, 4, 4, 1)], 0, s(24, 60, 0)),
  "no rook: free");
f("FP4-A", "FP", "FP4", "A", "8/r7/8/4k3/8/7N/P7/2K5 w - - 0 1", 3, side([p("a2", 1, 4, 7, 0)], 0, s(4, 0, 0)), none,
  "a2 on its start rank: a black rook on a7, the far end of the path: not free (a stop-square-only read says free)");
f("FP4-B", "FP", "FP4", "B", "8/8/8/4k3/8/7N/P7/2K5 w - - 0 1", 1, side([p("a2", 1, 4, 7, 1)], 0, s(4, 5, 0)), none,
  "no rook: free");
f("FP5-A", "FP", "FP5", "A", "r7/2k5/8/2P5/8/8/8/6KR w - - 0 1", 4, side([p("c5", 4, 1, 7, 0)], 0, s(-8, 0, 0)), none,
  "the ENEMY king on c7, on the path: not free (a king is a blocker)");
f("FP5-B", "FP", "FP5", "B", "r7/1k6/8/2P5/8/8/8/6KR w - - 0 1", 4, side([p("c5", 4, 1, 7, 1)], 0, s(-8, 35, 0)), none,
  "king c7 -> b7, off the path at the same distance 1 to c8: free; kd unchanged");
f("FP6-ctl", "FP", null, null, "7r/8/2n4k/3P4/8/8/8/R5K1 w - - 0 1", 5, side([p("d5", 4, 4, 7, 1)], 0, s(13, 35, 0)), none,
  "control: FP1-B plus a black knight on c6, ahead on the ADJACENT file (attacks d8, d4): still free");

// ---- K1 (a): >= 10 new passer positions for the mirror (Object.is, at the shipped values) ----
const mirror = [
  ["A01", "8/3k4/8/4PP2/8/8/8/6K1 b - - 0 1", 0, "connected passers e5/f5, black to move, phase 0"],
  ["A02", "8/8/8/7p/P7/3k4/8/5K2 w - - 0 1", 0, "a race: a4 against h5, phase 0"],
  ["A03", "8/5pk1/6p1/8/P7/6P1/5PK1/8 w - - 0 1", 0, "an outside passer a4 beside a locked kingside, phase 0"],
  ["A04", "8/8/8/2P5/8/2P5/k7/4K3 b - - 0 1", 0, "doubled passers c3/c5 (the rear one not read), phase 0"],
  ["A05", "8/1P6/8/8/5k2/8/2n5/6K1 w - - 0 1", 1, "a passer on the seventh (R 6) against a knight, phase 1"],
  ["A06", "8/5k2/8/1P6/6p1/8/5K2/r6R b - - 0 1", 4, "rook ending, a passer each side, black to move, phase 4"],
  ["A07", "3r2k1/5ppp/8/3P4/4P3/p7/5PPP/2B1R1K1 w - - 0 1", 5, "protected passer d5 blocked on d8; black a3 passer, phase 5"],
  ["A08", "r1bqkb1r/5ppp/2n2n2/1P6/8/2N2N2/P4PPP/R1BQKB1R w KQkq - 0 1", 24, "passers a2/b5 at phase 24 (the loop is skipped at w = D)"],
  ["A09", "6k1/8/8/7n/8/8/1p3K2/1B6 b - - 0 1", 2, "black b2 (R 6) with its queening square b1 held by a white bishop, phase 2"],
  ["A10", "8/p6p/8/8/8/2k5/8/K7 w - - 0 1", 0, "black passers on both rim files, white to move, phase 0"],
  ["A11", "8/8/8/2k5/1pP5/8/5K2/6R1 b - c3 0 1", 2, "an en-passant square; b4 / c4 side by side, both passed, phase 2"],
  ["A12", "8/8/8/8/1p6/8/5PK1/3k4 w - - 0 1", 0, "both sides unstoppable: black b4 with the defender to move (3 < 5 - 1), white f2 from its start rank (5 < 7), phase 0"],
].map(([id, fen, phase, why]) => ({ id, fen, phase, why }));

for (const r of rows) for (const c of ["white", "black"]) r[c].features = features(r[c]);
const out = {
  task: "qe-ABC-271-freeze", ticket: "ABC-271", adr: "ADR-0070", srcTree: "4fb3da04", main: "b274711c",
  values: VALUES,
  seam: "K1 (c): inside withParametersForTest at ADR-0070 d1's probed values, passerTermsForTest(position) returns per side { kd, free, un } (eg, cp) equal to row.<side>.seam; a pair's A - B per side is the frozen difference. With the values 0 every part is 0 and K1 (b) holds",
  k0: { kiwipete_chooseMove_d8: 766275, kiwipete_chooseMove_d9: 1725150, pos6_chooseMove_d8: 87475, pos6_chooseMove_d9: 253724, pos6_chooseMove_d10: 533916, kiwipete_search_d8: 605117, pos6_search_d8: 406787 },
  k1c: rows, k1a: mirror,
};
console.log(JSON.stringify(out, null, 2));
