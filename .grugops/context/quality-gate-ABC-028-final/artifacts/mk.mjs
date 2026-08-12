// QE gate `quality-gate-ABC-028-final` — the mutant generator, built from ABC-028's own
// definitions (the cache class as the ticket states it), NOT from any earlier hop's harness.
//
// It is PINNED BY MD5 to this branch tip and THROWS rather than measuring the wrong tree.
//
// KEY SPECS (the axis coordinate is data, exactly as A5's table makes it data):
//   none        -> naive WCACHE: never invalidates                      (ABC-017 A14's build)
//   tail:T      -> key = moves.length + the last T move IDENTITIES      (T=0 is WCACHE-LEN)
//   value:T     -> key = moves.length + the last T move VALUES (from/to/promotion), NOT identity
//   sparse:a,b  -> key = moves.length + identities at offsets a,b from the END (1 = last)
//
// Transform:
//   --perTest   -> configuration (b): the nfr module-scope AT_* fixtures AND the LONG_GAMES table
//                  that captures them are rebuilt per test.
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const PRISTINE = join(HERE, "pristine");

const PINS = {
  "src/history-pane.ts": "c4653c4c263c4c417ea34969164ccd86",
  "src/history-pane.test.ts": "9533f05038780def980bf5a86707cdbd",
  "src/history-pane.nfr.test.ts": "1d33bea667cc792e1fa1fd4030caa718",
};

const md5 = (text) => createHash("md5").update(text).digest("hex");

function read(relative) {
  const text = readFileSync(join(PRISTINE, relative), "utf8");
  const want = PINS[relative];
  if (want !== undefined && md5(text) !== want) {
    throw new Error(`PIN MISMATCH ${relative}: ${md5(text)} != ${want} — REFUSING to measure`);
  }
  return text;
}

function replaceOnce(text, anchor, replacement, label) {
  const parts = text.split(anchor);
  if (parts.length !== 2) throw new Error(`anchor not unique (${parts.length - 1}x): ${label}`);
  return parts[0] + replacement + parts[1];
}

// ---------------------------------------------------------------------------
// The cache mutant. One anchored edit to `src/history-pane.ts`: the delivered render body is kept
// VERBATIM and renamed, and a memoising wrapper is put in front of it. Nothing else is touched, so
// a difference in rendered output can only come from the cache.
// ---------------------------------------------------------------------------
const RENDER_ANCHOR = "export function renderHistory(history: GameHistory): string[] {";

function cacheMutant(source, spec) {
  let keyBody;
  if (spec === "none") {
    keyBody = '  return "";';
  } else if (spec.startsWith("tail:")) {
    const depth = Number(spec.slice(5));
    keyBody = [
      "  const moves = history.moves;",
      "  const parts: string[] = [String(moves.length)];",
      `  for (let back = 1; back <= ${depth}; back++) {`,
      "    const move = moves[moves.length - back];",
      "    parts.push(move === undefined ? '-' : String(__identityOf(move)));",
      "  }",
      "  return parts.join(':');",
    ].join("\n");
  } else if (spec.startsWith("value:")) {
    const depth = Number(spec.slice(6));
    keyBody = [
      "  const moves = history.moves;",
      "  const parts: string[] = [String(moves.length)];",
      `  for (let back = 1; back <= ${depth}; back++) {`,
      "    const move = moves[moves.length - back];",
      "    parts.push(move === undefined ? '-' : `${move.from},${move.to},${move.promotion ?? 0}`);",
      "  }",
      "  return parts.join(':');",
    ].join("\n");
  } else if (spec.startsWith("sparse:")) {
    const offsets = spec
      .slice(7)
      .split(",")
      .map((offset) => Number(offset));
    keyBody = [
      "  const moves = history.moves;",
      "  const parts: string[] = [String(moves.length)];",
      `  for (const back of [${offsets.join(", ")}]) {`,
      "    const move = moves[moves.length - back];",
      "    parts.push(move === undefined ? '-' : String(__identityOf(move)));",
      "  }",
      "  return parts.join(':');",
    ].join("\n");
  } else {
    throw new Error(`unknown key spec: ${spec}`);
  }

  const wrapper = [
    "const __rowCache = new WeakMap<GameHistory, { key: string; rows: string[] }>();",
    "const __identities = new WeakMap<Move, number>();",
    "let __nextIdentity = 1;",
    "function __identityOf(move: Move): number {",
    "  let id = __identities.get(move);",
    "  if (id === undefined) {",
    "    id = __nextIdentity++;",
    "    __identities.set(move, id);",
    "  }",
    "  return id;",
    "}",
    "function __cacheKey(history: GameHistory): string {",
    keyBody,
    "}",
    "export function renderHistory(history: GameHistory): string[] {",
    "  const key = __cacheKey(history);",
    "  const hit = __rowCache.get(history);",
    "  if (hit !== undefined && hit.key === key) return hit.rows;",
    "  const rows = __renderHistoryUncached(history);",
    "  __rowCache.set(history, { key, rows });",
    "  return rows;",
    "}",
    "function __renderHistoryUncached(history: GameHistory): string[] {",
  ].join("\n");

  return replaceOnce(source, RENDER_ANCHOR, wrapper, "renderHistory signature");
}

// ---------------------------------------------------------------------------
// Configuration (b): the nfr file's module-scope fixtures rebuilt PER TEST.
// The LONG_GAMES table captures the AT_* objects, so rebuilding the fixtures without rebuilding
// the table would leave A11's count assertions reading the ORIGINAL objects — a FALSE result.
// ---------------------------------------------------------------------------
const FIXTURES = [
  ["AT_0", "newGame(START_FEN)"],
  ["AT_1", "shuffleGame(1)"],
  ["AT_3", "shuffleGame(3)"],
  ["AT_19", "shuffleGame(19)"],
  ["AT_40", "deterministicGame(40)"],
  ["AT_120", "deterministicGame(120)"],
  ["AT_300", "deterministicGame(300)"],
  ["AT_2000", "shuffleGame(2000)"],
];

const LONG_GAMES_DECL = `const LONG_GAMES: readonly (readonly [plies: number, history: GameHistory])[] = [
  [40, AT_40],
  [120, AT_120],
  [300, AT_300],
  [2000, AT_2000],
];`;

function perTestFixtures(source) {
  let out = source;
  for (const [name, expression] of FIXTURES) {
    out = replaceOnce(out, `const ${name} = ${expression};`, `let ${name} = ${expression};`, name);
  }
  const rebuilt = [
    LONG_GAMES_DECL.replace("const LONG_GAMES", "let LONG_GAMES"),
    "",
    "// CONFIGURATION (b) — ABC-028 A2's counterfactual, applied OUT OF TREE only.",
    "beforeEach(() => {",
    ...FIXTURES.map(([name, expression]) => `  ${name} = ${expression};`),
    "  LONG_GAMES = [",
    "    [40, AT_40],",
    "    [120, AT_120],",
    "    [300, AT_300],",
    "    [2000, AT_2000],",
    "  ];",
    "});",
  ].join("\n");
  return replaceOnce(out, LONG_GAMES_DECL, rebuilt, "LONG_GAMES table");
}

// ---------------------------------------------------------------------------
// Lane assembly
// ---------------------------------------------------------------------------
export function buildLane(name, { key = null, perTest = false, extraTest = null, editPane = null } = {}) {
  const lane = join(HERE, "lanes", name);
  rmSync(lane, { recursive: true, force: true });
  mkdirSync(lane, { recursive: true });
  cpSync(join(PRISTINE, "src"), join(lane, "src"), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(PRISTINE, file), join(lane, file));
  }
  symlinkSync(join(PRISTINE, "node_modules"), join(lane, "node_modules"));

  if (key !== null) {
    writeFileSync(join(lane, "src/history-pane.ts"), cacheMutant(read("src/history-pane.ts"), key));
  }
  if (editPane !== null) {
    writeFileSync(join(lane, "src/history-pane.ts"), editPane(read("src/history-pane.ts"), replaceOnce));
  }
  if (perTest) {
    writeFileSync(
      join(lane, "src/history-pane.nfr.test.ts"),
      perTestFixtures(read("src/history-pane.nfr.test.ts")),
    );
  }
  if (extraTest !== null) {
    const source = read("src/history-pane.test.ts");
    writeFileSync(join(lane, "src/history-pane.test.ts"), extraTest(source));
  }
  return lane;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [name, key, transform] = process.argv.slice(2);
  const lane = buildLane(name, { key: key === "-" ? null : key, perTest: transform === "perTest" });
  console.log(lane);
}
