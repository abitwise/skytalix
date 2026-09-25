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
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, type Position } from "./position.ts";
import { mvvLvaKey, quiesce } from "./quiescence.ts";
import {
  BOUND_EXACT,
  boundOf,
  clearTable,
  entryMove,
  probeTable,
  storeEntry,
  tableCutoff,
} from "./transposition.ts";
import { zobristKey, zobristKeyAfterMove } from "./zobrist.ts";

/**
 * The score of being checkmated AT THE ROOT, negated: a side mated `ply` plies from the root
 * scores `-(MATE_SCORE - ply)`, so a mate delivered sooner is worth more than the same mate
 * delivered later and the search prefers the short line. Far above any static evaluation the
 * tables can produce (a full board of queens is under 10 000), so a mate is never confused
 * with material.
 */
export const MATE_SCORE = 30_000;

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

/** Sort tiers: the hash move above every capture, every capture above every killer. */
const HASH_MOVE_KEY = 3_000_000;
const TACTICAL_KEY = 1_000_000;

function orderKey(move: Move, killers: readonly Move[], hashMove: Move | null): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return TACTICAL_KEY + mvvLvaKey(move);
  const killer = killers.findIndex((candidate) => sameMove(candidate, move));
  return killer === -1 ? 0 : killers.length - killer;
}

/**
 * THE move-ordering comparator (`ABC-080`), shared by both full-width recursions: the hash move
 * first, then captures and promotions by `mvvLvaKey`, then `killers` in the order given, then
 * every other move in generation order (the sort is stable). Returns a NEW array holding exactly
 * the moves it was handed — a killer or hash move absent from `moves` is ignored, never added.
 */
export function orderMoves(
  moves: readonly Move[],
  killers: readonly Move[],
  hashMove: Move | null,
): Move[] {
  return moves
    .map((move) => ({ move, key: orderKey(move, killers, hashMove) }))
    .sort((a, b) => b.key - a.key)
    .map(({ move }) => move);
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
   * and the full-window re-search on a fail-high. True on `search()` and
   * `searchWithoutReductions`; false on every door older than `ABC-121` (`ADR-0026` decision 3),
   * and on the two unpruned doors because a null window IS a cutoff.
   */
  readonly pvs: boolean;
  /**
   * Late-move reductions (`ABC-121`), by `lateMoveReduction`. True on `search()` only. They live
   * inside PVS's null-window frame, so they act only where `pvs` is on (`ADR-0026` decision 1).
   */
  readonly reductions: boolean;
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
 * Pure: it decides and picks no move. It plays `move` on `position` to see whether it gives check
 * and takes it back, so the position is byte-identical on return.
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
  const undo = makeMove(position, move);
  const givesCheck = isInCheck(position);
  unmakeMove(position, move, undo);
  return givesCheck ? 0 : 1;
}

/** The move list in the order `switches.ordering` asks for, at `ply`. */
function ordered(
  moves: readonly Move[],
  ply: number,
  switches: Switches,
  killers: KillerTable,
  hashMove: Move | null,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove);
}

/**
 * The score of a position the search will not look past: its game state decides it, and
 * otherwise the quiescence search does (or, with quiescence off, the static evaluation).
 *
 * `gameStatus` is called at leaves only, which is what `ADR-0002` keeps `positionCounts`
 * optional for — a bare call is legitimate here and costs one legal-move generation, the same
 * one an interior node pays for its own move list. It catches the drawn terminal states an
 * empty move list does not (dead position by material, the seventy-five-move rule) as well as
 * mate and stalemate. No counts map is passed: repetition is decided before this is reached,
 * off the search's own key array (`repeatsInPath`), never off the session's history.
 */
function leafScore(
  position: Position,
  ply: number,
  alpha: number,
  beta: number,
  switches: Switches,
  counter: NodeCounter,
): number {
  const status = gameStatus(position);
  if (status.result === "in-progress") {
    if (!switches.quiescence) return evaluate(position);
    // Every capture node the quiescence search enters is a position visited, and is counted.
    return quiesce(position, alpha, beta, 0, () => counter.nodes++);
  }
  if (status.reason === "checkmate") return 0 - (MATE_SCORE - ply);
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
): number {
  counter.nodes++;

  // In-tree repetition (`ABC-081` `A5`): EXACTLY 0, a literal, never a negated `-0`.
  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;
  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {
    return leafScore(position, ply, alpha, beta, switches, counter);
  }
  const prune = switches.prune;
  const key = keys[ply] as bigint;

  const slot = switches.table ? probeTable(key) : -1;
  if (slot !== -1) {
    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) return settled;
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
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0] as Move;
  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
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
): number {
  const child = ply + 1;
  if (index === 0 || !switches.pvs) {
    return (
      0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, child, switches, counter, killers, keys)
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
      );
  }
  if (score > alpha && score < beta) {
    score =
      0 -
      negamax(position, depth - 1, 0 - beta, 0 - alpha, child, switches, counter, killers, keys);
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

  // `!(depth >= 1)` and not `depth < 1`: a depth-less call's `NaN` must land here too. Before the
  // key array it recursed until the stack overflowed; `KEY_ARRAY_CAPACITY` now stops that
  // recursion at a leaf, which would turn a missing depth into a depth-128 search (`QE-G1`).
  if (!(depth >= 1)) {
    const infinity = Number.POSITIVE_INFINITY;
    const score = leafScore(position, 0, 0 - infinity, infinity, switches, counter);
    return { score, move: null, nodes: counter.nodes };
  }

  const moves = legalMoves(position);
  if (moves.length === 0) {
    return { score: isInCheck(position) ? 0 - MATE_SCORE : 0, move: null, nodes: counter.nodes };
  }

  const rootKey = keys[0] as bigint;
  const slot = switches.table ? probeTable(rootKey) : -1;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  const rootMoves = ordered(moves, 0, switches, killers, hashMove);
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
  });
}
