// qe-ABC-127 (A3, A5, A1 tags): QE's own sensitivity harness. The EDITS are QE-084's, verbatim (its
// `M` table is the page's definition of the 17 weakenings, so it is read, not retyped); everything
// else is written fresh and trusts nothing the build's harness or the runner's summary says:
// - each edit must match exactly its stated count, and `git diff --numstat` must show the file
//   changed before the run (a no-op plant would read as a "survivor");
// - solved / total are recomputed from the 62 per-row SOLVED/MISSED lines, and must agree with
//   the runner's own summary line;
// - NEWLY-MISSED / NEWLY-SOLVED are recomputed from those rows against the baseline's `unsolved`
//   and must equal, as sets, the lines the runner printed (A5);
// - the failing vitest rows are listed, so "red" means the gate row (and which others) went red;
// - tag truth: under W1 every `quiescence` row, under W5 every `depth≥5` row must be missed;
// - after every run the file is restored and `git diff --quiet HEAD -- src` plus an empty
//   `git status --porcelain src` are required, or the harness aborts. SIGINT/SIGTERM restore too.
// Run from the worktree root: node .grugops/context/qe-ABC-127/probe/qe-a3.mjs [W1 W1b ...]
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const P = ".grugops/context/qe-ABC-127/probe";
const OUT = `${P}/qe-a3.out.jsonl`;
const text = readFileSync(".grugops/context/qe-ABC-084/probe/weakenings.mjs", "utf8");
const from = text.indexOf("const M = [");
const M = new Function(`${text.slice(from, text.indexOf("];", from) + 2)}; return M;`)();
if (M.length !== 17) throw new Error(`expected 17 weakenings, read ${M.length}`);

const baseline = JSON.parse(readFileSync("src/puzzle-suite.baseline.json", "utf8"));
const unsolved = new Set(baseline.unsolved);
const corpus = readFileSync("src/puzzle-corpus.ts", "utf8");
const tagged = (tag) =>
  [...corpus.matchAll(/\{ name: "([^"]+)",[^\n]*tags: \[([^\]]*)\]/g)].filter((m) => m[2].includes(`"${tag}"`)).map((m) => m[1]);
const TAG_FOR = { W1: tagged("quiescence"), W5: tagged("depth≥5") };

const want = process.argv.slice(2);
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" });
const srcClean = () =>
  spawnSync("git", ["diff", "--quiet", "HEAD", "--", "src"]).status === 0 && sh("git", ["status", "--porcelain", "src"]).trim() === "";
if (!srcClean()) throw new Error("src is not clean before the first plant");

let planted = null;
const restore = () => {
  if (planted) { writeFileSync(planted.file, planted.original); sh("git", ["checkout", "--", planted.file]); planted = null; }
};
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => { restore(); process.exit(130); });

for (const [id, file, find, replace, count] of M) {
  const short = id.split("-")[0];
  if (want.length > 0 && !want.includes(short)) continue;
  const original = readFileSync(file, "utf8");
  const hits = original.split(find).length - 1;
  if (hits !== count) throw new Error(`${id}: expected ${count} match(es) in ${file}, found ${hits}`);
  planted = { file, original };
  writeFileSync(file, original.split(find).join(replace));
  const numstat = sh("git", ["diff", "--numstat", "--", file]).trim();
  if (numstat === "") { restore(); throw new Error(`${id}: plant changed nothing`); }
  const load = sh("sysctl", ["-n", "vm.loadavg"]).trim();
  const t0 = performance.now();
  let r;
  try {
    r = spawnSync("npx", ["vitest", "run", "src/puzzle-suite.test.ts"], {
      encoding: "utf8",
      env: { ...process.env, PUZZLE_DEEP: "1" },
      maxBuffer: 64 * 1024 * 1024,
    });
  } finally {
    restore();
  }
  const wallS = Number(((performance.now() - t0) / 1000).toFixed(1));
  if (!srcClean()) throw new Error(`src not clean after ${id}`);
  const out = `${r.stdout}${r.stderr}`;
  writeFileSync(`${P}/a3/${short}.rows.txt`, out.split("\n").filter((l) => /^(SOLVED|MISSED|NEWLY-)/.test(l)).join("\n") + "\n");
  const rows = [...out.matchAll(/^(SOLVED|MISSED)\t(\S+)\t(\S+)\td(\d+)\tn(\d+)\t(.+)$/gm)].map((m) => ({ ok: m[1] === "SOLVED", name: m[6] }));
  const solved = rows.filter((x) => x.ok).length;
  const summary = out.match(/PUZZLES shipped: solved (\d+)\/(\d+)/);
  const printedMissed = [...out.matchAll(/^NEWLY-MISSED\t\S+\t\S+\t(.+)$/gm)].map((m) => m[1]).sort();
  const printedSolved = [...out.matchAll(/^NEWLY-SOLVED\t\S+\t\S+\t(.+)$/gm)].map((m) => m[1]).sort();
  const myMissed = rows.filter((x) => !x.ok && !unsolved.has(x.name)).map((x) => x.name).sort();
  const mySolved = rows.filter((x) => x.ok && unsolved.has(x.name)).map((x) => x.name).sort();
  const a5 = JSON.stringify(myMissed) === JSON.stringify(printedMissed) && JSON.stringify(mySolved) === JSON.stringify(printedSolved);
  const failedTests = [...out.matchAll(/^\s+(?:×|✗)\s+(.+?)(?:\s+\d+ms)?$/gm)].map((m) => m[1].trim());
  const tagsFor = TAG_FOR[short];
  const tagTruth = tagsFor ? `${tagsFor.filter((n) => myMissed.includes(n)).length}/${tagsFor.length}` : null;
  const rec = {
    id, file, numstat, load, wallS, exit: r.status, rows: rows.length, solved,
    summaryAgrees: summary ? Number(summary[1]) === solved && Number(summary[2]) === rows.length : false,
    baseline: baseline.solved, gateRed: solved < baseline.solved, newlyMissed: myMissed, newlySolved: mySolved,
    a5PrintedEqualsRecomputed: a5, failedTests, tagTruth,
  };
  appendFileSync(OUT, `${JSON.stringify(rec)}\n`);
  console.log(
    `${short}\texit ${r.status}\tsolved ${solved}/${rows.length} (summary ${rec.summaryAgrees ? "agrees" : "DISAGREES"})\t` +
      `${rec.gateRed ? "RED" : "survives"}\tnewly-missed ${myMissed.length} newly-solved ${mySolved.length}\tA5 ${a5 ? "exact" : "MISMATCH"}\t` +
      `failed [${failedTests.length}]${tagTruth ? `\ttag truth ${tagTruth}` : ""}\t${wallS}s\tload ${load}`,
  );
}
console.log("src clean:", srcClean());
