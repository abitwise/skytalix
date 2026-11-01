import { it } from "vitest";
import { chooseMove, HARD_CEILING_MS, trimPriorKeys } from "./engine.ts";
import { makeMove } from "./apply.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { parseFen, toFen } from "./fen.ts";
import { keyHistory, newGame, playMove } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { squareName } from "./position.ts";
import { virtualClock } from "./virtual-clock.ts";
import { zobristKey } from "./zobrist.ts";
const label = (m: any) => `${squareName(m.from)}${squareName(m.to)}`;
const fd = (d: number) => ({ budgetMs: HARD_CEILING_MS, now: virtualClock(1), maxDepth: d });
it("probe", async () => {
  const game = newGame("6k1/RR3ppp/8/4q3/8/7P/PP4PK/1N6 w - - 0 1");
  for (const t of "h2h1 e5e1 h1h2 e1e5 h2g1 e5d4 g1f1 d4f6".split(" ")) {
    const p = parseCoordinateMove(game.position, t); if (p.outcome !== "move") throw new Error(t); playMove(game, p.move);
  }
  const root = toFen(game.position);
  const prior = trimPriorKeys(keyHistory(game), game.position.halfmoveClock);
  const line = parseFen(root); const path = [zobristKey(line)];
  for (const t of ["f1g1", "f6d4", "g1h2", "d4e5"]) { makeMove(line, legalMoves(line).find((m) => label(m) === t)!); path.push(zobristKey(line)); }
  const X = path[4];
  const out: any = { root, priorLen: prior.length, hmc: game.position.halfmoveClock,
    priorPositionsOfX: prior.map((k, i) => (k === X ? i : -1)).filter((i) => i >= 0),
    xOnPathBefore: path.slice(0, 4).filter((k) => k === X).length,
    pathDistinct: new Set(path.slice(0, 4).map(String)).size };
  const fig = (c: any) => c && { move: label(c.move), score: c.score, depth: c.depth, nodes: c.nodes };
  for (const d of [3, 4, 5, 6]) {
    out[`d${d}`] = {
      keys: fig(chooseMove(parseFen(root), { ...fd(d), priorKeys: prior })),
      withheld: fig(chooseMove(parseFen(root), fd(d))),
      onceOnly: fig(chooseMove(parseFen(root), { ...fd(d), priorKeys: prior.slice(prior.indexOf(X) + 1) })),
    };
  }
  (await import("node:fs")).writeFileSync("/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-249/probe.json", JSON.stringify(out, null, 1));
});
