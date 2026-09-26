// ABC-121 build hop: planted-variant (mutant) harness. Copies the worktree's src/ + config into a
// scratch tree OUTSIDE the repository, applies one mutant at a time (exact-string edits, each
// asserted to match), and runs the search/engine test files. Default lane first; a mutant that
// survives it is re-run on the deep A1 rows (SEARCH_DEEP=1, -t "A1") of search.pvs-lmr.test.ts.
// Usage: node mutants.mjs [name ...]   (no names = all). Writes mutants.json beside the scratch tree.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";

const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-121-pvs-lmr";
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/mut121";
const FILES = [
  "src/search.pvs-lmr.test.ts",
  "src/search.test.ts",
  "src/engine.test.ts",
  "src/transposition.test.ts",
  "src/search.ordering.test.ts",
  "src/quiescence.test.ts",
];

const SEARCH = "src/search.ts";
const ENGINE = "src/engine.ts";
const S_LMR = "  if (score > alpha && reduction > 0) {\n    score =\n      0 -\n      negamax(\n        position,\n        depth - 1,";
const S_PVS = "  if (score > alpha && score < beta) {\n    score =\n      0 -\n      negamax(position, depth - 1, 0 - beta";
const E_LMR = "  if (score > alpha && reduction > 0) {\n    score = 0 - negamax(position, remaining - 1,";
const E_PVS = "  if (score > alpha && score < beta) {\n    score = 0 - negamax(position, remaining - 1, 0 - beta";
const TACTICAL = [SEARCH, "  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;\n  if (isInCheck(position)) return 0;\n  const undo = makeMove(position, move);\n  const givesCheck = isInCheck(position);\n  unmakeMove(position, move, undo);\n  return givesCheck ? 0 : 1;", "  return 1;"];
const R2 = [SEARCH, "  return givesCheck ? 0 : 1;", "  return givesCheck ? 0 : 2;"];
const EARLY = [
  [SEARCH, "const REDUCTION_MIN_DEPTH = 3;", "const REDUCTION_MIN_DEPTH = 2;"],
  [SEARCH, "const REDUCTION_MIN_INDEX = 3;", "const REDUCTION_MIN_INDEX = 1;"],
];
const NO_RESEARCH_S = [
  [SEARCH, S_LMR, S_LMR.replace("depth - 1,", "depth - 1 - reduction,")],
  [SEARCH, S_PVS, S_PVS.replace("depth - 1,", "depth - 1 - reduction,")],
];
const NO_RESEARCH_E = [
  [ENGINE, E_LMR, E_LMR.replace("remaining - 1,", "remaining - 1 - reduction,")],
  [ENGINE, E_PVS, E_PVS.replace("remaining - 1,", "remaining - 1 - reduction,")],
];
const NO_LMR_S = [SEARCH, S_LMR, S_LMR.replace("if (score > alpha", "if (false && score > alpha")];
const NO_LMR_E = [ENGINE, E_LMR, E_LMR.replace("if (score > alpha", "if (false && score > alpha")];
const PVS_NR_S = [SEARCH, S_PVS, S_PVS.replace("if (score > alpha", "if (false && score > alpha")];
const PVS_NR_E = [ENGINE, E_PVS, E_PVS.replace("if (score > alpha", "if (false && score > alpha")];

/** name -> list of [file, from, to]. The review's seven variants, in both recursions, then extras. */
const MUTANTS = {
  tactical: [TACTICAL],
  r2: [R2],
  noLmrResearch: [NO_LMR_S, NO_LMR_E],
  noResearch: [...NO_RESEARCH_S, ...NO_RESEARCH_E],
  early: EARLY,
  gross: [TACTICAL, ...EARLY, ...NO_RESEARCH_S, ...NO_RESEARCH_E].map((m) =>
    m === TACTICAL ? [SEARCH, TACTICAL[1], "  return 2;"] : m,
  ),
  pvsNoResearch: [PVS_NR_S, PVS_NR_E],
  // one recursion at a time: each recursion's own rows must catch its own copy
  "noLmrResearch-engine-only": [NO_LMR_E],
  "noLmrResearch-search-only": [NO_LMR_S],
  "pvsNoResearch-engine-only": [PVS_NR_E],
  "pvsNoResearch-search-only": [PVS_NR_S],
  "noResearch-engine-only": NO_RESEARCH_E,
  // predicate, one clause at a time
  "reduces-at-root": [[SEARCH, "  if (atRoot || depth < REDUCTION_MIN_DEPTH", "  if (depth < REDUCTION_MIN_DEPTH"]],
  "ignores-in-check": [[SEARCH, "  if (isInCheck(position)) return 0;\n  const undo", "  const undo"]],
  "ignores-gives-check": [[SEARCH, "  return givesCheck ? 0 : 1;", "  return 1;"]],
  "ignores-promotion": [[SEARCH, "  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;\n  if (isInCheck(position)) return 0;", "  if (move.captured !== EMPTY) return 0;\n  if (isInCheck(position)) return 0;"]],
  "no-unmake-in-predicate": [[SEARCH, "  unmakeMove(position, move, undo);\n  return givesCheck", "  return givesCheck"]],
  // wiring
  "search-literal-reduction": [[SEARCH, "      depth - 1 - reduction,", "      reduction > 0 ? depth - 2 : depth - 1,"]],
  "engine-bypasses-predicate": [[ENGINE, "    const reduction = budget.reductions\n      ? lateMoveReduction(position, move, remaining, index, false)\n      : 0;", "    const reduction = budget.reductions && index >= 3 && remaining >= 3 ? 1 : 0;"]],
  "door-withoutReductions-reduces": [[SEARCH, "export function searchWithoutReductions(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true,\n    pvs: true,\n    reductions: false,", "export function searchWithoutReductions(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true,\n    pvs: true,\n    reductions: true,"]],
  "door-pre121-has-pvs": [[SEARCH, "export function searchWithoutPvsOrReductions(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true,\n    pvs: false,", "export function searchWithoutPvsOrReductions(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true,\n    pvs: true,"]],
  "engine-door-pre121-has-pvs": [[ENGINE, "  return deepen(position, options, { pvs: false, reductions: false });", "  return deepen(position, options, { pvs: true, reductions: false });"]],
  "engine-door-withoutReductions-reduces": [[ENGINE, "  return deepen(position, options, { pvs: true, reductions: false });", "  return deepen(position, options, { pvs: true, reductions: true });"]],
};

function fresh(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts", "tools"]) cpSync(`${W}/${f}`, `${dir}/${f}`, { recursive: true });
  symlinkSync(NM, `${dir}/node_modules`);
}

function run(dir, files, env, filter) {
  const out = `${dir}/report.json`;
  rmSync(out, { force: true });
  const args = ["vitest", "run", "--reporter=json", `--outputFile=${out}`, ...files];
  if (filter) args.push("-t", filter);
  const r = spawnSync("npx", args, { cwd: dir, encoding: "utf8", env: { ...process.env, ...env }, maxBuffer: 256 * 1024 * 1024 });
  if (!existsSync(out)) return { error: (r.stderr || r.stdout).slice(-2000) };
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failed = [];
  for (const f of j.testResults) {
    for (const t of f.assertionResults) if (t.status === "failed") failed.push(`${f.name.split("/src/")[1]} > ${t.fullName}`);
    if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`${f.name.split("/src/")[1]} (suite failed: ${String(f.message).slice(0, 200)})`);
  }
  return { passed: j.numPassedTests, failed };
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MUTANTS);
const results = {};
const dir = `${S}/tree`;
for (const name of names) {
  fresh(dir);
  for (const [file, from, to] of MUTANTS[name]) {
    const path = `${dir}/${file}`;
    const src = readFileSync(path, "utf8");
    const n = src.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: pattern found ${n} times in ${file}: ${from.slice(0, 60)}`);
    writeFileSync(path, src.replace(from, to));
  }
  const t = Date.now();
  const def = run(dir, FILES, {}, null);
  let deep = null;
  const REVIEW = ["tactical", "r2", "noLmrResearch", "noResearch", "early", "gross", "pvsNoResearch"];
  if (!def.error && (def.failed.length === 0 || REVIEW.includes(name))) deep = run(dir, ["src/search.pvs-lmr.test.ts"], { SEARCH_DEEP: "1" }, "A1");
  results[name] = { defaultLane: def, deepA1: deep, killed: (def.failed?.length ?? 0) > 0 || (deep?.failed?.length ?? 0) > 0 || !!def.error, s: Math.round((Date.now() - t) / 1000) };
  console.log(JSON.stringify({ name, killed: results[name].killed, defaultFailed: def.failed?.length ?? def.error, deepFailed: deep?.failed?.length ?? null, s: results[name].s }));
  writeFileSync(`${S}/mutants.json`, JSON.stringify(results, null, 1));
}
