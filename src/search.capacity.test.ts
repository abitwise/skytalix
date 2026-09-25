/**
 * ABC-122 `A6` — `src/search.ts`'s `ply >= KEY_ARRAY_CAPACITY` guard, exercised DIRECTLY.
 *
 * Until this file the guard had no test of its own. It survived every mutant lane only because the
 * root depth guard (`ABC-081` decision 6a) keeps real recursion shallow: the deepest completed
 * iteration was measured at 40, against a capacity of 128 (`secnfr-ABC-081`).
 *
 * HOW THE BOUNDARY IS REACHED, with no production line changed: two collaborators are mocked in
 * THIS FILE ONLY, so the real, shipped `search()` is driven 200 plies deep along one line.
 * - `legalMoves` offers the FIRST legal move only. Branching 1 makes a depth-200 search a chain
 *   of nodes rather than a tree. The line is the same in every run: from the start position,
 *   first-generated moves reach ply 210 with no mate or stalemate on the way (measured).
 * - `zobristKeyAfterMove` hands out a fresh key on every call. No position on the chain can
 *   repeat, and no table probe can hit. It is also the WRITE spy: the search calls it exactly
 *   once per `keys[ply + 1] = …` write.
 *
 * The depth, 200, is well above the capacity. So the root depth guard (`!(depth >= 1)`) is
 * neither relied on nor altered: it passes, and only the capacity guard can end the chain at
 * ply 128 with 72 plies of depth still unspent. Remove the guard, or weaken `>=` to `>`, and the
 * chain goes on past the key array. The count, the score or the run itself turns red.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { quiesce } from "./quiescence.ts";
import { KEY_ARRAY_CAPACITY, search } from "./search.ts";

const spy = vi.hoisted(() => ({ keyWrites: 0, nextKey: 1n << 60n }));

vi.mock("./legal.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./legal.ts")>();
  return { ...real, legalMoves: (position: Position) => real.legalMoves(position).slice(0, 1) };
});

vi.mock("./zobrist.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./zobrist.ts")>();
  return {
    ...real,
    zobristKeyAfterMove: () => {
      spy.keyWrites++;
      return spy.nextKey++;
    },
  };
});

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEPTH = 200;

/**
 * The oracle, built WITHOUT the search: walk the same line to ply `KEY_ARRAY_CAPACITY` and score
 * that position the way a leaf is scored — the full-window capture search. The window stays full
 * down a one-move chain. The capture nodes it enters are counted the way `search()` counts them.
 * The ply is even, so the root's score is this score un-negated.
 */
function leafAtCapacity(): { score: number; captureNodes: number } {
  const position = parseFen(START);
  for (let ply = 0; ply < KEY_ARRAY_CAPACITY; ply++) {
    makeMove(position, legalMoves(position)[0] as Move);
  }
  expect(gameStatus(position).result).toBe("in-progress");
  let captureNodes = 0;
  const infinity = Number.POSITIVE_INFINITY;
  const score = quiesce(position, 0 - infinity, infinity, 0, () => captureNodes++);
  return { score, captureNodes };
}

beforeEach(() => {
  spy.keyWrites = 0;
});

describe("ABC-122 A6: src/search.ts's KEY_ARRAY_CAPACITY guard, reached through search()", () => {
  it("ends a depth-200 line at ply 128 with a leaf's score: no child past it, no key written past it", () => {
    const leaf = leafAtCapacity();
    expect(leaf.score).not.toBe(0);
    spy.keyWrites = 0;
    const position = parseFen(START);

    const result = search(position, DEPTH);

    // Return value: exactly the leaf's score at the capacity, carried up the chain.
    expect(result.score).toBe(leaf.score);
    // Write spy: keys[1] … keys[128] and not one more. The array holds KEY_ARRAY_CAPACITY + 1.
    expect(spy.keyWrites).toBe(KEY_ARRAY_CAPACITY);
    // Call-count spy: the root, one node per ply 1 … 128, and the leaf's own capture nodes. No
    // recursive call below the node at the capacity.
    expect(result.nodes).toBe(1 + KEY_ARRAY_CAPACITY + leaf.captureNodes);
    expect(toFen(position)).toBe(START);
  });
});
