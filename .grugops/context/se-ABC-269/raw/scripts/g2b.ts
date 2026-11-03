// split reading: base evaluate, head evaluate, head evaluateWithoutTaper, and variant dirs; ns/call, 6 roots, alternating.
const [B, ...Ws] = process.argv.slice(2);
const mods: [string, (p: any) => number, any][] = [];
const base = await import(`${B}/src/evaluate.ts`); const bf = await import(`${B}/src/fen.ts`);
mods.push(["base", base.evaluate, bf.parseFen]);
for (const W of Ws) {
  const m = await import(`${W}/src/evaluate.ts`); const f = await import(`${W}/src/fen.ts`);
  const tag = W.split("/").pop();
  mods.push([`${tag}:evaluate`, m.evaluate, f.parseFen]);
  if (m.evaluateWithoutTaper) mods.push([`${tag}:withoutTaper`, m.evaluateWithoutTaper, f.parseFen]);
}
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const N = 200_000; let sink = 0;
const time = (ev: any, p: any) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p); return Number(process.hrtime.bigint() - t) / N; };
const res: Record<string, number[]> = {};
for (let r = 0; r < 6; r++) {
  const order = r % 2 ? [...mods].reverse() : mods;
  for (const [tag, ev, pf] of order) { const per = ROOTS.map((f) => time(ev, pf(f))); (res[tag] ??= []).push(per.reduce((a, b) => a + b) / per.length); }
}
const mean = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
const b = mean(res.base);
for (const [t, a] of Object.entries(res)) console.log(t.padEnd(28), mean(a).toFixed(1), (mean(a) / b).toFixed(4));
console.log("sink", sink % 7);
