// security-nfr-timing-2026-10-23 part (2), ABC-201 A3. Derivative of secnfr-ABC-096/probe/nfr007-run.mjs (sha256 a8f2e5644638,
// the …8d3f6c15 instrument, series (b): a fresh process per child, spawn-to-frame-0 measured outside the child, no hook).
// Changes, nothing else:
//  D1. The child is `npm run --silent chess -- --colour white --difficulty 5` (ABC-201 A3), not `--colour white --ascii`.
//  D2. After frame 0, stdin is ended (the pipe closed) and nothing is written to it (A3: "stdin a pipe that is closed after
//      frame 0 arrives"); the original wrote "quit\n" twice first.
//  D3. Frame 0 whole = FRAME_NL newlines on stdout (env, default 23 from …8d3f6c15). A3 pins it from child 1's output: every
//      stdout chunk is logged as [t ms, cumulative bytes, cumulative newlines] and child i's raw stdout is kept in
//      <outdir>/child-<i>.stdout, so frame0Ms can be re-derived for the pinned count after the fact.
//  D4. The hook path (hook=1) is removed. The child env drops NODE_OPTIONS, *_DEEP and VITEST* as before.
// Usage: node nfr007-201.mjs <clone root> <outdir> <child index>   (hard bound 15 s; SIGTERM to the group, never SIGKILL)
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const [R, OUTDIR, IDX] = process.argv.slice(2);
const FRAME_NL = Number(process.env.FRAME_NL ?? 23);
const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP") || k.startsWith("VITEST")) delete env[k];
delete env.NODE_OPTIONS;

const t0 = performance.now();
const child = spawn("npm", ["run", "--silent", "chess", "--", "--colour", "white", "--difficulty", "5"], {
  cwd: R,
  env,
  stdio: ["pipe", "pipe", "pipe"],
  detached: true,
});
const chunks = [];
const marks = [];
let bytes = 0;
let nl = 0;
let err = "";
let firstByteMs;
let frame0Ms;
let closed = false;
child.stdout.on("data", (chunk) => {
  const t = performance.now() - t0;
  if (firstByteMs === undefined) firstByteMs = t;
  chunks.push(chunk);
  bytes += chunk.length;
  for (const b of chunk) if (b === 10) nl++;
  marks.push([+t.toFixed(3), bytes, nl]);
  if (frame0Ms === undefined && nl >= FRAME_NL) {
    frame0Ms = t;
    if (!closed) {
      closed = true;
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
  const out = Buffer.concat(chunks);
  writeFileSync(join(OUTDIR, `child-${IDX}.stdout`), out);
  writeFileSync(join(OUTDIR, `child-${IDX}.stderr`), err);
  const line = {
    child: Number(IDX),
    exit: code,
    signal,
    timedOut,
    stderrBytes: Buffer.byteLength(err),
    frameNl: FRAME_NL,
    frame0Seen: frame0Ms !== undefined,
    newlinesTotal: nl,
    bytesTotal: bytes,
    asciiOnly: !/[^\x0a\x0d\x1b\x20-\x7e]/.test(out.toString("latin1")),
    firstByteMs,
    frame0Ms,
    exitMs: performance.now() - t0,
    marks,
  };
  console.log(JSON.stringify(line));
});
