import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const SCRATCH = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/0d03b633-8518-42bd-a8f5-1d5a65199890/scratchpad";
const BASE = join(SCRATCH, "base");
const NM = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-qe/node_modules";
const src = readFileSync(join(BASE, "src/history-pane.ts"), "utf8");
if (createHash("md5").update(src).digest("hex") !== "54fd4346dcc1a0060c4e66ae0149265d") throw new Error("md5");
const LEAD = "  const leadingHalfRow = blackToMoveAtAnchor ? 1 : 0;\n";
const MOVES = "  const moves = history.moves;\n";
const ROWS = "  const rows = pairs.map(rowFor);\n";
for (const a of [LEAD, MOVES, ROWS]) if (src.split(a).length !== 2) throw new Error(`anchor ${a}`);
const MUT = {
  "WLEAD-ODD": src.replace(LEAD, "  const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0;\n"),
  WSPLICE: src
    .replace(MOVES, `${MOVES}  const __w = history.moves as Move[];\n  if (__w.length > 1) __w.unshift(...__w.splice(0, 1));\n`)
    .replace(ROWS, `  void __w;\n${ROWS}`),
  WNOMAX: src.replace(
    "  const hiddenRows = Math.max(0, rowsInGame - HISTORY_ROWS);\n",
    "  const hiddenRows = rowsInGame - HISTORY_ROWS;\n",
  ),
};
for (const [name, text] of Object.entries(MUT)) {
  if (text === src) throw new Error(`${name} no-op`);
  const dir = join(SCRATCH, `lane-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(BASE, "src"), join(dir, "src"), { recursive: true });
  for (const f of ["package.json", "tsconfig.json", "biome.json"]) cpSync(join(BASE, f), join(dir, f));
  symlinkSync(NM, join(dir, "node_modules"));
  writeFileSync(join(dir, "src/history-pane.ts"), text);
  console.log(`built lane-${name}`);
}
