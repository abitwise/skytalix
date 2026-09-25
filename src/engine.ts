/**
 * ABC-078 — iterative deepening against a wall clock. THE per-move budget, and `EngineSeam`.
 *
 * ===========================================================================================
 *  THIS MODULE IS `RISK-002`'s CONSTRAINT, BUILT. The per-move budget is TIME, never depth:
 *  the caller supplies milliseconds, the search deepens 1, 2, 3 … until that budget is spent,
 *  and the move returned is the best move of the last COMPLETED iteration. There is no depth
 *  argument, no depth default and no depth constant anywhere below — a fixed depth would blow
 *  `NFR-004`'s 3 s ceiling on exactly the machines least able to absorb it
 *  (`plans/nfr-catalog.md`, the `RISK-002` survival paragraph). `A4` in `src/engine.test.ts`
 *  asserts that shape against this file; `A5` asserts the depth actually MOVES with the budget,
 *  which is what a stopped clock cannot fake.
 * ===========================================================================================
 *
 * THE CLOCK IS CHECKED INSIDE THE RECURSION, not only between iterations. A clock consulted
 * only at an iteration boundary produces an engine that honours a 3 s budget on every position
 * where it did not matter and overruns by a whole iteration on the one where it did — the
 * iteration that would have taken 12 s is entered because the previous one finished in 2.9 s.
 * `A2` is the criterion that catches it, and it catches it by bounding the NODES visited after
 * the budget expired rather than by timing anything.
 *
 * THE FIRST ITERATION IS UNABORTABLE, and that is the whole reason a move always exists. Depth
 * 1 is one `legalMoves` call plus one evaluation per move; it completes even at a 1 ms budget
 * on an already-expired clock (`A7`), and only from iteration 2 onward is the clock armed.
 *
 * AN ABORTED ITERATION IS DISCARDED WHOLE (`A3`). Its best-so-far is a systematically biased
 * sample — the moves the generator happened to emit first, scored deeper than the rest — so it
 * is worse than not having searched that depth at all. The best-so-far register is written only
 * on a COMPLETED iteration, which is expressed here by assigning the register from the call's
 * return value: an abort throws, the assignment never happens, and there is no partial state to
 * forget to discard.
 *
 * WHY THE RECURSION IS HERE AND NOT `src/search.ts`'s. `ABC-077` owns the negamax core and its
 * `A6` pins that module to exactly three exports and to carrying NO clock — `src/search.test.ts`
 * fails on a `Date.now` in that file and on a fourth export. An abortable search cannot be added
 * there without breaking a merged criterion, so the abortable copy lives here, in the module that
 * owns the clock. The two are held together by test rather than by sharing code: the identity
 * sweep in `src/engine.test.ts` asserts this module's completed iteration equals
 * `search(position, depth)` in BOTH `move` AND `score`, over mate- and stalemate-adjacent
 * endgames as well as the middlegame, so a drift between the two recursions is red. The score
 * and the breadth are load-bearing — a move-only comparison at one quiet position is blind to
 * exactly the drift a second copy produces (`ABC-078` QE, gap `G4`).
 *
 * THE BUDGET IS CLAMPED TO `HARD_CEILING_MS` (`RF-1`). `NFR-004`'s ceiling reads *"hard ceiling
 * 5 s AT ANY DIFFICULTY"*, and a ceiling that holds only when the caller chooses well is not a
 * ceiling on the engine — so it is honoured here, whatever a caller passes. Ruled at `ABC-078`'s
 * security/NFR gate (`plans/nfr-catalog.md`, `NFR-004` clause B): this module owns the MECHANISM,
 * `EPIC-006` owns the CHOOSING, and a ceiling is the bound every choice must land inside rather
 * than a choice. **The residual is stated and not hidden:** the clamp bounds the DEADLINE, not the
 * abort granularity, so a 10 s budget still returns at ~5 003 ms — accepted risk `AR-NFR004-A`,
 * same mechanism and same ≤ 31 ms bound as the ≤ 3 s clause. No safety margin is applied, because
 * a margin would make the sentence true by making `budgetMs` a lie.
 *
 * THE TRANSPOSITION TABLE AND IN-TREE REPETITION (`ABC-081`) are `src/search.ts`'s, node for node:
 * this call's own per-ply key array, seeded with the root's key, and the one table
 * (`src/transposition.ts`, `ADR-0025`), cleared at this call's entry and kept across its
 * iterations — so iteration `n`'s best moves are iteration `n + 1`'s hash moves, the root's
 * included. The session's history is not read: the seam hands in a `GameHistory` and only its
 * `position` is searched (`ADR-0002` clause 3).
 *
 * PRINCIPAL-VARIATION SEARCH (`ABC-121`, `ADR-0026`) is `src/search.ts`'s too, in the same shape
 * (`searchMove`). Two TEST-ONLY doors turn it off: `chooseMoveWithoutPvsOrReductions` is the
 * pre-`ABC-121` `chooseMove`, node for node, and every existing work reading of the engine reads
 * it; `chooseMoveWithoutReductions` is the engine side of `A3`'s identity sweep. Neither takes a
 * depth (`A4`).
 *
 * NOT HERE, each owned elsewhere: difficulty selection and how a level persists (`EPIC-006`), the
 * budget-to-level mapping (`ABC-087`), aspiration windows, null-move pruning, late-move reductions
 * and threading (none requested; `ADR-0005` F6 leaves threading to Architect/Design).
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { type QuiescenceVisitor, quiesce } from "./quiescence.ts";
import {
  KEY_ARRAY_CAPACITY,
  KillerTable,
  MATE_SCORE,
  orderMoves,
  repeatsInPath,
} from "./search.ts";
import {
  BOUND_EXACT,
  boundOf,
  clearTable,
  entryMove,
  probeTable,
  storeEntry,
  tableCutoff,
} from "./transposition.ts";
import type { EngineSeam } from "./turn-loop.ts";
import { zobristKey, zobristKeyAfterMove } from "./zobrist.ts";

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

/** The deepening loop's mutable state: the clock, the deadline, and when to consult again. */
interface Budget {
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
  /**
   * Principal-variation search (`ABC-121`): true on `chooseMove` and `chooseMoveWithoutReductions`,
   * false on `chooseMoveWithoutPvsOrReductions` — `src/search.ts`'s `pvs` switch, the same rule.
   */
  readonly pvs: boolean;
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
    const undo = makeMove(position, move);
    let score: number;
    try {
      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      score = searchMove(position, remaining, alpha, beta, ply, index, budget);
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
 * gets the node's own window; with `pvs` on a later move gets the null window first, and the full
 * window again only when it fails high inside `(alpha, beta)`.
 */
function searchMove(
  position: Position,
  remaining: number,
  alpha: number,
  beta: number,
  ply: number,
  index: number,
  budget: Budget,
): number {
  const child = ply + 1;
  if (index === 0 || !budget.pvs) {
    return 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  let score = 0 - negamax(position, remaining - 1, 0 - alpha - 1, 0 - alpha, child, budget);
  if (score > alpha && score < beta) {
    score = 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget);
  }
  return score;
}

/** One completed iteration: the root move it chose and that move's exact score. */
interface Iteration {
  readonly move: Move;
  readonly score: number;
}

/**
 * One iteration of the deepening: score every root move and keep the best, or throw `ABORTED`.
 *
 * Move order, window and tie-breaking are `src/search.ts`'s `searchRoot` exactly — the root list
 * in `orderMoves` order with no killer (the root never cuts off, so none is ever recorded there),
 * first move as the incumbent, strict `>` to displace it — which is what makes `A3`'s "the
 * returned move equals `search(position, n-1).move`" an identity rather than a coincidence.
 *
 * The root move list is passed IN, generated once for the whole deepening: the position is
 * byte-identical between iterations, so regenerating it per iteration buys nothing and costs a
 * `legalMoves` call — which is half the work of the depth-1 iteration `A7` runs 209 times. It is
 * ORDERED per iteration, because the hash move changes: the table's root entry is the previous
 * completed iteration's best move (`ABC-081`), tried first. That is the one place this search
 * may break a tie differently from `search()`, which starts from an empty table — among moves
 * of EQUAL score only, and `A3`'s identity sweep accepts exactly that.
 */
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

  let index = 0;
  for (const move of rootMoves) {
    const undo = makeMove(position, move);
    let score: number;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      score = searchMove(position, remaining, alpha, Number.POSITIVE_INFINITY, 0, index, budget);
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

/**
 * Choose a move for `position` within `options.budgetMs`, deepening until the clock says stop.
 *
 * `null` ONLY when the position has no legal move at all — a mated or stalemated board, which
 * the turn loop's exit test means the engine seam never sees. Every other position returns a
 * legal move at any budget, down to one already spent (`A7`).
 *
 * The position is byte-identical on return, aborted iteration or not.
 */
export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {
  return deepen(position, options, true);
}

/**
 * TEST-ONLY. `chooseMove` with the `ABC-121` heuristics that change the VALUE turned off and
 * principal-variation search kept on — the engine side of `ABC-078`'s `A3` identity sweep and of
 * the bounded drift oracle (`ADR-0026` decision 5). Not an engine option; nothing in production
 * calls it.
 */
export function chooseMoveWithoutReductions(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, true);
}

/**
 * TEST-ONLY. The pre-`ABC-121` `chooseMove`, node for node: principal-variation search and the
 * reductions both off. Every existing work reading of the engine reads it (`ADR-0026` decision
 * 4). Not an engine option; nothing in production calls it.
 */
export function chooseMoveWithoutPvsOrReductions(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, false);
}

/** The deepening loop behind `chooseMove` and its two doors; `pvs` is the one switch they differ in. */
function deepen(position: Position, options: EngineOptions, pvs: boolean): EngineChoice | null {
  const now = options.now ?? Date.now;
  const start = now();
  const budget: Budget = {
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
    pvs,
  };
  budget.keys[0] = zobristKey(position);
  clearTable();

  const rootMoves = legalMoves(position);
  if (rootMoves.length === 0) return null;

  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;
  budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;

  for (let iteration = 2; now() < budget.deadline; iteration++) {
    let deeper: Iteration;
    try {
      deeper = runIteration(position, rootMoves, iteration, budget);
    } catch (error) {
      // The register is written only here, from a value a COMPLETED iteration returned. An
      // aborted iteration leaves `best` and `reached` untouched, which is `A3`.
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
  };
}

/**
 * The `EngineSeam` `src/turn-loop.ts:138` has been waiting on since `ABC-019`, bound to a budget.
 *
 * `async` because the seam is asynchronous BY CONTRACT and not because anything here awaits: the
 * search is pure CPU and occupies the turn for its budget. The loop is shaped that way so a
 * yielding or worker-based engine can land later without rewriting it — see `turn-loop.ts`'s
 * header — and nothing in this ticket decides that.
 *
 * It throws on a position with no legal move. The loop's exit test sits between render and act,
 * so a terminal position never reaches the engine seam; a throw here is a bug in the CALLER, and
 * the loop already has a named reason for it (`engine-threw`) rather than a chess outcome.
 */
export function createEngine(options: EngineOptions): EngineSeam {
  return async (history: SeamGame): Promise<Move> => {
    const choice = chooseMove(history.position, options);
    if (choice === null) throw new Error("engine: asked to move in a position with no legal move");
    return choice.move;
  };
}
