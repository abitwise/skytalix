// QE probe (qe-ABC-082): re-plant the A8 F-class named mutants, row 21's and row 8's bites
// (incl. the Architect's throw-away-re-search mutant, in search.ts AND engine.ts), and the
// table mutants that judge 873911d's 10% bar. QE's own exact-string edits; every mutant runs in
// a fresh scratch copy of the tree under test; the worktree's src/ is never touched.
// Usage: node mutants-f.mjs <tree> <scratch-dir> [name-filter-regex]
import { spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";

const [tree, scratch, only] = process.argv.slice(2);

const ENGINE_CUTOFF = "    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }";
const S_RESEARCH = "if (score > alpha && reduction > 0) {\n    score =\n      0 -\n      negamax(";
const E_RESEARCH = "if (score > alpha && reduction > 0) {\n    score = 0 - negamax(";
const S_STORE = "if (switches.table) storeEntry(key, depth,";

const MUTANTS = [
  { name: "baseline (no edit), ordering", edits: [], file: "src/search.ordering.test.ts" },
  // --- A8 F-class named mutants (rows 3, 10, 11, 12)
  { name: "N3 (row 3): engine records a killer on every move, not only on a cutoff", file: "src/search.ordering.test.ts",
    edits: [["src/engine.ts", ENGINE_CUTOFF, "    budget.killers.record(ply, move);\n    if (alpha >= beta) {\n      break;\n    }"]] },
  { name: "M11 (row 10): engine root unordered", file: "src/search.ordering.test.ts",
    edits: [["src/engine.ts", "const rootMoves = orderMoves(\n    moves,\n    budget.killers.at(0),\n    slot === -1 ? null : entryMove(slot, moves),\n  );", "const rootMoves = moves;"]] },
  { name: "M1 (row 11): in-recursion clock check deleted", file: "src/engine.test.ts", filter: "bounded number of nodes past the deadline",
    edits: [["src/engine.ts", "    if (budget.now() >= budget.deadline) throw ABORTED;\n", ""]] },
  { name: "ceiling4 (row 12): if (iteration > 4) break", file: "src/engine.test.ts", filter: "DEEPER than any small hard-coded ceiling",
    edits: [["src/engine.ts", "for (let iteration = 2; now() < budget.deadline; iteration++) {\n", "for (let iteration = 2; now() < budget.deadline; iteration++) {\n    if (iteration > 4) break;\n"]] },
  { name: "repetitionBlind (row 13): engine ignores repetition in the path", file: "src/transposition.test.ts", filter: "A5",
    edits: [["src/engine.ts", "if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;", "if (false && repeatsInPath(keys, ply, position.halfmoveClock)) return 0;"]] },
  // --- row 21: the re-found HANGING_CORPUS pair
  { name: "row21-T: A1's with-quiescence arms swapped to the bare leaf (Architect's)", file: "src/quiescence.test.ts", filter: "A1", env: { SEARCH_DEEP: "1" },
    edits: [["src/quiescence.test.ts", "const withQuiescence = hangingArm(search, 1);", "const withQuiescence = hangingArm(searchWithoutQuiescence, 1);"], ["src/quiescence.test.ts", "const withQuiescence = hangingArm(search, 3);", "const withQuiescence = hangingArm(searchWithoutQuiescence, 3);"]] },
  { name: "row21-P: production leaf never runs quiescence (search.ts)", file: "src/quiescence.test.ts", filter: "A1", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", "if (!switches.quiescence) return evaluate(position);", "return evaluate(position);"]] },
  // --- row 8: A4 re-search bites
  { name: "row8 noLmrResearch (search.ts + engine.ts)", file: "src/search.pvs-lmr.test.ts", filter: "A4",
    edits: [["src/search.ts", S_RESEARCH, "if (false && score > alpha && reduction > 0) {\n    score =\n      0 -\n      negamax("], ["src/engine.ts", E_RESEARCH, "if (false && score > alpha && reduction > 0) {\n    score = 0 - negamax("]] },
  { name: "row8 discard-re-search, search.ts only (Architect's)", file: "src/search.pvs-lmr.test.ts", filter: "A4",
    edits: [["src/search.ts", S_RESEARCH, "if (score > alpha && reduction > 0) {\n    const discarded =\n      0 -\n      negamax("]] },
  { name: "row8 discard-re-search, engine.ts only (the residual the ruling did not plant)", file: "src/search.pvs-lmr.test.ts", filter: "A4",
    edits: [["src/engine.ts", E_RESEARCH, "if (score > alpha && reduction > 0) {\n    const discarded = 0 - negamax("]] },
  { name: "row8 discard-re-search, search.ts, fixture REVERTED to (a) A4_FEN [95,h5e5]", file: "src/search.pvs-lmr.test.ts", filter: "A4",
    edits: [["src/search.ts", S_RESEARCH, "if (score > alpha && reduction > 0) {\n    const discarded =\n      0 -\n      negamax("],
      ["src/search.pvs-lmr.test.ts", "const shipped = search(parseFen(A4_SEARCH_FEN), A4_DEPTH);", "const shipped = search(parseFen(A4_FEN), A4_DEPTH);"],
      ["src/search.pvs-lmr.test.ts", "const reference = searchWithoutReductions(parseFen(A4_SEARCH_FEN), A4_DEPTH);", "const reference = searchWithoutReductions(parseFen(A4_FEN), A4_DEPTH);"],
      ["src/search.pvs-lmr.test.ts", 'toEqual([10, "b1c1"]);', 'toEqual([95, "h5e5"]);']] },
  // --- row 17 / 873911d: does >= 10% still fail a table that does not store?
  { name: "T1 table: search.ts interior never stores", file: "src/transposition.test.ts", filter: "A2", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", S_STORE, "if (false && switches.table) storeEntry(key, depth,"]] },
  { name: "T2 table: storeEntry is a no-op (every caller)", file: "src/transposition.test.ts", filter: "A2", env: { SEARCH_DEEP: "1" },
    edits: [["src/transposition.ts", "  const slot = Number(key & INDEX_MASK);\n  (keys as BigUint64Array)[slot] = key;", "  if (key !== -1n) return;\n  const slot = Number(key & INDEX_MASK);\n  (keys as BigUint64Array)[slot] = key;"]] },
  { name: "T3 table: interior stores only at depth >= 2 (partial loss)", file: "src/transposition.test.ts", filter: "A2", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", S_STORE, "if (switches.table && depth >= 2) storeEntry(key, depth,"]] },
  { name: "T4 table: interior stores every other node (partial loss)", file: "src/transposition.test.ts", filter: "A2", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", S_STORE, "if (switches.table && (counter.nodes & 1) === 0) storeEntry(key, depth,"]] },
  { name: "T5 table: interior stores only exact bounds", file: "src/transposition.test.ts", filter: "A2", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", S_STORE, "if (switches.table && boundOf(best, alphaIn, beta) === BOUND_EXACT) storeEntry(key, depth,"]] },
  // --- readings only: the default guard's bar pushed to 0.99 so its failure message prints the
  //     reading (works on either tree: the bar literal is matched by regex-free exact text below)
  { name: "R0 reading: default guard, clean table", file: "src/transposition.test.ts", filter: "default lane's standing guard",
    edits: [["src/transposition.test.ts", "parseFen(fenOf(\"position-3\")), 4)),\n    ).toBeGreaterThanOrEqual(", "parseFen(fenOf(\"position-3\")), 4)),\n    ).toBeGreaterThanOrEqual(0.99 + 0 * "]] },
  { name: "R4 reading: default guard under T4 (every other node stores)", file: "src/transposition.test.ts", filter: "default lane's standing guard",
    edits: [["src/search.ts", S_STORE, "if (switches.table && (counter.nodes & 1) === 0) storeEntry(key, depth,"],
      ["src/transposition.test.ts", "parseFen(fenOf(\"position-3\")), 4)),\n    ).toBeGreaterThanOrEqual(", "parseFen(fenOf(\"position-3\")), 4)),\n    ).toBeGreaterThanOrEqual(0.99 + 0 * "]] },
  // --- T4 against the whole transposition file: what else on each lane sees a half-storing table
  { name: "W4 T4, whole transposition.test.ts, default lane", file: "src/transposition.test.ts",
    edits: [["src/search.ts", S_STORE, "if (switches.table && (counter.nodes & 1) === 0) storeEntry(key, depth,"]] },
  { name: "W4d T4, whole transposition.test.ts, SEARCH_DEEP", file: "src/transposition.test.ts", env: { SEARCH_DEEP: "1" },
    edits: [["src/search.ts", S_STORE, "if (switches.table && (counter.nodes & 1) === 0) storeEntry(key, depth,"]] },
];

for (const m of MUTANTS) {
  if (only && !new RegExp(only).test(m.name)) continue;
  const dir = `${scratch}/mut-f`;
  rmSync(dir, { recursive: true, force: true });
  cpSync(tree, dir, { recursive: true, filter: (s) => !s.endsWith("node_modules") });
  symlinkSync(`${tree}/node_modules`, `${dir}/node_modules`);
  for (const [file, from, to] of m.edits) {
    const path = `${dir}/${file}`;
    const src = readFileSync(path, "utf8");
    const n = src.split(from).length - 1;
    if (n !== 1) throw new Error(`${m.name}: anchor found ${n}x in ${file}: ${from.slice(0, 60)}`);
    writeFileSync(path, src.replace(from, to));
  }
  const args = ["vitest", "run", m.file, "--reporter=json", "--outputFile=out.json"];
  if (m.filter) args.push("-t", m.filter);
  const t0 = Date.now();
  const r = spawnSync("npx", args, {
    cwd: dir, encoding: "utf8", timeout: 300_000, killSignal: "SIGTERM",
    env: { ...process.env, ...(m.env ?? {}) },
  });
  let j = null;
  try { j = JSON.parse(readFileSync(`${dir}/out.json`, "utf8")); } catch {}
  const failed = j ? j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed")
    .map((a) => `${a.title} :: ${(a.failureMessages[0] ?? "").split("\n")[0].slice(0, 140)}`)) : [];
  const logs = `${r.stdout}\n${r.stderr}`.split("\n").filter((l) => /ABC-081 A2|A1 depth 3/.test(l)).map((l) => l.trim());
  const rec = {
    mutant: m.name, file: m.file, filter: m.filter ?? null, env: m.env ?? null,
    exit: r.status, signal: r.signal, ms: Date.now() - t0,
    passed: j?.numPassedTests ?? null, failed: j?.numFailedTests ?? null,
    red: j ? j.numFailedTests > 0 : null, failedRows: failed, logs,
  };
  console.log(JSON.stringify(rec));
}
rmSync(`${scratch}/mut-f`, { recursive: true, force: true });
