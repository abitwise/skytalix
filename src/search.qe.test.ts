/**
 * ABC-077 — QE gap-closing tests. Added at the `In Review` QE hop, not by the implementer.
 *
 * `src/search.test.ts` answers `A1`-`A7` as written. These three tests exist because mutation
 * testing at the QE hop found two things the delivered suite does not notice.
 *
 * 1. **`A6` was bypassable.** Its source-regex and `Function.length` assertions all pass while
 *    the module carries a real default depth: `searchRoot(position, depth ?? 4, true)` keeps the
 *    exports set, keeps `search.length === 2`, contains no `=` for the regex to find, passes
 *    `tsc` and `biome` — and makes `search(position)` return a move at a FIXED DEPTH 4 with no
 *    caller-supplied depth. That is exactly the fixed-depth per-move budget `RISK-002` forbids.
 *    `QE-G1` asserts the BEHAVIOUR instead of the source text: with the depth argument omitted,
 *    no exported function may yield a move.
 *
 * 2. **Nothing in this repository asserts the material values the search maximises.** `A1` is a
 *    differential oracle and both its sides call the same `evaluate()`, so it is blind to the
 *    evaluation by construction — and `ABC-076`'s own guard was found partly blind to its
 *    piece-square tables. Measured at this hop: swapping `PIECE_VALUE`'s ROOK and QUEEN entries
 *    (a rook worth more than a queen) left ALL 963 tests in the repository green. `QE-G2` and
 *    `QE-G3` close the coarsest part of that: the search's CHOICE must prefer the bigger piece
 *    and must not throw a queen away.
 *
 * These are SANITY nets on the search's choice, not a correct-evaluation proof. They would still
 * pass under a badly tuned evaluation; they fail under an inverted or value-scrambled one.
 */

import { describe, expect, it } from "vitest";
import { parseFen } from "./fen.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { type SearchResult, search, searchWithoutPruning } from "./search.ts";

const label = (move: Move | null): string =>
  move === null ? "null" : `${squareName(move.from)}${squareName(move.to)}`;

// ---------------------------------------------------------------------------
// QE-G1 — A6 asserted by behaviour. A regex cannot see `depth ?? 4`; this can.
// ---------------------------------------------------------------------------

describe("QE-G1 — omitting the depth argument yields no move (RISK-002, by behaviour)", () => {
  // Bare kings, on purpose: whatever an omitted depth does, it does it on the cheapest board
  // there is. The start position costs ~300 ms per call here and buys nothing extra.
  const BARE_KINGS = "7k/8/8/8/8/8/8/K7 w - - 0 1";

  /** The call TypeScript forbids and JavaScript allows — which is the one a default would serve. */
  type DepthlessCall = (position: Position) => SearchResult;

  /** The chosen move when the depth argument is omitted, or `null` when the call cannot deliver one. */
  function moveWithoutDepth(fn: (position: Position, depth: number) => SearchResult): Move | null {
    try {
      return (fn as unknown as DepthlessCall)(parseFen(BARE_KINGS)).move;
    } catch {
      // A module with no default cannot answer "what move should I play"; throwing is a pass.
      return null;
    }
  }

  it("search(position) — with no depth — cannot return a move", () => {
    expect(label(moveWithoutDepth(search))).toBe("null");
  });

  it("searchWithoutPruning(position) — with no depth — cannot return a move", () => {
    expect(label(moveWithoutDepth(searchWithoutPruning))).toBe("null");
  });
});

// ---------------------------------------------------------------------------
// QE-G2/G3 — the search's CHOICE, where A1's differential oracle is blind.
// ---------------------------------------------------------------------------

describe("QE-G2 — the chosen move tracks the material the evaluation says is there", () => {
  /**
   * White Nd4 forks Rb5 and Qf5, which defend each other along the fifth rank: Nxf5 wins the
   * queen for the knight, Nxb5 wins only the rook for it. Both captures are recaptured at once,
   * so depth 2 settles it and no other line competes.
   */
  const FORK = "7k/8/8/1r3q2/3N4/8/8/7K w - - 0 1";

  it("takes the queen, not the rook, from a knight fork at depth 2", () => {
    const result = search(parseFen(FORK), 2);

    expect(label(result.move)).toBe("d4f5");
    // White is a knight down for a rook afterwards (-500), not for a queen (-900). Bounds, not a
    // total: the piece-square terms move these by tens, and only the sign of the choice matters.
    expect(result.score).toBeGreaterThan(-700);
    expect(result.score).toBeLessThan(-300);
  });

  it("still takes the queen at depth 3", () => {
    expect(label(search(parseFen(FORK), 3).move)).toBe("d4f5");
  });
});

describe("QE-G3 — the search does not give the queen away for a pawn", () => {
  /** Qd1 can take the d5 pawn; c6 recaptures. White Kh1, black Kh8 — nothing else is going on. */
  const POISONED_PAWN = "7k/8/2p5/3p4/8/8/8/3Q3K w - - 0 1";

  for (const depth of [2, 3]) {
    it(`declines the pawn that costs the queen, at depth ${depth}`, () => {
      const result = search(parseFen(POISONED_PAWN), depth);

      expect(label(result.move)).not.toBe("d1d5");
      // The queen (900) is still on the board against two pawns (200): comfortably positive.
      expect(result.score).toBeGreaterThan(400);
    });
  }
});
