// secnfr-ABC-127: A7 readings. Runs `PUZZLE_DEEP=<MODE> npx vitest run src/puzzle-suite.test.ts` in CWD,
// one fresh process per run. Before each run: waits (poll 10 s) until load1 < LMAX or WAITMAX s pass.
// Records load1 before/after, foreign vitest processes, process real/user/sys, the gating wall the runner
// prints, both oracle walls, vitest's Duration, tests passed and exit. Optional STEP rewrites the
// baseline's stepMs IN CWD (only ever pointed at an out-of-tree copy) and -t restricts to the gate row.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const CWD = process.env.CWD;
const TAG = process.env.TAG ?? "a7";
const RUNS = Number(process.env.RUNS ?? 3);
const LMAX = Number(process.env.LMAX ?? 4);
const WAITMAX = Number(process.env.WAITMAX ?? 120);
const MODE = process.env.MODE ?? "1";
const GATE_ONLY = process.env.GATE_ONLY === "1";
const OUTDIR = process.env.OUTDIR;
const STEPS = (process.env.STEPS ?? "").split(",").filter(Boolean).map(Number);

const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim().replace(/[{}]/g, "").trim();
const load1 = () => Number(loadavg().split(/\s+/)[0]);
const foreign = () =>
  execSync("ps -Ao command").toString().split("\n").filter((l) => /[v]itest/.test(l)).length;
const sleep = (s) => execSync(`sleep ${s}`);

const TSV = `${OUTDIR}/${TAG}.tsv`;
writeFileSync(
  TSV,
  "run\tstep\tutc\tload_before(1/5/15)\tload_after(1/5/15)\tforeign_vitest\twaited_s\texit\tpassed\tsolved\tgating_s\toracle_m3_s\toracle_wm_s\tvitest_duration_s\treal_s\tuser_s\tsys_s\n",
);
const plan = STEPS.length ? STEPS : Array.from({ length: RUNS }, () => undefined);
const baselinePath = `${CWD}/src/puzzle-suite.baseline.json`;
const original = readFileSync(baselinePath, "utf8");
plan.forEach((step, i) => {
  if (step !== undefined) {
    const b = JSON.parse(original);
    b.stepMs = step;
    writeFileSync(baselinePath, JSON.stringify(b, null, 2));
  }
  let waited = 0;
  while (load1() >= LMAX && waited < WAITMAX) {
    sleep(10);
    waited += 10;
  }
  const lb = loadavg();
  const fv = foreign();
  const utc = new Date().toISOString();
  const args = ["-p", "npx", "vitest", "run", "src/puzzle-suite.test.ts"];
  if (GATE_ONLY) args.push("-t", "the gate");
  const r = spawnSync("/usr/bin/time", args, {
    cwd: CWD,
    env: { ...process.env, PUZZLE_DEEP: MODE },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const la = loadavg();
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
  writeFileSync(`${OUTDIR}/${TAG}-run${i + 1}.txt`, out);
  const num = (re) => {
    const m = out.match(re);
    return m ? Number(m[1]) : Number.NaN;
  };
  const row = [
    i + 1,
    step ?? "baseline",
    utc,
    lb,
    la,
    fv,
    waited,
    r.status,
    num(/^\s*Tests\s+(\d+) passed/m),
    num(/solved (\d+)\/\d+, baseline/),
    num(/budget \S+ step \S+, wall ([0-9.]+) s/),
    num(/ORACLE mate-in-3: \d+ rows, wall ([0-9.]+) s/),
    num(/ORACLE win-material: \d+ rows, wall ([0-9.]+) s/),
    num(/Duration\s+([0-9.]+)s/),
    num(/^real\s+([0-9.]+)/m),
    num(/^user\s+([0-9.]+)/m),
    num(/^sys\s+([0-9.]+)/m),
  ];
  appendFileSync(TSV, `${row.join("\t")}\n`);
  console.log(row.join("\t"));
});
if (STEPS.length) writeFileSync(baselinePath, original);
