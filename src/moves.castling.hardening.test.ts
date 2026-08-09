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
 */

import { describe, expect, it } from "vitest";
import { parseFen, toFen } from "./fen.ts";
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
