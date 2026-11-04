// usage: node bars.ts <root> <mode: mate|zug|g1> ; reads the shipped path against the all-off and single-part doors.
const [root, mode] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const mv = (m: any) => (m ? squareName(m.from) + squareName(m.to) : "-");
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const ch = (f: any, fen: string, d: number) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
if (mode === "mate") {
  const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
  const pairs: [string, (f: string) => number, (f: string) => number][] = [
    ["search d5 vs searchWithoutBundle d5", (f) => S.search(parseFen(f), 5).score, (f) => S.searchWithoutBundle(parseFen(f), 5).score],
    ["searchWithoutHistory d5 vs searchWithoutBundle d5", (f) => S.searchWithoutHistory(parseFen(f), 5).score, (f) => S.searchWithoutBundle(parseFen(f), 5).score],
    ["searchWithoutSeeOrdering d5 vs searchWithoutBundle d5", (f) => S.searchWithoutSeeOrdering(parseFen(f), 5).score, (f) => S.searchWithoutBundle(parseFen(f), 5).score],
    ["search d5 vs searchWithoutBundle d4 (d4->d5)", (f) => S.search(parseFen(f), 5).score, (f) => S.searchWithoutBundle(parseFen(f), 4).score],
    ["chooseMove d5 vs chooseMoveWithoutBundle d5", (f) => ch(E.chooseMove, f, 5).score, (f) => ch(E.chooseMoveWithoutBundle, f, 5).score],
    ["chooseMove d6 vs chooseMoveWithoutBundle d6", (f) => ch(E.chooseMove, f, 6).score, (f) => ch(E.chooseMoveWithoutBundle, f, 6).score],
  ];
  for (const [what, head, door] of pairs) {
    let mates = 0; const viol: string[] = [];
    for (const fen of MATE_CORPUS) { const r = door(fen); if (!isMate(r)) continue; mates++; const g = head(fen); if (!isMate(g) || Math.sign(g) !== Math.sign(r)) viol.push(`${fen}: ${r} -> ${g}`); }
    console.log(JSON.stringify({ what, corpus: MATE_CORPUS.length, mates, violations: viol.length, viol }));
  }
} else if (mode === "zug") {
  const rows = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
  ] as const;
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    const c = ch(E.chooseMove, fen, d); const door = ch(E.chooseMoveWithoutBundle, fen, d);
    if (mv(c.move) === want && c.depth === d) ok++;
    console.log(JSON.stringify({ name, d, played: mv(c.move), want, ok: mv(c.move) === want, nodes: c.nodes, doorNodes: door.nodes, doorPlayed: mv(door.move) }));
  }
  console.log(JSON.stringify({ zugzwang: ok, of: rows.length }));
} else if (mode === "g1") {
  const { PUZZLES } = await import(`${root}/src/puzzle-corpus.ts`);
  const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
  const base = JSON.parse((await import("node:fs")).readFileSync(`${root}/src/puzzle-suite.baseline.json`, "utf8"));
  for (const [label, f] of [["chooseMove", E.chooseMove], ["chooseMoveWithoutBundle", E.chooseMoveWithoutBundle]] as const) {
    let solved = 0; const missed: string[] = [];
    for (const p of PUZZLES as any[]) {
      const c = f(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) });
      const chosen = c === null ? "null" : mv(c.move);
      const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
      if (ok) solved++; else missed.push(p.name);
    }
    console.log(JSON.stringify({ label, solved, total: (PUZZLES as any[]).length, missed, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)), newlySolved: (base.unsolved as string[]).filter((n) => !missed.includes(n)) }));
  }
}
