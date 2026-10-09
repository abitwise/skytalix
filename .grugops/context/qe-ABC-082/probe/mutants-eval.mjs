// QE probe (qe-ABC-082): QE's OWN mutants of src/evaluate.ts's pawn term, each planted in a fresh
// scratch copy of the build tree (never the worktree), then read by (1) the ticket's own suites
// src/evaluate.pawns.test.ts + src/evaluate.test.ts and (2) QE's terms.ts probe.
// Usage: node mutants-eval.mjs <base-tree> <branch-tree> <scratch-dir> <probe-dir> [full [name-regex]]
//   "full": read each mutant by the WHOLE default lane (every src test file) instead of the
//   ticket's two suites — what else on the default lane happens to catch it.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";

const [baseTree, branchTree, scratch, probeDir, mode, only] = process.argv.slice(2);
const full = mode === "full";

const MUTANTS = [
  ["E1 sign: black doubled penalty flipped", "if ((blackFiles & bit) !== 0) score += DOUBLED_PAWN_PENALTY;", "if ((blackFiles & bit) !== 0) score -= DOUBLED_PAWN_PENALTY;"],
  ["E2 sign: black passed bonus flipped", "score -= PASSED_PAWN_BONUS[7 - rank] as number;", "score += PASSED_PAWN_BONUS[7 - rank] as number;"],
  ["E3 sign: black isolated penalty flipped", "if ((blackFiles & adjacentFiles(file)) === 0) score += ISOLATED_PAWN_PENALTY;", "if ((blackFiles & adjacentFiles(file)) === 0) score -= ISOLATED_PAWN_PENALTY;"],
  ["E4 off-by-one rank: black passed index 6-rank", "PASSED_PAWN_BONUS[7 - rank]", "PASSED_PAWN_BONUS[6 - rank]"],
  ["E5 off-by-one rank, BOTH colours (mirror-consistent)", [["PASSED_PAWN_BONUS[rank] as number", "PASSED_PAWN_BONUS[rank - 1] as number"], ["PASSED_PAWN_BONUS[7 - rank]", "PASSED_PAWN_BONUS[6 - rank]"]]],
  ["E6 off-by-one rank: passed scan stops at rank 5", "rank >= 1 && rank <= 6; rank += step", "rank >= 1 && rank <= 5; rank += step"],
  ["E7 off-by-one rank: passed scan starts on own rank", "rank = rankOf(square) + step;", "rank = rankOf(square);"],
  ["E8 file-adjacency: isolated sees right-hand file only", "(((1 << file) << 1) | ((1 << file) >> 1)) & 0xff", "((1 << file) << 1) & 0xff"],
  ["E9 file-adjacency: isolated sees left-hand file only", "(((1 << file) << 1) | ((1 << file) >> 1)) & 0xff", "((1 << file) >> 1) & 0xff"],
  ["E10 file-adjacency: isolated counts own file as a neighbour", "(((1 << file) << 1) | ((1 << file) >> 1)) & 0xff", "(((1 << file) << 1) | (1 << file) | ((1 << file) >> 1)) & 0xff"],
  ["E11 file-adjacency: passed ignores right-hand file", "const toFile = file === 7 ? 7 : file + 1;", "const toFile = file;"],
  ["E12 file-adjacency: passed is a file-only check", [["const fromFile = file === 0 ? 0 : file - 1;", "const fromFile = file;"], ["const toFile = file === 7 ? 7 : file + 1;", "const toFile = file;"]]],
  ["E13 doubled pass skips the 2nd rank", "for (let rank = 1; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];", "for (let rank = 2; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];"],
  ["E14 colour cross: white isolation read from black's files", "if ((whiteFiles & adjacentFiles(file)) === 0) score -= ISOLATED_PAWN_PENALTY;", "if ((blackFiles & adjacentFiles(file)) === 0) score -= ISOLATED_PAWN_PENALTY;"],
  ["E15 edge clamp removed (a-file reads off-board left)", "const fromFile = file === 0 ? 0 : file - 1;", "const fromFile = file - 1;"],
];

const results = [];
for (const [name, ...edit] of MUTANTS) {
  if (only && !new RegExp(only).test(name)) continue;
  const edits = Array.isArray(edit[0]) ? edit[0] : [[edit[0], edit[1]]];
  const dir = `${scratch}/mut-eval`;
  rmSync(dir, { recursive: true, force: true });
  cpSync(branchTree, dir, { recursive: true, dereference: false, filter: (s) => !s.endsWith("node_modules") });
  if (!existsSync(`${dir}/node_modules`)) symlinkSync(`${branchTree}/node_modules`, `${dir}/node_modules`);
  const file = `${dir}/src/evaluate.ts`;
  let src = readFileSync(file, "utf8");
  for (const [from, to] of edits) {
    const n = src.split(from).length - 1;
    if (n < 1) throw new Error(`${name}: anchor not found: ${from}`);
    src = src.split(from).join(to);
  }
  writeFileSync(file, src);
  const suite = spawnSync(
    "npx",
    full
      ? ["vitest", "run", "--reporter=json"]
      : ["vitest", "run", "src/evaluate.pawns.test.ts", "src/evaluate.test.ts", "--reporter=json"],
    { cwd: dir, encoding: "utf8" },
  );
  let failed = "?";
  let failedNames = [];
  try {
    const j = JSON.parse(suite.stdout);
    failed = j.numFailedTests;
    failedNames = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => `${f.name.split("/src/")[1]} > ${a.title}`)).slice(0, full ? 12 : 4);
  } catch {}
  const probe = spawnSync("node", [`${probeDir}/terms.ts`, baseTree, branchTree, dir], { encoding: "utf8" });
  const last = probe.stdout.trim().split("\n").at(-1);
  let pj = {};
  try { pj = JSON.parse(last); } catch {}
  results.push({
    mutant: name,
    suiteExit: suite.status,
    suiteFailed: failed,
    suiteFailedNames: failedNames,
    probe: { exit: probe.status, handFail: pj.hand?.fail, mirrorFail: pj.mirrorFail, fileFlipFail: pj.fileFlipFail, referenceFail: pj.referenceFail },
  });
  console.log(JSON.stringify(results.at(-1)));
}
rmSync(`${scratch}/mut-eval`, { recursive: true, force: true });
