import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const [S] = process.argv.slice(2);
const tree = `${S}/tree`;
const pristine = readFileSync(`${S}/moves.pristine.ts`, "utf8");
const md5 = (t) => createHash("md5").update(t).digest("hex");
const RIGHT = "if ((position.castling & option.right) === 0) continue;";
const EMPTYT = "if (option.empty.some((square) => position.board[square] !== EMPTY)) continue;";
const mutants = [
  ["BASELINE (no mutant)", null, null],
  ["E-BK-g8 drop", "empty: [117, 118],", "empty: [117],"],
  ["E-BQ-b8 drop", "empty: [113, 114, 115],", "empty: [114, 115],"],
  ["E-BQ-c8 drop", "empty: [113, 114, 115],", "empty: [113, 115],"],
  ["E-BQ-d8 drop", "empty: [113, 114, 115],", "empty: [113, 114],"],
  ["R-half (right test skipped when halfmoveClock !== 0)", RIGHT, "if ((position.castling & option.right) === 0 && position.halfmoveClock === 0) continue;"],
  ["R-full (right test skipped when fullmoveNumber !== 1)", RIGHT, "if ((position.castling & option.right) === 0 && position.fullmoveNumber === 1) continue;"],
  ["R-ep (right test skipped when an ep square is set)", RIGHT, "if ((position.castling & option.right) === 0 && position.epSquare === -1) continue;"],
  ["CONTROL empty test removed", EMPTYT, ""],
  ["CONTROL right test removed", RIGHT, ""],
];
for (const [name, from, to] of mutants) {
  let src = pristine;
  if (from !== null) {
    const n = pristine.split(from).length - 1;
    if (n !== 1) { console.log(name, "HARNESS ERROR anchor count", n); continue; }
    src = pristine.replace(from, to);
    if (src === pristine) { console.log(name, "HARNESS ERROR unchanged"); continue; }
  }
  writeFileSync(`${tree}/src/moves.ts`, src);
  const out = `${S}/run-${name.split(" ")[0]}.json`;
  const env = { ...process.env, PATH: `${tree}/node_modules/.bin:${process.env.PATH}` };
  delete env.PERFT_DEEP;
  const r = spawnSync("vitest", ["run", "--reporter=json", `--outputFile=${out}`], { cwd: tree, env, encoding: "utf8", timeout: 600000 });
  let j;
  try { j = JSON.parse(readFileSync(out, "utf8")); } catch { console.log(name, "HARNESS ERROR no json, exit", r.status); continue; }
  const failedFiles = j.testResults.filter((f) => f.assertionResults.some((a) => a.status === "failed")).map((f) => f.name.replace(`${tree}/`, ""));
  const failedNames = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => a.title)).slice(0, 4);
  console.log(`${name} | exit ${r.status} | files ${j.numTotalTestSuites !== undefined ? j.testResults.length : "?"} | passed ${j.numPassedTests}/${j.numTotalTests} | failed ${j.numFailedTests} | pending ${j.numPendingTests} | ${failedFiles.join(", ")} | ${failedNames.join(" ; ")}`);
  writeFileSync(`${tree}/src/moves.ts`, pristine);
  if (md5(readFileSync(`${tree}/src/moves.ts`, "utf8")) !== "6335b452fc21ffe2d0f902ecab930840") { console.log("RESTORE FAILED"); process.exit(2); }
}
console.log("restored md5", md5(readFileSync(`${tree}/src/moves.ts`, "utf8")));
