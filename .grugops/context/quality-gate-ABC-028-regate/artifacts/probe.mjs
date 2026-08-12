import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { assertPins, WT } from "./lane.mjs";
const P = "src/history-pane.ts";
const run = () => execFileSync("node", ["src/qe-regate-probe.ts"], { cwd: WT, encoding: "utf8" }).trim();
assertPins();
const pristine = readFileSync(join(WT, P), "utf8");
console.log("CLEAN pane   ", run());
try {
  let s = pristine.replace('const BLANK_ROW = " ".repeat(HISTORY_COLS);', 'const BLANK_ROW = " ".repeat(HISTORY_COLS);\nconst __WPOS_SEEN = new WeakSet<object>();');
  s = s.replace("  const position = parseFen(history.initialFen);", "  if (!__WPOS_SEEN.has(history)) {\n    __WPOS_SEEN.add(history);\n    (history as { position: { fullmoveNumber: number } }).position.fullmoveNumber = 9999;\n  }\n  const position = parseFen(history.initialFen);");
  if (s === pristine) throw new Error("WPOS anchors did not apply");
  writeFileSync(join(WT, P), s);
  console.log("WPOS  pane   ", run());
} finally {
  writeFileSync(join(WT, P), pristine);
  assertPins();
  console.log("pins restored and re-verified");
}
