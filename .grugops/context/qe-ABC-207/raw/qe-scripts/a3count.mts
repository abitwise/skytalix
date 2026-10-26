// qe-ABC-207: A3's "≥ 10 new positions that exercise both terms" — count, per SE position, whether the early-queen
// term is charged (head womob − base womob ≠ 0) and whether the per-piece weights matter (head mobility ≠ base mobility).
const [BASE, HEAD] = process.argv.slice(2);
const H = await import(`${HEAD}/src/evaluate.ts`), B = await import(`${BASE}/src/evaluate.ts`);
const { parseFen } = await import(`${HEAD}/src/fen.ts`);
const { mirrorPosition } = await import(`${HEAD}/src/evaluate.mirror-corpus.ts`);
const { readFileSync } = await import("node:fs");
const src = readFileSync(`${HEAD}/src/evaluate.king-mobility.test.ts`, "utf8");
const fens = [...src.slice(src.indexOf("const A1_PAIRS")).matchAll(/"([1-8pnbrqkPNBRQK\/]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+)"/g)].map((m) => m[1]);
const uniq = [...new Set(fens)];
let both = 0, term = 0, weights = 0, mirror = 0;
for (const f of uniq) {
  const p = parseFen(f);
  const t = H.evaluateWithoutMobility(p) - B.evaluateWithoutMobility(p) !== 0;
  const w = (H.evaluate(p) - H.evaluateWithoutMobility(p)) !== (B.evaluate(p) - B.evaluateWithoutMobility(p));
  if (t) term++; if (w) weights++; if (t && w) both++;
  if (H.evaluate(mirrorPosition(p)) === H.evaluate(p)) mirror++;
}
console.log(JSON.stringify({ fensInFile: fens.length, unique: uniq.length, termCharged: term, weightsMatter: weights, both, mirrorEqual: mirror }));
