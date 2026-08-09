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
 * 1. THE PIECE TYPE OF THE IMPOSTOR — `A11`, and it is QUANTIFIED rather than sampled.
 *    `A5` and `A6` use a bishop and a knight, satisfying `## Test notes` 3's original
 *    "at least two piece types" literally. A guard that admits one further type therefore
 *    survives: reading the home square as "the mover's KING or QUEEN" passes every
 *    criterion while offering a castle on a queen, and one `legalMoves` call then DESTROYS
 *    that queen and writes a king over it — the ticket's own family-2 harm, on the most
 *    valuable piece on the board.
 *
 *    THIS FILE'S FIRST VERSION CLOSED THE QUEEN AND CALLED THE DIMENSION CLOSED. IT WAS NOT.
 *    Four rows for one piece type is a third sample, not a quantifier: BA/PM then measured
 *    three further builds of the same shape — the king's square read as "own KING or own
 *    ROOK", as "own KING or own PAWN", and the rook's square as "own ROOK or own PAWN" —
 *    each passing all 33 acceptance rows, all 19 rows of this file's first version, all 356
 *    tests and the deep lane. `## Scope` says "the moving side's KING byte and no other",
 *    which is a claim about EVERY other byte, so the tables below now enumerate every one of
 *    the mover's own piece types the square can hold. A sample of two, of three, or of four
 *    does not satisfy `A11`.
 *
 *    Each type appears in at least TWO (colour to move, castling side) configurations, and
 *    all four configurations appear across each table. That is not symmetry for its own sake:
 *    six of the 62 mutants in this ticket's campaign made a guard conditional on the side or
 *    the castle, so an admission that fires only for white, or only queenside, needs a second
 *    configuration per type to die.
 *
 *    The bishop and knight rows deliberately repeat `A5`/`A6` row 1's and row 2's FENs. The
 *    duplication is the point: `A11`'s enumeration has to be exhaustive WHERE IT IS WRITTEN,
 *    so this table stands as the quantifier on its own rather than depending on which types
 *    another file happens to carry.
 *
 *    Two shapes are excluded from the enumeration on measurement, not on taste. The mover's
 *    own KING on the ROOK's home square is not constructible — with the king also home it
 *    needs two same-colour kings and `parseFen` refuses, and with the king elsewhere the king
 *    guard already refuses. An ENEMY-colour occupant of either square is unreachable, masked
 *    by the pre-existing through-check test (measured below, and on the unfixed tree too).
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
import {
  BISHOP,
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
} from "./position.ts";

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

/**
 * The two home squares and the right byte, keyed on the single castling right each `A11` row
 * holds. e1=4 h1=7 a1=0 e8=116 h8=119 a8=112 in 0x88, the same values `CastleOption` carries.
 */
const CASTLE_SHAPE: Readonly<
  Record<string, { readonly kingFrom: number; readonly rookFrom: number; readonly right: number }>
> = {
  K: { kingFrom: 4, rookFrom: 7, right: CASTLE_WK },
  Q: { kingFrom: 4, rookFrom: 0, right: CASTLE_WQ },
  k: { kingFrom: 116, rookFrom: 119, right: CASTLE_BK },
  q: { kingFrom: 116, rookFrom: 112, right: CASTLE_BQ },
};

/** The piece TYPE each `A11` row's label names. `KING` and `ROOK` are the legal occupants. */
const PIECE_TYPES: Readonly<Record<string, number>> = {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
};

/**
 * The piece-type domain, measured through `parseFen` instead of restated. Every letter the
 * parser accepts on a board is a type the board can hold; a white piece needs a white king
 * elsewhere, and the white KING probe needs the h1 square to BE that king, so it takes two
 * probe boards to cover the alphabet. A letter the parser refuses is simply not in the domain.
 */
function ownPieceTypesParseFenAccepts(): Set<number> {
  const types = new Set<number>();
  for (let code = "a".charCodeAt(0); code <= "z".charCodeAt(0); code++) {
    const letter = String.fromCharCode(code).toUpperCase();
    for (const board of [`4k3/8/8/8/8/8/8/3K3${letter}`, `4k3/8/8/8/8/8/8/7${letter}`]) {
      try {
        types.add(pieceType(parseFen(`${board} w - - 0 1`).board[7] as number));
      } catch {
        // `parseFen` refused this letter on this board — not in the domain by this route.
      }
    }
  }
  return types;
}

/**
 * Asserts the row is the EXPERIMENT it claims to be, before asserting the outcome. A row that
 * says "no castle is offered" also passes when the FEN accidentally sets up something else
 * entirely — a typo in a 22-row table would silently test nothing. So: the named own piece
 * really stands on the square under test, the OTHER precondition really HOLDS (so exactly one
 * condition can be the reason the castle is refused), and exactly the one right is held.
 */
function expectImpostorSetup(fen: string, piece: string, square: "king" | "rook"): void {
  const fields = fen.split(" ");
  const black = fields[1] === "b";
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  const position = parseFen(fen);
  const colour = black ? BLACK : 0;
  const underTest = square === "king" ? shape.kingFrom : shape.rookFrom;
  const other = square === "king" ? shape.rookFrom : shape.kingFrom;
  const otherPiece = (square === "king" ? ROOK : KING) | colour;

  expect(
    position.board[underTest],
    `the impostor must stand on the square under test: ${fen}`,
  ).toBe((PIECE_TYPES[piece] as number) | colour);
  expect(position.board[other], `the OTHER precondition must hold: ${fen}`).toBe(otherPiece);
  expect(position.castling, `exactly the one right: ${fen}`).toBe(shape.right);
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
 * `A11`, first half: EVERY one of the mover's own non-KING piece types on the KING's home
 * square, with the matching rook present. Own colour only — an enemy occupant is masked by
 * the through-check test (see the file header). One `legalMoves` call on a build that admits
 * any of these DESTROYS the occupant and writes a king of the moving side over it, so purity
 * is asserted on every row as well as the `FLAG_CASTLE` count.
 */
const IMPOSTOR_ON_KING_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["QUEEN", "4k3/8/8/8/8/8/8/K3Q2R w K - 0 1", 31], // own queen on e1, king on a1, rook home
  ["QUEEN", "4k3/8/8/8/8/8/8/R3Q2K w Q - 0 1", 32], // own queen on e1, queenside
  ["QUEEN", "k3q2r/8/8/8/8/8/8/4K3 b k - 0 1", 31], // own queen on e8, black to move
  ["QUEEN", "r3q2k/8/8/8/8/8/8/4K3 b q - 0 1", 32], // own queen on e8, black queenside
  ["ROOK", "4k3/8/8/8/8/8/8/K3R2R w K - 0 1", 24], // own ROOK on e1 — the byte one line below the king's
  ["ROOK", "k3r2r/8/8/8/8/8/8/4K3 b k - 0 1", 24], // own rook on e8, black to move
  ["BISHOP", "4k3/8/8/8/8/8/8/K3B2R w K - 0 1", 19], // = `A5` row 1, repeated so this table is the quantifier
  ["BISHOP", "k3b2r/8/8/8/8/8/8/4K3 b k - 0 1", 19], // = `A5` row 4
  ["KNIGHT", "4k3/8/8/8/8/8/8/K3N2R w K - 0 1", 16], // own knight on e1, kingside
  ["KNIGHT", "4k3/8/8/8/8/8/8/R3N2K w Q - 0 1", 17], // = `A5` row 2, queenside
  ["PAWN", "4k3/8/8/8/8/8/8/K3P2R w K - 0 1", 13], // own pawn on e1 — `parseFen` accepts a first-rank pawn
  ["PAWN", "r3p2k/8/8/8/8/8/8/4K3 b q - 0 1", 14], // own pawn on e8, black queenside
];

/**
 * `A11`, second half: EVERY one of the mover's own non-ROOK piece types on the ROOK's home
 * square, king already home. Family 3 leaves the position byte-identical whichever way the
 * guard reads, so the `FLAG_CASTLE` count is the only signal — the same structural reason
 * `A6` carries no purity row. The mover's own KING is absent from this enumeration because it
 * is not constructible, not because it is untested (file header).
 */
const IMPOSTOR_ON_ROOK_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["QUEEN", "4k3/8/8/8/8/8/8/4K2Q w K - 0 1", 21], // own queen on h1
  ["QUEEN", "4k3/8/8/8/8/8/8/Q3K3 w Q - 0 1", 22], // own queen on a1
  ["QUEEN", "4k2q/8/8/8/8/8/8/4K3 b k - 0 1", 21], // own queen on h8, black to move
  ["QUEEN", "q3k3/8/8/8/8/8/8/4K3 b q - 0 1", 22], // own queen on a8, black queenside
  ["BISHOP", "4k3/8/8/8/8/8/8/4K2B w K - 0 1", 12], // = `A6` row 1, repeated for the same reason
  ["BISHOP", "4k2b/8/8/8/8/8/8/4K3 b k - 0 1", 12], // = `A6` row 3
  ["KNIGHT", "4k3/8/8/8/8/8/8/4K2N w K - 0 1", 7], // own knight on h1
  ["KNIGHT", "4k3/8/8/8/8/8/8/N3K3 w Q - 0 1", 7], // = `A6` row 2, queenside
  ["PAWN", "4k3/8/8/8/8/8/8/4K2P w K - 0 1", 6], // own pawn on h1
  ["PAWN", "p3k3/8/8/8/8/8/8/4K3 b q - 0 1", 6], // own pawn on a8, black queenside
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

describe("ABC-009 A11 — the impostor's PIECE TYPE, quantified over every own type", () => {
  it.each(IMPOSTOR_ON_KING_SQUARE)(
    "offers no castle and destroys nothing when an own %s stands on the king's home square: %s",
    (piece, fen, expected) => {
      expectImpostorSetup(fen, piece, "king");
      expectNoCastleAndPure(fen, expected);
    },
  );

  it.each(IMPOSTOR_ON_ROOK_SQUARE)(
    "offers no castle when an own %s stands on the rook's home square: %s",
    (piece, fen, expected) => {
      expectImpostorSetup(fen, piece, "rook");
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("enumerates EVERY own piece type on both home squares — the quantifier itself, asserted", () => {
    // `A11` is exhaustive over piece type, so the completeness of the two tables is a PROPERTY
    // to check rather than a claim to make in a comment: delete a row and this goes red.
    //
    // The universe is derived from what `parseFen` ACCEPTS on a board, not restated as a second
    // hand list — `## Scope` binds the contract to "every position it accepts", so that parser
    // is the domain's authority. If a seventh piece type ever becomes parseable this test fails
    // until `A11` gains a row for it, which is the whole point of a quantifier over a sample.
    const universe = ownPieceTypesParseFenAccepts();
    const byte = (piece: string) => PIECE_TYPES[piece] as number;
    const ascending = (a: number, b: number) => a - b;

    expect([...universe].sort(ascending), "the piece-type domain `parseFen` accepts").toEqual(
      [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING].sort(ascending),
    );

    // The king's home square: every own type except the mover's own KING, which is the LEGAL
    // occupant and is covered by the four legal-castle controls.
    expect(
      [...new Set(IMPOSTOR_ON_KING_SQUARE.map(([piece]) => byte(piece)))].sort(ascending),
    ).toEqual([...universe].filter((type) => type !== KING).sort(ascending));

    // The rook's home square: every own type except the mover's own ROOK (the legal occupant)
    // and the own KING, which is NOT CONSTRUCTIBLE — with the king also home it needs two
    // same-colour kings, which `parseFen` refuses, and with the king elsewhere the king guard
    // refuses first. Excluded on measurement, not skipped.
    expect(
      [...new Set(IMPOSTOR_ON_ROOK_SQUARE.map(([piece]) => byte(piece)))].sort(ascending),
    ).toEqual([...universe].filter((type) => type !== KING && type !== ROOK).sort(ascending));

    // Both colours to move and both castling sides, across each table — `A11`'s own clause.
    for (const table of [IMPOSTOR_ON_KING_SQUARE, IMPOSTOR_ON_ROOK_SQUARE]) {
      expect([...new Set(table.map(([, fen]) => fen.split(" ")[2]))].sort()).toEqual([
        "K",
        "Q",
        "k",
        "q",
      ]);
      expect([...new Set(table.map(([, fen]) => fen.split(" ")[1]))].sort()).toEqual(["b", "w"]);
      // Every type appears in at least two (colour, side) configurations, so an admission
      // conditional on the side or the castle dies too.
      for (const piece of new Set(table.map(([type]) => type))) {
        expect(
          table.filter(([type]) => type === piece).length,
          `${piece} needs a second configuration`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

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
