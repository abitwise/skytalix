// QE ABC-024 — independent mutant harness (written by QE, not derived from probe/harness.mjs).
// Usage: node qe-harness.mjs <tree-dir> <out-dir> [mutant-id ...]
// One fresh tsc process and one fresh vitest process per tree state; PERFT_DEEP and every *_DEEP removed.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const [tree, outDir, ...only] = process.argv.slice(2);
const MOVES = join(tree, "src/moves.ts");
const PRISTINE_MD5 = "6335b452fc21ffe2d0f902ecab930840";
const pristine = readFileSync(MOVES, "utf8");
const md5 = (s) => createHash("md5").update(s).digest("hex");
if (md5(pristine) !== PRISTINE_MD5) throw new Error(`pristine md5 mismatch: ${md5(pristine)}`);

const RIGHT = "    if ((position.castling & option.right) === 0) continue;\n";
const KINGG = "    if (position.board[option.kingFrom] !== king) continue;\n";
const ROOKG = "    if (position.board[option.rookFrom] !== rook) continue;\n";
const EMPTYG = "    if (option.empty.some((square) => position.board[square] !== EMPTY)) continue;\n";
const PATHG =
  "    if (option.kingPath.some((square) => isSquareAttackedBy(position, square, attackerIsBlack))) {\n      continue;\n    }\n";
const BLOCK = RIGHT + KINGG + ROOKG + EMPTYG + PATHG;
const ENEMY = "(black ? 0 : BLACK)";
const sub = (a, b) => [[a, b]];

const MUTANTS = {
  // the ten corridor drops
  "E-WK-f1": sub("empty: [5, 6]", "empty: [6]"),
  "E-WK-g1": sub("empty: [5, 6]", "empty: [5]"),
  "E-WQ-b1": sub("empty: [1, 2, 3]", "empty: [2, 3]"),
  "E-WQ-c1": sub("empty: [1, 2, 3]", "empty: [1, 3]"),
  "E-WQ-d1": sub("empty: [1, 2, 3]", "empty: [1, 2]"),
  "E-BK-f8": sub("empty: [117, 118],", "empty: [118],"),
  "E-BK-g8": sub("empty: [117, 118],", "empty: [117],"),
  "E-BQ-b8": sub("empty: [113, 114, 115],", "empty: [114, 115],"),
  "E-BQ-c8": sub("empty: [113, 114, 115],", "empty: [113, 115],"),
  "E-BQ-d8": sub("empty: [113, 114, 115],", "empty: [113, 114],"),
  // the right test switched off off the default scalars
  "R-half": sub(RIGHT, "    if ((position.castling & option.right) === 0 && position.halfmoveClock === 0) continue;\n"),
  "R-full": sub(RIGHT, "    if ((position.castling & option.right) === 0 && position.fullmoveNumber === 1) continue;\n"),
  "R-ep": sub(RIGHT, "    if ((position.castling & option.right) === 0 && position.epSquare === -1) continue;\n"),
  // QE exploratory (not in the ticket's catalogue)
  "X-empty-every": sub(EMPTYG, "    if (option.empty.every((square) => position.board[square] !== EMPTY)) continue;\n"),
  "X-empty-white-only": sub(EMPTYG, "    if (!black && option.empty.some((square) => position.board[square] !== EMPTY)) continue;\n"),
  "X-any-right": sub(RIGHT, "    if (position.castling === 0) continue;\n"),
  // class controls
  "CTRL-empty-removed": sub(EMPTYG, ""),
  "CTRL-right-removed": sub(RIGHT, ""),
  // the fifteen behaviour-equivalent controls, encoded from ABC-023 A5's prose list
  EQ01: sub(KINGG, `    if (position.board[option.kingFrom] !== king && position.board[option.kingFrom] !== (KING | ${ENEMY})) continue;\n`),
  EQ02: sub(KINGG, `    if (position.board[option.kingFrom] !== king && position.board[option.kingFrom] !== (QUEEN | ${ENEMY})) continue;\n`),
  EQ03: sub(KINGG, `    if (position.board[option.kingFrom] !== king && position.board[option.kingFrom] !== (ROOK | ${ENEMY})) continue;\n`),
  EQ04: sub(ROOKG, `    if (position.board[option.rookFrom] !== rook && position.board[option.rookFrom] !== (KING | ${ENEMY})) continue;\n`),
  EQ05: sub(ROOKG, `    if (position.board[option.rookFrom] !== rook && position.board[option.rookFrom] !== (QUEEN | ${ENEMY})) continue;\n`),
  EQ06: sub(ROOKG, `    if (position.board[option.rookFrom] !== rook && position.board[option.rookFrom] !== (ROOK | ${ENEMY})) continue;\n`),
  EQ07: sub(KINGG, "    if (pieceType(position.board[option.kingFrom] as number) !== KING) continue;\n"),
  EQ08: sub(ROOKG, "    if (pieceType(position.board[option.rookFrom] as number) !== ROOK) continue;\n"),
  EQ09: sub(
    KINGG + ROOKG,
    "    if (pieceType(position.board[option.kingFrom] as number) !== KING) continue;\n    if (pieceType(position.board[option.rookFrom] as number) !== ROOK) continue;\n",
  ),
  EQ10: sub(KINGG, "    if (position.board[option.kingFrom] !== king) break;\n"),
  EQ11: sub(KINGG, "    if (position.board[option.kingFrom] !== king) return;\n"),
  EQ12: sub(BLOCK, RIGHT + EMPTYG + KINGG + ROOKG + PATHG),
  EQ13: sub(BLOCK, RIGHT + EMPTYG + PATHG + KINGG + ROOKG),
  EQ14: sub(BLOCK, KINGG + ROOKG + RIGHT + EMPTYG + PATHG),
  EQ15: sub(ROOKG, `${ROOKG}    if (position.board[option.rookFrom] === EMPTY) continue;\n`),
};

const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
delete env.VITEST_MAX_WORKERS;

function apply(id) {
  let src = pristine;
  for (const [a, b] of MUTANTS[id]) {
    const n = src.split(a).length - 1;
    if (n !== 1) return { err: `anchor occurs ${n} times: ${JSON.stringify(a.slice(0, 60))}` };
    src = src.replace(a, () => b);
  }
  if (src === pristine) return { err: "bytes unchanged" };
  return { src };
}

function classify(name) {
  if (name.includes("ABC-024 A1")) return "A1";
  if (name.includes("ABC-024 A2")) return "A2";
  if (name.includes("ABC-024 A3")) return "A3";
  return "other";
}

function runState(id) {
  const rec = { id };
  if (id !== "PRISTINE") {
    const a = apply(id);
    if (a.err) {
      rec.verdict = "HARNESS-ERROR";
      rec.detail = a.err;
      return rec;
    }
    writeFileSync(MOVES, a.src);
    rec.mutantMd5 = md5(a.src);
  }
  try {
    const tsc = spawnSync("node_modules/.bin/tsc", ["--noEmit"], { cwd: tree, env, encoding: "utf8" });
    rec.tscExit = tsc.status;
    if (tsc.status !== 0) {
      rec.verdict = "BROKEN-BUILD";
      rec.detail = (tsc.stdout + tsc.stderr).slice(0, 600);
      return rec;
    }
    const outFile = join(outDir, `${id}.json`);
    if (existsSync(outFile)) rmSync(outFile);
    const vt = spawnSync("node_modules/.bin/vitest", ["run", "--reporter=json", `--outputFile=${outFile}`], {
      cwd: tree,
      env,
      encoding: "utf8",
      timeout: 600000,
      killSignal: "SIGTERM",
    });
    rec.vitestExit = vt.status;
    rec.signal = vt.signal;
    if (!existsSync(outFile)) {
      rec.verdict = "HARNESS-ERROR";
      rec.detail = `no json; stderr: ${vt.stderr.slice(-400)}`;
      return rec;
    }
    const j = JSON.parse(readFileSync(outFile, "utf8"));
    rec.total = j.numTotalTests;
    rec.passed = j.numPassedTests;
    rec.failed = j.numFailedTests;
    rec.pending = j.numPendingTests + j.numTodoTests;
    rec.files = j.testResults.length;
    rec.failedFiles = j.testResults.filter((f) => f.status === "failed").map((f) => f.name.replace(`${tree}/`, ""));
    rec.loadFailures = j.testResults
      .filter((f) => f.status === "failed" && f.assertionResults.length === 0)
      .map((f) => f.name.replace(`${tree}/`, ""));
    const failing = [];
    for (const f of j.testResults)
      for (const t of f.assertionResults)
        if (t.status === "failed") failing.push({ file: f.name.replace(`${tree}/`, ""), name: t.fullName });
    rec.failing = failing;
    rec.byClass = { A1: [], A2: [], A3: [], other: [] };
    for (const t of failing) rec.byClass[classify(t.name)].push(`${t.file} :: ${t.name}`);
    rec.verdict = failing.length === 0 && rec.loadFailures.length === 0 && j.success ? "SURVIVED" : "KILLED";
    return rec;
  } finally {
    writeFileSync(MOVES, pristine);
    const h = md5(readFileSync(MOVES, "utf8"));
    rec.restoredMd5 = h;
    if (h !== PRISTINE_MD5) {
      console.log(JSON.stringify(rec));
      throw new Error(`restore failed after ${id}: ${h}`);
    }
  }
}

const ids = only.length ? only : ["PRISTINE", ...Object.keys(MUTANTS)];
for (const id of ids) {
  const rec = runState(id);
  console.log(JSON.stringify(rec));
}
