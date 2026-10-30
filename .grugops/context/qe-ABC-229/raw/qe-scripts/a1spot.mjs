// qe-ABC-229 A1 door identity spot-check (QE's own, independent of the SE's a1.mjs). Cross-build, node for node:
// head searchWithoutQuietPromotions = base search() at depths 1-4, head chooseMoveWithoutQuietPromotions = base
// chooseMove on a frozen clock to depth 4, and head searchWithoutQuiescenceEvasions = base's (self) at depth 3, on the
// six standard roots plus QE's promotion-rich roots and the nine Q-SET rows. Non-vacuity: head search() must differ
// from base search() on at least one row. usage: node a1spot.mjs <baseTree> <headTree>
const [B, H] = process.argv.slice(2);
const ld = async (T) => ({ fen: await import(`${T}/src/fen.ts`), s: await import(`${T}/src/search.ts`), e: await import(`${T}/src/engine.ts`) });
const b = await ld(B), h = await ld(H);
const FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1",
  "8/PPPPPPPP/8/2k5/8/K7/pppppppp/8 w - - 0 1",
  "1n4k1/1P3pPp/7P/8/8/8/p1p3K1/1N6 w - - 0 1",
  "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1",
  "8/P6k/8/8/8/8/8/K7 w - - 0 1",
  "8/1P5k/8/8/8/8/1r6/7K w - - 0 1",
  "K6r/4P3/8/8/7k/8/8/4R3 w - - 0 1",
  "8/4P1k1/3q4/8/8/8/5PPP/3B2K1 w - - 0 1",
  "5r2/3qP2k/8/8/8/8/5PPP/3B2K1 w - - 0 1",
  "8/1KPk4/8/8/8/8/8/8 w - - 0 1",
  "k7/2P5/1K6/8/8/8/8/8 w - - 0 1",
  "1k6/r7/1P6/8/4B3/8/8/R6K w - - 0 1",
  "k7/8/8/8/8/8/p6K/8 b - - 0 1",
];
const mv = (m) => (m ? `${m.from}-${m.to}-${m.promotion}` : "null");
const row = (r) => `${r.nodes}|${r.score}|${mv(r.move)}|${r.depth ?? ""}`;
const frozen = (d) => ({ budgetMs: 1000, now: () => 0, maxDepth: d });
let rows = 0, diff = 0, differs = 0;
const cmp = (label, x, y) => { rows++; if (row(x) !== row(y)) { diff++; console.log(`DIFF ${label}: base ${row(x)} head ${row(y)}`); } };
for (const f of FENS) {
  for (const d of [1, 2, 3, 4]) {
    const bs = b.s.search(b.fen.parseFen(f), d);
    cmp(`door d${d} ${f}`, bs, h.s.searchWithoutQuietPromotions(h.fen.parseFen(f), d));
    if (row(bs) !== row(h.s.search(h.fen.parseFen(f), d))) differs++;
  }
  cmp(`engine door to 4 ${f}`, b.e.chooseMove(b.fen.parseFen(f), frozen(4)), h.e.chooseMoveWithoutQuietPromotions(h.fen.parseFen(f), frozen(4)));
  cmp(`evasions door d3 (self) ${f}`, b.s.searchWithoutQuiescenceEvasions(b.fen.parseFen(f), 3), h.s.searchWithoutQuiescenceEvasions(h.fen.parseFen(f), 3));
}
console.log(`A1 spot: ${FENS.length} positions, ${rows} rows, ${diff} differ; non-vacuity: head search() differs from base search() on ${differs} of ${FENS.length * 4} search rows`);
process.exit(diff ? 1 : 0);
