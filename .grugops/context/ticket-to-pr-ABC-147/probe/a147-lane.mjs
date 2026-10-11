// ABC-147 A1: interleaved profiled (P) / unprofiled (U) `npm test` runs, as METHOD.md declares.
// Usage: REPO=<worktree> OUT=<dir outside the repo> ROUNDS=6 node a147-lane.mjs
// Round 0 is the warm-up and is discarded at summary time. Per run it logs load1, thermal pressure,
// power and foreign vitest processes before AND after. Profiles go to OUT/prof-<round>, are analysed
// by analyze.mjs into OUT/a1-<round>.json, and the raw profiles are then deleted (13 MB a run).
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = process.env.REPO;
const OUT = process.env.OUT;
if (!REPO || !OUT) throw new Error("REPO and OUT are required");
const ROUNDS = Number(process.env.ROUNDS ?? 6);
const START = Number(process.env.START ?? 0);
const WAIT_LOAD = Number(process.env.WAIT_LOAD ?? 99);
const WAIT_MAX = Number(process.env.WAIT_MAX ?? 300);
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });
const TSV = join(OUT, "a147-lane.tsv");

const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const load1 = () => Number(sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const therm = () => sh("notifyutil -g com.apple.system.thermalpressurelevel").split(/\s+/).pop();
const power = () => sh("pmset -g batt").match(/'([^']+)'/)?.[1] ?? "unknown";
const foreign = () => sh("ps -Ao command").split("\n").filter((l) => /[v]itest/.test(l)).length;

if (!existsSync(TSV))
  writeFileSync(
    TSV,
    "round\tarm\tutc\twall\tuser\tsys\tcpu\tfiles\ttests\tfailed\texit\tload1_before\tload1_after\ttherm_before\ttherm_after\tpower\tforeign_vitest\tusable\twaited_s\n",
  );

for (let round = START; round < START + ROUNDS; round++) {
  const order = round % 2 === 0 ? ["P", "U"] : ["U", "P"];
  for (const arm of order) {
    const result = join(REPO, ".test-results", "last-run.json");
    rmSync(result, { force: true });
    const prof = join(OUT, `prof-${round}`);
    rmSync(prof, { recursive: true, force: true });
    if (arm === "P") mkdirSync(prof);
    // Scheduling gate (added after rounds 0-11, not a method change): wait until load1 <= WAIT_LOAD,
    // at most WAIT_MAX s, so the previous run's own load does not void the next. The wait is logged.
    const t0 = Date.now();
    while (load1() > WAIT_LOAD && Date.now() - t0 < WAIT_MAX * 1000) execSync("sleep 10");
    const waited = Math.round((Date.now() - t0) / 1000);
    const lb = load1();
    const tb = therm();
    const pw = power();
    const fv = foreign();
    const utc = new Date().toISOString();
    const env = { ...process.env };
    delete env.NODE_OPTIONS;
    if (arm === "P") env.NODE_OPTIONS = `--cpu-prof --cpu-prof-dir=${prof}`;
    const r = spawnSync("/usr/bin/time", ["-p", "npm", "test"], { cwd: REPO, env, encoding: "utf8", maxBuffer: 64 << 20 });
    const la = load1();
    const ta = therm();
    writeFileSync(join(OUT, `out-${round}-${arm}.txt`), `${r.stdout ?? ""}\n--- stderr ---\n${r.stderr ?? ""}`);
    const pick = (k) => Number((r.stderr ?? "").match(new RegExp(`^${k}\\s+([0-9.]+)`, "m"))?.[1]);
    let files = Number.NaN;
    let tests = Number.NaN;
    let failed = Number.NaN;
    if (existsSync(result)) {
      const j = JSON.parse(readFileSync(result, "utf8"));
      files = j.testResults?.length;
      tests = j.numTotalTests;
      failed = j.numFailedTests + (j.numFailedTestSuites ?? 0);
    }
    const usable = lb <= 8 && r.status === 0 && failed === 0;
    const cpu = +(pick("user") + pick("sys")).toFixed(2);
    appendFileSync(
      TSV,
      `${[round, arm, utc, pick("real"), pick("user"), pick("sys"), cpu, files, tests, failed, r.status, lb, la, tb, ta, pw, fv, usable ? "yes" : "no", waited].join("\t")}\n`,
    );
    console.log(round, arm, `cpu ${cpu}`, `wall ${pick("real")}`, files, tests, `exit ${r.status}`, `load1 ${lb}->${la}`, `therm ${tb}->${ta}`, `waited ${waited}s`, usable ? "usable" : "NOT-USABLE");
    if (arm === "P") {
      const a = spawnSync("node", [join(HERE, "analyze.mjs"), prof, REPO], { encoding: "utf8", maxBuffer: 64 << 20 });
      if (a.status !== 0) console.log("analyze failed", a.stderr);
      else writeFileSync(join(OUT, `a1-${round}.json`), a.stdout);
      rmSync(prof, { recursive: true, force: true });
    }
  }
}
