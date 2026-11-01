// qe-ABC-244 A8 readout, ADR-0035 D1 (twin admissibility, R at k, MET/NOT MET/UNRESOLVED at b = 0.650 s CPU).
// usage: node readout.mjs <n8.tsv>
import { readFileSync } from "node:fs";
const B_MS = 0.65;
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => { const f = l.split("\t"); return { round: +f[0], cond: f[1], wall: +f[2], cpu: +f[5], tests: +f[8], lb: +f[11], fv: +f[13], ok: f[17] === "ok" }; });
const med = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const C = (n, i) => { let v = 1; for (let j = 1; j <= i; j++) v = (v * (n - i + j)) / j; return v; };
const kOf = (n) => { let k = 1; for (let c = 2; c <= Math.floor(n / 2); c++) { let t = 0; for (let i = 0; i < c; i++) t += C(n, i); if (1 - (2 * t) / 2 ** n >= 0.92) k = c; } return k; };
const signP = (pos, n) => { const lo = Math.min(pos, n - pos); let t = 0; for (let i = 0; i <= lo; i++) t += C(n, i); return Math.min(1, (2 * t) / 2 ** n); };
const use = rows.filter((r) => r.round >= 1), bad = use.filter((r) => !r.ok).length;
const by = (c) => use.filter((r) => r.cond === c);
const paired = (c, key) => by(c).map((r) => r[key] - use.find((b) => b.round === r.round && b.cond === "B")[key]);
const iv = (d) => { const s = [...d].sort((a, b) => a - b), n = s.length, k = kOf(n); return { k, lo: s[k - 1], hi: s[n - k], R: Math.max(Math.abs(s[k - 1]), Math.abs(s[n - k])) }; };
const n = by("B").length;
console.log(`n = ${n} scored rounds (round 0 discarded), ${bad} harness errors, load1 before ${Math.min(...use.map((r) => r.lb))}..${Math.max(...use.map((r) => r.lb))}, foreign vitest on ${use.filter((r) => r.fv > 0).length} runs`);
for (const c of ["B", "T", "H"]) console.log(`${c}: cpu median ${med(by(c).map((r) => r.cpu)).toFixed(3)} s, wall median ${med(by(c).map((r) => r.wall)).toFixed(3)} s, tests ${by(c)[0]?.tests}`);
const baseCpu = med(by("B").map((r) => r.cpu));
const out = {};
for (const c of ["T", "H"]) for (const key of ["cpu", "wall"]) {
  const d = paired(c, key), st = iv(d), m = med(d), pos = d.filter((x) => x > 0).length, neg = d.filter((x) => x < 0).length;
  out[`${c}${key}`] = { m, st, pos, neg, p: signP(pos, pos + neg) };
  console.log(`${c}-B ${key}: median ${m.toFixed(3)} s, sign +${pos}/-${neg} (p ${signP(pos, pos + neg).toFixed(3)}), k ${st.k}, interval [${st.lo.toFixed(3)}, ${st.hi.toFixed(3)}], R ${st.R.toFixed(3)}`);
}
const tw = out.Tcpu, h = out.Hcpu;
const admissible = Math.abs(tw.m) <= 0.015 * baseCpu && tw.p > 0.05;
const resolves = tw.st.R <= B_MS;
const state = !admissible ? "INADMISSIBLE (no state)" : resolves && h.m <= B_MS ? "MET" : (resolves && h.m > B_MS) || h.st.lo > B_MS ? "NOT MET" : "UNRESOLVED";
const F = 0.16 * baseCpu;
console.log(`twin: |median| ${Math.abs(tw.m).toFixed(3)} s vs 1.5 % of base cpu ${(0.015 * baseCpu).toFixed(3)} s; sign p ${tw.p.toFixed(3)} -> admissible ${admissible}`);
console.log(`resolves 0.650 s: twin R ${tw.st.R.toFixed(3)} <= 0.650 -> ${resolves}`);
console.log(`charge (H-B cpu median) ${h.m.toFixed(3)} s, at most ${h.st.hi.toFixed(3)} s -> N8-LANE STATE at 650 ms CPU: ${state}`);
console.log(`F (provisional 16 % of base cpu, UNKNOWN - verify) = ${F.toFixed(3)} s; "650 ms >= F" is ${B_MS >= F}`);
