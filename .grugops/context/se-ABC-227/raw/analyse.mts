// ABC-227: read the redacted profiles in raw/profiles/ and write analysis.json + analysis.txt.
// Usage: node analyse.mts [board ...]   (default: kiwipete position-6 start)
// Only samples inside the chooseMove window [t0us, t1us] (CLOCK_MONOTONIC, the profile's own base)
// count, so process start-up and TypeScript stripping are excluded; GC and (program) ticks inside
// the window are kept and fall in "other".
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, "profiles");
const BOARDS = process.argv.length > 2 ? process.argv.slice(2) : ["kiwipete", "position-6", "start"];
const BUCKETS = ["movegen", "make/unmake", "evaluation", "ordering", "tt", "other"] as const;
type Bucket = (typeof BUCKETS)[number];

interface CallFrame { functionName: string; url: string; lineNumber: number }
interface CpuNode { id: number; callFrame: CallFrame; children?: number[] }
interface CpuProfile { nodes: CpuNode[]; startTime: number; samples: number[]; timeDeltas: number[] }
interface HeapNode { callFrame: CallFrame; selfSize: number; children: HeapNode[] }
interface RunResult { run: number; nodes: number; nps: number; depth: number; elapsedMs: number; allocatedBytes: number; bytesPerNode: number; load1: number; t0us: number; t1us: number; move: unknown; score: number }

const fileOf = (url: string): string => {
  const m = /<repo>\/(src\/[^/]+\.ts)$/.exec(url);
  return m ? (m[1] as string) : url === "" ? "" : "(non-src)";
};
const keyOf = (f: CallFrame): string => {
  const file = fileOf(f.url);
  if (file.startsWith("src/")) return `${f.functionName || "(anonymous)"} ${file}:${f.lineNumber + 1}`;
  if (f.functionName.startsWith("(")) return f.functionName; // (garbage collector), (program), (root)
  return `${f.functionName || "(anonymous)"} ${file === "" ? "(native)" : file}`;
};
const ORDERING_ROOTS = new Set(["orderMoves", "orderKey"]);
function bucketOf(frame: CallFrame, underOrdering: boolean): Bucket {
  if (underOrdering) return "ordering";
  switch (fileOf(frame.url)) {
    case "src/moves.ts":
    case "src/legal.ts":
      return "movegen";
    case "src/apply.ts":
      return "make/unmake";
    case "src/evaluate.ts":
      return "evaluation";
    case "src/transposition.ts":
      return "tt";
    default:
      return "other";
  }
}
// Inclusive (self + callees) readings for the functions the ticket names, by function name in src/.
const INCLUSIVE = ["legalMoves", "legalCaptures", "hasLegalMove", "generateMoves", "isSquareAttackedBy", "makeMove", "unmakeMove", "evaluate", "quiesce", "orderMoves", "storeEntry", "probeTable", "tableCutoff", "zobristKeyAfterMove", "leafScore"];

const readGz = (name: string): string => gunzipSync(readFileSync(join(DIR, name))).toString("utf8");
const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? (s[m] as number) : ((s[m - 1] as number) + (s[m] as number)) / 2;
};
const pct = (x: number): number => Math.round(x * 1000) / 10;

interface CpuRun { run: number; total: number; self: Map<string, number>; buckets: Record<Bucket, number>; incl: Map<string, number>; otherBy: Map<string, number>; result: RunResult; windowCheck: { inWindow: number; chooseMoveOutside: number } }

function readCpu(board: string, run: number): CpuRun {
  const result = JSON.parse(readFileSync(join(DIR, `${board}-cpu-${run}.json`), "utf8")) as RunResult;
  const p = JSON.parse(readGz(`${board}-cpu-${run}.cpuprofile.gz`)) as CpuProfile;
  const byId = new Map(p.nodes.map((n) => [n.id, n]));
  const parent = new Map<number, number>();
  for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
  const stackCache = new Map<number, { key: string; bucket: Bucket; ancestors: Set<string>; underChoose: boolean; srcFile: string }>();
  const info = (id: number) => {
    let hit = stackCache.get(id);
    if (hit) return hit;
    const node = byId.get(id) as CpuNode;
    const names = new Set<string>();
    let underOrdering = false;
    let underChoose = false;
    for (let cur: number | undefined = id; cur !== undefined; cur = parent.get(cur)) {
      const f = (byId.get(cur) as CpuNode).callFrame;
      if (fileOf(f.url).startsWith("src/")) names.add(f.functionName);
      if (fileOf(f.url) === "src/search.ts" && ORDERING_ROOTS.has(f.functionName)) underOrdering = true;
      if (f.functionName === "chooseMove") underChoose = true;
    }
    hit = { key: keyOf(node.callFrame), bucket: bucketOf(node.callFrame, underOrdering), ancestors: names, underChoose, srcFile: fileOf(node.callFrame.url) };
    stackCache.set(id, hit);
    return hit;
  };
  const self = new Map<string, number>();
  const incl = new Map<string, number>();
  const otherBy = new Map<string, number>();
  const buckets = Object.fromEntries(BUCKETS.map((b) => [b, 0])) as Record<Bucket, number>;
  let t = p.startTime;
  let total = 0;
  let chooseMoveOutside = 0;
  p.samples.forEach((id, i) => {
    t += p.timeDeltas[i] as number;
    const s = info(id);
    if (t < result.t0us || t > result.t1us) {
      if (s.underChoose) chooseMoveOutside++;
      return;
    }
    total++;
    self.set(s.key, (self.get(s.key) ?? 0) + 1);
    buckets[s.bucket]++;
    if (s.bucket === "other") {
      const k = s.srcFile.startsWith("src/") ? s.srcFile : s.key;
      otherBy.set(k, (otherBy.get(k) ?? 0) + 1);
    }
    for (const name of INCLUSIVE) if (s.ancestors.has(name)) incl.set(name, (incl.get(name) ?? 0) + 1);
  });
  return { run, total, self, buckets, incl, otherBy, result, windowCheck: { inWindow: total, chooseMoveOutside } };
}

interface HeapRun { run: number; total: number; bySite: Map<string, number>; buckets: Record<Bucket, number>; orderMovesIncl: number; result: RunResult }
function readHeap(board: string, run: number): HeapRun {
  const result = JSON.parse(readFileSync(join(DIR, `${board}-heap-${run}.json`), "utf8")) as RunResult;
  const p = JSON.parse(readGz(`${board}-heap-${run}.heapprofile.gz`)) as { head: HeapNode };
  const bySite = new Map<string, number>();
  const buckets = Object.fromEntries(BUCKETS.map((b) => [b, 0])) as Record<Bucket, number>;
  let total = 0;
  let orderMovesIncl = 0;
  const walk = (n: HeapNode, underOrdering: boolean, underOrderMoves: boolean): void => {
    const f = n.callFrame;
    const inSearch = fileOf(f.url) === "src/search.ts";
    const ord = underOrdering || (inSearch && ORDERING_ROOTS.has(f.functionName));
    const om = underOrderMoves || (inSearch && f.functionName === "orderMoves");
    if (n.selfSize > 0) {
      total += n.selfSize;
      const k = keyOf(f);
      bySite.set(k, (bySite.get(k) ?? 0) + n.selfSize);
      buckets[bucketOf(f, ord)] += n.selfSize;
      if (om) orderMovesIncl += n.selfSize;
    }
    for (const c of n.children) walk(c, ord, om);
  };
  walk(p.head, false, false);
  return { run, total, bySite, buckets, orderMovesIncl, result };
}

const runsOf = (board: string, mode: string): number[] =>
  readdirSync(DIR)
    .map((f) => new RegExp(`^${board}-${mode}-(\\d+)\\.json$`).exec(f))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b);

const rankOf = (m: Map<string, number>): string[] =>
  [...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([k]) => k);

const report: Record<string, unknown> = {};
const lines: string[] = [];
for (const board of BOARDS) {
  const cpu = runsOf(board, "cpu").map((r) => readCpu(board, r));
  const heap = runsOf(board, "heap").map((r) => readHeap(board, r));
  const pooledSelf = new Map<string, number>();
  let pooledTotal = 0;
  for (const r of cpu) {
    pooledTotal += r.total;
    for (const [k, v] of r.self) pooledSelf.set(k, (pooledSelf.get(k) ?? 0) + v);
  }
  const pooledRank = rankOf(pooledSelf);
  const runRanks = cpu.map((r) => rankOf(r.self));
  const top15 = pooledRank.slice(0, 15).map((k, i) => {
    const shares = cpu.map((r) => (r.self.get(k) ?? 0) / r.total);
    return {
      rank: i + 1,
      fn: k,
      pooledShare: pct((pooledSelf.get(k) ?? 0) / pooledTotal),
      medianShare: pct(median(shares)),
      minShare: pct(Math.min(...shares)),
      maxShare: pct(Math.max(...shares)),
      runRanks: runRanks.map((rr) => rr.indexOf(k) + 1),
    };
  });
  const stability = top15.slice(0, 5).map((t) => ({
    fn: t.fn,
    pooledRank: t.rank,
    runRanks: t.runRanks,
    maxDeviation: Math.max(...t.runRanks.map((r) => Math.abs(r - t.rank))),
  }));
  const bucketShare = (b: Bucket) => {
    const shares = cpu.map((r) => r.buckets[b] / r.total);
    return { pooled: pct(cpu.reduce((s, r) => s + r.buckets[b], 0) / pooledTotal), median: pct(median(shares)), min: pct(Math.min(...shares)), max: pct(Math.max(...shares)) };
  };
  const buckets = Object.fromEntries(BUCKETS.map((b) => [b, bucketShare(b)]));
  const bucketSum = Math.round(BUCKETS.reduce((s, b) => s + (buckets[b] as { pooled: number }).pooled, 0) * 10) / 10;
  const otherPooled = new Map<string, number>();
  for (const r of cpu) for (const [k, v] of r.otherBy) otherPooled.set(k, (otherPooled.get(k) ?? 0) + v);
  const otherBreakdown = rankOf(otherPooled).slice(0, 10).map((k) => ({ what: k, pooledShare: pct((otherPooled.get(k) ?? 0) / pooledTotal) }));
  const inclusive = Object.fromEntries(INCLUSIVE.map((name) => [name, pct(cpu.reduce((s, r) => s + (r.incl.get(name) ?? 0), 0) / pooledTotal)]));
  const nps = median(cpu.map((r) => r.result.nps));
  const heapTotal = heap.reduce((s, r) => s + r.total, 0);
  const allocBuckets = Object.fromEntries(BUCKETS.map((b) => [b, pct(heap.reduce((s, r) => s + r.buckets[b], 0) / heapTotal)]));
  const pooledSites = new Map<string, number>();
  for (const r of heap) for (const [k, v] of r.bySite) pooledSites.set(k, (pooledSites.get(k) ?? 0) + v);
  const allocTop = rankOf(pooledSites).slice(0, 10).map((k) => ({ site: k, share: pct((pooledSites.get(k) ?? 0) / heapTotal) }));
  const out = {
    runs: { cpu: cpu.map((r) => r.run), heap: heap.map((r) => r.run) },
    perRun: cpu.map((r) => ({ run: r.run, depth: r.result.depth, nodes: r.result.nodes, elapsedMs: r.result.elapsedMs, nps: r.result.nps, bytesPerNode: Math.round(r.result.bytesPerNode), load1: r.result.load1, samplesInWindow: r.total, chooseMoveSamplesOutsideWindow: r.windowCheck.chooseMoveOutside })),
    heapRuns: heap.map((r) => ({ run: r.run, depth: r.result.depth, nodes: r.result.nodes, nps: r.result.nps, bytesPerNode: Math.round(r.result.bytesPerNode), sampledBytes: r.total, counterBytes: r.result.allocatedBytes, load1: r.result.load1 })),
    medianNps: nps,
    medianDepth: median(cpu.map((r) => r.result.depth)),
    medianBytesPerNode: Math.round(median(cpu.map((r) => r.result.bytesPerNode))),
    medianAllocMBperS: Math.round(median(cpu.map((r) => r.result.allocatedBytes / r.result.elapsedMs / 1000))),
    top15,
    stability,
    stable: stability.every((s) => s.maxDeviation <= 2),
    buckets,
    bucketSum,
    otherBreakdown,
    inclusive,
    alloc: {
      orderMovesShare: pct(heap.reduce((s, r) => s + r.orderMovesIncl, 0) / heapTotal),
      orderingBucketShare: allocBuckets.ordering,
      buckets: allocBuckets,
      topSites: allocTop,
      sampledOverCounter: Math.round((heapTotal / heap.reduce((s, r) => s + r.result.allocatedBytes, 0)) * 1000) / 1000,
    },
  };
  report[board] = out;
  lines.push(`== ${board}: runs cpu ${out.runs.cpu.join(",")} heap ${out.runs.heap.join(",")}`);
  lines.push(`median nps ${nps} (cpu-prof runs; per run ${cpu.map((r) => r.result.nps).join(", ")}), median depth ${out.medianDepth}, load1 ${cpu.map((r) => r.result.load1).join(", ")}`);
  lines.push(`bytes/node median ${out.medianBytesPerNode} (cpu runs, V8 total_allocated_bytes), ${out.medianAllocMBperS} MB/s; heap-sampled/counter ${out.alloc.sampledOverCounter}`);
  lines.push("top 15 self time (pooled share %, median, min-max, per-run ranks):");
  for (const t of top15) lines.push(`  ${String(t.rank).padStart(2)} ${t.pooledShare.toFixed(1).padStart(5)}  med ${t.medianShare.toFixed(1)}  ${t.minShare.toFixed(1)}-${t.maxShare.toFixed(1)}  [${t.runRanks.join(" ")}]  ${t.fn}`);
  lines.push(`top-5 rank stability (max |run rank - pooled rank|): ${stability.map((s) => s.maxDeviation).join(", ")} -> ${out.stable ? "within +-2" : "NOT within +-2"}`);
  lines.push(`buckets (pooled %; median; min-max): ${BUCKETS.map((b) => { const x = buckets[b] as { pooled: number; median: number; min: number; max: number }; return `${b} ${x.pooled} (${x.median}; ${x.min}-${x.max})`; }).join(" | ")}  sum ${bucketSum}`);
  lines.push(`other, by file/frame: ${otherBreakdown.map((o) => `${o.what} ${o.pooledShare}`).join("; ")}`);
  lines.push(`inclusive %: ${Object.entries(inclusive).map(([k, v]) => `${k} ${v}`).join("; ")}`);
  lines.push(`alloc: orderMoves (incl. callees) ${out.alloc.orderMovesShare}% of bytes; by bucket ${BUCKETS.map((b) => `${b} ${allocBuckets[b]}`).join(" | ")}`);
  lines.push(`alloc top sites: ${allocTop.map((a) => `${a.site} ${a.share}`).join("; ")}`);
  lines.push("");
}
writeFileSync(join(HERE, "analysis.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(HERE, "analysis.txt"), `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
