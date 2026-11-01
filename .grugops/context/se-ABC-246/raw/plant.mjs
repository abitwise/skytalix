// se-ABC-246 A3: QE's HSCM and CLOCKWINSCM (qe-ABC-221 raw/qe-scripts/plant.mjs, strings verbatim), each alone, on a
// scratch tree P (minimal real copy of the worktree H, node_modules symlinked). Runs src/uci-session.test.ts via node vitest.
// usage: node plant.mjs <H> <P> <outDir>
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [H, P, out] = process.argv.slice(2);
rmSync(P, { recursive: true, force: true });
// cross-device: a minimal REAL copy (src, tools, data, configs) with node_modules symlinked.
for (const d of ["src", "tools", "data", "package.json", "tsconfig.json", "vitest.config.ts"]) cpSync(join(H, d), join(P, d), { recursive: true });
symlinkSync(join(H, "node_modules"), join(P, "node_modules"));
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
const lines = [];
try {
  for (const [id, edit] of Object.entries(PLANTS)) {
    const m = edit(orig);
    if (id !== "none" && m === orig) throw new Error(`${id} no change`);
    writeFileSync(join(P, SESSION), m);
    const json = join(out, `plant-${id}.json`);
    const r = spawnSync(process.execPath, [join(P, "node_modules/vitest/vitest.mjs"), "run", "src/uci-session.test.ts", "--reporter=json", `--outputFile.json=${json}`], { cwd: P, encoding: "utf8", maxBuffer: 64 << 20, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" } });
    writeFileSync(join(P, SESSION), orig);
    const j = JSON.parse(readFileSync(json, "utf8"));
    const red = [];
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") red.push(a.fullName);
    lines.push(`${id} rc=${r.status} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} skipped=${j.numPendingTests + j.numTodoTests}\n${red.map((x) => `  RED ${x}`).join("\n")}`);
  }
} finally { writeFileSync(join(P, SESSION), orig); }
const h = execFileSync("cmp", [join(H, SESSION), join(P, SESSION)]).toString();
writeFileSync(join(out, "plants-summary.txt"), lines.join("\n") + `\nrestored: cmp H P ${SESSION} equal${h}\n`);
console.log("DONE");
