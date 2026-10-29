// Usage: node probe.mjs <worktree> <label> <line>... ; sends UCI lines, waits for each bestmove, reports wall ms per go.
import { spawn } from "node:child_process";
const [wt, label, ...lines] = process.argv.slice(2);
const child = spawn(process.execPath, ["src/uci.ts"], { cwd: wt, stdio: ["pipe", "pipe", "inherit"] });
let buf = ""; let waiter = null;
child.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const l = buf.slice(0, i); buf = buf.slice(i + 1); console.log(`  < ${l}`); if (waiter && waiter.test(l)) { const w = waiter; waiter = null; w.done(l); } } });
const send = (l) => { console.log(`  > ${l}`); child.stdin.write(l + "\n"); };
const until = (re) => new Promise((done) => { waiter = { test: (l) => re.test(l), done }; });
console.log(`# ${label}`);
send("uci"); await until(/^uciok/);
send("setoption name OwnBook value false");
for (const l of lines) {
  if (l.startsWith("go")) { const t0 = performance.now(); send(l); await until(/^bestmove/); console.log(`  # wall ${Math.round(performance.now() - t0)} ms`); }
  else send(l);
}
send("isready"); await until(/^readyok/); send("quit");
