// ABC-079 oracle ruling probe — OUT OF TREE. Reads src/ by absolute path, changes nothing.
//
//   SRC=/abs/src/ node probe-oracle.ts fidelity
//   SRC=/abs/src/ node probe-oracle.ts pair <variant> <position> <depth>
//   SRC=/abs/src/ node probe-oracle.ts a7 <variant> <depth>
//
// variant: on8 (quiescence on, cap 8 = shipped) | off (quiescence off) | capK (quiescence on, cap K)
// One JSON line per measurement: nodes, score, move and wall ms for EACH side, plus load average.
import { loadavg } from "node:os";

const SRC = process.env.SRC as string;
const { parseFen } = await import(`${SRC}fen.ts`);
const { legalMoves, isInCheck } = await import(`${SRC}legal.ts`);
const { makeMove, unmakeMove } = await import(`${SRC}apply.ts`);
const { evaluate } = await import(`${SRC}evaluate.ts`);
const { gameStatus } = await import(`${SRC}gameend.ts`);
const { EMPTY, squareName } = await import(`${SRC}position.ts`);
const { mvvLvaKey } = await import(`${SRC}quiescence.ts`);
const src = await import(`${SRC}search.ts`);

const MATE = 30_000;
const CORPUS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};

interface Sw { prune: boolean; q: boolean; cap: number }

/** src/quiescence.ts's quiesce, line for line, with the cap as a parameter. */
function quiesce(pos: any, alpha: number, beta: number, qply: number, cap: number, c: { n: number }): number {
  if (qply > 0) c.n++;
  const standPat = evaluate(pos);
  if (standPat >= beta) return standPat;
  if (qply >= cap) return standPat;
  let best = standPat;
  if (best > alpha) alpha = best;
  const caps: any[] = [];
  for (const m of legalMoves(pos)) if (m.captured !== EMPTY) caps.push(m);
  caps.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a));
  for (const m of caps) {
    const u = makeMove(pos, m);
    const s = 0 - quiesce(pos, 0 - beta, 0 - alpha, qply + 1, cap, c);
    unmakeMove(pos, m, u);
    if (s > best) best = s;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function leaf(pos: any, ply: number, alpha: number, beta: number, sw: Sw, c: { n: number }): number {
  const st = gameStatus(pos);
  if (st.result === "in-progress") return sw.q ? quiesce(pos, alpha, beta, 0, sw.cap, c) : evaluate(pos);
  if (st.reason === "checkmate") return 0 - (MATE - ply);
  return 0;
}

function negamax(pos: any, d: number, alpha: number, beta: number, ply: number, sw: Sw, c: { n: number }): number {
  c.n++;
  if (d <= 0) return leaf(pos, ply, alpha, beta, sw, c);
  const moves = legalMoves(pos);
  if (moves.length === 0) return isInCheck(pos) ? 0 - (MATE - ply) : 0;
  let best = Number.NEGATIVE_INFINITY;
  for (const m of moves) {
    const u = makeMove(pos, m);
    const s = 0 - negamax(pos, d - 1, 0 - beta, 0 - alpha, ply + 1, sw, c);
    unmakeMove(pos, m, u);
    if (s > best) best = s;
    if (!sw.prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function root(pos: any, depth: number, sw: Sw) {
  const c = { n: 1 };
  const moves = legalMoves(pos);
  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bm = moves[0];
  for (const m of moves) {
    const u = makeMove(pos, m);
    const s = 0 - negamax(pos, depth - 1, Number.NEGATIVE_INFINITY, 0 - alpha, 1, sw, c);
    unmakeMove(pos, m, u);
    if (s > best) { best = s; bm = m; }
    if (sw.prune && best > alpha) alpha = best;
  }
  return { score: best, move: bm, nodes: c.n };
}

function parseVariant(v: string): { q: boolean; cap: number } {
  if (v === "on8") return { q: true, cap: 8 };
  if (v === "off") return { q: false, cap: 0 };
  const m = /^cap(\d+)$/.exec(v);
  if (m) return { q: true, cap: Number(m[1]) };
  throw new Error(`variant? ${v}`);
}

const lbl = (m: any) => (m ? `${squareName(m.from)}${squareName(m.to)}` : "null");
const snap = (p: any) => JSON.stringify([Array.from(p.board), p.blackToMove, p.castling, p.epSquare, p.halfmoveClock, p.fullmoveNumber]);

function timed<T>(f: () => T): [T, number] {
  const t = performance.now();
  const r = f();
  return [r, Math.round(performance.now() - t)];
}

const [mode, a, b, c] = process.argv.slice(2);
const load0 = loadavg()[0].toFixed(2);

if (mode === "fidelity") {
  // The copy against src/, depth 1-2 on all six roots, every door: nodes, score and move equal.
  const rows: string[] = [];
  let bad = 0;
  for (const [name, fen] of Object.entries(CORPUS)) {
    for (const d of [1, 2]) {
      const pairs: Array<[string, any, Sw]> = [
        ["search", src.search, { prune: true, q: true, cap: 8 }],
        ["searchWithoutQuiescence", src.searchWithoutQuiescence, { prune: true, q: false, cap: 0 }],
        ["searchWithoutPruning", src.searchWithoutPruning, { prune: false, q: true, cap: 8 }],
      ];
      for (const [door, fn, sw] of pairs) {
        const s = fn(parseFen(fen), d);
        const m = root(parseFen(fen), d, sw);
        const ok = s.nodes === m.nodes && Object.is(s.score, m.score) && lbl(s.move) === lbl(m.move);
        if (!ok) bad++;
        rows.push(`${name} d${d} ${door}: src ${s.nodes}/${s.score}/${lbl(s.move)} copy ${m.nodes}/${m.score}/${lbl(m.move)} ${ok ? "EQUAL" : "DIFF"}`);
      }
      // cap0 must equal off (a stand-pat at qply 0 IS the bare evaluation), both sides.
      for (const prune of [true, false]) {
        const x = root(parseFen(fen), d, { prune, q: true, cap: 0 });
        const y = root(parseFen(fen), d, { prune, q: false, cap: 0 });
        const ok = x.nodes === y.nodes && Object.is(x.score, y.score) && lbl(x.move) === lbl(y.move);
        if (!ok) bad++;
        rows.push(`${name} d${d} cap0==off prune=${prune}: ${x.nodes}/${x.score} vs ${y.nodes}/${y.score} ${ok ? "EQUAL" : "DIFF"}`);
      }
    }
  }
  console.log(rows.join("\n"));
  console.log(JSON.stringify({ mode, mismatches: bad, load0 }));
} else if (mode === "pair") {
  const v = parseVariant(a);
  const depth = Number(c);
  const pos = parseFen(CORPUS[b]);
  const before = snap(pos);
  const [p, tp] = timed(() => root(pos, depth, { prune: true, ...v }));
  const [u, tu] = timed(() => root(pos, depth, { prune: false, ...v }));
  console.log(JSON.stringify({
    mode, variant: a, position: b, depth,
    pruned: { nodes: p.nodes, score: p.score, move: lbl(p.move), ms: tp },
    unpruned: { nodes: u.nodes, score: u.score, move: lbl(u.move), ms: tu },
    A1: Object.is(p.score, u.score) ? "EQUAL" : "DIFF",
    A2ratio: +(p.nodes / u.nodes).toFixed(4),
    intact: snap(pos) === before,
    wallMs: tp + tu, load0, load1: loadavg()[0].toFixed(2),
  }));
} else if (mode === "srcpair") {
  // src/'s OWN exports, not the copy: search() then searchWithoutPruning(), as searchPair() does.
  const depth = Number(b);
  const pos = parseFen(CORPUS[a]);
  const [p, tp] = timed(() => src.search(pos, depth));
  const [u, tu] = timed(() => src.searchWithoutPruning(pos, depth));
  console.log(JSON.stringify({ mode, position: a, depth, pruned: { nodes: p.nodes, score: p.score, ms: tp }, unpruned: { nodes: u.nodes, score: u.score, ms: tu }, A1: Object.is(p.score, u.score) ? "EQUAL" : "DIFF", wallMs: tp + tu, load0, load1: loadavg()[0].toFixed(2) }));
} else if (mode === "a7") {
  const v = parseVariant(a);
  const depth = Number(b);
  const per: Record<string, number> = {};
  let intact = true;
  const t0 = performance.now();
  for (const [name, fen] of Object.entries(CORPUS)) {
    const pos = parseFen(fen);
    const before = snap(pos);
    const t = performance.now();
    root(pos, 3, { prune: true, q: true, cap: 8 }); // A7 always searches the SHIPPED pruned side at 3
    root(pos, depth, { prune: false, ...v });
    per[name] = Math.round(performance.now() - t);
    if (snap(pos) !== before) intact = false;
  }
  console.log(JSON.stringify({ mode, variant: a, unprunedDepth: depth, perRootMs: per, intact, wallMs: Math.round(performance.now() - t0), load0, load1: loadavg()[0].toFixed(2) }));
}
