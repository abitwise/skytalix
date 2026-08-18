/**
 * `ABC-042` — the entry point and its argv resolver: `A1`…`A10` and `A12`'s structural halves, plus
 * the security bars this ticket's page states in a form a test can decide.
 *
 * ONE FILE FOR BOTH MODULES, and it is the heaviest file either epic adds. It holds no `vi.mock`, so
 * it is not an `*.nfr.test.ts`: nothing here re-routes the module graph.
 *
 * THE SPAWN BUDGET IS THE POINT OF THE LAYOUT. `CHILDREN` below spawns each command line EXACTLY
 * ONCE, at module scope, with stdout AND stderr piped — a child cannot be re-run to add a pipe
 * afterwards, and `A5`, `A6` and security bar 3 all assert over the union of the two. Every
 * spawn-provable criterion that can share a child's output does. Everything else — `A4`'s 1000
 * `random` resolutions, all of `A6`(i) and (ii), `A5`'s spy — is a unit call at ZERO spawn cost,
 * which is the whole reason the resolver is a separate module (`## Scope` 2).
 *
 * BAR 1b GOVERNS THIS FILE, and bars 1, 3 and 4 do not: they are scoped to the delivered PRODUCTION
 * modules. `node:child_process` is reached only in argument-array form; there is no `exec(` or
 * `execSync(` call site, no `shell:`, and no spawn argument built by string concatenation. The file
 * MUST contain `process.execPath` — which is why the bar counts call sites and never occurrences.
 */

import { spawnSync } from "node:child_process";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { ACCEPTED_ARGUMENTS, type ResolvedOptions, resolveOptions } from "./cli-options.ts";
import { frameHeight } from "./frame.ts";
import * as glyphMode from "./glyph-mode.ts";
import { type GameHistory, gameStatusOf, newGame, playMove } from "./history.ts";
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import { PROMPT } from "./line-input.ts";
import { squareName } from "./position.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { makeRenderSeam } from "./render-seam.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import { INPUT_ENDED_NOTICE, type TerminalReason } from "./turn-loop.ts";

const SOURCE_DIRECTORY = new URL(".", import.meta.url).pathname;
const REPOSITORY = new URL("..", import.meta.url).pathname;
const ENTRY_POINT = new URL("cli.ts", import.meta.url).pathname;

/** Every test file in this repository defines its own; there is no exported constant to import. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const startGame = () => newGame(START_FEN);

const sourceOf = (file: string): string => readFileSync(`${SOURCE_DIRECTORY}${file}`, "utf8");

/** The delivered module with its comments removed — what the structural rows assert over. */
const executableCodeOf = (file: string): string =>
  sourceOf(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

/** `ADR-0011` clause 1's own expression: a `.ts` under `src/` that is not a `.test.ts`. */
const productionModules = (): readonly string[] =>
  readdirSync(SOURCE_DIRECTORY).filter(
    (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
  );

// ---------------------------------------------------------------------------------------------
// The reference frames. Composed from the MERGED modules, so a build that drifts from them is red
// rather than compared against a second copy of their behaviour.
// ---------------------------------------------------------------------------------------------

const frameOf = (mode: GlyphMode, orientation: Orientation): readonly string[] => {
  const history = startGame();
  return makeRenderSeam(mode, orientation)(history, gameStatusOf(history), false, []);
};

/**
 * `A4`'s board region: the merged renderer's rows padded to the frame's width, where the width is
 * taken over the PANELS — `src/render-seam.test.ts`'s own method, never read off the frame, so a
 * build that padded the board itself could not inflate both sides of the comparison at once.
 */
const boardRegionOf = (mode: GlyphMode, orientation: Orientation): readonly string[] => {
  const history = startGame();
  const status = gameStatusOf(history);
  const board = renderBoard(history.position, mode, orientation);
  const width = Math.max(
    ...[...board, ...renderStatusPanel(history, status, false), ...renderHistory(history)].map(
      (row) => row.length,
    ),
  );
  return board.map((row) => row.padEnd(width));
};

const MODES: readonly GlyphMode[] = ["ascii", "unicode"];
const ORIENTATIONS: readonly Orientation[] = ["white-bottom", "black-bottom"];

/**
 * Every row any legal first frame can carry, in either mode and either orientation. A rejection path
 * that emitted one of these on EITHER channel is the build test note 4 names, and this set is what
 * sees it.
 */
const FRAME_ROWS: ReadonlySet<string> = new Set(
  MODES.flatMap((mode) => ORIENTATIONS.flatMap((orientation) => frameOf(mode, orientation)))
    .map((row) => row.trimEnd())
    .filter((row) => row !== ""),
);

const frameRowsIn = (text: string): readonly string[] =>
  text
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => FRAME_ROWS.has(line));

const codePointsOf = (text: string): readonly number[] =>
  [...text].map((character) => character.codePointAt(0) as number);

/**
 * `ABC-043` — THE FRAMES A CHILD'S STDOUT CARRIES, in order, byte for byte.
 *
 * The stream is no longer one frame: a session emits one per render, `ABC-037`'s prompt (`PROMPT`,
 * two bytes and NO newline) between them, and `INPUT_ENDED_NOTICE` at the end of a truncated one.
 * So a frame can no longer be read as "the whole stream" or as a fixed offset from row 0 —
 * `npm`'s banner already made that false for one child, and a prompt now makes it false for the rest.
 *
 * FRAMES ARE LOCATED BY THE BOARD'S FILE LEGEND, never by an offset and never by a count. The legend
 * is `renderBoard`'s own last row — read from the merged renderer per (mode, orientation), so its
 * spelling and the board's height both move with that module rather than being transcribed here —
 * and it occurs exactly once per frame at a known distance from the frame's first row. That makes
 * this robust to `npm`'s banner, to the prompt, to the notice, and to `W` changing between frames.
 *
 * The prompt is stripped from the frame's FIRST row and only there: the writer ends every frame with
 * a newline and the prompt carries none, so a prompt always lands at the start of the line the next
 * frame's row 0 is written onto, and nowhere else.
 */
const framesIn = (
  stream: string,
  mode: GlyphMode,
  orientation: Orientation,
): readonly (readonly string[])[] => {
  const board = boardRegionOf(mode, orientation);
  const legend = (board[board.length - 1] as string).trimEnd();
  const height = frameOf(mode, orientation).length;
  const lines = stream.split("\n");

  return lines.flatMap((line, index) => {
    if (line.trimEnd() !== legend) return [];
    const top = index - (board.length - 1);
    const rows = lines.slice(top, top + height);
    const first = rows[0] as string;
    return [[first.startsWith(PROMPT) ? first.slice(PROMPT.length) : first, ...rows.slice(1)]];
  });
};

/**
 * The game the child was scripted to play, replayed here through the MERGED modules — the reference
 * `A2`'s final frame is compared against, rather than a second transcription of what a mated board
 * looks like. Moves are named as the engine double names them: from-square then to-square.
 */
const playedOut = (coordinates: readonly string[]): GameHistory => {
  const history = startGame();
  for (const wanted of coordinates) {
    const move = legalMoves(history.position).find(
      (candidate) => `${squareName(candidate.from)}${squareName(candidate.to)}` === wanted,
    );
    if (move === undefined) throw new Error(`no legal move ${wanted} in the replay`);
    playMove(history, move);
  }
  return history;
};

// ---------------------------------------------------------------------------------------------
// THE CHILDREN. Ten, spawned once each, and the count is asserted below so it cannot creep.
// ---------------------------------------------------------------------------------------------

interface Child {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
  /** stdout and stderr, unioned — what an absence property is asserted over. */
  readonly union: string;
}

/**
 * `ABC-043`'s two additions to `ABC-042`'s one helper (`## Test notes` 5 and 6: extend the helper,
 * do not add a second `spawnSync` call site — `:950`'s guard asserts that textually and stays green).
 *
 * `input` — the script the child types. `ABC-042` spawned with `stdio: ["ignore", …]` because a
 * board-printer reads nothing; every `ABC-043` criterion feeds a pipe, so stdin is now a pipe on
 * EVERY child. A child given no script gets an empty one, which is the same end-of-input a closed
 * `/dev/null` handed it before.
 *
 * `hook` — a `data:` URL loaded with `--import`, substituting one module in the CHILD only. See
 * `substituting` below for the mechanism, its licence and its limits.
 */
interface ChildOptions {
  readonly input?: string;
  readonly hook?: string;
}

let spawned = 0;

const childOf = (command: string, args: readonly string[], options: ChildOptions = {}): Child => {
  spawned++;
  const child = spawnSync(
    command,
    options.hook === undefined ? [...args] : ["--import", options.hook, ...args],
    {
      cwd: REPOSITORY,
      encoding: "utf8",
      input: options.input ?? "",
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a child that never started says so here,
  // loudly, instead of arriving as an empty capture that every absence assertion would swallow.
  if (child.error !== undefined)
    throw new Error(`child ${command} failed to start: ${child.error}`);
  return {
    status: child.status,
    stdout: child.stdout,
    stderr: child.stderr,
    union: `${child.stdout}${child.stderr}`,
  };
};

/** The delivered entry point, run as a child the way a human's shell runs it. */
const run = (...args: readonly string[]): Child =>
  childOf(process.execPath, [ENTRY_POINT, ...args]);

/** The same entry point, typed at and — where a criterion needs a constructed fault — hooked. */
const play = (args: readonly string[], options: ChildOptions): Child =>
  childOf(process.execPath, [ENTRY_POINT, ...args], options);

// ---------------------------------------------------------------------------------------------
// THE SUBSTITUTION RIG (`ABC-043` `A2`/`A5`, ruled and measured by BA/PM at
// `refine-ABC-043-2026-08-19`, on the ticket under `## The ruling on `A5` and `A2`'s testability`).
//
// WHAT IT IS. `node:module`'s `registerHooks`, loaded into the CHILD with `--import`, replaces one
// module's source in that child and nothing else. The hook rides a `data:text/javascript,…` URL, so
// the whole rig is a string in this file: no new file, nothing under `src/`, no env var any
// production line reads, and no export — `src/cli.ts` still exports NOTHING (`ADR-0011` clause 4).
// A human running `npm run chess` never passes `--import`, which is the discriminator `ADR-0013`
// clause 3 draws: only a test can reach this, so it is a test double and not an undelivered feature.
//
// WHY IT IS NEEDED. `A5` asks for "an `EngineSeam` that throws" and "one that returns a move
// `legalMoves` did not produce" — constructed faults, i.e. doubles by definition — driven "through
// the real entry point rather than through a stub harness". That clause constrains the DRIVER: the
// exit code, the frame stream and the top-level handler must be the PROCESS's, and they are. `A2`'s
// "deterministic opponent" must be a double for a second reason the ticket states as a requirement:
// the merged engine is iterative deepening against a wall clock (`src/engine.ts:83,305`), so a
// scripted line asserted against it is flaky by construction — and MEASURED here, one real engine
// ply on the start position costs 3.09 s of wall against `NFR-008`'s 3 s clause for the whole lane.
//
// THE LIMITS THIS FILE HONOURS. `./line-input.ts`, `./frame.ts` and `./turn-loop.ts` are NEVER
// substituted — replacing any of them would test the harness instead of the product. The engine
// seam is substituted under `A2`, `A5` and `A7`, and by `ABC-042`'s two colour children, which now
// reach an engine ply through the delivered composition and which `## Test notes` 8 forbids to run
// the real search in the default lane. `./command-input.ts` is substituted by `A3` alone, and that
// one is an EXTENSION of BA/PM's ruling rather than an application of it — the reasoning, and why
// no smaller instrument reaches `A3`, is at the `A3` row.
// ---------------------------------------------------------------------------------------------

/** A hook URL that gives the child a different `src/<module>` and leaves every other module real. */
const substituting = (module: string, source: string): string =>
  `data:text/javascript,${encodeURIComponent(
    [
      'import { registerHooks } from "node:module";',
      "registerHooks({",
      "  load(url, context, nextLoad) {",
      `    if (!url.endsWith(${JSON.stringify(`/src/${module}`)})) return nextLoad(url, context);`,
      `    return { format: "module", shortCircuit: true, source: ${JSON.stringify(source)} };`,
      "  },",
      "});",
    ].join("\n"),
  )}`;

/**
 * A deterministic opponent: the scripted moves in order, named as from-square + to-square.
 *
 * It calls the REAL `legalMoves` — a substituted module's relative imports resolve against the
 * module it replaced — so the move it returns is a generator-owned `Move` with all six fields, which
 * is what `wasGenerated` (`src/turn-loop.ts:191`) demands and what keeps this a deterministic
 * opponent rather than a second fault. `DEFAULT_BUDGET_MS` is exported because the entry point
 * imports it; the double consults no clock, so its value cannot matter.
 */
const scriptedEngine = (moves: readonly string[]): string => `
import { legalMoves } from "./legal.ts";
import { squareName } from "./position.ts";
export const DEFAULT_BUDGET_MS = 0;
export function createEngine() {
  const scripted = ${JSON.stringify(moves)};
  let ply = 0;
  return async (history) => {
    const want = scripted[ply++];
    const move = legalMoves(history.position).find(
      (candidate) => squareName(candidate.from) + squareName(candidate.to) === want,
    );
    if (move === undefined) throw new Error("scripted engine: no legal move " + want);
    return move;
  };
}
`;

/**
 * The first legal move, instantly. The opponent for a child whose criterion is not about the GAME —
 * `ABC-042`'s two colour children, whose subject is the first frame's orientation and whose command
 * line now reaches an engine ply. It plays on forever, so nothing it does can end a session early.
 */
const FIRST_LEGAL_ENGINE = `
import { legalMoves } from "./legal.ts";
export const DEFAULT_BUDGET_MS = 0;
export function createEngine() {
  return async (history) => legalMoves(history.position)[0];
}
`;

const CHILDREN = {
  /** `A1` — the real command, and the only one that goes through `npm`. */
  npmRun: childOf("npm", ["run", "chess"]),
  /** `A4` white + `A7`'s unicode half: one child, two criteria. The human moves first — no engine. */
  white: run("--colour", "white", "--unicode"),
  /**
   * `ABC-042`'s two colour children, HOOKED at `ABC-043` and not re-scoped. Their subject is the
   * FIRST frame — the orientation and the status rows — which is rendered before anything acts. What
   * changed is the composition below them: `--colour black` opens with the ENGINE, and `random`
   * opens with it whenever the coin lands black. MEASURED at this hop: the same two children on the
   * real search cost 3.09 s of wall EACH (`node src/cli.ts --colour black </dev/null`, real 3.085 s,
   * user 3.192 s), which is `NFR-008`'s whole 3 s wall clause spent by one child and half of it
   * spent at random. `## Test notes` 8 forbids a default-lane row to run the real engine, so they
   * get the instant opponent; the real search end to end stays the named, uncovered gap it was.
   */
  black: play(["--colour", "black"], { hook: substituting("engine.ts", FIRST_LEGAL_ENGINE) }),
  random: play(["--colour", "random"], { hook: substituting("engine.ts", FIRST_LEGAL_ENGINE) }),
  /** `A5` end to end. */
  conflict: run("--ascii", "--unicode"),
  /** `A6`(iii)'s four, exactly as the criterion names them. */
  difficulty: run("--difficulty", "3"),
  shortFlag: run("-x"),
  badColour: run("--colour", "purple"),
  bareWord: run("foo"),
  /** Security bar 3 — one spawn, one token carrying a literal escape sequence. */
  escape: run("--colour", "\u001b[2Jpurple"),

  // -------------------------------------------------------------------------------------------
  // `ABC-043`'s SEVEN, counted off the criteria at the cut (`N8-SPAWN`, on the ticket) and not one
  // more. Measured here at 64-72 ms of wall each; the pin below moves 10 -> 17 with that row as its
  // reason, and 17 is a ceiling rather than a target.
  // -------------------------------------------------------------------------------------------

  /**
   * `A2` — a scripted game end to end, and `A6`'s ">= 6 frames" run. Fool's mate: the human types
   * `f3` and `g4`, the deterministic opponent answers `e5` and `Qh4#`. `zzz` between them is the
   * third term of the frame formula — a non-advancing outcome that carries a message — and it is
   * fed in the MIDDLE rather than at the end, so a build that dropped it shifts the whole tail.
   */
  mate: play(["--colour", "white"], {
    input: "f3\nzzz\ng4\n",
    hook: substituting("engine.ts", scriptedEngine(["e7e5", "d8h4"])),
  }),

  /**
   * `A3` — `[D31]`'s ruling, as a child. The PARSER throws, one layer below the real `InputSeam`:
   * `src/line-input.ts` catches nothing by its own ruling, so the throw crosses the merged seam, the
   * merged loop repairs the borrowed board and rethrows, and it arrives at the entry point's own
   * handler in the process that owns the exit code.
   */
  parserBug: play(["--colour", "white"], {
    input: "e4\n",
    hook: substituting(
      "command-input.ts",
      'export function resolvePromptLine() { throw new Error("the parser threw"); }\n',
    ),
  }),

  /**
   * `A4` — end-of-input, and the child `A3` is asserted AGAINST. No hook and no engine ply: the real
   * `./engine.ts` is loaded and never called, so this is the delivered product on a truncated
   * script. The script ends WITHOUT a trailing newline, which is the criterion's own Given.
   */
  truncated: play(["--colour", "white"], { input: "e4" }),

  /** `A5` — an `EngineSeam` that throws. `--colour black`, so the engine acts before anything else. */
  engineThrows: play(["--colour", "black"], {
    hook: substituting(
      "engine.ts",
      `export const DEFAULT_BUDGET_MS = 0;
export function createEngine() {
  return async () => { throw new Error("the engine seam threw"); };
}
`,
    ),
  }),

  /**
   * `A5` again — an `EngineSeam` that returns a move `legalMoves` did not produce. A REAL legal move
   * with one field falsified: `captured` decides the undo record `playMove` builds, so a move with
   * the right squares and a wrong `captured` corrupts the board exactly as a foreign move does
   * (`src/turn-loop.ts:191-200`). A pair of made-up squares would be caught by a weaker guard too.
   */
  engineForeign: play(["--colour", "black"], {
    hook: substituting(
      "engine.ts",
      `import { legalMoves } from "./legal.ts";
export const DEFAULT_BUDGET_MS = 0;
export function createEngine() {
  return async (history) => ({ ...legalMoves(history.position)[0], captured: 1 });
}
`,
    ),
  }),

  /**
   * `A7` black — the engine acts first and NO prompt is read before it. The witness is the
   * unconsumed line (`## Test notes` 3): the script's first line is a move only BLACK can play, so a
   * build that read it before the engine's ply would consume it into the void and the game would go
   * on without it. The opponent is scripted for two plies, so the session ends on end-of-input
   * rather than on an opponent that ran out of script.
   */
  colourBlack: play(["--colour", "black"], {
    input: "e5\n",
    hook: substituting("engine.ts", scriptedEngine(["a2a3", "b2b3"])),
  }),

  /**
   * `A7` white — the reverse, because either direction alone is satisfied by a wrong build. The
   * opponent is scripted for exactly the ONE ply this session gives it: a build that asked it twice
   * would run the script out and end on `engine-threw`, which is a red rather than a silent pass.
   */
  colourWhite: play(["--colour", "white"], {
    input: "e4\n",
    hook: substituting("engine.ts", scriptedEngine(["e7e5"])),
  }),
} as const;

// ---------------------------------------------------------------------------------------------
// `ABC-066` — reading the usage line back off a child's stderr, where a human reads it. `USAGE` is
// not exported and must not become so (`ADR-0011` clause 4), so the line is LOCATED, never imported.
//
// THE SHARED NAMES THIS BLOCK INTRODUCES: `SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf`,
// `invocationsAdvertisedBy`. Named rather than counted (`ABC-068` `A4`): the count that stood on
// this line had gone stale against the block beneath it, so the line now carries no number at all.
// Of those names, the extraction pair `usageLineOf` and `advertisedTextOf` is what the "neither"
// below speaks of. `ABC-065`'s guard block lands in this file next and its
// instruction is to REUSE them rather than write a second stderr->usage-line extraction: they are at
// module scope, above every `describe`, for exactly that reason. Neither spells any accepted
// argument, and neither spells any part of the usage sentence — both work by position and by
// grammar, so a guard built on them cannot pass by matching text it transcribed (`A5`).
// ---------------------------------------------------------------------------------------------

/**
 * The one form `A1` requires the refusal to advertise. It is the criterion's own string, not a copy
 * of the usage sentence, and it contains no member of `ACCEPTED_ARGUMENTS` — a bare `--` is the
 * package runner's separator, not an argument this program accepts (`A3`).
 */
const SEPARATOR_FORM = "npm run chess -- ";

/**
 * The usage line as a human reads it: the LAST non-empty line a refused child wrote to stderr.
 *
 * FAILURE CONTRACT — ON BAD INPUT IT THROWS. Handed stderr with no non-empty line at all, it raises
 * rather than returning an empty string, so no caller can assert against a value that was never
 * read. The guard in the body is that contract; this line is it stated where a caller looks.
 */
const usageLineOf = (stderr: string): string => {
  const lines = stderr
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line !== "");
  const last = lines[lines.length - 1];
  // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a build that refused in silence would hand
  // every assertion below an empty string to be satisfied by.
  if (last === undefined) throw new Error("the refused child wrote nothing to stderr");
  return last;
};

/**
 * What the usage line offers: everything after the separator the criterion names — on a value that
 * CONTAINS that separator.
 *
 * FAILURE CONTRACT — ON BAD INPUT IT RETURNS A MEANINGLESS VALUE AND NEVER THROWS. Handed a value
 * the separator is absent from, `indexOf` yields `-1` and the expression degrades to
 * `slice(SEPARATOR_FORM.length - 1)`: a corrupted stem, returned silently, that still parses
 * everywhere downstream. Nothing reds; the answer is simply wrong.
 *
 * PRECONDITION EVERY CALLER MUST MEET: assert `includes(SEPARATOR_FORM)` on the value you pass —
 * the value, not the variable it came from — BEFORE calling. Both callers today meet it and are
 * safe for that reason alone; a third that trusts this helper to complain gets a wrong answer.
 *
 * THE DIVERGENCE FROM `usageLineOf`, WHICH THROWS, IS A DECISION AND IT STANDS (`ABC-068` `A3`).
 * Making this one throw would change the semantics of `ABC-066`'s merged and gated block, so it is
 * a new ticket with its own gate — not a repair anybody makes in passing here.
 */
const advertisedTextOf = (usageLine: string): string =>
  usageLine.slice(usageLine.indexOf(SEPARATOR_FORM) + SEPARATOR_FORM.length);

/**
 * Expand advertised text into the invocations it advertises — a bracketed group OPTIONAL, `|` an
 * ALTERNATION over the group's last token, which is what `[--colour white|black|random]` means and
 * `[--colour white|--colour black|...]` does not say. The empty invocation is a member because every
 * group is optional; each group's alternatives are then offered ONE AT A TIME.
 *
 * DELIBERATELY NOT A CROSS PRODUCT (`## Test notes` 5): twelve combinations prove nothing the six
 * single-option forms do not, and the parse is the fiddly part — this stays small enough to read.
 */
const invocationsAdvertisedBy = (advertised: string): readonly (readonly string[])[] => {
  const invocations: string[][] = [[]];
  for (const group of advertised.matchAll(/\[([^\]]*)\]/g)) {
    const alternatives = (group[1] as string).split("|").map((alternative) => alternative.trim());
    const stem = (alternatives[0] as string).split(/\s+/).slice(0, -1);
    for (const alternative of alternatives) {
      invocations.push([...stem, ...alternative.split(/\s+/).slice(-1)]);
    }
  }
  return invocations;
};

describe("ABC-042 — a human can run it", () => {
  it("A1 — `npm run chess` writes the start position and exits 0", () => {
    const frame = frameOf("ascii", "white-bottom");
    const child = CHILDREN.npmRun;

    expect(child.status, `npm run chess failed: ${child.stderr}`).toBe(0);
    // The height, through `frameHeight`'s own arithmetic on the merged constants. There is no
    // exported board-row constant, so the board term is read off `renderBoard(...).length`.
    expect(frame.length).toBe(
      frameHeight({
        board: renderBoard(startGame().position, "ascii", "white-bottom").length,
        status: STATUS_ROWS,
        history: HISTORY_ROWS,
      }),
    );

    // `npm` prints its own two-line banner on stdout before the script's output, and since
    // `ABC-043` the START POSITION IS NO LONGER THE WHOLE STREAM: this command now opens a session,
    // so the frame is followed by `ABC-037`'s prompt and — stdin being an empty pipe here — the
    // loop's end-of-input notice. The frame is therefore LOCATED rather than sliced off either end
    // (`framesIn`), which is what makes this row read the same on a board-printer and on a game.
    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    expect(frames, "the start position, once").toHaveLength(1);
    const shown = frames[0] as readonly string[];
    expect(shown).toEqual([...frame]);
    // Nothing outside the frame carries a frame row — npm's banner above it and the session's tail
    // below it are both asserted to be frame-free, which is what the old whole-stream slice bought.
    expect(frameRowsIn(child.stdout.replace(shown.join("\n"), ""))).toEqual([]);
    // The eight ranks, named as `A1` names them, so the row count alone cannot satisfy it.
    for (const rank of ["8", "7", "6", "5", "4", "3", "2", "1"]) {
      expect(
        shown.some((row) => row.startsWith(`${rank} `)),
        `rank ${rank}`,
      ).toBe(true);
    }
    // `ABC-043` — and the command a human types is now a GAME. The one board it prints is the one
    // above; what follows it is the prompt and the clean end-of-input notice, in that order.
    expect(child.stdout.endsWith(`${PROMPT}${INPUT_ENDED_NOTICE}\n`)).toBe(true);
  });

  it("A1 — AGENTS.md's `Dev / run` line is the command that was run", () => {
    // The command in the docs and the command in `package.json` are one string in two files; a
    // ticket whose whole purpose is "a human types one command" cannot leave them free to drift.
    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
    const packaged = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(agents).toContain("- Dev / run: `npm run chess`");
    expect(agents).not.toContain("- Dev / run: `UNKNOWN - verify`");
    expect(packaged.scripts.chess).toBe("node src/cli.ts");
  });

  it("A7 — no flags on a pipe: zero code points above U+007F on the emitted stream", () => {
    // `selectGlyphMode` row 3 — a sink that cannot be seen gets the portable form. The stream is
    // the child's STDOUT (ruled), and on this Given stderr is empty, so every reading coincides.
    const child = CHILDREN.npmRun;

    expect(child.stderr).toBe("");
    expect(Math.max(...codePointsOf(child.stdout))).toBeLessThanOrEqual(0x7f);
  });

  it("A7 — `--unicode` on a pipe puts real chess glyphs in the board region", () => {
    const child = CHILDREN.white;
    const region = child.stdout
      .split("\n")
      .slice(0, boardRegionOf("unicode", "white-bottom").length);
    const glyphs = codePointsOf(region.join("")).filter((code) => code >= 0x2654 && code <= 0x265f);

    expect(child.status).toBe(0);
    expect(glyphs.length).toBeGreaterThan(0);
  });

  it("A8 — the append strategy: no cursor control, and exactly one newline after the last row", () => {
    const frame = frameOf("ascii", "white-bottom");
    const stream = CHILDREN.npmRun.stdout;

    expect(stream).not.toContain("\u001b[");
    // "Exactly one `\n` after the last row" as a byte assertion: the frame joined by newlines, one
    // newline, and — since `ABC-043` — the session's own tail rather than the end of the stream.
    // The second expectation is what makes the first exact rather than a lower bound: TWO newlines
    // after the last row would mean the writer emitted a blank line of its own.
    expect(stream).toContain(`${frame.join("\n")}\n${PROMPT}`);
    expect(stream).not.toContain(`${frame.join("\n")}\n\n`);
  });

  it("A8 / ABC-043 A6 — the entry point begins NO frame session and names no height", () => {
    const code = executableCodeOf("cli.ts");

    // `ABC-042` called `beginFrameSession` itself, with the one frame's own `.length`. `ABC-043`
    // hands `process.stdout` to `runTurnLoop` and the LOOP owns the session — so "called exactly
    // once" moved from this module into merged, mutation-tested code, and what this row now asserts
    // is that no SECOND session can be begun here. `ABC-043` `A6`'s observed half is at its own row.
    expect(code).not.toContain("beginFrameSession");
    expect(code).toMatch(/sink,\s*\}\)/);
  });
});

describe("ABC-042 — the resolved colour reaches the board", () => {
  it("A4 — `--colour random` resolves to white or black 1000 times, with zero spawns", () => {
    const colours: string[] = [];
    let leaked = 0;

    for (let attempt = 0; attempt < 1000; attempt++) {
      const resolution = resolveOptions(["--colour", "random"]);
      if (!resolution.ok) throw new Error("`--colour random` was rejected");
      colours.push(resolution.options.colour);
      // The word itself reaches nothing: not the colour, not the orientation, not the flags.
      if (JSON.stringify(resolution.options).includes("random")) leaked++;
    }

    expect(colours).toHaveLength(1000);
    expect(colours.filter((colour) => colour !== "white" && colour !== "black")).toEqual([]);
    expect(new Set(colours)).toEqual(new Set(["white", "black"]));
    expect(leaked).toBe(0);
  });

  it("A4 — the orientation follows the colour, and it is resolved before anyone sees it", () => {
    const white = resolveOptions(["--colour", "white"]);
    const black = resolveOptions(["--colour", "black"]);
    if (!white.ok || !black.ok) throw new Error("a documented colour was rejected");

    expect(white.options.orientation).toBe("white-bottom");
    expect(black.options.orientation).toBe("black-bottom");
  });

  it("A4 — the running entry point draws each colour from the human's side", () => {
    // The mode differs per child by design: `white` also carries `--unicode` (it is `A7`'s second
    // Given), the other two run on a pipe with no glyph flag and so are `ascii`.
    const white = boardRegionOf("unicode", "white-bottom");
    const black = boardRegionOf("ascii", "black-bottom");

    expect(CHILDREN.white.stdout.split("\n").slice(0, white.length)).toEqual([...white]);
    expect(CHILDREN.black.stdout.split("\n").slice(0, black.length)).toEqual([...black]);
    expect(CHILDREN.white.status).toBe(0);
    expect(CHILDREN.black.status).toBe(0);

    // `--colour random`: exactly one of the two, and the arming half is that the two differ.
    const drawn = CHILDREN.random.stdout.split("\n").slice(0, black.length);
    expect(CHILDREN.random.status).toBe(0);
    expect([boardRegionOf("ascii", "white-bottom"), black]).toContainEqual(drawn);
    expect(boardRegionOf("ascii", "white-bottom")).not.toEqual(black);
  });
});

describe("ABC-042 — a rejected command line starts no game", () => {
  it("A5 — `--ascii --unicode` is refused at the resolver, and selectGlyphMode is not called", () => {
    const spy = vi.spyOn(glyphMode, "selectGlyphMode");
    try {
      // ARMING CONTROL FIRST: a zero call count is worthless if the spy cannot see a call at all.
      glyphMode.selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} });
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockClear();

      const resolution = resolveOptions(["--ascii", "--unicode"]);

      expect(resolution.ok).toBe(false);
      if (resolution.ok) return;
      expect(resolution.problem).toContain("--ascii");
      expect(resolution.problem).toContain("--unicode");
      expect(resolution.offending).toEqual(["--ascii", "--unicode"]);
      expect(spy).toHaveBeenCalledTimes(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("A5 — end to end: both flags named, non-zero exit, and zero frame rows on either channel", () => {
    const child = CHILDREN.conflict;

    expect(child.status).not.toBe(0);
    expect(child.stderr).toContain("--ascii");
    expect(child.stderr).toContain("--unicode");
    expect(frameRowsIn(child.stdout)).toEqual([]);
    expect(frameRowsIn(child.stderr)).toEqual([]);
  });

  it("A6(iii) — four unrecognised command lines: named, non-zero, and no frame anywhere", () => {
    const cases: readonly (readonly [name: string, child: Child, offending: string])[] = [
      ["--difficulty 3", CHILDREN.difficulty, "--difficulty"],
      ["-x", CHILDREN.shortFlag, "-x"],
      ["--colour purple", CHILDREN.badColour, "purple"],
      ["foo", CHILDREN.bareWord, "foo"],
    ];

    for (const [name, child, offending] of cases) {
      expect(child.status, `${name} exit code`).not.toBe(0);
      expect(child.union, `${name} names the offending argument`).toContain(offending);
      expect(frameRowsIn(child.stdout), `${name} frame rows on stdout`).toEqual([]);
      expect(frameRowsIn(child.stderr), `${name} frame rows on stderr`).toEqual([]);
    }
  });
});

describe("ABC-042 — the accepted set is closed", () => {
  /**
   * `## Scope`'s table, TRANSCRIBED HERE BY HAND. This is the test's own copy: comparing the
   * resolver's enumeration to itself would pass on anything, and comparing it to a derivation of
   * itself is the same tautology one step removed.
   */
  const TABLE_FLAGS = ["--ascii", "--unicode"] as const;
  const TABLE_COLOUR = "--colour";
  const TABLE_VALUES = ["white", "black", "random"] as const;
  const TABLE = [...TABLE_FLAGS, TABLE_COLOUR, ...TABLE_VALUES];

  it("A6(i) — the exported enumeration EQUALS the table, element for element, both ways", () => {
    expect([...ACCEPTED_ARGUMENTS].sort()).toEqual([...TABLE].sort());
    expect(new Set(ACCEPTED_ARGUMENTS).size).toBe(ACCEPTED_ARGUMENTS.length);
    expect(ACCEPTED_ARGUMENTS).toHaveLength(TABLE.length);
  });

  it("A6(i) — every documented spelling resolves in its legal argv position", () => {
    const accepted: readonly (readonly string[])[] = [
      [],
      ["--ascii"],
      ["--unicode"],
      ...TABLE_VALUES.map((value) => [TABLE_COLOUR, value]),
    ];

    for (const argv of accepted) {
      expect(resolveOptions(argv).ok, `argv ${JSON.stringify(argv)}`).toBe(true);
    }
  });

  it("ABC-061 A2 — the five deterministic accepted argvs are pinned by WHAT THEY RESOLVE TO", () => {
    // THE MUTANTS THIS BLOCK EXISTS TO KILL, both one word at `src/cli-options.ts:153`:
    // `flags: { ascii, unicode }` -> `flags: { ascii: false, unicode }`, and the same with
    // `unicode: false`. The first shipped 861/861 GREEN before this block existed — measured on a
    // copy of the tree outside the repository — because every automated child runs on a pipe, where
    // `--ascii` and no flag at all draw the same board, so no child can tell them apart.
    // DO NOT "SIMPLIFY" THESE OBJECT COMPARISONS BACK TO `.ok`: `.ok` is `true` under both mutants,
    // which is exactly how the accepting path came to be guarded by a boolean (the row above).
    // THE WHOLE OBJECT, NEVER FIELD BY FIELD — a field-by-field assertion is how `.ok` got here, and
    // the next field added to `ResolvedOptions` would arrive unasserted from birth. It is `.options`
    // and not the resolution: `Resolution` is a discriminated union, and comparing its top level
    // whole would fold `ok: true` into the expectation and assert something weaker than this.
    const expectations: readonly (readonly [readonly string[], ResolvedOptions])[] = [
      [
        [],
        { colour: "white", orientation: "white-bottom", flags: { ascii: false, unicode: false } },
      ],
      [
        ["--ascii"],
        { colour: "white", orientation: "white-bottom", flags: { ascii: true, unicode: false } },
      ],
      [
        ["--unicode"],
        { colour: "white", orientation: "white-bottom", flags: { ascii: false, unicode: true } },
      ],
      [
        ["--colour", "white"],
        { colour: "white", orientation: "white-bottom", flags: { ascii: false, unicode: false } },
      ],
      [
        ["--colour", "black"],
        { colour: "black", orientation: "black-bottom", flags: { ascii: false, unicode: false } },
      ],
    ];

    for (const [argv, expected] of expectations) {
      const resolution = resolveOptions(argv);
      if (!resolution.ok) throw new Error(`a documented argv was rejected: ${argv.join(" ")}`);
      expect(resolution.options, `argv ${JSON.stringify(argv)}`).toEqual(expected);
    }
  });

  it("ABC-061 A3 — `--colour random` is pinned as a PAIR, whichever side the coin lands", () => {
    // The sixth accepted argv, and the one the table above cannot hold: the coin is resolved inside
    // the resolver. The PAIRING is the assertion — `colour` and the `orientation` derived from it,
    // compared as one object — so a build that returns `black` with `white-bottom` reds here.
    // THE EXPECTATION TABLE IS THE TEST'S OWN; only WHICH ROW applies is read off the build. No
    // seeding and no 1000 iterations: the distribution is already the property owned by the `A4`
    // block that resolves this argv 1000 times with zero spawns (named, not numbered — every line
    // number the ticket page carried had drifted by the time this was written).
    const PAIRS: Readonly<Record<ResolvedOptions["colour"], ResolvedOptions>> = {
      white: {
        colour: "white",
        orientation: "white-bottom",
        flags: { ascii: false, unicode: false },
      },
      black: {
        colour: "black",
        orientation: "black-bottom",
        flags: { ascii: false, unicode: false },
      },
    };

    const resolution = resolveOptions(["--colour", "random"]);
    if (!resolution.ok) throw new Error("`--colour random` was rejected");
    const landed = resolution.options.colour;

    expect(["white", "black"], "the coin landed on a documented colour").toContain(landed);
    expect(resolution.options, `the coin landed ${landed}`).toEqual(PAIRS[landed]);
  });

  it("A6(i) — the enumeration is the ONLY argv literal in the delivered resolver", () => {
    // The two builds a resolver that quietly recognises a fifth flag can take, and both are red
    // here: enlarging the enumeration fails the equality above; writing the literal anywhere else
    // fails this row. `A6`(ii)'s random corpus is blind to both (P ~ 1.4e-9, measured).
    // THE TEMPLATE-LITERAL ALTERNATION IS LOAD-BEARING (`S3`, Security/NFR's gate): with only the
    // two quote forms scanned, a fifth flag recognised through a backtick literal is invisible here
    // — the enumeration is unchanged so the equality above passes, (ii)'s random corpus is blind
    // (P ~ 1.4e-9) and the near-miss family is derived from the table, so nothing else sees it.
    const code = executableCodeOf("cli-options.ts");
    const literals = [
      ...code.matchAll(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g),
    ].map((match) => match[0].slice(1, -1));
    // Import specifiers and `render.ts`'s own orientation vocabulary: space-free literals that are
    // NOT argv spellings, transcribed here so a new one cannot arrive unnoticed.
    const NOT_ARGV = ["./glyph-mode.ts", "./render.ts", "white-bottom", "black-bottom"];

    expect(literals.length).toBeGreaterThan(0);
    for (const literal of literals) {
      // Every dash-led token in every literal — the shape a command-line argument has.
      for (const token of literal.match(/(?<![\w-])--?[A-Za-z][A-Za-z0-9-]*/g) ?? []) {
        expect(ACCEPTED_ARGUMENTS, `argv literal ${token}`).toContain(token);
      }
      // Every space-free literal: a bare extra value word (`purple`) has no dash to catch it.
      if (!/\s/.test(literal)) {
        expect([...ACCEPTED_ARGUMENTS, ...NOT_ARGV], `bare literal ${literal}`).toContain(literal);
      }
    }
  });

  it("A6(i) — the near-miss family, COMPLETE OVER POSITION, is rejected in its legal position", () => {
    // Derived FROM THE TABLE so they cannot go stale. The family the criterion now names: the
    // upper-case form, plus one character from `{"x", " "}` INSERTED at every index or DELETED at
    // every index. The three derivations this replaced — upper-case, `+"x"`, one-character
    // truncation — all touched the END of the spelling or the whole of it, so `token.endsWith(...)`
    // and `token.trim() === ...` shipped 856/856 green: the set had not missed a transformation, it
    // had missed the FRONT HALF OF THE STRING. Walking every index cannot have that hole again — a
    // weakening invisible to this family must accept only tokens at edit distance >= 2. The old 18
    // are a strict subset, so nothing already armed is traded away.
    const nearMisses = (spelling: string): readonly string[] => {
      const family = [spelling.toUpperCase()];
      for (let index = 0; index <= spelling.length; index++) {
        // A space is the only member a `trim()` weakening cannot survive; `x` is a printable
        // non-space that keeps the old `+"x"` case inside the family.
        for (const character of ["x", " "]) {
          family.push(spelling.slice(0, index) + character + spelling.slice(index));
        }
      }
      for (let index = 0; index < spelling.length; index++) {
        family.push(spelling.slice(0, index) + spelling.slice(index + 1));
      }
      return family;
    };
    const derived: string[] = [];
    const cases: (readonly string[])[] = [];

    for (const flag of TABLE_FLAGS) {
      for (const miss of nearMisses(flag)) {
        derived.push(miss);
        cases.push([miss]);
      }
    }
    // `--colour`'s LEGAL ARGV POSITION IS TWO TOKENS, and the criterion says "in its legal argv
    // position". Asserted in the ONE-token form, every `--colour` near miss rejects for the WRONG
    // reason — the value word is missing — and that is green on a resolver whose membership test
    // has been weakened. `token.startsWith(COLOUR)` and `token.toLowerCase() === COLOUR` both
    // ACCEPT `--colourx white` / `--COLOUR white`, print a 23-row board and exit 0; both were
    // green against the one-token form. `--ascii` and `--unicode` need no such change: the
    // one-token form IS their legal position, and the same weakening on them is already caught.
    for (const miss of nearMisses(TABLE_COLOUR)) {
      derived.push(miss);
      cases.push([miss, TABLE_VALUES[0]]);
    }
    for (const value of TABLE_VALUES) {
      for (const miss of nearMisses(value)) {
        derived.push(miss);
        cases.push([TABLE_COLOUR, miss]);
      }
    }

    // THE ROW PINS THE DERIVED COUNT, and it pins BOTH numbers because they differ and the
    // difference is a trap: 138 CASES over 134 DISTINCT strings. The four duplicates are deletions
    // at a repeated character — either `-` of `--` gives `-ascii` / `-unicode` / `-colour`, either
    // `i` of `ascii` gives `--asci`. 138 is the count of cases actually resolved (`3n+3` per
    // spelling, n = 7+9+8+5+5+6); 134 is what a uniqueness assertion may say. Asserting uniqueness
    // against 138 reds a CORRECT build, which is why both are written down here rather than left
    // for the next reader to re-derive.
    expect(derived).toHaveLength(138);
    expect(new Set(derived).size).toBe(134);
    // It cannot false-RED a legal build: none of the 138 is an accepted spelling.
    expect(
      derived.filter((miss) => (ACCEPTED_ARGUMENTS as readonly string[]).includes(miss)),
    ).toEqual([]);
    for (const argv of cases) {
      expect(resolveOptions(argv).ok, `argv ${JSON.stringify(argv)}`).toBe(false);
    }
  });

  it("A6(i) — an undocumented fifth flag is rejected and named", () => {
    const resolution = resolveOptions(["--debug"]);

    expect(resolution.ok).toBe(false);
    if (resolution.ok) return;
    expect(resolution.offending).toContain("--debug");
  });

  it("A6(ii) — 1000 generated tokens, 250 per shape, every one rejected and named", () => {
    const PRINTABLE = Array.from({ length: 0x7f - 0x20 }, (_, index) =>
      String.fromCodePoint(0x20 + index),
    );
    const word = (length: number): string =>
      Array.from(
        { length },
        () => PRINTABLE[Math.floor(Math.random() * PRINTABLE.length)] as string,
      ).join("");
    const between = (low: number, high: number): number =>
      low + Math.floor(Math.random() * (high - low + 1));

    // The four shapes. Each returns one argv plus the token its rejection must name.
    const SHAPES: Readonly<Record<string, () => readonly [readonly string[], string]>> = {
      "--<word>": () => {
        const token = `--${word(between(1, 22))}`;
        return [[token], token];
      },
      "-<char>": () => {
        const token = `-${word(1)}`;
        return [[token], token];
      },
      "<word>": () => {
        const token = word(between(1, 24));
        return [[token], token];
      },
      "--colour <word>": () => {
        const token = word(between(1, 24));
        return [["--colour", token], token];
      },
    };

    // FILTERED BY WHOLE ACCEPTED FORM ONLY — never because an argv CONTAINS an accepted token,
    // which is the reading that would empty the `--colour <word>` shape and with it the build that
    // shape exists to catch.
    const isAcceptedForm = (argv: readonly string[]): boolean => {
      const whole = JSON.stringify(argv);
      return (
        whole === JSON.stringify([]) ||
        whole === JSON.stringify(["--ascii"]) ||
        whole === JSON.stringify(["--unicode"]) ||
        TABLE_VALUES.some((value) => whole === JSON.stringify(["--colour", value]))
      );
    };

    // THE DRAW BUDGET. `while (drawn.length < 250)` cannot exit until it has 250, so counting
    // SURVIVORS afterwards can never fail for any filter: the over-dropping CONTAINS reading this
    // row forbids empties the `--colour <word>` shape and the run HANGS to the 180 s timeout rather
    // than reding. Bounding the loop by DRAWS is what turns that hang into a failed assertion. 500
    // is measured, not chosen: the correct whole-form filter needs exactly 250 draws for 250 items
    // (drawing `--ascii` or `white` at random is ~1e-10), so this is 2x headroom and cannot flake.
    const DRAW_BUDGET = 500;
    const corpus = new Map<string, (readonly [readonly string[], string])[]>();
    const drawsPerShape = new Map<string, number>();
    for (const [shape, generate] of Object.entries(SHAPES)) {
      const drawn: (readonly [readonly string[], string])[] = [];
      let draws = 0;
      while (drawn.length < 250 && draws < DRAW_BUDGET) {
        draws++;
        const candidate = generate();
        if (!isAcceptedForm(candidate[0])) drawn.push(candidate);
      }
      corpus.set(shape, drawn);
      drawsPerShape.set(shape, draws);
    }

    // ASSERTED FIRST: the DRAWS. Reaching the budget is exactly "this filter dropped more than it
    // kept", and it is the only reading of the corpus that an over-dropping filter can fail.
    for (const [shape, draws] of drawsPerShape) {
      expect(draws, `draws for shape ${shape}`).toBeLessThan(DRAW_BUDGET);
    }
    // And only then the survivors, which the bounded loop has now made falsifiable.
    for (const [shape, drawn] of corpus) expect(drawn, `shape ${shape}`).toHaveLength(250);
    expect([...corpus.values()].flat()).toHaveLength(1000);

    const accepted: string[] = [];
    const unnamed: string[] = [];
    for (const [argv, offending] of [...corpus.values()].flat()) {
      const resolution = resolveOptions(argv);
      if (resolution.ok) accepted.push(JSON.stringify(argv));
      else if (!resolution.offending.includes(offending)) unnamed.push(JSON.stringify(argv));
    }

    expect(accepted).toEqual([]);
    expect(unnamed).toEqual([]);
  });
});

describe("ABC-042 — the shape of what was delivered", () => {
  it("A2 — the entry point exports nothing", () => {
    // `export` is the letter; "nothing can import a binding from it" is the purpose. A module that
    // hangs a binding on `globalThis` publishes it without the keyword, and was green against the
    // keyword alone — so the purpose gets its own row rather than trusting the letter to carry it.
    expect(executableCodeOf("cli.ts")).not.toMatch(/\bexport\b/);
    expect(executableCodeOf("cli.ts")).not.toContain("globalThis");
  });

  it("A3 — the entry point is flat in src/, where the licence guard can see it", () => {
    // The wrong build — `src/cli/main.ts` — is invisible to `productionModulesIn`'s flat read AND
    // to the `"./history.ts"` specifier, so it goes GREEN by not being looked at. This row and
    // `ADR-0011` clause 1's trigger check are the same assertion from two directions.
    expect(productionModules()).toContain("cli.ts");
    expect(productionModules()).toContain("cli-options.ts");
    // NO TOTAL IS ASSERTED HERE, and that is `ABC-103`'s whole change. A hand-maintained count of
    // what sits flat in src/ went red for every correct addition of an unrelated module — measured
    // four times (20 at ABC-042, then ABC-031, ABC-076 and ABC-077 each bumped it by hand) — while
    // adding NOTHING to this row's subject. The wrong build this row exists to catch,
    // `src/cli/main.ts`, moves a name OUT of the flat listing and INTO the nested one: the two
    // `toContain` rows above and the `nested` equality below both go red on it, and neither can be
    // satisfied by editing an integer.
    const nested = (readdirSync(SOURCE_DIRECTORY, { recursive: true }) as string[]).filter(
      (entry) => entry.includes("/") && entry.endsWith(".ts"),
    );
    expect(nested).toEqual([]);
    // ADDED by QE at `quality-gate-ABC-103-qe-2026-08-18`, and it is NOT a restatement of the
    // count `ABC-103` deleted: it names no module, no total and no list, so no correct addition
    // under `src/` can ever red it. `toContain` reads a DIRECTORY ENTRY'S NAME, and a name is not
    // a file. MEASURED at that hop: with `src/cli.ts` replaced by a symlink to a `lib/cli-entry.ts`
    // outside `src/`, ALL 42 rows in this file stayed GREEN — this row included — and the whole
    // repository's only red was `history-pane.nfr.test.ts`'s licence equality, in another file, on
    // another property, and only because `cli.ts` happens to sit in `LICENSED_DRIVERS`. That build
    // defeats this row's stated purpose precisely: the licence guard's depth-fixed `"./history.ts"`
    // specifier stops matching the real module's `"../src/history.ts"` — `ADR-0011` `R3` cause 2,
    // reached through a LINK rather than through a subdirectory, which `R3`'s trigger does not
    // name. The DELETED count was green on that build too, so this hole is older than `ABC-103`
    // and is not its doing. Residual, stated rather than left to be discovered: `cli-options.ts`
    // is asserted by NAME only and the same link would still launder it.
    expect(lstatSync(ENTRY_POINT).isFile()).toBe(true);
  });

  it("A9 — process.stdout is acquired once, in the entry point, and only as the FrameSink", () => {
    const entry = executableCodeOf("cli.ts");

    // SCOPE IS THE NEW PRODUCTION MODULES, RULED — `ADR-0011` clause 1's expression, minus what was
    // merged before this ticket. A whole-tree reading reds on `src/frame.ts`, whose docblock names
    // the handle in order to say it never reaches for it, and on `glyph-mode.ts`, which legitimately
    // reads `isTTY` and is the one merged exception the ticket names. Neither is this ticket's.
    // STILL ACQUIRED ONCE, and `ABC-043` is where that stopped being free: the session needs the
    // handle TWICE — as the loop's `FrameSink` and as the prompt's `PromptOutput` — so the entry
    // point reads it into `sink` and passes that. A build naming `process.stdout` at both options
    // acquires it twice and reds here, which is the property `A9` is about.
    expect(entry.match(/process\.stdout/g)).toHaveLength(1);
    expect(entry).toMatch(/const sink = process\.stdout;/);
    expect(entry).toMatch(/output:\s*sink/);
    expect(entry).toMatch(/\bsink,/);
    expect(sourceOf("cli-options.ts")).not.toContain("process.stdout");
    // And the new modules are the two named ones: a third would put this row out of date silently.
    expect(productionModules().filter((module) => module.startsWith("cli"))).toEqual([
      "cli-options.ts",
      "cli.ts",
    ]);
  });

  it("A9 — process.argv occurs EXACTLY once and only as the resolver's argument", () => {
    const entry = executableCodeOf("cli.ts");

    expect(entry.match(/process\.argv/g)).toHaveLength(1);
    expect(entry).toMatch(/resolveOptions\(process\.argv\.slice\(2\)\)/);
    // The resolver is the exclusive validator: nothing branches on the argument vector after it
    // returns, so there is no second, unvalidated input path (ASVS V2.2.2).
    expect(entry.match(/\bresolveOptions\s*\(/g)).toHaveLength(1);
    // THE WHOLE PROCESS SURFACE, TRANSCRIBED — the instrument shape `A8` uses for numbers, and for
    // the same reason: a COUNT of `process.argv` cannot see a SECOND read spelled `process["argv"]`.
    // That build reads the argument vector twice and branches on it after the resolver returned —
    // exactly the unvalidated second path V2.2.2 forbids — and it was green against the count above.
    // The resolver already gets this stronger form (`not.toContain("process")` on its whole source);
    // this is that form's other half, on the one module that legitimately names the handles.
    // A SORTED LIST WITH ITS REPEATS, not a set, and `ABC-043` is why that matters: the product now
    // writes `process.exitCode` THREE times and those three ARE the exit-code rule — the refused
    // command line, the loop's outcome carried verbatim, and the crash. A FOURTH assignment is a
    // fourth rule and has to be seen; a set would hide it. `process.stderr` twice for the same
    // reason: the two things this product writes there are a usage error and an internal error.
    expect((entry.match(/process\.\w+/g) ?? []).sort()).toEqual([
      "process.argv",
      "process.exitCode",
      "process.exitCode",
      "process.exitCode",
      "process.stderr",
      "process.stderr",
      "process.stdin",
      "process.stdout",
    ]);
    expect(entry, "argv reached by bracket access").not.toMatch(/process\s*\[/);
    // AND THE IDENTIFIER ITSELF IS COUNTED, not only its property accesses. Both rows above
    // enumerate SPELLINGS, and a spelling list is never longer than the last census that wrote it:
    // an alias (`const ambient = process`), an ESM import (`import { argv } from "node:process"`)
    // and an optional chain (`process?.argv`) each add a second, unvalidated read that BOTH rows
    // above let through, and all three shipped 856/856 green. `process` occurs exactly EIGHT times
    // in this module and the row above says which eight — together they CLOSE the set instead of
    // listing it, which is the same move `A6`(i) makes on the accepted arguments. It was FOUR until
    // `ABC-043` wired the session: `process.stdin` is the reader's source, and the crash path adds
    // the second `process.stderr` and the third `process.exitCode`.
    expect(entry.match(/\bprocess\b/g)).toHaveLength(8);
    // `globalThis` is asserted here as well as on `A2`'s row, for a different reason: there it is
    // about publishing a binding, here about acquiring an ambient one. `globalThis["process"].argv`
    // — `X8`'s own spelling in the `ABC-041` re-gate — is caught today ONLY by `A2`'s row, so `A9`
    // would lose it silently the day `A2` is reworded.
    expect(entry).not.toContain("globalThis");
  });

  it("A9 — the resolver names no ambient handle at all, comments included", () => {
    // Over the WHOLE source, the way `src/render-seam.test.ts` asserts the same absence: an
    // ambient read reached through `globalThis[\"process\"]` shipped green against the narrow form.
    const source = sourceOf("cli-options.ts");

    expect(source).not.toContain("process.");
    expect(source).not.toContain("process");
    expect(source).not.toContain("globalThis");
    expect(source).not.toContain("import.meta");
  });

  it("A8 — neither delivered module names a row count", () => {
    // The instrument is a TRANSCRIPTION, not a denylist of the row counts: every numeric literal in
    // the two modules is listed here with what it is, so a new number cannot arrive unexplained and
    // none of the listed ones is a count of rows.
    const numbersIn = (file: string): readonly string[] => {
      const code = executableCodeOf(file)
        .replace(/"(?:[^"\\]|\\.)*"/g, '""')
        .replace(/'(?:[^'\\]|\\.)*'/g, "''")
        .replace(/`(?:[^`\\$]|\\.|\$(?!\{))*`/g, "``");
      return [...new Set(code.match(/0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?/g) ?? [])].sort();
    };

    // `2` skips the two argv entries node supplies; `1` is the usage exit code; `0`, `0x20` and
    // `0x7f` are the byte filter's C0/DEL bounds; `70` is `sysexits.h`'s `EX_SOFTWARE`, `ABC-043`'s
    // internal-error exit — and NONE of the six is a count of rows, which is what this row decides.
    expect(numbersIn("cli.ts")).toEqual(["0", "0x20", "0x7f", "1", "2", "70"]);
    // `0` starts the scan, `1` steps over `--colour`'s value, `0.5` is a fair coin.
    expect(numbersIn("cli-options.ts")).toEqual(["0", "0.5", "1"]);
  });

  it("A10 — package.json gains exactly one scripts key and nothing else", () => {
    // Asserted KEY BY KEY against the merged file, transcribed here rather than read off the diff:
    // a diff read cannot see a key that was added and removed, and this can.
    const packaged = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as Record<
      string,
      unknown
    >;
    const AT_HEAD = [
      "name",
      "version",
      "private",
      "type",
      "description",
      "engines",
      "scripts",
      "devDependencies",
    ];
    const SCRIPTS_AT_HEAD = {
      typecheck: "tsc --noEmit",
      test: "vitest run",
      "test:watch": "vitest",
      lint: "biome check .",
      "lint:fix": "biome check --write .",
      format: "biome format --write",
      build: "tsc --noEmit",
      perft: "node src/perft-bench.ts",
      "spike:perft": "node spike/perft-bench.ts",
    };

    expect(Object.keys(packaged).sort()).toEqual([...AT_HEAD].sort());
    for (const reserved of ["bin", "main", "files", "publishConfig", "dependencies"]) {
      expect(packaged, `package.json gained ${reserved}`).not.toHaveProperty(reserved);
    }
    expect(packaged.private).toBe(true);

    const scripts = packaged.scripts as Record<string, string>;
    for (const [name, command] of Object.entries(SCRIPTS_AT_HEAD)) {
      expect(scripts[name], `scripts.${name}`).toBe(command);
    }
    const added = Object.keys(scripts).filter((name) => !(name in SCRIPTS_AT_HEAD));
    expect(added).toEqual(["chess"]);
  });

  it("A12 — the licence gained exactly the entry point, and the guard still equals", () => {
    // The merged equality at `src/history-pane.nfr.test.ts:329` is what actually holds this; this
    // row asserts the BOUND `A12` puts on the edit — one element, and the array is still a
    // two-name list rather than a widened one.
    const probe = sourceOf("history-pane.nfr.test.ts");
    const declared = probe.match(/const LICENSED_DRIVERS: readonly string\[\] = \[([^\]]*)\]/);
    if (declared === null) throw new Error("no LICENSED_DRIVERS list in the probe");

    const entries = (declared[1] as string)
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry !== "");
    expect(entries.sort()).toEqual(['"cli.ts"', '"turn-loop.ts"']);
  });

  it("bar 1 — the production modules treat arguments as data, never as code", () => {
    for (const module of ["cli.ts", "cli-options.ts"]) {
      const source = sourceOf(module);
      for (const forbidden of ["eval", "Function(", "child_process", "import("]) {
        expect(source, `${module} contains ${forbidden}`).not.toContain(forbidden);
      }
      // Bar 4 — no filesystem and no network, as a GRAMMAR over specifiers plus the three globals
      // that need no import at all.
      const specifiers = [...source.matchAll(/from\s+"([^"]+)"|import\("([^"]+)"\)/g)].map(
        (match) => (match[1] ?? match[2]) as string,
      );
      for (const specifier of specifiers) {
        expect(specifier, `${module} imports ${specifier}`).not.toMatch(
          /^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/,
        );
      }
      for (const global of ["fetch", "WebSocket", "XMLHttpRequest"]) {
        expect(source, `${module} reaches ${global}`).not.toContain(global);
      }
    }
  });

  it("bar 3 — an argument carrying an escape sequence is echoed, stripped of its control bytes", () => {
    const child = CHILDREN.escape;
    // THE TOKEN IS LOCATED, NOT ASSUMED TO SIT ON LINE 0 (`S2`, Security/NFR's gate).
    // `union.split("\n")[0]` is a POSITIONAL proxy: it is a superset of the echoed token only while
    // the echo happens to land on the first line, and a build with the sanitiser removed AND the
    // token moved down two lines emitted a literal `ESC [ 2 J` to the terminal while shipping
    // green. Splitting on WHITESPACE follows the token wherever the message puts it, and every
    // occurrence is taken, not the first: `ESC` is not whitespace, so an unstripped one stays
    // attached to the word it precedes and lands inside what is asserted over.
    const located = child.union.split(/\s+/).filter((word) => word.includes("[2Jpurple"));
    const echoed = located.join(" ");

    // (i) NON-VACUITY FIRST: a build whose message never echoes the argument would satisfy every
    // absence below by saying nothing at all.
    expect(child.union).toContain("[2Jpurple");
    expect(located.length, "the echoed token is on neither channel").toBeGreaterThan(0);
    // (ii) The echoed TOKEN — every occurrence of it, joined by the one character that cannot
    // affect the verdict — carries no C0, no U+007F and no escape. The newline that terminates the
    // message is excluded by construction, which is why the assertion is scoped to the token.
    expect(codePointsOf(echoed).filter((code) => code < 0x20 || code === 0x7f)).toEqual([]);
    expect(echoed).not.toContain("\u001b");
    // (iii) And no frame, on either channel.
    expect(frameRowsIn(child.stdout)).toEqual([]);
    expect(frameRowsIn(child.stderr)).toEqual([]);
    expect(child.status).not.toBe(0);
  });

  it("N8-LANE — this file spawns SEVENTEEN children and no more", () => {
    // The budget, pinned mechanically. Every child is spawned once at module scope; a later hop
    // that adds one has to change this number and say why.
    //
    // TEN UNTIL `ABC-043`, and the reason it moved is on that ticket rather than in this comment:
    // `## Security / NFR triggers`' `N8-SPAWN` row derives SEVEN more, criterion by criterion
    // (`A2` 1, `A3` 1, `A4` 1, `A5` 2, `A7` 2; `A1`, `A6` and `A8` add none), and the pin moves with
    // that derivation as its reason. SEVENTEEN IS A CEILING, NOT A TARGET: a child no criterion
    // names is a finding against the ticket, never a charge on the account. Measured at that hop:
    // 64-72 ms of wall each, ~0.46 s for the seven. `N8-LANE`'s 650 ms bar is NOT claimed met here —
    // `ABC-108`'s `OQ-1` has the lane's own total under open question, and until Architect/Design
    // rules it no ticket may honestly be measured against that number.
    expect(spawned).toBe(17);
    expect(Object.keys(CHILDREN)).toHaveLength(17);
    // THE PIN ABOVE IS SELF-REFERENTIAL: `spawned` counts only children made through `childOf`, so
    // a direct `spawnSync` adds an eleventh child the counter never sees, and that build was green.
    // `N8-LANE` is breached and escalated, which makes this the instrument the owner's decision
    // rests on — so the count is closed at its source rather than at the wrapper: `spawnSync` is
    // the ONLY name this file takes from `node:child_process`, and it has exactly one call site.
    const self = sourceOf("cli.test.ts");
    const imported = [...self.matchAll(/import\s*\{([^}]*)\}\s*from\s*"node:child_process"/g)].map(
      (match) => (match[1] as string).trim(),
    );
    expect(imported).toEqual(["spawnSync"]);
    expect(self.match(/\bspawnSync\s*\(/g)).toHaveLength(1);
  });
});

describe("ABC-066 — the usage line is a command the user can actually run", () => {
  it("A1/A2/A3 — every refusal advertises the separator, and all it advertises resolves", () => {
    // THE REFUSAL CHILDREN, DERIVED FROM THE CAPTURE, NOT LISTED: every child that exited non-zero.
    // Zero new spawns — `spawned` stays at what this file's `N8-LANE` row pins — and a listed set
    // would go stale the day a further criterion refuses a command line this row cannot see.
    //
    // `ABC-043` GAVE THE PRODUCT A SECOND NON-ZERO EXIT and the derivation had to narrow with it: a
    // crashed SESSION also exits non-zero, and it is refused nothing — its command line was accepted
    // and its game started. The discriminator is the product's own, not a code transcribed here: a
    // refusal is a non-zero exit that is NOT marked an internal error. Narrowing by the usage line
    // instead would have made `A1` circular, since `A1` is what asserts that line exists.
    const refused = Object.values(CHILDREN).filter(
      (child) => child.status !== 0 && !/internal error/i.test(child.union),
    );
    expect(refused, "the captured refusal children").toHaveLength(6);

    // `A1` — the separator reaches the user, on all six, on the channel he reads it on.
    const usageLines = refused.map((child) => usageLineOf(child.stderr));
    for (const line of usageLines) expect(line).toContain(SEPARATOR_FORM);
    // One constant, so one line: reading the first below is reading all six.
    expect(new Set(usageLines).size).toBe(1);

    // `A2` — what it advertises is what the resolver accepts.
    // Precondition met by `toContain` above: `advertisedTextOf` needs `includes(SEPARATOR_FORM)`.
    const advertised = advertisedTextOf(usageLines[0] as string);
    // Nothing outside a bracketed group: a line that later advertised a MANDATORY argument would
    // otherwise be expanded as if it had not, and the unread half would never be run.
    expect(advertised.replace(/\[[^\]]*\]/g, "").trim(), "text outside every group").toBe("");
    const invocations = invocationsAdvertisedBy(advertised);

    expect(invocations.length).toBeGreaterThanOrEqual(6);
    // The no-arguments form is advertised — every group is optional — and it is run like the rest.
    expect(invocations).toContainEqual([]);
    for (const argv of invocations) {
      expect(resolveOptions(argv).ok, `advertised argv ${JSON.stringify(argv)}`).toBe(true);
    }

    // `A3` — the vocabulary does not move: the tokens the line advertises are the accepted set,
    // 6 of 6, both ways, read off `ACCEPTED_ARGUMENTS` at run time rather than spelled again here.
    // It is also what makes the six named forms present without transcribing one of them: each
    // accepted token appears in some advertised invocation, and every one of those resolved above.
    expect([...new Set(invocations.flat())].sort()).toEqual([...ACCEPTED_ARGUMENTS].sort());
  });
});

describe("ABC-065 — AGENTS.md's `Dev / run` slot is reachable and its option list is the accepted set", () => {
  /** The closing delimiter of the slot's HTML comment. Written once; never as an offset. */
  const COMMENT_CLOSE = "-->";
  /** The slot's label. Written once — the locator, the count and the mutants all read it here. */
  const SLOT_LABEL = "- Dev / run:";

  /**
   * The slot, LOCATED MECHANICALLY (`## Test notes` 1): the `- Dev / run:` list item through the end
   * of its HTML comment. Line numbers move — `ABC-042`'s own `AGENTS.md` row moved 56 lines when
   * `ABC-066` landed — so nothing here is tied to a position in either file. This is `ABC-059`'s
   * blindness (a guard pinned to one rendering) declined one file over.
   *
   * PURE, AND OVER A STRING (`ABC-067` `## Test notes` 1). The read is the one-line caller below, so
   * every mutant this block drives is an IN-MEMORY fixture: nothing here writes `AGENTS.md`, and no
   * failure can leave the working tree dirty.
   */
  const devRunSlotIn = (agents: string): string => {
    // `ABC-071` — THE START ANCHOR, AND THE UNIQUENESS DECISION THAT TICKET REQUIRED, MADE HERE:
    // the label must occur EXACTLY ONCE. `indexOf` takes the FIRST match, so without this the same
    // duplicate slot passed when appended after the good one and failed when placed before it —
    // one file, two verdicts, decided by ordering. Expressed as a count so the failure names it.
    // This is a NEW obligation on `ABC-071`'s page: `ABC-065`'s `A1` says "the slot", singular, and
    // never required uniqueness. `AGENTS.md` has one `### Development` section and one such slot.
    expect(agents.split(SLOT_LABEL).length - 1, "`- Dev / run:` slots in AGENTS.md").toBe(1);

    const start = agents.indexOf(SLOT_LABEL);
    const end = agents.indexOf(COMMENT_CLOSE, start);
    // `ABC-067` — THE UPPER BOUND. `indexOf(COMMENT_CLOSE, start)` finds the first closer ANYWHERE
    // later in the file, so deleting this slot's own closer did not fail to look: it looked at more,
    // silently, and shipped green. The window must close before the next top-level list item begins.
    const nextItem = agents.indexOf("\n- ", start + SLOT_LABEL.length);
    // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK, AND NEVER BY LOOKING TOO FAR. Both failures
    // are LOUD and both are exercised below: an absent or duplicated label reds on the count above,
    // and a slot whose comment does not close before the next list item throws here. The protection
    // claimed is the protection delivered — the earlier wording claimed a never-closes branch that
    // `end < 0` could not reach, since `AGENTS.md` carries 13 further closers after this slot's own.
    if (end < 0 || (nextItem >= 0 && nextItem < end))
      throw new Error(
        "AGENTS.md's `- Dev / run:` slot comment does not close before the next list item",
      );
    return agents.slice(start, end + COMMENT_CLOSE.length);
  };

  /** The reader. One line, and the only place this block touches the disk. */
  const devRunSlot = (): string => devRunSlotIn(readFileSync(`${REPOSITORY}AGENTS.md`, "utf8"));

  it("A1 — the slot shows the separator, and the invocation it shows RESOLVES", () => {
    const slot = devRunSlot();

    // THIS ASSERTION COMES FIRST, AND IT IS THE WHOLE REASON THIS ROW IS NOT VACUOUS (`ABC-066`'s
    // QE hop, `Q2`). `advertisedTextOf` is `slice(indexOf(SEPARATOR_FORM) + SEPARATOR_FORM.length)`,
    // and `indexOf` returns `-1` when the separator is ABSENT — so on the unrepaired slot it
    // returns a corrupted stem SILENTLY instead of throwing, and every downstream reading of it is
    // garbage that still parses. Its sibling `usageLineOf` throws on bad input; this one does not.
    // Without this line the row would go green on exactly the defect `ABC-065` exists to catch.
    expect(slot, "the separator form in the `Dev / run` slot").toContain(SEPARATOR_FORM);

    // The documented invocation sits inside a markdown code fence and `ABC-066`'s stderr line does
    // not, so the fence comes off before the text is read as argv. Copying `ABC-066`'s row verbatim
    // would false-RED a correct slot on the trailing backtick.
    // Precondition met by the assertion above: `advertisedTextOf` needs `includes(SEPARATOR_FORM)`.
    const fenced = advertisedTextOf(slot).split("`")[0] as string;
    const argv = fenced.split(/\s+/).filter((token) => token !== "");

    // The count floor, and it is load-bearing: `resolveOptions([])` is `ok: true`, so "what it
    // advertises resolves" is on its own satisfiable by advertising nothing at all.
    expect(
      argv.length,
      `the invocation after the separator: ${JSON.stringify(argv)}`,
    ).toBeGreaterThanOrEqual(1);
    // `A1`'s own words: `<option>` is an element of `ACCEPTED_ARGUMENTS`. Read at run time (`A5`).
    for (const token of argv) {
      expect(ACCEPTED_ARGUMENTS, `documented token ${token}`).toContain(token);
    }
    expect(resolveOptions(argv).ok, `documented argv ${JSON.stringify(argv)}`).toBe(true);
  });

  it("A3 — the documented option list EQUALS the accepted set, both ways, and names every value", () => {
    const slot = devRunSlot();

    // RULED BY THE ORCHESTRATOR AT THIS HOP: the BARE `--` separator is NOT an option token. `A1`
    // requires the separator in this slot and `A3` then counts it as a FOURTH `--`-prefixed token
    // against its required three — on a literal reading the two criteria contradict. Removing the
    // separator to satisfy `A3` is FORBIDDEN: it destroys the ticket's purpose. So the bare form is
    // excluded by EXACT EQUALITY and by nothing looser — a pattern loose enough to drop `--` could
    // also swallow a real option, which is the failure that would make this row silently weaker.
    // The same exact match also drops the HTML comment's own `<!--` and `-->` delimiters.
    const documented = new Set(
      (slot.match(/(?<![\w-])--[A-Za-z0-9-]*/g) ?? []).filter((token) => token !== "--"),
    );

    // Both sides are derived from `ACCEPTED_ARGUMENTS` at run time (`A5`): no accepted argument is
    // spelled a second time anywhere in this block.
    const acceptedOptions = ACCEPTED_ARGUMENTS.filter((argument) => argument.startsWith("--"));
    const acceptedValues = ACCEPTED_ARGUMENTS.filter((argument) => !argument.startsWith("--"));

    // The floor before the equality: an empty documented set passes a one-way containment check.
    expect(
      documented.size,
      `documented options ${JSON.stringify([...documented])}`,
    ).toBeGreaterThanOrEqual(acceptedOptions.length);
    // BOTH WAYS — a documented option that does not exist and an accepted option nobody documented
    // are the two directions `A4` names, and set equality is red in each.
    expect([...documented].sort()).toEqual([...acceptedOptions].sort());
    // `A3`'s last clause: each value word appears in the slot. Derived, never transcribed.
    for (const value of acceptedValues) {
      expect(slot, `documented value ${value}`).toContain(value);
    }
  });

  /** What the locator did with a fixture, as a string: the failure's REASON, or that there was none. */
  const reasonOf = (agents: string): string => {
    try {
      devRunSlotIn(agents);
      return "NO FAILURE — the guard accepted this file";
    } catch (error) {
      return (error as Error).message;
    }
  };

  it("ABC-071 A1/A2/A3 — the slot label occurs EXACTLY once, and a duplicate reds on the COUNT wherever it sits", () => {
    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");

    // `A3` — the file as delivered is unaffected: one slot, and the locator accepts it.
    expect(agents.split(SLOT_LABEL).length - 1, "`- Dev / run:` slots in AGENTS.md").toBe(1);
    expect(reasonOf(agents)).toBe("NO FAILURE — the guard accepted this file");

    // QE's `N3a`/`N3b`, in memory: the SAME broken duplicate — no separator, no options — appended
    // AFTER the good slot and placed BEFORE it. Green and red respectively before this ticket.
    const duplicate = `${SLOT_LABEL} \`npm run chess\``;
    const slotEnd =
      agents.indexOf(COMMENT_CLOSE, agents.indexOf(SLOT_LABEL)) + COMMENT_CLOSE.length;
    const after = `${agents.slice(0, slotEnd)}\n${duplicate}${agents.slice(slotEnd)}`;
    const before = `${duplicate}\n\n${agents}`;

    // `A1` — the appended duplicate no longer ships green, and `A2` — the asymmetry is gone: ONE
    // stated reason for both, and it names the COUNT of slots rather than a missing option.
    const reasons = [reasonOf(after), reasonOf(before)];
    expect(new Set(reasons).size, `reasons ${JSON.stringify(reasons)}`).toBe(1);
    expect(reasons[0], "the reason both duplicate mutants give").toContain(
      "`- Dev / run:` slots in AGENTS.md",
    );

    // The other end of the same count, and it is why there is no separate `start < 0` branch to go
    // dead: a RENAMED slot is zero slots, and it reds here on the same assertion.
    expect(reasonOf(agents.replace(SLOT_LABEL, "- Dev / start:"))).toContain(
      "`- Dev / run:` slots in AGENTS.md",
    );
  });

  it("ABC-067 A1/A2/A4 — the window stops inside the slot's OWN comment, and an unterminated slot is LOUD", () => {
    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
    const start = agents.indexOf(SLOT_LABEL);
    const closer = agents.indexOf(COMMENT_CLOSE, start);

    // `A2`, on the unmutated file: the captured region reaches no further top-level list item.
    expect(
      (devRunSlotIn(agents).match(/\n- /g) ?? []).length,
      "further list items inside the captured slot",
    ).toBe(0);

    // `A1` / QE's `N4` — this slot's OWN closer removed, the rest of the file untouched.
    const unterminated = agents.slice(0, closer) + agents.slice(closer + COMMENT_CLOSE.length);
    // `A2`'s second half, and the whole defect in one number: the UNBOUNDED window — first closer
    // anywhere later in the file — swallows text below the slot instead of failing to look.
    const swallowed = unterminated.slice(
      start,
      unterminated.indexOf(COMMENT_CLOSE, start) + COMMENT_CLOSE.length,
    );
    expect(
      (swallowed.match(/\n- /g) ?? []).length,
      "further list items the UNBOUNDED window swallowed",
    ).toBeGreaterThanOrEqual(1);
    expect(reasonOf(unterminated), "the unterminated slot").toContain("does not close");

    // `A4` — the second-order mutant, and it is the point: with this slot's closer AND the next one
    // removed, the window used to reach the `Coverage` bullet and red on `--coverage` — the right
    // verdict for the WRONG reason. It now reds for the SAME reason as the one-closer case.
    const nextCloser = unterminated.indexOf(COMMENT_CLOSE, start);
    const twoRemoved =
      unterminated.slice(0, nextCloser) + unterminated.slice(nextCloser + COMMENT_CLOSE.length);
    expect(reasonOf(twoRemoved), "the two-closer mutant").toBe(reasonOf(unterminated));
  });
});

describe("ABC-062 — the two command lines that reach the refusal path untested", () => {
  it("A1/A2/A7 — `--colour` alone and a bare `white` are each refused, naming their own token and their own reason", () => {
    // A NEW BLOCK OF ITS OWN, deliberately: the near-miss family at `:554` is COMPLETE OVER POSITION
    // and derived from the table, so hand-picking two members into it would change what a merged
    // criterion means. Nothing here reads a `CHILDREN` entry — two pure resolver calls, no child
    // process, `spawned` still 10 (`N8-LANE`).
    const missingValue = resolveOptions(["--colour"]);
    const unrecognised = resolveOptions(["white"]);

    expect(missingValue.ok, "resolveOptions([--colour])").toBe(false);
    expect(unrecognised.ok, "resolveOptions([white])").toBe(false);
    // Narrowing only — either row above has already red by the time this could be taken.
    if (missingValue.ok || unrecognised.ok) return;

    // `A1` — THE COMMAND LINE THAT SIMPLY STOPS, and the reason this ticket exists. The `?? token`
    // fallback at `src/cli-options.ts:130` is the only thing that puts a token in `.offending` here:
    // `next` is `undefined`, so the message names `--colour` itself. THE MUTANT IS `next as string`
    // AT THAT LINE — it shipped 863/863 GREEN on `main` at `4c5e19e` (measured 2026-08-17), and
    // under it `node src/cli.ts --colour` throws `TypeError: text is not iterable` out of
    // `printableOf` (`src/cli.ts:69`) — a Node stack trace where the usage sentence belongs, at the
    // same exit code `1`, so even an exit-code assertion passes. The deep equality is what kills it;
    // do not loosen it to a `toContain`. UAT-10 row c.
    //
    // `.problem` is matched on its distinguishing substring, the delivered practice at `:388`:
    // `MISSING_VALUE` and `UNRECOGNISED` are module-private (`src/cli-options.ts:92-93`) and
    // exporting them would be a production line this ticket does not have.
    expect(missingValue.problem).toContain("white|black|random");
    expect(missingValue.offending).toEqual(["--colour"]);

    // `A2` — A VALUE WORD WITH NO `--colour` IN FRONT OF IT (UAT-10 row d). It reaches the default
    // branch and is resolved by no test at any level: the random corpus in the `:545` region gets
    // here only by accident.
    expect(unrecognised.problem).toContain("unrecognised");
    expect(unrecognised.offending).toEqual(["white"]);

    // `A7` — AND THE TWO REFUSALS ARE DISTINGUISHABLE. Both `toContain`s above pass for a build that
    // answers both command lines with ONE message, and that build tells one of the two users the
    // wrong thing. This is the hole the loose matching leaves open, closed in one line.
    expect(missingValue.problem).not.toBe(unrecognised.problem);
  });
});

describe("ABC-063 — UAT-16's six game verbs, by name", () => {
  it("A1/A2/A3 — the six argvs UAT-16 names are each refused, each naming its own first token", () => {
    // UAT-16 — "there is no way to make a move, by any route" — is the scenario the `ABC-042` pack
    // calls its most important, and until this row it had the LEAST by-name backing of the
    // seventeen. What backed it was a class argument, and a good one: `:435` pins
    // `ACCEPTED_ARGUMENTS` element-for-element against the scope table, `:525` bars any argv literal
    // outside the enumeration, `:630` rejects 1000 generated tokens, 250 per shape. BUT A CLASS
    // ARGUMENT IS SILENT ON NAMES, and these six are the words a human types.
    //
    // TRANSCRIBED FROM THE SCENARIO, NEVER DERIVED. The pack and its run are in
    // `.grugops/context/uat-ABC-042-pack/notes/` — the run's own table records all six refused at
    // exit `1` with `unrecognised argument: <verb>` on stderr and 0 board rows. A derivation of
    // these six would go stale in silence, which is the defect `ABC-059` exists for.
    //
    // ITS OWN BLOCK, DELIBERATELY. `ABC-062`'s two argvs at `:1172` are UAT-10 and the near-miss
    // family at `:554` is derived and COMPLETE OVER POSITION; hand-picking these six into either
    // would leave a future hop unable to tell which half it is licensed to touch. Six pure resolver
    // calls, no child process — `spawned` is still 10 (`:933`, `N8-LANE`).
    const UAT_16: readonly (readonly [argv: readonly string[], offending: string])[] = [
      [["--move", "e4"], "--move"],
      [["e4"], "e4"],
      [["--new"], "--new"],
      [["--undo"], "--undo"],
      [["--resign"], "--resign"],
      [["--quit"], "--quit"],
    ];

    // `A2` — THE LIST IS CLOSED AT SIX, because UAT-16 names six. `--help` is UAT-10 row g, a
    // different scenario, and is deliberately not folded in here.
    expect(UAT_16, "the command lines UAT-16 names").toHaveLength(6);

    for (const [argv, offending] of UAT_16) {
      const name = `resolveOptions(${JSON.stringify(argv)})`;
      const resolution = resolveOptions(argv);

      expect(resolution.ok, name).toBe(false);
      // Narrowing only — the row above has already red by the time this could be taken.
      if (resolution.ok) continue;

      // `A1` — NAME THE TOKEN, not just `ok === false`. `["--move","e4"]` must blame `--move` and
      // not `e4`: the resolver returns on the FIRST unrecognised token, so an `ok`-only assertion
      // ships green on a build that refuses the right command line for the wrong word. That is the
      // same `.ok`-only weakness `ABC-061` repairs on the accepting side.
      expect(resolution.offending, `${name} offending`).toEqual([offending]);
      expect(resolution.problem, `${name} problem`).toContain("unrecognised");
    }

    // `A3` — AND THIS IS THE ROW THAT REDS ON PURPOSE THE DAY A VERB BECOMES LEGAL. The loop above
    // alone does NOT, and the reason is worth writing down: membership in `src/cli-options.ts` is
    // exact equality against the six names POSITIONALLY destructured out of `ACCEPTED_ARGUMENTS`, so
    // a seventh element appended to that enumeration changes no resolver behaviour at all and would
    // red only at `:435`. Asserting the absence directly is what makes `A3`'s "here AND at `:435`"
    // true in both directions. `ABC-043` (session), `ABC-045` (`resign`) and `ABC-046` (`quit`,
    // `new`) must move this row and `:435` in the SAME hop that makes a verb legal — a deliberate
    // future red, so that day is a decision and never a side effect.
    for (const [argv] of UAT_16) {
      for (const token of argv) {
        expect(ACCEPTED_ARGUMENTS, `${token} is not an accepted argument`).not.toContain(token);
      }
    }
  });
});

describe("ABC-064 — the frame's shape and the status panel, on the three non-default children", () => {
  /**
   * The three children that print a frame with an argument on them, each with the (glyph mode,
   * orientation) pairs its OWN command line admits. The mode differs per child by design and is not
   * a property this ticket asserts: `white` also carries `--unicode` (it is `A7`'s second Given),
   * the other two run on a pipe with no glyph flag and so are `ascii`. `random` admits BOTH
   * orientations — which one it drew is not knowable from outside the child and is deliberately not
   * asserted here; `:356` already owns that question.
   *
   * ONE BLOCK PER PROPERTY, NOT ONE PER CHILD (`## Test notes` 4): three children by three
   * properties in nine blocks is noise, so each row below loops and NAMES THE CHILD in its message,
   * the way the rank loop at `:266`-`:270` names the rank. Zero new children — every capture here is
   * one `ABC-042` already spawned at module scope, so `spawned` is still the ten `:933` pins.
   */
  const NON_DEFAULT: readonly {
    readonly name: string;
    readonly child: Child;
    readonly mode: GlyphMode;
    readonly orientations: readonly Orientation[];
  }[] = [
    { name: "white", child: CHILDREN.white, mode: "unicode", orientations: ["white-bottom"] },
    { name: "black", child: CHILDREN.black, mode: "ascii", orientations: ["black-bottom"] },
    { name: "random", child: CHILDREN.random, mode: "ascii", orientations: ORIENTATIONS },
  ];

  /** A frame's status region, LOCATED by the board region's height — never by a written offset. */
  const statusRowsIn = (
    frame: readonly string[],
    mode: GlyphMode,
    orientation: Orientation,
  ): readonly string[] => {
    const top = boardRegionOf(mode, orientation).length;
    return frame.slice(top, top + STATUS_ROWS);
  };

  it("A1 — each non-default child writes the reference frame's row count, and one newline after its last row", () => {
    // NO ROW-COUNT LITERAL (`## Out of scope`). The height is `frameOf`'s, composed from the merged
    // modules per (mode, orientation), so the day the pane's height changes this row moves with it.
    for (const { name, child, mode, orientations } of NON_DEFAULT) {
      const rows = child.stdout.split("\n");
      const heights = orientations.map((orientation) => frameOf(mode, orientation).length);

      expect(child.status, `${name} exited non-zero: ${child.stderr}`).toBe(0);
      // "EXACTLY ONE NEWLINE AFTER THE LAST ROW", as `A8` means it and NOT as a naive trailing
      // newline test would read it: the frame's last row is the RESERVED EMPTY PROMPT ROW, so a
      // correct stream genuinely ends in two newlines and an `endsWith` test for one would red on a
      // correct build.
      expect(rows[rows.length - 1], `${name} does not end with a newline`).toBe("");
      // `ABC-043` — A CHILD IS A SESSION NOW, so the stream is no longer one frame and its length
      // no longer answers this. EVERY frame is measured instead of the stream, which is strictly
      // more than the old row asked for: each one carries the reference height, and a session that
      // grew or shrank a frame mid-stream reds where a whole-stream count could not see it.
      for (const orientation of orientations) {
        const frames = framesIn(child.stdout, mode, orientation);
        if (frames.length === 0) continue; // `random`'s other orientation — `:1600` owns the coin
        for (const [index, frame] of frames.entries()) {
          expect(heights, `${name} frame ${index} row count`).toContain(frame.length);
        }
      }
    }
  });

  it("A2 — no cursor control on any non-default child: zero CSI introducers on stdout", () => {
    // Counted rather than `not.toContain`ed, so a failure reports HOW MANY escaped, per child.
    for (const { name, child } of NON_DEFAULT) {
      expect(child.stdout.split("\u001b[").length - 1, `${name} CSI introducers`).toBe(0);
    }
  });

  it("A3 — the human's colour changes the orientation only: `black` and `random` carry the default child's status rows", () => {
    // MEASURED BEFORE IT WAS ASSERTED (`## Test notes` 2), because the claim "colour changes
    // orientation only" came from the status panel's contract and not from a reading of the `black`
    // child. The measurement RAN against the delivered children before this row was written and
    // every status region came back byte-identical to the default child's, so the criterion is
    // asserted as it was cut. Had they differed, this row would not exist and the difference would
    // be the ticket's result.
    // The default child is `npmRun`, and `npm`'s own banner precedes its frame — so the frame is
    // LOCATED, exactly as `A1`'s row locates it, rather than sliced off either end of the stream.
    const defaultFrame = framesIn(CHILDREN.npmRun.stdout, "ascii", "white-bottom")[0] ?? [];
    const defaultStatus = statusRowsIn(defaultFrame, "ascii", "white-bottom");

    // (i) NON-VACUITY FIRST: blank arrays compare equal to blank arrays, so a build that emitted no
    // status panel at all would satisfy every comparison below by saying nothing.
    expect(defaultStatus, "the default child's status rows").toHaveLength(STATUS_ROWS);
    expect(defaultStatus.join("").trim(), "the default child's status rows are blank").not.toBe("");

    // (ii) `A3` NAMES TWO CHILDREN, not three: `white` is the default child's own orientation and
    // proves nothing about colour. The pair is pinned so a later hop cannot quietly drop one.
    const coloured = NON_DEFAULT.filter(({ name }) => name !== "white");
    expect(
      coloured.map(({ name }) => name),
      "the children A3 names",
    ).toEqual(["black", "random"]);

    // (iii) `ABC-043` — WHAT COLOUR NOW ALSO CHANGES, and it is not the panel: WHO ACTS FIRST. A
    // human playing black watches the engine's opening ply, so that child's FIRST frame carries the
    // `thinking` flag the loop sets, and one cell of the status panel says so. The criterion is
    // still "the orientation only" and it is still asserted — against the MERGED panel with the
    // flag the composition supplies, which is what tells "a different game state" (a real failure)
    // apart from "the same state, watched while the opponent thinks" (the delivered behaviour).
    // The default child anchors the not-thinking form, so no expectation here is free-standing.
    const start = startGame();
    const panelWhenIdle = renderStatusPanel(start, gameStatusOf(start), false);
    const panelWhenThinking = renderStatusPanel(start, gameStatusOf(start), true);
    const trimmed = (rows: readonly string[]): readonly string[] =>
      rows.map((row) => row.trimEnd());
    expect(trimmed(defaultStatus), "the default child is the merged panel, idle").toEqual(
      trimmed(panelWhenIdle),
    );

    for (const { name, child, mode, orientations } of coloured) {
      // Under EVERY orientation the child's command line admits. For `random` that is both, and the
      // one it did not draw carries no frame at all — read off the stream rather than guessed, which
      // is what keeps this row silent about a coin it cannot see.
      for (const orientation of orientations) {
        const frames = framesIn(child.stdout, mode, orientation);
        if (frames.length === 0) continue;
        // The human is black exactly when the board is drawn black-bottom, and then the engine
        // opens: the first frame is the one the player watches while it thinks.
        const expected = orientation === "black-bottom" ? panelWhenThinking : panelWhenIdle;
        expect(
          trimmed(statusRowsIn(frames[0] as readonly string[], mode, orientation)),
          `${name} status rows, sliced for ${orientation}`,
        ).toEqual(trimmed(expected));
      }
    }
  });

  it("A4 — `random` is resolved before anything can see it: the word occurs zero times on the child's whole stdout", () => {
    // OVER THE WHOLE OF STDOUT, NOT THE BOARD REGION (`## Test notes` 3). `:356` compares a
    // `boardRegionOf(...)`-length PREFIX, and the status and message rows — the only rows the word
    // could survive into — are precisely what that prefix does not read. This is UAT-6's status-line
    // half; the board half already follows from `:356`.
    const child = CHILDREN.random;

    // NON-VACUITY: the stream asserted over is a frame, not an empty capture that carries no word
    // because it carries nothing at all.
    expect(
      frameRowsIn(child.stdout).length,
      "the random child printed no frame row",
    ).toBeGreaterThan(0);
    expect(child.status, `random exited non-zero: ${child.stderr}`).toBe(0);
    expect(
      child.stdout.split("random").length - 1,
      "occurrences of `random` on the random child's stdout",
    ).toBe(0);
  });
});

describe("ABC-043 — the live session", () => {
  /**
   * THE TEN `TerminalReason` VALUES, CLOSED BY THE TYPE AND BY THE COUNT. `A3`(ii) says "none of the
   * ten", so a list that silently lost one would let the word it lost through: the annotation makes
   * a value that is NOT a reason a type error, and the length makes a missing one a red row. What it
   * cannot do is notice an ELEVENTH — that is `src/turn-loop.test.ts`'s to pin, and the count here
   * reds the day the union grows, which is the notification this file needs.
   */
  const TERMINAL_REASONS: readonly TerminalReason[] = [
    "checkmate",
    "stalemate",
    "insufficient-material",
    "fivefold-repetition",
    "seventy-five-move",
    "threefold-repetition",
    "fifty-move",
    "resignation",
    "engine-failure",
    "engine-threw",
  ];

  /** `A3`(ii)'s second list, as the criterion spells it. */
  const RESULT_WORDS: readonly string[] = ["win", "draw", "resign", "checkmate", "stalemate"];

  /** What `A3` writes and `A4` must not: the marker, matched case-insensitively and as a phrase. */
  const INTERNAL_ERROR_MARKER = /internal error/i;

  const entry = executableCodeOf("cli.ts");

  /**
   * The frames a scripted session must produce, rebuilt from the MERGED modules: one before the
   * first act and one after every ply, each rendered from the position as it stood, with `thinking`
   * set exactly when the side to move is not the human's. Nothing about a frame's content is
   * transcribed here — `makeRenderSeam` composes it and `gameStatusOf` supplies the status, which is
   * what makes a byte-for-byte comparison an assertion about the LOOP rather than about the panels.
   */
  const expectedFrames = (
    script: readonly string[],
    humanColour: "white" | "black",
    mode: GlyphMode,
    orientation: Orientation,
  ): readonly (readonly string[])[] => {
    const render = makeRenderSeam(mode, orientation);
    const prefixes = [...script.map((_, ply) => script.slice(0, ply)), script];
    return prefixes.map((plies) => {
      const history = playedOut(plies);
      const status = gameStatusOf(history);
      const sideToMove = history.position.blackToMove ? "black" : "white";
      const thinking = status.result === "in-progress" && sideToMove !== humanColour;
      return render(history, status, thinking, []);
    });
  };

  it("A1 — `runTurnLoop` is called ONCE, with all six options, and with no cast and no adapter", () => {
    // The criterion's own instrument is the TYPECHECK (`npm run typecheck`, run at the gate): six
    // merged types meeting at one call site with nothing between them is what "no adapter" means,
    // and `tsc` is what decides it. These rows are what the typecheck cannot see — that the call
    // happens once, that every option is the merged factory's own return value, and that no `as`
    // was reached for to make any of it fit.
    expect(entry.match(/\brunTurnLoop\s*\(/g)).toHaveLength(1);

    // ALL SIX, each pinned to what supplies it. A build that passed five and defaulted the sixth
    // would satisfy a key-count row.
    expect(entry).toMatch(/history:\s*newGame\(START_FEN\)/);
    expect(entry).toMatch(/humanColour:\s*colour/);
    expect(entry).toMatch(/render:\s*makeRenderSeam\(mode,\s*orientation\)/);
    expect(entry).toMatch(/input:\s*createLineInputSeam\(/);
    expect(entry).toMatch(/engine:\s*createEngine\(\{\s*budgetMs:\s*DEFAULT_BUDGET_MS\s*\}\)/);
    expect(entry).toMatch(/\bsink,/);

    // NO CAST AND NO ADAPTER, over the CALL — which is what the criterion is about, and scoped
    // there rather than over the module because `ABC-042`'s byte filter legitimately casts
    // (`codePointAt(0) as number`, `src/cli.ts:67-75`) and is none of this ticket's business. The
    // window runs from the call to the closing brace of its options object.
    const call = entry.slice(
      entry.indexOf("runTurnLoop("),
      entry.indexOf("sink,") + "sink,".length,
    );
    expect(call, "a type assertion at the wiring").not.toMatch(/\bas\b/);
    // NO ADAPTER: no seam is wrapped in a function written here. An arrow at any option is the
    // shape this catches — `input: (history) => seam(history)` typechecks and is an adapter.
    expect(call, "a wrapper around a seam").not.toMatch(/=>/);
  });

  it("G6 — the input seam is built ONCE and called NOWHERE (the hang with no output)", () => {
    // `createLineInputSeam`'s `waiting` is a single slot (`ABC-037` `G6`, on the ticket under
    // `## Scope`): two overlapping `seam()` calls orphan the first read FOREVER, and the failure
    // mode is a product that hangs with no output and no exit code — nothing else in this suite
    // would report it, because a hung child produces no assertion at all, only a stalled lane.
    expect(entry.match(/\bcreateLineInputSeam\s*\(/g)).toHaveLength(1);
    // The seam is constructed INSIDE the options object and never bound to a name, so there is no
    // identifier here that a second call could be made through. That is the property, not the style.
    expect(entry).toMatch(/input:\s*createLineInputSeam\(\{\s*source:\s*process\.stdin,/);
    expect(entry, "the seam bound to a name it could be called through").not.toMatch(
      /(?:const|let|var)\s+\w+\s*=\s*createLineInputSeam/,
    );
  });

  it("A2 — a scripted game runs end to end: the mated board, the cadence, and exit 0", () => {
    const child = CHILDREN.mate;
    const PLIES = ["f2f3", "e7e5", "g2g4", "d8h4"];
    const NON_ADVANCING_WITH_A_MESSAGE = 1; // the `zzz` line — `rejected`, which re-emits a frame

    expect(child.status, `the scripted game failed: ${child.stderr}`).toBe(0);

    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    // `ABC-019`'s cadence, as the formula and not as a number: 1 + plies + the non-advancing
    // outcomes that carry a message, with end-of-input excluded (`[D29]`) — and this session never
    // reaches end-of-input, which is the next assertion.
    expect(frames).toHaveLength(1 + PLIES.length + NON_ADVANCING_WITH_A_MESSAGE);
    // IT ENDED ON THE MATE, NOT ON THE PIPE. A build that lost the last ply and then ran out of
    // script would emit the notice, and a frame-count row alone would not tell the two apart.
    expect(child.stdout, "the game ended on end-of-input").not.toContain(INPUT_ENDED_NOTICE);

    // The mated position, byte for byte, composed from the merged modules rather than described.
    const mated = playedOut(PLIES);
    const status = gameStatusOf(mated);
    expect(frames[frames.length - 1]).toEqual([
      ...makeRenderSeam("ascii", "white-bottom")(mated, status, false, []),
    ]);
    // `A2`'s "the mating side's win with `reason: "checkmate"`" — the loop returns `status.result`
    // and `status.reason` for the position it last rendered, and that is the position above.
    expect(status.result).toBe("black-wins");
    expect(status.reason).toBe("checkmate");
    // NON-VACUITY on the board itself: the mating move is on the board as SAN, with the `#` the
    // merged writer only produces for a checkmating move.
    expect((frames[frames.length - 1] as readonly string[]).join("\n")).toContain("Qh4#");
  });

  it("A3 — a parser bug ends the game as an INTERNAL ERROR, never as a chess outcome, and exits non-zero", () => {
    const child = CHILDREN.parserBug;

    // NON-VACUITY FIRST, and on this criterion it is the whole risk: a child that died before the
    // game started would satisfy every absence below by never having played. It rendered a frame
    // and it reached the prompt, so the throw happened where the criterion says it happens.
    expect(framesIn(child.stdout, "ascii", "white-bottom"), "frames before the throw").toHaveLength(
      1,
    );
    expect(child.stdout, "the child never reached the prompt").toContain(PROMPT);

    // (i) It is MARKED an internal error.
    expect(child.union).toMatch(INTERNAL_ERROR_MARKER);
    // (ii) And it names no chess result — none of the ten reasons, none of the five words.
    expect(TERMINAL_REASONS).toHaveLength(10);
    for (const reason of TERMINAL_REASONS) {
      expect(child.union, `the crash line named \`${reason}\``).not.toContain(reason);
    }
    for (const word of RESULT_WORDS) {
      expect(child.union.toLowerCase(), `the crash line named \`${word}\``).not.toContain(word);
    }
    // (iii) NO RESULT SCREEN: no frame follows the throw — the frame count above is the one frame
    // the loop had already rendered — and the loop's clean-exit notice is absent too.
    expect(child.stdout).not.toContain(INPUT_ENDED_NOTICE);
    // (iv) THE DISCRIMINATING REQUIREMENT (`ABC-019` `A10` at the top level). A build that caught
    // the throw and exited 0 passes every other criterion on the page and must fail here.
    expect(child.status, "a crashed session exited 0").not.toBe(0);
    // And it is distinguishable from a REFUSED COMMAND LINE as well as from a clean exit: a usage
    // error is the product's other non-zero, and one code for both would lose the difference.
    expect(child.status).not.toBe(CHILDREN.badColour.status);
  });

  it("A4 — end-of-input is the CLEAN path, and it is distinguishable from A3 by message and by code", () => {
    const clean = CHILDREN.truncated;
    const crashed = CHILDREN.parserBug;

    // `ABC-019` `A8`, byte for byte, through the delivered entry point: one notice, exit 0.
    expect(clean.stdout.split(INPUT_ENDED_NOTICE).length - 1, "notices written").toBe(1);
    expect(clean.status).toBe(0);
    // No result screen and no crash line: a truncated script is not an error and says nothing about
    // the game — the trailing partial line was never submitted, so nothing was played at all.
    expect(framesIn(clean.stdout, "ascii", "white-bottom")).toHaveLength(1);

    // `[D31]`'s whole point (`## Test notes` 2): the two paths are asserted AGAINST each other,
    // because the wrong build makes them identical. BOTH halves — the message and the code.
    expect(clean.union).not.toMatch(INTERNAL_ERROR_MARKER);
    expect(crashed.union).toMatch(INTERNAL_ERROR_MARKER);
    expect(crashed.stdout).not.toContain(INPUT_ENDED_NOTICE);
    expect(clean.status).not.toBe(crashed.status);
  });

  it("A5 — an engine fault is not a chess outcome: both faulty seams exit 0 and name nothing", () => {
    // The two the criterion names: one that THROWS and one that returns a move `legalMoves` did not
    // produce. Both are doubles at the seam; the DRIVER is the delivered entry point, spawned, with
    // its own exit code — which is what "rather than through a stub harness" asks for.
    const FAULTS = [
      { name: "engine-threw", child: CHILDREN.engineThrows },
      { name: "engine-failure", child: CHILDREN.engineForeign },
    ] as const;

    for (const { name, child } of FAULTS) {
      // NON-VACUITY: the session ran and rendered the frame that precedes the engine's ply.
      expect(framesIn(child.stdout, "ascii", "black-bottom"), `${name}: frames`).toHaveLength(1);
      // THE DISCRIMINATING REQUIREMENT: the loop HANDLED it, so the process did what it was asked.
      // A build that exits non-zero here fails, exactly as a build that exits 0 on `A3` fails.
      expect(child.status, `${name} exited non-zero: ${child.stderr}`).toBe(0);
      expect(child.union, `${name}: a crash line`).not.toMatch(INTERNAL_ERROR_MARKER);
      // No `EndReason` word anywhere on either channel — an engine bug is never a chess outcome.
      for (const reason of TERMINAL_REASONS) {
        expect(child.union, `${name} named \`${reason}\``).not.toContain(reason);
      }
      for (const word of RESULT_WORDS) {
        expect(child.union.toLowerCase(), `${name} named \`${word}\``).not.toContain(word);
      }
      // And no notice: this is not the end-of-input path either.
      expect(child.stdout, `${name}: the notice`).not.toContain(INPUT_ENDED_NOTICE);
    }
  });

  it("A6 — one frame session, one writer, and no row count is named on either side of the diff", () => {
    // The session belongs to the LOOP now. The entry point neither begins one nor imports the
    // module that does, so "exactly once" is a property of merged, mutation-tested code rather than
    // of a second call site here — and this row is what would see one arrive.
    expect(entry).not.toContain("beginFrameSession");
    expect(entry).not.toContain("./frame.ts");
    expect(sourceOf("turn-loop.ts").match(/\bbeginFrameSession\s*\(/g)).toHaveLength(1);

    // OBSERVED, on a run of >= 6 frames: every frame reaches the writer with the row count the seam
    // returned. Equal heights across the session is what a single session with a held height looks
    // like from outside; a second `beginFrameSession` would re-choose the strategy mid-stream.
    const frames = framesIn(CHILDREN.mate.stdout, "ascii", "white-bottom");
    const height = frameOf("ascii", "white-bottom").length;
    expect(frames.length).toBeGreaterThanOrEqual(6);
    for (const [index, frame] of frames.entries()) {
      expect(frame, `frame ${index} height`).toHaveLength(height);
    }
    // The append strategy, chosen once and never re-chosen: zero cursor control on the whole stream.
    expect(CHILDREN.mate.stdout.split("\u001b[").length - 1, "CSI introducers").toBe(0);

    // NO NUMERIC ROW-COUNT LITERAL IN THE DIFF (`ADR-0009` clause 9a). The entry point's numbers are
    // transcribed at `A8`'s row; this closes the other half of the diff — the test file — where the
    // height is computed from the merged modules at every use and is never written down.
    const heights = new Set([height, ...MODES.map((mode) => frameOf(mode, "black-bottom").length)]);
    for (const named of heights) {
      expect(
        executableCodeOf("cli.test.ts").match(new RegExp(`\\b${named}\\b`, "g")),
        `the row count ${named} is written down in the suite`,
      ).toBeNull();
    }
  });

  it("A7 — the human's colour decides who moves first, in BOTH directions", () => {
    // Either direction alone is satisfied by a loop that always opens with the engine (`ABC-019`
    // `A1`/`A1b`), so both run, and each is asserted frame by frame against the game the script
    // describes — replayed here through the merged modules, never transcribed.
    const DIRECTIONS = [
      {
        name: "black",
        child: CHILDREN.colourBlack,
        // The engine opens with `a3`; the script's FIRST line is `e5`, a move only black can play.
        script: ["a2a3", "e7e5", "b2b3"],
        humanColour: "black",
        orientation: "black-bottom",
        // Two frames precede the first prompt: the one the player watches while the engine thinks,
        // and the one that follows the engine's move. THIS IS THE UNCONSUMED-LINE WITNESS'S
        // POSITIONAL HALF (`## Test notes` 3) — a build that read a line before the engine's first
        // move prompts after ONE frame.
        framesBeforeFirstPrompt: 2,
      },
      {
        name: "white",
        child: CHILDREN.colourWhite,
        script: ["e2e4", "e7e5"],
        humanColour: "white",
        orientation: "white-bottom",
        framesBeforeFirstPrompt: 1,
      },
    ] as const;

    for (const direction of DIRECTIONS) {
      const { name, child, script, humanColour, orientation } = direction;
      expect(child.status, `--colour ${name} failed: ${child.stderr}`).toBe(0);

      // THE CONTENT WITNESS: the game that was actually played, frame by frame. A build that ate
      // the player's first line plays a different game, and every frame after the first differs.
      expect(framesIn(child.stdout, "ascii", orientation)).toEqual(
        expectedFrames(script, humanColour, "ascii", orientation).map((frame) => [...frame]),
      );
      // THE POSITIONAL WITNESS: no prompt was written before the engine's first move.
      expect(
        framesIn(child.stdout.slice(0, child.stdout.indexOf(PROMPT)), "ascii", orientation),
        `${name}: frames before the first prompt`,
      ).toHaveLength(direction.framesBeforeFirstPrompt);
      // The script was consumed to its end and the session then ended on the pipe, cleanly.
      expect(child.stdout.split(INPUT_ENDED_NOTICE).length - 1, `${name}: notices`).toBe(1);
    }
  });
});
