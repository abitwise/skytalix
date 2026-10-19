// UAT ABC-171: a throwaway acceptance harness for `OwnBook` and `Skill Level` over the UCI session.
// It is an authoring aid, not a committed spec. This repository has no browser e2e lane, and the
// session has no process yet (the `skytalix` binary and stdin/stdout are ABC-168's), so there is no
// uat/*.uat.spec.ts. The shape follows .grugops/context/uat-ABC-167/probe/uat-harness.ts.
//
// Usage:  node uat-harness.ts <tree root>
//   <tree root>  a checkout of grugops/ABC-171 @ 5dee231c (the session under acceptance), or a scratch
//                copy of it with one deliberate fault (the negative controls)
//
// What it exercises: the PUBLIC API of src/uci-session.ts only (createUciSession, handleLine, write),
// with the two capabilities ABC-171 adds: `random` (behind a call counter) and `book` (the REAL
// createBookProbe over in-memory bytes, behind a `read` counter and a `warn` recorder). Each scenario is a
// UCI dialogue: the lines a GUI would send, and the lines the engine writes back.
//
// Oracles:
//   - legality: the tree's own perft-proven generator (legal.ts, apply.ts, fen.ts), not edited by ABC-171;
//   - the level table: written here from the UAT brief (today's LEVELS, before ABC-174), then compared
//     with the tree's table as a fixture check;
//   - the D4 budget G and the D11 cap min(G, LEVELS[skill].budgetMs): written here from ADR-0044's text;
//   - the D11 seed rule floor(random() * 2^32) per `go`: written here from ADR-0044 D11's text, and fed
//     to the tree's createLevel (src/levels.ts, not edited by ABC-171).
//
// Every session runs on a VIRTUAL clock (ADR-0027, src/virtual-clock.ts). A virtual millisecond is not a
// real one: `time` in an `info` line is a node-count / clock-read figure. This harness takes NO wall-clock
// reading and prints no real time (N8-LANE stays OWED, R-167-2 / R-171-1).
//
// It writes nothing. It prints PASS/FAIL/OBS lines, then one summary line per scenario.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const [ROOT] = process.argv.slice(2);
if (!ROOT) throw new Error("usage: uat-harness.ts <tree root>");
const at = (rel: string) => pathToFileURL(`${ROOT}/${rel}`).href;

// biome-ignore lint/suspicious/noExplicitAny: harness
type Any = any;
const { createUciSession }: Any = await import(at("src/uci-session.ts"));
const { parseFen }: Any = await import(at("src/fen.ts"));
const { legalMoves, isInCheck }: Any = await import(at("src/legal.ts"));
const { makeMove }: Any = await import(at("src/apply.ts"));
const { parseCoordinateMove }: Any = await import(at("src/coordinate-move.ts"));
const { squareName }: Any = await import(at("src/position.ts"));
const { virtualClock }: Any = await import(at("src/virtual-clock.ts"));
const { createBookProbe, BOOK_MAX_BYTES }: Any = await import(at("src/book.ts"));
const { LEVELS, DEFAULT_LEVEL, createLevel, seededRandom }: Any = await import(at("src/levels.ts"));
const { zobristKey }: Any = await import(at("src/zobrist.ts"));
const { gameStatus }: Any = await import(at("src/gameend.ts"));
const { HARD_CEILING_MS }: Any = await import(at("src/engine.ts"));

// --- fixtures (fixed before the first run) ------------------------------------------------------
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const AFTER_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const SMOTHERED = "5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1"; // puzzle-corpus.ts:128, mate in 2, d5g8
const MATED_NEXT = "7k/8/6K1/8/8/8/8/R7 b - - 1 1"; // ABC-167's A8 FEN; the only move h8g8
const ESC = "\x1b";
/** The brief's table: today's LEVELS, before ABC-174's re-cut (ADR-0045 is accepted, not built here). */
const TABLE: Record<number, { budgetMs: number; blunderRate: number }> = {
  1: { budgetMs: 100, blunderRate: 0.4 },
  2: { budgetMs: 500, blunderRate: 0.2 },
  3: { budgetMs: 3000, blunderRate: 0 },
  4: { budgetMs: 4000, blunderRate: 0 },
  5: { budgetMs: 4500, blunderRate: 0 },
};
const DEFAULT = 3;
const CEILING = 5000; // HARD_CEILING_MS, ADR-0044 D4.1
const OPTION_LINES = [
  "id name skytalix",
  "id author Olger Oeselg",
  "option name OwnBook type check default true",
  "option name Skill Level type spin default 3 min 1 max 5",
  "uciok",
];

// --- the check ledger ---------------------------------------------------------------------------
const tally = new Map<string, { pass: number; fail: number }>();
let scenario = "";
function begin(id: string, title: string) {
  scenario = id;
  tally.set(id, { pass: 0, fail: 0 });
  console.log(`\n== ${id}: ${title}`);
}
function check(label: string, ok: boolean, detail = "") {
  const t = tally.get(scenario) as { pass: number; fail: number };
  if (ok) t.pass++;
  else t.fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${scenario} ${label}${detail ? ` | ${detail}` : ""}`);
}
function obs(text: string) {
  console.log(`OBS  ${scenario} ${text}`);
}

// --- the GUI side -------------------------------------------------------------------------------
const PROMO: Record<number, string> = { 5: "q", 4: "r", 3: "b", 2: "n" };
const coord = (m: Any) => `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}`;

/** The GUI's own copy of the position: FEN plus moves, through the perft-proven generator. */
function guiPosition(fen: string, moves: readonly string[] = []): Any {
  const p = parseFen(fen);
  for (const text of moves) {
    const parsed = parseCoordinateMove(p, text);
    if (parsed.outcome !== "move") throw new Error(`fixture move ${text} is not legal`);
    makeMove(p, parsed.move);
  }
  return p;
}
const legalSet = (p: Any) => new Set<string>(legalMoves(p).map(coord));
const hexKey = (p: Any) => zobristKey(p).toString(16).padStart(16, "0");

// --- books (ABC-094 format 1, built in memory) ---------------------------------------------------
const bytesOf = (text: string) => new TextEncoder().encode(text);
const bookBytes = (positions: Record<string, unknown>) =>
  bytesOf(JSON.stringify({ format: 1, maxPly: 12, positions }));
const EMPTY_BOOK = () => bookBytes({});
/** ABC-171 A3's book: the start position holds the single reply e2e4. */
const START_BOOK = () => bookBytes({ [hexKey(guiPosition(START))]: { m: [["e2e4", 1]] } });
/** A short line, so a game can be followed into and out of the book. */
const LINE = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"];
const LINE_BOOK = () =>
  bookBytes({
    [hexKey(guiPosition(START))]: { m: [["e2e4", 1]], n: "King's Pawn" },
    [hexKey(guiPosition(START, ["e2e4"]))]: { m: [["e7e5", 3], ["c7c5", 1]] },
    [hexKey(guiPosition(START, ["e2e4", "e7e5"]))]: { m: [["g1f3", 1]] },
    [hexKey(guiPosition(START, ["e2e4", "e7e5", "g1f3"]))]: { m: [["b8c6", 1]] },
    [hexKey(guiPosition(START, ["e2e4", "e7e5", "g1f3", "b8c6"]))]: { m: [["f1b5", 1]] },
  });
/** The shipped artifact (ABC-093), read here and injected as bytes: the session never reads a file. */
const REAL_BYTES = new Uint8Array(readFileSync(`${ROOT}/data/opening-book/book.json`));
const REAL_BOOK = () => REAL_BYTES;

// --- one engine as a GUI sees it ----------------------------------------------------------------
const everyLine: string[] = [];
let goCount = 0;
let bestmoveCount = 0;
let answers = 0;

interface Turn {
  readonly result: string | undefined;
  readonly lines: string[];
  readonly threw: string | null;
}
interface EngineOptions {
  readonly step?: number;
  readonly k?: number;
  readonly read?: () => Uint8Array;
}
function engine({ step = 10, k = 1, read = EMPTY_BOOK }: EngineOptions = {}) {
  const out: string[] = [];
  const reads = { count: 0 };
  const draws = { count: 0 };
  const warnings: string[] = [];
  const generator = seededRandom(k);
  const s = createUciSession({
    write: (line: string) => out.push(line),
    now: virtualClock(step),
    random: () => {
      draws.count++;
      return generator();
    },
    book: createBookProbe({
      read: () => {
        reads.count++;
        return read();
      },
      warn: (message: string) => warnings.push(message),
      random: seededRandom(7),
    }),
  });
  return {
    step,
    out,
    reads,
    draws,
    warnings,
    send(line: string): Turn {
      const before = out.length;
      let result: string | undefined;
      let threw: string | null = null;
      try {
        result = s.handleLine(line);
      } catch (error) {
        threw = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const lines = out.slice(before);
      everyLine.push(...lines);
      if (line.trim().split(/\s+/)[0] === "go") goCount++;
      for (const l of lines) if (l.startsWith("bestmove ")) bestmoveCount++;
      return { result, lines, threw };
    },
  };
}
type Engine = ReturnType<typeof engine>;

const SEARCH_INFO =
  /^info depth (\d+) score (cp -?\d+|mate -?\d+) nodes (\d+) time (\d+) nps (\d+) pv ([a-h][1-8][a-h][1-8][qrbn]?)$/;
const LEVEL_INFO = /^info depth (\d+) nodes (\d+) time (\d+) pv ([a-h][1-8][a-h][1-8][qrbn]?)$/;
interface Info {
  readonly shape: "search" | "level";
  readonly depth: number;
  readonly score: string | null;
  readonly nodes: number;
  readonly time: number;
  readonly pv: string;
}
function parseInfo(line: string | undefined): Info | null {
  const s = SEARCH_INFO.exec(line ?? "");
  if (s) {
    if (Number(s[5]) !== Math.round((Number(s[3]) * 1000) / Math.max(1, Number(s[4])))) return null;
    return { shape: "search", depth: Number(s[1]), score: s[2] as string, nodes: Number(s[3]), time: Number(s[4]), pv: s[6] as string };
  }
  const l = LEVEL_INFO.exec(line ?? "");
  if (l) return { shape: "level", depth: Number(l[1]), score: null, nodes: Number(l[2]), time: Number(l[3]), pv: l[4] as string };
  return null;
}
const isInfoString = (l: string | undefined) => (l ?? "").startsWith("info string ");
const printable = (l: string) => [...l].every((c) => (c.codePointAt(0) as number) >= 0x20 && c !== "\x7f");
const bestOf = (l: string | undefined) => /^bestmove (\S+)$/.exec(l ?? "")?.[1];
const shapeOf = (level: number): "search" | "level" => (TABLE[level]!.blunderRate > 0 ? "level" : "search");

function only(label: string, turn: Turn, expected: readonly string[]) {
  check(`${label}: no exception`, turn.threw === null, turn.threw ?? "");
  check(`${label}: writes exactly ${JSON.stringify(expected)}`, JSON.stringify(turn.lines) === JSON.stringify(expected), JSON.stringify(turn.lines));
}

/** A searched answer: exactly an info line of the given shape, then bestmove = pv, legal in the GUI's position. */
function searched(label: string, turn: Turn, p: Any, shape: "search" | "level") {
  check(`${label}: no exception`, turn.threw === null, turn.threw ?? "");
  check(`${label}: exactly 2 lines`, turn.lines.length === 2, JSON.stringify(turn.lines));
  const info = parseInfo(turn.lines[0]);
  check(`${label}: line 1 is the ${shape} info line`, info !== null && info.shape === shape, turn.lines[0] ?? "");
  const best = bestOf(turn.lines[1]);
  check(`${label}: line 2 is bestmove`, best !== undefined, turn.lines[1] ?? "");
  if (!info || !best) return { info, best };
  check(`${label}: pv = bestmove`, info.pv === best, `${info.pv} vs ${best}`);
  check(`${label}: bestmove legal in the GUI's position`, legalSet(p).has(best), best);
  answers++;
  return { info, best };
}
/** A book answer: exactly `info string book`, then a bestmove that is legal and one of the entry's moves. */
function booked(label: string, turn: Turn, p: Any, allowed: readonly string[]) {
  check(`${label}: no exception`, turn.threw === null, turn.threw ?? "");
  check(`${label}: exactly ["info string book", "bestmove M"]`, turn.lines.length === 2 && turn.lines[0] === "info string book", JSON.stringify(turn.lines));
  check(`${label}: no info depth line`, !turn.lines.some((l) => l.startsWith("info depth")), JSON.stringify(turn.lines));
  const best = bestOf(turn.lines[1]);
  check(`${label}: the book move is one of ${JSON.stringify(allowed)} and legal`, best !== undefined && allowed.includes(best) && legalSet(p).has(best), best ?? "");
  answers++;
  return best;
}
function inWindow(label: string, time: number | undefined, g: number, step: number) {
  check(`${label}: time in [B, B+2*step] = [${g}, ${g + 2 * step}]`, time !== undefined && time >= g && time <= g + 2 * step, `time ${time}`);
}

/** ADR-0044 D4.1 from the ADR's text: the budget G before the level caps it. */
function d4(t: Record<string, number>, black: boolean): number {
  const clock = black ? t.btime : t.wtime;
  if (t.movetime !== undefined) return t.movetime;
  if (clock !== undefined) {
    const inc = (black ? t.binc : t.winc) ?? 0;
    return Math.max(1, Math.min(clock / (t.movestogo ?? 20) + inc / 2, clock - 50));
  }
  return CEILING;
}
/** D11: the level caps G. */
const capped = (g: number, level: number) => Math.min(g, TABLE[level]!.budgetMs);

/** D11's seed rule from the ADR's text: the n-th (1-based) session draw under seededRandom(k). */
function seedOf(k: number, n: number): number {
  const r = seededRandom(k);
  let v = 0;
  for (let i = 0; i < n; i++) v = r();
  return Math.floor(v * 2 ** 32);
}
/** The level's own first draw for that seed: below the rate means the blunder path. */
const levelDraw = (k: number, n: number) => seededRandom(seedOf(k, n))();
/** The oracle: createLevel with the n-th seed, on a fresh virtual clock of the same step. */
function oracle(level: number, k: number, n: number, p: Any, g: number, step: number) {
  return createLevel(
    { budgetMs: capped(g, level), blunderRate: TABLE[level]!.blunderRate },
    { seed: seedOf(k, n), now: virtualClock(step) },
  )(p);
}
// Seeds whose first draw takes the engine path at both blunder levels, and the blunder path at both.
const K_ENGINE = Array.from({ length: 50 }, (_, i) => i + 1).find((k) => levelDraw(k, 1) >= 0.4) as number;
const K_BLUNDER = Array.from({ length: 50 }, (_, i) => i + 1).find((k) => levelDraw(k, 1) < 0.2) as number;

/** Which level is this session playing at? One `go movetime 10000` from the start, read by shape and window. */
function levelOf(e: Engine): number | null {
  e.send("position startpos");
  const t = e.send("go movetime 10000");
  const info = parseInfo(t.lines[0]);
  if (t.threw !== null || t.lines.length !== 2 || !info || bestOf(t.lines[1]) !== info.pv) return null;
  for (const n of [1, 2, 3, 4, 5]) {
    const b = capped(10000, n);
    if (info.shape === shapeOf(n) && info.time >= b && info.time <= b + 2 * e.step) return n;
  }
  return null;
}

// ================================================================================================
begin("S0", "fixtures and the harness's own preconditions");
{
  for (const n of [1, 2, 3, 4, 5]) {
    check(`the tree's LEVELS[${n}] is the brief's ${TABLE[n]!.budgetMs} ms / ${TABLE[n]!.blunderRate}`, LEVELS[n]?.budgetMs === TABLE[n]!.budgetMs && LEVELS[n]?.blunderRate === TABLE[n]!.blunderRate, JSON.stringify(LEVELS[n]));
  }
  check(`the tree's DEFAULT_LEVEL is the brief's ${DEFAULT}`, DEFAULT_LEVEL === DEFAULT, String(DEFAULT_LEVEL));
  check("HARD_CEILING_MS is 5 000", HARD_CEILING_MS === CEILING, String(HARD_CEILING_MS));
  check(`a seed whose first level draw takes the engine path at levels 1 and 2 exists (k = ${K_ENGINE})`, K_ENGINE !== undefined, String(levelDraw(K_ENGINE, 1)));
  check(`a seed whose first level draw takes the blunder path at levels 1 and 2 exists (k = ${K_BLUNDER})`, K_BLUNDER !== undefined, String(levelDraw(K_BLUNDER, 1)));
  const a = hexKey(guiPosition(START, ["e2e4", "e7e5", "g1f3", "b8c6"]));
  // RUN-0 used g1f3 b8c6 e2e4 e7e5, which ends on a double push and so sets an en-passant square: a
  // different key, my fixture error. This order ends on b8c6, as the book's own order does.
  const b = hexKey(guiPosition(START, ["g1f3", "e7e5", "e2e4", "b8c6"]));
  check("the transposition fixture reaches the same book key by two move orders", a === b, `${a} ${b}`);
  check("the shipped book's bytes were read (the harness's read, not the session's)", REAL_BYTES.length > 0, `${REAL_BYTES.length} bytes`);
  const probe = createBookProbe({ read: REAL_BOOK, warn: () => {}, random: seededRandom(7) });
  check("the shipped book has the start position in book", probe.inBook(guiPosition(START)));
}

// ================================================================================================
begin("S1", "`uci` shows the OwnBook and Skill Level option lines (A1, D3)");
{
  const e = engine({ read: LINE_BOOK });
  const u = e.send("uci");
  only("uci", u, OPTION_LINES);
  check("uci returns continue", u.result === "continue");
  check("uci reads no book (D10 N-LOAD)", e.reads.count === 0, `reads ${e.reads.count}`);
  only("a second uci", e.send("uci"), OPTION_LINES);
  const grammar = /^option name (.+?) type (check|spin) default (\S+)(?: min (-?\d+) max (-?\d+))?$/;
  for (const line of OPTION_LINES.filter((l) => l.startsWith("option "))) {
    const m = grammar.exec(line);
    check(`"${line}" follows the UCI option grammar`, m !== null);
    if (m?.[2] === "check") check(`${m[1]}: a check default is true or false`, m[3] === "true" || m[3] === "false", m[3]);
    if (m?.[2] === "spin") check(`${m[1]}: min <= default <= max`, Number(m[4]) <= Number(m[3]) && Number(m[3]) <= Number(m[5]), `${m[4]} ${m[3]} ${m[5]}`);
  }
  // UCI's `default` is the default, not the current value.
  e.send("setoption name Skill Level value 1");
  e.send("setoption name OwnBook value false");
  only("uci after changing both options still shows the defaults", e.send("uci"), OPTION_LINES);
  const fresh = engine({ step: 100, k: K_ENGINE });
  check("the advertised Skill Level default (3) is the level a fresh session plays", levelOf(fresh) === 3);
  const book = engine({ read: START_BOOK });
  book.send("uci");
  book.send("isready");
  book.send("position startpos");
  booked("the advertised OwnBook default (true) is on in a fresh session", book.send("go movetime 1000"), guiPosition(START), ["e2e4"]);
}

// ================================================================================================
begin("S2", "setoption with valid and invalid values; names case-insensitive (A2, A13d, QE-171-f f1-f4)");
{
  // Valid Skill Level values under four spellings of the name, each read back by levelOf.
  for (const name of ["Skill Level", "skill level", "SKILL LEVEL", "sKiLl LeVeL"]) {
    for (const n of [1, 2, 3, 4, 5]) {
      const e = engine({ step: 100, k: K_ENGINE });
      only(`setoption name ${name} value ${n}`, e.send(`setoption name ${name} value ${n}`), []);
      check(`  -> plays at level ${n}`, levelOf(e) === n);
    }
  }
  {
    const e = engine({ step: 100, k: K_ENGINE });
    only("extra spaces: setoption name  Skill   Level  value  2", e.send("setoption name  Skill   Level  value  2"), []);
    check("  -> plays at level 2", levelOf(e) === 2);
    const f = engine({ step: 100, k: K_ENGINE });
    only("a trailing space: setoption name Skill Level value 4 ", f.send("setoption name Skill Level value 4 "), []);
    check("  -> plays at level 4", levelOf(f) === 4);
  }
  // Invalid Skill Level values: one printable info string, the old value kept. From the default and from 1.
  const badSkill = ["0", "6", "2.5", "x", "constructor", "-1", "01", "1.0", "0x1", "1e0", "1 2", "__proto__", "toString", "hasOwnProperty", "valueOf", "５", `${ESC}[31m`, "x".repeat(5000)];
  const badSkillLines = [
    ...badSkill.map((v) => [`value ${JSON.stringify(v.length > 12 ? `${v.slice(0, 6)}...(${v.length})` : v)}`, `setoption name Skill Level value ${v}`]),
    ["no value after 'value'", "setoption name Skill Level value"],
    ["no 'value' keyword", "setoption name Skill Level"],
  ];
  const samples: string[] = [];
  for (const from of [3, 1]) {
    for (const [what, line] of badSkillLines) {
      const e = engine({ step: 100, k: K_ENGINE });
      if (from !== 3) e.send(`setoption name Skill Level value ${from}`);
      const t = e.send(line as string);
      check(`Skill Level ${what}, from ${from}: no exception`, t.threw === null, t.threw ?? "");
      check(`Skill Level ${what}, from ${from}: exactly one info string`, t.lines.length === 1 && isInfoString(t.lines[0]), JSON.stringify(t.lines).slice(0, 160));
      check(`Skill Level ${what}, from ${from}: printable`, t.lines.every(printable));
      check(`Skill Level ${what}, from ${from}: level ${from} kept`, levelOf(e) === from);
      if (samples.length < 2 && t.lines[0]) samples.push(t.lines[0].slice(0, 100));
    }
  }
  obs(`invalid Skill Level text, e.g. ${JSON.stringify(samples)}`);
  // OwnBook: valid values under four spellings; false switches the book off, true back on.
  for (const name of ["OwnBook", "ownbook", "OWNBOOK", "oWnBoOk"]) {
    const e = engine({ read: START_BOOK });
    only(`setoption name ${name} value false`, e.send(`setoption name ${name} value false`), []);
    e.send("position startpos");
    searched(`  -> go searches (book off)`, e.send("go movetime 1000"), guiPosition(START), "search");
    check(`  -> the book was never read`, e.reads.count === 0, `reads ${e.reads.count}`);
    only(`setoption name ${name} value true`, e.send(`setoption name ${name} value true`), []);
    booked(`  -> go answers from the book again`, e.send("go movetime 1000"), guiPosition(START), ["e2e4"]);
  }
  // Invalid OwnBook values: one printable info string, the old value kept, both directions (A13d, f1, f2).
  const badBook = ["maybe", "TRUE", "True", "FALSE", "1", "0", "yes", "on", "true false", "false true", `${ESC}[31m`];
  const badBookLines = [
    ...badBook.map((v) => [`value ${JSON.stringify(v)}`, `setoption name OwnBook value ${v}`]),
    ["no value after 'value'", "setoption name OwnBook value"],
    ["no 'value' keyword", "setoption name OwnBook"],
  ];
  for (const from of [true, false]) {
    for (const [what, line] of badBookLines) {
      const e = engine({ read: START_BOOK });
      if (!from) e.send("setoption name OwnBook value false");
      const t = e.send(line as string);
      check(`OwnBook ${what}, from ${from}: exactly one printable info string`, t.threw === null && t.lines.length === 1 && isInfoString(t.lines[0]) && printable(t.lines[0] as string), JSON.stringify(t.lines));
      e.send("position startpos");
      const g = e.send("go movetime 1000");
      if (from) booked(`OwnBook ${what}, from true: true kept, the book still answers`, g, guiPosition(START), ["e2e4"]);
      else {
        searched(`OwnBook ${what}, from false: false kept, go searches`, g, guiPosition(START), "search");
        check(`OwnBook ${what}, from false: the book was never read`, e.reads.count === 0, `reads ${e.reads.count}`);
      }
    }
  }
  // Any other name, and malformed setoption lines: nothing written, nothing changed.
  const others = [
    "setoption name Hash value 64",
    "setoption name Threads value 4",
    "setoption name MultiPV value 3",
    "setoption name UCI_AnalyseMode value true",
    "setoption name UCI_Chess960 value false",
    "setoption name Ponder value true",
    "setoption name UCI_Elo value 1500",
    "setoption name UCI_LimitStrength value true",
    "setoption name Skill value 1",
    "setoption name Level value 1",
    "setoption name Skill Level2 value 1",
    "setoption name Own Book value false",
    "setoption name OwnBookx value false",
    "setoption",
    "setoption name",
    "setoption value 1",
    "setoption Skill Level value 1",
    "setoption OwnBook value false",
    "SETOPTION name Skill Level value 1",
  ];
  for (const line of others) {
    const e = engine({ step: 100, k: K_ENGINE });
    only(JSON.stringify(line), e.send(line), []);
    check(`${JSON.stringify(line)} -> still level 3`, levelOf(e) === 3);
    const b = engine({ read: START_BOOK });
    b.send(line);
    b.send("position startpos");
    booked(`${JSON.stringify(line)} -> the book still answers`, b.send("go movetime 1000"), guiPosition(START), ["e2e4"]);
  }
}

// ================================================================================================
begin("S3", "book on: start-position games answer from the book, read once, then legal moves out of book (A3, A5, D10)");
{
  // A3 exactly, and the same entry by FEN.
  {
    const e = engine({ read: START_BOOK });
    e.send("position startpos");
    only("A3: position startpos, go movetime 1000", e.send("go movetime 1000"), ["info string book", "bestmove e2e4"]);
    e.send(`position fen ${START}`);
    only("A3: the start position by FEN hits the same entry", e.send("go movetime 1000"), ["info string book", "bestmove e2e4"]);
  }
  // QE-171-f f3 (ruled ACCEPT): on a hit, each bad go token's info string comes first, then the book line.
  // Added after RUN-0, before RUN-1, so that the owner's checklist row 2 has an observation behind it.
  const f3: ReadonlyArray<readonly [string, number, number]> = [
    ["go movetime x", 1, 3],
    ["go depth 0 nodes x", 2, 3],
    ["go searchmoves e2e4 d2d4", 1, 3],
    ["go depth x", 1, 1],
    ["go depth 3", 0, 1],
  ];
  for (const [line, bad, level] of f3) {
    const e = engine({ read: START_BOOK });
    e.send(`setoption name Skill Level value ${level}`);
    e.send("position startpos");
    const t = e.send(line);
    check(
      `f3, level ${level}, ${line} on a hit: ${bad} bad-token info string(s), then the book line, then bestmove e2e4`,
      t.threw === null && t.lines.length === bad + 2 && t.lines.slice(0, bad).every((l) => isInfoString(l) && l !== "info string book") && t.lines[bad] === "info string book" && t.lines[bad + 1] === "bestmove e2e4",
      JSON.stringify(t.lines),
    );
    check(`f3, level ${level}, ${line} on a hit: no "ignores" line and 0 seeds (the book comes before the level)`, !t.lines.some((l) => l.includes("ignores")) && e.draws.count === 0, `draws ${e.draws.count}`);
  }
  // The book comes first, whatever the go limits or the level (D10), and draws no seed (A8, A13b).
  const goLines = ["go movetime 1000", "go wtime 60000 btime 60000 winc 1000 binc 1000", "go depth 5", "go nodes 100", "go mate 2", "go movetime 1", "go wtime 40 btime 40", "go"];
  for (const level of [1, 2, 3, 4, 5]) {
    for (const line of goLines) {
      const e = engine({ read: START_BOOK });
      e.send(`setoption name Skill Level value ${level}`);
      e.send("position startpos");
      only(`level ${level}, ${line}: the book answers`, e.send(line), ["info string book", "bestmove e2e4"]);
      check(`level ${level}, ${line}: 0 seeds drawn`, e.draws.count === 0, `draws ${e.draws.count}`);
    }
  }
  // Transposition and FEN: the book is keyed by the position after the moves.
  {
    const p = guiPosition(START, ["e2e4", "e7e5", "g1f3", "b8c6"]);
    const e = engine({ read: LINE_BOOK });
    e.send("position startpos moves g1f3 e7e5 e2e4 b8c6");
    booked("a transposed move order hits the entry", e.send("go movetime 100"), p, ["f1b5"]);
    e.send("position startpos moves e2e4 e7e5 g1f3 b8c6");
    booked("the book's own move order hits it", e.send("go movetime 100"), p, ["f1b5"]);
    e.send(`position fen ${AFTER_E4}`);
    booked("a FEN that reaches a book position hits it", e.send("go movetime 100"), guiPosition(AFTER_E4), ["e7e5", "c7c5"]);
    e.send(`position fen ${START} moves e2e4 e7e5`);
    booked("a FEN plus moves hits it", e.send("go movetime 100"), guiPosition(START, ["e2e4", "e7e5"]), ["g1f3"]);
    check("five book answers, one read", e.reads.count === 1, `reads ${e.reads.count}`);
  }
  // A5: read once, at the right time.
  {
    const e = engine({ read: LINE_BOOK });
    e.send("uci");
    check("A5: after uci, 0 reads", e.reads.count === 0, `reads ${e.reads.count}`);
    only("isready", e.send("isready"), ["readyok"]);
    check("A5: after the first isready, 1 read", e.reads.count === 1, `reads ${e.reads.count}`);
    e.send("isready");
    e.send("ucinewgame");
    e.send("isready");
    e.send("position startpos");
    e.send("go movetime 100");
    e.send("ucinewgame");
    e.send("position startpos moves e2e4");
    e.send("go movetime 100");
    check("A5: after more isready, go and ucinewgame lines, still 1", e.reads.count === 1, `reads ${e.reads.count}`);
    const n = engine({ read: LINE_BOOK });
    n.send("uci");
    n.send("position startpos");
    check("A5: no isready, before go: 0 reads", n.reads.count === 0, `reads ${n.reads.count}`);
    booked("A5: no isready, the first go answers from the book", n.send("go movetime 100"), guiPosition(START), ["e2e4"]);
    check("A5: ... and that go made it 1", n.reads.count === 1, `reads ${n.reads.count}`);
    n.send("go movetime 100");
    check("A5: a second go: still 1", n.reads.count === 1, `reads ${n.reads.count}`);
    const t = engine({ read: LINE_BOOK });
    t.send("setoption name OwnBook value false");
    t.send("isready");
    check("OwnBook off at the first isready: 0 reads", t.reads.count === 0, `reads ${t.reads.count}`);
    t.send("setoption name OwnBook value true");
    t.send("position startpos");
    booked("then on: go answers from the book", t.send("go movetime 100"), guiPosition(START), ["e2e4"]);
    check("... and that go read it once", t.reads.count === 1, `reads ${t.reads.count}`);
    t.send("setoption name OwnBook value false");
    t.send("setoption name OwnBook value true");
    t.send("isready");
    t.send("go movetime 100");
    check("toggling OwnBook does not re-read it", t.reads.count === 1, `reads ${t.reads.count}`);
  }
  // A game against a GUI that follows the book, then leaves it: the engine plays white.
  {
    const e = engine({ read: LINE_BOOK, step: 10 });
    e.send("uci");
    e.send("isready");
    e.send("ucinewgame");
    const moves: string[] = [];
    const replies = ["e7e5", "b8c6", "a7a6", "g8f6", "f8e7", "e8g8", "b7b5", "d7d6"];
    let bookAnswers = 0;
    let searchAnswers = 0;
    for (let ply = 0; ply < 16; ply++) {
      const p = guiPosition(START, moves);
      if (!p.blackToMove) {
        e.send(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`);
        const t = e.send("go wtime 180000 btime 180000 winc 2000 binc 2000");
        const inBook = moves.length < 5 && moves.every((m, i) => m === LINE[i]);
        let best: string | undefined;
        if (inBook) {
          best = booked(`book game ply ${ply + 1}: in book`, t, p, [LINE[moves.length] as string]);
          bookAnswers++;
        } else {
          best = searched(`book game ply ${ply + 1}: out of book, searched`, t, p, "search").best;
          searchAnswers++;
        }
        if (!best) break;
        moves.push(best);
      } else {
        const reply = replies[(ply - 1) / 2] as string;
        if (!legalSet(p).has(reply)) {
          obs(`the GUI's scripted reply ${reply} is not legal at ply ${ply + 1}; it plays the first legal move`);
          moves.push([...legalSet(p)].sort()[0] as string);
        } else moves.push(reply);
      }
    }
    check("the book game: 3 book answers, then searched answers", bookAnswers === 3 && searchAnswers === 5, `book ${bookAnswers}, searched ${searchAnswers}`);
    check("the book game: read once, no warning", e.reads.count === 1 && e.warnings.length === 0, `reads ${e.reads.count}, warnings ${e.warnings.length}`);
    obs(`book game: ${moves.join(" ")}`);
  }
  // The engine plays black from the book: the weighted entry gives one of its moves.
  {
    const seen = new Set<string>();
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const e = engine({ read: LINE_BOOK, k });
      e.send("position startpos moves e2e4");
      const b = booked(`engine as black, session ${k}`, e.send("go movetime 100"), guiPosition(AFTER_E4), ["e7e5", "c7c5"]);
      if (b) seen.add(b);
    }
    obs(`black's book replies over 8 sessions (one book random seed): ${[...seen].join(", ")} (the weighting is ABC-094's, not graded)`);
  }
  // The shipped book's bytes, two sessions playing each other: from the book, then out of it.
  {
    const white = engine({ read: REAL_BOOK, step: 10 });
    const black = engine({ read: REAL_BOOK, step: 10 });
    for (const e of [white, black]) {
      e.send("uci");
      e.send("isready");
      e.send("ucinewgame");
    }
    const moves: string[] = [];
    let bookPlies = 0;
    let firstOut = -1;
    let afterOut = 0;
    for (let ply = 0; ply < 30; ply++) {
      const p = guiPosition(START, moves);
      const e = p.blackToMove ? black : white;
      e.send(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`);
      const t = e.send("go movetime 100");
      let best: string | undefined;
      if (t.lines[0] === "info string book") {
        best = booked(`shipped book ply ${ply + 1}`, t, p, [...legalSet(p)]);
        bookPlies++;
        if (firstOut !== -1) afterOut++;
      } else {
        best = searched(`shipped book ply ${ply + 1}`, t, p, "search").best;
        if (firstOut === -1) firstOut = ply + 1;
      }
      if (!best) break;
      moves.push(best);
    }
    check("shipped book: the game opens from the book", bookPlies >= 1 && firstOut !== 1, `book plies ${bookPlies}, first searched ply ${firstOut}`);
    check("shipped book: it leaves the book and plays on", firstOut > 1 && moves.length === 30, `first searched ply ${firstOut}, ${moves.length} plies`);
    check("shipped book: each session read it once, no warning", white.reads.count === 1 && black.reads.count === 1 && white.warnings.length + black.warnings.length === 0);
    obs(`shipped book: ${bookPlies} book plies, first searched ply ${firstOut}, ${afterOut} book hits after that; ${moves.join(" ")}`);
  }
}

// ================================================================================================
begin("S4", "book off: the engine searches and never reads the book (A4)");
{
  for (const [name, read] of [["START_BOOK", START_BOOK], ["LINE_BOOK", LINE_BOOK], ["the shipped book", REAL_BOOK], ["a book whose read throws", () => { throw new Error("ENOENT"); }]] as const) {
    for (const spelling of ["OwnBook", "ownbook"]) {
      const e = engine({ read: read as () => Uint8Array, step: 10 });
      only(`${name}: setoption name ${spelling} value false first`, e.send(`setoption name ${spelling} value false`), []);
      only(`${name}: uci`, e.send("uci"), OPTION_LINES);
      only(`${name}: isready`, e.send("isready"), ["readyok"]);
      e.send("isready");
      e.send("position startpos");
      searched(`${name}: go movetime 1000 from the start searches`, e.send("go movetime 1000"), guiPosition(START), "search");
      e.send("ucinewgame");
      e.send("position startpos moves e2e4");
      searched(`${name}: go after e2e4 searches`, e.send("go wtime 60000 btime 60000"), guiPosition(AFTER_E4), "search");
      e.send("position startpos");
      const h = e.send("go infinite");
      check(`${name}: go infinite holds a searched info line`, h.lines.length === 1 && parseInfo(h.lines[0])?.shape === "search", JSON.stringify(h.lines));
      only(`${name}: stop releases it`, e.send("stop"), [`bestmove ${parseInfo(h.lines[0])?.pv}`]);
      e.send("setoption name Skill Level value 1");
      e.send("position startpos");
      searched(`${name}: at level 1 it plays through the level`, e.send("go movetime 1000"), guiPosition(START), "level");
      check(`${name} (${spelling}): read 0 times over the whole session`, e.reads.count === 0, `reads ${e.reads.count}`);
      check(`${name} (${spelling}): no warning`, e.warnings.length === 0, JSON.stringify(e.warnings));
      check(`${name} (${spelling}): no "info string book" anywhere`, !e.out.includes("info string book"));
    }
  }
  {
    const e = engine({ read: START_BOOK });
    e.send("isready");
    e.send("setoption name OwnBook value false");
    e.send("position startpos");
    searched("off after warming: go searches", e.send("go movetime 1000"), guiPosition(START), "search");
    check("off after warming: no further read (still 1)", e.reads.count === 1, `reads ${e.reads.count}`);
  }
}

// ================================================================================================
begin("S5", "a bad or throwing book: one warning, and the game is still played legally (A9, D10)");
{
  const startKey = hexKey(guiPosition(START));
  const bad: ReadonlyArray<readonly [string, () => Uint8Array, readonly string[]]> = [
    ["read throws (a missing file)", () => { throw new Error("ENOENT: no such file '/Users/SECRET-PATH/book.json'"); }, ["SECRET", "ENOENT"]],
    ["read throws a non-Error", () => { throw "PLANTED-STRING"; }, ["PLANTED"]],
    ["bytes that are not UTF-8", () => new Uint8Array([0xff, 0xfe, 0x00, 0x41]), []],
    ["bytes that are not JSON", () => bytesOf('{format: 1, "PLANTED-JSON"'), ["PLANTED"]],
    ["JSON that is not the schema (format 2)", () => bytesOf('{"format":2,"positions":{}}'), []],
    ["over 1 MB", () => new Uint8Array(BOOK_MAX_BYTES + 1).fill(0x20), []],
    ["an entry key that is not 16 hex digits", () => bookBytes({ "PLANTED-KEY/etc/passwd": { m: [] } }), ["PLANTED", "passwd"]],
    ["an entry move that is illegal in its position", () => bookBytes({ [startKey]: { m: [["e2e5", 1]] } }), ["e2e5"]],
    ["entry weights that overflow", () => bookBytes({ [startKey]: { m: [["e2e4", 2 ** 53 - 1], ["d2d4", 2 ** 53 - 1]] } }), []],
  ];
  for (const [name, read, planted] of bad) {
    for (const flow of ["isready first", "no isready", "level 1", "go infinite"]) {
      const e = engine({ read, step: 10 });
      const label = `${name} (${flow})`;
      let threw = false;
      try {
        e.send("uci");
        if (flow !== "no isready") only(`${label}: isready still answers`, e.send("isready"), ["readyok"]);
        if (flow === "level 1") e.send("setoption name Skill Level value 1");
        const moves: string[] = [];
        for (let i = 0; i < 3; i++) {
          const p = guiPosition(START, moves);
          e.send(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`);
          let t = e.send(flow === "go infinite" ? "go infinite" : "go movetime 100");
          if (flow === "go infinite") {
            const s = e.send("stop");
            t = { result: s.result, lines: [...t.lines, ...s.lines], threw: t.threw ?? s.threw };
          }
          const r = searched(`${label} go ${i + 1}`, t, p, flow === "level 1" ? "level" : "search");
          if (!r.best) break;
          // The GUI's scripted reply: the first legal move in sorted coordinate order.
          moves.push(r.best, [...legalSet(guiPosition(START, [...moves, r.best]))].sort()[0] as string);
        }
      } catch {
        threw = true;
      }
      check(`${label}: handleLine never threw`, !threw);
      check(`${label}: warn called exactly once`, e.warnings.length === 1, JSON.stringify(e.warnings));
      const w = e.warnings[0] ?? "";
      check(`${label}: the warning is the fixed text`, /^opening book .+; playing on without it$/.test(w) && printable(w), w);
      check(`${label}: the warning carries none of the planted bytes`, planted.every((x) => !w.includes(x)), w);
      check(`${label}: no written line names the book (the warn binding is ABC-168's)`, !e.out.some((l) => l.includes("opening book") || l === "info string book"));
      if (flow === "isready first" && name.startsWith("read throws (a")) obs(`warning text: ${JSON.stringify(w)}`);
    }
  }
}

// ================================================================================================
begin("S6", "Skill Level 1-5: budgets, the blunder path, determinism, and dropped limits (A6, A7, A13a, A13c, D11)");
{
  // Budgets, read from the info line on a virtual clock (step 100), on the engine path.
  const rows: ReadonlyArray<readonly [string, string, Record<string, number>, boolean, number]> = [
    ["go movetime 10000", "go movetime 10000", { movetime: 10000 }, false, 100],
    ["A6: G = 3 500", "go wtime 60000 btime 60000 winc 1000 binc 1000", { wtime: 60000, btime: 60000, winc: 1000, binc: 1000 }, false, 100],
    ["a bare go (G = the 5 000 ceiling)", "go", {}, false, 100],
    ["black, G = 1 400", "go wtime 60000 btime 28050", { wtime: 60000, btime: 28050 }, true, 100],
    ["a short clock (G = 75): the clock binds every level", "go wtime 1500 btime 60000", { wtime: 1500, btime: 60000 }, false, 10],
  ];
  for (const [what, line, tokens, black, step] of rows) {
    for (const level of [1, 2, 3, 4, 5]) {
      const e = engine({ step, k: K_ENGINE });
      e.send(`setoption name Skill Level value ${level}`);
      e.send(black ? "position startpos moves e2e4" : "position startpos");
      const b = capped(d4(tokens, black), level);
      const { info } = searched(`level ${level}, ${what}`, e.send(line), guiPosition(black ? AFTER_E4 : START), shapeOf(level));
      inWindow(`level ${level}, ${what}`, info?.time, b, step);
      check(`level ${level}, ${what}: time under the 5 000 ceiling (+2 steps)`, (info?.time ?? Infinity) <= CEILING + 2 * step, `time ${info?.time}`);
      if (info) obs(`level ${level}, ${what}: ${info.shape} line, depth ${info.depth}, time ${info.time} (B ${b})`);
    }
  }
  // The blunder path: the session reports exactly what the level module measures, on the same clock step.
  for (const level of [1, 2]) {
    for (const step of [1, 10]) {
      const e = engine({ step, k: K_BLUNDER });
      e.send(`setoption name Skill Level value ${level}`);
      e.send("position startpos");
      const { info, best } = searched(`level ${level} blunder draw, step ${step}`, e.send("go movetime 10000"), guiPosition(START), "level");
      const o = oracle(level, K_BLUNDER, 1, guiPosition(START), 10000, step);
      check(`level ${level} blunder draw, step ${step}: the level module took the blunder path`, o.kind === "blunder" || o.kind === "no-candidate", o.kind);
      check(`level ${level} blunder draw, step ${step}: move, depth, nodes and time equal the level module's`, best === coord(o.move) && info?.depth === o.depth && info?.nodes === o.nodes && info?.time === o.elapsedMs, `${best} d${info?.depth} n${info?.nodes} t${info?.time} vs ${coord(o.move)} d${o.depth} n${o.nodes} t${o.elapsedMs}`);
      // RUN-0 also checked "not the engine-path move". Nothing promises that: the strict second-best by
      // child scores can be the move a deeper main search picks (it was, at step 1). Now reported only.
      const engineMove = coord(oracle(level, K_ENGINE, 1, guiPosition(START), 10000, step).move);
      if (info) obs(`level ${level} blunder draw, step ${step}: ${o.kind} ${best} (engine path plays ${engineMove}), depth ${info.depth}, time ${info.time} virtual ms against B ${TABLE[level]!.budgetMs} (UAT-171-a)`);
    }
  }
  // Determinism per seed: two sessions on the same seededRandom(k), and the D11 seed oracle per go.
  const script: ReadonlyArray<readonly [string, string, readonly string[]]> = [
    ["position startpos", START, []],
    ["position startpos moves e2e4 e7e5", START, ["e2e4", "e7e5"]],
    [`position fen ${KIWIPETE}`, KIWIPETE, []],
    [`position fen ${AFTER_E4}`, AFTER_E4, []],
  ];
  for (const level of [1, 2]) {
    const sequences = new Set<string>();
    let blunders = 0;
    let engineMoves = 0;
    let matches = 0;
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const run = () => {
        const e = engine({ step: 10, k });
        e.send(`setoption name Skill Level value ${level}`);
        const lines: string[] = [];
        script.forEach(([pos, fen, moves], i) => {
          e.send(pos);
          const t = e.send("go movetime 1000");
          lines.push(...t.lines);
          const { best } = searched(`level ${level} k ${k} go ${i + 1}`, t, guiPosition(fen, moves), "level");
          const o = oracle(level, k, i + 1, guiPosition(fen, moves), 1000, 10);
          if (best === coord(o.move)) matches++;
          if (o.kind === "engine") engineMoves++;
          else blunders++;
        });
        check(`level ${level} k ${k}: one seed drawn per go (4)`, e.draws.count === 4, `draws ${e.draws.count}`);
        return lines.join("\n");
      };
      const a = run();
      const b = run();
      check(`level ${level} k ${k}: two sessions on seededRandom(${k}) write identical lines`, a === b);
      sequences.add(a);
    }
    check(`level ${level}: every bestmove equals the D11 seed oracle floor(random() * 2^32) (64 of 64)`, matches === 64, `${matches}/64`);
    check(`level ${level}: both paths were exercised (non-vacuity)`, blunders > 0 && engineMoves > 0, `${blunders / 2} blunder draws, ${engineMoves / 2} engine draws over 32 gos`);
    check(`level ${level}: a different k gives a different sequence somewhere`, sequences.size > 1, `${sequences.size} distinct sequences over 8 seeds`);
  }
  // Levels 1 and 2 ignore depth / nodes / mate, and say so in one line; the time budget still binds.
  const limited: ReadonlyArray<readonly [string, readonly string[], number]> = [
    ["go depth 3", ["depth"], CEILING],
    ["go nodes 100", ["nodes"], CEILING],
    ["go mate 2", ["mate"], CEILING],
    ["go nodes 1", ["nodes"], CEILING],
    ["go depth 3 nodes 100 mate 2", ["depth", "nodes", "mate"], CEILING],
    ["go mate 1 depth 2", ["mate", "depth"], CEILING],
    ["go depth 3 depth 4", ["depth"], CEILING],
    ["go movetime 1000 depth 1", ["depth"], 1000],
    ["go wtime 60000 btime 60000 winc 1000 binc 1000 nodes 50", ["nodes"], 3500],
  ];
  for (const level of [1, 2]) {
    for (const [line, named, g] of limited) {
      const e = engine({ step: 10, k: K_ENGINE });
      e.send(`setoption name Skill Level value ${level}`);
      e.send("position startpos");
      const t = e.send(line);
      check(`level ${level}, ${line}: exactly 3 lines`, t.threw === null && t.lines.length === 3, JSON.stringify(t.lines));
      const strings = t.lines.filter(isInfoString);
      check(`level ${level}, ${line}: exactly one info string, first, naming ${named.join(", ")}`, strings.length === 1 && isInfoString(t.lines[0]) && named.every((w) => (t.lines[0] as string).includes(w)), t.lines[0] ?? "");
      const rest: Turn = { result: t.result, lines: t.lines.slice(1), threw: t.threw };
      const { info } = searched(`level ${level}, ${line}`, rest, guiPosition(START), "level");
      inWindow(`level ${level}, ${line}: searched on time, not on the limit`, info?.time, capped(g, level), 10);
    }
    {
      const e = engine({ step: 10, k: K_ENGINE });
      e.send(`setoption name Skill Level value ${level}`);
      e.send(`position fen ${SMOTHERED}`);
      const t = e.send("go mate 2");
      const r = searched(`level ${level}, go mate 2 on the smothered mate`, { result: t.result, lines: t.lines.slice(1), threw: t.threw }, guiPosition(SMOTHERED), "level");
      check(`level ${level}, go mate 2: no score token (D3, the level line)`, !(t.lines[1] ?? "").includes(" score "));
      obs(`level ${level}, go mate 2 on the smothered mate: ${r.best}, ${t.lines[0]}`);
    }
    {
      const e = engine({ step: 10, k: K_ENGINE });
      e.send(`setoption name Skill Level value ${level}`);
      e.send("position startpos");
      const t = e.send("go depth x");
      check(`level ${level}, go depth x: one info string (the bad value only), then the level answer`, t.lines.length === 3 && isInfoString(t.lines[0]) && !isInfoString(t.lines[1]), JSON.stringify(t.lines));
      obs(`level ${level}, go depth x: ${t.lines[0]}`);
    }
  }
  // Levels 3, 4 and 5 honour the limits (rate 0 calls chooseMove with D12's limits), with no info string.
  for (const level of [3, 4, 5]) {
    const run = (setup: string, line: string) => {
      const e = engine({ step: 10 });
      e.send(`setoption name Skill Level value ${level}`);
      e.send(setup);
      return e.send(line);
    };
    const d3 = searched(`level ${level}, go depth 3`, run("position startpos", "go depth 3"), guiPosition(START), "search");
    check(`level ${level}, go depth 3 reports depth 3`, d3.info?.depth === 3, `depth ${d3.info?.depth}`);
    const n1 = searched(`level ${level}, go nodes 1`, run("position startpos", "go nodes 1"), guiPosition(START), "search");
    check(`level ${level}, go nodes 1 plays a depth-1 move`, n1.info?.depth === 1, `depth ${n1.info?.depth}`);
    const m2 = searched(`level ${level}, go mate 2 on the smothered mate`, run(`position fen ${SMOTHERED}`, "go mate 2"), guiPosition(SMOTHERED), "search");
    check(`level ${level}, go mate 2: score mate 2, d5g8`, m2.info?.score === "mate 2" && m2.best === "d5g8", `${m2.info?.score} ${m2.best}`);
  }
  // A level change in the middle of a session applies from the next go; the draws follow the level.
  {
    const e = engine({ step: 100, k: K_ENGINE });
    e.send("position startpos");
    const a = searched("mid-session: level 3 first", e.send("go movetime 10000"), guiPosition(START), "search");
    inWindow("mid-session: level 3 first", a.info?.time, 3000, 100);
    e.send("setoption name Skill Level value 1");
    const b = searched("mid-session: then level 1", e.send("go movetime 10000"), guiPosition(START), "level");
    inWindow("mid-session: then level 1", b.info?.time, 100, 100);
    e.send("setoption name Skill Level value 5");
    const c = searched("mid-session: then level 5", e.send("go movetime 10000"), guiPosition(START), "search");
    inWindow("mid-session: then level 5", c.info?.time, 4500, 100);
    check("mid-session: one seed drawn, by the level-1 go only", e.draws.count === 1, `draws ${e.draws.count}`);
  }
}

// ================================================================================================
begin("S7", "go infinite on a book hit holds until stop (A10, D10, ABC-167 A6)");
{
  {
    const e = engine({ read: START_BOOK });
    e.send("position startpos");
    only("go infinite on a book hit", e.send("go infinite"), ["info string book"]);
    only("isready while held", e.send("isready"), ["readyok"]);
    only("an unknown line while held", e.send("foo"), []);
    only("setoption while held", e.send("setoption name Hash value 1"), []);
    only("stop", e.send("stop"), ["bestmove e2e4"]);
    only("a second stop", e.send("stop"), []);
  }
  {
    const e = engine({ read: START_BOOK });
    e.send("position startpos");
    only("go ponder on a book hit", e.send("go ponder"), ["info string book"]);
    only("ponderhit", e.send("ponderhit"), ["bestmove e2e4"]);
    e.send("position startpos");
    only("go movetime 100 infinite on a book hit", e.send("go movetime 100 infinite"), ["info string book"]);
    only("stop", e.send("stop"), ["bestmove e2e4"]);
  }
  const releasers: ReadonlyArray<readonly [string, readonly string[]]> = [
    ["position startpos", ["bestmove e2e4"]],
    ["ucinewgame", ["bestmove e2e4"]],
    ["quit", ["bestmove e2e4"]],
    ["go movetime 100", ["bestmove e2e4", "info string book", "bestmove e2e4"]],
  ];
  for (const [line, expected] of releasers) {
    const e = engine({ read: START_BOOK });
    e.send("position startpos");
    e.send("go infinite");
    const t = e.send(line);
    only(`a held book answer, then ${line}`, t, expected);
    if (line === "quit") check("quit returns quit", t.result === "quit", String(t.result));
  }
  for (const level of [1, 2]) {
    const e = engine({ read: START_BOOK, k: K_ENGINE });
    e.send(`setoption name Skill Level value ${level}`);
    e.send("position startpos");
    only(`level ${level}, go infinite on a book hit`, e.send("go infinite"), ["info string book"]);
    only(`level ${level}, stop`, e.send("stop"), ["bestmove e2e4"]);
    check(`level ${level}, the held book hit drew 0 seeds`, e.draws.count === 0, `draws ${e.draws.count}`);
    const f = engine({ k: K_ENGINE, step: 10 });
    f.send(`setoption name Skill Level value ${level}`);
    f.send("position startpos");
    const h = f.send("go infinite");
    const info = parseInfo(h.lines[0]);
    check(`level ${level}, go infinite with no book hit holds a level line`, h.lines.length === 1 && info?.shape === "level", JSON.stringify(h.lines));
    inWindow(`level ${level}, go infinite (G = the ceiling, capped by the level)`, info?.time, TABLE[level]!.budgetMs, 10);
    only(`level ${level}, stop releases it`, f.send("stop"), [`bestmove ${info?.pv}`]);
    check(`level ${level}, that go drew 1 seed`, f.draws.count === 1, `draws ${f.draws.count}`);
  }
}

// ================================================================================================
begin("S8", "ucinewgame draws no seeds and resets nothing but the position (A8, D3, D11)");
{
  for (const level of [1, 2]) {
    const e = engine({ step: 10, k: 1 });
    e.send(`setoption name Skill Level value ${level}`);
    check(`level ${level}: setoption draws 0`, e.draws.count === 0, `draws ${e.draws.count}`);
    e.send("position startpos");
    e.send("go movetime 1000");
    check(`level ${level}: the first go draws 1`, e.draws.count === 1, `draws ${e.draws.count}`);
    e.send("ucinewgame");
    check(`level ${level}: ucinewgame draws 0 (still 1)`, e.draws.count === 1, `draws ${e.draws.count}`);
    e.send("ucinewgame");
    e.send("ucinewgame");
    e.send("isready");
    check(`level ${level}: three more ucinewgame and an isready draw 0 (still 1)`, e.draws.count === 1, `draws ${e.draws.count}`);
    e.send("go movetime 1000");
    check(`level ${level}: the next go draws 1 (now 2)`, e.draws.count === 2, `draws ${e.draws.count}`);
  }
  for (const level of [3, 4, 5]) {
    const e = engine({ step: 10 });
    e.send(`setoption name Skill Level value ${level}`);
    for (const line of ["position startpos", "go movetime 100", "ucinewgame", "go depth 2", "position startpos moves e2e4", "go nodes 100"]) e.send(line);
    check(`level ${level} (rate 0): three gos and a ucinewgame draw 0`, e.draws.count === 0, `draws ${e.draws.count}`);
  }
  // The stream is not reset: after ucinewgame the next go takes the SECOND draw, not the first again.
  const kDiff = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].find(
    (k) => coord(oracle(1, k, 1, guiPosition(START), 1000, 10).move) !== coord(oracle(1, k, 2, guiPosition(START), 1000, 10).move),
  ) as number;
  check(`fixture: a k whose first and second level-1 seeds play different moves from the start (k = ${kDiff})`, kDiff !== undefined);
  {
    const withNew = engine({ step: 10, k: kDiff });
    const without = engine({ step: 10, k: kDiff });
    for (const e of [withNew, without]) {
      e.send("setoption name Skill Level value 1");
      e.send("position startpos");
      e.send("go movetime 1000");
    }
    withNew.send("ucinewgame");
    withNew.send("position startpos");
    without.send("position startpos");
    const a = withNew.send("go movetime 1000");
    const b = without.send("go movetime 1000");
    check("no reseed: the go after ucinewgame writes what the same go without it writes", JSON.stringify(a.lines) === JSON.stringify(b.lines), `${a.lines[1]} vs ${b.lines[1]}`);
    check("no reseed: it is the second seed's move, not the first's", bestOf(a.lines[1]) === coord(oracle(1, kDiff, 2, guiPosition(START), 1000, 10).move), `${a.lines[1]}; first seed plays ${coord(oracle(1, kDiff, 1, guiPosition(START), 1000, 10).move)}`);
  }
  // ucinewgame keeps the options and does not reload the book.
  {
    const e = engine({ read: START_BOOK, step: 10, k: K_ENGINE });
    e.send("isready");
    e.send("setoption name OwnBook value false");
    e.send("setoption name Skill Level value 1");
    e.send("ucinewgame");
    e.send("isready");
    e.send("position startpos");
    searched("after ucinewgame: OwnBook still false and level still 1 (a level line, no book)", e.send("go movetime 1000"), guiPosition(START), "level");
    check("after ucinewgame: the book was not reloaded (1 read)", e.reads.count === 1, `reads ${e.reads.count}`);
  }
  // Edge readings, reported: a go with no position held, and a go on a mated position, at level 1.
  {
    const e = engine({ step: 10 });
    e.send("setoption name Skill Level value 1");
    e.send("position fen 8/8/8 w - - 0 1");
    const t = e.send("go movetime 100");
    only("level 1, no position held: go", t, ["bestmove 0000"]);
    obs(`level 1, no position held: ${e.draws.count} seed(s) drawn`);
    const m = engine({ step: 10 });
    m.send("setoption name Skill Level value 1");
    m.send("position startpos moves f2f3 e7e5 g2g4 d8h4");
    only("level 1, white is mated: go", m.send("go movetime 100"), ["bestmove 0000"]);
    obs(`level 1, white is mated: ${m.draws.count} seed(s) drawn (the go reached the level, which found no move)`);
  }
}

// ================================================================================================
/** A GUI plays one engine session against a scripted opponent on a clock, as a referee would. */
function scriptedGame(tag: string, level: number, engineIsWhite: boolean, step: number, base: number, inc: number, k: number) {
  const e = engine({ read: REAL_BOOK, step, k });
  only(`${tag} uci`, e.send("uci"), OPTION_LINES);
  only(`${tag} setoption`, e.send(`setoption name Skill Level value ${level}`), []);
  only(`${tag} isready`, e.send("isready"), ["readyok"]);
  only(`${tag} ucinewgame`, e.send("ucinewgame"), []);
  const opponent = seededRandom(99);
  const moves: string[] = [];
  const counts = new Map<bigint, number>();
  let wtime = base;
  let btime = base;
  let lowest = base;
  let bookPlies = 0;
  let enginePlies = 0;
  let drawsOk = true;
  let end = "the 300-ply cap";
  for (let ply = 0; ply < 300; ply++) {
    const p = guiPosition(START, moves);
    const key = zobristKey(p);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    const status = gameStatus(p, counts);
    if (status.result !== "in-progress") {
      end = `${status.reason}, ${status.result}`;
      break;
    }
    if (status.claimable) {
      end = `the GUI adjudicates a claimable ${status.claimable.draws.join("/")} draw`;
      break;
    }
    const legal = [...legalSet(p)].sort();
    if (p.blackToMove === engineIsWhite) {
      moves.push(legal[Math.floor(opponent() * legal.length)] as string);
      continue;
    }
    e.send(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`);
    const before = e.draws.count;
    const t = e.send(`go wtime ${Math.round(wtime)} btime ${Math.round(btime)} winc ${inc} binc ${inc}`);
    let best: string | undefined;
    let spent = 0;
    if (t.lines[0] === "info string book") {
      best = booked(`${tag} ply ${ply + 1} (book)`, t, p, legal);
      bookPlies++;
      if (e.draws.count !== before) drawsOk = false;
    } else {
      const r = searched(`${tag} ply ${ply + 1}`, t, p, shapeOf(level));
      best = r.best;
      spent = r.info?.time ?? 0;
      enginePlies++;
      if (e.draws.count - before !== (TABLE[level]!.blunderRate > 0 ? 1 : 0)) drawsOk = false;
    }
    if (!best) {
      end = `aborted: no legal answer at ply ${ply + 1}`;
      break;
    }
    if (p.blackToMove) btime = btime - spent + inc;
    else wtime = wtime - spent + inc;
    lowest = Math.min(lowest, engineIsWhite ? wtime : btime);
    moves.push(best);
  }
  check(`${tag}: the game reached an end the GUI recognises, with every engine move legal`, !end.startsWith("aborted"), end);
  check(`${tag}: the engine's virtual clock never ran out`, lowest > 0, `lowest ${lowest}`);
  check(`${tag}: seeds drawn = 1 per searched go at a blunder level, 0 on book hits and at rate 0`, drawsOk);
  check(`${tag}: the book was read once, with no warning`, e.reads.count === 1 && e.warnings.length === 0);
  only(`${tag} quit`, e.send("quit"), []);
  obs(`${tag}: ${moves.length} plies, ended by ${end}; ${bookPlies} book answers, ${enginePlies} searched; lowest engine clock ${Math.round(lowest)} virtual ms`);
  obs(`${tag}: ${moves.join(" ")}`);
  return moves.join(" ");
}
begin("S9", "a full game at level 1 and one at level 3, against a scripted opponent, legal throughout");
{
  const a = scriptedGame("level 1, engine white, 3+2, step 10", 1, true, 10, 180000, 2000, 3);
  const b = scriptedGame("level 3, engine black, 10+0.1, step 10", 3, false, 10, 10000, 100, 3);
  check("the level 1 game replays move for move", scriptedGame("level 1 replay", 1, true, 10, 180000, 2000, 3) === a);
  check("the level 3 game replays move for move", scriptedGame("level 3 replay", 3, false, 10, 10000, 100, 3) === b);
}

// ================================================================================================
begin("X1", "every line written in S1-S9 (ABC-171 A11 M4, D3 'nothing else is ever written')");
{
  const allowed = /^(id |option |uciok$|readyok$|info |bestmove )/;
  const bad = everyLine.filter((l) => !allowed.test(l));
  check(`all ${everyLine.length} lines start with id/option/uciok/readyok/info/bestmove`, bad.length === 0, JSON.stringify(bad.slice(0, 3)));
  const unprintable = everyLine.filter((l) => !printable(l));
  check("all lines are printable", unprintable.length === 0, JSON.stringify(unprintable.slice(0, 3)));
  check(`one bestmove per go across the run (${goCount} go, ${bestmoveCount} bestmove)`, goCount === bestmoveCount);
}

// --- summary ------------------------------------------------------------------------------------
console.log("\n== summary");
let pass = 0;
let fail = 0;
for (const [id, t] of tally) {
  pass += t.pass;
  fail += t.fail;
  console.log(`${t.fail === 0 ? "PASS" : "FAIL"} ${id} ${t.pass}/${t.pass + t.fail}`);
}
console.log(`TOTAL ${pass}/${pass + fail} checks; ${[...tally.values()].filter((t) => t.fail === 0).length}/${tally.size} scenarios PASS`);
console.log(`engine work: ${answers} answers checked, ${goCount} go lines; 0 child processes; no wall-clock reading`);
