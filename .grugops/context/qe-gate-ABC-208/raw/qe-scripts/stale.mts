// QE: the stale-null-key plants at depths where the null child is a real subtree (root depth >= 6).
// Usage: node stale.mts <headTree> <plantedTree> <search|engine>
const [headRoot, plantRoot, kind] = process.argv.slice(2);
const load = async (r: string) => ({ s: await import(`${r}/src/search.ts`), e: await import(`${r}/src/engine.ts`), fen: await import(`${r}/src/fen.ts`) });
const H = await load(headRoot as string), P = await load(plantRoot as string);
const FENS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "zugzwang.001": "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1",
};
for (const [name, fen] of Object.entries(FENS)) {
  for (const d of [6, 7]) {
    const run = (T: typeof H) =>
      kind === "search" ? T.s.search(T.fen.parseFen(fen), d) : T.e.chooseMove(T.fen.parseFen(fen), { budgetMs: 1_000, now: () => 0, maxDepth: d });
    const h = run(H), p = run(P);
    const mv = (m: any) => (m ? `${m.from}-${m.to}` : "none");
    console.log(`${kind} ${name} d${d}: head ${h.nodes}/${h.score}/${mv(h.move)} planted ${p.nodes}/${p.score}/${mv(p.move)} ${h.nodes === p.nodes && h.score === p.score ? "SAME" : "DIFF"}`);
  }
}
