// qe-ABC-254-a4 A4 grader: mechanical, as pre-registered; no hand grading. usage: node grade.mjs <analysis-main.jsonl> [analysis-rerun.jsonl]
// Per board: the re-run's reading replaces the main one when it exists. Spread (unrounded) > 5 % on either build: in main
// → re-run owed; in the re-run → VOID. Bar: >= 1.10 on two of kiwipete/position-6/start and >= 1.00 on the third;
// position-4 >= 0.97. A void main board → UNRESOLVED. Thermal: median after-run Tctl over the graded runs > 85 → STOP.
import { existsSync, readFileSync } from "node:fs";
const load = (f) => (f && existsSync(f) ? readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
const [mainF, rerunF] = process.argv.slice(2);
const pick = (rows) => Object.fromEntries(rows.filter((r) => r.key).map((r) => [r.key.split("|")[1], r]));
const M = pick(load(mainF)); const R = pick(load(rerunF));
const out = {}; let owed = [];
for (const b of ["kiwipete", "position-6", "start", "position-4"]) {
  const x = R[b] ?? M[b]; if (!x) { out[b] = { status: "MISSING" }; continue; }
  const over = x.B.spreadExact > 5 || x.H.spreadExact > 5;
  const status = !over ? "valid" : R[b] ? "VOID" : "RERUN-OWED";
  if (status === "RERUN-OWED") owed.push(b);
  out[b] = { from: R[b] ? "rerun" : "main", ratio: x.ratio, ratioExact: x.H.median / x.B.median, B: x.B.median, H: x.H.median,
    spreadB: x.B.spreadPct, spreadH: x.H.spreadPct, status, allClear: x.allClear, foreignCoresMax: x.foreignCoresMax, tctlAfterMedian: x.tctlAfterMedian };
}
const tctls = Object.values(out).filter((o) => o.tctlAfterMedian !== undefined);
const mains = ["kiwipete", "position-6", "start"];
let a4;
if (owed.length) a4 = `RERUN-OWED ${owed.join(",")}`;
else if (mains.some((b) => out[b].status !== "valid") || out["position-4"].status !== "valid") a4 = "UNRESOLVED";
else {
  const r = mains.map((b) => out[b].ratioExact).sort((p, q) => q - p);
  const barMain = r[0] >= 1.10 && r[1] >= 1.10 && r[2] >= 1.00; const guard = out["position-4"].ratioExact >= 0.97;
  a4 = barMain && guard ? "MET" : !guard ? "NOT-MET (in-check guard)" : "NOT-MET (bar)";
}
console.log(JSON.stringify({ a4, owed, boards: out, note: "thermal is read from the graded runs by analyse.mjs's tctlAfterMedianAll per file" }, null, 1));
