// ABC-150 C3 control (supplementary, declared in METHOD.md): does the esbuild bundle itself run faster or
// slower than src/ under PLAIN node? Paired, interleaved, plain node only: d-node.mjs (src) vs d-node.mjs
// with NODE_SIDE=bundle. ratio = bundle median / src median. Same logging and usability rules as d-pairs.
// Usage: REPO=<worktree> OUT=<dir outside the repo> WORK=E,S,P PAIRS=5 node c3-control.mjs
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const REPO = process.env.REPO;
const OUT = process.env.OUT;
if (!REPO || !OUT) throw new Error("REPO and OUT are required");
const WORK = (process.env.WORK ?? "E,S,P").split(",");
const PAIRS = Number(process.env.PAIRS ?? 5);
const WAIT_LOAD = Number(process.env.WAIT_LOAD ?? 99);
const WAIT_MAX = Number(process.env.WAIT_MAX ?? 300);
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });
const SUM = join(OUT, "c3-control.tsv");
const sh = (c) => {
  try {
    return execSync(c, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const load1 = () => Number(sh("sysctl -n vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const therm = () => sh("notifyutil -g com.apple.system.thermalpressurelevel").split(/\s+/).pop();
if (!existsSync(SUM)) writeFileSync(SUM, "work\tpair\tsrc_median\tbundle_median\tratio\tdigest_equal\tload1\ttherm\tusable\n");
const side = (kind, which, pair) => {
  const out = join(OUT, `ctl-${which}-${pair}-${kind}.json`);
  rmSync(out, { force: true });
  const env = { ...process.env, WHICH: which, OUT_JSON: out, NODE_SIDE: kind === "bundle" ? "bundle" : "" };
  delete env.NODE_OPTIONS;
  const t0 = Date.now();
  while (load1() > WAIT_LOAD && Date.now() - t0 < WAIT_MAX * 1000) execSync("sleep 10");
  const lb = load1();
  const th = therm();
  const r = spawnSync(process.execPath, [join(HERE, "d-node.mjs")], { cwd: REPO, env, encoding: "utf8" });
  const j = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
  return { lb, th, status: r.status, ...j };
};
for (let pair = 0; pair < PAIRS; pair++)
  for (const which of WORK) {
    const order = pair % 2 === 0 ? ["src", "bundle"] : ["bundle", "src"];
    const res = {};
    for (const k of order) res[k] = side(k, which, pair);
    const eq = res.src.digest !== undefined && res.src.digest === res.bundle.digest;
    const maxL = Math.max(res.src.lb, res.bundle.lb);
    const ok = eq && res.src.status === 0 && res.bundle.status === 0 && maxL <= 8;
    const ratio = res.bundle.medianMs / res.src.medianMs;
    appendFileSync(SUM, `${[which, pair, res.src.medianMs, res.bundle.medianMs, ratio.toFixed(3), eq ? "yes" : "VOID", maxL, `${res.src.th}/${res.bundle.th}`, ok ? "yes" : "no"].join("\t")}\n`);
    console.log("ctl", which, pair, `ratio ${ratio.toFixed(3)}`, eq ? "digest=" : "VOID", ok ? "usable" : "NOT-USABLE");
  }
