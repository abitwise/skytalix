// ABC-083 bite check (adapted from ticket-to-pr-ABC-082/probe/mutants.mjs): each named mutant applied to
// a fresh scratch copy of the worktree (exact-string edits, each asserted to match once); the row's
// test files run on the default lane, and the rows that are red BEYOND the unmutated baseline's are
// listed (the baseline carries the class-R red, row 15, which no mutant may hide behind).
// rows.ts then reads the mutated tree's pinned values.
// Usage: node mutants.mjs <out.json> [name ...]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ticket-to-pr-ABC-083";
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const S = process.env.MUTDIR;
if (!S) throw new Error("set MUTDIR to a scratch directory outside the repository");
const [outFile, ...only] = process.argv.slice(2);

// ABC-121's own noLmrResearch / noResearch table, read out of its probe (one source, not a copy).
const table = readFileSync(`${W}/.grugops/context/ticket-to-pr-ABC-121/probe/mutants.mjs`, "utf8");
const body = table.slice(table.indexOf("const SEARCH ="), table.indexOf("function fresh("));
const M121 = new Function(`${body}; return MUTANTS;`)();

const ENGINE = "src/engine.ts";
const EVAL = "src/evaluate.ts";
const ORD = "src/search.ordering.test.ts";
const PVS = "src/search.pvs-lmr.test.ts";
const ENG = "src/engine.test.ts";
const TT = "src/transposition.test.ts";
const PAWNS = "src/evaluate.pawns.test.ts";
const KM = "src/evaluate.king-mobility.test.ts";
const QS = "src/quiescence.test.ts";
const ALL = [ORD, PVS, ENG, TT, PAWNS, KM, QS, "src/evaluate.test.ts"];
const MUTANTS = {
  __baseline__: { edits: [], files: ALL },
  // row 3 — ABC-080 QE's N3: record every move tried as a killer, not only the cutoff move.
  N3: { edits: [[ENGINE, "    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }", "    budget.killers.record(ply, move);\n    if (alpha >= beta) {\n      break;\n    }"]], files: [ORD] },
  // row 2 — ABC-080 M13: mvvLvaKey's promotion term dropped.
  M13: { edits: [["src/quiescence.ts", "    (ORDER_VALUE[move.promotion] as number) -\n", ""]], files: [ORD] },
  // row 8 — ABC-121's two re-search mutants, both recursions and each alone.
  noLmrResearch: { edits: M121.noLmrResearch, files: [PVS] },
  noResearch: { edits: M121.noResearch, files: [PVS] },
  "noLmrResearch-search-only": { edits: M121["noLmrResearch-search-only"], files: [PVS] },
  "noLmrResearch-engine-only": { edits: M121["noLmrResearch-engine-only"], files: [PVS] },
  "noResearch-engine-only": { edits: M121["noResearch-engine-only"], files: [PVS] },
  "noResearch-search-only": { edits: M121.noResearch.filter(([f]) => f === "src/search.ts"), files: [PVS] },
  // row 9 — keep the aborted iteration's best-so-far (ABC-078 A3's emulated mutant).
  keepBestSoFar: {
    edits: [
      [ENGINE, "/** One completed iteration: the root move it chose and that move's exact score. */", "let partial = null;\n/** One completed iteration: the root move it chose and that move's exact score. */"],
      [ENGINE, "  let bestMove = rootMoves[0] as Move;\n\n  let index = 0;", "  let bestMove = rootMoves[0] as Move;\n  partial = null;\n\n  let index = 0;"],
      [ENGINE, "    if (score > best) {\n      best = score;\n      bestMove = move;\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey", "    if (score > best) {\n      best = score;\n      bestMove = move;\n      partial = { move: bestMove, score: best };\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey"],
      [ENGINE, "      if (error === ABORTED) break;", "      if (error === ABORTED) { if (partial) best = partial; break; }"],
    ],
    files: [ENG],
  },
  // row 10 — ABC-080's M11: the engine's root list unordered.
  M11: { edits: [[ENGINE, "  const rootMoves = orderMoves(\n    moves,\n    budget.killers.at(0),\n    slot === -1 ? null : entryMove(slot, moves),\n  );", "  const rootMoves = moves;"]], files: [ORD] },
  // row 11 — ABC-078 QE's M1: the in-recursion clock check deleted.
  M1: { edits: [[ENGINE, "    if (budget.now() >= budget.deadline) throw ABORTED;\n", ""]], files: [ENG] },
  // row 12 — a hard ceiling in the loop body (ABC-078 QE's G2 shape).
  ceiling4: { edits: [[ENGINE, "  for (let iteration = 2; now() < budget.deadline; iteration++) {\n", "  for (let iteration = 2; now() < budget.deadline; iteration++) {\n    if (iteration > 4) break;\n"]], files: [ENG] },
  // row 13 — the engine blind to repetition; and its root ignoring the hash move.
  repetitionBlind: { edits: [[ENGINE, "  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;\n", ""]], files: [TT] },
  rootIgnoresHashMove: { edits: [[ENGINE, "    slot === -1 ? null : entryMove(slot, moves),\n  );", "    null,\n  );"]], files: [TT] },
  // ABC-083 A8 — QE's ABC-082 E8 / E9: the isolation check reads one adjacent file.
  E8: { edits: [[EVAL, "(((1 << file) << 1) | ((1 << file) >> 1)) & 0xff", "((1 << file) << 1) & 0xff"]], files: [PAWNS] },
  E9: { edits: [[EVAL, "(((1 << file) << 1) | ((1 << file) >> 1)) & 0xff", "((1 << file) >> 1) & 0xff"]], files: [PAWNS] },
  // ABC-082 A2 re-found: its bar's own mutant (a doubled penalty that outweighs the 50 cp cap).
  doubled40: { edits: [[EVAL, "const DOUBLED_PAWN_PENALTY = 15;", "const DOUBLED_PAWN_PENALTY = 40;"]], files: [PAWNS] },
  // ABC-083 A1-A4 — this ticket's own terms, each broken.
  noShelter: { edits: [[EVAL, "const KING_SHELTER_MISSING_PENALTY = 15;", "const KING_SHELTER_MISSING_PENALTY = 0;"]], files: [KM] },
  noFileTerm: { edits: [[EVAL, "const KING_FILE_HALF_OPEN_PENALTY = 10;\nconst KING_FILE_OPEN_PENALTY = 20;", "const KING_FILE_HALF_OPEN_PENALTY = 0;\nconst KING_FILE_OPEN_PENALTY = 0;"]], files: [KM] },
  noMobility: { edits: [[EVAL, "const MOBILITY_WEIGHT = 4;", "const MOBILITY_WEIGHT = 0;"]], files: [KM] },
  noClamp: { edits: [[EVAL, "Math.max(-MOBILITY_CAP, Math.min(MOBILITY_CAP, mobilityWeight * mobility))", "mobilityWeight * mobility"]], files: [KM] },
  blackKingStepFlip: { edits: [[EVAL, "kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1)", "kingExposure(board, blackKing, BLACK_PAWN, PAWN, 1)"]], files: [KM] },
  blackMobilityAdded: { edits: [[EVAL, "      mobility += black ? -reached : reached;", "      mobility += reached;"]], files: [KM] },
  // ABC-079 A3 cap rig — the runaway guard deleted.
  noCap: { edits: [["src/quiescence.ts", "  if (qply >= QUIESCENCE_MAX_PLY) return standPat; // the runaway guard: stand pat, do not expand\n", ""]], files: [QS] },
};

const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
const SKIP = new Set([".git", ".claude", ".grugops", "node_modules"]);
const names = only.length ? only : Object.keys(MUTANTS);
const results = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const baseFailed = new Set(results.__baseline__?.failed ?? []);
for (const name of names) {
  const { edits, files } = MUTANTS[name];
  rmSync(S, { recursive: true, force: true });
  mkdirSync(S, { recursive: true });
  cpSync(W, S, { recursive: true, filter: (p) => !SKIP.has(p.slice(W.length + 1).split("/")[0]) });
  symlinkSync(NM, `${S}/node_modules`);
  for (const [file, from, to] of edits) {
    const path = `${S}/${file}`;
    const src = readFileSync(path, "utf8");
    const n = src.split(from).length - 1;
    if (n !== 1) throw new Error(`${name}: pattern found ${n} times in ${file}`);
    writeFileSync(path, src.replace(from, to));
  }
  const out = `${S}/report.json`;
  const t = Date.now();
  const r = spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${out}`], { cwd: S, encoding: "utf8", env, maxBuffer: 256 * 1024 * 1024 });
  const ms = Date.now() - t;
  if (!existsSync(out)) throw new Error(`${name}: no report`);
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failed = [];
  for (const f of j.testResults) {
    for (const t2 of f.assertionResults) if (t2.status === "failed") failed.push(`${f.name.split("/src/")[1]} > ${t2.fullName} :: ${(t2.failureMessages[0] ?? "").split("\n")[0].slice(0, 140)}`);
    if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`${f.name.split("/src/")[1]} (suite failed)`);
  }
  const strip = (s) => s.split(" :: ")[0];
  const baseNames = new Set([...baseFailed].map(strip));
  const beyond = name === "__baseline__" ? failed : failed.filter((f) => !baseNames.has(strip(f)));
  const probe = spawnSync("node", [join(here, "rows.ts"), S], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let rows = null;
  try { rows = JSON.parse(probe.stdout); } catch { rows = probe.stderr.slice(0, 400); }
  results[name] = { exit: r.status, red: beyond.length > 0, passed: j.numPassedTests, failed, beyondBaseline: beyond, ms, rows };
  if (name === "__baseline__") for (const f of failed) baseFailed.add(f);
  console.log(`${name}\texit ${r.status}\t${name === "__baseline__" ? "BASELINE" : beyond.length > 0 ? "RED" : "SURVIVED"}\t${beyond.length} rows\t${ms} ms`);
  for (const f of beyond) console.log(`   ${f}`);
  writeFileSync(outFile, JSON.stringify(results, null, 1));
}
