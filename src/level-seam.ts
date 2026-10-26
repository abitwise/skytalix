/**
 * `ABC-101` — a difficulty level as the `src/turn-loop.ts` `EngineSeam`: `createLevel` (`ABC-087`)
 * wrapped the way `createEngine` wraps `chooseMove` (`src/engine.ts`). Neither `EngineSeam` nor
 * `src/levels.ts` changes for it.
 *
 * The table is read only by an OWN key (`Object.hasOwn`): `LEVELS["constructor"]` is a prototype
 * member that `createLevel` would accept without throwing (Security/NFR's `ABC-087` ruling 7).
 *
 * `ABC-209` (`ADR-0025` amended Decision 4 (d)): the seam is the CLI's game owner. It holds one
 * tracker for the session, keyed on the game's start and its moves in coordinates, so the
 * transposition table is kept while the game continues and cleared at `new` (`ABC-046`) and
 * `undo`. The token is per tracker call, not per instance, because `new` reuses this seam.
 */

import { createLevel, LEVELS, type LevelOptions } from "./levels.ts";
import { squareName } from "./position.ts";
import { createGameTracker } from "./transposition.ts";
import type { EngineSeam } from "./turn-loop.ts";

export function createLevelSeam(level: number, options: LevelOptions): EngineSeam {
  if (!Object.hasOwn(LEVELS, level)) throw new RangeError(`level-seam: no level ${level}`);
  const choose = createLevel(LEVELS[level as keyof typeof LEVELS], options);
  const track = createGameTracker();
  return async (history) => {
    const moves = history.moves.map(
      (move) => `${squareName(move.from)}${squareName(move.to)}${move.promotion || ""}`,
    );
    const choice = choose(history.position, track(history.initialFen, moves));
    if (choice === null) throw new Error("engine: asked to move in a position with no legal move");
    return choice.move;
  };
}
