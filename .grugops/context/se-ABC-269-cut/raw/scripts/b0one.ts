// B0's first row only (chooseMove kiwipete to d8, frozen clock) and search() kiwipete d8, for planted-defect runs.
const W = process.argv[2];
const { chooseMove } = await import(`${W}/src/engine.ts`);
const { search } = await import(`${W}/src/search.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const c = chooseMove(parseFen(KIWI), { budgetMs: 1e9, now: () => 0, maxDepth: 8 });
const s = search(parseFen(KIWI), 8);
console.log(JSON.stringify({ chooseMoveKiwiD8: c.nodes, expect: 1296788, searchKiwiD8: s.nodes, expectS: 839514, red: c.nodes !== 1296788 || s.nodes !== 839514 }));
