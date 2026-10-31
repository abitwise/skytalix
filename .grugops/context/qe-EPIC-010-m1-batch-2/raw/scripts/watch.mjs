// qe-EPIC-010-m1-batch-2 watcher (PREREG). Never edits tools/; acts on our own pids only.
// usage: node watch.mjs <out-dir> <harness-pid-file> <log-file>
// Every 20 s: own Tctl (k10temp), harness alive?, our cutechess-cli and its engines, the tool's
// thermal.log median of its last 30 samples. Every 60 s: contamination (foreign vitest, cutechess-cli,
// stockfish, skytalix engines), load1. Every 5 min: top 3 CPU processes.
// Thermal PAUSE: thermal.log median(30) > 85 °C -> SIGSTOP the harness node only, and only while our
// cutechess-cli is alive and its block has < 20 "Finished game" lines (the block plays on to its end).
// RESUME: our cutechess-cli gone and own Tctl < 60 °C on 3 consecutive 20 s readings -> SIGCONT.
// THERMAL STOP: thermal.log median(30) > 90 °C, or (while paused) median of own last 15 > 90 °C ->
// SIGCONT, SIGTERM harness, our cutechess-cli and its engines.
// BLOCK-01 GUARD (ABC-247 Test note 3): when schedule.log shows "end block 01 <build>", read that
// build's b01/r.pgn skytalix clocks; any at 3.0s or none at 4.0s -> CLOCK STOP (SIGTERM as above).
// A zombie cutechess-cli (exited, not yet reaped by the stopped harness) counts as gone.
// Exits when the harness pid is gone.
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [out, pidFile, logFile] = process.argv.slice(2);
const SCRATCH = /\/tmp\/claude-1000\/[^ ]*?\/scratchpad/g;
const log = (msg) =>
  appendFileSync(logFile, `${new Date().toISOString().replace(/\.\d+Z$/, "Z")} ${msg.replace(SCRATCH, "<scratch>")}\n`);
const read = (p) => {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return undefined;
  }
};
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
const median = (xs) => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
let hwmon;
for (const h of readdirSync("/sys/class/hwmon")) if (read(`/sys/class/hwmon/${h}/name`)?.trim() === "k10temp") hwmon = h;
const tctl = () => Number(read(`/sys/class/hwmon/${hwmon}/temp1_input`)) / 1000;
const procs = () =>
  execFileSync("ps", ["-eo", "pid=,ppid=,stat=,pcpu=,comm=,args="], { encoding: "utf8", maxBuffer: 1 << 24 })
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const m = /^\s*(\d+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(l);
      return m && { pid: +m[1], ppid: +m[2], stat: m[3], pcpu: +m[4], comm: m[5], args: m[6] };
    })
    .filter(Boolean);
const thermalMedian = () => {
  const t = read(join(out, "thermal.log"));
  if (t === undefined) return { med: Number.NaN, n: 0 };
  const v = t
    .trim()
    .split("\n")
    .slice(-30)
    .map((l) => Number(/tctl=([\d.]+)/.exec(l)?.[1]))
    .filter(Number.isFinite);
  return { med: median(v), n: v.length };
};
const finishedIn = (file) => (read(file)?.match(/^Finished game /gm) ?? []).length;
const pgnoutOf = (pid) => {
  const a = (read(`/proc/${pid}/cmdline`) ?? "").split("\0");
  const i = a.indexOf("-pgnout");
  return i >= 0 ? a[i + 1] : undefined;
};

const harness = Number(read(pidFile)?.trim());
log(`watcher start: harness pid ${harness} alive=${alive(harness)} k10temp=${hwmon}`);
const own = [];
let paused = false;
let pauseAt = 0;
let coolOk = 0;
let tick = 0;
let stopped = false;
const checked = new Set();
const pauses = [];

function killOurs(reason) {
  stopped = true;
  log(`STOP: ${reason}`);
  const ps = procs();
  const cc = ps.filter((p) => p.ppid === harness && p.comm.startsWith("cutechess") && !p.stat.startsWith("Z"));
  const eng = ps.filter((p) => cc.some((c) => c.pid === p.ppid));
  if (paused) {
    try {
      process.kill(harness, "SIGCONT");
    } catch {}
  }
  for (const p of [...eng, ...cc]) {
    try {
      process.kill(p.pid, "SIGTERM");
      log(`  SIGTERM ${p.comm} ${p.pid}`);
    } catch {}
  }
  try {
    process.kill(harness, "SIGTERM");
    log(`  SIGTERM harness ${harness}`);
  } catch {}
}

function guard() {
  const sched = read(join(out, "schedule.log")) ?? "";
  for (const build of ["base", "candidate"]) {
    if (checked.has(build) || !sched.includes(`end block 01 ${build}`)) continue;
    checked.add(build);
    const pgn = join(out, build, "b01", "r.pgn");
    let res;
    try {
      res = execFileSync(process.execPath, [join(import.meta.dirname, "clocks.mjs"), "--check", pgn], { encoding: "utf8" });
      log(`BLOCK-01 GUARD ${build}: ${res.trim().replace(/\n/g, " | ")}`);
    } catch (e) {
      log(`BLOCK-01 GUARD ${build}: ${String(e.stdout ?? e.message).trim().replace(/\n/g, " | ")}`);
      killOurs(`CLOCK STOP: block 01 ${build} skytalix clocks miss the 4.0 s guard`);
    }
  }
}

function step() {
  tick++;
  const t = tctl();
  own.push(t);
  if (own.length > 15) own.shift();
  if (!alive(harness)) {
    guard();
    log(`harness ${harness} gone; tctl=${t.toFixed(1)}; pauses=${JSON.stringify(pauses)}; watcher exits`);
    process.exit(0);
  }
  const ps = procs();
  const cc = ps.filter((p) => p.ppid === harness && p.comm.startsWith("cutechess") && !p.stat.startsWith("Z"));
  const ccPids = new Set(cc.map((p) => p.pid));
  const eng = ps.filter((p) => ccPids.has(p.ppid));
  const th = thermalMedian();
  const pgn = cc[0] ? pgnoutOf(cc[0].pid) : undefined;
  const rout = pgn ? join(pgn, "..", "r.out") : undefined;
  const fin = rout ? finishedIn(rout) : -1;
  const block = pgn ? pgn.replace(/^.*\/(base|candidate)\/(b\d\d)\/r\.pgn$/, "$1 $2") : "-";
  guard();
  if (stopped) return;
  // thermal
  if (th.n >= 30 && th.med > 90) return killOurs(`THERMAL STOP: thermal.log median(30) ${th.med.toFixed(2)} > 90`);
  if (paused && own.length >= 15 && median(own) > 90) return killOurs(`THERMAL STOP: watcher median(15) ${median(own).toFixed(2)} > 90 while paused`);
  if (!paused && th.n >= 30 && th.med > 85 && cc.length > 0 && fin >= 0 && fin < 20) {
    process.kill(harness, "SIGSTOP");
    paused = true;
    pauseAt = Date.now();
    coolOk = 0;
    pauses.push({ stop: new Date().toISOString(), block, fin, med: th.med });
    log(`PAUSE: SIGSTOP harness; thermal.log median(30) ${th.med.toFixed(2)} > 85; ${block} at ${fin}/20 finished`);
  } else if (paused) {
    if (cc.length > 0) coolOk = 0;
    else coolOk = t < 60 ? coolOk + 1 : 0;
    if (cc.length === 0 && !pauses.at(-1).blockEnd) {
      pauses.at(-1).blockEnd = new Date().toISOString();
      log(`PAUSE: block cutechess-cli ended; cooling`);
    }
    if (coolOk >= 3) {
      process.kill(harness, "SIGCONT");
      paused = false;
      pauses.at(-1).resume = new Date().toISOString();
      pauses.at(-1).seconds = Math.round((Date.now() - pauseAt) / 1000);
      log(`RESUME: SIGCONT harness after ${pauses.at(-1).seconds} s; tctl ${t.toFixed(1)}`);
    }
  }
  if (tick % 3 === 0) {
    const vitest = ps.filter((p) => /[/]vitest/.test(p.args));
    const fcc = ps.filter((p) => p.comm.startsWith("cutechess") && !ccPids.has(p.pid));
    const fsf = ps.filter((p) => p.comm.startsWith("stockfish") && !ccPids.has(p.ppid));
    const fsky = ps.filter((p) => /dist\/uci\.js/.test(p.args) && !ccPids.has(p.ppid));
    const fg = vitest.length + fcc.length + fsf.length + fsky.length;
    log(
      `tick ${block} fin=${fin} tctl=${t.toFixed(1)} th_med30=${Number.isFinite(th.med) ? th.med.toFixed(2) : "-"} load1=${loadavg()[0].toFixed(2)} ours: cc=${cc.length} eng=${eng.length} paused=${paused} foreign: vitest=${vitest.length} cc=${fcc.length} sf=${fsf.length} sky=${fsky.length}${fg ? " FOREIGN " + [...vitest, ...fcc, ...fsf, ...fsky].map((p) => `${p.pid}:${p.comm}`).join(",") : ""}`,
    );
  }
  if (tick % 15 === 0) {
    const top = [...ps].sort((a, b) => b.pcpu - a.pcpu).slice(0, 3);
    log(`top3 ${top.map((p) => `${p.comm}(${p.pid}) ${p.pcpu}%`).join("; ")}`);
  }
}
setInterval(() => {
  try {
    step();
  } catch (e) {
    log(`watcher error: ${e.message}`);
  }
}, 20_000);
step();
