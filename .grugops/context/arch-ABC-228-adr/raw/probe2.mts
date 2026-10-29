// Usage: node probe2.mts <scratch-root>. chooseMove on a FROZEN clock (now = () => 0) with maxDepth: nodes and CPU per
// completed depth, base knobs vs evasions (cap 8) vs evasions + quiet queen promotions. CPU is indicative (host load ~10).
const R = process.argv[2];
const fen = await import(`${R}/probe/src/fen.ts`); const eng = await import(`${R}/probe/src/engine.ts`); const q = await import(`${R}/probe/src/quiescence.ts`);
const PR = q.PROBE;
const set = (o: any) => Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99 }, o);
const boards: [string, string, number[]][] = [["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", [6, 7, 8]], ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", [8, 9, 10]]];
const t0 = process.cpuUsage();
for (const [name, f, depths] of boards) for (const d of depths) {
  const row: string[] = []; let b = 0, bc = 0;
  for (const [lab, k] of [["base", {}], ["ev", { evasions: true }], ["ev+qQ(probe gen)", { evasions: true, promotions: "queen" }], ["ev,cap<2", { evasions: true, checkCap: 2 }]] as const) {
    set(k); const c0 = process.cpuUsage(); const c = eng.chooseMove(fen.parseFen(f), { budgetMs: 3000, now: () => 0, maxDepth: d }); const u = process.cpuUsage(c0); const cpu = (u.user + u.system) / 1e6;
    if (lab === "base") { b = c.nodes; bc = cpu; }
    row.push(`${lab} ${c.nodes} (${(c.nodes / b).toFixed(3)}x) ${cpu.toFixed(2)}s (${(cpu / bc).toFixed(2)}x) ${c.move.from}-${c.move.to} ${c.score}`);
  }
  console.log(`${name} chooseMove to depth ${d}: ${row.join(" | ")}`);
}
const t = process.cpuUsage(t0); console.log(`total cpu ${((t.user + t.system) / 1e6).toFixed(1)} s`);
