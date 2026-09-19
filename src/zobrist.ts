/**
 * Zobrist hashing — a 64-bit key for a position's repetition-relevant state.
 *
 * Two positions repeat (for the threefold rule) when they share piece placement, side to
 * move, castling rights, and en-passant availability — but NOT the move counters. The Zobrist
 * key XORs one random 64-bit number per (piece, square), plus one for black-to-move, the
 * castling rights, and the en-passant file, so exactly those four components decide equality.
 *
 * The en-passant component enters the key iff the position CARRIES an ep square
 * (`epSquare !== NO_SQUARE`) — ADR-0020, the owner's 2026-09-19 ruling, superseding ADR-0005
 * clause 1. ADR-0005 had it enter only when a LEGAL ep capture existed, which made the key play a
 * probe move through legal.ts and made the ep component impossible to XOR-update; under ADR-0020
 * `zobristKey` is a pure read of the board again, and `zobristKeyAfterMove` below derives the key
 * of the position after a move from the key before it in a bounded number of XORs. The price,
 * recorded in ADR-0020 Decision 2: two positions that differ only in an ep square nobody can
 * capture on hash DIFFERENTLY — a transposition-table miss and a repetition counted one occurrence
 * late, never a wrong answer in either consumer.
 *
 * ABC-007 is the first ticket that needs it (repetition detection); EPIC-004's transposition
 * table is the second, which is why hashing is its own module rather than buried in game-end.
 *
 * The random table is built from a FIXED seed via splitmix64, so keys are deterministic — the
 * same position always hashes to the same value, within a run and across runs. `Math.random`
 * is deliberately avoided: a table that varied per run would make hashes unreproducible.
 */

import type { UndoRecord } from "./apply.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";
import {
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  fileOf,
  isBlack,
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

/** The square the en-passant-captured pawn stood on: one rank behind the target, same file. */
const enPassantCaptureSquare = (move: Move): number => move.to + (isBlack(move.piece) ? 16 : -16);

/**
 * The key of `position` AFTER `makeMove(position, move)` returned `undo`, derived from the key it
 * had BEFORE (ADR-0020 Decision 3). Pure; reads `position` and writes nothing. Invariant, asserted
 * against the oracle over a depth-4 walk of the perft positions in `zobrist.test.ts`:
 *   zobristKeyAfterMove(zobristKey(before), after, move, undo) === zobristKey(after)
 *
 * The six components the delta touches, in order: the mover leaves `from` and whatever now stands
 * on `to` lands (the promoted piece on a promotion, read off the board rather than re-derived);
 * the captured piece leaves `to` (or the ep capture square under FLAG_EN_PASSANT, where `to` was
 * empty and `undo.captured` is EMPTY); the rook's leg under FLAG_CASTLE; every castling flag that
 * changed; the ep file out if the position carried one before and in if it carries one now; and
 * the side to move, always. The search keeps the per-ply array this feeds (ADR-0002 clause 3,
 * ABC-081) — `unmakeMove` needs no key work because `keys[ply]` still holds the pre-move key.
 */
export function zobristKeyAfterMove(
  keyBefore: bigint,
  position: Position,
  move: Move,
  undo: UndoRecord,
): bigint {
  const board = position.board;
  let key = keyBefore ^ BLACK_TO_MOVE;

  key ^= PIECE_SQUARE[(move.piece << 7) | move.from] as bigint;
  key ^= PIECE_SQUARE[((board[move.to] as number) << 7) | move.to] as bigint;

  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    key ^= PIECE_SQUARE[(move.captured << 7) | enPassantCaptureSquare(move)] as bigint;
  } else if (undo.captured !== EMPTY) {
    key ^= PIECE_SQUARE[(undo.captured << 7) | move.to] as bigint;
  }

  if ((move.flags & FLAG_CASTLE) !== 0) {
    // The king sits on `to`; the rook came from the corner beyond it and now stands beside it.
    const kingside = fileOf(move.to) === 6;
    const rookFrom = kingside ? move.to + 1 : move.to - 2;
    const rookTo = kingside ? move.to - 1 : move.to + 1;
    const rook = board[rookTo] as number;
    key ^= PIECE_SQUARE[(rook << 7) | rookFrom] as bigint;
    key ^= PIECE_SQUARE[(rook << 7) | rookTo] as bigint;
  }

  const castlingChanged = undo.castling ^ position.castling;
  if (castlingChanged !== 0) {
    for (let i = 0; i < CASTLE_FLAGS.length; i++) {
      if ((castlingChanged & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;
    }
  }

  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;
  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;

  return key;
}
