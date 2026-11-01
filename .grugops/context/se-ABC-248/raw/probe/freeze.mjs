// se-ABC-248 PREREG freeze. Usage: node freeze.mjs <baseTree> <outDir>
// Writes frozen-uci.json (T2a + T2d list, run against src/uci-session.test.ts) and frozen-plants.json
// (T2c list, run against src/search.null-move.test.ts). Each edit is checked at base: a string `find`
// must occur exactly once in the file after its `anchor` (if any); a mutant whose edit does not apply
// is recorded NOT APPLICABLE and never run.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base, outDir] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const U = "src/uci-session.ts";

// 1. qe-ABC-177's re-frozen union list (ABC-177 A6: M01–M51 of ABC-167, N/S of ABC-171, M of ABC-174, H1/H2),
//    byte copy at src-qe177-refrozen-mutants.json, each entry one exact replacement.
const q177 = JSON.parse(readFileSync(join(here, "src-qe177-refrozen-mutants.json"), "utf8"));
const uci = q177
  .filter((m) => typeof m.from === "string")
  .map((m) => ({ id: m.id, crit: m.crit, source: "qe-ABC-177 refrozen", edits: [{ file: m.file, find: m.from, repl: m.to }] }));

// 2. Re-anchored where the code moved since ABC-177 (the same wrong build, its current text).
const add = (id, crit, file, find, repl, anchor) => uci.push({ id, crit, source: "se-ABC-248", edits: [{ file, find, repl, ...(anchor ? { anchor } : {}) }] });
add("167-M06r", "A5 M06 re-anchored to the level branch: the side to move reads the other side's increment", U,
  'const increment = clock[blackToMove ? "binc" : "winc"] ?? 0;\n    const share',
  'const increment = clock[blackToMove ? "winc" : "binc"] ?? 0;\n    const share');
add("167-M07r", "A5 M07 re-anchored: the level cap is not applied (G only)", U,
  "const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;",
  "const budgetMs = request.budgetMs;");
add("171-S19r", "S19 re-anchored: the level cap is a max", U,
  "const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;",
  "const budgetMs = leveled ? Math.max(request.budgetMs, level.budgetMs) : request.budgetMs;");
add("171-S17r", "S17 re-anchored: the budget is the level's only", U,
  "const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;",
  "const budgetMs = leveled ? level.budgetMs : request.budgetMs;");

// 3. The wrong builds A5's rows name (ABC-248 ruling 3), level mode only.
add("WRONGSIDE", "ruling 3: in level mode the session hands white's search btime and black's wtime", U,
  "  } else if (time !== undefined) {\n    const increment",
  '  } else if (clock[blackToMove ? "wtime" : "btime"] !== undefined) {\n    const time = clock[blackToMove ? "wtime" : "btime"];\n    const increment');
add("WS-WHITE", "W != G for white: in level mode both sides read btime (white wrong, black right)", U,
  "  } else if (time !== undefined) {\n    const increment",
  "  } else if (clock.btime !== undefined) {\n    const time = clock.btime;\n    const increment");
add("WS-BLACK", "W != G for black: in level mode both sides read wtime (black wrong, white right)", U,
  "  } else if (time !== undefined) {\n    const increment",
  "  } else if (clock.wtime !== undefined) {\n    const time = clock.wtime;\n    const increment");
add("MOVETIME-OFF", "movetime: in level mode movetime is never read (the clock or the ceiling binds)", U,
  "  } else if (clock.movetime !== undefined) {\n    budget = clock.movetime;",
  "  } else if (false) {\n    budget = clock.movetime;");
add("MOVESTOGO-1", "movestogo: read one too many (movestogo + 1)", U,
  "(clock.movestogo ?? DEFAULT_MOVES_TO_GO)", "(clock.movestogo === undefined ? DEFAULT_MOVES_TO_GO : clock.movestogo + 1)");
add("L5-3000", "LEVELS[5].budgetMs 4 000 -> 3 000 (the pre-ABC-228 value)", "src/levels.ts",
  "5: Object.freeze({ budgetMs: 4_000, blunderRate: 0 }),", "5: Object.freeze({ budgetMs: 3_000, blunderRate: 0 }),");
add("L5-4500", "LEVELS[5].budgetMs 4 000 -> 4 500", "src/levels.ts",
  "5: Object.freeze({ budgetMs: 4_000, blunderRate: 0 }),", "5: Object.freeze({ budgetMs: 4_500, blunderRate: 0 }),");
add("OVERHEAD-100", "MOVE_OVERHEAD_MS 50 -> 100", U, "const MOVE_OVERHEAD_MS = 50;", "const MOVE_OVERHEAD_MS = 100;");

// 4. T2c: qe-ABC-208's plant set (qe-ABC-208/raw/qe-scripts/plants.mjs), the three ADR-0050 plants first.
const sub = (file, find, repl, anchor) => ({ file: `src/${file}`, find, repl, ...(anchor ? { anchor } : {}) });
const doorOn = (file, fn) =>
  sub(file, file === "engine.ts" ? "nullMove: false })" : "nullMove: false,", file === "engine.ts" ? "nullMove: true })" : "nullMove: true,", `export function ${fn}(`);
const PLANTS = {
  "engine-no-finally": [sub("engine.ts", "} finally {\n        unmakeNullMove(position, nullUndo);\n      }", "} catch (e) {\n        throw e;\n      }\n      unmakeNullMove(position, nullUndo);")],
  "search-stale-null-key": [sub("search.ts", "      keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);\n", "")],
  "engine-stale-null-key": [sub("engine.ts", "        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);\n", "")],
  "null-in-check": [sub("search.ts", "  if (isInCheck(position)) return 0;\n  const board", "  const board")],
  "double-null": [sub("search.ts", "if (ply === 0 || afterNull || depth", "if (ply === 0 || depth")],
  "return-null-score": [sub("search.ts", "if (nullScore >= beta) return beta;", "if (nullScore >= beta) return nullScore;"), sub("engine.ts", "if (nullScore >= beta) return beta;", "if (nullScore >= beta) return nullScore;")],
  "no-halfmove-reset": [sub("apply.ts", "  position.halfmoveClock = 0;\n  if (position.blackToMove) position.fullmoveNumber++;", "  if (position.blackToMove) position.fullmoveNumber++;")],
  "no-material-guard": [sub("search.ts", "  const board = position.board;\n  let pieces = 0;", "  return NULL_MOVE_REDUCTION;\n  const board = position.board;\n  let pieces = 0;")],
  "guard-1": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 1;")],
  "guard-2": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 2;")],
  "guard-4": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 4;")],
  "R-2": [sub("search.ts", "const NULL_MOVE_REDUCTION = 3;", "const NULL_MOVE_REDUCTION = 2;")],
  "R-5": [sub("search.ts", "const NULL_MOVE_REDUCTION = 3;", "const NULL_MOVE_REDUCTION = 5;")],
  "min-depth-3": [sub("search.ts", "const NULL_MOVE_MIN_DEPTH = 2;", "const NULL_MOVE_MIN_DEPTH = 3;")],
  "null-everywhere-finite-beta": [sub("search.ts", "if (switches.nullMove && alpha + 1 === beta) {", "if (switches.nullMove && Number.isFinite(beta)) {"), sub("engine.ts", "if (budget.nullMove && alpha + 1 === beta) {", "if (budget.nullMove && Number.isFinite(beta)) {")],
  "cut-without-search": [sub("search.ts", "if (nullScore >= beta) return beta;", "return beta;"), sub("engine.ts", "if (nullScore >= beta) return beta;", "return beta;")],
  "key-without-ep": [sub("zobrist.ts", "let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;", "let key = keyBefore ^ BLACK_TO_MOVE;")],
  "null-no-ep-clear": [sub("apply.ts", "  position.epSquare = NO_SQUARE;\n  position.halfmoveClock = 0;", "  position.halfmoveClock = 0;")],
  "null-no-fullmove": [sub("apply.ts", "  if (position.blackToMove) position.fullmoveNumber++;\n  position.blackToMove = !position.blackToMove;\n  return undo;", "  position.blackToMove = !position.blackToMove;\n  return undo;")],
  "engine-R-2": [sub("engine.ts", "remaining - 1 - nullReduction,", "remaining - nullReduction,")],
  "count-opponent": [sub("search.ts", "isBlack(piece) !== position.blackToMove) continue;\n    const type", "isBlack(piece) === position.blackToMove) continue;\n    const type")],
  "engine-pv-nodes-too": [sub("engine.ts", "if (budget.nullMove && alpha + 1 === beta) {", "if (budget.nullMove) {")],
  "door-on:searchWithoutNullMove": [doorOn("search.ts", "searchWithoutNullMove")],
  "door-on:searchWithoutReductions": [doorOn("search.ts", "searchWithoutReductions")],
  "door-on:searchWithoutPvsOrReductions": [doorOn("search.ts", "searchWithoutPvsOrReductions")],
  "door-on:searchWithoutTable": [doorOn("search.ts", "searchWithoutTable")],
  "door-on:chooseMoveWithoutNullMove": [doorOn("engine.ts", "chooseMoveWithoutNullMove")],
  "door-on:chooseMoveWithoutReductions": [doorOn("engine.ts", "chooseMoveWithoutReductions")],
  "door-on:chooseMoveWithoutPvsOrReductions": [doorOn("engine.ts", "chooseMoveWithoutPvsOrReductions")],
};
const plants = Object.entries(PLANTS).map(([id, edits]) => ({ id, source: "qe-ABC-208 plants.mjs", edits }));
// door plants replace the first occurrence after the anchor; every other edit must be unique in its file.
const check = (m) => {
  for (const e of m.edits) {
    const text = readFileSync(join(base, e.file), "utf8");
    const start = e.anchor ? text.indexOf(e.anchor) : 0;
    if (start < 0) return `anchor not found in ${e.file}`;
    const tail = text.slice(start);
    const n = tail.split(e.find).length - 1;
    if (e.anchor ? n < 1 : n !== 1) return `${n} occurrences in ${e.file}`;
  }
  return null;
};
for (const [name, list] of [["frozen-uci.json", uci], ["frozen-plants.json", plants]]) {
  for (const m of list) {
    const why = check(m);
    m.applies = why === null;
    if (why) m.notApplicable = why;
  }
  const body = `${JSON.stringify({ base: process.env.SE248_BASE, frozenAt: new Date().toISOString(), mutants: list }, null, 1)}\n`;
  writeFileSync(join(outDir, name), body);
  console.log(name, createHash("sha256").update(body).digest("hex"), "total", list.length, "applies", list.filter((m) => m.applies).length);
  for (const m of list.filter((x) => !x.applies)) console.log("  NOT APPLICABLE", m.id, m.notApplicable);
}
