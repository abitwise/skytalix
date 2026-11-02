// qe-ABC-264 independent A3/A4 read, out of tree, plain node. Head shipped path against BASE shipped path
// (base search()/chooseMove == head's doors, by A1), and head's doors directly for A4.
// usage: node a34.mjs <baseTree> <headTree> [a3|a4|all]
const [B, H, which = "all"] = process.argv.slice(2);
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`), s: await import(`${T}/src/search.ts`), e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`), apply: await import(`${T}/src/apply.ts`), ge: await import(`${T}/src/gameend.ts`),
  pos: await import(`${T}/src/position.ts`),
});
const b = await load(B), h = await load(H);
const { MATE_CORPUS } = await import(`${H}/src/search.mate-corpus.ts`);
const MATE_SCORE = h.s.MATE_SCORE;
const isMate = (x) => Math.abs(x) > MATE_SCORE - 1000;
const ROOTS = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const ENDGAMES = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const corpus = [];
for (const [name, f] of Object.entries(ROOTS)) {
  corpus.push([name, f]);
  const p = h.fen.parseFen(f);
  for (const m of h.legal.legalMoves(p)) {
    const u = h.apply.makeMove(p, m);
    if (h.ge.gameStatus(p).result === "in-progress") corpus.push([`${name}/${h.pos.squareName(m.from)}${h.pos.squareName(m.to)}`, h.fen.toFen(p)]);
    h.apply.unmakeMove(p, m, u);
  }
}
for (const [i, f] of ENDGAMES.entries()) corpus.push([`endgame-${i}`, f]);
const frozen = (d) => ({ budgetMs: 1000, now: () => 0, maxDepth: d });
const t0 = Date.now();
const out = (o) => console.log(JSON.stringify({ ...o, s: ((Date.now() - t0) / 1000).toFixed(1) }));
function drift(label, on, ref) {
  const deltas = []; let signFlips = 0, mateFlips = 0;
  for (const [name, f] of corpus) {
    const r = ref(f), g = on(f);
    if (isMate(r) || isMate(g)) { if (Math.sign(r) !== Math.sign(g)) signFlips++; if (isMate(r) !== isMate(g)) mateFlips++; continue; }
    deltas.push([Math.abs(g - r), `${name}: ${r} -> ${g}`]);
  }
  deltas.sort((x, y) => y[0] - x[0]);
  const within = deltas.filter(([d]) => d <= 25).length;
  out({ row: "A3-drift", label, corpus: corpus.length, compared: deltas.length, within25: within, pct: +(100 * within / deltas.length).toFixed(2),
    max: deltas[0][0], worst: deltas[0][1], over160: deltas.filter(([d]) => d > 160).length, changed: deltas.filter(([d]) => d > 0).length, signFlips, mateFlips,
    top5: deltas.slice(0, 5).map((d) => d[1]) });
}
function mateFloor(label, on, ref) {
  let mates = 0, longer = 0, shorter = 0; const viol = [];
  for (const f of MATE_CORPUS) {
    const r = ref(f); if (!isMate(r)) continue; mates++;
    const g = on(f);
    if (!isMate(g) || Math.sign(g) !== Math.sign(r)) viol.push(`${f}: ${r} -> ${g}`);
    else if (Math.abs(g) < Math.abs(r)) longer++; else if (Math.abs(g) > Math.abs(r)) shorter++;
  }
  out({ row: "A3-mate-floor", label, corpus: MATE_CORPUS.length, mates, violations: viol.length, longer, shorter, viol: viol.slice(0, 5) });
}
if (which === "a3" || which === "all") {
  if (corpus.length !== 190) throw new Error(`corpus ${corpus.length}`);
  drift("search() d5: head vs base", (f) => h.s.search(h.fen.parseFen(f), 5).score, (f) => b.s.search(b.fen.parseFen(f), 5).score);
  drift("chooseMove to 5: head vs base", (f) => h.e.chooseMove(h.fen.parseFen(f), frozen(5)).score, (f) => b.e.chooseMove(b.fen.parseFen(f), frozen(5)).score);
  mateFloor("search() d5: head vs base", (f) => h.s.search(h.fen.parseFen(f), 5).score, (f) => b.s.search(b.fen.parseFen(f), 5).score);
  mateFloor("chooseMove to 5: head vs base (INFO, not barred)", (f) => h.e.chooseMove(h.fen.parseFen(f), frozen(5)).score, (f) => b.e.chooseMove(b.fen.parseFen(f), frozen(5)).score);
}
if (which === "a4" || which === "all") {
  const mv = (m) => (m ? `${h.pos.squareName(m.from)}${h.pos.squareName(m.to)}${m.promotion ?? ""}` : null);
  for (const name of ["kiwipete", "position-6"]) {
    const f = ROOTS[name];
    const hs = h.s.search(h.fen.parseFen(f), 8), hd = h.s.searchWithoutReverseFutility(h.fen.parseFen(f), 8), bs = b.s.search(b.fen.parseFen(f), 8);
    out({ row: "A4", reading: `search() d8 ${name}`, head: hs.nodes, headDoor: hd.nodes, base: bs.nodes, ratio: +(hs.nodes / hd.nodes).toFixed(4), doorEqBase: hd.nodes === bs.nodes && hd.score === bs.score,
      headMove: mv(hs.move), headScore: hs.score, doorMove: mv(hd.move), doorScore: hd.score });
    const hc = h.e.chooseMove(h.fen.parseFen(f), frozen(8)), hcd = h.e.chooseMoveWithoutReverseFutility(h.fen.parseFen(f), frozen(8)), bc = b.e.chooseMove(b.fen.parseFen(f), frozen(8));
    out({ row: "A4", reading: `chooseMove to 8 ${name}`, depths: [hc.depth, hcd.depth, bc.depth], head: hc.nodes, headDoor: hcd.nodes, base: bc.nodes, ratio: +(hc.nodes / hcd.nodes).toFixed(4),
      doorEqBase: hcd.nodes === bc.nodes && hcd.score === bc.score, headMove: mv(hc.move), headScore: hc.score, doorMove: mv(hcd.move), doorScore: hcd.score });
  }
}
