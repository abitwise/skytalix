// run-bounded.proof.js — the committed proof for `ABC-122` `A1`–`A3`: the wrapper passes a
// finished command through untouched, and it really kills a live hang, tree and all, in bounded
// time. This is demonstrated here, not claimed.
//
//   node tools/grugops/run-bounded.proof.js
//     exit 0 -> every row held      exit 1 -> a row failed; each row prints its reading
//
// WHY IT LIVES HERE AND NOT IN THE LANE, the same reasoning as `lane-inventory.js`. `A12` fixes
// the lane's additions at exactly two test files, both under `src/`, which are `A6` and `A8`. A
// `.js` under `tools/` is not collected by vitest. So this proof adds no file to the lane, no
// child process and no wall time. THE LIMIT, stated rather than smoothed: like every tool here,
// it catches a broken wrapper only when someone runs it.
//
// IT CANNOT HANG ITS RUNNER. The hang row runs the wrapper at a 500 ms bound. Behind that is this
// script's own outer bound: SIGKILL to the wrapper and the fixture's group after
// OUTER_BOUND_MS. After both, a `finally` sweep kills anything still alive and says so.

import { spawn, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const WRAPPER = join(here, "run-bounded.js");
const FIXTURE = join(here, "run-bounded.hang-fixture.js");
const TIMEOUT_EXIT = 124;
const HANG_BOUND_MS = 500;
const OVERHEAD_MS = 250; // A1 / A3: exit within the bound + 250 ms
const GRACE_MS = 250; // A3: how long after the exit the orphan check waits
const OUTER_BOUND_MS = 5_000;

let failed = 0;
function row(name, ok, reading) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  —  ${reading}`);
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") return false;
    throw error;
  }
}

// A2: a finished command passes through byte-for-byte: stdout, stderr and exit code. The green
// command must pass through, and so must a red one, because a wrapper that masks red is worse
// than no wrapper.
for (const exitCode of [0, 3]) {
  const script = `process.stdout.write("out \\u00e9 1\\n"); process.stderr.write("err 2\\n"); process.exitCode = ${exitCode};`;
  const direct = spawnSync(process.execPath, ["-e", script], { timeout: 10_000 });
  const wrapped = spawnSync(
    process.execPath,
    [WRAPPER, "10000", process.execPath, "-e", script],
    { timeout: 10_000 },
  );
  row(
    `A2 pass-through, exit ${exitCode}`,
    direct.status === exitCode &&
      wrapped.status === direct.status &&
      Buffer.compare(wrapped.stdout, direct.stdout) === 0 &&
      Buffer.compare(wrapped.stderr, direct.stderr) === 0,
    `status ${direct.status}/${wrapped.status}, stdout ${direct.stdout.length}/${wrapped.stdout.length} B, stderr ${direct.stderr.length}/${wrapped.stderr.length} B (direct/wrapped)`,
  );
}

// A1 + A3: the synthetic hang, killed as a tree, in bounded time.
let pids = null;
try {
  const started = performance.now();
  const wrapper = spawn(process.execPath, [WRAPPER, String(HANG_BOUND_MS), process.execPath, FIXTURE], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  wrapper.stdout.on("data", (chunk) => {
    stdout += chunk;
    if (pids === null && stdout.includes("\n")) {
      pids = JSON.parse(stdout.split("\n")[0]);
      // ARMED: the group and both processes must be seen ALIVE first, or the check afterwards
      // would pass on a probe that cannot see a live process.
      pids.armed = alive(-pids.fixture) && alive(pids.fixture) && alive(pids.grandchild);
    }
  });
  wrapper.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const outer = setTimeout(() => {
    wrapper.kill("SIGKILL");
    if (pids !== null) process.kill(-pids.fixture, "SIGKILL");
  }, OUTER_BOUND_MS);
  const [code] = await new Promise((resolve) => {
    wrapper.on("exit", (...exit) => resolve(exit));
  });
  const elapsed = performance.now() - started;
  clearTimeout(outer);

  row("A3 exit code is the wrapper's timeout code", code === TIMEOUT_EXIT, `exit ${code}`);
  row(
    `A1/A3 bounded: exit within ${HANG_BOUND_MS} + ${OVERHEAD_MS} ms`,
    elapsed <= HANG_BOUND_MS + OVERHEAD_MS,
    `${elapsed.toFixed(1)} ms from spawn to exit, including the wrapper's own start-up`,
  );
  const line = stderr.trim();
  row(
    "A1 one stderr line naming the bound and the command",
    !line.includes("\n") && line.includes(`${HANG_BOUND_MS} ms`) && line.includes(FIXTURE),
    JSON.stringify(line),
  );
  row(
    "A3 armed: fixture, grandchild and their group seen alive before the kill",
    pids?.armed === true,
    JSON.stringify(pids),
  );
  await sleep(GRACE_MS);
  const survivors =
    pids === null
      ? ["no pids read"]
      : [
          ["group", -pids.fixture],
          ["fixture", pids.fixture],
          ["grandchild", pids.grandchild],
        ]
          .filter(([, pid]) => alive(pid))
          .map(([name, pid]) => `${name} ${pid}`);
  row(
    `A1/A3 no process from the spawn alive ${GRACE_MS} ms after exit`,
    survivors.length === 0,
    survivors.length === 0 ? "group, fixture and grandchild all ESRCH" : `ALIVE: ${survivors.join(", ")}`,
  );
} finally {
  if (pids !== null && alive(-pids.fixture)) {
    process.kill(-pids.fixture, "SIGKILL");
    console.log(`cleanup: killed surviving group ${pids.fixture}`);
  }
}

console.log(`${process.platform} ${process.version}: ${failed === 0 ? "all rows held" : `${failed} row(s) FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
