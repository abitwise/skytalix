/**
 * Static evaluation — material plus piece-square tables (ABC-076), plus pawn structure (ABC-082),
 * plus king safety and mobility (ABC-083), plus the early-queen term (ABC-207).
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
 * `PIECE_VALUE` and the six tables are this project's own, each made by the rule written above it.
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
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";

/**
 * Centipawn value per piece type, indexed by `pieceType` (PAWN=1 … KING=6). Index 0 is EMPTY
 * and is never read. The king is 0: both sides always have exactly one, so any value cancels,
 * and a finite one would only invite a search to "win" it.
 *
 * Rule: the classical scale of the chess primers, P 1, N 3, B 3, R 5, Q 9 pawns, times 100, plus
 * 25 on each minor piece, so that one minor outweighs three pawns. Bishop and knight are equal:
 * the bishop's wider reach is paid by mobility (ABC-083).
 */
const PIECE_VALUE: readonly number[] = [
  0, // EMPTY
  100, // PAWN
  325, // KNIGHT
  325, // BISHOP
  500, // ROOK
  900, // QUEEN
  0, // KING
];

/**
 * One table per piece type, written from WHITE's point of view and read RANK-8-FIRST — the
 * layout below is the board as printed, a8 top-left. Black reads the same table with the rank
 * flipped, which is what makes the mirror exact and A1's symmetry property meaningful.
 *
 * Each table is written out from the rule in its comment, a formula over file, rank or reach.
 * No tapering, no endgame variants. In the rules, `R` is the rank counted from the piece's own
 * side (1 … 8), `e` is the file's steps from the edge (a/h 0, b/g 1, c/f 2, d/e 3), and `ring`
 * is the square's steps from the board's edge, `min(e, R - 1, 8 - R)` (0 … 3).
 */
// Rule: `2 × e × (R − 2)`, and 0 on ranks 1 and 8. A pawn gains as it advances, more on the
// central files. Shelter is left to king safety (ABC-083).
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const PAWN_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
    0, 10, 20, 30, 30, 20, 10,  0,
    0,  8, 16, 24, 24, 16,  8,  0,
    0,  6, 12, 18, 18, 12,  6,  0,
    0,  4,  8, 12, 12,  8,  4,  0,
    0,  2,  4,  6,  6,  4,  2,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// Rule: `10 × n − 50`, where n is the number of knight moves from the square on an empty board
// (2 … 8). A knight is worth its reach.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KNIGHT_TABLE: readonly number[] = [
  -30,-20,-10,-10,-10,-10,-20,-30,
  -20,-10, 10, 10, 10, 10,-10,-20,
  -10, 10, 30, 30, 30, 30, 10,-10,
  -10, 10, 30, 30, 30, 30, 10,-10,
  -10, 10, 30, 30, 30, 30, 10,-10,
  -10, 10, 30, 30, 30, 30, 10,-10,
  -20,-10, 10, 10, 10, 10,-10,-20,
  -30,-20,-10,-10,-10,-10,-20,-30,
];

// Rule: `5 × (n − 9)`, where n is the number of squares on the square's diagonals on an empty
// board (7 … 13); this equals `10 × ring − 10`. A bishop is worth its reach.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const BISHOP_TABLE: readonly number[] = [
  -10,-10,-10,-10,-10,-10,-10,-10,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10,  0, 10, 20, 20, 10,  0,-10,
  -10,  0, 10, 20, 20, 10,  0,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,-10,-10,-10,-10,-10,-10,-10,
];

// Rule: 20 on the seventh rank (`R = 7`), else 0. Open files are left to mobility, which counts
// a rook's reach along them.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const ROOK_TABLE: readonly number[] = [
    0,  0,  0,  0,  0,  0,  0,  0,
   20, 20, 20, 20, 20, 20, 20, 20,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
];

// Rule: `5 × ring − 5`. A small pull to the centre.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const QUEEN_TABLE: readonly number[] = [
   -5, -5, -5, -5, -5, -5, -5, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  5,  5,  5,  5,  0, -5,
   -5,  0,  5, 10, 10,  5,  0, -5,
   -5,  0,  5, 10, 10,  5,  0, -5,
   -5,  0,  5,  5,  5,  5,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5, -5, -5, -5, -5, -5, -5, -5,
];

// Rule: `max(−50, −10 × d − 10 × (R − 1))`, where d is the file distance to the nearer of the b-
// and g-files. The castled squares b1 and g1 are home (0); each file toward the centre and each
// rank up costs 10. Untapered.
// biome-ignore format: an 8x8 board is only readable as 8 rows of 8
const KING_TABLE: readonly number[] = [
  -50,-50,-50,-50,-50,-50,-50,-50,
  -50,-50,-50,-50,-50,-50,-50,-50,
  -50,-50,-50,-50,-50,-50,-50,-50,
  -50,-40,-50,-50,-50,-50,-40,-50,
  -40,-30,-40,-50,-50,-40,-30,-40,
  -30,-20,-30,-40,-40,-30,-20,-30,
  -20,-10,-20,-30,-30,-20,-10,-20,
  -10,  0,-10,-20,-20,-10,  0,-10,
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
 * TEST-ONLY. The seven value arrays by name, so `ABC-215` `A2` can rebuild each one from the rule
 * in its comment and compare every entry. Nothing in production reads it (the
 * `evaluateWithoutMobility` precedent).
 */
export const VALUE_TABLES_FOR_TEST = {
  PIECE_VALUE,
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_TABLE,
} as const;

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
 *
 * Weighted per piece type (ABC-207), indexed by `pieceType`. Rule: the minor pieces keep 4; a
 * rook's square is worth half that and a queen's a quarter — the more squares a type reaches on an
 * open board (N 8, B 13, R 14, Q 27), the less one more is worth to it. The king keeps 4 (out of
 * scope).
 */
const MOBILITY_WEIGHT: readonly number[] = [0, 0, 4, 4, 2, 1, 4];
const NO_MOBILITY: readonly number[] = [0, 0, 0, 0, 0, 0, 0];
const MOBILITY_CAP = 100;

/**
 * ABC-207's early-queen term: a quarter pawn, charged to a side whose queen has left its home
 * square (d1 / d8) while at least 2 of its four minor pieces are still on theirs. Outside the
 * mobility clamp. The condition is its own phase cut-off: no endgame has it.
 */
const EARLY_QUEEN_PENALTY = 25;
const WHITE_QUEEN_HOME = 0x03;
const BLACK_QUEEN_HOME = 0x73;

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

/**
 * How many of one side's four minor pieces stand on their home squares: the knights on b and g,
 * the bishops on c and f, of the back rank starting at square `back` (0 white, 0x70 black).
 */
function minorsHome(board: Uint8Array, knight: number, bishop: number, back: number): number {
  return (
    (board[back + 1] === knight ? 1 : 0) +
    (board[back + 6] === knight ? 1 : 0) +
    (board[back + 2] === bishop ? 1 : 0) +
    (board[back + 5] === bishop ? 1 : 0)
  );
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
function whiteMinusBlack(position: Position, mobilityWeight: readonly number[]): number {
  const board = position.board;
  let score = 0;
  let mobility = 0;
  let whiteKing = -1;
  let blackKing = -1;
  let whiteQueenOut = false;
  let blackQueenOut = false;

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
      const reached = squaresReached(board, square, piece) * (mobilityWeight[type] as number);
      mobility += black ? -reached : reached;
      if (type === QUEEN) {
        if (black) blackQueenOut ||= square !== BLACK_QUEEN_HOME;
        else whiteQueenOut ||= square !== WHITE_QUEEN_HOME;
      }
      if (type === KING) {
        if (black) blackKing = square;
        else whiteKing = square;
      }
    }
  }

  const mobilityScore = Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobility));
  const kingSafety =
    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1) -
    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1);

  const earlyQueen =
    (whiteQueenOut && minorsHome(board, KNIGHT, BISHOP, 0) >= 2 ? EARLY_QUEEN_PENALTY : 0) -
    (blackQueenOut && minorsHome(board, KNIGHT | BLACK, BISHOP | BLACK, 0x70) >= 2
      ? EARLY_QUEEN_PENALTY
      : 0);

  return score + pawnStructure(board) + kingSafety + mobilityScore - earlyQueen;
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
 * TEST-ONLY. `evaluate` with every mobility weight at 0 — every other term, the sign convention and
 * the board walk unchanged — so `evaluate(p) - evaluateWithoutMobility(p)` is exactly the mobility
 * term, which is how `ABC-083` `A4` reads its ±100 cp bound. Nothing in production calls it (the
 * `searchWithout…` doors' precedent).
 */
export function evaluateWithoutMobility(position: Position): number {
  const score = whiteMinusBlack(position, NO_MOBILITY);
  return position.blackToMove ? 0 - score : score;
}
