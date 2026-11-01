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

import { createUndoStack, makeMovePacked, unmakeMovePacked } from "./apply.ts";
import { legalMovesPacked } from "./legal.ts";
import { packedFrom, packedPromotion, packedTo } from "./moves.ts";
import { BISHOP, KNIGHT, type Position, QUEEN, ROOK, squareName } from "./position.ts";

/**
 * ABC-250 (ADR-0055 O1-b part 1): perft runs on the PACKED path. Each ply's legal moves are written
 * into one preallocated move stack, the child's window starting where the parent's list ends, and
 * each ply's undo state into one preallocated undo stack. Both are fixed-size and reused (`G7`,
 * growth 0): `MAX_PLY` plies and `MAX_PLY * 256` move slots (≈ 128 KiB); a deeper perft, or a list
 * run past the end, throws a RangeError rather than truncating. Not re-entrant: `perftDivide` calls
 * the inner walk, never `perft`, inside its loop.
 */
const MAX_PLY = 128;
const moveStack = new Int32Array(MAX_PLY * 256);
const undoStack = createUndoStack(MAX_PLY);

function perftFrom(position: Position, depth: number, ply: number, start: number): number {
  if (depth === 0) return 1;

  const end = legalMovesPacked(position, moveStack, start);
  let nodes = 0;
  for (let i = start; i < end; i++) {
    const move = moveStack[i] as number;
    makeMovePacked(position, move, undoStack, ply);
    nodes += perftFrom(position, depth - 1, ply + 1, end);
    unmakeMovePacked(position, move, undoStack, ply);
  }
  return nodes;
}

function assertDepth(depth: number): void {
  if (depth > MAX_PLY) throw new RangeError(`perft depth ${depth} exceeds ${MAX_PLY} plies`);
}

/** Leaf nodes of the legal move tree at `depth`. `perft(_, 0)` is 1 by definition. */
export function perft(position: Position, depth: number): number {
  assertDepth(depth);
  return perftFrom(position, depth, 0, 0);
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
function moveLabel(move: number): string {
  return `${squareName(packedFrom(move))}${squareName(packedTo(move))}${PROMOTION_LETTER[packedPromotion(move)] ?? ""}`;
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
  assertDepth(depth);
  const entries: DivideEntry[] = [];
  const end = legalMovesPacked(position, moveStack, 0);
  for (let i = 0; i < end; i++) {
    const move = moveStack[i] as number;
    makeMovePacked(position, move, undoStack, 0);
    entries.push({ move: moveLabel(move), nodes: perftFrom(position, depth - 1, 1, end) });
    unmakeMovePacked(position, move, undoStack, 0);
  }
  return entries;
}
