// qe-ABC-173 mutant harness. Applies ONE exact-once replacement (or several) to the scratch worktree,
// runs the named batteries, classifies each outcome, restores the original bytes.
// Usage: node mut.mjs <spec.json> [id,id,...]
//   spec: [{ id, what, edits: [[file, from, to], ...], batteries: ["DL", ...] }]
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync, appendFileSync } from "node:fs";

const WT = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-173";
const OUTJ = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe173/out.json";
const H = (f) => `--max-old-space-size=${f}`;
const J = ["--reporter=json", `--outputFile=${OUTJ}`];
const BATTERIES = {
  DL: { argv: ["npm", "test"], env: {}, expect: "pass", file: `${WT}/.test-results/last-run.json` },
  OF: { argv: ["npx", "vitest", "run", "src/fen.test.ts", ...J], env: { NODE_OPTIONS: H(400) }, expect: "pass" },
  SF1: { argv: ["npx", "vitest", "run", "src/fen.test.ts", ...J], env: { NODE_OPTIONS: H(128) }, expect: "pass" },
  S128: { argv: ["npx", "vitest", "run", "src/fen.test.ts", "src/san.nfr.test.ts", ...J], env: { NODE_OPTIONS: H(128) }, expect: "pass" },
  UNS: { argv: ["npx", "vitest", "run", "src/fen.test.ts", "src/san.nfr.test.ts", ...J], env: {}, expect: "refused" },
  UNO: { argv: ["npx", "vitest", "run", "src/fen.test.ts", ...J], env: {}, expect: "refused" },
  S400: { argv: ["npx", "vitest", "run", "src/fen.test.ts", "src/san.nfr.test.ts", ...J], env: { NODE_OPTIONS: H(400) }, expect: "refused" },
  O450: { argv: ["npx", "vitest", "run", "src/fen.test.ts", ...J], env: { NODE_OPTIONS: H(450) }, expect: "refused" },
  O500: { argv: ["npx", "vitest", "run", "src/fen.test.ts", ...J], env: { NODE_OPTIONS: H(500) }, expect: "refused" },
  CLI: { argv: ["npx", "vitest", "run", "src/cli.real-engine.test.ts", ...J], env: { CLI_DEEP: "1", NODE_OPTIONS: H(400) }, expect: "pass" },
  CLIS: { argv: ["npx", "vitest", "run", "src/cli.real-engine.test.ts", "src/fen.test.ts", ...J], env: { CLI_DEEP: "1", NODE_OPTIONS: H(128) }, expect: "pass" },
  A173: { argv: ["npx", "vitest", "run", "src/cli.test.ts", "-t", "ABC-173", ...J], env: { NODE_OPTIONS: H(400) }, expect: "pass" },
  A173U: { argv: ["npx", "vitest", "run", "src/cli.test.ts", "-t", "ABC-173", ...J], env: {}, expect: "refused" },
  CLIT: { argv: ["npx", "vitest", "run", "src/cli.test.ts", ...J], env: { NODE_OPTIONS: H(400) }, expect: "pass" },
};

const baseEnv = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !(k === "NODE_OPTIONS" || k.endsWith("_DEEP") || k.startsWith("VITEST"))),
);

const run = (name) => {
  const b = BATTERIES[name];
  const file = b.file ?? OUTJ;
  rmSync(file, { force: true });
  const r = spawnSync(b.argv[0], b.argv.slice(1), { cwd: WT, env: { ...baseEnv, ...b.env }, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: 600_000 });
  const text = `${r.stdout}\n${r.stderr}`;
  let j;
  try { j = JSON.parse(readFileSync(file, "utf8")); } catch { j = undefined; }
  const failed = j ? j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => a.fullName ?? a.title)) : [];
  let cls;
  if (/heap-guard: refused/.test(text)) cls = r.status !== 0 ? "refused" : "refused-exit0?!";
  else if (r.status === 0 && j && j.numFailedTests === 0 && j.numTotalTests > 0) cls = "pass";
  else if (failed.length) cls = "red";
  else cls = "other";
  const firstErr = (text.match(/(Error[^\n]{0,200})/) ?? [])[1] ?? "";
  return { name, exit: r.status, cls, expect: b.expect, total: j?.numTotalTests, failed: failed.slice(0, 4), nfailed: failed.length, err: cls === "other" || cls === "refused" ? firstErr.slice(0, 220) : undefined };
};

const spec = JSON.parse(readFileSync(process.argv[2], "utf8"));
const only = process.argv[3]?.split(",");
const LOG = process.argv[2].replace(/\.json$/, ".log");
for (const m of spec) {
  if (only && !only.includes(m.id)) continue;
  const originals = new Map();
  let bad = false;
  for (const [f, from, to] of m.edits ?? []) {
    const p = `${WT}/${f}`;
    const cur = readFileSync(p, "utf8");
    if (!originals.has(p)) originals.set(p, cur);
    const n = cur.split(from).length - 1;
    if (n !== 1) { bad = true; console.log(`${m.id} BAD-PATTERN ${f} count=${n}`); break; }
    writeFileSync(p, cur.replace(from, to));
  }
  const results = [];
  if (!bad) for (const name of m.batteries) results.push(run(name));
  for (const [p, c] of originals) writeFileSync(p, c);
  const diffs = results.filter((r) => r.cls !== r.expect).map((r) => r.name);
  const verdict = bad ? "BAD-PATTERN" : m.edits?.length ? (diffs.length ? `KILLED by ${diffs.join(",")}` : "SURVIVED") : (diffs.length ? `CONTROL-FAIL ${diffs.join(",")}` : "CONTROL-OK");
  const line = { id: m.id, what: m.what, verdict, results };
  console.log(JSON.stringify(line));
  appendFileSync(LOG, `${JSON.stringify(line)}\n`);
}
