// T1 identity: scratch tree with knobs off == pristine 28ad3a8d, fixed depth, no clock read as a figure
const [a, b] = process.argv.slice(2);
const FENS = ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"];
const run = async (t) => { const e = await import(`${t}/src/engine.ts`); const f = await import(`${t}/src/fen.ts`); return FENS.map((x) => { const c = e.chooseMove(f.parseFen(x), { budgetMs: 60000, maxDepth: 7 }); return `${c.move.from}-${c.move.to} ${c.score} d${c.depth} n${c.nodes}`; }); };
const A = await run(a), B = await run(b);
console.log(JSON.stringify({ pristine: A, scratch: B, equal: A.every((x, i) => x === B[i]) }));
