// qe-ABC-264 A1 deeper spot: every door, base vs head, at depth 5 on the 12 A1 roots (SE's a1.mjs reads older search
// doors at d2-d3 only, where searchWithoutNullMove and searchWithoutReductions hash equal). usage: node a1deep.mjs <B> <H>
const [B, H] = process.argv.slice(2);
const L = async (T) => ({ fen: await import(`${T}/src/fen.ts`), s: await import(`${T}/src/search.ts`), e: await import(`${T}/src/engine.ts`) });
const b = await L(B), h = await L(H);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const row = (r) => `${r.nodes}|${r.score}|${r.move ? `${r.move.from}-${r.move.to}-${r.move.promotion}` : "null"}|${r.depth ?? ""}`;
const fz = { budgetMs: 1000, now: () => 0, maxDepth: 5 };
const pairs = [["search(B) vs searchWithoutReverseFutility(H)", (f) => b.s.search(b.fen.parseFen(f), 5), (f) => h.s.searchWithoutReverseFutility(h.fen.parseFen(f), 5)],
  ["chooseMove(B) vs chooseMoveWithoutReverseFutility(H)", (f) => b.e.chooseMove(b.fen.parseFen(f), fz), (f) => h.e.chooseMoveWithoutReverseFutility(h.fen.parseFen(f), fz)]];
for (const n of Object.keys(b.s).filter((k) => k.startsWith("searchWithout") && !["searchWithoutPruning", "searchWithoutPruningOrQuiescence", "searchWithoutOrdering"].includes(k)).sort()) pairs.push([`${n} self`, (f) => b.s[n](b.fen.parseFen(f), 5), (f) => h.s[n](h.fen.parseFen(f), 5)]);
for (const n of Object.keys(b.e).filter((k) => k.startsWith("chooseMoveWithout")).sort()) pairs.push([`${n} self`, (f) => b.e[n](b.fen.parseFen(f), fz), (f) => h.e[n](h.fen.parseFen(f), fz)]);
let bad = 0;
for (const [label, fb, fh] of pairs) { let d = 0; let nodes = 0; for (const f of ROOTS) { const x = fb(f), y = fh(f); nodes += x.nodes; if (row(x) !== row(y)) d++; } bad += d; console.log(`${label} d5: 12 roots, ${d} differ, base nodes ${nodes}`); }
let mv = 0; for (const f of ROOTS) if (row(b.s.search(b.fen.parseFen(f), 5)) !== row(h.s.search(h.fen.parseFen(f), 5))) mv++;
console.log(`non-vacuity: head search() d5 differs from base on ${mv}/12 roots`); console.log(bad ? "DIFFERENCES" : "ALL EQUAL");
