/**
 * Negamax with alpha-beta pruning — the recursion core (ABC-077).
 *
 * `search(position, depth)` returns the score of `position` in the negamax convention
 * (positive is good for the SIDE TO MOVE, exactly as `evaluate` reports it), the best root
 * move, and the number of nodes visited. Single-threaded, and deliberately so: EPIC-004's
 * threading decision is `UNKNOWN - verify` (`ADR-0005` F6) and belongs to Architect/Design —
 * nothing here forecloses it and nothing here decides it.
 *
 * ===========================================================================================
 *  `depth` IS A RECURSION ARGUMENT, NEVER A PER-MOVE BUDGET. IT HAS NO DEFAULT, HERE OR
 *  ANYWHERE, AND THIS MODULE ANSWERS "how good is this position to `depth`" — NEVER "what
 *  move should I play". `RISK-002` requires the per-move budget to be TIME-based (iterative
 *  deepening against a wall clock); a default depth would be a fixed-depth budget wearing a
 *  parameter's name. The clock and the public "give me a move" entry point are ABC-078's.
 *  `A6` in `src/search.test.ts` asserts this shape by reading this file — do not add a
 *  default, and do not add an export that picks a move without being told how deep.
 * ===========================================================================================
 *
 * THE TRANSPOSITION TABLE AND IN-TREE REPETITION ARE HERE (ABC-081), off ONE per-ply key array
 * per search (`ADR-0002` clause 3, `ADR-0020` Decision 3): `keys[0]` is the root's Zobrist key,
 * seeded once at the search's entry, and every child's key is derived from its parent's by
 * `zobristKeyAfterMove`. Two consumers read it. The repetition scan (`repeatsInPath`) scores a
 * position that repeats within the search path as a draw, exactly 0. The table
 * (`src/transposition.ts`, `ADR-0025`) is probed and stored at the key VALUE `keys[ply]` — its
 * own fixed-size structure, cleared at every `search()` entry. The session's history
 * (`src/history.ts`) is NOT imported: the search does not share that structure, deliberately.
 * One TEST-ONLY door reaches the table-free search `ABC-081`'s `A1` compares against:
 * `searchWithoutTable`.
 *
 * MOVES ARE ORDERED (ABC-080) by ONE comparator, `orderMoves`, at every full-width node and at
 * the root: the hash move first, then captures and promotions most-valuable-victim first (the
 * shared `mvvLvaKey`, `ADR-0024`), then this ply's two killer moves, then the rest in generation
 * order. Ordering changes the WORK and never the VALUE: it only decides which refutation is found
 * first. The abortable copy in `src/engine.ts` consumes the same comparator and the same killer
 * table, so `ABC-078`'s identity sweep keeps comparing one algorithm (ruling `…f7e66060`, R1).
 * The hash move is the table's best move for the node (`ABC-081`); with no entry it is `null`.
 * Two TEST-ONLY doors reach the less-ordered searches `ABC-080`'s `A1`/`A3`/`A4` compare against:
 * `searchWithoutOrdering` (generation order) and `searchWithoutKillers` (MVV-LVA alone).
 *
 * Quiescence (ABC-079) is HERE, at the leaf: an in-progress leaf is scored by
 * `src/quiescence.ts`'s capture search rather than by the bare static evaluation, so the
 * horizon does not fall in the middle of a trade. Two TEST-ONLY doors reach the pre-quiescence
 * (bare) leaf: `searchWithoutQuiescence` (pruned) and `searchWithoutPruningOrQuiescence`
 * (unpruned).
 *
 * PRINCIPAL-VARIATION SEARCH (ABC-121, `ADR-0026`) is HERE and in `src/engine.ts`, in the same
 * shape (`searchMove` in each): every move after a node's first is searched with the null window
 * `(alpha, alpha + 1)`, and one that fails high inside `(alpha, beta)` is searched again with the
 * full window. It changes the WORK and not the VALUE, but it shrinks the weaker side of every
 * work ratio, so every door older than `ABC-121` turns it OFF and reproduces its pre-`ABC-121`
 * self node for node (`ADR-0026` decision 3). Two TEST-ONLY doors reach the pre-PVS searches:
 * `searchWithoutPvsOrReductions` (the pre-`ABC-121` `search()`) and `searchWithoutReductions`.
 *
 * LATE-MOVE REDUCTIONS (ABC-121) sit inside that frame: a late quiet move's null-window search
 * runs one ply shallower, and one that fails high is searched again at full depth before PVS's own
 * re-search. The rule is ONE pure predicate, `lateMoveReduction`, which both recursions call and
 * whose returned plies they subtract. Reductions change the VALUE, so `search()` is held to
 * `searchWithoutReductions` by a bounded oracle, not an identity (`ADR-0026` decisions 6 and 9).
 *
 * NULL-MOVE PRUNING (ABC-208, `ADR-0050`) sits in the same frame, at null-window nodes only: the
 * side to move passes (`makeNullMove`), and if the opponent, searched R plies shallower with the
 * window `(-beta, -beta + 1)`, still cannot bring the score below beta, the node returns beta and
 * stores nothing. The rule is ONE pure predicate, `nullMoveReduction`, which both recursions call:
 * R is 3, and 0 at the root, directly after a null move, below remaining depth 2, in check, and
 * when the side to move has fewer than three non-pawn pieces (the zugzwang guard). It changes the
 * VALUE, so every door older than `ABC-208` turns it off, and `search()` is held to the TEST-ONLY
 * door `searchWithoutNullMove`, the pre-`ABC-208` `search()`, by a bounded oracle (decision 8).
 *
 * EVASIONS IN QUIESCENCE (ABC-228, `ADR-0053`): in check below its cap, `quiesce` searches every
 * legal move instead of standing pat, and scores none as mate at the root-relative distance, so
 * the leaf hands it its `ply`. Each recursion maps its switch, `quiescenceEvasions`, onto a
 * constant `QuiescenceRules` record. It changes the VALUE, so every door older than `ABC-228`
 * turns it off, and `search()` is held to the TEST-ONLY door `searchWithoutQuiescenceEvasions`,
 * the pre-`ABC-228` `search()`, by a bounded oracle (decision 8).
 *
 * QUIET QUEEN PROMOTIONS IN QUIESCENCE (ABC-229, `ADR-0053` decision 5): out of check, `quiesce`
 * searches the legal quiet promotions to a queen with the captures, from one generation pass. Its
 * switch, `quietPromotions`, joins `quiescenceEvasions` in picking the constant record. It changes
 * the VALUE, so every door older than `ABC-229` turns it off, and `search()` is held to the
 * TEST-ONLY door `searchWithoutQuietPromotions`, the pre-`ABC-229` `search()`, by a bounded oracle.
 *
 * FUTILITY PRUNING (ABC-268, `ADR-0061`) sits in the same frame, at null-window nodes near the
 * leaves: at a node of remaining depth 1 to 3, not the root, not in check, with alpha and beta both
 * outside the mate band, whose static evaluation plus `FUTILITY_MARGIN[depth]` (150 / 350 / 550 cp)
 * is still at or below alpha, every move after the first that neither captures nor promotes nor
 * gives check is skipped: not made, not searched, not counted. The index still advances past it, and
 * the node returns the best score among the moves searched, stored as before. The rule is TWO pure
 * predicates both recursions call: `futilityNode` (once per node, with the entry window, after the
 * table probe and the null move) and `futileMove` (per move). Its switch is `futility`. It changes
 * the VALUE, so every door older than `ABC-268` turns it off, and `search()` is held to the
 * TEST-ONLY door `searchWithoutFutility`, the pre-`ABC-268` `search()`, by a bounded oracle.
 *
 * THE TAPERED EVALUATION (ABC-269, `ADR-0064` decision 7): the switch `taper` picks which evaluation
 * the recursion reads at each of its call sites: the leaf with quiescence off, the futility node
 * test (`futilityNode`'s `taper` argument) and quiescence's stand pat (the `taper` field of the
 * constant rules record). True: the tapered `evaluate`. False: `evaluateWithoutTaper`, the
 * pre-`ABC-269` evaluation. It changes the VALUE, so every door older than `ABC-269` turns it off,
 * and `search()` is held to the TEST-ONLY door `searchWithoutTaper`, the pre-`ABC-269` `search()`.
 *
 * THE ORDERING BUNDLE (ABC-283, the owner's word of 2026-11-04): two of its three parts are here,
 * in BOTH recursions, each behind its own switch. `history` (`ADR-0063`): a side × from × to table
 * of quiet moves, raised by d² on a quiet beta cutoff with a d² malus to each quiet move searched
 * before the cutter, bounded by gravity, cleared at every `search()` entry and `chooseMove` call;
 * it orders the quiet moves after the killers. `seeOrdering` (`ADR-0065`): a capture whose static
 * exchange (`src/see.ts`) is below -50 cp sorts after the killers and before every other quiet move;
 * ordering only, quiescence unchanged. The third part, aspiration at the root (`ADR-0066`), is
 * `chooseMove`'s alone (`src/engine.ts`). Each part has its own TEST-ONLY door
 * (`searchWithoutHistory`, `searchWithoutSeeOrdering`), `searchWithoutBundle` turns both off and is
 * the pre-`ABC-283` `search()` node for node, and every older door turns both off.
 *
 * THE QUIET BUNDLE (ABC-303, the owner's word of 2026-11-04): two parts, in BOTH recursions, each
 * behind its own switch. `moveCount` (`ADR-0072`, form M3): at a null-window node of remaining
 * depth 1 to 3 with three non-pawn pieces, once 4, 7 or 12 quiet moves have been searched, a later
 * quiet move with a zero ordering key is skipped (`moveCountNode`, `moveCountFrom`, `futileMove`).
 * `countermove` (`ADR-0073`, form C1): the last quiet cutter after the node's previous move sorts as
 * one tier after the killers, from a 3 072-byte table cleared with the history table. Each part has
 * its own TEST-ONLY door (`searchWithoutMoveCountPruning`, `searchWithoutCountermove`),
 * `searchWithoutQuietBundle` turns both off and is the pre-`ABC-303` `search()` node for node, and
 * every older door turns both off.
 */

import { makeMove, makeNullMove, unmakeMove, unmakeNullMove } from "./apply.ts";
import {
  evaluateAtPhase,
  evaluateAtPhaseWithoutPawnShape,
  evaluateWithoutTaper,
  phaseAfterMove,
  phaseOf,
} from "./evaluate.ts";
import { leafEndReason } from "./gameend.ts";
import { givesCheck, isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, isBlack, isOnBoard, KING, PAWN, type Position, pieceType } from "./position.ts";
import { MATE_SCORE, mvvLvaKey, type QuiescenceRules, quiesce } from "./quiescence.ts";
import { see } from "./see.ts";
import {
  BOUND_EXACT,
  boundOf,
  clearTable,
  entryMove,
  MATE_FLOOR,
  probeTable,
  storeEntry,
  tableCutoff,
} from "./transposition.ts";
import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";

/**
 * The score of being checkmated AT THE ROOT, negated (`-(MATE_SCORE - ply)`). Defined in
 * `src/quiescence.ts` since `ABC-228`, which now scores a mate too (`ADR-0053` decision 3), and
 * re-exported here under the same name, so no importer changes.
 */
export { MATE_SCORE };

/** The quiescence rules each recursion hands `quiesce` (`ADR-0053` decision 6): constants, never built per leaf. */
const RULES_SHIPPED: QuiescenceRules = { evasions: true, quietPromotions: true };
const RULES_NO_QUIET_PROMOTIONS: QuiescenceRules = { evasions: true, quietPromotions: false };
const RULES_NO_EVASIONS: QuiescenceRules = { evasions: false, quietPromotions: true };
const RULES_NEITHER: QuiescenceRules = { evasions: false, quietPromotions: false };
/** `searchWithoutSeePruning`'s record (`ABC-269`): both rules and the tapered stand pat. */
const RULES_TAPERED: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };
/** `search()`'s record (`ABC-279`, `ADR-0069` decision 6): the tapered record, losing captures skipped. */
const RULES_SEE_PRUNING: QuiescenceRules = {
  evasions: true,
  quietPromotions: true,
  taper: true,
  seePruning: true,
};
/** `search()`'s record (`ABC-291`, `ADR-0075` decision 4): `RULES_SEE_PRUNING` with the shape part. */
const RULES_PAWN_SHAPE: QuiescenceRules = {
  evasions: true,
  quietPromotions: true,
  taper: true,
  seePruning: true,
  pawnShape: true,
};

export interface SearchResult {
  /** Centipawns, positive for the side to move. A mate reads `±(MATE_SCORE - ply)`. */
  readonly score: number;
  /** The best root move, or `null` when the root has none to make (terminal, or depth < 1). */
  readonly move: Move | null;
  /** Nodes visited: one per position entered, root included, leaves and terminals included. */
  readonly nodes: number;
}

/** Mutable node tally threaded through the recursion — the diagnostic rate figure's numerator. */
interface NodeCounter {
  nodes: number;
}

const NO_KILLERS: readonly Move[] = [];

/**
 * The per-ply key array's length, and so the deepest ply a full-width node can sit at: a node at
 * this ply is scored as a leaf. A RUNAWAY GUARD, NOT A DEPTH BUDGET — the same shape as
 * `QUIESCENCE_MAX_PLY` (`ADR-0025` Decision 7). It decides no move: the engine deepens against the
 * clock alone (`RISK-002`, `ABC-078` `A4`), and this only bounds an array a search allocates once.
 * Sized far above any depth a real position reaches in `NFR-004`'s 5 s ceiling.
 */
export const KEY_ARRAY_CAPACITY = 128;

/**
 * True when the position at `ply` already stood earlier on this search path — a draw. Only every
 * second ply can hold it (the side to move must match), the nearest is four plies back, and no
 * position older than the last capture or pawn move (`halfmoveClock` plies back) can repeat.
 * Scans the search's own key array and nothing else (`ADR-0002` clause 3).
 */
export function repeatsInPath(keys: BigUint64Array, ply: number, halfmoveClock: number): boolean {
  const key = keys[ply] as bigint;
  const oldest = Math.max(0, ply - halfmoveClock);
  for (let earlier = ply - 4; earlier >= oldest; earlier -= 2) {
    if (keys[earlier] === key) return true;
  }
  return false;
}

/**
 * Same squares and same promotion. A killer is recorded in one position and offered in a SIBLING,
 * where `legalMoves` built a different object for the same move, so `===` cannot serve.
 */
function sameMove(a: Move, b: Move): boolean {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}

/**
 * Two killer moves per ply: QUIET moves that caused a beta cutoff at that ply, most recent first.
 * One table per search — `search` builds one per call and `chooseMove` one per move, kept across
 * its iterations — so nothing learned in one search is offered in the next (`ABC-080` `A6`).
 */
export class KillerTable {
  private readonly slots: Move[][] = [];

  /** The killers recorded at `ply`, newest first: none, one or two. */
  at(ply: number): readonly Move[] {
    return this.slots[ply] ?? NO_KILLERS;
  }

  /**
   * A move that caused a beta cutoff at `ply`. Captures and promotions are not kept: MVV-LVA
   * already orders them ahead of every killer.
   */
  record(ply: number, move: Move): void {
    if (move.captured !== EMPTY || move.promotion !== EMPTY) return;
    const newest = this.slots[ply]?.[0];
    if (newest === undefined) this.slots[ply] = [move];
    else if (!sameMove(newest, move)) this.slots[ply] = [move, newest];
  }
}

/**
 * Sort tiers: the hash move above every capture, every capture above every killer, every killer
 * above every losing capture (`ABC-283`, `ADR-0065` decision 3), and every losing capture above
 * every other quiet move. The node's countermove sits after the killers and above the losing
 * captures (`ABC-303`, `ADR-0073` decision 5). A quiet move's key is max(0, its cell): history promotes, never demotes
 * (`ADR-0063` d4, dated 2026-11-04), so the key is always within [0, `HISTORY_BOUND`] and a move
 * whose cell is at most 0 keeps generation order among the zero keys (the stable sort). With
 * both switches off the keys are 0 below the
 * killers, and the order is the pre-`ABC-283` order exactly: the killers' offset moves no
 * relative order.
 */
const HASH_MOVE_KEY = 3_000_000;
const TACTICAL_KEY = 1_000_000;
const KILLER_KEY = 500_000;
const COUNTERMOVE_KEY = 400_000;
const LOSING_CAPTURE_KEY = 100_000;

/**
 * The history table (`ABC-283`, `ADR-0063` decision 1): one cell per moving side × from × to, on
 * 0-63 squares, 32 768 bytes. Data only, never a switch; both recursions share it, and only a
 * recursion with `history` on reads or writes it.
 */
const HISTORY = new Int32Array(2 * 64 * 64);
/**
 * Gravity's bound: every cell stays within [-16 384, 16 384], with no clamp. The bound itself is a
 * fixed point (+b - trunc(16 384 · b / 16 384) = 0), so `trunc` can land a cell on it, never past it.
 */
const HISTORY_BOUND = 16_384;

/** `move`'s cell: the mover's colour, then from and to on 0-63 (`(sq & 7) | ((sq >> 4) << 3)`). */
function historyIndex(move: Move): number {
  const from = (move.from & 7) | ((move.from >> 4) << 3);
  const to = (move.to & 7) | ((move.to >> 4) << 3);
  return (isBlack(move.piece) ? 4096 : 0) + from * 64 + to;
}

/** A countermove cell's value for `move`: never 0, the empty cell. */
function packedMove(move: Move): number {
  return move.from * 128 + move.to + 1;
}

/** Gravity (`ADR-0063` decision 2): h ← h + b − trunc(h · |b| / 16 384). */
function addHistory(move: Move, bonus: number): void {
  const index = historyIndex(move);
  const value = HISTORY[index] as number;
  HISTORY[index] = value + bonus - Math.trunc((value * Math.abs(bonus)) / HISTORY_BOUND);
}

/**
 * The countermove table (`ABC-303`, `ADR-0073` decision 1): one cell per previous move's coloured
 * piece × to-square on 0-63, 3 072 bytes. A cell holds the last quiet cutter there as
 * from × 128 + to + 1; 0 is empty. Data only, never a switch; both recursions share it, and only a
 * recursion with `countermove` on reads or writes it.
 */
const COUNTERMOVE = new Int32Array(12 * 64);

/** `previous`'s cell: its coloured piece, then its to-square on 0-63. */
function countermoveIndex(previous: Move): number {
  const colouredPiece = (isBlack(previous.piece) ? 6 : 0) + pieceType(previous.piece) - 1;
  return colouredPiece * 64 + ((previous.to & 7) | ((previous.to >> 4) << 3));
}

/**
 * Zero every history cell, at every `search()` entry and every `chooseMove` call with `history` on;
 * `countermove` is that search's switch, and zeroes the countermove table with it (`ADR-0073`
 * decision 4). A door with the switch off leaves that table as it stood (`ADR-0073` F5).
 */
export function clearHistory(countermove = false): void {
  HISTORY.fill(0);
  if (countermove) COUNTERMOVE.fill(0);
}

/** The history table's fixed size in bytes, for `NFR-009` (a)'s byte-length sum. */
export function historyByteLength(): number {
  return HISTORY.byteLength;
}

/** The countermove table's fixed size in bytes, for `NFR-009` (a)'s byte-length sum. */
export function countermoveByteLength(): number {
  return COUNTERMOVE.byteLength;
}

/**
 * The cell of `previous`, read-only: the packed cutter recorded after that move, or 0. A recursion
 * with `countermove` on reads the node's countermove here; `orderMoves` takes the answer.
 */
export function countermoveAt(previous: Move): number {
  return COUNTERMOVE[countermoveIndex(previous)] as number;
}

/** TEST-ONLY read of `move`'s history cell. Not an engine option; nothing in production calls it. */
export function historyScore(move: Move): number {
  return HISTORY[historyIndex(move)] as number;
}

/**
 * THE history update (`ABC-283`, `ADR-0063` decision 2), which both recursions call at a main-tree
 * beta cutoff with `history` on: `list` is the node's ordered move list, `cutIndex` the cutter's
 * index in it, `depth` the node's remaining depth and `futile` the node's futility answer. Only a
 * QUIET cutter (no capture, no promotion) updates: it gets +d², and every quiet move before it
 * that was searched gets -d². A move futility skipped was never searched and gets nothing; the
 * test is `futileMove` again, which answers the same on the restored position. Nothing is updated
 * in quiescence, at the root or on a null-move cutoff: no caller there.
 *
 * `ABC-303`: `previous` is the node's previous move when `countermove` is on, and null otherwise;
 * a quiet cutter overwrites its countermove cell (`ADR-0073` decision 2). `firstSkipped` is the
 * first index the move-count rule skipped, -1 for none: from there on a move `futileMove` answers
 * for was never searched and gets no malus, so a late checking cutter leaves the skipped moves'
 * cells alone (`ADR-0072` decision 3).
 */
export function recordHistoryCutoff(
  position: Position,
  list: readonly Move[],
  cutIndex: number,
  depth: number,
  futile: boolean,
  previous: Move | null = null,
  firstSkipped = -1,
): void {
  const cutter = list[cutIndex] as Move;
  if (cutter.captured !== EMPTY || cutter.promotion !== EMPTY) return;
  const bonus = depth * depth;
  addHistory(cutter, bonus);
  if (previous !== null) COUNTERMOVE[countermoveIndex(previous)] = packedMove(cutter);
  for (let index = 0; index < cutIndex; index++) {
    const move = list[index] as Move;
    if (move.captured !== EMPTY || move.promotion !== EMPTY) continue;
    if (futile && futileMove(position, move, index)) continue;
    if (firstSkipped !== -1 && index >= firstSkipped && futileMove(position, move, index)) continue;
    addHistory(move, 0 - bonus);
  }
}

/** A capture is losing for ordering below this static exchange (`ADR-0065` decision 2): -50 cp. */
const SEE_ORDER_THRESHOLD = -50;

/**
 * `ADR-0065` decision 2's losing test, for ordering only, beside Q1's (`isLosingCapture`, threshold
 * 0, unchanged): `capture` does not promote, is not made by the king, takes a lesser piece, and
 * its `see` is below -50. "Lesser" compares piece types, whose order is `see`'s value order
 * (P < N < B < R < Q), so SEE is computed only where the victim is worth less than the attacker.
 */
function losingForOrdering(position: Position, capture: Move): boolean {
  if (capture.promotion !== EMPTY) return false;
  const attacker = pieceType(capture.piece);
  if (attacker === KING || pieceType(capture.captured) >= attacker) return false;
  return see(position, capture) < SEE_ORDER_THRESHOLD;
}

/**
 * `move`'s sort key, by the tiers above. A quiet move's key is max(0, its cell): history promotes,
 * never demotes (`ADR-0063` d4, dated 2026-11-04). `countermove` is the node's packed countermove,
 * 0 for none: a promotion only, so the move it names keeps any higher tier and no move is demoted.
 */
function orderKey(
  move: Move,
  killers: readonly Move[],
  hashMove: Move | null,
  seePosition: Position | null,
  history: boolean,
  countermove: number,
): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) {
    if (seePosition !== null && losingForOrdering(seePosition, move)) {
      return LOSING_CAPTURE_KEY + mvvLvaKey(move);
    }
    return TACTICAL_KEY + mvvLvaKey(move);
  }
  const killer = killers.findIndex((candidate) => sameMove(candidate, move));
  if (killer !== -1) return KILLER_KEY + killers.length - killer;
  if (countermove !== 0 && countermove === packedMove(move)) return COUNTERMOVE_KEY;
  return history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0;
}

/** More than any legal position's move count (218); a longer list allocates its own keys. */
const ORDER_SCRATCH_LENGTH = 256;
/** `orderMoves`' key scratch: fixed, float64, shared by every ply (the sort never recurses). */
const ORDER_KEYS = new Float64Array(ORDER_SCRATCH_LENGTH);

/** The ordering scratch's fixed size in bytes, for `NFR-009` (a)'s byte-length sum. */
export function orderScratchByteLength(): number {
  return ORDER_KEYS.byteLength;
}

/**
 * THE move-ordering comparator (`ABC-080`), shared by both full-width recursions: the hash move
 * first, then captures and promotions by `mvvLvaKey`, then `killers` in the order given, then
 * every other move in generation order (the sort is stable). Returns a NEW array holding exactly
 * the moves it was handed — a killer or hash move absent from `moves` is ignored, never added.
 *
 * `ABC-283`: `seePosition` is the node's position when `seeOrdering` is on, and `null` otherwise:
 * with it, a losing capture (`losingForOrdering`) sorts after the killers. `history` true orders
 * the other quiet moves by their history cells. Both default off, so a three-argument call is the
 * pre-`ABC-283` comparator, and with both off nothing is computed. `countermove` (`ABC-303`) is the
 * node's packed countermove, default none, so a five-argument call is the pre-`ABC-303` comparator.
 *
 * NO PER-MOVE ALLOCATION (`ABC-240`, the Architect's four conditions): each key is computed once
 * into `ORDER_KEYS`, a fixed float64 module scratch (keys stay float64 — `mvvLvaKey`'s attacker
 * thousandths must not merge), and the one fresh output array is insertion-sorted beside it,
 * moving an entry only past a STRICTLY smaller key, so ties keep generation order. The input is
 * never touched, and the scratch is safe to share between plies because the sort ends before the
 * caller recurses. A list longer than the scratch (no legal position has one) gets its own keys.
 */
export function orderMoves(
  moves: readonly Move[],
  killers: readonly Move[],
  hashMove: Move | null,
  seePosition: Position | null = null,
  history = false,
  countermove = 0,
): Move[] {
  const count = moves.length;
  const out = moves.slice();
  const keys = count <= ORDER_SCRATCH_LENGTH ? ORDER_KEYS : new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const move = out[i] as Move;
    const key = orderKey(move, killers, hashMove, seePosition, history, countermove);
    let j = i;
    while (j > 0 && (keys[j - 1] as number) < key) {
      keys[j] = keys[j - 1] as number;
      out[j] = out[j - 1] as Move;
      j--;
    }
    keys[j] = key;
    out[j] = move;
  }
  return out;
}

/**
 * The two test-only switches threaded through the recursion. Both are true on every shipped
 * call; each is turned off by TWO exports — its own door and `searchWithoutPruningOrQuiescence`,
 * which turns off both — so a test can measure what it changed.
 */
interface Switches {
  /**
   * The MAIN TREE's alpha-beta cutoffs. False declines them only; a quiescence leaf still runs
   * `quiesce` with its own cutoffs — `searchWithoutPruning`, `searchWithoutPruningOrQuiescence`.
   */
  readonly prune: boolean;
  /**
   * The capture search at the leaf. False is the bare evaluation — `searchWithoutQuiescence`,
   * `searchWithoutPruningOrQuiescence`.
   */
  readonly quiescence: boolean;
  /**
   * How the move list is ordered (`ABC-080`). `"full"` on every shipped call; `"none"` is
   * generation order — `searchWithoutOrdering`; `"mvv-lva"` drops the killers —
   * `searchWithoutKillers`. The hash move is part of `"full"` only.
   */
  readonly ordering: "none" | "mvv-lva" | "full";
  /**
   * The transposition table (`ABC-081`): probed, cut on and stored at every full-width node.
   * False on `searchWithoutTable`; on the two unpruned doors, because a table cutoff IS a
   * main-tree cutoff and they decline cutoffs; and on `ABC-080`'s two ordering doors, because
   * the hash move is the top rung of the ladder they measure (none → MVV-LVA → + killers →
   * + hash move), so the table that supplies it is off on every rung below it. In-tree repetition
   * has no switch: it is correctness, not work, and every door detects it.
   */
  readonly table: boolean;
  /**
   * Principal-variation search (`ABC-121`): the null window for every move after a node's first,
   * and the full-window re-search on a fail-high. True on `search()`, `searchWithoutNullMove` and
   * `searchWithoutReductions`; false on every door older than `ABC-121` (`ADR-0026` decision 3),
   * and on the two unpruned doors because a null window IS a cutoff.
   */
  readonly pvs: boolean;
  /**
   * Late-move reductions (`ABC-121`), by `lateMoveReduction`. True on `search()` and
   * `searchWithoutNullMove`. They live inside PVS's null-window frame, so they act only where
   * `pvs` is on (`ADR-0026` decision 1).
   */
  readonly reductions: boolean;
  /**
   * Null-move pruning (`ABC-208`), by `nullMoveReduction`. True on `search()` only. It is tried
   * at null-window nodes only, inside PVS's frame, so it acts only where `pvs` is on (`ADR-0050`
   * decision 1); every older door turns it off (decision 3).
   */
  readonly nullMove: boolean;
  /**
   * Evasions in check inside quiescence (`ABC-228`, `ADR-0053`). True on `search()` and
   * `searchWithoutQuietPromotions`; every older door turns it off, so each reproduces its pre-`ABC-228` self node for node.
   */
  readonly quiescenceEvasions: boolean;
  /**
   * Quiet promotions to a queen inside quiescence (`ABC-229`, `ADR-0053` decision 5). True on
   * `search()` only; every older door, `searchWithoutQuiescenceEvasions` included, turns it off.
   */
  readonly quietPromotions: boolean;
  /**
   * Futility pruning (`ABC-268`, `ADR-0061`), by `futilityNode` and `futileMove`. True on
   * `search()` only. It acts at null-window nodes only, inside PVS's frame, so it acts only where
   * `pvs` is on (decision 1); every older door turns it off (decision 5).
   */
  readonly futility: boolean;
  /**
   * The tapered evaluation (`ABC-269`, `ADR-0064` decision 7) at every call site the recursion has.
   * True on `search()` and `searchWithoutSeePruning`, where both quiescence switches are on too, so
   * its rules record is `RULES_SEE_PRUNING` or `RULES_TAPERED`; every older door turns it off and
   * reads the pre-`ABC-269` evaluation.
   */
  readonly taper: boolean;
  /** The shape part (`ABC-291`, `ADR-0075` decision 4): true on `search()` only. */
  readonly pawnShape: boolean;
  /**
   * Quiescence skips a losing capture out of check (`ABC-279`, `ADR-0069` decisions 1-3, 6, 7). True
   * on `search()` only, where the taper is on too, so its rules record is `RULES_SEE_PRUNING`;
   * `searchWithoutSeePruning` and every older door turn it off (decision 8).
   */
  readonly seePruning: boolean;
  /**
   * The history table orders the quiet moves after the killers (`ABC-283`, `ADR-0063` decisions
   * 1-5). True on `search()` and `searchWithoutSeeOrdering`; `searchWithoutHistory`,
   * `searchWithoutBundle` and every older door turn it off, and then nothing reads or writes it.
   */
  readonly history: boolean;
  /**
   * Losing captures sort after the killers (`ABC-283`, `ADR-0065` decisions 2-4). True on
   * `search()` and `searchWithoutHistory`; `searchWithoutSeeOrdering`, `searchWithoutBundle` and
   * every older door turn it off, and then no SEE is computed in the full-width search.
   */
  readonly seeOrdering: boolean;
  /**
   * Move-count pruning (`ABC-303`, `ADR-0072`), by `moveCountNode`, `moveCountFrom` and `futileMove`.
   * True on `search()` and `searchWithoutCountermove`; `searchWithoutMoveCountPruning`,
   * `searchWithoutQuietBundle` and every older door turn it off.
   */
  readonly moveCount: boolean;
  /**
   * The countermove tier (`ABC-303`, `ADR-0073`). True on `search()` and
   * `searchWithoutMoveCountPruning`; `searchWithoutCountermove`, `searchWithoutQuietBundle` and
   * every older door turn it off, and then nothing reads or writes the table.
   */
  readonly countermove: boolean;
}

/** The least remaining depth, and the least 0-based index in the ordered list, a reduced move has. */
const REDUCTION_MIN_DEPTH = 3;
const REDUCTION_MIN_INDEX = 3;

/**
 * THE late-move reduction rule (`ABC-121`, `ADR-0026` decision 6): how many plies shallower `move`
 * is searched, 0 or 1, at a node of remaining `depth` where it stands at `index` (0-based) in the
 * ordered move list. Both recursions call it and subtract exactly what it returns.
 *
 * One ply when every condition holds: not the root; remaining depth at least 3; index at least 3
 * (R5's "move 4 onwards"); the move neither captures nor promotes; the side to move is not in
 * check; and the move does not give check. The tactical facts are derived HERE, from the position
 * and the move, and never supplied by the caller — so a recursion cannot mis-wire one of them.
 *
 * Pure: it decides and picks no move. It asks `givesCheck` whether `move` gives check, which
 * answers without playing an unflagged move (`ABC-206`), so the position is byte-identical on
 * return.
 */
export function lateMoveReduction(
  position: Position,
  move: Move,
  depth: number,
  index: number,
  atRoot: boolean,
): number {
  if (atRoot || depth < REDUCTION_MIN_DEPTH || index < REDUCTION_MIN_INDEX) return 0;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;
  if (isInCheck(position)) return 0;
  return givesCheck(position, move) ? 0 : 1;
}

/** R, the least remaining depth a null move is tried at, and the zugzwang guard's piece count. */
const NULL_MOVE_REDUCTION = 3;
const NULL_MOVE_MIN_DEPTH = 2;
const NULL_MOVE_MIN_PIECES = 3;

/**
 * THE null-move rule (`ABC-208`, `ADR-0050` decision 6): how many plies shallower than a normal
 * child the null child of a node of remaining `depth` at `ply` is searched — R, 3 — or 0 for no
 * null move. Both recursions call it and subtract exactly what it returns.
 *
 * 0 when any of these holds: the root (`ply` 0); the parent move was a null move (`afterNull`);
 * remaining depth below 2; the side to move is in check; or the side to move has fewer than three
 * non-pawn pieces (knights, bishops, rooks and queens) — the zugzwang guard, where a pass is most
 * often the best move. Check and material are derived HERE, from the position, and never
 * supplied by the caller. Pure: it reads the position and changes nothing.
 */
export function nullMoveReduction(
  position: Position,
  depth: number,
  ply: number,
  afterNull: boolean,
): number {
  if (ply === 0 || afterNull || depth < NULL_MOVE_MIN_DEPTH) return 0;
  if (isInCheck(position)) return 0;
  const board = position.board;
  let pieces = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square] as number;
    if (piece === EMPTY || isBlack(piece) !== position.blackToMove) continue;
    const type = pieceType(piece);
    if (type !== PAWN && type !== KING && ++pieces === NULL_MOVE_MIN_PIECES) {
      return NULL_MOVE_REDUCTION;
    }
  }
  return 0;
}

/**
 * The futility margins by remaining depth (`ADR-0061` decision 2): 150 cp at depth 1, 350 at 2
 * (above a minor piece) and 550 at 3 (above a rook); index 0 is never read. Never written after load.
 */
const FUTILITY_MARGIN: readonly number[] = [0, 150, 350, 550];

/**
 * THE futility node test (`ABC-268`, `ADR-0061` decisions 1 and 2): true when a node of remaining
 * `depth` at `ply`, entered with the window `(alphaIn, beta)`, may skip its late quiet moves. Both
 * recursions call it once per node, with the entry window, after the table probe and the null move.
 *
 * True exactly when every clause holds: not the root (`ply > 0`); a null window
 * (`alphaIn + 1 === beta`); remaining depth 1, 2 or 3; alpha and beta both strictly inside
 * (-`MATE_FLOOR`, `MATE_FLOOR`); the side to move not in check; and
 * `evaluate(position) + FUTILITY_MARGIN[depth] <= alphaIn`. Check and the static score are derived
 * HERE, from the position; the caller supplies only what no position carries. The evaluation is
 * last, so a guarded node pays none. Pure: it reads the position and changes nothing.
 *
 * `taper` is the recursion's switch (`ABC-269`): true reads the tapered evaluation, false
 * `evaluateWithoutTaper`, the pre-`ABC-269` evaluation. `phase` is the node's `phaseOf(position)`,
 * carried by the recursion (`ABC-269` cut C1); the tapered read is `evaluateAtPhase(position, phase)`.
 */
export function futilityNode(
  position: Position,
  depth: number,
  ply: number,
  alphaIn: number,
  beta: number,
  taper: boolean,
  pawnShape: boolean,
  phase: number,
): boolean {
  if (ply === 0 || alphaIn + 1 !== beta) return false;
  if (depth < 1 || depth > 3) return false;
  if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return false;
  if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return false;
  if (isInCheck(position)) return false;
  const staticScore = taper
    ? pawnShape
      ? evaluateAtPhase(position, phase)
      : evaluateAtPhaseWithoutPawnShape(position, phase)
    : evaluateWithoutTaper(position);
  return staticScore + (FUTILITY_MARGIN[depth] as number) <= alphaIn;
}

/**
 * THE futility move test (`ABC-268`, `ADR-0061` decision 2): true when `move`, at `index` (0-based)
 * in the ordered list of a node `futilityNode` passed, is skipped — index 1 or later, and the move
 * neither captures nor promotes nor gives check. The first move is always searched. It asks
 * `givesCheck`, which answers without playing an unflagged move (`ABC-206`), so the position is
 * byte-identical on return.
 */
export function futileMove(position: Position, move: Move, index: number): boolean {
  if (index < 1) return false;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return false;
  return !givesCheck(position, move);
}

/**
 * The quiet moves searched before the rule acts, by remaining depth (`ADR-0072` decision 2):
 * 3 + d², 4 at depth 1, 7 at 2 and 12 at 3; index 0 is never read. Never written after load.
 */
const MOVE_COUNT_LIMIT: readonly number[] = [0, 4, 7, 12];

/**
 * THE move-count node test (`ABC-303`, `ADR-0072` decisions 1 and 4): T[d] for a node of remaining
 * `depth` at `ply`, entered with the window `(alphaIn, beta)`, or 0 for no pruning. Both recursions
 * call it once per node, with the entry window.
 *
 * T[d] exactly when every clause holds: not the root (`ply > 0`); a null window
 * (`alphaIn + 1 === beta`); remaining depth 1, 2 or 3; alpha and beta both strictly inside
 * (-`MATE_FLOOR`, `MATE_FLOOR`); the side to move not in check; and at least three non-pawn pieces
 * for the side to move (`NULL_MOVE_MIN_PIECES`, the null move's guard). Check and material are
 * derived HERE, from the position. Pure: it reads the position and changes nothing.
 */
export function moveCountNode(
  position: Position,
  depth: number,
  ply: number,
  alphaIn: number,
  beta: number,
): number {
  if (ply === 0 || alphaIn + 1 !== beta) return 0;
  if (depth < 1 || depth > 3) return 0;
  if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return 0;
  if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return 0;
  if (isInCheck(position)) return 0;
  const board = position.board;
  let pieces = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square] as number;
    if (piece === EMPTY || isBlack(piece) !== position.blackToMove) continue;
    const type = pieceType(piece);
    if (type !== PAWN && type !== KING && ++pieces === NULL_MOVE_MIN_PIECES) {
      return MOVE_COUNT_LIMIT[depth] as number;
    }
  }
  return 0;
}

/**
 * The first index of the `count` moves `orderMoves` just sorted whose key is 0, or `count` for none
 * (`ABC-303`, `ADR-0072` decision 4): K3's zero tier, a tail of the list. Read from `ORDER_KEYS`
 * straight after the sort, before any recursion overwrites the scratch.
 */
export function moveCountFrom(count: number): number {
  for (let index = 0; index < count; index++) {
    if (ORDER_KEYS[index] === 0) return index;
  }
  return count;
}

/** The move list in the order `switches.ordering` asks for, at `ply` of `position`. */
function ordered(
  position: Position,
  moves: readonly Move[],
  ply: number,
  switches: Switches,
  killers: KillerTable,
  hashMove: Move | null,
  countermove: number,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(
    moves,
    killers.at(ply),
    hashMove,
    switches.seeOrdering ? position : null,
    switches.history,
    countermove,
  );
}

/**
 * The score of a position the search will not look past: its game state decides it, and
 * otherwise the quiescence search does (or, with quiescence off, the static evaluation).
 *
 * `leafEndReason` decides the game state: the same answer as a bare `gameStatus` call, without
 * building the legal-move list (`ABC-206`); it stops at the first legal move. It catches the
 * drawn terminal states an empty move list does not (dead position by material, the
 * seventy-five-move rule) as well as mate and stalemate. No counts map is involved: repetition
 * is decided before this is reached, off the search's own key array (`repeatsInPath`), never
 * off the session's history.
 */
function leafScore(
  position: Position,
  ply: number,
  alpha: number,
  beta: number,
  switches: Switches,
  counter: NodeCounter,
  phase: number,
): number {
  const reason = leafEndReason(position);
  if (reason === null) {
    if (!switches.quiescence) {
      return switches.taper
        ? switches.pawnShape
          ? evaluateAtPhase(position, phase)
          : evaluateAtPhaseWithoutPawnShape(position, phase)
        : evaluateWithoutTaper(position);
    }
    // Every capture node the quiescence search enters is a position visited, and is counted.
    const rules = switches.taper
      ? switches.seePruning
        ? switches.pawnShape
          ? RULES_PAWN_SHAPE
          : RULES_SEE_PRUNING
        : RULES_TAPERED
      : switches.quiescenceEvasions
        ? switches.quietPromotions
          ? RULES_SHIPPED
          : RULES_NO_QUIET_PROMOTIONS
        : switches.quietPromotions
          ? RULES_NO_EVASIONS
          : RULES_NEITHER;
    return quiesce(position, alpha, beta, 0, ply, rules, () => counter.nodes++, phase);
  }
  if (reason === "checkmate") return 0 - (MATE_SCORE - ply);
  // Every other ended game is drawn: stalemate, dead position, seventy-five moves. Exactly 0,
  // and a literal 0 rather than a negated one, so it is never the `-0` that fails an exact
  // comparison (`evaluate` guards the same trap for the same reason).
  return 0;
}

/**
 * Negamax over `position` to `depth`, returning the score for the side to move.
 *
 * Fail-soft: the returned value may fall outside `[alpha, beta]`, which costs nothing here and
 * is what a transposition table will later want. With the full window the root opens, the
 * returned score is EXACT — that is what makes `A1` (identical to the unpruned search) a
 * property of alpha-beta rather than a coincidence of these positions.
 *
 * `prune` false declines both halves of the MAIN-TREE cutoff. That makes it brute force above
 * the horizon only: a quiescence leaf still runs `quiesce`, which keeps its own stand-pat and
 * capture cutoffs. It is still `A1`/`A2`'s differential oracle for the main tree, and it is
 * TEST-ONLY: no shipped call passes false,
 * and `searchWithoutPruning` exists to be the test's door rather than a configurable engine.
 *
 * `keys[ply]` is this node's Zobrist key, written by the parent. The order at entry is the
 * order of authority: a repetition is a draw whatever the table says, and the table is consulted
 * before any move is generated.
 *
 * `afterNull` is true only on the null move's child (`ABC-208`): the flag is an argument, so
 * nothing is held between nodes. With `nullMove` on, a null-window node that the table did not
 * settle first tries the pass, before any move is generated.
 *
 * `phase` is this node's `phaseOf(position)`, written by the parent as `phaseAfterMove` (`ABC-269`
 * cut C1): an argument like `afterNull`, never state. The null move's child keeps it.
 *
 * `previous` is the move that led here, written by the parent (`ABC-303`, `ADR-0073` decision 3):
 * an argument too, and null at a null move's child.
 */
function negamax(
  position: Position,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  switches: Switches,
  counter: NodeCounter,
  killers: KillerTable,
  keys: BigUint64Array,
  afterNull: boolean,
  phase: number,
  previous: Move | null,
): number {
  counter.nodes++;

  // In-tree repetition (`ABC-081` `A5`): EXACTLY 0, a literal, never a negated `-0`.
  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;
  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore(position, ply, alpha, beta, switches, counter, phase);
  }
  const prune = switches.prune;
  const key = keys[ply] as bigint;

  const slot = switches.table ? probeTable(key) : -1;
  if (slot !== -1) {
    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) return settled;
  }

  if (switches.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, depth, ply, afterNull);
    if (nullReduction > 0) {
      const nullUndo = makeNullMove(position);
      keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
      const nullScore =
        0 -
        negamax(
          position,
          depth - 1 - nullReduction,
          0 - beta,
          0 - beta + 1,
          ply + 1,
          switches,
          counter,
          killers,
          keys,
          true,
          phase,
          null,
        );
      unmakeNullMove(position, nullUndo);
      // Beta, never the null score: a mate found after a pass is no mate. Nothing is stored.
      if (nullScore >= beta) return beta;
    }
  }

  const moves = legalMoves(position);
  if (moves.length === 0) {
    // Mate or stalemate, decided from the move list already in hand. `-(MATE_SCORE - ply)` when
    // the king is attacked; otherwise EXACTLY 0 — stalemate is a draw, not a loss, and scoring
    // it as a mate is the classic negamax bug this project's `A5` exists to catch.
    return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;
  }

  const alphaIn = alpha;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  // Futility (`ABC-268`): once per node, with the entry window; a skipped move still takes its index.
  const futile =
    switches.futility &&
    futilityNode(position, depth, ply, alphaIn, beta, switches.taper, switches.pawnShape, phase);
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0] as Move;
  let index = 0;
  const previousCut = switches.countermove ? previous : null;
  const countermove = previousCut === null ? 0 : countermoveAt(previousCut);
  const list = ordered(position, moves, ply, switches, killers, hashMove, countermove);
  // Move-count pruning (`ABC-303`): the tail is read here, before any recursion reuses the keys.
  const moveLimit = switches.moveCount ? moveCountNode(position, depth, ply, alphaIn, beta) : 0;
  const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;
  let searchedQuiets = 0;
  let firstSkipped = -1;
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    if (moveLimit > 0) {
      if (searchedQuiets >= moveLimit && index >= zeroFrom && futileMove(position, move, index)) {
        if (firstSkipped === -1) firstSkipped = index;
        index++;
        continue;
      }
      if (move.captured === EMPTY && move.promotion === EMPTY) searchedQuiets++;
    }
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;
    const undo = makeMove(position, move);
    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
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
      keys,
      phaseAfterMove(phase, move),
      move,
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
      if (switches.history) {
        recordHistoryCutoff(position, list, index - 1, depth, futile, previousCut, firstSkipped);
      }
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
  }

  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}

/**
 * The score of the move just made at a node of `depth` searched with window `(alpha, beta)`, from
 * that node's side — the ONE place the child is searched, at the root and below.
 *
 * The node's first move (`index` 0), and every move with `pvs` off, is searched with the node's
 * own window, exactly as before `ABC-121`. With `pvs` on, a later move is searched first with the
 * null window `(alpha, alpha + 1)`: it only has to prove it is no better than `alpha`. One that
 * fails high inside `(alpha, beta)` is searched again with the full window for its exact score.
 * At a null-window node (`alpha + 1 === beta`) no score is strictly between them, so nothing is
 * searched twice there.
 *
 * `reduction` is `lateMoveReduction`'s answer for this move, 0 when reductions are off. The
 * null-window search runs that many plies shallower; if it fails high anyway, the move is searched
 * again with the same null window at FULL depth before anything else is believed. That re-search
 * is the line every LMR bug skips, and at a null-window node nothing else would repeat it (`A4`).
 *
 * `childPhase` is the made move's child's phase, `phaseAfterMove` of the node's (`ABC-269` cut C1).
 * `move` is the move just made, the child's `previous` (`ABC-303`).
 */
function searchMove(
  position: Position,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  index: number,
  reduction: number,
  switches: Switches,
  counter: NodeCounter,
  killers: KillerTable,
  keys: BigUint64Array,
  childPhase: number,
  move: Move,
): number {
  const child = ply + 1;
  if (index === 0 || !switches.pvs) {
    return (
      0 -
      negamax(
        position,
        depth - 1,
        0 - beta,
        0 - alpha,
        child,
        switches,
        counter,
        killers,
        keys,
        false,
        childPhase,
        move,
      )
    );
  }
  let score =
    0 -
    negamax(
      position,
      depth - 1 - reduction,
      0 - alpha - 1,
      0 - alpha,
      child,
      switches,
      counter,
      killers,
      keys,
      false,
      childPhase,
      move,
    );
  if (score > alpha && reduction > 0) {
    score =
      0 -
      negamax(
        position,
        depth - 1,
        0 - alpha - 1,
        0 - alpha,
        child,
        switches,
        counter,
        killers,
        keys,
        false,
        childPhase,
        move,
      );
  }
  if (score > alpha && score < beta) {
    score =
      0 -
      negamax(
        position,
        depth - 1,
        0 - beta,
        0 - alpha,
        child,
        switches,
        counter,
        killers,
        keys,
        false,
        childPhase,
        move,
      );
  }
  return score;
}

/**
 * Search the root: score every legal move to `depth - 1` and keep the best.
 *
 * The root window is infinite and the root never cuts off (`alpha < beta` always holds here),
 * so the returned score is exact and the returned move is the one that achieves it. The first
 * legal move is kept as the incumbent, so a root with any legal move always returns one.
 *
 * The per-ply key array is allocated HERE, once per search and never per node, and seeded with
 * the root's key (`ADR-0002` clause 3); the table is cleared here (`ADR-0025` Decision 4). The
 * root probes the table for its hash move only — it never cuts, it must return a move — and on
 * a fresh table finds none; the root's own entry is stored so both recursions store alike.
 */
function searchRoot(position: Position, depth: number, switches: Switches): SearchResult {
  const counter: NodeCounter = { nodes: 1 };
  const prune = switches.prune;
  const killers = new KillerTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[0] = zobristKey(position);
  if (switches.table) clearTable();
  if (switches.history) clearHistory(switches.countermove);

  // `!(depth >= 1)` and not `depth < 1`: a depth-less call's `NaN` must land here too. Before the
  // key array it recursed until the stack overflowed; `KEY_ARRAY_CAPACITY` now stops that
  // recursion at a leaf, which would turn a missing depth into a depth-128 search (`QE-G1`).
  if (!(depth >= 1)) {
    const infinity = Number.POSITIVE_INFINITY;
    const score = leafScore(
      position,
      0,
      0 - infinity,
      infinity,
      switches,
      counter,
      phaseOf(position),
    );
    return { score, move: null, nodes: counter.nodes };
  }

  const moves = legalMoves(position);
  if (moves.length === 0) {
    return { score: isInCheck(position) ? 0 - MATE_SCORE : 0, move: null, nodes: counter.nodes };
  }

  const rootKey = keys[0] as bigint;
  // `ABC-269` cut C1: the phase is seeded ONCE per search, here, and carried down from this node.
  const rootPhase = phaseOf(position);
  const slot = switches.table ? probeTable(rootKey) : -1;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  const rootMoves = ordered(position, moves, 0, switches, killers, hashMove, 0);
  let bestMove = rootMoves[0] as Move;

  let index = 0;
  for (const move of rootMoves) {
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, true)
      : 0;
    const undo = makeMove(position, move);
    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
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
      keys,
      phaseAfterMove(rootPhase, move),
      move,
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

/**
 * Alpha-beta negamax of `position` to `depth`, which the CALLER always supplies.
 *
 * The position is byte-identical on return: every move made is unmade (`A7`).
 */
export function search(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: true,
    seePruning: true,
    history: true,
    seeOrdering: true,
    moveCount: true,
    countermove: true,
  });
}

/**
 * TEST-ONLY (`ABC-291`, `ADR-0075` decision 4): `search()` without the shape part, the merge-base's
 * `search()` node for node. Not an engine option; nothing in production calls it.
 */
export function searchWithoutPawnShape(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: true,
    seeOrdering: true,
    moveCount: true,
    countermove: true,
  });
}

/**
 * TEST-ONLY. `search()` with move-count pruning off (`ABC-303`, `ADR-0072` decision 6), the
 * countermove and everything older on. Not an engine option; nothing in production calls it.
 */
export function searchWithoutMoveCountPruning(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: true,
    seeOrdering: true,
    moveCount: false,
    countermove: true,
  });
}

/**
 * TEST-ONLY. `search()` with the countermove off (`ABC-303`, `ADR-0073` decision 7), move-count
 * pruning and everything older on. Not an engine option; nothing in production calls it.
 */
export function searchWithoutCountermove(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: true,
    seeOrdering: true,
    moveCount: true,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-303` `search()`, node for node: move-count pruning and the countermove
 * both off, everything else on. It is the all-off door of the bundle (`ABC-303` P0). Not an engine
 * option; nothing in production calls it.
 */
export function searchWithoutQuietBundle(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: true,
    seeOrdering: true,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. `search()` with the history table off (`ABC-283`, `ADR-0063` decision 6), the rest of
 * the bundle and everything older on. Not an engine option; nothing in production calls it.
 */
export function searchWithoutHistory(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: false,
    seeOrdering: true,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. `search()` with SEE ordering off (`ABC-283`, `ADR-0065` decision 7), the rest of the
 * bundle and everything older on. Not an engine option; nothing in production calls it.
 */
export function searchWithoutSeeOrdering(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: true,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-283` `search()`, node for node: the history table and SEE ordering both
 * off, everything else on, Q1's losing-capture skip included. It is the all-off door of the
 * bundle (`ABC-283` P0) and the shipped side of every older row that measures its own heuristic
 * alone. Not an engine option; nothing in production calls it.
 */
export function searchWithoutBundle(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: true,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-279` `search()`, node for node: quiescence's losing-capture skip off,
 * everything else on, the taper, futility, null move and both quiescence switches included. It is
 * the reference `ABC-279`'s bounded drift oracle compares `search()` against, and the shipped side
 * of every older row that measures its own heuristic alone (`ADR-0069` decision 8). Not an engine
 * option; nothing in production calls it.
 */
export function searchWithoutSeePruning(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-269` `search()`, node for node: the tapered evaluation off, everything
 * else on, futility, null move and both quiescence switches included. It reads
 * `evaluateWithoutTaper` at every call site, so it is `main`'s `search()` before `ABC-269`, and the
 * shipped side of every older row that measures its own heuristic alone (`ADR-0064` decision 7).
 * Not an engine option; nothing in production calls it.
 */
export function searchWithoutTaper(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-268` `search()`, node for node: futility pruning off, everything else on,
 * null move and both quiescence switches included. It is the reference `ABC-268`'s bounded drift
 * oracle compares `search()` against, and the shipped side of every older row that measures its
 * own heuristic alone (`ADR-0061` decisions 4 and 6). Not an engine option; nothing in production
 * calls it.
 */
export function searchWithoutFutility(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-229` `search()`, node for node: quiet queen promotions in quiescence
 * off, everything else on, evasions and null move included. It is the reference `ABC-229`'s
 * bounded drift oracle compares `search()` against, and the shipped side of every `ABC-228` row
 * that measures evasions alone (`ADR-0053` decisions 6 and 7). Not an engine option; nothing in
 * production calls it.
 */
export function searchWithoutQuietPromotions(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-228` `search()`, node for node: evasions in quiescence off, everything
 * else on, null move included. It is the reference `ABC-228`'s bounded drift oracle compares
 * `search()` against, and the shipped side of every `ABC-208` row that measures null move alone
 * (`ADR-0053` decisions 6 and 7). Not an engine option; nothing in production calls it.
 */
export function searchWithoutQuiescenceEvasions(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-208` `search()`, node for node: null-move pruning off, everything else
 * on. It is the reference `ABC-208`'s bounded drift oracle compares `search()` against, and the
 * shipped side of every `ABC-121` row that measures PVS and LMR alone (`ADR-0050` decisions 2 and
 * 4). Not an engine option; nothing in production calls it.
 */
export function searchWithoutNullMove(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The same search with the MAIN TREE's alpha-beta cutoffs DISABLED. Its leaves still
 * run `quiesce` with that function's own cutoffs, so it is NOT brute force below the horizon
 * (measured by ABC-079's QE: position-3 at depth 1 visits 46 nodes here, 63 with `quiesce`'s
 * cutoffs removed).
 *
 * It exists so `A1` can assert alpha-beta changes the WORK and not the VALUE, and so `A2` can
 * count what it saved. It is not an engine option, nothing in production calls it, and it is
 * exponentially slower; if you are reaching for it outside a test, you want `search`.
 */
export function searchWithoutPruning(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: false,
    quiescence: true,
    ordering: "full",
    table: false,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The same search with the leaf's QUIESCENCE DISABLED — the bare static evaluation
 * at every leaf, which is the pre-`ABC-079` search exactly.
 *
 * It exists so `ABC-079`'s `A1` can show the horizon effect it fixes (the losing capture the
 * bare leaf plays), `A4` can show quiet positions score identically either way, and `A5` can
 * measure the node-count multiplier. Not an engine option; nothing in production calls it.
 */
export function searchWithoutQuiescence(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: false,
    ordering: "full",
    table: true,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The same search with BOTH switches off: brute-force negamax over the whole tree,
 * with the bare static evaluation at every leaf. It is the unpruned partner of
 * `searchWithoutQuiescence`.
 *
 * It exists so `ABC-077`'s depth-3 differential (`A1`, `A2`, `A7` in `src/search.test.ts`) can
 * run on the leaf it was written for. With quiescence on, the unpruned tree opens a full-window
 * capture search at every leaf and costs minutes a pair (ABC-079 oracle ruling). Not an engine
 * option; nothing in production calls it.
 */
export function searchWithoutPruningOrQuiescence(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: false,
    quiescence: false,
    ordering: "full",
    table: false,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The shipped search with the move list in GENERATION ORDER and no table — the
 * pre-`ABC-080` search exactly. It exists so `ABC-080`'s `A1` can assert ordering changes the work and not the
 * value, and `A3`/`A4` can count what it saved. Not an engine option; nothing in production calls
 * it (the ticket's test note 3).
 */
export function searchWithoutOrdering(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "none",
    table: false,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The shipped search with MVV-LVA ordering but NO killer moves and no table — `ABC-080`
 * `A4`'s second configuration, so the killers' own increment can be measured and, if it is nothing,
 * deleted. Not an engine option; nothing in production calls it.
 */
export function searchWithoutKillers(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "mvv-lva",
    table: false,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The shipped search with the TRANSPOSITION TABLE OFF — no probe, no cutoff, no store,
 * no hash move — and everything else on, in-tree repetition included (`ADR-0025` Decision 6). It
 * exists so `ABC-081`'s `A1` can assert the table changes the work and not the value, and `A2`/`A3`
 * can count what it saved. Not an engine option; nothing in production calls it.
 */
export function searchWithoutTable(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: false,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The shipped search with every `ABC-121` heuristic that changes the VALUE turned off,
 * and principal-variation search kept on. It is the reference the bounded drift oracle compares
 * `search()` against, and the pruned side of `ABC-077`'s `A1` (`ADR-0026` decision 5). Not an
 * engine option; nothing in production calls it.
 */
export function searchWithoutReductions(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-121` `search()`, node for node: principal-variation search and the
 * reductions both off, everything else on. Every existing WORK reading — a node count, ratio or
 * hit rate — reads its shipped side off this door (`ADR-0026` decision 4). Not an engine option;
 * nothing in production calls it.
 */
export function searchWithoutPvsOrReductions(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: false,
    reductions: false,
    nullMove: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    futility: false,
    taper: false,
    pawnShape: false,
    seePruning: false,
    history: false,
    seeOrdering: false,
    moveCount: false,
    countermove: false,
  });
}
