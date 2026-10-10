// QE ABC-126 A3: engine readings for the re-found pair (reads the engine on purpose; NOT the oracle).
// Per row: search() d1 and d3 picks, searchWithoutQuiescence d1 pick, and each root move's d3 value
// = -search(child, 2).score; margin = best non-losing value - losing value. Usage: node a3-engine.mts <tree>
const W = process.argv[2];
const { search, searchWithoutQuiescence } = await import(`${W}/src/search.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { legalMoves } = await import(`${W}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${W}/src/apply.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const { HANGING_CORPUS } = await import(`${W}/src/puzzle-corpus.ts`);
const lbl = (m: any) => (m ? squareName(m.from) + squareName(m.to) : "null");
const names = new Set(["R takes a bishop a pawn defends", "mirror: r takes a bishop a pawn defends"]);
let lose1 = 0, lose3 = 0, bare1 = 0;
for (const row of HANGING_CORPUS) {
  const d1 = lbl(search(parseFen(row.fen), 1).move);
  const d3r = search(parseFen(row.fen), 3);
  const d3 = lbl(d3r.move);
  const b1 = lbl(searchWithoutQuiescence(parseFen(row.fen), 1).move);
  if (d1 === row.losing) lose1++;
  if (d3 === row.losing) lose3++;
  if (b1 === row.losing) bare1++;
  if (!names.has(row.name)) continue;
  const p = parseFen(row.fen);
  const vals = legalMoves(p).map((m: any) => { const u = makeMove(p, m); const v = -search(p, 2).score; unmakeMove(p, m, u); return [lbl(m), v] as const; });
  const lv = vals.find(([m]) => m === row.losing)![1];
  const bo = Math.max(...vals.filter(([m]) => m !== row.losing).map(([, v]) => v));
  console.log(JSON.stringify({ name: row.name, fen: row.fen, d1, d3, d3score: d3r.score, bareD1: b1, losingAtD3: lv, bestOtherAtD3: bo, margin: bo - lv }));
}
console.log(`ALL24 losing chosen d1 ${lose1}/24, d3 ${lose3}/24; bare leaf d1 takes it ${bare1}/24`);
