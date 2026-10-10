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
// WHAT THE TRACKED SET OMITS, AND WHY THE OMISSION IS WRITTEN HERE (`ABC-130`, 2026-10-10):
// `.grugops/` is factory state — the shared context's notes and the probes some hops commit beside
// them — and the lane excludes it on purpose (`".grugops/**"` in `test.exclude`). A tracked
// `*.test.ts` probe there is correct, not a dropped test, so the tracked set leaves `.grugops/`
// out by the fixed pathspec `OMITTED_FROM_TRACKED` below. Before this, every committed probe
// turned this tool red (three did, from 2026-09-24), and an always-red control hides the red it
// exists for. The pathspec is a LITERAL in this file and is never read from `vitest.config.ts`:
// if the expectation came from the config, the very `test.exclude` edit it guards would move it.
// So when that glob IS removed and the lane collects a `.grugops/` file, the tool still goes red
// and names the path with its own line (whether git tracks the file is beside the point there).
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

// The directory the lane excludes on purpose and this tool therefore never expects. A literal,
// never built from argv, the environment or the config (see the header).
const OMITTED_DIR = ".grugops/";
const OMITTED_FROM_TRACKED = `:!${OMITTED_DIR}`;

// What git records: every tracked `*.test.ts` outside `.grugops/`, repository-relative.
// NUL-separated so a path with a space or a newline cannot split or merge entries.
const tracked = new Set(
  runOrExit("git", ["ls-files", "-z", "--", "*.test.ts", OMITTED_FROM_TRACKED], root)
    .split("\0")
    .filter(Boolean),
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
  if (path.startsWith(OMITTED_DIR)) {
    findings.push(
      `Collected by the lane from ${OMITTED_DIR}, which is factory state the lane must exclude: ${path} — restore the \`"${OMITTED_DIR}**"\` glob in vitest.config.ts's \`test.exclude\`.`,
    );
  } else if (!tracked.has(path)) {
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
