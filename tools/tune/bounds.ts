/**
 * `ABC-301` (`ADR-0067` d6's amendment, F3 in its second-pull form): the bound set. Every relation
 * row of `src/evaluate*.test.ts` that reads the fitted table, each written as one linear inequality
 * on the parameters: Σ coef · evaluate(fen) ≤ rhs, each `evaluate` from the side to move, the row
 * made strict (≤ rhs − 1) when `strict`. The fit tightens it by its margin (½ ‖a‖₁ for rounding,
 * + |coef| per position with 0 < w < 24 for the blend's trunc, + 1 if strict), so the emitted
 * integer set holds the row by construction. Every row is bounded from the first fit; there is no
 * box-only fit and no refit.
 *
 * A term's `without` names the families the row reads with that term removed: the bite rows run
 * inside the seam with the family's halves at 0, and `evaluateWithoutMobility` is `evaluate` less
 * the mobility term. Each FEN appears literally in its test file, or in `fenFile` when the row reads
 * a frozen corpus (the FEN source row in `tools/tune/tune.test.ts`).
 *
 * Not in the set, each by a reason the PREREG states: rows that hold on every table (the mirrors,
 * start = 0, |mobility| ≤ cap), rows that read fixed values through the seam, pins, and `ABC-274` A9,
 * the int16 range row, which is read on the emission.
 */
export interface BoundTerm {
  readonly fen: string;
  readonly coef: number;
  /** The families removed from this read: `src/evaluate-params.ts` export names. */
  readonly without?: readonly string[];
}

export interface BoundRow {
  /** The test file, repository-relative. */
  readonly file: string;
  /** The test row's name, or its `describe`'s for an `it.each`, as written in the file. */
  readonly row: string;
  /** Which assertion of the row, when it holds more than one inequality. */
  readonly part?: string;
  /** Where the FENs are written, when not in `file`. */
  readonly fenFile?: string;
  /** Σ coef · evaluate(fen), from the side to move. */
  readonly terms: readonly BoundTerm[];
  readonly rhs: number;
  readonly strict: boolean;
}

const lessThan = (
  file: string,
  row: string,
  low: string,
  high: string,
  part?: string,
): BoundRow => ({
  file,
  row,
  ...(part === undefined ? {} : { part }),
  terms: [
    { fen: low, coef: 1 },
    { fen: high, coef: -1 },
  ],
  rhs: 0,
  strict: true,
});

const EVALUATE = "src/evaluate.test.ts";
const KING = "src/evaluate.king-mobility.test.ts";
const PAWNS = "src/evaluate.pawns.test.ts";
const TAPER = "src/evaluate.taper.test.ts";

// `src/evaluate.test.ts`, A3 and A4.
const NO_BLACK_KNIGHT = "r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const KNIGHT_B1 = "4k3/8/8/8/8/8/8/1N2K3 w - - 0 1";
const KNIGHT_E4 = "4k3/8/8/8/4N3/8/8/4K3 w - - 0 1";

// `src/evaluate.king-mobility.test.ts`.
const SHELTERED = "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1";
const G2_REMOVED = "6k1/5ppp/8/8/8/8/5P1P/6K1 w - - 0 1";
const F_HALF_OPEN = "6k1/5ppp/8/8/8/8/6PP/6K1 w - - 0 1";
const SHELTERED_24 = "rnbq1rk1/3nbppp/8/8/8/8/3NBPPP/RNBQ1RK1 w - - 0 1";
const G_PAWN_ON_G6_24 = "rnbq1rk1/3nbppp/6P1/8/8/8/3NBP1P/RNBQ1RK1 w - - 0 1";
const F_CLOSED_F5_24 = "rnbq1rk1/3nbppp/8/5P2/8/8/3NB1PP/RNBQ1RK1 w - - 0 1";
const F_HALF_OPEN_E5_24 = "rnbq1rk1/3nbppp/8/4P3/8/8/3NB1PP/RNBQ1RK1 w - - 0 1";
const MOBILE_WHITE = "6kr/6pp/8/8/3R4/8/6PP/6K1 w - - 0 1";
const QUEEN_RIG = "7k/8/1Q4Q1/8/8/1Q4Q1/8/K7 w - - 0 1";

// `src/evaluate.pawns.test.ts`.
const DOUBLED = "7k/2pp4/8/8/2P5/2P5/8/7K w - - 0 1";
const SIDE_BY_SIDE = "7k/2pp4/8/8/8/2PP4/8/7K w - - 0 1";
const SUPPORTED = "4k3/1ppppp2/8/8/3P4/2P1P3/8/4K3 w - - 0 1";
const ALONE = "4k3/1ppppp2/8/8/3P4/8/8/4K3 w - - 0 1";
const SPREAD = "4k3/1ppppp2/8/8/3P4/P5P1/8/4K3 w - - 0 1";
const NEIGHBOUR_LEFT = "7k/8/8/8/3P4/2P5/8/7K w - - 0 1";
const APART_A3 = "7k/8/8/8/3P4/P7/8/7K w - - 0 1";
const NEIGHBOUR_RIGHT = "7k/8/8/8/3P4/4P3/8/7K w - - 0 1";
const APART_B4 = "7k/8/8/8/1P1P4/8/8/7K w - - 0 1";
const PASSED_A5 = "4k3/7p/8/P7/8/8/8/4K3 w - - 0 1";
const PASSED_A7 = "4k3/P6p/8/8/8/8/8/4K3 w - - 0 1";
const STOPPED_A5 = "4k3/8/1p6/P7/8/8/8/4K3 w - - 0 1";

/**
 * `src/evaluate.taper.test.ts` B1 (d), from `src/evaluate.taper-corpus.ts`: centre minus corner
 * ≥ 20 cp from the walking king's side. `sign` is +1 where that king's side is to move in the FEN.
 */
const B1D_ROW =
  "ABC-269 B1 (d) — the king walks: centre beats corner by >= 20 cp on QE's six graded endings";
const B1D = [
  ["D1", 1, "8/5pk1/6p1/7p/3K3P/6P1/5P2/8 w - - 0 1", "8/5pk1/6p1/7p/7P/6P1/5P2/K7 w - - 0 1"],
  ["D2", -1, "8/p1k5/1p4p1/4K3/8/8/PP5P/8 b - - 0 1", "8/p1k5/1p4p1/8/8/8/PP5P/7K b - - 0 1"],
  ["D3", 1, "8/pp6/2p5/8/4kP2/1P4K1/P7/8 b - - 0 1", "7k/pp6/2p5/8/5P2/1P4K1/P7/8 b - - 0 1"],
  ["D4", -1, "8/p7/6p1/3k3p/7P/6P1/5PK1/8 w - - 0 1", "k7/p7/6p1/7p/7P/6P1/5PK1/8 w - - 0 1"],
  ["D5", -1, "8/5k2/1p6/p5p1/P3K1P1/1P6/8/8 b - - 0 1", "7K/5k2/1p6/p5p1/P5P1/1P6/8/8 b - - 0 1"],
  ["D6", -1, "8/8/8/pp6/3k4/5P2/6PP/6K1 w - - 0 1", "8/8/8/pp6/8/5P2/6PP/k5K1 w - - 0 1"],
] as const;

const SHELTER_ROW =
  "the phase-24 twin bites: with the shelter term zeroed, g6 no longer scores lower (red without the term)";
const HALF_OPEN_ROW =
  "the phase-24 twin bites: with the half-open term zeroed, e5 no longer scores lower (red without the term)";

/** The bound set, in file order: 26 rows, `ABC-301`'s PREREG. */
export const BOUNDS: readonly BoundRow[] = [
  {
    file: EVALUATE,
    row: "scores startpos-minus-a-black-knight between +250 and +400 for white",
    part: "score >= 250",
    terms: [{ fen: NO_BLACK_KNIGHT, coef: -1 }],
    rhs: -250,
    strict: false,
  },
  {
    file: EVALUATE,
    row: "scores startpos-minus-a-black-knight between +250 and +400 for white",
    part: "score <= 400",
    terms: [{ fen: NO_BLACK_KNIGHT, coef: 1 }],
    rhs: 400,
    strict: false,
  },
  lessThan(EVALUATE, "prefers a white knight on e4 to the same knight on b1", KNIGHT_B1, KNIGHT_E4),
  lessThan(
    KING,
    "g2 removed from f2/g2/h2 scores strictly lower for white (the criterion as written)",
    G2_REMOVED,
    SHELTERED,
  ),
  lessThan(
    KING,
    "at EQUAL material too, at phase 24: the g-pawn on g6 instead of g2 scores strictly lower (ABC-270 re-find)",
    G_PAWN_ON_G6_24,
    SHELTERED_24,
  ),
  {
    file: KING,
    row: SHELTER_ROW,
    terms: [
      {
        fen: SHELTERED_24,
        coef: 1,
        without: ["KING_SHELTER_MISSING", "KING_SHELTER_MISSING_QUEEN"],
      },
      {
        fen: G_PAWN_ON_G6_24,
        coef: -1,
        without: ["KING_SHELTER_MISSING", "KING_SHELTER_MISSING_QUEEN"],
      },
    ],
    rhs: 0,
    strict: false,
  },
  lessThan(
    KING,
    "no f-pawn (black f7 remains) scores strictly lower than f2 for white (the criterion as written)",
    F_HALF_OPEN,
    SHELTERED,
  ),
  lessThan(
    KING,
    "at EQUAL material, shelter equal, at phase 24: the f-pawn on e5 (f half-open) scores lower than on f5 (ABC-270 re-find)",
    F_HALF_OPEN_E5_24,
    F_CLOSED_F5_24,
  ),
  {
    file: KING,
    row: HALF_OPEN_ROW,
    terms: [
      {
        fen: F_CLOSED_F5_24,
        coef: 1,
        without: ["KING_FILE_HALF_OPEN", "KING_FILE_HALF_OPEN_QUEEN"],
      },
      {
        fen: F_HALF_OPEN_E5_24,
        coef: -1,
        without: ["KING_FILE_HALF_OPEN", "KING_FILE_HALF_OPEN_QUEEN"],
      },
    ],
    rhs: 0,
    strict: false,
  },
  {
    // The row's second order, `evaluate(blackToMove) < 0`, is this inequality again: the same board.
    file: KING,
    row: "white, with substantially more moves at equal material, scores strictly higher",
    terms: [{ fen: MOBILE_WHITE, coef: -1 }],
    rhs: 0,
    strict: true,
  },
  {
    file: KING,
    row: "never exceeds ±100 cp — on the four-queen rig and over the whole corpus, both colours to move",
    part: "mobilityTerm(rig) > 0",
    terms: [
      { fen: QUEEN_RIG, coef: -1 },
      { fen: QUEEN_RIG, coef: 1, without: ["MOBILITY_WEIGHT"] },
    ],
    rhs: 0,
    strict: true,
  },
  lessThan(
    PAWNS,
    "c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50",
    DOUBLED,
    SIDE_BY_SIDE,
    "gap > 0",
  ),
  {
    file: PAWNS,
    row: "c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50",
    part: "gap <= 50",
    terms: [
      { fen: SIDE_BY_SIDE, coef: 1 },
      { fen: DOUBLED, coef: -1 },
    ],
    rhs: 50,
    strict: false,
  },
  lessThan(
    PAWNS,
    "d4 with c3/e3 removed scores strictly lower for white (the criterion as written)",
    ALONE,
    SUPPORTED,
  ),
  lessThan(
    PAWNS,
    "at EQUAL material too: c3/e3 moved to a3/g3, isolating all three, scores strictly lower",
    SPREAD,
    SUPPORTED,
  ),
  lessThan(
    PAWNS,
    "d4 with its only neighbour on the LEFT (c3) scores higher than d4 with a3, both isolated",
    APART_A3,
    NEIGHBOUR_LEFT,
  ),
  lessThan(
    PAWNS,
    "d4 with its only neighbour on the RIGHT (e3) scores higher than d4 with b4, both isolated",
    APART_B4,
    NEIGHBOUR_RIGHT,
  ),
  lessThan(PAWNS, "a7 scores strictly higher than a5", PASSED_A5, PASSED_A7),
  lessThan(
    PAWNS,
    "both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material",
    STOPPED_A5,
    PASSED_A5,
    "a5 > stopped",
  ),
  lessThan(
    PAWNS,
    "both score higher than the same a5 pawn stopped by a black pawn on b6, at equal material",
    STOPPED_A5,
    PASSED_A7,
    "a7 > stopped",
  ),
  ...B1D.map(
    ([id, sign, centre, corner]): BoundRow => ({
      file: TAPER,
      fenFile: "src/evaluate.taper-corpus.ts",
      row: B1D_ROW,
      part: id,
      terms: [
        { fen: centre, coef: -sign },
        { fen: corner, coef: sign },
      ],
      rhs: -20,
      strict: false,
    }),
  ),
];
