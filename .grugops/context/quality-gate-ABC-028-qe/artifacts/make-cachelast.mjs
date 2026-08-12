// WCACHE-LAST — the next cache in the series. Memoised per `GameHistory`, invalidated when EITHER
// `moves.length` OR the identity of the last move changes.
//
// It is the natural fix an engineer reaches for after `A1` catches `WCACHE-LEN`: "key on the last
// move too, then a take-back-and-replay invalidates." `A14` cannot fail on it (the length moves)
// and `A1` cannot fail on it (take back one, play a DIFFERENT move -> a fresh `Move` object).
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCRATCH = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/0d03b633-8518-42bd-a8f5-1d5a65199890/scratchpad";
const BASE = join(SCRATCH, "base");
const NODE_MODULES = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-qe/node_modules";

const source = readFileSync(join(BASE, "src/history-pane.ts"), "utf8");
const md5 = createHash("md5").update(source).digest("hex");
if (md5 !== "54fd4346dcc1a0060c4e66ae0149265d") throw new Error(`pane md5 ${md5}`);

const OPEN = "export function renderHistory(history: GameHistory): string[] {\n";
const CLOSE = "  return rows;\n}\n";

const text = source
  .replace(
    OPEN,
    `interface __Entry {
  readonly length: number;
  readonly last: Move | undefined;
  readonly rows: string[];
}

const __CACHE = new WeakMap<GameHistory, __Entry>();

${OPEN}  const __hit = __CACHE.get(history);
  if (
    __hit !== undefined &&
    __hit.length === history.moves.length &&
    __hit.last === history.moves[history.moves.length - 1]
  ) {
    return __hit.rows;
  }
`,
  )
  .replace(
    CLOSE,
    `  __CACHE.set(history, {
    length: history.moves.length,
    last: history.moves[history.moves.length - 1],
    rows,
  });
${CLOSE}`,
  );
if (text === source) throw new Error("substitution was a no-op");

const dir = join(SCRATCH, "lane-WCACHE-LAST");
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(join(BASE, "src"), join(dir, "src"), { recursive: true });
for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
  cpSync(join(BASE, file), join(dir, file));
}
symlinkSync(NODE_MODULES, join(dir, "node_modules"));
writeFileSync(join(dir, "src/history-pane.ts"), text);
console.log("built lane-WCACHE-LAST");
