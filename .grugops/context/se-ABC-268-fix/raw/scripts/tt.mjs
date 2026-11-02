// usage: node tt.mjs <tree> <search|engine> <depth> <fen>  -> JSON lines of TT entries within 3 plies
const [T, mode, depthS, fen] = process.argv.slice(2);
const depth = Number(depthS);
const { parseFen, toFen } = await import(`${T}/src/fen.ts`);
const s = await import(`${T}/src/search.ts`);
const e = await import(`${T}/src/engine.ts`);
const { legalMoves } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const { zobristKey } = await import(`${T}/src/zobrist.ts`);
const tt = await import(`${T}/src/transposition.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const root = parseFen(fen);
const r = mode === "search" ? s.search(root, depth) : e.chooseMove(root, { budgetMs: 1000, now: () => 0, maxDepth: depth });
console.log(JSON.stringify({ root: true, score: r.score, move: r.move && squareName(r.move.from) + squareName(r.move.to), nodes: r.nodes }));
const read = (key, ply) => {
  const slot = tt.probeTable(key);
  if (slot === -1) return null;
  for (let d = 0; d < 20; d++) {
    const up = tt.tableCutoff(slot, d, 1e6, 1e6 + 1, ply);
    const lo = tt.tableCutoff(slot, d, -1e6 - 1, -1e6, ply);
    if (up === null && lo === null) continue;
    return { d, bound: up !== null && lo !== null ? "EXACT" : up !== null ? "UPPER" : "LOWER", v: up ?? lo };
  }
  return null;
};
const seen = new Set();
const walk = (p, ply, path) => {
  const key = zobristKey(p);
  const ent = read(key, ply);
  if (ent && !seen.has(key)) { seen.add(key); console.log(JSON.stringify({ path: path.join(" "), ply, fen: toFen(p), ...ent })); }
  if (ply >= 3) return;
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    walk(p, ply + 1, [...path, squareName(m.from) + squareName(m.to)]);
    unmakeMove(p, m, u);
  }
};
walk(root, 0, []);
