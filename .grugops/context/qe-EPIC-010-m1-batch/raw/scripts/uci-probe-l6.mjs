// usage: node uci-probe.mjs <dist/uci.js>  -> id name, uciok, bestmove time for go movetime 4000 from startpos
import { spawn } from "node:child_process";
const c = spawn(process.execPath, [process.argv[2]], { stdio: ["pipe", "pipe", "inherit"] });
let buf = ""; let t0 = 0; const out = [];
c.stdout.on("data", (d) => {
  buf += d; let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const l = buf.slice(0, i); buf = buf.slice(i + 1);
    if (l.startsWith("id name")) out.push(l);
    if (l === "uciok") { out.push("uciok"); c.stdin.write("isready\n"); }
    if (l === "readyok" && t0 === 0) { c.stdin.write("setoption name Skill Level value 6\nucinewgame\nposition fen r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1\n"); t0 = performance.now(); c.stdin.write("go movetime 4000\n"); }
    if (l.startsWith("bestmove")) { out.push(`${l} after ${(performance.now() - t0).toFixed(0)} ms`); c.stdin.write("quit\n"); }
  }
});
c.on("exit", (code) => { console.log(out.join("\n") + `\nexit ${code}`); });
c.stdin.write("uci\n");
