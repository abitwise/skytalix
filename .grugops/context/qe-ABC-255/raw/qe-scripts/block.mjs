// qe-ABC-255 block runner. Run INSIDE `flock <host-test.lock>` so the lock is held for the whole block.
// usage: node block.mjs <label> <logDir> <cwd> -- <cmd> [args...]
// 1. wait-clear (ALONE): 0 real vitest (comm node*, args with /vitest; flock waiters / shells are NOT counted, QE-249-c),
//    0 cutechess-cli, load1 <= 2.0, Tctl <= 60 C; poll 15 s; cap 20 min, then proceed flagged SHARED.
// 2. spawn the command (stdout+stderr -> <logDir>/cmd.log); sample every 10 s -> <logDir>/samples.log:
//    load1, Tctl, real foreign vitest pids (+cwd), foreign cutechess-cli count, foreign processes >= 20 % CPU (/proc deltas).
// 3. THERMAL STOP: median of the last 30 Tctl samples > 85 C -> SIGTERM to our cutechess-cli and its engines (by pid).
// 4. writes rc, start/end stamps to <logDir>/block.log. Waits by child exit, never by pgrep loops.
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync, openSync, readdirSync, readFileSync, readlinkSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [label, logDir, cwd, sep, cmd, ...args] = process.argv.slice(2);
if (sep !== "--" || cmd === undefined) throw new Error("usage: node block.mjs <label> <logDir> <cwd> -- <cmd> [args...]");
mkdirSync(logDir, { recursive: true });
const stamp = () => new Date().toISOString();
const blog = (s) => appendFileSync(join(logDir, "block.log"), `${stamp()} ${label} ${s}\n`);
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return undefined; } };
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    if (read(`/sys/class/hwmon/${h}/name`)?.trim() === "k10temp") return Number(read(`/sys/class/hwmon/${h}/temp1_input`)) / 1000;
  }
  return Number.NaN;
};
/** pid -> { ppid, comm, args, ticks } for every readable process. */
const procs = () => {
  const m = new Map();
  for (const d of readdirSync("/proc")) {
    if (!/^\d+$/.test(d)) continue;
    const st = read(`/proc/${d}/stat`);
    if (st === undefined) continue;
    const r = st.lastIndexOf(")");
    const comm = st.slice(st.indexOf("(") + 1, r);
    const f = st.slice(r + 2).split(" ");
    const args = (read(`/proc/${d}/cmdline`) ?? "").split("\0").join(" ").trim();
    m.set(Number(d), { ppid: Number(f[1]), comm, args, ticks: Number(f[11]) + Number(f[12]) });
  }
  return m;
};
const descendants = (m, root) => {
  const out = new Set([root]);
  let grew = true;
  while (grew) { grew = false; for (const [pid, p] of m) if (!out.has(pid) && out.has(p.ppid)) { out.add(pid); grew = true; } }
  return out;
};
const realVitest = (m, mine) => [...m].filter(([pid, p]) => !mine.has(pid) && p.comm.startsWith("node") && /\/vitest/.test(p.args)).map(([pid]) => {
  let c = "?"; try { c = readlinkSync(`/proc/${pid}/cwd`); } catch {}
  return `${pid}@${c}`;
});
const cutechess = (m, mine) => [...m].filter(([pid, p]) => !mine.has(pid) && p.comm === "cutechess-cli").length;

// 1. wait-clear
blog(`block start; cmd: ${cmd} ${args.join(" ")}`);
const t0 = Date.now();
let shared = false;
for (let i = 1; ; i++) {
  const m = procs();
  const mine = descendants(m, process.pid);
  const v = realVitest(m, mine), c = cutechess(m, mine), l = loadavg()[0], t = tctl();
  if (v.length === 0 && c === 0 && l <= 2.0 && t <= 60.0) { blog(`ALONE clear at poll ${i} after ${((Date.now() - t0) / 1000).toFixed(0)} s load1=${l.toFixed(2)} tctl=${t.toFixed(1)}`); break; }
  if (Date.now() - t0 >= 20 * 60_000) { shared = true; blog(`WAIT CAP 20 min reached: proceeding flagged SHARED (vitest=${v.join(",") || 0} cutechess=${c} load1=${l.toFixed(2)} tctl=${t.toFixed(1)})`); break; }
  if (i === 1 || i % 4 === 0) blog(`wait poll=${i} vitest=${v.join(",") || 0} cutechess=${c} load1=${l.toFixed(2)} tctl=${t.toFixed(1)}`);
  sleepSync(15_000);
}

// 2. run + sample
const fd = openSync(join(logDir, "cmd.log"), "w");
const child = spawn(cmd, args, { cwd, stdio: ["ignore", fd, fd] });
blog(`spawned pid ${child.pid}${shared ? " (SHARED start)" : ""}`);
const temps = [];
let prev = new Map();
let thermal = false;
let capped = false;
const tRun = Date.now();
const CAP_MS = Number(process.env.CAP_MIN ?? 60) * 60_000;
const killOwnPlay = (m, mine) => { for (const pid of mine) { const p = m.get(pid); if (p && (p.comm === "cutechess-cli" || /dist\/uci\.js|stockfish/.test(p.args))) { try { process.kill(pid, "SIGTERM"); } catch {} } } };
const sample = () => {
  const m = procs();
  const mine = descendants(m, process.pid);
  const t = tctl();
  temps.push(t);
  const busy = [];
  for (const [pid, p] of m) {
    const before = prev.get(pid);
    if (before !== undefined && !mine.has(pid)) {
      const pct = ((p.ticks - before) / 100 / 10) * 100; // CLK_TCK 100, 10 s
      if (pct >= 20) busy.push(`${pid}:${p.comm}:${pct.toFixed(0)}%`);
    }
  }
  prev = new Map([...m].map(([pid, p]) => [pid, p.ticks]));
  const v = realVitest(m, mine);
  appendFileSync(join(logDir, "samples.log"),
    `${stamp()} load1=${loadavg()[0].toFixed(2)} tctl=${t.toFixed(1)} vitest=${v.length}${v.length ? `[${v.join(",")}]` : ""} cutechess_foreign=${cutechess(m, mine)} foreign_busy=${busy.join(",") || "-"}\n`);
  const last = temps.slice(-30).sort((a, b) => a - b);
  const med = last[Math.floor(last.length / 2)];
  if (!thermal && last.length >= 30 && med > 85) {
    thermal = true;
    blog(`THERMAL STOP: median of last 30 Tctl = ${med}`);
    killOwnPlay(m, mine);
  }
  if (!capped && Date.now() - tRun > CAP_MS) { capped = true; blog(`RUN CAP ${CAP_MS / 60000} min: SIGTERM own cutechess-cli`); killOwnPlay(m, mine); }
};
prev = new Map([...procs()].map(([pid, p]) => [pid, p.ticks]));
const timer = setInterval(sample, 10_000);
child.on("exit", (code, sig) => {
  clearInterval(timer);
  blog(`exit rc=${code} sig=${sig} wall=${((Date.now() - t0) / 1000).toFixed(0)} s run=${((Date.now() - tRun) / 1000).toFixed(0)} s${shared ? " SHARED-start" : ""}${thermal ? " THERMAL" : ""}${capped ? " CAPPED" : ""}`);
  process.exit(code ?? 1);
});
for (const s of ["SIGTERM", "SIGINT"]) process.on(s, () => { blog(`got ${s}: stopping own play`); const m = procs(); killOwnPlay(m, descendants(m, process.pid)); });
