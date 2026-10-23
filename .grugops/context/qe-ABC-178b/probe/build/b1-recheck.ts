// QE qe-ABC-178b B1 shape check: replays the folded R1 (two sessions, then re-reads session 1's own array).
const T = process.argv[2];
const { createUciSession } = await import(`${T}/src/uci-session.ts`);
const { virtualClock } = await import(`${T}/src/virtual-clock.ts`);
const { seededRandom } = await import(`${T}/src/levels.ts`);
const { createBookProbe } = await import(`${T}/src/book.ts`);
const emptyBook = () => createBookProbe({ read: () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} })), warn: () => {}, random: seededRandom(1) });
function dialogue(lines: string[], stepMs = 10) {
  const out: string[] = [];
  const s = createUciSession({ write: (l: string) => out.push(l), now: virtualClock(stepMs), random: seededRandom(1), book: emptyBook() });
  const results = lines.map((l) => s.handleLine(l));
  return { out, results, s };
}
const one = dialogue(["position startpos", "go infinite"], 1000);
const firstLen = one.out.length;
console.log("session1 out (check 1):", JSON.stringify(one.out), "results:", one.results.join(","));
const two = dialogue(["stop", "ponderhit"]);
console.log("session2 out:", JSON.stringify(two.out), "same object as session1.out:", two.out === one.out);
console.log("session1 out (re-check, same array):", JSON.stringify(one.out), "length", firstLen, "->", one.out.length, "bestmove lines:", one.out.filter((l) => l.startsWith("bestmove")).length);
one.s.handleLine("stop");
console.log("session1 after its own stop:", JSON.stringify(one.out));
