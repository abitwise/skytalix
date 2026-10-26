// qe-ABC-207: A3 under the strict reading ("≥ 10 new positions, EACH exercising both terms"): over criteria.mts's
// seeded corpus (same seed, same playouts), count positions where the early-queen term is charged (head womob ≠ base
// womob) AND the per-piece weights change the mobility term (head mobility ≠ base mobility), and check the mirror
// and the ±100 cp bound on exactly those. usage: node a3strict.mts <base-tree> <head-tree>
const [BASE, HEAD] = process.argv.slice(2);
const H = await import(`${HEAD}/src/evaluate.ts`), B = await import(`${BASE}/src/evaluate.ts`);
const { parseFen, toFen } = await import(`${HEAD}/src/fen.ts`);
const { legalMoves } = await import(`${HEAD}/src/legal.ts`);
const { makeMove } = await import(`${HEAD}/src/apply.ts`);
const { mirrorPosition, clonePosition, PERFT_POSITIONS } = await import(`${HEAD}/src/evaluate.mirror-corpus.ts`);
let seed = 20261025;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000);
const roots = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ...PERFT_POSITIONS.map((x: any) => x.fen)];
let both = 0, mirrorOk = 0, boundOk = 0; const ex: string[] = [];
for (let g = 0; g < 400; g++) {
  const p = parseFen(roots[g % roots.length] as string);
  for (let i = 0; i < 80; i++) {
    const ms = legalMoves(p); if (!ms.length) break; makeMove(p, ms[Math.floor(rnd() * ms.length)]);
    const q = clonePosition(p);
    const term = H.evaluateWithoutMobility(q) !== B.evaluateWithoutMobility(q);
    const hm = H.evaluate(q) - H.evaluateWithoutMobility(q), bm = B.evaluate(q) - B.evaluateWithoutMobility(q);
    if (!(term && hm !== bm)) continue;
    both++; if (H.evaluate(mirrorPosition(q)) === H.evaluate(q)) mirrorOk++; if (Math.abs(hm) <= 100) boundOk++;
    if (ex.length < 3) ex.push(toFen(q));
  }
}
console.log(JSON.stringify({ bothTerms: both, mirrorExact: mirrorOk, withinBound: boundOk, examples: ex }));
