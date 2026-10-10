/**
 * FEN parsing and serialization.
 *
 * Every rejection names its specific fault and throws before any position is
 * returned — a partially-built position escaping the parser would surface as a
 * baffling bug three modules downstream.
 *
 * `parseFen` checks grammar, then semantics (ADR-0033): a board no game can reach is
 * rejected. `parseFenGrammarOnly` checks grammar only and exists for rules-core tests
 * that feed impossible boards on purpose; no production module may name it.
 */

import { isSquareAttackedBy } from "./moves.ts";
import {
  BISHOP,
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  emptyPosition,
  isOnBoard,
  KING,
  KNIGHT,
  NO_SQUARE,
  PAWN,
  type Position,
  parseSquareName,
  QUEEN,
  ROOK,
  squareAt,
  squareName,
} from "./position.ts";

export class FenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FenError";
  }
}

const PIECE_BY_CHAR: Readonly<Record<string, number>> = {
  p: PAWN,
  n: KNIGHT,
  b: BISHOP,
  r: ROOK,
  q: QUEEN,
  k: KING,
};

const CHAR_BY_PIECE: Readonly<Record<number, string>> = {
  [PAWN]: "p",
  [KNIGHT]: "n",
  [BISHOP]: "b",
  [ROOK]: "r",
  [QUEEN]: "q",
  [KING]: "k",
};

const CASTLING_FLAGS: ReadonlyArray<readonly [char: string, flag: number]> = [
  ["K", CASTLE_WK],
  ["Q", CASTLE_WQ],
  ["k", CASTLE_BK],
  ["q", CASTLE_BQ],
];

function parsePlacement(placement: string, position: Position): void {
  const ranks = placement.split("/");
  if (ranks.length !== 8) {
    throw new FenError(`placement must have 8 ranks separated by "/", found ${ranks.length}`);
  }

  // FEN lists rank 8 first, so index 0 of `ranks` is rank 8 (0x88 rank 7).
  for (let i = 0; i < 8; i++) {
    const rankText = ranks[i] as string;
    const rank = 7 - i;
    let file = 0;

    for (const char of rankText) {
      if (char >= "1" && char <= "8") {
        file += Number(char);
        continue;
      }

      const type = PIECE_BY_CHAR[char.toLowerCase()];
      if (type === undefined) {
        throw new FenError(`illegal character "${char}" in placement rank ${rank + 1}`);
      }
      if (file > 7) {
        throw new FenError(`rank ${rank + 1} describes more than 8 squares`);
      }

      const isBlack = char === char.toLowerCase();
      position.board[squareAt(file, rank)] = isBlack ? type | BLACK : type;
      file++;
    }

    if (file !== 8) {
      throw new FenError(`rank ${rank + 1} describes ${file} squares, expected 8`);
    }
  }
}

/** Returns the two king squares, so the in-check rule needs no second scan (ADR-0033). */
function assertBothKingsPresent(position: Position): [white: number, black: number] {
  let whiteKings = 0;
  let blackKings = 0;
  let whiteKing = NO_SQUARE;
  let blackKing = NO_SQUARE;

  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = position.board[square] as number;
    if (piece === (KING as number)) {
      whiteKings++;
      whiteKing = square;
    } else if (piece === (KING | BLACK)) {
      blackKings++;
      blackKing = square;
    }
  }

  if (whiteKings !== 1) {
    throw new FenError(`position must have exactly one white king, found ${whiteKings}`);
  }
  if (blackKings !== 1) {
    throw new FenError(`position must have exactly one black king, found ${blackKings}`);
  }
  return [whiteKing, blackKing];
}

function parseCastling(field: string, position: Position): void {
  if (field === "-") return;

  for (const char of field) {
    const entry = CASTLING_FLAGS.find(([flagChar]) => flagChar === char);
    if (entry === undefined) {
      throw new FenError(`illegal character "${char}" in castling field`);
    }
    position.castling |= entry[1];
  }
}

function parseClock(field: string, label: string, minimum: number): number {
  if (!/^\d+$/.test(field)) {
    throw new FenError(`${label} must be a non-negative integer, found "${field}"`);
  }
  const value = Number(field);
  // Infinity, 1e+21 and leading zeros would not survive toFen's round trip.
  if (String(value) !== field) {
    const shown = field.length > 24 ? `${field.slice(0, 24)}…` : field;
    throw new FenError(`${label} "${shown}" does not round-trip: it reads back as "${value}"`);
  }
  if (value < minimum) {
    throw new FenError(`${label} must be at least ${minimum}, found ${value}`);
  }
  return value;
}

/** Each castling right's king and rook home squares (0x88). Chess960 is a non-goal. */
const CASTLING_HOMES: ReadonlyArray<
  readonly [char: string, flag: number, colour: number, king: number, rook: number]
> = [
  ["K", CASTLE_WK, 0, 0x04, 0x07],
  ["Q", CASTLE_WQ, 0, 0x04, 0x00],
  ["k", CASTLE_BK, BLACK, 0x74, 0x77],
  ["q", CASTLE_BQ, BLACK, 0x74, 0x70],
];

/** ADR-0033 decision 3(c): the board rules, in order. The first fault found is thrown. */
function assertReachable(position: Position, kings: [white: number, black: number]): void {
  const board = position.board;

  // Ranks 1 and 8 as raw 0x88 squares (a1..h1, a8..h8).
  for (const first of [0x00, 0x70]) {
    for (let square = first; square < first + 8; square++) {
      if (((board[square] as number) & 7) === PAWN) {
        throw new FenError(
          `pawn on ${squareName(square)}: no pawn can stand on rank ${(square >> 4) + 1}`,
        );
      }
    }
  }

  for (const [char, flag, colour, king, rook] of CASTLING_HOMES) {
    if ((position.castling & flag) === 0) continue;
    const side = colour === BLACK ? "black" : "white";
    if (board[king] !== (KING | colour)) {
      throw new FenError(
        `castling right "${char}" is inconsistent with the board: no ${side} king on ${squareName(king)}`,
      );
    }
    if (board[rook] !== (ROOK | colour)) {
      throw new FenError(
        `castling right "${char}" is inconsistent with the board: no ${side} rook on ${squareName(rook)}`,
      );
    }
  }

  const ep = position.epSquare;
  if (ep !== NO_SQUARE) {
    // The side NOT to move just double-pushed: its pawn stands in front of the square, and the
    // origin behind it is empty. No capturer is required (ADR-0005 keeps the square as recorded).
    const whiteToMove = !position.blackToMove;
    const fault = (why: string) =>
      new FenError(`en-passant square ${squareName(ep)} is inconsistent with the board: ${why}`);
    const front = whiteToMove ? ep - 16 : ep + 16;
    const origin = whiteToMove ? ep + 16 : ep - 16;
    if (ep >> 4 !== (whiteToMove ? 5 : 2)) {
      throw fault(
        `it must be on rank ${whiteToMove ? 6 : 3} when ${whiteToMove ? "white" : "black"} is to move`,
      );
    }
    if (board[ep] !== EMPTY) throw fault(`${squareName(ep)} is occupied`);
    if (board[front] !== (PAWN | (whiteToMove ? BLACK : 0))) {
      throw fault(`no ${whiteToMove ? "black" : "white"} pawn on ${squareName(front)}`);
    }
    if (board[origin] !== EMPTY) throw fault(`${squareName(origin)} is occupied`);
  }

  // Last, because it is the costliest: a position where the side to move could capture a king.
  const notToMoveIsBlack = !position.blackToMove;
  const king = notToMoveIsBlack ? kings[1] : kings[0];
  if (isSquareAttackedBy(position, king, position.blackToMove)) {
    throw new FenError(
      `side not to move (${notToMoveIsBlack ? "black" : "white"}) is in check: its king on ${squareName(king)} is attacked`,
    );
  }
}

/**
 * Parses a FEN string: grammar, then the board rules (ADR-0033). Throws FenError naming the
 * fault; never returns a partial position or one no game can reach.
 */
export function parseFen(fen: string): Position {
  const [position, kings] = parseGrammar(fen);
  assertReachable(position, kings);
  return position;
}

/**
 * Grammar only — for rules-core tests that must feed the generator a board no game reaches
 * (ADR-0033 decision 2). No production module may name it; a guard in fen.test.ts enforces that.
 */
export function parseFenGrammarOnly(fen: string): Position {
  return parseGrammar(fen)[0];
}

function describeNonString(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  if (typeof value === "object") return "an object";
  if (typeof value === "number") return "a number";
  return typeof value;
}

function parseGrammar(fen: string): [Position, [white: number, black: number]] {
  if (typeof fen !== "string") {
    throw new FenError(`FEN must be a string, found ${describeNonString(fen)}`);
  }
  const fields = fen.trim().split(/\s+/);
  if (fields.length !== 6) {
    throw new FenError(`FEN must have 6 fields, found ${fields.length}`);
  }

  const [placement, side, castling, enPassant, halfmove, fullmove] = fields as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  const position = emptyPosition();

  parsePlacement(placement, position);
  const kings = assertBothKingsPresent(position);

  if (side !== "w" && side !== "b") {
    throw new FenError(`side to move must be "w" or "b", found "${side}"`);
  }
  position.blackToMove = side === "b";

  parseCastling(castling, position);

  if (enPassant !== "-") {
    const square = parseSquareName(enPassant);
    if (square === NO_SQUARE) {
      throw new FenError(`en-passant field must be "-" or a square, found "${enPassant}"`);
    }
    position.epSquare = square;
  }

  position.halfmoveClock = parseClock(halfmove, "halfmove clock", 0);
  position.fullmoveNumber = parseClock(fullmove, "fullmove number", 1);

  return [position, kings];
}

/** Serializes a position back to FEN. Round-trips byte-identically with parseFen. */
export function toFen(position: Position): string {
  const ranks: string[] = [];

  for (let rank = 7; rank >= 0; rank--) {
    let text = "";
    let emptyRun = 0;

    for (let file = 0; file < 8; file++) {
      const piece = position.board[squareAt(file, rank)] as number;

      if (piece === EMPTY) {
        emptyRun++;
        continue;
      }
      if (emptyRun > 0) {
        text += String(emptyRun);
        emptyRun = 0;
      }

      const char = CHAR_BY_PIECE[piece & 7] as string;
      text += (piece & BLACK) !== 0 ? char : char.toUpperCase();
    }

    if (emptyRun > 0) text += String(emptyRun);
    ranks.push(text);
  }

  const castling =
    CASTLING_FLAGS.filter(([, flag]) => (position.castling & flag) !== 0)
      .map(([char]) => char)
      .join("") || "-";

  return [
    ranks.join("/"),
    position.blackToMove ? "b" : "w",
    castling,
    squareName(position.epSquare),
    String(position.halfmoveClock),
    String(position.fullmoveNumber),
  ].join(" ");
}
