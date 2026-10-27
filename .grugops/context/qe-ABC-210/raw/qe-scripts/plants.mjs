// QE qe-ABC-210 plants (qe-ABC-209 plants.mjs mechanism; ABC-210's own set). Each plant edits a scratch copy of head, runs
// a lane, records the red rows, and restores the three files (cmp-verified against the pristine copies).
// Usage: node plants.mjs <plantTree> <pristineDir> <outDir> <lane:default|deep> <plant...|all>
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const [tree, pristine, out, lane, ...wanted] = process.argv.slice(2);
const sub = (file, find, repl) => ({ file, find, repl });
const PRED_HEAD = "  if (depth > 0 || extensions >= CHECK_EXTENSION_MAX_PER_LINE) return 0;\n";
const PRED_TAIL = "  return isInCheck(position) ? 1 : 0;\n}";
const S_BLOCK = "    const extension = checkExtensionPlies(position, depth, extensions);\n    depth += extension;\n    extensions += extension;\n";
const E_BLOCK = "    const extension = checkExtensionPlies(position, remaining, extensions);\n    remaining += extension;\n    extensions += extension;\n";
const S_DOOR = "export function searchWithoutCheckExtension(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true,\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    checkExtension: false,";
const E_DOOR = "  return deepen(position, options, {\n    pvs: true,\n    reductions: true,\n    nullMove: true,\n    checkExtension: false,";
const REP = 'const REPEATS_AT_PLY_4 = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1";';

const PLANTS = {
  none: [],
  // ---- the SE's eight (ticket-to-pr-ABC-210 …548912ef), re-planted ----
  "se:dead-predicate": [sub("search.ts", PRED_TAIL, "  return isInCheck(position) ? 0 : 0;\n}")],
  "se:plus-2-plies": [sub("search.ts", PRED_TAIL, "  return isInCheck(position) ? 2 : 0;\n}")],
  "se:no-cap": [sub("search.ts", PRED_HEAD, "  if (depth > 0) return 0;\n")],
  "se:interior-extension": [sub("search.ts", PRED_HEAD, "  if (extensions >= CHECK_EXTENSION_MAX_PER_LINE) return 0;\n")],
  "se:out-of-check": [sub("search.ts", PRED_TAIL, "  return isInCheck(position) ? 1 : 1;\n}")],
  "se:chooseMove-switch-off": [sub("engine.ts", "    nullMove: true,\n    checkExtension: true,", "    nullMove: true,\n    checkExtension: false,")],
  "se:engine-child-loses-count": [sub("engine.ts", "      0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget, extensions, false)\n    );", "      0 - negamax(position, remaining - 1, 0 - beta, 0 - alpha, child, budget, 0, false)\n    );")],
  "se:search-door-wired-on": [sub("search.ts", S_DOOR, S_DOOR.replace("checkExtension: false,", "checkExtension: true,"))],
  // ---- QE's own ----
  "qe:engine-door-wired-on": [sub("engine.ts", E_DOOR, E_DOOR.replace("checkExtension: false,", "checkExtension: true,"))],
  "qe:search-child-loses-count": [sub("search.ts", "        keys,\n        extensions,\n        false,\n      )\n    );", "        keys,\n        0,\n        false,\n      )\n    );")],
  "qe:search-null-child-loses-count": [sub("search.ts", "          keys,\n          extensions,\n          true,", "          keys,\n          0,\n          true,")],
  "qe:engine-null-child-loses-count": [sub("engine.ts", "            budget,\n            extensions,\n            true,", "            budget,\n            0,\n            true,")],
  "qe:search-count-not-kept": [sub("search.ts", S_BLOCK, S_BLOCK.replace("    extensions += extension;\n", ""))],
  "qe:engine-count-not-kept": [sub("engine.ts", E_BLOCK, E_BLOCK.replace("    extensions += extension;\n", ""))],
  "qe:search-root-count-1": [sub("search.ts", "      killers,\n      keys,\n      0,\n    );", "      killers,\n      keys,\n      1,\n    );")],
  "qe:engine-root-count-1": [sub("engine.ts", "        reduction,\n        budget,\n        0,\n      );", "        reduction,\n        budget,\n        1,\n      );")],
  "qe:cap-2": [sub("search.ts", "const CHECK_EXTENSION_MAX_PER_LINE = 1;", "const CHECK_EXTENSION_MAX_PER_LINE = 2;")],
  "qe:depth-1-too": [sub("search.ts", PRED_HEAD, "  if (depth > 1 || extensions >= CHECK_EXTENSION_MAX_PER_LINE) return 0;\n")],
  "qe:every-node-no-cap": [sub("search.ts", PRED_HEAD, "")],
  "qe:search-extension-depth-only": [sub("search.ts", S_BLOCK, "    const extension = checkExtensionPlies(position, depth, extensions);\n    extensions += extension;\n")],
  "qe:search-after-leaf-test": [
    sub("search.ts", "  if (switches.checkExtension) {\n" + S_BLOCK + "  }\n  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {\n    return leafScore(position, ply, alpha, beta, switches, counter);\n  }\n",
        "  if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {\n    return leafScore(position, ply, alpha, beta, switches, counter);\n  }\n  if (switches.checkExtension) {\n" + S_BLOCK + "  }\n"),
  ],
  "qe:search-before-repetition": [
    sub("search.ts", "  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;\n  if (switches.checkExtension) {\n" + S_BLOCK + "  }\n",
        "  if (switches.checkExtension) {\n" + S_BLOCK + "  }\n  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;\n"),
  ],
  // ---- P1: the fixture bug, re-planted at depth 2 (transposition.test.ts's REPEATS_AT_PLY_4) ----
  "p1:fixture-rook-gone": [sub("transposition.test.ts", REP, 'const REPEATS_AT_PLY_4 = "7k/5Q2/6pp/q7/8/8/6PP/7K w - - 0 1";')],
  "p1:fixture-queen-gone": [sub("transposition.test.ts", REP, 'const REPEATS_AT_PLY_4 = "7k/5Q2/6pp/1r6/8/8/6PP/7K w - - 0 1";')],
  "p1:fixture-one-move-outside": [sub("transposition.test.ts", REP, 'const REPEATS_AT_PLY_4 = "7k/8/6pp/qr6/8/Q7/6PP/7K w - - 0 1";')],
};

const FILES = ["search.ts", "engine.ts", "transposition.test.ts"];
const restore = () => {
  for (const f of FILES) copyFileSync(`${pristine}/${f}`, `${tree}/src/${f}`);
  for (const f of FILES) execFileSync("cmp", [`${pristine}/${f}`, `${tree}/src/${f}`]);
};
function apply(edits) {
  for (const { file, find, repl } of edits) {
    const path = `${tree}/src/${file}`;
    const text = readFileSync(path, "utf8");
    const i = text.indexOf(find);
    if (i < 0) throw new Error(`plant text not found in ${file}: ${String(find).slice(0, 70)}`);
    if (text.indexOf(find, i + 1) >= 0) throw new Error(`plant text not unique in ${file}: ${String(find).slice(0, 70)}`);
    writeFileSync(path, text.slice(0, i) + repl + text.slice(i + find.length));
  }
}
const RUNS = {
  default: [[{}, "--max-old-space-size=128", []]],
  deep: ["src/search.check-extension.test.ts", "src/search.null-move.test.ts", "src/transposition.test.ts"].map((f) => [{ SEARCH_DEEP: "1" }, "--max-old-space-size=400", [f]]),
}[lane];
const names = wanted[0] === "all" ? Object.keys(PLANTS) : wanted;
for (const name of names) {
  restore();
  apply(PLANTS[name]);
  const t0 = Date.now();
  let red = 0, total = 0, ok = true;
  const failed = [];
  RUNS.forEach(([envAdd, heap, files], i) => {
    const json = `${out}/plant-${lane}-${name.replace(/[:]/g, "_")}-${i}.json`;
    spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${json}`], {
      cwd: tree, env: { ...process.env, NODE_OPTIONS: heap, ...envAdd }, encoding: "utf8", timeout: 1_800_000,
    });
    try {
      const r = JSON.parse(readFileSync(json, "utf8"));
      red += r.numFailedTests; total += r.numTotalTests;
      for (const f of r.testResults) if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`SUITE FAILED ${f.name.split("/src/")[1]}: ${String(f.message).slice(0, 160)}`);
      for (const f of r.testResults)
        for (const a of f.assertionResults)
          if (a.status === "failed") failed.push(`${Object.keys(envAdd)[0] ?? "default"} ${f.name.split("/src/")[1]} :: ${a.fullName}`);
    } catch (e) { ok = false; failed.push(`NO RESULT run ${i}: ${e.message}`); }
  });
  console.log(`${name} [${lane}] ${red} red / ${total}${ok ? "" : " (INCOMPLETE)"} (${Math.round((Date.now() - t0) / 1000)} s)`);
  for (const f of failed) console.log(`    RED ${f.slice(0, 240)}`);
  restore();
}
console.log("restored and verified equal to pristine");
