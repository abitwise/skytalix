// `N8-LANE`: `A5`'s LANDED DELTA, measured on `ADR-0008` decision 4's protocol exactly as ratified —
// CPU (user + sys), net of the measured per-file floor, MEDIAN OF PAIRED PER-ROUND DELTAS,
// n >= 7 INTERLEAVED rounds with the order alternating each round, ONE FRESH PROCESS per run,
// IDENTITY NULL CONTROL MANDATORY, scope = every file the branch adds under `src/` (this branch
// adds none, so the ~160 ms-per-file floor term is ZERO by construction, not small).
//
// `A5` = both halves. The comment half is comment text and executes nothing; the test half is the
// `it.each` table. WITH = this tip (752 tests). WITHOUT = this tip with `A5`'s block removed (750).
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const PRISTINE = join(HERE, "pristine");

const A5_START = "  /**\n   * `A5`'S TABLE — ONE ROW PER EDIT SHAPE, AND THE ROW IS THE UNIT OF EXTENSION.";
const A5_END = "  });\n});\n";

function tree(name, { removeA5 = false } = {}) {
  const root = join(HERE, "n8", name);
  rmSync(root, { recursive: true, force: true });
  mkdirSync(root, { recursive: true });
  cpSync(join(PRISTINE, "src"), join(root, "src"), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(PRISTINE, file), join(root, file));
  }
  symlinkSync(join(PRISTINE, "node_modules"), join(root, "node_modules"));
  if (removeA5) {
    const path = join(root, "src/history-pane.test.ts");
    const text = readFileSync(path, "utf8");
    const start = text.indexOf(A5_START);
    if (start < 0) throw new Error("A5 block start anchor not found");
    if (!text.endsWith(A5_END)) throw new Error("A5 block end anchor not found");
    writeFileSync(path, `${text.slice(0, start)}});\n`);
  }
  return root;
}

function cpuOf(root) {
  // `/usr/bin/time -p` reports user and sys to 10 ms. One fresh process per run.
  const out = execFileSync(
    "/bin/sh",
    ["-c", `cd ${root} && /usr/bin/time -p npx vitest run >/dev/null 2>__t.txt; cat __t.txt`],
    { encoding: "utf8" },
  );
  const user = Number(/user\s+([0-9.]+)/.exec(out)?.[1]);
  const sys = Number(/sys\s+([0-9.]+)/.exec(out)?.[1]);
  if (!Number.isFinite(user) || !Number.isFinite(sys)) throw new Error(`no timing:\n${out}`);
  return user + sys;
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const withA5 = tree("with", {});
const withoutA5 = tree("without", { removeA5: true });
const nullA = tree("nullA", {});
const nullB = tree("nullB", {});

// The trees are what they claim to be, asserted before anything is timed.
const counts = {};
for (const [label, root] of [["with", withA5], ["without", withoutA5]]) {
  const report = join(root, "__n.json");
  try {
    execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`], {
      cwd: root,
      stdio: "pipe",
    });
  } catch { /* reported below */ }
  const json = JSON.parse(readFileSync(report, "utf8"));
  counts[label] = `${json.numFailedTests} failed / ${json.numTotalTests} on ${json.testResults.length} files`;
}
console.log(`tree WITH     ${counts.with}`);
console.log(`tree WITHOUT  ${counts.without}`);
console.log(
  `null control  ${execFileSync("/bin/sh", ["-c", `/usr/bin/diff -r ${nullA}/src ${nullB}/src && echo "IDENTICAL (diff -r exit 0)"`], { encoding: "utf8" }).trim()}`,
);

const rounds = Number(process.argv[2] ?? 8);
const deltas = [];
const nulls = [];
for (let round = 0; round < rounds; round++) {
  // Interleaved, with the order alternating each round.
  const forward = round % 2 === 0;
  const a = cpuOf(forward ? withA5 : withoutA5);
  const b = cpuOf(forward ? withoutA5 : withA5);
  const delta = forward ? a - b : b - a;
  const c = cpuOf(forward ? nullA : nullB);
  const d = cpuOf(forward ? nullB : nullA);
  const nullDelta = forward ? c - d : d - c;
  deltas.push(delta);
  nulls.push(nullDelta);
  console.log(
    `round ${round + 1}  delta ${delta.toFixed(3)} s CPU   null ${nullDelta.toFixed(3)} s CPU`,
  );
}

const signs = (values) => `${values.filter((v) => v > 0).length}+ / ${values.filter((v) => v < 0).length}-`;
console.log(`\nn                 ${rounds}`);
console.log(`median delta      ${median(deltas).toFixed(3)} s CPU   signs ${signs(deltas)}`);
console.log(`median null       ${median(nulls).toFixed(3)} s CPU   signs ${signs(nulls)}`);
console.log(`null spread       ${Math.min(...nulls).toFixed(3)} .. ${Math.max(...nulls).toFixed(3)} s CPU`);
console.log(`delta spread      ${Math.min(...deltas).toFixed(3)} .. ${Math.max(...deltas).toFixed(3)} s CPU`);
