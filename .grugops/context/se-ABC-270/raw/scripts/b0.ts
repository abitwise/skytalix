// se-ABC-270 (copied from se-ABC-274) A1 (copied from se-ABC-269-cut): ABC-269 B0 reader: chooseMove nodes to complete each depth (frozen clock), search() d8, and the doors.
const W = process.argv[2];
const { chooseMove, chooseMoveWithoutTaper } = await import(`${W}/src/engine.ts`);
const { search, searchWithoutTaper } = await import(`${W}/src/search.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const ch = (f: any, fen: string, d: number) => { const r = f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }); return { nodes: r.nodes, depth: r.depth, score: r.score }; };
const out = (o: object) => console.log(JSON.stringify(o));
for (const [n, fen, ds] of [["kiwipete", KIWI, [8, 9]], ["position-6", POS6, [8, 9, 10]]] as const)
  for (const d of ds) out({ rec: "chooseMove", n, d, ...ch(chooseMove, fen, d) });
for (const [n, fen] of [["kiwipete", KIWI], ["position-6", POS6]]) {
  out({ rec: "chooseMoveWithoutTaper", n, d: 8, ...ch(chooseMoveWithoutTaper, fen, 8) });
  const s = search(parseFen(fen), 8); out({ rec: "search", n, d: 8, nodes: s.nodes, score: s.score });
  const t = searchWithoutTaper(parseFen(fen), 8); out({ rec: "searchWithoutTaper", n, d: 8, nodes: t.nodes, score: t.score });
}
