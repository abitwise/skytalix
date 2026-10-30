// qe-ABC-241 QE rows v2 (PREREG § 1; v1 kept as qrows-v1.mjs, 2 base predicates fixed): A1-A7 through the delivered surfaces, on QE's own fixtures, plain node, out of tree.
// usage: node qrows.mjs <baseTree> <headTree>   (each tree holds src/). Fixed depth or virtual clock only.
// Every row line is "<row> | <what> | PASS|FAIL"; "info |" lines are diagnostics. Exit code = FAIL count.
const [baseTree, headTree] = process.argv.slice(2);
const load = async (tree) => ({
  fen: await import(`${tree}/src/fen.ts`),
  engine: await import(`${tree}/src/engine.ts`),
  history: await import(`${tree}/src/history.ts`),
  cm: await import(`${tree}/src/coordinate-move.ts`),
  pos: await import(`${tree}/src/position.ts`),
  vc: await import(`${tree}/src/virtual-clock.ts`),
  uci: await import(`${tree}/src/uci-session.ts`),
  legal: await import(`${tree}/src/legal.ts`),
  zob: await import(`${tree}/src/zobrist.ts`),
  apply: await import(`${tree}/src/apply.ts`),
  gameend: await import(`${tree}/src/gameend.ts`),
  loop: await import(`${tree}/src/turn-loop.ts`),
  moves: await import(`${tree}/src/moves.ts`),
});
const B = await load(baseTree);
const H = await load(headTree);
let fails = 0;
const row = (id, what, ok) => {
  if (!ok) fails++;
  console.log(`${id} | ${what} | ${ok ? "PASS" : "FAIL"}`);
};
const info = (s) => console.log(`info | ${s}`);
const uciOf = (T, m) => T.pos.squareName(m.from) + T.pos.squareName(m.to) + (m.promotion ? "nbrq"[[2, 3, 4, 5].indexOf(m.promotion & 7)] : "");
const strip = (fen) => {
  const f = fen.split(" ");
  f[3] = "-";
  return f.join(" ");
};
const rk = (T, p) => T.gameend.repetitionKey(p, T.zob.zobristKey(p));
const hasEpMove = (T, p) => T.legal.legalMoves(p).some((m) => m.flags & T.moves.FLAG_EN_PASSANT);
const game = (T, fen, moves) => {
  const h = T.history.newGame(fen);
  for (const t of moves) {
    const r = T.cm.parseCoordinateMove(h.position, t);
    if (r.outcome !== "move") throw new Error(`fixture: ${t} illegal at ${T.fen.toFen(h.position)}`);
    T.history.playMove(h, r.move);
  }
  return h;
};
const session = (T, lines) => {
  const out = [];
  const s = T.uci.createUciSession({
    write: (l) => out.push(l),
    now: T.vc.virtualClock(1),
    random: () => 0.5,
    book: { bookMove: () => undefined, openingName: () => undefined },
  });
  s.handleLine("setoption name OwnBook value false");
  for (const l of lines) s.handleLine(l);
  return out;
};
const lastInfo = (out) => out.filter((l) => l.startsWith("info depth")).at(-1) ?? "";
const best = (out) => (out.filter((l) => l.startsWith("bestmove")).at(-1) ?? "").split(" ")[1];
const scoreIn = (line) => /score (cp|mate) (-?\d+)/.exec(line)?.slice(1).join(" ") ?? "?";
const nodesIn = (line) => Number(/ nodes (\d+)/.exec(line)?.[1] ?? NaN);
const atDepth = (T, h, list, depth) => {
  const c = T.engine.chooseMove(T.fen.parseFen(T.fen.toFen(h.position)), {
    budgetMs: 1e9,
    maxDepth: depth,
    priorKeys: T.engine.trimPriorKeys(list(h), h.position.halfmoveClock),
  });
  return { move: uciOf(T, c.move), score: c.score, nodes: c.nodes, depth: c.depth };
};

// ---------------- QE-A1: the helper ----------------
const A1 = [
  ["a", "W, a6, no capturer", "4k3/8/8/p7/8/8/8/4K3 w - a6 0 1", "removed"],
  ["b", "a-file wrap guard (pawn h5, ep a6)", "4k3/8/8/p6P/8/8/8/4K3 w - a6 0 1", "removed"],
  ["c", "h-file legal capture", "4k3/8/8/6Pp/8/8/8/4K3 w - h6 0 1", "kept"],
  ["d", "B to move, legal capture", "4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1", "kept"],
  ["e", "B, capturer pinned, leaves the diagonal", "8/6k1/8/8/3pP3/8/1B6/4K3 b - e3 0 1", "removed"],
  ["f", "B, capturer pinned, captures along the pin", "8/k7/8/8/3pP3/8/8/4K1B1 b - e3 0 1", "kept"],
  ["g", "captured pawn shields the king diagonally (static)", "4k3/5b2/8/3pP3/8/1K6/8/8 w - d6 0 1", "removed"],
  ["h", "in check by the pushed pawn, ep resolves", "4k3/8/8/3pP3/4K3/8/8/8 w - d6 0 1", "kept"],
  ["i", "discovered check by the push, ep does not resolve", "2b1k3/8/4K3/3pP3/8/8/8/8 w - d6 0 1", "removed"],
  ["j", "two capturers, both pinned", "2r1k3/6b1/8/2PpP3/8/2K5/8/8 w - d6 0 1", "removed"],
  ["k", "a knight beside the pushed pawn", "4k3/8/8/3pN3/8/8/8/4K3 w - d6 0 1", "removed"],
];
for (const [id, what, fen, want] of A1) {
  const p = H.fen.parseFen(fen);
  const raw = H.zob.zobristKey(p);
  const before = H.fen.toFen(p);
  const bytes = Buffer.from(p.board).toString("hex");
  const key = rk(H, p);
  const stripped = H.zob.zobristKey(H.fen.parseFen(strip(fen)));
  const got = key === raw ? "kept" : key === stripped ? "removed" : "OTHER";
  row(`QE-A1${id}`, `${what}: ${want}`, got === want);
  row(`QE-A1m-${id}`, `kept iff legalMoves offers ep (${hasEpMove(H, p)})`, (got === "kept") === hasEpMove(H, p));
  if ("egij".includes(id)) row(`QE-A1l-${id}`, "purity: FEN and board bytes unchanged", H.fen.toFen(p) === before && Buffer.from(p.board).toString("hex") === bytes);
}

// ---------------- QE-A1n F8 walk + QE-A2 hash unchanged ----------------
let seed = 0x2410;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x80000000;
};
const STARTS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
  "r3k2r/pppq1ppp/2npbn2/2b1p3/2B1P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 8",
];
let removed = 0, kept = 0, mism = 0, collisions = 0, hashDiff = 0, afterDiff = 0, positions = 0;
const sig = new Map();
const walkFens = [];
for (let g = 0; g < 400; g++) {
  const p = H.fen.parseFen(STARTS[g % STARTS.length]);
  for (let ply = 0; ply < 80; ply++) {
    const legal = H.legal.legalMoves(p);
    if (legal.length === 0) break;
    const fen = H.fen.toFen(p);
    positions++;
    const k = rk(H, p);
    if (p.epSquare !== H.pos.NO_SQUARE) {
      const isKept = k === H.zob.zobristKey(p);
      if (isKept) kept++;
      else removed++;
      if (isKept !== legal.some((m) => m.flags & H.moves.FLAG_EN_PASSANT)) mism++;
      if (!isKept && k !== H.zob.zobristKey(H.fen.parseFen(strip(fen)))) mism++;
    }
    const s = `${fen.split(" ").slice(0, 3).join(" ")} ${legal.map((m) => uciOf(H, m)).sort().join(",")}`;
    const prev = sig.get(k);
    if (prev !== undefined && prev !== s) collisions++;
    sig.set(k, s);
    // A2: base's hash of the same FEN, and zobristKeyAfterMove on every legal move, both trees.
    const bp = B.fen.parseFen(fen);
    if (B.zob.zobristKey(bp) !== H.zob.zobristKey(p)) hashDiff++;
    if (g % 20 === 0) {
      for (const m of legal) {
        const hk = H.zob.zobristKey(p);
        const hu = H.apply.makeMove(p, m);
        const ha = H.zob.zobristKeyAfterMove(hk, p, m, hu);
        const hFull = H.zob.zobristKey(p);
        H.apply.unmakeMove(p, m, hu);
        const bm = B.legal.legalMoves(bp).find((x) => uciOf(B, x) === uciOf(H, m));
        const bk = B.zob.zobristKey(bp);
        const bu = B.apply.makeMove(bp, bm);
        const ba = B.zob.zobristKeyAfterMove(bk, bp, bm, bu);
        B.apply.unmakeMove(bp, bm, bu);
        if (ha !== ba || ha !== hFull) afterDiff++;
      }
    }
    if (ply % 7 === 3 && walkFens.length < 60) walkFens.push(fen);
    // Bias toward double pushes so that ep positions are frequent.
    const doubles = legal.filter((m) => (m.piece & 7) === 1 && Math.abs(m.to - m.from) === 32);
    const pick = doubles.length > 0 && rand() < 0.5 ? doubles : legal;
    H.apply.makeMove(p, pick[Math.floor(rand() * pick.length)]);
  }
}
info(`A1n walk: ${positions} positions; ep positions kept ${kept}, removed ${removed}; mismatches ${mism}; repetition-key collisions ${collisions}`);
row("QE-A1n", `F8 walk: kept iff ep legal, removed key = stripped FEN's key, 0 collisions (kept ${kept}, removed ${removed})`, mism === 0 && collisions === 0 && kept > 0 && removed > 0);
row("QE-A2", `hash unchanged: zobristKey base = head on ${positions} positions (diff ${hashDiff}); zobristKeyAfterMove base = head = full key (diff ${afterDiff})`, hashDiff === 0 && afterDiff === 0);

// ---------------- QE-A3: game end ----------------
const statusAlong = (T, fen, moves) => {
  const h = T.history.newGame(fen);
  const out = [];
  for (const t of moves) {
    const r = T.cm.parseCoordinateMove(h.position, t);
    T.history.playMove(h, r.move);
    out.push(T.history.gameStatusOf(h));
  }
  return out;
};
const firstPly = (sts, pred) => sts.findIndex(pred) + 1;
const claimP = (s) => s.claimable?.draws?.includes("threefold-repetition") || s.reason === "fivefold-repetition";
const fiveP = (s) => s.reason === "fivefold-repetition";
const boardCountAt = (T, fen, moves, ply) => {
  const h = game(T, fen, moves.slice(0, ply));
  const list = T.history.repetitionKeyHistory ? T.history.repetitionKeyHistory(h) : T.history.keyHistory(h);
  return list.filter((k) => k === list.at(-1)).length;
};
const START = STARTS[0];
const CYC_B = ["g1f3", "d7d5", ...Array(6).fill(["f3g1", "g8f6", "g1f3", "f6g8"]).flat()];
const TWIN_B = "rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1";
for (const [name, T] of [["head", H], ["base", B]]) {
  const sts = statusAlong(T, START, CYC_B);
  const counts = [2, 6, 10, 14, 18, 22].map((ply) => `${ply}:${boardCountAt(T, START, CYC_B, ply)}`).join(" ");
  info(`A3a ${name}: first claim at ply ${firstPly(sts, claimP)}, fivefold at ply ${firstPly(sts, fiveP)}; the d5 board's own count at its plies ${counts}`);
  const tw = statusAlong(T, TWIN_B, CYC_B);
  info(`A3b ${name} twin: first claim at ply ${firstPly(tw, claimP)}, fivefold at ply ${firstPly(tw, fiveP)}`);
}
{
  const h = statusAlong(H, START, CYC_B), b = statusAlong(B, START, CYC_B);
  // 5...Ng8 is ply 10, 9...Ng8 ply 18 (head); base predicate as PREREG'd: 7...Ng8 ply 14, 11...Ng8 ply 22.
  row("QE-A3a-head", "Black's push: claim first after 5...Ng8 (ply 10), fivefold after 9...Ng8 (ply 18)", firstPly(h, claimP) === 10 && firstPly(h, fiveP) === 18);
  // v2 (QE's own predicate fixed): on base the 2.Ng1 board (plies 3, 7, 11, 15, 19) reaches 3 and 5 before the d5 board,
  // whose own count is one late (QE-A3a-board). v1 copied the ticket's per-board wording as a first-claim ply.
  row("QE-A3a-base", "base (v2): first claim at ply 11 (6.Ng1, the 2.Ng1 board), fivefold at ply 19, one ply after head", firstPly(b, claimP) === 11 && firstPly(b, fiveP) === 19);
  row("QE-A3a-board", "the d5 board's own count reaches 3 at ply 10 (head) / ply 14 (base), 5 at ply 18 / 22", boardCountAt(H, START, CYC_B, 10) === 3 && boardCountAt(B, START, CYC_B, 14) === 3 && boardCountAt(B, START, CYC_B, 10) === 2 && boardCountAt(H, START, CYC_B, 18) === 5 && boardCountAt(B, START, CYC_B, 22) === 5 && boardCountAt(B, START, CYC_B, 18) === 4);
  const ht = statusAlong(H, TWIN_B, CYC_B), bt = statusAlong(B, TWIN_B, CYC_B);
  row("QE-A3b", "twin (exd6 legal): head's first claim and fivefold plies equal base's", firstPly(ht, claimP) === firstPly(bt, claimP) && firstPly(ht, fiveP) === firstPly(bt, fiveP));
}
const FEN_EP = "4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1";
const CYC_EP = Array(5).fill(["h8h7", "e1d1", "h7h8", "d1e1"]).flat();
{
  const h = statusAlong(H, FEN_EP, CYC_EP), b = statusAlong(B, FEN_EP, CYC_EP);
  info(`A3c head: first claim ply ${firstPly(h, claimP)}; base: ${firstPly(b, claimP)}; FEN board count at ply 8: head ${boardCountAt(H, FEN_EP, CYC_EP, 8)}, base ${boardCountAt(B, FEN_EP, CYC_EP, 8)}; at ply 12 base ${boardCountAt(B, FEN_EP, CYC_EP, 12)}`);
  row("QE-A3c", "FEN carrying ep: the FEN board's third occurrence at ply 8 on head (claim reported), base counts 2 there and 3 at ply 12", firstPly(h, claimP) === 8 && h[7].claimable !== undefined && boardCountAt(B, FEN_EP, CYC_EP, 8) === 2 && boardCountAt(B, FEN_EP, CYC_EP, 12) === 3);
}
// A3d / A3e through runTurnLoop (plain node).
const loopRun = async (T, history, humanColour, humanScript, engineScript) => {
  const msgs = [];
  let hi = 0, ei = 0;
  const outcome = await T.loop.runTurnLoop({
    history,
    humanColour,
    render: (_h, _s, _t, messages) => {
      msgs.push([...messages]);
      return ["frame"];
    },
    input: async (h) => {
      if (hi >= humanScript.length) return { kind: "eof" };
      const t = humanScript[hi++];
      if (t === "claim") return { kind: "claim" };
      const r = T.cm.parseCoordinateMove(h.position, t);
      return { kind: "move", move: r.move };
    },
    engine: async (h) => {
      const t = engineScript[ei++];
      const r = T.cm.parseCoordinateMove(h.position, t);
      if (r.outcome !== "move") throw new Error(`engine fixture ${t}`);
      return r.move;
    },
    sink: { write: () => true },
  });
  return { outcome, msgs, plies: history.moves.length };
};
{
  const LINE = ["g1f3", "d7d5", "f3g1", "g8f6", "g1f3", "f6g8"];
  const res = {};
  for (const [name, T] of [["head", H], ["base", B]]) {
    for (const [tag, fen] of [["line", START], ["twin", TWIN_B]]) {
      const r = await loopRun(T, game(T, fen, LINE), "white", ["claim"], []);
      res[`${name}-${tag}`] = r.msgs.flat().find((m) => m.startsWith("repetition")) ?? "?";
    }
  }
  info(`A3d ${JSON.stringify(res)}`);
  row("QE-A3d", "refused claim after 3.Nf3 Ng8 (d5 board twice): head 'repetition 2 of 3', base '1 of 3'; twin '1 of 3' on both", res["head-line"] === "repetition 2 of 3" && res["base-line"] === "repetition 1 of 3" && res["head-twin"] === "repetition 1 of 3" && res["base-twin"] === "repetition 1 of 3");
}
{
  const CYC_W = ["e2e4", ...Array(8).fill(["g8f6", "g1f3", "f6g8", "f3g1"]).flat()];
  const white = CYC_W.filter((_, i) => i % 2 === 0), black = CYC_W.filter((_, i) => i % 2 === 1);
  const r = {};
  for (const [name, T] of [["head", H], ["base", B]]) {
    const x = await loopRun(T, T.history.newGame(START), "white", white, black);
    r[name] = `${x.outcome.result}/${x.outcome.reason}@${x.plies}`;
  }
  info(`A3e ticket line through runTurnLoop: ${JSON.stringify(r)} (9.Ng1 = ply 17, 9...Nf6 = ply 18, 11.Ng1 = ply 21)`);
  row("QE-A3e-head", "ticket line in the loop: head ends draw/fivefold after 9.Ng1 (ply 17)", r.head === "draw/fivefold-repetition@17");
  // v2 (QE's own predicate fixed): on base the 1...Nf6 board (plies 2, 6, 10, 14, 18) reaches five first, so base's game
  // ends at 9...Nf6 (ply 18), one ply after head; the 1.e4 board's own count (base 11.Ng1) is never reached in play.
  row("QE-A3e-base", "base (v2): ends draw/fivefold after 9...Nf6 (ply 18, the 1...Nf6 board)", r.base === "draw/fivefold-repetition@18");
}

// ---------------- QE-A4 / A7: prior keys, both surfaces (White's push) ----------------
const FEN4 = "4k2q/8/8/8/8/8/P7/4K3 w - - 0 1";
const TWIN4 = "4k2q/8/8/8/1p6/8/P7/4K3 w - - 0 1";
const MV4 = "a2a4 e8d8 e1d1 d8e8 d1e1 e8d8 e1d1 d8e8".split(" ");
const MV4E = "h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8".split(" ");
const rows4 = (tag, fen, moves, rep) => {
  const res = { cli: [], uci: [], base: [], baseUci: [] };
  const h = game(H, fen, moves);
  const b = game(B, fen, moves);
  for (let d = 1; d <= 5; d++) {
    res.cli.push(atDepth(H, h, H.history.repetitionKeyHistory, d));
    const out = session(H, [`position fen ${fen} moves ${moves.join(" ")}`, `go depth ${d}`]);
    res.uci.push({ move: best(out), score: scoreIn(lastInfo(out)), nodes: nodesIn(lastInfo(out)) });
    res.base.push(atDepth(B, b, B.history.keyHistory, d));
    const bo = session(B, [`position fen ${fen} moves ${moves.join(" ")}`, `go depth ${d}`]);
    res.baseUci.push({ move: best(bo), score: scoreIn(lastInfo(bo)) });
  }
  info(`A4 ${tag} cli ${res.cli.map((c) => `${c.move}/${c.score}/${c.nodes}`).join(" ")}`);
  info(`A4 ${tag} uci ${res.uci.map((c) => `${c.move}/${c.score}/${c.nodes}`).join(" ")}`);
  info(`A4 ${tag} base ${res.base.map((c) => `${c.move}/${c.score}/${c.nodes}`).join(" ")} | baseUci ${res.baseUci.map((c) => `${c.move}/${c.score}`).join(" ")}`);
  return res;
};
{
  const r = rows4("main", FEN4, MV4, "d1e1");
  row("QE-A4a", "CLI list, depth 1-5: d1e1 at exactly 0", r.cli.every((c) => c.move === "d1e1" && c.score === 0));
  row("QE-A4b", "UCI go depth 1-5: bestmove d1e1, cp 0, nodes = CLI's", r.uci.every((c, i) => c.move === "d1e1" && c.score === "cp 0" && c.nodes === r.cli[i].nodes));
  row("QE-A4c", "base (keyHistory / base UCI): not 0 at any depth", r.base.every((c) => c.score !== 0) && r.baseUci.every((c) => c.score !== "cp 0"));
  const t = rows4("twin", TWIN4, MV4, "d1e1");
  row("QE-A4d", "twin (b4xa3 legal): not 0 on either surface (head)", t.cli.every((c) => c.score !== 0) && t.uci.every((c) => c.score !== "cp 0"));
  const e = rows4("fen-ep", FEN_EP, MV4E, "d1e1");
  row("QE-A4e", "FEN carrying ep: d1e1 at exactly 0 on CLI and UCI, depth 1-5; base not 0", e.cli.every((c) => c.move === "d1e1" && c.score === 0) && e.uci.every((c) => c.move === "d1e1" && c.score === "cp 0") && e.base.every((c) => c.score !== 0) && e.baseUci.every((c) => c.score !== "cp 0"));
  // A7: after the 0-scored move, the claim (by Black, to move).
  const h = game(H, FEN4, [...MV4, "d1e1"]);
  const b = game(B, FEN4, [...MV4, "d1e1"]);
  const hs = H.history.gameStatusOf(h), bs = B.history.gameStatusOf(b);
  info(`A7 head ${JSON.stringify(hs)} base ${JSON.stringify(bs)}`);
  row("QE-A7", "after d1e1, head reports the threefold claim by Black; base reports none", hs.claimable?.by === "black" && hs.claimable.draws.includes("threefold-repetition") && bs.claimable === undefined);
}

// ---------------- QE-A5: one list ----------------
{
  const uciShaped = (T, fen, moves) => {
    const p = T.fen.parseFen(fen);
    const keys = [rk(T, p)];
    for (const t of moves) {
      T.apply.makeMove(p, T.cm.parseCoordinateMove(p, t).move);
      keys.push(rk(T, p));
    }
    return T.engine.trimPriorKeys(keys, p.halfmoveClock);
  };
  const cases = [["main", FEN4, MV4], ["fen-ep", FEN_EP, MV4E]];
  // 20 random games from the walk's starts, 12-40 plies.
  for (let g = 0; g < 20; g++) {
    const p = H.fen.parseFen(STARTS[g % STARTS.length]);
    const mv = [];
    const n = 12 + Math.floor(rand() * 28);
    for (let i = 0; i < n; i++) {
      const legal = H.legal.legalMoves(p);
      if (legal.length === 0) break;
      const doubles = legal.filter((m) => (m.piece & 7) === 1 && Math.abs(m.to - m.from) === 32);
      const quiet = legal.filter((m) => (m.piece & 7) !== 1 && m.captured === 0);
      const pool = doubles.length && rand() < 0.3 ? doubles : quiet.length && rand() < 0.7 ? quiet : legal;
      const m = pool[Math.floor(rand() * pool.length)];
      mv.push(uciOf(H, m));
      H.apply.makeMove(p, m);
    }
    if (H.legal.legalMoves(p).length > 0) cases.push([`rnd${g}`, STARTS[g % STARTS.length], mv]);
  }
  let eqList = 0, eqNodes = 0, nonEmptyEp = 0;
  for (const [, fen, mv] of cases) {
    const h = game(H, fen, mv);
    const cli = H.engine.trimPriorKeys(H.history.repetitionKeyHistory(h), h.position.halfmoveClock);
    const ushaped = uciShaped(H, fen, mv);
    if (cli.length === ushaped.length && cli.every((k, i) => k === ushaped[i])) eqList++;
    const raw = H.engine.trimPriorKeys(H.history.keyHistory(h), h.position.halfmoveClock);
    if (raw.some((k, i) => k !== cli[i])) nonEmptyEp++;
    const c = atDepth(H, h, H.history.repetitionKeyHistory, 3);
    const out = session(H, [`position fen ${fen} moves ${mv.join(" ")}`, "go depth 3"]);
    if (nodesIn(lastInfo(out)) === c.nodes && best(out) === c.move) eqNodes++;
  }
  info(`A5 cases ${cases.length}; lists equal ${eqList}; UCI nodes+move = CLI ${eqNodes}; cases whose window holds a normalised key ${nonEmptyEp}`);
  row("QE-A5", `CLI list = UCI-shaped list, and UCI go depth 3 node count + move = CLI list's, on ${cases.length} games`, eqList === cases.length && eqNodes === cases.length);
}

// ---------------- QE-A6: identity elsewhere ----------------
{
  const BARE = [
    STARTS[0], STARTS[1], STARTS[2], STARTS[3],
    "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
  ];
  let ok = 0;
  for (const fen of BARE) {
    const hc = H.engine.chooseMove(H.fen.parseFen(fen), { budgetMs: 1e9, maxDepth: 4 });
    const bc = B.engine.chooseMove(B.fen.parseFen(fen), { budgetMs: 1e9, maxDepth: 4 });
    if (uciOf(H, hc.move) === uciOf(B, bc.move) && hc.score === bc.score && hc.nodes === bc.nodes) ok++;
  }
  row("QE-A6i", `bare FENs (no prior keys), depth 4: head = base node for node on ${ok}/${BARE.length}`, ok === BARE.length);
  let n2 = 0, ok2 = 0, n3 = 0, eq3 = 0;
  for (let g = 0; g < 200 && n2 < 10; g++) {
    const p = H.fen.parseFen(STARTS[g % STARTS.length]);
    const mv = [];
    const n = 10 + Math.floor(rand() * 30);
    for (let i = 0; i < n; i++) {
      const legal = H.legal.legalMoves(p);
      if (legal.length === 0) break;
      const quiet = legal.filter((m) => (m.piece & 7) !== 1 && m.captured === 0);
      const doubles = legal.filter((m) => (m.piece & 7) === 1 && Math.abs(m.to - m.from) === 32);
      const pool = i < n - 8 && doubles.length && rand() < 0.3 ? doubles : quiet.length && rand() < 0.85 ? quiet : legal;
      const m = pool[Math.floor(rand() * pool.length)];
      mv.push(uciOf(H, m));
      H.apply.makeMove(p, m);
    }
    if (H.legal.legalMoves(p).length === 0) continue;
    const h = game(H, STARTS[g % STARTS.length], mv);
    const b = game(B, STARTS[g % STARTS.length], mv);
    if (h.position.halfmoveClock < 4) continue;
    const hl = H.engine.trimPriorKeys(H.history.repetitionKeyHistory(h), h.position.halfmoveClock);
    const bl = B.engine.trimPriorKeys(B.history.keyHistory(b), b.position.halfmoveClock);
    const epFree = hl.every((k, i) => k === bl[i]);
    const hc = atDepth(H, h, H.history.repetitionKeyHistory, 4);
    const bc = atDepth(B, b, B.history.keyHistory, 4);
    const same = hc.move === bc.move && hc.score === bc.score && hc.nodes === bc.nodes;
    if (epFree) {
      n2++;
      if (same) ok2++;
    } else if (n3 < 10) {
      n3++;
      if (same) eq3++;
    }
  }
  row("QE-A6ii", `game roots whose window holds no normalised key, depth 4: head (CLI list) = base (keyHistory) on ${ok2}/${n2}`, n2 >= 5 && ok2 === n2);
  info(`A6iii reported: roots whose window holds a normalised (uncapturable ep) key: node-equal to base on ${eq3}/${n3}`);
}
console.log(`TOTAL FAIL ${fails}`);
process.exit(fails);
