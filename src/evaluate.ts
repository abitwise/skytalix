/**
 * Static evaluation — material plus piece-square tables (ABC-076), plus pawn structure (ABC-082),
 * plus king safety and mobility (ABC-083).
 *
 * One pure function: a position in, a centipawn score out, in the NEGAMAX convention —
 * positive is good for the SIDE TO MOVE, never "good for white". The search (ABC-077) can
 * therefore negate on every ply without knowing whose turn it is.
 *
 * There is no search here and no terminal scoring: mate and stalemate depend on distance to the
 * root, which a bare position cannot know, so they are ABC-077's. There is no state that changes
 * a value, and ONE memo (ABC-235 cut 5): the pawn-structure parts, kept in fixed typed arrays and
 * keyed EXACTLY by the two pawn masks they are a pure function of (see `pawnStructureCached`). A
 * hit returns what a miss would compute, so the memo changes the cost and never the score.
 *
 * Every number is HAND-TUNED and expected to move. Tests assert relations (a minor
 * piece outweighs the whole positional term; a centralised knight beats a knight at home),
 * never totals — the one exception being the start position, which is exactly 0 by symmetry.
 *
 * TAPERED (`ABC-269`, `ADR-0064`; this revises `ABC-083`'s "untapered by decision"): every term is
 * a middlegame / endgame pair in `src/evaluate-params.ts`, the data-only parameter table, each
 * value made by the rule written above it there. One linear phase (N 1, B 1, R 2, Q 4 over both
 * sides, clamped to 24) blends them, once per call: score = mg + trunc(Δ × (24 − phase) / 24),
 * where Δ = eg − mg sums only the terms whose halves differ (at E1 the king's square and the
 * passed pawns). trunc is odd, so the mirror stays exact. `evaluateWithoutTaper` is the
 * pre-`ABC-269` evaluation exactly (the blend at phase 24).
 *
 * CUT C1 (`arch-ABC-269-F3`, `ADR-0064` "F3 on G2"): the phase is not gathered in the board walk.
 * The search seeds it once at its root by `phaseOf` and carries it down its recursion as a number
 * argument, each child by `phaseAfterMove`; the tapered entry `evaluateAtPhase(position, phase)`
 * takes it. The king's Δ is read after the walk from the two king squares. `evaluate(position)` is
 * `evaluateAtPhase(position, phaseOf(position))`, `Object.is`-exact, for every caller outside the
 * search. Nothing is added to `Position`, `UndoRecord` or module state (`ADR-0002` clause 1,
 * `ADR-0020` d3, `ADR-0064` d7).
 */

import {
  DOUBLED,
  ISOLATED,
  KING_FILE_HALF_OPEN,
  KING_FILE_OPEN,
  KING_SHELTER_MISSING,
  MATERIAL,
  MOBILITY_CAP as MOBILITY_CAP_PAIR,
  MOBILITY_WEIGHT as MOBILITY_WEIGHT_PAIR,
  PASSED,
  PHASE_EG,
  PHASE_MG,
  PHASE_WEIGHT,
  PST,
} from "./evaluate-params.ts";
import type { Move } from "./moves.ts";
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
 * The flat lookup arrays, derived once at load from `src/evaluate-params.ts` (`ADR-0064` decision
 * 4). The middlegame half of every term; where the endgame half differs (the king's square and the
 * passed pawns), the difference is derived below and enters the blend's Δ. Never written after load.
 *
 * `PIECE_VALUE` is indexed by `pieceType` (PAWN=1 … KING=6); index 0 is EMPTY and is never read.
 * The tables are rank-8-first from WHITE's point of view; black reads them with the rank flipped.
 */
const PIECE_VALUE: readonly number[] = MATERIAL.mg;
const PAWN_TABLE: readonly number[] = PST.pawn.mg;
const KNIGHT_TABLE: readonly number[] = PST.knight.mg;
const BISHOP_TABLE: readonly number[] = PST.bishop.mg;
const ROOK_TABLE: readonly number[] = PST.rook.mg;
const QUEEN_TABLE: readonly number[] = PST.queen.mg;
const KING_TABLE: readonly number[] = PST.king.mg;
const KING_TABLE_EG: readonly number[] = PST.king.eg;

/** The king's endgame half minus its middlegame half, per table index: the king's share of Δ. */
const KING_EG_DELTA = new Int32Array(64);
for (let i = 0; i < 64; i++) {
  KING_EG_DELTA[i] = (KING_TABLE_EG[i] as number) - (KING_TABLE[i] as number);
}

/** The blend's span D = `PHASE_MG` − `PHASE_EG` (24 at E1, form L: w = phase). */
const PHASE_SPAN = PHASE_MG - PHASE_EG;

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
 * TEST-ONLY. The value arrays by name, so `ABC-215` `A2` can rebuild each one from the rule in its
 * comment and compare every entry: the seven middlegame arrays, plus the two endgame halves that
 * differ (`ABC-269`: the king's, `40 − 15 m`, and the passed pawns', `2 ×` by rank) beside the
 * passed middlegame half. Nothing in production reads it (the `evaluateWithoutMobility` precedent).
 */
export const VALUE_TABLES_FOR_TEST = {
  PIECE_VALUE,
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_TABLE,
  KING_TABLE_EG,
  PASSED_PAWN_BONUS: PASSED.mg,
  PASSED_PAWN_BONUS_EG: PASSED.eg,
} as const;

/**
 * ABC-082's three pawn terms, in centipawns (the values and their reasons: `src/evaluate-params.ts`).
 * The epic names exactly these three; backward pawns, chains, connected passers and storms are
 * fenced out. PASSED is indexed by rank counted from the pawn's OWN side; its endgame half differs
 * (`ABC-269`) and is summed apart, so the blend can take it.
 */
const DOUBLED_PAWN_PENALTY = DOUBLED.mg;
const ISOLATED_PAWN_PENALTY = ISOLATED.mg;
const PASSED_PAWN_BONUS: readonly number[] = PASSED.mg;
const PASSED_PAWN_BONUS_EG: readonly number[] = PASSED.eg;

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
 * FILE_OPEN: no pawn of either colour on the file. Its two halves are equal at E1: king safety by
 * phase is E3's (`ADR-0064` decision 10; this was `ABC-083`'s "untapered by decision").
 */
const KING_SHELTER_MISSING_PENALTY = KING_SHELTER_MISSING.mg;
const KING_FILE_HALF_OPEN_PENALTY = KING_FILE_HALF_OPEN.mg;
const KING_FILE_OPEN_PENALTY = KING_FILE_OPEN.mg;

/**
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches (empty, or holding an enemy
 * piece) — the attack-map form of `ADR-0031` decision 2: counted on the board, no `Move` objects,
 * no make/unmake, pins and checks ignored. The total is clamped to `A4`'s ±100 cp, so mobility can
 * never outvote a minor piece.
 */
const MOBILITY_WEIGHT = MOBILITY_WEIGHT_PAIR.mg;
const MOBILITY_CAP = MOBILITY_CAP_PAIR.mg;

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
 * `pawnStructure`'s passed-pawn part, set by each call beside its return value: the cache stores
 * the doubled-and-isolated sum and the passed sum apart, so `ABC-232` can blend the passed part
 * by phase outside the cache without re-keying it (the Architect's seam, `arch-ABC-235`).
 */
let passedPart = 0;
/** The passed-pawn sum by the ENDGAME half (`ABC-269`), set beside `passedPart`, the same way. */
let passedEgPart = 0;

/**
 * The three pawn terms from WHITE's point of view. Two passes over the six ranks a pawn can
 * stand on: the first finds which files each side has a pawn on (and counts the extra pawns that
 * make a file doubled), the second needs those complete file sets to judge isolation.
 *
 * Returns the doubled-and-isolated sum and leaves the passed-pawn sum in `passedPart` (and its
 * endgame half in `passedEgPart`). The first two are
 * integer sums, so their total is the single sum this function used to return, bit for bit.
 */
function pawnStructure(board: Uint8Array): number {
  let whiteFiles = 0;
  let blackFiles = 0;
  let score = 0;
  let passed = 0;
  let passedEg = 0;

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
        if (isPassedPawn(board, square)) {
          passed += PASSED_PAWN_BONUS[rank] as number;
          passedEg += PASSED_PAWN_BONUS_EG[rank] as number;
        }
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & adjacentFiles(file)) === 0) score += ISOLATED_PAWN_PENALTY;
        if (isPassedPawn(board, square)) {
          passed -= PASSED_PAWN_BONUS[7 - rank] as number;
          passedEg -= PASSED_PAWN_BONUS_EG[7 - rank] as number;
        }
      }
    }
  }

  passedPart = passed;
  passedEgPart = passedEg;
  return score;
}

/**
 * ABC-235 cut 5: the pawn-structure memo. `pawnStructure` reads only the squares of ranks 2-7
 * compared with `PAWN` and `BLACK_PAWN` (and `isPassedPawn` only enemy pawns there), so it is a
 * pure function of two 48-bit masks: which of those 48 squares hold a white pawn, and which a
 * black one. A 48-bit integer is exact in a double, so the KEY is the two masks themselves.
 *
 * - Direct-mapped: 2^14 slots in fixed typed arrays, allocated once per process. Each slot holds
 *   both masks and the three parts (the passed endgame part is `ABC-269`'s): 2^14 x (8 + 8 + 4 +
 *   4 + 4) bytes = 448 KiB, fixed (`NFR-009`).
 * - A HIT needs BOTH masks equal — never the slot index alone. Empty slots hold -1, which no
 *   mask equals. A collision only overwrites; it can cost a recomputation, never a wrong score.
 * - Never cleared between searches: no value depends on it. `clearPawnCacheForTest` empties it
 *   for a cold reading. `kingExposure` reads the king squares too, so it stays out.
 */
const PAWN_CACHE_SLOTS = 1 << 14;
const PAWN_CACHE_INDEX_MASK = PAWN_CACHE_SLOTS - 1;
const pawnCacheWhite = new Float64Array(PAWN_CACHE_SLOTS).fill(-1);
const pawnCacheBlack = new Float64Array(PAWN_CACHE_SLOTS).fill(-1);
const pawnCacheStructure = new Int32Array(PAWN_CACHE_SLOTS);
const pawnCachePassed = new Int32Array(PAWN_CACHE_SLOTS);
const pawnCachePassedEg = new Int32Array(PAWN_CACHE_SLOTS);

/**
 * Per 0x88 square: the square's bit in a pawn mask (2^0 … 2^47 over ranks 2-7), and a fixed
 * pseudo-random 32-bit word per colour that only picks the slot. Both are 0 off ranks 2-7, so a
 * pawn there (off-domain) enters neither the key nor the index — `pawnStructure` never reads it.
 */
const PAWN_MASK_BIT = new Float64Array(128);
const PAWN_SLOT_WORD_WHITE = new Int32Array(128);
const PAWN_SLOT_WORD_BLACK = new Int32Array(128);
{
  let seed = 0x2545f491;
  const next = (): number => {
    // xorshift32: deterministic, so the slot layout is the same in every process.
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return seed | 0;
  };
  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 16 + file;
      PAWN_MASK_BIT[square] = 2 ** ((rank - 1) * 8 + file);
      PAWN_SLOT_WORD_WHITE[square] = next();
      PAWN_SLOT_WORD_BLACK[square] = next();
    }
  }
}

/** `pawnStructure(board)`'s parts, from the memo when both masks match; sets `passedPart` and `passedEgPart`. */
function pawnStructureCached(
  board: Uint8Array,
  whiteMask: number,
  blackMask: number,
  slotWord: number,
): number {
  const slot = slotWord & PAWN_CACHE_INDEX_MASK;
  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {
    passedPart = pawnCachePassed[slot] as number;
    passedEgPart = pawnCachePassedEg[slot] as number;
    return pawnCacheStructure[slot] as number;
  }
  const structure = pawnStructure(board);
  pawnCacheWhite[slot] = whiteMask;
  pawnCacheBlack[slot] = blackMask;
  pawnCacheStructure[slot] = structure;
  pawnCachePassed[slot] = passedPart;
  pawnCachePassedEg[slot] = passedEgPart;
  return structure;
}

/** TEST-ONLY. Empties the pawn memo, for a cache-cold reading. No value depends on it. */
export function clearPawnCacheForTest(): void {
  pawnCacheWhite.fill(-1);
  pawnCacheBlack.fill(-1);
}

/** The pawn memo's fixed size in bytes, for `NFR-009` (a)'s byte-length sum. */
export function pawnCacheByteLength(): number {
  return (
    pawnCacheWhite.byteLength +
    pawnCacheBlack.byteLength +
    pawnCacheStructure.byteLength +
    pawnCachePassed.byteLength +
    pawnCachePassedEg.byteLength
  );
}

/**
 * TEST-ONLY. The slot `position`'s pawn placement maps to, and whether the memo holds that exact
 * placement there now — so a test can build a forced collision and watch a hit happen.
 */
export function pawnCacheProbeForTest(position: Position): { slot: number; hit: boolean } {
  const board = position.board;
  let whiteMask = 0;
  let blackMask = 0;
  let slotWord = 0;
  for (let square = 0; square < 128; square++) {
    const piece = board[square];
    if (piece === PAWN) {
      whiteMask += PAWN_MASK_BIT[square] as number;
      slotWord ^= PAWN_SLOT_WORD_WHITE[square] as number;
    } else if (piece === BLACK_PAWN) {
      blackMask += PAWN_MASK_BIT[square] as number;
      slotWord ^= PAWN_SLOT_WORD_BLACK[square] as number;
    }
  }
  const slot = slotWord & PAWN_CACHE_INDEX_MASK;
  return { slot, hit: pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask };
}

/**
 * The game phase of `position`: Σ `PHASE_WEIGHT` over the board (N 1, B 1, R 2, Q 4; pawns and
 * kings 0), unclamped. The search's seed at its root, and the oracle `phaseAfterMove` is proved
 * against (`ABC-269` cut C1). A walk of its own: the shipped recursions call it once per root
 * call or iteration, never per node.
 */
export function phaseOf(position: Position): number {
  const board = position.board;
  let phase = 0;
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank * 16 + file] as number;
      if (piece !== EMPTY) phase += PHASE_WEIGHT[pieceType(piece)] as number;
    }
  }
  return phase;
}

/**
 * The phase after `move` is made from a node of phase `phase` (`ABC-269` cut C1): the captured
 * piece's weight leaves, the promotion piece's weight arrives. Pure, branch-free, no undo.
 * `PHASE_WEIGHT` is 0 for EMPTY, PAWN and KING, so a quiet move, castling and en passant change
 * nothing, and `move.promotion` is EMPTY on every move but a promotion. Equal to `phaseOf` of the
 * child by construction (`P2` in `src/evaluate.taper.test.ts` proves it on every move kind).
 */
export function phaseAfterMove(phase: number, move: Move): number {
  return (
    phase - (PHASE_WEIGHT[move.captured & 7] as number) + (PHASE_WEIGHT[move.promotion] as number)
  );
}

/**
 * Score of a position from WHITE's point of view: white's material and placement minus
 * black's. Kept separate from the negamax flip so the sign convention lives in exactly one
 * place and the tables are read exactly once per piece.
 *
 * `taper` (`ABC-269`, `ADR-0064` decisions 1, 2 and 6): `phase` is the caller's, carried by the
 * search (cut C1), and the king's Δ is read after the walk from the two king squares, so the walk
 * holds no phase add and no king Δ; the blend is applied once, at the end, in the delta form
 * mg + trunc(Δ × (D − w) / D). `phase` is read only when `taper` is true.
 * That form, and never trunc((mg × w + eg × (D − w)) / D), is built: the full form can return −0
 * on one side and +0 on its mirror (`QE-269-b`). With `taper` false the result is the middlegame
 * sum exactly, the pre-`ABC-269` evaluation.
 */
function whiteMinusBlack(
  position: Position,
  mobilityWeight: number,
  pawnCache: boolean,
  taper: boolean,
  phase: number,
): number {
  const board = position.board;
  let score = 0;
  let mobility = 0;
  let whiteKing = -1;
  let blackKing = -1;
  let whitePawns = 0;
  let blackPawns = 0;
  let pawnSlotWord = 0;

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

      if (type === PAWN) {
        if (black) {
          blackPawns += PAWN_MASK_BIT[square] as number;
          pawnSlotWord ^= PAWN_SLOT_WORD_BLACK[square] as number;
        } else {
          whitePawns += PAWN_MASK_BIT[square] as number;
          pawnSlotWord ^= PAWN_SLOT_WORD_WHITE[square] as number;
        }
        continue;
      }
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

  const structure = pawnCache
    ? pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord)
    : pawnStructure(board);
  const mg = score + (structure + passedPart) + kingSafety + mobilityScore;
  if (!taper) return mg;

  // The king's Δ, after the walk, by the walk's own table index (white rank 7 − r, black rank r).
  // A missing king (square −1) adds 0, the in-walk form's value; one king per colour is the domain.
  let egDelta = passedEgPart - passedPart;
  if (whiteKing !== -1) {
    egDelta += KING_EG_DELTA[(7 - (whiteKing >> 4)) * 8 + (whiteKing & 7)] as number;
  }
  if (blackKing !== -1) {
    egDelta -= KING_EG_DELTA[(blackKing >> 4) * 8 + (blackKing & 7)] as number;
  }
  // w = clamp(phase − PHASE_EG, 0, D), the phase clamped to 24 first. `mg + trunc(…)` is +0 when
  // mg is 0 and the product truncates to −0, so the mirror stays `Object.is`-exact.
  let w = (phase > 24 ? 24 : phase) - PHASE_EG;
  if (w < 0) w = 0;
  else if (w > PHASE_SPAN) w = PHASE_SPAN;
  return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN);
}

/**
 * The static score of `position` in centipawns, positive for the side to move.
 *
 * Pure: it reads the position and writes nothing — not even transiently. (`zobristKey` on this
 * codebase does mutate transiently, which is why ABC-076's A5 asserts byte-identity here.)
 */
export function evaluate(position: Position): number {
  return evaluateAtPhase(position, phaseOf(position));
}

/**
 * THE tapered entry the shipped recursions call (`ABC-269` cut C1): `evaluate` with the phase
 * supplied by the caller, which must be `phaseOf(position)` — the search carries it down by
 * `phaseAfterMove`. `evaluate(p)` ≡ `evaluateAtPhase(p, phaseOf(p))`, `Object.is`-exact.
 */
export function evaluateAtPhase(position: Position, phase: number): number {
  const score = whiteMinusBlack(position, MOBILITY_WEIGHT, true, true, phase);
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
  const score = whiteMinusBlack(position, 0, true, true, phaseOf(position));
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY. `evaluate` with the pawn memo bypassed — `pawnStructure` computed afresh, the memo
 * neither read nor written — so ABC-235 cut 5's oracle can compare the memoised `evaluate` with
 * it `Object.is` for `Object.is`. Nothing in production calls it (the `evaluateWithoutMobility`
 * precedent).
 */
export function evaluateWithoutPawnCache(position: Position): number {
  const score = whiteMinusBlack(position, MOBILITY_WEIGHT, false, true, phaseOf(position));
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY, and the evaluation every door older than `ABC-269` calls (`ADR-0064` decision 7): the
 * blend with w = D, which is the pre-`ABC-269` `evaluate` exactly, `Object.is` for `Object.is`
 * (`B1` (c) reads it against the frozen pre-ticket scores). The shipped recursions call `evaluate`;
 * a recursion reaches this only with its `taper` switch off, which no shipped call turns off.
 */
export function evaluateWithoutTaper(position: Position): number {
  const score = whiteMinusBlack(position, MOBILITY_WEIGHT, true, false, 0);
  return position.blackToMove ? 0 - score : score;
}
