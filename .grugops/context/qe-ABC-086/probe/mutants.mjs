// QE probe (qe-ABC-086, focus 3/4/5): plant each mutant in a SCRATCH COPY of the tree (never the
// worktree's src/), assert the patch applied, run the named rows of src/engine.test.ts, record
// every ABC-086 row's status, restore the pristine file. argv: <scratch-root> <src-root> [ids...]
// Output: one JSON line per mutant.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [scratch, srcRoot, ...only] = process.argv.slice(2);
const VC = "src/virtual-clock.ts";
const ET = "src/engine.test.ts";
const EN = "src/engine.ts";
const TR = "src/transposition.ts";
const DEFAULT_ROWS = "ABC-086";
const DEEP_A1 = "ABC-086 A1 — 30";
const DEEP_A6 = "ABC-086 A6 — two";

const rep = (from, to) => (s) => {
  if (!s.includes(from)) throw new Error(`patch did not apply: ${from.slice(0, 60)}`);
  return s.replace(from, to);
};
const clockBody = "  let reading = 0;\n  return () => {\n    const current = reading;\n    reading += stepMs;\n    return current;\n  };";

const MUTANTS = [
  // --- src/virtual-clock.ts ------------------------------------------------------------------
  { id: "M1-first-reading-is-step", file: VC, t: rep("    const current = reading;\n    reading += stepMs;\n    return current;", "    reading += stepMs;\n    return reading;"), rows: DEFAULT_ROWS },
  { id: "M2-guard-accepts-0", file: VC, t: rep("stepMs > 0", "stepMs >= 0"), rows: DEFAULT_ROWS },
  { id: "M3-guard-drops-isFinite", file: VC, t: rep("Number.isFinite(stepMs) && stepMs > 0", "stepMs > 0"), rows: DEFAULT_ROWS },
  { id: "M4-shared-reading-module-state", file: VC, t: (s) => rep(clockBody, "  return () => {\n    const current = sharedReading;\n    sharedReading += stepMs;\n    return current;\n  };")(s).replace("export function virtualClock", "let sharedReading = 0;\nexport function virtualClock"), rows: DEFAULT_ROWS, deep: DEEP_A6 },
  { id: "M5-shared-step-module-state", file: VC, t: (s) => rep(clockBody, "  sharedStep = stepMs;\n  let reading = 0;\n  return () => {\n    const current = reading;\n    reading += sharedStep;\n    return current;\n  };")(s).replace("export function virtualClock", "let sharedStep = 1;\nexport function virtualClock"), rows: DEFAULT_ROWS, deep: DEEP_A6 },
  { id: "M6-step-doubled", file: VC, t: rep("reading += stepMs;", "reading += 2 * stepMs;"), rows: DEFAULT_ROWS },
  { id: "M7-jumps-after-third-read", file: VC, t: (s) => rep(clockBody, "  let reading = 0;\n  let reads = 0;\n  return () => {\n    const current = reading;\n    reads++;\n    reading += reads >= 3 ? 1_000_000 : stepMs;\n    return current;\n  };")(s), rows: DEFAULT_ROWS, deep: DEEP_A1.replace("— 30", "— 30") },
  { id: "M8-stray-Date.now-no-behaviour-change", file: VC, t: rep("    return current;", "    return current + (Date.now() & 0);"), rows: DEFAULT_ROWS },
  // --- the A1 / A6 rows (src/engine.test.ts) and the state they must see (src/engine.ts) -------
  { id: "R1-slice-clock-jumps-budget-in-one-read", file: ET, t: rep("chooseMove(parseFen(toFen(position)), { budgetMs, now: virtualClock(1) })", "chooseMove(parseFen(toFen(position)), { budgetMs, now: virtualClock(budgetMs) })"), rows: DEFAULT_ROWS },
  // R2 v1 removed `clearTable()` from `deepen` — MALFORMED: that call also allocates the table on
  // first use, so the file crashed at collection (TypeError in probeTable), a crash and not a
  // leak. v2 keeps the allocation and drops only the per-call wipe, so the table really leaks.
  { id: "R2-tt-not-wiped-between-calls", file: TR, t: rep("    return;\n  }\n  words.fill(0);\n}", "    return;\n  }\n}"), rows: DEFAULT_ROWS, deep: `${DEEP_A1}|${DEEP_A6}` },
  { id: "R3-A6-engines-share-one-clock", file: ET, t: rep("    const makeA = () => createEngine({ budgetMs: 1, now: virtualClock(1) });\n    const makeB = () => createEngine({ budgetMs: 3, now: virtualClock(1) });", "    let sharedClock = virtualClock(1);\n    const makeA = () => { sharedClock = virtualClock(1); return createEngine({ budgetMs: 1, now: () => sharedClock() }); };\n    const makeB = () => createEngine({ budgetMs: 3, now: () => sharedClock() });"), rows: "ABC-086 A6 — each", deep: DEEP_A6 },
  { id: "R4-A1-slice-not-fresh-one-clock-per-position", file: ET, t: rep("    const choices = Array.from({ length: runs }, () =>\n      chooseMove(parseFen(toFen(position)), { budgetMs, now: virtualClock(1) }),\n    );", "    const shared = virtualClock(1);\n    const choices = Array.from({ length: runs }, () =>\n      chooseMove(parseFen(toFen(position)), { budgetMs, now: shared }),\n    );"), rows: DEFAULT_ROWS },
];

function prepare() {
  if (existsSync(scratch)) rmSync(scratch, { recursive: true, force: true });
  mkdirSync(scratch, { recursive: true });
  for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts", "AGENTS.md"])
    cpSync(join(srcRoot, f), join(scratch, f), { recursive: true });
  symlinkSync(join(srcRoot, "node_modules"), join(scratch, "node_modules"));
}

function run(pattern, deep) {
  const env = { ...process.env };
  if (deep) env.ENGINE_DEEP = "1";
  else delete env.ENGINE_DEEP;
  const r = spawnSync("npx", ["vitest", "run", ET, "-t", pattern, "--reporter=json"], {
    cwd: scratch,
    env,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 600_000,
  });
  const json = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
  const rows = json.testResults
    .flatMap((f) => f.assertionResults)
    .filter((a) => a.status !== "skipped" && a.status !== "pending")
    .map((a) => ({ row: a.fullName, status: a.status }));
  return { exit: r.status, passed: json.numPassedTests, failed: json.numFailedTests, rows };
}

prepare();
const pristine = Object.fromEntries([VC, ET, EN, TR].map((f) => [f, readFileSync(join(scratch, f), "utf8")]));
const baseline = run(DEFAULT_ROWS, false);
console.log(JSON.stringify({ id: "BASELINE-default", ...baseline }));
for (const m of MUTANTS) {
  if (only.length > 0 && !only.includes(m.id)) continue;
  const mutated = m.t(pristine[m.file]);
  writeFileSync(join(scratch, m.file), mutated);
  const diff = spawnSync("git", ["diff", "--no-index", "--unified=0", "--", join(srcRoot, m.file), join(scratch, m.file)], { encoding: "utf8" }).stdout;
  const out = { id: m.id, file: m.file, patch: diff.split("\n").filter((l) => /^[+-][^+-]/.test(l)), default: run(m.rows, false) };
  if (m.deep) out.deep = run(m.deep, true);
  console.log(JSON.stringify(out));
  writeFileSync(join(scratch, m.file), pristine[m.file]);
}
execFileSync("git", ["diff", "--no-index", "--quiet", "--", join(srcRoot, "src"), join(scratch, "src")]);
console.log(JSON.stringify({ id: "RESTORED", note: "scratch src/ byte-identical to worktree src/ after the run" }));
