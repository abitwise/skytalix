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
 * THE BUDGET IS CLAMPED TO `HARD_CEILING_MS` (`RF-1`). A ceiling that holds only when the caller
 * chooses well is not a ceiling on the engine — so it is honoured here, whatever a caller passes.
 * Ruled at `ABC-078`'s security/NFR gate (`plans/nfr-catalog.md`, `NFR-004` clause B): this module
 * owns the MECHANISM, `EPIC-006` owns the CHOOSING, and a ceiling is the bound every choice must
 * land inside rather than a choice. `ABC-212` (`ADR-0045` § AMENDMENT A3): `NFR-004`'s ceiling is
 * per level (5 s at 1-5, 7 s at 6, 32 s at 7), and this ONE clamp sits at the largest ceiling in
 * force. `ABC-221` (`ADR-0052` D6) moved it to 60 000, UCI `TimeMode` `uci-clock-mode`'s ceiling;
 * each level's own ceiling is held by its budget, and each mode's by its own cap. So a raw call is
 * bounded at 60 s, and every surface hands in a level- or mode-derived budget. **The residual is
 * stated and not hidden:** the clamp bounds the DEADLINE, not the abort granularity, so a budget
 * above it returns a few ms past 60 000 (measured at the old 5 000: ~5 003 ms) — accepted risk
 * `AR-NFR004-A`, same mechanism and same ≤ 31 ms bound as the ≤ 3 s clause. No safety margin is
 * applied, because a margin would make the sentence true by making `budgetMs` a lie.
 *
 * THE TRANSPOSITION TABLE AND IN-TREE REPETITION (`ABC-081`) are `src/search.ts`'s, node for node:
 * this call's own per-ply key array, seeded with the root's key, and the one table
 * (`src/transposition.ts`, `ADR-0025`), cleared at this call's entry and kept across its
 * iterations — so iteration `n`'s best moves are iteration `n + 1`'s hash moves, the root's
 * included. The session's history is not read: the seam hands in a `GameHistory` and only its
 * `position` is searched (`ADR-0002` clause 3).
 *
 * THE GAME'S EARLIER POSITIONS (`ABC-230`, `ADR-0054`) arrive as `EngineOptions.priorKeys`, a
 * read-only key list the caller builds with `trimPriorKeys`; this module still imports no history.
 * A node repeats if its position stood once on the path, the root included, as before, or TWICE
 * before the root (`repeatsBeforeRoot`). `search()` and the test-only doors take no prior keys.
 *
 * PRINCIPAL-VARIATION SEARCH AND LATE-MOVE REDUCTIONS (`ABC-121`, `ADR-0026`) are `src/search.ts`'s
 * too, in the same shape (`searchMove`), and the reduction is that module's ONE predicate,
 * `lateMoveReduction`, imported rather than copied, so the rule cannot drift between the two
 * recursions. Two TEST-ONLY doors turn them off: `chooseMoveWithoutPvsOrReductions` is the
 * pre-`ABC-121` `chooseMove`, node for node, and every existing work reading of the engine reads
 * it; `chooseMoveWithoutReductions` keeps PVS and is the engine side of `A3`'s identity sweep and
 * of the bounded drift oracle. Neither takes a depth (`A4`).
 *
 * NULL-MOVE PRUNING (`ABC-208`, `ADR-0050`) is `src/search.ts`'s too, at null-window nodes only,
 * by that module's ONE predicate, `nullMoveReduction`, imported rather than copied. The clock is
 * checked inside the null subtree as anywhere else (`NFR-004`). It changes the VALUE, so both doors
 * above turn it off, and a third TEST-ONLY door, `chooseMoveWithoutNullMove`, is the pre-`ABC-208`
 * `chooseMove`, node for node: the engine side of its bounded drift oracle. It takes no depth.
 *
 * EVASIONS IN QUIESCENCE (`ABC-228`, `ADR-0053`) reach this recursion through the same `quiesce`,
 * by a `quiescenceEvasions` switch mapped onto a constant `QuiescenceRules` record; the leaf hands
 * it its `ply` for the mate distance, and evasion nodes go through `budget.visit` like any
 * quiescence node, so the clock is consulted inside them (`NFR-004`). It changes the VALUE, so
 * every door above turns it off, and a fourth TEST-ONLY door, `chooseMoveWithoutQuiescenceEvasions`,
 * is the pre-`ABC-228` `chooseMove`, node for node. It takes no depth.
 *
 * QUIET QUEEN PROMOTIONS IN QUIESCENCE (`ABC-229`, `ADR-0053` decision 5) reach it the same way, by
 * a `quietPromotions` switch beside `quiescenceEvasions`. It changes the VALUE, so every door
 * above turns it off, and a fifth TEST-ONLY door, `chooseMoveWithoutQuietPromotions` (evasions
 * on), is the pre-`ABC-229` `chooseMove`, node for node. It takes no depth.
 *
 * DEEPER-ENTRY TABLE CUTOFFS (`ABC-238`, `ADR-0058`) are `src/search.ts`'s rule too: an entry
 * searched to at least the remaining depth settles a node, by a `deeperCutoffs` switch handed to
 * the one `tableCutoff`. Iterative deepening keeps every earlier iteration's entries, so this is
 * the recursion where they meet most often. It changes the VALUE, so every door above turns it
 * off, and a sixth TEST-ONLY door, `chooseMoveWithoutDeeperCutoffs`, is the pre-`ABC-238`
 * `chooseMove`, node for node. It takes no depth.
 *
 * NOT HERE, each owned elsewhere: difficulty selection and how a level persists (`EPIC-006`), the
 * budget-to-level mapping (`ABC-087`), aspiration windows and threading (none requested;
 * `ADR-0005` F6 leaves threading to Architect/Design).
 */

import { makeMove, makeNullMove, unmakeMove, unmakeNullMove } from "./apply.ts";
import { leafEndReason } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { type QuiescenceRules, type QuiescenceVisitor, quiesce } from "./quiescence.ts";
import {
  KEY_ARRAY_CAPACITY,
  KillerTable,
  lateMoveReduction,
  MATE_SCORE,
  nullMoveReduction,
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
import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";

/**
 * The game the seam is handed — named off `EngineSeam` rather than imported from
 * `src/history.ts`, so no search module imports the session's history (`ABC-081` `A6`).
 */
type SeamGame = Parameters<EngineSeam>[0];

/**
 * A source of milliseconds: the wall clock in the shipped construction, a virtual clock
 * (`src/virtual-clock.ts`) in deterministic mode — which a test or a deterministic-mode harness
 * supplies (`ADR-0027`).
 *
 * CONTRACT: ADVANCING and NON-DECREASING. The deepening loop terminates because successive
 * readings advance towards the deadline — a frozen clock or one that runs backwards does not
 * terminate, and nothing here defends against that.
 */
export type Clock = () => number;

/**
 * `NFR-004`'s default difficulty budget, in milliseconds, exported so `EPIC-006` passes it in
 * rather than each caller spelling 3000. It is a VALUE for the caller to choose, never a default
 * this module applies on its own: `budgetMs` below is required.
 */
export const DEFAULT_BUDGET_MS = 4_000;

/**
 * `NFR-004`'s hard ceiling, in milliseconds: the largest ceiling in force, 60 s, UCI `TimeMode`
 * `uci-clock-mode`'s (`ADR-0052` D6, `ABC-221`; `ADR-0045` § AMENDMENT A3's one-clamp shape). A
 * bound on the MECHANISM, not a difficulty: it is honoured here whatever a caller passes. Each
 * level's own, lower ceiling (5 s at 1-5, 7 s at 6, 32 s at 7) is held by that level's budget in
 * `src/levels.ts`, and each mode's by its cap in `src/uci-session.ts`, not here. `EPIC-006`
 * chooses a budget; it does not choose the ceiling.
 */
export const HARD_CEILING_MS = 60_000;

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
  /**
   * The clock. Defaults to the wall clock; a test or a deterministic-mode harness injects a
   * virtual one.
   */
  readonly now?: Clock;
  /**
   * `ABC-170` (`ADR-0044` D12): stop deepening once THIS iteration has completed. Optional, and
   * it carries no default: absent, the loop is bounded by the clock alone, as before. It can only
   * SHORTEN a search the clock and `HARD_CEILING_MS` still bound, so `RISK-002` holds: the budget
   * is time, and a depth can only cut it short. The first iteration always completes.
   */
  readonly maxDepth?: number;
  /**
   * `ABC-170` (`ADR-0044` D12): abort once `nodes >= maxNodes`, read in `countNode`'s
   * every-`NODES_PER_CLOCK_CHECK` branch AFTER the clock and in the loop condition AFTER the
   * clock, so an absent field moves no virtual-clock reading. The aborted iteration is discarded,
   * as it is for time, and the overshoot is bounded the same way. The first iteration always
   * completes, so a tiny value still returns a depth-1 move.
   */
  readonly maxNodes?: number;
  /**
   * `ABC-230` (`ADR-0054` decision 1): the Zobrist keys of the game's positions BEFORE the root,
   * oldest first, the root's own key excluded — `trimPriorKeys`'s output. Read-only and never
   * copied: the search reads the caller's array for the length of this call. At most the last
   * `PRIOR_KEYS_WINDOW` entries are read, whatever is handed in. Absent or empty, the search is
   * the one without game history, node for node. The test-only doors below ignore it.
   */
  readonly priorKeys?: readonly bigint[];
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

/**
 * `ADR-0054` decision 1: the reversible window is capped at the fifty-move window, 100 plies. The
 * prior-key list is trimmed to it, and the search reads no more of a list than this.
 */
const PRIOR_KEYS_WINDOW = 100;

/** The prior-key list of a search with no game history: base, node for node. */
const NO_PRIOR_KEYS: readonly bigint[] = [];

/**
 * `ADR-0054` decision 1: the one trim both surfaces call. `keys` is a game's key list, oldest
 * first, the root's key LAST (`src/history.ts` `keyHistory`'s shape); the result is the keys before
 * the root that can still repeat: the last `min(halfmoveClock, 100)` of them, the root excluded.
 * Only the halfmove clock cuts the window; a castling-rights change does not need to, because no
 * key before it can equal a key after it.
 */
export function trimPriorKeys(keys: readonly bigint[], halfmoveClock: number): bigint[] {
  const root = keys.length - 1;
  return keys.slice(Math.max(0, root - Math.min(halfmoveClock, PRIOR_KEYS_WINDOW)), root);
}

/** Thrown from inside the recursion when the budget is spent, caught by the deepening loop. */
const ABORTED = Symbol("engine: the budget is spent");

/**
 * The `ABC-121`, `ABC-208`, `ABC-230`, `ABC-228`, `ABC-229` and `ABC-238` switches, `src/search.ts`'s rule: on in `chooseMove`, off
 * in its doors.
 */
interface Heuristics {
  /** Principal-variation search: false on `chooseMoveWithoutPvsOrReductions` only. */
  readonly pvs: boolean;
  /** Late-move reductions, inside PVS's frame: true on `chooseMove` and its null-move-off door. */
  readonly reductions: boolean;
  /** Null-move pruning (`ABC-208`), at null-window nodes: true on `chooseMove` only. */
  readonly nullMove: boolean;
  /** `options.priorKeys` read (`ABC-230`, `ADR-0054` decision 3): true on `chooseMove` only. */
  readonly priorKeys: boolean;
  /**
   * Evasions in check inside quiescence (`ABC-228`, `ADR-0053`): true on `chooseMove` and
   * `chooseMoveWithoutQuietPromotions`.
   */
  readonly quiescenceEvasions: boolean;
  /** Quiet queen promotions inside quiescence (`ABC-229`, `ADR-0053`): true on `chooseMove` only. */
  readonly quietPromotions: boolean;
  /**
   * Deeper-entry table cutoffs (`ABC-238`, `ADR-0058`), `tableCutoff`'s `deeper` argument: true on
   * `chooseMove` only; `chooseMoveWithoutDeeperCutoffs` and every older door cut at the exact
   * stored depth.
   */
  readonly deeperCutoffs: boolean;
}

/** The quiescence rules this recursion hands `quiesce` (`ADR-0053` decision 6): constants, never built per leaf. */
const RULES_SHIPPED: QuiescenceRules = { evasions: true, quietPromotions: true };
const RULES_NO_QUIET_PROMOTIONS: QuiescenceRules = { evasions: true, quietPromotions: false };
const RULES_NO_EVASIONS: QuiescenceRules = { evasions: false, quietPromotions: true };
const RULES_NEITHER: QuiescenceRules = { evasions: false, quietPromotions: false };

/** The deepening loop's mutable state: the clock, the deadline, and when to consult again. */
interface Budget extends Heuristics {
  readonly now: Clock;
  readonly deadline: number;
  /** `options.maxNodes`, or `Infinity` when absent: the comparison that never fires. */
  readonly maxNodes: number;
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
  /** `options.priorKeys` (`ABC-230`), borrowed, or `NO_PRIOR_KEYS` on the doors and when absent. */
  readonly prior: readonly bigint[];
}

/**
 * One node visited: count it, and every `NODES_PER_CLOCK_CHECK` nodes consult the clock. The
 * abort check sits at the NODE — full-width and quiescence nodes alike — never at the iteration.
 */
function countNode(budget: Budget): void {
  budget.nodes++;
  if (budget.nodes >= budget.nextCheck) {
    budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
    if (budget.now() >= budget.deadline || budget.nodes >= budget.maxNodes) throw ABORTED;
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
  const reason = leafEndReason(position);
  if (reason === null) {
    const rules = budget.quiescenceEvasions
      ? budget.quietPromotions
        ? RULES_SHIPPED
        : RULES_NO_QUIET_PROMOTIONS
      : budget.quietPromotions
        ? RULES_NO_EVASIONS
        : RULES_NEITHER;
    return quiesce(position, alpha, beta, 0, ply, rules, budget.visit);
  }
  if (reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}

/**
 * `ADR-0054` decision 3, the pre-root half of the repetition scan: true when the position at `ply`
 * (key `key`, clock `halfmoveClock`) stood TWICE among the keys before the root. One occurrence
 * there is not a draw. The walk is `repeatsInPath`'s continued below the root: the same parity,
 * `-1` the position one ply before it, bounded by the clock and by the list (at most
 * `PRIOR_KEYS_WINDOW` of it). It starts where the path walk (`ply - 4, ply - 6, …`) first goes
 * below 0. With no prior keys, or a clock that does not reach past the root, it reads nothing.
 */
function repeatsBeforeRoot(
  prior: readonly bigint[],
  key: bigint,
  ply: number,
  halfmoveClock: number,
): boolean {
  const oldest = Math.max(ply - halfmoveClock, -Math.min(prior.length, PRIOR_KEYS_WINDOW));
  let matches = 0;
  for (let earlier = Math.min(ply - 4, (ply & 1) - 2); earlier >= oldest; earlier -= 2) {
    if (prior[prior.length + earlier] === key && ++matches === 2) return true;
  }
  return false;
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
 * several plies into a line nobody played. The null move (`ABC-208`) is unmade the same way.
 */
function negamax(
  position: Position,
  remaining: number,
  alpha: number,
  beta: number,
  ply: number,
  budget: Budget,
  afterNull: boolean,
): number {
  countNode(budget);

  const keys = budget.keys;
  const key = keys[ply] as bigint;
  // `ABC-230`: a repetition is one occurrence on the path or two before the root (`ADR-0054`).
  if (
    repeatsInPath(keys, ply, position.halfmoveClock) ||
    repeatsBeforeRoot(budget.prior, key, ply, position.halfmoveClock)
  ) {
    return 0;
  }
  if (remaining <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore(position, ply, alpha, beta, budget);
  }

  const slot = probeTable(key);
  if (slot !== -1) {
    const settled = tableCutoff(slot, remaining, alpha, beta, ply, budget.deeperCutoffs);
    if (settled !== null) return settled;
  }

  if (budget.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, remaining, ply, afterNull);
    if (nullReduction > 0) {
      const nullUndo = makeNullMove(position);
      let nullScore: number;
      try {
        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
        nullScore =
          0 -
          negamax(
            position,
            remaining - 1 - nullReduction,
            0 - beta,
            0 - beta + 1,
            ply + 1,
            budget,
            true,
          );
      } finally {
        unmakeNullMove(position, nullUndo);
      }
      // Beta, never the null score: a mate found after a pass is no mate. Nothing is stored.
      if (nullScore >= beta) return beta;
    }
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
    return 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget, false);
  }
  let score =
    0 -
    negamax(position, remaining - 1 - reduction, 0 - alpha - 1, 0 - alpha, child, budget, false);
  if (score > alpha && reduction > 0) {
    score = 0 - negamax(position, remaining - 1, 0 - alpha - 1, 0 - alpha, child, budget, false);
  }
  if (score > alpha && score < beta) {
    score = 0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget, false);
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
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, true)
      : 0;
    const undo = makeMove(position, move);
    let score: number;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      score = searchMove(
        position,
        remaining,
        alpha,
        Number.POSITIVE_INFINITY,
        0,
        index,
        reduction,
        budget,
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
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    deeperCutoffs: true,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-238` `chooseMove`, node for node: deeper-entry table cutoffs off, so an
 * entry cuts only at its exact stored depth, and everything else on, the prior keys included —
 * the engine side of `ABC-238`'s bounded drift oracle, and the shipped side of every older row
 * that measures its own heuristic alone (`ADR-0058` decisions 3 and 5). It takes no depth. Not
 * an engine option; nothing in production calls it.
 */
export function chooseMoveWithoutDeeperCutoffs(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    deeperCutoffs: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-229` `chooseMove`, node for node: quiet queen promotions in quiescence
 * off, everything else on, evasions, null move and the prior keys included — the engine side of
 * `ABC-229`'s bounded drift oracle, and the shipped side of every `ABC-228` row that measures
 * evasions alone (`ADR-0053` decisions 6 and 7). Not an engine option; nothing in production
 * calls it.
 */
export function chooseMoveWithoutQuietPromotions(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: true,
    quietPromotions: false,
    deeperCutoffs: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-228` `chooseMove`, node for node: evasions in quiescence off, everything
 * else on, null move and the prior keys included — the engine side of `ABC-228`'s bounded drift
 * oracle, and the shipped side of every `ABC-208` row that measures null move alone (`ADR-0053`
 * decisions 6 and 7). Not an engine option; nothing in production calls it.
 */
export function chooseMoveWithoutQuiescenceEvasions(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: false,
    quietPromotions: false,
    deeperCutoffs: false,
  });
}

/**
 * TEST-ONLY. The pre-`ABC-208` `chooseMove`, node for node: null-move pruning off, everything else
 * on — the engine side of `ABC-208`'s bounded drift oracle, and the shipped side of every
 * `ABC-121` row that measures PVS and LMR alone (`ADR-0050` decisions 2 and 4). Not an engine
 * option; nothing in production calls it.
 */
export function chooseMoveWithoutNullMove(
  position: Position,
  options: EngineOptions,
): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: false,
    priorKeys: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    deeperCutoffs: false,
  });
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
  return deepen(position, options, {
    pvs: true,
    reductions: false,
    nullMove: false,
    priorKeys: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    deeperCutoffs: false,
  });
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
  return deepen(position, options, {
    pvs: false,
    reductions: false,
    nullMove: false,
    priorKeys: false,
    quiescenceEvasions: false,
    quietPromotions: false,
    deeperCutoffs: false,
  });
}

/** The deepening loop behind `chooseMove` and its six doors; they differ in `heuristics` only. */
function deepen(
  position: Position,
  options: EngineOptions,
  heuristics: Heuristics,
): EngineChoice | null {
  const now = options.now ?? Date.now;
  const start = now();
  const budget: Budget = {
    now,
    // `Math.min` and NOT an `if`: it preserves every degenerate budget already measured safe
    // (`NaN` stays `NaN` — both comparisons false, depth 1; `0` / `-1` / `-1e9` unchanged) and
    // turns `Infinity` into the ceiling, which is the module's only non-terminating budget.
    deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
    maxNodes: options.maxNodes ?? Number.POSITIVE_INFINITY,
    nodes: 0,
    // Disarmed for the first iteration: depth 1 always completes, so a move always exists.
    nextCheck: Number.POSITIVE_INFINITY,
    visit: () => countNode(budget),
    killers: new KillerTable(),
    keys: new BigUint64Array(KEY_ARRAY_CAPACITY + 1),
    prior: heuristics.priorKeys ? (options.priorKeys ?? NO_PRIOR_KEYS) : NO_PRIOR_KEYS,
    ...heuristics,
  };
  budget.keys[0] = zobristKey(position);
  clearTable();

  const rootMoves = legalMoves(position);
  if (rootMoves.length === 0) return null;

  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;
  budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;

  // The clock FIRST, so it is read exactly as often as before; the two limits (`ABC-170`) are
  // plain comparisons after it, and absent they are `Infinity`, which never stops the loop.
  for (
    let iteration = 2;
    now() < budget.deadline &&
    iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY) &&
    budget.nodes < budget.maxNodes;
    iteration++
  ) {
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
 * The `src/turn-loop.ts` `EngineSeam` has been waiting on since `ABC-019`, bound to a budget.
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
