// qe-ABC-230 INFO probe: the blunder path (createLevel at level 1's rate) on QE's A1 fixture, with and without the
// trimmed prior keys. Prints each child's score for the repetition move. usage: node blunder-probe.mjs <headTree>
const [tree] = process.argv.slice(2);
const { newGame, playMove, keyHistory } = await import(`${tree}/src/history.ts`);
const { parseCoordinateMove } = await import(`${tree}/src/coordinate-move.ts`);
const { trimPriorKeys } = await import(`${tree}/src/engine.ts`);
const { createLevel, LEVELS } = await import(`${tree}/src/levels.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const uci = (m) => squareName(m.from) + squareName(m.to);
const h = newGame("4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1");
for (const t of "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1".split(" ")) playMove(h, parseCoordinateMove(h.position, t).move);
const prior = trimPriorKeys(keyHistory(h), h.position.halfmoveClock);
for (let seed = 1; seed <= 40; seed++) {
  const level = { budgetMs: 2000, blunderRate: 1 }; // force the blunder path; children get budget slices
  const without = createLevel(level, { seed, now: virtualClock(1) })(h.position);
  const withKeys = createLevel(level, { seed, now: virtualClock(1) })(h.position, prior);
  if (without.kind !== "blunder") continue;
  const s = (c) => c.scored.map((x) => `${uci(x.move)}:${x.score}`).join(" ");
  console.log(`seed ${seed} | without: ${uci(without.move)} [${s(without)}]\n        | with:    ${uci(withKeys.move)} [${s(withKeys)}]`);
  break;
}
console.log(`level 1 rate ${LEVELS[1].blunderRate}`);
