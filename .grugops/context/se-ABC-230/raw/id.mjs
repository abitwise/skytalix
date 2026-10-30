// ABC-230 identity harness (scratch only, plain node; the ABC-235 a1.mjs pattern).
// usage: node id.mjs <treeDir> <part> > out.jsonl
// part: corpus | choose | choose-empty | clock0 | doors-prior | level | level-empty
// A base tree ignores `priorKeys` (unknown field), so every part must be byte-equal base vs head.
const [tree, part] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const { gameStatus } = await import(`${tree}/src/gameend.ts`);
const { zobristKey } = await import(`${tree}/src/zobrist.ts`);
const engine = await import(`${tree}/src/engine.ts`);
const levels = await import(`${tree}/src/levels.ts`);

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
const a3 = [];
for (const [n, f] of ENDGAMES) a3.push([n, f], ...expand(n, f, 1).filter(live));
const broad = PERFT.flatMap(([n, f]) => [[n, f], ...expand(n, f, 1)]);
const gc = expand("position-3", PERFT[2][1], 2)
  .filter(([n]) => n.split("/").length === 3)
  .filter((_, i) => i % 5 === 0)
  .slice(0, 25);
a3.push(...[...broad, ...gc].filter(live));
const c190 = [...PERFT.flatMap(([n, f]) => [[n, f], ...expand(n, f, 1).filter(live)]), ...ENDGAMES];
const seen = new Set();
const corpus = [];
for (const row of [...a3, ...c190]) {
  if (seen.has(row[1])) continue;
  seen.add(row[1]);
  corpus.push(row);
}

const lbl = (m) => (m ? `${m.from}-${m.to}-${m.promotion}-${m.flags}` : "null");
const out = (o) => process.stdout.write(`${JSON.stringify(o)}\n`);
const ticking = () => {
  let t = 0;
  const now = () => {
    now.reads++;
    const r = t;
    t += 1;
    return r;
  };
  now.reads = 0;
  return now;
};
/** Adversarial prior list: the last 25 positions 1-2 plies on, each key 4 times (2 per parity). */
function adversarial(fen) {
  const keys = [];
  for (const [, f] of expand("x", fen, 2)) keys.push(zobristKey(parseFen(f)));
  const doubled = [];
  for (const k of keys.slice(-25)) doubled.push(k, k, k, k);
  return doubled;
}
const withClock = (fen, clock) => {
  const f = fen.split(" ");
  f[4] = String(clock);
  return f.join(" ");
};
const FNS = ["chooseMove", "chooseMoveWithoutNullMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"];
let rows = 0;
if (part === "corpus") {
  out({ unique: corpus.length });
  for (const [name, fen] of corpus) out({ name, fen });
}
for (const [name, fen] of corpus) {
  if (part === "choose" || part === "choose-empty" || part === "doors-prior" || part === "clock0" || part === "nonvac") {
    const root = part === "clock0" ? withClock(fen, 0) : part === "doors-prior" || part === "nonvac" ? withClock(fen, 99) : fen;
    const fns = part === "doors-prior" ? FNS.slice(1) : part === "nonvac" ? FNS.slice(0, 1) : FNS;
    for (const budgetMs of [3, 5]) {
      for (const fn of fns) {
        const now = ticking();
        const p = parseFen(root);
        const extra =
          part === "choose" ? {} : part === "choose-empty" ? { priorKeys: [] } : { priorKeys: adversarial(root) };
        const c = engine[fn](p, { budgetMs, now, ...extra });
        out({ name, fn, budgetMs, move: lbl(c?.move), score: c?.score, depth: c?.depth, nodes: c?.nodes, reads: now.reads, pure: toFen(p) === root });
        rows++;
      }
    }
  }
  if (part === "level" || part === "level-empty") {
    for (const id of [1, 3, 5]) {
      for (const seed of [1, 7]) {
        const now = ticking();
        const choose = levels.createLevel({ budgetMs: 4, blunderRate: levels.LEVELS[id].blunderRate }, { seed, now });
        const p = parseFen(fen);
        const c = part === "level" ? choose(p) : choose(p, []);
        out({ name, id, seed, kind: c?.kind, move: lbl(c?.move), depth: c?.depth, nodes: c?.nodes, scored: c?.scored?.map((s) => s.score).join(","), reads: now.reads, pure: toFen(p) === fen });
        rows++;
      }
    }
  }
}
console.error(`part ${part} corpus ${corpus.length} rows ${rows}`);
