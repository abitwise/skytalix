// For every row in rows.jsonl ({name,fen,kind,accept|losing}), run one engine variant and record
// move/depth/solved. Usage: node matrix.mjs <variantDir> <rows.jsonl> <budget> <step> <out.jsonl>
import { readFileSync, writeFileSync } from "node:fs";
const [dir, rowsPath, budget, step, out] = process.argv.slice(2);
const { chooseMove } = await import(`${dir}/src/engine.ts`);
const { parseFen } = await import(`${dir}/src/fen.ts`);
const { virtualClock } = await import(`${dir}/src/virtual-clock.ts`);
const { squareName } = await import(`${dir}/src/position.ts`);
const rows = readFileSync(rowsPath, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const lines = [];
for (const r of rows) {
  const c = chooseMove(parseFen(r.fen), { budgetMs: Number(budget), now: virtualClock(Number(step)) });
  const move = squareName(c.move.from) + squareName(c.move.to);
  const solved = r.kind === "do-not-hang" ? move !== r.losing : r.accept.includes(move);
  lines.push(JSON.stringify({ name: r.name, move, depth: c.depth, nodes: c.nodes, solved }));
}
writeFileSync(out, `${lines.join("\n")}\n`);
