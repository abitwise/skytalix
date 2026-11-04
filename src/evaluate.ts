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
 * where Δ = eg − mg sums EVERY term (`ABC-274`, `ADR-0067` decision 8: material, every square
 * table, doubled, isolated, passed, the three king-file terms, their three queen-on pairs (`ABC-270`,
 * `ADR-0068`, at 0) and mobility). At E1's table only
 * the king's square and the passed pawns have halves that differ, so the score is the one E1
 * computed, bit for bit. trunc is odd, so the mirror stays exact. `evaluateWithoutTaper` is the
 * pre-`ABC-269` evaluation exactly (the blend at phase 24).
 *
 * PACKED (`ABC-274`): every term but mobility is held as one integer per entry, eg × 2^16 + mg, so
 * the walk keeps one table read and one add per piece and the two halves are summed together.
 * The sum is split once, after the walk: mg is its low 16 bits sign-extended, eg the rest. That is
 * exact while Σ mg and Σ eg (white minus black) each fit in int16, which `A9` in
 * `src/evaluate.taper.test.ts` bounds from `src/evaluate-params.ts`'s own maxima. Mobility is
 * clamped, so it is not linear and stays outside the packed sum, as a pair of its own.
 *
 * CUT C1 (`arch-ABC-269-F3`, `ADR-0064` "F3 on G2"): the phase is not gathered in the board walk.
 * The search seeds it once at its root by `phaseOf` and carries it down its recursion as a number
 * argument, each child by `phaseAfterMove`; the tapered entry `evaluateAtPhase(position, phase)`
 * takes it. The king's Δ is read after the walk from the two king squares. `evaluate(position)` is
 * `evaluateAtPhase(position, phaseOf(position))`, `Object.is`-exact, for every caller outside the
 * search. Nothing is added to `Position`, `UndoRecord` or module state (`ADR-0002` clause 1,
 * `ADR-0020` d3, `ADR-0064` d7).
 */

import * as PARAMETERS from "./evaluate-params.ts";
import { MATERIAL, PASSED, PHASE_EG, PHASE_MG, PHASE_WEIGHT, PST } from "./evaluate-params.ts";
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
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";

/**
 * The halves of every term as `src/evaluate-params.ts` writes them (`ADR-0064` decision 4). The
 * packed arrays below are built from these, once at load; the named arrays are kept for
 * `VALUE_TABLES_FOR_TEST`. `PIECE_VALUE` is indexed by `pieceType` (PAWN=1 … KING=6); index 0 is
 * EMPTY and is never read. The tables are rank-8-first from WHITE's point of view; black reads
 * them with the rank flipped.
 */
const PIECE_VALUE: readonly number[] = MATERIAL.mg;
const PAWN_TABLE: readonly number[] = PST.pawn.mg;
const KNIGHT_TABLE: readonly number[] = PST.knight.mg;
const BISHOP_TABLE: readonly number[] = PST.bishop.mg;
const ROOK_TABLE: readonly number[] = PST.rook.mg;
const QUEEN_TABLE: readonly number[] = PST.queen.mg;
const KING_TABLE: readonly number[] = PST.king.mg;
const KING_TABLE_EG: readonly number[] = PST.king.eg;

/** The blend's span D = `PHASE_MG` − `PHASE_EG` (24 at E1, form L: w = phase). */
const PHASE_SPAN = PHASE_MG - PHASE_EG;

/**
 * One packed entry: eg × 2^16 + mg (`ABC-274`). A sum of packed entries is the packed pair of the
 * two sums, and `0 − packed` packs the two negations, so white minus black needs no split.
 */
const PACK = 65536;
const pack = (mg: number, eg: number): number => eg * PACK + mg;

/** What the table loader reads: `src/evaluate-params.ts`'s shape (its phase constants are not read). */
export type EvaluationParameters = typeof PARAMETERS;

/**
 * Material plus square table, packed, at `pieceType × 64 + table index` (index 0..63 is EMPTY's
 * and is never read). The king's entry packs its middlegame half twice: the king's Δ is read after
 * the walk from `KING_EG_DELTA` (`ABC-269` cut C1's form, kept), so the walk reads one entry per
 * piece and nothing else.
 */
const PACKED_PIECE_SQUARE = new Int32Array(7 * 64);
/** The king's endgame half minus its middlegame half, per table index: the king's share of Δ. */
const KING_EG_DELTA = new Int32Array(64);
/** Passed pawns by own rank, packed. */
const PACKED_PASSED = new Int32Array(8);
/** The eight scalar terms, packed, at the indexes named below (the last three: `ABC-270`'s queen-on). */
const PACKED_TERMS = new Int32Array(8);
const DOUBLED_AT = 0;
const ISOLATED_AT = 1;
const SHELTER_AT = 2;
const HALF_OPEN_AT = 3;
const OPEN_AT = 4;
const SHELTER_QUEEN_AT = 5;
const HALF_OPEN_QUEEN_AT = 6;
const OPEN_QUEEN_AT = 7;
/** Mobility, outside the packed sum: weight mg, weight eg, cap mg, cap eg. */
const MOBILITY_TERMS = new Int32Array(4);

/**
 * Fills the packed arrays from `parameters`. Called once at load with `src/evaluate-params.ts`;
 * otherwise only by `withParametersForTest`. `evaluate` never writes them.
 */
function loadParameters(parameters: EvaluationParameters): void {
  const { MATERIAL: material, PST: pst } = parameters;
  const tables = [pst.pawn, pst.pawn, pst.knight, pst.bishop, pst.rook, pst.queen, pst.king];
  for (let type = 1; type <= 6; type++) {
    const table = tables[type] as {
      readonly mg: readonly number[];
      readonly eg: readonly number[];
    };
    for (let i = 0; i < 64; i++) {
      const mg = (material.mg[type] as number) + (table.mg[i] as number);
      const eg =
        (material.eg[type] as number) +
        (type === 6 ? (table.mg[i] as number) : (table.eg[i] as number));
      PACKED_PIECE_SQUARE[type * 64 + i] = pack(mg, eg);
    }
  }
  for (let i = 0; i < 64; i++) {
    KING_EG_DELTA[i] = (pst.king.eg[i] as number) - (pst.king.mg[i] as number);
  }
  for (let rank = 0; rank < 8; rank++) {
    PACKED_PASSED[rank] = pack(
      parameters.PASSED.mg[rank] as number,
      parameters.PASSED.eg[rank] as number,
    );
  }
  const pair = (term: { readonly mg: number; readonly eg: number }): number =>
    pack(term.mg, term.eg);
  PACKED_TERMS[DOUBLED_AT] = pair(parameters.DOUBLED);
  PACKED_TERMS[ISOLATED_AT] = pair(parameters.ISOLATED);
  PACKED_TERMS[SHELTER_AT] = pair(parameters.KING_SHELTER_MISSING);
  PACKED_TERMS[HALF_OPEN_AT] = pair(parameters.KING_FILE_HALF_OPEN);
  PACKED_TERMS[OPEN_AT] = pair(parameters.KING_FILE_OPEN);
  PACKED_TERMS[SHELTER_QUEEN_AT] = pair(parameters.KING_SHELTER_MISSING_QUEEN);
  PACKED_TERMS[HALF_OPEN_QUEEN_AT] = pair(parameters.KING_FILE_HALF_OPEN_QUEEN);
  PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);
  MOBILITY_TERMS[0] = parameters.MOBILITY_WEIGHT.mg;
  MOBILITY_TERMS[1] = parameters.MOBILITY_WEIGHT.eg;
  MOBILITY_TERMS[2] = parameters.MOBILITY_CAP.mg;
  MOBILITY_TERMS[3] = parameters.MOBILITY_CAP.eg;
}
loadParameters(PARAMETERS);

/**
 * TEST-ONLY. The value arrays by name, so `ABC-215` `A2` can rebuild each one from the rule in its
 * comment and compare every entry: the seven middlegame arrays, plus the two endgame halves that
 * differ (`ABC-269`: the king's, `40 − 15 m`, and the passed pawns', `2 ×` by rank) beside the
 * passed middlegame half. Nothing in production reads it (the `evaluateWithoutMobility` precedent);
 * the packed arrays `evaluate` reads are built from the same parameter table (`ABC-274`).
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

/*
 * ABC-082's three pawn terms, in centipawns (the values and their reasons: `src/evaluate-params.ts`).
 * The epic names exactly these three; backward pawns, chains, connected passers and storms are
 * fenced out. PASSED is indexed by rank counted from the pawn's OWN side. All three are read
 * packed (`PACKED_TERMS`, `PACKED_PASSED`; `ABC-274`).
 */

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
 * phase is E3's (`ADR-0064` decision 10; this was `ABC-083`'s "untapered by decision"). Read
 * packed from `PACKED_TERMS`, so both halves enter the blend (`ABC-274`). E3a (`ABC-270`,
 * `ADR-0068`): while the enemy has a queen, each file term carries its queen-on pair too, 0 at
 * start, so the tuner can fit queen-dependent king safety as three linear features.
 *
 * ABC-083's mobility: centipawns per square a non-pawn piece reaches (empty, or holding an enemy
 * piece) — the attack-map form of `ADR-0031` decision 2: counted on the board, no `Move` objects,
 * no make/unmake, pins and checks ignored. Each half's total is clamped to its cap (`A4`'s
 * ±100 cp), so mobility can never outvote a minor piece. Read from `MOBILITY_TERMS`.
 */

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
 * The king-safety penalty for the king on `king` (positive = worse for that king's side), packed.
 * `ownPawn`/`enemyPawn` are the two coloured pawn codes and `step` is the king's forward
 * direction in ranks (+1 white, -1 black), which is what makes the term mirror-exact.
 * `enemyQueen` is true while the enemy has at least one queen (a flag, not a count): then each
 * file term carries its queen-on pair too (`ABC-270`, `ADR-0068` d3), added once per king, before
 * the file loop, so the loop is unchanged.
 */
function kingExposure(
  board: Uint8Array,
  king: number,
  ownPawn: number,
  enemyPawn: number,
  step: number,
  enemyQueen: boolean,
): number {
  const kingFile = fileOf(king);
  const shelterRank1 = rankOf(king) + step;
  const shelterRank2 = shelterRank1 + step;
  const fromFile = kingFile === 0 ? 0 : kingFile - 1;
  const toFile = kingFile === 7 ? 7 : kingFile + 1;
  let shelterMissing = PACKED_TERMS[SHELTER_AT] as number;
  let fileHalfOpen = PACKED_TERMS[HALF_OPEN_AT] as number;
  let fileOpen = PACKED_TERMS[OPEN_AT] as number;
  if (enemyQueen) {
    shelterMissing += PACKED_TERMS[SHELTER_QUEEN_AT] as number;
    fileHalfOpen += PACKED_TERMS[HALF_OPEN_QUEEN_AT] as number;
    fileOpen += PACKED_TERMS[OPEN_QUEEN_AT] as number;
  }
  let penalty = 0;

  for (let file = fromFile; file <= toFile; file++) {
    const sheltered =
      (shelterRank1 >= 0 && shelterRank1 <= 7 && board[shelterRank1 * 16 + file] === ownPawn) ||
      (shelterRank2 >= 0 && shelterRank2 <= 7 && board[shelterRank2 * 16 + file] === ownPawn);
    if (!sheltered) penalty += shelterMissing;

    let own = false;
    let enemy = false;
    for (let rank = 1; rank <= 6; rank++) {
      const piece = board[rank * 16 + file];
      if (piece === ownPawn) own = true;
      else if (piece === enemyPawn) enemy = true;
    }
    if (!own) penalty += enemy ? fileHalfOpen : fileOpen;
  }

  return penalty;
}

/** The files either side of `file`, as a bitmask over files a..h (bit 0 = a). */
const adjacentFiles = (file: number): number => (((1 << file) << 1) | ((1 << file) >> 1)) & 0xff;

/**
 * `pawnStructure`'s three parts, one per pawn term, each packed (`ABC-274`), set by each call
 * beside its return value (their sum) so the memo can store them. The memo keeps three parts, as
 * it did when they were the doubled-and-isolated sum and the passed sum's two halves.
 */
let doubledPart = 0;
let isolatedPart = 0;
let passedPart = 0;

/**
 * The three pawn terms from WHITE's point of view, packed. Two passes over the six ranks a pawn
 * can stand on: the first finds which files each side has a pawn on (and counts the extra pawns
 * that make a file doubled), the second needs those complete file sets to judge isolation.
 *
 * Returns the packed sum of the three terms and leaves each term's packed sum in `doubledPart`,
 * `isolatedPart` and `passedPart`. All are integer sums.
 */
function pawnStructure(board: Uint8Array): number {
  const doubledPenalty = PACKED_TERMS[DOUBLED_AT] as number;
  const isolatedPenalty = PACKED_TERMS[ISOLATED_AT] as number;
  let whiteFiles = 0;
  let blackFiles = 0;
  let doubled = 0;
  let isolated = 0;
  let passed = 0;

  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank * 16 + file];
      const bit = 1 << file;
      if (piece === PAWN) {
        if ((whiteFiles & bit) !== 0) doubled -= doubledPenalty;
        whiteFiles |= bit;
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & bit) !== 0) doubled += doubledPenalty;
        blackFiles |= bit;
      }
    }
  }

  for (let rank = 1; rank <= 6; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 16 + file;
      const piece = board[square];
      if (piece === PAWN) {
        if ((whiteFiles & adjacentFiles(file)) === 0) isolated -= isolatedPenalty;
        if (isPassedPawn(board, square)) passed += PACKED_PASSED[rank] as number;
      } else if (piece === BLACK_PAWN) {
        if ((blackFiles & adjacentFiles(file)) === 0) isolated += isolatedPenalty;
        if (isPassedPawn(board, square)) passed -= PACKED_PASSED[7 - rank] as number;
      }
    }
  }

  doubledPart = doubled;
  isolatedPart = isolated;
  passedPart = passed;
  return doubled + isolated + passed;
}

/**
 * ABC-235 cut 5: the pawn-structure memo. `pawnStructure` reads only the squares of ranks 2-7
 * compared with `PAWN` and `BLACK_PAWN` (and `isPassedPawn` only enemy pawns there), so it is a
 * pure function of two 48-bit masks: which of those 48 squares hold a white pawn, and which a
 * black one. A 48-bit integer is exact in a double, so the KEY is the two masks themselves.
 *
 * - Direct-mapped: 2^14 slots in fixed typed arrays, allocated once per process. Each slot holds
 *   both masks and the three packed parts (doubled, isolated, passed; `ABC-274`): 2^14 x (8 + 8 +
 *   4 + 4 + 4) bytes = 448 KiB, fixed (`NFR-009`).
 * - A HIT needs BOTH masks equal — never the slot index alone. Empty slots hold -1, which no
 *   mask equals. A collision only overwrites; it can cost a recomputation, never a wrong score.
 * - Never cleared between searches: no value depends on it. `clearPawnCacheForTest` empties it
 *   for a cold reading. `kingExposure` reads the king squares too, so it stays out.
 */
const PAWN_CACHE_SLOTS = 1 << 14;
const PAWN_CACHE_INDEX_MASK = PAWN_CACHE_SLOTS - 1;
const pawnCacheWhite = new Float64Array(PAWN_CACHE_SLOTS).fill(-1);
const pawnCacheBlack = new Float64Array(PAWN_CACHE_SLOTS).fill(-1);
const pawnCacheDoubled = new Int32Array(PAWN_CACHE_SLOTS);
const pawnCacheIsolated = new Int32Array(PAWN_CACHE_SLOTS);
const pawnCachePassed = new Int32Array(PAWN_CACHE_SLOTS);

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

/** `pawnStructure(board)`'s packed sum, from the memo when both masks match. */
function pawnStructureCached(
  board: Uint8Array,
  whiteMask: number,
  blackMask: number,
  slotWord: number,
): number {
  const slot = slotWord & PAWN_CACHE_INDEX_MASK;
  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {
    return (
      (pawnCacheDoubled[slot] as number) +
      (pawnCacheIsolated[slot] as number) +
      (pawnCachePassed[slot] as number)
    );
  }
  const structure = pawnStructure(board);
  pawnCacheWhite[slot] = whiteMask;
  pawnCacheBlack[slot] = blackMask;
  pawnCacheDoubled[slot] = doubledPart;
  pawnCacheIsolated[slot] = isolatedPart;
  pawnCachePassed[slot] = passedPart;
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
    pawnCacheDoubled.byteLength +
    pawnCacheIsolated.byteLength +
    pawnCachePassed.byteLength
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
 * mg + trunc(Δ × (D − w) / D), Δ over every term (`ABC-274`): the packed sum's eg − mg, the king's
 * Δ and mobility's. `phase` is read only when `taper` is true. `mobility` false sets both
 * mobility weights to 0 (`evaluateWithoutMobility`).
 * That form, and never trunc((mg × w + eg × (D − w)) / D), is built: the full form can return −0
 * on one side and +0 on its mirror (`QE-269-b`). With `taper` false the result is the middlegame
 * sum exactly, the pre-`ABC-269` evaluation.
 */
function whiteMinusBlack(
  position: Position,
  mobility: boolean,
  pawnCache: boolean,
  taper: boolean,
  phase: number,
): number {
  const board = position.board;
  let score = 0;
  let reach = 0;
  let whiteKing = -1;
  let blackKing = -1;
  let whiteQueen = false;
  let blackQueen = false;
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
      // Material and square table, packed (`ABC-274`): one read, one add.
      const value = PACKED_PIECE_SQUARE[(type << 6) + tableIndex] as number;

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
      reach += black ? -reached : reached;
      // One compare per non-pawn piece, as before `ABC-270`: it gathers the kings and the two
      // queen flags (`ADR-0068` d3; QUEEN 5 and KING 6 are the two highest types).
      if (type >= QUEEN) {
        if (type === KING) {
          if (black) blackKing = square;
          else whiteKing = square;
        } else if (black) blackQueen = true;
        else whiteQueen = true;
      }
    }
  }

  const capMg = MOBILITY_TERMS[2] as number;
  const capEg = MOBILITY_TERMS[3] as number;
  const mobilityScore = mobility
    ? Math.max(-capMg, Math.min(capMg, (MOBILITY_TERMS[0] as number) * reach))
    : 0;
  const mobilityEg = mobility
    ? Math.max(-capEg, Math.min(capEg, (MOBILITY_TERMS[1] as number) * reach))
    : 0;
  const kingSafety =
    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen) -
    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen);

  const structure = pawnCache
    ? pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord)
    : pawnStructure(board);
  // Split the packed sum (`ABC-274`): mg is the low 16 bits sign-extended, eg the rest. Exact while
  // each half fits in int16 (`A9`).
  const packed = score + structure + kingSafety;
  const packedMg = (packed << 16) >> 16;
  const mg = packedMg + mobilityScore;
  if (!taper) return mg;

  // Δ over every term: the packed terms', mobility's, and the king's, which is read after the
  // walk by the walk's own table index (white rank 7 − r, black rank r). A missing king (square
  // −1) adds 0, the in-walk form's value; one king per colour is the domain.
  let egDelta = (packed - packedMg) / PACK - packedMg + (mobilityEg - mobilityScore);
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
  const score = whiteMinusBlack(position, true, true, true, phase);
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
  const score = whiteMinusBlack(position, false, true, true, phaseOf(position));
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY. `evaluate` with the pawn memo bypassed — `pawnStructure` computed afresh, the memo
 * neither read nor written — so ABC-235 cut 5's oracle can compare the memoised `evaluate` with
 * it `Object.is` for `Object.is`. Nothing in production calls it (the `evaluateWithoutMobility`
 * precedent).
 */
export function evaluateWithoutPawnCache(position: Position): number {
  const score = whiteMinusBlack(position, true, false, true, phaseOf(position));
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY, and the evaluation every door older than `ABC-269` calls (`ADR-0064` decision 7): the
 * blend with w = D, which is the pre-`ABC-269` `evaluate` exactly, `Object.is` for `Object.is`
 * (`B1` (c) reads it against the frozen pre-ticket scores). The shipped recursions call `evaluate`;
 * a recursion reaches this only with its `taper` switch off, which no shipped call turns off.
 */
export function evaluateWithoutTaper(position: Position): number {
  const score = whiteMinusBlack(position, true, true, false, 0);
  return position.blackToMove ? 0 - score : score;
}

/**
 * TEST-ONLY (`ABC-274` `A3`): runs `run` with the packed arrays built from `parameters` instead of
 * `src/evaluate-params.ts`, the pawn memo emptied before and after, and the shipped arrays rebuilt
 * afterwards, even on a throw. It lets a test offset one term's endgame half and read the blend
 * from `evaluate` itself, while `src/evaluate-params.ts` stays byte-unchanged. Nothing in
 * production calls it (the `evaluateWithoutMobility` precedent).
 */
export function withParametersForTest<T>(parameters: EvaluationParameters, run: () => T): T {
  try {
    loadParameters(parameters);
    clearPawnCacheForTest();
    return run();
  } finally {
    loadParameters(PARAMETERS);
    clearPawnCacheForTest();
  }
}

/**
 * TEST-ONLY (`ABC-270` K1 (c), `QE-270-a`): each king's exposure penalty, unpacked into its two
 * halves (positive = worse for that king's side), computed by the same `kingExposure` that
 * `evaluate` sums, with the same enemy-queen flags. `evaluate` reads only black minus white, so a
 * row where both kings move alike (QE's QP2) is invisible to it; this read is not. It reads the
 * packed arrays in force, so inside `withParametersForTest` it reads the test's table. Nothing in
 * production calls it (the `evaluateWithoutMobility` precedent).
 */
export function kingExposureForTest(position: Position): {
  white: { mg: number; eg: number };
  black: { mg: number; eg: number };
} {
  const board = position.board;
  let whiteKing = -1;
  let blackKing = -1;
  let whiteQueen = false;
  let blackQueen = false;
  for (let square = 0; square < 128; square++) {
    if ((square & 0x88) !== 0) continue;
    const piece = board[square] as number;
    if (piece === EMPTY) continue;
    const type = pieceType(piece);
    if (type === KING) {
      if (isBlack(piece)) blackKing = square;
      else whiteKing = square;
    } else if (type === QUEEN) {
      if (isBlack(piece)) blackQueen = true;
      else whiteQueen = true;
    }
  }
  const halves = (packed: number): { mg: number; eg: number } => {
    const mg = (packed << 16) >> 16;
    return { mg, eg: (packed - mg) / PACK };
  };
  return {
    white: halves(kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen)),
    black: halves(kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen)),
  };
}
