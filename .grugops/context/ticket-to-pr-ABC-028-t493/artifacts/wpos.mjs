// The WPOS mutant, rebuilt on THIS tree by the Engineer, with a null control beside it.
//
// WPOS = a pane that corrupts the caller's `history.position` ONCE PER OBJECT and changes no
// rendered byte. It is the build the `A9` doc comment names. The done-condition asks for the two
// catchers to be MEASURED here, not pasted, and for the tip's own total to be measured with them.
import { buildLane, replaceOnce, suite } from "./lane.mjs";

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
console.log(
  `NULL CONTROL (no mutant): ${control.failed.length} failed / ${control.total} on ${control.files} files`,
);
for (const t of control.failed) console.log(`  FAIL  ${t.title.slice(0, 140)}`);

const wpos = suite(buildLane("wpos", mutate));
console.log(`WPOS:                     ${wpos.failed.length} failed / ${wpos.total} on ${wpos.files} files`);
for (const t of wpos.failed) console.log(`  FAIL  ${t.title.slice(0, 140)}`);
