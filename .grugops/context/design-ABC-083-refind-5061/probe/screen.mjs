// design-ABC-083-refind-5061: screen win-material rows for the re-find bar, on one tree.
// For each row (the tree's PUZZLES win-material rows, plus ABC-127's unused cand-wm pool):
// - the suite's exact call: chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(step) })
//   at 25 readings (step 1) and 20 readings (step 1.25, ADR-0034 d5's 0.8x);
// - chooseMoveWithoutReductions at 25 readings;
// - fixed-depth search() at d = the depth chooseMove completed at 25 readings;
// - CLEAN root-move values at d: every legal move, child searched by searchWithoutReductions at d-1,
//   negated. lead = best accepted value - best non-accepted value (cp).
// - W1 (quiescence off) and W5 (depth cap 4) variants of the same tree at 25 readings (tags).
// usage: node screen.mjs <tree-root> <variants-root> <label> <cand-wm.jsonl>
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const [tree, vroot, tag, pool] = process.argv.slice(2);
const at = (root) => (f) => import(pathToFileURL(`${root}/src/${f}`).href);
const src = at(tree);
const { chooseMove, chooseMoveWithoutReductions } = await src("engine.ts");
const { search, searchWithoutReductions } = await src("search.ts");
const { parseFen } = await src("fen.ts");
const { virtualClock } = await src("virtual-clock.ts");
const { squareName } = await src("position.ts");
const { legalMoves } = await src("legal.ts");
const { makeMove, unmakeMove } = await src("apply.ts");
const { PUZZLES } = await src("puzzle-corpus.ts");
const w1 = (await at(`${vroot}/W1`)("engine.ts")).chooseMove;
const w5 = (await at(`${vroot}/W5`)("engine.ts")).chooseMove;
const lab = (m) => (m ? `${squareName(m.from)}${squareName(m.to)}` : "null");
const call = (fn, fen, step) => fn(parseFen(fen), { budgetMs: 25, now: virtualClock(step) });

const rows = PUZZLES.filter((p) => p.kind === "win-material").map((p) => ({ name: p.name, fen: p.fen, accept: p.accept, inSuite: true }));
const have = new Set(rows.map((r) => r.fen));
for (const line of readFileSync(pool, "utf8").trim().split("\n")) {
  const r = JSON.parse(line);
  if (!have.has(r.fen)) rows.push({ name: r.name, fen: r.fen, accept: r.accept, inSuite: false });
}
console.log(["tree", "row", "inSuite", "side", "accept", "cm25", "cm20", "cmNoRed25", "search@d", "lead@d", "bestNonAccepted", "W1", "W5"].join("\t"));
for (const r of rows) {
  const ok = (m) => r.accept.includes(m);
  const c25 = call(chooseMove, r.fen, 1);
  const c20 = call(chooseMove, r.fen, 1.25);
  const cn = call(chooseMoveWithoutReductions, r.fen, 1);
  const d = c25.depth;
  const s = search(parseFen(r.fen), d);
  const p = parseFen(r.fen);
  const vals = legalMoves(p).map((m) => {
    const u = makeMove(p, m);
    const v = -searchWithoutReductions(p, d - 1).score;
    unmakeMove(p, m, u);
    return [lab(m), v];
  });
  const acc = Math.max(...vals.filter(([m]) => ok(m)).map(([, v]) => v));
  const non = vals.filter(([m]) => !ok(m)).sort((a, b) => b[1] - a[1])[0];
  const x1 = call(w1, r.fen, 1);
  const x5 = call(w5, r.fen, 1);
  const f = (c) => `${ok(lab(c.move)) ? "S" : "M"}:${lab(c.move)}:d${c.depth}`;
  console.log([tag, r.name, r.inSuite ? "suite" : "pool", r.fen.split(" ")[1], r.accept.join(","), f(c25), f(c20), f(cn), `${ok(lab(s.move)) ? "S" : "M"}:${lab(s.move)}:d${d}`, acc - non[1], `${non[0]}:${non[1]}`, f(x1), f(x5)].join("\t"));
}
