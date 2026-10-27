// QE qe-ABC-210, the LOW in orch …334b383d: an extended node is searched as an interior node, so it does not itself test the
// dead-position / 75-move draws. Does that change a value? Head tree only: search() (extension on) vs
// searchWithoutCheckExtension (the door, = base by A1). usage: node low.mts <headTree>
const [root] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { legalMoves, givesCheck } = await import(`${root}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
const uci = (m: any) => (m ? `${squareName(m.from)}${squareName(m.to)}${m.promotion ? m.promotion : ""}` : "none");
const withClock = (fen: string, c: number) => { const f = fen.split(" "); f[4] = String(c); return f.join(" "); };
// the 190-shaped corpus: six roots, their in-progress children (as ABC-121's), plus the 287 mate corpus
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const corpus: string[] = [];
for (const r of ROOTS) { corpus.push(r); const p = parseFen(r); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") corpus.push(toFen(p)); unmakeMove(p, m, u); } }
corpus.push(...MATE_CORPUS);
// Part 1: every root at clock 149 (one reversible ply short of 150) and at its own clock; depth 1 and 2.
let n = 0, diff149 = 0, only149 = 0; const ex: string[] = [];
for (const fen of corpus) for (const d of [1, 2]) {
  const hi = withClock(fen, 149);
  const h = S.search(parseFen(hi), d), w = S.searchWithoutCheckExtension(parseFen(hi), d);
  const h0 = S.search(parseFen(fen), d), w0 = S.searchWithoutCheckExtension(parseFen(fen), d);
  n++;
  const dHi = h.score !== w.score || uci(h.move) !== uci(w.move); const dLo = h0.score !== w0.score || uci(h0.move) !== uci(w0.move);
  if (dHi) diff149++;
  if (dHi && (!dLo || h.score - w.score !== h0.score - w0.score)) { only149++; if (ex.length < 8) ex.push(`${hi} d${d}: head ${uci(h.move)} ${h.score} door ${uci(w.move)} ${w.score} | own clock: head ${uci(h0.move)} ${h0.score} door ${uci(w0.move)} ${w0.score}`); }
}
console.log(`part 1 (clock 149, ${corpus.length} roots x d1,d2 = ${n} cells): head != door on ${diff149}; of them the 75-move rule changes the head-door difference on ${only149}`);
for (const e of ex) console.log("  " + e);
// Part 2: constructed. Black to move at clock 149 whose quiet checks reach clock 150 in check (FIDE 9.6.2: drawn unless mate).
const CON = [
  // Black: only legal moves are king moves and a quiet rook check the White king can answer by capture.
  { why: "White a queen down, quiet check Re8+ answerable by Rxe8 (a capture resets the clock)", fen: "3r2k1/5ppp/8/8/8/8/q4PPP/4R1K1 w - - 149 120" },
  // dead position: K+N v K, the knight checks; every child is dead too
  { why: "dead: K+N v K, Nc7+", fen: "k7/8/1K6/1N6/8/8/8/8 w - - 0 1" },
  { why: "dead: K+B v K, Bb2+", fen: "7k/8/8/8/8/8/8/K1B5 w - - 0 1" },
];
for (const { why, fen } of CON) for (const d of [1, 2, 3]) {
  const h = S.search(parseFen(fen), d), w = S.searchWithoutCheckExtension(parseFen(fen), d);
  const p = parseFen(fen); const checks = legalMoves(p).filter((m: any) => givesCheck(p, m)).map(uci);
  console.log(`part 2 ${why} d${d}: head ${uci(h.move)} ${h.score} (${h.nodes} n) door ${uci(w.move)} ${w.score} (${w.nodes} n) checks [${checks.join(" ")}]`);
}
// Part 3: the part-1 cells, per root move: the child searched at depth 1 by each build, negated (outside the root's window
// and table, so an indication, not the in-tree value), and whether the child's best reply line meets an in-check horizon.
const P3 = "8/2p5/3p4/KP5r/5p1k/1R6/4P1P1/8 b - - 149 1";
for (const fen of [P3, withClock(P3, 1)]) {
  const p = parseFen(fen); const rows: string[] = [];
  for (const m of legalMoves(p)) { const u = makeMove(p, m); const c = toFen(p); unmakeMove(p, m, u);
    const h = -S.search(parseFen(c), 1).score, w = -S.searchWithoutCheckExtension(parseFen(c), 1).score;
    if (h !== w) rows.push(`${uci(m)} head ${h} door ${w}`); }
  console.log(`part 3 ${fen}: root moves whose d2 value differs head vs door: ${rows.length ? rows.join("; ") : "none"}`);
}
