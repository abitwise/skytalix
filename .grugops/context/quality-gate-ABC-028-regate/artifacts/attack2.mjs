// attack2.mjs — round two. The first falsifier of the replacement comment's citation clause
// (`A4-BLIND`) was CAUGHT by `A4`'s own arming tripwire. These are the two that are not.
//
// The clause under attack is, verbatim from `src/history-pane.test.ts:496-497`:
//   "It dies here, and it dies again at `ABC-028` `A4` in this file, which watches the caller's
//    graph DURING a render."
// The Engineer's published position is that the replacement is a DEDUCTION and therefore
// "nothing anyone commits can falsify it". These builds are commits.

import { runBuild, report, assertPins } from "./lane.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const P = "src/history-pane.ts";
const T = "src/history-pane.test.ts";

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

// The `it` block verbatim, lifted from the pinned tree so the deletion cannot drift.
const src = readFileSync(join(process.env.WT, T), "utf8");
const start = src.indexOf('  it("A4 — no write reaches the caller\'s graph during a render, at all ten lengths", () => {');
const end = src.indexOf("\n  });\n", start) + "\n  });\n".length;
const A4_BLOCK = src.slice(start, end);
if (start < 0 || A4_BLOCK.length < 200 || A4_BLOCK.length > 1200) throw new Error("A4 block extraction failed");

/** A4-DELETED — MINE. The plainest commit there is: the `it` goes. */
const A4_DELETED = [{ file: T, find: A4_BLOCK, replace: "" }];

/** A4-RENAMED — MINE. NO test is deleted, NO coverage is lost, the total does not move: the
 *  criterion letter is renumbered, which is a thing this ticket's page has done repeatedly. */
const A4_RENAMED = [
  {
    file: T,
    find: '  it("A4 — no write reaches the caller\'s graph during a render, at all ten lengths", () => {',
    replace: '  it("A7 — no write reaches the caller\'s graph during a render, at all ten lengths", () => {',
  },
];

const RUNS = [
  ["A4-DELETED alone", A4_DELETED],
  ["A4-DELETED + WPOS", [...A4_DELETED, ...WPOS]],
  ["A4-RENAMED alone", A4_RENAMED],
  ["A4-RENAMED + WPOS", [...A4_RENAMED, ...WPOS]],
];

assertPins();
console.log("PINS OK — merged tip 0ee148e\n");
for (const [name, edits] of RUNS) report(runBuild(name, edits));
