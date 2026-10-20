// qe-ABC-174 overlap sampler: every 5 s, one `ps`, logs load1, this user's process count, and every process that is
// NOT this hop's: vitest, oeselg-labs/platform, another hop's harness/worktree/probe. "This hop's" = a descendant of
// ROOT (argv[3], the driver shell's pid) or an ancestor of it (the shell that launched the driver), so the arms' own `npm exec vitest …` lines are never counted as foreign.
// Runs beside lane174.mjs; a round with any foreign sample inside its runs is discarded by the readout.
import { execSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import os from "node:os";
const OUT = process.argv[2]; const ROOT = Number(process.argv[3]);
const RX = /vitest|oeselg-labs\/platform|uat-harness|grugops-examples\/wt-|\.grugops\/context\/[^ ]*\/probe\//;
writeFileSync(OUT, "utc\tload1\tuser_procs\tforeign\tlines\n");
const uid = String(process.getuid());
setInterval(() => {
  const rows = execSync("ps -axo pid=,ppid=,uid=,command=", { encoding: "utf8" }).trim().split("\n").map((l) => {
    const m = l.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/);
    return { pid: +m[1], ppid: +m[2], uid: m[3], cmd: m[4] };
  });
  const kids = new Map(); for (const r of rows) { if (!kids.has(r.ppid)) kids.set(r.ppid, []); kids.get(r.ppid).push(r.pid); }
  const ours = new Set([ROOT]); const q = [ROOT];
  while (q.length) for (const c of kids.get(q.pop()) ?? []) if (!ours.has(c)) { ours.add(c); q.push(c); }
  const byPid = new Map(rows.map((r) => [r.pid, r])); for (let p = byPid.get(ROOT)?.ppid; p && p > 1 && !ours.has(p); p = byPid.get(p)?.ppid) ours.add(p);
  const mine = rows.filter((r) => r.uid === uid).length;
  const f = rows.filter((r) => !ours.has(r.pid) && r.pid !== process.pid && RX.test(r.cmd) && !r.cmd.includes("ps -axo"));
  appendFileSync(OUT, `${new Date().toISOString()}\t${os.loadavg()[0].toFixed(2)}\t${mine}\t${f.length}\t${f.map((r) => `${r.pid} ${r.cmd.slice(0, 140)}`).join(" | ")}\n`);
}, 5000);
