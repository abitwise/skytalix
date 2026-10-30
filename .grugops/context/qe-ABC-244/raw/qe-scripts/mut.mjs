// qe-ABC-244 A6 runner (from se-ABC-244 probe/mut.mjs; multi-edit mutants; output dir as an argument).
// usage: QE244_NM=<node_modules> node mut.mjs <tree> <label> <outDir> <id|CONTROL>...
// One scratch copy per mutant, each edit asserted unique, then the four ABC-230/ABC-241 blocks (18 rows) of both files.
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { MUTANTS } from "./mutants.mjs";
const [tree, label, outDir, ...ids] = process.argv.slice(2);
const PATTERN = "ABC-230 A1, A3|ABC-241 A4, A7|ABC-230 A2, A3, A5|ABC-241 A4, A5";
const out = join(outDir, `kill-${label}.jsonl`);
for (const id of ids) {
  const dir = join(outDir, "mut", `${label}-${id}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(tree, dir, { recursive: true, filter: (s) => !s.endsWith("/node_modules") });
  symlinkSync(process.env.QE244_NM, join(dir, "node_modules"));
  if (id !== "CONTROL") {
    for (const [file, from, to] of MUTANTS[id]) {
      const text = readFileSync(join(dir, file), "utf8");
      const n = text.split(from).length - 1;
      if (n !== 1) throw new Error(`${id}: ${n} occurrences in ${file}`);
      writeFileSync(join(dir, file), text.replace(from, to));
    }
  }
  const json = join(dir, "r.json");
  const t0 = performance.now();
  const r = spawnSync("node_modules/.bin/vitest", ["run", "src/cli.test.ts", "src/uci-session.test.ts", "-t", PATTERN,
    "--testTimeout=120000", "--reporter=json", `--outputFile=${json}`], {
    cwd: dir, encoding: "utf8", maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
  });
  if (!existsSync(json) || JSON.parse(readFileSync(json, "utf8")).numTotalTests === 0) { console.error(id, "no json", r.stdout.slice(-2000), r.stderr.slice(-2000)); process.exit(3); }
  const rep = JSON.parse(readFileSync(json, "utf8"));
  const rows = {};
  let suiteErrors = 0;
  for (const f of rep.testResults) {
    if (f.status === "failed" && f.assertionResults.every((a) => a.status !== "failed")) suiteErrors++;
    for (const a of f.assertionResults) {
      if (a.status === "skipped" || a.status === "pending") continue;
      rows[`${f.name.replace(/.*\/src\//, "src/")} > ${a.ancestorTitles.join(" > ")} > ${a.title}`] = a.status;
    }
  }
  const line = { label, id, ran: Object.keys(rows).length, failed: Object.entries(rows).filter(([, s]) => s !== "passed").map(([k]) => k), suiteErrors, secs: +((performance.now() - t0) / 1000).toFixed(1) };
  appendFileSync(out, JSON.stringify(line) + "\n");
  console.log(label, id, "ran", line.ran, "failed", line.failed.length, "suiteErrors", suiteErrors, `${line.secs}s`);
  if (!process.env.KEEP) rmSync(dir, { recursive: true, force: true });
}
