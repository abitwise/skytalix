// PROBE COPY of src/engine.ts @ 092f647 (ruling-abc086-seed). NOT shipped, not a test.
// Header comment stripped; imports re-pointed at src/; tail replaced (see runIteration).
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { isInCheck, legalMoves } from "../../../../src/legal.ts";
import type { Move } from "../../../../src/moves.ts";
import type { Position } from "../../../../src/position.ts";
import { type QuiescenceVisitor, quiesce } from "../../../../src/quiescence.ts";
import {
  KEY_ARRAY_CAPACITY,
  KillerTable,
  lateMoveReduction,
  MATE_SCORE,
  orderMoves,
  repeatsInPath,
} from "../../../../src/search.ts";
import {
  BOUND_EXACT,
  boundOf,
  clearTable,
  entryMove,
  probeTable,
  storeEntry,
  tableCutoff,
} from "../../../../src/transposition.ts";
import type { EngineSeam } from "../../../../src/turn-loop.ts";
import { zobristKey, zobristKeyAfterMove } from "../../../../src/zobrist.ts";

/**
 * The game the seam is handed — named off `EngineSeam` rather than imported from
 * `src/history.ts`, so no search module imports the session's history (`ABC-081` `A6`).
 */
type SeamGame = Parameters<EngineSeam>[0];

/**
 * A source of milliseconds. `Date.now` satisfies it; a test supplies virtual time instead.
 *
 * CONTRACT: real-time and NON-DECREASING. The deepening loop terminates because successive
 * readings advance towards the deadline — a frozen clock or one that runs backwards does not
 * terminate, and nothing here defends against that.
 */
export type Clock = () => number;

/**
 * `NFR-004`'s default difficulty budget, in milliseconds, exported so `EPIC-006` passes it in
 * rather than each caller spelling 3000. It is a VALUE for the caller to choose, never a default
 * this module applies on its own: `budgetMs` below is required.
 */
export const DEFAULT_BUDGET_MS = 3_000;

/**
 * `NFR-004`'s hard ceiling, in milliseconds. A bound on the MECHANISM, not a difficulty:
 * `NFR-004` says the ceiling holds AT ANY DIFFICULTY, so it is honoured here whatever a caller
 * passes. `EPIC-006` chooses a budget; it does not choose the ceiling.
 */
export const HARD_CEILING_MS = 5_000;

/**
 * Nodes between clock consultations. A power of two, and a NODE count rather than a depth: the
 * abort granularity is work done, which is the quantity a wall clock is actually spent on.
 *
 * Exported because `A2` needs it to state its bound: after the budget expires the search may
 * still visit up to one interval per level of the stack it is unwinding, and a test that
 * hard-coded 1024 would assert about a number rather than about the property.
 */
export const NODES_PER_CLOCK_CHECK = 1024;

export interface EngineOptions {
  /**
   * The per-move budget in milliseconds. REQUIRED — see the module header, and `A4`.
   *
   * VALID RANGE: `0 < budgetMs <= HARD_CEILING_MS`. A larger value is CAPPED at the ceiling
   * rather than honoured (`RF-1`); a zero, negative or `NaN` value leaves the unabortable first
   * iteration, so depth 1 comes back either way.
   */
  readonly budgetMs: number;
  /** The clock. Defaults to `Date.now`; a test injects virtual time so nothing waits. */
  readonly now?: Clock;
}

export interface EngineChoice {
  /** The best move of the deepest COMPLETED iteration. Always a legal move of the position. */
  readonly move: Move;
  /** That iteration's score, in `search`'s convention: positive for the side to move. */
  readonly score: number;
  /** The deepest iteration that COMPLETED. Reported, never asked for — hardware decides it. */
  readonly depth: number;
  /** Nodes visited across every iteration, the aborted one included. */
  readonly nodes: number;
  /** `now()` at return minus `now()` at entry, on the caller's clock. */
  readonly elapsedMs: number;
}

/** Thrown from inside the recursion when the budget is spent, caught by the deepening loop. */
const ABORTED = Symbol("engine: the budget is spent");

/** The two `ABC-121` switches, `src/search.ts`'s rule: on in `chooseMove`, off in its doors. */
interface Heuristics {
  /** Principal-variation search: false on `chooseMoveWithoutPvsOrReductions` only. */
  readonly pvs: boolean;
  /** Late-move reductions, inside PVS's frame: true on `chooseMove` only. */
  readonly reductions: boolean;
  /** PROBE: Q1(a)'s widened root window. */
  readonly wideRoot: boolean;
  /** PROBE: Q1(a)'s seeded draw among the equal-best set. */
  readonly rng: (() => number) | null;
}

/** The deepening loop's mutable state: the clock, the deadline, and when to consult again. */
interface Budget extends Heuristics {
  readonly now: Clock;
  readonly deadline: number;
  nodes: number;
  /** The node count at which the clock is next consulted. `Infinity` disarms the abort. */
  nextCheck: number;
  /** `countNode` on this budget, handed to the quiescence search so its nodes are clocked too. */
  readonly visit: QuiescenceVisitor;
  /**
   * This move's killer table (`ABC-080`): one per `chooseMove` call, kept across its iterations
   * — a killer found at ply `n` of depth 4 is still a good first quiet move at ply `n` of depth 5
   * — and never across calls.
   */
  readonly killers: KillerTable;
  /**
   * This move's per-ply key array (`ABC-081`, `ADR-0002` clause 3): allocated once per
   * `chooseMove` call, `keys[0]` the root's key, each child's key derived from its parent's.
   */
  readonly keys: BigUint64Array;
}

/**
 * One node visited: count it, and every `NODES_PER_CLOCK_CHECK` nodes consult the clock. The
 * abort check sits at the NODE — full-width and quiescence nodes alike — never at the iteration.
 */
function countNode(budget: Budget): void {
  budget.nodes++;
  if (budget.nodes >= budget.nextCheck) {
    budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
    if (budget.now() >= budget.deadline) throw ABORTED;
  }
}

/**
 * The score of a position the search will not look past — `src/search.ts`'s `leafScore`, with
 * the same capture search at an in-progress leaf (`ABC-079`). The quiescence nodes go through
 * `budget.visit`, so an abort can land inside a capture sequence; `quiesce` unmakes on the way
 * out, so the position is byte-identical either way.
 */
function leafScore(
  position: Position,
  ply: number,
  alpha: number,
  beta: number,
  budget: Budget,
): number {
  const status = gameStatus(position);
  if (status.result === "in-progress") return quiesce(position, alpha, beta, 0, budget.visit);
  if (status.reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}

/**
 * `src/search.ts`'s negamax with ONE addition: the abort check, and it sits at the node rather
 * than at the iteration. The move ordering is that module's, by the same `orderMoves` and the
 * same `KillerTable` (`ABC-080`); the repetition scan, the capacity guard and the table probe,
 * cutoff and store are that module's too, in the same order (`ABC-081`).
 *
 * The made move is unmade in a `finally`, so an abort thrown anywhere in the subtree still
 * leaves the caller's position byte-identical. The turn loop BORROWS `history.position`
 * (`history.ts:39-44`) — a search that unwound without unmaking would hand the loop a board
 * several plies into a line nobody played.
 */
function negamax(
  position: Position,
  remaining: number,
  alpha: number,
  beta: number,
  ply: number,
  budget: Budget,
): number {
  countNode(budget);

  const keys = budget.keys;
  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;
  if (remaining <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore(position, ply, alpha, beta, budget);
  }
  const key = keys[ply] as bigint;

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
  let bestMove = moves[0] as Move;
  let index = 0;
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;
    const undo = makeMove(position, move);
    let score: number;
    try {
      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      score = searchMove(position, remaining, alpha, beta, ply, index, reduction, budget);
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

  // Never reached by an aborted subtree: the abort throws past this line, so a partial result
  // is never stored.
  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}

/**
 * `src/search.ts`'s `searchMove`, the same rule: the score of the move just made at a node of
 * `remaining` depth with window `(alpha, beta)`. The first move, and every move with `pvs` off,
 * gets the node's own window; with `pvs` on a later move gets the null window first, `reduction`
 * plies shallower; a reduced search that fails high is repeated at full depth with the same null
 * window; and the full window is searched again only when it fails high inside `(alpha, beta)`.
 */
function searchMove(
  position: Position,
  remaining: number,
  alpha: number,
  beta: number,
  ply: number,
  index: number,
  reduction: number,
  budget: Budget,
): number {
  const child = ply + 1;
  if (index === 0 || !budget.pvs) {
    return 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  let score =
    0 - negamax(position, remaining - 1 - reduction, 0 - alpha - 1, 0 - alpha, child, budget);
  if (score > alpha && reduction > 0) {
    score = 0 - negamax(position, remaining - 1, 0 - alpha - 1, 0 - alpha, child, budget);
  }
  if (score > alpha && score < beta) {
    score = 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  return score;
}


/**
 * PROBE (ruling-abc086-seed). The shipped `runIteration`, plus Q1(a)'s construction behind two
 * switches on `Heuristics`:
 *   wideRoot — every root move after the first is searched against `best - 1`, not `best`, so a
 *              move that only TIES fails high on the null window and is re-searched to an exact
 *              score. This is the "identify the equal-best set under PVS" part of (a).
 *   rng      — when non-null, the returned move is drawn from the equal-best set; when null the
 *              first of the set wins, which is exactly the shipped strict-`>` choice.
 * With wideRoot false and rng null this function is the shipped one, node for node (`faithful`).
 */
interface Iteration {
  readonly move: Move;
  readonly score: number;
  readonly ties: number;
}

function runIteration(
  position: Position,
  moves: readonly Move[],
  remaining: number,
  budget: Budget,
): Iteration {
  const rootKey = budget.keys[0] as bigint;
  const slot = probeTable(rootKey);
  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
  );
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = rootMoves[0] as Move;
  let tied: Move[] = [];

  let index = 0;
  for (const move of rootMoves) {
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, true)
      : 0;
    const undo = makeMove(position, move);
    let score: number;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      const a = budget.wideRoot && index > 0 ? alpha - 1 : alpha;
      score = searchMove(position, remaining, a, Number.POSITIVE_INFINITY, 0, index, reduction, budget);
    } finally {
      unmakeMove(position, move, undo);
    }
    index++;

    if (score > best) {
      best = score;
      bestMove = move;
      tied = [move];
    } else if (score === best) {
      tied.push(move);
    }
    if (best > alpha) alpha = best;
  }

  if (budget.rng !== null && tied.length > 1) {
    bestMove = tied[Math.floor(budget.rng() * tied.length)] as Move;
  }
  storeEntry(rootKey, remaining, BOUND_EXACT, best, 0, bestMove);
  return { move: bestMove, score: best, ties: budget.wideRoot ? tied.length : -1 };
}

export interface ProbeConfig {
  readonly pvs: boolean;
  readonly reductions: boolean;
  readonly wideRoot: boolean;
  /** null = shipped first-of-set choice; otherwise an xorshift32 seed (non-zero). */
  readonly seed: number | null;
}

/** xorshift32 → [0, 1). Instance state, never module state. */
export function xorshift32(seed: number): () => number {
  let s = seed >>> 0 || 0x9e3779b9;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0x1_0000_0000;
  };
}

export interface ProbeChoice extends EngineChoice {
  readonly ties: number;
}

/**
 * The shipped deepening loop. `maxDepth` (PROBE ONLY) stops after that iteration so value
 * comparisons are made at equal depth; with `maxDepth` Infinity it is the shipped loop.
 */
export function probeChoose(
  position: Position,
  options: EngineOptions,
  cfg: ProbeConfig,
  maxDepth = Number.POSITIVE_INFINITY,
): ProbeChoice | null {
  const now = options.now ?? Date.now;
  const start = now();
  const budget: Budget = {
    now,
    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
    nodes: 0,
    nextCheck: Number.POSITIVE_INFINITY,
    visit: () => countNode(budget),
    killers: new KillerTable(),
    keys: new BigUint64Array(KEY_ARRAY_CAPACITY + 1),
    pvs: cfg.pvs,
    reductions: cfg.reductions,
    wideRoot: cfg.wideRoot,
    rng: cfg.seed === null ? null : xorshift32(cfg.seed),
  };
  budget.keys[0] = zobristKey(position);
  clearTable();

  const rootMoves = legalMoves(position);
  if (rootMoves.length === 0) return null;

  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;
  budget.nextCheck =
    maxDepth === Number.POSITIVE_INFINITY ? budget.nodes + NODES_PER_CLOCK_CHECK : Number.POSITIVE_INFINITY;

  for (let iteration = 2; iteration <= maxDepth && (maxDepth !== Number.POSITIVE_INFINITY || now() < budget.deadline); iteration++) {
    let deeper: Iteration;
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
    elapsedMs: now() - start,
    ties: best.ties,
  };
}
