// ABC-146 A0 driver (Security/NFR). Pre-registered; do not edit after the pre-registration commit.
//
//   node pairs.mjs <label>
//
// - 5 interleaved pairs; odd pairs run plain node first, even pairs run vitest first.
// - Every run is a fresh child process; the graded wall is the in-process call wall (workload.mjs).
// - Window rule: a set starts only after QUIET_MS with no foreign process; "foreign" = a `ps aux` line
//   matching /vitest|oeselg-labs\/platform/ whose PID is neither this driver, an ancestor of it, nor a
//   descendant of it. Checked before and after every run and every POLL_MS during it. A foreign sighting
//   at ANY point voids the whole set in progress (never a partial set graded); the driver waits for a
//   fresh quiet window and re-takes the set from pair 1, up to MAX_ATTEMPTS.
// - A set is also void if any child exits non-zero, or if the 10 node counts are not all equal.
// - Per run: load1 before, thermal pressure level before and after, power source before.
// - Output: raw/<label>.jsonl.txt (every run and every void, appended) and raw/<label>.summary.json.
import { execFileSync, spawn } from "node:child_process";
import { appendFileSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROBE = dirname(fileURLToPath(import.meta.url));
const WT = join(PROBE, "..", "..", "..", "..");
const RAW = join(PROBE, "raw");
const PAIRS = 5;
const QUIET_MS = 180_000;
const QUIET_POLL_MS = 5_000;
const POLL_MS = 500;
const MAX_ATTEMPTS = 8;
const PATTERN = /vitest|oeselg-labs\/platform/;

const label = process.argv[2];
if (!label) {
  console.error("usage: node pairs.mjs <label>");
  process.exit(2);
}
const LOG = join(RAW, `${label}.jsonl.txt`);
const log = (o) => {
  const line = JSON.stringify({ at: new Date().toISOString(), ...o });
  appendFileSync(LOG, `${line}\n`);
  console.log(line);
};
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" });
const therm = () => sh("notifyutil", ["-g", "com.apple.system.thermalpressurelevel"]).trim().split(/\s+/).pop();
const power = () => sh("pmset", ["-g", "batt"]).split("\n")[0].trim();

function procTable() {
  const rows = sh("ps", ["axo", "pid=,ppid="])
    .trim()
    .split("\n")
    .map((l) => l.trim().split(/\s+/).map(Number));
  const parent = new Map(rows.map(([p, pp]) => [p, pp]));
  return parent;
}
function foreign() {
  const parent = procTable();
  const mine = new Set([process.pid]);
  for (let p = process.ppid; p && p > 1; p = parent.get(p)) mine.add(p);
  const isDescendant = (pid) => {
    for (let p = pid; p && p > 1; p = parent.get(p)) if (p === process.pid) return true;
    return false;
  };
  const hits = [];
  for (const line of sh("ps", ["aux"]).split("\n").slice(1)) {
    if (!PATTERN.test(line) || /grep/.test(line)) continue;
    const pid = Number(line.trim().split(/\s+/)[1]);
    if (mine.has(pid) || isDescendant(pid)) continue;
    hits.push(line.replace(/\s+/g, " ").slice(0, 240));
  }
  return hits;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitQuiet() {
  let quietSince = Date.now();
  for (;;) {
    const f = foreign();
    if (f.length) {
      quietSince = Date.now();
    } else if (Date.now() - quietSince >= QUIET_MS) {
      return;
    }
    await sleep(QUIET_POLL_MS);
  }
}

const childEnv = () => {
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (k.startsWith("VITEST") || k === "NODE_OPTIONS") delete env[k];
  return env;
};

function argvFor(arm) {
  if (arm === "node") return [process.execPath, [join(PROBE, "node-run.mjs")]];
  return [
    process.execPath,
    [join(WT, "node_modules", "vitest", "vitest.mjs"), "run", "--config", join(WT, "vitest.config.ts"), "--root", PROBE],
  ];
}

async function oneRun(arm, outFile) {
  const [cmd, args] = argvFor(arm);
  let sighting = null;
  const t0 = process.hrtime.bigint();
  const child = spawn(cmd, args, { cwd: WT, env: { ...childEnv(), A0_OUT: outFile }, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  child.stdout.on("data", (d) => (stdout += d));
  child.stderr.on("data", (d) => (stdout += d));
  const poll = setInterval(() => {
    const f = foreign();
    if (f.length && !sighting) sighting = f;
  }, POLL_MS);
  const code = await new Promise((r) => child.on("close", (c) => r(c)));
  clearInterval(poll);
  const procWallMs = Number(process.hrtime.bigint() - t0) / 1e6;
  return { code, procWallMs, sighting, stdout };
}

async function attempt(n) {
  await waitQuiet();
  log({ event: "set-start", attempt: n, load1: loadavg()[0], therm: therm(), power: power() });
  const tmp = mkdtempSync(join(tmpdir(), "a0-"));
  const runs = [];
  for (let p = 1; p <= PAIRS; p++) {
    const order = p % 2 === 1 ? ["node", "vitest"] : ["vitest", "node"];
    const pair = {};
    for (const arm of order) {
      const pre = foreign();
      if (pre.length) return { void: `foreign before pair ${p} ${arm}`, detail: pre };
      const load1 = loadavg()[0];
      const thermBefore = therm();
      const pw = power();
      const outFile = join(tmp, `p${p}-${arm}.json`);
      const r = await oneRun(arm, outFile);
      const thermAfter = therm();
      const post = foreign();
      if (r.sighting || post.length) return { void: `foreign during/after pair ${p} ${arm}`, detail: r.sighting ?? post };
      if (r.code !== 0) return { void: `pair ${p} ${arm} exited ${r.code}`, detail: r.stdout.slice(-2000) };
      const res = JSON.parse(readFileSync(outFile, "utf8"));
      const row = { event: "run", attempt: n, pair: p, arm, load1, thermBefore, thermAfter, power: pw, procWallMs: r.procWallMs, ...res };
      log(row);
      pair[arm] = row;
      runs.push(row);
    }
    pair.ratio = pair.vitest.callWallMs / pair.node.callWallMs;
    log({ event: "pair", attempt: n, pair: p, ratio: pair.ratio });
  }
  const nodes = new Set(runs.map((r) => r.nodes));
  const digests = new Set(runs.map((r) => r.digest));
  if (nodes.size !== 1 || digests.size !== 1) return { void: "node counts or digests not all equal", detail: [...nodes, ...digests] };
  return { runs };
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

for (let n = 1; n <= MAX_ATTEMPTS; n++) {
  const r = await attempt(n);
  if (r.void) {
    log({ event: "void", attempt: n, reason: r.void, detail: r.detail });
    continue;
  }
  const ratios = [];
  for (let p = 1; p <= PAIRS; p++) {
    const v = r.runs.find((x) => x.pair === p && x.arm === "vitest");
    const nd = r.runs.find((x) => x.pair === p && x.arm === "node");
    ratios.push(v.callWallMs / nd.callWallMs);
  }
  const F = median(ratios);
  const F_hi = Math.max(...ratios);
  const summary = {
    attempt: n,
    nodes: r.runs.map((x) => x.nodes),
    digest: r.runs[0].digest,
    ratios,
    F,
    F_hi,
    route: F_hi <= 1.3 ? "V" : "N",
    rule: "V iff F_hi <= 1.30",
    load1: r.runs.map((x) => x.load1),
    therm: r.runs.map((x) => [x.thermBefore, x.thermAfter]),
    node: r.runs[0].node,
  };
  writeFileSync(join(RAW, `${label}.summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
  log({ event: "set-graded", ...summary });
  process.exit(0);
}
log({ event: "gave-up", attempts: MAX_ATTEMPTS });
process.exit(3);
