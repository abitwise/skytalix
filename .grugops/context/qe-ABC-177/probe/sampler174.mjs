// qe-ABC-174 overlap sampler: every 5 s, one `ps`, logs load1, this user's process count, and every process that is
// NOT this hop's: vitest, oeselg-labs/platform, another hop's harness/worktree/probe. "This hop's" = a descendant of
// ROOT (argv[3], the driver shell's pid) or an ancestor of it (the shell that launched the driver), so the arms' own `npm exec vitest …` lines are never counted as foreign.
// Runs beside lane174.mjs; a round with any foreign sample inside its runs is discarded by the readout.
// qe-redact-SEC-177-1 (2026-10-21), two changes, nothing else:
//   SEC-177-1: a foreign process is logged as its CLASS only (vitest|node|bats|kubectl|docker|curl|shell|other), one per
//     process in `lines`; its command line is matched in memory and never written. `foreign` is still the count.
//   FIX-177-1: an unparsed `ps` line is skipped (never dereferenced), counted per sample in the new last column
//     `unparsed`, and logged to OUT.unparsed.tsv as utc / length / shape / class (never its text). A failing tick is
//     logged there too and never throws out of the interval. Columns utc, load1, user_procs, foreign, lines are unchanged.
import { execSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import os from "node:os";
const OUT = process.argv[2]; const ROOT = Number(process.argv[3]); const SIDE = `${OUT}.unparsed.tsv`;
const RX = /vitest|oeselg-labs\/platform|uat-harness|grugops-examples\/wt-|\.grugops\/context\/[^ ]*\/probe\//;
const ROW = /^(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/;
const classOf = (cmd) => {
  if (/vitest/.test(cmd)) return "vitest";
  if (/\bbats\b/.test(cmd)) return "bats";
  if (/kubectl|\bflux\b/.test(cmd)) return "kubectl";
  if (/docker/.test(cmd)) return "docker";
  if (/\bcurl\b/.test(cmd)) return "curl";
  const exe = cmd.trim().split(/\s+/)[0] ?? "";
  if (/(^|\/)node$/.test(exe) || /^np[mx]$/.test(exe)) return "node";
  if (/(^|\/)-?(ba|z|da)?sh$/.test(exe)) return "shell";
  return "other";
};
const shapeOf = (t) => (t === "" ? "empty" : /^\d+$/.test(t) ? "pid-only" : /^\d/.test(t) ? "short-fields" : "no-leading-pid");
writeFileSync(OUT, "utc\tload1\tuser_procs\tforeign\tlines\tunparsed\n");
writeFileSync(SIDE, "utc\tlength\tshape\tclass\n");
const uid = String(process.getuid());
setInterval(() => {
  const utc = new Date().toISOString();
  try {
    const rows = []; let unparsed = 0;
    for (const l of execSync("ps -axo pid=,ppid=,uid=,command=", { encoding: "utf8" }).trim().split("\n")) {
      const t = l.trim(); const m = t.match(ROW);
      if (!m) { unparsed++; appendFileSync(SIDE, `${utc}\t${t.length}\t${shapeOf(t)}\t${classOf(t)}\n`); continue; }
      rows.push({ pid: +m[1], ppid: +m[2], uid: m[3], cmd: m[4] });
    }
    const kids = new Map(); for (const r of rows) { if (!kids.has(r.ppid)) kids.set(r.ppid, []); kids.get(r.ppid).push(r.pid); }
    const ours = new Set([ROOT]); const q = [ROOT];
    while (q.length) for (const c of kids.get(q.pop()) ?? []) if (!ours.has(c)) { ours.add(c); q.push(c); }
    const byPid = new Map(rows.map((r) => [r.pid, r])); for (let p = byPid.get(ROOT)?.ppid; p && p > 1 && !ours.has(p); p = byPid.get(p)?.ppid) ours.add(p);
    const mine = rows.filter((r) => r.uid === uid).length;
    const f = rows.filter((r) => !ours.has(r.pid) && r.pid !== process.pid && RX.test(r.cmd) && !r.cmd.includes("ps -axo"));
    appendFileSync(OUT, `${utc}\t${os.loadavg()[0].toFixed(2)}\t${mine}\t${f.length}\t${f.map((r) => classOf(r.cmd)).join(" | ")}\t${unparsed}\n`);
  } catch (e) {
    try { appendFileSync(SIDE, `${utc}\t-\ttick-error\t${String(e?.name ?? "Error")}\n`); } catch { /* never throw from the interval */ }
  }
}, 5000);
