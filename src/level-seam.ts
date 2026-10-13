/**
 * `ABC-101` — a difficulty level as the `src/turn-loop.ts` `EngineSeam`: `createLevel` (`ABC-087`)
 * wrapped the way `createEngine` wraps `chooseMove` (`src/engine.ts`). Neither `EngineSeam` nor
 * `src/levels.ts` changes for it.
 *
 * The table is read only by an OWN key (`Object.hasOwn`): `LEVELS["constructor"]` is a prototype
 * member that `createLevel` would accept without throwing (Security/NFR's `ABC-087` ruling 7).
 */

import { createLevel, LEVELS, type LevelOptions } from "./levels.ts";
import type { EngineSeam } from "./turn-loop.ts";

export function createLevelSeam(level: number, options: LevelOptions): EngineSeam {
  if (!Object.hasOwn(LEVELS, level)) throw new RangeError(`level-seam: no level ${level}`);
  const choose = createLevel(LEVELS[level as keyof typeof LEVELS], options);
  return async (history) => {
    const choice = choose(history.position);
    if (choice === null) throw new Error("engine: asked to move in a position with no legal move");
    return choice.move;
  };
}
