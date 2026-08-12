// attack3b.mjs — A2 configuration (b), done PROPERLY.
//
// The first attempt destructured a Proxy at module scope, which binds ONCE — it was a NO-OP that
// reproduced the delivered numbers exactly, and that is how it was caught. This one uses `let` +
// a file-scope `beforeEach` (`beforeEach` is already imported by that file at :25), which is
// "rebuilt per test" literally.
import { runBuild, report, assertPins } from "./lane.mjs";

const P = "src/history-pane.ts";
const N = "src/history-pane.nfr.test.ts";

const DECLS = [
  ["AT_0", "newGame(START_FEN)"], ["AT_1", "shuffleGame(1)"], ["AT_3", "shuffleGame(3)"],
  ["AT_19", "shuffleGame(19)"], ["AT_40", "deterministicGame(40)"], ["AT_120", "deterministicGame(120)"],
  ["AT_300", "deterministicGame(300)"], ["AT_2000", "shuffleGame(2000)"],
];
const NFR_PER_TEST = [{
  file: N,
  find: DECLS.map(([n, e]) => `const ${n} = ${e};`).join("\n"),
  replace:
    DECLS.map(([n, e]) => `let ${n} = ${e};`).join("\n") +
    "\nbeforeEach(() => {\n" + DECLS.map(([n, e]) => `  ${n} = ${e};`).join("\n") + "\n});",
}];

const cacheHead = (decl, hit) => ({ file: P, find: "export function renderHistory(history: GameHistory): string[] {", replace: `${decl}\nexport function renderHistory(history: GameHistory): string[] {\n${hit}` });
const cacheTail = (store) => ({ file: P, find: "  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n  return rows;", replace: `  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n${store}\n  return rows;` });
const WCACHE = [cacheHead("const __CN = new WeakMap<object, string[]>();", "  const __hit = __CN.get(history);\n  if (__hit !== undefined) return __hit;"), cacheTail("  __CN.set(history, rows);")];
const WCACHE_LEN = [cacheHead("const __CL = new WeakMap<object, { len: number; rows: string[] }>();", "  const __hit = __CL.get(history);\n  if (__hit !== undefined && __hit.len === history.moves.length) return __hit.rows;"), cacheTail("  __CL.set(history, { len: history.moves.length, rows });")];

assertPins();
console.log("PINS OK — merged tip 0ee148e\n--- A2 (b): nfr module-scope fixtures REBUILT PER TEST (let + beforeEach) ---");
report(runBuild("(b) NULL CONTROL", NFR_PER_TEST));
report(runBuild("(b) WCACHE (naive)", [...NFR_PER_TEST, ...WCACHE]));
report(runBuild("(b) WCACHE-LEN", [...NFR_PER_TEST, ...WCACHE_LEN]));
report(runBuild("(b) WCACHE-LAST-ish ctl", [...NFR_PER_TEST, cacheHead("const __CA = new WeakMap<object, { len: number; last: unknown; rows: string[] }>();", "  const __hit = __CA.get(history);\n  if (__hit !== undefined && __hit.len === history.moves.length && __hit.last === history.moves[history.moves.length - 1]) return __hit.rows;"), cacheTail("  __CA.set(history, { len: history.moves.length, last: history.moves[history.moves.length - 1], rows });")]));
