/**
 * Pseudo-legal move generation.
 *
 * "Pseudo-legal" is deliberate: these moves obey each piece's movement rules but
 * may still leave the mover's own king in check. Filtering those out is ABC-005,
 * kept separate so each half can be tested on its own.
 *
 * Every offset below is a precomputed table rather than per-call arithmetic — this
 * is the innermost loop of the search (NFR-001), and 0x88 makes the edge test that
 * the tables rely on a single mask (ADR-0001).
 */

import {
  BISHOP,
  EMPTY,
  isBlack,
  isOnBoard,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";

/** No special-move flag set. Castling, en passant, and promotion extend this in ABC-004. */
export const FLAG_NONE = 0;

export interface Move {
  readonly from: number;
  readonly to: number;
  /** The piece that moves, colour flag included. */
  readonly piece: number;
  /** The piece standing on `to`, or EMPTY on a quiet move. */
  readonly captured: number;
  readonly flags: number;
}

const DIAGONALS = [17, 15, -15, -17] as const;
const ORTHOGONALS = [16, 1, -1, -16] as const;
const ALL_DIRECTIONS = [...ORTHOGONALS, ...DIAGONALS] as const;
const KNIGHT_LEAPS = [33, 31, 18, 14, -14, -18, -31, -33] as const;
const PAWN_CAPTURE_SIDES = [-1, 1] as const;

/** Directions a sliding piece rides until it hits something or leaves the board. */
const RAYS: Readonly<Record<number, readonly number[]>> = {
  [BISHOP]: DIAGONALS,
  [ROOK]: ORTHOGONALS,
  [QUEEN]: ALL_DIRECTIONS,
};

/** Single-square offsets for the pieces that step rather than slide. */
const STEPS: Readonly<Record<number, readonly number[]>> = {
  [KNIGHT]: KNIGHT_LEAPS,
  [KING]: ALL_DIRECTIONS,
};

const WHITE_PAWN_RANK = 1;
const BLACK_PAWN_RANK = 6;

function addMove(moves: Move[], from: number, to: number, piece: number, captured: number): void {
  moves.push({ from, to, piece, captured, flags: FLAG_NONE });
}

function addStepMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
  offsets: readonly number[],
): void {
  for (const offset of offsets) {
    const to = from + offset;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) === black) continue;

    addMove(moves, from, to, piece, target);
  }
}

function addRayMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
  offsets: readonly number[],
): void {
  for (const offset of offsets) {
    for (let to = from + offset; isOnBoard(to); to += offset) {
      const target = position.board[to] as number;

      if (target === EMPTY) {
        addMove(moves, from, to, piece, EMPTY);
        continue;
      }
      // The ray stops on the first piece either way; it captures only an enemy.
      if (isBlack(target) !== black) addMove(moves, from, to, piece, target);
      break;
    }
  }
}

function addPawnMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
): void {
  const forward = black ? -16 : 16;
  const push = from + forward;

  if (isOnBoard(push) && position.board[push] === EMPTY) {
    addMove(moves, from, push, piece, EMPTY);

    // A double push is reachable only from the starting rank, which puts its
    // destination on the board unconditionally — no second edge test needed.
    const doublePush = push + forward;
    const startRank = black ? BLACK_PAWN_RANK : WHITE_PAWN_RANK;
    if (rankOf(from) === startRank && position.board[doublePush] === EMPTY) {
      addMove(moves, from, doublePush, piece, EMPTY);
    }
  }

  for (const side of PAWN_CAPTURE_SIDES) {
    const to = push + side;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) !== black) addMove(moves, from, to, piece, target);
  }
}

/** Every pseudo-legal move for the side to move, in no guaranteed order. */
export function generateMoves(position: Position): Move[] {
  const moves: Move[] = [];
  const black = position.blackToMove;

  for (let from = 0; from < 128; from++) {
    if (!isOnBoard(from)) continue;

    const piece = position.board[from] as number;
    if (piece === EMPTY || isBlack(piece) !== black) continue;

    const type = pieceType(piece);
    if (type === PAWN) {
      addPawnMoves(moves, position, from, piece, black);
      continue;
    }

    const steps = STEPS[type];
    if (steps !== undefined) {
      addStepMoves(moves, position, from, piece, black, steps);
      continue;
    }

    addRayMoves(moves, position, from, piece, black, RAYS[type] as readonly number[]);
  }

  return moves;
}
