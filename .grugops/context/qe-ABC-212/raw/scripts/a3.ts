// ABC-212 A3 reading: levels 1-5 value identity, run once per tree (base and head).
// usage: node a3.ts <tree>   -> prints JSON lines
import { pathToFileURL } from "node:url";
const tree = process.argv[2];
const m = (p: string) => import(pathToFileURL(`${tree}/src/${p}`).href);
const { LEVELS, createLevel } = await m("levels.ts");
const { chooseMove } = await m("engine.ts");
const { virtualClock } = await m("virtual-clock.ts");
const { buildCorpus } = await m("evaluate.mirror-corpus.ts");
const { toFen, parseFen } = await m("fen.ts");
const { squareName } = await m("position.ts");
const spread = buildCorpus().filter((_: unknown, i: number) => i % 6 === 0).map((e: { position: unknown }) => toFen(e.position));
const fens: string[] = spread.slice(0, 10);
const mv = (x: { from: number; to: number; promotion: number; flags: number }) => `${squareName(x.from)}${squareName(x.to)}:${x.flags}:${x.promotion}`;
for (const id of [1, 2, 3, 4, 5]) {
  const level = LEVELS[id];
  const choose = createLevel(level, { seed: 1, now: virtualClock(level.budgetMs / 30) });
  fens.forEach((fen, i) => {
    const c = choose(parseFen(fen));
    console.log(JSON.stringify({ row: "createLevel", level: id, pos: i, move: c && mv(c.move), kind: c?.kind, depth: c?.depth, nodes: c?.nodes }));
  });
}
fens.forEach((fen, i) => {
  const c = chooseMove(parseFen(fen), { budgetMs: 3_000, now: virtualClock(100) });
  console.log(JSON.stringify({ row: "chooseMove3000", pos: i, move: c && mv(c.move), depth: c?.depth, nodes: c?.nodes, score: c?.score }));
});
