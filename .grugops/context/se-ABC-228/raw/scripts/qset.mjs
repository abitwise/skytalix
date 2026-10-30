// Probe candidate Q-SET rows on a tree. usage: node qset.mjs <tree>
const T = process.argv[2];
const { parseFen } = await import(`${T}/src/fen.ts`);
const { evaluate } = await import(`${T}/src/evaluate.ts`);
const { isInCheck, legalMoves, legalCaptures } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const q = await import(`${T}/src/quiescence.ts`);
const s = await import(`${T}/src/search.ts`);
const INF = Number.POSITIVE_INFINITY;
function ref(p, qply, ply) {
  if (qply < q.QUIESCENCE_MAX_PLY && isInCheck(p)) {
    const ms = legalMoves(p);
    if (ms.length === 0) return -(q.MATE_SCORE - (ply + qply));
    let best = -INF;
    for (const m of ms) { const u = makeMove(p, m); const v = -ref(p, qply + 1, ply); unmakeMove(p, m, u); if (v > best) best = v; }
    return best;
  }
  const sp = evaluate(p);
  if (qply >= q.QUIESCENCE_MAX_PLY) return sp;
  let best = sp;
  for (const m of legalCaptures(p)) { const u = makeMove(p, m); const v = -ref(p, qply + 1, ply); unmakeMove(p, m, u); if (v > best) best = v; }
  return best;
}
const rows = process.argv.slice(3);
for (const fen of rows) {
  const p = parseFen(fen);
  const on = q.quiesce(parseFen(fen), -INF, INF, 0, 0, { evasions: true }, () => {});
  const off = q.quiesce(parseFen(fen), -INF, INF, 0, 0, { evasions: false }, () => {});
  const r = ref(parseFen(fen), 0, 0);
  const s1 = s.search(parseFen(fen), 1);
  const d1 = s.searchWithoutQuiescenceEvasions(parseFen(fen), 1);
  console.log(JSON.stringify({ fen, check: isInCheck(p), legal: legalMoves(p).length, static: evaluate(p), on, off, ref: r, search1: [s1.score, s1.move && `${s1.move.from}-${s1.move.to}`], door1: d1.score }));
}
