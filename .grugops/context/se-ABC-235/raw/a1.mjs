// ABC-235 A1 differential (scratch only, plain node). usage:
//   node a1.mjs <treeDir> <part> [shard/of]  > out.jsonl
// part: "corpus" | "lists" | "choose" | "search" | "doors" | "unpruned"
// Corpus: ABC-078 A3 (ENDGAME_CORPUS + in-progress children; broadCorpus) and ABC-121's 190, deduped by
// FEN, first name kept. Every row is compared byte for byte between the base tree and a head tree.
const [tree, part, shardArg] = process.argv.slice(2);
const [shard, of] = (shardArg ?? "0/1").split("/").map(Number);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const legal = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const { gameStatus } = await import(`${tree}/src/gameend.ts`);
const { evaluate, evaluateWithoutMobility } = await import(`${tree}/src/evaluate.ts`);
const engine = await import(`${tree}/src/engine.ts`);
const search = await import(`${tree}/src/search.ts`);
const { legalMoves } = legal;

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

// ABC-078 A3: endgames with in-progress children, then broadCorpus.
const a3 = [];
for (const [n, f] of ENDGAMES) a3.push([n, f], ...expand(n, f, 1).filter(live));
const broad = PERFT.flatMap(([n, f]) => [[n, f], ...expand(n, f, 1)]);
const gc = expand("position-3", PERFT[2][1], 2)
  .filter(([n]) => n.split("/").length === 3)
  .filter((_, i) => i % 5 === 0)
  .slice(0, 25);
a3.push(...[...broad, ...gc].filter(live));
// ABC-121's 190: each root, its in-progress children, then the endgames.
const c190 = [...PERFT.flatMap(([n, f]) => [[n, f], ...expand(n, f, 1).filter(live)]), ...ENDGAMES];
const seen = new Set();
const corpus = [];
for (const row of [...a3, ...c190]) {
  if (seen.has(row[1])) continue;
  seen.add(row[1]);
  corpus.push(row);
}
const mine = corpus.filter((_, i) => i % of === shard);

const lbl = (m) => (m ? `${m.from}-${m.to}-${m.promotion}-${m.flags}` : "null");
const out = (o) => process.stdout.write(`${JSON.stringify(o)}\n`);
let rows = 0;

if (part === "corpus") {
  out({ a3: a3.length, c190: c190.length, unique: corpus.length });
  for (const [name, fen] of corpus) out({ name, fen });
}

for (const [name, fen] of mine) {
  if (part === "lists") {
    const p = parseFen(fen);
    out({
      name,
      legal: legalMoves(p).map(lbl).join(" "),
      caps: legal.legalCaptures(p).map(lbl).join(" "),
      has: legal.hasLegalMove(p),
      check: legal.isInCheck(p),
      ep: legal.hasLegalEnPassant(p),
      eval: evaluate(p),
      evalNoMob: evaluateWithoutMobility(p),
      pure: toFen(p) === fen,
    });
    rows++;
  }
  if (part === "choose") {
    for (const budgetMs of [3, 5]) {
      for (const fn of [
        "chooseMove",
        "chooseMoveWithoutNullMove",
        "chooseMoveWithoutReductions",
        "chooseMoveWithoutPvsOrReductions",
      ]) {
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
        out({ name, fn, budgetMs, move: lbl(c?.move), score: c?.score, depth: c?.depth, nodes: c?.nodes, reads, pure: toFen(p) === fen });
        rows++;
      }
    }
  }
  const fns =
    part === "search"
      ? ["search", "searchWithoutNullMove", "searchWithoutReductions", "searchWithoutPvsOrReductions"]
      : part === "doors"
        ? ["searchWithoutTable", "searchWithoutKillers", "searchWithoutOrdering", "searchWithoutQuiescence"]
        : part === "unpruned"
          ? ["searchWithoutPruning", "searchWithoutPruningOrQuiescence"]
          : [];
  const depth = part === "unpruned" ? Number(process.env.A1_UNPRUNED_DEPTH ?? 2) : part === "doors" ? Number(process.env.A1_DOOR_DEPTH ?? 5) : 5;
  for (const fn of fns) {
    const p = parseFen(fen);
    const r = search[fn](p, depth);
    out({ name, fn, depth, move: lbl(r.move), score: r.score, nodes: r.nodes, pure: toFen(p) === fen });
    rows++;
  }
}
console.error(`part ${part} shard ${shard}/${of} corpus ${corpus.length} mine ${mine.length} rows ${rows}`);
