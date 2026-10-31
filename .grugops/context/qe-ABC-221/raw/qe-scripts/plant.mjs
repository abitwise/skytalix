// qe-ABC-221 PLANTS: QE's own mutant list (frozen in PREREG.txt before any head run). Each plant is ONE exact string edit
// of src/uci-session.ts or src/engine.ts, asserted to occur exactly once, applied to a SCRATCH tree P (a hard-link copy of
// H with src/ a REAL copy, the qe-ABC-242 method), never the worktree. Each plant runs the WHOLE default lane, vitest via
// node (never npx), json reporter, NODE_OPTIONS=--max-old-space-size=128. Restores the file after every plant.
// usage: node plant.mjs <H> <P scratch dir> <outDir> [ids=all]
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [H, P, out, idsArg] = process.argv.slice(2);
rmSync(P, { recursive: true, force: true });
execFileSync("cp", ["-al", H, P]);
rmSync(join(P, "src"), { recursive: true, force: true });
cpSync(join(H, "src"), join(P, "src"), { recursive: true });

const SESSION = "src/uci-session.ts", ENGINE = "src/engine.ts";
const one = (from, to) => (s) => {
  const parts = s.split(from);
  if (parts.length !== 2) throw new Error(`plant string occurs ${parts.length - 1} times: ${JSON.stringify(from)}`);
  return parts.join(to);
};
// The mode branch's increment line (the level branch's has `const share` after it, so this context is unique).
const INC = 'const increment = clock[blackToMove ? "binc" : "winc"] ?? 0;\n      const movesToGo';
const SHARE = "budget = Math.min(cap, safeClockShare(time, increment, movesToGo));";
const MT = "if (clock.movetime !== undefined) budget = Math.min(clock.movetime, cap);";
const PLANTS = {
  none: [SESSION, (s) => s],
  // REQUIRED by the brief: QM4 in both modes, the cap swapped between modes, the clamp left at 32 000, no-token -> 59 500.
  QM4: [SESSION, one(INC, 'const increment = clock.winc ?? 0;\n      const movesToGo')], // both modes read winc for either side
  QM4CM: [SESSION, one(INC, 'const increment = clock[blackToMove && timeMode !== "uci-clock-mode" ? "binc" : "winc"] ?? 0;\n      const movesToGo')], // uci-clock-mode only
  QM4ST: [SESSION, one(INC, 'const increment = clock[blackToMove && timeMode !== "simple-tournament" ? "binc" : "winc"] ?? 0;\n      const movesToGo')], // simple-tournament only
  CAPSWAP: [SESSION, one('timeMode === "simple-tournament" ? SIMPLE_TOURNAMENT_BUDGET_MS : CLOCK_MODE_MAX_BUDGET_MS', 'timeMode === "simple-tournament" ? CLOCK_MODE_MAX_BUDGET_MS : SIMPLE_TOURNAMENT_BUDGET_MS')],
  CLAMP32: [ENGINE, one("export const HARD_CEILING_MS = 60_000;", "export const HARD_CEILING_MS = 32_000;")],
  NOTOK59: [SESSION, one("budget = SIMPLE_TOURNAMENT_BUDGET_MS;\n    if (clock.movetime", "budget = cap;\n    if (clock.movetime")],
  // QE's own additions.
  CAP60: [SESSION, one("const CLOCK_MODE_MAX_BUDGET_MS = CLOCK_MODE_CEILING_MS - 500;", "const CLOCK_MODE_MAX_BUDGET_MS = CLOCK_MODE_CEILING_MS;")],
  CAP59: [SESSION, one("const CLOCK_MODE_MAX_BUDGET_MS = CLOCK_MODE_CEILING_MS - 500;", "const CLOCK_MODE_MAX_BUDGET_MS = CLOCK_MODE_CEILING_MS - 1_000;")],
  MTUNCAPCM: [SESSION, one(MT, 'if (clock.movetime !== undefined) budget = timeMode === "uci-clock-mode" ? clock.movetime : Math.min(clock.movetime, cap);')],
  CLOCKWINSCM: [SESSION, one(MT, 'if (clock.movetime !== undefined && (timeMode !== "uci-clock-mode" || time === undefined)) budget = Math.min(clock.movetime, cap);')],
  NOSHARECM: [SESSION, one(SHARE, 'budget = Math.min(cap, timeMode === "uci-clock-mode" ? time / movesToGo : safeClockShare(time, increment, movesToGo));')],
  HSCM: [SESSION, one(SHARE, 'budget = Math.min(cap, timeMode === "uci-clock-mode" ? Math.max(1, (time - CLOCK_RESERVE_MS - movesToGo * CLOCK_OVERHEAD_MS) / movesToGo + increment) : safeClockShare(time, increment, movesToGo));')],
  FLOORCM: [SESSION, one(SHARE, 'budget = Math.min(cap, timeMode === "uci-clock-mode" ? Math.min((time - CLOCK_RESERVE_MS - movesToGo * CLOCK_OVERHEAD_MS) / movesToGo + increment, time - CLOCK_RESERVE_MS - CLOCK_OVERHEAD_MS) : safeClockShare(time, increment, movesToGo));')],
  MTG40CM: [SESSION, one("const movesToGo = clock.movestogo ?? DEFAULT_MOVES_TO_GO;\n      budget = Math.min(cap", 'const movesToGo = clock.movestogo ?? (timeMode === "uci-clock-mode" ? 40 : DEFAULT_MOVES_TO_GO);\n      budget = Math.min(cap')],
  LEVELCAPCM: [SESSION, one("const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;", 'const budgetMs = timeMode !== "simple-tournament" ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;')],
  BLUNDERCM: [SESSION, one("} else if (position !== null && leveled && level.blunderRate > 0) {", '} else if (position !== null && timeMode !== "simple-tournament" && level.blunderRate > 0) {')],
  MODEASLEVEL: [SESSION, one('if (timeMode !== "level") {', 'if (timeMode === "simple-tournament") {')],
  CLAMP59500: [ENGINE, one("export const HARD_CEILING_MS = 60_000;", "export const HARD_CEILING_MS = 59_500;")],
  CLAMP45: [ENGINE, one("export const HARD_CEILING_MS = 60_000;", "export const HARD_CEILING_MS = 45_000;")],
};
const ids = idsArg ? idsArg.split(",") : Object.keys(PLANTS);
const originals = { [SESSION]: readFileSync(join(P, SESSION), "utf8"), [ENGINE]: readFileSync(join(P, ENGINE), "utf8") };
const summary = [];
try {
  for (const id of ids) {
    const [file, edit] = PLANTS[id];
    const mutated = edit(originals[file]);
    if (id !== "none" && mutated === originals[file]) throw new Error(`${id} did not change ${file}`);
    writeFileSync(join(P, file), mutated);
    const json = join(out, `plant-${id}.json`);
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [join(P, "node_modules/vitest/vitest.mjs"), "run", "--reporter=json", `--outputFile.json=${json}`], {
      cwd: P, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
    });
    writeFileSync(join(P, file), originals[file]);
    const j = JSON.parse(readFileSync(json, "utf8"));
    const red = [];
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") red.push(`${f.name.split("/src/")[1] ?? f.name} :: ${a.fullName}`);
    const line = `${id} (${file}) rc=${r.status} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} skipped=${j.numPendingTests + j.numTodoTests} wall=${((Date.now() - t0) / 1000).toFixed(1)}s`;
    writeFileSync(join(out, `plant-${id}.red.txt`), `${line}\n${red.map((x) => `  RED ${x}`).join("\n")}\n`);
    summary.push(`${line}\n${red.map((x) => `  RED ${x}`).join("\n")}`);
    console.log(summary.at(-1));
  }
} finally {
  for (const f of [SESSION, ENGINE]) writeFileSync(join(P, f), originals[f]);
}
writeFileSync(join(out, `plants-summary-${ids.length === Object.keys(PLANTS).length ? "all" : ids.join("_")}.txt`), summary.join("\n") + "\n");
