// ABC-080 mutant run. Each mutant is ONE string replacement in one src file; the default lane of
// the five search/engine test files is run against it (vitest JSON), the failing test names are
// recorded, and the original bytes are written back. Run from the worktree root.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const W = process.argv[2];
const OUT = process.argv[3];
const FILES = [
  "src/search.ordering.test.ts",
  "src/search.test.ts",
  "src/engine.test.ts",
  "src/quiescence.test.ts",
  "src/search.qe.test.ts",
];

const M = [
  ["M1 comparator does not sort (sort(() => 0))", "src/search.ts", ".sort((a, b) => b.key - a.key)", ".sort(() => 0)"],
  ["M2 comparator sorts ascending", "src/search.ts", ".sort((a, b) => b.key - a.key)", ".sort((a, b) => a.key - b.key)"],
  ["M3 search.ts never offers killers", "src/search.ts", 'switches.ordering === "full" ? killers.at(ply) : NO_KILLERS', "NO_KILLERS"],
  ["M4 search.ts offers killers of ply+1", "src/search.ts", 'switches.ordering === "full" ? killers.at(ply) : NO_KILLERS', 'switches.ordering === "full" ? killers.at(ply + 1) : NO_KILLERS'],
  ["M5 search.ts records killers at ply+1", "src/search.ts", "      killers.record(ply, move);", "      killers.record(ply + 1, move);"],
  ["M6 search.ts one killer table shared by every search", "src/search.ts", "  const killers = new KillerTable();\n", "  const killers = SHARED_KILLERS;\n", ["function searchRoot(", "const SHARED_KILLERS = new KillerTable();\nfunction searchRoot("]],
  ["M7 engine.ts interior unordered", "src/engine.ts", "for (const move of orderMoves(moves, budget.killers.at(ply), null))", "for (const move of moves)"],
  ["M8 engine.ts MVV-LVA only (no killers)", "src/engine.ts", "orderMoves(moves, budget.killers.at(ply), null)", "orderMoves(moves, [], null)"],
  ["M9 engine.ts offers killers of ply+1", "src/engine.ts", "orderMoves(moves, budget.killers.at(ply), null)", "orderMoves(moves, budget.killers.at(ply + 1), null)"],
  ["M10 engine.ts one killer table shared across calls", "src/engine.ts", "    killers: new KillerTable(),\n", "    killers: ENGINE_SHARED,\n", ["export function chooseMove(", "const ENGINE_SHARED = new KillerTable();\nexport function chooseMove("]],
  ["M11 engine.ts root unordered", "src/engine.ts", "const rootMoves = orderMoves(legalMoves(position), budget.killers.at(0), null);", "const rootMoves = legalMoves(position);"],
  ["M12 killers ranked above captures", "src/search.ts", "return killer === -1 ? 0 : killers.length - killer;", "return killer === -1 ? 0 : 5_000_000 - killer;"],
  ["M13 mvvLvaKey promotion term dropped (ABC-079 QE G4)", "src/quiescence.ts", "(ORDER_VALUE[move.promotion] as number) -", "0 -"],
  ["M14 KillerTable records captures and promotions", "src/search.ts", "    if (move.captured !== EMPTY || move.promotion !== EMPTY) return;\n    const newest", "    const newest"],
  ["M15 hash move ignored by the comparator", "src/search.ts", "  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;\n", ""],
  ["M16 KillerTable duplicate check removed", "src/search.ts", "else if (!sameMove(newest, move)) this.slots[ply]", "else this.slots[ply]"],
  ["M17 KillerTable keeps one killer, not two", "src/search.ts", "this.slots[ply] = [move, newest];", "this.slots[ply] = [move];"],
  ["M18 killer slots offered oldest first", "src/search.ts", "return killer === -1 ? 0 : killers.length - killer;", "return killer === -1 ? 0 : killer + 1;"],
];

const results = [];
for (const [name, file, from, to, extra] of M) {
  const path = `${W}/${file}`;
  const original = readFileSync(path, "utf8");
  if (original.split(from).length !== 2) throw new Error(`${name}: anchor not unique`);
  let mutated = original.replace(from, to);
  if (extra) {
    if (mutated.split(extra[0]).length !== 2) throw new Error(`${name}: extra anchor not unique`);
    mutated = mutated.replace(extra[0], extra[1]);
  }
  writeFileSync(path, mutated);
  try {
    const json = `${OUT}.tmp.json`;
    spawnSync("npx", ["vitest", "run", ...FILES, "--reporter=json", `--outputFile=${json}`], { cwd: W, encoding: "utf8" });
    const report = JSON.parse(readFileSync(json, "utf8"));
    const failed = report.testResults.flatMap((f) =>
      f.assertionResults.filter((a) => a.status === "failed").map((a) => `${f.name.split("/src/")[1]} :: ${a.fullName}`),
    );
    const suiteErrors = report.testResults.filter((f) => f.status === "failed" && f.assertionResults.length === 0).map((f) => f.name);
    results.push({ name, killed: failed.length > 0 || suiteErrors.length > 0, failed, suiteErrors, total: report.numTotalTests });
    console.log(`${name}: ${failed.length > 0 ? `KILLED by ${failed.length}` : "SURVIVED"}`);
  } finally {
    writeFileSync(path, original);
  }
}
writeFileSync(OUT, JSON.stringify(results, null, 1));
