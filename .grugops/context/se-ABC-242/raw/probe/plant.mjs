// Parity: for each step and mutant, set STEP_MS in the three ABC-242 blocks, plant the mutant in src/levels.ts,
// run the ABC-242 rows (vitest via node, never npx), record pass/fail per row. Restores every file after.
// usage: node plant.mjs <worktree> <outDir> [steps=1,10,100,1000]
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [wt, outDir, stepsArg = "1,10,100,1000"] = process.argv.slice(2);
const files = ["src/levels.test.ts", "src/cli.test.ts", "src/uci-session.test.ts"].map((f) => join(wt, f));
const prod = join(wt, "src/levels.ts");
const orig = Object.fromEntries([...files, prod].map((f) => [f, readFileSync(f, "utf8")]));
const MUT = {
  none: (s) => s,
  M1: (s) => s.replace("if (priorKeys !== undefined && standsTwiceBefore(position, priorKeys))", "if (priorKeys !== undefined && false)"),
  M2: (s) => s.replace("++matches === 2", "++matches === 1"),
  M3: (s) => s.replace("-Math.min(child.halfmoveClock, keys.length, PRIOR_KEYS_WINDOW)", "-Math.min(keys.length, PRIOR_KEYS_WINDOW)"),
  M4: (s) => s.replace("scored.push({ move, score: 0 });\n        return;", "chooseMove(position, { budgetMs: start + (budgetMs * (i + 1)) / moves.length - now(), now, priorKeys });\n        scored.push({ move, score: 0 });\n        return;"),
  M5: (s) => s.replace("scored.push({ move, score: 0 });\n        return;", "scored.push({ move, score: 1 });\n        return;"),
  M6: (s) => s.replace("earlier >= oldest", "earlier > oldest"),
  M7: (s) => s.replace("let earlier = -4", "let earlier = -2"),
  M8: (s) => s.replace("const key = repetitionKey(child, zobristKey(child));", "const key = zobristKey(child);"),
};
const rows = {};
try {
  for (const step of stepsArg.split(",")) {
    for (const f of files) {
      const t = orig[f].replace(/(ABC-242[\s\S]*?const STEP_MS = )10;/, `$1${step};`);
      if (!/ABC-242[\s\S]*?const STEP_MS = 10;/.test(orig[f])) throw new Error(`no STEP_MS in ${f}`);
      writeFileSync(f, t);
    }
    for (const [id, m] of Object.entries(MUT)) {
      const p = m(orig[prod]);
      if (id !== "none" && p === orig[prod]) throw new Error(`mutant ${id} did not apply`);
      writeFileSync(prod, p);
      const json = join(outDir, `r-${step}-${id}.json`);
      const t0 = Date.now();
      spawnSync(process.execPath, [join(wt, "node_modules/vitest/vitest.mjs"), "run", "src/levels.test.ts", "src/cli.test.ts", "src/uci-session.test.ts", "-t", "ABC-242", "--reporter=json", `--outputFile.json=${json}`], { cwd: wt, stdio: "ignore", env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" } });
      if (JSON.parse(readFileSync(json, "utf8")).numTotalTests === 0) throw new Error(`no tests ran at ${step} ${id}`);
      const r = JSON.parse(readFileSync(json, "utf8"));
      for (const file of r.testResults) for (const a of file.assertionResults) {
        if (a.status === "skipped" || a.status === "pending") continue;
        const key = `${file.name.split("/src/")[1]} :: ${a.title}`;
        (rows[key] ??= {})[`${step}`] ??= {};
        rows[key][`${step}`][id] = a.status === "passed" ? "." : "K";
        if (id === "none") rows[key][`${step}`].ms = Math.round(a.duration);
      }
      console.error(`step ${step} ${id} ${Date.now() - t0} ms`);
    }
  }
} finally {
  for (const [f, t] of Object.entries(orig)) writeFileSync(f, t);
}
const ids = Object.keys(MUT);
for (const [key, bySteps] of Object.entries(rows)) {
  console.log(key);
  for (const [step, r] of Object.entries(bySteps)) {
    const kills = ids.filter((i) => i !== "none" && r[i] === "K");
    console.log(`  step ${step.padStart(4)}: green=${r.none === "."} ${r.ms}ms kills={${kills.join(",")}}`);
  }
}
