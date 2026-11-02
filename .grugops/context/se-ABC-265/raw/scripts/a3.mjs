// ABC-265 A3 (G4, T8), cross-build: head search()/chooseMove and every test-only door equal base's,
// node for node, score and move, out of tree in plain node. Threads 1 (the only mode).
// usage: node a3.mjs <baseTree> <headTree>
import { createHash } from "node:crypto";
const [B, H] = process.argv.slice(2);
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`),
  s: await import(`${T}/src/search.ts`),
  e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`),
  apply: await import(`${T}/src/apply.ts`),
  ge: await import(`${T}/src/gameend.ts`),
  z: await import(`${T}/src/zobrist.ts`),
});
const b = await load(B);
const h = await load(H);
const PERFT = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
// The ABC-078 A3 corpus as se-ABC-264's a1.mjs builds it: 12 roots and their in-progress children.
const ROOTS = [
  ...PERFT,
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1",
  "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
const corpus = [];
for (const f of ROOTS) {
  corpus.push(f);
  const p = h.fen.parseFen(f);
  for (const m of h.legal.legalMoves(p)) {
    const u = h.apply.makeMove(p, m);
    if (h.ge.gameStatus(p).result === "in-progress") corpus.push(h.fen.toFen(p));
    h.apply.unmakeMove(p, m, u);
  }
}
const mv = (m) => (m ? `${m.from}-${m.to}-${m.promotion}` : "null");
const row = (r) => `${r.nodes}|${r.score}|${mv(r.move)}|${r.depth ?? ""}`;
const fixed = (E, name) => (f, d) => E.e[name](E.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d });
const sDoor = (E, name) => (f, d) => E.s[name](E.fen.parseFen(f), d);
const doorsS = Object.keys(h.s).filter((k) => /^searchWithout/.test(k) && typeof h.s[k] === "function").sort();
const doorsE = Object.keys(h.e).filter((k) => /^chooseMoveWithout/.test(k) && typeof h.e[k] === "function").sort();
const bS = Object.keys(b.s).filter((k) => /^searchWithout/.test(k)).sort();
const bE = Object.keys(b.e).filter((k) => /^chooseMoveWithout/.test(k)).sort();
console.log(`doors: search ${doorsS.length} (base ${bS.length}), engine ${doorsE.length} (base ${bE.length}); same set: ${JSON.stringify(doorsS) === JSON.stringify(bS) && JSON.stringify(doorsE) === JSON.stringify(bE)}`);
const sets = [
  ["search() d1-4, ABC-078 A3 corpus", corpus, sDoor(b, "search"), sDoor(h, "search"), [1, 2, 3, 4]],
  ["chooseMove fixed to 1-4, ABC-078 A3 corpus", corpus, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [1, 2, 3, 4]],
  ["search() d5-7, perft roots", PERFT, sDoor(b, "search"), sDoor(h, "search"), [5, 6, 7]],
  ["chooseMove fixed to 5-8, perft roots", PERFT, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [5, 6, 7, 8]],
];
// The two pruning-free doors are full-width (no alpha-beta) and explode at d3: d1-2 there, as se-ABC-264 read d2.
for (const name of doorsS) {
  const ds = /^searchWithoutPruning/.test(name) ? [1, 2] : [1, 2, 3];
  sets.push([`${name} d${ds[0]}-${ds.at(-1)} (self), corpus`, corpus, sDoor(b, name), sDoor(h, name), ds]);
}
for (const name of doorsE) sets.push([`${name} to 4 (self), corpus`, corpus, fixed(b, name), fixed(h, name), [4]]);
console.log(`corpus ${corpus.length} positions`);
let allOk = true, totalRows = 0, totalNodes = 0;
for (const [label, set, fb, fh, depths] of sets) {
  const hb = createHash("sha256"), hh = createHash("sha256");
  let rows = 0, diff = 0, nodes = 0;
  for (const f of set) for (const d of depths) {
    const xb = fb(f, d), xh = fh(f, d);
    const rb = row(xb), rh = row(xh);
    hb.update(`${rb}\n`); hh.update(`${rh}\n`); rows++; nodes += xh.nodes;
    if (rb !== rh) { diff++; if (diff <= 3) console.log(`  MISMATCH ${f} d${d}: base ${rb} head ${rh}`); }
  }
  totalRows += rows; totalNodes += nodes;
  if (diff) allOk = false;
  console.log(`${label}: ${rows} rows, ${diff} differ, ${nodes} head nodes; base ${hb.digest("hex").slice(0, 16)} head ${hh.digest("hex").slice(0, 16)}`);
}
// Timed chooseMove on a tick clock (se-ABC-253's ident form): long searches, null-move subtrees,
// with and without a prior history; the hash move is a live read in both builds.
let tRows = 0, tDiff = 0;
for (const fen of PERFT) for (const ms of [3, 5, 400, 3000]) {
  const p = h.fen.parseFen(fen); const prior = [];
  for (let i = 0; i < 6; i++) { prior.push(h.z.zobristKey(p)); const m = h.legal.legalMoves(p); if (!m.length) break; h.apply.makeMove(p, m[i % m.length]); }
  for (const pk of [undefined, prior]) {
    const run = (E) => { let t = 0; const c = E.e.chooseMove(E.fen.parseFen(fen), { budgetMs: ms, now: () => t++, priorKeys: pk }); return JSON.stringify([mv(c.move), c.score, c.depth, c.nodes, t]); };
    tRows++; const x = run(b), y = run(h); if (x !== y) { tDiff++; allOk = false; console.log(`  MISMATCH tick ${fen} ${ms}: ${x} ${y}`); }
  }
}
console.log(`chooseMove tick clock (6 roots x 3/5/400/3000 x prior none/6): ${tRows} rows, ${tDiff} differ`);
console.log(`total fixed-depth rows ${totalRows}, head nodes ${totalNodes}`);
console.log(allOk ? "A3 IDENTITY: ALL EQUAL" : "A3 IDENTITY: DIFFERENCES FOUND");
