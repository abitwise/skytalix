// attack3.mjs — `A2`'s two configurations, re-run on the merged tip, plus the naive `WCACHE`.
//
// `A2` is the only one of the five criteria that is not a build's death in the delivered suite: it
// asserts WHERE the deaths are. Both configurations are run here rather than read off the page.

import { runBuild, report, assertPins } from "./lane.mjs";

const P = "src/history-pane.ts";
const N = "src/history-pane.nfr.test.ts";

const cacheHead = (decl, hit) => ({
  file: P,
  find: "export function renderHistory(history: GameHistory): string[] {",
  replace: `${decl}\nexport function renderHistory(history: GameHistory): string[] {\n${hit}`,
});
const cacheTail = (store) => ({
  file: P,
  find: "  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n  return rows;",
  replace: `  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n${store}\n  return rows;`,
});

/** WCACHE — the naive one: memoise per `GameHistory`, NEVER invalidated. */
const WCACHE = [
  cacheHead(
    "const __CN = new WeakMap<object, string[]>();",
    "  const __hit = __CN.get(history);\n  if (__hit !== undefined) return __hit;",
  ),
  cacheTail("  __CN.set(history, rows);"),
];

const WCACHE_LEN = [
  cacheHead(
    "const __CL = new WeakMap<object, { len: number; rows: string[] }>();",
    "  const __hit = __CL.get(history);\n  if (__hit !== undefined && __hit.len === history.moves.length) return __hit.rows;",
  ),
  cacheTail("  __CL.set(history, { len: history.moves.length, rows });"),
];

/** Configuration (b): the nfr file's module-scope fixtures rebuilt PER TEST. Each `AT_*` becomes a
 *  getter, so every reference in that file constructs a fresh object — which is exactly what
 *  "rebuilt per test" buys, without touching a single `it`. */
const NFR_PER_TEST = [
  {
    file: N,
    find:
      "const AT_0 = newGame(START_FEN);\n" +
      "const AT_1 = shuffleGame(1);\n" +
      "const AT_3 = shuffleGame(3);\n" +
      "const AT_19 = shuffleGame(19);\n" +
      "const AT_40 = deterministicGame(40);\n" +
      "const AT_120 = deterministicGame(120);\n" +
      "const AT_300 = deterministicGame(300);\n" +
      "const AT_2000 = shuffleGame(2000);",
    replace:
      "const __rebuilt = {\n" +
      "  get AT_0() { return newGame(START_FEN); },\n" +
      "  get AT_1() { return shuffleGame(1); },\n" +
      "  get AT_3() { return shuffleGame(3); },\n" +
      "  get AT_19() { return shuffleGame(19); },\n" +
      "  get AT_40() { return deterministicGame(40); },\n" +
      "  get AT_120() { return deterministicGame(120); },\n" +
      "  get AT_300() { return deterministicGame(300); },\n" +
      "  get AT_2000() { return shuffleGame(2000); },\n" +
      "};\n" +
      "const { AT_0, AT_1, AT_3, AT_19, AT_40, AT_120, AT_300, AT_2000 } = new Proxy({} as never, {\n" +
      "  get: (_t, k) => (__rebuilt as Record<string, unknown>)[k as string],\n" +
      "}) as unknown as Record<string, GameHistory>;",
  },
];

assertPins();
console.log("PINS OK — merged tip 0ee148e\n");

console.log("--- A2 configuration (a): src/history-pane.test.ts ALONE, nfr NOT loaded ---");
report(runBuild("(a) NULL CONTROL", [{ file: P, find: "const BLANK_ROW =", replace: "const BLANK_ROW =" }], { only: "src/history-pane.test.ts" }));
report(runBuild("(a) WCACHE (naive)", WCACHE, { only: "src/history-pane.test.ts" }));
report(runBuild("(a) WCACHE-LEN", WCACHE_LEN, { only: "src/history-pane.test.ts" }));

console.log("\n--- A2 configuration (b): FULL suite, nfr module-scope fixtures rebuilt PER TEST ---");
report(runBuild("(b) NULL CONTROL", NFR_PER_TEST));
report(runBuild("(b) WCACHE (naive)", [...NFR_PER_TEST, ...WCACHE]));
report(runBuild("(b) WCACHE-LEN", [...NFR_PER_TEST, ...WCACHE_LEN]));

console.log("\n--- the delivered-suite baseline for both builds, for comparison ---");
report(runBuild("WCACHE (naive), delivered", WCACHE));
