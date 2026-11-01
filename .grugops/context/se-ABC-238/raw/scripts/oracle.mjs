// ABC-238 oracle readings in plain node on the head tree: A4 (fixed depth 8 nodes vs the door, both
// recursions reported), A3 drift at d5 on the 190 in both recursions, the 287 mate sign floor at d5.
// usage: node oracle.mjs <headTree> [a4|drift|mate|all]
const [H, what = "all"] = process.argv.slice(2);
const fen = await import(`${H}/src/fen.ts`);
const s = await import(`${H}/src/search.ts`);
const e = await import(`${H}/src/engine.ts`);
const legal = await import(`${H}/src/legal.ts`);
const apply = await import(`${H}/src/apply.ts`);
const ge = await import(`${H}/src/gameend.ts`);
const pos = await import(`${H}/src/position.ts`);
const { MATE_CORPUS } = await import(`${H}/src/search.mate-corpus.ts`);
const P = fen.parseFen;
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"], ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"], ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"], ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const corpus = [];
for (const [n, f] of ROOTS) {
  corpus.push([n, f]);
  const p = P(f);
  for (const m of legal.legalMoves(p)) {
    const u = apply.makeMove(p, m);
    if (ge.gameStatus(p).result === "in-progress") corpus.push([`${n}/${pos.squareName(m.from)}${pos.squareName(m.to)}`, fen.toFen(p)]);
    apply.unmakeMove(p, m, u);
  }
}
corpus.push(...ENDGAMES);
const isMate = (x) => Math.abs(x) > s.MATE_SCORE - 1000;
const deepen = (choose, f, d) => choose(P(f), { budgetMs: 1000, now: () => 0, maxDepth: d });
const t0 = Date.now();
const lap = () => `${((Date.now() - t0) / 1000).toFixed(1)} s`;
if (what === "a4" || what === "all") {
  for (const [n, f] of ROOTS.filter(([n]) => n === "kiwipete" || n === "position-6")) {
    const h = s.search(P(f), 8), d = s.searchWithoutDeeperCutoffs(P(f), 8);
    console.log(`A4 search ${n} d8: head ${h.nodes} door ${d.nodes} = ${(h.nodes / d.nodes).toFixed(4)}x; score ${d.score} -> ${h.score}; move same ${JSON.stringify(h.move) === JSON.stringify(d.move)} [${lap()}]`);
    const hc = deepen(e.chooseMove, f, 8), dc = deepen(e.chooseMoveWithoutDeeperCutoffs, f, 8);
    console.log(`A4 chooseMove ${n} to 8: head ${hc.nodes} door ${dc.nodes} = ${(hc.nodes / dc.nodes).toFixed(4)}x; score ${dc.score} -> ${hc.score} (report) [${lap()}]`);
  }
}
if (what === "drift" || what === "all") {
  console.log(`corpus ${corpus.length}`);
  for (const [label, on, ref] of [
    ["search() d5", (f) => s.search(P(f), 5).score, (f) => s.searchWithoutDeeperCutoffs(P(f), 5).score],
    ["chooseMove to d5", (f) => deepen(e.chooseMove, f, 5).score, (f) => deepen(e.chooseMoveWithoutDeeperCutoffs, f, 5).score],
  ]) {
    const deltas = []; let flips = 0, mates = 0, moved = 0;
    for (const [n, f] of corpus) {
      const r = ref(f), g = on(f);
      if (r !== g) moved++;
      if (isMate(r) || isMate(g)) { mates++; if (isMate(r) !== isMate(g) || Math.sign(r) !== Math.sign(g)) flips++; continue; }
      deltas.push([Math.abs(g - r), `${n}: ${r} -> ${g}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    const w = deltas.filter(([x]) => x <= 25).length;
    console.log(`A3 ${label}: ${w}/${deltas.length} = ${(100 * w / deltas.length).toFixed(2)}% within 25 cp; max ${deltas[0][0]} cp (${deltas[0][1]}); moved ${moved}/${corpus.length}; mate rows ${mates}, mate sign/status flips ${flips} [${lap()}]`);
    console.log(`  top5: ${deltas.slice(0, 5).map((x) => x[1]).join("; ")}`);
  }
}
if (what === "mate" || what === "all") {
  let mates = 0; const v = []; const dist = [];
  for (const f of MATE_CORPUS) {
    const r = s.searchWithoutDeeperCutoffs(P(f), 5).score;
    if (!isMate(r)) continue;
    mates++;
    const g = s.search(P(f), 5).score;
    if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v.push(`${f}: ${r} -> ${g}`);
    else if (g !== r) dist.push(`${r}->${g}`);
  }
  console.log(`mate sign floor d5 on ${MATE_CORPUS.length}: door mates ${mates}, violations ${v.length}; distance changes ${dist.length} (${dist.slice(0, 10).join(", ")}) [${lap()}]`);
  for (const x of v) console.log(`  VIOLATION ${x}`);
}
