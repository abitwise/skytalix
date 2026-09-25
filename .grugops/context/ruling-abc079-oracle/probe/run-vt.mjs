// Run the out-of-tree harness under vitest; one vitest process per batch, cases sequential inside.
import { spawnSync } from "node:child_process";

const VT = new URL("./vt/", import.meta.url).pathname;
const [killMs, cases] = process.argv.slice(2);
const t = Date.now();
const r = spawnSync("npx", ["vitest", "run", "--root", VT], {
  cwd: VT, env: { ...process.env, ORACLE_CASES: cases }, encoding: "utf8", timeout: Number(killMs),
});
const lines = `${r.stdout}\n${r.stderr}`.split("\n").filter((x) => /✓|×|Tests |Duration|Error/.test(x));
console.log(JSON.stringify({ status: r.status, signal: r.signal, wallMs: Date.now() - t }));
console.log(lines.map((x) => x.trim()).join("\n"));
