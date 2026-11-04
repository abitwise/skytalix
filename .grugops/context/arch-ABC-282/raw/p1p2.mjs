// arch-ABC-282 P1 (iteration growth) and P2 (A0 reference counts), per PREREG …5dbc040d.
// Usage: node p1p2.mjs <scratch-copy-root> <named.json> <positions.json>   (prints JSON lines)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [root, namedPath, posPath] = process.argv.slice(2);
const imp = (f) => import(pathToFileURL(join(root, "src", f)).href);
const { chooseMove } = await imp("engine.ts");
const { parseFen } = await imp("fen.ts");
const { legalMoves } = await imp("legal.ts");
const { squareName } = await imp("position.ts");
const { virtualClock } = await imp("virtual-clock.ts");

const named = JSON.parse(readFileSync(namedPath, "utf8")).map((p) => ({ name: p.name, fen: p.fen }));
const sampled = JSON.parse(readFileSync(posPath, "utf8")).skytalix.map((p) => ({ name: p.game, fen: p.fen }));
const K25 = [...named, ...sampled];
const mv = (m) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion ? `=${m.promotion}` : "") : "-");

for (const { name, fen } of K25) {
  const legal = legalMoves(parseFen(fen)).length;
  const rows = [];
  for (let d = 1; d <= 10; d++) {
    const c = chooseMove(parseFen(fen), { budgetMs: 60000, now: () => 0, maxDepth: d });
    rows.push({ d, nodes: c.nodes, move: mv(c.move), score: c.score, depth: c.depth });
    if (c.nodes > 4_000_000) break;
  }
  console.log(JSON.stringify({ probe: "P1", name, legal, rows }));
}
for (const name of ["kiwipete", "position-6"]) {
  const fen = named.find((p) => p.name === name).fen;
  for (const budgetMs of [50, 200]) {
    const c = chooseMove(parseFen(fen), { budgetMs, now: virtualClock(1) });
    console.log(
      JSON.stringify({ probe: "P2v", name, budgetMs, depth: c.depth, nodes: c.nodes, move: mv(c.move), score: c.score, elapsedMs: c.elapsedMs }),
    );
  }
}
