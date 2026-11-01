// qe-ABC-254 independent differential (QE's own corpus, not the SE's walks): lazy filters vs the full filters (oracle)
// in the head tree. Two corpora, seeded (xorshift32), deterministic:
//  (R) random playouts: from the 6 perft roots, the 6 ABC-078 endgames and the 58 puzzle FENs, random legal moves
//      (biased 1/3 toward checks, captures, promotions and en passant) up to 300 plies or game end;
//  (P) random placements: 2 kings + 1..14 random pieces, a random side, a random castling/ep field, kept only if
//      parseFen (ADR-0033: reachable boards) accepts it; sliders are favoured so pins, x-rays and ep-rank pins occur.
// At every node: the 4 lists equal in order (from-to-promotion-flags-piece-captured), hasLegalMove equal, and
// toFen + zobristKey unchanged after each lazy call. usage: node fuzz.mjs <treeDir> <seed> <playouts> <placements>
const [tree, seedArg, nPlay, nPlace] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const L = await import(`${tree}/src/legal.ts`);
const { makeMove } = await import(`${tree}/src/apply.ts`);
const { zobristKey } = await import(`${tree}/src/zobrist.ts`);
const { PUZZLES } = await import(`${tree}/src/puzzle-corpus.ts`);
const { generateMoves } = await import(`${tree}/src/moves.ts`);
let s = Number(seedArg) >>> 0 || 1;
const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const lbl = (m) => `${m.from}-${m.to}-${m.promotion}-${m.flags}-${m.piece}-${m.captured}`;
const st = { nodes: 0, inCheck: 0, ep: 0, pinRejected: 0, epRejected: 0, kingRejected: 0, quietPromoNodes: 0, mismatches: 0, mutations: 0, noMove: 0 };
const fails = [];
function check(p, where) {
  st.nodes++;
  const fen = toFen(p), key = zobristKey(p);
  const pairs = [["legalMoves", L.legalMoves, L.fullLegalMoves], ["legalCaptures", L.legalCaptures, L.fullLegalCaptures],
    ["legalCapturesAndQueenPromotions", L.legalCapturesAndQueenPromotions, L.fullLegalCapturesAndQueenPromotions]];
  let full0;
  for (const [name, lazy, full] of pairs) {
    const a = lazy(p).map(lbl).join(" ");
    if (toFen(p) !== fen || zobristKey(p) !== key) { st.mutations++; fails.push({ where, fen, name, kind: "mutation" }); }
    const fl = full(p); if (name === "legalMoves") full0 = fl;
    const b = fl.map(lbl).join(" ");
    if (a !== b) { st.mismatches++; if (fails.length < 20) fails.push({ where, fen, name, lazy: a, full: b }); }
  }
  const h = L.hasLegalMove(p);
  if (toFen(p) !== fen || zobristKey(p) !== key) { st.mutations++; fails.push({ where, fen, name: "hasLegalMove", kind: "mutation" }); }
  if (h !== L.fullHasLegalMove(p) || h !== full0.length > 0) { st.mismatches++; if (fails.length < 20) fails.push({ where, fen, name: "hasLegalMove" }); }
  const inCheck = L.isInCheck(p); if (inCheck) st.inCheck++;
  const kept = new Set(full0.map(lbl));
  for (const m of generateMoves(p)) {
    if (kept.has(lbl(m))) continue;
    if (m.piece % 8 === 6) st.kingRejected++; else if (m.flags === 1) st.epRejected++; else if (!inCheck) st.pinRejected++;
  }
  if (L.fullLegalCapturesAndQueenPromotions(p).length > L.fullLegalCaptures(p).length) st.quietPromoNodes++;
  if (!h) st.noMove++;
  return full0;
}
const ROOTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
  ...PUZZLES.map((z) => z.fen),
];
const t0 = Date.now();
for (let g = 0; g < Number(nPlay); g++) {
  const p = parseFen(ROOTS[g % ROOTS.length]);
  for (let ply = 0; ply < 300; ply++) {
    const moves = check(p, `R${g}/${ply}`);
    if (moves.length === 0) break;
    const fullPseudo = moves.length;
    if (moves.some((m) => m.flags === 1)) st.ep++;
    const spicy = moves.filter((m) => m.captured !== 0 || m.flags !== 0 || L.givesCheck(p, m));
    const m = spicy.length > 0 && rnd() < 1 / 3 ? pick(spicy) : pick(moves);
    makeMove(p, m); // no unmake: the playout walks forward
    if (fullPseudo && p.halfmoveClock >= 100) break;
  }
}
const tR = Date.now();
const SQ = "abcdefgh";
const PIECES = "QQRRRBBBNPPPPqqrrrbbbnpppp";
let placed = 0, tries = 0;
while (placed < Number(nPlace) && tries < Number(nPlace) * 50) {
  tries++;
  const board = Array(64).fill("");
  const put = (c) => { for (;;) { const i = Math.floor(rnd() * 64); if (board[i] === "") { board[i] = c; return i; } } };
  put("K"); put("k");
  const n = 1 + Math.floor(rnd() * 14);
  for (let i = 0; i < n; i++) put(pick(PIECES));
  let rows = [];
  for (let r = 7; r >= 0; r--) { let row = "", e = 0; for (let f = 0; f < 8; f++) { const c = board[r * 8 + f]; if (c === "") e++; else { if (e) row += e; e = 0; row += c; } } if (e) row += e; rows.push(row); }
  const side = rnd() < 0.5 ? "w" : "b";
  let ep = "-";
  if (rnd() < 0.5) { const f = Math.floor(rnd() * 8); ep = side === "w" ? `${SQ[f]}6` : `${SQ[f]}3`; }
  const castle = pick(["-", "-", "KQkq", "K", "q", "Kk"]);
  let p;
  try { p = parseFen(`${rows.join("/")} ${side} ${castle} ${ep} 0 1`); } catch { continue; }
  placed++;
  check(p, `P${placed}`);
}
console.log(JSON.stringify({ seed: Number(seedArg), playouts: Number(nPlay), placements: placed, placementTries: tries, ...st, msR: tR - t0, msP: Date.now() - tR, fails }));
