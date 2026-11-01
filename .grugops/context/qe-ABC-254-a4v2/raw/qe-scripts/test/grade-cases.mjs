// qe-ABC-254-a4v2 pre-run grader cases (synthetic analysis lines; no timing). usage: node test/grade-cases.mjs <tmpDir>
import { execFileSync } from "node:child_process"; import { writeFileSync } from "node:fs"; import { join } from "node:path";
const dir = process.argv[2]; const G = new URL("../grade.mjs", import.meta.url).pathname;
const L = (board, { r = 1.12, pm = r, sB = 2, sH = 2, vl = false, tag = "main", tc = 70 } = {}) => {
  const bars = board === "position-4" ? [0.97] : [1.1, 1.0];
  return { key: `${tag}|${board}`, board, counted: vl ? 3 : 5, attempts: 6, discarded: 1, voidLoad: vl, shared: false, ratioExact: r, ratio: r,
    pairMedianExact: pm, pairMedian: pm, agree: !vl && bars.every((b) => (r >= b) === (pm >= b)), B: { median: 1, spreadExact: sB, spreadPct: sB },
    H: { median: r, spreadExact: sH, spreadPct: sH }, tctlAfterMedian: tc, foreignCoresMaxCounted: 0.3 };
};
const run = (name, main, rerun, want) => {
  const m = join(dir, `${name}-m.jsonl`); writeFileSync(m, main.map((x) => JSON.stringify(x)).join("\n"));
  const args = [G, m]; if (rerun) { const r = join(dir, `${name}-r.jsonl`); writeFileSync(r, rerun.map((x) => JSON.stringify(x)).join("\n")); args.push(r); }
  const g = JSON.parse(execFileSync("node", args, { encoding: "utf8" }));
  console.log(g.a4 === want ? "ok  " : "FAIL", name, "→", g.a4, "|", g.verdict);
};
const B = ["kiwipete", "position-6", "start"];
run("met", [...B.map((b) => L(b)), L("position-4", { r: 1.0 })], null, "MET");
run("met-edge", [L("kiwipete", { r: 1.1 }), L("position-6", { r: 1.1 }), L("start", { r: 1.0 }), L("position-4", { r: 0.97 })], null, "MET");
run("bar-miss", [L("kiwipete", { r: 1.12 }), L("position-6", { r: 1.09 }), L("start", { r: 1.09 }), L("position-4", { r: 1.0 })], null, "NOT-MET (bar)");
run("third-below-1", [L("kiwipete"), L("position-6"), L("start", { r: 0.99 }), L("position-4", { r: 1.0 })], null, "NOT-MET (bar)");
run("guard-miss", [...B.map((b) => L(b)), L("position-4", { r: 0.96 })], null, "NOT-MET (in-check guard)");
run("spread-owed", [L("kiwipete", { sH: 5.01 }), L("position-6"), L("start"), L("position-4")], null, "RERUN-OWED kiwipete");
run("spread-5.0-ok", [L("kiwipete", { sB: 5.0 }), L("position-6"), L("start"), L("position-4")], null, "MET");
run("disagree-owed", [L("kiwipete", { r: 1.11, pm: 1.09 }), L("position-6"), L("start"), L("position-4")], null, "RERUN-OWED kiwipete");
run("disagree-g", [L("kiwipete"), L("position-6"), L("start"), L("position-4", { r: 0.975, pm: 0.965 })], null, "RERUN-OWED position-4");
run("rerun-fixes", [L("kiwipete", { sH: 7 }), L("position-6"), L("start"), L("position-4")], [L("kiwipete", { tag: "rerun", r: 1.13 })], "MET");
run("rerun-void", [L("kiwipete", { sH: 7 }), L("position-6"), L("start"), L("position-4")], [L("kiwipete", { tag: "rerun", sB: 6 })], "UNRESOLVED (kiwipete VOID)");
run("rerun-disagree-void", [L("kiwipete", { sH: 7 }), L("position-6"), L("start"), L("position-4")], [L("kiwipete", { tag: "rerun", r: 1.105, pm: 1.095 })], "UNRESOLVED (kiwipete VOID)");
run("voidload-main", [L("kiwipete", { vl: true }), L("position-6"), L("start"), L("position-4")], null, "UNRESOLVED (kiwipete VOID-LOAD)");
run("voidload-rerun", [L("kiwipete", { sH: 7 }), L("position-6"), L("start"), L("position-4")], [L("kiwipete", { tag: "rerun", vl: true })], "UNRESOLVED (kiwipete VOID-LOAD)");
run("voidload-not-miss", [L("kiwipete", { r: 0.9 }), L("position-6", { r: 0.9 }), L("start", { vl: true }), L("position-4")], null, "UNRESOLVED (start VOID-LOAD)");
run("thermal", [L("kiwipete", { tc: 86 }), L("position-6"), L("start"), L("position-4")], null, "UNRESOLVED (thermal STOP)");
