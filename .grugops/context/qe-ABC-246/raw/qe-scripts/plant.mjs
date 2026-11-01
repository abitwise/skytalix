// qe-ABC-246 PLANTS (PREREG section 3). Plant strings VERBATIM from qe-ABC-221 raw/qe-scripts/plant.mjs (SHARE -> HSCM,
// MT -> CLOCKWINSCM). Each is ONE exact edit of src/uci-session.ts, asserted to occur exactly once, applied to a SCRATCH
// tree P (hard-link copy of <tree> with a REAL src/), never the worktree. WHOLE default lane per plant, vitest via node
// (never npx), json reporter, NODE_OPTIONS=--max-old-space-size=128. The file is restored after every plant and cmp'd.
// usage: node plant.mjs <tree H|B> <P scratch dir> <outDir> <label> <ids comma-separated>
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [T, P, out, label, idsArg] = process.argv.slice(2);
rmSync(P, { recursive: true, force: true });
execFileSync("cp", ["-al", T, P]);
rmSync(join(P, "src"), { recursive: true, force: true });
cpSync(join(T, "src"), join(P, "src"), { recursive: true });
const SESSION = "src/uci-session.ts";
const one = (from, to) => (s) => { const p = s.split(from); if (p.length !== 2) throw new Error(`occurs ${p.length - 1}x: ${from}`); return p.join(to); };
const SHARE = "budget = Math.min(cap, safeClockShare(time, increment, movesToGo));";
const MT = "if (clock.movetime !== undefined) budget = Math.min(clock.movetime, cap);";
const PLANTS = {
  none: (s) => s,
  HSCM: one(SHARE, 'budget = Math.min(cap, timeMode === "uci-clock-mode" ? Math.max(1, (time - CLOCK_RESERVE_MS - movesToGo * CLOCK_OVERHEAD_MS) / movesToGo + increment) : safeClockShare(time, increment, movesToGo));'),
  CLOCKWINSCM: one(MT, 'if (clock.movetime !== undefined && (timeMode !== "uci-clock-mode" || time === undefined)) budget = Math.min(clock.movetime, cap);'),
};
const orig = readFileSync(join(P, SESSION), "utf8");
const summary = [];
try {
  for (const id of idsArg.split(",")) {
    const m = PLANTS[id](orig);
    if (id !== "none" && m === orig) throw new Error(`${id} no change`);
    writeFileSync(join(P, SESSION), m);
    const json = join(out, `plant-${label}-${id}.json`);
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [join(P, "node_modules/vitest/vitest.mjs"), "run", "--reporter=json", `--outputFile.json=${json}`], { cwd: P, encoding: "utf8", maxBuffer: 64 << 20, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" } });
    writeFileSync(join(P, SESSION), orig);
    const j = JSON.parse(readFileSync(json, "utf8"));
    const red = [];
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") red.push(`${f.name.split("/src/")[1] ?? f.name} :: ${a.fullName} :: ${(a.failureMessages?.[0] ?? "").split("\n").slice(0, 6).join(" ").replace(/\s+/g, " ").slice(0, 300)}`);
    const line = `${label} ${id} rc=${r.status} files=${j.testResults.length} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} skipped=${j.numPendingTests + j.numTodoTests} wall=${((Date.now() - t0) / 1000).toFixed(1)}s`;
    const text = `${line}\n${red.map((x) => `  RED ${x}`).join("\n")}`;
    writeFileSync(join(out, `plant-${label}-${id}.red.txt`), `${text}\n`);
    summary.push(text); console.log(text);
  }
} finally { writeFileSync(join(P, SESSION), orig); }
execFileSync("cmp", [join(T, SESSION), join(P, SESSION)]);
writeFileSync(join(out, `plants-summary-${label}.txt`), `${summary.join("\n")}\nrestored: cmp ${label} P ${SESSION} equal\n`);
