/**
 * Pseudo-legal move generation.
 *
 * "Pseudo-legal" is deliberate: these moves obey each piece's movement rules but
 * may still leave the mover's own king in check. Filtering those out is ABC-005,
 * kept separate so each half can be tested on its own. The ONE exception is
 * castling: its own through-check rule (the king may not start, pass through, or
 * land on an attacked square) is a castling rule, not a general legality rule, so
 * ABC-004 applies it here via `isSquareAttackedBy` — the same attack primitive
 * ABC-005 then consumes for full legality filtering.
 *
 * Every offset below is a precomputed table rather than per-call arithmetic — this
 * is the innermost loop of the search (NFR-001), and 0x88 makes the edge test that
 * the tables rely on a single mask (ADR-0001).
 */

import {
  BISHOP,
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
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

/** No special-move flag set — an ordinary quiet move or capture. */
export const FLAG_NONE = 0;
/** The move is a pawn capturing en passant; `to` is the empty target, `captured` the enemy pawn beside it. */
export const FLAG_EN_PASSANT = 1;
/** The move is a castle; the rook's leg is derived from the king's destination `to`. */
export const FLAG_CASTLE = 2;
/** The move is a pawn promotion; `promotion` names the piece type the pawn becomes. */
export const FLAG_PROMOTION = 4;

export interface Move {
  readonly from: number;
  readonly to: number;
  /** The piece that moves, colour flag included. */
  readonly piece: number;
  /** The piece standing on `to`, or EMPTY on a quiet move. For en passant, the captured pawn (not on `to`). */
  readonly captured: number;
  readonly flags: number;
  /** For a FLAG_PROMOTION move, the piece TYPE the pawn becomes (QUEEN…KNIGHT); EMPTY otherwise. */
  readonly promotion: number;
}

const DIAGONALS = [17, 15, -15, -17] as const;
const ORTHOGONALS = [16, 1, -1, -16] as const;
const ALL_DIRECTIONS = [...ORTHOGONALS, ...DIAGONALS] as const;
const KNIGHT_LEAPS = [33, 31, 18, 14, -14, -18, -31, -33] as const;
const PAWN_CAPTURE_SIDES = [-1, 1] as const;

/** The four pieces a pawn may promote to. Q first so a bare "take the first promotion" defaults sanely. */
const PROMOTION_PIECES = [QUEEN, ROOK, BISHOP, KNIGHT] as const;

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
  moves.push({ from, to, piece, captured, flags: FLAG_NONE, promotion: EMPTY });
}

/** A pawn reaching the last rank: one move per promotion piece, quiet or capture alike. */
function addPromotions(
  moves: Move[],
  from: number,
  to: number,
  piece: number,
  captured: number,
): void {
  for (const promotion of PROMOTION_PIECES) {
    moves.push({ from, to, piece, captured, flags: FLAG_PROMOTION, promotion });
  }
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

const WHITE_PROMOTION_RANK = 7;
const BLACK_PROMOTION_RANK = 0;

function addPawnMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
): void {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const promotionRank = black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK;

  if (isOnBoard(push) && position.board[push] === EMPTY) {
    if (rankOf(push) === promotionRank) {
      addPromotions(moves, from, push, piece, EMPTY);
    } else {
      addMove(moves, from, push, piece, EMPTY);

      // A double push is reachable only from the starting rank, which puts its
      // destination on the board unconditionally — no second edge test needed.
      const doublePush = push + forward;
      const startRank = black ? BLACK_PAWN_RANK : WHITE_PAWN_RANK;
      if (rankOf(from) === startRank && position.board[doublePush] === EMPTY) {
        addMove(moves, from, doublePush, piece, EMPTY);
      }
    }
  }

  for (const side of PAWN_CAPTURE_SIDES) {
    const to = push + side;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) !== black) {
      if (rankOf(to) === promotionRank) addPromotions(moves, from, to, piece, target);
      else addMove(moves, from, to, piece, target);
      continue;
    }

    // En passant: the target square is empty, but it is this move's `epSquare` and the
    // captured pawn sits beside the mover on `to`'s file, one rank back. Reaching an
    // ep target is only geometrically possible from the correct rank, so the file/rank
    // guard is implicit in `to === epSquare`.
    if (to === position.epSquare) {
      moves.push({
        from,
        to,
        piece,
        captured: PAWN | (black ? 0 : BLACK),
        flags: FLAG_EN_PASSANT,
        promotion: EMPTY,
      });
    }
  }
}

/**
 * Rides `offset` from `square` until the first piece; true if that piece is an enemy
 * slider of the ray's kind (or a queen, which rides every ray). An empty ray or a
 * blocker of the wrong kind is not an attack.
 */
function raySliderAttacks(
  position: Position,
  square: number,
  offset: number,
  sliderType: number,
  byBlack: boolean,
): boolean {
  for (let to = square + offset; isOnBoard(to); to += offset) {
    const piece = position.board[to] as number;
    if (piece === EMPTY) continue;
    if (isBlack(piece) === byBlack) {
      const type = pieceType(piece);
      return type === sliderType || type === QUEEN;
    }
    return false; // first blocker is friendly (to the attacker) or the wrong slider — the ray is spent
  }
  return false;
}

/**
 * Is `square` attacked by any piece of the colour named by `byBlack`? The primitive the
 * castling through-check rule stands on here, and the one ABC-005 consumes for full
 * legality filtering and check detection. `square` need not be occupied — attack is a
 * property of the board geometry, not of what stands on the target.
 */
export function isSquareAttackedBy(position: Position, square: number, byBlack: boolean): boolean {
  const board = position.board;
  const enemyPawn = PAWN | (byBlack ? BLACK : 0);

  // A pawn attacks the two squares diagonally ahead of it, so an attacker sits one rank
  // "behind" the target relative to its own advance direction.
  const pawnRank = byBlack ? square + 16 : square - 16;
  for (const side of PAWN_CAPTURE_SIDES) {
    const from = pawnRank + side;
    if (isOnBoard(from) && board[from] === enemyPawn) return true;
  }

  const enemyKnight = KNIGHT | (byBlack ? BLACK : 0);
  for (const offset of KNIGHT_LEAPS) {
    const from = square + offset;
    if (isOnBoard(from) && board[from] === enemyKnight) return true;
  }

  const enemyKing = KING | (byBlack ? BLACK : 0);
  for (const offset of ALL_DIRECTIONS) {
    const from = square + offset;
    if (isOnBoard(from) && board[from] === enemyKing) return true;
  }

  for (const offset of DIAGONALS) {
    if (raySliderAttacks(position, square, offset, BISHOP, byBlack)) return true;
  }
  for (const offset of ORTHOGONALS) {
    if (raySliderAttacks(position, square, offset, ROOK, byBlack)) return true;
  }

  return false;
}

/**
 * A castling option: the right that must be held, the king's two-square hop, the squares
 * between king and rook that must be EMPTY, and the squares the king stands on or crosses
 * that must not be attacked (its origin included — a king in check may not castle). The
 * rook's own leg is derived from the king's destination in apply.ts.
 */
interface CastleOption {
  readonly right: number;
  readonly kingFrom: number;
  readonly kingTo: number;
  readonly empty: readonly number[];
  readonly kingPath: readonly number[];
}

// Squares in 0x88: e1=4 f1=5 g1=6 d1=3 c1=2 b1=1 a1=0; e8=116 f8=117 g8=118 d8=115 c8=114 b8=113 a8=112.
const WHITE_CASTLES: readonly CastleOption[] = [
  { right: CASTLE_WK, kingFrom: 4, kingTo: 6, empty: [5, 6], kingPath: [4, 5, 6] },
  { right: CASTLE_WQ, kingFrom: 4, kingTo: 2, empty: [1, 2, 3], kingPath: [4, 3, 2] },
];
const BLACK_CASTLES: readonly CastleOption[] = [
  { right: CASTLE_BK, kingFrom: 116, kingTo: 118, empty: [117, 118], kingPath: [116, 117, 118] },
  {
    right: CASTLE_BQ,
    kingFrom: 116,
    kingTo: 114,
    empty: [113, 114, 115],
    kingPath: [116, 115, 114],
  },
];

/**
 * Adds the legal castling moves for the side to move. Unlike the rest of generation these
 * are filtered for the through-check rule (ABC-004 scope), so a castle never appears when
 * the king would start, cross, or land in check.
 */
function addCastlingMoves(moves: Move[], position: Position, black: boolean): void {
  const options = black ? BLACK_CASTLES : WHITE_CASTLES;
  const attackerIsBlack = !black;
  const king = KING | (black ? BLACK : 0);

  for (const option of options) {
    if ((position.castling & option.right) === 0) continue;
    if (option.empty.some((square) => position.board[square] !== EMPTY)) continue;
    if (option.kingPath.some((square) => isSquareAttackedBy(position, square, attackerIsBlack))) {
      continue;
    }
    moves.push({
      from: option.kingFrom,
      to: option.kingTo,
      piece: king,
      captured: EMPTY,
      flags: FLAG_CASTLE,
      promotion: EMPTY,
    });
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

  addCastlingMoves(moves, position, black);

  return moves;
}
