// .grugops/context/design-ABC-150/probe/workload150.mjs
import { createHash as createHash2 } from "node:crypto";

// src/position.ts
var EMPTY = 0;
var PAWN = 1;
var KNIGHT = 2;
var BISHOP = 3;
var ROOK = 4;
var QUEEN = 5;
var KING = 6;
var BLACK = 8;
var CASTLE_WK = 1;
var CASTLE_WQ = 2;
var CASTLE_BK = 4;
var CASTLE_BQ = 8;
var NO_SQUARE = -1;
var isOnBoard = (square) => (square & 136) === 0;
var fileOf = (square) => square & 7;
var rankOf = (square) => square >> 4;
var squareAt = (file, rank) => rank * 16 + file;
var pieceType = (piece) => piece & 7;
var isBlack = (piece) => (piece & BLACK) !== 0;
var FILE_LETTERS = "abcdefgh";
function squareName(square) {
  if (square === NO_SQUARE) return "-";
  return `${FILE_LETTERS[fileOf(square)]}${rankOf(square) + 1}`;
}
function parseSquareName(name) {
  if (name.length !== 2) return NO_SQUARE;
  const file = FILE_LETTERS.indexOf(name[0]);
  const rank = Number(name[1]) - 1;
  if (file < 0 || !Number.isInteger(rank) || rank < 0 || rank > 7) return NO_SQUARE;
  return squareAt(file, rank);
}
function emptyPosition() {
  return {
    board: new Uint8Array(128),
    blackToMove: false,
    castling: 0,
    epSquare: NO_SQUARE,
    halfmoveClock: 0,
    fullmoveNumber: 1
  };
}

// src/moves.ts
var FLAG_NONE = 0;
var FLAG_EN_PASSANT = 1;
var FLAG_CASTLE = 2;
var FLAG_PROMOTION = 4;
var DIAGONALS = [17, 15, -15, -17];
var ORTHOGONALS = [16, 1, -1, -16];
var ALL_DIRECTIONS = [...ORTHOGONALS, ...DIAGONALS];
var KNIGHT_LEAPS = [33, 31, 18, 14, -14, -18, -31, -33];
var PAWN_CAPTURE_SIDES = [-1, 1];
var PROMOTION_PIECES = [QUEEN, ROOK, BISHOP, KNIGHT];
var RAYS = {
  [BISHOP]: DIAGONALS,
  [ROOK]: ORTHOGONALS,
  [QUEEN]: ALL_DIRECTIONS
};
var STEPS = {
  [KNIGHT]: KNIGHT_LEAPS,
  [KING]: ALL_DIRECTIONS
};
var WHITE_PAWN_RANK = 1;
var BLACK_PAWN_RANK = 6;
function addMove(moves, from, to, piece, captured) {
  moves.push({ from, to, piece, captured, flags: FLAG_NONE, promotion: EMPTY });
}
function addPromotions(moves, from, to, piece, captured) {
  for (const promotion of PROMOTION_PIECES) {
    moves.push({ from, to, piece, captured, flags: FLAG_PROMOTION, promotion });
  }
}
function addStepMoves(moves, position, from, piece, black, offsets) {
  for (const offset of offsets) {
    const to = from + offset;
    if (!isOnBoard(to)) continue;
    const target = position.board[to];
    if (target !== EMPTY && isBlack(target) === black) continue;
    addMove(moves, from, to, piece, target);
  }
}
function addRayMoves(moves, position, from, piece, black, offsets) {
  for (const offset of offsets) {
    for (let to = from + offset; isOnBoard(to); to += offset) {
      const target = position.board[to];
      if (target === EMPTY) {
        addMove(moves, from, to, piece, EMPTY);
        continue;
      }
      if (isBlack(target) !== black) addMove(moves, from, to, piece, target);
      break;
    }
  }
}
var WHITE_PROMOTION_RANK = 7;
var BLACK_PROMOTION_RANK = 0;
function addPawnMoves(moves, position, from, piece, black) {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const promotionRank = black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK;
  if (isOnBoard(push) && position.board[push] === EMPTY) {
    if (rankOf(push) === promotionRank) {
      addPromotions(moves, from, push, piece, EMPTY);
    } else {
      addMove(moves, from, push, piece, EMPTY);
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
    const target = position.board[to];
    if (target !== EMPTY && isBlack(target) !== black) {
      if (rankOf(to) === promotionRank) addPromotions(moves, from, to, piece, target);
      else addMove(moves, from, to, piece, target);
      continue;
    }
    if (to === position.epSquare) {
      const capturedPawn = PAWN | (black ? 0 : BLACK);
      if (target === EMPTY && position.board[to - forward] === capturedPawn) {
        moves.push({
          from,
          to,
          piece,
          captured: capturedPawn,
          flags: FLAG_EN_PASSANT,
          promotion: EMPTY
        });
      }
    }
  }
}
function raySliderAttacks(position, square, offset, sliderType, byBlack) {
  for (let to = square + offset; isOnBoard(to); to += offset) {
    const piece = position.board[to];
    if (piece === EMPTY) continue;
    if (isBlack(piece) === byBlack) {
      const type = pieceType(piece);
      return type === sliderType || type === QUEEN;
    }
    return false;
  }
  return false;
}
function isSquareAttackedBy(position, square, byBlack) {
  const board = position.board;
  const enemyPawn = PAWN | (byBlack ? BLACK : 0);
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
var WHITE_CASTLES = [
  { right: CASTLE_WK, kingFrom: 4, kingTo: 6, rookFrom: 7, empty: [5, 6], kingPath: [4, 5, 6] },
  { right: CASTLE_WQ, kingFrom: 4, kingTo: 2, rookFrom: 0, empty: [1, 2, 3], kingPath: [4, 3, 2] }
];
var BLACK_CASTLES = [
  {
    right: CASTLE_BK,
    kingFrom: 116,
    kingTo: 118,
    rookFrom: 119,
    empty: [117, 118],
    kingPath: [116, 117, 118]
  },
  {
    right: CASTLE_BQ,
    kingFrom: 116,
    kingTo: 114,
    rookFrom: 112,
    empty: [113, 114, 115],
    kingPath: [116, 115, 114]
  }
];
function addCastlingMoves(moves, position, black) {
  const options = black ? BLACK_CASTLES : WHITE_CASTLES;
  const attackerIsBlack = !black;
  const king = KING | (black ? BLACK : 0);
  const rook = ROOK | (black ? BLACK : 0);
  for (const option of options) {
    if ((position.castling & option.right) === 0) continue;
    if (position.board[option.kingFrom] !== king) continue;
    if (position.board[option.rookFrom] !== rook) continue;
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
      promotion: EMPTY
    });
  }
}
function generateMoves(position) {
  const moves = [];
  const black = position.blackToMove;
  for (let from = 0; from < 128; from++) {
    if (!isOnBoard(from)) continue;
    const piece = position.board[from];
    if (piece === EMPTY || isBlack(piece) !== black) continue;
    const type = pieceType(piece);
    if (type === PAWN) {
      addPawnMoves(moves, position, from, piece, black);
      continue;
    }
    const steps = STEPS[type];
    if (steps !== void 0) {
      addStepMoves(moves, position, from, piece, black, steps);
      continue;
    }
    addRayMoves(moves, position, from, piece, black, RAYS[type]);
  }
  addCastlingMoves(moves, position, black);
  return moves;
}

// src/fen.ts
var FenError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "FenError";
  }
};
var PIECE_BY_CHAR = {
  p: PAWN,
  n: KNIGHT,
  b: BISHOP,
  r: ROOK,
  q: QUEEN,
  k: KING
};
var CHAR_BY_PIECE = {
  [PAWN]: "p",
  [KNIGHT]: "n",
  [BISHOP]: "b",
  [ROOK]: "r",
  [QUEEN]: "q",
  [KING]: "k"
};
var CASTLING_FLAGS = [
  ["K", CASTLE_WK],
  ["Q", CASTLE_WQ],
  ["k", CASTLE_BK],
  ["q", CASTLE_BQ]
];
function parsePlacement(placement, position) {
  const ranks = placement.split("/");
  if (ranks.length !== 8) {
    throw new FenError(`placement must have 8 ranks separated by "/", found ${ranks.length}`);
  }
  for (let i = 0; i < 8; i++) {
    const rankText = ranks[i];
    const rank = 7 - i;
    let file = 0;
    for (const char of rankText) {
      if (char >= "1" && char <= "8") {
        file += Number(char);
        continue;
      }
      const type = PIECE_BY_CHAR[char.toLowerCase()];
      if (type === void 0) {
        throw new FenError(`illegal character "${char}" in placement rank ${rank + 1}`);
      }
      if (file > 7) {
        throw new FenError(`rank ${rank + 1} describes more than 8 squares`);
      }
      const isBlack2 = char === char.toLowerCase();
      position.board[squareAt(file, rank)] = isBlack2 ? type | BLACK : type;
      file++;
    }
    if (file !== 8) {
      throw new FenError(`rank ${rank + 1} describes ${file} squares, expected 8`);
    }
  }
}
function assertBothKingsPresent(position) {
  let whiteKings = 0;
  let blackKings = 0;
  let whiteKing = NO_SQUARE;
  let blackKing = NO_SQUARE;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = position.board[square];
    if (piece === KING) {
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
function parseCastling(field, position) {
  if (field === "-") return;
  for (const char of field) {
    const entry = CASTLING_FLAGS.find(([flagChar]) => flagChar === char);
    if (entry === void 0) {
      throw new FenError(`illegal character "${char}" in castling field`);
    }
    position.castling |= entry[1];
  }
}
function parseClock(field, label, minimum) {
  if (!/^\d+$/.test(field)) {
    throw new FenError(`${label} must be a non-negative integer, found "${field}"`);
  }
  const value = Number(field);
  if (String(value) !== field) {
    const shown = field.length > 24 ? `${field.slice(0, 24)}\u2026` : field;
    throw new FenError(`${label} "${shown}" does not round-trip: it reads back as "${value}"`);
  }
  if (value < minimum) {
    throw new FenError(`${label} must be at least ${minimum}, found ${value}`);
  }
  return value;
}
var CASTLING_HOMES = [
  ["K", CASTLE_WK, 0, 4, 7],
  ["Q", CASTLE_WQ, 0, 4, 0],
  ["k", CASTLE_BK, BLACK, 116, 119],
  ["q", CASTLE_BQ, BLACK, 116, 112]
];
function assertReachable(position, kings) {
  const board = position.board;
  for (const first of [0, 112]) {
    for (let square = first; square < first + 8; square++) {
      if ((board[square] & 7) === PAWN) {
        throw new FenError(
          `pawn on ${squareName(square)}: no pawn can stand on rank ${(square >> 4) + 1}`
        );
      }
    }
  }
  for (const [char, flag, colour, king2, rook] of CASTLING_HOMES) {
    if ((position.castling & flag) === 0) continue;
    const side = colour === BLACK ? "black" : "white";
    if (board[king2] !== (KING | colour)) {
      throw new FenError(
        `castling right "${char}" is inconsistent with the board: no ${side} king on ${squareName(king2)}`
      );
    }
    if (board[rook] !== (ROOK | colour)) {
      throw new FenError(
        `castling right "${char}" is inconsistent with the board: no ${side} rook on ${squareName(rook)}`
      );
    }
  }
  const ep = position.epSquare;
  if (ep !== NO_SQUARE) {
    const whiteToMove = !position.blackToMove;
    const fault = (why) => new FenError(`en-passant square ${squareName(ep)} is inconsistent with the board: ${why}`);
    const front = whiteToMove ? ep - 16 : ep + 16;
    const origin = whiteToMove ? ep + 16 : ep - 16;
    if (ep >> 4 !== (whiteToMove ? 5 : 2)) {
      throw fault(
        `it must be on rank ${whiteToMove ? 6 : 3} when ${whiteToMove ? "white" : "black"} is to move`
      );
    }
    if (board[ep] !== EMPTY) throw fault(`${squareName(ep)} is occupied`);
    if (board[front] !== (PAWN | (whiteToMove ? BLACK : 0))) {
      throw fault(`no ${whiteToMove ? "black" : "white"} pawn on ${squareName(front)}`);
    }
    if (board[origin] !== EMPTY) throw fault(`${squareName(origin)} is occupied`);
  }
  const notToMoveIsBlack = !position.blackToMove;
  const king = notToMoveIsBlack ? kings[1] : kings[0];
  if (isSquareAttackedBy(position, king, position.blackToMove)) {
    throw new FenError(
      `side not to move (${notToMoveIsBlack ? "black" : "white"}) is in check: its king on ${squareName(king)} is attacked`
    );
  }
}
function parseFen(fen) {
  const [position, kings] = parseGrammar(fen);
  assertReachable(position, kings);
  return position;
}
function describeNonString(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  if (typeof value === "object") return "an object";
  if (typeof value === "number") return "a number";
  return typeof value;
}
function parseGrammar(fen) {
  if (typeof fen !== "string") {
    throw new FenError(`FEN must be a string, found ${describeNonString(fen)}`);
  }
  const fields = fen.trim().split(/\s+/);
  if (fields.length !== 6) {
    throw new FenError(`FEN must have 6 fields, found ${fields.length}`);
  }
  const [placement, side, castling, enPassant, halfmove, fullmove] = fields;
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

// src/apply.ts
var CASTLE_LOSS = {
  4: CASTLE_WK | CASTLE_WQ,
  // e1 — white king
  116: CASTLE_BK | CASTLE_BQ,
  // e8 — black king
  0: CASTLE_WQ,
  // a1 — white queen-rook
  7: CASTLE_WK,
  // h1 — white king-rook
  112: CASTLE_BQ,
  // a8 — black queen-rook
  119: CASTLE_BK
  // h8 — black king-rook
};
var DOUBLE_PUSH = 32;
var castlingLoss = (square) => CASTLE_LOSS[square] ?? 0;
var CASTLE_ROOK_MOVE = {
  6: [7, 5],
  //   white kingside:  h1 -> f1
  2: [0, 3],
  //   white queenside: a1 -> d1
  118: [119, 117],
  // black kingside:  h8 -> f8
  114: [112, 115]
  // black queenside: a8 -> d8
};
var enPassantCaptureSquare = (move) => move.to + (isBlack(move.piece) ? 16 : -16);
function applySpecial(position, move) {
  if ((move.flags & FLAG_PROMOTION) !== 0) {
    position.board[move.to] = move.promotion | (isBlack(move.piece) ? BLACK : 0);
    return;
  }
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    position.board[enPassantCaptureSquare(move)] = EMPTY;
    return;
  }
  const [rookFrom, rookTo] = CASTLE_ROOK_MOVE[move.to];
  position.board[rookTo] = position.board[rookFrom];
  position.board[rookFrom] = EMPTY;
}
function undoSpecial(position, move) {
  if ((move.flags & FLAG_PROMOTION) !== 0) return;
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    position.board[enPassantCaptureSquare(move)] = move.captured;
    return;
  }
  const [rookFrom, rookTo] = CASTLE_ROOK_MOVE[move.to];
  position.board[rookFrom] = position.board[rookTo];
  position.board[rookTo] = EMPTY;
}
function makeMove(position, move) {
  const undo = {
    captured: position.board[move.to],
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock
  };
  position.board[move.to] = move.piece;
  position.board[move.from] = EMPTY;
  if (move.flags !== FLAG_NONE) applySpecial(position, move);
  const isPawn = pieceType(move.piece) === PAWN;
  position.halfmoveClock = isPawn || undo.captured !== EMPTY ? 0 : position.halfmoveClock + 1;
  position.epSquare = isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ? (move.from + move.to) / 2 : NO_SQUARE;
  position.castling &= ~(castlingLoss(move.from) | castlingLoss(move.to));
  if (position.blackToMove) position.fullmoveNumber++;
  position.blackToMove = !position.blackToMove;
  return undo;
}
function unmakeMove(position, move, undo) {
  position.blackToMove = !position.blackToMove;
  if (position.blackToMove) position.fullmoveNumber--;
  position.board[move.from] = move.piece;
  position.board[move.to] = undo.captured;
  if (move.flags !== FLAG_NONE) undoSpecial(position, move);
  position.castling = undo.castling;
  position.epSquare = undo.epSquare;
  position.halfmoveClock = undo.halfmoveClock;
}

// src/legal.ts
function kingSquareOf(position, black) {
  return position.board.indexOf(KING | (black ? BLACK : 0));
}
function isInCheck(position) {
  const black = position.blackToMove;
  return isSquareAttackedBy(position, kingSquareOf(position, black), !black);
}
function legalMoves(position) {
  const moverIsBlack = position.blackToMove;
  const legal = [];
  for (const move of generateMoves(position)) {
    const undo = makeMove(position, move);
    const kingSquare = kingSquareOf(position, moverIsBlack);
    if (!isSquareAttackedBy(position, kingSquare, !moverIsBlack)) legal.push(move);
    unmakeMove(position, move, undo);
  }
  return legal;
}

// src/perft.ts
function perft(position, depth) {
  if (depth === 0) return 1;
  let nodes = 0;
  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);
    nodes += perft(position, depth - 1);
    unmakeMove(position, move, undo);
  }
  return nodes;
}
var PROMOTION_LETTER = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n"
};

// .grugops/context/ticket-to-pr-ABC-147/probe/workload.mjs
import { createHash } from "node:crypto";

// src/zobrist.ts
var MASK64 = (1n << 64n) - 1n;
function splitmix64(seed) {
  let state = seed & MASK64;
  return () => {
    state = state + 0x9e3779b97f4a7c15n & MASK64;
    let z = state;
    z = (z ^ z >> 30n) * 0xbf58476d1ce4e5b9n & MASK64;
    z = (z ^ z >> 27n) * 0x94d049bb133111ebn & MASK64;
    return (z ^ z >> 31n) & MASK64;
  };
}
var nextRandom = splitmix64(0x1234567890abcdefn);
var PIECE_SQUARE = Array.from({ length: 15 * 128 }, () => nextRandom());
var BLACK_TO_MOVE = nextRandom();
var CASTLE_FLAGS = [CASTLE_WK, CASTLE_WQ, CASTLE_BK, CASTLE_BQ];
var CASTLE_KEYS = CASTLE_FLAGS.map(() => nextRandom());
var EP_FILE = Array.from({ length: 8 }, () => nextRandom());
function zobristKey(position) {
  let key = 0n;
  const board = position.board;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square];
    if (piece !== 0) key ^= PIECE_SQUARE[piece << 7 | square];
  }
  if (position.blackToMove) key ^= BLACK_TO_MOVE;
  for (let i = 0; i < CASTLE_FLAGS.length; i++) {
    if ((position.castling & CASTLE_FLAGS[i]) !== 0) key ^= CASTLE_KEYS[i];
  }
  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)];
  return key;
}
var enPassantCaptureSquare2 = (move) => move.to + (isBlack(move.piece) ? 16 : -16);
function zobristKeyAfterMove(keyBefore, position, move, undo) {
  const board = position.board;
  let key = keyBefore ^ BLACK_TO_MOVE;
  key ^= PIECE_SQUARE[move.piece << 7 | move.from];
  key ^= PIECE_SQUARE[board[move.to] << 7 | move.to];
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    key ^= PIECE_SQUARE[move.captured << 7 | enPassantCaptureSquare2(move)];
  } else if (undo.captured !== EMPTY) {
    key ^= PIECE_SQUARE[undo.captured << 7 | move.to];
  }
  if ((move.flags & FLAG_CASTLE) !== 0) {
    const kingside = fileOf(move.to) === 6;
    const rookFrom = kingside ? move.to + 1 : move.to - 2;
    const rookTo = kingside ? move.to - 1 : move.to + 1;
    const rook = board[rookTo];
    key ^= PIECE_SQUARE[rook << 7 | rookFrom];
    key ^= PIECE_SQUARE[rook << 7 | rookTo];
  }
  const castlingChanged = undo.castling ^ position.castling;
  if (castlingChanged !== 0) {
    for (let i = 0; i < CASTLE_FLAGS.length; i++) {
      if ((castlingChanged & CASTLE_FLAGS[i]) !== 0) key ^= CASTLE_KEYS[i];
    }
  }
  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)];
  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)];
  return key;
}

// src/gameend.ts
var FIFTY_MOVE_PLIES = 100;
var SEVENTY_FIVE_MOVE_PLIES = 150;
var THREEFOLD_OCCURRENCES = 3;
var FIVEFOLD_OCCURRENCES = 5;
var squareColour = (square) => fileOf(square) + rankOf(square) & 1;
function isInsufficientMaterial(position) {
  let knights = 0;
  let bishops = 0;
  const bishopColours = /* @__PURE__ */ new Set();
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const type = pieceType(position.board[square]);
    if (type === PAWN || type === ROOK || type === QUEEN) return false;
    if (type === KNIGHT) knights++;
    else if (type === BISHOP) {
      bishops++;
      bishopColours.add(squareColour(square));
    }
  }
  const minors = knights + bishops;
  if (minors <= 1) return true;
  return knights === 0 && bishopColours.size === 1;
}
function gameStatus(position, positionCounts) {
  if (legalMoves(position).length === 0) {
    if (isInCheck(position)) {
      return { result: position.blackToMove ? "white-wins" : "black-wins", reason: "checkmate" };
    }
    return { result: "draw", reason: "stalemate" };
  }
  if (isInsufficientMaterial(position)) {
    return { result: "draw", reason: "insufficient-material" };
  }
  if (position.halfmoveClock >= SEVENTY_FIVE_MOVE_PLIES) {
    return { result: "draw", reason: "seventy-five-move" };
  }
  const occurrences = positionCounts === void 0 ? 0 : positionCounts.get(zobristKey(position)) ?? 0;
  if (occurrences >= FIVEFOLD_OCCURRENCES) {
    return { result: "draw", reason: "fivefold-repetition" };
  }
  const draws = [];
  if (occurrences >= THREEFOLD_OCCURRENCES) draws.push("threefold-repetition");
  if (position.halfmoveClock >= FIFTY_MOVE_PLIES) draws.push("fifty-move");
  if (draws.length === 0) return { result: "in-progress", reason: null };
  return {
    result: "in-progress",
    reason: null,
    claimable: { by: position.blackToMove ? "black" : "white", draws }
  };
}

// src/evaluate.ts
var PIECE_VALUE = [
  0,
  // EMPTY
  100,
  // PAWN
  320,
  // KNIGHT
  330,
  // BISHOP
  500,
  // ROOK
  900,
  // QUEEN
  0
  // KING
];
var PAWN_TABLE = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  10,
  10,
  20,
  30,
  30,
  20,
  10,
  10,
  5,
  5,
  10,
  25,
  25,
  10,
  5,
  5,
  0,
  0,
  0,
  20,
  20,
  0,
  0,
  0,
  5,
  -5,
  -10,
  0,
  0,
  -10,
  -5,
  5,
  5,
  10,
  10,
  -20,
  -20,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];
var KNIGHT_TABLE = [
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50,
  -40,
  -20,
  0,
  0,
  0,
  0,
  -20,
  -40,
  -30,
  0,
  10,
  15,
  15,
  10,
  0,
  -30,
  -30,
  5,
  15,
  20,
  20,
  15,
  5,
  -30,
  -30,
  0,
  15,
  20,
  20,
  15,
  0,
  -30,
  -30,
  5,
  10,
  15,
  15,
  10,
  5,
  -30,
  -40,
  -20,
  0,
  5,
  5,
  0,
  -20,
  -40,
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50
];
var BISHOP_TABLE = [
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  10,
  10,
  5,
  0,
  -10,
  -10,
  5,
  5,
  10,
  10,
  5,
  5,
  -10,
  -10,
  0,
  10,
  10,
  10,
  10,
  0,
  -10,
  -10,
  10,
  10,
  10,
  10,
  10,
  10,
  -10,
  -10,
  5,
  0,
  0,
  0,
  0,
  5,
  -10,
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20
];
var ROOK_TABLE = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  10,
  10,
  10,
  10,
  5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  0,
  0,
  0,
  5,
  5,
  0,
  0,
  0
];
var QUEEN_TABLE = [
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  5,
  5,
  5,
  0,
  -10,
  -5,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  0,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  -10,
  5,
  5,
  5,
  5,
  5,
  0,
  -10,
  -10,
  0,
  5,
  0,
  0,
  0,
  0,
  -10,
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20
];
var KING_TABLE = [
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -20,
  -30,
  -30,
  -40,
  -40,
  -30,
  -30,
  -20,
  -10,
  -20,
  -20,
  -20,
  -20,
  -20,
  -20,
  -10,
  20,
  20,
  0,
  0,
  0,
  0,
  20,
  20,
  20,
  30,
  10,
  0,
  0,
  10,
  30,
  20
];
var PIECE_SQUARE_TABLE = [
  PAWN_TABLE,
  // EMPTY — never read; keeps the index aligned with pieceType
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_TABLE
];
var DOUBLED_PAWN_PENALTY = 15;
var ISOLATED_PAWN_PENALTY = 10;
var PASSED_PAWN_BONUS = [0, 5, 10, 20, 35, 60, 100, 0];
var BLACK_PAWN = PAWN | BLACK;
function isPassedPawn(board, square) {
  const pawn = board[square];
  const enemyPawn = pawn ^ BLACK;
  const step = isBlack(pawn) ? -1 : 1;
  const file = fileOf(square);
  const fromFile = file === 0 ? 0 : file - 1;
  const toFile = file === 7 ? 7 : file + 1;
  for (let rank = rankOf(square) + step; rank >= 1 && rank <= 6; rank += step) {
    for (let f = fromFile; f <= toFile; f++) {
      if (board[rank * 16 + f] === enemyPawn) return false;
    }
  }
  return true;
}
var adjacentFiles = (file) => (1 << file << 1 | 1 << file >> 1) & 255;
function pawnStructure(board) {
  let whiteFiles = 0;
  let blackFiles = 0;
  let score = 0;
  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank * 16 + file];
      const bit = 1 << file;
      if (piece === PAWN) {
        if ((whiteFiles & bit) !== 0) score -= DOUBLED_PAWN_PENALTY;
        whiteFiles |= bit;
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & bit) !== 0) score += DOUBLED_PAWN_PENALTY;
        blackFiles |= bit;
      }
    }
  }
  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 16 + file;
      const piece = board[square];
      if (piece === PAWN) {
        if ((whiteFiles & adjacentFiles(file)) === 0) score -= ISOLATED_PAWN_PENALTY;
        if (isPassedPawn(board, square)) score += PASSED_PAWN_BONUS[rank];
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & adjacentFiles(file)) === 0) score += ISOLATED_PAWN_PENALTY;
        if (isPassedPawn(board, square)) score -= PASSED_PAWN_BONUS[7 - rank];
      }
    }
  }
  return score;
}
function whiteMinusBlack(position) {
  const board = position.board;
  let score = 0;
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank * 16 + file];
      if (piece === EMPTY) continue;
      const type = pieceType(piece);
      const black = isBlack(piece);
      const tableIndex = (black ? rank : 7 - rank) * 8 + file;
      const value = PIECE_VALUE[type] + PIECE_SQUARE_TABLE[type][tableIndex];
      score += black ? -value : value;
    }
  }
  return score + pawnStructure(board);
}
function evaluate(position) {
  const score = whiteMinusBlack(position);
  return position.blackToMove ? 0 - score : score;
}

// src/quiescence.ts
var ORDER_VALUE = [0, 100, 320, 330, 500, 900, 0];
function mvvLvaKey(move) {
  return ORDER_VALUE[pieceType(move.captured)] + ORDER_VALUE[move.promotion] - ORDER_VALUE[pieceType(move.piece)] / 1e3;
}
var QUIESCENCE_MAX_PLY = 8;
function quiesce(position, alpha, beta, qply, visit) {
  if (qply > 0) visit(qply);
  const standPat = evaluate(position);
  if (standPat >= beta) return standPat;
  if (qply >= QUIESCENCE_MAX_PLY) return standPat;
  let best = standPat;
  if (best > alpha) alpha = best;
  const captures = [];
  for (const move of legalMoves(position)) {
    if (move.captured !== EMPTY) captures.push(move);
  }
  captures.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a));
  for (const move of captures) {
    const undo = makeMove(position, move);
    let score;
    try {
      score = 0 - quiesce(position, 0 - beta, 0 - alpha, qply + 1, visit);
    } finally {
      unmakeMove(position, move, undo);
    }
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

// src/transposition.ts
var TABLE_BITS = 18;
var TABLE_ENTRIES = 1 << TABLE_BITS;
var INDEX_MASK = BigInt(TABLE_ENTRIES - 1);
var BOUND_EXACT = 1;
var BOUND_LOWER = 2;
var BOUND_UPPER = 3;
var MATE_FLOOR = 2e4;
var MOVE_BITS = 131071;
var BOUND_SHIFT = 17;
var DEPTH_SHIFT = 19;
var keys = null;
var words = new Uint32Array(0);
var scores = new Int32Array(0);
function clearTable() {
  if (keys === null) {
    keys = new BigUint64Array(TABLE_ENTRIES);
    words = new Uint32Array(TABLE_ENTRIES);
    scores = new Int32Array(TABLE_ENTRIES);
    return;
  }
  words.fill(0);
}
function probeTable(key) {
  const slot = Number(key & INDEX_MASK);
  return words[slot] !== 0 && keys[slot] === key ? slot : -1;
}
function entryDepth(slot) {
  return words[slot] >>> DEPTH_SHIFT;
}
function entryBound(slot) {
  return words[slot] >>> BOUND_SHIFT & 3;
}
function entryScore(slot, ply) {
  const stored = scores[slot];
  if (stored >= MATE_FLOOR) return stored - ply;
  if (stored <= -MATE_FLOOR) return stored + ply;
  return stored;
}
function entryMove(slot, moves) {
  const packed = words[slot] & MOVE_BITS;
  for (const move of moves) {
    if (packMove(move) === packed) return move;
  }
  return null;
}
function packMove(move) {
  return move.from | move.to << 7 | move.promotion << 14;
}
function storeEntry(key, depth, bound, score, ply, move) {
  const slot = Number(key & INDEX_MASK);
  keys[slot] = key;
  words[slot] = packMove(move) | bound << BOUND_SHIFT | depth << DEPTH_SHIFT;
  scores[slot] = score >= MATE_FLOOR ? score + ply : score <= -MATE_FLOOR ? score - ply : score;
}
function tableCutoff(slot, depth, alpha, beta, ply) {
  if (entryDepth(slot) !== depth) return null;
  const score = entryScore(slot, ply);
  const bound = entryBound(slot);
  if (bound === BOUND_EXACT) return score;
  if (bound === BOUND_LOWER && score >= beta) return score;
  if (bound === BOUND_UPPER && score <= alpha) return score;
  return null;
}
function boundOf(best, alphaIn, beta) {
  if (best <= alphaIn) return BOUND_UPPER;
  if (best >= beta) return BOUND_LOWER;
  return BOUND_EXACT;
}

// src/search.ts
var MATE_SCORE = 3e4;
var NO_KILLERS = [];
var KEY_ARRAY_CAPACITY = 128;
function repeatsInPath(keys2, ply, halfmoveClock) {
  const key = keys2[ply];
  const oldest = Math.max(0, ply - halfmoveClock);
  for (let earlier = ply - 4; earlier >= oldest; earlier -= 2) {
    if (keys2[earlier] === key) return true;
  }
  return false;
}
function sameMove(a, b) {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}
var KillerTable = class {
  slots = [];
  /** The killers recorded at `ply`, newest first: none, one or two. */
  at(ply) {
    return this.slots[ply] ?? NO_KILLERS;
  }
  /**
   * A move that caused a beta cutoff at `ply`. Captures and promotions are not kept: MVV-LVA
   * already orders them ahead of every killer.
   */
  record(ply, move) {
    if (move.captured !== EMPTY || move.promotion !== EMPTY) return;
    const newest = this.slots[ply]?.[0];
    if (newest === void 0) this.slots[ply] = [move];
    else if (!sameMove(newest, move)) this.slots[ply] = [move, newest];
  }
};
var HASH_MOVE_KEY = 3e6;
var TACTICAL_KEY = 1e6;
function orderKey(move, killers, hashMove) {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return TACTICAL_KEY + mvvLvaKey(move);
  const killer = killers.findIndex((candidate) => sameMove(candidate, move));
  return killer === -1 ? 0 : killers.length - killer;
}
function orderMoves(moves, killers, hashMove) {
  return moves.map((move) => ({ move, key: orderKey(move, killers, hashMove) })).sort((a, b) => b.key - a.key).map(({ move }) => move);
}
var REDUCTION_MIN_DEPTH = 3;
var REDUCTION_MIN_INDEX = 3;
function lateMoveReduction(position, move, depth, index, atRoot) {
  if (atRoot || depth < REDUCTION_MIN_DEPTH || index < REDUCTION_MIN_INDEX) return 0;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;
  if (isInCheck(position)) return 0;
  const undo = makeMove(position, move);
  const givesCheck = isInCheck(position);
  unmakeMove(position, move, undo);
  return givesCheck ? 0 : 1;
}
function ordered(moves, ply, switches, killers, hashMove) {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove);
}
function leafScore(position, ply, alpha, beta, switches, counter) {
  const status = gameStatus(position);
  if (status.result === "in-progress") {
    if (!switches.quiescence) return evaluate(position);
    return quiesce(position, alpha, beta, 0, () => counter.nodes++);
  }
  if (status.reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}
function negamax(position, depth, alpha, beta, ply, switches, counter, killers, keys2) {
  counter.nodes++;
  if (repeatsInPath(keys2, ply, position.halfmoveClock)) return 0;
  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore(position, ply, alpha, beta, switches, counter);
  }
  const prune = switches.prune;
  const key = keys2[ply];
  const slot = switches.table ? probeTable(key) : -1;
  if (slot !== -1) {
    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) return settled;
  }
  const moves = legalMoves(position);
  if (moves.length === 0) {
    return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;
  }
  const alphaIn = alpha;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0];
  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    const reduction = switches.reductions ? lateMoveReduction(position, move, depth, index, false) : 0;
    const undo = makeMove(position, move);
    keys2[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
    const score = searchMove(
      position,
      depth,
      alpha,
      beta,
      ply,
      index,
      reduction,
      switches,
      counter,
      killers,
      keys2
    );
    unmakeMove(position, move, undo);
    index++;
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (!prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      killers.record(ply, move);
      break;
    }
  }
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}
function searchMove(position, depth, alpha, beta, ply, index, reduction, switches, counter, killers, keys2) {
  const child = ply + 1;
  if (index === 0 || !switches.pvs) {
    return 0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, child, switches, counter, killers, keys2);
  }
  let score = 0 - negamax(
    position,
    depth - 1 - reduction,
    0 - alpha - 1,
    0 - alpha,
    child,
    switches,
    counter,
    killers,
    keys2
  );
  if (score > alpha && reduction > 0) {
    score = 0 - negamax(
      position,
      depth - 1,
      0 - alpha - 1,
      0 - alpha,
      child,
      switches,
      counter,
      killers,
      keys2
    );
  }
  if (score > alpha && score < beta) {
    score = 0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, child, switches, counter, killers, keys2);
  }
  return score;
}
function searchRoot(position, depth, switches) {
  const counter = { nodes: 1 };
  const prune = switches.prune;
  const killers = new KillerTable();
  const keys2 = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys2[0] = zobristKey(position);
  if (switches.table) clearTable();
  if (!(depth >= 1)) {
    const infinity = Number.POSITIVE_INFINITY;
    const score = leafScore(position, 0, 0 - infinity, infinity, switches, counter);
    return { score, move: null, nodes: counter.nodes };
  }
  const moves = legalMoves(position);
  if (moves.length === 0) {
    return { score: isInCheck(position) ? 0 - MATE_SCORE : 0, move: null, nodes: counter.nodes };
  }
  const rootKey = keys2[0];
  const slot = switches.table ? probeTable(rootKey) : -1;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  const rootMoves = ordered(moves, 0, switches, killers, hashMove);
  let bestMove = rootMoves[0];
  let index = 0;
  for (const move of rootMoves) {
    const reduction = switches.reductions ? lateMoveReduction(position, move, depth, index, true) : 0;
    const undo = makeMove(position, move);
    keys2[1] = zobristKeyAfterMove(rootKey, position, move, undo);
    const score = searchMove(
      position,
      depth,
      alpha,
      Number.POSITIVE_INFINITY,
      0,
      index,
      reduction,
      switches,
      counter,
      killers,
      keys2
    );
    unmakeMove(position, move, undo);
    index++;
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (prune && best > alpha) alpha = best;
  }
  if (switches.table) storeEntry(rootKey, depth, BOUND_EXACT, best, 0, bestMove);
  return { score: best, move: bestMove, nodes: counter.nodes };
}
function searchWithoutPruning(position, depth) {
  return searchRoot(position, depth, {
    prune: false,
    quiescence: true,
    ordering: "full",
    table: false,
    pvs: false,
    reductions: false
  });
}
function searchWithoutReductions(position, depth) {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: false
  });
}

// src/engine.ts
var HARD_CEILING_MS = 5e3;
var NODES_PER_CLOCK_CHECK = 1024;
var ABORTED = /* @__PURE__ */ Symbol("engine: the budget is spent");
function countNode(budget) {
  budget.nodes++;
  if (budget.nodes >= budget.nextCheck) {
    budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
    if (budget.now() >= budget.deadline) throw ABORTED;
  }
}
function leafScore2(position, ply, alpha, beta, budget) {
  const status = gameStatus(position);
  if (status.result === "in-progress") return quiesce(position, alpha, beta, 0, budget.visit);
  if (status.reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}
function negamax2(position, remaining, alpha, beta, ply, budget) {
  countNode(budget);
  const keys2 = budget.keys;
  if (repeatsInPath(keys2, ply, position.halfmoveClock)) return 0;
  if (remaining <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore2(position, ply, alpha, beta, budget);
  }
  const key = keys2[ply];
  const slot = probeTable(key);
  if (slot !== -1) {
    const settled = tableCutoff(slot, remaining, alpha, beta, ply);
    if (settled !== null) return settled;
  }
  const moves = legalMoves(position);
  if (moves.length === 0) return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;
  const alphaIn = alpha;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0];
  let index = 0;
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    const reduction = budget.reductions ? lateMoveReduction(position, move, remaining, index, false) : 0;
    const undo = makeMove(position, move);
    let score;
    try {
      keys2[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      score = searchMove2(position, remaining, alpha, beta, ply, index, reduction, budget);
    } finally {
      unmakeMove(position, move, undo);
    }
    index++;
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      budget.killers.record(ply, move);
      break;
    }
  }
  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}
function searchMove2(position, remaining, alpha, beta, ply, index, reduction, budget) {
  const child = ply + 1;
  if (index === 0 || !budget.pvs) {
    return 0 - negamax2(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  let score = 0 - negamax2(position, remaining - 1 - reduction, 0 - alpha - 1, 0 - alpha, child, budget);
  if (score > alpha && reduction > 0) {
    score = 0 - negamax2(position, remaining - 1, 0 - alpha - 1, 0 - alpha, child, budget);
  }
  if (score > alpha && score < beta) {
    score = 0 - negamax2(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  return score;
}
function runIteration(position, moves, remaining, budget) {
  const rootKey = budget.keys[0];
  const slot = probeTable(rootKey);
  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves)
  );
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = rootMoves[0];
  let index = 0;
  for (const move of rootMoves) {
    const reduction = budget.reductions ? lateMoveReduction(position, move, remaining, index, true) : 0;
    const undo = makeMove(position, move);
    let score;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      score = searchMove2(
        position,
        remaining,
        alpha,
        Number.POSITIVE_INFINITY,
        0,
        index,
        reduction,
        budget
      );
    } finally {
      unmakeMove(position, move, undo);
    }
    index++;
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
  }
  storeEntry(rootKey, remaining, BOUND_EXACT, best, 0, bestMove);
  return { move: bestMove, score: best };
}
function chooseMoveWithoutReductions(position, options) {
  return deepen(position, options, { pvs: true, reductions: false });
}
function deepen(position, options, heuristics) {
  const now = options.now ?? Date.now;
  const start = now();
  const budget = {
    now,
    // `Math.min` and NOT an `if`: it preserves every degenerate budget already measured safe
    // (`NaN` stays `NaN` — both comparisons false, depth 1; `0` / `-1` / `-1e9` unchanged) and
    // turns `Infinity` into the ceiling, which is the module's only non-terminating budget.
    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
    nodes: 0,
    // Disarmed for the first iteration: depth 1 always completes, so a move always exists.
    nextCheck: Number.POSITIVE_INFINITY,
    visit: () => countNode(budget),
    killers: new KillerTable(),
    keys: new BigUint64Array(KEY_ARRAY_CAPACITY + 1),
    ...heuristics
  };
  budget.keys[0] = zobristKey(position);
  clearTable();
  const rootMoves = legalMoves(position);
  if (rootMoves.length === 0) return null;
  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;
  budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
  for (let iteration = 2; now() < budget.deadline; iteration++) {
    let deeper;
    try {
      deeper = runIteration(position, rootMoves, iteration, budget);
    } catch (error) {
      if (error === ABORTED) break;
      throw error;
    }
    best = deeper;
    reached = iteration;
  }
  return {
    move: best.move,
    score: best.score,
    depth: reached,
    nodes: budget.nodes,
    elapsedMs: now() - start
  };
}

// .grugops/context/ticket-to-pr-ABC-147/probe/workload.mjs
var tickingClock = (step) => {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
};
var ENDGAMES = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"
];
var P4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";
var WORK = {
  E() {
    const out = [];
    for (const fen of ENDGAMES)
      for (const budgetMs of [3, 5]) {
        const c = chooseMoveWithoutReductions(parseFen(fen), { budgetMs, now: tickingClock(1) });
        const r = searchWithoutReductions(parseFen(fen), c.depth);
        out.push([c.nodes, c.depth, c.score, JSON.stringify(c.move), r.nodes, r.score, JSON.stringify(r.move)]);
      }
    return out;
  },
  S() {
    const a = searchWithoutReductions(parseFen(P4), 2);
    const b = searchWithoutPruning(parseFen(P4), 2);
    return [a.nodes, a.score, JSON.stringify(a.move), b.nodes, b.score, JSON.stringify(b.move)];
  }
};
function measure(which, k = 5) {
  const fn = WORK[which];
  if (!fn) throw new Error(`unknown workload ${which}`);
  const t0 = performance.now();
  const first = fn();
  const coldMs = performance.now() - t0;
  const digest = createHash("sha256").update(JSON.stringify(first)).digest("hex").slice(0, 16);
  const ms = [];
  for (let i = 0; i < k; i++) {
    const s2 = performance.now();
    const res = fn();
    ms.push(performance.now() - s2);
    const d = createHash("sha256").update(JSON.stringify(res)).digest("hex").slice(0, 16);
    if (d !== digest) throw new Error(`non-deterministic workload ${which}: ${d} != ${digest}`);
  }
  const s = [...ms].sort((x, y) => x - y);
  return { which, digest, coldMs: +coldMs.toFixed(2), ms: ms.map((x) => +x.toFixed(2)), medianMs: +s[s.length >> 1].toFixed(2), first };
}

// .grugops/context/design-ABC-150/probe/workload150.mjs
var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var P = () => [perft(parseFen(START_FEN), 4)];
var WHERE = import.meta.url;
function measure2(which, k = 5) {
  if (which !== "P") return measure(which, k);
  const t0 = performance.now();
  const first = P();
  const coldMs = performance.now() - t0;
  const digest = createHash2("sha256").update(JSON.stringify(first)).digest("hex").slice(0, 16);
  const ms = [];
  for (let i = 0; i < k; i++) {
    const s2 = performance.now();
    const res = P();
    ms.push(performance.now() - s2);
    const d = createHash2("sha256").update(JSON.stringify(res)).digest("hex").slice(0, 16);
    if (d !== digest) throw new Error(`non-deterministic workload P: ${d} != ${digest}`);
  }
  const s = [...ms].sort((x, y) => x - y);
  return { which, digest, coldMs: +coldMs.toFixed(2), ms: ms.map((x) => +x.toFixed(2)), medianMs: +s[s.length >> 1].toFixed(2), first };
}
export {
  WHERE,
  measure2 as measure
};
