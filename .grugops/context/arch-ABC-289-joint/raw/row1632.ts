// arch-ABC-289-joint DIAGNOSTIC: the one G1 row on ADR-0034's ladder. node row1632.ts <root>
const [root] = process.argv.slice(2);
const E = await import(`${root}/src/engine.ts`); const { parseFen } = await import(`${root}/src/fen.ts`); const { squareName } = await import(`${root}/src/position.ts`); const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const fen = "8/2R1QpK1/5p2/8/8/8/7n/1N4k1 w - - 0 1"; const mv = (m) => squareName(m.from) + squareName(m.to);
for (const [label, step] of [["0.8x", 1.25], ["1x", 1], ["+5%", 1 / 1.05], ["+10%", 1 / 1.1], ["+25%", 1 / 1.25], ["2x", 0.5], ["2.5x", 0.4], ["3.33x", 0.3]]) for (const [n, f] of [["head", E.chooseMove], ["door", E.chooseMoveWithoutDeltaPruning]]) { const c = f(parseFen(fen), { budgetMs: 25, now: virtualClock(step) }); console.log(JSON.stringify({ rung: label, step: +step.toFixed(4), n, depth: c.depth, move: mv(c.move), score: c.score, nodes: c.nodes })); }
