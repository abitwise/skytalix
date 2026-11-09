// qe-ABC-298 SG3 grader (ADR-0077 d7) under ADR-0055 D3-V2: qe-ABC-254-a4v2's grade.mjs with the lines marked 298
// changed: three boards, d7's bar, no in-check guard, and a SHARED read is not graded. Mechanical; no hand grading.
// usage: node grade.mjs <analysis-main.jsonl> [analysis-rerun.jsonl]
// Per board, the re-run's reading replaces the main one when it exists.
//   VOID-LOAD (< 5 counted pairs at the 15-attempt cap) → VOID-LOAD, in either schedule; no re-run is owed for it.
//   Spread (unrounded) > 5 % on either build, OR the agreement guard fails → in main: RERUN-OWED; in the re-run: VOID.
//   Otherwise valid.
// SG3: any RERUN-OWED → RERUN-OWED. 298: any board SHARED (a gate passed the cap) → UNRESOLVED (SHARED). Any board not
// valid → UNRESOLVED. Thermal: median after-run Tctl of a board's counted runs > 85 → UNRESOLVED (thermal STOP).
// Else, 298: MET when head ÷ base is >= 1.03 on at least two of kiwipete, position-6, start and >= 1.00 on the third
// (unrounded); else NOT-MET (bar).
import { existsSync, readFileSync } from "node:fs";
const load = (f) => (f && existsSync(f) ? readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
const [mainF, rerunF] = process.argv.slice(2);
const pick = (rows) => Object.fromEntries(rows.filter((r) => r.key).map((r) => [r.board, r]));
const M = pick(load(mainF)); const R = pick(load(rerunF));
const out = {}; const owed = [];
const all = ["kiwipete", "position-6", "start"]; // 298
for (const b of all) {
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
const shared = all.some((b) => out[b].shared);
let sg3;
if (owed.length) sg3 = `RERUN-OWED ${owed.join(",")}`;
else if (shared) sg3 = "UNRESOLVED (SHARED)"; // 298
else if (all.some((b) => out[b].thermalStop)) sg3 = "UNRESOLVED (thermal STOP)";
else if (all.some((b) => out[b].status !== "valid")) {
  sg3 = `UNRESOLVED (${all.filter((b) => out[b].status !== "valid").map((b) => `${b} ${out[b].status}`).join(", ")})`;
} else {
  const r = all.map((b) => out[b].ratioExact).sort((p, q) => q - p); // 298
  sg3 = r[0] >= 1.03 && r[1] >= 1.03 && r[2] >= 1.0 ? "MET" : "NOT-MET (bar)";
}
const verdict = sg3 === "MET" ? "MET" : sg3.startsWith("NOT-MET") ? "NOT-MET (F4)" : sg3.startsWith("UNRESOLVED") ? "UNRESOLVED (not a miss)" : "PENDING";
console.log(JSON.stringify({ sg3, verdict, owed, shared, boards: out }, null, 1));
