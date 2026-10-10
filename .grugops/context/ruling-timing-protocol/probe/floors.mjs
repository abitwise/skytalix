// Ruling-timing-protocol probe: arithmetic over raw per-run files ALREADY ON RECORD. No lane is run.
// Usage: node floors.mjs <spec> [<spec> ...]
//   spec = label|path|instrument|nullX-nullY|treatX-treatY   (treat part may be "-")
//   a delta is X - Y per scored round (round 0 discarded), paired by (session, round).
// Formats auto-detected: tab/space header with `round cond ... cpu [wall]`, or `round=N tree=X real= user= sys=`.
// A line starting with `#` starts a new session (round numbers restart).
// Reported per null: n, median, and R = max(|x(k)|, |x(n+1-k)|) over the sorted per-round deltas: the
// distribution-free order-statistic interval for the median, k = the largest k whose coverage
// 1 - 2*sum_{i<k} C(n,i)/2^n is >= 92 %. At the standing n = 8 that is k = 2 (92.97 %): drop the single most
// extreme delta at each end and read the larger magnitude left. n = 7 gives k = 1 (98.4 %, the full range).
import { readFileSync } from "node:fs";

function parse(path) {
  const rows = [];
  let header = null;
  let session = 0;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) { session++; continue; }
    if (line.startsWith("round=")) {
      const kv = Object.fromEntries(line.split(" | ")[0].split(/\s+/).map((t) => t.split("=")));
      rows.push({ session, round: +kv.round, cond: kv.tree, cpu: +kv.user + +kv.sys, wall: +kv.real, load: +kv.load1_before });
      continue;
    }
    const cells = line.split(/\s+/);
    if (cells[0] === "round") { header = cells; continue; }
    const r = Object.fromEntries(header.map((h, i) => [h, cells[i]]));
    rows.push({ session, round: +r.round, cond: r.cond, cpu: +r.cpu, wall: r.wall === undefined ? NaN : +r.wall, load: +(r.load1_before ?? r.load1 ?? NaN) });
  }
  return rows;
}

function deltas(rows, x, y, field) {
  const key = (r) => `${r.session}/${r.round}`;
  const ys = new Map(rows.filter((r) => r.cond === y && r.round > 0).map((r) => [key(r), r[field]]));
  return rows.filter((r) => r.cond === x && r.round > 0 && ys.has(key(r))).map((r) => r[field] - ys.get(key(r)));
}

function stats(d) {
  const s = [...d].sort((a, b) => a - b);
  const n = s.length;
  const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const C = (a, b) => { let c = 1; for (let i = 0; i < b; i++) c = (c * (a - i)) / (i + 1); return c; };
  const covOf = (k) => { let t = 0; for (let i = 0; i < k; i++) t += C(n, i); return 1 - (2 * t) / 2 ** n; };
  let k = 1;
  while (k + 1 <= n / 2 && covOf(k + 1) >= 0.92) k++;
  const lo = s[k - 1];
  const hi = s[n - k];
  const cov = covOf(k);
  const pos = s.filter((v) => v > 0).length;
  return { n, k, med, lo, hi, R: Math.max(Math.abs(lo), Math.abs(hi)), cov, pos };
}

const f = (v) => (v >= 0 ? "+" : "") + v.toFixed(3);
for (const spec of process.argv.slice(2)) {
  const [label, path, instrument, nullPair, treatPair] = spec.split("|");
  const rows = parse(path);
  const base = rows.filter((r) => r.round > 0);
  const lvl = base.map((r) => r.cpu).sort((a, b) => a - b);
  const baseMed = lvl[Math.floor(lvl.length / 2)];
  const loads = base.map((r) => r.load).filter((v) => !Number.isNaN(v)).sort((a, b) => a - b);
  const load = loads.length ? `load1 ${loads[0].toFixed(1)}-${loads[loads.length - 1].toFixed(1)} med ${loads[Math.floor(loads.length / 2)].toFixed(1)}` : "load1 not logged";
  console.log(`## ${label} [${instrument}] ${load}`);
  const med = (a) => { const t = [...a].sort((x, y) => x - y); const n = t.length; return n % 2 ? t[(n - 1) / 2] : (t[n / 2 - 1] + t[n / 2]) / 2; };
  const arms = [...new Set(base.map((r) => r.cond))];
  console.log("   arm medians (scored rounds): " + arms.map((c) => {
    const rs = base.filter((r) => r.cond === c);
    const w = rs.map((r) => r.wall).filter((v) => !Number.isNaN(v));
    return `${c} n=${rs.length} cpu ${med(rs.map((r) => r.cpu)).toFixed(3)}` + (w.length ? ` wall ${med(w).toFixed(3)}` : "");
  }).join(" | "));
  for (const field of ["cpu", "wall"]) {
    if (rows.every((r) => Number.isNaN(r[field]))) continue;
    let line = `   ${field.padEnd(4)}`;
    if (nullPair !== "-") {
      const [nx, ny] = nullPair.split("-");
      const ns = stats(deltas(rows, nx, ny, field));
      line += ` null ${nx}-${ny} n=${ns.n} med ${f(ns.med)} s sign+ ${ns.pos}/${ns.n} k=${ns.k} ${f(ns.lo)}..${f(ns.hi)} R=${ns.R.toFixed(3)} s (cov ${(ns.cov * 100).toFixed(1)} %)`;
      if (field === "cpu") line += ` = ${((ns.R / baseMed) * 100).toFixed(2)} % of ~${baseMed.toFixed(2)} s`;
    } else line += " no identity twin in this set";
    if (treatPair && treatPair !== "-") {
      const [tx, ty] = treatPair.split("-");
      const ts = stats(deltas(rows, tx, ty, field));
      line += `  | treat ${tx}-${ty} med ${f(ts.med)} s ${f(ts.lo)}..${f(ts.hi)}`;
    }
    console.log(line);
  }
}
