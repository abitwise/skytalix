// ABC-147 A2 driver: paired, interleaved node / vitest processes per workload, as METHOD.md declares.
// Usage: REPO=<worktree> OUT=<dir outside the repo> WORK=E,S PAIRS=5 node a2-pairs.mjs
// Order alternates per pair (node first on even pairs). load1 + thermal pressure logged before every
// process. A pair is VOID if the digests differ, and NOT USABLE if either side starts at load1 > 8.
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = process.env.REPO;
const OUT = process.env.OUT;
if (!REPO || !OUT) throw new Error("REPO and OUT are required");
const WORK = (process.env.WORK ?? "E,S").split(",");
const PAIRS = Number(process.env.PAIRS ?? 5);
const START = Number(process.env.START ?? 0);
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });
const TSV = join(OUT, "a2-pairs.tsv");
const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const load1 = () => Number(sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const therm = () => sh("notifyutil -g com.apple.system.thermalpressurelevel").split(/\s+/).pop();
if (!existsSync(TSV))
  writeFileSync(TSV, "work\tpair\tside\torder\tutc\tload1\ttherm\texit\tdigest\tcold_ms\tmedian_ms\tms\n");
const SUM = join(OUT, "a2-pairs.summary.tsv");
if (!existsSync(SUM)) writeFileSync(SUM, "work\tpair\tnode_median\tvitest_median\tratio\tnode_cold\tvitest_cold\tcold_ratio\tdigest_equal\tmax_load1\tusable\n");

const runSide = (side, which, pair) => {
  const out = join(OUT, `${which}-${pair}-${side}.json`);
  rmSync(out, { force: true });
  const env = { ...process.env, WHICH: which, OUT_JSON: out };
  delete env.NODE_OPTIONS;
  const lb = load1();
  const th = therm();
  const utc = new Date().toISOString();
  const r =
    side === "node"
      ? spawnSync("node", [join(HERE, "a2-node.mjs")], { cwd: REPO, env, encoding: "utf8" })
      : spawnSync(join(REPO, "node_modules", ".bin", "vitest"), ["run", "-c", join(HERE, "vitest.probe.config.mjs")], { cwd: REPO, env, encoding: "utf8" });
  const j = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
  appendFileSync(TSV, `${[which, pair, side, "", utc, lb, th, r.status, j.digest, j.coldMs, j.medianMs, (j.ms ?? []).join(",")].join("\t")}\n`);
  return { lb, th, status: r.status, ...j };
};

for (let pair = START; pair < START + PAIRS; pair++) {
  for (const which of WORK) {
    const order = pair % 2 === 0 ? ["node", "vitest"] : ["vitest", "node"];
    const res = {};
    for (const side of order) res[side] = runSide(side, which, pair);
    const eq = res.node.digest !== undefined && res.node.digest === res.vitest.digest;
    const maxL = Math.max(res.node.lb, res.vitest.lb);
    const ok = eq && res.node.status === 0 && res.vitest.status === 0 && maxL <= 8;
    const ratio = res.vitest.medianMs / res.node.medianMs;
    const cold = res.vitest.coldMs / res.node.coldMs;
    appendFileSync(SUM, `${[which, pair, res.node.medianMs, res.vitest.medianMs, ratio.toFixed(3), res.node.coldMs, res.vitest.coldMs, cold.toFixed(3), eq ? "yes" : "VOID", maxL, ok ? "yes" : "no"].join("\t")}\n`);
    console.log(which, pair, order.join(">"), `node ${res.node.medianMs}`, `vitest ${res.vitest.medianMs}`, `ratio ${ratio.toFixed(3)}`, `cold ${cold.toFixed(3)}`, eq ? "digest=" : "VOID", `load1 ${res.node.lb}/${res.vitest.lb}`, `therm ${res.node.th}/${res.vitest.th}`, ok ? "usable" : "NOT-USABLE");
  }
}
