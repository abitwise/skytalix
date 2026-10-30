// ABC-220 A14b — QE hand reading of ADR-0052 D7's <= 100 ms bound (ticket A14b, test note 5).
// ONE async probe, run with plain `node`, never through vitest. It lives under .grugops/context/, outside src/,
// so ABC-173 C2 and the ADR-0008 heap ceiling do not apply and are neither edited nor waived. It is not a
// delivery file and adds no spawn to any lane. Started from qe-ABC-168's probe/a6-probe.mjs; load1 is
// os.loadavg()[0] (that probe's sysctl read is macOS only) and the CPU is os.cpus()[0].model.
//
// Usage: node a14b-probe.mjs <repository root> [entry, default src/uci.ts]
// The entry override exists ONLY for a dry run against a stub (not a counted reading).
//
// Protocol (ticket A14b, verbatim order):
//   send `uci`; after `uciok`, send `setoption name TimeMode value simple-tournament`,
//   `setoption name OwnBook value false` and `isready`; after that `readyok`, send
//   `position startpos moves e2e4` and `go movetime 2000`; 100 ms after writing `go`, write `isready`.
//   Then `quit`; the exit code is recorded.
// Readings (performance.now(), taken when each stdout chunk arrives and right after each write):
//   R1  busy readyok arrival - bestmove arrival <= 100 ms
//   R2  the busy isready was written before bestmove arrived (else "not busy", missed)
//   R3  exactly one readyok per isready (2) and one bestmove; the busy readyok is the first line after bestmove
//   not graded: go -> bestmove, go -> isready
// A reply that has not arrived 10 000 ms after its command is a miss, recorded as "no reply".
// No host path is printed: the command is spelled relative to the repository.

import { execFileSync, spawn } from "node:child_process";
import { cpus, loadavg, release, type } from "node:os";
import { resolve } from "node:path";

const [repo, entryArg] = process.argv.slice(2);
if (repo === undefined) throw new Error("usage: node a14b-probe.mjs <repository root> [entry]");
const entryRel = entryArg ?? "src/uci.ts";
const entry = resolve(repo, entryRel);

const NO_REPLY_MS = 10_000;
const BUSY_DELAY_MS = 100;
const R1_BOUND_MS = 100;

const git = (args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
const tip = git(["rev-parse", "HEAD"]);
const srcTree = git(["rev-parse", "HEAD:src"]);

// The child's environment is this process's minus NODE_OPTIONS, so no heap or loader flag reaches it.
const env = { ...process.env };
delete env.NODE_OPTIONS;

const lines = []; // { t, line }
const writes = []; // { t, line }
let stderr = "";
let buffer = "";
let waiter = null; // { test, resolve }

const load1 = loadavg()[0];
const t0 = performance.now();
const child = spawn(process.execPath, [entry], { cwd: repo, env, stdio: ["pipe", "pipe", "pipe"] });
const send = (line) => {
  child.stdin.write(`${line}\n`);
  const t = performance.now();
  writes.push({ t, line });
  return t;
};
const exited = new Promise((done) => child.on("exit", (code, signal) => done({ code, signal })));
child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => {
  stderr += chunk;
});
child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  const t = performance.now();
  buffer += chunk;
  let nl = buffer.indexOf("\n");
  while (nl !== -1) {
    const line = buffer.slice(0, nl);
    buffer = buffer.slice(nl + 1);
    lines.push({ t, line });
    if (waiter !== null && waiter.test(line)) {
      const w = waiter;
      waiter = null;
      w.resolve(t);
    }
    nl = buffer.indexOf("\n");
  }
});

/** Resolves with the arrival time of the next line passing `test`, or null 10 000 ms after `sentAt`. */
const waitFor = (test, sentAt) =>
  new Promise((done) => {
    const timer = setTimeout(
      () => {
        waiter = null;
        done(null);
      },
      Math.max(0, NO_REPLY_MS - (performance.now() - sentAt)),
    );
    waiter = {
      test,
      resolve: (t) => {
        clearTimeout(timer);
        done(t);
      },
    };
  });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const misses = [];
let tGo = null;
let tBusyIsready = null;
let tBest = null;
let tBusyReady = null;

const sUci = send("uci");
const tUciok = await waitFor((l) => l === "uciok", sUci);
if (tUciok === null) misses.push("uci: no reply");
else {
  send("setoption name TimeMode value simple-tournament");
  send("setoption name OwnBook value false");
  const sReady = send("isready");
  const tReady = await waitFor((l) => l === "readyok", sReady);
  if (tReady === null) misses.push("first isready: no reply");
  else {
    send("position startpos moves e2e4");
    // Arm the bestmove watcher before writing go, so a fast reply is not missed.
    const bestP = new Promise((done) => {
      waiter = { test: (l) => l.startsWith("bestmove"), resolve: done };
    });
    tGo = send("go movetime 2000");
    const bestTimer = setTimeout(() => {
      if (waiter !== null) {
        waiter = null;
        bestResolve?.(null);
      }
    }, NO_REPLY_MS);
    let bestResolve = null;
    const bestOrTimeout = Promise.race([bestP, new Promise((done) => (bestResolve = done))]);
    // 100 ms after writing go, write isready (busy if the search is still running).
    const delay = BUSY_DELAY_MS - (performance.now() - tGo);
    await sleep(Math.max(0, delay));
    while (performance.now() - tGo < BUSY_DELAY_MS) await sleep(1); // never early: setTimeout may fire < 100 ms
    tBusyIsready = send("isready");
    tBest = await bestOrTimeout;
    clearTimeout(bestTimer);
    if (tBest === null) misses.push("go: no bestmove within 10 000 ms");
    // The busy readyok: the first readyok line that arrives after the busy isready was written.
    const already = lines.find((x) => x.line === "readyok" && x.t >= tBusyIsready);
    tBusyReady = already ? already.t : await waitFor((l) => l === "readyok", tBusyIsready);
    if (tBusyReady === null) misses.push("busy isready: no reply");
  }
}

send("quit");
child.stdin.end();
const killer = setTimeout(() => child.kill("SIGTERM"), NO_REPLY_MS);
const exit = await exited;
clearTimeout(killer);

// R1-R3.
const r1ms = tBest !== null && tBusyReady !== null ? tBusyReady - tBest : null;
const R1 = { ms: r1ms === null ? "no reply" : Number(r1ms.toFixed(2)), bound_ms: R1_BOUND_MS, verdict: r1ms !== null && r1ms <= R1_BOUND_MS ? "met" : "missed" };
const busy = tBusyIsready !== null && tBest !== null && tBusyIsready < tBest;
const R2 = {
  isready_written_ms_after_go: tBusyIsready === null ? null : Number((tBusyIsready - tGo).toFixed(2)),
  bestmove_arrived_ms_after_go: tBest === null ? null : Number((tBest - tGo).toFixed(2)),
  verdict: busy ? "met" : tBusyIsready === null || tBest === null ? "missed (no reply)" : "missed (not busy)",
};
const texts = lines.map((x) => x.line);
const readyAt = texts.flatMap((l, i) => (l === "readyok" ? [i] : []));
const bestAt = texts.flatMap((l, i) => (l.startsWith("bestmove") ? [i] : []));
const r3ok = readyAt.length === 2 && bestAt.length === 1 && readyAt[1] === bestAt[0] + 1 && readyAt[0] < bestAt[0];
const R3 = { readyok_count: readyAt.length, bestmove_count: bestAt.length, busy_readyok_index: readyAt[1] ?? null, bestmove_index: bestAt[0] ?? null, verdict: r3ok ? "met" : "missed" };

const result = {
  probe: "ABC-220 A14b (test note 5)",
  at_utc: new Date().toISOString(),
  host_cpu: cpus()[0]?.model ?? "unknown",
  host_os: `${type()} ${release()}`,
  node: process.version,
  load1_before_spawn: Number(load1.toFixed(2)),
  tip_sha: tip,
  src_tree: srcTree,
  command: `node ${entryRel} (cwd: the repository; spawned asynchronously, no shell, NODE_OPTIONS removed)`,
  readings: { R1, R2, R3 },
  not_graded: {
    go_to_bestmove_ms: tBest === null ? null : Number((tBest - tGo).toFixed(2)),
    go_to_isready_ms: tBusyIsready === null ? null : Number((tBusyIsready - tGo).toFixed(2)),
  },
  A14b: R1.verdict === "met" && R2.verdict === "met" && R3.verdict === "met" && misses.length === 0 ? "MET" : "NOT MET",
  misses,
  child_exit: exit,
  writes: writes.map(({ t, line }) => `${(t - t0).toFixed(2)}ms > ${line}`),
  stdout: lines.map(({ t, line }) => `${(t - t0).toFixed(2)}ms < ${line}`),
  stderr,
};
console.log(JSON.stringify(result, null, 2));
