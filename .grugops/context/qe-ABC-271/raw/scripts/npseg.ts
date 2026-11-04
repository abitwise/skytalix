// qe-ABC-271 endgame search report (REPORT, grades nothing on time): nps.ts's shape on the six EG report FENs, where the
// E4a loop runs. chooseMove frozen clock to depth 9; arms H and B; 3 rounds alternating, round 1 dropped; ns per node
// and H / B over the summed set. Nodes, score and move per FEN must be equal H vs B (an F1 row if not).
const [S] = process.argv.slice(2);
const he = await import(`${S}/H/src/engine.ts`), be = await import(`${S}/B/src/engine.ts`);
const { parseFen } = await import(`${S}/H/src/fen.ts`);
const EG = ["r7/6k1/1p2p1p1/1n3p2/1BpP1PP1/P4K2/7R/8 w - - 0 44","R3r1k1/5p1p/2p3p1/1p4B1/p1n5/5P2/6PP/3R2K1 b - - 0 32","7r/1p1k2pp/4p3/3rP3/3K4/p7/R5PP/5R2 w - - 0 31","5r2/pp1k2b1/8/4pPK1/2pn4/P6R/1P3P2/5R2 w - - 1 31","8/1p5p/8/1Pn2p1R/2k4P/4K3/8/8 w - - 0 39","8/2p5/2P2k2/3r1p2/Kp1p2p1/3Pp1P1/4P1r1/2R3N1 w - - 0 38"];
const arms: [string, any][] = [["H", he.chooseMove], ["B", be.chooseMove]];
const ns: Record<string, number[]> = { H: [], B: [] }; const res: Record<string, string[]> = { H: [], B: [] };
for (let r = 0; r < 3; r++) for (const [who, cm] of (r % 2 ? [...arms].reverse() : arms)) {
  let t = 0n, n = 0; const line: string[] = [];
  for (const fen of EG) { const t0 = process.hrtime.bigint(); const c = cm(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: 9 });
    t += process.hrtime.bigint() - t0; n += c.nodes; line.push(`${c.nodes}/${c.score}/${c.move.from}-${c.move.to}`); }
  ns[who].push(Number(t) / n); if (r === 0) res[who] = line;
}
const m = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
const same = res.H.every((x, i) => x === res.B[i]);
console.log(JSON.stringify({ ns, perFen: res, identical: same }));
console.log(`npseg H=${m(ns.H).toFixed(1)} B=${m(ns.B).toFixed(1)} H/B=${(m(ns.H) / m(ns.B)).toFixed(4)} identical=${same}`);
