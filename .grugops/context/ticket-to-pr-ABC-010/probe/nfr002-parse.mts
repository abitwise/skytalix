// ABC-010 SE probe, NFR-002: mean µs per parseFen call, base vs branch, ONE process, interleaved
// blocks. Usage: node nfr002-parse.mts <baseTree> <branchTree>. Reads only.
import { cpus, loadavg } from "node:os";
const [baseTree, headTree] = process.argv.slice(2);
const base = (await import(`${baseTree}/src/fen.ts`)).parseFen;
const head = (await import(`${headTree}/src/fen.ts`)).parseFen;
const FENS = [ // the per-frame callers parse START_FEN / the history's initialFen; perft table for breadth
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
];
const N = 20_000; let sink = 0;
const block = (f) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += f(FENS[i % FENS.length]).halfmoveClock; return Number(process.hrtime.bigint() - t) / 1000 / N; };
for (let w = 0; w < 5; w++) { block(base); block(head); }
const b = [], h = [];
for (let r = 0; r < 30; r++) { if (r % 2) { h.push(block(head)); b.push(block(base)); } else { b.push(block(base)); h.push(block(head)); } }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return (s[14] + s[15]) / 2; };
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
console.log(`${cpus()[0].model}, Node ${process.version}, load1 ${loadavg()[0].toFixed(2)}, ${FENS.length} FENs, 30 blocks x ${N} calls each arm, interleaved`);
console.log(`base   parseFen: mean ${mean(b).toFixed(3)} µs/call, median-of-blocks ${med(b).toFixed(3)}`);
console.log(`branch parseFen: mean ${mean(h).toFixed(3)} µs/call, median-of-blocks ${med(h).toFixed(3)}  (bar <= 10 µs)`);
console.log(`delta mean ${(mean(h) - mean(b)).toFixed(3)} µs; sink ${sink}`);
