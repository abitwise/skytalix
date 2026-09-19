// lane-inventory.js — asserts WHAT THE TEST LANE COLLECTS, not what its config's types are.
//
// `ABC-118` (2026-09-19). `vitest.config.ts`'s `test.exclude` is a `string[]`, so every glob in
// it is type-valid and the two static tools `ABC-050` pointed at that file (`tsc`, Biome) cannot
// see a wrong VALUE. Measured at the cut: one added glob silently drops a guard file from the
// lane (40 -> 39, four gates green); a one-character typo in `".claude/**"` silently DOUBLES
// the lane by collecting a git-ignored agent worktree's tests as if they were this repository's
// (40 -> 80, four gates green). This script is the one thing that sees either.
//
// HOW IT STAYS TRUE WITHOUT A HARD-CODED COUNT: the expectation is derived from git, never
// written down. The set vitest collects (`vitest list --filesOnly`, at the repository root —
// the `npm test` form, which is the one that can inflate) must equal the set of `*.test.ts`
// files git tracks (`git ls-files`). A merge that brings a new test file brings it into both
// sets at once, so nothing goes stale; a new UNTRACKED test file is collected but not tracked,
// so the check goes RED until it is `git add`ed or deleted — the git index is the recorded
// expectation, and the commit that adds the file is the stated reason.
//
// WHY IT LIVES HERE AND NOT IN THE LANE: a guard inside the lane can be removed by the very edit
// it guards — a type-valid glob naming the guard file deletes it, silently, with all four gates
// green (measured at the cut). A `.js` under `tools/` is not collected by vitest, so no
// `test.exclude` entry can reach it. THE LIMIT, stated rather than smoothed: this is a FIFTH
// step, like `test-skip-integrity.js`, not one of `quality.mandatory_gates`. It catches the
// defect only when it is run; the four gates alone stay green either way.
//
// Contract (the shape `test-skip-integrity.js` uses):
//   node tools/grugops/lane-inventory.js
//     exit 0 -> the collected set equals the tracked set
//     exit 1 -> mismatch; every missing or extra path is named (paths only, never contents —
//               the tree it lists includes git-ignored agent worktrees)
//     exit 2 -> could not run (git or vitest failed), distinguishable from a clean fail
//
// Imports node: builtins only, so it runs wherever `node` and the project's `node_modules` are.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

function runOrExit(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error || r.status !== 0) {
    process.stderr.write(
      `Error: \`${[cmd, ...args].join(" ")}\` failed${r.error ? ` (${r.error.message})` : ` with exit ${r.status}`}.\n${r.stderr ?? ""}`,
    );
    process.exit(2);
  }
  return r.stdout;
}

const root = runOrExit("git", ["rev-parse", "--show-toplevel"], process.cwd()).trim();

const vitestCli = join(root, "node_modules", "vitest", "vitest.mjs");
if (!existsSync(vitestCli)) {
  process.stderr.write(`Error: vitest is not installed at ${vitestCli}; run npm install first.\n`);
  process.exit(2);
}

// What git records: every tracked `*.test.ts`, repository-relative. NUL-separated so a path
// with a space or a newline cannot split or merge entries.
const tracked = new Set(
  runOrExit("git", ["ls-files", "-z", "--", "*.test.ts"], root).split("\0").filter(Boolean),
);

// What the lane collects: vitest's own collector at the repository root, files only, nothing
// run. Vitest prints one repository-relative path per line.
const collected = new Set(
  runOrExit(process.execPath, [vitestCli, "list", "--filesOnly"], root)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
);

const findings = [];
for (const path of [...tracked].sort()) {
  if (!collected.has(path)) {
    findings.push(
      `Tracked by git but NOT collected by the lane: ${path} — a \`test.exclude\` glob in vitest.config.ts is dropping it.`,
    );
  }
}
for (const path of [...collected].sort()) {
  if (!tracked.has(path)) {
    findings.push(
      `Collected by the lane but NOT tracked by git: ${path} — \`git add\` it, delete it, or repair the \`test.exclude\` glob that let it in.`,
    );
  }
}

console.log(`The lane collects ${collected.size} test files; git tracks ${tracked.size}.`);
if (findings.length > 0) {
  for (const f of findings) console.log(f);
  process.exit(1);
}
console.log("No findings.");
process.exit(0);
