// qe-ABC-292-freeze: writes fixtures.json from the HAND table below. Every expected value here was worked by
// hand from ADR-0076 d2 (the definitions) and d3 (the rule and its table), with no ABC-292 code in the world.
// This script only reformats the literals; it computes no expected value. verify.mjs re-derives them.
// usage: node gen-fixtures.mjs <out.json>
import { writeFileSync } from "node:fs";

// d3's table (mg = eg for every export, by the rule's output).
const VALUES = {
  BISHOP_PAIR: { mg: 50, eg: 50 },
  ROOK_OPEN_FILE: { mg: 20, eg: 20 },
  ROOK_SEMI_OPEN_FILE: { mg: 10, eg: 10 },
};

// K1 (c) rows. Per side: [bishops, open files, semi-open files, [pair cp, open cp, semi cp]].
// net = white total - black total; stm = net signed for the side to move (K1 (d)). Files "-" = none.
// prettier-ignore
const K1C = [
  // --- the bishop pair: one, two, three, a same-colour pair, both colours ---
  ["P1-W-one", "pair", "4k3/8/8/8/8/8/8/2B1K3 w - - 0 1", 1, [1, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "one bishop (white): no pair"],
  ["P2-W-two", "pair", "4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1", 2, [2, "-", "-", [50, 0, 0]], [0, "-", "-", [0, 0, 0]], 50, 50, "two bishops, c1 dark + f1 light"],
  ["P3-W-three", "pair", "4k3/8/8/8/8/3B4/8/2B1KB2 w - - 0 1", 3, [3, "-", "-", [50, 0, 0]], [0, "-", "-", [0, 0, 0]], 50, 50, "three bishops: the third adds nothing"],
  ["P4-W-same", "pair", "4k3/8/8/8/8/4B3/8/2B1K3 w - - 0 1", 2, [2, "-", "-", [50, 0, 0]], [0, "-", "-", [0, 0, 0]], 50, 50, "same-colour pair c1 + e3 (both dark): colours not read"],
  ["P1-B-one", "pair", "2b1k3/8/8/8/8/8/8/4K3 b - - 0 1", 1, [0, "-", "-", [0, 0, 0]], [1, "-", "-", [0, 0, 0]], 0, 0, "one bishop (black): no pair"],
  ["P2-B-two", "pair", "2b1kb2/8/8/8/8/8/8/4K3 b - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [2, "-", "-", [50, 0, 0]], -50, 50, "two bishops (black), c8 light + f8 dark; black to move"],
  ["P3-B-three", "pair", "2b1kb2/8/3b4/8/8/8/8/4K3 b - - 0 1", 3, [0, "-", "-", [0, 0, 0]], [3, "-", "-", [50, 0, 0]], -50, 50, "three bishops (black)"],
  ["P4-B-same", "pair", "2b1k3/8/4b3/8/8/8/8/4K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [2, "-", "-", [50, 0, 0]], -50, -50, "same-colour pair (black) c8 + e6 (both light); white to move"],
  ["P5-both", "pair", "2b1kb2/8/8/8/8/8/8/2B1KB2 w - - 0 1", 4, [2, "-", "-", [50, 0, 0]], [2, "-", "-", [50, 0, 0]], 0, 0, "both sides a pair: 50 each, never netted in the seam"],
  ["P6-BN-vs-BB", "pair", "2b1kb2/8/8/8/8/8/8/2B1KN2 b - - 0 1", 4, [1, "-", "-", [0, 0, 0]], [2, "-", "-", [50, 0, 0]], -50, 50, "bishop + knight earns nothing; black's pair does"],
  // --- open files: one per edge file per colour ---
  ["RO-W-a", "open", "4k3/1ppp4/8/8/8/8/1PPP4/R3K3 w - - 0 1", 2, [0, "a", "-", [0, 20, 0]], [0, "-", "-", [0, 0, 0]], 20, 20, "white rook a1, a-file empty (edge)"],
  ["RO-W-h", "open", "4k3/4ppp1/8/8/8/8/4PPP1/4K2R w - - 0 1", 2, [0, "h", "-", [0, 20, 0]], [0, "-", "-", [0, 0, 0]], 20, 20, "white rook h1, h-file empty (edge)"],
  ["RO-B-a", "open", "r3k3/1ppp4/8/8/8/8/1PPP4/4K3 b - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "a", "-", [0, 20, 0]], -20, 20, "black rook a8, a-file empty (edge)"],
  ["RO-B-h", "open", "4k2r/4ppp1/8/8/8/8/4PPP1/4K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "h", "-", [0, 20, 0]], -20, -20, "black rook h8, h-file empty (edge); white to move"],
  // --- semi-open files: one per edge file per colour ---
  ["RS-W-a", "semi", "4k3/pppp4/8/8/8/8/1PPP4/R3K3 w - - 0 1", 2, [0, "-", "a", [0, 0, 10]], [0, "-", "-", [0, 0, 0]], 10, 10, "white rook a1, black a7 only (edge); also open's pawn clause failing alone by an enemy pawn"],
  ["RS-W-h", "semi", "4k3/4pppp/8/8/8/8/4PPP1/4K2R b - - 0 1", 2, [0, "-", "h", [0, 0, 10]], [0, "-", "-", [0, 0, 0]], 10, -10, "white rook h1, black h7 only (edge); black to move"],
  ["RS-B-a", "semi", "r3k3/1ppp4/8/8/8/8/PPPP4/4K3 b - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "-", "a", [0, 0, 10]], -10, 10, "black rook a8, white a2 only (edge)"],
  ["RS-B-h", "semi", "4k2r/4ppp1/8/8/8/8/4PPPP/4K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "-", "h", [0, 0, 10]], -10, -10, "black rook h8, white h2 only (edge); white to move"],
  // --- a rook file failing each clause alone ---
  ["RF-open-norook", "fail", "4k3/1ppp4/8/8/8/8/1PPP4/Q3K3 w - - 0 1", 4, [0, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "open: no rook of the side (a queen on the empty a-file); queens are not read"],
  ["RF-open-ownpawn", "fail", "4k3/1ppp4/8/8/8/8/PPPP4/R3K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "open: a pawn on the file (own a2 only) - neither open nor semi"],
  ["RF-semi-norook", "fail", "4k3/pppp4/8/8/8/8/1PPP4/Q3K3 w - - 0 1", 4, [0, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "semi: no rook of the side (a queen; enemy a7, no own a-pawn)"],
  ["RF-semi-ownpawn", "fail", "4k3/pppp4/8/8/8/8/PPPP4/R3K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "semi: an own pawn (a2) beside the enemy a7 - neither"],
  // (semi with no enemy pawn = RO-W-a: open, not semi; open's pawn clause by an enemy pawn = RS-W-a.)
  // --- the whole file, not the squares ahead of the rook ---
  ["RW1-ownbehind", "whole-file", "6k1/3p1p2/8/4R3/8/8/4P3/4K3 w - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "-", "-", [0, 0, 0]], 0, 0, "rook e5, own pawn e2 BEHIND it: the file holds an own pawn - neither (ahead-only reads 20)"],
  ["RW2-enemybehind", "whole-file", "6k1/3p1p2/4R3/8/8/4p3/8/4K3 w - - 0 1", 2, [0, "-", "e", [0, 0, 10]], [0, "-", "-", [0, 0, 0]], 10, 10, "rook e6, enemy pawn e3 BEHIND it: semi-open (ahead-only reads open 20)"],
  // --- doubled rooks, and per-file counting ---
  ["RD1-doubled-open", "doubled", "4k3/1ppp4/8/8/8/8/RPPP4/R3K3 w - - 0 1", 4, [0, "a", "-", [0, 20, 0]], [0, "-", "-", [0, 0, 0]], 20, 20, "rooks a1 + a2 on the open a-file: once, 20 (not 40)"],
  ["RD2-doubled-semi", "doubled", "4k2r/4ppp1/7r/8/8/8/4PPPP/4K3 w - - 0 1", 4, [0, "-", "-", [0, 0, 0]], [0, "-", "h", [0, 0, 10]], -10, -10, "black rooks h8 + h6, white h2 only: once, 10 (not 20)"],
  ["RD3-two-open-files", "doubled", "4k3/2pp4/8/8/8/8/2PP4/R3K2R w - - 0 1", 4, [0, "ah", "-", [0, 40, 0]], [0, "-", "-", [0, 0, 0]], 40, 40, "two rooks on two open files: per file, 40"],
  ["RD4-open-plus-semi", "doubled", "4k3/2ppp2p/8/8/8/8/2PPP3/R3K2R b - - 0 1", 4, [0, "a", "h", [0, 20, 10]], [0, "-", "-", [0, 0, 0]], 30, -30, "a open + h semi (black h7): 30; black to move"],
  // --- a seventh-rank rook on an open file (ROOK_MG's 20 is not the seam's) ---
  ["R7-W", "seventh", "6k1/pp1R1ppp/8/8/8/8/PP3PPP/6K1 w - - 0 1", 2, [0, "d", "-", [0, 20, 0]], [0, "-", "-", [0, 0, 0]], 20, 20, "white rook d7, d-file open: seam 20 (ROOK_MG adds its own 20 outside the seam)"],
  ["R7-B", "seventh", "6k1/pp3ppp/8/8/8/8/PP1r1PPP/6K1 b - - 0 1", 2, [0, "-", "-", [0, 0, 0]], [0, "d", "-", [0, 20, 0]], -20, 20, "black rook d2 (its seventh), d-file open: 20"],
  // --- no pawns: every file open ---
  ["NP1-KR-K", "no-pawns", "4k3/8/8/8/8/8/8/R3K3 w - - 0 1", 2, [0, "a", "-", [0, 20, 0]], [0, "-", "-", [0, 0, 0]], 20, 20, "K R v K: the term is a constant 20 (d2)"],
  ["NP2-KRR-KR", "no-pawns", "3rk3/8/8/8/8/8/8/R3K2R b - - 0 1", 6, [0, "ah", "-", [0, 40, 0]], [0, "d", "-", [0, 20, 0]], 20, -20, "no pawns: white a + h 40, black d 20; black to move"],
  ["NP3-KBB-KR", "no-pawns", "4k2r/8/8/8/8/8/8/2B1KB2 w - - 0 1", 4, [2, "-", "-", [50, 0, 0]], [0, "h", "-", [0, 20, 0]], 30, 30, "no pawns: white's pair 50 against black's open h 20"],
  // --- both sides' rooks on one file ---
  ["RX1-one-file-split", "shared-file", "4r1k1/5ppp/8/8/4P3/8/5PPP/4R1K1 w - - 0 1", 4, [0, "-", "-", [0, 0, 0]], [0, "-", "e", [0, 0, 10]], -10, -10, "e-file, white e4 only: white's rook neither, black's semi-open"],
  ["RX2-one-file-open", "shared-file", "4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 b - - 0 1", 4, [0, "e", "-", [0, 20, 0]], [0, "e", "-", [0, 20, 0]], 0, 0, "e-file open for both: 20 each, not netted in the seam"],
  // --- full boards ---
  ["FB1-start", "full", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 24, [2, "-", "-", [50, 0, 0]], [2, "-", "-", [50, 0, 0]], 0, 0, "the start: pairs both sides, no open file; reads 0 by symmetry"],
  ["FB2-kiwipete", "full", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 24, [2, "-", "-", [50, 0, 0]], [2, "-", "-", [50, 0, 0]], 0, 0, "kiwipete: pairs both; a1/h1/a8/h8 files each hold an own pawn (h3 is black's)"],
  ["FB3-mid", "full", "3r1rk1/pp2bppp/2n1pn2/q7/3P4/2N1BN2/PP2BPPP/2RQ1RK1 w - - 0 1", 23, [2, "c", "-", [50, 20, 0]], [1, "-", "d", [0, 0, 10]], 60, 60, "white pair + c-file open; black one bishop + d8 semi-open on white d4; f-rooks neither"],
  ["FB4-largest", "full", "2rr2k1/pb3ppp/1p2pb2/8/8/2N1PN2/PP3PPP/R4RK1 b - - 0 1", 12, [0, "-", "-", [0, 0, 0]], [2, "cd", "-", [50, 40, 0]], -90, 90, "d3's largest swing: black pair 50 + two open files 40 = 90; white's a/f rooks neither"],
];

// K1 (a): new positions for the mirror (Object.is), not in G3's 184 or TAPER_MIRROR_POSITIONS. No values frozen.
// prettier-ignore
const K1A = [
  ["A01", "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 8", "QGD shape, pairs both, castling KQ only"],
  ["A02", "2r3k1/pp3ppp/2n1b3/8/8/2B5/PP3PPP/3R2K1 b - - 0 1", "one bishop each; white d1 and black c8 on open files"],
  ["A03", "r4rk1/1b3ppp/p7/1p6/8/P1B5/1P3PPP/R2R2K1 w - - 0 1", "white rook d1 open, a1 own pawn; black a8 own pawn"],
  ["A04", "6k1/5pbp/6p1/8/8/1B6/5PPP/1B4K1 b - - 0 1", "white same-colour pair b1 + b3 (light) against one bishop"],
  ["A05", "3r2k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", "rook endgame, both rooks on open files"],
  ["A06", "8/2k5/8/3b4/8/2BB4/8/4K3 w - - 0 1", "no pawns, white pair v one bishop"],
  ["A07", "r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2QK2R b KQkq - 0 10", "all four castling rights, e-file open with no rook on it"],
  ["A08", "4k3/8/8/3pP3/8/8/8/R3K2R w KQ d6 0 2", "en-passant square d6; rooks on open a and h files"],
  ["A09", "1r4k1/5ppp/8/8/8/8/1P3PPP/1R4K1 b - - 0 1", "black b8 semi-open on white b2; white b1 own pawn"],
  ["A10", "2b2kb1/8/8/8/8/8/4R3/4K3 w - - 0 1", "black same-colour pair c8 + g8 (light) v a rook on an open file"],
  ["A11", "rnbqkbnr/pppp1ppp/8/4p3/4P3/5B2/PPPP1PP1/RNBQKBNR b KQkq - 0 3", "three white bishops, raw phase 25 (clamp); h1 semi-open on black h7"],
  ["A12", "8/5k2/8/2r5/8/8/3K4/8 w - - 0 1", "K v K R, no pawns, white to move"],
  ["A13", "r2q1rk1/1b2bppp/p1n1pn2/1p6/3P4/P1NB1N2/1PQ2PPP/R1B2RK1 b - - 0 12", "pairs both, no rook on an open or semi-open file"],
  ["A14", "5rk1/1p3ppp/p7/8/8/P7/1P3PPP/2R3K1 w - - 0 1", "white c1 on the open c-file, black f8 neither"],
  ["A15", "6k1/p4ppp/8/8/8/8/1R3PPP/1R4K1 b - - 0 1", "white rooks doubled b1 + b2 on the open b-file"],
];

// K2: the two ABC-083 rows' re-found fixtures (ADR-0076 K2; lost fixture properties, not re-pins).
const K2 = [
  {
    id: "K2-A4",
    row: "src/evaluate.king-mobility.test.ts ABC-083 A4, \"white, with substantially more moves at equal material, scores strictly higher\"",
    replaces: "MOBILE_WHITE = 6kr/6pp/8/8/3R4/8/6PP/6K1 w - - 0 1 (the premise only; MOBILE_WHITE stays in KING_POSITIONS for A1 and the bound row)",
    fen: "6kr/3p2pp/8/8/3R4/8/3P2PP/6K1 w - - 0 1",
    change: "a white pawn on d2 and a black pawn on d7 (mirror squares): white's d4 rook's file now holds an own pawn, so neither rook earns a file term",
    hand: {
      white: [0, "-", "-", [0, 0, 0]],
      black: [0, "-", "-", [0, 0, 0]],
      net: 0,
      note: "d4 rook: d-file holds own d2 -> neither; h8 rook: h-file holds own h7 -> neither; no bishops. Every term but mobility still cancels.",
    },
    expects: [
      "legalMoves(white to move) >= legalMoves(black to move) + 10",
      "evaluateWithoutMobility(position) === 0 (its door keeps the piece terms on; they are 0 - 0 here)",
      "evaluate(position) > 0",
      "evaluate(same board, black to move) < 0",
    ],
  },
  {
    id: "K2-A3b",
    row: "src/evaluate.king-mobility.test.ts ABC-083 A3 (b), \"at EQUAL material, shelter equal, at phase 24: the f-pawn on e5 (f half-open) scores lower than on f5\", and its twin \"with the half-open term zeroed, e5 no longer scores lower\"",
    replaces: "F_CLOSED_F5_24 / F_HALF_OPEN_E5_24 (rnbq1rk1/3nbppp/8/{5P2|4P3}/8/8/3NB1PP/RNBQ1RK1 w - - 0 1)",
    closedF5: "rnbr1qk1/3nbppp/8/5P2/8/8/3NB1PP/RNBR1QK1 w - - 0 1",
    halfOpenE5: "rnbr1qk1/3nbppp/8/4P3/8/8/3NB1PP/RNBR1QK1 w - - 0 1",
    change: "each side's f-rook and queen swap squares (rooks d1 / d8, queens f1 / f8): no rook stands on the e- or f-file, the only files the two arms differ on; the queen keeps the f-file reach the rook had",
    hand: {
      closedF5: { white: [2, "ad", "-", [50, 40, 0]], black: [2, "ad", "-", [50, 40, 0]], net: 0 },
      halfOpenE5: { white: [2, "ad", "-", [50, 40, 0]], black: [2, "ad", "-", [50, 40, 0]], net: 0 },
      note: "both arms: pairs c1 + e2 / c8 + e7; a- and d-files hold no pawn, so a1, d1, a8, d8 are open; no semi-open file holds a rook. The piece terms are equal across the arms, so they add nothing to the margin, under the shipped table and under the zeroed one.",
    },
    expects: [
      "phaseOf both arms === 24",
      "evaluate(halfOpenE5) < evaluate(closedF5)",
      "inside withParametersForTest(zeroed(\"KING_FILE_HALF_OPEN\")): evaluate(halfOpenE5) >= evaluate(closedF5) (red with the term zeroed)",
    ],
  },
];

const side = ([bishops, open, semi, [pair, openCp, semiCp]]) => ({
  bishops,
  openFiles: open === "-" ? [] : open.split(""),
  semiOpenFiles: semi === "-" ? [] : semi.split(""),
  parts: {
    BISHOP_PAIR: { mg: pair, eg: pair },
    ROOK_OPEN_FILE: { mg: openCp, eg: openCp },
    ROOK_SEMI_OPEN_FILE: { mg: semiCp, eg: semiCp },
  },
});

const out = {
  task: "qe-ABC-292-freeze",
  ticket: "ABC-292",
  adr: "ADR-0076 (accepted 2026-11-08, orch-2026-10-30a …23d30c72): d2 definitions, d3 rule and table, d9 K1 (a) / (c), K2",
  main: "0885de715cdfc67d05f7f2b3623c5b555dbcdb70",
  srcTree: "bba42fb7a8f613ee7947ddf9d570140cd4bd7f8e",
  values: VALUES,
  conventions: [
    "Per side, never netted (d5's pieceTermsForTest). Each part is mg and eg; every value has mg === eg by d3.",
    "openFiles / semiOpenFiles: the files that count, once per file, for that side (d2).",
    "net = white total - black total. stm = net if white is to move, else -net: K1 (d)'s evaluate - off-door.",
    "phase = hand phase (N 1, B 1, R 2, Q 4, both sides, clamped at 24); the seam does not depend on it (equal halves).",
  ],
  k1c: K1C.map(([id, group, fen, phase, w, b, net, stm, why]) => ({ id, group, fen, phase, white: side(w), black: side(b), net, stm, why })),
  k1a: K1A.map(([id, fen, why]) => ({ id, fen, why })),
  k2: K2.map((k) => ({
    ...k,
    hand:
      k.id === "K2-A4"
        ? { white: side(k.hand.white), black: side(k.hand.black), net: k.hand.net, note: k.hand.note }
        : {
            closedF5: { white: side(k.hand.closedF5.white), black: side(k.hand.closedF5.black), net: 0 },
            halfOpenE5: { white: side(k.hand.halfOpenE5.white), black: side(k.hand.halfOpenE5.black), net: 0 },
            note: k.hand.note,
          },
  })),
};
writeFileSync(process.argv[2], `${JSON.stringify(out, null, 2)}\n`);
console.log(`k1c ${out.k1c.length}, k1a ${out.k1a.length}, k2 ${out.k2.length}`);
