// se-ABC-253 informal: base vs probe chooseMove identity on a tick clock (not A2).
const [a, b] = process.argv.slice(2);
const A = await import(`${a}/engine.ts`), B = await import(`${b}/engine.ts`);
const { parseFen } = await import(`${a}/fen.ts`);
const { zobristKey } = await import(`${a}/zobrist.ts`);
const { legalMoves } = await import(`${a}/legal.ts`);
const { makeMove } = await import(`${a}/apply.ts`);
const fens = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
let bad = 0, n = 0;
const run = (E: any, fen: string, budgetMs: number, priorKeys?: bigint[]) => { let t = 0; const c = E.chooseMove(parseFen(fen), { budgetMs, now: () => t++, priorKeys }); return JSON.stringify([c.move, c.score, c.depth, c.nodes, c.elapsedMs, t]); };
for (const fen of fens) for (const ms of [3, 5, 400, 3000]) {
  // a prior history: shuffle knights so repetitions are reachable
  const p = parseFen(fen); const prior: bigint[] = [];
  for (let i = 0; i < 6; i++) { prior.push(zobristKey(p)); const m = legalMoves(p); if (!m.length) break; makeMove(p, m[i % m.length]); }
  for (const pk of [undefined, prior]) { n++; const x = run(A, fen, ms, pk), y = run(B, fen, ms, pk); if (x !== y) { bad++; console.log("MISMATCH", fen, ms, x, y); } }
}
console.log(`identity: ${n - bad}/${n} equal`);
