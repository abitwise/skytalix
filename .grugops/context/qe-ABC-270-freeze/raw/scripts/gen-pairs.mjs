// qe-ABC-270-freeze: writes pairs.json from the HAND table below. Every count here was derived by
// hand from the stated rule (src/evaluate-params.ts docblock = ABC-083's rule; ADR-0064 d10; ADR-0068 d1):
//   per file of the king's own file and the files either side of it that exist (a/h king: 2 files):
//   s = no own pawn one or two ranks ahead of the king; h = no own pawn on the file, an enemy pawn on it;
//   o = no pawn of either colour on the file. q = the ENEMY has >= 1 queen (a flag, not a count).
//   queen-on features (ADR-0068 d1/d2): sQ = s*q, hQ = h*q, oQ = o*q.
// No engine code computes any number below. verify.mjs checks them afterwards.
// usage: node scripts/gen-pairs.mjs > pairs.json
const k = (s, h, o, q) => ({ s, h, o, q, sQ: s * q, hQ: h * q, oQ: o * q,
  baseCp: 15 * s + 10 * h + 20 * o, seam2xCp: (15 * s + 10 * h + 20 * o) * (1 + 2 * q) });
const rows = [
  { id: "QP1", subject: "white", removed: ["d8"], kind: "pair",
    claim: "Kg1: g-file shelter missing + half-open (black g6); h3 shelters from two ranks; black queen removed -> white queen-on counts 1/1/0 -> 0",
    A: "3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1",
    B: "6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1",
    expect: { A: { white: k(1, 1, 0, 1), black: k(0, 0, 0, 1) }, B: { white: k(1, 1, 0, 0), black: k(0, 0, 0, 1) } } },
  { id: "QP2", subject: "white", removed: ["d8"], kind: "pair",
    claim: "game-1 shape: Ke1 / Ke8 with the d-file open (no pawns); black queen removed -> white 1/0/1 -> 0 while black's (white queen still on) stays 1/0/1",
    A: "3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1",
    B: "4k3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1",
    expect: { A: { white: k(1, 0, 1, 1), black: k(1, 0, 1, 1) }, B: { white: k(1, 0, 1, 0), black: k(1, 0, 1, 1) } } },
  { id: "QP3", subject: "black", removed: ["d1"], kind: "pair", mirrorOf: "QP1",
    claim: "QP1 colour-mirrored (ranks flipped, colours swapped, side to move flipped): black Kg8 1/1/0 -> 0 when the white queen goes",
    A: "3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1",
    B: "3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1",
    expect: { A: { white: k(0, 0, 0, 1), black: k(1, 1, 0, 1) }, B: { white: k(0, 0, 0, 1), black: k(1, 1, 0, 0) } } },
  { id: "QP4", subject: "black", removed: ["e2"], kind: "pair", bothQueens: true,
    claim: "both queens on in A. Kc1 2/1/1 (c half-open by black c5, d open), Kg8 2/1/0 (g5 own but 3 ranks ahead: shelter missing, file not half-open; h half-open by white h4). WHITE queen removed: black's counts -> 0, white's stay (black queen still on)",
    A: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    B: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP3PP1/2K5 w - - 0 1",
    expect: { A: { white: k(2, 1, 1, 1), black: k(2, 1, 0, 1) }, B: { white: k(2, 1, 1, 1), black: k(2, 1, 0, 0) } } },
  { id: "QP5", subject: "white", removed: ["d7"], kind: "pair", bothQueens: true,
    claim: "QP4's A with the BLACK queen removed instead: white's counts -> 0, black's stay (white queen still on). QP4 + QP5 catch swapped flags",
    A: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    B: "6k1/pp3p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    expect: { A: { white: k(2, 1, 1, 1), black: k(2, 1, 0, 1) }, B: { white: k(2, 1, 1, 0), black: k(2, 1, 0, 1) } } },
  { id: "QP6", subject: "white", removed: ["e7"], kind: "pair",
    claim: "edge king Kh1: files g, h only (g2 shelters; h bare: missing + open); the f-file is bare too, so a 3-file window shifted inward would read 2/0/2. Black queen removed -> 0",
    A: "2k5/ppp1q3/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1",
    B: "2k5/ppp5/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1",
    expect: { A: { white: k(1, 0, 1, 1), black: k(0, 0, 0, 1) }, B: { white: k(1, 0, 1, 0), black: k(0, 0, 0, 1) } } },
  { id: "QP7", subject: "white", removed: ["c8", "d8"], kind: "pair", twoEnemyQueens: true,
    claim: "king off the back rank, Kg2: f2 beside the king does not shelter (f: missing, own pawn so no file term), g bare (missing + open), h4 shelters from two ranks. Black has TWO queens in A, none in B: the flag is 1, not 2 (a queen-count form reads 5x, not 3x)",
    A: "1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    B: "1k6/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    expect: { A: { white: k(2, 0, 1, 1), black: k(0, 0, 0, 0) }, B: { white: k(2, 0, 1, 0), black: k(0, 0, 0, 0) } } },
  { id: "QC8", subject: "white", removed: ["c8"], kind: "control",
    claim: "CONTROL, not a K1 (c) pair: QP7's A against one black queen left: the flag stays 1, so every count and both exposures are equal in A and B",
    A: "1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    B: "1k1q4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    expect: { A: { white: k(2, 0, 1, 1), black: k(0, 0, 0, 0) }, B: { white: k(2, 0, 1, 1), black: k(0, 0, 0, 0) } } },
];
// the white-POV change of evaluate (and evaluateWithoutTaper) when the three queen-on pairs go 0 -> 2 x base:
// 2 x (black q x black baseCp - white q x white baseCp). Exact, because every exposure half and every
// seam pair has mg = eg, so only mg moves and the blend's egDelta does not (main's blend: mg + trunc(...)).
for (const r of rows) for (const side of ["A", "B"]) {
  const e = r.expect[side];
  e.seamNetWpov = 2 * (e.black.q * e.black.baseCp - e.white.q * e.white.baseCp);
}
const K0 = {
  source: "ADR-0068 d6 K0 (= the probe's I1 and ADR-0064 B0), on src/ tree 4cb84035",
  chooseMove: { "kiwipete d8": 1296788, "kiwipete d9": 2733330, "position-6 d8": 404930, "position-6 d9": 926005, "position-6 d10": 1692669 },
  search: { "kiwipete d8": 839514, "position-6 d8": 1533901 },
  olderDoors: "every older door reads its pre-ticket counts",
  ifMainMoved: "re-read on the new base; both sets in the PR (ticket K0)",
};
console.log(JSON.stringify({ task: "qe-ABC-270-freeze", ticket: "ABC-270", adr: "ADR-0068", srcTree: "4cb84035",
  params: { KING_SHELTER_MISSING: 15, KING_FILE_HALF_OPEN: 10, KING_FILE_OPEN: 20, halvesEqual: true },
  seam: "K1 (c): the three queen-on pairs set to 2 x their base pairs through withParametersForTest; then the subject king's exposure in A is exactly 3 x its exposure in B, in each half; the other king's exposure is equal in A and B; with the pairs at 0, K1 (b) holds",
  rows, K0 }, null, 2));
