// ABC-079 A5 ruling probe — OUT OF TREE. Reads src/ by absolute path, changes nothing.
// Usage: node probe079.ts <maxDepth> <variant,variant,...>
import { loadavg } from "node:os";
// Point SRC at a checkout: SRC=/abs/path/to/src/ node probe079.ts <maxDepth> <variants> [minDepth]
const SRC = process.env.SRC ?? new URL("../../../src/", import.meta.url).pathname;
const { parseFen } = await import(`${SRC}fen.ts`);
const { legalMoves, isInCheck } = await import(`${SRC}legal.ts`);
const { makeMove, unmakeMove } = await import(`${SRC}apply.ts`);
const { evaluate } = await import(`${SRC}evaluate.ts`);
const { gameStatus } = await import(`${SRC}gameend.ts`);
const { isSquareAttackedBy } = await import(`${SRC}moves.ts`);
const { EMPTY, pieceType } = await import(`${SRC}position.ts`);
const { quiesce: shippedQuiesce, QUIESCENCE_MAX_PLY } = await import(`${SRC}quiescence.ts`);
const { search, searchWithoutQuiescence } = await import(`${SRC}search.ts`);

const MATE_SCORE = 30_000;
const VAL = [0, 100, 320, 330, 500, 900, 0];

type Q = (pos: any, alpha: number, beta: number, qply: number, visit: (q: number) => void) => number;

interface Opts { order: boolean; delta: boolean; badcap: boolean; cap: number }

/** An independent, textbook quiescence: stand-pat lower bound, alpha raise, fail-soft. */
function makeRef(o: Opts): Q {
  const q: Q = (pos, alpha, beta, qply, visit) => {
    if (qply > 0) visit(qply);
    const standPat = evaluate(pos);
    if (standPat >= beta) return standPat;
    if (qply >= o.cap) return standPat;
    let best = standPat;
    if (best > alpha) alpha = best;
    // BIG DELTA: even winning a queen cannot raise alpha -> stand pat.
    if (o.delta && standPat + 900 + 200 < alpha) return standPat;
    let caps = legalMoves(pos).filter((m: any) => m.captured !== EMPTY);
    if (o.order) {
      caps = caps
        .map((m: any) => ({ m, k: VAL[pieceType(m.captured)] * 10 - VAL[pieceType(m.piece)] / 100 }))
        .sort((a: any, b: any) => b.k - a.k)
        .map((x: any) => x.m);
    }
    for (const move of caps) {
      const gain = VAL[pieceType(move.captured)] + (move.promotion !== EMPTY ? 800 : 0);
      if (o.delta && standPat + gain + 200 < alpha) continue;
      if (o.badcap && VAL[pieceType(move.piece)] > VAL[pieceType(move.captured)]) {
        // a higher piece takes a lower one onto a defended square: skip (SEE-lite, no true SEE)
        if (isSquareAttackedBy(pos, move.to, !pos.blackToMove)) continue;
      }
      const undo = makeMove(pos, move);
      let score: number;
      try { score = 0 - q(pos, 0 - beta, 0 - alpha, qply + 1, visit); } finally { unmakeMove(pos, move, undo); }
      if (score > best) best = score;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  };
  return q;
}

/** A copy of src/search.ts's negamax/root with the leaf quiescence pluggable. */
function makeSearch(q: Q | null) {
  const counter = { nodes: 0, q: 0, byPly: new Array(40).fill(0) };
  const visit = (qp: number) => { counter.nodes++; counter.q++; counter.byPly[qp]++; };
  function leaf(pos: any, ply: number, a: number, b: number): number {
    const st = gameStatus(pos);
    if (st.result === "in-progress") return q ? q(pos, a, b, 0, visit) : evaluate(pos);
    if (st.reason === "checkmate") return 0 - (MATE_SCORE - ply);
    return 0;
  }
  function negamax(pos: any, depth: number, a: number, b: number, ply: number): number {
    counter.nodes++;
    if (depth <= 0) return leaf(pos, ply, a, b);
    const moves = legalMoves(pos);
    if (moves.length === 0) return isInCheck(pos) ? 0 - (MATE_SCORE - ply) : 0;
    let best = Number.NEGATIVE_INFINITY;
    for (const m of moves) {
      const undo = makeMove(pos, m);
      const s = 0 - negamax(pos, depth - 1, 0 - b, 0 - a, ply + 1);
      unmakeMove(pos, m, undo);
      if (s > best) best = s;
      if (best > a) a = best;
      if (a >= b) break;
    }
    return best;
  }
  return (pos: any, depth: number) => {
    counter.nodes = 1; counter.q = 0; counter.byPly.fill(0);
    const moves = legalMoves(pos);
    let a = Number.NEGATIVE_INFINITY, best = Number.NEGATIVE_INFINITY, bm = moves[0];
    for (const m of moves) {
      const undo = makeMove(pos, m);
      const s = 0 - negamax(pos, depth - 1, Number.NEGATIVE_INFINITY, 0 - a, 1);
      unmakeMove(pos, m, undo);
      if (s > best) { best = s; bm = m; }
      if (best > a) a = best;
    }
    return { score: best, move: bm, nodes: counter.nodes, q: counter.q, byPly: counter.byPly.slice(0, 10) };
  };
}

const VARIANTS: Record<string, Q | null> = {
  bare: null,
  shipped: shippedQuiesce,
  ref: makeRef({ order: false, delta: false, badcap: false, cap: QUIESCENCE_MAX_PLY }),
  "ref-nocap": makeRef({ order: false, delta: false, badcap: false, cap: 64 }),
  mvv: makeRef({ order: true, delta: false, badcap: false, cap: QUIESCENCE_MAX_PLY }),
  "mvv-nocap": makeRef({ order: true, delta: false, badcap: false, cap: 64 }),
  "mvv+delta": makeRef({ order: true, delta: true, badcap: false, cap: QUIESCENCE_MAX_PLY }),
  "mvv+delta+badcap": makeRef({ order: true, delta: true, badcap: true, cap: QUIESCENCE_MAX_PLY }),
  "delta-only": makeRef({ order: false, delta: true, badcap: false, cap: QUIESCENCE_MAX_PLY }),
};

const POS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};

const maxDepth = Number(process.argv[2] ?? 3);
const wanted = (process.argv[3] ?? Object.keys(VARIANTS).join(",")).split(",");
const minDepth = Number(process.argv[4] ?? 1);
const sq = (m: any) => m ? `${"abcdefgh"[m.from & 7]}${(m.from >> 4) + 1}${"abcdefgh"[m.to & 7]}${(m.to >> 4) + 1}` : "-";

console.log(`node ${process.version} loadavg ${loadavg().map((x) => x.toFixed(2)).join(" ")}`);
console.log("position   depth  variant            nodes        q-nodes   ratio    score   move   ms   q-by-ply(1..8)");
for (const [name, fen] of Object.entries(POS)) {
  for (let d = minDepth; d <= maxDepth; d++) {
    const pos = parseFen(fen);
    const bare = searchWithoutQuiescence(pos, d);
    const shippedReal = wanted.includes("shipped") ? search(pos, d) : null;
    for (const v of wanted) {
      const fn = makeSearch(VARIANTS[v]);
      const t0 = performance.now();
      const r = fn(parseFen(fen), d);
      const ms = (performance.now() - t0).toFixed(0);
      const ratio = (r.nodes / bare.nodes).toFixed(2);
      const tag = v === "shipped" && shippedReal ? (shippedReal.nodes === r.nodes && shippedReal.score === r.score ? " (=src search)" : ` (src search: ${shippedReal.nodes}/${shippedReal.score} MISMATCH)`) : "";
      console.log(`${name.padEnd(10)} ${String(d).padEnd(6)} ${v.padEnd(18)} ${String(r.nodes).padStart(10)} ${String(r.q).padStart(10)} ${ratio.padStart(9)}x ${String(r.score).padStart(6)} ${sq(r.move).padEnd(6)} ${ms.padStart(6)}  ${r.byPly.slice(1, 9).join("/")}${tag}`);
    }
  }
}
