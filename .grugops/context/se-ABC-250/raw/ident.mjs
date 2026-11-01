// informal: search(position, 5) on the six perft roots and their depth-1 children; prints one JSON line per row.
const [tree] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { search } = await import(`${tree}/src/search.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const R = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const fens = [];
for (const f of R) { fens.push(f); const p = parseFen(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); fens.push(toFen(p)); unmakeMove(p, m, u); } }
for (const f of fens) { const r = search(parseFen(f), 4); console.log(JSON.stringify({ f, move: r.move && [r.move.from, r.move.to, r.move.promotion], score: r.score, nodes: r.nodes, depth: r.depth })); }
