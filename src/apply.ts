/**
 * Make / unmake a move — in-place mutation with a small undo record.
 *
 * This is the hottest path in the engine (NFR-001): the search calls makeMove and
 * unmakeMove once per node across millions of nodes. It therefore mutates the
 * position in place and returns a fixed four-field UndoRecord rather than copying
 * the 128-byte board — full-position copying is explicitly rejected by ABC-003 for
 * exactly this reason.
 *
 * ABC-004 extends this same mechanism with the three special moves — castling rook
 * movement, the en-passant capture square, and the promotion piece swap — kept off
 * the common path: a single `flags === FLAG_NONE` fast path handles every ordinary
 * move and capture untouched, and only a flagged move pays for the special handling.
 */

import { FLAG_EN_PASSANT, FLAG_NONE, FLAG_PROMOTION, type Move } from "./moves.ts";
import {
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  isBlack,
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
 * The rook's leg of a castle, keyed by the king's destination square. Derivable from the
 * king move alone, so the Move need carry only a FLAG_CASTLE flag, not the rook squares.
 */
const CASTLE_ROOK_MOVE: Readonly<Record<number, readonly [from: number, to: number]>> = {
  6: [7, 5], //   white kingside:  h1 -> f1
  2: [0, 3], //   white queenside: a1 -> d1
  118: [119, 117], // black kingside:  h8 -> f8
  114: [112, 115], // black queenside: a8 -> d8
};

/** The square the en-passant-captured pawn stands on: one rank behind the target, same file. */
const enPassantCaptureSquare = (move: Move): number => move.to + (isBlack(move.piece) ? 16 : -16);

/**
 * The special-move half of makeMove, reached only for a flagged move. The generic step in
 * makeMove has already moved the mover onto `to`; this finishes the parts that step cannot
 * express: swapping in the promoted piece, removing the ep-captured pawn, or moving the rook.
 */
function applySpecial(position: Position, move: Move): void {
  if ((move.flags & FLAG_PROMOTION) !== 0) {
    position.board[move.to] = move.promotion | (isBlack(move.piece) ? BLACK : 0);
    return;
  }
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    position.board[enPassantCaptureSquare(move)] = EMPTY;
    return;
  }
  // FLAG_CASTLE — the king is already on `to`; send the rook to the far side of it.
  const [rookFrom, rookTo] = CASTLE_ROOK_MOVE[move.to] as readonly [number, number];
  position.board[rookTo] = position.board[rookFrom] as number;
  position.board[rookFrom] = EMPTY;
}

/**
 * The special-move half of unmakeMove. The generic step has already put the mover back on
 * `from` and restored `to` from the undo record; promotion needs nothing more (the mover
 * IS the pawn), en passant restores the captured pawn beside `to`, castling sends the rook
 * home.
 */
function undoSpecial(position: Position, move: Move): void {
  if ((move.flags & FLAG_PROMOTION) !== 0) return;
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    position.board[enPassantCaptureSquare(move)] = move.captured;
    return;
  }
  const [rookFrom, rookTo] = CASTLE_ROOK_MOVE[move.to] as readonly [number, number];
  position.board[rookFrom] = position.board[rookTo] as number;
  position.board[rookTo] = EMPTY;
}

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

  if (move.flags !== FLAG_NONE) applySpecial(position, move);

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

  if (move.flags !== FLAG_NONE) undoSpecial(position, move);

  position.castling = undo.castling;
  position.epSquare = undo.epSquare;
  position.halfmoveClock = undo.halfmoveClock;
}

/** The two position fields a null move overwrites and unmakeNullMove restores. */
export interface NullUndo {
  /** En-passant target before the null move. */
  readonly epSquare: number;
  /** Halfmove clock before the null move. */
  readonly halfmoveClock: number;
}

/**
 * The side to move passes (`ABC-208`, `ADR-0050` decision 7): no piece moves, the en-passant
 * target clears, and the halfmove clock RESTARTS at 0, so the search's repetition scan never
 * reaches back across a pass. The fullmove number moves as makeMove moves it.
 */
export function makeNullMove(position: Position): NullUndo {
  const undo: NullUndo = { epSquare: position.epSquare, halfmoveClock: position.halfmoveClock };
  position.epSquare = NO_SQUARE;
  position.halfmoveClock = 0;
  if (position.blackToMove) position.fullmoveNumber++;
  position.blackToMove = !position.blackToMove;
  return undo;
}

/** Reverses makeNullMove exactly. */
export function unmakeNullMove(position: Position, undo: NullUndo): void {
  position.blackToMove = !position.blackToMove;
  if (position.blackToMove) position.fullmoveNumber--;
  position.epSquare = undo.epSquare;
  position.halfmoveClock = undo.halfmoveClock;
}
