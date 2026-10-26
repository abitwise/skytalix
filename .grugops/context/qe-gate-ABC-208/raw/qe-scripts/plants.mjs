// QE qe-gate-ABC-208 plants. Usage: node plants.mjs <plantTree> <pristineSrc> <outDir> <lane:default|deep> <plant...|all>
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const [tree, pristine, out, lane, ...wanted] = process.argv.slice(2);

/** Replace the n-th occurrence (default all, at least one required) of `find` after `anchor`. */
const sub = (file, find, repl, anchor) => ({ file, find, repl, anchor });
const doorOn = (file, fn) =>
  sub(file, file === "engine.ts" ? "nullMove: false })" : "nullMove: false,", file === "engine.ts" ? "nullMove: true })" : "nullMove: true,", `export function ${fn}(`);

const PLANTS = {
  "null-in-check": [sub("search.ts", "  if (isInCheck(position)) return 0;\n  const board", "  const board")],
  "double-null": [sub("search.ts", "if (ply === 0 || afterNull || depth", "if (ply === 0 || depth")],
  "return-null-score": [
    sub("search.ts", "if (nullScore >= beta) return beta;", "if (nullScore >= beta) return nullScore;"),
    sub("engine.ts", "if (nullScore >= beta) return beta;", "if (nullScore >= beta) return nullScore;"),
  ],
  "no-halfmove-reset": [sub("apply.ts", "  position.halfmoveClock = 0;\n  if (position.blackToMove) position.fullmoveNumber++;", "  if (position.blackToMove) position.fullmoveNumber++;")],
  "no-material-guard": [sub("search.ts", "  const board = position.board;\n  let pieces = 0;", "  return NULL_MOVE_REDUCTION;\n  const board = position.board;\n  let pieces = 0;")],
  "guard-1": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 1;")],
  "guard-2": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 2;")],
  "guard-4": [sub("search.ts", "const NULL_MOVE_MIN_PIECES = 3;", "const NULL_MOVE_MIN_PIECES = 4;")],
  "R-2": [sub("search.ts", "const NULL_MOVE_REDUCTION = 3;", "const NULL_MOVE_REDUCTION = 2;")],
  "R-5": [sub("search.ts", "const NULL_MOVE_REDUCTION = 3;", "const NULL_MOVE_REDUCTION = 5;")],
  "min-depth-3": [sub("search.ts", "const NULL_MOVE_MIN_DEPTH = 2;", "const NULL_MOVE_MIN_DEPTH = 3;")],
  "null-everywhere-finite-beta": [
    sub("search.ts", "if (switches.nullMove && alpha + 1 === beta) {", "if (switches.nullMove && Number.isFinite(beta)) {"),
    sub("engine.ts", "if (budget.nullMove && alpha + 1 === beta) {", "if (budget.nullMove && Number.isFinite(beta)) {"),
  ],
  "cut-without-search": [
    sub("search.ts", "if (nullScore >= beta) return beta;", "return beta;"),
    sub("engine.ts", "if (nullScore >= beta) return beta;", "return beta;"),
  ],
  "sign-error": [
    sub("search.ts", /const nullScore =\s*0 -\s*negamax\(/, "const nullScore = 0 + negamax("),
    sub("engine.ts", /nullScore =\s*0 -\s*negamax\(/, "nullScore = 0 + negamax("),
  ],
  "key-without-ep": [sub("zobrist.ts", "let key = keyBefore ^ BLACK_TO_MOVE;\n  if (undo.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(undo.epSquare)] as bigint;", "let key = keyBefore ^ BLACK_TO_MOVE;")],
  // ---- QE's own plants, beyond the ADR's and the SE's list ----
  "engine-no-finally": [sub("engine.ts", "} finally {\n        unmakeNullMove(position, nullUndo);\n      }", "} catch (e) {\n        throw e;\n      }\n      unmakeNullMove(position, nullUndo);")],
  "search-stale-null-key": [sub("search.ts", "      keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);\n", "")],
  "engine-stale-null-key": [sub("engine.ts", "        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);\n", "")],
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

const FILES = ["search.ts", "engine.ts", "apply.ts", "zobrist.ts"];
const restore = () => {
  for (const f of FILES) copyFileSync(`${pristine}/${f}`, `${tree}/src/${f}`);
  for (const f of FILES) execFileSync("cmp", [`${pristine}/${f}`, `${tree}/src/${f}`]);
};

function apply(edits) {
  for (const { file, find, repl, anchor } of edits) {
    const path = `${tree}/src/${file}`;
    let text = readFileSync(path, "utf8");
    let start = 0;
    if (anchor) {
      start = text.indexOf(anchor);
      if (start < 0) throw new Error(`anchor not found: ${anchor}`);
    }
    const head = text.slice(0, start);
    let tail = text.slice(start);
    let hit;
    if (find instanceof RegExp) {
      hit = find.test(tail);
      tail = tail.replace(find, repl);
    } else {
      const i = tail.indexOf(find);
      hit = i >= 0;
      if (hit) tail = tail.slice(0, i) + repl + tail.slice(i + find.length); // first occurrence after anchor
    }
    if (!hit) throw new Error(`plant text not found in ${file}: ${String(find).slice(0, 60)}`);
    text = head + tail;
    writeFileSync(path, text);
  }
}

const names = wanted[0] === "all" ? Object.keys(PLANTS) : wanted;
for (const name of names) {
  restore();
  apply(PLANTS[name]);
  const F = "^(?!.*(real clock|REAL clock|wall clock|NFR-005|between a 1 s and a 3 s search)).*$";
  const RUNS = {
    default: [[{}, "--max-old-space-size=128", []]],
    deep: [[{ SEARCH_DEEP: "1" }, "--max-old-space-size=400", ["src/search.null-move.test.ts"]]],
    deepall: [
      ...["src/search.null-move.test.ts", "src/search.pvs-lmr.test.ts", "src/transposition.test.ts", "src/search.test.ts", "src/quiescence.test.ts", "src/search.ordering.test.ts"].map((f) => [{ SEARCH_DEEP: "1" }, "--max-old-space-size=400", [f]]),
      ...["src/engine.test.ts", "src/levels.test.ts", "src/transposition.test.ts"].map((f) => [{ ENGINE_DEEP: "1" }, "--max-old-space-size=400", [f, "-t", F]]),
      [{ PUZZLE_DEEP: "1" }, "--max-old-space-size=400", ["src/puzzle-suite.test.ts"]],
    ],
  }[lane];
  const t0 = Date.now();
  let red = 0, total = 0, ok = true;
  const failed = [];
  RUNS.forEach(([envAdd, heap, files], i) => {
    const json = `${out}/plant-${lane}-${name.replace(/[:]/g, "_")}-${i}.json`;
    spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${json}`], {
      cwd: tree, env: { ...process.env, NODE_OPTIONS: heap, ...envAdd }, encoding: "utf8",
    });
    try {
      const r = JSON.parse(readFileSync(json, "utf8"));
      red += r.numFailedTests; total += r.numTotalTests;
      for (const f of r.testResults)
        for (const a of f.assertionResults)
          if (a.status === "failed") failed.push(`${Object.keys(envAdd)[0] ?? "default"} ${f.name.split("/src/")[1]} :: ${a.fullName}`);
    } catch (e) { ok = false; failed.push(`NO RESULT run ${i}: ${e.message}`); }
  });
  console.log(`${name} [${lane}] ${red} red / ${total}${ok ? "" : " (INCOMPLETE)"} (${Math.round((Date.now() - t0) / 1000)} s)`);
  for (const f of failed) console.log(`    RED ${f.slice(0, 230)}`);
  restore();
}
console.log("restored and verified equal to pristine");
