// ABC-150 D1/D2 driver: ABC-147's a2-pairs.mjs, extended to candidates. Paired, interleaved node / vitest
// processes. For each pair index p, every candidate in CANDS and every workload in WORK runs one pair, so
// the base (D1) and the candidates (D2) are read side by side across the same minutes.
// Usage: REPO=<worktree> OUT=<dir outside the repo> CANDS=base,C1,C2,C3,C4 WORK=E,S,P PAIRS=5 node d-pairs.mjs
// Order alternates per pair and per candidate ((p + candidate index) even -> node first). load1, thermal
// pressure and the power source are logged before every process. A pair is VOID if the digests differ,
// and NOT USABLE if either side starts at load1 > 8, exits non-zero, or the vitest side's recorded
// mechanism is not the candidate's (see MECH below).
// SMOKE=1: one pair per cell; the summary carries digest, exit and mechanism only (no timings printed).
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = process.env.REPO;
const OUT = process.env.OUT;
if (!REPO || !OUT) throw new Error("REPO and OUT are required");
const CANDS = (process.env.CANDS ?? "base,C1,C2,C3,C4").split(",");
const WORK = (process.env.WORK ?? "E,S,P").split(",");
const PAIRS = Number(process.env.PAIRS ?? 5);
const START = Number(process.env.START ?? 0);
const WAIT_LOAD = Number(process.env.WAIT_LOAD ?? 99);
const WAIT_MAX = Number(process.env.WAIT_MAX ?? 300);
const SMOKE = process.env.SMOKE === "1";
const HERE = dirname(fileURLToPath(import.meta.url));
// The mechanism each candidate must show on the vitest side, or the pair is not usable.
const MECH = {
  base: (m) => m.isMainThread === false && m.srcBinding === "accessor" && m.workload === "probe/workload150.mjs",
  C1: (m) => m.isMainThread === false && m.srcBinding === "accessor" && m.workload === "probe/workload150.mjs",
  C2: (m) => m.isMainThread === true && m.srcBinding === "accessor" && m.workload === "probe/workload150.mjs",
  C3: (m) => m.isMainThread === false && m.workload === "probe/bundle/workload150.bundle.mjs",
  C4: (m) => m.isMainThread === false && m.srcBinding === "data" && m.workload === "probe/workload150.mjs",
};
mkdirSync(OUT, { recursive: true });
const TSV = join(OUT, "d-pairs.tsv");
const SUM = join(OUT, "d-pairs.summary.tsv");
const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const load1 = () => Number(sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const therm = () => sh("notifyutil -g com.apple.system.thermalpressurelevel").split(/\s+/).pop();
const power = () => (sh("pmset -g ps").match(/'([^']+)'/) ?? [, "?"])[1];
if (!existsSync(TSV))
  writeFileSync(TSV, "cand\twork\tpair\tside\twaited_s\tutc\tload1\ttherm\tpower\texit\tdigest\tcold_ms\tmedian_ms\tms\tmech\n");
if (!existsSync(SUM))
  writeFileSync(SUM, "cand\twork\tpair\tnode_median\tvitest_median\tratio\tnode_cold\tvitest_cold\tcold_ratio\tdigest_equal\tmech_ok\tmax_load1\ttherm\tusable\n");

const runSide = (side, cand, which, pair) => {
  const out = join(OUT, `${cand}-${which}-${pair}-${side}.json`);
  rmSync(out, { force: true });
  const env = { ...process.env, CAND: cand, WHICH: which, OUT_JSON: out };
  delete env.NODE_OPTIONS;
  delete env.INSPECT;
  const t0 = Date.now();
  while (load1() > WAIT_LOAD && Date.now() - t0 < WAIT_MAX * 1000) execSync("sleep 10");
  const waited = Math.round((Date.now() - t0) / 1000);
  const lb = load1();
  const th = therm();
  const pw = power();
  const utc = new Date().toISOString();
  const r =
    side === "node"
      ? spawnSync(process.execPath, [join(HERE, "d-node.mjs")], { cwd: REPO, env, encoding: "utf8" })
      : spawnSync(join(REPO, "node_modules", ".bin", "vitest"), ["run", "-c", join(HERE, "vitest.d.config.mjs")], { cwd: REPO, env, encoding: "utf8" });
  if (r.status !== 0) writeFileSync(`${out}.stderr.txt`, `${r.stdout}\n${r.stderr}`);
  const j = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
  appendFileSync(TSV, `${[cand, which, pair, side, waited, utc, lb, th, pw, r.status, j.digest, SMOKE ? "-" : j.coldMs, SMOKE ? "-" : j.medianMs, SMOKE ? "-" : (j.ms ?? []).join(","), JSON.stringify(j.mech ?? null)].join("\t")}\n`);
  return { lb, th, status: r.status, ...j };
};

for (let pair = START; pair < START + PAIRS; pair++) {
  CANDS.forEach((cand, ci) => {
    for (const which of WORK) {
      const order = (pair + ci) % 2 === 0 ? ["node", "vitest"] : ["vitest", "node"];
      const res = {};
      for (const side of order) res[side] = runSide(side, cand, which, pair);
      const eq = res.node.digest !== undefined && res.node.digest === res.vitest.digest;
      const mechOk = res.vitest.mech ? MECH[cand](res.vitest.mech) : false;
      const maxL = Math.max(res.node.lb, res.vitest.lb);
      const ok = eq && mechOk && res.node.status === 0 && res.vitest.status === 0 && maxL <= 8;
      const ratio = res.vitest.medianMs / res.node.medianMs;
      const cold = res.vitest.coldMs / res.node.coldMs;
      const th = `${res.node.th}/${res.vitest.th}`;
      const t = (x) => (SMOKE ? "-" : x);
      appendFileSync(SUM, `${[cand, which, pair, t(res.node.medianMs), t(res.vitest.medianMs), t(ratio.toFixed(3)), t(res.node.coldMs), t(res.vitest.coldMs), t(cold.toFixed(3)), eq ? "yes" : "VOID", mechOk ? "yes" : "NO", maxL, th, ok ? "yes" : "no"].join("\t")}\n`);
      console.log(cand, which, pair, order.join(">"), SMOKE ? "" : `ratio ${ratio.toFixed(3)}`, eq ? "digest=" : "VOID", mechOk ? "mech-ok" : "MECH-NO", `load1 ${res.node.lb}/${res.vitest.lb}`, `therm ${th}`, ok ? "usable" : "NOT-USABLE");
    }
  });
}
