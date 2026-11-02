// qe-ABC-265 A3 (G4, T8), QE's OWN identity sample, cross-build, out of tree, plain node. Written fresh by QE (the SE's
// a3.mjs was read for the API only). Base tree (94be445f) against head tree (e5694864), Threads 1. Every row compares
// move, score, nodes (and depth where returned) between the two builds; a door is compared with its pre-ticket self.
// The sample deliberately differs from the SE's: deeper depths on corpus subsets, 2-ply descendants, the puzzle and
// game-1 positions, high-table-load deep rows (mate and endgame roots, chooseMove to 9), doors one depth deeper,
// other tick-clock budgets and step, a prior history holding a repetition, and in-process game sequences (the clear
// between consecutive searches). usage: node a3q.mjs <baseTree> <headTree> [quick|plant]
// quick: 3 rows a set (smoke); plant: quick, with one game (kiwipete, 24 plies) — the plant-survivor mode.
import { createHash } from "node:crypto";
const [B, H, mode] = process.argv.slice(2);
const QUICK = mode === "quick" || mode === "plant";
const PLANT = mode === "plant";
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`),
  s: await import(`${T}/src/search.ts`),
  e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`),
  apply: await import(`${T}/src/apply.ts`),
  ge: await import(`${T}/src/gameend.ts`),
  z: await import(`${T}/src/zobrist.ts`),
  pz: await import(`${T}/src/puzzle-corpus.ts`),
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
const ENDS = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1",
  "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
const G11 = [
  "rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "rn1q1rk1/pb1pbppp/1p2pn2/2p5/Q1P1PB2/2NP1N2/PP3PPP/R3KB1R w KQ - 1 8",
  "rn1q1rk1/pb2bppp/1p1pp3/2p1P2n/Q1P5/2NPBN2/PP3PPP/R3KB1R w KQ - 0 10",
];
// The ABC-078 A3 corpus: 12 roots and every in-progress child (the contract corpus, 276 positions).
const children = (f) => {
  const out = [];
  const p = h.fen.parseFen(f);
  for (const m of h.legal.legalMoves(p)) {
    const u = h.apply.makeMove(p, m);
    if (h.ge.gameStatus(p).result === "in-progress") out.push(h.fen.toFen(p));
    h.apply.unmakeMove(p, m, u);
  }
  return out;
};
const corpus = [];
for (const f of [...PERFT, ...ENDS]) corpus.push(f, ...children(f));
const every = (a, k, off = 0) => a.filter((_, i) => i % k === off);
const grand = [];
for (const f of PERFT) for (const c of every(children(f), 5)) grand.push(...every(children(c), 7, 3));
const puzzles = h.pz.PUZZLES.map((p) => p.fen);
const mv = (m) => (m ? `${m.from}-${m.to}-${m.promotion}` : "null");
const row = (r) => (r === null ? "null" : `${r.nodes}|${r.score}|${mv(r.move)}|${r.depth ?? ""}`);
const fixed = (E, name) => (f, d) => E.e[name](E.fen.parseFen(f), { budgetMs: 1000, now: () => 0, maxDepth: d });
const sDoor = (E, name) => (f, d) => E.s[name](E.fen.parseFen(f), d);
const doorsS = Object.keys(h.s).filter((k) => /^searchWithout/.test(k) && typeof h.s[k] === "function").sort();
const doorsE = Object.keys(h.e).filter((k) => /^chooseMoveWithout/.test(k) && typeof h.e[k] === "function").sort();
const bS = Object.keys(b.s).filter((k) => /^searchWithout/.test(k) && typeof b.s[k] === "function").sort();
const bE = Object.keys(b.e).filter((k) => /^chooseMoveWithout/.test(k) && typeof b.e[k] === "function").sort();
const exportsSame = ["s", "e"].map((m) => JSON.stringify(Object.keys(b[m]).sort()) === JSON.stringify(Object.keys(h[m]).sort()));
console.log(`doors: search ${doorsS.length} (base ${bS.length}), engine ${doorsE.length} (base ${bE.length}); same door set: ${JSON.stringify(doorsS) === JSON.stringify(bS) && JSON.stringify(doorsE) === JSON.stringify(bE)}; search.ts/engine.ts export lists equal: ${exportsSame.join("/")}`);
console.log(`sample sizes: corpus ${corpus.length}, grandchildren ${grand.length}, puzzles ${puzzles.length}, g11 ${G11.length}`);
const q = (a) => (QUICK ? a.slice(0, 3) : a);
const sets = [
  ["search() d5, corpus every 4th (off 1)", every(corpus, 4, 1), sDoor(b, "search"), sDoor(h, "search"), [5]],
  ["chooseMove fixed to 5, corpus every 4th (off 3)", every(corpus, 4, 3), fixed(b, "chooseMove"), fixed(h, "chooseMove"), [5]],
  ["search() d3-4, 2-ply descendants of the perft roots", grand, sDoor(b, "search"), sDoor(h, "search"), [3, 4]],
  ["chooseMove fixed to 4, 2-ply descendants", grand, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [4]],
  ["search() d4, shipped puzzles", puzzles, sDoor(b, "search"), sDoor(h, "search"), [4]],
  ["chooseMove fixed to 5, shipped puzzles", puzzles, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [5]],
  ["chooseMove fixed to 7, game-1 positions", G11, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [7]],
  ["search() d8-9, mate and endgame roots (high table load, mate relativity)", ENDS, sDoor(b, "search"), sDoor(h, "search"), [8, 9]],
  ["chooseMove fixed to 10-12, mate and endgame roots", ENDS, fixed(b, "chooseMove"), fixed(h, "chooseMove"), [10, 12]],
  ["chooseMove fixed to 9, startpos/kiwipete/position-3/position-6", [PERFT[0], PERFT[1], PERFT[2], PERFT[5]], fixed(b, "chooseMove"), fixed(h, "chooseMove"), [9]],
  ["search() d8, startpos/position-3/position-6", [PERFT[0], PERFT[2], PERFT[5]], sDoor(b, "search"), sDoor(h, "search"), [8]],
];
for (const name of doorsS) {
  if (/^searchWithoutPruning/.test(name)) sets.push([`${name} d3 (self), endgame roots`, ENDS, sDoor(b, name), sDoor(h, name), [3]]);
  else sets.push([`${name} d4 (self), corpus every 8th (off 5)`, every(corpus, 8, 5), sDoor(b, name), sDoor(h, name), [4]]);
}
for (const name of doorsE) sets.push([`${name} to 5 (self), corpus every 8th (off 6)`, every(corpus, 8, 6), fixed(b, name), fixed(h, name), [5]]);
let allOk = true, totalRows = 0, totalNodes = 0;
const t00 = Date.now();
for (const [label, set0, fb, fh, depths] of sets) {
  const set = q(set0);
  const t0 = Date.now();
  const hb = createHash("sha256"), hh = createHash("sha256");
  let rows = 0, diff = 0, nodes = 0;
  for (const f of set) for (const d of depths) {
    const rb = row(fb(f, d)), xh = fh(f, d), rh = row(xh);
    hb.update(`${rb}\n`); hh.update(`${rh}\n`); rows++; nodes += xh?.nodes ?? 0;
    if (rb !== rh) { diff++; if (diff <= 3) console.log(`  MISMATCH ${f} d${d}: base ${rb} head ${rh}`); }
  }
  totalRows += rows; totalNodes += nodes;
  if (diff) allOk = false;
  console.log(`${label}: ${rows} rows, ${diff} differ, ${nodes} head nodes; base ${hb.digest("hex").slice(0, 16)} head ${hh.digest("hex").slice(0, 16)} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
// Tick clock: budgets 7/60/1200/6000 ticks, the clock stepping by 3, prior none or a 7-key history holding the root key
// twice (a repetition the root must see). Perft and endgame roots.
let tRows = 0, tDiff = 0;
for (const fen of q([...PERFT, ...ENDS])) for (const ms of [7, 60, 1200, 6000]) {
  const p = h.fen.parseFen(fen); const rootKey = h.z.zobristKey(p);
  const hist = [];
  for (let i = 0; i < 5; i++) { hist.push(h.z.zobristKey(p)); const m = h.legal.legalMoves(p); if (!m.length) break; h.apply.makeMove(p, m[(i * 3) % m.length]); }
  const rep = [rootKey, ...hist, rootKey];
  for (const pk of [undefined, rep]) {
    const run = (E) => { let t = 0; const c = E.e.chooseMove(E.fen.parseFen(fen), { budgetMs: ms, now: () => (t += 3), priorKeys: pk }); return JSON.stringify(c === null ? null : [mv(c.move), c.score, c.depth, c.nodes, t]); };
    tRows++; const x = run(b), y = run(h); if (x !== y) { tDiff++; allOk = false; console.log(`  MISMATCH tick ${fen} ${ms} ${pk ? "rep" : "none"}: ${x} ${y}`); }
  }
}
console.log(`chooseMove tick clock (12 roots x 7/60/1200/6000 ticks, step 3, x prior none/rep): ${tRows} rows, ${tDiff} differ`);
// In-process games: each build plays N plies from a root on a tick clock (1500 ticks, step 1) with the game's keys as
// priorKeys, one process, consecutive chooseMove calls: every move, score, depth and node count must match. A search()
// and a door are interleaved every 5th ply in both builds (each entry clears its own table).
let gRows = 0, gDiff = 0;
for (const [root, plies] of PLANT ? [[PERFT[1], 24]] : q([[PERFT[0], 40], [PERFT[1], 30], [PERFT[5], 30], [ENDS[3], 40]])) {
  const play = (E) => {
    const p = E.fen.parseFen(root); const keys = []; const out = [];
    for (let i = 0; i < plies; i++) {
      if (E.ge.gameStatus(p).result !== "in-progress") break;
      let t = 0; const c = E.e.chooseMove(p, { budgetMs: 1500, now: () => t++, priorKeys: keys });
      if (c === null) break;
      let extra = "";
      if (i % 5 === 4) { const s = E.s.search(p, 3); const d = E.s.searchWithoutTable(p, 2); extra = `${row(s)}/${row(d)}`; }
      out.push(`${mv(c.move)}|${c.score}|${c.depth}|${c.nodes}|${t}|${extra}`);
      keys.push(E.z.zobristKey(p)); E.apply.makeMove(p, c.move);
    }
    return out;
  };
  const x = play(b), y = play(h);
  const n = Math.max(x.length, y.length); let d = 0;
  for (let i = 0; i < n; i++) if (x[i] !== y[i]) { d++; if (d <= 2) console.log(`  MISMATCH game ${root} ply ${i}: ${x[i]} ${y[i]}`); }
  gRows += n; gDiff += d; if (d) allOk = false;
}
console.log(`in-process games (4 roots, 30-40 plies, tick clock, priorKeys, search()+door interleaved): ${gRows} plies, ${gDiff} differ`);
console.log(`total fixed-depth rows ${totalRows}, head nodes ${totalNodes}; wall ${((Date.now() - t00) / 1000).toFixed(0)} s`);
console.log(allOk ? "A3 IDENTITY (QE sample): ALL EQUAL" : "A3 IDENTITY (QE sample): DIFFERENCES FOUND");
