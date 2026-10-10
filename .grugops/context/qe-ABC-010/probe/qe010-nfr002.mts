// QE qe-ABC-010 NFR-002 reading (QE's own). Usage: node qe010-nfr002.mts <base-tree> <head-tree> [blocks] [callsPerBlock]
// One process, both parsers loaded, blocks interleaved (ABAB...), per-call mean in µs per arm. Reads only.
// Bar (ticket § Security / NFR triggers): validated parseFen <= 10 µs mean per call. Not asserted in the suite.
import { loadavg } from "node:os";
const [baseTree, headTree] = process.argv.slice(2);
const BLOCKS = Number(process.argv[4] ?? 40);
const CALLS = Number(process.argv[5] ?? 20000);
const base = (await import(`${baseTree}/src/fen.ts`)).parseFen;
const head = (await import(`${headTree}/src/fen.ts`)).parseFen;
// Production-shaped inputs: START, the five other perft roots, a mid-game history FEN with ep and castling.
const FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "rnbqkbnr/pppp1ppp/8/4pP2/8/8/PPPPP1PP/RNBQKBNR w KQkq e6 0 3",
];
let sink = 0;
const block = (fn: (f: string) => { halfmoveClock: number }) => {
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < CALLS; i++) sink += fn(FENS[i % FENS.length] as string).halfmoveClock;
  return Number(process.hrtime.bigint() - t0) / 1000 / CALLS;
};
const l0 = loadavg()[0];
for (let w = 0; w < 5; w++) { block(base); block(head); } // warm-up, discarded
const a: number[] = [];
const b: number[] = [];
for (let k = 0; k < BLOCKS; k++) {
  if (k % 2 === 0) { a.push(block(base)); b.push(block(head)); } else { b.push(block(head)); a.push(block(base)); }
}
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const median = (xs: number[]) => { const s = [...xs].sort((x, y) => x - y); return ((s[(s.length - 1) >> 1] as number) + (s[s.length >> 1] as number)) / 2; };
console.log(`node ${process.version}; ${BLOCKS} blocks x ${CALLS} calls per arm over ${FENS.length} FENs; load1 start ${l0.toFixed(2)} end ${loadavg()[0].toFixed(2)}`);
console.log(`base parseFen  mean ${mean(a).toFixed(3)} µs/call  median-of-blocks ${median(a).toFixed(3)}  max-block ${Math.max(...a).toFixed(3)}`);
console.log(`head parseFen  mean ${mean(b).toFixed(3)} µs/call  median-of-blocks ${median(b).toFixed(3)}  max-block ${Math.max(...b).toFixed(3)}`);
console.log(`delta (head - base) mean ${(mean(b) - mean(a)).toFixed(3)} µs; bar 10 µs: ${mean(b) <= 10 ? "MET" : "NOT MET - stop and report to Security/NFR"}; sink ${sink > 0 ? "live" : "dead"}`);
