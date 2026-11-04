// arch-ABC-283-mate: B4 (P0), B5 (zugzwang), B6 (G1), R2 (drift on the 190), R3 (d8 ratios) for one candidate.
// usage: node rest.ts <probeRoot> <candidate> <p0-main.jsonl> <parts: p0,zug,g1,drift,ratio>
const [root, cand, p0Path, partsArg] = process.argv.slice(2);
const parts = new Set(partsArg.split(","));
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const fs = await import("node:fs");
const FLAGS: Record<string, any> = { base: {}, K1: { k1L: true, k1F: true }, K1L: { k1L: true }, K1F: { k1F: true }, K2: { k2: true }, K3: { k3: true } };
const f = FLAGS[cand]; S.PROBE.k1L = !!f.k1L; S.PROBE.k1F = !!f.k1F; S.PROBE.k2 = !!f.k2; S.PROBE.k3 = !!f.k3;
const mv = (m: any) => (m ? S.mvName(m) : "-");
const ch = (fn: any, fen: string, d: number) => fn(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const out = (o: any) => console.log(JSON.stringify({ candidate: cand, ...o }));
if (parts.has("p0")) {
  // the all-off doors against main 09694a4e's figures (se-ABC-283 raw/out/p0-main.jsonl), nodes, score and move
  let equal = 0, rows = 0;
  for (const l of fs.readFileSync(p0Path, "utf8").trim().split("\n")) {
    const r = JSON.parse(l); const fen = r.name === "kiwipete" ? KIWI : POS6;
    const s = S.searchWithoutBundle(parseFen(fen), r.d); const c = ch(E.chooseMoveWithoutBundle, fen, r.d);
    const got = { name: r.name, d: r.d, search: { nodes: s.nodes, score: s.score, move: mv(s.move) }, choose: { nodes: c.nodes, score: c.score, move: mv(c.move), depth: c.depth } };
    rows++; const same = JSON.stringify(got) === JSON.stringify(r); if (same) equal++;
    out({ p0: r.name, d: r.d, same, got });
  }
  out({ P0: equal, of: rows });
}
if (parts.has("zug")) {
  const rows = [["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9], ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8], ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8], ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8], ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8], ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11], ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12]] as const;
  let ok = 0;
  for (const [name, fen, want, d] of rows) { const c = ch(E.chooseMove, fen, d); const good = mv(c.move) === want && c.depth === d; if (good) ok++; out({ zug: name, d, played: mv(c.move), want, ok: good, nodes: c.nodes }); }
  out({ zugzwang: ok, of: rows.length });
}
if (parts.has("g1")) {
  const { PUZZLES } = await import(`${root}/src/puzzle-corpus.ts`);
  const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
  const base = JSON.parse(fs.readFileSync(`${root}/src/puzzle-suite.baseline.json`, "utf8"));
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) { const c = E.chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }); const chosen = c === null ? "null" : mv(c.move); const okk = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen); if (okk) solved++; else missed.push(p.name); }
  out({ g1: solved, total: (PUZZLES as any[]).length, missed, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)) });
}
if (parts.has("drift")) {
  const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", KIWI, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", POS6];
  const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
  const corpus: string[] = [];
  for (const fen of ROOTS) { corpus.push(fen); const p = parseFen(fen); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") corpus.push(toFen(p)); unmakeMove(p, m, u); } }
  corpus.push(...END);
  const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
  for (const [what, head, door] of [["search d5", (x: string) => S.search(parseFen(x), 5).score, (x: string) => S.searchWithoutHistory(parseFen(x), 5).score], ["chooseMove d5", (x: string) => ch(E.chooseMove, x, 5).score, (x: string) => ch(E.chooseMoveWithoutHistory, x, 5).score]] as const) {
    let within = 0, n = 0, max = 0, signFlips = 0, mateChanges = 0;
    for (const x of corpus) { const a = head(x), b = door(x); if (isMate(a) || isMate(b)) { if (isMate(a) !== isMate(b)) mateChanges++; else if (Math.sign(a) !== Math.sign(b)) signFlips++; continue; } n++; const dd = Math.abs(a - b); if (dd <= 25) within++; if (dd > max) max = dd; }
    out({ drift: what, corpus: corpus.length, nonMate: n, within25: within, share: within / n, max, mateSignFlips: signFlips, mateNoMate: mateChanges });
  }
}
if (parts.has("ratio")) {
  for (const [name, fen] of [["kiwipete", KIWI], ["position-6", POS6]] as const) {
    const s = S.search(parseFen(fen), 8); const c = ch(E.chooseMove, fen, 8);
    out({ ratio: name, searchNodes: s.nodes, searchMove: mv(s.move), searchScore: s.score, chooseNodes: c.nodes, chooseMove: mv(c.move), chooseScore: c.score });
  }
}
