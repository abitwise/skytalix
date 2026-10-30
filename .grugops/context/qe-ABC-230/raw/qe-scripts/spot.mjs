// qe-ABC-230 spot checks of A1, A2, A3, A8 through the delivered surfaces, on QE's own fixtures.
// usage: node spot.mjs <baseTree> <headTree>   (each tree holds src/; plain node, out of tree)
// Every line is "<row> | <what> | PASS|FAIL"; the exit code is the number of FAIL rows.
const [baseTree, headTree] = process.argv.slice(2);
const load = async (tree) => ({
  fen: await import(`${tree}/src/fen.ts`),
  engine: await import(`${tree}/src/engine.ts`),
  history: await import(`${tree}/src/history.ts`),
  cm: await import(`${tree}/src/coordinate-move.ts`),
  pos: await import(`${tree}/src/position.ts`),
  vc: await import(`${tree}/src/virtual-clock.ts`),
  uci: await import(`${tree}/src/uci-session.ts`),
  levels: await import(`${tree}/src/levels.ts`),
  seam: await import(`${tree}/src/level-seam.ts`),
});
const B = await load(baseTree);
const H = await load(headTree);
let fails = 0;
const row = (id, what, ok) => {
  if (!ok) fails++;
  console.log(`${id} | ${what} | ${ok ? "PASS" : "FAIL"}`);
};
const uciOf = (T, m) => T.pos.squareName(m.from) + T.pos.squareName(m.to);
const game = (T, fen, moves) => {
  const h = T.history.newGame(fen);
  for (const t of moves) {
    const r = T.cm.parseCoordinateMove(h.position, t);
    if (r.outcome !== "move") throw new Error(t);
    T.history.playMove(h, r.move);
  }
  return h;
};
/** Drives a UCI session; returns the output lines (no book: OwnBook off). */
const session = (T, lines, step = 1) => {
  const out = [];
  const s = T.uci.createUciSession({
    write: (l) => out.push(l),
    now: T.vc.virtualClock(step),
    random: () => 0.5,
    book: { bookMove: () => undefined, openingName: () => undefined },
  });
  s.handleLine("setoption name OwnBook value false");
  for (const l of lines) s.handleLine(l);
  return out;
};
const lastInfo = (out) => out.filter((l) => l.startsWith("info depth")).at(-1) ?? "";
const best = (out) => out.filter((l) => l.startsWith("bestmove")).at(-1) ?? "";
const scoreIn = (line) => /score (cp|mate) (-?\d+)/.exec(line)?.slice(1).join(" ") ?? "?";

// QE's own fixtures (not the SE's): queen/rook on b1/c1, both colours, plus the startpos knight shuffle.
const A1 = [
  ["Q-b1 black", "4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1", "d8e8"],
  ["Q-b8 white", "1q2k3/8/8/8/8/8/8/4K3 b - - 0 1", "b8b7 e1d1 b7b8 d1e1 b8b7 e1d1 b7b8", "d1e1"],
  ["R-c1 black", "4k3/8/8/8/8/8/8/2R1K3 w - - 0 1", "c1c2 e8d8 c2c1 d8e8 c1c2 e8d8 c2c1", "d8e8"],
  ["R-c8 white", "2r1k3/8/8/8/8/8/8/4K3 b - - 0 1", "c8c7 e1d1 c7c8 d1e1 c8c7 e1d1 c7c8", "d1e1"],
];
for (const [name, fen, mv, rep] of A1) {
  const moves = mv.split(" ");
  const h = game(H, fen, moves);
  const root = H.fen.toFen(h.position);
  const prior = H.engine.trimPriorKeys(H.history.keyHistory(h), h.position.halfmoveClock);
  for (const d of [4, 5]) {
    const o = { budgetMs: 1e9, maxDepth: d };
    const base = B.engine.chooseMove(B.fen.parseFen(root), { ...o, now: B.vc.virtualClock(1) });
    const keys = H.engine.chooseMove(H.fen.parseFen(root), { ...o, now: H.vc.virtualClock(1), priorKeys: prior });
    const info = `d${d} base ${uciOf(B, base.move)} ${base.score} | keys ${uciOf(H, keys.move)} ${keys.score} | prior ${prior.length}`;
    // v2: the ticket's wording ("scores exactly 0 … base scores it otherwise"); base may pick the same move (INFO).
    row(`A1 ${name}`, `${info} | base move ${uciOf(B, base.move) === rep ? "same (INFO)" : "differs"}`, uciOf(H, keys.move) === rep && keys.score === 0 && base.score !== 0);
  }
  // CLI surface: createLevelSeam(5, …, keyHistory) on the game, virtual clock; base seam has no third argument.
  const seamH = H.seam.createLevelSeam(5, { seed: 1, now: H.vc.virtualClock(1) }, H.history.keyHistory);
  const seamB = B.seam.createLevelSeam(5, { seed: 1, now: B.vc.virtualClock(1) });
  const mH = uciOf(H, await seamH(h));
  const mB = uciOf(B, await seamB(game(B, fen, moves)));
  // v2: discriminating only where base's seam plays another move; otherwise the row is marked non-discriminating.
  row(`A1 ${name} CLI seam L5`, `head ${mH} base ${mB}${mB === rep ? " (non-discriminating: base plays it too)" : ""}`, mH === rep);
  // A2: UCI on the same game, go depth 4 = cp 0 and the repetition; go movetime 3000 bestmove = the CLI seam's.
  const u4 = session(H, [`position fen ${fen} moves ${mv}`, "go depth 4"]);
  row(`A2 ${name} go depth 4`, `${scoreIn(lastInfo(u4))} ${best(u4)}`, scoreIn(lastInfo(u4)) === "cp 0" && best(u4) === `bestmove ${rep}`);
  const ut = session(H, [`position fen ${fen} moves ${mv}`, "go movetime 3000"]);
  row(`A2 ${name} bestmove = CLI`, `${best(ut)} vs CLI ${mH}`, best(ut) === `bestmove ${mH}`);
  // A8: one move in, the repetition move is a 2nd occurrence: head with keys = base, node for node, d3..5.
  const h2 = game(H, fen, moves.slice(0, 3));
  const root2 = H.fen.toFen(h2.position);
  const prior2 = H.engine.trimPriorKeys(H.history.keyHistory(h2), h2.position.halfmoveClock);
  for (const d of [3, 4, 5]) {
    const o = { budgetMs: 1e9, maxDepth: d };
    const base = B.engine.chooseMove(B.fen.parseFen(root2), { ...o, now: B.vc.virtualClock(1) });
    const keys = H.engine.chooseMove(H.fen.parseFen(root2), { ...o, now: H.vc.virtualClock(1), priorKeys: prior2 });
    const eq = uciOf(B, base.move) === uciOf(H, keys.move) && base.score === keys.score && base.nodes === keys.nodes;
    row(`A8 ${name}`, `d${d} base ${uciOf(B, base.move)} ${base.score} n${base.nodes} | keys ${uciOf(H, keys.move)} ${keys.score} n${keys.nodes} | prior ${prior2.length}`, eq);
  }
  const u8h = session(H, [`position fen ${fen} moves ${moves.slice(0, 3).join(" ")}`, "go depth 4"]);
  const u8b = session(B, [`position fen ${fen} moves ${moves.slice(0, 3).join(" ")}`, "go depth 4"]);
  row(`A8 ${name} UCI`, `${lastInfo(u8h)} == base`, lastInfo(u8h) === lastInfo(u8b) && best(u8h) === best(u8b));
}

// A2 from startpos: the knight shuffle; report head vs base (H3 says same move and score, fewer nodes).
{
  const mv = "g1f3 g8f6 f3g1 f6g8 g1f3 g8f6 f3g1";
  const uh = session(H, [`position startpos moves ${mv}`, "go depth 4"]);
  const ub = session(B, [`position startpos moves ${mv}`, "go depth 4"]);
  console.log(`INFO A2 startpos shuffle | head ${lastInfo(uh)} ${best(uh)} | base ${lastInfo(ub)} ${best(ub)}`);
}

// A3: a bare FEN, a bare startpos, ucinewgame after a game, and a refused position: head = base, line for line.
const BARE = [
  ["kiwipete", ["position fen r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "go depth 5"]],
  ["A1 root as bare FEN", ["position fen 3k4/8/8/8/8/8/8/1Q2K3 b - - 7 4", "go depth 5"]],
  ["clock-99 bare FEN", ["position fen 8/8/8/4k3/8/8/4P3/4K3 w - - 99 80", "go depth 6"]],
  ["startpos bare", ["position startpos", "go depth 5"]],
  ["ucinewgame after a game", [`position fen 4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1 moves b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1`, "go depth 3", "ucinewgame", "go depth 5"]],
  ["ucinewgame then bare FEN", [`position fen 4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1 moves b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1`, "ucinewgame", "position fen 3k4/8/8/8/8/8/8/1Q2K3 b - - 7 4", "go depth 5"]],
  ["refused position", [`position fen 4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1 moves b1b2 e8d8 zz99`, "go depth 4"]],
  ["refused then bare FEN", [`position fen 4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1 moves b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1`, "position fen 4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1 moves b1b2 xx", "position fen 3k4/8/8/8/8/8/8/1Q2K3 b - - 7 4", "go depth 5"]],
];
for (const [name, lines] of BARE) {
  // v2: the output after the last ucinewgame/position-refusal setup only; a search on the game before it may differ.
  const cut = lines.lastIndexOf("ucinewgame");
  const pre = cut === -1 ? 0 : session(H, lines.slice(0, cut)).length;
  const preB = cut === -1 ? 0 : session(B, lines.slice(0, cut)).length;
  const oh = session(H, lines).slice(pre);
  const ob = session(B, lines).slice(preB);
  row(`A3 ${name}`, `${oh.filter((l) => !l.startsWith("info string")).join(" / ")}`, JSON.stringify(oh) === JSON.stringify(ob));
}
// A3 CLI: a game started from a FEN (no moves yet) through the seam with keyHistory = the base seam.
{
  const fen = "3k4/8/8/8/8/8/8/1Q2K3 b - - 7 4";
  const mH = uciOf(H, await H.seam.createLevelSeam(5, { seed: 3, now: H.vc.virtualClock(1) }, H.history.keyHistory)(game(H, fen, [])));
  const mB = uciOf(B, await B.seam.createLevelSeam(5, { seed: 3, now: B.vc.virtualClock(1) })(game(B, fen, [])));
  row("A3 CLI game from a FEN", `head ${mH} base ${mB}`, mH === mB);
}
console.log(`FAIL rows: ${fails}`);
process.exit(fails);
