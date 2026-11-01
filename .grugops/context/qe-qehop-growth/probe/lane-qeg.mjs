// qe-qehop-growth: the N8-LANE window harness on oeselg-dev (Linux). A port of secnfr-ABC-144-window-b/probe/lane144b.mjs
// (sha256 652b7793...c80c7c, the harness qe-ABC-154 ran in place on macOS), keeping its shape: /usr/bin/time -p (GNU time,
// 10 ms tick), ROUNDS rounds, the CONDS order rotated by one per round, GAP 0, round 0 discarded by the readout, the result
// file deleted before each run, counts asserted against round 0, load1 logged before and after every run and NEVER gated.
// Changes (all forced by the host or by the tree, listed in preregistration.txt):
//   - load1 from /proc/loadavg (was sysctl vm.loadavg); Tctl (k10temp) in place of pmset therm / thermal pressure;
//     no power column (no /sys/class/power_supply device on this host); cutechess-cli counted before and after;
//   - the command is node_modules/.bin/vitest (no npx; the brief fences bare npx) with
//     NODE_OPTIONS=--max-old-space-size=400, the ONE-FILE heap row the guard (ABC-173, after qe-ABC-154) requires;
//   - the in-harness summary is dropped (the readout grades; lane144b's summary used the pre-A1 rule anyway).
// usage: ARMS=<abs arms dir> OUT=<abs out dir> ROUNDS=9 node lane-qeg.mjs
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cutechessCount, load1, tctl, vitestPids } from "./host-qeg.mjs";

const S = process.env.ARMS, OUT_DIR = process.env.OUT;
if (!S || !OUT_DIR) throw new Error("ARMS and OUT are required");
const ROUNDS = Number(process.env.ROUNDS ?? 9), CONDS = ["B", "H", "T"];
const CMD = ["node_modules/.bin/vitest", "run", "tools/grugops/qe-hop-integrity.test.ts", "--reporter=default", "--reporter=json", "--outputFile.json=.test-results/last-run.json"];
const ENV = { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" };
const OUT = join(OUT_DIR, "n8-qeg.tsv");
writeFileSync(OUT, "round\tcond\twall\tuser\tsys\tcpu\tpar\tfiles\ttests\tfailed\tskipped\tload1_before\tload1_after\tforeign_vitest\tforeign_after\tcutechess_before\tcutechess_after\ttctl_before\ttctl_after\tutc\tstatus\n");
console.log(`# n8-qeg: NODE_OPTIONS=${ENV.NODE_OPTIONS} /usr/bin/time -p ${CMD.join(" ")} | conds ${CONDS.join(",")} | rounds ${ROUNDS} | gap 0 -> ${OUT}`);
const expected = {};
for (let round = 0; round < ROUNDS; round++) {
  const k = round % CONDS.length;
  for (const c of [...CONDS.slice(k), ...CONDS.slice(0, k)]) {
    const cwd = join(S, c), result = join(cwd, ".test-results", "last-run.json");
    rmSync(result, { force: true });
    const lb = load1(), fv = vitestPids().length, cb = cutechessCount(), tb = tctl(), utc = new Date().toISOString();
    const r = spawnSync("/usr/bin/time", ["-p", ...CMD], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: ENV });
    const la = load1(), ta = tctl(), fa = vitestPids().length, ca = cutechessCount();
    const pick = (key) => Number((r.stderr.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m")) ?? [])[1]);
    let files = NaN, tests = NaN, failed = NaN, skipped = NaN, fresh = false;
    if (existsSync(result)) {
      const j = JSON.parse(readFileSync(result, "utf8"));
      fresh = true; files = j.testResults?.length; tests = j.numTotalTests;
      failed = j.numFailedTests + (j.numFailedTestSuites ?? 0); skipped = (j.numPendingTests ?? 0) + (j.numTodoTests ?? 0);
    }
    if (round === 0) expected[c] = { files, tests };
    const ok = r.status === 0 && fresh && failed === 0 && skipped === 0 && files === expected[c].files && tests === expected[c].tests;
    if (c === "H" && fresh) copyFileSync(result, join(OUT_DIR, "h-last-run.json"));
    if (!ok) appendFileSync(join(OUT_DIR, "harness-errors.txt"), `round ${round} ${c} status ${r.status}\n${r.stderr.slice(-4000)}\n`);
    const wall = pick("real"), cpu = +(pick("user") + pick("sys")).toFixed(2);
    appendFileSync(OUT, `${[round, c, wall, pick("user"), pick("sys"), cpu, +(cpu / wall).toFixed(3), files, tests, failed, skipped, lb.toFixed(2), la.toFixed(2), fv, fa, cb, ca, tb.toFixed(1), ta.toFixed(1), utc, ok ? "ok" : "HARNESS_ERROR"].join("\t")}\n`);
    console.log(round, c, `cpu ${cpu}`, `wall ${wall}`, files, tests, `load1 ${lb.toFixed(2)}`, `foreign ${fv}/${fa}`, `tctl ${tb.toFixed(1)}->${ta.toFixed(1)}`, ok ? "ok" : "HARNESS_ERROR");
  }
}
