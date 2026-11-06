// se-ABC-289 diagnosis of the G1 row: head and door on the one row, each tree. node diag.ts <root>
import { readFileSync } from "node:fs";
const root = process.argv[2];
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { PUZZLES } = await import(`${root}/src/puzzle-corpus.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const base = JSON.parse(readFileSync(`${root}/src/puzzle-suite.baseline.json`, "utf8"));
const p = PUZZLES.find((x: any) => x.name.startsWith("mate in 3, seed 1632"));
const mv = (m: any) => (m ? squareName(m.from) + squareName(m.to) : "-");
console.log(JSON.stringify({ fen: p.fen, accept: p.accept, budgetMs: base.budgetMs, stepMs: base.stepMs }));
for (const [n, f] of [["head", E.chooseMove], ["door", E.chooseMoveWithoutDeltaPruning]] as const) {
  const c = f(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) });
  console.log(JSON.stringify({ n, clock: "G1", depth: c.depth, move: mv(c.move), score: c.score, nodes: c.nodes }));
  for (const d of [4, 5, 6, 7, 8]) { const r = f(parseFen(p.fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }); console.log(JSON.stringify({ n, d, move: mv(r.move), score: r.score, nodes: r.nodes })); }
}
