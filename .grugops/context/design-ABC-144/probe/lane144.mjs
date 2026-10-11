// design-ABC-144 (ADR-0040): the no-other-hop window harness for `ABC-144` A1-A4 and the frontier.
// Shape: `ADR-0035` decision 2 / `secnfr-ABC-084` raw-harness-lane.mjs.txt, with these changes:
//   - the command is `npm test` by default (`ADR-0035` § Pointers P1), not `--dir src`;
//   - load1 is LOGGED before and after every run and NEVER gated (`ABC-108` A1, `ADR-0035`);
//   - GAP=90 gives the cooled state: a 90 s idle gap before EVERY run (`ABC-111`, `ABC-144` A4);
//   - counts come from `.test-results/last-run.json`, deleted before each run so a stale file
//     can never be read as this run's result (the `ABC-143` hazard);
//   - each run logs `pmset -g therm` CPU_Speed_Limit and the power source (heat, owner question 1);
//   - the summary prints effective parallelism (CPU / wall) and R per `ADR-0035` decision 1.
// Lives in the shared context, runs from outside the repository. Measures nothing until run.
//
// Usage (one window, width 1, no other agent hop):
//   ARMS=/abs/dir/with/arm/subdirs CONDS=B,T,K4,K3,K2,K1 BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=frontier-warm \
//     node lane144.mjs
//   NARROW="src/cli.test.ts" runs `npx vitest run src/cli.test.ts` with the same reporters instead.
//   DRY=1 skips /usr/bin/time and the load/therm reads (harness self-test only; numbers are junk).
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const S = process.env.ARMS;
if (!S) throw new Error("ARMS is required");
const TAG = process.env.TAG ?? "run";
const ROUNDS = Number(process.env.ROUNDS ?? 9);
const GAP = Number(process.env.GAP ?? 0);
const CONDS = (process.env.CONDS ?? "B,T,K4").split(",");
const BASE = process.env.BASE ?? "B";
const TWIN = process.env.TWIN ?? "T";
const DRY = process.env.DRY === "1";
const REPORT = ["--reporter=default", "--reporter=json", "--outputFile.json=.test-results/last-run.json"];
const CMD = process.env.CMD
  ? process.env.CMD.split(" ")
  : process.env.NARROW
    ? ["npx", "vitest", "run", ...process.env.NARROW.split(" "), ...REPORT]
    : ["npm", "test"];
const OUT = join(S, "..", `${TAG}.tsv`);

const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const load1 = () => (DRY ? Number.NaN : Number(sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]));
const foreign = () => sh("ps -Ao command").split("\n").filter((l) => /[v]itest/.test(l)).length;
const therm = () => {
  if (DRY) return "dry";
  const m = sh("pmset -g therm").match(/CPU_Speed_Limit\s*=\s*(\d+)/);
  return m ? m[1] : "none";
};
const power = () => (DRY ? "dry" : (sh("pmset -g batt").match(/'([^']+)'/)?.[1] ?? "unknown"));

writeFileSync(
  OUT,
  "round\tcond\twall\tuser\tsys\tcpu\tpar\tfiles\ttests\tfailed\tskipped\tload1_before\tload1_after\tforeign_vitest\tspeed_limit\tpower\tgap_s\tutc\tstatus\n",
);
console.log(`# ${TAG}: ${CMD.join(" ")} | conds ${CONDS.join(",")} | rounds ${ROUNDS} | gap ${GAP}s -> ${OUT}`);

const expected = {};
for (let round = 0; round < ROUNDS; round++) {
  const k = round % CONDS.length;
  const order = [...CONDS.slice(k), ...CONDS.slice(0, k)];
  for (const c of order) {
    const cwd = join(S, c);
    const result = join(cwd, ".test-results", "last-run.json");
    if (GAP > 0) execSync(`sleep ${GAP}`);
    rmSync(result, { force: true });
    const lb = load1();
    const fv = foreign();
    const sl = therm();
    const pw = power();
    const utc = new Date().toISOString();
    const argv = DRY ? CMD : ["-p", ...CMD];
    const r = spawnSync(DRY ? argv[0] : "/usr/bin/time", DRY ? argv.slice(1) : argv, {
      cwd,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const la = load1();
    const err = r.stderr ?? "";
    const pick = (key) => {
      const m = err.match(new RegExp(`^${key}\\s+([0-9.]+)`, "m"));
      return m ? Number(m[1]) : Number.NaN;
    };
    let files = Number.NaN;
    let tests = Number.NaN;
    let failed = Number.NaN;
    let skipped = Number.NaN;
    let fresh = false;
    if (existsSync(result)) {
      const j = JSON.parse(readFileSync(result, "utf8"));
      fresh = true;
      files = j.testResults?.length ?? Number.NaN;
      tests = j.numTotalTests;
      failed = j.numFailedTests + (j.numFailedTestSuites ?? 0);
      skipped = (j.numPendingTests ?? 0) + (j.numTodoTests ?? 0);
    }
    if (round === 0) expected[c] = { files, tests };
    const ok =
      r.status === 0 && fresh && failed === 0 && skipped === 0 &&
      files === expected[c].files && tests === expected[c].tests;
    const wall = pick("real");
    const cpu = +(pick("user") + pick("sys")).toFixed(2);
    const par = +(cpu / wall).toFixed(3);
    appendFileSync(
      OUT,
      `${[round, c, wall, pick("user"), pick("sys"), cpu, par, files, tests, failed, skipped, lb, la, fv, sl, pw, GAP, utc, ok ? "ok" : "HARNESS_ERROR"].join("\t")}\n`,
    );
    console.log(round, c, `cpu ${cpu}`, `wall ${wall}`, `par ${par}`, files, tests, `load1 ${lb}`, `foreign ${fv}`, `limit ${sl}`, ok ? "ok" : "HARNESS_ERROR");
  }
}

// ---- summary: medians, paired deltas against BASE, the twin's admissibility and R ----
const rows = readFileSync(OUT, "utf8").trim().split("\n").slice(1).map((l) => {
  const f = l.split("\t");
  return { round: +f[0], cond: f[1], wall: +f[2], cpu: +f[5], par: +f[6], files: +f[7], tests: +f[8], lb: +f[11], ok: f[18] === "ok" };
});
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const choose = (n, i) => {
  let v = 1;
  for (let j = 1; j <= i; j++) v = (v * (n - i + j)) / j;
  return v;
};
// ADR-0035 decision 1: k = the largest index whose coverage 1 - 2*sum_{i<k} C(n,i)/2^n is >= 0.92.
const kOf = (n) => {
  let k = 1;
  for (let c = 2; c <= Math.floor(n / 2); c++) {
    let tail = 0;
    for (let i = 0; i < c; i++) tail += choose(n, i);
    if (1 - (2 * tail) / 2 ** n >= 0.92) k = c;
  }
  return k;
};
const rOf = (ds) => {
  const s = [...ds].sort((a, b) => a - b);
  const n = s.length;
  const k = kOf(n);
  return { k, lo: s[k - 1], hi: s[n - k], R: Math.max(Math.abs(s[k - 1]), Math.abs(s[n - k])) };
};
const use = rows.filter((r) => r.round >= 1);
const bad = use.filter((r) => !r.ok).length;
const by = (c) => use.filter((r) => r.cond === c);
const paired = (c, key) =>
  by(c).map((r) => r[key] - (use.find((b) => b.round === r.round && b.cond === BASE)?.[key] ?? Number.NaN));
const lines = [`# ${TAG} summary: n = ${ROUNDS - 1} scored rounds, round 0 discarded, ${bad} harness errors`];
const baseCpu = med(by(BASE).map((r) => r.cpu));
const twinR = { cpu: Number.NaN, wall: Number.NaN };
for (const c of CONDS) {
  const g = by(c);
  const over8 = g.filter((r) => r.lb > 8).length;
  lines.push(
    `${c}\tcpu ${med(g.map((r) => r.cpu)).toFixed(2)}\twall ${med(g.map((r) => r.wall)).toFixed(2)}\tpar ${med(g.map((r) => r.par)).toFixed(3)}\tload1 ${med(g.map((r) => r.lb)).toFixed(2)}\tload1>8 ${over8}/${g.length}\tfiles ${g[0]?.files}\ttests ${g[0]?.tests}`,
  );
  if (c === BASE) continue;
  for (const key of ["cpu", "wall"]) {
    const d = paired(c, key);
    const st = rOf(d);
    const m = med(d);
    const pos = d.filter((x) => x > 0).length;
    const pct = key === "cpu" ? ` (${((100 * m) / baseCpu).toFixed(2)} % of base cpu)` : "";
    lines.push(`  ${c}-${BASE} ${key}\tmedian ${m.toFixed(3)}${pct}\tsign ${pos}/${d.length}\tk ${st.k}\tinterval [${st.lo.toFixed(3)}, ${st.hi.toFixed(3)}]\tR ${st.R.toFixed(3)}`);
    if (c === TWIN) twinR[key] = st.R;
  }
}
lines.push(`twin R: cpu ${twinR.cpu.toFixed(3)} s, wall ${twinR.wall.toFixed(3)} s. Admissible = twin cpu median <= 1.5 % of base with sign at chance (ADR-0035 d1).`);
writeFileSync(join(S, "..", `${TAG}.summary.txt`), `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
