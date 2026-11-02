// qe-ABC-268 A1 (G4, F7): QE's own cross-build sample, out of tree, plain node. Base tree vs head tree,
// move + score + nodes (+ depth on the engine side) per row. Not SE's script: deeper depths, the 287 mate corpus,
// maxNodes on the 190, and game history (priorKeys) on the new engine door.
// usage: node qe-a1.mjs <baseTree> <headTree> [all|history]
import { createHash } from "node:crypto";
const [B, H, part = "all"] = process.argv.slice(2);
const load = async (T) => ({
  fen: await import(`${T}/src/fen.ts`), s: await import(`${T}/src/search.ts`), e: await import(`${T}/src/engine.ts`),
  legal: await import(`${T}/src/legal.ts`), apply: await import(`${T}/src/apply.ts`), ge: await import(`${T}/src/gameend.ts`),
  z: await import(`${T}/src/zobrist.ts`),
});
const b = await load(B), h = await load(H);
const { MATE_CORPUS } = await import(`${B}/src/search.mate-corpus.ts`);
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
const C190 = [];
for (const f of ROOTS.slice(0, 6)) {
  C190.push(f);
  const p = h.fen.parseFen(f);
  for (const m of h.legal.legalMoves(p)) {
    const u = h.apply.makeMove(p, m);
    if (h.ge.gameStatus(p).result === "in-progress") C190.push(h.fen.toFen(p));
    h.apply.unmakeMove(p, m, u);
  }
}
C190.push(...ROOTS.slice(6));
if (C190.length !== 190) throw new Error(`190? ${C190.length}`);
/** priorKeys: the keys of the root's first eight two-ply grandchildren reached by two REVERSIBLE moves (no pawn move,
 * no capture), the root's halfmove clock set to 8 so the search may look back into them (computed on the head tree). */
const withClock = (f) => { const x = f.split(" "); x[4] = "20"; return x.join(" "); };
function history(f) {
  const p = h.fen.parseFen(f), keys = [];
  const rev = (m) => m.captured === 0 && (m.piece & 7) !== 1;
  for (const m1 of h.legal.legalMoves(p)) {
    if (!rev(m1)) continue;
    const u1 = h.apply.makeMove(p, m1);
    for (const m2 of h.legal.legalMoves(p)) {
      if (!rev(m2) || keys.length >= 8) continue;
      const u2 = h.apply.makeMove(p, m2);
      if (h.ge.gameStatus(p).result === "in-progress") keys.push(h.z.zobristKey(p));
      h.apply.unmakeMove(p, m2, u2);
    }
    h.apply.unmakeMove(p, m1, u1);
    if (keys.length >= 8) break;
  }
  // ADR-0054 d3: a pre-root repetition needs the position TWICE before the root, at even offsets from the end. Layout
  // (offset from the end -> key): -1/-3 filler, -2/-4 g0, -5/-7 filler, -6/-8 g1, ... four grandchildren, 16 keys.
  const filler = 0x5eed5eedn, prior = new Array(16); if (keys.length < 4) throw new Error(`history: ${keys.length} keys for ${f}`);
  for (let j = 0; j < 4; j++) { prior[16 - (4 * j + 2)] = keys[j]; prior[16 - (4 * j + 4)] = keys[j]; prior[16 - (4 * j + 1)] = filler; prior[16 - (4 * j + 3)] = filler; }
  return prior;
}
const mv = (m) => (m ? `${m.from}-${m.to}-${m.promotion}` : "null");
const row = (r) => (r === null ? "null" : `${r.nodes}|${r.score}|${mv(r.move)}|${r.depth ?? ""}`);
const frozen = (d, extra = {}) => ({ budgetMs: 1000, now: () => 0, maxDepth: d, ...extra });
const nodes47 = { budgetMs: 1000, now: () => 0, maxNodes: 47_000 };
const t0 = Date.now();
let allOk = true;
function pair(label, fens, fb, fh) {
  const hb = createHash("sha256"), hh = createHash("sha256");
  let rows = 0, diff = 0;
  const first = [];
  for (const f of fens) {
    const rb = row(fb(f)), rh = row(fh(f));
    hb.update(`${rb}\n`); hh.update(`${rh}\n`); rows++;
    if (rb !== rh) { diff++; if (first.length < 3) first.push(`${f}: ${rb} vs ${rh}`); }
  }
  if (diff) allOk = false;
  console.log(JSON.stringify({ label, rows, diff, base: hb.digest("hex").slice(0, 16), head: hh.digest("hex").slice(0, 16), first, s: ((Date.now() - t0) / 1000).toFixed(1) }));
}
const S = (T, name, d) => (f) => T.s[name](T.fen.parseFen(f), d);
const E = (T, name, o) => (f) => T.e[name](T.fen.parseFen(f), typeof o === "function" ? o(f) : o);
if (part === "all") {
  // New doors against base's shipped path.
  for (const d of [5, 6]) pair(`searchWithoutFutility vs base search() d${d}, 12 roots`, ROOTS, S(b, "search", d), S(h, "searchWithoutFutility", d));
  pair("searchWithoutFutility vs base search() d3, 287 mate corpus", MATE_CORPUS, S(b, "search", 3), S(h, "searchWithoutFutility", 3));
  pair("chooseMoveWithoutFutility vs base chooseMove to 5, 12 roots", ROOTS, E(b, "chooseMove", frozen(5)), E(h, "chooseMoveWithoutFutility", frozen(5)));
  pair("chooseMoveWithoutFutility vs base chooseMove maxNodes 47000, the 190", C190, E(b, "chooseMove", nodes47), E(h, "chooseMoveWithoutFutility", nodes47));
}
if (part === "all" || part === "history") {
  const hist = (f) => frozen(5, { priorKeys: history(f) });
  const HR = ROOTS.map(withClock);
  pair("chooseMoveWithoutFutility vs base chooseMove to 5 WITH priorKeys (4 reversible grandchild keys each twice, clock 20), 12 roots", HR, E(b, "chooseMove", hist), E(h, "chooseMoveWithoutFutility", hist));
  let moved = 0;
  for (const f of HR) if (row(h.e.chooseMove(h.fen.parseFen(f), hist(f))) !== row(h.e.chooseMove(h.fen.parseFen(f), frozen(5)))) moved++;
  console.log(JSON.stringify({ label: "non-vacuity: head chooseMove to 5 with priorKeys differs from without", moved, of: ROOTS.length }));
}
if (part === "all") {
  // Older doors against their base selves.
  for (const name of ["searchWithoutQuietPromotions", "searchWithoutQuiescenceEvasions", "searchWithoutNullMove", "searchWithoutReductions", "searchWithoutPvsOrReductions", "searchWithoutTable", "searchWithoutKillers", "searchWithoutQuiescence"])
    pair(`${name} d4 (self), 12 roots`, ROOTS, S(b, name, 4), S(h, name, 4));
  for (const name of ["searchWithoutPruning", "searchWithoutPruningOrQuiescence", "searchWithoutOrdering"])
    pair(`${name} d3 (self), 12 roots`, ROOTS, S(b, name, 3), S(h, name, 3));
  for (const name of ["chooseMoveWithoutQuietPromotions", "chooseMoveWithoutQuiescenceEvasions", "chooseMoveWithoutNullMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"])
    pair(`${name} to 5 (self), 12 roots`, ROOTS, E(b, name, frozen(5)), E(h, name, frozen(5)));
  // Non-vacuity on the shipped path.
  let ms = 0, me = 0;
  for (const f of ROOTS) {
    if (row(b.s.search(b.fen.parseFen(f), 5)) !== row(h.s.search(h.fen.parseFen(f), 5))) ms++;
    if (row(b.e.chooseMove(b.fen.parseFen(f), frozen(5))) !== row(h.e.chooseMove(h.fen.parseFen(f), frozen(5)))) me++;
  }
  console.log(JSON.stringify({ label: "non-vacuity: head shipped differs from base shipped at 5 on the 12 roots", search: ms, chooseMove: me, of: ROOTS.length }));
}
console.log(allOk ? "QE A1: ALL EQUAL" : "QE A1: DIFFERENCES FOUND");
