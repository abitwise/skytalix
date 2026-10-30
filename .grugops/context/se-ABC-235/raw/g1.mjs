// G1 per-row compare (scratch): every puzzle row's chosen move, depth and nodes, ADR-0027 mode.
// usage: node g1.mjs <treeDir>
import { readFileSync } from "node:fs";
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove } = await import(`${tree}/src/engine.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const { PUZZLES } = await import(`${tree}/src/puzzle-corpus.ts`);
const cfg = JSON.parse(readFileSync(`${tree}/src/puzzle-suite.baseline.json`, "utf8"));
for (const pz of PUZZLES) {
  const c = chooseMove(parseFen(pz.fen), { budgetMs: cfg.budgetMs, now: virtualClock(cfg.stepMs) });
  console.log(JSON.stringify({ name: pz.name, move: c ? `${c.move.from}-${c.move.to}-${c.move.promotion}` : null, score: c?.score, depth: c?.depth, nodes: c?.nodes }));
}
