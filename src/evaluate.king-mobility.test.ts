/**
 * ABC-083 — acceptance for the king-safety and mobility terms.
 *
 * Relations, never totals (test note 4): every weight in `src/evaluate.ts` is hand-tuned and
 * expected to move. `A1`'s mirror is the one exact property. Each relation below that the
 * criterion's own literal row could pass on material alone has an EQUAL-MATERIAL twin, measured
 * red on the pre-ABC-083 evaluator (`.grugops/context/ticket-to-pr-ABC-083/`).
 *
 * `A1`'s corpus EXTENDS ABC-076's 184 through `src/evaluate.mirror-corpus.ts` — the third ticket,
 * the same helper, no fork (test note 3). ABC-082's pawn structures are mirrored by
 * `src/evaluate.pawns.test.ts`, which calls this same `evaluate`.
 *
 * NO wall-clock assertion lives here: `A5`'s cost and `A7`/`A9`'s depth reads are REPORTED
 * figures with their machine, in the ticket's PR note.
 */

import { describe, expect, it } from "vitest";
import {
  buildCorpus,
  clonePosition,
  mirrorPosition,
  PERFT_POSITIONS,
} from "./evaluate.mirror-corpus.ts";
import { evaluate, evaluateWithoutMobility, VALUE_TABLES_FOR_TEST } from "./evaluate.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { type Position, QUEEN } from "./position.ts";

/** `A2`: kingside castled, f2/g2/h2; the same with g2 removed; and g2 moved to g6 (equal material). */
const SHELTERED = "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1";
const G2_REMOVED = "6k1/5ppp/8/8/8/8/5P1P/6K1 w - - 0 1";
const G_PAWN_ON_G6 = "6k1/5ppp/6P1/8/8/8/5P1P/6K1 w - - 0 1";

/** `A3`: no white f-pawn (half-open f, black f7); f-pawn on f5 (closed); the same pawn on e5. */
const F_HALF_OPEN = "6k1/5ppp/8/8/8/8/6PP/6K1 w - - 0 1";
const F_CLOSED_F5 = "6k1/5ppp/8/5P2/8/8/6PP/6K1 w - - 0 1";
const F_HALF_OPEN_E5 = "6k1/5ppp/8/4P3/8/8/6PP/6K1 w - - 0 1";

/**
 * `A4`: equal material, a mirror-symmetric king and pawn structure, and both rooks on squares
 * their table scores 0 — white's rook on an open d4, black's walled in on h8 by its own king and
 * h7. Every term but mobility cancels.
 */
const MOBILE_WHITE = "6kr/6pp/8/8/3R4/8/6PP/6K1 w - - 0 1";
/** `A4`'s bound: four free queens against a bare king — an unclamped count reads far above 100. */
const QUEEN_RIG = "7k/8/1Q4Q1/8/8/1Q4Q1/8/K7 w - - 0 1";

/** ≥ 15 new positions for `A1`: exposed and sheltered kings, both wings, edges, both colours to move. */
const KING_POSITIONS: readonly string[] = [
  SHELTERED,
  G2_REMOVED,
  G_PAWN_ON_G6,
  F_HALF_OPEN,
  F_CLOSED_F5,
  F_HALF_OPEN_E5,
  MOBILE_WHITE,
  QUEEN_RIG,
  "2kr4/ppp5/8/8/8/8/PPP5/2KR4 w - - 0 1",
  "2kr4/p1p5/1p6/8/8/8/PP6/2KR4 b - - 0 1",
  "k7/pp6/8/8/8/8/6PP/7K w - - 0 1",
  "7k/6pp/8/8/8/8/6PP/7K b - - 0 1",
  "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
  "4k3/pppppppp/8/8/8/8/8/4K3 w - - 0 1",
  "6k1/5ppp/8/8/8/6K1/5PPP/8 b - - 0 1",
  "6k1/8/5ppp/8/8/5PPP/8/6K1 w - - 0 1",
  "r5k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1",
  "6k1/5ppp/8/8/4N3/8/5PPP/n5K1 b - - 0 1",
  "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
  "r1bq1rk1/pp3ppp/2n5/3p4/3P4/2N5/PP3PPP/R1BQ1RK1 w - - 0 1",
];

/** This ticket's mirror corpus: ABC-076's 184, then the king positions above. */
function kingCorpus(): { name: string; position: Position }[] {
  return [
    ...buildCorpus(),
    ...KING_POSITIONS.map((fen) => ({ name: fen, position: parseFen(fen) })),
  ];
}

const score = (fen: string): number => evaluate(parseFen(fen));
const mobilityTerm = (position: Position): number =>
  evaluate(position) - evaluateWithoutMobility(position);

describe("A1 — a position and its colour mirror score exactly equal, over ABC-076's 184 plus the king positions", () => {
  const corpus = kingCorpus();

  it("adds at least 15 new positions covering exposed and sheltered kings", () => {
    expect(corpus.length - 184).toBeGreaterThanOrEqual(15);
  });

  it("scores every mirrored pair exactly equal", () => {
    for (const { name, position } of corpus) {
      expect(evaluate(mirrorPosition(position)), name).toBe(evaluate(position));
    }
  });
});

describe("A2 — a missing shelter pawn scores lower", () => {
  it("g2 removed from f2/g2/h2 scores strictly lower for white (the criterion as written)", () => {
    expect(score(G2_REMOVED)).toBeLessThan(score(SHELTERED));
  });

  it("at EQUAL material too: the g-pawn on g6 instead of g2 scores strictly lower", () => {
    // The row above is won by material alone. Here the tables and the pawn terms score g6 and
    // g2 the same, so only the shelter can put g6 lower (red without the term).
    expect(score(G_PAWN_ON_G6)).toBeLessThan(score(SHELTERED));
  });
});

describe("A3 — a half-open file next to the king scores lower", () => {
  it("no f-pawn (black f7 remains) scores strictly lower than f2 for white (the criterion as written)", () => {
    expect(score(F_HALF_OPEN)).toBeLessThan(score(SHELTERED));
  });

  it("at EQUAL material, shelter equal: the f-pawn on e5 (f half-open) scores lower than on f5", () => {
    // Neither square shelters the king, so only the file differs. The tables favour e5 by 15
    // and the isolated term costs it 10, so without the term e5 scores 5 HIGHER.
    expect(score(F_HALF_OPEN_E5)).toBeLessThan(score(F_CLOSED_F5));
  });
});

describe("A4 — mobility: more moves score higher, and the term is bounded by ±100 cp", () => {
  it("white, with substantially more moves at equal material, scores strictly higher", () => {
    const position = parseFen(MOBILE_WHITE);
    const blackToMove = parseFen(MOBILE_WHITE.replace(" w ", " b "));
    // The premise, measured: white has many more legal moves, and every other term cancels.
    expect(legalMoves(position).length).toBeGreaterThanOrEqual(legalMoves(blackToMove).length + 10);
    expect(evaluateWithoutMobility(position)).toBe(0);
    expect(evaluate(position)).toBeGreaterThan(0);
    // Side to move's point of view: the same board with black to move scores below 0.
    expect(evaluate(blackToMove)).toBeLessThan(0);
  });

  it("never exceeds ±100 cp — on the four-queen rig and over the whole corpus, both colours to move", () => {
    const rig = parseFen(QUEEN_RIG);
    expect(mobilityTerm(rig)).toBeGreaterThan(0);
    expect(mobilityTerm(rig)).toBeLessThanOrEqual(100);
    for (const { name, position } of kingCorpus()) {
      expect(Math.abs(mobilityTerm(position)), name).toBeLessThanOrEqual(100);
    }
  });
});

describe("A6 — purity: evaluation leaves the position byte-identical", () => {
  it("over ABC-076's corpus, the perft roots and the king positions, twice, with the same score", () => {
    const positions = [
      ...kingCorpus().map(({ position }) => position),
      ...PERFT_POSITIONS.map(({ fen }) => parseFen(fen)),
    ];
    for (const position of positions) {
      const before = clonePosition(position);
      const first = evaluate(position);
      expect(evaluate(position)).toBe(first);
      expect(evaluateWithoutMobility(position)).toBe(evaluateWithoutMobility(position));
      expect(position).toEqual(before);
    }
  });
});

/**
 * ABC-207 — per-piece mobility weights and the early-queen term. Relations, never totals.
 *
 * `A1`'s pairs: the piece on d4, kings on a8 and h1 (off every d4 line), and ONE white pawn that
 * either blocks the last square of one of the piece's lines or stands just off it. No other piece's
 * reach changes, so the mobility term of the pair differs by exactly one square of that piece.
 */
const A1_PAIRS: Record<string, { open: string; blocked: string }> = {
  queen: { open: "k7/8/8/8/3Q4/7P/8/7K w - - 0 1", blocked: "k7/8/8/8/3Q3P/8/8/7K w - - 0 1" },
  rook: { open: "k7/8/8/8/3R4/7P/8/7K w - - 0 1", blocked: "k7/8/8/8/3R3P/8/8/7K w - - 0 1" },
  bishop: { open: "k7/8/P7/8/3B4/8/8/7K w - - 0 1", blocked: "k7/P7/8/8/3B4/8/8/7K w - - 0 1" },
  knight: { open: "k7/4P3/8/8/3N4/8/8/7K w - - 0 1", blocked: "k7/8/4P3/8/3N4/8/8/7K w - - 0 1" },
};

/**
 * `A2`'s three Qa4 / Qd1 pairs. Black's queen is home in the first two. a4 and d1 are both
 * edge squares of `QUEEN_TABLE`, and the row below subtracts the table's own difference anyway.
 */
const A2_MINORS_HOME = {
  out: "rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3",
  home: "rnbqkbnr/pppp1ppp/8/4p3/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 3",
};
const A2_MINORS_DEVELOPED = {
  out: "rnbqkbnr/pppp1ppp/8/4p3/Q1B1P3/2NPBN2/PPP2PPP/R3K2R w KQkq - 0 6",
  home: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/2NPBN2/PPP2PPP/R2QK2R w KQkq - 0 6",
};
const A2_NO_MINORS = {
  out: "5k2/4q3/8/8/Q7/8/4P3/4K3 w - - 0 1",
  home: "5k2/4q3/8/8/8/8/4P3/3QK3 w - - 0 1",
};

/**
 * White's mobility is clamped at +100 while its queen is off home with both knights home: the
 * early-queen term must stay OUTSIDE the clamp, so the mobility read here is exactly the cap.
 */
const CLAMPED_EARLY_QUEEN = "k7/pp6/8/8/2B1B3/3Q4/8/RN2K1NR w - - 0 1";

/**
 * `A3`'s new mirror positions: the pairs above, plus early queens of both colours, both colours
 * to move, a queen off home with fewer than two minors home, and a second (promoted) queen.
 */
const ABC207_POSITIONS: readonly string[] = [
  ...Object.values(A1_PAIRS).flatMap(({ open, blocked }) => [open, blocked]),
  ...[A2_MINORS_HOME, A2_MINORS_DEVELOPED, A2_NO_MINORS].flatMap(({ out, home }) => [out, home]),
  "rnb1kbnr/pppp1ppp/8/4p2q/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3",
  "rnb1kbnr/pppp1ppp/8/4p3/4P2q/5Q2/PPPP1PPP/RNB1KBNR b KQkq - 2 3",
  "r1b1kbnr/pppp1ppp/2n5/4p1q1/4P3/2N2Q2/PPPP1PPP/R1B1KBNR w KQkq - 4 4",
  "rnb1kb1r/pppp1ppp/5n2/4p2q/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 4",
  "r1b1k1nr/pppp1ppp/2n5/2b1p2q/2B1P3/2N2N2/PPPPQPPP/R1B1K2R w KQkq - 6 5",
  "rnbqkbnr/ppp1pppp/8/3Q4/8/8/PPPP1PPP/RNB1KBNR b KQkq - 0 3",
  "rnbqkbQr/ppppp2p/8/8/8/8/PPPPPP1P/RNBQKBNR b KQq - 0 5",
  CLAMPED_EARLY_QUEEN,
];

const earlyQueenTerm = (pair: { out: string; home: string }): number => {
  // The early-queen term alone: everything else in `evaluateWithoutMobility` is the same in the
  // pair but the queen's square, and that square's table cells are taken back out here.
  const cell = (square: number): number =>
    VALUE_TABLES_FOR_TEST.QUEEN_TABLE[(7 - (square >> 4)) * 8 + (square & 7)] as number;
  const out = parseFen(pair.out);
  const queenSquare = out.board.indexOf(QUEEN);
  const table = cell(queenSquare) - cell(0x03);
  return evaluateWithoutMobility(out) - evaluateWithoutMobility(parseFen(pair.home)) - table;
};

describe("ABC-207 A1 — one more reachable square is worth strictly less to a queen than to N, B or R", () => {
  const step = (piece: keyof typeof A1_PAIRS): number => {
    const { open, blocked } = A1_PAIRS[piece] as { open: string; blocked: string };
    const openTerm = mobilityTerm(parseFen(open));
    const blockedTerm = mobilityTerm(parseFen(blocked));
    // The clamp is out of play on both sides of every pair, so the step reads the weight.
    expect(Math.abs(openTerm), open).toBeLessThan(100);
    expect(Math.abs(blockedTerm), blocked).toBeLessThan(100);
    return openTerm - blockedTerm;
  };

  it("each extra square counts for every piece, and least for the queen", () => {
    const queen = step("queen");
    expect(queen).toBeGreaterThan(0);
    expect(queen).toBeLessThan(step("knight"));
    expect(queen).toBeLessThan(step("bishop"));
    expect(queen).toBeLessThan(step("rook"));
  });
});

describe("ABC-207 A2 — a queen out before the minor pieces costs a little", () => {
  it("Qa4 with both knights and both bishops home scores strictly lower than Qd1 (the criterion)", () => {
    expect(score(A2_MINORS_HOME.out)).toBeLessThan(score(A2_MINORS_HOME.home));
    // And the term itself, mobility taken out, is a charge.
    expect(earlyQueenTerm(A2_MINORS_HOME)).toBeLessThan(0);
  });

  it("with all four white minors developed, the term contributes 0", () => {
    expect(earlyQueenTerm(A2_MINORS_DEVELOPED)).toBe(0);
  });

  it("in an endgame with no minor pieces, the term contributes 0", () => {
    expect(earlyQueenTerm(A2_NO_MINORS)).toBe(0);
  });
});

describe("ABC-207 A3 — the mirror and the ±100 cp mobility bound hold on new positions", () => {
  it("adds at least 10 new positions", () => {
    expect(ABC207_POSITIONS.length).toBeGreaterThanOrEqual(10);
  });

  it("scores every mirrored pair exactly equal, and keeps the mobility term within ±100 cp", () => {
    for (const fen of ABC207_POSITIONS) {
      const position = parseFen(fen);
      expect(evaluate(mirrorPosition(position)), fen).toBe(evaluate(position));
      expect(Math.abs(mobilityTerm(position)), fen).toBeLessThanOrEqual(100);
    }
  });

  it("the early-queen term sits outside the clamp: a clamped board reads exactly the cap", () => {
    expect(mobilityTerm(parseFen(CLAMPED_EARLY_QUEEN))).toBe(100);
  });
});
