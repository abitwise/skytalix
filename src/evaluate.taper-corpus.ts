/**
 * ABC-269 (E1, the tapered evaluation): QE's FROZEN POSITION SETS. TEST-ONLY DATA.
 *
 * Frozen by QE before any E1 code exists (task `qe-ABC-269-freeze`; ticket test note 1; the
 * PREREG, the build rules and the verify run are under `.grugops/context/qe-ABC-269-freeze/`).
 * Read from `main`'s `src/` tree `58fa3eb4`. NEVER changed to make a row fit: a row that must
 * change is a new, dated QE note and a re-freeze, never an edit here.
 *
 * - `TAPER_MIRROR_POSITIONS`: B1 (a), the >= 15 new positions over phases 0-24 (30 here),
 *   read beside `G3`'s corpus with the shared `mirrorPosition` helper (`ABC-082` `A7`).
 *   Rows with `rawPhase >= 24` are B1 (b)'s full-material rows too (the clamp rows included).
 * - `TAPER_KP_ENDINGS`: B1 (d)'s 6 graded king-and-pawn endings (centre >= corner + 20 cp, from
 *   the walking king's side). `TAPER_KP_SHELTER_STRESS`: 3 more, a REPORT until the Architect
 *   rules whether a sheltered corner belongs in B1 (d) (QE's finding); then they promote as they
 *   stand.
 * - `TAPER_PASSER_PAIRS` and `TAPER_PASSER_PHASES`: B1 (e), by position pair and by array.
 * - `TAPER_DOOR_CORPUS` and `G3_CORPUS_MAIN_EVALUATE`: B1 (c), the pre-ticket `evaluate` on
 *   every position above (and its mirror) and on `G3`'s 184 in `buildCorpus` order.
 *
 * Phase is N 1, B 1, R 2, Q 4 over both sides (`ADR-0064` d1); `rawPhase` is before the clamp
 * to 24. Not named `*.test.ts`, so vitest does not collect it; under `src/`, so `tsc` and Biome
 * check it. No production module may import it (the shared mirror corpus's precedent). It names
 * no other module by file name: `ABC-082` `A7`'s guard reads every non-test module's text.
 */

/** Where and when the sets were frozen. */
export const TAPER_FROZEN_AT = {
  task: "qe-ABC-269-freeze",
  ticket: "ABC-269",
  srcTree: "58fa3eb4252509cbb1423991e5ae7948f35f98f4",
  baseCommit: "3e55c6a4",
} as const;

/** A B1 (a) row. `source` is how it was built (a stated rule); `why` is what it exercises. */
export interface TaperMirrorRow {
  readonly id: string;
  readonly fen: string;
  readonly rawPhase: number;
  readonly source: string;
  readonly why: string;
}

/**
 * B1 (a): one row per phase 0-24 (ladders L1 and L3 from position-4, L2 from position-5: pieces
 * removed in a stated order, the side to move flipped to black on even phases where legal), two
 * clamp rows (raw 28 and 32), two -0 traps (mg exactly 0, |delta x (24 - w)| < 24) and one row
 * with an en-passant square below phase 24.
 */
export const TAPER_MIRROR_POSITIONS: readonly TaperMirrorRow[] = [
  {
    id: "M-p24-pos5-btm",
    fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R b KQ - 1 8",
    rawPhase: 24,
    source: "position-5 (G3 root), side to move flipped to black",
    why: "phase 24 from a non-start root, black to move; the blend must vanish (w = D)",
  },
  {
    id: "M-p23-L1",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 23,
    source: "position-4 minus f3 (ladder L1: minors first, alternating W/B, board order)",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p22-L1",
    fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/BBP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 22,
    source:
      "position-4 minus f3 a5 (ladder L1: minors first, alternating W/B, board order) (white to move: black to move is illegal, white is in check)",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p21-L1",
    fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/1BP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 21,
    source: "position-4 minus f3 a5 a4 (ladder L1: minors first, alternating W/B, board order)",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p20-L1",
    fen: "r3k2r/Pppp1ppp/5nbN/1P6/1BP1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    rawPhase: 20,
    source:
      "position-4 minus f3 a5 a4 b6 (ladder L1: minors first, alternating W/B, board order), black to move",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p19-L1",
    fen: "r3k2r/Pppp1ppp/5nbN/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 19,
    source:
      "position-4 minus f3 a5 a4 b6 b4 (ladder L1: minors first, alternating W/B, board order)",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p18-L1",
    fen: "r3k2r/Pppp1ppp/6bN/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    rawPhase: 18,
    source:
      "position-4 minus f3 a5 a4 b6 b4 f6 (ladder L1: minors first, alternating W/B, board order), black to move",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p17-L1",
    fen: "r3k2r/Pppp1ppp/6b1/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 17,
    source:
      "position-4 minus f3 a5 a4 b6 b4 f6 h6 (ladder L1: minors first, alternating W/B, board order)",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p16-L1",
    fen: "r3k2r/Pppp1ppp/8/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    rawPhase: 16,
    source:
      "position-4 minus f3 a5 a4 b6 b4 f6 h6 g6 (ladder L1: minors first, alternating W/B, board order), black to move",
    why: "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs",
  },
  {
    id: "M-p15-L3",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/8/Pp1P2PP/R4RK1 w kq - 0 1",
    rawPhase: 15,
    source: "position-4 minus d1 a3 f3 (ladder L3: queens first, then minors, then rooks)",
    why: "the odd phases L1 and L2 skip; delta -50",
  },
  {
    id: "M-p13-L3",
    fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/1BP1P3/8/Pp1P2PP/R4RK1 w kq - 0 1",
    rawPhase: 13,
    source: "position-4 minus d1 a3 f3 a5 a4 (ladder L3: queens first, then minors, then rooks)",
    why: "the odd phases L1 and L2 skip; delta -50",
  },
  {
    id: "M-p11-L3",
    fen: "r3k2r/Pppp1ppp/5nbN/1P6/2P1P3/8/Pp1P2PP/R4RK1 w kq - 0 1",
    rawPhase: 11,
    source:
      "position-4 minus d1 a3 f3 a5 a4 b6 b4 (ladder L3: queens first, then minors, then rooks)",
    why: "the odd phases L1 and L2 skip; delta -50",
  },
  {
    id: "M-p9-L3",
    fen: "r3k2r/Pppp1ppp/6b1/1P6/2P1P3/8/Pp1P2PP/R4RK1 w kq - 0 1",
    rawPhase: 9,
    source:
      "position-4 minus d1 a3 f3 a5 a4 b6 b4 f6 h6 (ladder L3: queens first, then minors, then rooks)",
    why: "the odd phases L1 and L2 skip; delta -50",
  },
  {
    id: "M-p14-L2",
    fen: "rnb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K2R b - - 1 8",
    rawPhase: 14,
    source: "position-5 minus d1 d8 a1 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p12-L2",
    fen: "1nb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K2R b - - 1 8",
    rawPhase: 12,
    source: "position-5 minus d1 d8 a1 a8 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p10-L2",
    fen: "1nb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K3 b - - 1 8",
    rawPhase: 10,
    source:
      "position-5 minus d1 d8 a1 a8 h1 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p8-L2",
    fen: "1nb2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K3 b - - 1 8",
    rawPhase: 8,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p7-L2",
    fen: "1nb2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/2B1K3 w - - 1 8",
    rawPhase: 7,
    source: "position-5 minus d1 d8 a1 a8 h1 h8 b1 (ladder L2: queens, rooks, then minors)",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p6-L2",
    fen: "2b2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/2B1K3 b - - 1 8",
    rawPhase: 6,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p5-L2",
    fen: "2b2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/4K3 w - - 1 8",
    rawPhase: 5,
    source: "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 (ladder L2: queens, rooks, then minors)",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p4-L2",
    fen: "5k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/4K3 b - - 1 8",
    rawPhase: 4,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 c8 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p3-L2",
    fen: "5k2/pp1Pbppp/2p5/8/8/8/PPP1NnPP/4K3 w - - 1 8",
    rawPhase: 3,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 c8 c4 (ladder L2: queens, rooks, then minors)",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p2-L2",
    fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP1NnPP/4K3 b - - 1 8",
    rawPhase: 2,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 c8 c4 e7 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p1-L2",
    fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP2nPP/4K3 w - - 1 8",
    rawPhase: 1,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 c8 c4 e7 e2 (ladder L2: queens, rooks, then minors)",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-p0-L2",
    fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP3PP/4K3 b - - 1 8",
    rawPhase: 0,
    source:
      "position-5 minus d1 d8 a1 a8 h1 h8 b1 b8 c1 c8 c4 e7 e2 f2 (ladder L2: queens, rooks, then minors), black to move",
    why: "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move",
  },
  {
    id: "M-clamp28",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q1Q2N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 28,
    source: "position-4 plus a white queen on c3 (white has 7 pawns: one promotion is reachable)",
    why: "raw phase 28 must clamp to 24 (d1); unclamped, w > D flips the blend's sign",
  },
  {
    id: "M-clamp32",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP2q3/BBP1P3/q1Q2N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    rawPhase: 32,
    source: "position-4 plus a white queen c3 and a black queen e5",
    why: "raw phase 32, clamp, both sides promoted",
  },
  {
    id: "M-negzero-a",
    fen: "4qb1r/r1p1kp2/1Bnpb2p/P3pQ2/P1P1P1P1/3P2PP/N5K1/R4BnR b - - 0 22",
    rawPhase: 23,
    source: "seeded random walk from the start (seed 269, game 1383, ply 42)",
    why: "mg exactly 0, delta +5 at phase 23: the full form trunc((mg w + eg (D - w)) / D) returns -0 for its white-to-move mirror, the delta form mg + trunc(...) returns +0 (Object.is)",
  },
  {
    id: "M-negzero-b",
    fen: "4q3/pBp2k1r/n2pb2n/1p1Pp1p1/4Q1p1/2P1b2N/4PP1P/RN1K2R1 w - - 0 22",
    rawPhase: 21,
    source:
      "seeded random walk from the start (seed 269, game 3257, ply 42), side to move set to white",
    why: "mg exactly 0, delta -5 at phase 21, white to move: the full form returns -0 here directly",
  },
  {
    id: "M-ep-p9",
    fen: "r3k2r/Pppp1ppp/6b1/1P6/P1P1P3/8/1p1P2PP/R4RK1 b kq a3 0 1",
    rawPhase: 9,
    source: "L3's phase-9 rung, then its first double pawn push in legalMoves order",
    why: "en-passant square set and black to move at phase 9: the mirror helper's ep and castling paths below phase 24",
  },
];

/** A B1 (d) ending: the same position twice, the walking king on a centre square or in a corner. */
export interface TaperKpEnding {
  readonly id: string;
  readonly walkingKing: "white" | "black";
  readonly centreSquare: string;
  readonly cornerSquare: string;
  /** Own pawns in front of the corner king: none, on one of its files, or on both. */
  readonly cornerShelter: "none" | "partial" | "full";
  readonly centreFen: string;
  readonly cornerFen: string;
  readonly rawPhase: number;
  readonly why: string;
  /** Pre-ticket `evaluate`, centre minus corner, from the walking king's side (a reading). */
  readonly mainCentreMinusCorner: number;
}

const kp = (row: Omit<TaperKpEnding, "rawPhase">): TaperKpEnding => ({ ...row, rawPhase: 0 });

/** B1 (d), graded: centre minus corner >= 20 cp from the walking king's side, on all 6. */
export const TAPER_KP_ENDINGS: readonly TaperKpEnding[] = [
  kp({
    id: "D1",
    walkingKing: "white",
    centreSquare: "d4",
    cornerSquare: "a1",
    cornerShelter: "none",
    centreFen: "8/5pk1/6p1/7p/3K3P/6P1/5P2/8 w - - 0 1",
    cornerFen: "8/5pk1/6p1/7p/7P/6P1/5P2/K7 w - - 0 1",
    why: "kingside pawn chains, white king stranded on the far corner a1",
    mainCentreMinusCorner: -55,
  }),
  kp({
    id: "D2",
    walkingKing: "white",
    centreSquare: "e5",
    cornerSquare: "h1",
    cornerShelter: "partial",
    centreFen: "8/p1k5/1p4p1/4K3/8/8/PP5P/8 b - - 0 1",
    cornerFen: "8/p1k5/1p4p1/8/8/8/PP5P/7K b - - 0 1",
    why: "corner h1 sheltered on the h-file only (h2); black to move; queenside majority for white",
    mainCentreMinusCorner: -96,
  }),
  kp({
    id: "D3",
    walkingKing: "black",
    centreSquare: "e4",
    cornerSquare: "h8",
    cornerShelter: "none",
    centreFen: "8/pp6/2p5/8/4kP2/1P4K1/P7/8 b - - 0 1",
    cornerFen: "7k/pp6/2p5/8/5P2/1P4K1/P7/8 b - - 0 1",
    why: "black king walks; its pawns on the queenside, corner h8 bare; centre square beside an enemy pawn",
    mainCentreMinusCorner: -45,
  }),
  kp({
    id: "D4",
    walkingKing: "black",
    centreSquare: "d5",
    cornerSquare: "a8",
    cornerShelter: "partial",
    centreFen: "8/p7/6p1/3k3p/7P/6P1/5PK1/8 w - - 0 1",
    cornerFen: "k7/p7/6p1/7p/7P/6P1/5PK1/8 w - - 0 1",
    why: "black corner a8 sheltered on the a-file only (a7); white to move, read from black's side",
    mainCentreMinusCorner: -86,
  }),
  kp({
    id: "D5",
    walkingKing: "white",
    centreSquare: "e4",
    cornerSquare: "h8",
    cornerShelter: "none",
    centreFen: "8/5k2/1p6/p5p1/P3K1P1/1P6/8/8 b - - 0 1",
    cornerFen: "7K/5k2/1p6/p5p1/P5P1/1P6/8/8 b - - 0 1",
    why: "white king in the enemy's corner h8 (its mg table already -50 there); blocked pawns",
    mainCentreMinusCorner: -35,
  }),
  kp({
    id: "D6",
    walkingKing: "black",
    centreSquare: "d4",
    cornerSquare: "a1",
    cornerShelter: "none",
    centreFen: "8/8/8/pp6/3k4/5P2/6PP/6K1 w - - 0 1",
    cornerFen: "8/8/8/pp6/8/5P2/6PP/k5K1 w - - 0 1",
    why: "black king in the enemy's corner a1; black has two connected passers",
    mainCentreMinusCorner: -55,
  }),
];

/**
 * REPORT, not graded, until the Architect rules (QE finding, `qe-ABC-269-freeze`): the castled
 * corner with both of its files sheltered. `kingExposure` keeps equal halves at E1 (shelter
 * tapering is E3's), so the centre king still pays up to 105 cp there. If the ruling puts the
 * sheltered corner in B1 (d), these rows join it exactly as frozen.
 */
export const TAPER_KP_SHELTER_STRESS: readonly TaperKpEnding[] = [
  kp({
    id: "S1",
    walkingKing: "white",
    centreSquare: "e4",
    cornerSquare: "h1",
    cornerShelter: "full",
    centreFen: "6k1/p5pp/8/8/4K3/8/P5PP/8 w - - 0 1",
    cornerFen: "6k1/p5pp/8/8/8/8/P5PP/7K w - - 0 1",
    why: "castled corner h1 behind g2 h2, centre files d e f bare",
    mainCentreMinusCorner: -117,
  }),
  kp({
    id: "S2",
    walkingKing: "black",
    centreSquare: "d5",
    cornerSquare: "a8",
    cornerShelter: "full",
    centreFen: "8/pp3p2/8/3k4/8/8/PP3P2/1K6 b - - 0 1",
    cornerFen: "k7/pp3p2/8/8/8/8/PP3P2/1K6 b - - 0 1",
    why: "castled corner a8 behind a7 b7, centre files c d e bare",
    mainCentreMinusCorner: -117,
  }),
  kp({
    id: "S3",
    walkingKing: "white",
    centreSquare: "d5",
    cornerSquare: "a1",
    cornerShelter: "full",
    centreFen: "5k2/1pp2pp1/8/3K4/8/8/PP6/8 w - - 0 1",
    cornerFen: "5k2/1pp2pp1/8/8/8/8/PP6/K7 w - - 0 1",
    why: "castled corner a1 behind a2 b2, an enemy pawn on the c-file",
    mainCentreMinusCorner: -107,
  }),
];

/**
 * A B1 (e) pair: the same position with and without one passed pawn. The kings stand where their
 * two halves are equal (white a8, black h1: 40 - 15 x 6 = -50 = the middlegame table), so the
 * passer is the only term whose halves differ: the pair isolates it exactly. `ownRank` is counted
 * from the passer's side (2 = its start rank); `baseBonus` is the pre-ticket `PASSED_PAWN_BONUS`.
 */
export interface TaperPasserPair {
  readonly id: string;
  readonly passer: "white" | "black";
  readonly ownRank: number;
  readonly square: string;
  readonly rawPhase: number;
  readonly withPasserFen: string;
  readonly withoutPasserFen: string;
  readonly baseBonus: number;
}

/** B1 (e) by position: white passers on ranks 2-7, black on 2, 5 and 7; phases 0, 6, 18, 24. */
export const TAPER_PASSER_PAIRS: readonly TaperPasserPair[] = [
  {
    id: "E-w2-p0",
    passer: "white",
    ownRank: 2,
    square: "d2",
    rawPhase: 0,
    withPasserFen: "K7/8/8/8/8/8/3P4/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-w2-p6",
    passer: "white",
    ownRank: 2,
    square: "d2",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N6/6n1/1R6/3P4/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-w2-p18",
    passer: "white",
    ownRank: 2,
    square: "d2",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q1P4/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-w2-p24",
    passer: "white",
    ownRank: 2,
    square: "d2",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q1P4/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-w3-p0",
    passer: "white",
    ownRank: 3,
    square: "d3",
    rawPhase: 0,
    withPasserFen: "K7/8/8/8/8/3P4/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 10,
  },
  {
    id: "E-w3-p6",
    passer: "white",
    ownRank: 3,
    square: "d3",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N6/6n1/1R1P4/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 10,
  },
  {
    id: "E-w3-p18",
    passer: "white",
    ownRank: 3,
    square: "d3",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N6/6n1/1RRP4/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 10,
  },
  {
    id: "E-w3-p24",
    passer: "white",
    ownRank: 3,
    square: "d3",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RRP4/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 10,
  },
  {
    id: "E-w4-p0",
    passer: "white",
    ownRank: 4,
    square: "d4",
    rawPhase: 0,
    withPasserFen: "K7/8/8/8/3P4/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 20,
  },
  {
    id: "E-w4-p6",
    passer: "white",
    ownRank: 4,
    square: "d4",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N6/3P2n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 20,
  },
  {
    id: "E-w4-p18",
    passer: "white",
    ownRank: 4,
    square: "d4",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N6/3P2n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 20,
  },
  {
    id: "E-w4-p24",
    passer: "white",
    ownRank: 4,
    square: "d4",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NN2bb1/1BBP1nn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 20,
  },
  {
    id: "E-w5-p0",
    passer: "white",
    ownRank: 5,
    square: "d5",
    rawPhase: 0,
    withPasserFen: "K7/8/8/3P4/8/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-w5-p6",
    passer: "white",
    ownRank: 5,
    square: "d5",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N1P4/6n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-w5-p18",
    passer: "white",
    ownRank: 5,
    square: "d5",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N1P4/6n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-w5-p24",
    passer: "white",
    ownRank: 5,
    square: "d5",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NNP1bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-w6-p0",
    passer: "white",
    ownRank: 6,
    square: "d6",
    rawPhase: 0,
    withPasserFen: "K7/8/3P4/8/8/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 60,
  },
  {
    id: "E-w6-p6",
    passer: "white",
    ownRank: 6,
    square: "d6",
    rawPhase: 6,
    withPasserFen: "K7/8/3P2r1/1N6/6n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 60,
  },
  {
    id: "E-w6-p18",
    passer: "white",
    ownRank: 6,
    square: "d6",
    rawPhase: 18,
    withPasserFen: "K7/6q1/3P1rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 60,
  },
  {
    id: "E-w6-p24",
    passer: "white",
    ownRank: 6,
    square: "d6",
    rawPhase: 24,
    withPasserFen: "K7/6q1/3P1rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 60,
  },
  {
    id: "E-w7-p0",
    passer: "white",
    ownRank: 7,
    square: "d7",
    rawPhase: 0,
    withPasserFen: "K7/3P4/8/8/8/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-w7-p6",
    passer: "white",
    ownRank: 7,
    square: "d7",
    rawPhase: 6,
    withPasserFen: "K7/3P4/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-w7-p18",
    passer: "white",
    ownRank: 7,
    square: "d7",
    rawPhase: 18,
    withPasserFen: "K7/3P2q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-w7-p24",
    passer: "white",
    ownRank: 7,
    square: "d7",
    rawPhase: 24,
    withPasserFen: "K7/3P2q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-b2-p0",
    passer: "black",
    ownRank: 2,
    square: "e7",
    rawPhase: 0,
    withPasserFen: "K7/4p3/8/8/8/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-b2-p6",
    passer: "black",
    ownRank: 2,
    square: "e7",
    rawPhase: 6,
    withPasserFen: "K7/4p3/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-b2-p18",
    passer: "black",
    ownRank: 2,
    square: "e7",
    rawPhase: 18,
    withPasserFen: "K7/4p1q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-b2-p24",
    passer: "black",
    ownRank: 2,
    square: "e7",
    rawPhase: 24,
    withPasserFen: "K7/4p1q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 5,
  },
  {
    id: "E-b5-p0",
    passer: "black",
    ownRank: 5,
    square: "e4",
    rawPhase: 0,
    withPasserFen: "K7/8/8/8/4p3/8/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-b5-p6",
    passer: "black",
    ownRank: 5,
    square: "e4",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N6/4p1n1/1R6/8/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-b5-p18",
    passer: "black",
    ownRank: 5,
    square: "e4",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N6/4p1n1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-b5-p24",
    passer: "black",
    ownRank: 5,
    square: "e4",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB1pnn1/1RR5/1Q6/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 35,
  },
  {
    id: "E-b7-p0",
    passer: "black",
    ownRank: 7,
    square: "e2",
    rawPhase: 0,
    withPasserFen: "K7/8/8/8/8/8/4p3/7k w - - 0 1",
    withoutPasserFen: "K7/8/8/8/8/8/8/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-b7-p6",
    passer: "black",
    ownRank: 7,
    square: "e2",
    rawPhase: 6,
    withPasserFen: "K7/8/6r1/1N6/6n1/1R6/4p3/7k w - - 0 1",
    withoutPasserFen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-b7-p18",
    passer: "black",
    ownRank: 7,
    square: "e2",
    rawPhase: 18,
    withPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q2p3/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 100,
  },
  {
    id: "E-b7-p24",
    passer: "black",
    ownRank: 7,
    square: "e2",
    rawPhase: 24,
    withPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q2p3/7k w - - 0 1",
    withoutPasserFen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1",
    baseBonus: 100,
  },
];

/**
 * B1 (e) by array (`VALUE_TABLES_FOR_TEST`): every rank whose pre-ticket bonus is > 0, read at
 * EVERY integer phase in each bar's range. Bars: `atMostSix` >= 1.5 x base; `identity` exactly
 * base; `atLeastEighteen` <= 1.25 x base.
 */
export const TAPER_PASSER_PHASES = {
  atMostSix: [0, 1, 2, 3, 4, 5, 6],
  atLeastEighteen: [18, 19, 20, 21, 22, 23, 24],
  identity: 24,
  ownRanks: [2, 3, 4, 5, 6, 7],
} as const;

/**
 * B1 (c): the pre-ticket `evaluate` (side to move's view) on every position in this file and its
 * `mirrorPosition` twin, de-duplicated. The build's `evaluateWithoutTaper` must equal each one,
 * `Object.is`.
 */
export const TAPER_DOOR_CORPUS: ReadonlyArray<{ readonly fen: string; readonly main: number }> = [
  { fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R b KQ - 1 8", main: -110 },
  { fen: "rnbqk2r/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/RNBQ1K1R w kq - 1 8", main: -110 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: -245 },
  { fen: "r2q1rk1/pP1p2pp/Q7/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -245 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/BBP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: 78 },
  { fen: "r2q1rk1/pP1p2pp/Q7/bbp1p3/1p6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: 78 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/1BP1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: -253 },
  { fen: "r2q1rk1/pP1p2pp/Q7/1bp1p3/1p6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -253 },
  { fen: "r3k2r/Pppp1ppp/5nbN/1P6/1BP1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1", main: -100 },
  { fen: "r2q1rk1/pP1p2pp/Q7/1bp1p3/1p6/5NBn/pPPP1PPP/R3K2R w KQ - 0 1", main: -100 },
  { fen: "r3k2r/Pppp1ppp/5nbN/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: -269 },
  { fen: "r2q1rk1/pP1p2pp/Q7/2p1p3/1p6/5NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -269 },
  { fen: "r3k2r/Pppp1ppp/6bN/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1", main: -110 },
  { fen: "r2q1rk1/pP1p2pp/Q7/2p1p3/1p6/6Bn/pPPP1PPP/R3K2R w KQ - 0 1", main: -110 },
  { fen: "r3k2r/Pppp1ppp/6b1/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: -221 },
  { fen: "r2q1rk1/pP1p2pp/Q7/2p1p3/1p6/6B1/pPPP1PPP/R3K2R b KQ - 0 1", main: -221 },
  { fen: "r3k2r/Pppp1ppp/8/1P6/2P1P3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1", main: -116 },
  { fen: "r2q1rk1/pP1p2pp/Q7/2p1p3/1p6/8/pPPP1PPP/R3K2R w KQ - 0 1", main: -116 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/8/Pp1P2PP/R4RK1 w kq - 0 1", main: -217 },
  { fen: "r4rk1/pP1p2pp/8/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -217 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/1P6/1BP1P3/8/Pp1P2PP/R4RK1 w kq - 0 1", main: -221 },
  { fen: "r4rk1/pP1p2pp/8/1bp1p3/1p6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -221 },
  { fen: "r3k2r/Pppp1ppp/5nbN/1P6/2P1P3/8/Pp1P2PP/R4RK1 w kq - 0 1", main: -221 },
  { fen: "r4rk1/pP1p2pp/8/2p1p3/1p6/5NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: -221 },
  { fen: "r3k2r/Pppp1ppp/6b1/1P6/2P1P3/8/Pp1P2PP/R4RK1 w kq - 0 1", main: -173 },
  { fen: "r4rk1/pP1p2pp/8/2p1p3/1p6/6B1/pPPP1PPP/R3K2R b KQ - 0 1", main: -173 },
  { fen: "rnb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K2R b - - 1 8", main: 390 },
  { fen: "1nb1k2r/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/RNB2K1R w - - 1 8", main: 390 },
  { fen: "1nb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K2R b - - 1 8", main: -110 },
  { fen: "1nb1k2r/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/1NB2K1R w - - 1 8", main: -110 },
  { fen: "1nb2k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K3 b - - 1 8", main: 398 },
  { fen: "1nb1k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/1NB2K1R w - - 1 8", main: 398 },
  { fen: "1nb2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/1NB1K3 b - - 1 8", main: -106 },
  { fen: "1nb1k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/1NB2K2 w - - 1 8", main: -106 },
  { fen: "1nb2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/2B1K3 w - - 1 8", main: -211 },
  { fen: "2b1k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/1NB2K2 b - - 1 8", main: -211 },
  { fen: "2b2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/2B1K3 b - - 1 8", main: -102 },
  { fen: "2b1k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/2B2K2 w - - 1 8", main: -102 },
  { fen: "2b2k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/4K3 w - - 1 8", main: -229 },
  { fen: "4k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/2B2K2 b - - 1 8", main: -229 },
  { fen: "5k2/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/4K3 b - - 1 8", main: -90 },
  { fen: "4k3/ppp1nNpp/8/2b5/8/2P5/PP1pBPPP/5K2 w - - 1 8", main: -90 },
  { fen: "5k2/pp1Pbppp/2p5/8/8/8/PPP1NnPP/4K3 w - - 1 8", main: -273 },
  { fen: "4k3/ppp1nNpp/8/8/8/2P5/PP1pBPPP/5K2 b - - 1 8", main: -273 },
  { fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP1NnPP/4K3 b - - 1 8", main: -80 },
  { fen: "4k3/ppp1nNpp/8/8/8/2P5/PP1p1PPP/5K2 w - - 1 8", main: -80 },
  { fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP2nPP/4K3 w - - 1 8", main: -275 },
  { fen: "4k3/ppp2Npp/8/8/8/2P5/PP1p1PPP/5K2 b - - 1 8", main: -275 },
  { fen: "5k2/pp1P1ppp/2p5/8/8/8/PPP3PP/4K3 b - - 1 8", main: -84 },
  { fen: "4k3/ppp3pp/8/8/8/2P5/PP1p1PPP/5K2 w - - 1 8", main: -84 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q1Q2N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: 1063 },
  { fen: "r2q1rk1/pP1p2pp/Q1q2n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: 1063 },
  { fen: "r3k2r/Pppp1ppp/1b3nbN/nP2q3/BBP1P3/q1Q2N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", main: 89 },
  { fen: "r2q1rk1/pP1p2pp/Q1q2n2/bbp1p3/Np2Q3/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", main: 89 },
  { fen: "4qb1r/r1p1kp2/1Bnpb2p/P3pQ2/P1P1P1P1/3P2PP/N5K1/R4BnR b - - 0 22", main: 0 },
  { fen: "r4bNr/n5k1/3p2pp/p1p1p1p1/p3Pq2/1bNPB2P/R1P1KP2/4QB1R w - - 0 22", main: 0 },
  { fen: "4q3/pBp2k1r/n2pb2n/1p1Pp1p1/4Q1p1/2P1b2N/4PP1P/RN1K2R1 w - - 0 22", main: 0 },
  { fen: "rn1k2r1/4pp1p/2p1B2n/4q1P1/1P1pP1P1/N2PB2N/PbP2K1R/4Q3 b - - 0 22", main: 0 },
  { fen: "r3k2r/Pppp1ppp/6b1/1P6/P1P1P3/8/1p1P2PP/R4RK1 b kq a3 0 1", main: 165 },
  { fen: "r4rk1/1P1p2pp/8/p1p1p3/1p6/6B1/pPPP1PPP/R3K2R w KQ a6 0 1", main: 165 },
  { fen: "8/5pk1/6p1/7p/3K3P/6P1/5P2/8 w - - 0 1", main: -122 },
  { fen: "8/5p2/6p1/3k3p/7P/6P1/5PK1/8 b - - 0 1", main: -122 },
  { fen: "8/5pk1/6p1/7p/7P/6P1/5P2/K7 w - - 0 1", main: -67 },
  { fen: "k7/5p2/6p1/7p/7P/6P1/5PK1/8 b - - 0 1", main: -67 },
  { fen: "8/p1k5/1p4p1/4K3/8/8/PP5P/8 b - - 0 1", main: 65 },
  { fen: "8/pp5p/8/8/4k3/1P4P1/P1K5/8 w - - 0 1", main: 65 },
  { fen: "8/p1k5/1p4p1/8/8/8/PP5P/7K b - - 0 1", main: -31 },
  { fen: "7k/pp5p/8/8/8/1P4P1/P1K5/8 w - - 0 1", main: -31 },
  { fen: "8/pp6/2p5/8/4kP2/1P4K1/P7/8 b - - 0 1", main: -67 },
  { fen: "8/p7/1p4k1/4Kp2/8/2P5/PP6/8 w - - 0 1", main: -67 },
  { fen: "7k/pp6/2p5/8/5P2/1P4K1/P7/8 b - - 0 1", main: -22 },
  { fen: "8/p7/1p4k1/5p2/8/2P5/PP6/7K w - - 0 1", main: -22 },
  { fen: "8/p7/6p1/3k3p/7P/6P1/5PK1/8 w - - 0 1", main: 127 },
  { fen: "8/5pk1/6p1/7p/3K3P/6P1/P7/8 b - - 0 1", main: 127 },
  { fen: "k7/p7/6p1/7p/7P/6P1/5PK1/8 w - - 0 1", main: 41 },
  { fen: "8/5pk1/6p1/7p/7P/6P1/P7/K7 b - - 0 1", main: 41 },
  { fen: "8/5k2/1p6/p5p1/P3K1P1/1P6/8/8 b - - 0 1", main: 65 },
  { fen: "8/8/1p6/p3k1p1/P5P1/1P6/5K2/8 w - - 0 1", main: 65 },
  { fen: "7K/5k2/1p6/p5p1/P5P1/1P6/8/8 b - - 0 1", main: 30 },
  { fen: "8/8/1p6/p5p1/P5P1/1P6/5K2/7k w - - 0 1", main: 30 },
  { fen: "8/8/8/pp6/3k4/5P2/6PP/6K1 w - - 0 1", main: 215 },
  { fen: "6k1/6pp/5p2/3K4/PP6/8/8/8 b - - 0 1", main: 215 },
  { fen: "8/8/8/pp6/8/5P2/6PP/k5K1 w - - 0 1", main: 160 },
  { fen: "K5k1/6pp/5p2/8/PP6/8/8/8 b - - 0 1", main: 160 },
  { fen: "6k1/p5pp/8/8/4K3/8/P5PP/8 w - - 0 1", main: -100 },
  { fen: "8/p5pp/8/4k3/8/8/P5PP/6K1 b - - 0 1", main: -100 },
  { fen: "6k1/p5pp/8/8/8/8/P5PP/7K w - - 0 1", main: 17 },
  { fen: "7k/p5pp/8/8/8/8/P5PP/6K1 b - - 0 1", main: 17 },
  { fen: "8/pp3p2/8/3k4/8/8/PP3P2/1K6 b - - 0 1", main: -100 },
  { fen: "1k6/pp3p2/8/8/3K4/8/PP3P2/8 w - - 0 1", main: -100 },
  { fen: "k7/pp3p2/8/8/8/8/PP3P2/1K6 b - - 0 1", main: 17 },
  { fen: "1k6/pp3p2/8/8/8/8/PP3P2/K7 w - - 0 1", main: 17 },
  { fen: "5k2/1pp2pp1/8/3K4/8/8/PP6/8 w - - 0 1", main: -290 },
  { fen: "8/pp6/8/8/3k4/8/1PP2PP1/5K2 b - - 0 1", main: -290 },
  { fen: "5k2/1pp2pp1/8/8/8/8/PP6/K7 w - - 0 1", main: -183 },
  { fen: "k7/pp6/8/8/8/8/1PP2PP1/5K2 b - - 0 1", main: -183 },
  { fen: "K7/8/8/8/8/8/3P4/7k w - - 0 1", main: 95 },
  { fen: "7K/3p4/8/8/8/8/8/k7 b - - 0 1", main: 95 },
  { fen: "K7/8/8/8/8/8/8/7k w - - 0 1", main: 0 },
  { fen: "7K/8/8/8/8/8/8/k7 b - - 0 1", main: 0 },
  { fen: "K7/8/6r1/1N6/6n1/1R6/3P4/7k w - - 0 1", main: 95 },
  { fen: "7K/3p4/1r6/6N1/1n6/6R1/8/k7 b - - 0 1", main: 95 },
  { fen: "K7/8/6r1/1N6/6n1/1R6/8/7k w - - 0 1", main: 0 },
  { fen: "7K/8/1r6/6N1/1n6/6R1/8/k7 b - - 0 1", main: 0 },
  { fen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q1P4/7k w - - 0 1", main: 75 },
  { fen: "7K/1q1p4/1rr5/6N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: 75 },
  { fen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1", main: 0 },
  { fen: "7K/1q6/1rr5/6N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: 0 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q1P4/7k w - - 0 1", main: 75 },
  { fen: "7K/1q1p4/1rr5/1bb2NN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: 75 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1", main: 0 },
  { fen: "7K/1q6/1rr5/1bb2NN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: 0 },
  { fen: "K7/8/8/8/8/3P4/8/7k w - - 0 1", main: 106 },
  { fen: "7K/8/3p4/8/8/8/8/k7 b - - 0 1", main: 106 },
  { fen: "K7/8/6r1/1N6/6n1/1R1P4/8/7k w - - 0 1", main: 86 },
  { fen: "7K/8/1r1p4/6N1/1n6/6R1/8/k7 b - - 0 1", main: 86 },
  { fen: "K7/6q1/5rr1/1N6/6n1/1RRP4/1Q6/7k w - - 0 1", main: 86 },
  { fen: "7K/1q6/1rrp4/6N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: 86 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RRP4/1Q6/7k w - - 0 1", main: 78 },
  { fen: "7K/1q6/1rrp4/1bb2NN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: 78 },
  { fen: "K7/8/8/8/3P4/8/8/7k w - - 0 1", main: 122 },
  { fen: "7K/8/8/3p4/8/8/8/k7 b - - 0 1", main: 122 },
  { fen: "K7/8/6r1/1N6/3P2n1/1R6/8/7k w - - 0 1", main: 118 },
  { fen: "7K/8/1r6/3p2N1/1n6/6R1/8/k7 b - - 0 1", main: 118 },
  { fen: "K7/6q1/5rr1/1N6/3P2n1/1RR5/1Q6/7k w - - 0 1", main: 118 },
  { fen: "7K/1q6/1rr5/3p2N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: 118 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BBP1nn1/1RR5/1Q6/7k w - - 0 1", main: 118 },
  { fen: "7K/1q6/1rr5/1bbp1NN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: 118 },
  { fen: "K7/8/8/3P4/8/8/8/7k w - - 0 1", main: 143 },
  { fen: "7K/8/8/8/3p4/8/8/k7 b - - 0 1", main: 143 },
  { fen: "K7/8/6r1/1N1P4/6n1/1R6/8/7k w - - 0 1", main: 143 },
  { fen: "7K/8/1r6/6N1/1n1p4/6R1/8/k7 b - - 0 1", main: 143 },
  { fen: "K7/6q1/5rr1/1N1P4/6n1/1RR5/1Q6/7k w - - 0 1", main: 143 },
  { fen: "7K/1q6/1rr5/6N1/1n1p4/5RR1/6Q1/k7 b - - 0 1", main: 143 },
  { fen: "K7/6q1/5rr1/1NNP1bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1", main: 127 },
  { fen: "7K/1q6/1rr5/1bb2NN1/1nnp1BB1/5RR1/6Q1/k7 b - - 0 1", main: 127 },
  { fen: "K7/8/3P4/8/8/8/8/7k w - - 0 1", main: 174 },
  { fen: "7K/8/8/8/8/3p4/8/k7 b - - 0 1", main: 174 },
  { fen: "K7/8/3P2r1/1N6/6n1/1R6/8/7k w - - 0 1", main: 182 },
  { fen: "7K/8/1r6/6N1/1n6/3p2R1/8/k7 b - - 0 1", main: 182 },
  { fen: "K7/6q1/3P1rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1", main: 182 },
  { fen: "7K/1q6/1rr5/6N1/1n6/3p1RR1/6Q1/k7 b - - 0 1", main: 182 },
  { fen: "K7/6q1/3P1rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1", main: 182 },
  { fen: "7K/1q6/1rr5/1bb2NN1/1nn2BB1/3p1RR1/6Q1/k7 b - - 0 1", main: 182 },
  { fen: "K7/3P4/8/8/8/8/8/7k w - - 0 1", main: 220 },
  { fen: "7K/8/8/8/8/8/3p4/k7 b - - 0 1", main: 220 },
  { fen: "K7/3P4/6r1/1N6/6n1/1R6/8/7k w - - 0 1", main: 220 },
  { fen: "7K/8/1r6/6N1/1n6/6R1/3p4/k7 b - - 0 1", main: 220 },
  { fen: "K7/3P2q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1", main: 232 },
  { fen: "7K/1q6/1rr5/6N1/1n6/5RR1/3p2Q1/k7 b - - 0 1", main: 232 },
  { fen: "K7/3P2q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1", main: 232 },
  { fen: "7K/1q6/1rr5/1bb2NN1/1nn2BB1/5RR1/3p2Q1/k7 b - - 0 1", main: 232 },
  { fen: "K7/4p3/8/8/8/8/8/7k w - - 0 1", main: -95 },
  { fen: "7K/8/8/8/8/8/4P3/k7 b - - 0 1", main: -95 },
  { fen: "K7/4p3/6r1/1N6/6n1/1R6/8/7k w - - 0 1", main: -95 },
  { fen: "7K/8/1r6/6N1/1n6/6R1/4P3/k7 b - - 0 1", main: -95 },
  { fen: "K7/4p1q1/5rr1/1N6/6n1/1RR5/1Q6/7k w - - 0 1", main: -75 },
  { fen: "7K/1q6/1rr5/6N1/1n6/5RR1/4P1Q1/k7 b - - 0 1", main: -75 },
  { fen: "K7/4p1q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q6/7k w - - 0 1", main: -75 },
  { fen: "7K/1q6/1rr5/1bb2NN1/1nn2BB1/5RR1/4P1Q1/k7 b - - 0 1", main: -75 },
  { fen: "K7/8/8/8/4p3/8/8/7k w - - 0 1", main: -143 },
  { fen: "7K/8/8/4P3/8/8/8/k7 b - - 0 1", main: -143 },
  { fen: "K7/8/6r1/1N6/4p1n1/1R6/8/7k w - - 0 1", main: -143 },
  { fen: "7K/8/1r6/4P1N1/1n6/6R1/8/k7 b - - 0 1", main: -143 },
  { fen: "K7/6q1/5rr1/1N6/4p1n1/1RR5/1Q6/7k w - - 0 1", main: -143 },
  { fen: "7K/1q6/1rr5/4P1N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: -143 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BB1pnn1/1RR5/1Q6/7k w - - 0 1", main: -127 },
  { fen: "7K/1q6/1rr5/1bb1PNN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: -127 },
  { fen: "K7/8/8/8/8/8/4p3/7k w - - 0 1", main: -220 },
  { fen: "7K/4P3/8/8/8/8/8/k7 b - - 0 1", main: -220 },
  { fen: "K7/8/6r1/1N6/6n1/1R6/4p3/7k w - - 0 1", main: -220 },
  { fen: "7K/4P3/1r6/6N1/1n6/6R1/8/k7 b - - 0 1", main: -220 },
  { fen: "K7/6q1/5rr1/1N6/6n1/1RR5/1Q2p3/7k w - - 0 1", main: -232 },
  { fen: "7K/1q2P3/1rr5/6N1/1n6/5RR1/6Q1/k7 b - - 0 1", main: -232 },
  { fen: "K7/6q1/5rr1/1NN2bb1/1BB2nn1/1RR5/1Q2p3/7k w - - 0 1", main: -232 },
  { fen: "7K/1q2P3/1rr5/1bb2NN1/1nn2BB1/5RR1/6Q1/k7 b - - 0 1", main: -232 },
];

/** B1 (c): the pre-ticket `evaluate` on `G3`'s 184 (`buildCorpus()`), in its order. */
export const G3_CORPUS_MAIN_EVALUATE: readonly number[] = [
  0, -66, -18, -18, -66, 0, -8, -10, -12, -12, -20, -38, -33, -50, -41, -4, 3, -10, -12, 0, -8, 41,
  -37, -37, -29, -66, -37, -41, -33, -49, -49, -43, -59, -47, -53, -47, -27, -59, -71, -73, -390,
  -31, -7, -39, -37, -102, -53, -17, -1, 9, -45, -57, -432, -52, -155, -45, -37, -44, -51, -55,
  -153, -134, -126, -129, -45, -1, -33, -17, -99, -58, -30, 24, 26, 28, 6, 14, 18, 18, -105, 30, 18,
  34, 18, 26, 9, 110, -118, -129, -150, -150, -140, -114, 110, -168, -120, -108, -112, -158, -154,
  -144, -122, -119, -164, -177, -165, -192, -135, -497, -86, -106, -110, -114, -122, -116, -126,
  -118, -154, -154, -138, -154, -92, -108, -114, -114, -118, -112, -110, -225, -92, -78, -94, -92,
  -1094, -675, -498, -490, -176, 0, 20, 12, 16, 20, 28, 4, 4, 8, 12, 2, 6, -8, -13, 0, 17, 21, -6,
  -8, 15, 0, 4, 32, 52, 70, 80, 86, -18, -112, 48, -16, 36, 76, -2, -16, -111, 26, -60, 14, 32, 10,
  -377, 26, -14, -14, 8, 34,
];
