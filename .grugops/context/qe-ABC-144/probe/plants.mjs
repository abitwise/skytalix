// QE ABC-144: re-plant the A7 pin's reds on fresh out-of-tree copies of the head. Times nothing.
// usage: node plants.mjs <repoRoot> <sha> <workDir> [only-id]
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo, sha, work, only] = process.argv.slice(2);
const CAP = '    pool: "threads",\n    maxWorkers: 3,\n';

const plants = [
  { id: "control", note: "unmodified head" },
  { id: "r1", note: "delete maxWorkers: 3", cfg: (s) => swap(s, CAP, '    pool: "threads",\n') },
  { id: "r2", note: "add isolate: false", cfg: (s) => swap(s, CAP, `${CAP}    isolate: false,\n`) },
  { id: "r3", note: "VITEST_MAX_THREADS=8", env: { VITEST_MAX_THREADS: "8" } },
  { id: "r3b", note: "VITEST_MAX_THREADS=4", env: { VITEST_MAX_THREADS: "4" } },
  { id: "x1", note: "maxWorkers: 4", cfg: (s) => swap(s, "maxWorkers: 3,", "maxWorkers: 4,") },
  { id: "x2", note: "add fileParallelism: false", cfg: (s) => swap(s, CAP, `${CAP}    fileParallelism: false,\n`) },
  { id: "x3", note: "add poolOptions.threads.maxThreads: 8", cfg: (s) => swap(s, CAP, `${CAP}    poolOptions: { threads: { maxThreads: 8 } },\n`) },
  { id: "x4", note: "VITEST_MAX_FORKS=8", env: { VITEST_MAX_FORKS: "8" } },
  { id: "lower", note: "VITEST_MAX_THREADS=2 (may lower)", env: { VITEST_MAX_THREADS: "2" } },
  { id: "lower3", note: "VITEST_MAX_THREADS=3 (boundary, equal)", env: { VITEST_MAX_THREADS: "3" } },
  // QE's own
  { id: "q1", note: 'pool: "forks"', cfg: (s) => swap(s, 'pool: "threads",', 'pool: "forks",') },
  { id: "q2", note: 'maxWorkers: "50%"', cfg: (s) => swap(s, "maxWorkers: 3,", 'maxWorkers: "50%",') },
  { id: "q3", note: "maxWorkers: 2 (a lowering is a ruling too)", cfg: (s) => swap(s, "maxWorkers: 3,", "maxWorkers: 2,") },
  { id: "q4", note: "poolOptions.threads.isolate: false", cfg: (s) => swap(s, CAP, `${CAP}    poolOptions: { threads: { isolate: false } },\n`) },
  { id: "q5", note: "projects: [{ extends: true, test: { name: 'p', isolate: false } }]", cfg: (s) => swap(s, CAP, `${CAP}    projects: [{ extends: true, test: { name: "p", isolate: false } }],\n`) },
  { id: "q5b", note: "projects: [{ extends: true, test: { name: 'p', poolOptions: { threads: { isolate: false } } } }]", cfg: (s) => swap(s, CAP, `${CAP}    projects: [{ extends: true, test: { name: "p", poolOptions: { threads: { isolate: false } } } }],\n`) },
  { id: "q6", note: "add minWorkers: 8", cfg: (s) => swap(s, CAP, `${CAP}    minWorkers: 8,\n`) },
  { id: "q7", note: "VITEST_MIN_THREADS=8", env: { VITEST_MIN_THREADS: "8" } },
  { id: "q8", note: "VITEST_MAX_THREADS=abc (NaN)", env: { VITEST_MAX_THREADS: "abc" } },
  { id: "q9", note: "CLI --maxWorkers=8 on the narrow set", args: ["--maxWorkers=8"] },
  { id: "q10", note: "maxWorkers: process.env.VITEST_WORKER_ID ? 3 : 8 (worker sees 3, main resolves 8)", cfg: (s) => swap(s, "maxWorkers: 3,", "maxWorkers: process.env.VITEST_WORKER_ID ? 3 : 8,") },
];

function swap(s, from, to) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`plant anchor hit ${n} times: ${JSON.stringify(from)}`);
  return s.replace(from, to);
}

const probe = join(repo, ".grugops/context/design-ABC-144/probe/resolved-workers.mjs");
for (const p of plants) {
  if (only && p.id !== only) continue;
  const dir = join(work, p.id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  execFileSync("sh", ["-c", `git -C '${repo}' archive ${sha} | tar -x -C '${dir}'`]);
  symlinkSync(join(repo, "node_modules"), join(dir, "node_modules"));
  if (p.cfg) {
    const f = join(dir, "vitest.config.ts");
    writeFileSync(f, p.cfg(readFileSync(f, "utf8")));
  }
  const env = { ...process.env, ...(p.env ?? {}) };
  const pin = spawnSync("npx", ["vitest", "run", "src/cli.test.ts", "-t", "ABC-144", ...(p.args ?? [])], { cwd: dir, env, encoding: "utf8" });
  const out = `${pin.stdout}\n${pin.stderr}`;
  const msg = (out.match(/(AssertionError|RangeError|TypeError|Error)[^\n]*/) ?? [""])[0].slice(0, 160);
  const tally = (out.match(/Tests\s+[^\n]*/) ?? [""])[0].trim();
  const pr = spawnSync("node", [probe], { cwd: dir, env, encoding: "utf8" });
  let eff = "probe-error";
  try {
    const j = JSON.parse(pr.stdout.trim().split("\n").pop());
    eff = `eff=${j.effectiveWorkers} isolate=${j.isolate} threadsIsolate=${j.threadsIsolate}`;
  } catch {
    eff = `probe-error: ${(pr.stderr || pr.stdout).split("\n").find((l) => /Error/.test(l)) ?? ""}`.slice(0, 120);
  }
  console.log([p.id, `exit=${pin.status}`, pin.status === 0 ? "GREEN" : "RED", tally, msg, eff, p.note].join("\t"));
  rmSync(dir, { recursive: true, force: true });
}
