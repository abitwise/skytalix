// ABC-157: ABC-024's committed harness plus X-any-right (one entry); everything else verbatim.
// One fresh OS process per tree state: tsc and vitest each spawned per mutant. PERFT_DEEP unset.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const [S, LOG, ONLY] = process.argv.slice(2);
const tree = `${S}/tree`;
const pristine = readFileSync(`${S}/moves.pristine.ts`, "utf8");
const md5 = (t) => createHash("md5").update(t).digest("hex");
const PIN = "6335b452fc21ffe2d0f902ecab930840";
if (md5(pristine) !== PIN) { console.log("PRISTINE WRONG"); process.exit(2); }
const R = "if ((position.castling & option.right) === 0) continue;";
const KG = "if (position.board[option.kingFrom] !== king) continue;";
const RG = "if (position.board[option.rookFrom] !== rook) continue;";
const E = "if (option.empty.some((square) => position.board[square] !== EMPTY)) continue;";
const P = "    if (option.kingPath.some((square) => isSquareAttackedBy(position, square, attackerIsBlack))) {\n      continue;\n    }\n";
const i4 = (s) => `    ${s}\n`;
const BLOCK = i4(R) + i4(KG) + i4(RG) + i4(E) + P;
const ENEMY = "(black ? 0 : BLACK)";
const adm = (sq, own, t) => `if (position.board[option.${sq}] !== ${own} && position.board[option.${sq}] !== (${t} | ${ENEMY})) continue;`;
const M = [
  ["BASELINE", []],
  // ABC-157: the right test reads ANY right (QE-024-a)
  ["X-any-right", [[R, "if (position.castling === 0) continue;"]]],
  // A1: each of the ten corridor squares dropped
  ["A1:WK-f1", [["empty: [5, 6],", "empty: [6],"]]],
  ["A1:WK-g1", [["empty: [5, 6],", "empty: [5],"]]],
  ["A1:WQ-b1", [["empty: [1, 2, 3],", "empty: [2, 3],"]]],
  ["A1:WQ-c1", [["empty: [1, 2, 3],", "empty: [1, 3],"]]],
  ["A1:WQ-d1", [["empty: [1, 2, 3],", "empty: [1, 2],"]]],
  ["A1:BK-f8", [["empty: [117, 118],", "empty: [118],"]]],
  ["A1:BK-g8", [["empty: [117, 118],", "empty: [117],"]]],
  ["A1:BQ-b8", [["empty: [113, 114, 115],", "empty: [114, 115],"]]],
  ["A1:BQ-c8", [["empty: [113, 114, 115],", "empty: [113, 115],"]]],
  ["A1:BQ-d8", [["empty: [113, 114, 115],", "empty: [113, 114],"]]],
  // A2: the right test skipped off the default scalars
  ["A2:R-half", [[R, "if ((position.castling & option.right) === 0 && position.halfmoveClock === 0) continue;"]]],
  ["A2:R-full", [[R, "if ((position.castling & option.right) === 0 && position.fullmoveNumber === 1) continue;"]]],
  ["A2:R-ep", [[R, "if ((position.castling & option.right) === 0 && position.epSquare === -1) continue;"]]],
  // class controls
  ["CTL:empty-removed", [[i4(E), ""]]],
  ["CTL:right-removed", [[i4(R), ""]]],
  // the fifteen behaviour-equivalent controls (ABC-009 / ABC-023 A5 enumeration)
  ["EQ01:king-sq-admits-enemy-KING", [[KG, adm("kingFrom", "king", "KING")]]],
  ["EQ02:king-sq-admits-enemy-QUEEN", [[KG, adm("kingFrom", "king", "QUEEN")]]],
  ["EQ03:king-sq-admits-enemy-ROOK", [[KG, adm("kingFrom", "king", "ROOK")]]],
  ["EQ04:rook-sq-admits-enemy-KING", [[RG, adm("rookFrom", "rook", "KING")]]],
  ["EQ05:rook-sq-admits-enemy-QUEEN", [[RG, adm("rookFrom", "rook", "QUEEN")]]],
  ["EQ06:rook-sq-admits-enemy-ROOK", [[RG, adm("rookFrom", "rook", "ROOK")]]],
  ["EQ07:colour-blind-king-sq", [[KG, "if (pieceType(position.board[option.kingFrom] as number) !== KING) continue;"]]],
  ["EQ08:colour-blind-rook-sq", [[RG, "if (pieceType(position.board[option.rookFrom] as number) !== ROOK) continue;"]]],
  ["EQ09:colour-blind-both", [[KG, "if (pieceType(position.board[option.kingFrom] as number) !== KING) continue;"], [RG, "if (pieceType(position.board[option.rookFrom] as number) !== ROOK) continue;"]]],
  ["EQ10:king-guard-break", [[KG, "if (position.board[option.kingFrom] !== king) break;"]]],
  ["EQ11:king-guard-return", [[KG, "if (position.board[option.kingFrom] !== king) return;"]]],
  ["EQ12:guards-below-empty", [[BLOCK, i4(R) + i4(E) + i4(KG) + i4(RG) + P]]],
  ["EQ13:guards-below-through-check", [[BLOCK, i4(R) + i4(E) + P + i4(KG) + i4(RG)]]],
  ["EQ14:guards-above-right", [[BLOCK, i4(KG) + i4(RG) + i4(R) + i4(E) + P]]],
  ["EQ15:extra-rook-sq-nonempty", [[i4(RG), i4(RG) + i4("if (position.board[option.rookFrom] === EMPTY) continue;")]]],
];
const env = { ...process.env, PATH: `${tree}/node_modules/.bin:${process.env.PATH}` };
delete env.PERFT_DEEP;
for (const [name, edits] of M) {
  if (ONLY && !name.startsWith(ONLY)) continue;
  let src = pristine; let bad = null;
  for (const [from, to] of edits) {
    const n = src.split(from).length - 1;
    if (n !== 1) { bad = `anchor count ${n}`; break; }
    src = src.replace(from, to);
  }
  if (!bad && edits.length && src === pristine) bad = "unchanged";
  if (bad) { appendFileSync(LOG, `${name}\tHARNESS ERROR ${bad}\n`); continue; }
  writeFileSync(`${tree}/src/moves.ts`, src);
  const tsc = spawnSync("tsc", ["--noEmit"], { cwd: tree, env, encoding: "utf8" });
  let line;
  if (tsc.status !== 0) {
    line = `${name}\tBROKEN BUILD tsc ${tsc.status} ${tsc.stdout.slice(0, 300)}`;
  } else {
    const out = `${S}/run-${name.replace(/[^A-Za-z0-9-]/g, "_")}.json`;
    const r = spawnSync("vitest", ["run", "--reporter=json", `--outputFile=${out}`], { cwd: tree, env, encoding: "utf8", timeout: 900000 });
    let j;
    try { j = JSON.parse(readFileSync(out, "utf8")); } catch { j = null; }
    if (!j) line = `${name}\tHARNESS ERROR no json exit ${r.status}`;
    else {
      const failed = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => `${f.name.replace(`${tree}/`, "")} :: ${a.fullName}`));
      const verdict = j.numFailedTests > 0 ? "KILLED" : (j.numTotalTests > 0 && j.success ? "SURVIVED" : "HARNESS ERROR");
      line = `${name}\t${verdict}\ttsc 0\tvitest exit ${r.status}\tfiles ${j.testResults.length}\tpassed ${j.numPassedTests}/${j.numTotalTests}\tpending ${j.numPendingTests + j.numTodoTests}\tfailed ${j.numFailedTests}\n${failed.map((f) => `    ${f}`).join("\n")}`;
    }
  }
  writeFileSync(`${tree}/src/moves.ts`, pristine);
  const h = md5(readFileSync(`${tree}/src/moves.ts`, "utf8"));
  appendFileSync(LOG, `${line}\n    restored md5 ${h}\n`);
  if (h !== PIN) { appendFileSync(LOG, "RESTORE FAILED\n"); process.exit(2); }
}
appendFileSync(LOG, "DONE\n");
