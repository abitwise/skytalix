// QE: would A1 (the ABC-078 A3 corpus at the sweep's depths, plus the six roots d1-4) see a door
// wired null-move ON? Base's door vs a planted tree's door. Usage: node a1door.mts <base> <planted> <door>
const [baseRoot, plantRoot, door] = process.argv.slice(2);
const load = async (r: string) => ({ s: await import(`${r}/src/search.ts`), e: await import(`${r}/src/engine.ts`), fen: await import(`${r}/src/fen.ts`),
  legal: await import(`${r}/src/legal.ts`), apply: await import(`${r}/src/apply.ts`), ge: await import(`${r}/src/gameend.ts`), pos: await import(`${r}/src/position.ts`) });
const B = await load(baseRoot as string), P = await load(plantRoot as string);
const PERFT = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const ENDG = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1","k7/8/1K6/8/8/8/8/1R6 w - - 0 1","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1","8/8/8/8/8/k7/8/KR6 w - - 0 1","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const lab = (m: any) => `${B.pos.squareName(m.from)}${B.pos.squareName(m.to)}`;
const expand = (fen: string, plies: number, name: string) => { const out: {name: string; fen: string}[] = []; const walk = (pn: string, p: any, left: number) => { if (!left) return; for (const mv of B.legal.legalMoves(p)) { const u = B.apply.makeMove(p, mv); const cn = `${pn}/${lab(mv)}`; out.push({ name: cn, fen: B.fen.toFen(p) }); walk(cn, p, left - 1); B.apply.unmakeMove(p, mv, u); } }; walk(name, B.fen.parseFen(fen), plies); return out; };
const live = (f: string) => B.ge.gameStatus(B.fen.parseFen(f)).result === "in-progress";
const E = ENDG.flatMap((f, i) => [{ name: `e${i}`, fen: f }, ...expand(f, 1, `e${i}`).filter((c) => live(c.fen))]);
const gc = expand(PERFT[2], 2, "p3").filter(({ name }) => name.includes("/", name.indexOf("/") + 1)).filter((_, i) => i % 5 === 0).slice(0, 25);
const BC = [...PERFT.flatMap((f, i) => [{ name: `r${i}`, fen: f }, ...expand(f, 1, `r${i}`)]), ...gc].filter((c) => live(c.fen));
const tick = () => { let t = 0; return () => { const r = t; t += 1; return r; }; };
const isEngine = door.startsWith("chooseMove");
let cells = 0, diff = 0;
const runs: [any[], number[]][] = [[E, [3, 5]], [BC, [5]]];
for (const [corpus, budgets] of runs) for (const { fen } of corpus) for (const budgetMs of budgets) {
  if (isEngine) { cells++; const b = B.e[door](B.fen.parseFen(fen), { budgetMs, now: tick() }), p = P.e[door](P.fen.parseFen(fen), { budgetMs, now: tick() }); if (b.nodes !== p.nodes) diff++; continue; }
  const d1 = B.e.chooseMoveWithoutReductions(B.fen.parseFen(fen), { budgetMs, now: tick() }).depth, d2 = B.e.chooseMove(B.fen.parseFen(fen), { budgetMs, now: tick() }).depth;
  for (const d of new Set([d1, d2])) { cells++; if (B.s[door](B.fen.parseFen(fen), d).nodes !== P.s[door](P.fen.parseFen(fen), d).nodes) diff++; }
}
let rc = 0, rd = 0;
for (const fen of PERFT) {
  if (isEngine) for (const md of [3, 5, 6]) { rc++; const o = () => ({ budgetMs: 1_000, now: () => 0, maxDepth: md }); if (B.e[door](B.fen.parseFen(fen), o()).nodes !== P.e[door](P.fen.parseFen(fen), o()).nodes) rd++; }
  else for (const d of [1, 2, 3, 4]) { rc++; if (B.s[door](B.fen.parseFen(fen), d).nodes !== P.s[door](P.fen.parseFen(fen), d).nodes) rd++; }
}
console.log(`${door} wired on: A3-corpus sweep ${diff}/${cells} cells node-different from base; six roots ${rd}/${rc}`);
