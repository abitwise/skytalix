// ABC-121 lane re-hop: the planted-variant ledger for the DEFAULT LANE ALONE. The mutant table is
// read out of the build's own probe/mutants.mjs (one source, not a copy); each mutant is applied to
// a fresh scratch copy of a tree OUTSIDE the repository (exact-string edits, each asserted to match
// once) and the WHOLE default lane runs (`npx vitest run --dir src`, no *_DEEP variable set).
// A variant is "red" iff at least one default-lane row fails.
// Usage: node rehop-mutants.mjs <tree> <out.json> [name ...]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/sw121lane/mut";
const [tree, outFile, ...only] = process.argv.slice(2);

const table = readFileSync(join(here, "mutants.mjs"), "utf8");
const body = table.slice(table.indexOf("const SEARCH ="), table.indexOf("function fresh("));
const MUTANTS = new Function(`${body}; return MUTANTS;`)();

const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];

// The WHOLE tree is copied (minus .git/.claude/.grugops/node_modules): src/cli.test.ts reads
// AGENTS.md, and a copy of src/ alone reds five cli rows under EVERY mutant — the first cut of this
// harness did exactly that, and a "__baseline__" run (no mutation) now has to be fully green first.
MUTANTS.__baseline__ = [];
const names = ["__baseline__", ...(only.length ? only : Object.keys(MUTANTS).filter((n) => n !== "__baseline__"))];
const results = {};
const SKIP = new Set([".git", ".claude", ".grugops", "node_modules"]);
for (const name of names) {
  rmSync(S, { recursive: true, force: true });
  mkdirSync(S, { recursive: true });
  cpSync(tree, S, { recursive: true, filter: (p) => !SKIP.has(p.slice(tree.length + 1).split("/")[0]) });
  symlinkSync(NM, `${S}/node_modules`);
  for (const [file, from, to] of MUTANTS[name]) {
    const path = `${S}/${file}`;
    const src = readFileSync(path, "utf8");
    const n = src.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: pattern found ${n} times in ${file}`);
    writeFileSync(path, src.replace(from, to));
  }
  const out = `${S}/report.json`;
  spawnSync("npx", ["vitest", "run", "--dir", "src", "--reporter=json", `--outputFile=${out}`], { cwd: S, encoding: "utf8", env, maxBuffer: 256 * 1024 * 1024 });
  if (!existsSync(out)) throw new Error(`${name}: no report`);
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failed = [];
  for (const f of j.testResults) {
    for (const t of f.assertionResults) if (t.status === "failed") failed.push(`${f.name.split("/src/")[1]} > ${t.fullName}`);
    if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`${f.name.split("/src/")[1]} (suite failed)`);
  }
  if (name === "__baseline__" && (failed.length > 0 || j.numPassedTests === 0)) throw new Error(`baseline not green: ${failed.join("; ")}`);
  results[name] = { red: failed.length > 0, passed: j.numPassedTests, failed };
  console.log(`${name}\t${failed.length > 0 ? "RED" : "SURVIVED"}\t${failed.length} default rows`);
  writeFileSync(outFile, JSON.stringify(results, null, 1));
}
const planted = names.filter((n) => n !== "__baseline__");
const survivors = planted.filter((n) => !results[n].red);
console.log(`${planted.length - survivors.length} of ${planted.length} red in the default lane alone; survivors: ${survivors.join(", ") || "none"}`);
