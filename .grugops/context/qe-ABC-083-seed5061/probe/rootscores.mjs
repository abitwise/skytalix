// QE seed 5061: per-root-move scores at fixed depth (child searched at depth-1, negated), the static
// evaluate() of the position after the move, and the full search's own choice at depth 5 and 6.
// usage: node rootscores.mjs <tree-root> <label>
import { pathToFileURL } from "node:url";
const [tree, tag] = process.argv.slice(2);
const src = (f) => pathToFileURL(`${tree}/src/${f}`).href;
const { search } = await import(src("search.ts"));
const { parseFen } = await import(src("fen.ts"));
const { legalMoves } = await import(src("legal.ts"));
const { makeMove, unmakeMove } = await import(src("apply.ts"));
const { evaluate } = await import(src("evaluate.ts"));
const { squareName } = await import(src("position.ts"));
const fen = "8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w - - 0 1";
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}`;
const p = parseFen(fen);
for (const d of [5, 6]) {
  const r = search(p, d);
  console.log(`${tag}\tsearch d${d}\tbest=${lab(r.move)}\tscore=${r.score}\tnodes=${r.nodes}`);
}
for (const d of [5, 6]) {
  const rows = [];
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    const s = -search(p, d - 1).score;
    const st = -evaluate(p);
    unmakeMove(p, m, u);
    rows.push([lab(m), s, st]);
  }
  rows.sort((a, b) => b[1] - a[1]);
  const top = rows.slice(0, 5).map(([m, s, st]) => `${m}:${s}(static ${st})`).join("  ");
  const pick = ["f5e6", "g1a7", "g2e1"].map((k) => { const r = rows.find((x) => x[0] === k); return `${k}=${r[1]}`; }).join(" ");
  console.log(`${tag}\troot d${d} (child d${d - 1})\t${pick}\ttop5: ${top}`);
}
