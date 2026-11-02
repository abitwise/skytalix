// qe-ABC-268 independent A3 / A4 read, out of tree, plain node (from qe-ABC-264's a34.mjs). Head shipped path
// against head's door AND base's shipped path (equal to the door by A1); exact A4 counts; the re-pointed ABC-229 rows
// read on both trees. usage: node qe-a34.mjs <baseTree> <headTree> [a3|a4|zug|r229|all]
const [B, H, which = "all"] = process.argv.slice(2);
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`), s: await import(`${T}/src/search.ts`), e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`), apply: await import(`${T}/src/apply.ts`), ge: await import(`${T}/src/gameend.ts`),
  pos: await import(`${T}/src/position.ts`),
});
const b = await load(B), h = await load(H);
const { MATE_CORPUS } = await import(`${H}/src/search.mate-corpus.ts`);
const isMate = (x) => Math.abs(x) > h.s.MATE_SCORE - 1000;
const sq = (s) => h.pos.squareName(s);
const mv = (m) => (m ? `${sq(m.from)}${sq(m.to)}` : "-");
const ROOTS = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const ENDGAMES = { "kq-corner": "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "kr-corner": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "kqk-h8": "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "kp-vs-k": "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "krk-a-file": "8/8/8/8/8/k7/8/KR6 w - - 0 1", "pawn-race": "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" };
const corpus = [];
for (const [name, f] of Object.entries(ROOTS)) {
  corpus.push([name, f]);
  const p = h.fen.parseFen(f);
  for (const m of h.legal.legalMoves(p)) {
    const u = h.apply.makeMove(p, m);
    if (h.ge.gameStatus(p).result === "in-progress") corpus.push([`${name}/${mv(m)}`, h.fen.toFen(p)]);
    h.apply.unmakeMove(p, m, u);
  }
}
for (const [name, f] of Object.entries(ENDGAMES)) corpus.push([name, f]);
if (corpus.length !== 190) throw new Error(`corpus ${corpus.length}`);
const frozen = (d) => ({ budgetMs: 1000, now: () => 0, maxDepth: d });
const t0 = Date.now();
const out = (o) => console.log(JSON.stringify({ ...o, s: ((Date.now() - t0) / 1000).toFixed(1) }));
function drift(label, on, ref) {
  const deltas = []; let signFlips = 0, mateFlips = 0, moveDiff = 0;
  for (const [name, f] of corpus) {
    const r = ref(f), g = on(f);
    if (mv(r.move) !== mv(g.move)) moveDiff++;
    if (isMate(r.score) || isMate(g.score)) { if (Math.sign(r.score) !== Math.sign(g.score)) signFlips++; if (isMate(r.score) !== isMate(g.score)) mateFlips++; continue; }
    deltas.push([Math.abs(g.score - r.score), `${name}: ${r.score} -> ${g.score}`]);
  }
  deltas.sort((x, y) => y[0] - x[0]);
  const within = deltas.filter(([d]) => d <= 25).length;
  const sig = deltas.map((d) => d[1]).sort().join(";");
  out({ row: "drift", label, corpus: corpus.length, compared: deltas.length, within25: within, pct: +(100 * within / deltas.length).toFixed(2),
    max: deltas[0][0], worst: deltas[0][1], changed: deltas.filter(([d]) => d > 0).length, signFlips, mateFlips, moveDiff, top5: deltas.slice(0, 5).map((d) => d[1]),
    sigLen: sig.length, sig: (await_hash(sig)) });
}
import { createHash } from "node:crypto";
function await_hash(s) { return createHash("sha256").update(s).digest("hex").slice(0, 16); }
function mateFloor(label, on, ref) {
  let mates = 0, longer = 0, shorter = 0; const viol = [];
  for (const f of MATE_CORPUS) {
    const r = ref(f); if (!isMate(r)) continue; mates++;
    const g = on(f);
    if (!isMate(g) || Math.sign(g) !== Math.sign(r)) viol.push(`${f}: ${r} -> ${g}`);
    else if (Math.abs(g) < Math.abs(r)) longer++; else if (Math.abs(g) > Math.abs(r)) shorter++;
  }
  out({ row: "mate-floor", label, corpus: MATE_CORPUS.length, mates, violations: viol.length, longer, shorter, viol: viol.slice(0, 5) });
}
const S = (T, name, d) => (f) => T.s[name](T.fen.parseFen(f), d);
const E = (T, name, d) => (f) => T.e[name](T.fen.parseFen(f), frozen(d));
if (which === "a3" || which === "all") {
  drift("search() d5: head vs head door", S(h, "search", 5), S(h, "searchWithoutFutility", 5));
  drift("search() d5: head vs base search()", S(h, "search", 5), S(b, "search", 5));
  drift("chooseMove to 5: head vs head door", E(h, "chooseMove", 5), E(h, "chooseMoveWithoutFutility", 5));
  drift("chooseMove to 5: head vs base chooseMove", E(h, "chooseMove", 5), E(b, "chooseMove", 5));
  mateFloor("search() d5: head vs head door (BAR)", (f) => h.s.search(h.fen.parseFen(f), 5).score, (f) => h.s.searchWithoutFutility(h.fen.parseFen(f), 5).score);
  mateFloor("chooseMove to 5: head vs head door (INFO, not barred)", (f) => h.e.chooseMove(h.fen.parseFen(f), frozen(5)).score, (f) => h.e.chooseMoveWithoutFutility(h.fen.parseFen(f), frozen(5)).score);
}
if (which === "zug" || which === "all") {
  const ROWS = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
  ];
  for (const [name, f, want, d] of ROWS) {
    const hc = h.e.chooseMove(h.fen.parseFen(f), frozen(d)), dc = h.e.chooseMoveWithoutFutility(h.fen.parseFen(f), frozen(d));
    out({ row: "zugzwang", name, d, depth: hc.depth, played: mv(hc.move), want, ok: hc.depth === d && mv(hc.move) === want, head: hc.nodes, door: dc.nodes, doorPlayed: mv(dc.move), ratio: +(hc.nodes / dc.nodes).toFixed(3) });
  }
}
if (which === "a4" || which === "all") {
  for (const name of ["kiwipete", "position-6"]) {
    const f = ROOTS[name];
    const hs = h.s.search(h.fen.parseFen(f), 8), hd = h.s.searchWithoutFutility(h.fen.parseFen(f), 8), bs = b.s.search(b.fen.parseFen(f), 8);
    out({ row: "A4a", reading: `search() d8 ${name}`, head: hs.nodes, door: hd.nodes, base: bs.nodes, ratio: +(hs.nodes / hd.nodes).toFixed(4), doorEqBase: hd.nodes === bs.nodes && hd.score === bs.score && mv(hd.move) === mv(bs.move),
      headMove: mv(hs.move), headScore: hs.score, doorMove: mv(hd.move), doorScore: hd.score });
    const hc = h.e.chooseMove(h.fen.parseFen(f), frozen(8)), hcd = h.e.chooseMoveWithoutFutility(h.fen.parseFen(f), frozen(8)), bc = b.e.chooseMove(b.fen.parseFen(f), frozen(8));
    out({ row: "A4a", reading: `chooseMove to 8 ${name}`, depths: [hc.depth, hcd.depth, bc.depth], head: hc.nodes, door: hcd.nodes, base: bc.nodes, ratio: +(hc.nodes / hcd.nodes).toFixed(4),
      doorEqBase: hcd.nodes === bc.nodes && hcd.score === bc.score && mv(hcd.move) === mv(bc.move), headMove: mv(hc.move), headScore: hc.score, doorMove: mv(hcd.move), doorScore: hcd.score });
  }
  const reach = (T, name) => corpus.map(([, f]) => { const c = T.e[name](T.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxNodes: 47_000 }); return { d: c.depth, m: mv(c.move) }; });
  const D = reach(h, "chooseMoveWithoutFutility"), Hh = reach(h, "chooseMove"), Bb = reach(b, "chooseMove");
  const mean = (a) => a.reduce((x, y) => x + y.d, 0) / a.length;
  out({ row: "A4b", maxNodes: 47000, rows: corpus.length, door: +mean(D).toFixed(3), head: +mean(Hh).toFixed(3), base: +mean(Bb).toFixed(3), gain: +(mean(Hh) - mean(D)).toFixed(3),
    deeper: Hh.filter((x, i) => x.d > D[i].d).length, shallower: Hh.filter((x, i) => x.d < D[i].d).length, moveDiff: Hh.filter((x, i) => x.m !== D[i].m).length,
    doorEqBase: D.every((x, i) => x.d === Bb[i].d && x.m === Bb[i].m) });
}
if (which === "r229" || which === "all") {
  for (const name of ["kiwipete", "position-6"]) {
    const f = ROOTS[name];
    const hn = h.s.searchWithoutFutility(h.fen.parseFen(f), 6).nodes, hq = h.s.searchWithoutQuietPromotions(h.fen.parseFen(f), 6).nodes;
    const bn = b.s.search(b.fen.parseFen(f), 6).nodes, bq = b.s.searchWithoutQuietPromotions(b.fen.parseFen(f), 6).nodes;
    out({ row: "ABC-229 A3 d6 ratio", name, headRepointed: `${hn}/${hq}=${(hn / hq).toFixed(3)}`, basePre: `${bn}/${bq}=${(bn / bq).toFixed(3)}`, equal: hn === bn && hq === bq });
  }
  drift("ABC-229 search() d5 re-pointed: head searchWithoutFutility vs head searchWithoutQuietPromotions", S(h, "searchWithoutFutility", 5), S(h, "searchWithoutQuietPromotions", 5));
  drift("ABC-229 search() d5 pre-ticket: base search() vs base searchWithoutQuietPromotions", S(b, "search", 5), S(b, "searchWithoutQuietPromotions", 5));
  drift("ABC-229 chooseMove to 5 re-pointed: head chooseMoveWithoutFutility vs head chooseMoveWithoutQuietPromotions", E(h, "chooseMoveWithoutFutility", 5), E(h, "chooseMoveWithoutQuietPromotions", 5));
  drift("ABC-229 chooseMove to 5 pre-ticket: base chooseMove vs base chooseMoveWithoutQuietPromotions", E(b, "chooseMove", 5), E(b, "chooseMoveWithoutQuietPromotions", 5));
}
