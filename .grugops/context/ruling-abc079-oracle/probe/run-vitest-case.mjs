// Run ONE named case of the real src/search.test.ts under vitest, SEARCH_DEEP=1, and time it.
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { loadavg } from "node:os";

const WT = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1";
const HERE = new URL(".", import.meta.url).pathname;
const [file, killMs, ...names] = process.argv.slice(2);
for (const name of names) {
  const l0 = loadavg()[0].toFixed(2);
  const t = Date.now();
  const r = spawnSync("npx", ["vitest", "run", file, "-t", name], {
    cwd: WT, env: { ...process.env, SEARCH_DEEP: "1" }, encoding: "utf8", timeout: Number(killMs),
  });
  const wall = Date.now() - t;
  const lines = `${r.stdout}\n${r.stderr}`.split("\n").filter((x) => /✓|×|Tests |Duration|timed out|FAIL|skipped/.test(x));
  const rec = { file, name, status: r.status, signal: r.signal, wallMs: wall, load0: l0, load1: loadavg()[0].toFixed(2), lines: lines.map((x) => x.trim()).slice(0, 12) };
  appendFileSync(`${HERE}vitest-cases.jsonl`, `${JSON.stringify(rec)}\n`);
  console.log(JSON.stringify(rec));
}
