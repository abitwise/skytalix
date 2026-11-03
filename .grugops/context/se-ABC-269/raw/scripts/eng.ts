const W = process.argv[2];
const { chooseMove, chooseMoveWithoutTaper } = await import(`${W}/src/engine.ts`);
const { search, searchWithoutTaper } = await import(`${W}/src/search.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const lab = (m: any) => m ? squareName(m.from) + squareName(m.to) : "-";
const fd = (d: number) => { let t = 0; return { budgetMs: 60000, now: () => (t += 1) - 1, maxDepth: d }; };
// ABC-249 base (no keys) after the line
const { makeMove } = await import(`${W}/src/apply.ts`);
const { legalMoves } = await import(`${W}/src/legal.ts`);
const play = (fen: string, moves: string) => { const p = parseFen(fen); for (const t of moves.split(" ")) { const m = legalMoves(p).find((x: any) => lab(x) === t && !x.promotion); makeMove(p, m); } return p; };
const p249 = play("6k1/RR3ppp/8/4q3/8/7P/PP4PK/1N6 w - - 0 1", "h2h1 e5e1 h1h2 e1e5 h2g1 e5d4 g1f1 d4f6");
const { toFen } = await import(`${W}/src/fen.ts`);
const r = toFen(p249);
for (const [n, f] of [["chooseMove", chooseMove], ["door", chooseMoveWithoutTaper]] as const) {
  const b = f(parseFen(r), fd(4)); console.log("249 base", n, lab(b.move), b.score);
}
const kp = "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1";
let t = 0; const c = chooseMove(parseFen(kp), { budgetMs: 10, now: () => (t += 1) - 1, maxDepth: 3 });
const s = search(parseFen(kp), 3);
console.log("170 shipped", lab(c.move), c.score, c.depth, "search", lab(s.move), s.score);
t = 0; const c2 = chooseMoveWithoutTaper(parseFen(kp), { budgetMs: 10, now: () => (t += 1) - 1, maxDepth: 3 });
const s2 = searchWithoutTaper(parseFen(kp), 3);
console.log("170 door", lab(c2.move), c2.score, c2.depth, "search", lab(s2.move), s2.score);
