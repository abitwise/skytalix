// QE qe-ABC-178 B1 shape check: replays R1's two sessions with the same options `dialogue` builds.
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
console.log("session1 out:", JSON.stringify(one.out), "results:", one.results.join(","));
const two = dialogue(["stop", "ponderhit"]);
console.log("session2 out:", JSON.stringify(two.out));
one.s.handleLine("stop");
console.log("session1 after its own stop:", JSON.stringify(one.out));
