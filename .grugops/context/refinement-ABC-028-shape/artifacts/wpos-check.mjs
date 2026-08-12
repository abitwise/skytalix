// The one measurement this ruling turns on, taken by BA/PM rather than transcribed from QE.
//
// `src/history-pane.test.ts:493` claims, present tense, as the stated reason `buildAllCases()` is
// called inside each `A9` test:
//   "WPOS — a pane that corrupts the caller's `history.position` once per object and changes no
//    rendered byte — passes 732/732 on 26 files against the shared fixtures, with zero catchers
//    anywhere in the project, and fails here."
//
// Two separable claims: a DENOMINATOR (732) and an EXHAUSTIVENESS claim (zero catchers anywhere).
// Only a mutant can decide the second. Build it and count the catchers.
import { buildLane, replaceOnce, suite } from "./mk.mjs";

const ANCHOR = "  const position = parseFen(history.initialFen);";
const WPOS = `  const position = parseFen(history.initialFen);
  if (!__wposSeen.has(history)) {
    __wposSeen.add(history);
    (history.position as { fullmoveNumber: number }).fullmoveNumber = 9999;
  }`;

const mutate = (src) => {
  const withSet = replaceOnce(
    src,
    "export function renderHistory(history: GameHistory): string[] {",
    "const __wposSeen = new WeakSet<GameHistory>();\nexport function renderHistory(history: GameHistory): string[] {",
    "renderHistory signature",
  );
  return replaceOnce(withSet, ANCHOR, WPOS, "parseFen line");
};

const control = suite(buildLane("null-control", null));
console.log(`NULL CONTROL (no mutant): ${control.failed.length} failed / ${control.total} on ${control.files} files`);
for (const t of control.failed) console.log(`  FAIL  ${t.title.slice(0, 130)}`);

const wpos = suite(buildLane("wpos", mutate));
console.log(`WPOS:                     ${wpos.failed.length} failed / ${wpos.total} on ${wpos.files} files`);
for (const t of wpos.failed) console.log(`  FAIL  ${t.title.slice(0, 130)}`);
