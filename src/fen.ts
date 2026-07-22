/**
 * FEN parsing and serialization.
 *
 * Every rejection names its specific fault and throws before any position is
 * returned — a partially-built position escaping the parser would surface as a
 * baffling bug three modules downstream.
 */

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

function assertBothKingsPresent(position: Position): void {
  let whiteKings = 0;
  let blackKings = 0;

  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = position.board[square] as number;
    if (piece === (KING as number)) whiteKings++;
    else if (piece === (KING | BLACK)) blackKings++;
  }

  if (whiteKings !== 1) {
    throw new FenError(`position must have exactly one white king, found ${whiteKings}`);
  }
  if (blackKings !== 1) {
    throw new FenError(`position must have exactly one black king, found ${blackKings}`);
  }
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
  if (value < minimum) {
    throw new FenError(`${label} must be at least ${minimum}, found ${value}`);
  }
  return value;
}

/** Parses a FEN string. Throws FenError naming the fault; never returns a partial position. */
export function parseFen(fen: string): Position {
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
  assertBothKingsPresent(position);

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

  return position;
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
