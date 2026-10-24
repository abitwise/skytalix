// A2 (scratch only): each built piece vs its oracle over the six perft FENs + terminal FENs to depth 3.
// usage: node a2.mjs <treeDir> [depth]
const tree = process.argv[2];
const DEPTH = Number(process.argv[3] ?? 3);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const legal = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const gameend = await import(`${tree}/src/gameend.ts`);
const { EMPTY } = await import(`${tree}/src/position.ts`);
const { legalMoves, isInCheck, hasLegalMove, legalCaptures, givesCheck } = legal;
const { gameStatus, leafEndReason } = gameend;

const FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80", // checkmate
  "7k/5K2/5N2/8/8/8/8/8 b - - 0 1", // stalemate, thin
  "k7/8/1K6/8/8/8/8/2Q5 b - - 0 1", // stalemate, queen
  "4k3/8/8/8/8/8/8/4K3 w - - 0 1", // insufficient
  "r3k3/8/8/8/8/8/8/4K2R w - - 150 120", // seventy-five
  "r3k3/8/8/8/8/8/8/4K2R w - - 100 120", // fifty claimable, in progress
];
const QE = [
  "4Q2k/6pp/8/8/8/8/8/6K1 b - - 150 80", // QE: mate at clock 150 (mate before 75-move)
  "7k/5K2/6B1/8/8/8/8/8 b - - 0 1", // QE: stalemate with K+B v K (stalemate before material)
  "8/8/8/8/R2K3k/8/8/8 w - - 0 1", // QE: king move discovers rook check
  "8/7k/8/8/8/8/2P5/1B4K1 w - - 0 1", // QE: pawn push (single, double) discovers bishop check
  "8/8/8/R2Pp2k/8/8/8/6K1 w - e6 0 1", // QE: en passant discovers rank check
  "5k2/8/8/8/8/8/8/4K2R w K - 0 1", // QE: castle gives check
  "3r2k1/4P3/8/8/8/8/8/4K3 w - - 0 1", // QE: promotion and capture-promotion give check
  "4k3/8/3n4/8/8/3B4/8/R3K2R b KQ - 0 1", // QE: knight check, castling rights, black to move
  "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 149 90", // QE: clock one short of 75, castles both sides
];
if (process.env.QE_EXTRA === "only") FENS.length = 0;
if (process.env.QE_EXTRA) FENS.push(...QE);
const built = {
  hasLegalMove: typeof hasLegalMove === "function",
  leafEndReason: typeof leafEndReason === "function",
  legalCaptures: typeof legalCaptures === "function",
  givesCheck: typeof givesCheck === "function",
};
let positions = 0;
let moves = 0;
let bad = 0;
const reasons = new Map();
const same = (a, b) =>
  a.from === b.from && a.to === b.to && a.piece === b.piece && a.captured === b.captured && a.flags === b.flags && a.promotion === b.promotion;
function check(p) {
  positions++;
  const before = toFen(p);
  const all = legalMoves(p);
  if (built.hasLegalMove && hasLegalMove(p) !== all.length > 0) { bad++; console.log("HASLEGAL", before); }
  if (built.leafEndReason) {
    const r1 = gameStatus(p).reason;
    const r2 = leafEndReason(p);
    reasons.set(r1, (reasons.get(r1) ?? 0) + 1);
    if (r1 !== r2) { bad++; console.log("LEAF", before, r1, r2); }
  }
  if (built.legalCaptures) {
    const want = all.filter((m) => m.captured !== EMPTY);
    const got = legalCaptures(p);
    if (got.length !== want.length || got.some((m, i) => !same(m, want[i]))) { bad++; console.log("CAPTURES", before); }
  }
  for (const m of all) {
    moves++;
    if (!built.givesCheck) continue;
    const u = makeMove(p, m);
    const want = isInCheck(p);
    unmakeMove(p, m, u);
    if (givesCheck(p, m) !== want) { bad++; console.log("CHECK", before, JSON.stringify(m)); }
  }
  if (toFen(p) !== before) { bad++; console.log("IMPURE", before); }
  return all;
}
function walk(p, d) {
  const all = check(p);
  if (d === 0) return;
  for (const m of all) {
    const u = makeMove(p, m);
    walk(p, d - 1);
    unmakeMove(p, m, u);
  }
}
for (const fen of FENS) walk(parseFen(fen), DEPTH);
console.log(JSON.stringify({ built, depth: DEPTH, positions, moves, bad, reasons: Object.fromEntries(reasons) }));
