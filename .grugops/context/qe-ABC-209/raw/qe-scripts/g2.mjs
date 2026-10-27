// G2 (ABC-083 A5 / ABC-076 method, from ticket-to-pr-ABC-083/probe/cost.mjs): mean cost per call of the complete
// evaluation, best of 5 x N per root after an N/10 warm-up, the six perft roots, plain node, one tree per fresh process.
// usage: node g2.mjs <tree> [N]
import { loadavg } from "node:os";
const [root, nArg] = process.argv.slice(2);
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
const N = Number(nArg ?? 1_000_000);
const l0 = loadavg()[0]; let sink = 0; const out = {};
const t0 = new Date().toISOString();
for (const [name, fen] of POS) {
  const p = parseFen(fen);
  const before = JSON.stringify([...p.board, p.blackToMove, p.epSquare, p.castling]);
  for (let i = 0; i < N / 10; i++) sink += evaluate(p);
  let best = Infinity;
  for (let r = 0; r < 5; r++) { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += evaluate(p); best = Math.min(best, Number(process.hrtime.bigint() - t) / N); }
  if (JSON.stringify([...p.board, p.blackToMove, p.epSquare, p.castling]) !== before) throw new Error(`${name}: position mutated`);
  out[name] = +best.toFixed(1);
}
const v = Object.values(out);
const tree = root.endsWith("/base") ? "base" : root.endsWith("/head") ? "head" : root;
console.log(JSON.stringify({ tree, N, ...out, mean: +(v.reduce((a, b) => a + b) / v.length).toFixed(1), load1_before: +l0.toFixed(2), load1_after: +loadavg()[0].toFixed(2), node: process.version, start: t0, at: new Date().toISOString(), sink: sink % 7 }));
