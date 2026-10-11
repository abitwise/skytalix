// ABC-150 D1/D2 analysis, as METHOD.md declares. Reads d-pairs.summary.tsv (and c3-control.tsv if present).
// Usage: node analyze.mjs <dir holding the tsv files>
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const dir = process.argv[2];
const rows = (f) => {
  const [h, ...r] = readFileSync(f, "utf8").trim().split("\n").map((l) => l.split("\t"));
  return r.map((c) => Object.fromEntries(h.map((k, i) => [k, c[i]])));
};
const med = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const f3 = (x) => x.toFixed(3);
const pct = (x) => `${(100 * x).toFixed(1)} %`;
const all = rows(join(dir, "d-pairs.summary.tsv"));
const cands = [...new Set(all.map((r) => r.cand))];
const works = [...new Set(all.map((r) => r.work))];
const cell = {};
for (const c of cands)
  for (const w of works) {
    const rs = all.filter((r) => r.cand === c && r.work === w);
    const u = rs.filter((r) => r.usable === "yes");
    const ratios = u.map((r) => Number(r.ratio));
    const colds = u.map((r) => Number(r.cold_ratio));
    cell[`${c}.${w}`] = {
      n: u.length,
      recorded: rs.length,
      void: rs.filter((r) => r.digest_equal !== "yes").length,
      med: ratios.length ? med(ratios) : NaN,
      min: Math.min(...ratios),
      max: Math.max(...ratios),
      cold: colds.length ? med(colds) : NaN,
      load: [Math.min(...u.map((r) => Number(r.max_load1))), Math.max(...u.map((r) => Number(r.max_load1)))],
      therm: [...new Set(u.flatMap((r) => r.therm.split("/")))].sort().join(","),
    };
  }
console.log("## D1 (base) and D2: ratio vitest / node, median (min-max), usable pairs");
for (const c of cands)
  for (const w of works) {
    const x = cell[`${c}.${w}`];
    console.log(`${c}\t${w}\tn=${x.n}/${x.recorded}\tvoid=${x.void}\t${f3(x.med)} (${f3(x.min)}-${f3(x.max)})\tcold ${f3(x.cold)}\tload1 ${x.load[0]}-${x.load[1]}\ttherm ${x.therm}`);
  }
const minES = Math.min(cell["base.E"].min, cell["base.S"].min);
console.log(`\n## D1 stop rule: lowest base pair on E or S = ${f3(minES)} -> ${minES < 1.67 ? "STOP (below 1.67x), back to BA/PM" : "continue (>= 1.67x)"}`);
console.log("\n## D2: share of the excess removed = (r_base - r_cand) / (r_base - 1), r_base = D1 median; [range from the candidate's max..min]");
for (const c of cands.filter((c) => c !== "base")) {
  const sh = {};
  const parts = works.map((w) => {
    const b = cell[`base.${w}`].med;
    const x = cell[`${c}.${w}`];
    sh[w] = (b - x.med) / (b - 1);
    return `${w} ${pct(sh[w])} [${pct((b - x.max) / (b - 1))}..${pct((b - x.min) / (b - 1))}]`;
  });
  const explains = sh.E >= 0.5 && sh.S >= 0.5;
  console.log(`${c}\t${parts.join("\t")}\t-> ${explains ? "EXPLAINS (>= 50 % on E and S)" : "does not explain"}`);
}
const ctl = join(dir, "c3-control.tsv");
if (existsSync(ctl)) {
  console.log("\n## C3 control (supplementary): plain node, bundle / src, median (min-max), usable pairs");
  const cr = rows(ctl).filter((r) => r.usable === "yes");
  for (const w of works) {
    const r = cr.filter((x) => x.work === w).map((x) => Number(x.ratio));
    if (r.length) console.log(`${w}\tn=${r.length}\t${f3(med(r))} (${f3(Math.min(...r))}-${f3(Math.max(...r))})`);
  }
}
