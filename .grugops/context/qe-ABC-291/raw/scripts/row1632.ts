// se-ABC-291 K3 watch: G1's "mate in 3, seed 1632" on one tree. node row1632.ts <root> [<door export>]. Budget = nodes the 25 ms
// run spends at 1x; used = nodes at the end of the iteration that first plays an accepted move, read with maxDepth and no clock.
const [root, door] = process.argv.slice(2);
const E = await import(`${root}/src/engine.ts`); const { parseFen } = await import(`${root}/src/fen.ts`); const { squareName } = await import(`${root}/src/position.ts`); const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const fen = "8/2R1QpK1/5p2/8/8/8/7n/1N4k1 w - - 0 1"; const accept = "e7e2";
const mv = (m: any) => squareName(m.from) + squareName(m.to);
const f = door ? E[door] : E.chooseMove;
for (const [label, step] of [["0.8x", 1.25], ["1x", 1], ["+5%", 1 / 1.05], ["+10%", 1 / 1.1], ["+25%", 1 / 1.25], ["2x", 0.5]] as const) { const c = f(parseFen(fen), { budgetMs: 25, now: virtualClock(step) }); console.log(JSON.stringify({ form: door ?? "chooseMove", rung: label, depth: c.depth, move: mv(c.move), score: c.score, nodes: c.nodes, solved: mv(c.move) === accept })); }
for (let d = 1; d <= 8; d++) { const c = f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }); console.log(JSON.stringify({ form: door ?? "chooseMove", d, move: mv(c.move), score: c.score, nodes: c.nodes })); }
