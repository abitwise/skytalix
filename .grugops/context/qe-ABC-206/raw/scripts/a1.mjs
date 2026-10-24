// A1 differential (scratch only). usage: node a1.mjs <treeDir> > out.jsonl
// Corpus: ABC-078 A3 deep corpus (ENDGAME_CORPUS + in-progress children; broadCorpus) plus two
// 148-clock roots. Searches: chooseMove (LMR on) + both doors at budgets 3 and 5 on tickingClock(1);
// search / searchWithoutReductions / searchWithoutPvsOrReductions / searchWithoutQuiescence at 1-3.
const tree = process.argv[2];
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const { gameStatus } = await import(`${tree}/src/gameend.ts`);
const engine = await import(`${tree}/src/engine.ts`);
const search = await import(`${tree}/src/search.ts`);

const PERFT = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const EXTRA = [
  ["thin-148", "8/4k3/8/8/2B5/4K3/8/8 w - - 148 120"],
  ["rooks-148", "r3k3/8/8/8/8/8/8/4K2R w - - 148 120"],
];

function expand(name, fen, plies) {
  const out = [];
  const p = parseFen(fen);
  const walk = (pn, left) => {
    if (left === 0) return;
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      const cn = `${pn}/${m.from}-${m.to}-${m.promotion}`;
      out.push([cn, toFen(p)]);
      walk(cn, left - 1);
      unmakeMove(p, m, u);
    }
  };
  walk(name, plies);
  return out;
}
const live = ([, fen]) => gameStatus(parseFen(fen)).result === "in-progress";

const corpus = [];
for (const [n, f] of [...ENDGAMES, ...EXTRA]) corpus.push([n, f], ...expand(n, f, 1).filter(live));
const broad = PERFT.flatMap(([n, f]) => [[n, f], ...expand(n, f, 1)]);
const gc = expand("position-3", PERFT[2][1], 2)
  .filter(([n]) => n.split("/").length === 3)
  .filter((_, i) => i % 5 === 0)
  .slice(0, 25);
corpus.push(...[...broad, ...gc].filter(live));

const lbl = (m) => (m ? `${m.from}-${m.to}-${m.promotion}-${m.flags}` : "null");
let rows = 0;
for (const [name, fen] of corpus) {
  for (const budgetMs of [3, 5, 12, 50]) {
    for (const fn of ["chooseMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"]) {
      let reads = 0;
      let t = 0;
      const now = () => {
        reads++;
        const r = t;
        t += 1;
        return r;
      };
      const p = parseFen(fen);
      const c = engine[fn](p, { budgetMs, now });
      const pure = toFen(p) === fen;
      console.log(JSON.stringify({ name, fn, budgetMs, move: lbl(c?.move), score: c?.score, depth: c?.depth, nodes: c?.nodes, reads, pure }));
      rows++;
    }
  }
  for (const depth of (name.includes("/") ? [1, 2, 3] : [1, 2, 3, 4])) {
    for (const fn of ["search", "searchWithoutReductions", "searchWithoutPvsOrReductions", "searchWithoutQuiescence"]) {
      const r = search[fn](parseFen(fen), depth);
      console.log(JSON.stringify({ name, fn, depth, move: lbl(r.move), score: r.score, nodes: r.nodes }));
      rows++;
    }
  }
}
console.error(`corpus ${corpus.length} rows ${rows}`);
