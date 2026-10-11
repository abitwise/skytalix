// design-ABC-083-refind-5061: the short-listed replacements, read harder on one tree.
// - the suite's call (chooseMove, budget 25) on the readings ladder 20 / 25 / 26.25 / 27.5 / 31.25 / 37.5 / 50;
// - clean root lead (children by searchWithoutReductions at k-1, negated) at k = d-1, d, d+1,
//   where d = the depth chooseMove completes at 25 readings;
// - fixed-depth search() and searchWithoutReductions picks at the same k.
// usage: node focus.mjs <tree-root> <label> <fen|accept,accept> ...
import { pathToFileURL } from "node:url";
const [tree, tag, ...specs] = process.argv.slice(2);
const src = (f) => import(pathToFileURL(`${tree}/src/${f}`).href);
const { chooseMove } = await src("engine.ts");
const { search, searchWithoutReductions } = await src("search.ts");
const { parseFen } = await src("fen.ts");
const { virtualClock } = await src("virtual-clock.ts");
const { squareName } = await src("position.ts");
const { legalMoves } = await src("legal.ts");
const { makeMove, unmakeMove } = await src("apply.ts");
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}`;
for (const spec of specs) {
  const [fen, acc] = spec.split("|");
  const accept = acc.split(",");
  const ok = (m) => (accept.includes(m) ? "S" : "M");
  const ladder = [20, 25, 26.25, 27.5, 31.25, 37.5, 50].map((r) => {
    const c = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(25 / r) });
    return `${r}:${ok(lab(c.move))}:${lab(c.move)}:d${c.depth}:n${c.nodes}`;
  });
  const d = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(1) }).depth;
  const per = [];
  for (const k of [d - 1, d, d + 1]) {
    const p = parseFen(fen);
    const vals = legalMoves(p).map((m) => {
      const u = makeMove(p, m);
      const v = -searchWithoutReductions(p, k - 1).score;
      unmakeMove(p, m, u);
      return [lab(m), v];
    });
    const a = Math.max(...vals.filter(([m]) => accept.includes(m)).map(([, v]) => v));
    const n = vals.filter(([m]) => !accept.includes(m)).sort((x, y) => y[1] - x[1])[0];
    const s = search(parseFen(fen), k);
    const sw = searchWithoutReductions(parseFen(fen), k);
    per.push(`d${k}: lead ${a - n[1]} (best accepted ${a}, best other ${n[0]} ${n[1]}) search ${ok(lab(s.move))}:${lab(s.move)}:${s.score} noRed ${ok(lab(sw.move))}:${lab(sw.move)}:${sw.score}`);
  }
  console.log(`${tag}\t${fen}\n  ladder ${ladder.join("  ")}\n  ${per.join("\n  ")}`);
}
