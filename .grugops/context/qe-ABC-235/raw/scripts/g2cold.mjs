// G2 cache-COLD mean (INFO, not graded; the miss path). Six perft roots; per root W warm-up calls then N timed
// calls, each call preceded (untimed) by emptying the pawn memo: tip = clearPawnCacheForTest(); base has no memo, so
// it fills two Float64Array(2^14) with -1, the same work and cache pollution. Each call is timed alone
// (hrtime.bigint around one evaluate), so the timer's overhead is in both trees' means alike.
// usage: node g2cold.mjs <tree> [N]
import { loadavg } from "node:os";
const [root, nArg] = process.argv.slice(2);
const ev = await import(`${root}/src/evaluate.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const a = new Float64Array(1 << 14), b = new Float64Array(1 << 14);
const clear = ev.clearPawnCacheForTest ?? (() => { a.fill(-1); b.fill(-1); });
const POS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const N = Number(nArg ?? 20_000);
const l0 = loadavg()[0]; let sink = 0; const out = {};
for (const [name, fen] of POS) {
  const p = parseFen(fen);
  for (let i = 0; i < N / 10; i++) { clear(); sink += ev.evaluate(p); }
  let acc = 0n;
  for (let i = 0; i < N; i++) { clear(); const t = process.hrtime.bigint(); sink += ev.evaluate(p); acc += process.hrtime.bigint() - t; }
  out[name] = +(Number(acc) / N).toFixed(1);
}
const v = Object.values(out);
console.log(JSON.stringify({ tree: root.split("/").pop(), cold: !!ev.clearPawnCacheForTest, N, ...out, mean: +(v.reduce((x, y) => x + y) / v.length).toFixed(1), load1_before: +l0.toFixed(2), load1_after: +loadavg()[0].toFixed(2), at: new Date().toISOString(), sink: sink % 7 }));
