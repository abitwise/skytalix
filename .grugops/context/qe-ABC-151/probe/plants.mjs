// QE ABC-151: re-plant the A7 pin's reds (k = 2) on fresh out-of-tree copies of the head. Times nothing.
// usage: node plants.mjs <repoRoot> <sha> <workDir> [only-id]
// Adapted from .grugops/context/qe-ABC-144/probe/plants.mjs (same method, literals at 2).
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo, sha, work, only] = process.argv.slice(2);
const CAP = '    pool: "threads",\n    maxWorkers: 2,\n';
const add = (line) => (s) => swap(s, CAP, `${CAP}${line}\n`);
const mw = (v) => (s) => swap(s, "    maxWorkers: 2,\n", `    maxWorkers: ${v},\n`);

const plants = [
  { id: "control", note: "unmodified head", want: "GREEN" },
  // ADR-0040 addendum 2 item 4 (the armed reds) and the two greens
  { id: "r1", note: "delete maxWorkers: 2", cfg: (s) => swap(s, CAP, '    pool: "threads",\n'), want: "RED" },
  { id: "r2", note: "add isolate: false", cfg: add("    isolate: false,"), want: "RED" },
  { id: "r3", note: "VITEST_MAX_THREADS=8", env: { VITEST_MAX_THREADS: "8" }, want: "RED" },
  { id: "r3b", note: "VITEST_MAX_THREADS=3 (the stale <= 3 boundary)", env: { VITEST_MAX_THREADS: "3" }, want: "RED" },
  { id: "raise3", note: "maxWorkers: 3 (a revert of this ticket)", cfg: mw("3"), want: "RED" },
  { id: "lower2", note: "VITEST_MAX_THREADS=2 (equal, may stay)", env: { VITEST_MAX_THREADS: "2" }, want: "GREEN" },
  { id: "lower1", note: "VITEST_MAX_THREADS=1 (may lower)", env: { VITEST_MAX_THREADS: "1" }, want: "GREEN" },
  // QE's extras: the ABC-144 set re-targeted at 2, plus the parser edges
  { id: "x1", note: "maxWorkers: 4 (breaks pick + decision 2)", cfg: mw("4"), want: "RED" },
  { id: "x2", note: "add fileParallelism: false", cfg: add("    fileParallelism: false,"), want: "RED" },
  { id: "x3", note: "add poolOptions.threads.maxThreads: 2 (same value, forbidden key)", cfg: add("    poolOptions: { threads: { maxThreads: 2 } },"), want: "RED" },
  { id: "x3b", note: "add poolOptions.threads.maxThreads: 8", cfg: add("    poolOptions: { threads: { maxThreads: 8 } },"), want: "RED" },
  { id: "x4", note: "VITEST_MAX_FORKS=3", env: { VITEST_MAX_FORKS: "3" }, want: "RED" },
  { id: "x4b", note: "VITEST_MAX_FORKS=8", env: { VITEST_MAX_FORKS: "8" }, want: "RED" },
  { id: "q1", note: 'pool: "forks"', cfg: (s) => swap(s, 'pool: "threads",', 'pool: "forks",'), want: "RED" },
  { id: "q2", note: 'maxWorkers: "50%"', cfg: mw('"50%"'), want: "RED" },
  { id: "q2b", note: 'maxWorkers: "2" (string)', cfg: mw('"2"'), want: "RED" },
  { id: "q3", note: "maxWorkers: 1 (a lowering in config is a ruling too)", cfg: mw("1"), want: "RED" },
  { id: "q4", note: "poolOptions.threads.isolate: false", cfg: add("    poolOptions: { threads: { isolate: false } },"), want: "RED" },
  { id: "q6", note: "add minWorkers: 8", cfg: add("    minWorkers: 8,"), want: "RED" },
  { id: "q8", note: "VITEST_MAX_THREADS=abc (NaN)", env: { VITEST_MAX_THREADS: "abc" }, want: "RED" },
  { id: "q11", note: "VITEST_MAX_THREADS=0x3 (vitest parseInt no radix -> 3; pin radix 10 -> 0)", env: { VITEST_MAX_THREADS: "0x3" }, want: "?" },
  { id: "q11b", note: "VITEST_MAX_THREADS=0x8", env: { VITEST_MAX_THREADS: "0x8" }, want: "?" },
  { id: "q12", note: "VITEST_MAX_THREADS=3abc (both parsers -> 3)", env: { VITEST_MAX_THREADS: "3abc" }, want: "RED" },
  { id: "q13", note: "VITEST_MAX_THREADS= (empty; vitest ignores it)", env: { VITEST_MAX_THREADS: "" }, want: "?" },
  { id: "q14", note: "VITEST_MAX_THREADS=' 3' (leading space)", env: { VITEST_MAX_THREADS: " 3" }, want: "RED" },
  { id: "q9", note: "CLI --maxWorkers=8 on the narrow set (QE-144-b route)", args: ["--maxWorkers=8"], want: "?" },
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
  let anchor = "-";
  if (p.cfg) {
    const f = join(dir, "vitest.config.ts");
    const before = readFileSync(f, "utf8");
    const after = p.cfg(before);
    anchor = after === before ? "NO-CHANGE" : "hit-1";
    writeFileSync(f, after);
  }
  const env = { ...process.env, ...(p.env ?? {}) };
  const pin = spawnSync("npx", ["vitest", "run", "src/cli.test.ts", "-t", "ABC-144", ...(p.args ?? [])], { cwd: dir, env, encoding: "utf8" });
  const out = `${pin.stdout}\n${pin.stderr}`;
  // Prefer a named error; the generic "Error" fallback otherwise catches vitest's "Errors  1 error" summary
  // (q6/q8's first pass recorded that summary; they were re-run with this line, see plants.out.tsv).
  const msg = (out.match(/(AssertionError|RangeError|TypeError)[^\n]*/) ?? out.match(/Error[^\n]*/) ?? [""])[0].slice(0, 160);
  const tally = (out.match(/Tests\s+[^\n]*/) ?? [""])[0].trim();
  const pr = spawnSync("node", [probe], { cwd: dir, env, encoding: "utf8" });
  let eff = "probe-error";
  try {
    const j = JSON.parse(pr.stdout.trim().split("\n").pop());
    eff = `eff=${j.effectiveWorkers} isolate=${j.isolate} threadsMax=${j.threadsMaxThreads}`;
  } catch {
    eff = `probe-error: ${(pr.stderr || pr.stdout).split("\n").find((l) => /Error/.test(l)) ?? ""}`.slice(0, 120);
  }
  const got = pin.status === 0 ? "GREEN" : "RED";
  const match = p.want === "?" ? "observe" : got === p.want ? "as-designed" : "UNEXPECTED";
  console.log([p.id, `exit=${pin.status}`, got, match, anchor, tally, msg, eff, p.note].join("\t"));
  rmSync(dir, { recursive: true, force: true });
}
