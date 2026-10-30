// ABC-229 A1 (G4), cross-build: the new doors equal base's shipped path, and every older door equals
// its pre-ticket self, node for node, score and move, out of tree in plain node.
// usage: node a1.mjs <baseTree> <headTree>
import { createHash } from "node:crypto";
const [B, H] = process.argv.slice(2);
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`),
  s: await import(`${T}/src/search.ts`),
  e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`),
  apply: await import(`${T}/src/apply.ts`),
  ge: await import(`${T}/src/gameend.ts`),
});
const b = await load(B);
const h = await load(H);
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
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
const pairs = [
  // [label, base fn, head fn, kind, depth]
  ["search vs searchWithoutQuietPromotions d1-4", (f, d) => b.s.search(b.fen.parseFen(f), d), (f, d) => h.s.searchWithoutQuietPromotions(h.fen.parseFen(f), d), "s", [1, 2, 3, 4]],
  ["chooseMove vs chooseMoveWithoutQuietPromotions to 4", (f, d) => b.e.chooseMove(b.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), (f, d) => h.e.chooseMoveWithoutQuietPromotions(h.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), "e", [4]],
  ["searchWithoutQuiescenceEvasions d1-4 (self)", (f, d) => b.s.searchWithoutQuiescenceEvasions(b.fen.parseFen(f), d), (f, d) => h.s.searchWithoutQuiescenceEvasions(h.fen.parseFen(f), d), "s", [1, 2, 3, 4]],
  ["chooseMoveWithoutQuiescenceEvasions to 4 (self)", (f, d) => b.e.chooseMoveWithoutQuiescenceEvasions(b.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), (f, d) => h.e.chooseMoveWithoutQuiescenceEvasions(h.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), "e", [4]],
];
for (const name of ["searchWithoutNullMove", "searchWithoutReductions", "searchWithoutPvsOrReductions", "searchWithoutTable", "searchWithoutOrdering", "searchWithoutKillers", "searchWithoutQuiescence"]) {
  pairs.push([`${name} d3`, (f, d) => b.s[name](b.fen.parseFen(f), d), (f, d) => h.s[name](h.fen.parseFen(f), d), "s", [3]]);
}
for (const name of ["searchWithoutPruning", "searchWithoutPruningOrQuiescence"]) {
  pairs.push([`${name} d2`, (f, d) => b.s[name](b.fen.parseFen(f), d), (f, d) => h.s[name](h.fen.parseFen(f), d), "s", [2]]);
}
for (const name of ["chooseMoveWithoutNullMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"]) {
  pairs.push([`${name} to 4`, (f, d) => b.e[name](b.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), (f, d) => h.e[name](h.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d }), "e", [4]]);
}
console.log(`corpus ${corpus.length} positions`);
let allOk = true;
for (const [label, fb, fh, , depths] of pairs) {
  const hb = createHash("sha256"), hh = createHash("sha256");
  let rows = 0, diff = 0;
  for (const f of corpus) for (const d of depths) {
    const rb = row(fb(f, d)), rh = row(fh(f, d));
    hb.update(`${rb}\n`); hh.update(`${rh}\n`); rows++;
    if (rb !== rh) diff++;
  }
  const sb = hb.digest("hex").slice(0, 16), sh = hh.digest("hex").slice(0, 16);
  if (diff) allOk = false;
  console.log(`${label}: ${rows} rows, ${diff} differ; base ${sb} head ${sh}`);
}
// Non-vacuity: the shipped head differs from base's shipped path.
let moved = 0, rows = 0;
for (const f of corpus) for (const d of [1, 2, 3, 4]) {
  rows++;
  if (row(b.s.search(b.fen.parseFen(f), d)) !== row(h.s.search(h.fen.parseFen(f), d))) moved++;
}
console.log(`non-vacuity: head search() differs from base search() on ${moved}/${rows} rows`);
console.log(allOk ? "A1 IDENTITY: ALL EQUAL" : "A1 IDENTITY: DIFFERENCES FOUND");
