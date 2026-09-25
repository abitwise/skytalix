const [W, M] = process.argv.slice(2);
const ge = await import(W + "/src/engine.ts"), be = await import(M + "/src/engine.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const F = { "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1" };
for (const [n, f] of Object.entries(F)) for (const b of [2, 3, 4, 6, 8]) {
  let t = 0, u = 0; const s0 = performance.now();
  const g = ge.chooseMove(parseFen(f), { budgetMs: b, now: () => t++ }); const ms = performance.now() - s0;
  const m = be.chooseMove(parseFen(f), { budgetMs: b, now: () => u++ });
  console.log(n, b, "good", g.depth, g.nodes, g.score, "| mut", m.depth, m.nodes, m.score, Math.round(ms) + "ms", g.nodes !== m.nodes || g.depth !== m.depth ? "DIFF" : "");
}
