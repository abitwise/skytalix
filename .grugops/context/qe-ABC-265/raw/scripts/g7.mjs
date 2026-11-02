// qe-ABC-265 G7 (NFR-009, A5): one fresh `node --expose-gc` process per call. Reads arrayBuffers/heapUsed after import
// (m0), after a 1 s chooseMove (a) and after a 4 s (DEFAULT_BUDGET_MS) chooseMove (b), each after gc() twice; plus
// the fixed sum the ABC-081 A7 row adds. usage: node --expose-gc g7.mjs <tree> <kiwipete|position-6>
const [tree, pos] = process.argv.slice(2);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
}[pos];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const E = await import(`${tree}/src/engine.ts`);
const T = await import(`${tree}/src/transposition.ts`);
const S = await import(`${tree}/src/search.ts`);
const EV = await import(`${tree}/src/evaluate.ts`);
const QS = await import(`${tree}/src/quiescence.ts`);
const read = () => { gc(); gc(); const m = process.memoryUsage(); return { heapUsed: m.heapUsed, arrayBuffers: m.arrayBuffers }; };
const m0 = read();
const one = E.chooseMove(parseFen(FEN), { budgetMs: 1000 });
const a = read();
const four = E.chooseMove(parseFen(FEN), { budgetMs: E.DEFAULT_BUDGET_MS });
const b = read();
const pick = (name) => [E, T, S, EV, QS].map((m) => m[name]).find((f) => typeof f === "function");
const parts = {};
for (const n of ["tableByteLength", "pawnCacheByteLength", "orderScratchByteLength", "captureScratchByteLength"]) parts[n] = pick(n)?.() ?? null;
const cap = S.KEY_ARRAY_CAPACITY ?? E.KEY_ARRAY_CAPACITY ?? null;
parts.keyArrayBytes = cap === null ? null : (cap + 1) * 8;
const sum = Object.values(parts).every((x) => typeof x === "number") ? Object.values(parts).reduce((x, y) => x + y, 0) : null;
const MIB = 1024 * 1024;
console.log(JSON.stringify({
  tree: tree.split("/").pop(), pos, budget: E.DEFAULT_BUDGET_MS, depths: [one.depth, four.depth],
  m0, a, b,
  growthHeap: b.heapUsed - a.heapUsed, growthAB: b.arrayBuffers - a.arrayBuffers, abFromImport: a.arrayBuffers - m0.arrayBuffers,
  parts, sum, met: b.heapUsed - a.heapUsed <= MIB && b.arrayBuffers - a.arrayBuffers <= MIB && b.arrayBuffers <= 16 * MIB && sum !== null && sum <= 16 * MIB && parts.tableByteLength === 4194304,
}));
