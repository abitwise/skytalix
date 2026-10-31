// qe-ABC-245 CENSUS (informative; scratch only: copied into the plant tree P's src/, never into the repository). Re-reads
// the SE's R1 census line for the ABC-245 row: level 1's 100 ms, forced, seed 1, virtualClock(10), on the committed
// fixture (read by regex from levels.test.ts, not transcribed). Records each child chooseMove's handed budgetMs and the
// depth it returned, the level call's virtual elapsed, and the clock reads per level call. Prints one JSON line.
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { parseFen } from "./fen.ts";
import { newGame, playMove, repetitionKeyHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { createLevel, type Level, LEVELS } from "./levels.ts";
import { squareName } from "./position.ts";
import { virtualClock } from "./virtual-clock.ts";

const calls = vi.hoisted(() => [] as { budgetMs: number; depth: number; score: number }[]);
vi.mock("./engine.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./engine.ts")>();
  return {
    ...real,
    chooseMove: (...args: Parameters<typeof real.chooseMove>) => {
      const r = real.chooseMove(...args);
      calls.push({ budgetMs: args[1].budgetMs, depth: r?.depth ?? -1, score: r?.score ?? Number.NaN });
      return r;
    },
  };
});
const { trimPriorKeys } = await import("./engine.ts");

const src = readFileSync(new URL("./levels.test.ts", import.meta.url), "utf8");
const FEN = (/const FAR_FEN = "([^"]+)";/.exec(src) as RegExpExecArray)[1] as string;
const block = (/const FAR_MOVES = \[([\s\S]*?)\]\.join\(" "\);/.exec(src) as RegExpExecArray)[1] as string;
const MOVES = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]).join(" ").split(" ");
const label = (m: { from: number; to: number }) => `${squareName(m.from)}${squareName(m.to)}`;

describe("qe-ABC-245 census", () => {
  it("reads the handed child budgets at step 10", () => {
    const game = newGame(FEN);
    for (const t of MOVES) playMove(game, legalMoves(game.position).find((m) => label(m) === t) as never);
    const prior = trimPriorKeys(repetitionKeyHistory(game), game.position.halfmoveClock);
    for (const step of [10, 1]) {
      calls.length = 0;
      let reads = 0;
      const inner = virtualClock(step);
      const now = () => {
        reads++;
        return inner();
      };
      const forced: Level = { budgetMs: LEVELS[1].budgetMs, blunderRate: 1 };
      const choice = createLevel(forced, { seed: 1, now })(parseFen(game.position ? toFenSafe(game) : FEN), prior);
      const repeat = choice?.scored?.find((s) => label(s.move) === "d7e8")?.score;
      console.log(
        `QE245-CENSUS ${JSON.stringify({ step, legal: legalMoves(game.position).length, children: calls.length, budgets: calls.map((c) => c.budgetMs), depths: calls.map((c) => c.depth), repeat, played: choice && label(choice.move), elapsedVirtualMs: choice?.elapsedMs, clockReadsTotal: reads, budgetIntervalsPerLevelCall: Math.ceil(100 / step) })}`,
      );
      expect(repeat).toBe(0);
    }
  });
});

import { toFen } from "./fen.ts";
function toFenSafe(game: { position: Parameters<typeof toFen>[0] }): string {
  return toFen(game.position);
}
