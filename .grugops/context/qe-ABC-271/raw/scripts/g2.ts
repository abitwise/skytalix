// qe-ABC-271 K3 (G2) under qe-ABC-271's sealed PREREG: qe-ABC-270's g2.ts (ADR-0067 d8 A5 shape), unchanged in its
// timing loop, run twice in the one process: first on the six perft roots (GRADED), then on the probe's six endgame
// report-set FENs (arch-ABC-271 G-BCH.out "egFens"; REPORTED, grades nothing). B, C, H: evaluateAtPhase.
// argv: S order ("B,C,H" or "H,C,B").
const [S, orderArg] = process.argv.slice(2);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const EG = ["r7/6k1/1p2p1p1/1n3p2/1BpP1PP1/P4K2/7R/8 w - - 0 44","R3r1k1/5p1p/2p3p1/1p4B1/p1n5/5P2/6PP/3R2K1 b - - 0 32","7r/1p1k2pp/4p3/3rP3/3K4/p7/R5PP/5R2 w - - 0 31","5r2/pp1k2b1/8/4pPK1/2pn4/P6R/1P3P2/5R2 w - - 1 31","8/1p5p/8/1Pn2p1R/2k4P/4K3/8/8 w - - 0 39","8/2p5/2P2k2/3r1p2/Kp1p2p1/3Pp1P1/4P1r1/2R3N1 w - - 0 38"];
const mods: [string, (p: any, ph: number) => number, any][] = [];
for (const k of orderArg.split(",")) {
  const m = await import(`${S}/${k}/src/evaluate.ts`); const f = await import(`${S}/${k}/src/fen.ts`);
  mods.push([k, m.evaluateAtPhase, f.parseFen]);
}
const hEval = await import(`${S}/H/src/evaluate.ts`); const hFen = await import(`${S}/H/src/fen.ts`);
const N = 200_000; let sink = 0;
const time = (ev: any, p: any, ph: number) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p, ph); return Number(process.hrtime.bigint() - t) / N; };
const mean = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
const mm = (a: number[]) => [Math.min(...a.slice(1)), Math.max(...a.slice(1))];
function run(set: string[]) {
  const PH = set.map((f) => hEval.phaseOf(hFen.parseFen(f))); // phase = phaseOf(position), once, before timing
  const res: Record<string, number[]> = {};
  for (let r = 0; r < 6; r++) {
    const order = r % 2 ? [...mods].reverse() : mods; // rounds 2, 4, 6 (from 1) reversed; round 1 dropped below
    for (const [tag, ev, pf] of order) { const per = set.map((f, i) => time(ev, pf(f), PH[i])); (res[tag] ??= []).push(per.reduce((a, b) => a + b) / per.length); }
  }
  const b = mean(res.B);
  return { phases: PH, rounds: res, mean: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mean(a)])),
    minmax: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mm(a)])), r: mean(res.H) / b, c: mean(res.C) / b };
}
const roots = run(ROOTS);
const eg = run(EG);
console.log(JSON.stringify({ node: process.version, order: orderArg, roots, eg, sink: sink % 7 }));
console.log(`r_s=${roots.r} c_s=${roots.c} eg_r=${eg.r} eg_c=${eg.c}`);
