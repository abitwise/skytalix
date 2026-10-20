/**
 * Difficulty levels — the MECHANISM (`ABC-087`). A level is data: a per-move budget and a
 * blunder rate. How a human picks one is `EPIC-006`'s (`ABC-101`), not this module's.
 *
 * The blunder construction is `ADR-0032`'s, and `src/engine.ts` and `src/search.ts` do not change
 * for it:
 * - ONE seeded draw per move decides, before any search, whether the move is a blunder.
 * - Not a blunder: the shipped `chooseMove`, unchanged. A level with rate 0 IS the shipped engine.
 * - A blunder: every legal root move is scored, in `legalMoves` order, as minus the shipped
 *   `chooseMove`'s score on its child, on one clock against one shared deadline. The STRICT
 *   second-best is played.
 *
 * The seed reaches the draw and nothing else (`ADR-0027` decision 1). The generator's state is
 * per level instance, never module-level (decision 2). The clock is passed in, the same way as
 * `EngineOptions.now`; this module never imports the virtual clock (decision 4).
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { type Clock, chooseMove, HARD_CEILING_MS } from "./engine.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { MATE_SCORE } from "./search.ts";

export interface Level {
  /** The per-move budget in milliseconds, passed to `chooseMove`. */
  readonly budgetMs: number;
  /** The probability, in [0, 1), that a move's draw calls for a blunder. */
  readonly blunderRate: number;
}

/**
 * The level table, keyed by the ordinals `ABC-101` publishes: integers 1-5, weakest to
 * strongest. `EPIC-006` reads it by those integers and attaches no meaning to them.
 *
 * `ADR-0045` D1-D2: the default (5) is the hardest, and it is the shipped engine at `NFR-004`'s
 * 3 s, never blundering, so `NFR-005`'s reading on `chooseMove` at 3 s is this level's reading.
 * Each step down costs time (about one ply at the top two steps, about two-thirds of one at the
 * bottom two) and doubles the blunder rate.
 * No level reaches `HARD_CEILING_MS`. No level claims an Elo number; `ABC-085` proves the
 * ordering, and these values are not tuned to it.
 */
export const LEVELS: Readonly<Record<1 | 2 | 3 | 4 | 5, Level>> = Object.freeze({
  1: Object.freeze({ budgetMs: 100, blunderRate: 0.4 }),
  2: Object.freeze({ budgetMs: 180, blunderRate: 0.2 }),
  3: Object.freeze({ budgetMs: 330, blunderRate: 0.1 }),
  4: Object.freeze({ budgetMs: 1_000, blunderRate: 0.05 }),
  5: Object.freeze({ budgetMs: 3_000, blunderRate: 0 }),
});

export const EASIEST_LEVEL = 1;
export const DEFAULT_LEVEL = 5;
export const HARDEST_LEVEL = 5;

/**
 * A small seeded generator (mulberry32): numbers in [0, 1), the same sequence for the same seed.
 * Its state is this closure's own. `ABC-085`'s seeded opening choice consumes the same generator.
 *
 * The seed is taken modulo 2^32. A seed that is not an integer throws: `NaN` would otherwise
 * collapse silently onto seed 0.
 */
export function seededRandom(seed: number): () => number {
  if (!Number.isInteger(seed)) {
    throw new RangeError(`seededRandom: seed must be an integer, got ${seed}`);
  }
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export interface ScoredMove {
  readonly move: Move;
  /** Minus the child's score, positive for the side to move at the root. */
  readonly score: number;
}

export interface LevelChoice {
  readonly move: Move;
  /**
   * `engine`: the draw did not call for a blunder, and the move is `chooseMove`'s.
   * `blunder`: the draw called for one, and the strict second-best was played.
   * `no-candidate`: the draw called for one, but the list holds fewer than three distinct scores,
   * so the first move of the best class was played.
   */
  readonly kind: "engine" | "blunder" | "no-candidate";
  /** The list the blunder used, in `legalMoves` order. `null` on an `engine` move. */
  readonly scored: readonly ScoredMove[] | null;
  /** `chooseMove`'s on an `engine` move; on a blunder, the deepest child and the summed nodes. */
  readonly depth: number;
  readonly nodes: number;
  /** `now()` at return minus `now()` at entry, on the caller's clock. */
  readonly elapsedMs: number;
}

export interface LevelOptions {
  /** Drives this instance's blunder draws, and nothing else. */
  readonly seed: number;
  /** The clock. Defaults to the wall clock; a deterministic-mode harness injects a virtual one. */
  readonly now?: Clock;
}

/**
 * A level instance: its own generator and its own clock. `null` ONLY when the position has no
 * legal move. The borrowed position is byte-identical on return.
 */
export function createLevel(
  level: Level,
  options: LevelOptions,
): (position: Position) => LevelChoice | null {
  const random = seededRandom(options.seed);
  const now = options.now ?? Date.now;
  return (position) => {
    if (random() >= level.blunderRate) {
      const choice = chooseMove(position, { budgetMs: level.budgetMs, now });
      if (choice === null) return null;
      const { move, depth, nodes, elapsedMs } = choice;
      return { move, kind: "engine", scored: null, depth, nodes, elapsedMs };
    }
    return blunder(position, Math.min(level.budgetMs, HARD_CEILING_MS), now);
  };
}

/**
 * `ADR-0032` decision 1. `budgetMs` is already clamped: `NFR-004`'s ceiling is enforced per
 * `chooseMove` call, which does not bound a SUM of calls, so the level layer clamps its own total.
 */
function blunder(position: Position, budgetMs: number, now: Clock): LevelChoice | null {
  const start = now();
  const moves = legalMoves(position);
  if (moves.length === 0) return null;

  const scored: ScoredMove[] = [];
  let depth = 0;
  let nodes = 0;
  moves.forEach((move, i) => {
    const undo = makeMove(position, move);
    try {
      // One shared deadline: an overrun by one child shortens the next. A non-positive budget
      // still runs the engine's unabortable depth 1.
      const deadline = start + (budgetMs * (i + 1)) / moves.length;
      const child = chooseMove(position, { budgetMs: deadline - now(), now });
      if (child === null) {
        const mated = gameStatus(position).reason === "checkmate";
        scored.push({ move, score: mated ? MATE_SCORE - 1 : 0 });
      } else {
        scored.push({ move, score: -child.score });
        depth = Math.max(depth, child.depth);
        nodes += child.nodes;
      }
    } finally {
      unmakeMove(position, move, undo);
    }
  });

  const scores = scored.map((s) => s.score);
  const best = Math.max(...scores);
  const worst = Math.min(...scores);
  // Decision 2: the highest score strictly between the best and the worst; ties to the first.
  let pick: ScoredMove | undefined;
  for (const entry of scored) {
    if (
      entry.score < best &&
      entry.score > worst &&
      (pick === undefined || entry.score > pick.score)
    ) {
      pick = entry;
    }
  }
  const played = pick ?? (scored.find((s) => s.score === best) as ScoredMove);
  return {
    move: played.move,
    kind: pick === undefined ? "no-candidate" : "blunder",
    scored,
    depth,
    nodes,
    elapsedMs: now() - start,
  };
}
