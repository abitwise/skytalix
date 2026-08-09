/**
 * ABC-009 — QE hardening rows for the two castling board preconditions.
 *
 * `src/moves.castling.test.ts` is the acceptance file: it pins `A1`-`A7` exactly as the
 * ticket words them. This file adds the rows a mutation campaign proved the acceptance net
 * cannot see. Every row here PASSES on the delivered fix — no production line changed —
 * and each was written because a build that fails it passes all twelve criteria, all 337
 * delivered tests AND the `PERFT_DEEP=1` lane at 32/32.
 *
 * Two dimensions the twelve acceptance rows hold constant, which is why they are blind:
 *
 * 1. THE PIECE TYPE OF THE IMPOSTOR. `A5` and `A6` use a bishop and a knight, satisfying
 *    `## Test notes` 3's "at least two piece types" literally. A guard that admits one
 *    further type therefore survives: reading the home square as "the mover's KING or
 *    QUEEN" passes every criterion while offering a castle on a queen, and one `legalMoves`
 *    call then DESTROYS that queen and writes a king over it — the ticket's own family-2
 *    harm, on the most valuable piece on the board.
 *
 * 2. HOW MANY OF A SIDE'S RIGHTS ARE HELD AT ONCE. Every acceptance FEN holds at most one
 *    right per side, except the reproduction FEN where BOTH castles are invalid. So no
 *    criterion ever asks what happens when one of a side's two rights is valid and the
 *    other is not — and nothing distinguishes "this option was rejected" from "the option
 *    loop was abandoned". Turning either guard's `continue` into a `break` (or a `return`)
 *    silently DELETES a legal castle, and no criterion can see it. The king's home square
 *    is shared by both of a side's options, so a `break` there is genuinely equivalent; the
 *    rook's home square is not, which is exactly where the hole is.
 *
 * A third dimension was checked and deliberately NOT given rows, because a row for it would
 * be theatre rather than a criterion. An ENEMY queen on either home square is already
 * refused today by the pre-existing through-check test, for the same reason an enemy rook
 * is: it attacks the squares `option.kingPath` requires unattacked. Measured on the
 * delivered tree — `4k3/8/8/8/8/8/8/K3q2R w K - 0 1` and `4k3/8/8/8/8/8/8/4K2q w K - 0 1`
 * both offer zero castles. The colour dimension of both home squares is masked, so only
 * OWN-colour impostors can pin anything here.
 */

import { describe, expect, it } from "vitest";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, generateMoves, type Move } from "./moves.ts";
import type { Position } from "./position.ts";

/** All 128 board bytes and all five scalars — never `toFen`, which renders 64 of the 128. */
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

function castles(moves: Move[]): Move[] {
  return moves.filter((move) => (move.flags & FLAG_CASTLE) !== 0);
}

const FILES = "abcdefgh";
/** 0x88 square to algebraic, so a failure names the castle instead of a count. */
function squareName(square: number): string {
  return `${FILES[square & 7]}${(square >> 4) + 1}`;
}

function castleNames(moves: Move[]): string[] {
  return castles(moves).map((move) => `${squareName(move.from)}${squareName(move.to)}`);
}

/** No castle from either exported layer, an exact `legalMoves` count, and the position untouched. */
function expectNoCastleAndPure(fen: string, expected: number): void {
  expect(castles(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toHaveLength(0);

  const position = parseFen(fen);
  const before = fullState(position);
  const beforeFen = toFen(position);
  const legal = legalMoves(position);

  expect(castles(legal), `legalMoves: ${fen}`).toHaveLength(0);
  expect(legal, `legalMoves count: ${fen}`).toHaveLength(expected);
  expect(fullState(position), `full state: ${fen}`).toBe(before);
  expect(toFen(position), `toFen: ${fen}`).toBe(beforeFen);
}

/**
 * `A5`'s dimension with a QUEEN as the occupant of the KING's home square. Own colour only
 * — an enemy queen there is masked by the through-check test (see the file header). One
 * `legalMoves` call on a build that admits these destroys the queen, so purity is asserted.
 */
const QUEEN_ON_KING_SQUARE: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/K3Q2R w K - 0 1", 31], // own queen on e1, king on a1, rook home
  ["4k3/8/8/8/8/8/8/R3Q2K w Q - 0 1", 32], // own queen on e1, queenside
  ["k3q2r/8/8/8/8/8/8/4K3 b k - 0 1", 31], // own queen on e8, black to move
  ["r3q2k/8/8/8/8/8/8/4K3 b q - 0 1", 32], // own queen on e8, black queenside
];

/**
 * `A6`'s dimension with a QUEEN as the occupant of the ROOK's home square, king already
 * home. Family 3 leaves the position byte-identical whichever way the guard reads, so the
 * `FLAG_CASTLE` count is the only signal — the same structural reason `A6` carries no
 * purity row.
 */
const QUEEN_ON_ROOK_SQUARE: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/4K2Q w K - 0 1", 21], // own queen on h1
  ["4k3/8/8/8/8/8/8/Q3K3 w Q - 0 1", 22], // own queen on a1
  ["4k2q/8/8/8/8/8/8/4K3 b k - 0 1", 21], // own queen on h8, black to move
  ["q3k3/8/8/8/8/8/8/4K3 b q - 0 1", 22], // own queen on a8, black queenside
];

/**
 * BOTH of a side's rights held, exactly ONE castle valid. The surviving castle is asserted
 * BY NAME, not by count: a count alone cannot tell "the invalid one was rejected" from
 * "the valid one was dropped and something else appeared".
 */
const ONE_OF_TWO_RIGHTS_VALID: ReadonlyArray<
  readonly [fen: string, expected: number, castle: string]
> = [
  ["4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1", 16, "e1c1"], // h1 EMPTY, a1 rook home
  ["4k3/8/8/8/8/8/8/4K2R w KQ - 0 1", 15, "e1g1"], // a1 EMPTY, h1 rook home
  ["4k3/8/8/8/8/8/8/R3K2B w KQ - 0 1", 23, "e1c1"], // h1 holds an own BISHOP, not empty
  ["4k3/8/8/8/8/8/8/B3K2R w KQ - 0 1", 22, "e1g1"], // a1 holds an own BISHOP
  ["r3k3/8/8/8/8/8/8/4K3 b kq - 0 1", 16, "e8c8"], // black, h8 EMPTY
  ["4k2r/8/8/8/8/8/8/4K3 b kq - 0 1", 15, "e8g8"], // black, a8 EMPTY
];

/**
 * The castling right itself, with king and BOTH rooks on their home squares — the one shape
 * where nothing about the board contradicts the castle and only the missing right forbids
 * it. The `PERFT_DEEP=1` lane does catch a build that drops the right test (a king that
 * steps off e1 and back leaves both pieces home with the right cleared), but the default
 * `npm test` does not, and a 40-second opt-in lane is the wrong place for the only guard on
 * the cheapest condition in the function.
 */
const NO_RIGHT_HELD: ReadonlyArray<readonly [fen: string, expected: number]> = [
  ["4k3/8/8/8/8/8/8/R3K2R w - - 0 1", 24],
  ["r3k2r/8/8/8/8/8/8/4K3 b - - 0 1", 24],
];

/** Both rights held and BOTH castles valid — the over-rejection control for the rows above. */
const BOTH_RIGHTS_VALID: ReadonlyArray<
  readonly [fen: string, expected: number, first: string, second: string]
> = [
  ["4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1", 26, "e1g1", "e1c1"],
  ["r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1", 26, "e8g8", "e8c8"],
];

describe("ABC-009 hardening — the impostor's PIECE TYPE (a queen, which A5/A6 never use)", () => {
  it.each(QUEEN_ON_KING_SQUARE)(
    "offers no castle and destroys nothing when an own QUEEN stands on the king's home square: %s",
    (fen, expected) => {
      expectNoCastleAndPure(fen, expected);
    },
  );

  it.each(QUEEN_ON_ROOK_SQUARE)(
    "offers no castle when an own QUEEN stands on the rook's home square: %s",
    (fen, expected) => {
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("refuses an ENEMY queen on either home square too — already masked by the through-check test", () => {
    // Recorded as a measurement, not as a criterion: these pass on `main`'s unfixed tree as
    // well, so they pin nothing about this ticket's fix. They exist so the header's claim
    // that the colour dimension is masked is checked rather than asserted.
    for (const fen of ["4k3/8/8/8/8/8/8/K3q2R w K - 0 1", "4k3/8/8/8/8/8/8/4K2q w K - 0 1"]) {
      expect(castles(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toHaveLength(0);
      expect(castles(legalMoves(parseFen(fen))), `legalMoves: ${fen}`).toHaveLength(0);
    }
  });
});

describe("ABC-009 hardening — BOTH rights held with only ONE castle valid", () => {
  it.each(ONE_OF_TWO_RIGHTS_VALID)(
    "still offers the valid castle and only that one on %s",
    (fen, expected, castle) => {
      const generated = generateMoves(parseFen(fen));
      const position = parseFen(fen);
      const before = fullState(position);
      const legal = legalMoves(position);

      // The valid castle survives, named — this is what a `break` in either guard deletes.
      expect(castleNames(generated), `generateMoves: ${fen}`).toEqual([castle]);
      expect(castleNames(legal), `legalMoves: ${fen}`).toEqual([castle]);
      expect(legal, `legalMoves count: ${fen}`).toHaveLength(expected);
      expect(fullState(position), `full state: ${fen}`).toBe(before);
    },
  );

  it.each(BOTH_RIGHTS_VALID)(
    "offers both castles when both are valid on %s",
    (fen, expected, first, second) => {
      const legal = legalMoves(parseFen(fen));

      expect(castleNames(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toEqual([
        first,
        second,
      ]);
      expect(castleNames(legal), `legalMoves: ${fen}`).toEqual([first, second]);
      expect(legal, `legalMoves count: ${fen}`).toHaveLength(expected);
    },
  );
});

describe("ABC-009 hardening — the castling right, with king and both rooks home", () => {
  it.each(NO_RIGHT_HELD)("offers no castle when no right is held: %s", (fen, expected) => {
    expectNoCastleAndPure(fen, expected);
  });
});
