// qe-ABC-268: the four A4 (a) head counts on a planted tree (does the exact-count instrument check see the plant?).
// usage: node plant-a4.mjs <tree> <label>
const [T, label] = process.argv.slice(2);
const { parseFen } = await import(`${T}/src/fen.ts`);
const { search } = await import(`${T}/src/search.ts`);
const { chooseMove } = await import(`${T}/src/engine.ts`);
const F = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const r = {};
for (const [n, f] of Object.entries(F)) {
  const s = search(parseFen(f), 8), c = chooseMove(parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: 8 });
  r[n] = { search: [s.nodes, s.score], choose: [c.nodes, c.score] };
}
console.log(JSON.stringify({ label, ...r }));
