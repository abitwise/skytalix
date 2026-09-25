// run-bounded.hang-fixture.js — a process tree that NEVER exits on its own. `ABC-122` `A3` only.
//
// It starts one grandchild that idles forever, so the proof can tell a TREE kill from a kill of
// the direct child alone. It prints both pids on one stdout line. Then it hangs in a synchronous,
// CPU-bound loop that yields to nothing, which is the hang class `ABC-081`'s K4 mutant produced.
// The loop starts only once the line is flushed: on macOS a write to a pipe is asynchronous, and
// a loop entered straight after it would keep the line from ever leaving.
//
// Run it only under `run-bounded.js` with a short bound. On its own it runs until killed.

import { spawn } from "node:child_process";

const grandchild = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
  stdio: "ignore",
});
process.stdout.write(`${JSON.stringify({ fixture: process.pid, grandchild: grandchild.pid })}\n`, () => {
  for (;;) {}
});
