// run-bounded.js — runs ONE command with a wall-clock bound, and kills its WHOLE process tree
// when the bound is crossed.
//
// `ABC-122` K4 (2026-09-25). Before this, `npm test` was a plain `vitest run` with nothing outside
// it to stop it. Vitest's own `testTimeout` is a timer inside the worker, and a synchronous,
// CPU-bound computation never yields to it. So a regression of that class (`ABC-081`'s K4 mutant:
// the root depth guard reverted) STALLED the gate instead of failing it.
//
// NOT YET WIRED IN. `A4` puts `package.json`'s `test` script on this file:
//   "test": "node tools/grugops/run-bounded.js 60000 vitest run"
// That one line reds `src/cli.test.ts`'s `ABC-042` `A10` row, which pins `scripts.test` to
// `"vitest run"`, and `A11`'s fence does not cover that file. The line is held until the ruling.
// Run by hand at delivery, together with the one-line pin update, it gave 47 files and 1446 tests
// green through this file. Against the reverted root depth guard it gave exit 124 at 60.23 s.
//
// THE BOUND FOR `npm test`, 60000 ms, and the reading behind it (`A4`: at least 5x the median
// default-lane wall, at most 120000). Measured at delivery on 2026-09-25 (macOS 26.5.2, Node
// v24.12.0): 7 fresh `npx vitest run` runs at the ABC-122 tree, 47 files, 1446 tests. Median wall
// 7.45 s, range 7.16-7.88 s. The 1-minute load average was 13.6-23.5 while the runs were taken,
// because other agent hops were running on the same machine. 5x the median is 37.3 s. 60 s is
// 8.1x: headroom for a machine loaded worse than that, and a real hang still fails within a
// minute. Re-measure it if the lane's wall grows past 12 s. The DEEP lanes (`SEARCH_DEEP`,
// `ENGINE_DEEP`, ...) run far longer than this, which is why they are run with `npx vitest run`
// directly and never through `npm test`.
//
// Contract:
//   node tools/grugops/run-bounded.js <timeoutMs> <command> [args...]
//     exit = the command's own exit code, when it exits within the bound; stdio is inherited,
//            so its output passes through untouched
//     exit 124 -> the bound was crossed. The whole tree was sent SIGKILL, and one stderr line
//            names the bound and the command. (124 is the number GNU timeout(1) uses.)
//     exit 128+n -> the command died of signal n that this wrapper did not send
//     exit 2 -> could not run: a missing command, a timeout that is not a positive integer, or a
//            command that could not be started
//
// HOW THE TREE IS KILLED, with `node:` built-ins only. There is no `timeout(1)` and no `pkill`:
// stock macOS has no `timeout(1)`, and on the machine where this was found it came from Homebrew.
// The command is spawned `detached`, which on POSIX makes it the leader of a NEW process group.
// Everything it starts joins that group unless it detaches itself. `process.kill(-pid)` signals
// the whole group at once.
//   - Detaching takes the group off the terminal's foreground, so a Ctrl-C at the terminal no
//     longer reaches it on its own. SIGINT and SIGTERM are therefore forwarded to the group.
//   - A grandchild that makes ITSELF a new group or session escapes. Vitest does not do that.
//   - Windows has no process groups. There, the fallback kills the direct child only, and a
//     grandchild can outlive it. This was not exercised; this project runs on macOS.
//
// SECURITY: the command and its arguments are spawned as an argv array, never through a shell.
// There is no `shell: true` and no string is interpolated into a command line.

import { spawn } from "node:child_process";
import { constants } from "node:os";
import { clearTimeout, setTimeout } from "node:timers";

const TIMEOUT_EXIT = 124;

const [timeoutArg, command, ...args] = process.argv.slice(2);
const timeoutMs = Number(timeoutArg);
if (command === undefined || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
  process.stderr.write("usage: node tools/grugops/run-bounded.js <timeoutMs> <command> [args...]\n");
  process.exit(2);
}

const child = spawn(command, args, { stdio: "inherit", detached: process.platform !== "win32" });

function killTree(signal) {
  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error.code !== "ESRCH") throw error; // ESRCH: the group is already gone
  }
}

let timedOut = false;
const timer = setTimeout(() => {
  timedOut = true;
  process.stderr.write(
    `run-bounded: timed out after ${timeoutMs} ms, killed the process tree of: ${[command, ...args].join(" ")}\n`,
  );
  killTree("SIGKILL");
}, timeoutMs);

for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => killTree(signal));

child.on("error", (error) => {
  clearTimeout(timer);
  process.stderr.write(`run-bounded: could not start ${command}: ${error.message}\n`);
  process.exit(2);
});

child.on("exit", (code, signal) => {
  clearTimeout(timer);
  if (timedOut) process.exit(TIMEOUT_EXIT);
  if (signal !== null) process.exit(128 + (constants.signals[signal] ?? 0));
  process.exit(code);
});
