// Usage: node qprobe.mts <worktree>. Single-position quiescence probes (no games).
const wt = process.argv[2];
const { parseFen } = await import(`${wt}/src/fen.ts`);
const { quiesce } = await import(`${wt}/src/quiescence.ts`);
const { evaluate } = await import(`${wt}/src/evaluate.ts`);
const { isInCheck } = await import(`${wt}/src/legal.ts`);
const { chooseMove } = await import(`${wt}/src/engine.ts`);
const INF = 1e9;
const rows: [string, string][] = [
  ["Q1 capture-mate Qxf7# available (white to move)", "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"],
  ["Q2 side to move in check, quiet evasion only (black)", "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"],
  ["Q3 quiet promotion available (white)", "8/P6k/8/8/8/8/8/K7 w - - 0 1"],
];
for (const [name, fen] of rows) {
  const p = parseFen(fen);
  const q = quiesce(p, -INF, INF, 0, () => {});
  const c = chooseMove(parseFen(fen), { budgetMs: 300 });
  console.log(`${name}\n  inCheck=${isInCheck(p)} static=${evaluate(p)} quiesce=${q} chooseMove(300ms)=depth ${c?.depth} score ${c?.score}`);
}
