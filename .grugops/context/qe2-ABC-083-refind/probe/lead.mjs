// QE2 ABC-083 re-find: independent read of the ruled clean-lead bar, plus the SHIPPED (LMR-on) lead that
// flipped seed 5061, on one tree. Per row:
//   - the suite's call (chooseMove, budget 25, virtual clock) at 20 (0.8x) / 25 / 31.25 (+25 %) readings;
//   - at k = d-1, d, d+1 (d = depth the call completes at 25): every root move's child searched at k-1,
//     negated, by searchWithoutReductions (clean, LMR off) AND by search (shipped, LMR on);
//     lead = best accepted - best other; plus search() and chooseMoveWithoutReductions picks.
// usage: node lead.mjs <tree-root> <label> "<fen>|<accept,accept>" ...
import { pathToFileURL } from "node:url";
const [tree, tag, ...specs] = process.argv.slice(2);
const src = (f) => import(pathToFileURL(`${tree}/src/${f}`).href);
const { chooseMove, chooseMoveWithoutReductions } = await src("engine.ts");
const { search, searchWithoutReductions } = await src("search.ts");
const { parseFen } = await src("fen.ts");
const { virtualClock } = await src("virtual-clock.ts");
const { squareName } = await src("position.ts");
const { legalMoves } = await src("legal.ts");
const { makeMove, unmakeMove } = await src("apply.ts");
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}`;
const call = (fn, fen, r) => fn(parseFen(fen), { budgetMs: 25, now: virtualClock(25 / r) });
for (const spec of specs) {
  const [fen, acc] = spec.split("|");
  const accept = acc.split(",");
  const ok = (m) => (accept.includes(m) ? "SOLVED" : "MISSED");
  const out = [`${tag}\t${fen}\taccept ${accept.join(",")}`];
  for (const r of [20, 25, 31.25]) {
    const c = call(chooseMove, fen, r);
    out.push(`  call@${r}\t${ok(lab(c.move))} ${lab(c.move)} d${c.depth} n${c.nodes}`);
  }
  const nr = call(chooseMoveWithoutReductions, fen, 25);
  out.push(`  callNoRed@25\t${ok(lab(nr.move))} ${lab(nr.move)} d${nr.depth}`);
  const d = call(chooseMove, fen, 25).depth;
  for (const k of [d - 1, d, d + 1]) {
    const row = [];
    for (const [name, fn] of [["clean", searchWithoutReductions], ["shipped", search]]) {
      const p = parseFen(fen);
      const vals = legalMoves(p).map((m) => {
        const u = makeMove(p, m);
        const v = -fn(p, k - 1).score;
        unmakeMove(p, m, u);
        return [lab(m), v];
      });
      const a = vals.filter(([m]) => accept.includes(m)).sort((x, y) => y[1] - x[1])[0];
      const n = vals.filter(([m]) => !accept.includes(m)).sort((x, y) => y[1] - x[1])[0];
      row.push(`${name} lead ${a[1] - n[1]} (${a[0]} ${a[1]} vs ${n[0]} ${n[1]})`);
    }
    const s = search(parseFen(fen), k);
    out.push(`  k${k}${k === d ? "=d" : ""}\t${row.join("\t")}\tsearch() ${ok(lab(s.move))} ${lab(s.move)} ${s.score}`);
  }
  console.log(out.join("\n"));
}
