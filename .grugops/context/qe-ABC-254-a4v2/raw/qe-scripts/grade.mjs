// qe-ABC-254-a4v2 A4 grader under ADR-0055 D3-V2: mechanical, as pre-registered; no hand grading.
// usage: node grade.mjs <analysis-main.jsonl> [analysis-rerun.jsonl]
// Per board, the re-run's reading replaces the main one when it exists.
//   VOID-LOAD (< 5 counted pairs at the 15-attempt cap) → VOID-LOAD, in either schedule; no re-run is owed for it.
//   Spread (unrounded) > 5 % on either build, OR the agreement guard fails → in main: RERUN-OWED; in the re-run: VOID.
//   Otherwise valid.
// A4: any RERUN-OWED → RERUN-OWED. Any board not valid → UNRESOLVED. Thermal: median after-run Tctl of a board's counted
// runs > 85 → UNRESOLVED (thermal STOP). Else bar: >= 1.10 on two of kiwipete/position-6/start and >= 1.00 on the third;
// position-4 >= 0.97 → MET; else NOT-MET (bar) or NOT-MET (in-check guard).
import { existsSync, readFileSync } from "node:fs";
const load = (f) => (f && existsSync(f) ? readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
const [mainF, rerunF] = process.argv.slice(2);
const pick = (rows) => Object.fromEntries(rows.filter((r) => r.key).map((r) => [r.board, r]));
const M = pick(load(mainF)); const R = pick(load(rerunF));
const out = {}; const owed = [];
for (const b of ["kiwipete", "position-6", "start", "position-4"]) {
  const x = R[b] ?? M[b]; if (!x) { out[b] = { status: "MISSING" }; continue; }
  const over = !(x.B.spreadExact <= 5) || !(x.H.spreadExact <= 5);
  const status = x.voidLoad ? "VOID-LOAD" : !(over || !x.agree) ? "valid" : R[b] ? "VOID" : "RERUN-OWED";
  if (status === "RERUN-OWED") owed.push(b);
  out[b] = { from: R[b] ? "rerun" : "main", status, ratio: x.ratio, ratioExact: x.ratioExact, pairMedian: x.pairMedian,
    pairMedianExact: x.pairMedianExact, agree: x.agree, spreadB: x.B.spreadPct, spreadH: x.H.spreadPct, overSpread: over,
    counted: x.counted, attempts: x.attempts, discarded: x.discarded, B: x.B.median, H: x.H.median,
    foreignCoresMaxCounted: x.foreignCoresMaxCounted, tctlAfterMedian: x.tctlAfterMedian, shared: x.shared,
    thermalStop: x.tctlAfterMedian > 85 };
}
const mains = ["kiwipete", "position-6", "start"]; const all = [...mains, "position-4"];
let a4;
if (owed.length) a4 = `RERUN-OWED ${owed.join(",")}`;
else if (all.some((b) => out[b].thermalStop)) a4 = "UNRESOLVED (thermal STOP)";
else if (all.some((b) => out[b].status !== "valid")) {
  a4 = `UNRESOLVED (${all.filter((b) => out[b].status !== "valid").map((b) => `${b} ${out[b].status}`).join(", ")})`;
} else {
  const r = mains.map((b) => out[b].ratioExact).sort((p, q) => q - p);
  const barMain = r[0] >= 1.1 && r[1] >= 1.1 && r[2] >= 1.0; const guard = out["position-4"].ratioExact >= 0.97;
  a4 = barMain && guard ? "MET" : !barMain ? "NOT-MET (bar)" : "NOT-MET (in-check guard)";
}
const shared = all.some((b) => out[b].shared);
const nearBar = shared ? all.filter((b) => out[b].ratioExact !== undefined &&
  (b === "position-4" ? [0.97] : [1.1, 1.0]).some((bar) => Math.abs(out[b].ratioExact - bar) <= 0.03)) : [];
const verdict = a4 === "MET" ? "PASS_WITH_GAPS" : a4.startsWith("NOT-MET") ? "FAIL" : a4.startsWith("UNRESOLVED") ? "UNRESOLVED" : "PENDING";
console.log(JSON.stringify({ a4, verdict, owed, shared, sharedNearBar: nearBar, boards: out }, null, 1));
