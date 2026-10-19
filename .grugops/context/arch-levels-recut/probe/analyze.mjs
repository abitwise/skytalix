// Architect/Design probe analysis, subtask arch-levels-recut. Pure arithmetic over raw/*.jsonl.txt.
// Usage (from this directory): node analyze.mjs sweep raw/sweep-step4.jsonl.txt [raw/check-step4.jsonl.txt]
//                              node analyze.mjs gap raw/blunder-gap-b<budget>-step4.jsonl.txt
import { readFileSync } from "node:fs";

const lines = (f) =>
  readFileSync(f, "utf8").split("\n").filter((l) => l.startsWith("{")).map((l) => JSON.parse(l));
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const q = (a, p) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))];

// The sweep's rule (depth-ladder.mjs header): iteration k completes at budget b, step s iff (T_k - 3) * s < b.
const at = (row, b) => {
  let best = row.iters[0];
  for (const it of row.iters) if ((it.T - 3) * row.step < b) best = it;
  return best;
};

const mode = process.argv[2];
if (mode === "sweep") {
  const rows = lines(process.argv[3]);
  const budgets = [40, 50, 100, 150, 170, 180, 220, 300, 330, 500, 700, 1000, 1500, 1700, 2000, 3000, 4000, 4500, 5000];
  const out = { positions: rows.length, step: rows[0].step };
  out.kCapped = rows.filter((r) => r.iters.length === 40).map((r) => r.name);
  out.depthByBudget = Object.fromEntries(
    budgets.map((b) => {
      const d = rows.map((r) => at(r, b).k);
      return [b, { median: median(d), min: Math.min(...d), max: Math.max(...d) }];
    }),
  );
  // Cost of one more ply: reads to finish iteration k+1 over reads to finish k, for k with >= 25 reads.
  const ratios = [];
  for (const r of rows)
    for (let i = 0; i + 1 < r.iters.length; i++) {
      const [a, b] = [r.iters[i].T - 3, r.iters[i + 1].T - 3];
      if (a >= 25 && r.iters[i + 1].k <= 12) ratios.push(b / a);
    }
  out.plyCost = {
    samples: ratios.length,
    p25: +q(ratios, 0.25).toFixed(2),
    median: +median(ratios).toFixed(2),
    p75: +q(ratios, 0.75).toFixed(2),
  };
  const pairs = [
    ["today 3v4", 3000, 4000], ["today 4v5", 4000, 4500], ["today 3v5", 3000, 4500],
    ["3000 v 5000", 3000, 5000],
    ["T 3v4 (500 v 1500)", 500, 1500], ["T 4v5 (1500 v 4500)", 1500, 4500],
    ["T 2v3 time (220 v 500)", 220, 500], ["T 1v2 time (100 v 220)", 100, 220],
    ["today 2v3 time (500 v 3000)", 500, 3000], ["today 1v2 time (100 v 500)", 100, 500],
    ["1000 v 3000", 1000, 3000], ["700 v 2000", 700, 2000], ["1500 v 3000", 1500, 3000],
    ["P 2v3 time (500 v 500)", 500, 500],
    ["S 4v5 (1000 v 3000)", 1000, 3000], ["S 3v4 (330 v 1000)", 330, 1000],
    ["S 2v3 (180 v 330)", 180, 330], ["S 1v2 (100 v 180)", 100, 180], ["S 1v5 (100 v 3000)", 100, 3000],
  ];
  out.pairs = pairs.map(([label, a, b]) => {
    let deeper = 0, sameDepth = 0, shallower = 0, moveDiffers = 0;
    for (const r of rows) {
      const [x, y] = [at(r, a), at(r, b)];
      if (y.k > x.k) deeper++; else if (y.k === x.k) sameDepth++; else shallower++;
      if (y.move !== x.move) moveDiffers++;
    }
    const plies = rows.map((r) => at(r, b).k - at(r, a).k);
    return { label, budgets: [a, b], ratio: +(b / a).toFixed(2), strongerDeeper: deeper, sameDepth, shallower,
      moveDiffers, meanPlyGain: +(plies.reduce((s, x) => s + x, 0) / rows.length).toFixed(2) };
  });
  if (process.argv[4]) {
    // Direct chooseMove at named budgets against the sweep's prediction.
    const byName = new Map(rows.map((r) => [r.name, r]));
    let agree = 0, total = 0;
    const faults = [];
    for (const c of lines(process.argv[4])) {
      const p = at(byName.get(c.name), c.b);
      total++;
      if (p.k === c.depth && p.move === c.move) agree++;
      else faults.push({ name: c.name, b: c.b, predicted: [p.k, p.move], direct: [c.depth, c.move] });
    }
    out.check = { total, agree, faults };
  }
  console.log(JSON.stringify(out, null, 1));
} else if (mode === "gap") {
  const rows = lines(process.argv[3]);
  const gaps = rows.filter((r) => r.kind === "blunder").map((r) => r.gap);
  console.log(JSON.stringify({
    budgetMs: rows[0].budgetMs, step: rows[0].step, positions: rows.length,
    kinds: rows.reduce((m, r) => ({ ...m, [r.kind]: (m[r.kind] ?? 0) + 1 }), {}),
    gapCp: { p25: q(gaps, 0.25), median: median(gaps), p75: q(gaps, 0.75), max: Math.max(...gaps) },
    gapAtLeast50: gaps.filter((g) => g >= 50).length, gapAtLeast100: gaps.filter((g) => g >= 100).length,
    gapAtLeast300: gaps.filter((g) => g >= 300).length, medianDepth: median(rows.map((r) => r.depth)),
  }));
}
