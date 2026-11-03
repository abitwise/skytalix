// se-ABC-269 B6 (G2) reading: ns per evaluate call, the build against main (src tree 58fa3eb4), same process,
// ABC-076's shape: the six perft roots, rounds in alternating order. A REPORT; timing on a shared host.
const [W, B, roundsArg] = process.argv.slice(2);
const head = await import(`${W}/src/evaluate.ts`);
const base = await import(`${B}/src/evaluate.ts`);
const { parseFen: pfH } = await import(`${W}/src/fen.ts`);
const { parseFen: pfB } = await import(`${B}/src/fen.ts`);
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const N = 200_000;
let sink = 0;
const time = (ev: (p: any) => number, p: any) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p); return Number(process.hrtime.bigint() - t) / N; };
const rounds = Number(roundsArg ?? 4);
const res: Record<string, number[]> = { head: [], base: [] };
for (let r = 0; r < rounds; r++) {
  const order = r % 2 === 0 ? ["base", "head"] : ["head", "base"];
  for (const who of order) {
    const ev = who === "head" ? head.evaluate : base.evaluate;
    const pf = who === "head" ? pfH : pfB;
    const per = ROOTS.map((f) => time(ev, pf(f)));
    res[who].push(per.reduce((a, b) => a + b, 0) / per.length);
  }
}
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
console.log(JSON.stringify({ node: process.version, rounds, head: res.head.map((x) => +x.toFixed(1)), base: res.base.map((x) => +x.toFixed(1)), ratio: +(mean(res.head) / mean(res.base)).toFixed(4), sink: sink % 7 }));
