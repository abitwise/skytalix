// se-ABC-289: the five default-lane W1 reds on shipped and on the door. Diagnosis only: no row hands a door softMs. node w1.ts <root>
const root = process.argv[2];
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const mv = (m: any) => squareName(m.from) + squareName(m.to);
const read = (f: any, fen: string, budgetMs: number, softMs?: number) => { const c = f(parseFen(fen), { budgetMs, now: virtualClock(1), ...(softMs === undefined ? {} : { softMs }) }); return { depth: c.depth, move: mv(c.move), score: c.score, nodes: c.nodes, partial: c.partial }; };
const P6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const B9 = "r1b1k3/pppp2pp/8/8/1PB5/5r2/P2QNb1P/q1BK1R2 b q - 1 13";
const A2B = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1R1K b kq - 1 1";
const D12 = "6R1/2Rb1k1p/1pN1p3/1PbN4/8/8/P1P2rPP/6K1 b - - 3 40";
const b = 2.3;
for (const [arm, f] of [["shipped", E.chooseMove], ["door", E.chooseMoveWithoutDeltaPruning]] as const) {
  for (const H of [3, 4, 5, 6]) console.log(JSON.stringify({ arm, row: "A1(a)", H, head: read(f, P6, H, H / b), base: read(f, P6, H) }));
  console.log(JSON.stringify({ arm, row: "A2(a)", head: read(f, B9, 5, 5 / b), base: read(f, B9, 5) }));
  console.log(JSON.stringify({ arm, row: "A2(b)", head: read(f, A2B, 5, 5 / b), base: read(f, A2B, 5) }));
  console.log(JSON.stringify({ arm, row: "D12", head: read(f, D12, 6, 6), base: read(f, D12, 6) }));
}
