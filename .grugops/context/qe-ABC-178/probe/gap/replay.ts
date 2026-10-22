const T = process.argv[2];
const { createUciSession } = await import(`${T}/src/uci-session.ts`);
const { virtualClock } = await import(`${T}/src/virtual-clock.ts`);
const { seededRandom } = await import(`${T}/src/levels.ts`);
const { createBookProbe } = await import(`${T}/src/book.ts`);
const book = () => createBookProbe({ read: () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} })), warn: () => {}, random: seededRandom(1) });
const mk = (step = 10) => { const out: string[] = []; const s = createUciSession({ write: (l: string) => out.push(l), now: virtualClock(step), random: seededRandom(1), book: book() }); return { out, s }; };
const bm = (o: string[]) => o.filter((l) => l.startsWith("bestmove")).length;
// R1 shape: one hold, then a fresh session's stop + ponderhit.
{ const a = mk(1000); for (const l of ["position startpos", "go infinite"]) a.s.handleLine(l); const s1 = bm(a.out);
  const b = mk(); for (const l of ["stop", "ponderhit"]) b.s.handleLine(l);
  console.log(`R1 shape:        s1 bestmoves before=${s1} after=${bm(a.out)}  s2 out=${JSON.stringify(b.out)}`); }
// Two holds in session 1 (go infinite, go infinite), left holding; fresh session stop + ponderhit.
{ const a = mk(1000); for (const l of ["position startpos", "go infinite", "go infinite"]) a.s.handleLine(l); const s1 = bm(a.out);
  const b = mk(); for (const l of ["stop", "ponderhit"]) b.s.handleLine(l);
  console.log(`two-hold shape:  s1 bestmoves before=${s1} after=${bm(a.out)}  s2 out=${JSON.stringify(b.out)}`); }
