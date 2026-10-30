// A8 identity out of tree: the same scripted sessions on base and head; output lines hashed.
import { createHash } from "node:crypto";
const [root, prefix] = [process.argv[2], process.argv[3] ?? ""];
const { createUciSession } = await import(`${root}/src/uci-session.ts`);
const { createBookProbe } = await import(`${root}/src/book.ts`);
const { seededRandom } = await import(`${root}/src/levels.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const empty = new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} }));
const all = [];
const goes = (t, p) => [`go wtime ${t} btime ${t} movestogo ${41 - p}`, `go wtime ${t} btime ${t} winc 1000 binc 1000`, `go movetime ${Math.round(t / 300)}`];
for (const level of (process.env.LEVELS ?? "1,2,3,4,5,6,7").split(",").map(Number)) {
  for (const shape of [0, 1, 2]) {
    const out = [];
    const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(level <= 4 ? 7 : 97), random: seededRandom(level), book: createBookProbe({ read: () => empty, warn: () => {}, random: seededRandom(7) }) });
    if (prefix) s.handleLine(prefix);
    s.handleLine(`setoption name Skill Level value ${level}`);
    let t = 900_000;
    const moves = [];
    for (let p = 1; p <= Number(process.env.PLIES ?? 40); p++) {
      s.handleLine(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`);
      const before = out.length;
      s.handleLine(goes(t, p)[shape]);
      const best = out.at(-1).split(" ")[1];
      const tm = out.slice(before).map((l) => / time (\d+)/.exec(l)).find(Boolean);
      t -= (tm ? Number(tm[1]) : 0) + 31;
      if (best === "0000") break;
      moves.push(best);
    }
    s.handleLine("go depth 3"); s.handleLine("go"); s.handleLine("go infinite"); s.handleLine("stop");
    all.push(`L${level} S${shape} ${out.length}`, ...out);
  }
}
console.log(all.length, createHash("sha256").update(all.join("\n")).digest("hex").slice(0, 16));
