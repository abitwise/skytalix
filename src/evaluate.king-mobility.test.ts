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
import { evaluate, evaluateWithoutMobility } from "./evaluate.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Position } from "./position.ts";

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
