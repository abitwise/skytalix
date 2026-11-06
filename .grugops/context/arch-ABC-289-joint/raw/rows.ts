// arch-ABC-289-joint DIAGNOSTIC: per-row drift, head against door, one arm. node rows.ts <root> <depth>
const [root, ds] = process.argv.slice(2); const depth = Number(ds);
const S = await import(`${root}/src/search.ts`), E = await import(`${root}/src/engine.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const ROOTS = [["startpos","rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],["kiwipete","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],["position-3","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],["position-4","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],["position-5","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],["position-6","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"]];
const END = [["kq-corner","k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],["kr-corner","k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],["kqk-h8","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],["kp-vs-k","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],["krk-a-file","8/8/8/8/8/k7/8/KR6 w - - 0 1"],["pawn-race","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"]];
const mv = (m) => (m ? squareName(m.from) + squareName(m.to) : "-");
const rows = [];
for (const [n, f] of ROOTS) { rows.push([n, f]); const p = parseFen(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") rows.push([`${n}/${mv(m)}`, toFen(p)]); unmakeMove(p, m, u); } }
rows.push(...END);
const isMate = (s) => Math.abs(s) > S.MATE_SCORE - 1000;
const choose = (fen, f) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: depth });
for (const which of ["search", "chooseMove"]) {
  const h = which === "search" ? (x) => S.search(parseFen(x), depth) : (x) => choose(x, E.chooseMove);
  const d = which === "search" ? (x) => S.searchWithoutDeltaPruning(parseFen(x), depth) : (x) => choose(x, E.chooseMoveWithoutDeltaPruning);
  const diffs = []; let n = 0, within = 0, same = 0;
  for (const [name, fen] of rows) { const a = d(fen), b = h(fen); if (isMate(a.score) || isMate(b.score)) continue; n++; const x = Math.abs(a.score - b.score); if (x <= 25) within++; if (x === 0) same++; diffs.push([x, name, a.score, b.score, mv(a.move), mv(b.move)]); }
  diffs.sort((p, q) => q[0] - p[0]);
  console.log(JSON.stringify({ root: root.split("/").pop(), which, depth, n, withinPct: +(100 * within / n).toFixed(2), zero: same, top: diffs.slice(0, 6) }));
}
