// SCRATCH PROBE (arch-ABC-291-probe), PR10's ns per node: search() at a fixed depth on G2's six roots, three rounds with
// round 1 dropped, arms as g2.ts. argv: <scratch root> <order> <depth>. A report; it decides nothing.
const [S, orderArg, depthArg] = process.argv.slice(2) as [string, string, string];
const depth = Number(depthArg);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const dirs: Record<string, string> = { B: "main", C: "main2", H: "cand" };
const arms: [string, any, any][] = [];
for (const k of orderArg.split(",")) {
  arms.push([k, (await import(`${S}/${dirs[k]}/src/search.ts`)).search, (await import(`${S}/${dirs[k]}/src/fen.ts`)).parseFen]);
}
const res: Record<string, { ns: number; nodes: number }[]> = {};
for (let r = 0; r < 3; r++) {
  for (const [k, search, parseFen] of r % 2 ? [...arms].reverse() : arms) {
    let nodes = 0;
    const t = process.hrtime.bigint();
    for (const fen of ROOTS) nodes += search(parseFen(fen), depth).nodes;
    (res[k] ??= []).push({ ns: Number(process.hrtime.bigint() - t), nodes });
  }
}
const per = (k: string) => { const a = (res[k] as { ns: number; nodes: number }[]).slice(1); return a.reduce((x, y) => x + y.ns, 0) / a.reduce((x, y) => x + y.nodes, 0); };
console.log(JSON.stringify({ order: orderArg, depth, nsPerNode: { B: per("B"), C: per("C"), H: per("H") }, nodes: { B: (res.B as any)[1].nodes, H: (res.H as any)[1].nodes }, h_over_b: per("H") / per("B"), c_over_b: per("C") / per("B") }));
