// R1 (ABC-083) probe: what the COMPLETE evaluation would cost per call with king safety and each
// of the three mobility forms the ruling question names. PROTOTYPES, not the build: the terms
// below are the cheapest honest shape a probe can write in an hour, so they bound the order of
// magnitude, not the Engineer's final figure. Method = ABC-076's (best of 5 x N per root after a
// warm-up, six perft roots, plain node), one variant per fresh process.
// Usage: node r1-cost.mjs <tree-root> <variant> [N]
//   variant: base | ks | ks+legal | ks+pseudo | ks+attack
import { loadavg } from "node:os";

const [root, variant, nArg] = process.argv.slice(2);
const { evaluate } = await import(`${root}/src/evaluate.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { generateMoves } = await import(`${root}/src/moves.ts`);
const P = await import(`${root}/src/position.ts`);
const { EMPTY, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, BLACK, NO_SQUARE } = P;

// ---- king safety prototype: shelter (own pawn on the 1st/2nd rank ahead, king file +-1) and
// open / half-open files next to the king. White's point of view, like whiteMinusBlack.
function kingSafetyFor(board, black) {
  const king = KING | (black ? BLACK : 0);
  const ownPawn = PAWN | (black ? BLACK : 0);
  const enemyPawn = PAWN | (black ? 0 : BLACK);
  let k = -1;
  for (let sq = 0; sq < 128; sq++) {
    if ((sq & 0x88) === 0 && board[sq] === king) { k = sq; break; }
  }
  const kf = k & 7, kr = k >> 4, step = black ? -1 : 1;
  let penalty = 0;
  for (let f = kf - 1; f <= kf + 1; f++) {
    if (f < 0 || f > 7) continue;
    const r1 = kr + step, r2 = kr + 2 * step;
    const s1 = r1 >= 0 && r1 <= 7 && board[r1 * 16 + f] === ownPawn;
    const s2 = r2 >= 0 && r2 <= 7 && board[r2 * 16 + f] === ownPawn;
    if (!s1 && !s2) penalty += 15;
    let own = false, enemy = false;
    for (let r = 1; r <= 6; r++) {
      const p = board[r * 16 + f];
      if (p === ownPawn) own = true; else if (p === enemyPawn) enemy = true;
    }
    if (!own) penalty += enemy ? 10 : 20;
  }
  return penalty;
}
function kingSafety(position) {
  const b = position.board;
  const s = kingSafetyFor(b, true) - kingSafetyFor(b, false);
  return position.blackToMove ? 0 - s : s;
}

// ---- mobility forms. Both sides are counted; the side not to move is counted by flipping
// `blackToMove` (and hiding the ep square) and restoring it — transient, put back before return.
function bothSides(position, count) {
  const mine = count(position);
  const ep = position.epSquare;
  position.blackToMove = !position.blackToMove;
  position.epSquare = NO_SQUARE;
  const theirs = count(position);
  position.blackToMove = !position.blackToMove;
  position.epSquare = ep;
  return 4 * (mine - theirs);
}
const legalCount = (p) => legalMoves(p).length;
const pseudoCount = (p) => generateMoves(p).length;

const KN = [33, 31, 18, 14, -33, -31, -18, -14];
const DIAG = [17, 15, -17, -15];
const ORTH = [16, -16, 1, -1];
const KG = [17, 16, 15, 1, -1, -15, -16, -17];
const SLIDE = [17, 15, -17, -15, 16, -16, 1, -1]; // 0-3 diagonals, 4-7 orthogonals
// Attack-map count: squares each non-pawn piece reaches (empty or enemy), no Move objects, no
// make/unmake. Pawns and pins are ignored — that is what makes it the cheap form.
function attackCount(position) {
  const b = position.board;
  let score = 0;
  for (let sq = 0; sq < 128; sq++) {
    if ((sq & 0x88) !== 0) { sq += 7; continue; }
    const piece = b[sq];
    if (piece === EMPTY) continue;
    const type = piece & 7;
    if (type === PAWN) continue;
    const black = (piece & BLACK) !== 0;
    let n = 0;
    if (type === KNIGHT || type === KING) {
      const offs = type === KNIGHT ? KN : KG;
      for (let i = 0; i < 8; i++) {
        const t = sq + offs[i];
        if ((t & 0x88) !== 0) continue;
        const q = b[t];
        if (q === EMPTY || ((q & BLACK) !== 0) !== black) n++;
      }
    } else {
      const from = type === ROOK ? 4 : 0;
      const to = type === BISHOP ? 4 : 8;
      for (let i = from; i < to; i++) {
        const d = SLIDE[i];
        for (let t = sq + d; (t & 0x88) === 0; t += d) {
          const q = b[t];
          if (q === EMPTY) { n++; continue; }
          if (((q & BLACK) !== 0) !== black) n++;
          break;
        }
      }
    }
    score += black ? -n : n;
  }
  const s = 4 * score;
  return position.blackToMove ? 0 - s : s;
}

const VARIANTS = {
  base: (p) => evaluate(p),
  ks: (p) => evaluate(p) + kingSafety(p),
  "ks+legal": (p) => evaluate(p) + kingSafety(p) + bothSides(p, legalCount),
  "ks+pseudo": (p) => evaluate(p) + kingSafety(p) + bothSides(p, pseudoCount),
  "ks+attack": (p) => evaluate(p) + kingSafety(p) + attackCount(p),
};
const f = VARIANTS[variant];
if (!f) throw new Error(`unknown variant ${variant}`);

const POS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const N = Number(nArg ?? 1_000_000);
const l0 = loadavg()[0];
let sink = 0;
const out = {};
for (const [name, fen] of POS) {
  const p = parseFen(fen);
  const before = JSON.stringify([...p.board, p.blackToMove, p.epSquare]);
  for (let i = 0; i < N / 10; i++) sink += f(p);
  let best = Infinity;
  for (let r = 0; r < 5; r++) {
    const t = process.hrtime.bigint();
    for (let i = 0; i < N; i++) sink += f(p);
    best = Math.min(best, Number(process.hrtime.bigint() - t) / N);
  }
  if (JSON.stringify([...p.board, p.blackToMove, p.epSquare]) !== before) throw new Error(`${name}: position mutated`);
  out[name] = +best.toFixed(1);
}
const v = Object.values(out);
console.log(JSON.stringify({ variant, N, ...out, mean: +(v.reduce((a, b) => a + b) / v.length).toFixed(1), load1_before: +l0.toFixed(2), load1_after: +loadavg()[0].toFixed(2), at: new Date().toISOString(), sink: sink % 7 }));
