// qe-ABC-221 R1 CENSUS (plain node, never vitest): the three real-engine default-lane rows the SE lists, replayed out of
// tree on H's real modules (no shim, no spy) with a COUNTING virtual clock. Reports, per row, the clock readings taken
// inside the `go`, the `info` line's depth/time, and ceil(budget / step), the ticket's definition, against the SE's census.
// usage: node census.mjs <H tree>
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const H = resolve(process.argv[2]);
const u = (f) => pathToFileURL(join(H, "src", f)).href;
const { createUciSession } = await import(u("uci-session.ts"));
const { createBookProbe } = await import(u("book.ts"));
const { seededRandom } = await import(u("levels.ts"));
const { virtualClock } = await import(u("virtual-clock.ts"));
const MODE = "setoption name TimeMode value uci-clock-mode";
const empty = () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} }));
const INFO = /^info depth (\d+) score (?:cp -?\d+|mate -?\d+) nodes (\d+) time (\d+) nps \d+ pv (\S+)$/;
function row(name, step, budget, lines, hook) {
  const clock = virtualClock(step);
  let reads = 0, inGo = false;
  const queue = [...lines];
  const out = [];
  const s = createUciSession({
    write: (l) => out.push(l),
    now: () => { if (inGo) { reads++; hook?.(reads, queue); } return clock(); },
    random: seededRandom(1),
    book: createBookProbe({ read: empty, warn: () => {}, random: seededRandom(7) }),
  });
  let goOut = [];
  while (queue.length > 0) {
    const l = queue.shift();
    inGo = l.startsWith("go");
    const before = out.length;
    s.handleLine(l);
    if (inGo) goOut = out.slice(before);
    inGo = false;
  }
  const info = out.map((l) => INFO.exec(l)).find(Boolean);
  const r = { row: name, budget, step, ceil: Math.ceil(budget / step), readsInGo: reads, depth: Number(info?.[1]), nodes: Number(info?.[2]), time: Number(info?.[3]), out: out.filter((l) => !l.startsWith("info depth")) };
  console.log(JSON.stringify(r));
  return r;
}
row("A5 real: go wtime 800 btime 800 (step 10)", 10, 1, [MODE, "position startpos moves e2e4", "go wtime 800 btime 800"]);
row("A7 real: go movetime 90000 (step 5 000)", 5000, 59500, [MODE, "position startpos moves e2e4", "go movetime 90000"]);
row("A11: go movetime 30000, isready queued at the 3rd reading (step 5 000)", 5000, 30000, [MODE, "position startpos moves e2e4", "go movetime 30000"], (n, q) => { if (n === 3) q.push("isready"); });
