/**
 * `ABC-101` — a difficulty level as the `src/turn-loop.ts` `EngineSeam`: `createLevel` (`ABC-087`)
 * wrapped the way `createEngine` wraps `chooseMove` (`src/engine.ts`). Neither `EngineSeam` nor
 * `src/levels.ts` changes for it.
 *
 * The table is read only by an OWN key (`Object.hasOwn`): `LEVELS["constructor"]` is a prototype
 * member that `createLevel` would accept without throwing (Security/NFR's `ABC-087` ruling 7).
 *
 * `ABC-230` (`ADR-0054` decision 2): the game's earlier positions reach the search. `keyHistory` is
 * INJECTED (`src/history.ts`'s, by `cli.ts`), so this module holds no runtime import of
 * `history.ts` and `ADR-0011`'s licence set is unchanged. Its list is trimmed by `trimPriorKeys`.
 * Absent, the level is handed no prior keys, as before.
 */

import { trimPriorKeys } from "./engine.ts";
import { createLevel, LEVELS, type LevelOptions } from "./levels.ts";
import type { EngineSeam } from "./turn-loop.ts";

type SeamGame = Parameters<EngineSeam>[0];

export function createLevelSeam(
  level: number,
  options: LevelOptions,
  keyHistory?: (game: SeamGame) => readonly bigint[],
): EngineSeam {
  if (!Object.hasOwn(LEVELS, level)) throw new RangeError(`level-seam: no level ${level}`);
  const choose = createLevel(LEVELS[level as keyof typeof LEVELS], options);
  return async (history) => {
    const priorKeys =
      keyHistory === undefined
        ? undefined
        : trimPriorKeys(keyHistory(history), history.position.halfmoveClock);
    const choice = choose(history.position, priorKeys);
    if (choice === null) throw new Error("engine: asked to move in a position with no legal move");
    return choice.move;
  };
}
