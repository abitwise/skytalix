// qe-ABC-304 scratch probe. Reads only; imports the worktree's src. No src or test file is edited.
const W = process.argv[2];
const part = process.argv[3];
const { makeMove, unmakeMove } = await import(`${W}/src/apply.ts`);
const E = await import(`${W}/src/engine.ts`);
const Se = await import(`${W}/src/search.ts`);
const { parseFen, toFen } = await import(`${W}/src/fen.ts`);
const { gameStatus } = await import(`${W}/src/gameend.ts`);
const { legalMoves } = await import(`${W}/src/legal.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const { MATE_CORPUS } = await import(`${W}/src/search.mate-corpus.ts`);
const { PERFT_POSITIONS } = await import(`${W}/src/evaluate.mirror-corpus.ts`);
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;
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
const corpus = () => {
  const out = [];
  for (const [name, fen] of ROOTS) {
    out.push({ name, fen });
    const p = parseFen(fen);
    for (const mv of legalMoves(p)) {
      const u = makeMove(p, mv);
      if (gameStatus(p).result === "in-progress") out.push({ name: `${name}/${label(mv)}`, fen: toFen(p) });
      unmakeMove(p, mv, u);
    }
  }
  return [...out, ...ENDGAMES.map(([name, fen]) => ({ name, fen }))];
};
const isMate = (s) => Math.abs(s) > Se.MATE_SCORE - 1000;
const deepenTo = (c, fen, d) => c(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
if (part === "k0") {
  const fenOf = (n) => PERFT_POSITIONS.find((p) => p.name === n).fen;
  for (const [n, d] of [["kiwipete", 8], ["kiwipete", 9], ["position-6", 8], ["position-6", 9], ["position-6", 10]])
    console.log(`K0 ${n} chooseMove d${d}: door ${deepenTo(E.chooseMoveWithoutBundle, fenOf(n), d).nodes} shipped ${deepenTo(E.chooseMove, fenOf(n), d).nodes}`);
  for (const n of ["kiwipete", "position-6"])
    console.log(`K0 ${n} search d8: door ${Se.searchWithoutBundle(parseFen(fenOf(n)), 8).nodes} shipped ${Se.search(parseFen(fenOf(n)), 8).nodes}`);
}
if (part === "drift") {
  const rows = corpus();
  const drift = (what, on, ref) => {
    const ds = []; let flips = 0;
    for (const { name, fen } of rows) {
      const r = ref(fen), g = on(fen);
      if (isMate(r) || isMate(g)) { if (Math.sign(r) !== Math.sign(g)) flips++; continue; }
      ds.push([Math.abs(g - r), `${name}: ${r} -> ${g}`]);
    }
    ds.sort((a, b) => b[0] - a[0]);
    const w = ds.filter(([d]) => d <= 25).length;
    console.log(`A3(a) on ${what}: ${w}/${ds.length} = ${(100 * w / ds.length).toFixed(2)}%, max ${ds[0][0]} (${ds[0][1]}), flips ${flips}`);
  };
  drift("door searchWithoutBundle", (f) => Se.searchWithoutBundle(parseFen(f), 5).score, (f) => Se.searchWithoutSeePruning(parseFen(f), 5).score);
  drift("shipped search()", (f) => Se.search(parseFen(f), 5).score, (f) => Se.searchWithoutSeePruning(parseFen(f), 5).score);
  drift("door chooseMoveWithoutBundle", (f) => deepenTo(E.chooseMoveWithoutBundle, f, 5).score, (f) => deepenTo(E.chooseMoveWithoutSeePruning, f, 5).score);
  drift("shipped chooseMove", (f) => deepenTo(E.chooseMove, f, 5).score, (f) => deepenTo(E.chooseMoveWithoutSeePruning, f, 5).score);
}
if (part === "floor") {
  for (const [what, got] of [["shipped search()", Se.search], ["door searchWithoutBundle", Se.searchWithoutBundle]]) {
    let mates = 0; const bad = [];
    for (const fen of MATE_CORPUS) {
      const ref = Se.searchWithoutSeePruning(parseFen(fen), 5).score;
      if (!isMate(ref)) continue;
      mates++;
      const g = got(parseFen(fen), 5).score;
      if (!isMate(g) || Math.sign(g) !== Math.sign(ref)) bad.push(`${fen}: ${ref} -> ${g}`);
    }
    console.log(`A3(b) on ${what}: ${bad.length} of ${mates} violated`, bad);
  }
}
if (part === "reach") {
  const rows = corpus();
  const reach = (c) => rows.map(({ fen }) => {
    const x = c(parseFen(fen), { budgetMs: 1000, now: () => 0, maxNodes: 47000 });
    return { depth: x.depth, move: label(x.move) };
  });
  const mean = (xs) => xs.reduce((s, x) => s + x.depth, 0) / xs.length;
  const door = reach(E.chooseMoveWithoutSeePruning);
  for (const [what, c] of [["shipped chooseMove", E.chooseMove], ["door chooseMoveWithoutBundle", E.chooseMoveWithoutBundle]]) {
    const head = reach(c);
    const deeper = head.filter((x, i) => x.depth > door[i].depth).length;
    const shallower = head.filter((x, i) => x.depth < door[i].depth).length;
    const moved = head.filter((x, i) => x.move !== door[i].move).length;
    console.log(`A4(b) on ${what}: door ${mean(door).toFixed(3)} -> head ${mean(head).toFixed(3)} (+${(mean(head) - mean(door)).toFixed(3)}); ${deeper} deeper, ${shallower} shallower, ${moved} moved`);
  }
}
if (part === "nfr") {
  const { pawnCacheByteLength } = await import(`${W}/src/evaluate.ts`);
  const { captureScratchByteLength } = await import(`${W}/src/quiescence.ts`);
  const { seeScratchByteLength } = await import(`${W}/src/see.ts`);
  const { tableByteLength } = await import(`${W}/src/transposition.ts`);
  const t = { table: tableByteLength(), keys: (Se.KEY_ARRAY_CAPACITY + 1) * 8, pawn: pawnCacheByteLength(), order: Se.orderScratchByteLength(), capture: captureScratchByteLength(), see: seeScratchByteLength(), history: Se.historyByteLength() };
  const sum = Object.values(t).reduce((a, b) => a + b, 0);
  console.log(JSON.stringify(t), "sum", sum, "without history", sum - t.history, "MiB", (sum / 1048576).toFixed(3), "cap", 16 * 1048576);
}
