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
 *    guard already refuses.
 *
 *    THIS PARAGRAPH CARRIED A SECOND EXCLUSION AND IT WAS FALSE — corrected 2026-08-09, third
 *    QE hop. It read "an ENEMY-colour occupant of either square is unreachable, masked by the
 *    pre-existing through-check test". That holds for an enemy KING, QUEEN and ROOK and for
 *    NOTHING ELSE: an enemy KNIGHT or PAWN on e1/h1/a1 attacks none of e1/f1/g1, is not in the
 *    `empty` set, and leaves the king out of check, so the identity guard is its only guard.
 *    BA/PM measured it (four mutants surviving 371/371 with the harm live) after this file's
 *    header asserted the generalisation. Dimension 3 below carries the repair. `A11`'s own
 *    domain is the mover's OWN types, so `A11` is not reopened and its rows are unchanged.
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
 * 3. THE OCCUPANT'S COLOUR — and, since colour was the last axis left, THE WHOLE OCCUPANT
 *    BYTE. `A13`, and it is a quantifier over a MEASURED domain rather than a fourth sample.
 *
 *    Dimension 1 closed piece type over the mover's OWN pieces and left the occupant's colour
 *    on the blanket claim quoted above. The claim was measurably false for two types, so the
 *    repair is not "add the enemy knight and the enemy pawn" — that would be a fifth sample and
 *    the fifth prediction of a sixth. A home square holds exactly ONE BYTE; `parseFen` can put
 *    exactly 13 distinct values in it (measured below, not asserted); ONE of the 13 is the
 *    required piece; so 12 wrong values per square is THE ENTIRE SPACE, and every one of the 13
 *    is assigned, by name, to exactly one bucket in the tables below — required, covered by an
 *    absence row, covered by `A11`, covered by an existing enemy row, newly covered here,
 *    measured-behaviour-equivalent, or not constructible. Delete a row and the accounting goes
 *    red; make a fourteenth byte parseable and it goes red.
 *
 *    An ENEMY queen on either home square is still refused today by the pre-existing
 *    through-check test, for the same reason an enemy rook and an enemy king are: each attacks a
 *    square `option.kingPath` requires unattacked. Measured on the delivered tree —
 *    `4k3/8/8/8/8/8/8/K3q2R w K - 0 1` and `4k3/8/8/8/8/8/8/4K2q w K - 0 1` both offer zero
 *    castles. Those three bytes are the ONLY ones the masking argument covers, and the argument
 *    is asserted here through `isSquareAttackedBy` rather than inherited from a comment.
 *
 * ----------------------------------------------------------------------------------------------
 *
 * ABC-023 — three regions the net above does not reach, added 2026-08-10. Same premise as
 * `A11`/`A13`: every row PASSES on the delivered tree (`src/moves.ts` md5
 * `6335b452fc21ffe2d0f902ecab930840`), NO production line changed, and each was written because a
 * build that fails it passes all 559 delivered tests AND the `PERFT_DEEP=1` lane at 32/32.
 *
 * 4. THE CASTLE'S DESTINATION SQUARE — `A2`, and it is the reason this ticket exists. Dropping
 *    `kingTo` from an option's `kingPath`, so a castle whose LANDING square is attacked is still
 *    offered, survives the whole suite on ALL FOUR options. Nothing catches it because
 *    `legalMoves` removes the move for a DIFFERENT reason — the king would end in check — so
 *    every count-based oracle, perft included, is blind. What breaks is the exported
 *    `generateMoves` and its own documented invariant (`src/moves.ts:318-320`: "a castle never
 *    appears when the king would start, cross, or land in check"). Two consequences for the rows:
 *    the count is asserted on `generateMoves`, where the harm is visible, and dimension 3's rule
 *    is DELIBERATELY INVERTED — here the through-check test MUST be the mechanism, on the landing
 *    square specifically, which is why `expectLandingSquareIsTheOnlyRefuser` is the mirror image
 *    of `expectIdentityGuardIsTheOnlyRefuser` rather than a copy of it. This is also the only
 *    class on this board whose position is LEGALLY REACHABLE.
 *
 * 5. THE JOINT OCCUPANT PAIR — `A1`. Every row above holds one home square wrong and the other
 *    one RIGHT, on purpose, so that exactly one guard can be the reason the castle is refused.
 *    That deliberate choice leaves a build that admits the castle only when BOTH squares hold a
 *    specific wrong byte surviving 559/559 — measured on an enemy-KNIGHT pair, on an own-QUEEN
 *    pair, and on a variant additionally conditional on the castling side. The rows pin the
 *    CLASS at four rows and assert the byte on BOTH squares; enumerating the 169-combination
 *    joint space is the trap `ABC-023` names and refuses.
 *
 * 6. THE DOUBLING VARIED ONE AXIS PER TYPE, NOT BOTH — `A3`. Dimension 1's standard is "at least
 *    two (colour to move, castling side) configurations per type", and for 9 of the 13
 *    type/table pairs those two configurations differ on only ONE of the two axes. An admission
 *    conditional on the OTHER axis is therefore never exercised: six such single-type mutants
 *    survive 559/559, and the two that die are exactly the types whose rows already vary the axis
 *    in question — which is what makes the standard falsifiable rather than decorative. The gap
 *    is symmetric: vary only colour and a SIDE-conditional admission lives; vary only side and a
 *    COLOUR-conditional one does. ONE added configuration per gapped pair closes both axes, so
 *    the nine `A3_ADDED_*` rows below are SPREAD INTO the four tables they extend — the tables
 *    stay the quantifier, and no existing row, count or verdict is touched.
 */

import { describe, expect, it } from "vitest";
import { parseFenGrammarOnly as parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, generateMoves, isSquareAttackedBy, type Move } from "./moves.ts";
import {
  BISHOP,
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
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
 * `empty` and `kingPath` are copied verbatim from the `WHITE_CASTLES` / `BLACK_CASTLES` tables
 * in `src/moves.ts`, so an `A13` row can prove the OTHER two guards are not what refuses it.
 */
const CASTLE_SHAPE: Readonly<
  Record<
    string,
    {
      readonly kingFrom: number;
      readonly rookFrom: number;
      readonly right: number;
      readonly empty: readonly number[];
      readonly kingPath: readonly number[];
    }
  >
> = {
  K: { kingFrom: 4, rookFrom: 7, right: CASTLE_WK, empty: [5, 6], kingPath: [4, 5, 6] },
  Q: { kingFrom: 4, rookFrom: 0, right: CASTLE_WQ, empty: [1, 2, 3], kingPath: [4, 3, 2] },
  k: {
    kingFrom: 116,
    rookFrom: 119,
    right: CASTLE_BK,
    empty: [117, 118],
    kingPath: [116, 117, 118],
  },
  q: {
    kingFrom: 116,
    rookFrom: 112,
    right: CASTLE_BQ,
    empty: [113, 114, 115],
    kingPath: [116, 115, 114],
  },
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
 * entirely — a typo in a 22-row table would silently test nothing. So: the named piece really
 * stands on the square under test IN THE COLOUR THE ROW CLAIMS, the OTHER precondition really
 * HOLDS (so exactly one condition can be the reason the castle is refused), and exactly the one
 * right is held.
 *
 * The COLOUR half of the byte assertion is load-bearing rather than belt-and-braces on `A13`'s
 * rows, measured: on the king's home square an enemy BISHOP, an enemy KNIGHT and an enemy PAWN
 * ALL answer 13 moves, and on the rook's home square an enemy BISHOP, an enemy PAWN and an
 * EMPTY square all answer 5. A row asserting only its count is therefore interchangeable with
 * rows for two other byte values, so the count cannot pin which value was tested — this can.
 * It has already caught one lying label: a row labelled PAWN whose FEN carried a BISHOP, at a
 * coinciding count of 19, so every outcome assertion passed.
 */
function expectImpostorSetup(
  fen: string,
  piece: string,
  square: "king" | "rook",
  occupant: "own" | "enemy" = "own",
): void {
  const fields = fen.split(" ");
  const black = fields[1] === "b";
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  const position = parseFen(fen);
  const colour = black ? BLACK : 0;
  const underTest = square === "king" ? shape.kingFrom : shape.rookFrom;
  const other = square === "king" ? shape.rookFrom : shape.kingFrom;
  const otherPiece = (square === "king" ? ROOK : KING) | colour;
  const occupantColour = occupant === "own" ? colour : colour ^ BLACK;

  expect(
    position.board[underTest],
    `the ${occupant === "enemy" ? "ENEMY " : ""}impostor must stand on the square under test: ${fen}`,
  ).toBe((PIECE_TYPES[piece] as number) | occupantColour);
  expect(position.board[other], `the OTHER precondition must hold: ${fen}`).toBe(otherPiece);
  expect(position.castling, `exactly the one right: ${fen}`).toBe(shape.right);
}

/**
 * Asserts the IDENTITY GUARD is the only thing that can be refusing this row's castle. If the
 * occupant also attacked a square on `option.kingPath`, or a square in `option.empty` were
 * occupied, the row would stay green on a build whose identity guard was deleted — an inert row
 * that proves nothing about `A13`. That is not hypothetical: exactly three of the six
 * two-rights rows below are inert against the rook-guard `break` mutant, so inertness is
 * asserted here rather than assumed. `isSquareAttackedBy` is the same predicate the production
 * through-check uses, asked directly.
 */
function expectIdentityGuardIsTheOnlyRefuser(fen: string): void {
  const fields = fen.split(" ");
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  const position = parseFen(fen);
  const attackerIsBlack = fields[1] !== "b";
  const masked = shape.kingPath.filter((square) =>
    isSquareAttackedBy(position, square, attackerIsBlack),
  );
  const blocked = shape.empty.filter((square) => position.board[square] !== EMPTY);

  expect(masked.map(squareName), `the king path must be UNATTACKED: ${fen}`).toEqual([]);
  expect(blocked.map(squareName), `the empty squares must be EMPTY: ${fen}`).toEqual([]);
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
 * `ABC-023` `A3`, first of four: the added configuration for each type in `IMPOSTOR_ON_KING_SQUARE`
 * whose existing rows vary only ONE axis. ROOK (`Kk`) and BISHOP (`Kk`) double on COLOUR only, so
 * each gains a QUEENSIDE row; KNIGHT (`KQ`, both white) doubles on SIDE only, so it gains a BLACK
 * row. QUEEN (`KQkq`) and PAWN (`Kq`) already vary both and gain nothing — the nine rows are one
 * per GAP, not one per type. Spread into the table below so the table itself stays the quantifier.
 */
const A3_ADDED_ON_KING_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["ROOK", "4k3/8/8/8/8/8/8/R3R2K w Q - 0 1", 25], // own ROOK on e1, QUEENSIDE — the missing side
  ["BISHOP", "4k3/8/8/8/8/8/8/R3B2K w Q - 0 1", 20], // own bishop on e1, queenside
  ["KNIGHT", "k3n2r/8/8/8/8/8/8/4K3 b k - 0 1", 16], // own knight on e8, BLACK — the missing colour
];

/**
 * `A11`, first half: EVERY one of the mover's own non-KING piece types on the KING's home
 * square, with the matching rook present. Own colour only, because `A11`'s domain is the
 * mover's OWN pieces — the enemy-colour half of the byte space is `A13`'s and its rows are
 * the `ENEMY_ON_*` tables below, NOT masked away by the through-check test as this file's
 * header used to claim. One `legalMoves` call on a build that admits any of these DESTROYS the
 * occupant and writes a king of the moving side over it, so purity is asserted on every row as
 * well as the `FLAG_CASTLE` count.
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
  ...A3_ADDED_ON_KING_SQUARE, // ABC-023 A3 — one added configuration per gapped type
];

/**
 * `ABC-023` `A3`, second of four: the added configuration for each gapped type in
 * `IMPOSTOR_ON_ROOK_SQUARE`. BISHOP (`Kk`) doubles on COLOUR only and gains a QUEENSIDE row;
 * KNIGHT (`KQ`, both white) doubles on SIDE only and gains a BLACK row. QUEEN (`KQkq`) and PAWN
 * (`Kq`) already vary both axes.
 */
const A3_ADDED_ON_ROOK_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["BISHOP", "4k3/8/8/8/8/8/8/B3K3 w Q - 0 1", 12], // own bishop on a1, QUEENSIDE — the missing side
  ["KNIGHT", "4k2n/8/8/8/8/8/8/4K3 b k - 0 1", 7], // own knight on h8, BLACK — the missing colour
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
  ...A3_ADDED_ON_ROOK_SQUARE, // ABC-023 A3 — one added configuration per gapped type
];

/**
 * `ABC-023` `A3`, third of four: the added configuration for each gapped type in
 * `ENEMY_ON_KING_SQUARE`. Both types double on COLOUR only — KNIGHT on `Kk` (kingside twice) and
 * PAWN on `Qq` (queenside twice) — so each gains the side its rows never carried. Note the gap
 * runs the OTHER way for the PAWN: its blind axis is the KINGSIDE, not the queenside.
 */
const A3_ADDED_ENEMY_ON_KING_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["KNIGHT", "4k3/8/8/8/8/8/8/R3n2K w Q - 0 1", 13], // black knight on e1, QUEENSIDE
  ["PAWN", "4k3/8/8/8/8/8/8/K3p2R w K - 0 1", 13], // black pawn on e1, KINGSIDE
];

/**
 * `A13`, first half: the ENEMY occupants of the KING's home square that the identity guard is
 * the ONLY guard against — an enemy KNIGHT and an enemy PAWN. Enemy KING/QUEEN/ROOK are excluded
 * because the through-check test already refuses them (asserted, not inherited, further down);
 * enemy BISHOP is `A5` row 3's; the mover's own types are `A11`'s. That is the whole enemy half
 * of the byte space, and these four rows are the part of it nothing covered.
 *
 * A build admitting either byte destroys an ENEMY piece and leaves the mover with a SECOND KING
 * on one `legalMoves` call — material loss, a piece-type change AND a colour change, strictly
 * worse than `A11`'s own-colour family. The FENs are BA/PM's, measured independently there and
 * re-measured here; the counts below are the ones both derivations returned.
 */
const ENEMY_ON_KING_SQUARE: ReadonlyArray<readonly [piece: string, fen: string, expected: number]> =
  [
    ["KNIGHT", "4k3/8/8/8/8/8/8/K3n2R w K - 0 1", 13], // black knight on e1, white king a1, rook home
    ["KNIGHT", "4N2r/8/8/5k2/8/8/8/4K3 b k - 0 1", 17], // white knight on e8; it attacks f6, so 17 not 18
    ["PAWN", "4k3/8/8/8/8/8/8/R3p2K w Q - 0 1", 14], // black pawn on e1, queenside
    ["PAWN", "r3P3/8/8/5k2/8/8/8/4K3 b q - 0 1", 19], // white pawn on e8, black queenside
    ...A3_ADDED_ENEMY_ON_KING_SQUARE, // ABC-023 A3 — one added configuration per gapped type
  ];

/**
 * `ABC-023` `A3`, fourth of four: the added configuration for each gapped type in
 * `ENEMY_ON_ROOK_SQUARE`, the same two COLOUR-only doublings as the table above and the same
 * repair — the KNIGHT rows are both kingside and gain a queenside one, the PAWN rows are both
 * queenside and gain a kingside one.
 */
const A3_ADDED_ENEMY_ON_ROOK_SQUARE: ReadonlyArray<
  readonly [piece: string, fen: string, expected: number]
> = [
  ["KNIGHT", "4k3/8/8/8/8/8/8/n3K3 w Q - 0 1", 5], // black knight on a1, QUEENSIDE
  ["PAWN", "4k3/8/8/8/8/8/8/4K2p w K - 0 1", 5], // black pawn on h1, KINGSIDE
];

/**
 * `A13`, second half: the same two enemy bytes on the ROOK's home square, king already home.
 * The position is byte-identical across the call whichever way the guard reads, so the
 * `FLAG_CASTLE` count is the only signal — `A6`'s structural reason, a third time.
 */
const ENEMY_ON_ROOK_SQUARE: ReadonlyArray<readonly [piece: string, fen: string, expected: number]> =
  [
    ["KNIGHT", "4k3/8/8/8/8/8/8/4K2n w K - 0 1", 4], // black knight on h1 — the ONE count that differs
    ["KNIGHT", "4k2N/8/8/8/8/8/8/4K3 b k - 0 1", 4], // white knight on h8
    ["PAWN", "4k3/8/8/8/8/8/8/p3K3 w Q - 0 1", 5], // black pawn on a1, queenside
    ["PAWN", "P3k3/8/8/8/8/8/8/4K3 b q - 0 1", 5], // white pawn on a8, black queenside
    ...A3_ADDED_ENEMY_ON_ROOK_SQUARE, // ABC-023 A3 — one added configuration per gapped type
  ];

/**
 * `A13`'s value-by-value discharge map, keyed on the occupant RELATIVE to the mover — EMPTY plus
 * the six types in each colour is 13 labels for the 13 bytes `parseFen` can write. Every value
 * is assigned to exactly one bucket and the buckets are checked, not narrated: the two "in this
 * file" buckets are compared against the tables above, so deleting a row goes red.
 */
const REQUIRED = "the REQUIRED value — the castle IS offered";
const BY_A11 = "the A11 tables in this file";
const BY_A13 = "the A13 tables in this file";
const BY_ABSENCE_ROW = "an absence row in the acceptance file";
const BY_ENEMY_BISHOP_ROW = "an existing enemy-bishop row in the acceptance file";
const EQUIVALENT = "behaviour-equivalent, EXCLUDED — masks the king path";
const NOT_CONSTRUCTIBLE = "NOT CONSTRUCTIBLE — parseFen refuses every construction";

const KING_SQUARE_ACCOUNTING: Readonly<Record<string, string>> = {
  EMPTY: BY_ABSENCE_ROW, // `A4`, 16 moves
  "own PAWN": BY_A11,
  "own KNIGHT": BY_A11,
  "own BISHOP": BY_A11,
  "own ROOK": BY_A11,
  "own QUEEN": BY_A11,
  "own KING": REQUIRED,
  "enemy PAWN": BY_A13,
  "enemy KNIGHT": BY_A13,
  "enemy BISHOP": BY_ENEMY_BISHOP_ROW, // `A5` row 3
  "enemy ROOK": EQUIVALENT,
  "enemy QUEEN": EQUIVALENT,
  "enemy KING": EQUIVALENT,
};

const ROOK_SQUARE_ACCOUNTING: Readonly<Record<string, string>> = {
  EMPTY: BY_ABSENCE_ROW, // `A3`, 5 moves
  "own PAWN": BY_A11,
  "own KNIGHT": BY_A11,
  "own BISHOP": BY_A11,
  "own ROOK": REQUIRED,
  "own QUEEN": BY_A11,
  "own KING": NOT_CONSTRUCTIBLE,
  "enemy PAWN": BY_A13,
  "enemy KNIGHT": BY_A13,
  "enemy BISHOP": BY_ENEMY_BISHOP_ROW, // `A6` row 4
  "enemy ROOK": EQUIVALENT,
  "enemy QUEEN": EQUIVALENT,
  "enemy KING": EQUIVALENT,
};

/** Renders a 64-cell grid (index `rank * 8 + file`) as a FEN placement field. */
function placementOf(cells: ReadonlyArray<string | null>): string {
  const ranks: string[] = [];
  for (let rank = 7; rank >= 0; rank--) {
    let out = "";
    let run = 0;
    for (let file = 0; file < 8; file++) {
      const cell = cells[rank * 8 + file] ?? null;
      if (cell === null) {
        run += 1;
        continue;
      }
      if (run > 0) {
        out += String(run);
        run = 0;
      }
      out += cell;
    }
    ranks.push(run > 0 ? `${out}${run}` : out);
  }
  return ranks.join("/");
}

/**
 * Every byte `parseFen` can put on `square`, measured instead of restated — this is `A13`'s
 * quantifier turned into a test, the same way `ownPieceTypesParseFenAccepts` is `A11`'s.
 *
 * THE TRAP THIS FUNCTION IS BUILT AGAINST, because two roles fell into it on this ticket: a
 * probe whose single board already holds a king of the colour being placed reports 11, not 13,
 * because `K` and `k` on the target square raise "position must have exactly one white/black
 * king, found 2" — a limit of the probe board presented as a fact about the domain, and one of
 * the two bytes it drops is the REQUIRED value on the king's home square. So the king parking
 * varies per attempt: both kings parked at c3/f6 (neither is ever a home square), then white
 * only, then black only, so no attempt ever needs two kings of one colour.
 */
function occupantBytesParseFenAccepts(square: number): Map<number, string> {
  const found = new Map<number, string>();
  const target = (square >> 4) * 8 + (square & 7);
  const candidates: Array<string | null> = [null]; // `null` = leave it empty, the EMPTY byte
  for (let code = "A".charCodeAt(0); code <= "z".charCodeAt(0); code++) {
    candidates.push(String.fromCharCode(code));
  }

  for (const candidate of candidates) {
    for (const kings of [["K", "k"], ["K"], ["k"]]) {
      const cells: Array<string | null> = Array.from({ length: 64 }, () => null);
      if (kings.includes("K")) cells[2 * 8 + 2] = "K"; // c3
      if (kings.includes("k")) cells[5 * 8 + 5] = "k"; // f6
      cells[target] = candidate;
      try {
        const byte = parseFen(`${placementOf(cells)} w - - 0 1`).board[square] as number;
        if (!found.has(byte)) found.set(byte, candidate ?? "<empty>");
      } catch {
        // `parseFen` refused this character on this king configuration — not in the domain here.
      }
    }
  }
  return found;
}

/** The 13 relative labels `KING_SQUARE_ACCOUNTING` is keyed on, and the byte each one names. */
function bytesByLabel(moverIsBlack: boolean): Map<string, number> {
  const own = moverIsBlack ? BLACK : 0;
  const enemy = moverIsBlack ? 0 : BLACK;
  const byLabel = new Map<string, number>([["EMPTY", EMPTY]]);
  for (const [name, type] of Object.entries(PIECE_TYPES)) {
    byLabel.set(`own ${name}`, type | own);
    byLabel.set(`enemy ${name}`, type | enemy);
  }
  return byLabel;
}

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

describe("ABC-009 A13 — the occupant BYTE of a home square, quantified over the WHOLE space", () => {
  it.each(ENEMY_ON_KING_SQUARE)(
    "offers no castle and destroys nothing when an ENEMY %s stands on the king's home square: %s",
    (piece, fen, expected) => {
      expectImpostorSetup(fen, piece, "king", "enemy");
      expectIdentityGuardIsTheOnlyRefuser(fen);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it.each(ENEMY_ON_ROOK_SQUARE)(
    "offers no castle when an ENEMY %s stands on the rook's home square: %s",
    (piece, fen, expected) => {
      expectImpostorSetup(fen, piece, "rook", "enemy");
      expectIdentityGuardIsTheOnlyRefuser(fen);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("measures the 13-value byte domain and accounts for EVERY value in exactly one bucket", () => {
    // `A13` is a quantifier over the occupant byte, so the completeness of the accounting is a
    // PROPERTY to check rather than a claim to make in a comment. Delete a row from either table
    // and this goes red; make a fourteenth byte parseable and it goes red too.
    const ascending = (a: number, b: number) => a - b;
    const types = [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING];
    const domainBytes = [EMPTY, ...types, ...types.map((type) => type | BLACK)].sort(ascending);

    expect(domainBytes.length, "13 values is the number A13's termination argument rests on").toBe(
      13,
    );
    for (const square of [4, 7, 0, 116, 119, 112]) {
      const domain = occupantBytesParseFenAccepts(square);
      expect(
        [...domain.keys()].sort(ascending),
        `the occupant-byte domain parseFen accepts on ${squareName(square)}`,
      ).toEqual(domainBytes);
    }

    const labelsFor = (accounting: Readonly<Record<string, string>>, bucket: string) =>
      Object.keys(accounting)
        .filter((label) => accounting[label] === bucket)
        .sort();

    for (const [square, accounting] of [
      ["king", KING_SQUARE_ACCOUNTING],
      ["rook", ROOK_SQUARE_ACCOUNTING],
    ] as const) {
      // The 13 labels the accounting is keyed on are exactly the 13 bytes, for either mover.
      for (const moverIsBlack of [false, true]) {
        const byLabel = bytesByLabel(moverIsBlack);
        expect(
          [...byLabel.keys()].sort(),
          `${square}'s square: a bucket for every value and no value without one`,
        ).toEqual(Object.keys(accounting).sort());
        expect([...byLabel.values()].sort(ascending)).toEqual(domainBytes);
      }
      // Exactly one of the 13 is the required piece, so exactly 12 are wrong values.
      const wrong = Object.values(accounting).filter((bucket) => bucket !== REQUIRED);
      expect(wrong.length, `${square}'s square: 12 wrong values is the entire space`).toBe(12);
    }

    // The two "in this file" buckets are compared against the tables, so the map cannot drift
    // from the rows it claims. This is the join `A13`'s discharge map asserts in prose.
    expect(labelsFor(KING_SQUARE_ACCOUNTING, BY_A13)).toEqual(
      [...new Set(ENEMY_ON_KING_SQUARE.map(([piece]) => `enemy ${piece}`))].sort(),
    );
    expect(labelsFor(KING_SQUARE_ACCOUNTING, BY_A11)).toEqual(
      [...new Set(IMPOSTOR_ON_KING_SQUARE.map(([piece]) => `own ${piece}`))].sort(),
    );
    expect(labelsFor(ROOK_SQUARE_ACCOUNTING, BY_A13)).toEqual(
      [...new Set(ENEMY_ON_ROOK_SQUARE.map(([piece]) => `enemy ${piece}`))].sort(),
    );
    expect(labelsFor(ROOK_SQUARE_ACCOUNTING, BY_A11)).toEqual(
      [...new Set(IMPOSTOR_ON_ROOK_SQUARE.map(([piece]) => `own ${piece}`))].sort(),
    );

    // `A13`'s own both-colours-all-four-rights clause, at `A11`'s established doubling.
    for (const table of [ENEMY_ON_KING_SQUARE, ENEMY_ON_ROOK_SQUARE]) {
      expect([...new Set(table.map(([, fen]) => fen.split(" ")[2]))].sort()).toEqual([
        "K",
        "Q",
        "k",
        "q",
      ]);
      expect([...new Set(table.map(([, fen]) => fen.split(" ")[1]))].sort()).toEqual(["b", "w"]);
      for (const piece of new Set(table.map(([type]) => type))) {
        expect(
          table.filter(([type]) => type === piece).length,
          `${piece} needs a second configuration`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("checks A13's two EXCLUSIONS at their MECHANISM instead of inheriting them", () => {
    // An exclusion nobody re-measures is this ticket's signature defect — the enemy-colour
    // exclusion this file's header used to carry was one, and it was false. So both surviving
    // exclusions are asserted here at the mechanism that justifies them.
    //
    // POLARITY FIRST: a predicate that answered one way for everything would fabricate a clean
    // table either way, so it is checked before any of its verdicts is read.
    expect(isSquareAttackedBy(parseFen("4k3/8/8/8/8/8/8/4K2r w K - 0 1"), 6, true)).toBe(true);
    expect(isSquareAttackedBy(parseFen("4k3/8/8/8/8/8/8/4K3 w K - 0 1"), 6, true)).toBe(false);

    // 1. BEHAVIOUR-EQUIVALENT: an enemy KING, QUEEN or ROOK on either home square is already
    //    refused by the pre-existing through-check test, so a required row for it could NEVER
    //    fail — it would be theatre. What is asserted is the reason: each masks the king path.
    const masked: ReadonlyArray<readonly [piece: string, fen: string, square: "king" | "rook"]> = [
      ["KING", "8/8/8/8/8/8/8/K3k2R w K - 0 1", "king"],
      ["QUEEN", "4k3/8/8/8/8/8/8/K3q2R w K - 0 1", "king"],
      ["ROOK", "4k3/8/8/8/8/8/8/K3r2R w K - 0 1", "king"],
      ["KING", "8/8/8/8/8/8/8/4K2k w K - 0 1", "rook"],
      ["QUEEN", "4k3/8/8/8/8/8/8/4K2q w K - 0 1", "rook"],
      ["ROOK", "4k3/8/8/8/8/8/8/4K2r w K - 0 1", "rook"],
    ];
    for (const [piece, fen, square] of masked) {
      expectImpostorSetup(fen, piece, square, "enemy");
      const shape = CASTLE_SHAPE[fen.split(" ")[2] as string];
      if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

      const position = parseFen(fen);
      const attacked = shape.kingPath.filter((path) => isSquareAttackedBy(position, path, true));
      expect(
        attacked.map(squareName),
        `an enemy ${piece} on the ${square}'s home square must mask the king path: ${fen}`,
      ).not.toEqual([]);
      expect(castles(legalMoves(parseFen(fen))), `legalMoves: ${fen}`).toHaveLength(0);
    }

    // 2. NOT CONSTRUCTIBLE: the mover's own KING on the ROOK's home square while the king is
    //    also home needs two kings of one colour. All four constructions, both colours and both
    //    sides — the exclusion is conditional on the OTHER precondition, and a probe that
    //    drifted off it (a lone own KING on h1 with e1 empty, which is `A4`'s shape) reported
    //    this value constructible.
    for (const fen of [
      "4k3/8/8/8/8/8/8/4K2K w K - 0 1",
      "4k3/8/8/8/8/8/8/K3K3 w Q - 0 1",
      "4k2k/8/8/8/8/8/8/4K3 b k - 0 1",
      "k3k3/8/8/8/8/8/8/4K3 b q - 0 1",
    ]) {
      expect(() => parseFen(fen), `must not be constructible: ${fen}`).toThrow(
        /exactly one (white|black) king, found 2/,
      );
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

/**
 * The mover and the castling side a row carries, read off the FEN mechanically. `ABC-023` `A1` and
 * `A3` are both statements about these two axes, and reading them by eye out of a 39-row table is
 * how `## Reproduction` 3's gap survived `ABC-009` in the first place.
 */
function moverOf(fen: string): string {
  return fen.split(" ")[1] as string;
}
function sideOf(fen: string): string {
  return (fen.split(" ")[2] as string).toUpperCase() === "K" ? "kingside" : "queenside";
}

/**
 * `ABC-023` `A1`: `expectImpostorSetup`'s assertion, owed on BOTH home squares at once.
 *
 * It cannot be `expectImpostorSetup` itself, and the difference is the whole point of the
 * criterion: that helper asserts the OTHER precondition HOLDS, so that exactly one guard can be
 * the reason the castle is refused. An `A1` row deliberately breaks both at once, so what is owed
 * is the occupant byte — piece TYPE and COLOUR — on each square, plus exactly the one right.
 */
function expectPairSetup(
  fen: string,
  occupant: "own" | "enemy",
  kingSquarePiece: string,
  rookSquarePiece: string,
): void {
  const fields = fen.split(" ");
  const black = fields[1] === "b";
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  const position = parseFen(fen);
  const colour = black ? BLACK : 0;
  const occupantColour = occupant === "own" ? colour : colour ^ BLACK;

  expect(
    position.board[shape.kingFrom],
    `the ${occupant} ${kingSquarePiece} must stand on the KING's home square: ${fen}`,
  ).toBe((PIECE_TYPES[kingSquarePiece] as number) | occupantColour);
  expect(
    position.board[shape.rookFrom],
    `the ${occupant} ${rookSquarePiece} must stand on the ROOK's home square: ${fen}`,
  ).toBe((PIECE_TYPES[rookSquarePiece] as number) | occupantColour);
  expect(position.castling, `exactly the one right: ${fen}`).toBe(shape.right);
}

/**
 * `ABC-009`'s standing rule, extracted so `ABC-023`'s rows obey it too: a predicate that answered
 * one way for everything would fabricate a clean table either way, so its polarity is checked
 * before any of its verdicts is read (`## Test notes` 3).
 */
function expectAttackPolarity(): void {
  expect(
    isSquareAttackedBy(parseFen("4k3/8/8/8/8/8/8/4K2r w K - 0 1"), 6, true),
    "polarity: an enemy rook on h1 DOES attack g1",
  ).toBe(true);
  expect(
    isSquareAttackedBy(parseFen("4k3/8/8/8/8/8/8/4K3 w K - 0 1"), 6, true),
    "polarity: a bare board attacks NOTHING",
  ).toBe(false);
}

/**
 * `ABC-023` `A2`: the deliberate INVERSION of `expectIdentityGuardIsTheOnlyRefuser`. There the
 * through-check test must not be the mechanism; here it must be — and on the LANDING square
 * specifically, because that is the only one of the three `kingPath` squares nothing else pins.
 * So the row asserts that every other guard PASSES (the right is held, both home squares hold the
 * mover's own king and rook, the `empty` set really is empty), that the landing square IS
 * attacked, and that the origin and the crossed square are NOT.
 *
 * The row names its landing square and the helper re-derives it from `kingPath` and compares: a
 * row mislabelled `g1` for a queenside option would otherwise assert the wrong square's attack
 * and still pass, which is `expectImpostorSetup`'s lying-label lesson applied to this axis.
 */
function expectLandingSquareIsTheOnlyRefuser(fen: string, landing: string): void {
  const fields = fen.split(" ");
  const black = fields[1] === "b";
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  expectAttackPolarity();

  const position = parseFen(fen);
  const colour = black ? BLACK : 0;
  const attackerIsBlack = !black;
  const landingSquare = shape.kingPath[shape.kingPath.length - 1] as number;

  expect(squareName(landingSquare), `the row must name the option's LANDING square: ${fen}`).toBe(
    landing,
  );
  expect(position.castling, `exactly the one right: ${fen}`).toBe(shape.right);
  expect(position.board[shape.kingFrom], `the king must be HOME: ${fen}`).toBe(KING | colour);
  expect(position.board[shape.rookFrom], `the rook must be HOME: ${fen}`).toBe(ROOK | colour);
  expect(
    shape.empty.filter((square) => position.board[square] !== EMPTY).map(squareName),
    `the empty squares must be EMPTY: ${fen}`,
  ).toEqual([]);

  expect(
    isSquareAttackedBy(position, landingSquare, attackerIsBlack),
    `the LANDING square ${landing} must be attacked: ${fen}`,
  ).toBe(true);
  expect(
    shape.kingPath
      .filter((square) => square !== landingSquare)
      .filter((square) => isSquareAttackedBy(position, square, attackerIsBlack))
      .map(squareName),
    `the ORIGIN and CROSSED squares must NOT be attacked: ${fen}`,
  ).toEqual([]);
}

/**
 * `ABC-023` `A1` — BOTH home squares of one option holding a wrong byte SIMULTANEOUSLY. Every row
 * in every table above holds one square wrong and the other right, so a build that admits the
 * castle only when a specific PAIR co-occurs survives all of them; both pairs below were measured
 * surviving 559/559 on the delivered tree, and the enemy pair leaves
 * `4k3/8/8/8/8/8/8/K3K2n w K - 0 1` behind on ONE `legalMoves` call — the black knight on e1
 * destroyed and a second WHITE KING written over it.
 *
 * Four rows, and the shape of the four is load-bearing: within a family the two rows differ in
 * BOTH the colour to move AND the castling side, so a pair admission additionally conditional on
 * either axis dies too — that variant was measured surviving 559/559 as well. It is the CLASS
 * that is pinned, at four rows; enumerating the 169-combination joint space is the trap the ticket
 * names and refuses.
 */
const JOINT_OCCUPANT_PAIRS: ReadonlyArray<
  readonly [
    occupant: "own" | "enemy",
    kingSquarePiece: string,
    rookSquarePiece: string,
    fen: string,
    expected: number,
  ]
> = [
  ["enemy", "KNIGHT", "KNIGHT", "4k3/8/8/8/8/8/8/K3n2n w K - 0 1", 3], // white, kingside
  ["enemy", "KNIGHT", "KNIGHT", "N3N2k/8/8/8/8/8/8/4K3 b q - 0 1", 2], // black, QUEENSIDE
  ["own", "QUEEN", "QUEEN", "4k3/8/8/8/8/8/8/K3Q2Q w K - 0 1", 38], // white, kingside
  ["own", "QUEEN", "QUEEN", "q3q2k/8/8/8/8/8/8/4K3 b q - 0 1", 39], // black, QUEENSIDE
];

/**
 * `ABC-023` `A2` — the castle's LANDING square attacked while its origin and crossed squares are
 * not. All four options: both colours to move and both castling sides. Dropping the landing square
 * from an option's `kingPath` survives the full suite AND the `PERFT_DEEP=1` lane at 32/32 on
 * every one of the four, because `legalMoves` removes the move for a different reason and every
 * count-based oracle is therefore blind — so the `FLAG_CASTLE` count is asserted where the harm
 * is, on `generateMoves`.
 */
const DESTINATION_SQUARE_ATTACKED: ReadonlyArray<
  readonly [fen: string, landing: string, expected: number]
> = [
  ["4k1r1/8/8/8/8/8/8/4K2R w K - 0 1", "g1", 14], // g1 attacked from g8
  ["2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1", "c1", 15], // c1 attacked from c8
  ["4k2r/8/8/8/8/8/8/4K1R1 b k - 0 1", "g8", 14], // g8 attacked from g1
  ["r3k3/8/8/8/8/8/8/2R1K3 b q - 0 1", "c8", 15], // c8 attacked from c1
];

/**
 * `ABC-023` `A3`'s nine added rows, joined to the table each one extends. The join is asserted
 * rather than narrated: a future edit that drops a spread from a table goes red here, which is the
 * only thing standing between "the tables are the quantifier" and a comment that says so.
 */
const A3_ADDED_CONFIGURATIONS: ReadonlyArray<
  readonly [
    table: string,
    added: ReadonlyArray<readonly [piece: string, fen: string, expected: number]>,
    extended: ReadonlyArray<readonly [piece: string, fen: string, expected: number]>,
  ]
> = [
  ["IMPOSTOR_ON_KING_SQUARE", A3_ADDED_ON_KING_SQUARE, IMPOSTOR_ON_KING_SQUARE],
  ["IMPOSTOR_ON_ROOK_SQUARE", A3_ADDED_ON_ROOK_SQUARE, IMPOSTOR_ON_ROOK_SQUARE],
  ["ENEMY_ON_KING_SQUARE", A3_ADDED_ENEMY_ON_KING_SQUARE, ENEMY_ON_KING_SQUARE],
  ["ENEMY_ON_ROOK_SQUARE", A3_ADDED_ENEMY_ON_ROOK_SQUARE, ENEMY_ON_ROOK_SQUARE],
];

describe("ABC-023 A1 — the JOINT occupant pair: BOTH home squares wrong at once", () => {
  it.each(JOINT_OCCUPANT_PAIRS)(
    "offers no castle and destroys nothing when an %s %s and %s stand on BOTH home squares: %s",
    (occupant, kingSquarePiece, rookSquarePiece, fen, expected) => {
      expectPairSetup(fen, occupant, kingSquarePiece, rookSquarePiece);
      // Non-inert: neither the emptiness test nor the through-check test may be the refuser, or
      // the row would stay green on a build with no identity guard at all.
      expectAttackPolarity();
      expectIdentityGuardIsTheOnlyRefuser(fen);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("varies BOTH axes inside each family, so a side- or colour-conditional pair dies too", () => {
    // The measured reason this is a criterion and not a preference: a pair admission ALSO
    // conditional on the castling side survives 559/559 exactly as the plain pair mutant does, so
    // four rows that held either axis constant would be blind to it — the same blindness
    // `## Reproduction` 3 measures on `A11`'s own rows. It costs no extra row.
    for (const family of ["enemy", "own"] as const) {
      const rows = JOINT_OCCUPANT_PAIRS.filter(([occupant]) => occupant === family);
      expect(rows.length, `the ${family} family needs two rows`).toBe(2);
      expect(
        new Set(rows.map(([, , , fen]) => moverOf(fen))).size,
        `the ${family} family's two rows must differ in the COLOUR to move`,
      ).toBe(2);
      expect(
        new Set(rows.map(([, , , fen]) => sideOf(fen))).size,
        `the ${family} family's two rows must differ in the castling SIDE`,
      ).toBe(2);
    }

    // ...and the four together cover both colours and both sides.
    expect([...new Set(JOINT_OCCUPANT_PAIRS.map(([, , , fen]) => moverOf(fen)))].sort()).toEqual([
      "b",
      "w",
    ]);
    expect([...new Set(JOINT_OCCUPANT_PAIRS.map(([, , , fen]) => sideOf(fen)))].sort()).toEqual([
      "kingside",
      "queenside",
    ]);
  });
});

describe("ABC-023 A2 — the castle's DESTINATION square, pinned at the generateMoves layer", () => {
  it.each(DESTINATION_SQUARE_ATTACKED)(
    "offers no castle on %s — the LANDING square %s is attacked, the origin and crossed are not",
    (fen, landing, expected) => {
      expectLandingSquareIsTheOnlyRefuser(fen, landing);
      expectNoCastleAndPure(fen, expected);
    },
  );
});

describe("ABC-023 A3 — the doubling standard varies BOTH axes, not one", () => {
  it("closes every gapped type/table pair and leaves each added row non-inert", () => {
    expectAttackPolarity();

    const added = A3_ADDED_CONFIGURATIONS.flatMap(([, rows]) => rows);
    expect(added.length, "nine rows: one per gapped type/table pair, not one per type").toBe(9);

    for (const [table, rows, extended] of A3_ADDED_CONFIGURATIONS) {
      for (const row of rows) {
        // The row is really IN the table it claims to extend — the spread, asserted.
        expect(extended, `${table} must contain its added row: ${row[1]}`).toContainEqual(row);
        // ...and the identity guard, not the emptiness or through-check test, is what refuses it.
        expectIdentityGuardIsTheOnlyRefuser(row[1]);
      }
    }

    // The quantifier itself: every type in every table now varies BOTH axes. Stated over the
    // tables rather than over the added rows, so a future row that re-narrows a type goes red.
    let pairs = 0;
    let gappedBeforeTheseRows = 0;
    for (const [table, rows, extended] of A3_ADDED_CONFIGURATIONS) {
      const before = extended.filter((row) => !rows.includes(row));
      for (const type of new Set(extended.map(([piece]) => piece))) {
        const configurations = extended.filter(([piece]) => piece === type);
        pairs += 1;
        expect(
          new Set(configurations.map(([, fen]) => moverOf(fen))).size,
          `${table} ${type}: both COLOURS to move`,
        ).toBe(2);
        expect(
          new Set(configurations.map(([, fen]) => sideOf(fen))).size,
          `${table} ${type}: both castling SIDES`,
        ).toBe(2);

        const wasGapped = before.filter(([piece]) => piece === type);
        if (
          new Set(wasGapped.map(([, fen]) => moverOf(fen))).size < 2 ||
          new Set(wasGapped.map(([, fen]) => sideOf(fen))).size < 2
        ) {
          gappedBeforeTheseRows += 1;
        }
      }
    }
    // The two counts `## Reproduction` 3 rests on, asserted rather than cited: 13 type/table
    // pairs, 9 of which varied one axis only before these rows landed.
    expect(pairs, "13 type/table pairs across the four tables").toBe(13);
    expect(gappedBeforeTheseRows, "9 of the 13 varied ONE axis before these rows").toBe(9);
  });
});

/**
 * ------------------------------------------------------------------------------------------------
 * `ABC-023` QE — three regions the criteria's OWN rows do not reach, added 2026-08-10 at the
 * `In Review` gate from an INDEPENDENT mutation campaign (67 mutants over both tree states, 0
 * broken builds, 0 harness errors, its own harness rather than the engineer's).
 *
 * Every mutant named below SURVIVED the delivered tree at **578/578** AND the `PERFT_DEEP=1` lane
 * at **32/32** — it passed every one of `A1`–`A5` and the whole suite. Each is a gap in the
 * CRITERIA, never a defect in the code: `src/moves.ts` still hashes
 * `6335b452fc21ffe2d0f902ecab930840`, no production line is touched here either, and every row
 * below PASSES on the delivered tree. The repair is rows; no criterion was narrowed so that a
 * survivor stops counting.
 *
 * 7. THE ATTACKER'S TYPE ON THE LANDING SQUARE — `A2`'s blind axis. `A2`'s four rows are every one
 *    of them attacked by an enemy ROOK standing on the landing square's own FILE, which is
 *    measured below rather than asserted. A build that tests the landing square for ORTHOGONAL
 *    SLIDER attacks only — so a castle onto a square attacked by a knight, a pawn, a bishop, a
 *    diagonally-placed queen or the enemy king is still offered — survives all four. `legalMoves`
 *    removes the move for its own different reason, so perft stays blind exactly as
 *    `## Reproduction` 1 describes; what breaks is `generateMoves`' documented invariant, which is
 *    `A2`'s whole point. Twenty rows: five attacker types across all four options.
 *
 * 8. THE (COLOUR × SIDE) COMBINATION, not merely the two axes — the blind corner of `A3` AND `A1`.
 *    `A3` requires every type to VARY both axes, and eleven of the thirteen type/table pairs still
 *    cover only two or three of the four combinations. A single-type admission conditional on the
 *    colour AND the side AT ONCE therefore survives — measured on seven of them, while the control
 *    keyed on a combination a delivered row DOES carry dies at 577/578. The same corner sits in
 *    `A1`'s four pair rows, which is the engineer's own declared limitation: a pair admission keyed
 *    on (white, queenside) or (black, kingside) survives. Thirteen rows close the tables, four the
 *    pairs.
 *
 * 9. THE SCALAR FIELDS — an axis no row in this file varies AT ALL. Every FEN in all six tables
 *    above ends `- 0 1`, asserted below over the tables themselves. A build whose two identity
 *    guards are skipped whenever `halfmoveClock !== 0`, or `fullmoveNumber !== 1`, or an
 *    en-passant square is set, survives the entire net; so does one that skips only the LANDING
 *    square's through-check test on the same slice. Legal play never trips those guards, so every
 *    count-based oracle is blind by construction — the same masking argument as `## Reproduction`
 *    1, on a different axis. Seven rows carry the three scalars off their defaults.
 * ------------------------------------------------------------------------------------------------
 */

/** Algebraic to 0x88 — the inverse of `squareName`, so a row can name its attacker's square. */
function squareIndex(name: string): number {
  return FILES.indexOf(name[0] as string) + (Number(name[1]) - 1) * 16;
}

/** The (colour to move, castling side) pair a row carries, as one comparable label. */
function combinationOf(fen: string): string {
  return `${moverOf(fen)}/${sideOf(fen)}`;
}

/**
 * `ABC-023` QE, region 7: the row's LANDING-square attacker is the piece the row names, it is the
 * MECHANISM, and it is not the kind `A2`'s own four rows use.
 *
 * The third assertion is the discriminating one. Every delivered `A2` row is attacked by an
 * orthogonal slider sitting on the landing square's own file, so a build that narrows the landing
 * square's test to orthogonal sliders passes all four. Here the attacker shares neither the rank
 * nor the file of the landing square, so that build goes red on all twenty rows.
 */
function expectNamedAttackerIsTheMechanism(fen: string, attacker: string, from: string): void {
  const fields = fen.split(" ");
  const black = fields[1] === "b";
  const shape = CASTLE_SHAPE[fields[2] as string];
  if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);

  const position = parseFen(fen);
  const attackerIsBlack = !black;
  const landing = shape.kingPath[shape.kingPath.length - 1] as number;
  const square = squareIndex(from);

  expect(position.board[square], `the enemy ${attacker} must stand on ${from}: ${fen}`).toBe(
    (PIECE_TYPES[attacker] as number) | (attackerIsBlack ? BLACK : 0),
  );
  expect(
    [(square & 7) === (landing & 7), square >> 4 === landing >> 4],
    `${from} must share neither file nor rank with ${squareName(landing)}: ${fen}`,
  ).toEqual([false, false]);

  const stripped: Position = { ...position, board: position.board.slice() };
  stripped.board[square] = EMPTY;
  expect(
    isSquareAttackedBy(stripped, landing, attackerIsBlack),
    `removing the ${attacker} must leave ${squareName(landing)} unattacked: ${fen}`,
  ).toBe(false);
}

/**
 * `ABC-023` QE, region 7 — the castle's landing square attacked by something OTHER than the
 * file-borne rook every `A2` row uses. Five attacker types × four options; the queen rows attack
 * along a DIAGONAL, so the piece type alone is not what these rows vary.
 */
const LANDING_ATTACKER_TYPES: ReadonlyArray<
  readonly [attacker: string, from: string, fen: string, landing: string, expected: number]
> = [
  ["KNIGHT", "h3", "4k3/8/8/8/8/7n/8/4K2R w K - 0 1", "g1", 8],
  ["PAWN", "h2", "4k3/8/8/8/8/8/7p/4K2R w K - 0 1", "g1", 8],
  ["BISHOP", "h2", "4k3/8/8/8/8/8/7b/4K2R w K - 0 1", "g1", 8],
  ["KING", "h2", "8/8/8/8/8/8/7k/4K2R w K - 0 1", "g1", 8],
  ["QUEEN", "h2", "4k3/8/8/8/8/8/7q/4K2R w K - 0 1", "g1", 5],
  ["KNIGHT", "a2", "4k3/8/8/8/8/8/n7/R3K3 w Q - 0 1", "c1", 9],
  ["PAWN", "b2", "4k3/8/8/8/8/8/1p6/R3K3 w Q - 0 1", "c1", 15],
  ["BISHOP", "a3", "4k3/8/8/8/8/b7/8/R3K3 w Q - 0 1", "c1", 10],
  ["KING", "b2", "8/8/8/8/8/8/1k6/R3K3 w Q - 0 1", "c1", 15],
  ["QUEEN", "a3", "4k3/8/8/8/8/q7/8/R3K3 w Q - 0 1", "c1", 10],
  ["KNIGHT", "h6", "4k2r/8/7N/8/8/8/8/4K3 b k - 0 1", "g8", 8],
  ["PAWN", "h7", "4k2r/7P/8/8/8/8/8/4K3 b k - 0 1", "g8", 8],
  ["BISHOP", "h7", "4k2r/7B/8/8/8/8/8/4K3 b k - 0 1", "g8", 8],
  ["KING", "h7", "4k2r/7K/8/8/8/8/8/8 b k - 0 1", "g8", 8],
  ["QUEEN", "h7", "4k2r/7Q/8/8/8/8/8/4K3 b k - 0 1", "g8", 5],
  ["KNIGHT", "a7", "r3k3/N7/8/8/8/8/8/4K3 b q - 0 1", "c8", 9],
  ["PAWN", "b7", "r3k3/1P6/8/8/8/8/8/4K3 b q - 0 1", "c8", 15],
  ["BISHOP", "a6", "r3k3/8/B7/8/8/8/8/4K3 b q - 0 1", "c8", 10],
  ["KING", "b7", "r3k3/1K6/8/8/8/8/8/8 b q - 0 1", "c8", 15],
  ["QUEEN", "a6", "r3k3/8/Q7/8/8/8/8/4K3 b q - 0 1", "c8", 10],
];

/**
 * `ABC-023` QE, region 8 — the (colour, side) combinations the four impostor tables still do not
 * carry after `A3`'s nine rows. One row per missing combination; the two QUEEN pairs already carry
 * all four and gain nothing, so this is one row per GAP exactly as `A3` was.
 */
const COMBINATION_GAP_ROWS: ReadonlyArray<
  readonly [
    table: string,
    piece: string,
    square: "king" | "rook",
    occupant: "own" | "enemy",
    fen: string,
    expected: number,
  ]
> = [
  ["IMPOSTOR_ON_KING_SQUARE", "ROOK", "king", "own", "r3r2k/8/8/8/8/8/8/4K3 b q - 0 1", 25],
  ["IMPOSTOR_ON_KING_SQUARE", "BISHOP", "king", "own", "r3b2k/8/8/8/8/8/8/4K3 b q - 0 1", 20],
  ["IMPOSTOR_ON_KING_SQUARE", "KNIGHT", "king", "own", "r3n2k/8/8/8/8/8/8/4K3 b q - 0 1", 17],
  ["IMPOSTOR_ON_KING_SQUARE", "PAWN", "king", "own", "4k3/8/8/8/8/8/8/R3P2K w Q - 0 1", 14],
  ["IMPOSTOR_ON_KING_SQUARE", "PAWN", "king", "own", "k3p2r/8/8/8/8/8/8/4K3 b k - 0 1", 13],
  ["IMPOSTOR_ON_ROOK_SQUARE", "BISHOP", "rook", "own", "b3k3/8/8/8/8/8/8/4K3 b q - 0 1", 12],
  ["IMPOSTOR_ON_ROOK_SQUARE", "KNIGHT", "rook", "own", "n3k3/8/8/8/8/8/8/4K3 b q - 0 1", 7],
  ["IMPOSTOR_ON_ROOK_SQUARE", "PAWN", "rook", "own", "4k3/8/8/8/8/8/8/P3K3 w Q - 0 1", 6],
  ["IMPOSTOR_ON_ROOK_SQUARE", "PAWN", "rook", "own", "4k2p/8/8/8/8/8/8/4K3 b k - 0 1", 6],
  ["ENEMY_ON_KING_SQUARE", "KNIGHT", "king", "enemy", "r3N2k/8/8/8/8/8/8/4K3 b q - 0 1", 13],
  ["ENEMY_ON_KING_SQUARE", "PAWN", "king", "enemy", "k3P2r/8/8/8/8/8/8/4K3 b k - 0 1", 13],
  ["ENEMY_ON_ROOK_SQUARE", "KNIGHT", "rook", "enemy", "N3k3/8/8/8/8/8/8/4K3 b q - 0 1", 5],
  ["ENEMY_ON_ROOK_SQUARE", "PAWN", "rook", "enemy", "4k2P/8/8/8/8/8/8/4K3 b k - 0 1", 5],
];

/** The four tables region 8's quantifier runs over, joined to the name its rows cite. */
const COMBINATION_TABLES: ReadonlyArray<
  readonly [
    name: string,
    table: ReadonlyArray<readonly [piece: string, fen: string, expected: number]>,
  ]
> = [
  ["IMPOSTOR_ON_KING_SQUARE", IMPOSTOR_ON_KING_SQUARE],
  ["IMPOSTOR_ON_ROOK_SQUARE", IMPOSTOR_ON_ROOK_SQUARE],
  ["ENEMY_ON_KING_SQUARE", ENEMY_ON_KING_SQUARE],
  ["ENEMY_ON_ROOK_SQUARE", ENEMY_ON_ROOK_SQUARE],
];

/**
 * `ABC-023` QE, region 8 applied to `A1` — the two (colour, side) combinations each pair family
 * does not carry. `A1`'s four rows vary both axes and cover (w, kingside) and (b, queenside) in
 * each family; a pair admission keyed on the OTHER diagonal of that square survives all four.
 */
const PAIR_COMBINATION_ROWS: ReadonlyArray<
  readonly [
    occupant: "own" | "enemy",
    kingSquarePiece: string,
    rookSquarePiece: string,
    fen: string,
    expected: number,
  ]
> = [
  ["enemy", "KNIGHT", "KNIGHT", "4k3/8/8/8/8/8/8/n3n2K w Q - 0 1", 2], // white, QUEENSIDE
  ["enemy", "KNIGHT", "KNIGHT", "k3N2N/8/8/8/8/8/8/4K3 b k - 0 1", 3], // black, kingside
  ["own", "QUEEN", "QUEEN", "4k3/8/8/8/8/8/8/Q3Q2K w Q - 0 1", 39], // white, QUEENSIDE
  ["own", "QUEEN", "QUEEN", "k3q2q/8/8/8/8/8/8/4K3 b k - 0 1", 38], // black, kingside
];

/**
 * `ABC-023` QE, region 9 — the identity guards, on rows whose SCALAR fields are off their
 * defaults. The occupants repeat rows that already exist; the scalars are the variable, which is
 * the whole point of the region.
 */
const SCALAR_AXIS_IDENTITY: ReadonlyArray<readonly [label: string, fen: string, expected: number]> =
  [
    ["own QUEEN on the king's square, halfmoveClock 7", "4k3/8/8/8/8/8/8/K3Q2R w K - 7 1", 31],
    ["own queen on the king's square, fullmoveNumber 27", "k3q2r/8/8/8/8/8/8/4K3 b k - 0 27", 31],
    ["enemy KNIGHT on the king's square, an EP square set", "4k3/8/8/8/8/8/8/K3n2R w K c6 0 1", 13],
    [
      "own BISHOP on the rook's square, halfmove 3 / fullmove 9",
      "4k3/8/8/8/8/8/8/4K2B w K - 3 9",
      12,
    ],
    ["an enemy-KNIGHT PAIR, halfmove 9 / fullmove 5", "4k3/8/8/8/8/8/8/K3n2n w K - 9 5", 3],
  ];

/** `ABC-023` QE, region 9 — the same axis on `A2`'s class, where a separate mutant survives. */
const SCALAR_AXIS_DESTINATION: ReadonlyArray<
  readonly [label: string, fen: string, landing: string, expected: number]
> = [
  ["halfmoveClock 11 / fullmoveNumber 33", "4k1r1/8/8/8/8/8/8/4K2R w K - 11 33", "g1", 14],
  ["an en-passant square set", "4k1r1/8/8/8/8/8/8/4K2R w K c6 0 1", "g1", 14],
];

describe("ABC-023 QE region 7 — the LANDING square, attacked by something other than a file rook", () => {
  it.each(LANDING_ATTACKER_TYPES)(
    "offers no castle when an enemy %s on %s attacks the landing square: %s",
    (attacker, from, fen, landing, expected) => {
      expectLandingSquareIsTheOnlyRefuser(fen, landing);
      expectNamedAttackerIsTheMechanism(fen, attacker, from);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("measures the axis A2's own four rows hold constant: every attacker of theirs is file-borne", () => {
    // Not a criticism of those rows and not a re-run of them — a MEASUREMENT of the axis they do
    // not vary, which is what makes the twenty rows above a gap rather than a preference. Strip
    // the landing square's own file and every delivered row's attack disappears; strip it on the
    // rows above and every one of them still stands.
    expectAttackPolarity();

    for (const [fen, landing] of DESTINATION_SQUARE_ATTACKED) {
      const shape = CASTLE_SHAPE[fen.split(" ")[2] as string];
      if (shape === undefined) throw new Error(`row must hold exactly one castling right: ${fen}`);
      const position = parseFen(fen);
      const attackerIsBlack = fen.split(" ")[1] !== "b";
      const target = shape.kingPath[shape.kingPath.length - 1] as number;
      const stripped: Position = { ...position, board: position.board.slice() };
      for (let square = 0; square < 128; square++) {
        if ((square & 0x88) === 0 && (square & 7) === (target & 7)) stripped.board[square] = EMPTY;
      }
      expect(
        isSquareAttackedBy(stripped, target, attackerIsBlack),
        `A2 row ${fen} is attacked on ${landing} from the file only`,
      ).toBe(false);
    }

    // The twenty rows cover five attacker types across all four options, so the narrowing cannot
    // be repaired for one option and left open on another.
    for (const [, , fen] of LANDING_ATTACKER_TYPES) {
      expect(fen.split(" ")[3], `region 7 rows keep the scalars at their default: ${fen}`).toBe(
        "-",
      );
    }
    for (const rights of ["K", "Q", "k", "q"]) {
      const rows = LANDING_ATTACKER_TYPES.filter(([, , fen]) => fen.split(" ")[2] === rights);
      expect(
        [...new Set(rows.map(([attacker]) => attacker))].sort(),
        `the ${rights} option needs all five attacker types`,
      ).toEqual(["BISHOP", "KING", "KNIGHT", "PAWN", "QUEEN"]);
    }
  });
});

describe("ABC-023 QE region 8 — the (colour x side) COMBINATION, not merely the two axes", () => {
  it.each(COMBINATION_GAP_ROWS)(
    "%s: offers no castle with an %s %s on the %s's home square: %s",
    (_table, piece, square, occupant, fen, expected) => {
      expectImpostorSetup(fen, piece, square, occupant);
      expectIdentityGuardIsTheOnlyRefuser(fen);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it.each(PAIR_COMBINATION_ROWS)(
    "offers no castle with an %s %s and %s on BOTH home squares at the missing combination: %s",
    (occupant, kingSquarePiece, rookSquarePiece, fen, expected) => {
      expectPairSetup(fen, occupant, kingSquarePiece, rookSquarePiece);
      expectAttackPolarity();
      expectIdentityGuardIsTheOnlyRefuser(fen);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("closes all four (colour, side) combinations for every type/table pair and both pair families", () => {
    let pairs = 0;
    let shortBeforeTheseRows = 0;
    for (const [name, table] of COMBINATION_TABLES) {
      const mine = COMBINATION_GAP_ROWS.filter(([owner]) => owner === name);
      for (const type of new Set(table.map(([piece]) => piece))) {
        pairs += 1;
        const before = table.filter(([piece]) => piece === type).map(([, fen]) => fen);
        const added = mine.filter(([, piece]) => piece === type).map(([, , , , fen]) => fen);

        if (new Set(before.map(combinationOf)).size < 4) shortBeforeTheseRows += 1;
        expect(
          new Set([...before, ...added].map(combinationOf)).size,
          `${name} ${type}: all four (colour, side) combinations`,
        ).toBe(4);
      }
    }
    // The counts this region rests on, asserted rather than cited: 13 type/table pairs, and 11 of
    // them still carried fewer than all four combinations after `A3`'s nine rows landed.
    expect(pairs, "13 type/table pairs across the four tables").toBe(13);
    expect(shortBeforeTheseRows, "11 of the 13 were short of all four combinations").toBe(11);

    // `A1`'s two families, the same measurement: two of four before, four of four after.
    for (const family of ["enemy", "own"] as const) {
      const before = JOINT_OCCUPANT_PAIRS.filter(([occupant]) => occupant === family).map(
        ([, , , fen]) => fen,
      );
      const added = PAIR_COMBINATION_ROWS.filter(([occupant]) => occupant === family).map(
        ([, , , fen]) => fen,
      );
      expect(
        new Set(before.map(combinationOf)).size,
        `the ${family} family carried two of the four combinations`,
      ).toBe(2);
      expect(
        new Set([...before, ...added].map(combinationOf)).size,
        `the ${family} family must carry all four`,
      ).toBe(4);
    }
  });
});

describe("ABC-023 QE region 9 — the SCALAR fields, an axis no other row in this file varies", () => {
  it.each(SCALAR_AXIS_IDENTITY)("offers no castle when %s: %s", (_label, fen, expected) => {
    expectAttackPolarity();
    expectIdentityGuardIsTheOnlyRefuser(fen);
    expectNoCastleAndPure(fen, expected);
  });

  it.each(SCALAR_AXIS_DESTINATION)(
    "offers no castle on an attacked landing square when %s: %s",
    (_label, fen, landing, expected) => {
      expectLandingSquareIsTheOnlyRefuser(fen, landing);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it("measures the axis every other row in this file holds constant, and moves it", () => {
    // The gap, asserted over the tables instead of narrated: every row above carries `- 0 1`, so
    // a guard switched off on any other value of those three fields is never exercised.
    const scalarsOf = (fen: string) => fen.split(" ").slice(3).join(" ");
    const held: ReadonlyArray<readonly [name: string, fens: readonly string[]]> = [
      ["IMPOSTOR_ON_KING_SQUARE", IMPOSTOR_ON_KING_SQUARE.map(([, fen]) => fen)],
      ["IMPOSTOR_ON_ROOK_SQUARE", IMPOSTOR_ON_ROOK_SQUARE.map(([, fen]) => fen)],
      ["ENEMY_ON_KING_SQUARE", ENEMY_ON_KING_SQUARE.map(([, fen]) => fen)],
      ["ENEMY_ON_ROOK_SQUARE", ENEMY_ON_ROOK_SQUARE.map(([, fen]) => fen)],
      ["JOINT_OCCUPANT_PAIRS", JOINT_OCCUPANT_PAIRS.map(([, , , fen]) => fen)],
      ["DESTINATION_SQUARE_ATTACKED", DESTINATION_SQUARE_ATTACKED.map(([fen]) => fen)],
    ];
    for (const [name, fens] of held) {
      expect(
        [...new Set(fens.map(scalarsOf))],
        `${name}: every row carries the default scalars`,
      ).toEqual(["- 0 1"]);
    }

    // ...and these rows move all three of them. The "no en-passant square" sentinel is MEASURED
    // through `parseFen` rather than restated, the same way this file measures its byte domains.
    const noEpSquare = parseFen("4k3/8/8/8/8/8/8/4K3 w K - 0 1").epSquare;
    const positions = [
      ...SCALAR_AXIS_IDENTITY.map(([, fen]) => parseFen(fen)),
      ...SCALAR_AXIS_DESTINATION.map(([, fen]) => parseFen(fen)),
    ];
    expect(
      positions.some((position) => position.halfmoveClock !== 0),
      "a row with a non-zero halfmove clock",
    ).toBe(true);
    expect(
      positions.some((position) => position.fullmoveNumber !== 1),
      "a row with a fullmove number past 1",
    ).toBe(true);
    expect(
      positions.some((position) => position.epSquare !== noEpSquare),
      "a row with an en-passant square set",
    ).toBe(true);
  });
});

/**
 * ------------------------------------------------------------------------------------------------
 * `ABC-024` — the two castling guards whose ONLY protection was the opt-in `PERFT_DEEP=1` lane,
 * added 2026-10-17. Same premise as every region above: each row PASSES on the delivered tree
 * (`src/moves.ts` md5 `6335b452fc21ffe2d0f902ecab930840`) and NO production line changed.
 *
 * 10. THE `empty` CORRIDOR, square by square — `A1`. Dropping one square from an option's `empty`
 *     array offers a castle straight through an occupied square. Before these rows, four of the
 *     ten squares (`BK` g8, `BQ` b8/c8/d8) died in no row of the default lane, and five of the
 *     other six died only by accident in positions no criterion owns. One row per square, each
 *     holding exactly that square occupied while the same side's OTHER castle stays valid, so the
 *     surviving castle can be named: a count alone cannot tell "the blocked one was refused" from
 *     "the valid one was dropped and something else appeared". `option.empty` tests `!== EMPTY`,
 *     so it is colour- and type-blind; two rows hold an ENEMY occupant to exercise that at zero
 *     extra rows instead of enumerating occupants.
 *
 * 11. THE CASTLING RIGHT, off the `- 0 1` every row above uses — `A2`. `NO_RIGHT_HELD` kills the
 *     right test's removal, but only at `- 0 1`, so the test switched off whenever
 *     `halfmoveClock !== 0`, `fullmoveNumber !== 1` or an en-passant square is set survived. Four
 *     rows, both colours x two scalar classes: an en-passant square and a non-zero halfmove clock
 *     cannot honestly share a FEN (the double push that sets the one zeroes the other), so four is
 *     the floor. One control per class holds the right and offers both castles, so the scalars are
 *     shown not to suppress castling on their own.
 * ------------------------------------------------------------------------------------------------
 */

/**
 * `ABC-024` `A1` — one row per square of the four `empty` arrays. `option` is the castle the
 * occupied square blocks; `survivor` is the side's other castle, still offered and named.
 */
const EMPTY_CORRIDOR_SQUARE: ReadonlyArray<
  readonly [
    option: string,
    square: string,
    occupant: "own" | "enemy",
    piece: string,
    fen: string,
    survivor: string,
    expected: number,
  ]
> = [
  ["K", "f1", "own", "BISHOP", "r3k2r/8/8/8/8/8/8/R3KB1R w KQkq - 0 1", "e1c1", 30],
  ["K", "g1", "own", "KNIGHT", "r3k2r/8/8/8/8/8/8/R3K1NR w KQkq - 0 1", "e1c1", 26],
  ["Q", "b1", "enemy", "KNIGHT", "r3k2r/8/8/8/8/8/8/Rn2K2R w KQkq - 0 1", "e1g1", 22],
  ["Q", "c1", "own", "BISHOP", "r3k2r/8/8/8/8/8/8/R1B1K2R w KQkq - 0 1", "e1g1", 30],
  ["Q", "d1", "own", "QUEEN", "r3k2r/8/8/8/8/8/8/R2QK2R w KQkq - 0 1", "e1g1", 39],
  ["k", "f8", "own", "BISHOP", "r3kb1r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8c8", 30],
  ["k", "g8", "own", "KNIGHT", "r3k1nr/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8c8", 26],
  ["q", "b8", "enemy", "KNIGHT", "rN2k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 22],
  ["q", "c8", "own", "BISHOP", "r1b1k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 30],
  ["q", "d8", "own", "QUEEN", "r2qk2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "e8g8", 39],
];

/** The other castle of the same side, keyed on the option a row blocks. */
const SAME_SIDE_OTHER: Readonly<Record<string, string>> = { K: "Q", Q: "K", k: "q", q: "k" };

/**
 * `ABC-024` `A1`: the row is the experiment it claims to be. The named occupant stands on the
 * corridor square in the TYPE AND COLOUR the row claims; it is the ONLY occupied square of the
 * blocked option's corridor; king and rook stand home and both of the side's rights are held; the
 * blocked option's king path is unattacked, so the `empty` test is the only thing that can refuse
 * it; and the surviving option's corridor is clear and its king path unattacked, so its castle is
 * alive to be named.
 */
function expectCorridorSetup(
  fen: string,
  option: string,
  square: string,
  occupant: "own" | "enemy",
  piece: string,
): void {
  const blocked = CASTLE_SHAPE[option];
  const other = CASTLE_SHAPE[SAME_SIDE_OTHER[option] as string];
  if (blocked === undefined || other === undefined) throw new Error(`unknown option: ${option}`);

  const position = parseFen(fen);
  const black = fen.split(" ")[1] === "b";
  const colour = black ? BLACK : 0;
  const index = squareIndex(square);

  expect(blocked.empty, `${square} must be in the ${option} corridor`).toContain(index);
  expect(position.board[index], `the ${occupant} ${piece} must stand on ${square}: ${fen}`).toBe(
    (PIECE_TYPES[piece] as number) | (occupant === "own" ? colour : colour ^ BLACK),
  );
  expect(
    blocked.empty.filter((cell) => position.board[cell] !== EMPTY).map(squareName),
    `${square} must be the ONLY occupied square of the ${option} corridor: ${fen}`,
  ).toEqual([square]);
  expect(
    other.empty.filter((cell) => position.board[cell] !== EMPTY).map(squareName),
    `the ${SAME_SIDE_OTHER[option]} corridor must be clear: ${fen}`,
  ).toEqual([]);

  for (const shape of [blocked, other]) {
    expect(position.board[shape.kingFrom], `the king must stand home: ${fen}`).toBe(KING | colour);
    expect(position.board[shape.rookFrom], `the rook must stand home: ${fen}`).toBe(ROOK | colour);
    expect(position.castling & shape.right, `the right must be held: ${fen}`).toBe(shape.right);
    expect(
      shape.kingPath.filter((cell) => isSquareAttackedBy(position, cell, !black)).map(squareName),
      `the king path must be unattacked: ${fen}`,
    ).toEqual([]);
  }
}

/**
 * `ABC-024` `A1`'s corridor, measured through `generateMoves` instead of copied: the squares on
 * which a lone own KNIGHT refuses the option's castle, with king and rook home and only that right
 * held. A knight neither attacks for the enemy nor stands on a home square, so only the `empty`
 * test can be what refuses it. A widened or narrowed production corridor moves this set.
 */
function corridorGenerateMovesRefusesOn(option: string): string[] {
  const base: Readonly<Record<string, string>> = {
    K: "4k3/8/8/8/8/8/8/4K2R w K - 0 1",
    Q: "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
    k: "4k2r/8/8/8/8/8/8/4K3 b k - 0 1",
    q: "r3k3/8/8/8/8/8/8/4K3 b q - 0 1",
  };
  const fen = base[option] as string;
  const knight = KNIGHT | (fen.split(" ")[1] === "b" ? BLACK : 0);
  const pristine = parseFen(fen);
  expect(castles(generateMoves(pristine)), `the ${option} probe castles when empty`).toHaveLength(
    1,
  );

  const refused: string[] = [];
  for (let square = 0; square < 128; square++) {
    if ((square & 0x88) !== 0 || pristine.board[square] !== EMPTY) continue;
    const probe: Position = { ...pristine, board: pristine.board.slice() };
    probe.board[square] = knight;
    if (castles(generateMoves(probe)).length === 0) refused.push(squareName(square));
  }
  return refused.sort();
}

/**
 * `ABC-024` `A2` — king and both rooks home, both corridors clear, NO right held, and the scalars
 * moved off `- 0 1`. Class `clocks` moves `halfmoveClock` and `fullmoveNumber`; class `ep` sets an
 * en-passant square. The ep FENs carry the pawn that made the double push, so they are plausible.
 */
const NO_RIGHT_OFF_DEFAULT_SCALARS: ReadonlyArray<
  readonly [scalars: "clocks" | "ep", fen: string, expected: number]
> = [
  ["clocks", "4k3/8/8/8/8/8/8/R3K2R w - - 5 9", 24],
  ["clocks", "r3k2r/8/8/8/8/8/8/4K3 b - - 5 9", 24],
  ["ep", "4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12", 24],
  ["ep", "r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12", 24],
];

/**
 * `ABC-024` `A2`'s non-inertness controls, one per class: the same white position with BOTH rights
 * held. Both castles are offered, so the scalars are not what suppresses castling in the rows above.
 */
const RIGHT_HELD_OFF_DEFAULT_SCALARS: ReadonlyArray<
  readonly [scalars: "clocks" | "ep", fen: string, expected: number, first: string, second: string]
> = [
  ["clocks", "4k3/8/8/8/8/8/8/R3K2R w KQ - 5 9", 26, "e1g1", "e1c1"],
  ["ep", "4k3/8/8/2p5/8/8/8/R3K2R w KQ c6 0 12", 26, "e1g1", "e1c1"],
];

/** `ABC-024` `A2`: king and both rooks home and both corridors clear, for the side to move. */
function expectBothCastlesShapeHolds(fen: string): void {
  const position = parseFen(fen);
  const black = fen.split(" ")[1] === "b";
  const colour = black ? BLACK : 0;
  for (const option of black ? ["k", "q"] : ["K", "Q"]) {
    const shape = CASTLE_SHAPE[option];
    if (shape === undefined) throw new Error(`unknown option: ${option}`);
    expect(position.board[shape.kingFrom], `the king must stand home: ${fen}`).toBe(KING | colour);
    expect(position.board[shape.rookFrom], `the rook must stand home: ${fen}`).toBe(ROOK | colour);
    expect(
      shape.empty.filter((cell) => position.board[cell] !== EMPTY).map(squareName),
      `the ${option} corridor must be clear: ${fen}`,
    ).toEqual([]);
  }
}

describe("ABC-024 A1 — the `empty` corridor, one row per square of every option, both colours", () => {
  it.each(EMPTY_CORRIDOR_SQUARE)(
    "refuses the %s castle through an occupied %s (%s %s) and still offers the other: %s",
    (option, square, occupant, piece, fen, survivor, expected) => {
      expectCorridorSetup(fen, option, square, occupant, piece);

      const position = parseFen(fen);
      const before = fullState(position);
      expect(castleNames(generateMoves(parseFen(fen))), `generateMoves: ${fen}`).toEqual([
        survivor,
      ]);
      const legal = legalMoves(position);
      expect(castleNames(legal), `legalMoves: ${fen}`).toEqual([survivor]);
      expect(legal, `legalMoves count: ${fen}`).toHaveLength(expected);
      expect(fullState(position), `full state: ${fen}`).toBe(before);
    },
  );
});

describe("ABC-024 A2 — the castling RIGHT, with the scalar fields off `- 0 1`", () => {
  it.each(NO_RIGHT_OFF_DEFAULT_SCALARS)(
    "offers no castle when no right is held, scalars class %s: %s",
    (_scalars, fen, expected) => {
      expectBothCastlesShapeHolds(fen);
      expect(parseFen(fen).castling, `no right held: ${fen}`).toBe(0);
      expectNoCastleAndPure(fen, expected);
    },
  );

  it.each(RIGHT_HELD_OFF_DEFAULT_SCALARS)(
    "control, scalars class %s: the same position with both rights held offers both castles: %s",
    (_scalars, fen, expected, first, second) => {
      expectBothCastlesShapeHolds(fen);
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

describe("ABC-024 A3 — the quantifiers: the corridor and the scalar gap cannot silently regrow", () => {
  it("names every square of every option's `empty` corridor by exactly one A1 row", () => {
    const named = (option: string) =>
      EMPTY_CORRIDOR_SQUARE.filter(([owner]) => owner === option)
        .map(([, square]) => square)
        .sort();

    for (const option of ["K", "Q", "k", "q"]) {
      const shape = CASTLE_SHAPE[option];
      if (shape === undefined) throw new Error(`unknown option: ${option}`);
      const corridor = shape.empty.map(squareName).sort();
      // The copy in this file agrees with what `generateMoves` actually refuses on, so a corridor
      // widened or narrowed in `src/moves.ts` goes red here, not only in the copy.
      expect(corridorGenerateMovesRefusesOn(option), `the ${option} corridor, measured`).toEqual(
        corridor,
      );
      expect(named(option), `every ${option} corridor square named by exactly one A1 row`).toEqual(
        corridor,
      );
    }
    expect(EMPTY_CORRIDOR_SQUARE, "ten corridor squares, ten rows").toHaveLength(10);
    expect(
      EMPTY_CORRIDOR_SQUARE.some(([, , occupant]) => occupant === "enemy"),
      "at least one row holds an ENEMY occupant",
    ).toBe(true);
  });

  it("holds NO_RIGHT_HELD at `- 0 1` and moves every A2 row off it, both classes, both colours", () => {
    const scalarsOf = (fen: string) => fen.split(" ").slice(3).join(" ");
    // The gap, executable: the pre-existing rows sit at the default scalars and cannot see a
    // right test switched off on any other value.
    expect([...new Set(NO_RIGHT_HELD.map(([fen]) => scalarsOf(fen)))]).toEqual(["- 0 1"]);

    const noEpSquare = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1").epSquare;
    for (const [scalars, fen] of NO_RIGHT_OFF_DEFAULT_SCALARS) {
      const position = parseFen(fen);
      expect(scalarsOf(fen), `A2 row must not sit at the default scalars: ${fen}`).not.toBe(
        "- 0 1",
      );
      if (scalars === "clocks") {
        expect(position.halfmoveClock, `halfmoveClock off 0: ${fen}`).not.toBe(0);
        expect(position.fullmoveNumber, `fullmoveNumber off 1: ${fen}`).not.toBe(1);
      } else {
        expect(position.epSquare, `an en-passant square set: ${fen}`).not.toBe(noEpSquare);
      }
    }
    for (const scalars of ["clocks", "ep"] as const) {
      const rows = NO_RIGHT_OFF_DEFAULT_SCALARS.filter(([kind]) => kind === scalars);
      expect(
        rows.map(([, fen]) => fen.split(" ")[1]).sort(),
        `class ${scalars}: one row per colour`,
      ).toEqual(["b", "w"]);
      expect(
        RIGHT_HELD_OFF_DEFAULT_SCALARS.filter(([kind]) => kind === scalars),
        `class ${scalars}: one control`,
      ).toHaveLength(1);
    }
  });
});
