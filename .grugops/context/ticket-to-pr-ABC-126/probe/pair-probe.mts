// ABC-126 A2/A3: for each HANGING_CORPUS row of <tree> (or the FEN/losing pairs in ROWS='[[fen,losing],...]'),
// read: side to move in check, legal count, non-king legal count, losing capture legal, ADR-0033 rules
// (the Architect's prototype, recut-abc010/probe/rules.mjs), search() pick at d1 and d3, bare-leaf pick
// at d1, and the depth-3 margin = best other root move's value - the losing capture's value, each root
// value = -search(child, 2).score (the method of ruling-abc082-levels/probe/hanging-replace.ts).
// Usage: node pair-probe.mts <tree> [ROWS env]    read-only on <tree>.
const W = process.argv[2];
const S = await import(`${W}/src/search.ts`);
const F = await import(`${W}/src/fen.ts`);
const Pos = await import(`${W}/src/position.ts`);
const A = await import(`${W}/src/apply.ts`);
const L = await import(`${W}/src/legal.ts`);
const { HANGING_CORPUS } = await import(`${W}/src/puzzle-corpus.ts`);
const { semanticFault } = await import(new URL("../../recut-abc010/probe/rules.mjs", import.meta.url).href);
const lbl = (m) => (m ? Pos.squareName(m.from) + Pos.squareName(m.to) : "null");
const rows = process.env.ROWS
  ? JSON.parse(process.env.ROWS).map(([fen, losing]) => ({ name: "candidate", fen, losing }))
  : HANGING_CORPUS;
for (const row of rows) {
  const p = F.parseFen(row.fen);
  const moves = L.legalMoves(p);
  const nonKing = moves.filter((m) => Pos.pieceType(p.board[m.from]) !== Pos.KING).length;
  const values = moves
    .map((m) => { const u = A.makeMove(p, m); const v = -S.search(p, 2).score; A.unmakeMove(p, m, u); return [lbl(m), v]; })
    .sort((a, b) => b[1] - a[1]);
  const losingValue = values.find(([m]) => m === row.losing)?.[1];
  const bestOther = values.find(([m]) => m !== row.losing)?.[1];
  console.log(JSON.stringify({
    name: row.name, fen: row.fen, losing: row.losing,
    inCheck: L.isInCheck(p), legal: moves.length, nonKing,
    losingLegal: moves.some((m) => lbl(m) === row.losing),
    adr0033: semanticFault(row.fen.split(" "), F.parseFen(row.fen)) ?? "accepted",
    d1: lbl(S.search(F.parseFen(row.fen), 1).move),
    d1bare: lbl(S.searchWithoutQuiescence(F.parseFen(row.fen), 1).move),
    d3: lbl(S.search(F.parseFen(row.fen), 3).move),
    losingAtD3: losingValue, bestOtherAtD3: bestOther, margin: bestOther - losingValue,
  }));
}
