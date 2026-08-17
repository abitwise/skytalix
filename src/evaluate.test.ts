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
 * `mirrorPosition` and `buildCorpus` are NOT exported, and that is a constraint rather than a
 * choice. ABC-082 (pawn structure) and ABC-083 (king safety and mobility) are both written to
 * EXTEND this corpus rather than fork it, so the helper is meant to outlive this ticket — but
 * Biome's `lint/suspicious/noExportsInTest` forbids exporting from a `*.test.ts` file, and
 * ABC-076's own security firing threshold forbids a third file ("the diff touches any file
 * outside the new evaluation module and its test file"). The two rules leave no in-scope way to
 * share it. WHOEVER TAKES ABC-082: lift these two functions and `clonePosition` into a plain
 * helper module (e.g. `src/eval-corpus.ts`) and import them from both suites — do not retype
 * them, and do not let the corpus fork, which is the thing the ticket's test note 1 exists to
 * prevent.
 *
 * NO wall-clock assertion lives here. A6 is a REPORTED figure with its machine and Node version,
 * following this suite's standing rule (see `src/zobrist.nfr.test.ts`): a timing assertion passes
 * or fails on the machine that runs it.
 */

import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import {
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  fileOf,
  NO_SQUARE,
  type Position,
  rankOf,
  squareAt,
} from "./position.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * The six PERFT_SUITE positions, transcribed with their depth-1 counts. The counts are here so
 * the one-ply expansion can be checked position by position, not only in total — a wrong total
 * that happens to sum correctly is not a thing this lets through.
 */
const PERFT_POSITIONS: ReadonlyArray<{ name: string; fen: string; depth1: number }> = [
  { name: "startpos", fen: START_FEN, depth1: 20 },
  {
    name: "kiwipete",
    fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    depth1: 48,
  },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", depth1: 14 },
  {
    name: "position-4",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    depth1: 6,
  },
  {
    name: "position-5",
    fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
    depth1: 44,
  },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
    depth1: 46,
  },
];

/** A detached copy — `makeMove` works in place, so a corpus entry must not alias the position. */
function clonePosition(position: Position): Position {
  return {
    board: Uint8Array.from(position.board),
    blackToMove: position.blackToMove,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/** The rank-flipped partner of a 0x88 square: a1 <-> a8, e4 <-> e5. Files never move. */
const mirrorSquare = (square: number): number => squareAt(fileOf(square), 7 - rankOf(square));

/**
 * The colour-mirrored twin of a position: every piece moved to its rank-flipped square with its
 * colour flipped, the side to move flipped, castling rights swapped side for side, and the
 * en-passant square rank-flipped.
 *
 * The last two are not decoration. The corpus includes one-ply children, so it contains double
 * pawn pushes (which set `epSquare`) and king and rook moves (which clear castling rights); a
 * twin that dropped either would be mirroring a DIFFERENT position and A1 would be asserting
 * something weaker than it says. Today's evaluation reads neither field — that is exactly why
 * the helper must carry them now, while nothing depends on it, for ABC-082 and ABC-083.
 *
 * `halfmoveClock` and `fullmoveNumber` are copied unchanged: they have no colour and no rank.
 */
function mirrorPosition(position: Position): Position {
  const board = new Uint8Array(128);
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = squareAt(file, rank);
      const piece = position.board[square] as number;
      if (piece !== EMPTY) board[mirrorSquare(square)] = piece ^ BLACK;
    }
  }

  const castling = position.castling;
  const mirroredCastling =
    ((castling & CASTLE_WK) !== 0 ? CASTLE_BK : 0) |
    ((castling & CASTLE_WQ) !== 0 ? CASTLE_BQ : 0) |
    ((castling & CASTLE_BK) !== 0 ? CASTLE_WK : 0) |
    ((castling & CASTLE_BQ) !== 0 ? CASTLE_WQ : 0);

  return {
    board,
    blackToMove: !position.blackToMove,
    castling: mirroredCastling,
    epSquare: position.epSquare === NO_SQUARE ? NO_SQUARE : mirrorSquare(position.epSquare),
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/**
 * The six perft positions plus every position one legal ply from each — 184 in all. Built with
 * the merged generator and make/unmake, so nothing new has to be trusted, and deterministic, so
 * the number is stable rather than a sampling target.
 */
function buildCorpus(): { name: string; position: Position }[] {
  const corpus: { name: string; position: Position }[] = [];

  for (const entry of PERFT_POSITIONS) {
    const root = parseFen(entry.fen);
    corpus.push({ name: entry.name, position: clonePosition(root) });

    let childIndex = 0;
    for (const move of legalMoves(root)) {
      const undo = makeMove(root, move);
      corpus.push({ name: `${entry.name} child ${childIndex++}`, position: clonePosition(root) });
      unmakeMove(root, move, undo);
    }
  }

  return corpus;
}

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
