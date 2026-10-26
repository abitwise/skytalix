// QE: is each default-lane survivor observable? Pristine head vs a planted tree, function by function.
// Usage: node survivors.mts <headTree> <plantedTree> <fn> <search|engine>
const [headRoot, plantRoot, fn, kind] = process.argv.slice(2);
const load = async (r: string) => ({
  s: await import(`${r}/src/search.ts`), e: await import(`${r}/src/engine.ts`), fen: await import(`${r}/src/fen.ts`),
  legal: await import(`${r}/src/legal.ts`), apply: await import(`${r}/src/apply.ts`), ge: await import(`${r}/src/gameend.ts`),
  mc: await import(`${r}/src/search.mate-corpus.ts`),
});
const H = await load(headRoot as string), P = await load(plantRoot as string);
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const c190: string[] = [];
for (const fen of ROOTS) {
  c190.push(fen);
  const p = H.fen.parseFen(fen);
  for (const mv of H.legal.legalMoves(p)) {
    const u = H.apply.makeMove(p, mv);
    if (H.ge.gameStatus(p).result === "in-progress") c190.push(H.fen.toFen(p));
    H.apply.unmakeMove(p, mv, u);
  }
}
let cells = 0, nodeDiff = 0, valueDiff = 0;
const ex: string[] = [];
const cmp = (where: string, h: any, p: any) => {
  cells++;
  const mv = (m: any) => (m ? `${m.from}-${m.to}` : "none");
  if (h.nodes !== p.nodes) nodeDiff++;
  if (h.score !== p.score || mv(h.move) !== mv(p.move)) { valueDiff++; if (ex.length < 4) ex.push(`${where}: ${h.score}/${mv(h.move)} -> ${p.score}/${mv(p.move)}`); }
};
const fens = [...c190, ...(H.mc.MATE_CORPUS as string[]).slice(0, 287)];
for (const [i, fen] of fens.entries()) {
  const depths = kind === "search" ? (i < 190 ? [4, 5] : [5]) : [5];
  for (const d of depths) {
    if (kind === "search") cmp(`${fen} d${d}`, H.s[fn](H.fen.parseFen(fen), d), P.s[fn](P.fen.parseFen(fen), d));
    else {
      const o = () => ({ budgetMs: 1_000, now: () => 0, maxDepth: d });
      cmp(`${fen} md${d}`, H.e[fn](H.fen.parseFen(fen), o()), P.e[fn](P.fen.parseFen(fen), o()));
    }
  }
}
console.log(`${plantRoot.split("/").pop()} ${fn}: ${cells} cells (the 190 at d4+d5 / md5, the 287 at d5); node diffs ${nodeDiff}; score-or-move diffs ${valueDiff}`, ex);
