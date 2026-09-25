// Out-of-tree probe for ruling-abc080-081. Imports the wave tree's src/ READ-ONLY; writes nothing.
// A faithful copy of src/search.ts's negamax + leaf, with switches for each lever.
const SRC = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ruling-abc080-081/src/";
const { makeMove, unmakeMove } = await import(SRC + "apply.ts");
const { evaluate } = await import(SRC + "evaluate.ts");
const { gameStatus } = await import(SRC + "gameend.ts");
const { isInCheck, legalMoves } = await import(SRC + "legal.ts");
const { parseFen } = await import(SRC + "fen.ts");
const { mvvLvaKey, QUIESCENCE_MAX_PLY } = await import(SRC + "quiescence.ts");
const { search, MATE_SCORE } = await import(SRC + "search.ts");
const { zobristKey, zobristKeyAfterMove } = await import(SRC + "zobrist.ts");
const P = await import(SRC + "position.ts");

const FENS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};

const EXACT = 0, LOWER = 1, UPPER = 2;
const MATE_BOUND = MATE_SCORE - 1000;
let S; // run state

function insufficient(pos) {
  let kn = 0, bi = 0; const cols = new Set();
  for (let sq = 0; sq < 128; sq++) {
    if (!P.isOnBoard(sq)) continue;
    const t = P.pieceType(pos.board[sq]);
    if (t === P.PAWN || t === P.ROOK || t === P.QUEEN) return false;
    if (t === P.KNIGHT) kn++; else if (t === P.BISHOP) { bi++; cols.add((P.fileOf(sq) + P.rankOf(sq)) & 1); }
  }
  if (kn + bi <= 1) return true;
  return kn === 0 && cols.size === 1;
}

// Copy of quiescence.ts `quiesce`, optionally seeded with the leaf's own legal list (fused leaf).
function qs(pos, alpha, beta, qply, given) {
  if (qply > 0) S.nodes++;
  const standPat = evaluate(pos);
  if (standPat >= beta) return standPat;
  if (qply >= QUIESCENCE_MAX_PLY) return standPat;
  let best = standPat; if (best > alpha) alpha = best;
  const caps = [];
  for (const m of given ?? legalMoves(pos)) if (m.captured !== P.EMPTY) caps.push(m);
  caps.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a));
  for (const m of caps) {
    const u = makeMove(pos, m);
    const s = 0 - qs(pos, 0 - beta, 0 - alpha, qply + 1, null);
    unmakeMove(pos, m, u);
    if (s > best) best = s; if (best > alpha) alpha = best; if (alpha >= beta) break;
  }
  return best;
}

function leaf(pos, ply, a, b) {
  if (S.cfg.fused) {
    const ms = legalMoves(pos);
    if (ms.length === 0) return isInCheck(pos) ? 0 - (MATE_SCORE - ply) : 0;
    if (insufficient(pos) || pos.halfmoveClock >= 150) return 0;
    return qs(pos, a, b, 0, ms);
  }
  const st = gameStatus(pos);
  if (st.result === "in-progress") return qs(pos, a, b, 0, null);
  if (st.reason === "checkmate") return 0 - (MATE_SCORE - ply);
  return 0;
}

const sameMove = (x, y) => x && y && x.from === y.from && x.to === y.to && x.promotion === y.promotion;
const isQuiet = (m) => m.captured === P.EMPTY && m.promotion === P.EMPTY;

function order(moves, ply, hashMove) {
  const c = S.cfg.order; // 0 none, 1 mvv, 2 +killers, 3 +hash
  if (c === 0) return moves;
  const k = S.killers[ply] ?? [];
  const scored = moves.map((m, i) => {
    let s = 0;
    if (c >= 3 && sameMove(m, hashMove)) s = 1e9;
    else if (!isQuiet(m)) s = 1e6 + mvvLvaKey(m);
    else if (c >= 2 && sameMove(m, k[0])) s = 5e5;
    else if (c >= 2 && sameMove(m, k[1])) s = 4e5;
    return { m, s, i };
  });
  scored.sort((x, y) => y.s - x.s || x.i - y.i);
  return scored.map((x) => x.m);
}

const toTT = (s, ply) => (s > MATE_BOUND ? s + ply : s < -MATE_BOUND ? s - ply : s);
const fromTT = (s, ply) => (s > MATE_BOUND ? s - ply : s < -MATE_BOUND ? s + ply : s);

function hasNonPawn(pos) {
  const black = pos.blackToMove;
  for (let sq = 0; sq < 128; sq++) {
    if (!P.isOnBoard(sq)) continue;
    const p = pos.board[sq]; if (p === 0 || P.isBlack(p) !== black) continue;
    const t = P.pieceType(p); if (t !== P.PAWN && t !== P.KING) return true;
  }
  return false;
}

function negamax(pos, depth, alpha, beta, ply, key, allowNull) {
  S.nodes++;
  if (S.nodes > S.nodeCap) throw new Error("node cap");
  if (depth <= 0) return leaf(pos, ply, alpha, beta);
  const cfg = S.cfg; const a0 = alpha;
  let hashMove = null;
  if (cfg.order >= 3 || cfg.ttCut) {
    const e = S.tt.get(key);
    if (e) {
      S.hits++;
      hashMove = e.move;
      if (cfg.ttCut && e.depth >= depth) {
        const s = fromTT(e.score, ply);
        if (e.flag === EXACT) return s;
        if (e.flag === LOWER && s >= beta) return s;
        if (e.flag === UPPER && s <= alpha) return s;
      }
    }
    S.probes++;
  }
  const moves0 = legalMoves(pos);
  if (moves0.length === 0) return isInCheck(pos) ? 0 - (MATE_SCORE - ply) : 0;
  const inCheck = cfg.nmp || cfg.lmr ? isInCheck(pos) : false;

  if (cfg.nmp && allowNull && depth >= 3 && !inCheck && beta < MATE_BOUND && hasNonPawn(pos)) {
    const ep = pos.epSquare; pos.blackToMove = !pos.blackToMove; pos.epSquare = P.NO_SQUARE;
    const nk = zobristKey(pos);
    const s = 0 - negamax(pos, depth - 1 - 2, 0 - beta, 0 - beta + 1, ply + 1, nk, false);
    pos.blackToMove = !pos.blackToMove; pos.epSquare = ep;
    if (s >= beta) return s;
  }

  const moves = order(moves0, ply, hashMove);
  let best = -Infinity, bestMove = moves[0];
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    const u = makeMove(pos, m);
    const ck = zobristKeyAfterMove(key, pos, m, u);
    let s;
    if (cfg.pvs && i > 0) {
      let r = 0;
      if (cfg.lmr && depth >= 3 && i >= 3 && isQuiet(m) && !inCheck && !isInCheck(pos)) r = 1;
      s = 0 - negamax(pos, depth - 1 - r, 0 - alpha - 1, 0 - alpha, ply + 1, ck, true);
      if (s > alpha && r > 0) s = 0 - negamax(pos, depth - 1, 0 - alpha - 1, 0 - alpha, ply + 1, ck, true);
      if (s > alpha && s < beta) s = 0 - negamax(pos, depth - 1, 0 - beta, 0 - alpha, ply + 1, ck, true);
    } else {
      s = 0 - negamax(pos, depth - 1, 0 - beta, 0 - alpha, ply + 1, ck, true);
    }
    unmakeMove(pos, m, u);
    if (s > best) { best = s; bestMove = m; }
    if (!cfg.prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      if (cfg.order >= 2 && isQuiet(m)) {
        const k = (S.killers[ply] ??= []);
        if (!sameMove(k[0], m)) { k[1] = k[0]; k[0] = m; }
      }
      break;
    }
  }
  if (cfg.order >= 3 || cfg.ttCut) {
    const flag = best <= a0 ? UPPER : best >= beta ? LOWER : EXACT;
    S.tt.set(key, { depth, score: toTT(best, ply), flag, move: bestMove });
  }
  return best;
}

// Root: full window, never cuts (search.ts searchRoot semantics), root moves ordered too.
function root(pos, depth, key) {
  S.nodes++;
  const e = S.cfg.order >= 3 ? S.tt.get(key) : null;
  const moves = order(legalMoves(pos), 0, e ? e.move : null);
  let alpha = -Infinity, best = -Infinity, bestMove = moves[0];
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    const u = makeMove(pos, m);
    const ck = zobristKeyAfterMove(key, pos, m, u);
    let s;
    if (S.cfg.pvs && i > 0 && alpha > -Infinity) {
      s = 0 - negamax(pos, depth - 1, 0 - alpha - 1, 0 - alpha, 1, ck, true);
      if (s > alpha) s = 0 - negamax(pos, depth - 1, -Infinity, 0 - alpha, 1, ck, true);
    } else s = 0 - negamax(pos, depth - 1, -Infinity, 0 - alpha, 1, ck, true);
    unmakeMove(pos, m, u);
    if (s > best) { best = s; bestMove = m; }
    if (S.cfg.prune && best > alpha) alpha = best;
  }
  if (S.cfg.order >= 3 || S.cfg.ttCut) S.tt.set(key, { depth, score: toTT(best, 0), flag: EXACT, move: bestMove });
  return { score: best, move: bestMove };
}

// mode "fixed": one call at depth d. mode "id": iterations 1..d, TT/killers kept across iterations.
function run(fen, cfg, d, mode, nodeCap = 5e8) {
  const pos = parseFen(fen);
  S = { cfg: { prune: true, ...cfg }, nodes: 0, tt: new Map(), killers: [], hits: 0, probes: 0, nodeCap };
  const key = zobristKey(pos);
  const t0 = process.hrtime.bigint();
  const per = [];
  let r;
  for (let it = mode === "id" ? 1 : d; it <= d; it++) {
    const n0 = S.nodes;
    r = root(pos, it, key);
    per.push({ depth: it, nodes: S.nodes - n0, ms: Number(process.hrtime.bigint() - t0) / 1e6 });
  }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { score: r.score, move: r.move, nodes: S.nodes, ms, per, hits: S.hits, probes: S.probes, ttSize: S.tt.size };
}

export { run, search, parseFen, FENS };

const argv = process.argv.slice(2);
if (argv[0] === "faithful") {
  for (const [name, fen] of Object.entries(FENS)) for (let d = 1; d <= 3; d++) {
    const a = search(parseFen(fen), d); const b = run(fen, { order: 0 }, d, "fixed");
    const c = run(fen, { order: 0, fused: true }, d, "fixed");
    console.log(name, d, "search.ts", a.score, a.nodes, "| probe", b.score, b.nodes, "| fused", c.score, c.nodes,
      a.score === b.score && a.nodes === b.nodes && c.nodes === b.nodes && c.score === b.score ? "MATCH" : "MISMATCH");
  }
} else if (argv[0] === "cfg") {
  const [, name, json, d, mode] = argv;
  const r = run(FENS[name], JSON.parse(json), Number(d), mode);
  console.log(JSON.stringify({ name, cfg: JSON.parse(json), d: Number(d), mode, score: r.score, nodes: r.nodes, ms: Math.round(r.ms), per: r.per.map((p) => [p.depth, p.nodes, Math.round(p.ms)]), hitRate: r.probes ? +(r.hits / r.probes).toFixed(3) : null, ttSize: r.ttSize }));
}
