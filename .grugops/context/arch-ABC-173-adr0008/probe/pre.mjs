import { appendFileSync } from "node:fs";
import { isMainThread, threadId } from "node:worker_threads";
import v8 from "node:v8";
import { createRequire, syncBuiltinESMExports } from "node:module";
const LOG = process.env.HEAP_PROBE_LOG;
const mib = v8.getHeapStatistics().heap_size_limit / 1048576;
const w = (o) => appendFileSync(LOG, JSON.stringify(o) + "\n");
const kind = !isMainThread ? "worker" : (process.argv[1] ?? "-e").replace(/.*node_modules\//, "nm/").replace(/.*\/(tools|src)\//, "$1/");
w({ ev: "start", pid: process.pid, ppid: process.ppid, tid: threadId, kind, mib });
if (isMainThread) {
  process.on("exit", () => w({ ev: "end", pid: process.pid, tid: 0, kind }));
  const req = createRequire(import.meta.url);
  const wt = req("node:worker_threads");
  const Orig = wt.Worker;
  let n = 0;
  wt.Worker = class extends Orig {
    constructor(...a) {
      super(...a);
      const id = `${process.pid}:${++n}`;
      w({ ev: "W+", id });
      this.once("exit", () => w({ ev: "W-", id }));
    }
  };
  syncBuiltinESMExports();
}
