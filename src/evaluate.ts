/**
 * Static evaluation — material plus piece-square tables (ABC-076).
 *
 * One pure function: a position in, a centipawn score out, in the NEGAMAX convention —
 * positive is good for the SIDE TO MOVE, never "good for white". The search (ABC-077) can
 * therefore negate on every ply without knowing whose turn it is.
 *
 * There is no search here, no state, no cache, and no terminal scoring: mate and stalemate
 * depend on distance to the root, which a bare position cannot know, so they are ABC-077's.
 *
 * Every number below is HAND-TUNED and expected to move. Tests assert relations (a minor
 * piece outweighs the whole positional term; a centralised knight beats a knight at home),
 * never totals — the one exception being the start position, which is exactly 0 by symmetry.
 */

import { EMPTY, isBlack, type Position, pieceType } from "./position.ts";

/**
 * Centipawn value per piece type, indexed by `pieceType` (PAWN=1 … KING=6). Index 0 is EMPTY
 * and is never read. The king is 0: both sides always have exactly one, so any value cancels,
 * and a finite one would only invite a search to "win" it.
 */
const PIECE_VALUE: readonly number[] = [
  0, // EMPTY
  100, // PAWN
  320, // KNIGHT
  330, // BISHOP
  500, // ROOK
  900, // QUEEN
  0, // KING
];

/**
 * One table per piece type, written from WHITE's point of view and read RANK-8-FIRST — the
 * layout below is the board as printed, a8 top-left. Black reads the same table with the rank
 * flipped, which is what makes the mirror exact and A1's symmetry property meaningful.
 *
 * Deliberately small and hand-written, as the ticket asks. No tapering, no endgame variants.
 */
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
   50, 50, 50, 50, 50, 50, 50, 50,
   10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_TABLE: readonly number[] = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_TABLE: readonly number[] = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_TABLE: readonly number[] = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_TABLE: readonly number[] = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

/** Indexed by `pieceType`, exactly like PIECE_VALUE. Index 0 is EMPTY and is never read. */
const PIECE_SQUARE_TABLE: readonly (readonly number[])[] = [
  PAWN_TABLE, // EMPTY — never read; keeps the index aligned with pieceType
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_TABLE,
];

/**
 * Score of a position from WHITE's point of view: white's material and placement minus
 * black's. Kept separate from the negamax flip so the sign convention lives in exactly one
 * place and the tables are read exactly once per piece.
 */
function whiteMinusBlack(position: Position): number {
  const board = position.board;
  let score = 0;

  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank * 16 + file] as number;
      if (piece === EMPTY) continue;

      const type = pieceType(piece);
      const black = isBlack(piece);
      // White reads the table rank-8-first; black reads the same table with the rank flipped.
      const tableIndex = (black ? rank : 7 - rank) * 8 + file;
      const value =
        (PIECE_VALUE[type] as number) +
        ((PIECE_SQUARE_TABLE[type] as readonly number[])[tableIndex] as number);

      score += black ? -value : value;
    }
  }

  return score;
}

/**
 * The static score of `position` in centipawns, positive for the side to move.
 *
 * Pure: it reads the position and writes nothing — not even transiently. (`zobristKey` on this
 * codebase does mutate transiently, which is why ABC-076's A5 asserts byte-identity here.)
 */
export function evaluate(position: Position): number {
  const score = whiteMinusBlack(position);
  // `0 - score`, not `-score`: negating a balanced position yields `-0`, which is `Object.is`
  // -distinct from `0` and so is NOT "exactly equal" to its mirror's score. Caught by A1 at
  // startpos-with-black-to-move; `0 - 0` is `+0`.
  return position.blackToMove ? 0 - score : score;
}
