// ABC-083 A10 group 3: ABC-079 A1's HANGING_CORPUS (src/puzzle-corpus.ts), per row: the move search()
// chooses at depths 1 (bare leaf door) and 3, and the margin = best root move's score minus the
// losing capture's score at depth 3 (each root move scored as -search(child, 2)).
// Usage: node hanging.mjs <tree-root> <label>
const [root, label] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const F = await import(`${root}/src/fen.ts`);
const P = await import(`${root}/src/position.ts`);
const A = await import(`${root}/src/apply.ts`);
const L = await import(`${root}/src/legal.ts`);
const { HANGING_CORPUS } = await import(`${root}/src/puzzle-corpus.ts`);
const lbl = (m) => (m ? P.squareName(m.from) + P.squareName(m.to) : "null");
let losing1 = 0, losing3 = 0, minMargin = Infinity;
for (const { name, fen, losing } of HANGING_CORPUS) {
  const p = F.parseFen(fen);
  const d1 = lbl(S.searchWithoutQuiescence(F.parseFen(fen), 1).move);
  const d3 = lbl(S.search(F.parseFen(fen), 3).move);
  const scores = L.legalMoves(p).map((m) => { const u = A.makeMove(p, m); const s = 0 - S.search(p, 2).score; A.unmakeMove(p, m, u); return [lbl(m), s]; });
  const best = Math.max(...scores.filter(([m]) => m !== losing).map(([, s]) => s));
  const bad = (scores.find(([m]) => m === losing) ?? [losing, NaN])[1];
  const margin = best - bad;
  if (d1 === losing) losing1++;
  if (d3 === losing) losing3++;
  minMargin = Math.min(minMargin, margin);
  console.log(JSON.stringify({ label, name, bareD1: d1, d3, losing, margin }));
}
console.log(JSON.stringify({ label, summary: true, rows: HANGING_CORPUS.length, bareD1Losing: losing1, d3Losing: losing3, minMargin }));
