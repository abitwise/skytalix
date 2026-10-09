// ABC-082 F-row bite check: each named mutant applied to a fresh scratch copy of the worktree
// (exact-string edits, each asserted to match once), then (1) the row's test file runs on the default
// lane and the failing rows are listed, and (2) rows.ts reads the mutated tree's values.
// Usage: node mutants.mjs <out.json> [name ...]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const W = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-082-pawn-structure";
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const S = join(here, "..", process.env.MUTDIR ?? "mut082");
const [outFile, ...only] = process.argv.slice(2);

// ABC-121's own noLmrResearch / noResearch table, read out of its probe (one source, not a copy).
const table = readFileSync("/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/ticket-to-pr-ABC-121/probe/mutants.mjs", "utf8");
const body = table.slice(table.indexOf("const SEARCH ="), table.indexOf("function fresh("));
const M121 = new Function(`${body}; return MUTANTS;`)();

const ENGINE = "src/engine.ts";
const MUTANTS = {
  __baseline__: { edits: [], files: ["src/search.ordering.test.ts"] },
  // row 3 — ABC-080 QE's N3: record every move tried as a killer, not only the cutoff move.
  N3: {
    edits: [[ENGINE, "    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }", "    budget.killers.record(ply, move);\n    if (alpha >= beta) {\n      break;\n    }"]],
    files: ["src/search.ordering.test.ts"],
  },
  // row 8 — ABC-121's two re-search mutants, both recursions.
  noLmrResearch: { edits: M121.noLmrResearch, files: ["src/search.pvs-lmr.test.ts"] },
  noResearch: { edits: M121.noResearch, files: ["src/search.pvs-lmr.test.ts"] },
  "noLmrResearch-search-only": { edits: M121["noLmrResearch-search-only"], files: ["src/search.pvs-lmr.test.ts"] },
  "noLmrResearch-engine-only": { edits: M121["noLmrResearch-engine-only"], files: ["src/search.pvs-lmr.test.ts"] },
  "noResearch-engine-only": { edits: M121["noResearch-engine-only"], files: ["src/search.pvs-lmr.test.ts"] },
  "noResearch-search-only": { edits: M121.noResearch.filter(([f]) => f === "src/search.ts"), files: ["src/search.pvs-lmr.test.ts"] },
  // row 9 — keep the aborted iteration's best-so-far (ABC-078 A3's emulated mutant).
  keepBestSoFar: {
    edits: [
      [ENGINE, "/** One completed iteration: the root move it chose and that move's exact score. */", "let partial = null;\n/** One completed iteration: the root move it chose and that move's exact score. */"],
      [ENGINE, "  let bestMove = rootMoves[0] as Move;\n\n  let index = 0;", "  let bestMove = rootMoves[0] as Move;\n  partial = null;\n\n  let index = 0;"],
      [ENGINE, "    if (score > best) {\n      best = score;\n      bestMove = move;\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey", "    if (score > best) {\n      best = score;\n      bestMove = move;\n      partial = { move: bestMove, score: best };\n    }\n    if (best > alpha) alpha = best;\n  }\n\n  storeEntry(rootKey"],
      [ENGINE, "      if (error === ABORTED) break;", "      if (error === ABORTED) { if (partial) best = partial; break; }"],
    ],
    files: ["src/engine.test.ts"],
  },
  // row 10 — ABC-080's M11: the engine's root list unordered.
  M11: {
    edits: [[ENGINE, "  const rootMoves = orderMoves(\n    moves,\n    budget.killers.at(0),\n    slot === -1 ? null : entryMove(slot, moves),\n  );", "  const rootMoves = moves;"]],
    files: ["src/search.ordering.test.ts"],
  },
  // row 11 — ABC-078 QE's M1: the in-recursion clock check deleted.
  M1: {
    edits: [[ENGINE, "    if (budget.now() >= budget.deadline) throw ABORTED;\n", ""]],
    files: ["src/engine.test.ts"],
    slow: true,
  },
  // row 12 — a hard ceiling in the loop body (ABC-078 QE's G2 shape).
  ceiling4: {
    edits: [[ENGINE, "  for (let iteration = 2; now() < budget.deadline; iteration++) {\n", "  for (let iteration = 2; now() < budget.deadline; iteration++) {\n    if (iteration > 4) break;\n"]],
    files: ["src/engine.test.ts"],
  },
  // row 13 — the engine blind to repetition; and its root ignoring the hash move.
  repetitionBlind: {
    edits: [[ENGINE, "  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;\n", ""]],
    files: ["src/transposition.test.ts"],
  },
  rootIgnoresHashMove: {
    edits: [[ENGINE, "    slot === -1 ? null : entryMove(slot, moves),\n  );", "    null,\n  );"]],
    files: ["src/transposition.test.ts"],
  },
};

const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
const SKIP = new Set([".git", ".claude", ".grugops", "node_modules"]);
const names = only.length ? only : Object.keys(MUTANTS);
const results = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
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
  spawnSync("npx", ["vitest", "run", ...files, "--reporter=json", `--outputFile=${out}`], { cwd: S, encoding: "utf8", env, maxBuffer: 256 * 1024 * 1024 });
  const ms = Date.now() - t;
  if (!existsSync(out)) throw new Error(`${name}: no report`);
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failed = [];
  for (const f of j.testResults) {
    for (const t2 of f.assertionResults) if (t2.status === "failed") failed.push(`${f.name.split("/src/")[1]} > ${t2.fullName} :: ${(t2.failureMessages[0] ?? "").split("\n")[0].slice(0, 160)}`);
    if (f.status === "failed" && f.assertionResults.length === 0) failed.push(`${f.name.split("/src/")[1]} (suite failed)`);
  }
  if (name === "__baseline__" && failed.length > 0) throw new Error(`baseline not green: ${failed.join("; ")}`);
  const probe = spawnSync("node", [join(here, "rows.ts"), S], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let rows = null;
  try { rows = JSON.parse(probe.stdout); } catch { rows = probe.stderr.slice(0, 400); }
  results[name] = { red: failed.length > 0, passed: j.numPassedTests, failed, ms, rows };
  console.log(`${name}\t${failed.length > 0 ? "RED" : "SURVIVED"}\t${failed.length} rows\t${ms} ms`);
  for (const f of failed) console.log(`   ${f}`);
  writeFileSync(outFile, JSON.stringify(results, null, 1));
}
