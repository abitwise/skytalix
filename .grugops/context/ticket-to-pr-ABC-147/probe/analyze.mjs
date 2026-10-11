// ABC-147 A1: attribute one profiled `npm test` run's sampled CPU into the five buckets of METHOD.md.
// Usage: node analyze.mjs <profile dir> <repo root (realpath)>  -> prints one JSON object on stdout.
// Read-only. It never writes the tree.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [dir, rootArg] = process.argv.slice(2);
if (!dir || !rootArg) throw new Error("usage: analyze.mjs <profile dir> <repo root>");
const ROOT = rootArg.replace(/\/$/, "");

// The url -> bucket rule, exactly as METHOD.md declares it. Returns [bucket, label].
function bucketOf(url) {
  if (url.startsWith("node:")) return ["iv", "node:"];
  if (url.startsWith("wasm://")) return ["iii", "wasm"];
  const path = url.replace(/^file:\/\//, "");
  const nm = path.match(/^(.*\/node_modules\/((?:@[^/]+\/)?[^/]+))/);
  if (nm) return ["iii", `node_modules/${nm[2]}`];
  if (path.startsWith(`${ROOT}/`)) {
    const rel = path.slice(ROOT.length + 1);
    if (rel.startsWith("tools/grugops/") || rel === "vitest.config.ts") return ["iii", rel];
    if (rel.endsWith(".test.ts")) return ["ii", rel];
    if (rel.startsWith("src/")) return ["i", rel];
    return ["ii", `outside-src:${rel}`];
  }
  return ["v", `other:${url.slice(0, 80)}`];
}

const files = readdirSync(dir).filter((f) => f.endsWith(".cpuprofile"));
// The vitest process is the pid that owns worker-thread (tid > 0) profiles.
const parse = (f) => {
  const [, , , pid, tid] = f.split(".");
  return { f, pid, tid: Number(tid) };
};
const metas = files.map(parse);
const workerPids = new Set(metas.filter((m) => m.tid > 0).map((m) => m.pid));
if (workerPids.size !== 1) throw new Error(`expected exactly one pid with worker threads, got ${[...workerPids]}`);
const VPID = [...workerPids][0];

const B = { i: 0, ii: 0, iii: 0, iv: 0, v: 0 };
const where = { worker: 0, vitestMain: 0, child: 0 };
let iWorker = 0;
let iChild = 0;
let iVitestMain = 0;
let outsideSrc = 0;
const prodFiles = {}; // src file -> self us (all classes)
const prodFilesWorker = {};
const perTestFile = {}; // test file -> (i-w) us
let workerNoSingleFile = 0;
let workerNoSingleFileI = 0;
let idle = 0;
let profiles = 0;
let workerProfiles = 0;

for (const m of metas) {
  const p = JSON.parse(readFileSync(join(dir, m.f), "utf8"));
  profiles++;
  const cls = m.pid === VPID ? (m.tid > 0 ? "worker" : "vitestMain") : "child";
  if (cls === "worker") workerProfiles++;
  const byId = new Map(p.nodes.map((n) => [n.id, n]));
  const parent = new Map();
  for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
  const self = new Map();
  const ts = [];
  let t = p.startTime;
  for (const d of p.timeDeltas) {
    t += d;
    ts.push(t);
  }
  for (let i = 0; i < p.samples.length; i++) {
    const dur = (i + 1 < ts.length ? ts[i + 1] : p.endTime) - ts[i];
    self.set(p.samples[i], (self.get(p.samples[i]) ?? 0) + Math.max(0, dur));
  }
  const tests = new Set();
  for (const n of p.nodes) if (/\.test\.ts$/.test(n.callFrame.url)) tests.add(n.callFrame.url.replace(/^file:\/\//, "").slice(ROOT.length + 1));
  const testFile = tests.size === 1 ? [...tests][0] : null;
  let profI = 0;
  for (const [id, us] of self) {
    const n = byId.get(id);
    const fn = n.callFrame.functionName;
    if (fn === "(idle)") {
      idle += us;
      continue;
    }
    let b;
    let label;
    if (fn === "(garbage collector)") [b, label] = ["iv", "gc"];
    else if (fn === "(program)" || fn === "(root)") [b, label] = ["v", fn];
    else if (n.callFrame.url === "") {
      // native frame: bill to the nearest ancestor with a url
      let a = parent.get(id);
      while (a !== undefined && byId.get(a).callFrame.url === "") a = parent.get(a);
      if (a === undefined) [b, label] = ["v", "native-orphan"];
      else [b, label] = bucketOf(byId.get(a).callFrame.url);
    } else [b, label] = bucketOf(n.callFrame.url);
    B[b] += us;
    where[cls] += us;
    if (label.startsWith("outside-src:")) outsideSrc += us;
    if (b === "i") {
      prodFiles[label] = (prodFiles[label] ?? 0) + us;
      if (cls === "worker") {
        iWorker += us;
        profI += us;
        prodFilesWorker[label] = (prodFilesWorker[label] ?? 0) + us;
      } else if (cls === "child") iChild += us;
      else iVitestMain += us;
    }
  }
  if (cls === "worker") {
    if (testFile) perTestFile[testFile] = (perTestFile[testFile] ?? 0) + profI;
    else {
      workerNoSingleFile++;
      workerNoSingleFileI += profI;
    }
  }
}

const busy = B.i + B.ii + B.iii + B.iv + B.v;
const pct = (x) => +((100 * x) / busy).toFixed(3);
const sec = (x) => +(x / 1e6).toFixed(3);
const top = (o, k) =>
  Object.entries(o)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([f, us]) => ({ file: f, s: sec(us), pct: pct(us) }));
console.log(
  JSON.stringify({
    profiles,
    workerProfiles,
    vitestPid: VPID,
    sampledBusyS: sec(busy),
    idleS: sec(idle),
    sharePct: { i: pct(B.i), ii: pct(B.ii), iii: pct(B.iii), iv: pct(B.iv), v: pct(B.v) },
    iWorkerPct: pct(iWorker),
    iChildPct: pct(iChild),
    iVitestMainPct: pct(iVitestMain),
    outsideSrcPct: pct(outsideSrc),
    wherePct: { worker: pct(where.worker), vitestMain: pct(where.vitestMain), child: pct(where.child) },
    bucketS: Object.fromEntries(Object.entries(B).map(([k, v]) => [k, sec(v)])),
    topProd: top(prodFiles, 5),
    topProdWorker: top(prodFilesWorker, 5),
    perTestFileIW: top(perTestFile, 10),
    workerNoSingleFile,
    workerNoSingleFileIPct: pct(workerNoSingleFileI),
  }),
);
