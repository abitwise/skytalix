// secnfr-ABC-096 NFR-007 driver. One REAL `npm run chess -- --colour white --ascii` child per reading:
//   node nfr007-run.mjs <tree-root> <hook 0|1> <first-call out file>     (SMOKE=1: no timing figure printed)
// Measures, from spawn: the first stdout byte (firstByteMs) and the moment stdout holds frame 0 whole, i.e. 23 newlines
// (frame0Ms; NFR-007 "to first rendered board"). Then writes "quit\n" twice, ends stdin, and waits for exit.
// Hard bound 15 s: past it the child's process group gets SIGTERM (never SIGKILL) and the reading is void.
// hook=1 preloads first-call-hook.mjs via NODE_OPTIONS (the NFR-007 first-call <= 30 ms reading).
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const [R, HOOK, OUT] = process.argv.slice(2);
const SMOKE = process.env.SMOKE === "1";
const hook = fileURLToPath(new URL("./first-call-hook.mjs", import.meta.url));
const env = { ...process.env, SECNFR096_OUT: OUT };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP") || k.startsWith("VITEST")) delete env[k];
if (HOOK === "1") env.NODE_OPTIONS = `--import=${hook}`;
else delete env.NODE_OPTIONS;

const t0 = performance.now();
const child = spawn("npm", ["run", "--silent", "chess", "--", "--colour", "white", "--ascii"], {
  cwd: R,
  env,
  stdio: ["pipe", "pipe", "pipe"],
  detached: true,
});
let out = "";
let err = "";
let firstByteMs;
let frame0Ms;
let quitSent = false;
child.stdout.on("data", (chunk) => {
  if (firstByteMs === undefined) firstByteMs = performance.now() - t0;
  out += chunk;
  if (frame0Ms === undefined && (out.match(/\n/g) ?? []).length >= 23) {
    frame0Ms = performance.now() - t0;
    if (!quitSent) {
      quitSent = true;
      child.stdin.write("quit\n");
      child.stdin.write("quit\n");
      child.stdin.end();
    }
  }
});
child.stderr.on("data", (chunk) => {
  err += chunk;
});
let timedOut = false;
const bound = setTimeout(() => {
  timedOut = true;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {}
}, 15_000);
child.on("exit", (code, signal) => {
  clearTimeout(bound);
  const line = {
    tree: R.split("/").pop(),
    hook: HOOK === "1",
    exit: code,
    signal,
    timedOut,
    stderrBytes: Buffer.byteLength(err),
    frame0Seen: frame0Ms !== undefined,
    asciiOnly: !/[^\x0a\x0d\x1b\x20-\x7e]/.test(out),
  };
  if (!SMOKE) Object.assign(line, { firstByteMs, frame0Ms, exitMs: performance.now() - t0 });
  console.log(JSON.stringify(line));
});
