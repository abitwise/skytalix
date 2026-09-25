// ABC-081 mutant runner. Each mutant is ONE string replacement in one src file; the default lane of
// the six search/engine test files runs against it (vitest JSON); the original bytes are written
// back and `git status --porcelain -- src` is asserted empty. Usage: node mutants.mjs <worktree> [ids...]
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const W = process.argv[2];
const only = process.argv.slice(3);
const FILES = [
  "src/search.test.ts",
  "src/search.ordering.test.ts",
  "src/quiescence.test.ts",
  "src/search.qe.test.ts",
  "src/engine.test.ts",
  "src/transposition.test.ts",
];

const MUTANTS = [
  { id: "T1", what: "mate scores stored and read raw (no ±ply)", file: "src/transposition.ts",
    from: "  if (stored >= MATE_FLOOR) return stored - ply;\n  if (stored <= -MATE_FLOOR) return stored + ply;\n", to: "" },
  { id: "T2", what: "mate adjusted the wrong way at store", file: "src/transposition.ts",
    from: "score >= MATE_FLOOR ? score + ply : score <= -MATE_FLOOR ? score - ply : score", to: "score >= MATE_FLOOR ? score - ply : score <= -MATE_FLOOR ? score + ply : score" },
  { id: "T3", what: "cutoff at any stored depth >= needed (the conventional rule)", file: "src/transposition.ts",
    from: "if (entryDepth(slot) !== depth) return null;", to: "if (entryDepth(slot) < depth) return null;" },
  { id: "T4", what: "cutoff at any stored depth at all", file: "src/transposition.ts",
    from: "if (entryDepth(slot) !== depth) return null;", to: "" },
  { id: "T5", what: "every bound cuts as if exact", file: "src/transposition.ts",
    from: "  if (bound === BOUND_EXACT) return score;", to: "  if (bound !== 0) return score;" },
  { id: "T6", what: "lower and upper bounds swapped at store", file: "src/transposition.ts",
    from: "  if (best <= alphaIn) return BOUND_UPPER;\n  if (best >= beta) return BOUND_LOWER;", to: "  if (best <= alphaIn) return BOUND_LOWER;\n  if (best >= beta) return BOUND_UPPER;" },
  { id: "T7", what: "full key not verified (index only)", file: "src/transposition.ts",
    from: "return words[slot] !== 0 && (keys as BigUint64Array)[slot] === key ? slot : -1;", to: "return words[slot] !== 0 ? slot : -1;" },
  { id: "T8", what: "clearTable does not clear", file: "src/transposition.ts",
    from: "  words.fill(0);\n", to: "" },
  { id: "T9", what: "hash move never returned", file: "src/transposition.ts",
    from: "    if (packMove(move) === packed) return move;", to: "    if (packMove(move) === packed) return null;" },
  { id: "T10", what: "promotion dropped from the packed move", file: "src/transposition.ts",
    from: "return move.from | (move.to << 7) | (move.promotion << 14);", to: "return move.from | (move.to << 7);" },
  { id: "R1", what: "search.ts: no in-tree repetition", file: "src/search.ts",
    from: "  const key = keys[ply] as bigint;\n  const oldest", to: "  return false;\n  const key = keys[ply] as bigint;\n  const oldest" },
  { id: "R2", what: "repetition scores a loss, not 0", file: "src/search.ts",
    from: "if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;\n  if (depth <= 0", to: "if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0 - (MATE_SCORE - ply);\n  if (depth <= 0" },
  { id: "R3", what: "engine.ts: no in-tree repetition", file: "src/engine.ts",
    from: "  if (repeatsInPath(keys, ply, position.halfmoveClock)) return 0;", to: "" },
  { id: "R4", what: "repetition scan starts at ply-6 (misses the nearest)", file: "src/search.ts",
    from: "for (let earlier = ply - 4;", to: "for (let earlier = ply - 6;" },
  { id: "K1", what: "search.ts: key array allocated per node, not per search", file: "src/search.ts",
    from: "  const key = keys[ply] as bigint;\n\n  const slot = switches.table", to: "  const key = keys[ply] as bigint;\n  new BigUint64Array(1);\n\n  const slot = switches.table" },
  { id: "K2", what: "engine.ts: key array allocated per iteration", file: "src/engine.ts",
    from: "  const rootKey = budget.keys[0] as bigint;", to: "  new BigUint64Array(1);\n  const rootKey = budget.keys[0] as bigint;" },
  { id: "K3", what: "capacity guard removed (search.ts)", file: "src/search.ts",
    from: "if (depth <= 0 || ply >= KEY_ARRAY_CAPACITY) {", to: "if (depth <= 0) {" },
  { id: "K4", what: "NaN depth back to `depth < 1`", file: "src/search.ts",
    from: "if (!(depth >= 1)) {", to: "if (depth < 1) {" },
  { id: "E1", what: "engine.ts: table not cleared per chooseMove", file: "src/engine.ts",
    from: "  budget.keys[0] = zobristKey(position);\n  clearTable();", to: "  budget.keys[0] = zobristKey(position);" },
  { id: "E2", what: "engine.ts: interior never stores", file: "src/engine.ts",
    from: "  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);", to: "" },
  { id: "E3", what: "engine.ts: root not re-ordered by its hash move", file: "src/engine.ts",
    from: "slot === -1 ? null : entryMove(slot, moves),", to: "null," },
  { id: "E4", what: "engine.ts: interior hash move ignored", file: "src/engine.ts",
    from: "  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {", to: "  for (const move of orderMoves(moves, budget.killers.at(ply), null)) {" },
  { id: "S1", what: "search.ts: interior hash move ignored", file: "src/search.ts",
    from: "  return orderMoves(moves, killers.at(ply), hashMove);", to: "  return orderMoves(moves, killers.at(ply), null);" },
  { id: "S2", what: "search.ts: search() does not clear the table", file: "src/search.ts",
    from: "  if (switches.table) clearTable();", to: "" },
  { id: "S3", what: "search.ts: the table-off door uses the table", file: "src/search.ts",
    from: "searchWithoutTable(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: false,", to: "searchWithoutTable(position: Position, depth: number): SearchResult {\n  return searchRoot(position, depth, {\n    prune: true,\n    quiescence: true,\n    ordering: \"full\",\n    table: true," },
  { id: "G1", what: "QE ABC-080 N3: engine records a killer on every move tried", file: "src/engine.ts",
    from: "    if (best > alpha) alpha = best;\n    if (alpha >= beta) {\n      budget.killers.record(ply, move);\n      break;\n    }", to: "    budget.killers.record(ply, move);\n    if (best > alpha) alpha = best;\n    if (alpha >= beta) {\n      break;\n    }" },
  { id: "M13", what: "ABC-080 M13: mvvLvaKey promotion term dropped", file: "src/quiescence.ts",
    from: "    (ORDER_VALUE[move.promotion] as number) -\n", to: "" },
];

const results = [];
for (const m of MUTANTS) {
  if (only.length && !only.includes(m.id)) continue;
  const path = `${W}/${m.file}`;
  const original = readFileSync(path, "utf8");
  const count = original.split(m.from).length - 1;
  if (count !== 1) {
    results.push({ id: m.id, what: m.what, error: `pattern found ${count} times` });
    continue;
  }
  writeFileSync(path, original.replace(m.from, m.to));
  let failed = [];
  let note = "";
  try {
    const run = spawnSync("npx", ["vitest", "run", "--reporter=json", "--testTimeout=20000", ...FILES], {
      cwd: W, encoding: "utf8", timeout: 400_000, maxBuffer: 64 * 1024 * 1024,
    });
    const start = run.stdout.indexOf("{");
    if (start === -1) note = `no JSON (status ${run.status}, signal ${run.signal})`;
    else {
      const json = JSON.parse(run.stdout.slice(start));
      for (const file of json.testResults) for (const t of file.assertionResults)
        if (t.status === "failed") failed.push(`${file.name.split("/src/")[1]} :: ${t.fullName}`);
      note = `${json.numPassedTests} passed / ${json.numFailedTests} failed`;
    }
  } finally {
    writeFileSync(path, original);
  }
  const dirty = execFileSync("git", ["status", "--porcelain", "--", "src"], { cwd: W, encoding: "utf8" }).trim();
  if (dirty) throw new Error(`src dirty after ${m.id}: ${dirty}`);
  results.push({ id: m.id, what: m.what, killed: failed.length > 0, note, failed });
  console.log(`${m.id} ${failed.length > 0 ? "KILLED" : "SURVIVED"} (${note}) — ${m.what}`);
  for (const f of failed.slice(0, 6)) console.log(`    ${f}`);
  if (failed.length > 6) console.log(`    ... ${failed.length - 6} more`);
}
writeFileSync(new URL("./mutants-out.json", import.meta.url), JSON.stringify(results, null, 2));
