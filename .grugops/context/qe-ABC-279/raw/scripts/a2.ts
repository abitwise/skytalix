// qe-ABC-279 A2 / G4, out of tree, ONE process: base tree B (00e99db8, src 4cb84035) against head tree H (1feb7560).
// Corpus: ABC-078 A3's, rebuilt exactly as src/engine.test.ts builds it (the six endgames and every non-terminal child;
// the six roots and every child, plus position-3's every-fifth grandchild capped at 25, terminal dropped).
// (1) head searchWithoutSeePruning vs base search at d1-5; head chooseMoveWithoutSeePruning vs base chooseMove on a
//     frozen clock to d5, and on ABC-078 A3's ticking clock (1 ms a consultation) at budgets 3 and 5 on the endgame set.
// (2) every older door (names read from BOTH trees' exports) against its base self: search doors d1-3 (the two
//     WithoutPruning* doors d1-2), engine doors frozen to d3.
// (3) information: head shipped search / chooseMove against base, counted.
// Each row compares nodes|score|move. usage: node a2.ts <scratch-qe-dir>
const [Q] = process.argv.slice(2);
const H = `${Q}/head`, B = `${Q}/base`;
const hs = await import(`${H}/src/search.ts`), bs = await import(`${B}/src/search.ts`);
const he = await import(`${H}/src/engine.ts`), be = await import(`${B}/src/engine.ts`);
const { parseFen, toFen } = await import(`${H}/src/fen.ts`);
const { legalMoves } = await import(`${H}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${H}/src/apply.ts`);
const { gameStatus } = await import(`${H}/src/gameend.ts`);
const { squareName } = await import(`${H}/src/position.ts`);
const PERFT = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDG = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const lab = (m: any) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion ? `=${m.promotion}` : "") : "-");
function expandFrom(name: string, root: any, plies: number) {
  const out: { name: string; fen: string }[] = [];
  const walk = (pn: string, p: any, left: number) => {
    if (left === 0) return;
    for (const mv of legalMoves(p)) {
      const u = makeMove(p, mv);
      const cn = `${pn}/${squareName(mv.from)}${squareName(mv.to)}`;
      out.push({ name: cn, fen: toFen(p) });
      walk(cn, p, left - 1);
      unmakeMove(p, mv, u);
    }
  };
  walk(name, root, plies);
  return out;
}
const live = (fen: string) => gameStatus(parseFen(fen)).result === "in-progress";
const endgames = ENDG.flatMap(([name, fen]) => [{ name, fen }, ...expandFrom(name, parseFen(fen), 1).filter((c) => live(c.fen))]);
const roots = PERFT.flatMap(([name, fen]) => [{ name, fen }, ...expandFrom(name, parseFen(fen), 1)]);
const grand = expandFrom("position-3", parseFen(PERFT[2][1]), 2)
  .filter(({ name }) => name.includes("/", name.indexOf("/") + 1))
  .filter((_, i) => i % 5 === 0)
  .slice(0, 25);
const broad = [...roots, ...grand].filter((c) => live(c.fen));
const corpus = [...endgames, ...broad];
console.log(JSON.stringify({ endgames: endgames.length, broad: broad.length, corpus: corpus.length }));
const fd = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const ticking = (budgetMs: number) => { let t = 0; return { budgetMs, now: () => { const r = t; t += 1; return r; } }; };
const sig = (r: any) => `${r.nodes}|${r.score}|${lab(r.move)}${r.depth !== undefined ? `|d${r.depth}` : ""}`;
const t0 = Date.now();
const sNames = (m: any) => Object.keys(m).filter((k) => /^search(Without\w+)?$/.test(k) && typeof m[k] === "function").sort();
const eNames = (m: any) => Object.keys(m).filter((k) => /^chooseMove(Without\w+)?$/.test(k) && typeof m[k] === "function").sort();
const allH = { search: Object.keys(hs).sort(), engine: Object.keys(he).sort() };
const allB = { search: Object.keys(bs).sort(), engine: Object.keys(be).sort() };
const added = { search: allH.search.filter((k) => !allB.search.includes(k)), engine: allH.engine.filter((k) => !allB.engine.includes(k)) };
const removed = { search: allB.search.filter((k) => !allH.search.includes(k)), engine: allB.engine.filter((k) => !allH.engine.includes(k)) };
const see = await import(`${H}/src/see.ts`);
console.log(JSON.stringify({ exportsAdded: added, exportsRemoved: removed, seeExports: Object.keys(see).sort(), counts: { searchB: allB.search.length, searchH: allH.search.length, engineB: allB.engine.length, engineH: allH.engine.length } }));
// (1) the new door pair against the base shipped pair
let rows1 = 0, miss1 = 0; const bad1: string[] = [];
const cmp = (tag: string, x: string, y: string) => { rows1++; if (x !== y) { miss1++; if (bad1.length < 20) bad1.push(`${tag}: head ${x} / base ${y}`); } };
for (const { name, fen } of corpus) for (const d of [1, 2, 3, 4, 5]) cmp(`search d${d} ${name}`, sig(hs.searchWithoutSeePruning(parseFen(fen), d)), sig(bs.search(parseFen(fen), d)));
for (const { name, fen } of corpus) cmp(`chooseMove frozen d5 ${name}`, sig(he.chooseMoveWithoutSeePruning(parseFen(fen), fd(5))), sig(be.chooseMove(parseFen(fen), fd(5))));
for (const { name, fen } of endgames) for (const b of [3, 5]) cmp(`chooseMove ticking ${b} ${name}`, sig(he.chooseMoveWithoutSeePruning(parseFen(fen), ticking(b))), sig(be.chooseMove(parseFen(fen), ticking(b))));
console.log(JSON.stringify({ part: "new door = base shipped", rows: rows1, mismatches: miss1, bad: bad1, secs: (Date.now() - t0) / 1000 }));
// (2) every older door against its base self
const sOld = sNames(bs).filter((k) => k !== "search"), eOld = eNames(be).filter((k) => k !== "chooseMove");
let rows2 = 0, miss2 = 0; const bad2: string[] = [];
for (const k of sOld) for (const { name, fen } of corpus) for (const d of (/^searchWithoutPruning/.test(k) ? [1, 2] : [1, 2, 3])) {
  rows2++; const x = sig(hs[k](parseFen(fen), d)), y = sig(bs[k](parseFen(fen), d));
  if (x !== y) { miss2++; if (bad2.length < 20) bad2.push(`${k} d${d} ${name}: ${x} / ${y}`); }
}
for (const k of eOld) for (const { name, fen } of corpus) {
  rows2++; const x = sig(he[k](parseFen(fen), fd(3))), y = sig(be[k](parseFen(fen), fd(3)));
  if (x !== y) { miss2++; if (bad2.length < 20) bad2.push(`${k} d3 ${name}: ${x} / ${y}`); }
}
console.log(JSON.stringify({ part: "older doors = base selves", searchDoors: sOld, engineDoors: eOld, headSearchDoors: sNames(hs), headEngineDoors: eNames(he), rows: rows2, mismatches: miss2, bad: bad2, secs: (Date.now() - t0) / 1000 }));
// (3) information: shipped head vs shipped base
let rows3 = 0, diff3 = 0, nodesH = 0, nodesB = 0;
for (const { fen } of corpus) for (const d of [3, 5]) { rows3++; const x = hs.search(parseFen(fen), d), y = bs.search(parseFen(fen), d); nodesH += x.nodes; nodesB += y.nodes; if (sig(x) !== sig(y)) diff3++; }
console.log(JSON.stringify({ part: "INFO shipped head vs base search d3,d5", rows: rows3, differing: diff3, nodesHead: nodesH, nodesBase: nodesB, ratio: +(nodesH / nodesB).toFixed(4), secs: (Date.now() - t0) / 1000 }));
