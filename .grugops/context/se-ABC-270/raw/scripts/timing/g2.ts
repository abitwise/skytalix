// se-ABC-270 K3 (G2) reading, qe-ABC-274's g2.ts shape (ADR-0067 d8 A5 instrument) with arms B (main), C (main copy), H (head);
// every arm evaluateAtPhase(position, phaseOf(root)); six perft roots; N = 200 000 per root per round; 6 rounds, rounds 2/4/6
// reverse the arm list, round 1 dropped. r = mean(H) / mean(B), c = mean(C) / mean(B). argv: <dir with B,C,H> <order e.g. B,C,H>
const [S, orderArg] = process.argv.slice(2);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const mods: [string, (p: any, ph: number) => number, any][] = [];
for (const k of orderArg.split(",")) {
  const m = await import(`${S}/${k}/src/evaluate.ts`); const f = await import(`${S}/${k}/src/fen.ts`);
  mods.push([k, m.evaluateAtPhase, f.parseFen]);
}
const hEval = await import(`${S}/H/src/evaluate.ts`); const hFen = await import(`${S}/H/src/fen.ts`);
const PH = ROOTS.map((f) => hEval.phaseOf(hFen.parseFen(f)));
const N = 200_000; let sink = 0;
const time = (ev: any, p: any, ph: number) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p, ph); return Number(process.hrtime.bigint() - t) / N; };
const res: Record<string, number[]> = {};
for (let r = 0; r < 6; r++) {
  const order = r % 2 ? [...mods].reverse() : mods;
  for (const [tag, ev, pf] of order) { const per = ROOTS.map((f, i) => time(ev, pf(f), PH[i])); (res[tag] ??= []).push(per.reduce((a, b) => a + b) / per.length); }
}
const mean = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
const b = mean(res.B);
const mm = (a: number[]) => [Math.min(...a.slice(1)), Math.max(...a.slice(1))];
const out = { node: process.version, order: orderArg, phases: PH, rounds: res, mean: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mean(a)])),
  minmax: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mm(a)])), r: mean(res.H) / b, c: mean(res.C) / b, sink: sink % 7 };
console.log(JSON.stringify(out));
console.log(`r_s=${out.r} c_s=${out.c}`);
