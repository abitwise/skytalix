// qe-ABC-229 independent sweep on a tree (head, or a planted copy). (1) LIST: for every node of perft-style trees from
// promotion-rich and standard roots, legalCapturesAndQueenPromotions(p) must equal legalCaptures(p) in order, then the
// legal quiet QUEEN promotions derived independently from legalMoves(p) (captured EMPTY, promotion QUEEN), by `from`
// ascending; and the position must be unchanged (toFen + board bytes). (2) VALUE (unless --list-only): on up to
// VALUE_CAP positions with a legal quiet queen promotion, quiesce at qply 0, full window, under the shipped record =
// QE plain negamax (new rule), and under the pre-ABC-229 record = QE plain negamax (old rule) = base's shipped quiesce.
// Reference nodes are capped per position; a capped position is counted as skipped, never as a pass.
// usage: node sweep.mjs <tree> [baseTree] [--list-only]
const args = process.argv.slice(2);
const listOnly = args.includes("--list-only");
const [T, B] = args.filter((a) => !a.startsWith("--"));
const { parseFen, toFen } = await import(`${T}/src/fen.ts`);
const { evaluate } = await import(`${T}/src/evaluate.ts`);
const L = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const qh = await import(`${T}/src/quiescence.ts`);
const base = B ? { q: await import(`${B}/src/quiescence.ts`), fen: await import(`${B}/src/fen.ts`) } : null;
const QUEEN = 5, EMPTY = 0;
const ROOTS = [
  ["start", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 3],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 3],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 4],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 3],
  ["position-4-mirror", "r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1", 3],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 3],
  ["promo-7", "n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1", 4],
  ["eight-each", "8/PPPPPPPP/8/2k5/8/K7/pppppppp/8 w - - 0 1", 3],
  ["pinned-b7", "K7/1P6/8/8/4b3/8/8/7k w - - 0 1", 4],
  ["blocked-7th", "1n4k1/1P3pPp/7P/8/8/8/p1p3K1/1N6 w - - 0 1", 4],
];
const snap = (p) => `${toFen(p)}|${Array.from(p.board).join(",")}`;
const key = (m) => `${m.from}-${m.to}-${m.piece}-${m.captured}-${m.flags}-${m.promotion}`;
let positions = 0, withPromo = 0, inCheckN = 0, listFail = 0, mutated = 0;
const promoFens = [];
const seenPromo = new Set();
function visit(p, depth) {
  positions++;
  const before = snap(p);
  const got = L.legalCapturesAndQueenPromotions(p).map(key);
  if (snap(p) !== before) mutated++;
  const quietQ = L.legalMoves(p).filter((m) => m.captured === EMPTY && m.promotion === QUEEN).sort((a, b) => a.from - b.from);
  const want = [...L.legalCaptures(p), ...quietQ].map(key);
  if (L.isInCheck(p)) inCheckN++;
  if (quietQ.length > 0) {
    withPromo++;
    const f = toFen(p);
    if (!seenPromo.has(f)) { seenPromo.add(f); promoFens.push(f); }
  }
  if (got.join("|") !== want.join("|")) { listFail++; if (listFail <= 5) console.log(`LIST FAIL ${toFen(p)}\n  got  ${got.join(" ")}\n  want ${want.join(" ")}`); }
  if (depth === 0) return;
  for (const m of L.legalMoves(p)) { const u = makeMove(p, m); visit(p, depth - 1); unmakeMove(p, m, u); }
}
for (const [name, fen, d] of ROOTS) {
  const p0 = positions, w0 = withPromo;
  visit(parseFen(fen), d);
  console.log(`root ${name} d${d}: positions ${positions - p0}, with a legal quiet Q promotion ${withPromo - w0}`);
}
console.log(`LIST: positions ${positions} (in check ${inCheckN}), with a quiet Q promotion ${withPromo}, list mismatches ${listFail}, mutated ${mutated}`);
if (listOnly) process.exit(listFail || mutated ? 1 : 0);
const M = qh.MATE_SCORE, CAP = qh.QUIESCENCE_MAX_PLY, NODE_CAP = 200_000, VALUE_CAP = Number(process.env.VALUE_CAP ?? 400);
let refNodes = 0;
class Capped extends Error {}
function ref(p, qply, newRule) {
  if (++refNodes > NODE_CAP) throw new Capped();
  if (L.isInCheck(p) && qply < CAP) {
    const all = L.legalMoves(p);
    if (all.length === 0) return -(M - qply);
    let best = -Infinity;
    for (const m of all) { const u = makeMove(p, m); const v = -ref(p, qply + 1, newRule); unmakeMove(p, m, u); if (v > best) best = v; }
    return best;
  }
  const stand = evaluate(p);
  if (qply >= CAP) return stand;
  let best = stand;
  const moves = L.legalCaptures(p);
  if (newRule) moves.push(...L.legalMoves(p).filter((m) => m.promotion === QUEEN && m.captured === EMPTY));
  for (const m of moves) { const u = makeMove(p, m); const v = -ref(p, qply + 1, newRule); unmakeMove(p, m, u); if (v > best) best = v; }
  return best;
}
// Deterministic spread over the promotion positions: every k-th.
const step = Math.max(1, Math.floor(promoFens.length / VALUE_CAP));
const sample = promoFens.filter((_, i) => i % step === 0).slice(0, VALUE_CAP);
let read = 0, skipped = 0, vfail = 0, moved = 0;
for (const f of sample) {
  try {
    refNodes = 0; const rn = ref(parseFen(f), 0, true);
    refNodes = 0; const ro = ref(parseFen(f), 0, false);
    const hs = qh.quiesce(parseFen(f), -Infinity, Infinity, 0, 0, { evasions: true, quietPromotions: true }, () => {});
    const ho = qh.quiesce(parseFen(f), -Infinity, Infinity, 0, 0, { evasions: true, quietPromotions: false }, () => {});
    const bo = base ? base.q.quiesce(base.fen.parseFen(f), -Infinity, Infinity, 0, 0, { evasions: true }, () => {}) : ho;
    read++;
    if (hs !== ro) moved++;
    if (hs !== rn || ho !== ro || bo !== ro) { vfail++; if (vfail <= 5) console.log(`VALUE FAIL ${f}: shipped ${hs} ref-new ${rn} | pre229 ${ho} ref-old ${ro} base ${bo}`); }
  } catch (e) {
    if (e instanceof Capped) skipped++; else throw e;
  }
}
console.log(`VALUE: sample ${sample.length} of ${promoFens.length} distinct promotion positions; read ${read}, skipped (ref cap ${NODE_CAP}) ${skipped}, value mismatches ${vfail}, positions where the rule moved the value ${moved}`);
process.exit(listFail || mutated || vfail ? 1 : 0);
