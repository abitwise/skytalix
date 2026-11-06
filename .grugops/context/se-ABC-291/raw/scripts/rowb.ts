const [root] = process.argv.slice(2);
const E = await import(`${root}/src/engine.ts`); const { parseFen } = await import(`${root}/src/fen.ts`); const { squareName } = await import(`${root}/src/position.ts`); const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const mv = (m: any) => squareName(m.from) + squareName(m.to);
for (const fen of ["r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1R1K b kq - 1 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/3RK2R b Kkq - 1 1"]) {
  const h = E.chooseMove(parseFen(fen), { budgetMs: 5, softMs: 5 / 2.3, now: virtualClock(1) });
  const b = E.chooseMove(parseFen(fen), { budgetMs: 5, now: virtualClock(1) });
  console.log(JSON.stringify({ fen, head: [mv(h.move), h.score, h.depth, h.nodes, h.partial], base: [mv(b.move), b.score, b.depth, b.nodes, b.partial] }));
}
