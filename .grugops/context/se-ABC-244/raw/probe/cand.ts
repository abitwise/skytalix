// se-ABC-244 census probe: nodes of two census candidates at their step and at 1 000. Reads base src only.
const B = process.argv[2];
const { createUciSession } = await import(`${B}/src/uci-session.ts`);
const { createBookProbe } = await import(`${B}/src/book.ts`);
const { seededRandom } = await import(`${B}/src/levels.ts`);
const { virtualClock } = await import(`${B}/src/virtual-clock.ts`);
function run(step: number, lines: string[]) {
  const out: string[] = [];
  const s = createUciSession({
    write: (l: string) => out.push(l),
    now: virtualClock(step),
    random: seededRandom(1),
    book: createBookProbe({ read: () => { throw new Error("no book"); }, warn: () => {}, random: seededRandom(7) }),
  });
  for (const l of lines) s.handleLine(l);
  return out.filter((l) => l.startsWith("info") || l.startsWith("bestmove")).join(" | ");
}
const ST = "setoption name TimeMode value simple-tournament";
for (const step of [10, 1000]) console.log(":1804 step", step, run(step, [ST, "position startpos moves e2e4", "go wtime 800 btime 800"]));
for (const step of [100, 1000]) console.log(":1910 step", step, run(step, [ST, "setoption name Skill Level value 1", "position startpos moves e2e4", "go depth 3"]));
