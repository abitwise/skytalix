// attack4.mjs — `src/history-pane.test.ts:1018` (BA/PM's instance 2, EXCLUDED from the `:493`
// repair by ruling) claims: "a cache keyed on the last THREE identities survives both rows below."
// That is a claim about THIS file, in THIS ticket's own comment. It is tested, not read.
import { runBuild, report, assertPins } from "./lane.mjs";
const P = "src/history-pane.ts";
const key = (n) => `__k(history.moves, ${n})`;
const HELPER =
  "const __k = (m: readonly unknown[], n: number): string =>\n" +
  "  m.slice(Math.max(0, m.length - n)).map((x) => __ids.get(x as object) ?? (__ids.set(x as object, ++__seq), String(__seq))).join(\"|\");\n" +
  "const __ids = new WeakMap<object, string>();\nlet __seq = 0;\n";
const build = (n) => [
  {
    file: P,
    find: "export function renderHistory(history: GameHistory): string[] {",
    replace:
      `${HELPER}const __C${n} = new Map<object, { len: number; k: string; rows: string[] }>();\n` +
      "export function renderHistory(history: GameHistory): string[] {\n" +
      `  const __hit = __C${n}.get(history);\n` +
      `  if (__hit !== undefined && __hit.len === history.moves.length && __hit.k === ${key(n)}) return __hit.rows;`,
  },
  {
    file: P,
    find: "  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n  return rows;",
    replace:
      "  const rows = pairs.map(rowFor);\n  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);\n" +
      `  __C${n}.set(history, { len: history.moves.length, k: ${key(n)}, rows });\n  return rows;`,
  },
];
assertPins();
console.log("PINS OK — merged tip 0ee148e\n");
for (const n of [1, 2, 3]) report(runBuild(`WCACHE-LAST${n} (key = last ${n})`, build(n)));
