// ABC-127 build probe (A3): QE's 17 weakenings, planted one at a time into the worktree, each run
// through `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`, then reverted with `git checkout`;
// `git status --porcelain src` must be empty after every run.
// The edits are QE's, read verbatim from `.grugops/context/qe-ABC-084/probe/weakenings.mjs` (its
// `M` table, evaluated as text), so this harness cannot drift from QE's.
// Also checks A5: the NEWLY-MISSED lines must name exactly the rows the run missed that the
// baseline records as solved.
// Run from the worktree root: node .grugops/context/ticket-to-pr-ABC-127/probe/a3-weakenings.mjs [ids...]
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const text = readFileSync(".grugops/context/qe-ABC-084/probe/weakenings.mjs", "utf8");
const start = text.indexOf("const M = [");
const M = new Function(`${text.slice(start, text.indexOf("];", start) + 2)}; return M;`)();
const OUT = ".grugops/context/ticket-to-pr-ABC-127/probe/a3-weakenings.out.jsonl";
const baseline = JSON.parse(readFileSync("src/puzzle-suite.baseline.json", "utf8"));
const recorded = new Set(baseline.unsolved);
const want = process.argv.slice(2);
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" });
const load = () => sh("sysctl", ["-n", "vm.loadavg"]).trim();

for (const [id, file, from, to, count] of M) {
  if (want.length > 0 && !want.includes(id.split("-")[0])) continue;
  const original = readFileSync(file, "utf8");
  const hits = original.split(from).length - 1;
  if (hits !== count) throw new Error(`${id}: expected ${count} match(es) in ${file}, found ${hits}`);
  writeFileSync(file, original.split(from).join(to));
  const startedAt = new Date().toISOString();
  const loadBefore = load();
  const t0 = performance.now();
  let r;
  try {
    r = spawnSync("npx", ["vitest", "run", "src/puzzle-suite.test.ts"], {
      encoding: "utf8",
      env: { ...process.env, PUZZLE_DEEP: "1" },
    });
  } finally {
    sh("git", ["checkout", "--", file]);
  }
  const wall = ((performance.now() - t0) / 1000).toFixed(1);
  const dirty = sh("git", ["status", "--porcelain", "src"]).trim();
  if (dirty !== "") throw new Error(`src not clean after ${id}: ${dirty}`);
  const out = `${r.stdout}${r.stderr}`;
  const summary = out.match(/PUZZLES shipped: solved (\d+)\/(\d+)/);
  const missed = [...out.matchAll(/^MISSED\t([\w-]+)\t\S+\t\S+\t\S+\t(.+)$/gm)].map((m) => m[2]);
  const newlyMissed = [...out.matchAll(/^NEWLY-MISSED\t\S+\t\S+\t(.+)$/gm)].map((m) => m[1]);
  const newlySolved = [...out.matchAll(/^NEWLY-SOLVED\t\S+\t\S+\t(.+)$/gm)].map((m) => m[1]);
  const expectNewly = missed.filter((n) => !recorded.has(n));
  const a5 = JSON.stringify([...newlyMissed].sort()) === JSON.stringify([...expectNewly].sort());
  const failed = [...out.matchAll(/^ {3}× (.+?)(?: \d+ms)?$/gm)].map((m) => m[1].trim());
  const tests = out.match(/Tests {2}(.+)/)?.[1]?.trim() ?? null;
  const rec = {
    id, file, startedAt, loadBefore, wallS: Number(wall), exit: r.status,
    solved: summary ? Number(summary[1]) : null, total: summary ? Number(summary[2]) : null,
    baseline: baseline.solved, red: r.status !== 0,
    tests, failedRows: failed, newlyMissed, newlySolved, a5NewlyMissedExact: a5,
  };
  appendFileSync(OUT, `${JSON.stringify(rec)}\n`);
  console.log(
    `${id}\texit ${r.status}\tsolved ${rec.solved}/${rec.total} (baseline ${baseline.solved})\t` +
      `newly-missed ${newlyMissed.length} newly-solved ${newlySolved.length}\tA5 ${a5 ? "exact" : "MISMATCH"}\t${wall}s\tload ${loadBefore}`,
  );
}
console.log("src clean:", sh("git", ["status", "--porcelain", "src"]).trim() === "");
