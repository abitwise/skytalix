/**
 * The chess position — the single representation every other module reads.
 *
 * Board layout is 0x88: a 128-entry array where square = rank * 16 + file, so
 * a1 = 0, h1 = 7, a8 = 112, h8 = 119. The upper nibble is the rank and the
 * lower nibble is the file, which makes the off-board test a single mask:
 * `(square & 0x88) !== 0`. See memory-bank/50-decisions/ADR-0001 for why.
 */

/** Piece type occupies the low 3 bits; the colour flag is bit 3. */
export const EMPTY = 0;
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

/** Set on a piece to make it black. White pieces are 1..6, black are 9..14. */
export const BLACK = 8;

export const CASTLE_WK = 1;
export const CASTLE_WQ = 2;
export const CASTLE_BK = 4;
export const CASTLE_BQ = 8;

/** Sentinel for "no en-passant square". Deliberately not 0 — 0 is the real square a1. */
export const NO_SQUARE = -1;

export interface Position {
  /** 0x88 board, 128 entries. Off-board squares stay EMPTY and are never read. */
  readonly board: Uint8Array;
  blackToMove: boolean;
  /** Bitwise OR of the CASTLE_* flags. */
  castling: number;
  /** 0x88 index of the en-passant target square, or NO_SQUARE. */
  epSquare: number;
  /** Plies since the last capture or pawn move. Drives the fifty-move rule. */
  halfmoveClock: number;
  /** Increments after Black moves. Starts at 1. */
  fullmoveNumber: number;
}

export const isOnBoard = (square: number): boolean => (square & 0x88) === 0;

export const fileOf = (square: number): number => square & 7;
export const rankOf = (square: number): number => square >> 4;

export const squareAt = (file: number, rank: number): number => rank * 16 + file;

/** Strips the colour flag: `ROOK | BLACK` -> `ROOK`. Returns EMPTY for an empty square. */
export const pieceType = (piece: number): number => piece & 7;

/** True when the piece is black. Only meaningful for a non-EMPTY piece. */
export const isBlack = (piece: number): boolean => (piece & BLACK) !== 0;

const FILE_LETTERS = "abcdefgh";

/** Algebraic name of a square, e.g. 0 -> "a1". Returns "-" for NO_SQUARE. */
export function squareName(square: number): string {
  if (square === NO_SQUARE) return "-";
  return `${FILE_LETTERS[fileOf(square)]}${rankOf(square) + 1}`;
}

/** Parses "e3" into a 0x88 index, or NO_SQUARE when the name is not a valid square. */
export function parseSquareName(name: string): number {
  if (name.length !== 2) return NO_SQUARE;
  const file = FILE_LETTERS.indexOf(name[0] as string);
  const rank = Number(name[1]) - 1;
  if (file < 0 || !Number.isInteger(rank) || rank < 0 || rank > 7) return NO_SQUARE;
  return squareAt(file, rank);
}

export function emptyPosition(): Position {
  return {
    board: new Uint8Array(128),
    blackToMove: false,
    castling: 0,
    epSquare: NO_SQUARE,
    halfmoveClock: 0,
    fullmoveNumber: 1,
  };
}
