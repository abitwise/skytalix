// se-ABC-282 A0-3 (ADR-0071 D8): the session's lines on position-6, virtualClock(1), OwnBook false. One fresh session a row.
// Usage: node a0-3.mjs <tree-root> <named.json>   (prints JSON lines: mode, go, the info depth line less `time`/`nps` kept whole, bestmove)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [root, namedPath] = process.argv.slice(2);
const imp = (f) => import(pathToFileURL(join(root, "src", f)).href);
const { createUciSession } = await imp("uci-session.ts");
const { virtualClock } = await imp("virtual-clock.ts");
const fen = JSON.parse(readFileSync(namedPath, "utf8")).find((p) => p.name === "position-6").fen;
const book = { bookMove: () => undefined, warm: () => {} };
const rows = [
  ["level", "go movetime 200"],
  ["level", "go wtime 4000 btime 4000"],
  ["simple-tournament", "go movetime 200"],
  ["simple-tournament", "go wtime 8000 btime 8000 movestogo 40"],
  ["uci-clock-mode", "go movetime 200"],
  ["uci-clock-mode", "go depth 6"],
  ["uci-clock-mode", "go wtime 8000 btime 8000 movestogo 40"],
];
for (const [mode, go] of rows) {
  const out = [];
  const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(1), random: () => 0.5, book });
  s.handleLine("setoption name OwnBook value false");
  s.handleLine(`setoption name TimeMode value ${mode}`);
  s.handleLine(`position fen ${fen}`);
  s.handleLine(go);
  console.log(JSON.stringify({ mode, go, lines: out }));
}
