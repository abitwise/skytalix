// qe-ABC-250 pre-run grader cases (synthetic analysis lines; no timing). usage: node test/grade-cases.mjs <tmpDir>
import { execFileSync } from "node:child_process"; import { writeFileSync } from "node:fs"; import { join } from "node:path";
const dir = process.argv[2]; const G = new URL("../grade.mjs", import.meta.url).pathname;
const L = (kind, board, { r = 1.3, pm = r, sB = 2, sH = 2, vl = false, tag = "main", tc = 70 } = {}) => {
  const bars = kind === "perft" ? [1.25, 1.1] : [0.98];
  return { key: `${tag}|${board}`, kind, board, counted: vl ? 3 : 5, attempts: 6, discarded: 1, voidLoad: vl, shared: false, ratioExact: r, ratio: r,
    pairMedianExact: pm, pairMedian: pm, agree: !vl && bars.every((b) => (r >= b) === (pm >= b)), B: { median: 1, spreadExact: sB, spreadPct: sB },
    H: { median: r, spreadExact: sH, spreadPct: sH }, tctlAfterMedian: tc, foreignCoresMaxCounted: 0.3 };
};
let fails = 0;
const run = (kind, name, main, rerun, want) => {
  const m = join(dir, `${kind}-${name}-m.jsonl`); writeFileSync(m, main.map((x) => JSON.stringify(x)).join("\n"));
  const args = [G, kind, m]; if (rerun) { const r = join(dir, `${kind}-${name}-r.jsonl`); writeFileSync(r, rerun.map((x) => JSON.stringify(x)).join("\n")); args.push(r); }
  const g = JSON.parse(execFileSync("node", args, { encoding: "utf8" }));
  if (g.result !== want) fails++;
  console.log(g.result === want ? "ok  " : "FAIL", kind, name, "→", g.result);
};
const P = (b, o) => L("perft", b, o); const I = ["position-3", "position-4", "position-5"].map((b) => P(b, { r: 1.0, sB: 9 }));
run("perft", "go", [P("kiwipete"), P("position-6"), P("start", { r: 1.0 }), ...I], null, "GO");
run("perft", "go-edge", [P("kiwipete", { r: 1.25 }), P("position-6", { r: 1.25 }), P("start", { r: 1.0 }), ...I], null, "GO");
run("perft", "hold", [P("kiwipete", { r: 1.3 }), P("position-6", { r: 1.2 }), P("start", { r: 1.0 }), ...I], null, "HOLD");
run("perft", "hold-edge", [P("kiwipete", { r: 1.1 }), P("position-6", { r: 1.1 }), P("start", { r: 1.0 }), ...I], null, "HOLD");
run("perft", "nogo", [P("kiwipete", { r: 1.3 }), P("position-6", { r: 1.09 }), P("start", { r: 1.05 }), ...I], null, "NO-GO");
run("perft", "spread-owed", [P("kiwipete", { sH: 5.01 }), P("position-6"), P("start"), ...I], null, "RERUN-OWED kiwipete");
run("perft", "spread-5.0-ok", [P("kiwipete", { sB: 5.0 }), P("position-6"), P("start"), ...I], null, "GO");
run("perft", "disagree-owed", [P("kiwipete", { r: 1.26, pm: 1.24 }), P("position-6"), P("start"), ...I], null, "RERUN-OWED kiwipete");
run("perft", "disagree-110", [P("kiwipete"), P("position-6", { r: 1.11, pm: 1.09 }), P("start"), ...I], null, "RERUN-OWED position-6");
run("perft", "info-ignored", [P("kiwipete"), P("position-6"), P("start"), P("position-3", { vl: true }), P("position-4", { sH: 30 }), P("position-5", { r: 0.5 })], null, "GO");
run("perft", "rerun-fixes", [P("kiwipete", { sH: 7 }), P("position-6"), P("start", { r: 1.0 }), ...I], [P("kiwipete", { tag: "rerun", r: 1.13 })], "HOLD");
run("perft", "rerun-void", [P("kiwipete", { sH: 7 }), P("position-6"), P("start"), ...I], [P("kiwipete", { tag: "rerun", sB: 6 })], "UNRESOLVED (kiwipete VOID)");
run("perft", "voidload", [P("kiwipete", { vl: true }), P("position-6"), P("start"), ...I], null, "UNRESOLVED (kiwipete VOID-LOAD)");
run("perft", "voidload-not-miss", [P("kiwipete", { r: 1.0 }), P("position-6", { r: 1.0 }), P("start", { vl: true }), ...I], null, "UNRESOLVED (start VOID-LOAD)");
run("perft", "thermal", [P("kiwipete", { tc: 86 }), P("position-6"), P("start"), ...I], null, "UNRESOLVED (thermal STOP)");
const S = (b, o) => L("search", b, { r: 1.0, ...o });
run("search", "met", [S("kiwipete"), S("position-6"), S("start")], null, "MET");
run("search", "met-edge", [S("kiwipete", { r: 0.98 }), S("position-6"), S("start")], null, "MET");
run("search", "miss", [S("kiwipete", { r: 0.979 }), S("position-6"), S("start")], null, "NOT-MET");
run("search", "disagree", [S("kiwipete", { r: 0.985, pm: 0.975 }), S("position-6"), S("start")], null, "RERUN-OWED kiwipete");
run("search", "voidload", [S("kiwipete"), S("position-6", { vl: true }), S("start")], null, "UNRESOLVED (position-6 VOID-LOAD)");
console.log(fails === 0 ? "ALL OK" : `${fails} FAILED`);
