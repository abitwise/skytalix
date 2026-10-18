import { createUciSession } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/bapm167/tree/src/uci-session.ts";
import { virtualClock } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/bapm167/tree/src/virtual-clock.ts";
const run = (lines: string[], step = 1) => { const out: string[] = []; const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(step) }); const r = lines.map((l) => s.handleLine(l)); return JSON.stringify({ out, r }); };
console.log("searchmoves", run(["position startpos", "go searchmoves e2e4 d2d4 movetime 100"]));
console.log("new session", run(["go movetime 100"], 10));
console.log("A3", run(["position startpos moves e2e4 e7e5", "go movetime 100"], 10));
console.log("ponder bare", run(["position startpos", "go ponder", "ponderhit", "ponderhit"], 100));
console.log("isready held", run(["position startpos", "go infinite", "isready", "foo", "setoption name Hash value 64", "stop", "stop"], 100));
console.log("movestogo 2.5", run(["position startpos", "go wtime 1000 btime 1000 movestogo 2.5"]));
