/**
 * PROBE, not product. A faithful copy of `src/search.ts`'s full-width recursion (`negamax` +
 * `searchRoot`) and of `src/engine.ts`'s deepening loop (`chooseMove`, warm table and killers
 * across iterations), with three switches added: `pvs`, `lmr` (reductions inside the PVS frame),
 * `lmrPlain` (reductions with a full-window re-search and no PVS). Everything else is imported
 * from `src/` unchanged. With every switch off it must reproduce `search()` score AND nodes —
 * `faithful` below checks that before any other number is trusted.
 *
 * LMR rule = ABC-121's scope: reduce one ply when remaining depth >= 3, move index >= 3 (0-based,
 * in the ordered list), the move neither captures nor promotes, the side to move is not in check,
 * and the move does not give check. No reduction at the root.
 */
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { isInCheck, legalMoves } from "../../../../src/legal.ts";
import type { Move } from "../../../../src/moves.ts";
import { EMPTY, type Position } from "../../../../src/position.ts";
import { quiesce } from "../../../../src/quiescence.ts";
import {
  KEY_ARRAY_CAPACITY,
  KillerTable,
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
import { zobristKey, zobristKeyAfterMove } from "../../../../src/zobrist.ts";

export interface Cfg {
  pvs: boolean;
  lmr: boolean;
  lmrPlain: boolean;
  table: boolean;
  /** `searchWithoutOrdering`'s generation order (table off by the caller, as that door does). */
  unordered?: boolean;
}
export const BASE: Cfg = { pvs: false, lmr: false, lmrPlain: false, table: true };

export interface Stats {
  reductions: number;
  lmrReSearches: number;
  pvsReSearches: number;
  nullWindows: number;
}

interface St {
  cfg: Cfg;
  nodes: number;
  killers: KillerTable;
  keys: BigUint64Array;
  deadline: number;
  nextCheck: number;
  stats: Stats;
}

const ABORT = Symbol("abort");
function count(st: St): void {
  st.nodes++;
  if (st.nodes >= st.nextCheck) {
    st.nextCheck = st.nodes + 1024;
    if (performance.now() >= st.deadline) throw ABORT;
  }
}

function leafScore(position: Position, ply: number, alpha: number, beta: number, st: St): number {
  const status = gameStatus(position);
  if (status.result === "in-progress") return quiesce(position, alpha, beta, 0, () => count(st));
  if (status.reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}

const quiet = (m: Move): boolean => m.captured === EMPTY && m.promotion === EMPTY;

function negamax(
  position: Position,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  st: St,
): number {
  count(st);
  const keys = st.keys;
  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;
  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) return leafScore(position, ply, alpha, beta, st);
  const key = keys[ply] as bigint;
  const cfg = st.cfg;
  const slot = cfg.table ? probeTable(key) : -1;
  if (slot !== -1) {
    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) return settled;
  }
  const moves = legalMoves(position);
  if (moves.length === 0) return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;

  const reducing = (cfg.lmr || cfg.lmrPlain) && depth >= 3;
  const nodeInCheck = reducing ? isInCheck(position) : false;
  const alphaIn = alpha;
  const hashMove = slot === -1 ? null : entryMove(slot, moves);
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0] as Move;
  const list = cfg.unordered ? moves : orderMoves(moves, st.killers.at(ply), hashMove);
  for (let i = 0; i < list.length; i++) {
    const move = list[i] as Move;
    const undo = makeMove(position, move);
    let score: number;
    try {
      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      const r = reducing && i >= 3 && quiet(move) && !nodeInCheck && !isInCheck(position) ? 1 : 0;
      if (r) st.stats.reductions++;
      if (i > 0 && cfg.pvs && alpha > Number.NEGATIVE_INFINITY) {
        st.stats.nullWindows++;
        const lr = cfg.lmr ? r : 0;
        score = 0 - negamax(position, depth - 1 - lr, 0 - alpha - 1, 0 - alpha, ply + 1, st);
        if (score > alpha && lr > 0) {
          st.stats.lmrReSearches++;
          score = 0 - negamax(position, depth - 1, 0 - alpha - 1, 0 - alpha, ply + 1, st);
        }
        if (score > alpha && score < beta) {
          st.stats.pvsReSearches++;
          score = 0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, ply + 1, st);
        }
      } else if (i > 0 && cfg.lmrPlain && r > 0) {
        score = 0 - negamax(position, depth - 2, 0 - beta, 0 - alpha, ply + 1, st);
        if (score > alpha) {
          st.stats.lmrReSearches++;
          score = 0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, ply + 1, st);
        }
      } else {
        score = 0 - negamax(position, depth - 1, 0 - beta, 0 - alpha, ply + 1, st);
      }
    } finally {
      unmakeMove(position, move, undo);
    }
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      st.killers.record(ply, move);
      break;
    }
  }
  if (cfg.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}

function rootIteration(
  position: Position,
  moves: readonly Move[],
  depth: number,
  st: St,
): { move: Move; score: number } {
  const rootKey = st.keys[0] as bigint;
  const slot = st.cfg.table ? probeTable(rootKey) : -1;
  const rootMoves = st.cfg.unordered
    ? moves
    : orderMoves(moves, st.killers.at(0), slot === -1 ? null : entryMove(slot, moves));
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = rootMoves[0] as Move;
  for (let i = 0; i < rootMoves.length; i++) {
    const move = rootMoves[i] as Move;
    const undo = makeMove(position, move);
    let score: number;
    try {
      st.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      if (i > 0 && st.cfg.pvs && alpha > Number.NEGATIVE_INFINITY) {
        st.stats.nullWindows++;
        score = 0 - negamax(position, depth - 1, 0 - alpha - 1, 0 - alpha, 1, st);
        if (score > alpha) {
          st.stats.pvsReSearches++;
          score = 0 - negamax(position, depth - 1, Number.NEGATIVE_INFINITY, 0 - alpha, 1, st);
        }
      } else {
        score = 0 - negamax(position, depth - 1, Number.NEGATIVE_INFINITY, 0 - alpha, 1, st);
      }
    } finally {
      unmakeMove(position, move, undo);
    }
    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
  }
  if (st.cfg.table) storeEntry(rootKey, depth, BOUND_EXACT, best, 0, bestMove);
  return { move: bestMove, score: best };
}

function freshState(position: Position, cfg: Cfg, deadline = Number.POSITIVE_INFINITY): St {
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[0] = zobristKey(position);
  if (cfg.table) clearTable();
  return {
    cfg,
    nodes: 1,
    killers: new KillerTable(),
    keys,
    deadline,
    nextCheck: Number.POSITIVE_INFINITY,
    stats: { reductions: 0, lmrReSearches: 0, pvsReSearches: 0, nullWindows: 0 },
  };
}

export interface Result {
  score: number;
  move: Move | null;
  nodes: number;
  stats: Stats;
}

/** `search(position, depth)` shape: one fixed-depth call, cold table, fresh killers. */
export function fixed(position: Position, depth: number, cfg: Cfg): Result {
  const st = freshState(position, cfg);
  const moves = legalMoves(position);
  if (moves.length === 0)
    return { score: isInCheck(position) ? -MATE_SCORE : 0, move: null, nodes: 1, stats: st.stats };
  const r = rootIteration(position, moves, depth, st);
  return { ...r, nodes: st.nodes, stats: st.stats };
}

/** `chooseMove` shape: iterations 1..maxDepth (or until `budgetMs`), warm table and killers. */
export function deepen(
  position: Position,
  cfg: Cfg,
  maxDepth: number,
  budgetMs = Number.POSITIVE_INFINITY,
): Result & { depth: number; perIteration: Array<[number, number, number]> } {
  const t0 = performance.now();
  const st = freshState(position, cfg, t0 + budgetMs);
  st.nodes = 0;
  const moves = legalMoves(position);
  let best = rootIteration(position, moves, 1, st);
  let reached = 1;
  const per: Array<[number, number, number]> = [[1, st.nodes, Math.round(performance.now() - t0)]];
  st.nextCheck = st.nodes + 1024;
  for (let it = 2; it <= maxDepth && performance.now() < st.deadline; it++) {
    try {
      best = rootIteration(position, moves, it, st);
    } catch (e) {
      if (e === ABORT) break;
      throw e;
    }
    reached = it;
    per.push([it, st.nodes, Math.round(performance.now() - t0)]);
  }
  return { ...best, nodes: st.nodes, stats: st.stats, depth: reached, perIteration: per };
}
