// arch-ABC-282 P3, per PREREG …5dbc040d: the prototype rule on K25 × H ∈ {25, 50, 100, 200, 400}, virtualClock(1).
// Usage: node p3.mjs <base-copy-root> <proto-copy-root> <named.json> <positions.json> <b>   (prints JSON lines)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [baseRoot, protoRoot, namedPath, posPath, bText] = process.argv.slice(2);
const b = Number(bText);
const imp = (root, f) => import(pathToFileURL(join(root, "src", f)).href);
const base = await imp(baseRoot, "engine.ts");
const proto = await imp(protoRoot, "engine.ts");
const { parseFen } = await imp(baseRoot, "fen.ts");
const { squareName } = await imp(baseRoot, "position.ts");
const { virtualClock } = await imp(baseRoot, "virtual-clock.ts");
const pfen = (await imp(protoRoot, "fen.ts")).parseFen;
const pvc = (await imp(protoRoot, "virtual-clock.ts")).virtualClock;

const named = JSON.parse(readFileSync(namedPath, "utf8")).map((p) => ({ name: p.name, fen: p.fen }));
const sampled = JSON.parse(readFileSync(posPath, "utf8")).skytalix.map((p) => ({ name: p.game, fen: p.fen }));
const K25 = [...named, ...sampled];
const mv = (m) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion ? `=${m.promotion}` : "") : "-");
const pick = (c) => ({
  move: mv(c.move),
  score: c.score,
  depth: c.depth,
  nodes: c.nodes,
  elapsedMs: c.elapsedMs,
  nodesAtComplete: c.nodesAtComplete,
  partial: c.partial,
  aborted: c.aborted,
  firstNotIncumbent: c.firstNotIncumbent,
});

for (const { name, fen } of K25) {
  for (const H of [25, 50, 100, 200, 400]) {
    const u = base.chooseMove(parseFen(fen), { budgetMs: H, now: virtualClock(1) });
    const n = proto.chooseMove(pfen(fen), { budgetMs: H, now: pvc(1) });
    const h = proto.chooseMove(pfen(fen), { budgetMs: H, now: pvc(1), softMs: H / b });
    const i0 = mv(u.move) === mv(n.move) && u.score === n.score && u.depth === n.depth && u.nodes === n.nodes;
    console.log(JSON.stringify({ name, H, i0, base: pick(n), head: pick(h) }));
  }
}
