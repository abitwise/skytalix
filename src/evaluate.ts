/**
 * Static evaluation — material plus piece-square tables (ABC-076), plus pawn structure (ABC-082),
 * plus king safety and mobility (ABC-083).
 *
 * One pure function: a position in, a centipawn score out, in the NEGAMAX convention —
 * positive is good for the SIDE TO MOVE, never "good for white". The search (ABC-077) can
 * therefore negate on every ply without knowing whose turn it is.
 *
 * There is no search here, no state, no cache, and no terminal scoring: mate and stalemate
 * depend on distance to the root, which a bare position cannot know, so they are ABC-077's.
 *
 * Every number below is HAND-TUNED and expected to move. Tests assert relations (a minor
 * piece outweighs the whole positional term; a centralised knight beats a knight at home),
 * never totals — the one exception being the start position, which is exactly 0 by symmetry.
 *
 * `PIECE_VALUE` and the six piece-square tables are the values of Tomasz Michniewski's
 * "Simplified Evaluation Function", first posted to the Polish chess-programming list progszach
 * and published at <https://www.chessprogramming.org/Simplified_Evaluation_Function> under
 * CC BY-SA 3.0 (<https://creativecommons.org/licenses/by-sa/3.0/>). The values are unchanged.
 * The layout, the king value of 0 and all code are ours.
 */

import {
  BISHOP,
  BLACK,
  EMPTY,
  fileOf,
  isBlack,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  ROOK,
  rankOf,
} from "./position.ts";

/**
 * Centipawn value per piece type, indexed by `pieceType` (PAWN=1 … KING=6). Index 0 is EMPTY
 * and is never read. The king is 0: both sides always have exactly one, so any value cancels,
 * and a finite one would only invite a search to "win" it.
 */
const PIECE_VALUE: readonly number[] = [
  0, // EMPTY
  100, // PAWN
  320, // KNIGHT
  330, // BISHOP
  500, // ROOK
  900, // QUEEN
  0, // KING
];

/**
 * One table per piece type, written from WHITE's point of view and read RANK-8-FIRST — the
 * layout below is the board as printed, a8 top-left. Black reads the same table with the rank
 * flipped, which is what makes the mirror exact and A1's symmetry property meaningful.
 *
 * Deliberately small and hand-written, as the ticket asks. No tapering, no endgame variants.
 */
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
   50, 50, 50, 50, 50, 50, 50, 50,
   10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_TABLE: readonly number[] = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_TABLE: readonly number[] = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_TABLE: readonly number[] = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_TABLE: readonly number[] = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

/** Indexed by `pieceType`, exactly like PIECE_VALUE. Index 0 is EMPTY and is never read. */
const PIECE_SQUARE_TABLE: readonly (readonly number[])[] = [
  PAWN_TABLE, // EMPTY — never read; keeps the index aligned with pieceType
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_TABLE,
];

/**
 * ABC-082's three pawn terms, in centipawns. The epic names exactly these three; backward pawns,
 * chains, connected passers and storms are fenced out. Hand-tuned like everything above.
 *
 * DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn with no friendly pawn on
 * either adjacent file. Together they stay inside `A2`'s 50 cp cap for two pawns doubled on one
 * file (15 + 2 x 10 = 35): a structural term must not outweigh material.
 *
 * PASSED: by how far the pawn has come, indexed by rank counted from its OWN side (1 = its
 * starting rank, 6 = one step from promotion). Kept modest on the early ranks: a large bonus
 * there would eat `QE-G3`'s queen-for-a-pawn margin, where both black pawns are passed.
 */
const DOUBLED_PAWN_PENALTY = 15;
const ISOLATED_PAWN_PENALTY = 10;
const PASSED_PAWN_BONUS: readonly number[] = [0, 5, 10, 20, 35, 60, 100, 0];

const BLACK_PAWN = PAWN | BLACK;

/**
 * True when no ENEMY pawn stands ahead of the pawn on `square` on its own file or an adjacent
 * one — "ahead" in the pawn's own direction of travel. An enemy pawn behind it, or beside it on
 * the same rank, cannot stop it; nor can a piece. `square` must hold a pawn.
 */
export function isPassedPawn(board: Uint8Array, square: number): boolean {
  const pawn = board[square] as number;
  const enemyPawn = pawn ^ BLACK;
  const step = isBlack(pawn) ? -1 : 1;
  const file = fileOf(square);
  const fromFile = file === 0 ? 0 : file - 1;
  const toFile = file === 7 ? 7 : file + 1;

  // Pawns never stand on the first or last rank, so ranks 1..6 are the only ones to look at.
  for (let rank = rankOf(square) + step; rank >= 1 && rank <= 6; rank += step) {
    for (let f = fromFile; f <= toFile; f++) {
      if (board[rank * 16 + f] === enemyPawn) return false;
    }
  }
  return true;
}

/**
 * ABC-083's king safety, in centipawns, per file of the king's own file and the files either side
 * of it (two files for a king on the a- or h-file). SHELTER: no own pawn one or two ranks ahead
 * of the king on that file. FILE_HALF_OPEN: no own pawn anywhere on the file, an enemy pawn on it.
 * FILE_OPEN: no pawn of either colour on the file. Untapered by decision (the page's § Out of scope).
 */
const KING_SHELTER_MISSING_PENALTY = 15;
const KING_FILE_HALF_OPEN_PENALTY = 10;
const KING_FILE_OPEN_PENALTY = 20;

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches (empty, or holding an enemy
 * piece) — the attack-map form of `ADR-0031` decision 2: counted on the board, no `Move` objects,
 * no make/unmake, pins and checks ignored. The total is clamped to `A4`'s ±100 cp, so mobility can
 * never outvote a minor piece.
 */
const MOBILITY_WEIGHT = 4;
const MOBILITY_CAP = 100;

const KNIGHT_STEPS: readonly number[] = [33, 31, 18, 14, -14, -18, -31, -33];
const KING_STEPS: readonly number[] = [17, 16, 15, 1, -1, -15, -16, -17];
/** Diagonals first, then orthogonals: a bishop reads 0..3, a rook 4..7, a queen all eight. */
const RAYS: readonly number[] = [17, 15, -15, -17, 16, 1, -1, -16];

/**
 * How many squares the non-pawn `piece` on `square` reaches: empty squares, plus the first
 * occupied square on each line when it holds an enemy piece. Reads the board only.
 */
function squaresReached(board: Uint8Array, square: number, piece: number): number {
  const type = pieceType(piece);
  const black = isBlack(piece);
  let count = 0;

  if (type === KNIGHT || type === KING) {
    const steps = type === KNIGHT ? KNIGHT_STEPS : KING_STEPS;
    for (let i = 0; i < 8; i++) {
      const to = square + (steps[i] as number);
      if ((to & 0x88) !== 0) continue;
      const target = board[to] as number;
      if (target === EMPTY || isBlack(target) !== black) count++;
    }
    return count;
  }

  const from = type === ROOK ? 4 : 0;
  const to = type === BISHOP ? 4 : 8;
  for (let i = from; i < to; i++) {
    const ray = RAYS[i] as number;
    for (let at = square + ray; (at & 0x88) === 0; at += ray) {
      const target = board[at] as number;
      if (target === EMPTY) {
        count++;
        continue;
      }
      if (isBlack(target) !== black) count++;
      break;
    }
  }
  return count;
}

/**
 * The king-safety penalty for the king on `king` (positive = worse for that king's side).
 * `ownPawn`/`enemyPawn` are the two coloured pawn codes and `step` is the king's forward
 * direction in ranks (+1 white, -1 black), which is what makes the term mirror-exact.
 */
function kingExposure(
  board: Uint8Array,
  king: number,
  ownPawn: number,
  enemyPawn: number,
  step: number,
): number {
  const kingFile = fileOf(king);
  const shelterRank1 = rankOf(king) + step;
  const shelterRank2 = shelterRank1 + step;
  const fromFile = kingFile === 0 ? 0 : kingFile - 1;
  const toFile = kingFile === 7 ? 7 : kingFile + 1;
  let penalty = 0;

  for (let file = fromFile; file <= toFile; file++) {
    const sheltered =
      (shelterRank1 >= 0 && shelterRank1 <= 7 && board[shelterRank1 * 16 + file] === ownPawn) ||
      (shelterRank2 >= 0 && shelterRank2 <= 7 && board[shelterRank2 * 16 + file] === ownPawn);
    if (!sheltered) penalty += KING_SHELTER_MISSING_PENALTY;

    let own = false;
    let enemy = false;
    for (let rank = 1; rank <= 6; rank++) {
      const piece = board[rank * 16 + file];
      if (piece === ownPawn) own = true;
      else if (piece === enemyPawn) enemy = true;
    }
    if (!own) penalty += enemy ? KING_FILE_HALF_OPEN_PENALTY : KING_FILE_OPEN_PENALTY;
  }

  return penalty;
}

/** The files either side of `file`, as a bitmask over files a..h (bit 0 = a). */
const adjacentFiles = (file: number): number => (((1 << file) << 1) | ((1 << file) >> 1)) & 0xff;

/**
 * The three pawn terms from WHITE's point of view. Two passes over the six ranks a pawn can
 * stand on: the first finds which files each side has a pawn on (and counts the extra pawns that
 * make a file doubled), the second needs those complete file sets to judge isolation.
 */
function pawnStructure(board: Uint8Array): number {
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
        if (isPassedPawn(board, square)) score += PASSED_PAWN_BONUS[rank] as number;
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & adjacentFiles(file)) === 0) score += ISOLATED_PAWN_PENALTY;
        if (isPassedPawn(board, square)) score -= PASSED_PAWN_BONUS[7 - rank] as number;
      }
    }
  }

  return score;
}

/**
 * Score of a position from WHITE's point of view: white's material and placement minus
 * black's. Kept separate from the negamax flip so the sign convention lives in exactly one
 * place and the tables are read exactly once per piece.
 */
function whiteMinusBlack(position: Position, mobilityWeight: number): number {
  const board = position.board;
  let score = 0;
  let mobility = 0;
  let whiteKing = -1;
  let blackKing = -1;

  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 16 + file;
      const piece = board[square] as number;
      if (piece === EMPTY) continue;

      const type = pieceType(piece);
      const black = isBlack(piece);
      // White reads the table rank-8-first; black reads the same table with the rank flipped.
      const tableIndex = (black ? rank : 7 - rank) * 8 + file;
      const value =
        (PIECE_VALUE[type] as number) +
        ((PIECE_SQUARE_TABLE[type] as readonly number[])[tableIndex] as number);

      score += black ? -value : value;

      if (type === PAWN) continue;
      const reached = squaresReached(board, square, piece);
      mobility += black ? -reached : reached;
      if (type === KING) {
        if (black) blackKing = square;
        else whiteKing = square;
      }
    }
  }

  const mobilityScore = Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobilityWeight * mobility));
  const kingSafety =
    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1) -
    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1);

  return score + pawnStructure(board) + kingSafety + mobilityScore;
}

/**
 * The static score of `position` in centipawns, positive for the side to move.
 *
 * Pure: it reads the position and writes nothing — not even transiently. (`zobristKey` on this
 * codebase does mutate transiently, which is why ABC-076's A5 asserts byte-identity here.)
 */
export function evaluate(position: Position): number {
  const score = whiteMinusBlack(position, MOBILITY_WEIGHT);
  // `0 - score`, not `-score`: negating a balanced position yields `-0`, which is `Object.is`
  // -distinct from `0` and so is NOT "exactly equal" to its mirror's score. Caught by A1 at
  // startpos-with-black-to-move; `0 - 0` is `+0`.
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY. `evaluate` with the mobility weight at 0 — every other term, the sign convention and
 * the board walk unchanged — so `evaluate(p) - evaluateWithoutMobility(p)` is exactly the mobility
 * term, which is how `ABC-083` `A4` reads its ±100 cp bound. Nothing in production calls it (the
 * `searchWithout…` doors' precedent).
 */
export function evaluateWithoutMobility(position: Position): number {
  const score = whiteMinusBlack(position, 0);
  return position.blackToMove ? 0 - score : score;
}
