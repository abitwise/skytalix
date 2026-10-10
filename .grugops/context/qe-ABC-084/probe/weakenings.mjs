// QE probe (qe-ABC-084, focus 2 / A3 sensitivity): plant SUBTLER weakenings than A3's constant
// evaluator into the shipped engine, one at a time, run the gating lane
// (PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts) and record solved / exit / missed rows.
// Each mutant is an exact string edit asserted to match the stated number of times; the file is
// restored with `git checkout` after each run and `git status --porcelain src` must be empty.
// Run from the worktree root: node .grugops/context/qe-ABC-084/probe/weakenings.mjs [ids...]
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const OUT = ".grugops/context/qe-ABC-084/probe/weakenings.out.jsonl";
const M = [
  ["W1-quiescence-off", "src/quiescence.ts", "export const QUIESCENCE_MAX_PLY = 8;", "export const QUIESCENCE_MAX_PLY = 0;", 1],
  ["W1b-engine-leaf-quiescence-off", "src/engine.ts", "return quiesce(position, alpha, beta, 0, budget.visit);", "return quiesce(position, alpha, beta, 8, budget.visit);", 1],
  ["W2-quiescence-1ply", "src/quiescence.ts", "export const QUIESCENCE_MAX_PLY = 8;", "export const QUIESCENCE_MAX_PLY = 1;", 1],
  ["W3-depth-cap-2", "src/engine.ts", "for (let iteration = 2; now() < budget.deadline; iteration++)", "for (let iteration = 2; now() < budget.deadline && iteration <= 2; iteration++)", 1],
  ["W4-depth-cap-3", "src/engine.ts", "for (let iteration = 2; now() < budget.deadline; iteration++)", "for (let iteration = 2; now() < budget.deadline && iteration <= 3; iteration++)", 1],
  ["W5-depth-cap-4", "src/engine.ts", "for (let iteration = 2; now() < budget.deadline; iteration++)", "for (let iteration = 2; now() < budget.deadline && iteration <= 4; iteration++)", 1],
  ["W6-swap-knight-rook-values", "src/evaluate.ts", "  320, // KNIGHT\n  330, // BISHOP\n  500, // ROOK", "  500, // KNIGHT\n  330, // BISHOP\n  320, // ROOK", 1],
  ["W7-queen-valued-300", "src/evaluate.ts", "  900, // QUEEN", "  300, // QUEEN", 1],
  ["W8-pawn-valued-300", "src/evaluate.ts", "  100, // PAWN", "  300, // PAWN", 1],
  ["W9-eval-sign-ignores-side", "src/evaluate.ts", "return position.blackToMove ? 0 - score : score;", "return score;", 1],
  ["W10-pst-off", "src/evaluate.ts", "((PIECE_SQUARE_TABLE[type] as readonly number[])[tableIndex] as number);", "0;", 1],
  ["W11-mate-score-ignores-ply", "src/engine.ts", "0 - (MATE_SCORE - ply)", "0 - MATE_SCORE", 2],
  ["W12-interior-mate-as-stalemate", "src/engine.ts", "if (moves.length === 0) return isInCheck(position) ? 0 - (MATE_SCORE - ply) : 0;", "if (moves.length === 0) return 0;", 1],
  ["W13-lmr-reduces-checks", "src/search.ts", "return givesCheck ? 0 : 1;", "return 1;", 1],
  ["W14-lmr-reduces-by-2", "src/search.ts", "return givesCheck ? 0 : 1;", "return givesCheck ? 0 : 2;", 1],
  ["W15-tt-accepts-shallower", "src/transposition.ts", "if (entryDepth(slot) !== depth) return null;", "if (entryDepth(slot) > depth) return null;", 1],
  ["W16-ordering-off", "src/search.ts", "    .sort((a, b) => b.key - a.key)\n", "", 1],
];

// `--default-lane`: run the DEFAULT lane (`npx vitest run --dir src`, no PUZZLE_DEEP) instead,
// to see whether anything outside the puzzle gate already catches the mutant.
const DEFAULT_LANE = process.argv.includes("--default-lane");
const OUT_FILE = DEFAULT_LANE ? OUT.replace(".out.jsonl", ".default-lane.out.jsonl") : OUT;
const want = process.argv.slice(2).filter((a) => a !== "--default-lane");
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" });
const load = () => sh("sysctl", ["-n", "vm.loadavg"]).trim();

for (const [id, file, from, to, count] of M) {
  if (want.length > 0 && !want.includes(id)) continue;
  const original = readFileSync(file, "utf8");
  const hits = original.split(from).length - 1;
  if (hits !== count) throw new Error(`${id}: expected ${count} match(es) in ${file}, found ${hits}`);
  writeFileSync(file, original.split(from).join(to));
  const startedAt = new Date().toISOString();
  const loadBefore = load();
  const t0 = performance.now();
  let r;
  try {
    const env = { ...process.env };
    delete env.PUZZLE_DEEP;
    r = DEFAULT_LANE
      ? spawnSync("npx", ["vitest", "run", "--dir", "src"], { encoding: "utf8", env })
      : spawnSync("npx", ["vitest", "run", "src/puzzle-suite.test.ts"], {
          encoding: "utf8",
          env: { ...env, PUZZLE_DEEP: "1" },
        });
  } finally {
    sh("git", ["checkout", "--", file]);
  }
  const wall = ((performance.now() - t0) / 1000).toFixed(1);
  const dirty = sh("git", ["status", "--porcelain", "src"]).trim();
  if (dirty !== "") throw new Error(`src not clean after ${id}: ${dirty}`);
  const out = `${r.stdout}${r.stderr}`;
  const summary = out.match(/PUZZLES shipped: solved (\d+)\/(\d+)/);
  const missed = [...out.matchAll(/^MISSED\t([\w-]+)\t(\S+)\t\S+\t\S+\t(.+)$/gm)].map((m) => `${m[1]}|${m[2]}|${m[3]}`);
  const failed = [...out.matchAll(/^ FAIL {2}(.+)$/gm)].map((m) => m[1].trim());
  const tests = out.match(/Tests {2}(.+)/)?.[1]?.trim() ?? null;
  const rec = {
    id, file, startedAt, loadBefore, wallS: Number(wall), exit: r.status,
    solved: summary ? Number(summary[1]) : null, total: summary ? Number(summary[2]) : null,
    missedByKind: Object.fromEntries(["mate-in-2", "win-material", "do-not-hang"].map((k) => [k, missed.filter((x) => x.startsWith(k)).length])),
    tests, failedRows: failed, missed,
  };
  appendFileSync(OUT_FILE, `${JSON.stringify(rec)}\n`);
  console.log(`${id}\texit ${r.status}\t${tests}\tsolved ${rec.solved}/${rec.total}\t${JSON.stringify(rec.missedByKind)}\t${wall}s\tload ${loadBefore}`);
}
console.log("src clean:", sh("git", ["status", "--porcelain", "src"]).trim() === "");
