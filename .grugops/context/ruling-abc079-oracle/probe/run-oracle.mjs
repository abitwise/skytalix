// Sequential runner: one fresh node process per case, hard-killed at KILL_MS. Appends JSON lines.
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";

const SRC = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/";
const HERE = new URL(".", import.meta.url).pathname;
const [out, killMs, ...jobs] = process.argv.slice(2);

for (const job of jobs) {
  const args = job.split(":");
  const t = Date.now();
  const r = spawnSync("node", [`${HERE}probe-oracle.ts`, ...args], {
    env: { ...process.env, SRC },
    encoding: "utf8",
    timeout: Number(killMs),
  });
  const wall = Date.now() - t;
  const line = (r.stdout || "").trim().split("\n").pop();
  const rec = r.status === 0 && line ? line : JSON.stringify({ job, killed: r.signal, status: r.status, wallMs: wall, err: (r.stderr || "").slice(0, 300) });
  appendFileSync(`${HERE}${out}`, `${rec}\n`);
  console.log(`${job}  ${wall} ms  ${rec.slice(0, 220)}`);
}
