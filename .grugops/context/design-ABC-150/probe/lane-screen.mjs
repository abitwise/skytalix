// ABC-150 D3 admissibility screen driver. Runs the full default lane once per SCREEN value through
// lane-screen.config.mjs and records ONLY: exit code, files, tests, passed/failed/skipped, and the failing
// files with their first failure message line. No timing is read or written.
// Usage: REPO=<worktree> OUT=<dir outside the repo> SCREENS=ctl,C4 node lane-screen.mjs
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const { REPO, OUT } = process.env;
if (!REPO || !OUT) throw new Error("REPO and OUT are required");
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });
const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const out = [];
for (const screen of (process.env.SCREENS ?? "ctl,C4").split(",")) {
  const json = join(OUT, `screen-${screen}.json`);
  rmSync(json, { force: true });
  const env = { ...process.env, SCREEN: screen };
  delete env.NODE_OPTIONS;
  const load1 = sh("sysctl -n vm.loadavg");
  const therm = sh("notifyutil -g com.apple.system.thermalpressurelevel");
  const r = spawnSync(join(REPO, "node_modules", ".bin", "vitest"), ["run", "-c", join(HERE, "lane-screen.config.mjs"), "--reporter=json", `--outputFile=${json}`], { cwd: REPO, env, encoding: "utf8", timeout: 300000 });
  const j = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")) : null;
  const failing = (j?.testResults ?? [])
    .filter((f) => f.status !== "passed")
    .map((f) => ({
      file: f.name.replace(`${REPO}/`, ""),
      failed: f.assertionResults.filter((a) => a.status === "failed").length,
      first: (f.assertionResults.find((a) => a.status === "failed")?.failureMessages?.[0] ?? f.message ?? "").split("\n")[0].slice(0, 220),
    }));
  out.push({ screen, load1, therm, exit: r.status, signal: r.signal, files: j?.numTotalTestSuites !== undefined ? (j.testResults ?? []).length : null, tests: j?.numTotalTests, passed: j?.numPassedTests, failed: j?.numFailedTests, skipped: (j?.numPendingTests ?? 0) + (j?.numTodoTests ?? 0), failedFiles: failing.length, failing });
  console.log(JSON.stringify(out.at(-1)));
}
writeFileSync(join(OUT, "lane-screen.out.json"), JSON.stringify(out, null, 1));
