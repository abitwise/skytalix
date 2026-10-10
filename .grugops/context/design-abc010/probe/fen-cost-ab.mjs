// ABC-010 design hop: validated parseFen (variant B prototype, <tree>/src/fen.ts) against the base parser
// (<tree>/src/fen.base.ts = fen.ts at 6ade041), interleaved in ONE process. Usage: node fen-cost-ab.mjs <tree>
import { loadavg } from "node:os";
const tree = process.argv[2];
const base = await import(`${tree}/src/fen.base.ts`);
const valid = await import(`${tree}/src/fen.ts`);
const fens = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3",
];
for (const f of fens) if (valid.toFen(valid.parseFen(f)) !== f) throw new Error(`round trip ${f}`);
const N = 200000, ROUNDS = 9;
const run = (fn) => { const t0 = process.hrtime.bigint(); for (let i = 0; i < N; i++) fn(fens[i & 3]); return Number(process.hrtime.bigint() - t0) / N; };
for (let i = 0; i < 40000; i++) { base.parseFen(fens[i & 3]); valid.parseFen(fens[i & 3]); }
const a = [], b = [];
for (let r = 0; r < ROUNDS; r++) { a.push(run(base.parseFen)); b.push(run(valid.parseFen)); }
const stat = (xs) => { const s = [...xs].sort((x, y) => x - y); const mean = xs.reduce((x, y) => x + y, 0) / xs.length; return `mean ${mean.toFixed(0)} median ${s[ROUNDS >> 1].toFixed(0)} min ${s[0].toFixed(0)} max ${s[ROUNDS - 1].toFixed(0)} ns/call`; };
console.log(`base parseFen      : ${stat(a)}`);
console.log(`validated parseFen : ${stat(b)}`);
const ma = a.reduce((x, y) => x + y) / ROUNDS, mb = b.reduce((x, y) => x + y) / ROUNDS;
console.log(`delta mean ${(mb - ma).toFixed(0)} ns (+${((mb / ma - 1) * 100).toFixed(1)}%); bar 10000 ns mean -> ${mb <= 10000 ? "UNDER" : "OVER"} (${(10000 / mb).toFixed(1)}x headroom)`);
console.log(`node ${process.version} ${process.platform} ${process.arch}; load1 ${loadavg()[0].toFixed(2)}`);
