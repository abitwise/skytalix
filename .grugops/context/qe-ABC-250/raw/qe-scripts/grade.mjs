// qe-ABC-250 grader under ADR-0055 D3-V2: mechanical, as pre-registered; no hand grading. Built from qe-ABC-254-a4v2's
// grade.mjs (sha256 9d74bc7b59046c24); the bars and the decision are ABC-250's (Q250).
// usage: node grade.mjs <perft|search> <analysis-main.jsonl> [analysis-rerun.jsonl]
// Per board, the re-run's reading replaces the main one when it exists.
//   VOID-LOAD (< 5 counted pairs at the 15-attempt cap) → VOID-LOAD, in either schedule; no re-run is owed for it.
//   Spread (unrounded) > 5 % on either build, OR the agreement guard fails → in main: RERUN-OWED; in the re-run: VOID.
//   Otherwise valid. Thermal: median after-run Tctl of a board's counted runs > 85 → thermal STOP.
// perft (A4): graded boards kiwipete, position-6, start; position-3/4/5 are INFO (never owed, never graded).
//   Any graded RERUN-OWED → RERUN-OWED. Thermal → UNRESOLVED (thermal STOP). Any graded board not valid → UNRESOLVED.
//   Else r2 = the second-highest of the three ratios (so "on at least two of the three boards"):
//   r2 >= 1.25 → GO; 1.10 <= r2 < 1.25 → HOLD; r2 < 1.10 → NO-GO.
// search (A5): boards kiwipete, position-6, start, all graded. Same validity. Every ratio >= 0.98 → MET, else NOT-MET.
import { existsSync, readFileSync } from "node:fs";
const load = (f) => (f && existsSync(f) ? readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
const [kind, mainF, rerunF] = process.argv.slice(2);
if (kind !== "perft" && kind !== "search") throw new Error("kind");
const pick = (rows) => Object.fromEntries(rows.filter((r) => r.key).map((r) => [r.board, r]));
const M = pick(load(mainF)); const R = pick(load(rerunF));
const GRADED = ["kiwipete", "position-6", "start"];
const INFO = kind === "perft" ? ["position-3", "position-4", "position-5"] : [];
const out = {}; const owed = [];
for (const b of [...GRADED, ...INFO]) {
  const x = R[b] ?? M[b]; if (!x) { out[b] = { status: "MISSING" }; continue; }
  const over = !(x.B.spreadExact <= 5) || !(x.H.spreadExact <= 5);
  let status = x.voidLoad ? "VOID-LOAD" : !(over || !x.agree) ? "valid" : R[b] ? "VOID" : "RERUN-OWED";
  if (INFO.includes(b) && status === "RERUN-OWED") status = "INFO-not-valid"; // INFO boards are never re-run
  if (status === "RERUN-OWED") owed.push(b);
  out[b] = { info: INFO.includes(b), from: R[b] ? "rerun" : "main", status, ratio: x.ratio, ratioExact: x.ratioExact, pairMedian: x.pairMedian,
    pairMedianExact: x.pairMedianExact, agree: x.agree, spreadB: x.B.spreadPct, spreadH: x.H.spreadPct, overSpread: over,
    counted: x.counted, attempts: x.attempts, discarded: x.discarded, B: x.B.median, H: x.H.median,
    firstCallRatioInfo: x.firstCallRatioInfo, foreignCoresMaxCounted: x.foreignCoresMaxCounted, tctlAfterMedian: x.tctlAfterMedian,
    shared: x.shared, thermalStop: x.tctlAfterMedian > 85 };
}
let result;
if (owed.length) result = `RERUN-OWED ${owed.join(",")}`;
else if (GRADED.some((b) => out[b].thermalStop)) result = "UNRESOLVED (thermal STOP)";
else if (GRADED.some((b) => out[b].status !== "valid")) {
  result = `UNRESOLVED (${GRADED.filter((b) => out[b].status !== "valid").map((b) => `${b} ${out[b].status}`).join(", ")})`;
} else if (kind === "perft") {
  const r = GRADED.map((b) => out[b].ratioExact).sort((p, q) => q - p);
  result = r[1] >= 1.25 ? "GO" : r[1] >= 1.1 ? "HOLD" : "NO-GO";
} else {
  result = GRADED.every((b) => out[b].ratioExact >= 0.98) ? "MET" : "NOT-MET";
}
const shared = GRADED.some((b) => out[b].shared);
const bars = kind === "perft" ? [1.25, 1.1] : [0.98];
const sharedNearBar = shared ? GRADED.filter((b) => out[b].ratioExact !== undefined && bars.some((bar) => Math.abs(out[b].ratioExact - bar) <= 0.03)) : [];
console.log(JSON.stringify({ kind, result, owed, shared, sharedNearBar, boards: out }, null, 1));
