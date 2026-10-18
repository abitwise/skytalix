import { createUciSession } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/bapm167/tree/src/uci-session.ts";
import { virtualClock } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/bapm167/tree/src/virtual-clock.ts";
const run = (lines: string[], step = 1) => { const out: string[] = []; const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(step) }); const r = lines.map((l) => s.handleLine(l)); return { out, r }; };
const t = (o: string[]) => o.filter(l=>l.startsWith("info depth")).map(l => l.match(/time (\d+)/)?.[1]).join(",");
const rows: [string, string[]][] = [
 ["inc white", ["position startpos", "go wtime 2000 btime 2000 winc 1000 binc 0"]],
 ["inc black", ["position startpos moves e2e4", "go wtime 2000 btime 2000 winc 1000 binc 0"]],
 ["mtg", ["position startpos", "go wtime 1000 btime 1000 movestogo 5"]],
 ["mt beats short", ["position startpos", "go wtime 1000 btime 1000 movetime 300"]],
 ["mt beats long", ["position startpos", "go movetime 300 wtime 60000 btime 60000"]],
 ["overhead", ["position startpos", "go wtime 100 btime 100 winc 1000 binc 1000"]],
 ["short 40", ["position startpos", "go wtime 40 btime 40"]],
];
for (const [n, l] of rows) { const { out } = run(l); console.log(n, "time", t(out), JSON.stringify(out)); }
// echo paths
for (const l of [["position startpos moves e2e4\x1b[31m"], ["position startpos", "go depth \x1b[31m"]]) { const { out } = run(l, 100); console.log(JSON.stringify(out), "ESC", out.some(x=>/[\x00-\x1f\x7f]/.test(x))); }
// ponder hold
console.log("ponder", JSON.stringify(run(["position startpos", "go ponder movetime 100"], 10).out));
console.log("ponder+hit", JSON.stringify(run(["position startpos", "go ponder movetime 100", "ponderhit"], 10).out));
// held then go/position/ucinewgame/quit
console.log("held+go", JSON.stringify(run(["position startpos", "go infinite movetime 100", "go movetime 100"], 10).out));
console.log("held+position+stop", JSON.stringify(run(["position fen 7k/8/6K1/8/8/8/8/R7 b - - 1 1", "go infinite movetime 100", "position startpos", "stop"], 10).out));
console.log("held+ucinewgame+stop", JSON.stringify(run(["position fen 7k/8/6K1/8/8/8/8/R7 b - - 1 1", "go infinite movetime 100", "ucinewgame", "stop"], 10).out));
console.log("held+quit", JSON.stringify(run(["position startpos", "go infinite movetime 100", "quit"], 10)));
console.log("valueless", JSON.stringify(run(["position startpos", "go depth movetime 100"], 10).out));
console.log("valueless end", JSON.stringify(run(["position startpos", "go movetime"], 100).out));
console.log("mtg 0 / 2.5", JSON.stringify(run(["position startpos", "go wtime 1000 btime 1000 movestogo 0"], 1).out));
console.log("movetime 2.5", JSON.stringify(run(["position startpos", "go movetime 2.5"], 1).out));
console.log("movetime 1e2", JSON.stringify(run(["position startpos", "go movetime 1e2"], 10).out));
