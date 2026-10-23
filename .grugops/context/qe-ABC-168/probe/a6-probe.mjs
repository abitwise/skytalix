// ABC-168 A6 — QE hand reading (page test note 6; ruling route (2), BA/PM …eb53fbfe).
// ONE async probe, run with plain `node`, never through vitest. It lives outside src/, so
// ABC-173 C2 and the ADR-0008 heap ceiling do not apply and are not edited or waived.
//
// Usage: node a6-probe.mjs <repository root> [entry, default src/uci.ts]
// The entry override exists ONLY for a dry run against a stub (not a counted reading).
//
// Clocks (performance.now()):
//   R1 spawn -> uciok:   starts just before spawn(); `uci` written straight after spawn; stops on the `uciok` line.
//   R2 isready -> readyok (first, book load included): `isready` sent after uciok.
//   R3 isready -> readyok (idle, later): sent after the first readyok; no `go` is ever sent.
// A reply that has not arrived 10 000 ms after its command is a miss, recorded as "no reply".
// Then `quit`, and the child's exit code is recorded.

import { spawn, execFileSync } from "node:child_process";
import { resolve } from "node:path";

const [repo, entryArg] = process.argv.slice(2);
if (repo === undefined) throw new Error("usage: node a6-probe.mjs <repository root> [entry]");
const entry = resolve(repo, entryArg ?? "src/uci.ts");

const NO_REPLY_MS = 10_000;
const TARGETS = { R1: 2000, R2: 1000, R3: 100 };

const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8" }).trim();
const chip = sh("sysctl", ["-n", "machdep.cpu.brand_string"]);
const loadavg = sh("sysctl", ["-n", "vm.loadavg"]);
const load1 = loadavg.replace(/[{}]/g, "").trim().split(/\s+/)[0];
const tip = sh("git", ["rev-parse", "HEAD"], repo);

// Default options: nothing set on the UCI side; the child's environment is this process's minus
// NODE_OPTIONS, so no heap or loader flag reaches it.
const env = { ...process.env };
delete env.NODE_OPTIONS;

const stdoutLines = []; // { t, line }
let stderr = "";
let buffer = "";
let waiter = null; // { want, resolve }

const t0 = performance.now();
const child = spawn(process.execPath, [entry], { cwd: repo, env, stdio: ["pipe", "pipe", "pipe"] });
child.stdin.write("uci\n");

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
    stdoutLines.push({ t, line });
    if (waiter !== null && line === waiter.want) {
      const w = waiter;
      waiter = null;
      w.resolve(t);
    }
    nl = buffer.indexOf("\n");
  }
});

/** Resolves with the arrival time of the first line equal to `want`, or null after 10 000 ms. */
const waitFor = (want, sentAt) =>
  new Promise((done) => {
    const timer = setTimeout(() => {
      waiter = null;
      done(null);
    }, NO_REPLY_MS - (performance.now() - sentAt));
    waiter = {
      want,
      resolve: (t) => {
        clearTimeout(timer);
        done(t);
      },
    };
  });

const readings = {};
const record = (key, start, end) => {
  const ms = end === null ? null : end - start;
  readings[key] = {
    ms: ms === null ? "no reply" : Number(ms.toFixed(1)),
    target: TARGETS[key],
    verdict: ms !== null && ms <= TARGETS[key] ? "met" : "missed",
  };
};

const tUciok = await waitFor("uciok", t0);
record("R1", t0, tUciok);

if (tUciok !== null) {
  const s2 = performance.now();
  child.stdin.write("isready\n");
  const r2 = await waitFor("readyok", s2);
  record("R2", s2, r2);
  if (r2 !== null) {
    const s3 = performance.now();
    child.stdin.write("isready\n");
    const r3 = await waitFor("readyok", s3);
    record("R3", s3, r3);
  }
}
for (const key of Object.keys(TARGETS))
  if (readings[key] === undefined) readings[key] = { ms: "not reached", target: TARGETS[key], verdict: "missed" };

child.stdin.write("quit\n");
child.stdin.end();
const killer = setTimeout(() => child.kill("SIGTERM"), NO_REPLY_MS);
const exit = await exited;
clearTimeout(killer);

const result = {
  probe: "ABC-168 A6 (test note 6)",
  at_utc: new Date().toISOString(),
  host_chip: chip,
  node: process.version,
  load1_before_run: load1,
  vm_loadavg: loadavg,
  tip_sha: tip,
  command: `${process.execPath} ${entry}`,
  cwd: repo,
  readings,
  child_exit: exit,
  stdout: stdoutLines.map(({ t, line }) => `${(t - t0).toFixed(1)}ms ${line}`),
  stderr,
};
console.log(JSON.stringify(result, null, 2));
