const T = process.argv[2];
const { createUciSession } = await import(`${T}/src/uci-session.ts`);
const { virtualClock } = await import(`${T}/src/virtual-clock.ts`);
const { seededRandom } = await import(`${T}/src/levels.ts`);
const { createBookProbe } = await import(`${T}/src/book.ts`);
const book = () => createBookProbe({ read: () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} })), warn: () => {}, random: seededRandom(1) });
const mk = (lines: string[], step = 10) => { const out: string[] = []; const s = createUciSession({ write: (l: string) => out.push(l), now: virtualClock(step), random: seededRandom(1), book: book() }); for (const l of lines) s.handleLine(l); return { out, s }; };
const bm = (o: string[]) => o.filter((l) => l.startsWith("bestmove")).length;
for (const [name, s2] of [["R1 shape (s2: stop, ponderhit)", ["stop", "ponderhit"]], ["s2: position startpos", ["position startpos"]], ["s2: constructed, no lines", []]] as const) {
  const one = mk(["position startpos", "go infinite"], 1000); const before = bm(one.out);
  const two = mk([...s2]);
  console.log(`${name.padEnd(32)} s1 bestmoves before=${before} after=${bm(one.out)}  s2 out=${JSON.stringify(two.out)}`);
}
