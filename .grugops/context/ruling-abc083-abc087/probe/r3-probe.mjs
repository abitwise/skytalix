// R3 (ABC-087) probe. Read-only against the worktree's src/; the patched copy (./r3/src) adds
// ONE probe-only switch to src/search.ts (`fullRoot`: every root move gets the full window, so
// every root move gets an exact score) and an evaluate() call counter. Nothing here is the build.
// Usage: node r3-probe.mjs <worktree-root> <copy-root> <part>   part: identity | cost | scores | split | evalcalls
const [W, C, part] = process.argv.slice(2);
const copy = {
  search: await import(`${C}/src/search.ts`),
  evaluate: await import(`${C}/src/evaluate.ts`),
};
const tree = {
  search: await import(`${W}/src/search.ts`),
  engine: await import(`${W}/src/engine.ts`),
  clock: await import(`${W}/src/virtual-clock.ts`),
  fen: await import(`${W}/src/fen.ts`),
  legal: await import(`${W}/src/legal.ts`),
  apply: await import(`${W}/src/apply.ts`),
  gameend: await import(`${W}/src/gameend.ts`),
  corpus: await import(`${W}/src/evaluate.mirror-corpus.ts`),
  puzzles: await import(`${W}/src/puzzle-corpus.ts`),
};
const { parseFen } = tree.fen;
const ROOTS = tree.corpus.PERFT_POSITIONS;
const out = (o) => console.log(JSON.stringify(o));

if (part === "identity") {
  // The copy's shipped search() must be the worktree's, node for node and score for score.
  for (const { name, fen } of ROOTS) {
    for (const d of [3, 4]) {
      const a = tree.search.search(parseFen(fen), d);
      const b = copy.search.search(parseFen(fen), d);
      out({ part, name, d, same: a.nodes === b.nodes && a.score === b.score, nodes: a.nodes });
    }
  }
}

if (part === "cost") {
  // Construction (b)'s price: nodes with every root move on the full window vs shipped search().
  const depths = (process.argv[5] ?? "3,4,5").split(",").map(Number);
  for (const { name, fen } of ROOTS) {
    for (const d of depths) {
      const s = copy.search.search(parseFen(fen), d);
      const f = copy.search.searchFullRoot(parseFen(fen), d);
      out({ part, name, d, shipped: s.nodes, fullRoot: f.nodes, ratio: +(f.nodes / s.nodes).toFixed(3), sameBestScore: s.score === f.score });
    }
  }
}

if (part === "scores") {
  // What each blunder rule would play, on exact per-move scores (full-window root, depth d).
  const d = Number(process.argv[5] ?? 3);
  const positions = [
    ...tree.corpus.buildCorpus().map((e) => ({ set: "corpus184", name: e.name, position: e.position })),
    ...tree.puzzles.PUZZLES.map((p) => ({ set: "puzzles40", name: p.name, position: parseFen(p.fen) })),
  ];
  for (const { set, name, position } of positions) {
    copy.search.searchFullRoot(position, d);
    const scores = copy.search.SCORED.map((x) => x.score).sort((a, b) => b - a);
    if (scores.length < 2) { out({ part, set, name, moves: scores.length }); continue; }
    const best = scores[0], worst = scores[scores.length - 1];
    const tieTop = scores[1] === best;
    const middle = scores.filter((s) => s < best && s > worst); // strictly below best, strictly above worst
    const second = middle.length ? middle[0] : null;
    // BA/PM's alternative: uniform over every move that is neither best-scored nor worst-scored.
    const uni = middle;
    // ... and the literal reading: uniform over every move that is not worst-scored (best included).
    const nonWorst = scores.filter((s) => s > worst);
    out({
      part, set, name, d, moves: scores.length, best, worst, tieTop,
      distinct: new Set(scores).size,
      secondLoss: second === null ? null : best - second,
      uniMeanLoss: uni.length ? +(uni.reduce((a, s) => a + (best - s), 0) / uni.length).toFixed(1) : null,
      uniP300: uni.length ? +(uni.filter((s) => best - s >= 300).length / uni.length).toFixed(3) : null,
      nonWorstP300: nonWorst.length ? +(nonWorst.filter((s) => best - s >= 300).length / nonWorst.length).toFixed(3) : null,
    });
  }
}

if (part === "split") {
  // Construction (a): every root move scored by the SHIPPED chooseMove on the child, one shared
  // virtual clock, child i's deadline at start + B(i+1)/N. Compared with chooseMove on the root.
  const B = Number(process.argv[5] ?? 3000);
  const step = Number(process.argv[6] ?? 5);
  const { chooseMove } = tree.engine;
  const { legalMoves } = tree.legal;
  const { makeMove, unmakeMove } = tree.apply;
  const names = ["startpos", "kiwipete", "position-6"];
  for (const { name, fen } of ROOTS.filter((r) => names.includes(r.name))) {
    const p = parseFen(fen);
    const now1 = tree.clock.virtualClock(step);
    const main = chooseMove(p, { budgetMs: B, now: now1 });
    const now = tree.clock.virtualClock(step);
    const start = now();
    const moves = legalMoves(p);
    const depths = [];
    let nodes = 0;
    const scored = [];
    moves.forEach((m, i) => {
      const undo = makeMove(p, m);
      try {
        const left = start + (B * (i + 1)) / moves.length - now();
        const c = chooseMove(p, { budgetMs: left, now });
        if (c === null) { depths.push(0); scored.push(tree.gameend.gameStatus(p).reason === "checkmate" ? 30000 : 0); }
        else { depths.push(c.depth); nodes += c.nodes; scored.push(0 - c.score); }
      } finally { unmakeMove(p, m, undo); }
    });
    const elapsed = now() - start;
    depths.sort((a, b) => a - b);
    out({ part, name, B, step, mainDepth: main.depth, mainNodes: main.nodes, children: moves.length, childDepthMin: depths[0], childDepthMedian: depths[depths.length >> 1], childDepthMax: depths[depths.length - 1], childNodes: nodes, virtualElapsed: elapsed, mainElapsed: main.elapsedMs });
  }
}

if (part === "evalcalls") {
  // evaluate() calls per search node, shipped search(), for R1's per-node arithmetic.
  for (const name of ["kiwipete", "position-6"]) {
    const fen = ROOTS.find((r) => r.name === name).fen;
    for (const d of [5, 6]) {
      copy.evaluate.EVAL_CALLS.n = 0;
      const s = copy.search.search(parseFen(fen), d);
      out({ part, name, d, nodes: s.nodes, evalCalls: copy.evaluate.EVAL_CALLS.n, perNode: +(copy.evaluate.EVAL_CALLS.n / s.nodes).toFixed(3) });
    }
  }
}
