/**
 * ABC-082 A6: mean evaluate() cost per call, ABC-076's method — best of 5 x 2 000 000 calls per
 * position after warm-up, the six perft roots. Plain node. Usage: node cost.ts <tree-root>
 */
import { loadavg } from "node:os";
const root = process.argv[2];
const { evaluate } = await import(`${root}/src/evaluate.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const POS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const N = 2_000_000;
let sink = 0;
const out = {};
for (const [name, fen] of POS) {
  const p = parseFen(fen);
  for (let i = 0; i < 200_000; i++) sink += evaluate(p);
  let best = Infinity;
  for (let r = 0; r < 5; r++) {
    const t = process.hrtime.bigint();
    for (let i = 0; i < N; i++) sink += evaluate(p);
    const ns = Number(process.hrtime.bigint() - t) / N;
    if (ns < best) best = ns;
  }
  out[name] = Number(best.toFixed(1));
}
const vals = Object.values(out);
out.mean = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
console.log(JSON.stringify({ root: root.split("/").pop(), ...out, load1: loadavg()[0].toFixed(2), sink: sink % 7 }));
