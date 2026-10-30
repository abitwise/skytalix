import { createInterface } from "node:readline";
const rl = createInterface({ input: process.stdin });
const out = (s) => process.stdout.write(s + "\n");
rl.on("line", (l) => {
  if (l === "uci") { out("id name stub"); out("uciok"); }
  else if (l === "isready") out("readyok");
  else if (l.startsWith("go")) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000); out("info depth 1"); out("bestmove e7e5"); }
  else if (l === "quit") process.exit(0);
});
