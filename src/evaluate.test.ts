/**
 * ABC-076 — acceptance for the static evaluation (material + piece-square tables).
 *
 * A1 is the whole suite in one property, and its corpus is DERIVED, not hand-picked: the six
 * standard perft positions (`src/perft.test.ts`'s PERFT_SUITE) plus every position exactly one
 * legal ply from each. The ticket's own arithmetic — that file's depth-1 counts,
 * 20+48+14+6+44+46 = 178 — makes the corpus 6 + 178 = 184, and the expansion asserts that 178
 * before anything else runs. If it ever reads otherwise, the expansion is wrong, not the number;
 * the count is a free correctness check on the corpus itself, borrowed from a generator whose
 * exactness `src/perft.test.ts` already proves.
 *
 * The corpus and the mirror helper live in `src/evaluate.mirror-corpus.ts`, a plain test-only
 * module, and this suite imports them from there. ABC-082 (pawn structure) lifted them out of this
 * file so its own suite EXTENDS this corpus instead of forking it (ABC-082 `A7` makes a fork red),
 * and ABC-083 (king safety and mobility) is meant to do the same.
 *
 * NO wall-clock assertion lives here. A6 is a REPORTED figure with its machine and Node version,
 * following this suite's standing rule (see `src/zobrist.nfr.test.ts`): a timing assertion passes
 * or fails on the machine that runs it.
 */

import { describe, expect, it } from "vitest";
import {
  buildCorpus,
  clonePosition,
  mirrorPosition,
  PERFT_POSITIONS,
  START_FEN,
} from "./evaluate.mirror-corpus.ts";
import { evaluate, VALUE_TABLES_FOR_TEST } from "./evaluate.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import {
  BISHOP,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  KING,
  KNIGHT,
  NO_SQUARE,
  PAWN,
  type Position,
  QUEEN,
  ROOK,
  squareAt,
} from "./position.ts";

describe("ABC-076 A1 — the corpus is derived and counts out to 184", () => {
  it.each(PERFT_POSITIONS)("expands $name to exactly $depth1 legal children", (entry) => {
    // The free correctness check: these are `src/perft.test.ts`'s own depth-1 perft counts.
    expect(legalMoves(parseFen(entry.fen))).toHaveLength(entry.depth1);
  });

  it("holds 6 roots + 178 children = 184 positions", () => {
    expect(PERFT_POSITIONS.reduce((sum, entry) => sum + entry.depth1, 0)).toBe(178);
    expect(buildCorpus()).toHaveLength(184);
  });

  // ADDED AT QE (task quality-gate-ABC-076-qe-2026-08-17). The two assertions above count the
  // corpus; nothing checked WHICH 184 positions are in it. Measured, not argued: a buildCorpus
  // that pushed `clonePosition(parseFen(START_FEN))` in both places — 184 copies of the start
  // position — passed all 20 tests in this file, because a count is not a content check and A1's
  // symmetry holds for any position whatsoever. This closes that: the corpus is 184 DISTINCT
  // positions, grouped 1 root + depth1 children per entry, in PERFT_POSITIONS order.
  it("holds the RIGHT 184 — distinct positions, grouped per root", () => {
    const corpus = buildCorpus();

    const key = ({ position }: { position: Position }): string =>
      `${Array.from(position.board).join(",")}|${position.blackToMove}|${position.castling}|${position.epSquare}`;
    expect(new Set(corpus.map(key)).size).toBe(184);

    let offset = 0;
    for (const entry of PERFT_POSITIONS) {
      expect(corpus[offset]?.name, entry.name).toBe(entry.name);
      const children = corpus.slice(offset + 1, offset + 1 + entry.depth1);
      expect(children, entry.name).toHaveLength(entry.depth1);
      for (const child of children)
        expect(child.name.startsWith(`${entry.name} child `)).toBe(true);
      offset += 1 + entry.depth1;
    }
    expect(offset).toBe(184);
  });
});

describe("ABC-076 A1 — mirror helper", () => {
  it("swaps castling rights side for side", () => {
    // Only white may castle here, and only kingside; the twin must be able to castle only
    // BLACK kingside. A helper that copied the field would pass every symmetry assertion in
    // this file today and be wrong for ABC-082 and ABC-083.
    const position = parseFen("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w K - 0 1");
    expect(position.castling).toBe(CASTLE_WK);
    expect(mirrorPosition(position).castling).toBe(CASTLE_BK);

    const both = parseFen("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1");
    expect(mirrorPosition(both).castling).toBe(CASTLE_WK | CASTLE_WQ | CASTLE_BK | CASTLE_BQ);
  });

  it("mirrors the en-passant square, and leaves NO_SQUARE alone", () => {
    const afterDoublePush = parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    // e3 is rank 3, so its rank-flipped partner is e6.
    expect(mirrorPosition(afterDoublePush).epSquare).toBe(squareAt(4, 5));
    expect(mirrorPosition(parseFen(START_FEN)).epSquare).toBe(NO_SQUARE);
  });

  it("is its own inverse and flips the side to move", () => {
    const position = parseFen(PERFT_POSITIONS[1]?.fen as string);
    const twin = mirrorPosition(position);
    expect(twin.blackToMove).toBe(!position.blackToMove);

    const back = mirrorPosition(twin);
    expect(Array.from(back.board)).toEqual(Array.from(position.board));
    expect(back.castling).toBe(position.castling);
    expect(back.blackToMove).toBe(position.blackToMove);
  });
});

describe("ABC-076 A1 — a position and its colour-mirrored twin score exactly equal", () => {
  // One hard-coded sign error, or ONE wrong entry in one mirrored table, fails this.
  const corpus = buildCorpus();

  it("scores all 184 mirrored pairs equal", () => {
    expect(corpus).toHaveLength(184);
    for (const { name, position } of corpus) {
      expect(evaluate(mirrorPosition(position)), name).toBe(evaluate(position));
    }
  });
});

describe("ABC-076 A2 — the start position is balanced", () => {
  it("scores exactly 0", () => {
    expect(evaluate(parseFen(START_FEN))).toBe(0);
  });
});

describe("ABC-076 A3 — material dominates, and by the stated amounts", () => {
  it("scores startpos-minus-a-black-knight between +250 and +400 for white", () => {
    // The window is the criterion: below it the tables have swamped a minor piece, above it a
    // knight has been priced as more than a knight. Deliberately NOT an exact total — the
    // values are hand-tuned and will move.
    const score = evaluate(parseFen("r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
    expect(score).toBeGreaterThanOrEqual(250);
    expect(score).toBeLessThanOrEqual(400);
  });
});

describe("ABC-076 A4 — the tables actually do something", () => {
  it("prefers a white knight on e4 to the same knight on b1", () => {
    const atHome = evaluate(parseFen("4k3/8/8/8/8/8/8/1N2K3 w - - 0 1"));
    const centralised = evaluate(parseFen("4k3/8/8/8/4N3/8/8/4K3 w - - 0 1"));
    expect(centralised).toBeGreaterThan(atHome);
  });
});

describe("ABC-076 A5 — purity", () => {
  // Not paranoia: `zobristKey` (src/zobrist.ts) transiently mutates the position it reads, and
  // that trap is on record for this codebase. This asserts the evaluator does not join it.
  it.each(PERFT_POSITIONS)("leaves $name byte-identical and returns the same score", (entry) => {
    const position = parseFen(entry.fen);
    const before = clonePosition(position);

    const first = evaluate(position);
    const second = evaluate(position);

    expect(second).toBe(first);
    expect(Array.from(position.board)).toEqual(Array.from(before.board));
    expect(position.blackToMove).toBe(before.blackToMove);
    expect(position.castling).toBe(before.castling);
    expect(position.epSquare).toBe(before.epSquare);
    expect(position.halfmoveClock).toBe(before.halfmoveClock);
    expect(position.fullmoveNumber).toBe(before.fullmoveNumber);
  });
});

/**
 * ABC-215 A2 — every value array is made by the rule in its comment.
 *
 * Each rule is implemented here a second time, independently: knight steps and diagonal squares
 * are COUNTED on an empty 8x8 grid, not copied from the comment's ranges. The rebuild is compared
 * with the array over all 64 entries (every `pieceType` index for `PIECE_VALUE`). One cell moved
 * by 1 in any table reddens its row.
 *
 * Table index `i` is rank-8-first, as the file lays the tables out: `i = 0` is a8, `i = 63` is h1.
 * `R` is the rank from WHITE's side (1 … 8), `e` the file's steps from the edge (a/h 0 … d/e 3),
 * `ring` the square's steps from the board's edge (0 … 3).
 */
describe("ABC-215 A2 — the value arrays are rebuilt from their stated rules", () => {
  const R = (i: number): number => 8 - Math.floor(i / 8);
  const col = (i: number): number => i % 8;
  const e = (i: number): number => Math.min(col(i), 7 - col(i));
  const ring = (i: number): number => Math.min(e(i), Math.min(R(i) - 1, 8 - R(i)));
  const onBoard = (f: number, r: number): boolean => f >= 0 && f < 8 && r >= 1 && r <= 8;
  // `+ 0` turns a rule's `-0` (the king's home squares: `-10 × 0 - 10 × 0`) into the literal's `0`.
  const byRule = (rule: (i: number) => number): number[] =>
    Array.from({ length: 64 }, (_, i) => rule(i) + 0);

  const knightMoves = (i: number): number => {
    const steps = [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ] as const;
    return steps.filter(([df, dr]) => onBoard(col(i) + df, R(i) + dr)).length;
  };
  const diagonalSquares = (i: number): number => {
    let n = 0;
    for (const [df, dr] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ] as const) {
      for (let k = 1; onBoard(col(i) + k * df, R(i) + k * dr); k++) n++;
    }
    return n;
  };

  const classicalPawns: Record<number, number> = {
    [EMPTY]: 0,
    [PAWN]: 1,
    [KNIGHT]: 3,
    [BISHOP]: 3,
    [ROOK]: 5,
    [QUEEN]: 9,
    [KING]: 0,
  };
  const rebuilt = {
    PIECE_VALUE: [EMPTY, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING].map(
      (type) =>
        100 * (classicalPawns[type] as number) + (type === KNIGHT || type === BISHOP ? 25 : 0),
    ),
    PAWN_TABLE: byRule((i) => (R(i) === 1 || R(i) === 8 ? 0 : 2 * e(i) * (R(i) - 2))),
    KNIGHT_TABLE: byRule((i) => 10 * knightMoves(i) - 50),
    BISHOP_TABLE: byRule((i) => 5 * (diagonalSquares(i) - 9)),
    ROOK_TABLE: byRule((i) => (R(i) === 7 ? 20 : 0)),
    QUEEN_TABLE: byRule((i) => 5 * ring(i) - 5),
    KING_TABLE: byRule((i) => {
      const d = Math.min(Math.abs(col(i) - 1), Math.abs(col(i) - 6));
      return Math.max(-50, -10 * d - 10 * (R(i) - 1));
    }),
  };

  // The values at this ticket's base (`ec9331e2`), kept only to show each array moved.
  // biome-ignore format: an 8x8 board is only readable as 8 rows of 8
  const BASE: Record<string, readonly number[]> = {
    PIECE_VALUE: [0, 100, 320, 330, 500, 900, 0],
    PAWN_TABLE: [
        0,  0,  0,  0,  0,  0,  0,  0,
       50, 50, 50, 50, 50, 50, 50, 50,
       10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0,
    ],
    KNIGHT_TABLE: [
      -50,-40,-30,-30,-30,-30,-40,-50,
      -40,-20,  0,  0,  0,  0,-20,-40,
      -30,  0, 10, 15, 15, 10,  0,-30,
      -30,  5, 15, 20, 20, 15,  5,-30,
      -30,  0, 15, 20, 20, 15,  0,-30,
      -30,  5, 10, 15, 15, 10,  5,-30,
      -40,-20,  0,  5,  5,  0,-20,-40,
      -50,-40,-30,-30,-30,-30,-40,-50,
    ],
    BISHOP_TABLE: [
      -20,-10,-10,-10,-10,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0,  5, 10, 10,  5,  0,-10,
      -10,  5,  5, 10, 10,  5,  5,-10,
      -10,  0, 10, 10, 10, 10,  0,-10,
      -10, 10, 10, 10, 10, 10, 10,-10,
      -10,  5,  0,  0,  0,  0,  5,-10,
      -20,-10,-10,-10,-10,-10,-10,-20,
    ],
    ROOK_TABLE: [
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
       -5,  0,  0,  0,  0,  0,  0, -5,
       -5,  0,  0,  0,  0,  0,  0, -5,
       -5,  0,  0,  0,  0,  0,  0, -5,
       -5,  0,  0,  0,  0,  0,  0, -5,
       -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0,
    ],
    QUEEN_TABLE: [
      -20,-10,-10, -5, -5,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0,  5,  5,  5,  5,  0,-10,
       -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
      -10,  5,  5,  5,  5,  5,  0,-10,
      -10,  0,  5,  0,  0,  0,  0,-10,
      -20,-10,-10, -5, -5,-10,-10,-20,
    ],
    KING_TABLE: [
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20,
      -10,-20,-20,-20,-20,-20,-20,-10,
       20, 20,  0,  0,  0,  0, 20, 20,
       20, 30, 10,  0,  0, 10, 30, 20,
    ],
  };

  const NAMES = [
    "PIECE_VALUE",
    "PAWN_TABLE",
    "KNIGHT_TABLE",
    "BISHOP_TABLE",
    "ROOK_TABLE",
    "QUEEN_TABLE",
    "KING_TABLE",
  ] as const;

  it("names exactly the seven arrays the carve-out named", () => {
    expect(Object.keys(VALUE_TABLES_FOR_TEST).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)("%s equals its rule over every entry", (name) => {
    const actual = Array.from(VALUE_TABLES_FOR_TEST[name]);
    expect(actual).toHaveLength(name === "PIECE_VALUE" ? 7 : 64);
    expect(actual).toEqual(rebuilt[name]);
  });

  it.each(NAMES)("%s differs from the base values in at least one entry", (name) => {
    const actual = VALUE_TABLES_FOR_TEST[name];
    const base = BASE[name] as readonly number[];
    expect(base).toHaveLength(actual.length);
    expect(actual.some((value, i) => value !== base[i])).toBe(true);
  });
});
