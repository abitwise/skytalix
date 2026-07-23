/**
 * Perft — the correctness proof for the whole move generator (RISK-001).
 *
 * `perft(position, depth)` counts the leaf nodes of the LEGAL move tree at a fixed depth.
 * A move-generation bug does not crash; it silently miscounts, and comparing that count
 * against the chess world's published values for standard positions is what turns "the
 * rules look right" into "the rules are right". `perftDivide` splits the count by first
 * move, the standard tool for bisecting which subtree is wrong.
 *
 * This is the classic perft formulation (a leaf at depth 0 returns 1 without generating).
 * As the ABC-008 spike documented, the resulting nodes/sec figure is INFLATED relative to
 * an engine's real throughput because most counted nodes are free leaves — the perft-bench
 * harness prints the rate with that caveat, and NFR-001 is read against it accordingly.
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { BISHOP, KNIGHT, type Position, QUEEN, ROOK, squareName } from "./position.ts";

/** Leaf nodes of the legal move tree at `depth`. `perft(_, 0)` is 1 by definition. */
export function perft(position: Position, depth: number): number {
  if (depth === 0) return 1;

  let nodes = 0;
  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);
    nodes += perft(position, depth - 1);
    unmakeMove(position, move, undo);
  }
  return nodes;
}

const PROMOTION_LETTER: Readonly<Record<number, string>> = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n",
};

/**
 * Long algebraic coordinate label for a move, e.g. `e2e4`, `e7e8q`. The promotion suffix falls
 * out of the table lookup: a non-promotion move carries `promotion` EMPTY, which has no letter,
 * so nothing is appended. Deliberately NOT SAN (`O-O`, `e8=Q`) — that is EPIC-003; divide only
 * needs an unambiguous move key.
 */
function moveLabel(move: Move): string {
  return `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTER[move.promotion] ?? ""}`;
}

export interface DivideEntry {
  /** The first move, in long algebraic coordinate notation. */
  readonly move: string;
  /** perft(depth - 1) of the position after that first move — the size of its subtree. */
  readonly nodes: number;
}

/**
 * Per-first-move perft breakdown at `depth` (depth >= 1). Each entry's `nodes` is the subtree
 * size after that move; the entries sum to `perft(position, depth)`. Bisect a wrong total by
 * comparing this against a reference engine's divide and descending into the move that differs.
 */
export function perftDivide(position: Position, depth: number): DivideEntry[] {
  const entries: DivideEntry[] = [];
  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);
    entries.push({ move: moveLabel(move), nodes: perft(position, depth - 1) });
    unmakeMove(position, move, undo);
  }
  return entries;
}
