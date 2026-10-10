// QE probe: why A6's identity row (seed 7, step budget/3) does not see M3a's seed-perturbed budget.
const root = process.argv[2];
const { seededRandom } = await import(`${root}/src/levels.ts`);
const { chooseMove } = await import(`${root}/src/engine.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const g = seededRandom(7); g(); const mult = 0.9 + 0.2 * g();
console.log(`seed 7: M3a budget = 3000 x ${mult.toFixed(4)} = ${(3000 * mult).toFixed(1)} ms`);
const fens = ["8/8/4k3/8/8/4K3/4P3/8 w - - 0 1", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"];
for (const step of [1000, 120, 60]) for (const fen of fens) for (const b of [2700, 3000, 3300]) {
  const c = chooseMove(parseFen(fen), { budgetMs: b, now: virtualClock(step) });
  console.log(`step ${step} budget ${b} ${fen.slice(0, 12)}: depth ${c.depth} nodes ${c.nodes} elapsed ${c.elapsedMs}`);
}
