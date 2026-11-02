// qe-ABC-266-d12: grade full.jsonl by the sealed rule (decision 6231db75). usage: node analyse.mjs <full.jsonl>
import { readFileSync } from "node:fs";
const L = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const gos = L.filter((o) => o.ev === "go");
const out = { cells: {} };
for (const mt of [100, 1000]) for (const k of [1, 4, 12]) {
  const g = gos.filter((o) => o.movetime === mt && o.k === k).sort((a, b) => a.pos - b.pos);
  const d = g.map((o) => o.depth);
  const cell = { n: g.length, median: med(d), min: Math.min(...d), max: Math.max(...d), depths: d.join(" "),
    nodesMedian: med(g.map((o) => o.nodes)), nodesSum: g.reduce((s, o) => s + o.nodes, 0), wallMsMedian: med(g.map((o) => o.wallMs)), wallMsMax: Math.max(...g.map((o) => o.wallMs)) };
  if (k > 1) {
    cell.w0Median = med(g.map((o) => o.w0depth));
    cell.playedAboveW0 = g.filter((o) => o.depth > o.w0depth).length;
    cell.byNonZero = g.filter((o) => o.by !== 0).length;
    cell.helperNodesPerWorkerMedian = med(g.map((o) => o.nodes / k));
  }
  out.cells[`${mt}ms T${k}`] = cell;
}
// per-position T12 vs T1
for (const mt of [100, 1000]) {
  const by = (k) => new Map(gos.filter((o) => o.movetime === mt && o.k === k).map((o) => [o.pos, o.depth]));
  const a = by(1), b = by(12), c = by(4);
  let up = 0, eq = 0, dn = 0, up4 = 0, eq4 = 0, dn4 = 0;
  for (const [p, d1] of a) { const x = b.get(p) - d1; x > 0 ? up++ : x === 0 ? eq++ : dn++; const y = c.get(p) - d1; y > 0 ? up4++ : y === 0 ? eq4++ : dn4++; }
  out[`perPos ${mt}ms`] = { T12vsT1: { above: up, equal: eq, below: dn }, T4vsT1: { above: up4, equal: eq4, below: dn4 } };
}
// load
const blocks = L.filter((o) => o.ev === "block" && o.movetime === 100);
const phase = L.find((o) => o.ev === "phase" && o.movetime === 100);
const phase1k = L.find((o) => o.ev === "phase" && o.movetime === 1000);
const a = blocks.some((o) => o.vitest > 0 || o.cutechess > 0);
const b = phase.foreignCores > 0.8;
const cN = blocks.filter((o) => o.foreignCores > 0.8).length;
const loaded = a || b || cN > 4;
out.load100 = { foreignVitestOrCutechess: a, phaseForeignCores: +phase.foreignCores.toFixed(3), blocksOver08: cN, blockFcMax: +Math.max(...blocks.map((o) => o.foreignCores)).toFixed(3), hot: phase.hot, tctl: phase.tctl, LOADED: loaded };
const b1k = L.filter((o) => o.ev === "block" && o.movetime === 1000);
out.load1000 = { phaseForeignCores: +phase1k.foreignCores.toFixed(3), blocksOver08: b1k.filter((o) => o.foreignCores > 0.8).length, blockFcMax: +Math.max(...b1k.map((o) => o.foreignCores)).toFixed(3), vitestOrCutechess: b1k.some((o) => o.vitest > 0 || o.cutechess > 0), hot: phase1k.hot, tctl: phase1k.tctl };
const m12 = out.cells["100ms T12"].median, m1 = out.cells["100ms T1"].median;
out.rule = { medianT12_100: m12, medianT1_100: m1, above: m12 > m1, outcome: m12 > m1 ? (loaded ? "PASS (SHARED)" : "PASS") : loaded ? "VOID-LOAD" : "MISS" };
out.start = L.find((o) => o.ev === "start"); out.done = L.find((o) => o.ev === "done"); out.warmup = L.filter((o) => o.ev === "warmup").map((o) => ({ k: o.k, depth: o.depth, wallMs: o.wallMs }));
out.errors = L.filter((o) => o.ev === "worker-error").length;
console.log(JSON.stringify(out, null, 1));
