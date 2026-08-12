// attack.mjs — the builds this re-gate turns on. Every one is an ANCHORED edit whose anchor is
// asserted unique, applied to a pinned detached worktree at the merged tip `0ee148e`, restored in
// a `finally` with the pins re-verified after every build.
//
// The mutants marked `BA/PM` are reproduced byte-for-byte from the definitions on the ticket page
// so the numbers are comparable across roles; the ones marked `MINE` are this hop's.

import { runBuild, report, assertPins } from "./lane.mjs";

const P = "src/history-pane.ts";
const T = "src/history-pane.test.ts";

// ---- production-side mutants (the pane) -----------------------------------------------------

/** WPOS — BA/PM's. Corrupts the caller's `history.position` ONCE PER OBJECT, no rendered byte. */
const WPOS = [
  {
    file: P,
    find: 'const BLANK_ROW = " ".repeat(HISTORY_COLS);',
    replace: 'const BLANK_ROW = " ".repeat(HISTORY_COLS);\nconst __WPOS_SEEN = new WeakSet<object>();',
  },
  {
    file: P,
    find: "  const position = parseFen(history.initialFen);",
    replace:
      "  if (!__WPOS_SEEN.has(history)) {\n" +
      "    __WPOS_SEEN.add(history);\n" +
      "    (history as { position: { fullmoveNumber: number } }).position.fullmoveNumber = 9999;\n" +
      "  }\n" +
      "  const position = parseFen(history.initialFen);",
  },
];

/** WPOSMID — BA/PM's. Writes `position.fullmoveNumber` MID-render through the handed reference
 *  and restores it before the render returns. The `A4` calibration control. */
const WPOSMID = [
  {
    file: P,
    find: "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);",
    replace:
      "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);\n" +
      "  const __h = history as { position: { fullmoveNumber: number } };\n" +
      "  const __sv = __h.position.fullmoveNumber;\n" +
      "  __h.position.fullmoveNumber = 1234;\n" +
      "  __h.position.fullmoveNumber = __sv;",
  },
];

/** WLEAD-ODD — the ticket's named `A3` build. */
const WLEAD_ODD = [
  {
    file: P,
    find: "  const leadingHalfRow = blackToMoveAtAnchor ? 1 : 0;",
    replace: "  const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0;",
  },
];

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

/** WCACHE-LEN — the ticket's named `A1` build: memoise per `GameHistory`, key = `moves.length`. */
const WCACHE_LEN = [
  cacheHead(
    "const __CL = new WeakMap<object, { len: number; rows: string[] }>();",
    "  const __hit = __CL.get(history);\n  if (__hit !== undefined && __hit.len === history.moves.length) return __hit.rows;",
  ),
  cacheTail("  __CL.set(history, { len: history.moves.length, rows });"),
];

/** WCACHE-LAST — the ticket's named `A5` build: key = `moves.length` AND last move IDENTITY. */
const WCACHE_LAST = [
  cacheHead(
    "const __CA = new WeakMap<object, { len: number; last: unknown; rows: string[] }>();",
    "  const __hit = __CA.get(history);\n  if (__hit !== undefined && __hit.len === history.moves.length && __hit.last === history.moves[history.moves.length - 1]) return __hit.rows;",
  ),
  cacheTail(
    "  __CA.set(history, { len: history.moves.length, last: history.moves[history.moves.length - 1], rows });",
  ),
];

// ---- test-side edits: the two falsifiers of the REPLACEMENT COMMENT --------------------------

/** HOIST — MINE. Undoes `D23` for the ONE `it` the mechanism sentence is about: `A9`'s
 *  non-mutation snapshot iterates the module-scope `ALL_CASES` instead of `buildAllCases()`.
 *  This is the experiment the mechanism sentence PREDICTS the outcome of. */
const HOIST = [
  {
    file: T,
    find:
      '  it("A9 — neither render touches the caller\'s position, its move count or its ANCHOR", () => {\n' +
      "    for (const [name, history] of buildAllCases()) {",
    replace:
      '  it("A9 — neither render touches the caller\'s position, its move count or its ANCHOR", () => {\n' +
      "    for (const [name, history] of ALL_CASES) {",
  },
];

/** A4-BLIND — MINE. A commit to `ABC-028`'s OWN `A4` instrument: the recording view stops
 *  recursing into nested nodes, so `history.position` is handed over RAW. `A4` still asserts,
 *  still arms, still passes — it just no longer sees a write to `position`. */
const A4_BLIND = [
  {
    file: T,
    find: '        if (typeof value === "object" && value !== null && !(value instanceof ArrayBuffer)) {',
    replace: '        if (false && typeof value === "object" && value !== null && !(value instanceof ArrayBuffer)) {',
  },
];

// ---- run ------------------------------------------------------------------------------------

const RUNS = [
  ["NULL CONTROL", []],
  ["WPOS (BA/PM)", WPOS],
  ["WPOSMID (BA/PM)", WPOSMID],
  ["WLEAD-ODD", WLEAD_ODD],
  ["WCACHE-LEN", WCACHE_LEN],
  ["WCACHE-LAST", WCACHE_LAST],
  ["HOIST alone (MINE)", HOIST],
  ["HOIST + WPOS (MINE)", [...HOIST, ...WPOS]],
  ["A4-BLIND alone (MINE)", A4_BLIND],
  ["A4-BLIND + WPOS (MINE)", [...A4_BLIND, ...WPOS]],
];

assertPins();
console.log("PINS OK — measuring against the merged tip 0ee148e\n");
const wanted = process.argv[2];
for (const [name, edits] of RUNS) {
  if (wanted && !name.startsWith(wanted)) continue;
  report(runBuild(name, edits.length ? edits : [{ file: P, find: "const BLANK_ROW =", replace: "const BLANK_ROW =" }]));
}
