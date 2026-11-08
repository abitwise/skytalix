// qe-ABC-298-freeze, SG1 (a) (ADR-0077 d6): the shipped path, frozen. Plain node, out of tree, one tree per run.
//   node sg1a.mjs <treeDir>   > sg1a.jsonl
// Rows, in this order, each from a fresh parseFen:
//   search() at depth 8 on kiwipete and position-6;
//   chooseMove with maxDepth and now: () => 0 at kiwipete depths 8 and 9, and position-6 depths 8, 9 and 10.
// The chooseMove form is src/search.bundle.test.ts's `deepenTo` (budgetMs 1e9, now () => 0, maxDepth).
// Both entries clear the table and the history per call, so the rows do not depend on their order.
// Prints nodes, root move (from-to-promotion-flags and its square names), score, depth, the number of
// clock reads, and whether the position came back byte-identical (FEN and Zobrist key). No timing figure.
const [tree] = process.argv.slice(2);
if (tree === undefined) throw new Error("usage: node sg1a.mjs <treeDir>");
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { zobristKey } = await import(`${tree}/src/zobrist.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const engine = await import(`${tree}/src/engine.ts`);
const search = await import(`${tree}/src/search.ts`);

const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POSITION_6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";

const lbl = (m) => (m ? `${m.from}-${m.to}-${m.promotion}-${m.flags}` : "null");
const uci = (m) => (m ? `${squareName(m.from)}${squareName(m.to)}${m.promotion ? `:${m.promotion}` : ""}` : "null");
const out = (o) => process.stdout.write(`${JSON.stringify(o)}\n`);

for (const [board, fen] of [
  ["kiwipete", KIWIPETE],
  ["position-6", POSITION_6],
]) {
  const p = parseFen(fen);
  const key = zobristKey(p);
  const r = search.search(p, 8);
  out({ row: "search", board, depth: 8, nodes: r.nodes, move: lbl(r.move), uci: uci(r.move), score: r.score, pure: toFen(p) === fen && zobristKey(p) === key });
}
for (const [board, fen, depths] of [
  ["kiwipete", KIWIPETE, [8, 9]],
  ["position-6", POSITION_6, [8, 9, 10]],
]) {
  for (const maxDepth of depths) {
    const p = parseFen(fen);
    const key = zobristKey(p);
    let reads = 0;
    const c = engine.chooseMove(p, {
      budgetMs: 1e9,
      now: () => {
        reads++;
        return 0;
      },
      maxDepth,
    });
    out({ row: "chooseMove", board, maxDepth, depth: c?.depth, nodes: c?.nodes, move: lbl(c?.move), uci: uci(c?.move), score: c?.score, reads, pure: toFen(p) === fen && zobristKey(p) === key });
  }
}
