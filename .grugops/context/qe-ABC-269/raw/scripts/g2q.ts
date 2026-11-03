// qe-ABC-269 G2 (B6) reading under PREREG arch-ABC-269-F3 ...e36ee7ca. g2b.ts's shape.
// argv: S order(e.g. "B,C,U,H")
const [S, orderArg] = process.argv.slice(2);
const dirs: Record<string, string> = { B: `${S}/B`, C: `${S}/C`, H: `${S}/H`, U: `${S}/U` };
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const mods: [string, (p: any, ph: number) => number, any][] = [];
for (const k of orderArg.split(",")) {
  const m = await import(`${dirs[k]}/src/evaluate.ts`); const f = await import(`${dirs[k]}/src/fen.ts`);
  mods.push([k, k === "H" ? m.evaluateAtPhase : m.evaluate, f.parseFen]);
}
const hEval = await import(`${dirs.H}/src/evaluate.ts`); const hFen = await import(`${dirs.H}/src/fen.ts`); // same instances as arm H
const PH = ROOTS.map((f) => hEval.phaseOf(hFen.parseFen(f))); // phase = phaseOf(root), once per root, before timing
const N = 200_000; let sink = 0;
const time = (ev: any, p: any, ph: number) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p, ph); return Number(process.hrtime.bigint() - t) / N; };
const res: Record<string, number[]> = {};
for (let r = 0; r < 6; r++) {
  const order = r % 2 ? [...mods].reverse() : mods;
  for (const [tag, ev, pf] of order) { const per = ROOTS.map((f, i) => time(ev, pf(f), PH[i])); (res[tag] ??= []).push(per.reduce((a, b) => a + b) / per.length); }
}
const mean = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
const b = mean(res.B);
const out = { node: process.version, order: orderArg, phases: PH, rounds: res, mean: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mean(a)])), r: mean(res.H) / b, c: mean(res.C) / b, u: mean(res.U) / b, sink: sink % 7 };
console.log(JSON.stringify(out));
console.log(`r_s=${out.r} c_s=${out.c} u_s=${out.u}`);
