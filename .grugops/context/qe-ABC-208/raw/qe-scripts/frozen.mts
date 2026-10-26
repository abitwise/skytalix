// QE qe-gate-ABC-208, Test note 4: nodes to complete depth k, chooseMove, now: () => 0, maxDepth: k.
// Usage: node frozen.mts <baseTreeRoot> <headTreeRoot>
const [baseRoot, headRoot] = process.argv.slice(2);
const load = async (root: string) => ({
  e: await import(`${root}/src/engine.ts`),
  fen: await import(`${root}/src/fen.ts`),
});
const B = await load(baseRoot as string);
const H = await load(headRoot as string);
const FENS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const run = (T: typeof B, fn: string, fen: string, k: number) => {
  const c = T.e[fn](T.fen.parseFen(fen), { budgetMs: 3_000, now: () => 0, maxDepth: k });
  return { depth: c.depth, nodes: c.nodes };
};
for (const [name, fen] of Object.entries(FENS)) {
  for (const k of [6, 7, 8, 9]) {
    const base = k <= 8 ? run(B, "chooseMove", fen, k) : null;
    const head = run(H, "chooseMove", fen, k);
    const door = k <= 8 ? run(H, "chooseMoveWithoutNullMove", fen, k) : null;
    const pct = base ? ((100 * (head.nodes - base.nodes)) / base.nodes).toFixed(1) : "";
    console.log(
      `${name} d${k}: base ${base ? `${base.nodes} (d${base.depth})` : "-"} head ${head.nodes} (d${head.depth}) ${pct}% ` +
        `head-door ${door ? `${door.nodes}${door.nodes === base?.nodes ? " = base" : " != base"}` : "-"}`,
    );
  }
}
