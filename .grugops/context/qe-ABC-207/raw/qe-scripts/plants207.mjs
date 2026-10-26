// qe-ABC-207 load-bearing plants (qe-ABC-215 plants.mjs, the ABC-207 table) (adapted from ticket-to-pr-ABC-083/probe/mutants.mjs). Each named plant is applied to a
// fresh copy of a scratch tree (exact-string edits, each asserted to match once); the named test files run (default lane
// unless env says), and rows red BEYOND the unmutated baseline are listed. The worktree's src/ is never touched.
// usage: node plants.mjs <tree> <mutdir> <out.json> <ctx-root-for-ABC-121-table> [name ...]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
const [TREE, S, outFile, CTX, ...only] = process.argv.slice(2);
const table = readFileSync(`${CTX}/ticket-to-pr-ABC-121/probe/mutants.mjs`, "utf8");
const M121 = new Function(`${table.slice(table.indexOf("const SEARCH ="), table.indexOf("function fresh("))}; return MUTANTS;`)();
const ENGINE = "src/engine.ts", EVAL = "src/evaluate.ts";
const ORD = "src/search.ordering.test.ts", PVS = "src/search.pvs-lmr.test.ts", TT = "src/transposition.test.ts", QS = "src/quiescence.test.ts";
const KM = "src/evaluate.king-mobility.test.ts", EVT = "src/evaluate.test.ts", EVP = "src/evaluate.pawns.test.ts";
const EV = [KM, EVT, EVP];
const W = "const MOBILITY_WEIGHT: readonly number[] = [0, 0, 4, 4, 2, 1, 4];";
const wt = (to) => [[EVAL, W, `const MOBILITY_WEIGHT: readonly number[] = [${to}];`]];
const WL = "(whiteQueenOut && minorsHome(board, KNIGHT, BISHOP, 0) >= 2 ? EARLY_QUEEN_PENALTY : 0)";
const BL = "(blackQueenOut && minorsHome(board, KNIGHT | BLACK, BISHOP | BLACK, 0x70) >= 2\n      ? EARLY_QUEEN_PENALTY\n      : 0)";
const thr = (n) => [[EVAL, WL, WL.replace(">= 2", `>= ${n}`)], [EVAL, BL, BL.replace(">= 2", `>= ${n}`)]];
const MUTANTS = {
  __baseline__: { edits: [], files: EV },
  // A1 / weights
  "Q-weight-4 (base)": { edits: wt("0, 0, 4, 4, 2, 4, 4"), files: EV },
  "Q-weight-2 (= rook)": { edits: wt("0, 0, 4, 4, 2, 2, 4"), files: EV },
  "Q-weight-3 (> rook)": { edits: wt("0, 0, 4, 4, 2, 3, 4"), files: EV },
  "Q-weight-0": { edits: wt("0, 0, 4, 4, 2, 0, 4"), files: EV },
  "R-weight-1 (= queen)": { edits: wt("0, 0, 4, 4, 1, 1, 4"), files: EV },
  "N-weight-1 (= queen)": { edits: wt("0, 0, 1, 4, 2, 1, 4"), files: EV },
  "B-weight-1 (= queen)": { edits: wt("0, 0, 4, 1, 2, 1, 4"), files: EV },
  "NO_MOBILITY-not-zero": { edits: [[EVAL, "const NO_MOBILITY: readonly number[] = [0, 0, 0, 0, 0, 0, 0];", "const NO_MOBILITY: readonly number[] = [0, 0, 4, 4, 2, 1, 4];"]], files: EV },
  "clamp-removed": { edits: [[EVAL, "const mobilityScore = Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobility));", "const mobilityScore = mobility;"]], files: EV },
  // A2 / the early-queen term
  "term-0": { edits: [[EVAL, "const EARLY_QUEEN_PENALTY = 25;", "const EARLY_QUEEN_PENALTY = 0;"]], files: EV },
  "term-20": { edits: [[EVAL, "const EARLY_QUEEN_PENALTY = 25;", "const EARLY_QUEEN_PENALTY = 20;"]], files: EV },
  "term-sign-flipped": { edits: [[EVAL, "kingSafety + mobilityScore - earlyQueen;", "kingSafety + mobilityScore + earlyQueen;"]], files: EV },
  "minors-condition-dropped": { edits: thr(0), files: EV },
  "threshold>=1": { edits: thr(1), files: EV },
  "threshold>=3": { edits: thr(3), files: EV },
  "white-only": { edits: [[EVAL, BL, "0"]], files: EV },
  "queen-home-e1/e8": { edits: [[EVAL, "const WHITE_QUEEN_HOME = 0x03;\nconst BLACK_QUEEN_HOME = 0x73;", "const WHITE_QUEEN_HOME = 0x04;\nconst BLACK_QUEEN_HOME = 0x74;"]], files: EV },
  "minor-squares-swapped": { edits: [[EVAL, "(board[back + 1] === knight ? 1 : 0) +\n    (board[back + 6] === knight ? 1 : 0) +\n    (board[back + 2] === bishop ? 1 : 0) +\n    (board[back + 5] === bishop ? 1 : 0)", "(board[back + 2] === knight ? 1 : 0) +\n    (board[back + 5] === knight ? 1 : 0) +\n    (board[back + 1] === bishop ? 1 : 0) +\n    (board[back + 6] === bishop ? 1 : 0)"]], files: EV },
  "term-inside-clamp": { edits: [
    [EVAL, "const mobilityScore = Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobility));", "const earlyQueenIn =\n    " + WL + " -\n    " + BL + ";\n  const mobilityScore = Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobility - earlyQueenIn));"],
    [EVAL, "kingSafety + mobilityScore - earlyQueen;", "kingSafety + mobilityScore;"]], files: EV },
  // the moved rows' bites (ABC-121 table; qe-ABC-215 plants)
  N3: { edits: [[ENGINE, "    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }", "    budget.killers.record(ply, move);\n    if (alpha >= beta) {\n      break;\n    }"]], files: [ORD] },
  noLmrResearch: { edits: M121.noLmrResearch, files: [PVS] },
  noResearch: { edits: M121.noResearch, files: [PVS] },
  "noLmrResearch-search-only": { edits: M121["noLmrResearch-search-only"], files: [PVS] },
  "noLmrResearch-engine-only": { edits: M121["noLmrResearch-engine-only"], files: [PVS] },
  "noResearch-search-only": { edits: M121.noResearch.filter(([f]) => f === "src/search.ts"), files: [PVS] },
  "noResearch-engine-only": { edits: M121["noResearch-engine-only"], files: [PVS] },
  "discard-re-search-search-only": { edits: [["src/search.ts", "if (score > alpha && reduction > 0) {\n    score =\n      0 -\n      negamax(", "if (score > alpha && reduction > 0) {\n    const discarded =\n      0 -\n      negamax("]], files: [PVS] },
  "discard-re-search-engine-only": { edits: [["src/engine.ts", "if (score > alpha && reduction > 0) {\n    score = 0 - negamax(", "if (score > alpha && reduction > 0) {\n    const discarded = 0 - negamax("]], files: [PVS] },
  // the build reverted (base evaluate.ts): every ABC-207 relation row and every moved default-lane row
  "base-evaluate": { edits: "BASE_EVAL", files: [KM, EVT, EVP, ORD, PVS, TT, QS] },
};
const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
const SKIP = new Set([".git", ".claude", ".grugops", "node_modules", "plans", "memory-bank", "dist", "coverage"]);
const names = only.length ? only : Object.keys(MUTANTS);
const results = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const strip = (s) => s.split(" :: ")[0];
for (const name of names) {
  const { edits, files } = MUTANTS[name];
  rmSync(S, { recursive: true, force: true }); mkdirSync(S, { recursive: true });
  cpSync(TREE, S, { recursive: true, filter: (p) => !SKIP.has(p.slice(TREE.length + 1).split("/")[0]) });
  symlinkSync(`${TREE}/node_modules`, `${S}/node_modules`);
  if (edits === "BASE_EVAL") cpSync(`${process.env.BASE_TREE}/${EVAL}`, `${S}/${EVAL}`);
  for (const [file, from, to] of (edits === "BASE_EVAL" ? [] : edits)) {
    const path = `${S}/${file}`; const src = readFileSync(path, "utf8"); const n = src.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: pattern found ${n} times in ${file}`);
    writeFileSync(path, src.replace(from, to));
  }
  const out = `${S}/report.json`; const t = Date.now();
  const r = spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${out}`], { cwd: S, encoding: "utf8", env: { ...env, NODE_OPTIONS: "--max-old-space-size=128" }, maxBuffer: 256 * 1024 * 1024 });
  if (!existsSync(out)) throw new Error(`${name}: no report: ${r.stderr.slice(0, 400)}`);
  const j = JSON.parse(readFileSync(out, "utf8")); const failed = [];
  for (const f of j.testResults) {
    for (const a of f.assertionResults) if (a.status === "failed") failed.push(`${f.name.split("/src/")[1]} > ${a.fullName} :: ${(a.failureMessages[0] ?? "").split("\n")[0].slice(0, 140)}`);
    if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`${f.name.split("/src/")[1]} (suite failed)`);
  }
  const baseNames = new Set((results.__baseline__?.failed ?? []).map(strip));
  const beyond = name === "__baseline__" ? failed : failed.filter((f) => !baseNames.has(strip(f)));
  results[name] = { exit: r.status, passed: j.numPassedTests, total: j.numTotalTests, failed, beyondBaseline: beyond, ms: Date.now() - t };
  console.log(`${name}\texit ${r.status}\t${name === "__baseline__" ? "BASELINE" : beyond.length ? "RED" : "SURVIVED"}\t${beyond.length} rows\tpassed ${j.numPassedTests}/${j.numTotalTests}`);
  for (const f of beyond) console.log(`   ${f}`);
  writeFileSync(outFile, JSON.stringify(results, null, 1));
}
rmSync(S, { recursive: true, force: true });
