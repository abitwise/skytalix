// qe-ABC-215 load-bearing plants (adapted from ticket-to-pr-ABC-083/probe/mutants.mjs). Each named plant is applied to a
// fresh copy of a scratch tree (exact-string edits, each asserted to match once); the named test files run (default lane
// unless env says), and rows red BEYOND the unmutated baseline are listed. The worktree's src/ is never touched.
// usage: node plants.mjs <tree> <mutdir> <out.json> <ctx-root-for-ABC-121-table> [name ...]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
const [TREE, S, outFile, CTX, ...only] = process.argv.slice(2);
const table = readFileSync(`${CTX}/ticket-to-pr-ABC-121/probe/mutants.mjs`, "utf8");
const M121 = new Function(`${table.slice(table.indexOf("const SEARCH ="), table.indexOf("function fresh("))}; return MUTANTS;`)();
const ENGINE = "src/engine.ts", EVAL = "src/evaluate.ts";
const ORD = "src/search.ordering.test.ts", PVS = "src/search.pvs-lmr.test.ts", ENG = "src/engine.test.ts", TT = "src/transposition.test.ts", QS = "src/quiescence.test.ts", EVT = "src/evaluate.test.ts";
const ALL = [ORD, PVS, ENG, TT, QS, EVT];
const cell = (name, from, to) => [[EVAL, `const ${name}: readonly number[] = [\n${from}`, `const ${name}: readonly number[] = [\n${to}`]];
const MUTANTS = {
  __baseline__: { edits: [], files: ALL },
  // A2: one cell +1 per array -> exactly that array's rebuild row
  "A2-PIECE_VALUE-knight+1": { edits: [[EVAL, "  325, // KNIGHT", "  326, // KNIGHT"]], files: [EVT] },
  "A2-PAWN-a8+1": { edits: cell("PAWN_TABLE", "    0,  0,", "    1,  0,"), files: [EVT] },
  "A2-KNIGHT-a8+1": { edits: cell("KNIGHT_TABLE", "  -30,-20,", "  -29,-20,"), files: [EVT] },
  "A2-BISHOP-a8+1": { edits: cell("BISHOP_TABLE", "  -10,-10,", "   -9,-10,"), files: [EVT] },
  "A2-ROOK-a8+1": { edits: cell("ROOK_TABLE", "    0,  0,", "    1,  0,"), files: [EVT] },
  "A2-QUEEN-a8+1": { edits: cell("QUEEN_TABLE", "   -5, -5,", "   -4, -5,"), files: [EVT] },
  "A2-KING-a8+1": { edits: cell("KING_TABLE", "  -50,-50,", "  -49,-50,"), files: [EVT] },
  // the moved rows' bites
  N3: { edits: [[ENGINE, "    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }", "    budget.killers.record(ply, move);\n    if (alpha >= beta) {\n      break;\n    }"]], files: [ORD] },
  M13: { edits: [["src/quiescence.ts", "    (ORDER_VALUE[move.promotion] as number) -\n", ""]], files: [ORD] },
  M11: { edits: [[ENGINE, "  const rootMoves = orderMoves(\n    moves,\n    budget.killers.at(0),\n    slot === -1 ? null : entryMove(slot, moves),\n  );", "  const rootMoves = moves;"]], files: [ORD] },
  keepBestSoFar: { edits: [
    [ENGINE, "/** One completed iteration: the root move it chose and that move's exact score. */", "let partial = null;\n/** One completed iteration: the root move it chose and that move's exact score. */"],
    [ENGINE, "  let bestMove = rootMoves[0] as Move;\n\n  let index = 0;", "  let bestMove = rootMoves[0] as Move;\n  partial = null;\n\n  let index = 0;"],
    [ENGINE, "    if (score > best) {\n      best = score;\n      bestMove = move;\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey", "    if (score > best) {\n      best = score;\n      bestMove = move;\n      partial = { move: bestMove, score: best };\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey"],
    [ENGINE, "      if (error === ABORTED) break;", "      if (error === ABORTED) { if (partial) best = partial; break; }"],
  ], files: [ENG] },
  noLmrResearch: { edits: M121.noLmrResearch, files: [PVS] },
  noResearch: { edits: M121.noResearch, files: [PVS] },
  "noLmrResearch-search-only": { edits: M121["noLmrResearch-search-only"], files: [PVS] },
  "noLmrResearch-engine-only": { edits: M121["noLmrResearch-engine-only"], files: [PVS] },
  "noResearch-search-only": { edits: M121.noResearch.filter(([f]) => f === "src/search.ts"), files: [PVS] },
  "noResearch-engine-only": { edits: M121["noResearch-engine-only"], files: [PVS] },
  // the score assertion's bite at the A4 fixtures: the re-search runs (trace sees it) but its result is discarded (ABC-082 row 8)
  "discard-re-search-search-only": { edits: [["src/search.ts", "if (score > alpha && reduction > 0) {\n    score =\n      0 -\n      negamax(", "if (score > alpha && reduction > 0) {\n    const discarded =\n      0 -\n      negamax("]], files: [PVS] },
  "discard-re-search-engine-only": { edits: [["src/engine.ts", "if (score > alpha && reduction > 0) {\n    score = 0 - negamax(", "if (score > alpha && reduction > 0) {\n    const discarded = 0 - negamax("]], files: [PVS] },
  // A2 with the base values put back (the build reverted): every rebuild row and every differ row red, the keys row green
  "A2-base-values": { edits: "BASE_VALUES", files: [EVT] },
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
  if (edits === "BASE_VALUES") {
    const BASE = process.env.BASE_TREE; const bsrc = readFileSync(`${BASE}/src/evaluate.ts`, "utf8"); const path = `${S}/${EVAL}`; let hsrc = readFileSync(path, "utf8");
    for (const n of ["PIECE_VALUE", "PAWN_TABLE", "KNIGHT_TABLE", "BISHOP_TABLE", "ROOK_TABLE", "QUEEN_TABLE", "KING_TABLE"]) {
      const re = new RegExp(`const ${n}: readonly number\\[\\] = \\[[\\s\\S]*?\\];`); const b = bsrc.match(re), h = hsrc.match(re);
      if (!b || !h) throw new Error(`base-values: ${n}`); hsrc = hsrc.replace(h[0], b[0]);
    }
    writeFileSync(path, hsrc);
  }
  for (const [file, from, to] of (edits === "BASE_VALUES" ? [] : edits)) {
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
