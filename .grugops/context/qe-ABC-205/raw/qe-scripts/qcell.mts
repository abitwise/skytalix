const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { searchWithoutPvsOrReductions, searchWithoutQuiescence } = await import(`${tree}/src/search.ts`);
const FEN: Record<string,string> = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
for (const n of ["kiwipete", "position-6"]) { const p = parseFen(FEN[n]); const a = searchWithoutPvsOrReductions(p, 1).nodes, b = searchWithoutQuiescence(p, 1).nodes; console.log(`${n} d1: ${a}/${b} = ${(a/b).toFixed(2)}x`); }
