// A2's two builds and A2's two configurations, built out of tree.
//
//   builds:  WCACHE-LEN  (memoised per GameHistory, invalidated when moves.length changes)
//            WCACHE      (memoised per GameHistory, never invalidated)   — both from the ticket's
//                        own prose, not from anyone's reproduction kit.
//   configs: (a) src/history-pane.test.ts ALONE, the nfr file not loaded at all
//            (b) the FULL suite with the nfr module-scope fixtures at :121+ rebuilt PER TEST
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCRATCH = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/0d03b633-8518-42bd-a8f5-1d5a65199890/scratchpad";
const BASE = join(SCRATCH, "base");
const NODE_MODULES = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-qe/node_modules";

const paneSource = readFileSync(join(BASE, "src/history-pane.ts"), "utf8");
const paneMd5 = createHash("md5").update(paneSource).digest("hex");
if (paneMd5 !== "54fd4346dcc1a0060c4e66ae0149265d") throw new Error(`pane md5 ${paneMd5}`);

const nfrSource = readFileSync(join(BASE, "src/history-pane.nfr.test.ts"), "utf8");
const nfrMd5 = createHash("md5").update(nfrSource).digest("hex");
if (nfrMd5 !== "65f4f29ac930d7a7f432e14f2eef47f9") throw new Error(`nfr md5 ${nfrMd5}`);

const OPEN = "export function renderHistory(history: GameHistory): string[] {\n";
const CLOSE = "  return rows;\n}\n";
for (const anchor of [OPEN, CLOSE]) {
  if (paneSource.split(anchor).length !== 2) throw new Error(`anchor not unique: ${anchor}`);
}

function cachedPane(keyed) {
  const declaration = keyed
    ? "const __CACHE = new WeakMap<GameHistory, { length: number; rows: string[] }>();\n\n"
    : "const __CACHE = new WeakMap<GameHistory, string[]>();\n\n";
  const lookup = keyed
    ? `  const __hit = __CACHE.get(history);
  if (__hit !== undefined && __hit.length === history.moves.length) return __hit.rows;
`
    : `  const __hit = __CACHE.get(history);
  if (__hit !== undefined) return __hit;
`;
  const store = keyed
    ? "  __CACHE.set(history, { length: history.moves.length, rows });\n"
    : "  __CACHE.set(history, rows);\n";

  return paneSource
    .replace(OPEN, declaration + OPEN + lookup)
    .replace(CLOSE, store + CLOSE);
}

/**
 * Configuration (b): the module-scope fixtures rebuilt PER TEST. `const` -> `let`, and a file-level
 * `beforeEach` reassigns every one of them, `LONG_GAMES` included, before every test in the file.
 * This is the only edit; not one assertion, `vi.mock` or `it` is touched.
 */
function perTestFixtures(text) {
  const NAMES = ["AT_0", "AT_1", "AT_3", "AT_19", "AT_40", "AT_120", "AT_300", "AT_2000"];
  let out = text;
  const builders = new Map();

  for (const name of NAMES) {
    const line = out.split("\n").find((row) => row.startsWith(`const ${name} = `));
    if (line === undefined) throw new Error(`no module-scope declaration for ${name}`);
    builders.set(name, line.slice(`const ${name} = `.length).replace(/;$/, ""));
    out = out.replace(line, `let ${name} = ${builders.get(name)};`);
  }

  const longGames = `const LONG_GAMES: readonly (readonly [plies: number, history: GameHistory])[] = [
  [40, AT_40],
  [120, AT_120],
  [300, AT_300],
  [2000, AT_2000],
];`;
  if (out.split(longGames).length !== 2) throw new Error("LONG_GAMES block not found verbatim");
  out = out.replace(
    longGames,
    `${longGames.replace("const LONG_GAMES", "let LONG_GAMES")}

// CONFIGURATION (b) — the module-scope fixtures above, REBUILT PER TEST. Nothing else is edited.
beforeEach(() => {
${NAMES.map((name) => `  ${name} = ${builders.get(name)};`).join("\n")}
  LONG_GAMES = [
    [40, AT_40],
    [120, AT_120],
    [300, AT_300],
    [2000, AT_2000],
  ];
});`,
  );
  return out;
}

function lane(name, { pane, nfrPerTest = false, dropA1 = false }) {
  const dir = join(SCRATCH, `a2-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(BASE, "src"), join(dir, "src"), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(BASE, file), join(dir, file));
  }
  symlinkSync(NODE_MODULES, join(dir, "node_modules"));
  if (pane !== null) writeFileSync(join(dir, "src/history-pane.ts"), pane);
  if (nfrPerTest) writeFileSync(join(dir, "src/history-pane.nfr.test.ts"), perTestFixtures(nfrSource));
  if (dropA1) {
    const tests = readFileSync(join(dir, "src/history-pane.test.ts"), "utf8");
    const opening = '  it("A1 — a mutation that leaves moves.length UNCHANGED still renders fresh", () => {';
    const start = tests.indexOf(opening);
    if (start < 0) throw new Error("A1 `it` not found");
    const end = tests.indexOf("\n  });\n", start);
    if (end < 0) throw new Error("A1 `it` close not found");
    writeFileSync(
      join(dir, "src/history-pane.test.ts"),
      `${tests.slice(0, start)}  // A1 REMOVED for the counterfactual.\n${tests.slice(end + "\n  });\n".length)}`,
    );
  }
  console.log(`built a2-${name}`);
}

const LEN = cachedPane(true);
const NAIVE = cachedPane(false);

// With A1 present — the state A2 is asserted over.
lane("clean", { pane: null });
lane("len", { pane: LEN });
lane("naive", { pane: NAIVE });
lane("len-perTest", { pane: LEN, nfrPerTest: true });
lane("naive-perTest", { pane: NAIVE, nfrPerTest: true });

// With A1 ABSENT — the counterfactual that says what A2 actually buys.
lane("clean-noA1", { pane: null, dropA1: true });
lane("len-noA1", { pane: LEN, dropA1: true });
lane("naive-noA1", { pane: NAIVE, dropA1: true });
lane("len-perTest-noA1", { pane: LEN, nfrPerTest: true, dropA1: true });
lane("naive-perTest-noA1", { pane: NAIVE, nfrPerTest: true, dropA1: true });
