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
 * Deliberately absent, each owned elsewhere and each measurable on top of this: the
 * transposition table and in-tree repetition (ABC-081).
 *
 * MOVES ARE ORDERED (ABC-080) by ONE comparator, `orderMoves`, at every full-width node and at
 * the root: the hash move first, then captures and promotions most-valuable-victim first (the
 * shared `mvvLvaKey`, `ADR-0024`), then this ply's two killer moves, then the rest in generation
 * order. Ordering changes the WORK and never the VALUE: it only decides which refutation is found
 * first. The abortable copy in `src/engine.ts` consumes the same comparator and the same killer
 * table, so `ABC-078`'s identity sweep keeps comparing one algorithm (ruling `…f7e66060`, R1).
 * The hash-move arm is DORMANT until `ABC-081` builds a table: both recursions pass `null`.
 * Two TEST-ONLY doors reach the less-ordered searches `ABC-080`'s `A1`/`A3`/`A4` compare against:
 * `searchWithoutOrdering` (generation order) and `searchWithoutKillers` (MVV-LVA alone).
 *
 * Quiescence (ABC-079) is HERE, at the leaf: an in-progress leaf is scored by
 * `src/quiescence.ts`'s capture search rather than by the bare static evaluation, so the
 * horizon does not fall in the middle of a trade. Two TEST-ONLY doors reach the pre-quiescence
 * (bare) leaf: `searchWithoutQuiescence` (pruned) and `searchWithoutPruningOrQuiescence`
 * (unpruned).
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, type Position } from "./position.ts";
import { mvvLvaKey, quiesce } from "./quiescence.ts";

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
   * `searchWithoutKillers`. The hash-move arm has no switch: it is dormant until `ABC-081`.
   */
  readonly ordering: "none" | "mvv-lva" | "full";
}

/** The move list in the order `switches.ordering` asks for, at `ply`. */
function ordered(
  moves: readonly Move[],
  ply: number,
  switches: Switches,
  killers: KillerTable,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  return orderMoves(moves, switches.ordering === "full" ? killers.at(ply) : NO_KILLERS, null);
}

/**
 * The score of a position the search will not look past: its game state decides it, and
 * otherwise the quiescence search does (or, with quiescence off, the static evaluation).
 *
 * `gameStatus` is called at leaves only, which is what `ADR-0002` keeps `positionCounts`
 * optional for — a bare call is legitimate here and costs one legal-move generation, the same
 * one an interior node pays for its own move list. It catches the drawn terminal states an
 * empty move list does not (dead position by material, the seventy-five-move rule) as well as
 * mate and stalemate. Repetition is NOT detected: no counts map is passed, because in-tree
 * repetition is ABC-081's along with the key array it shares.
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
): number {
  counter.nodes++;

  if (depth <= 0) return leafScore(position, ply, alpha, beta, switches, counter);
  const prune = switches.prune;

  const moves = legalMoves(position);
  if (moves.length === 0) {
    // Mate or stalemate, decided from the move list already in hand. `-(MATE_SCORE - ply)` when
    // the king is attacked; otherwise EXACTLY 0 — stalemate is a draw, not a loss, and scoring
    // it as a mate is the classic negamax bug this project's `A5` exists to catch.
    return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;
  }

  let best = Number.NEGATIVE_INFINITY;
  for (const move of ordered(moves, ply, switches, killers)) {
    const undo = makeMove(position, move);
    const score =
      0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, ply + 1, switches, counter, killers);
    unmakeMove(position, move, undo);

    if (score > best) best = score;
    if (!prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
  }

  return best;
}

/**
 * Search the root: score every legal move to `depth - 1` and keep the best.
 *
 * The root window is infinite and the root never cuts off (`alpha < beta` always holds here),
 * so the returned score is exact and the returned move is the one that achieves it. The first
 * legal move is kept as the incumbent, so a root with any legal move always returns one.
 */
function searchRoot(position: Position, depth: number, switches: Switches): SearchResult {
  const counter: NodeCounter = { nodes: 1 };
  const prune = switches.prune;
  const killers = new KillerTable();

  if (depth < 1) {
    const infinity = Number.POSITIVE_INFINITY;
    const score = leafScore(position, 0, 0 - infinity, infinity, switches, counter);
    return { score, move: null, nodes: counter.nodes };
  }

  const moves = legalMoves(position);
  if (moves.length === 0) {
    return { score: isInCheck(position) ? 0 - MATE_SCORE : 0, move: null, nodes: counter.nodes };
  }

  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  const rootMoves = ordered(moves, 0, switches, killers);
  let bestMove = rootMoves[0] as Move;

  for (const move of rootMoves) {
    const undo = makeMove(position, move);
    const score =
      0 -
      negamax(
        position,
        depth - 1,
        Number.NEGATIVE_INFINITY,
        0 - alpha,
        1,
        switches,
        counter,
        killers,
      );
    unmakeMove(position, move, undo);

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (prune && best > alpha) alpha = best;
  }

  return { score: best, move: bestMove, nodes: counter.nodes };
}

/**
 * Alpha-beta negamax of `position` to `depth`, which the CALLER always supplies.
 *
 * The position is byte-identical on return: every move made is unmade (`A7`).
 */
export function search(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, { prune: true, quiescence: true, ordering: "full" });
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
  return searchRoot(position, depth, { prune: false, quiescence: true, ordering: "full" });
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
  return searchRoot(position, depth, { prune: true, quiescence: false, ordering: "full" });
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
  return searchRoot(position, depth, { prune: false, quiescence: false, ordering: "full" });
}

/**
 * TEST-ONLY. The shipped search with the move list in GENERATION ORDER — the pre-`ABC-080`
 * search exactly. It exists so `ABC-080`'s `A1` can assert ordering changes the work and not the
 * value, and `A3`/`A4` can count what it saved. Not an engine option; nothing in production calls
 * it (the ticket's test note 3).
 */
export function searchWithoutOrdering(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, { prune: true, quiescence: true, ordering: "none" });
}

/**
 * TEST-ONLY. The shipped search with MVV-LVA ordering but NO killer moves — `ABC-080` `A4`'s
 * second configuration, so the killers' own increment can be measured and, if it is nothing,
 * deleted. Not an engine option; nothing in production calls it.
 */
export function searchWithoutKillers(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, { prune: true, quiescence: true, ordering: "mvv-lva" });
}
