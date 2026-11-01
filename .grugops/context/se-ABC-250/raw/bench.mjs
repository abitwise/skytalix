const [tree, reps] = process.argv.slice(2);
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { perft } = await import(`${tree}/src/perft.ts`);
const F = ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
perft(parseFen(F[0]), 3);
let n = 0; const t = process.hrtime.bigint();
for (let r = 0; r < Number(reps); r++) for (const f of F) n += perft(parseFen(f), 4);
const s = Number(process.hrtime.bigint() - t) / 1e9;
console.log(`${(n / s / 1e6).toFixed(2)} Mnps`);
