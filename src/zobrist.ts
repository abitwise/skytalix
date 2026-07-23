/**
 * Zobrist hashing — a 64-bit key for a position's repetition-relevant state.
 *
 * Two positions repeat (for the threefold rule) when they share piece placement, side to
 * move, castling rights, and en-passant availability — but NOT the move counters. The Zobrist
 * key XORs one random 64-bit number per (piece, square), plus one for black-to-move, the
 * castling rights, and the en-passant file, so exactly those four components decide equality.
 *
 * ABC-007 is the first ticket that needs it (repetition detection); EPIC-004's transposition
 * table is the second, which is why hashing is its own module rather than buried in game-end.
 *
 * The random table is built from a FIXED seed via splitmix64, so keys are deterministic — the
 * same position always hashes to the same value, within a run and across runs. `Math.random`
 * is deliberately avoided: a table that varied per run would make hashes unreproducible.
 */

import {
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  fileOf,
  isOnBoard,
  NO_SQUARE,
  type Position,
} from "./position.ts";

const MASK64 = (1n << 64n) - 1n;

/** splitmix64: a small, well-distributed PRNG used only to fill the static key tables. */
function splitmix64(seed: bigint): () => bigint {
  let state = seed & MASK64;
  return () => {
    state = (state + 0x9e3779b97f4a7c15n) & MASK64;
    let z = state;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK64;
    return (z ^ (z >> 31n)) & MASK64;
  };
}

const nextRandom = splitmix64(0x1234567890abcdefn);

/** One key per (piece byte 0..14, 0x88 square 0..127), addressed as `piece << 7 | square`. */
const PIECE_SQUARE: readonly bigint[] = Array.from({ length: 15 * 128 }, () => nextRandom());
const BLACK_TO_MOVE = nextRandom();
const CASTLE_FLAGS = [CASTLE_WK, CASTLE_WQ, CASTLE_BK, CASTLE_BQ] as const;
const CASTLE_KEYS: readonly bigint[] = CASTLE_FLAGS.map(() => nextRandom());
const EP_FILE: readonly bigint[] = Array.from({ length: 8 }, () => nextRandom());

/**
 * The Zobrist key of a position's repetition-relevant state: placement, side to move, castling
 * rights, and en-passant file. Ignores the halfmove and fullmove counters by construction.
 */
export function zobristKey(position: Position): bigint {
  let key = 0n;

  const board = position.board;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square] as number;
    if (piece !== 0) key ^= PIECE_SQUARE[(piece << 7) | square] as bigint;
  }

  if (position.blackToMove) key ^= BLACK_TO_MOVE;

  for (let i = 0; i < CASTLE_FLAGS.length; i++) {
    if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;
  }

  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;

  return key;
}
