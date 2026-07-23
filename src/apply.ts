/**
 * Make / unmake a move — in-place mutation with a small undo record.
 *
 * This is the hottest path in the engine (NFR-001): the search calls makeMove and
 * unmakeMove once per node across millions of nodes. It therefore mutates the
 * position in place and returns a fixed four-field UndoRecord rather than copying
 * the 128-byte board — full-position copying is explicitly rejected by ABC-003 for
 * exactly this reason.
 *
 * Scope is normal moves and captures. This module updates castling *rights* and
 * sets the en-passant *target* on a double push, but does not execute the special
 * moves themselves — castling rook movement, the en-passant capture square, and the
 * promotion piece swap are ABC-004, which extends this same make/unmake mechanism.
 */

import type { Move } from "./moves.ts";
import {
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  NO_SQUARE,
  PAWN,
  type Position,
  pieceType,
} from "./position.ts";

/**
 * The slice of state that makeMove destroys and unmakeMove cannot rederive from the
 * move alone: the captured piece, and the three position fields whose prior value is
 * not a function of the move.
 */
export interface UndoRecord {
  /** Piece that stood on `move.to` before the move, or EMPTY on a quiet move. */
  readonly captured: number;
  /** Castling rights before the move — a move can clear a flag irreversibly. */
  readonly castling: number;
  /** En-passant target before the move. */
  readonly epSquare: number;
  /** Halfmove clock before the move — reset to 0 by a pawn move or a capture. */
  readonly halfmoveClock: number;
}

/**
 * Squares whose vacating (as a move's `from`) or capture (as its `to`) removes a
 * castling right: the two king homes and the four rook homes. A square not listed
 * contributes 0, so the mask is a no-op for every other move.
 */
const CASTLE_LOSS: Readonly<Record<number, number>> = {
  4: CASTLE_WK | CASTLE_WQ, // e1 — white king
  116: CASTLE_BK | CASTLE_BQ, // e8 — black king
  0: CASTLE_WQ, // a1 — white queen-rook
  7: CASTLE_WK, // h1 — white king-rook
  112: CASTLE_BQ, // a8 — black queen-rook
  119: CASTLE_BK, // h8 — black king-rook
};

/** Two ranks in 0x88; the signed distance of a pawn double push. */
const DOUBLE_PUSH = 32;

const castlingLoss = (square: number): number => CASTLE_LOSS[square] ?? 0;

/**
 * Applies `move` to `position` in place and returns the record unmakeMove needs to
 * reverse it exactly. The board's `to` square is the authoritative source of the
 * captured piece — it is read before it is overwritten.
 */
export function makeMove(position: Position, move: Move): UndoRecord {
  const undo: UndoRecord = {
    captured: position.board[move.to] as number,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
  };

  position.board[move.to] = move.piece;
  position.board[move.from] = EMPTY;

  const isPawn = pieceType(move.piece) === PAWN;
  position.halfmoveClock = isPawn || undo.captured !== EMPTY ? 0 : position.halfmoveClock + 1;

  // A double push exposes the skipped square as an en-passant target; every other move clears it.
  position.epSquare =
    isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ? (move.from + move.to) / 2 : NO_SQUARE;

  position.castling &= ~(castlingLoss(move.from) | castlingLoss(move.to));

  // Fullmove counts completed move pairs, so it advances after Black's move — before the flip.
  if (position.blackToMove) position.fullmoveNumber++;
  position.blackToMove = !position.blackToMove;

  return undo;
}

/** Reverses makeMove exactly, restoring every field from `move` and `undo`. */
export function unmakeMove(position: Position, move: Move, undo: UndoRecord): void {
  // Flip the side back first, so the fullmove decrement mirrors makeMove's increment.
  position.blackToMove = !position.blackToMove;
  if (position.blackToMove) position.fullmoveNumber--;

  position.board[move.from] = move.piece;
  position.board[move.to] = undo.captured;

  position.castling = undo.castling;
  position.epSquare = undo.epSquare;
  position.halfmoveClock = undo.halfmoveClock;
}
