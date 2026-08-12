// THE NUMERATOR NOBODY RE-RAN. `src/history-pane.nfr.test.ts:115` claims a pane keyed on
// `moves.length` plus the last THREE move identities "fails exactly 2 of 752", the owned lane
// "passes 26/26", and the per-test rebuild takes the suite to "752/752 GREEN".
//
// BA/PM measured the three DENOMINATORS stale (the suite is 755) and left the NUMERATOR
// `UNKNOWN - verify` because it built no mutant. This builds it.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildLane, read, replaceOnce } from "./lane.mjs";

const RENDER_ANCHOR = "export function renderHistory(history: GameHistory): string[] {";

/** The cache mutant: the delivered body kept VERBATIM and renamed, a memoiser put in front. */
function cacheMutant(source, depth) {
  const wrapper = [
    "const __rowCache = new WeakMap<GameHistory, { key: string; rows: string[] }>();",
    "const __identities = new WeakMap<Move, number>();",
    "let __nextIdentity = 1;",
    "function __identityOf(move: Move): number {",
    "  let id = __identities.get(move);",
    "  if (id === undefined) {",
    "    id = __nextIdentity++;",
    "    __identities.set(move, id);",
    "  }",
    "  return id;",
    "}",
    "function __cacheKey(history: GameHistory): string {",
    "  const moves = history.moves;",
    "  const parts: string[] = [String(moves.length)];",
    `  for (let back = 1; back <= ${depth}; back++) {`,
    "    const move = moves[moves.length - back];",
    "    parts.push(move === undefined ? '-' : String(__identityOf(move)));",
    "  }",
    "  return parts.join(':');",
    "}",
    "export function renderHistory(history: GameHistory): string[] {",
    "  const key = __cacheKey(history);",
    "  const hit = __rowCache.get(history);",
    "  if (hit !== undefined && hit.key === key) return hit.rows;",
    "  const rows = __renderHistoryUncached(history);",
    "  __rowCache.set(history, { key, rows });",
    "  return rows;",
    "}",
    "function __renderHistoryUncached(history: GameHistory): string[] {",
  ].join("\n");
  return replaceOnce(source, RENDER_ANCHOR, wrapper, "renderHistory signature");
}

// Configuration (b): the module-scope `AT_*` fixtures AND the `LONG_GAMES` table that captures them
// rebuilt per test. Rebuilding the fixtures WITHOUT the table would leave `A11` reading the
// original objects — a false green.
const FIXTURES = [
  ["AT_0", "newGame(START_FEN)"],
  ["AT_1", "shuffleGame(1)"],
  ["AT_3", "shuffleGame(3)"],
  ["AT_19", "shuffleGame(19)"],
  ["AT_40", "deterministicGame(40)"],
  ["AT_120", "deterministicGame(120)"],
  ["AT_300", "deterministicGame(300)"],
  ["AT_2000", "shuffleGame(2000)"],
];
const LONG_GAMES_DECL = `const LONG_GAMES: readonly (readonly [plies: number, history: GameHistory])[] = [
  [40, AT_40],
  [120, AT_120],
  [300, AT_300],
  [2000, AT_2000],
];`;

function perTestFixtures(source) {
  let out = source;
  for (const [name, expression] of FIXTURES) {
    out = replaceOnce(out, `const ${name} = ${expression};`, `let ${name} = ${expression};`, name);
  }
  const rebuilt = [
    LONG_GAMES_DECL.replace("const LONG_GAMES", "let LONG_GAMES"),
    "",
    "beforeEach(() => {",
    ...FIXTURES.map(([name, expression]) => `  ${name} = ${expression};`),
    "  LONG_GAMES = [",
    "    [40, AT_40],",
    "    [120, AT_120],",
    "    [300, AT_300],",
    "    [2000, AT_2000],",
    "  ];",
    "});",
  ].join("\n");
  return replaceOnce(out, LONG_GAMES_DECL, rebuilt, "LONG_GAMES table");
}

function suite(lane, file) {
  const report = join(lane, "__report.json");
  const args = ["vitest", "run", "--reporter=json", `--outputFile=${report}`];
  if (file) args.push(file);
  try {
    execFileSync("npx", args, { cwd: lane, encoding: "utf8", stdio: "pipe" });
  } catch {
    /* red is the point */
  }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const tests = json.testResults.flatMap((f) => f.assertionResults);
  return {
    total: json.numTotalTests,
    files: json.testResults.length,
    failed: tests.filter((t) => t.status === "failed"),
  };
}

for (const [name, depth, perTest] of [
  ["LAST3", 3, false],
  ["LAST3-perTest", 3, true],
  ["NULL-CONTROL", null, false],
]) {
  const lane = buildLane(`n-${name}`, {
    editPane: depth === null ? null : (source) => cacheMutant(source, depth),
  });
  if (perTest) {
    writeFileSync(
      join(lane, "src/history-pane.nfr.test.ts"),
      perTestFixtures(read("src/history-pane.nfr.test.ts")),
    );
  }
  const full = suite(lane, null);
  const owned = suite(lane, "src/history-pane.test.ts");
  console.log(`--- ${name}`);
  console.log(`    full suite : ${full.failed.length} failed / ${full.total} on ${full.files} files`);
  console.log(`    owned lane : ${owned.failed.length} failed / ${owned.total}`);
  for (const test of full.failed) console.log(`      FAIL  ${test.title.slice(0, 120)}`);
}
