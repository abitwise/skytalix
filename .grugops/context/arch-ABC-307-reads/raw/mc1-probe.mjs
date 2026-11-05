// mc1-probe.mjs <tree> : after the seal, a diagnosis only. Level 1's move on the first go of seed 2's session, by salt (MC1 adds the session count to the seed).
const t = process.argv[2];
const { createLevel, LEVELS, seededRandom } = await import(`${t}/src/levels.ts`);
const { parseFen } = await import(`${t}/src/fen.ts`);
const { virtualClock } = await import(`${t}/src/virtual-clock.ts`);
const { squareName } = await import(`${t}/src/position.ts`);
const seed0 = Math.floor(seededRandom(2)() * 2 ** 32);
const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const out = [];
for (let salt = 0; salt <= 60; salt++) {
  const c = createLevel({ budgetMs: 1000, blunderRate: LEVELS[1].blunderRate }, { seed: seed0 + salt, now: virtualClock(100) })(parseFen(start));
  out.push(`${salt}:${c.kind[0]}:${squareName(c.move.from)}${squareName(c.move.to)}`);
}
console.log(`rate ${LEVELS[1].blunderRate}`); console.log(out.join(" "));
