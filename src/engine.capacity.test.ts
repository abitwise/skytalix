/**
 * ABC-122 `A8` — `src/engine.ts`'s OWN `ply >= KEY_ARRAY_CAPACITY` guard, exercised DIRECTLY.
 *
 * This is `A6`'s row (`src/search.capacity.test.ts`) repeated against the engine's independent
 * guard instance, and reached through the real, shipped `chooseMove`. No production line changed.
 * The same two collaborators are mocked in THIS FILE ONLY:
 * - `legalMoves` offers the first legal move only, so each iteration of the deepening is one line.
 * - `zobristKeyAfterMove` hands out a fresh key per call, so nothing repeats and no probe hits
 *   below the root.
 *
 * The injected clock lets the deepening run 130 iterations. Iteration 129 and beyond reach ply
 * 128 with depth still unspent, so only the capacity guard can stop them there. No depth guard is
 * involved: the engine takes no depth.
 *
 * Two spies:
 * - The CALL spy is `repeatsInPath`, which the engine imports from `src/search.ts` and calls once
 *   on entry to every full-width node, with that node's ply.
 * - The WRITE spy is `zobristKeyAfterMove`, called once per `keys[ply + 1] = …` write. It is
 *   split per iteration at each iteration's ply-1 entry. The root's keys[1] write lands just before
 *   that entry, so it opens its own iteration's count.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeMove } from "./apply.ts";
import { chooseMove } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { quiesce } from "./quiescence.ts";
import { KEY_ARRAY_CAPACITY } from "./search.ts";

const spy = vi.hoisted(() => ({
  nextKey: 1n << 60n,
  deepestPly: 0,
  keyWrites: 0,
  /** `keyWrites` at each iteration's ply-1 entry — that iteration's root write included. */
  iterationStarts: [] as number[],
}));

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

vi.mock("./search.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./search.ts")>();
  return {
    ...real,
    repeatsInPath: (keys: BigUint64Array, ply: number, halfmoveClock: number) => {
      if (ply === 1) spy.iterationStarts.push(spy.keyWrites);
      spy.deepestPly = Math.max(spy.deepestPly, ply);
      return real.repeatsInPath(keys, ply, halfmoveClock);
    },
  };
});

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ITERATIONS = KEY_ARRAY_CAPACITY + 2;

/** `A6`'s oracle: the same line walked to ply 128 and scored as a leaf is, without the engine. */
function leafScoreAtCapacity(): number {
  const position = parseFen(START);
  for (let ply = 0; ply < KEY_ARRAY_CAPACITY; ply++) {
    makeMove(position, legalMoves(position)[0] as Move);
  }
  expect(gameStatus(position).result).toBe("in-progress");
  const infinity = Number.POSITIVE_INFINITY;
  return quiesce(position, 0 - infinity, infinity, 0, () => {});
}

/** The key writes each iteration made, keys[1] included, the last iteration up to the return. */
function writesPerIteration(): number[] {
  const starts = spy.iterationStarts;
  return starts.map((start, i) => (starts[i + 1] ?? spy.keyWrites + 1) - start);
}

beforeEach(() => {
  Object.assign(spy, { deepestPly: 0, keyWrites: 0, iterationStarts: [] });
});

describe("ABC-122 A8: src/engine.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove()", () => {
  it("ends every line at ply 128 with a leaf's score once the deepening passes it: no node or key past it", () => {
    const expected = leafScoreAtCapacity();
    expect(expected).not.toBe(0);
    const position = parseFen(START);

    // Virtual time: frozen until the deepening has STARTED `ITERATIONS` iterations, then spent.
    const now = () => (spy.iterationStarts.length < ITERATIONS ? 0 : Number.MAX_SAFE_INTEGER);
    const choice = chooseMove(position, { budgetMs: 1_000, now });

    // The deepening really went past the capacity, so remaining depth was left at ply 128.
    expect(choice?.depth).toBeGreaterThan(KEY_ARRAY_CAPACITY);
    // Return value: the deepest completed iteration scores exactly the leaf at the capacity.
    expect(choice?.score).toBe(expected);
    // Call spy: a node AT the capacity was entered, and none below it.
    expect(spy.deepestPly).toBe(KEY_ARRAY_CAPACITY);
    // Write spy: at most keys[1] … keys[128] in any one iteration. The array holds 129.
    expect(Math.max(...writesPerIteration())).toBe(KEY_ARRAY_CAPACITY);
    expect(toFen(position)).toBe(START);
  });
});
