// secnfr-ABC-167 NFR-004 edge probe: virtual clock only (step 100), no wall-clock reading.
// Imports from the scratch worktree ../wt-secnfr-ABC-167 at 660a0d50, removed after the hop; to rerun, point both paths at any 660a0d50 checkout.
import { createUciSession } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-secnfr-ABC-167/src/uci-session.ts";
import { virtualClock } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-secnfr-ABC-167/src/virtual-clock.ts";
const big = "9".repeat(400);
const lines = [
  "go movetime " + big,
  "go wtime " + big + " btime " + big,
  "go wtime " + big + " btime 1 winc -" + big + " binc 0",
  "go movetime -5",
  "go wtime 999999999 btime 999999999 winc 999999999 binc 999999999 movestogo 1",
  "go infinite",
  "go ponder wtime " + big,
];
for (const go of lines) {
  const out: string[] = [];
  const s = createUciSession({ write: (l) => out.push(l), now: virtualClock(100) });
  s.handleLine("position startpos");
  s.handleLine(go);
  s.handleLine("stop");
  const info = out.find((l) => l.startsWith("info depth"));
  console.log(go.replace(big, "9x400").replace(big, "9x400").replace(big, "9x400"), "=>", info?.replace(/ nps.*/, ""));
}
