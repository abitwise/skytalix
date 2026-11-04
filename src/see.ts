/**
 * Static exchange evaluation (`ABC-279`, `ADR-0069` decision 4): what a capture wins or loses in
 * centipawns once every piece bearing on its target square has traded off, cheapest first.
 *
 * The algorithm is `ADR-0065` decision 2's. A swap list on the target square: each side in turn
 * recaptures with its LEAST valuable attacker; a slider standing behind a piece that has already
 * captured joins in (an x-ray, on either side); pins are ignored; the king comes last, at 20 000,
 * so a king that "recaptures" into a defended square loses everything. Then the list is folded
 * back from the end, each side free to stop trading when going on would lose.
 *
 * Pure: it reads the board and leaves it byte-identical. It allocates nothing per call (the
 * `ABC-240` rule): the removed-square mask, the gain list and the squares to restore are fixed
 * module scratch, `seeScratchByteLength()` bytes in all, counted in `NFR-009` (a)'s sum.
 *
 * Its one caller is `src/quiescence.ts`, through `isLosingCapture`, behind the `seePruning` rule
 * (`ADR-0069` decisions 1-3). The main search computes no SEE (decision 5).
 */

import type { Move } from "./moves.ts";
import {
  BISHOP,
  BLACK,
  EMPTY,
  isOnBoard,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
} from "./position.ts";

/** Exchange values by `pieceType`: `ORDER_VALUE`'s (100 / 320 / 330 / 500 / 900), the king large. */
const SEE_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 20_000];

/** 1 on a square whose piece has already captured on the target, so a ray sees through it. */
const REMOVED = new Uint8Array(128);
/** The swap list: `GAIN[d]` is what the side making capture `d` stands to win if play stopped there. */
const GAIN = new Int32Array(32);
/** The squares set in `REMOVED` by this call, cleared before it returns. */
const RESTORE = new Uint8Array(32);

const DIAGONALS: readonly number[] = [17, 15, -15, -17];
const ORTHOGONALS: readonly number[] = [16, 1, -1, -16];
const KNIGHT_OFFSETS: readonly number[] = [33, 31, 18, 14, -14, -18, -31, -33];
/** The king's eight steps, diagonals first (the order the probe read). */
const KING_OFFSETS: readonly number[] = [17, 15, -15, -17, 16, 1, -1, -16];

/** The first occupied, not-yet-removed square from `square` along `step`, or -1. */
function firstOnRay(board: Uint8Array, square: number, step: number): number {
  let at = square + step;
  while (isOnBoard(at)) {
    if (board[at] !== EMPTY && REMOVED[at] === 0) return at;
    at += step;
  }
  return -1;
}

/**
 * The square of `black`'s least valuable piece attacking `square`, or -1: pawn, knight, bishop,
 * rook, queen, king. A piece already removed is skipped, so a slider behind it is found.
 */
function leastAttacker(board: Uint8Array, square: number, black: boolean): number {
  const colour = black ? BLACK : 0;
  const pawnRank = black ? square + 16 : square - 16;
  const pawn = PAWN | colour;
  if (isOnBoard(pawnRank - 1) && REMOVED[pawnRank - 1] === 0 && board[pawnRank - 1] === pawn) {
    return pawnRank - 1;
  }
  if (isOnBoard(pawnRank + 1) && REMOVED[pawnRank + 1] === 0 && board[pawnRank + 1] === pawn) {
    return pawnRank + 1;
  }
  const knight = KNIGHT | colour;
  for (let i = 0; i < KNIGHT_OFFSETS.length; i++) {
    const from = square + (KNIGHT_OFFSETS[i] as number);
    if (isOnBoard(from) && REMOVED[from] === 0 && board[from] === knight) return from;
  }
  const queen = QUEEN | colour;
  let rookAt = -1;
  let queenAt = -1;
  for (let i = 0; i < DIAGONALS.length; i++) {
    const from = firstOnRay(board, square, DIAGONALS[i] as number);
    if (from === -1) continue;
    if (board[from] === (BISHOP | colour)) return from;
    if (board[from] === queen) queenAt = from;
  }
  for (let i = 0; i < ORTHOGONALS.length; i++) {
    const from = firstOnRay(board, square, ORTHOGONALS[i] as number);
    if (from === -1) continue;
    if (board[from] === (ROOK | colour) && rookAt === -1) rookAt = from;
    if (board[from] === queen && queenAt === -1) queenAt = from;
  }
  if (rookAt !== -1) return rookAt;
  if (queenAt !== -1) return queenAt;
  const king = KING | colour;
  for (let i = 0; i < KING_OFFSETS.length; i++) {
    const from = square + (KING_OFFSETS[i] as number);
    if (isOnBoard(from) && REMOVED[from] === 0 && board[from] === king) return from;
  }
  return -1;
}

/**
 * The static exchange value of the capture `move` on `position`, in centipawns for the side
 * making it. `move` must be a legal capture of `position`'s side to move. The board is unchanged.
 */
export function see(position: Position, move: Move): number {
  const board = position.board;
  const target = move.to;
  REMOVED[move.from] = 1;
  RESTORE[0] = move.from;
  let restored = 1;
  let onTarget = SEE_VALUE[pieceType(move.piece)] as number;
  GAIN[0] = SEE_VALUE[pieceType(move.captured)] as number;
  let black = (move.piece & BLACK) === 0;
  let depth = 0;
  for (;;) {
    const from = leastAttacker(board, target, black);
    if (from === -1) break;
    depth++;
    GAIN[depth] = onTarget - (GAIN[depth - 1] as number);
    onTarget = SEE_VALUE[pieceType(board[from] as number)] as number;
    REMOVED[from] = 1;
    RESTORE[restored++] = from;
    black = !black;
  }
  for (let i = 0; i < restored; i++) REMOVED[RESTORE[i] as number] = 0;
  while (depth > 0) {
    GAIN[depth - 1] = 0 - Math.max(0 - (GAIN[depth - 1] as number), GAIN[depth] as number);
    depth--;
  }
  return GAIN[0] as number;
}

/**
 * `ADR-0069` decision 2: a capture is LOSING when every clause holds — it does not promote, the
 * mover is not the king, the victim is worth less than the attacker, and `see < 0`. So en
 * passant, a capture of an equal or bigger piece and every capturing promotion are never losing,
 * and SEE is computed only when the victim is worth less. The threshold is 0, fixed.
 */
export function isLosingCapture(position: Position, move: Move): boolean {
  if (move.captured === EMPTY || move.promotion !== EMPTY) return false;
  const attacker = pieceType(move.piece);
  if (attacker === KING) return false;
  if ((SEE_VALUE[pieceType(move.captured)] as number) >= (SEE_VALUE[attacker] as number)) {
    return false;
  }
  return see(position, move) < 0;
}

/** The SEE scratch's fixed size in bytes (128 + 128 + 32 = 288), for `NFR-009` (a)'s byte-length sum. */
export function seeScratchByteLength(): number {
  return REMOVED.byteLength + GAIN.byteLength + RESTORE.byteLength;
}
