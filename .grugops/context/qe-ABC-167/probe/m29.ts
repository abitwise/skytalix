import { createUciSession } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe167-mut/src/uci-session.ts";
import { virtualClock } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe167-mut/src/virtual-clock.ts";
for (const lines of [["position fen 8/8/8\x1b[31m w - - 0 1"], ["position startpos moves e2e4\x1b[31m"], ["position startpos", "go depth \x1b[31m"]]) {
  const out: string[] = []; const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(100) });
  for (const l of lines) s.handleLine(l);
  console.log(JSON.stringify(lines), "->", JSON.stringify(out.filter((l) => l.startsWith("info string"))), "ESC present:", out.some((l) => l.includes("\x1b")));
}
