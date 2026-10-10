/**
 * ABC-009 — the two castling BOARD preconditions.
 *
 * `addCastlingMoves` reads three things: the castling right, the squares between king
 * and rook, and whether the king's path is attacked. It never read the two squares the
 * castle is actually about — the king's home square and the rook's home square. With a
 * right asserted on a board that contradicts it, `generateMoves` offers a `FLAG_CASTLE`
 * move the rules forbid, and `legalMoves` (which plays every move and takes it back)
 * writes a king onto a square that never held one, because `unmakeMove` restores
 * `move.piece` to `move.from` unconditionally.
 *
 * The two preconditions are IDENTITY tests, not occupancy tests: the mover's own KING
 * byte on the king's home square, the mover's own ROOK byte on the rook's home square.
 * Occupancy is not enough, and that was measured rather than assumed at refinement — a
 * build testing both squares for `!== EMPTY` passes A1-A4 and still leaks families 2
 * and 3 below.
 *
 * Every row asserts BOTH exported layers — `generateMoves` and `legalMoves` — because
 * `## Scope` names both and the requirement should not rest on today's caller list.
 * Purity is asserted over the FULL position state (all 128 board bytes and all five
 * scalars), never through `toFen`, which renders 64 of the 128 bytes and no counter.
 * Family 3 leaves the position byte-identical, so no purity assertion can ever see it
 * and only the `FLAG_CASTLE` count can — which is why the count is on every row.
 *
 * This file is new rather than appended to `moves.test.ts` so that no existing test
 * file changes by a single line (`A8`).
 */

import { describe, expect, it } from "vitest";
import { parseFenGrammarOnly as parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, generateMoves, type Move } from "./moves.ts";
import type { Position } from "./position.ts";

/**
 * The FULL state of a Position: all 128 board bytes — the off-board ones included — and
 * every scalar. A local copy of the shape `legal.test.ts` uses for the same job, kept
 * local for the same reason its `kingSquare` is: a test should not lean on another
 * test file's internals.
 */
function fullState(position: Position): string {
  return [
    position.board.join(","),
    position.blackToMove,
    position.castling,
    position.epSquare,
    position.halfmoveClock,
    position.fullmoveNumber,
  ].join("|");
}

/** How many of `moves` carry FLAG_CASTLE. */
function castleCount(moves: Move[]): number {
  return moves.filter((move) => (move.flags & FLAG_CASTLE) !== 0).length;
}

/**
 * Asserts that neither exported layer offers a castle on `fen`, and that `legalMoves`
 * returns exactly `expected` moves. The generator is asked on its own freshly parsed
 * position so a mutation in one layer cannot be masked by the other's side effects.
 */
function expectNoCastleOffered(fen: string, expected: number): void {
  expect(castleCount(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toBe(0);

  const legal = legalMoves(parseFen(fen));
  expect(castleCount(legal), `legalMoves: ${fen}`).toBe(0);
  expect(legal, `legalMoves count: ${fen}`).toHaveLength(expected);
}

/** Asserts one `legalMoves` call leaves all 128 bytes and all five scalars untouched. */
function expectPure(fen: string): void {
  const position = parseFen(fen);
  const before = fullState(position);
  const beforeFen = toFen(position);

  legalMoves(position);

  expect(toFen(position), `toFen: ${fen}`).toBe(beforeFen);
  expect(fullState(position), `full state: ${fen}`).toBe(before);
}

const REPRODUCTION_FEN = "4k3/8/8/8/8/8/8/K7 w KQ - 0 1";

/**
 * `A4` family 1 — the king is OFF its home square with the MATCHING ROOK PRESENT.
 * Both colours and both sides, because the defect reproduces on all four.
 */
const KING_OFF_HOME: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/K6R w K - 0 1", 16],
  ["4k3/8/8/8/8/8/8/R6K w Q - 0 1", 16],
  ["k6r/8/8/8/8/8/8/4K3 b k - 0 1", 16],
  ["r6k/8/8/8/8/8/8/4K3 b q - 0 1", 16],
];

/**
 * `A5` family 2 — the king's home square is OCCUPIED BY SOMETHING THAT IS NOT THE
 * MOVER'S KING. These are presence rows: an absence row cannot tell an identity test
 * from an occupancy test. Two piece types, both occupant colours, both colours to move.
 * Today one `legalMoves` call DESTROYS the occupant and writes a king of the moving
 * side over it — silent material loss plus a piece-type change.
 */
const KING_SQUARE_IMPOSTOR: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/K3B2R w K - 0 1", 19], // own bishop on e1
  ["4k3/8/8/8/8/8/8/R3N2K w Q - 0 1", 17], // own knight on e1, queenside
  ["4k3/8/8/8/8/8/8/K3b2R w K - 0 1", 13], // ENEMY bishop on e1
  ["k3b2r/8/8/8/8/8/8/4K3 b k - 0 1", 19], // own bishop on e8, black to move
];

/**
 * `A6` family 3 — the rook's home square is OCCUPIED BY SOMETHING THAT IS NOT THE
 * MOVER'S ROOK, with the king already home. The make/unmake pair round-trips the
 * impostor exactly, so the position is byte-identical across the call and NO purity
 * assertion can see this family. Only the `FLAG_CASTLE` count can.
 *
 * A wrong-COLOUR rook on the rook's home square is deliberately absent: an enemy rook
 * there attacks the very squares the castle requires to be empty, so the existing
 * through-check test already drops the option. A row for it would be theatre.
 */
const ROOK_SQUARE_IMPOSTOR: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/4K2B w K - 0 1", 12], // own bishop on h1
  ["4k3/8/8/8/8/8/8/N3K3 w Q - 0 1", 7], // own knight on a1, queenside
  ["4k2b/8/8/8/8/8/8/4K3 b k - 0 1", 12], // own bishop on h8, black to move
  ["4k3/8/8/8/8/8/8/4K2b w K - 0 1", 5], // ENEMY bishop on h1
];

/**
 * The four castles that ARE legal, beside the twelve rejection rows so a fix cannot
 * pass by rejecting more than it should. `A8` (the full suite, whose perft lane asserts
 * exact node counts) is the real over-rejection oracle; these are the local check that
 * fails first and points at the right line.
 */
const LEGAL_CASTLES: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/4K2R w K - 0 1", 15],
  ["4k3/8/8/8/8/8/8/R3K3 w Q - 0 1", 16],
  ["4k2r/8/8/8/8/8/8/4K3 b k - 0 1", 15],
  ["r3k3/8/8/8/8/8/8/4K3 b q - 0 1", 16],
];

/** The six standard perft positions — `A7`'s population, the widest spread of LEGAL positions. */
const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

describe("ABC-009 acceptance — A1/A2, the reproduction FEN", () => {
  it("A1 leaves the position untouched and offers no castle", () => {
    const position = parseFen(REPRODUCTION_FEN);
    const before = fullState(position);

    const moves = legalMoves(position);

    expect(toFen(position)).toBe(REPRODUCTION_FEN);
    expect(fullState(position)).toBe(before);
    expect(moves).toHaveLength(3);
    expect(castleCount(moves)).toBe(0);
  });

  it("A2 returns the same count on three successive calls", () => {
    const position = parseFen(REPRODUCTION_FEN);
    const counts = [legalMoves(position), legalMoves(position), legalMoves(position)].map(
      (moves) => moves.length,
    );

    expect(counts).toEqual([3, 3, 3]);
  });
});

describe("ABC-009 acceptance — A3, the rook precondition", () => {
  it("offers no castle when the rook's home square is EMPTY", () => {
    // King home on e1, right K held, no rook on h1. The rook's square is not even a
    // member of `option.empty`, so nothing in the existing three tests looks at it.
    expectNoCastleOffered("4k3/8/8/8/8/8/8/4K3 w K - 0 1", 5);
  });
});

describe("ABC-009 acceptance — A4, the king precondition", () => {
  it.each(KING_OFF_HOME)("offers no castle when the king is off %s", (fen, expected) => {
    expectNoCastleOffered(fen, expected);
  });

  it.each(KING_OFF_HOME)("leaves the position untouched on %s", (fen) => {
    expectPure(fen);
  });
});

describe("ABC-009 acceptance — A5, the king precondition is an IDENTITY test", () => {
  it.each(KING_SQUARE_IMPOSTOR)("offers no castle on %s", (fen, expected) => {
    expectNoCastleOffered(fen, expected);
  });

  it.each(KING_SQUARE_IMPOSTOR)("destroys nothing on %s", (fen) => {
    expectPure(fen);
  });
});

describe("ABC-009 acceptance — A6, the rook precondition is an IDENTITY test", () => {
  it.each(ROOK_SQUARE_IMPOSTOR)("offers no castle on %s", (fen, expected) => {
    expectNoCastleOffered(fen, expected);
  });
});

describe("ABC-009 — the four legal castles still work", () => {
  it.each(LEGAL_CASTLES)("still offers exactly one castle on %s", (fen, expected) => {
    const generated = generateMoves(parseFen(fen));
    const legal = legalMoves(parseFen(fen));

    expect(castleCount(generated), `generateMoves: ${fen}`).toBe(1);
    expect(castleCount(legal), `legalMoves: ${fen}`).toBe(1);
    expect(legal).toHaveLength(expected);
  });
});

describe("ABC-009 acceptance — A7, the perft-table purity walk", () => {
  it.each(PERFT_POSITIONS)(
    "keeps %s byte-identical across two calls and returns the same count",
    (_name, fen) => {
      const position = parseFen(fen);
      const before = fullState(position);
      const beforeFen = toFen(position);

      const first = legalMoves(position);
      expect(fullState(position)).toBe(before);
      expect(toFen(position)).toBe(beforeFen);

      const second = legalMoves(position);
      expect(fullState(position)).toBe(before);
      expect(toFen(position)).toBe(beforeFen);

      expect(second).toHaveLength(first.length);
    },
  );
});
