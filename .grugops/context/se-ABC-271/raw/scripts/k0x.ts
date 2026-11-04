// se-ABC-271: K0's seven rows on a tree (argv[2]): nodes, score, move (the probe's mainnodes.ts form).
const T = process.argv[2];
const { chooseMove } = await import(`${T}/src/engine.ts`);
const { parseFen } = await import(`${T}/src/fen.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const { search } = await import(`${T}/src/search.ts`);
const FEN: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const mv = (m: any) => (m ? squareName(m.from) + squareName(m.to) : "-");
const rows: [string, string, number][] = [["choose","kiwipete",8],["choose","kiwipete",9],["choose","position-6",8],["choose","position-6",9],["choose","position-6",10],["search","kiwipete",8],["search","position-6",8]];
for (const [rec, name, d] of rows) {
  const r: any = rec === "search" ? search(parseFen(FEN[name]), d) : chooseMove(parseFen(FEN[name]), { budgetMs: 1e9, now: () => 0, maxDepth: d });
  console.log(JSON.stringify({ rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move) }));
}
