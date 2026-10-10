// QE qe-ABC-010 mutant runner (QE's own). Usage: node qe010-mutants.mjs <scratch-tree> <harness> [ids...]
// <scratch-tree> is an out-of-tree `git archive` of the branch tip with node_modules linked. For each mutant it
// rewrites <tree>/src/fen.ts (each replacement must match EXACTLY once, or the mutant is reported INVALID),
// runs the whole suite (vitest JSON reporter) and QE's harness (small counts), then restores fen.ts byte-exact.
// Prints one TSV row per mutant: id, what, suite red count, the red test names, harness verdict.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const [tree, harness, ...only] = process.argv.slice(2);
const file = `${tree}/src/fen.ts`;
const original = readFileSync(file, "utf8");

const M = [
  ["M01", "drop the rank-1 pawn scan", "for (const first of [0x00, 0x70])", "for (const first of [0x70])"],
  ["M02", "drop the rank-8 pawn scan", "for (const first of [0x00, 0x70])", "for (const first of [0x00])"],
  ["M03", "pawn scan stops at the g-file", "square < first + 8;", "square < first + 7;"],
  ["M04", "pawn scan sees white pawns only", "if (((board[square] as number) & 7) === PAWN) {", "if ((board[square] as number) === PAWN) {"],
  ["M05", "drop the castling king-home check", "if (board[king] !== (KING | colour)) {", "if (false) {"],
  ["M06", "drop the castling rook-home check", "if (board[rook] !== (ROOK | colour)) {", "if (false) {"],
  ["M07", "drop right K", '  ["K", CASTLE_WK, 0, 0x04, 0x07],\n', ""],
  ["M08", "drop right Q", '  ["Q", CASTLE_WQ, 0, 0x04, 0x00],\n', ""],
  ["M09", "drop right k", '  ["k", CASTLE_BK, BLACK, 0x74, 0x77],\n', ""],
  ["M10", "drop right q", '  ["q", CASTLE_BQ, BLACK, 0x74, 0x70],\n', ""],
  ["M11", "castling rook: any colour", "if (board[rook] !== (ROOK | colour)) {", "if (((board[rook] as number) & 7) !== ROOK) {"],
  ["M12", "castling king: any colour", "if (board[king] !== (KING | colour)) {", "if (((board[king] as number) & 7) !== KING) {"],
  ["M13", "drop the ep rank check", "if (ep >> 4 !== (whiteToMove ? 5 : 2)) {", "if (false) {"],
  ["M14", "drop the ep occupied check", "if (board[ep] !== EMPTY) throw fault", "if (false) throw fault"],
  ["M15", "drop the ep pushed-pawn check", "if (board[front] !== (PAWN | (whiteToMove ? BLACK : 0))) {", "if (false) {"],
  ["M16", "ep pushed pawn: any colour", "if (board[front] !== (PAWN | (whiteToMove ? BLACK : 0))) {", "if (((board[front] as number) & 7) !== PAWN) {"],
  ["M17", "drop the ep origin check", "if (board[origin] !== EMPTY) throw fault", "if (false) throw fault"],
  ["M18", "ep rules only when white is to move", "if (ep !== NO_SQUARE) {", "if (ep !== NO_SQUARE && !position.blackToMove) {"],
  ["M19", "drop the in-check rule", "if (isSquareAttackedBy(position, king, position.blackToMove)) {", "if (false) {"],
  ["M20", "in-check rule tests the side TO move", "if (isSquareAttackedBy(position, king, position.blackToMove)) {", "if (isSquareAttackedBy(position, notToMoveIsBlack ? kings[0] : kings[1], !position.blackToMove)) {"],
  ["M21", "in-check rule only when white is to move", "if (isSquareAttackedBy(position, king, position.blackToMove)) {", "if (!position.blackToMove && isSquareAttackedBy(position, king, position.blackToMove)) {"],
  ["M22", "drop the clock round-trip check", "if (String(value) !== field) {", "if (false) {"],
  ["M23", "clock check rejects non-finite only", "if (String(value) !== field) {", "if (!Number.isFinite(value)) {"],
  ["M24", "drop the non-string check", 'if (typeof fen !== "string") {', "if (false) {"],
  ["M25", "parseFen skips the board rules", "  assertReachable(position, kings);\n", ""],
  ["M26", "no truncation of a long clock field", "field.length > 24 ?", "field.length > 1e9 ?"],
  ["M27", "ep front square wrong for black to move", "const front = whiteToMove ? ep - 16 : ep + 16;", "const front = whiteToMove ? ep - 16 : ep - 16;"],
  ["M28", "ep origin square wrong for black to move", "const origin = whiteToMove ? ep + 16 : ep - 16;", "const origin = whiteToMove ? ep + 16 : ep + 16;"],
  ["M29", "castling rights checked only for white", "if ((position.castling & flag) === 0) continue;", "if ((position.castling & flag) === 0 || colour === BLACK) continue;"],
  ["M30", "rank-8 scan starts at b8", "for (let square = first; square < first + 8; square++) {", "for (let square = first === 0x70 ? 0x71 : first; square < first + 8; square++) {"],
];

const occurrences = (s, sub) => s.split(sub).length - 1;
console.log(["id", "what", "suite_red", "red_tests", "harness"].join("\t"));
try {
  for (const [id, what, from, to] of M) {
    if (only.length && !only.includes(id)) continue;
    if (occurrences(original, from) !== 1) {
      console.log([id, what, "INVALID", `anchor matches ${occurrences(original, from)}x`, "-"].join("\t"));
      continue;
    }
    writeFileSync(file, original.replace(from, to));
    const out = `${tree}/.qe-mutant.json`;
    spawnSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${out}`], { cwd: tree, encoding: "utf8" });
    let red = "?";
    let names = "";
    try {
      const j = JSON.parse(readFileSync(out, "utf8"));
      const failed = j.testResults.flatMap((f) =>
        f.assertionResults.filter((a) => a.status === "failed").map((a) => `${f.name.split("/src/")[1]}: ${a.title}`),
      );
      const suiteFail = j.testResults.filter((f) => f.status === "failed" && f.assertionResults.length === 0).length;
      red = String(failed.length + suiteFail);
      names = failed.slice(0, 6).map((n) => n.slice(0, 90)).join(" | ") + (failed.length > 6 ? ` | +${failed.length - 6} more` : "");
    } catch (e) {
      red = `NO-JSON(${e.message})`;
    }
    const h = spawnSync("node", [harness, tree, "20261010", "20000", "30"], { encoding: "utf8" });
    const firstFail = (h.stdout.split("\n").find((l) => l.startsWith("FAIL")) ?? "").slice(0, 110);
    const harnessVerdict = h.status === 0 ? "SURVIVES" : `KILLS (${firstFail})`;
    console.log([id, what, red, names, harnessVerdict].join("\t"));
    writeFileSync(file, original);
  }
} finally {
  writeFileSync(file, original);
}
if (readFileSync(file, "utf8") !== original) {
  console.error("fen.ts NOT restored");
  process.exit(1);
}
