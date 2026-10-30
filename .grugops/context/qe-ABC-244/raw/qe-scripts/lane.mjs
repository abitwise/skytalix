// qe-ABC-244 A8 N8-LANE: a Linux port of qe-ABC-177 probe/lane174.mjs (ADR-0035 D2 shape). Changes: /usr/bin/time -p
// on Linux; load1 from os.loadavg; Tctl (k10temp) logged in place of pmset/thermal pressure; foreign vitest PIDs via
// host.mjs; the command is the two-file set through node_modules/.bin/vitest (no npx), heap 128 (the SUITE row).
// Arms B (base), T (cp -R of B, diff -r clean), H (head). ROUNDS rounds, order rotated per round, round 0 discarded,
// counts asserted against round 0, load logged and NEVER gated. usage: node lane.mjs <armsDir> <outDir> [rounds]
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { tctl, vitestPids } from "./host.mjs";
const [S, OUT_DIR, R] = process.argv.slice(2);
const ROUNDS = Number(R ?? 9), CONDS = ["B", "T", "H"], BASE = "B", TWIN = "T";
const CMD = ["node_modules/.bin/vitest", "run", "src/cli.test.ts", "src/uci-session.test.ts", "--reporter=default", "--reporter=json", "--outputFile.json=.test-results/last-run.json"];
const OUT = join(OUT_DIR, "n8.tsv");
writeFileSync(OUT, "round\tcond\twall\tuser\tsys\tcpu\tpar\tfiles\ttests\tfailed\tskipped\tload1_before\tload1_after\tforeign_vitest\ttctl_before\ttctl_after\tutc\tstatus\n");
const expected = {};
for (let round = 0; round < ROUNDS; round++) {
  const k = round % CONDS.length;
  for (const c of [...CONDS.slice(k), ...CONDS.slice(0, k)]) {
    const cwd = join(S, c), result = join(cwd, ".test-results", "last-run.json");
    rmSync(result, { force: true });
    const lb = loadavg()[0], fv = vitestPids().length, tb = tctl(), utc = new Date().toISOString();
    const r = spawnSync("/usr/bin/time", ["-p", ...CMD], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" } });
    const la = loadavg()[0], ta = tctl();
    const pick = (key) => Number((r.stderr.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m")) ?? [])[1]);
    let files = NaN, tests = NaN, failed = NaN, skipped = NaN, fresh = false;
    if (existsSync(result)) {
      const j = JSON.parse(readFileSync(result, "utf8"));
      fresh = true; files = j.testResults?.length; tests = j.numTotalTests;
      failed = j.numFailedTests + (j.numFailedTestSuites ?? 0); skipped = (j.numPendingTests ?? 0) + (j.numTodoTests ?? 0);
    }
    if (round === 0) expected[c] = { files, tests };
    const ok = r.status === 0 && fresh && failed === 0 && skipped === 0 && files === expected[c].files && tests === expected[c].tests;
    const wall = pick("real"), cpu = +(pick("user") + pick("sys")).toFixed(2);
    appendFileSync(OUT, `${[round, c, wall, pick("user"), pick("sys"), cpu, +(cpu / wall).toFixed(3), files, tests, failed, skipped, lb.toFixed(2), la.toFixed(2), fv, tb.toFixed(1), ta.toFixed(1), utc, ok ? "ok" : "HARNESS_ERROR"].join("\t")}\n`);
    console.log(round, c, `cpu ${cpu}`, `wall ${wall}`, files, tests, `load1 ${lb.toFixed(2)}`, `foreign ${fv}`, `tctl ${tb.toFixed(1)}->${ta.toFixed(1)}`, ok ? "ok" : "HARNESS_ERROR");
  }
}
