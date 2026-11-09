// qe-ABC-298 pre-run grader cases for SG3 (synthetic analysis lines; no search, no timing). From qe-ABC-254-a4v2's
// grade-cases.mjs, re-cut to ADR-0077 d7: three boards, 1.03 on two and 1.00 on the third, guard bars 1.03 and 1.00.
// usage: node test/grade-cases.mjs <tmpDir>
import { execFileSync } from "node:child_process"; import { writeFileSync } from "node:fs"; import { join } from "node:path";
const dir = process.argv[2]; const G = new URL("../grade.mjs", import.meta.url).pathname;
const L = (board, { r = 1.05, pm = r, sB = 2, sH = 2, vl = false, tag = "main", tc = 70, sh = false } = {}) => {
  const bars = [1.03, 1.0];
  return { key: `${tag}|${board}`, board, counted: vl ? 3 : 5, attempts: 6, discarded: 1, voidLoad: vl, shared: sh, ratioExact: r, ratio: r,
    pairMedianExact: pm, pairMedian: pm, agree: !vl && bars.every((b) => (r >= b) === (pm >= b)), B: { median: 1, spreadExact: sB, spreadPct: sB },
    H: { median: r, spreadExact: sH, spreadPct: sH }, tctlAfterMedian: tc, foreignCoresMaxCounted: 0.3 };
};
let bad = 0;
const run = (name, main, rerun, want) => {
  const m = join(dir, `${name}-m.jsonl`); writeFileSync(m, main.map((x) => JSON.stringify(x)).join("\n"));
  const args = [G, m]; if (rerun) { const r = join(dir, `${name}-r.jsonl`); writeFileSync(r, rerun.map((x) => JSON.stringify(x)).join("\n")); args.push(r); }
  const g = JSON.parse(execFileSync(process.execPath, args, { encoding: "utf8" }));
  if (g.sg3 !== want) bad++;
  console.log(g.sg3 === want ? "ok  " : "FAIL", name, "→", g.sg3, "|", g.verdict);
};
const K = "kiwipete", P = "position-6", S = "start";
run("met", [L(K), L(P), L(S)], null, "MET");
run("met-edge", [L(K, { r: 1.03 }), L(P, { r: 1.03 }), L(S, { r: 1.0 })], null, "MET");
run("met-third-high", [L(K, { r: 1.0 }), L(P, { r: 1.04 }), L(S, { r: 1.08 })], null, "MET");
run("bar-miss-one-above", [L(K, { r: 1.05 }), L(P, { r: 1.029 }), L(S, { r: 1.02 })], null, "NOT-MET (bar)");
run("third-below-1", [L(K), L(P), L(S, { r: 0.999 })], null, "NOT-MET (bar)");
run("spread-owed", [L(K, { sH: 5.01 }), L(P), L(S)], null, "RERUN-OWED kiwipete");
run("spread-5.0-ok", [L(K, { sB: 5.0 }), L(P), L(S)], null, "MET");
run("disagree-1.03-owed", [L(K, { r: 1.031, pm: 1.029 }), L(P), L(S)], null, "RERUN-OWED kiwipete");
run("disagree-1.00-owed", [L(K), L(P), L(S, { r: 1.001, pm: 0.999 })], null, "RERUN-OWED start");
run("rerun-fixes", [L(K, { sH: 7 }), L(P), L(S)], [L(K, { tag: "rerun", r: 1.06 })], "MET");
run("rerun-void", [L(K, { sH: 7 }), L(P), L(S)], [L(K, { tag: "rerun", sB: 6 })], "UNRESOLVED (kiwipete VOID)");
run("rerun-disagree-void", [L(K, { sH: 7 }), L(P), L(S)], [L(K, { tag: "rerun", r: 1.032, pm: 1.028 })], "UNRESOLVED (kiwipete VOID)");
run("voidload-main", [L(K, { vl: true }), L(P), L(S)], null, "UNRESOLVED (kiwipete VOID-LOAD)");
run("voidload-rerun", [L(K, { sH: 7 }), L(P), L(S)], [L(K, { tag: "rerun", vl: true })], "UNRESOLVED (kiwipete VOID-LOAD)");
run("voidload-not-a-miss", [L(K, { vl: true }), L(P, { r: 0.9 }), L(S, { r: 0.9 })], null, "UNRESOLVED (kiwipete VOID-LOAD)");
run("shared", [L(K, { sh: true }), L(P), L(S)], null, "UNRESOLVED (SHARED)");
run("thermal", [L(K, { tc: 86 }), L(P), L(S)], null, "UNRESOLVED (thermal STOP)");
console.log(bad === 0 ? "all cases ok" : `${bad} FAILED`);
process.exit(bad === 0 ? 0 : 1);
