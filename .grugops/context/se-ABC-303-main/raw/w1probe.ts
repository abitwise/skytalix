// se-ABC-303-main: the three default-lane reds read on the shipped path and on the all-off door. Diagnosis only;
// the doors take no softMs in any row (ADR-0072 d11), so this is no re-point. Usage: node w1probe.ts <root>
const root = process.argv[2];
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const mv = (m: any) => squareName(m.from) + squareName(m.to);
const read = (f: any, fen: string, budgetMs: number, softMs?: number) => { const c = f(parseFen(fen), { budgetMs, now: virtualClock(1), ...(softMs === undefined ? {} : { softMs }) }); return { move: mv(c.move), score: c.score, depth: c.depth, nodes: c.nodes, partial: c.partial }; };
const P6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const B9 = "r1b1k3/pppp2pp/8/8/1PB5/5r2/P2QNb1P/q1BK1R2 b q - 1 13";
for (const [arm, f] of [["shipped", E.chooseMove], ["allOff", E.chooseMoveWithoutQuietBundle]] as const) {
  console.log(JSON.stringify({ arm, row: "A1(a) head", ...read(f, P6, 6, 6 / 2.3) }));
  console.log(JSON.stringify({ arm, row: "A1(a) base", ...read(f, P6, 6) }));
  console.log(JSON.stringify({ arm, row: "A2(a) head", ...read(f, B9, 5, 5 / 2.3) }));
  console.log(JSON.stringify({ arm, row: "A2(a) soft5", ...read(f, B9, 5, 5) }));
  console.log(JSON.stringify({ arm, row: "A2(a) base", ...read(f, B9, 5) }));
}
