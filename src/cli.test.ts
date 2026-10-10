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
 * `execSync(` call site and no `shell:`.
 *
 * THE "no spawn argument built by string concatenation" CLAUSE IS AMENDED AT `ABC-115` RATHER THAN
 * LEFT STANDING FALSE (`ABC-114`'s defect is a true-sounding sentence that is not true).
 * `ABC-115`'s seven children each need a shell construct `spawnSync` cannot express. SIX need a
 * REAL `head` on the other end of a REAL pipe — `spawnSync` with full capture reads everything a
 * child writes and can never let a reader go away — and the SEVENTH (`A10`) needs a per-command
 * fd-1 redirection, so that the product's stdout is a descriptor it may not write to. All seven
 * therefore spawn `/bin/sh` with a `-c` script this file composes. What that clause protected is still true, as the
 * narrower claim it always was: every word of that script comes from `process.execPath`,
 * `ENTRY_POINT` or this file's own literals, no test datum or external value reaches a shell word,
 * and both paths are quoted by `shellWord`. The file
 * MUST contain `process.execPath` — which is why the bar counts call sites and never occurrences.
 */

import { spawnSync } from "node:child_process";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { ACCEPTED_ARGUMENTS, type ResolvedOptions, resolveOptions } from "./cli-options.ts";
import { QUIT_CONFIRMATION_MESSAGES } from "./command-input.ts";
import { frameHeight } from "./frame.ts";
import * as glyphMode from "./glyph-mode.ts";
import { type GameHistory, gameStatusOf, newGame, playMove } from "./history.ts";
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import { PROMPT } from "./line-input.ts";
import { squareName } from "./position.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { makeRenderSeam } from "./render-seam.ts";
import { renderResultScreen } from "./result-screen.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import { INPUT_ENDED_NOTICE, QUIT_NOTICE, type TerminalReason } from "./turn-loop.ts";

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

// ---------------------------------------------------------------------------------------------
// THE TWO DERIVED VIEWS, AND THE ONE RULE THEY BOTH BROKE (`ABC-043` repair, 2026-08-20).
//
// QE's 2026-08-19 hop found four guards on this page that passed by being unable to look, and read
// them as ONE defect rather than four. Measured at this hop and CONFIRMED: three of the four are
// one mechanism. A guard here does not assert over the evidence — it asserts over a VIEW it derives
// from the evidence (a blanked source, a sliced window, a relation between two exit codes) — and
// every one of those derivations could silently DROP the evidence, at which point the guard is
// green by construction. The blanker erased `${…}` with the literal it sat in; the window returned
// the EMPTY STRING when its two anchors were the wrong way round.
//
// THE RULE, stated once for the whole file: A DERIVATION MUST PROVE IT PRESERVED THE EVIDENCE, OR
// THE GUARD MUST ASSERT OVER THE EVIDENCE ITSELF. The two functions below are the derivations this
// page still needs, each written so that losing the evidence is LOUD — and both are watched losing
// it, on hostile input, at the `the instruments themselves are not blind` row. A future derivation
// on this page goes under that row too; that row is the fix, and these two are its first customers.
// ---------------------------------------------------------------------------------------------

/**
 * The source with what a human wrote as TEXT blanked, and everything that RUNS kept.
 *
 * `${…}` INSIDE A TEMPLATE IS EXECUTABLE CODE. The blanker this replaces matched a whole template
 * and erased its interpolations along with its text, so a row count written `` `${23}` `` — or the
 * realistic `` write(`${INTERNAL_ERROR.padEnd(23)}\n`) `` — was invisible to `A8` and shipped GREEN
 * (QE, 2026-08-19; the `ABC-043` repair before this one narrowed the blanker and MOVED the hole
 * rather than closing it). Interpolations are kept and scanned; a string nested inside one is text
 * again, and is blanked.
 */
const withoutStringText = (code: string): string => {
  let kept = "";
  let index = 0;
  while (index < code.length) {
    const character = code[index] as string;
    if (character === '"' || character === "'") {
      kept += character;
      index++;
      while (index < code.length && code[index] !== character)
        index += code[index] === "\\" ? 2 : 1;
      kept += character;
      index++;
      continue;
    }
    if (character === "`") {
      kept += "`";
      index++;
      while (index < code.length && code[index] !== "`") {
        if (code[index] === "\\") {
          index += 2;
          continue;
        }
        if (code[index] === "$" && code[index + 1] === "{") {
          const opened = index;
          let depth = 0;
          while (index < code.length) {
            if (code[index] === "{") depth++;
            else if (code[index] === "}") {
              depth--;
              if (depth === 0) {
                index++;
                break;
              }
            }
            index++;
          }
          kept += withoutStringText(code.slice(opened, index));
          continue;
        }
        index++;
      }
      kept += "`";
      index++;
      continue;
    }
    kept += character;
    index++;
  }
  return kept;
};

/**
 * A WINDOW THAT PROVES IT LOOKED: the span from `opening` to the end of `closing`, or a THROW.
 *
 * The expression this replaces was `source.slice(source.indexOf(opening), source.indexOf(closing) +
 * closing.length)`, which returns the EMPTY STRING whenever `closing` precedes `opening` — and
 * every `.not.toMatch` over it then passes over nothing. QE hoisted `src/cli.ts`'s options object
 * out of the `runTurnLoop(` call, which puts `sink,` first, and shipped a real `as` cast through
 * `A1` with `tsc` clean and 50 rows green. Three refusals, because all three are silent losses of
 * the evidence and only one of them is the one that was found.
 */
const windowOf = (source: string, opening: string, closing: string): string => {
  const from = source.indexOf(opening);
  const to = source.indexOf(closing);
  if (from < 0) throw new Error(`the window never opened: \`${opening}\` is not in this source`);
  if (to < 0) throw new Error(`the window never closed: \`${closing}\` is not in this source`);
  if (to < from)
    throw new Error(
      `the window is INVERTED: \`${closing}\` precedes \`${opening}\` in this source`,
    );
  return source.slice(from, to + closing.length);
};

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
  /**
   * `ABC-115` `A2`/`A9` — "the child is NOT killed by a signal". `spawnSync` reports a signal death
   * as `status: null` + `signal: "SIGPIPE"`, so a row that asserted only the status would read a
   * signal death as `null !== 1` and pass. The name has to be on the shape to be assertable.
   */
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  /** stdout and stderr, unioned — what an absence property is asserted over. */
  readonly union: string;
  /**
   * `G-QE115-5` — THE ARGV THE PRODUCT ITSELF RECEIVED, which for a `/bin/sh`-wrapped child is NOT
   * the argv `spawnSync` was handed. `ABC-066`'s row derives its subject — the refused command
   * lines — and a command line is refused by the RESOLVER, so this is the field that derivation
   * has to read. It is a REQUIRED positional on `childOf` and never defaulted: a child whose
   * product argv were allowed to go unstated would drop silently out of that derivation, which is
   * the exact blindness this field exists to end.
   */
  readonly productArgv: readonly string[];
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
  /**
   * `ABC-115`'s addition (`A9`), and the only reason the 30 s default is not simply reused: `A9`
   * asserts that a child HAS EXITED inside a bound, so the bound IS the criterion. It must be
   * strictly under `T_open` (the 10 s the stdin writer stays open) or the row proves only that
   * end-of-input works, and comfortably under vitest's own 5 s per-test default or a red arrives as
   * a runner timeout instead of as this file's own named throw. MEASURED at this hop: a hanging
   * child returns `error: spawnSync /bin/sh ETIMEDOUT`, `status: null`, `signal: "SIGTERM"` at the
   * bound, so the `child.error` guard below is what makes a hung `A9` a red row.
   */
  readonly timeout?: number;
}

let spawned = 0;

const childOf = (
  command: string,
  args: readonly string[],
  productArgv: readonly string[],
  options: ChildOptions = {},
): Child => {
  spawned++;
  const child = spawnSync(
    command,
    options.hook === undefined ? [...args] : ["--import", options.hook, ...args],
    {
      cwd: REPOSITORY,
      encoding: "utf8",
      input: options.input ?? "",
      stdio: ["pipe", "pipe", "pipe"],
      // A HUNG CHILD MUST BE A RED ROW, NOT A STALLED LANE — `ABC-043`, and it is `G6`'s failure
      // mode made survivable rather than a general precaution. Two overlapping `seam()` calls
      // orphan the first read FOREVER: MEASURED at this hop, that build wrote 501 bytes and then
      // never exited, and a suite with no bound waits for it as long as anyone lets it. With one,
      // `spawnSync` returns an `ETIMEDOUT` error and the throw below names it — WATCHED going red
      // at this hop, at a temporary 1 ms bound. The bound is deliberately two orders of magnitude
      // above the 64-72 ms a child costs here, so nothing but a genuine hang can reach it: it is
      // not a performance assertion and must never be read as one.
      timeout: options.timeout ?? 30_000,
    },
  );
  // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a child that never started says so here,
  // loudly, instead of arriving as an empty capture that every absence assertion would swallow.
  if (child.error !== undefined)
    // THE ARGUMENTS ARE NAMED SINCE `ABC-115`, and the reason is a red that was watched arriving
    // unattributable: seven children now spawn `/bin/sh`, so `child /bin/sh failed to start` alone
    // does not say WHICH — and the one that hangs (`A9`'s) is the one whose red is the point.
    throw new Error(`child ${command} ${args.join(" ")} failed to start: ${child.error}`);
  return {
    status: child.status,
    signal: child.signal,
    stdout: child.stdout,
    stderr: child.stderr,
    union: `${child.stdout}${child.stderr}`,
    productArgv,
  };
};

/** The delivered entry point, run as a child the way a human's shell runs it. */
const run = (...args: readonly string[]): Child =>
  childOf(process.execPath, [ENTRY_POINT, ...args], args);

/** The same entry point, typed at and — where a criterion needs a constructed fault — hooked. */
const play = (args: readonly string[], options: ChildOptions): Child =>
  childOf(process.execPath, [ENTRY_POINT, ...args], args, options);

// ---------------------------------------------------------------------------------------------
// `ABC-115` — A READER THAT CLOSES EARLY, and why it cannot be an ordinary child of this file.
//
// `childOf` captures a child with `spawnSync` and full output capture, which reads EVERYTHING the
// child writes: there is no moment at which the reader goes away, so no capture-shaped child can
// reproduce a closed stdout. The reader has to be a real `head` in a real pipeline, so the child
// this file spawns is `/bin/sh`, and the product is the pipeline's left-hand side.
//
// ZERO NEW `spawnSync` CALL SITES. It goes through `childOf` exactly like every other child, so
// `:1480-1485`'s pin — one call site, `spawnSync` the only imported name — stays green. That pin is
// the whole reason shape (b) (an async `spawn` with `child.stdout.destroy()`) was not taken; it also
// reproduces, and it reds the pin.
//
// THE STATUS IS CARRIED OUT BY HAND, and `set -o pipefail` is NOT trusted alone. `sh`'s own exit is
// the trailing `echo`'s, so `NODE_EXIT=<n>` on stdout is what the criteria read — the PRODUCT's
// status, not the shell's, and it distinguishes 0 from 1 from 70 from a 128+n signal death, which
// `pipefail` on its own would flatten into "non-zero". `/bin/sh` on this host honours `pipefail`;
// a hop that changes platform re-measures.
//
// THIS FILE'S HEADER SAID "no spawn argument built by string concatenation" AND THAT SENTENCE IS
// NOW AMENDED RATHER THAN LEFT STANDING (`ABC-114`'s defect is a true-sounding sentence that is not
// true). The two builders below compose a `/bin/sh -c` script out of `process.execPath`,
// `ENTRY_POINT` and this file's own literals — no test datum and no external value reaches a shell
// word, and every path is single-quoted by `shellWord`.
// ---------------------------------------------------------------------------------------------

/** A path as one `sh` word. Single quotes, with any embedded quote closed and re-opened. */
const shellWord = (value: string): string => `'${value.replaceAll("'", `'\\''`)}'`;

const PRODUCT = `${shellWord(process.execPath)} ${shellWord(ENTRY_POINT)}`;

/**
 * `A1`/`A2`/`A3` — the product with stdout piped to a `head` that closes after `lines`, and stdin
 * already at end of input. `glyph` is `--ascii`, `--unicode` or nothing (the default mode).
 */
const closedReader = (glyph: string, lines: number): Child =>
  childOf(
    "/bin/sh",
    [
      "-c",
      `set -o pipefail; ${PRODUCT} ${glyph} </dev/null | head -${lines} >/dev/null; echo "NODE_EXIT=$?"`,
    ],
    glyph === "" ? [] : [glyph],
  );

/**
 * `A9` — THE SESSION ENDS. The reader closes after 2 lines and stdin STAYS OPEN behind it, so a
 * build that merely silences `EPIPE` has nothing to end it and runs on into the dead pipe forever.
 *
 * `T_OPEN` (10 s) is how long the writer holds the FIFO; `T_BOUND` (4 s) is the `spawnSync` bound,
 * and `T_BOUND < T_OPEN` is the criterion — a row whose input source closes first proves only that
 * end-of-input works, which `A3` already covers. `SETTLE` (0.6 s) is required, not decoration: with
 * no settle the input races the reader's close and the row was MEASURED FLAKY at the amendment
 * (1 of 3 hung). Re-measured here, 5 consecutive identical runs on each of three builds.
 *
 * TWO TRAPS, ONE INHERITED AND ONE FOUND HERE.
 *   - Inherited: NEVER TIME THE PIPELINE. A timer around the whole pipeline reads the left-hand
 *     side's sleep and makes every build look identical. There is no timer here at all — the FIFO
 *     writer is DETACHED, so `sh` waits only for `node | head` and `sh`'s own return IS the child's
 *     ending. The assertion is "did it come back inside the bound", not a stopwatch reading.
 *   - FOUND AT THIS HOP, and it is new: the detached writer INHERITS `sh`'s stdout and stderr, and
 *     `spawnSync` waits for those capture pipes to close — not merely for `sh` to exit. The first
 *     build of this row therefore sat for the writer's full `sleep` on EVERY build, delivered and
 *     unfixed alike, and discriminated nothing. `>"$F" 2>/dev/null` below hands the orphan the FIFO
 *     and `/dev/null` and no capture pipe, which is what makes the row able to go red.
 *
 * The detached `sleep` outlives the row as a bounded orphan (`T_OPEN`), and the FIFO's directory is
 * this row's to remove — the trailing `rm -rf` is that.
 */
const A9_SETTLE_SECONDS = 0.6;
const A9_OPEN_SECONDS = 10;
const A9_BOUND_MS = 4_000;

const heldOpenReaderClosed = (): Child =>
  childOf(
    "/bin/sh",
    [
      "-c",
      [
        'D=$(mktemp -d); F="$D/fifo"; mkfifo "$F";',
        `( { sleep ${A9_SETTLE_SECONDS}; echo zz; sleep ${A9_OPEN_SECONDS}; } >"$F" 2>/dev/null & );`,
        `set -o pipefail; ${PRODUCT} --ascii <"$F" | head -2 >/dev/null;`,
        'echo "NODE_EXIT=$?"; rm -rf "$D"',
      ].join(" "),
    ],
    ["--ascii"],
    { timeout: A9_BOUND_MS },
  );

/**
 * `A10` — A REAL WRITE FAILURE IS NOT ABSORBED. The product's stdout is a READ-ONLY fd, so its very
 * first frame write fails with a genuine errno that is NOT `EPIPE`, and the delivered arm re-throws
 * it. It is the only child that separates the delivered build from one whose arm swallows EVERY
 * stdout error: that build writes no board at all and then tells the shell `0`.
 *
 * `1</dev/null` is a per-command fd-1 INPUT redirection — `/dev/null` opened for READING and handed
 * to `node` as fd 1, so the WRITE is illegal rather than the fd absent. THE CHEAPER-LOOKING PROBE
 * IS A NO-OP AND WAS MEASURED SO: `1>&-` closes fd 1, node re-opens a closed standard fd onto
 * `/dev/null` during bootstrap, and that build writes the whole board into the void and exits 0
 * with no error arm firing at all. To fail a write you must make the WRITE illegal, not the fd
 * absent.
 *
 * ZERO NEW `spawnSync` CALL SITES. The redirection lives inside the single `/bin/sh -c` string
 * `childOf` already spawns, so the one-call-site pin below stays green. No `set -o pipefail` and no
 * `head`: there is no pipe in this row, and the reader never goes away — the fd is simply unusable.
 *
 * THE TRAP, AND A ROW THAT FALLS IN IT DISCRIMINATES NOTHING — IN EITHER DIRECTION: the redirection
 * binds `node` alone, so the wrapper's own status is the trailing `echo`'s and is `0` on the fixed,
 * the unfixed and the swallowing build alike. A row reading `child.status` therefore measures that
 * constant and not the product. MEASURED 2026-08-21 in an out-of-repo copy, delivered build against
 * the one-token swallowing arm: this row's `not.toBe(0)` over `child.status` is RED on BOTH, never
 * the green-on-every-build shape a reader may expect; the `toBe(0)` spelling of the same clause is
 * GREEN on both, and its red against the mutant comes only from the separate non-empty-stderr
 * assertion. The status is read from `NODE_EXIT=` and NEVER from `child.status`.
 */
const unwritableStdout = (): Child =>
  childOf("/bin/sh", ["-c", `${PRODUCT} --ascii 1</dev/null; echo "NODE_EXIT=$?"`], ["--ascii"]);

/** The `NODE_EXIT=<n>` the wrappers above echo. Throws rather than defaulting: see `usageLineOf`. */
const productStatusOf = (child: Child): number => {
  const marked = /^NODE_EXIT=(\d+)$/m.exec(child.stdout);
  if (marked === null) throw new Error(`no NODE_EXIT marker in: ${JSON.stringify(child.stdout)}`);
  return Number(marked[1]);
};

/**
 * `G-QE115-5` — THE PRODUCT'S OWN EXIT, WRAPPED OR NOT, for a reader that must not care which. Where
 * a `/bin/sh` wrapper stands between, `child.status` is the trailing `echo`'s and says nothing about
 * the product; where none does, `child.status` IS the product's. This picks the right one.
 *
 * IT IS NOT A REPLACEMENT FOR `productStatusOf` AND MUST NOT BECOME ONE. A row whose criterion is a
 * wrapped child's exit code reads `productStatusOf`, which THROWS when the marker is missing — that
 * throw is the guard against a wrapper that stopped echoing. This one falls back instead, so it is
 * for readers that span both kinds of child and would otherwise have to read the wrapper.
 */
const productExitOf = (child: Child): number | null =>
  /^NODE_EXIT=/m.test(child.stdout) ? productStatusOf(child) : child.status;

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
// THE LIMITS THIS FILE HONOURS, and both halves are now RULED rather than read off three names:
// `ADR-0015` clauses (S)/(C), and BA/PM's (N1)-(N3), both 2026-08-20.
//
//   (S) the substituted module is a supplier NAMED AT AN INJECTION POINT of the delivered
//       composition — imported by `src/cli.ts` AND passed in the `runTurnLoop({ … })` bag;
//   (C) the double satisfies the seam's PUBLISHED TYPE, so it builds a composition the production
//       contract already permits;
//   (N) the criterion's own GIVEN stipulates that component as constructed, everything the criterion
//       asserts is produced by code that was NOT substituted, and it is ONE criterion, ONE seam.
//
// `./frame.ts` and `./turn-loop.ts` are NEVER substituted: neither is a seam supplier, so a
// substitution there is a PRODUCT REWRITE however clean its diff. `./command-input.ts` stood in the
// IDENTICAL structural position — one static import below the seam supplier `./line-input.ts`
// (`src/line-input.ts:56`), named nowhere in `src/cli.ts` — and the `A3` child that substituted it
// is REFUSED by (S) and by (N1) both, and is gone from this file.
//
// The engine seam is substituted under `A2`, `A5` and `A7`, and by `ABC-042`'s two colour children,
// which now reach an engine ply through the delivered composition and which `## Test notes` 8
// forbids to run the real search in the default lane. `./line-input.ts` is substituted by `A3`
// ALONE, whose Given stipulates "an `InputSeam` that throws": it is `src/cli.ts:155`'s own `input:`
// supplier, one line above the `engine:` seam `A5` doubles, and BA/PM's name-refusal of it stands
// UNCHANGED on `A2` (whose Given stipulates the reader as REAL) and on `A5` (one criterion, one
// seam). A module refused under one criterion is not thereby refused under another, and one admitted
// under one is not admitted generally — there is no module list here, in either direction.
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

/**
 * `ABC-115` `A3` — WHERE A READER HAS TO CLOSE, DERIVED FROM THE PRODUCT AND NOT COPIED OFF THE
 * TICKET. The ticket's own instruction: the frame height has moved twice this month, so a criterion
 * pinned to the literal `23` goes stale in silence.
 *
 * `total` is what a session on a closed stdin writes: ONE frame (`frameHeight`'s own arithmetic on
 * the merged constants, the same call `ABC-042` `A1` makes at `:857`) plus the loop's one-line
 * end-of-input notice. `near` is the last line BEFORE that total — the close point that still
 * reproduces — and `far` is 2, deliberately nowhere near the boundary, because a guard that only
 * samples the boundary is the flaky one.
 *
 * Re-measured at this hop on the delivered build, both glyph modes: 24 lines, `head -N` reproduces
 * for N <= 23 and does not for N >= 24. The derivation is CROSS-CHECKED against a real stream in
 * `A3`'s row below rather than trusted here.
 */
const OPENING_FRAME_ROWS = frameHeight({
  board: renderBoard(startGame().position, "ascii", "white-bottom").length,
  status: STATUS_ROWS,
  history: HISTORY_ROWS,
});

const CLOSE_POINTS = {
  far: 2,
  near: OPENING_FRAME_ROWS,
  total: OPENING_FRAME_ROWS + 1,
} as const;

const CHILDREN = {
  /** `A1` — the real command, and the only one that goes through `npm`. */
  npmRun: childOf("npm", ["run", "chess"], []),
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
  /**
   * Security bar 3 — one spawn, one token carrying ONE MEMBER OF EACH CLASS THE BAR FORBIDS: a C0
   * (`BEL`), a literal escape sequence (`ESC`, itself a C0) and `U+007F` (`ABC-058` `S4`).
   */
  escape: run("--colour", "\u0007\u001b[2Jpurple\u007f"),

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
   * `A3` — `[D31]`'s ruling, as a child, and it is `A5`'s engine child with the fault moved one seam
   * up. `A3`'s Given is "an `InputSeam` that throws", so the constructed fault stands AT THE SEAM
   * the criterion names: `createLineInputSeam` returns a seam that throws when the loop calls it.
   *
   * WHAT IS REAL HERE IS EVERYTHING `A3` ASSERTS. The merged loop's repair-and-rethrow, the entry
   * point's one `try`/`catch`, the internal-error line, and the process's own exit code are all
   * delivered code, driven through the delivered entry point. The double produces NO observable this
   * row reads — it writes nothing, not even the prompt, which is why `A3`'s non-vacuity witness is
   * the FRAME the loop had already rendered rather than the prompt the real reader would have
   * written. Asserting a substituted module's output back at itself is exactly (N2)'s refusal.
   *
   * It replaces a child that substituted `./command-input.ts` — refused by `ADR-0015` (S) (a module
   * reached only by a static import is not a seam supplier) and by BA/PM's (N1) (`A3`'s Given
   * stipulates the seam, not the parser). ONE SPAWN, exactly as that one was: `N8-SPAWN`'s pin of 17
   * does not move. No stdin script: the seam never reads one.
   */
  inputSeamThrows: play(["--colour", "white"], {
    hook: substituting(
      "line-input.ts",
      `export function createLineInputSeam() {
  return async () => { throw new Error("the input seam threw"); };
}
`,
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

  /**
   * `ABC-045` `A4` — the human resigns after one move each, and the stream ends with `ABC-044`'s
   * screen naming resignation. ONE child, the criterion's own ("a scripted game driven through the
   * entry point"), on the same rig `mate` uses. The THIRD line, `d4`, is a legal move for White and
   * must never be read (`A5`): a build that read a confirmation would play it, the opponent would
   * run out of script, and the screen would say the game did not finish.
   */
  resigns: play(["--colour", "white"], {
    input: "e4\nresign\nd4\n",
    hook: substituting("engine.ts", scriptedEngine(["e7e5"])),
  }),

  /**
   * `ABC-046` `A2`/`A3` — the human quits after one move each: ONE `quit` asks, the SECOND ends
   * the session, and the stream ends with `QUIT_NOTICE` and NO result screen. The FOURTH line,
   * `d4`, is a legal move for White and must never be read: a build that needed a third `quit`,
   * or that read `d4` as the confirmation, would play it, the opponent would run out of script,
   * and the screen would say the game did not finish. Same rig as `resigns`.
   */
  quits: play(["--colour", "white"], {
    input: "e4\nquit\nquit\nd4\n",
    hook: substituting("engine.ts", scriptedEngine(["e7e5"])),
  }),

  /**
   * `ABC-046` `A6` — `new` after one move each redraws the OPENING frame, byte for byte, with the
   * colour, glyph mode and orientation the session started with; and `A1`'s quit-then-EOF
   * sequence rides the same child: the trailing single `quit` asks and does NOT end anything, so
   * the stream ends on end-of-input — `INPUT_ENDED_NOTICE`, never `QUIT_NOTICE`.
   */
  renews: play(["--colour", "white"], {
    input: "e4\nnew\nquit\n",
    hook: substituting("engine.ts", scriptedEngine(["e7e5"])),
  }),

  // -------------------------------------------------------------------------------------------
  // `ABC-115`'s SEVEN, counted off the criteria on that ticket (`N8-SPAWN`, ceiling raised +5 -> +6
  // by BA/PM at the 2026-08-20 amendment and +6 -> +7 at the 2026-08-21 residual ruling, each with
  // the reason written on the page) and not one more. `A3` names five, `A9` names one, `A10` names
  // one, and `A1`, `A2`, `A4`-`A8` name NONE: `A4` re-reads `inputSeamThrows` and `badColour`,
  // which is why it adds nothing.
  //
  // THE BOUNDARY IS RE-DERIVED HERE, NOT COPIED. The ticket warns that the frame height has moved
  // twice this month and a criterion pinned to a stale literal goes red for the wrong reason, so
  // `TOTAL_LINES` below is asserted against the delivered stream before any close point is read.
  // Re-measured at this hop on both glyph modes: 24 lines total; `head -N` reproduces for N <= 23
  // and does not for N >= 24.
  // -------------------------------------------------------------------------------------------

  /** `A1`/`A2`/`A3` — far from the boundary, `--ascii`. The child `A1` and `A2` are asserted over. */
  asciiClosedAt2: closedReader("--ascii", 2),
  /** `A3` — the last line before the full read, `--ascii`. The near-boundary half of the pair. */
  asciiClosedAt23: closedReader("--ascii", CLOSE_POINTS.near),
  /** `A3` — the same two on the DEFAULT glyph mode: this is not an `--ascii` defect. */
  defaultClosedAt2: closedReader("", 2),
  defaultClosedAt23: closedReader("", CLOSE_POINTS.near),
  /** `A3`'s CONTROL — a reader that takes everything must stay exit 0 with an empty stderr. */
  fullRead: closedReader("--ascii", CLOSE_POINTS.total),
  /** `A9` — stdin held open behind the closed reader. The only child that kills a bare swallow. */
  heldOpen: heldOpenReaderClosed(),
  /**
   * `A10` — a stdout that cannot be written to. The only child that kills a WIDENED arm, and it
   * cannot be folded into any child above: its whole Given is a stdout that yields nothing, so it
   * has no capturable output for another row to assert over.
   */
  unwritableStdout: unwritableStdout(),
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

describe("this file's own instruments", () => {
  it("the instruments themselves are not blind — every derived view is WATCHED losing its evidence", () => {
    // THIS ROW IS THE `ABC-043` REPAIR (2026-08-20), and it is the whole of it. QE found four guards
    // on this page that passed by being unable to look; the shape was never four bugs, it was one
    // rule nobody had anywhere to write down — a derivation that drops the evidence makes its guard
    // green by construction, and nothing on this page had ever been watched going red on the input
    // that drops it. Both derivations below are fed exactly the hostile source QE's mutants planted
    // in `src/cli.ts`, IN PROCESS: no spawn, no mutation of a delivered module, no `N8-SPAWN` cost.
    // A NEW DERIVED VIEW ON THIS PAGE COMES HERE FIRST. That is the fence, and it is cheap to hold.
    //
    // The probe numbers are deliberately NOT a frame height: `A6`'s last row forbids this suite to
    // write a row count down, and an instrument fixture is not an exemption from it.
    const PROBE = 137;

    // (1) THE BLANKER. `${…}` is executable code and must survive the blanking of the text it sits
    // in — QE's two surviving mutants, verbatim in shape. Each fixture is SOURCE, so a literal
    // `${` is the point of it and Biome's placeholder warning is suppressed one line at a time
    // rather than by weakening the rule.
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject
    const INTERPOLATED = "const unused = `${137}`;";
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject
    const PAD_ON_THE_CRASH_PATH = "process.stderr.write(`${INTERNAL_ERROR.padEnd(137)}\\n`);";
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject
    const NUMBER_IN_TEXT_AND_IN_CODE = "const line = `rows ${137} of 8`;";
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject
    const NESTED_IN_AN_INTERPOLATION = 'const line = `${"137"}`;';

    expect(withoutStringText(INTERPOLATED), "an interpolated number").toContain(`${PROBE}`);
    expect(
      withoutStringText(PAD_ON_THE_CRASH_PATH),
      "a pad-to-a-row-count on the crash path",
    ).toContain(`${PROBE}`);
    // …and it still blanks what is genuinely TEXT, which is the whole reason a blanker exists: the
    // start position's `8/8/8/8` must not read as a numeric literal.
    expect(withoutStringText('const fen = "8/8/8/8";'), "a number in a string").not.toContain("8");
    expect(withoutStringText(NUMBER_IN_TEXT_AND_IN_CODE)).toContain(`${PROBE}`);
    expect(withoutStringText(NUMBER_IN_TEXT_AND_IN_CODE)).not.toContain("8");
    // A string NESTED inside an interpolation is text again — the recursion is asserted, not assumed.
    expect(
      withoutStringText(NESTED_IN_AN_INTERPOLATION),
      "a number in a nested string",
    ).not.toContain(`${PROBE}`);

    // (2) THE WINDOW. All three ways of losing a window THROW rather than returning "" — and the
    // third is QE's `A1` mutant: hoisting the options object puts the closing anchor FIRST.
    expect(() => windowOf("runTurnLoop({ sink, })", "loopTurns(", "sink,")).toThrow(/never opened/);
    expect(() => windowOf("runTurnLoop({ a: 1 })", "runTurnLoop(", "sink,")).toThrow(
      /never closed/,
    );
    expect(
      () =>
        windowOf(
          "const options = ({ sink, });\nawait runTurnLoop(options);",
          "runTurnLoop(",
          "sink,",
        ),
      "the hoisted options object",
    ).toThrow(/INVERTED/);
    // NON-VACUITY on the window itself: it returns the span, not merely the absence of a throw.
    expect(windowOf("x = runTurnLoop({ engine, sink, });", "runTurnLoop(", "sink,")).toBe(
      "runTurnLoop({ engine, sink,",
    );
  });
});

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
    //
    // EIGHT UNTIL `ABC-115`, and the ninth is the whole of that fix: `process.stdin.destroy()` in
    // the stdout error arm is HOW a closed reader ends the session. It is deliberately a SECOND
    // read of the handle the seam already holds and NOT a fourth `process.exitCode`: the destroy
    // drives the delivered end-of-input transition, whose outcome carries `0` through the third
    // assignment above, so no second exit-status site exists to be seen here. A build that reached
    // exit `0` by assigning it in the arm would show a FOURTH `process.exitCode` on the row above,
    // which is precisely the blanket-`exitCode` shape `ADR-0016` clause 5 forbids and `A4` fails.
    expect(entry.match(/\bprocess\b/g)).toHaveLength(9);
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
    //
    // THE BLANKER WAS BLIND TWICE AND IS NOW A WATCHED INSTRUMENT. First hole (`ABC-043`): the
    // expression could not match a literal containing an interpolation at all, so with TWO such
    // literals in a module it matched the CLOSING backtick of the first through the OPENING backtick
    // of the second and blanked every line between them. Second hole (QE, 2026-08-19), which the
    // narrowing MOVED rather than closed: `${…}` is EXECUTABLE CODE and was erased with the literal
    // it sat in, so `` `${23}` `` — and a real `` write(`${INTERNAL_ERROR.padEnd(23)}\n`) `` on the
    // crash path — shipped GREEN. `withoutStringText` keeps every interpolation and blanks only what
    // a human wrote as text; it is watched losing neither, on both of QE's mutants, at
    // `the instruments themselves are not blind`. THAT ROW IS WHY THIS ONE CAN BE TRUSTED.
    const numbersIn = (file: string): readonly string[] => {
      const code = withoutStringText(executableCodeOf(file));
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
      test: "node tools/grugops/run-bounded.js 60000 vitest run",
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

  it("N8-LANE — this file spawns TWENTY-SEVEN children and no more", () => {
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
    //
    // SEVENTEEN UNTIL `ABC-115`, and the derivation moves the same way it did at `ABC-043`: that
    // page's `N8-SPAWN` row derives SEVEN more, criterion by criterion — `A3` five (the far and
    // near close points on `--ascii`, the same two on the default glyph mode, and the full-read
    // control), `A9` one (the held-open-stdin child) and `A10` one (the read-only-fd stdout);
    // `A1`, `A2` and `A4`-`A8` add NONE, `A4` because it re-reads `inputSeamThrows` and
    // `badColour` rather than spawning its own. THE CEILING WAS RAISED TWICE BY BA/PM, ON THE PAGE,
    // WITH THE REASON WRITTEN EACH TIME — +5 -> +6 at the 2026-08-20 amendment, +6 -> +7 at the
    // 2026-08-21 residual ruling — and neither is an engineer's judgement taken at the bench. The
    // under-ceiling alternatives were priced and rejected there: dropping the default-glyph
    // near-boundary close the first time; the second time, folding `A10` into an existing child,
    // which is impossible by construction (its whole Given is a stdout that yields nothing to
    // assert over) and dropping a row to make room, refused on this page's own rule that a row may
    // go only by a re-cut argued on its own value, never to make a number fit. `A10`'s child is the
    // CHEAPEST on the page — it dies at its first write, rendering and capturing nothing.
    //
    // THE COUNT IS NO LONGER THE WHOLE CAP, and that is the part a later hop must not drop. `A9`'s
    // child costs ~9x a normal one in wall because most of its second is a settle `sleep`, so
    // `ABC-115` re-expressed the cap in three clauses. THE CLAUSE IN FORCE, and it is the 2026-08-21
    // budget ruling's, not the 2026-08-20 amendment's — <= 7 added children AND <= 2.0 s added wall
    // AND <= 0.30 s added CPU (`user` + `sys`) PER ADDED CHILD, on `npx vitest run --dir src`,
    // measured as the median of >= 5 INTERLEAVED PAIRED RUNS against the base, sign agreeing on
    // >= 4 of 5.
    //
    // THE CLAUSE THIS BLOCK USED TO QUOTE — `<= 0.5 s added CPU` as a LUMP — WAS RE-DERIVED, AND
    // THIS BLOCK CARRIED THE SUPERSEDED WORDING AND A "THE CPU CLAUSE IS BREACHED" SENTENCE FOR A
    // DAY AFTER IT STOPPED BEING TRUE. Both sentences were true when written and neither was true
    // when read, which is `ABC-114`'s defect class committed in the file that invokes it twice; QE
    // found it as `G-QE115-2` and this hop corrected it. THE BREACH DOES NOT EXIST. The lump form
    // was arithmetically impossible from the day it was written — the `64-72 ms per child` it was
    // derived from is WALL, while a node child costs ~0.15 s of CPU, so the six children the
    // criteria REQUIRE could never have fitted 0.5 s and the clause failed everything and therefore
    // nothing. The per-child form caps how expensive each child is and leaves the count clause to
    // cap how many, instead of two clauses doing one job in the wrong unit.
    //
    // MEASURED AT THIS HOP, 5 INTERLEAVED PAIRED RUNS, base `main` @ `414ef75` vs this tip, both
    // git worktrees with a symlinked `node_modules`: +7 children (17 -> 24), wall deltas 1.40 /
    // 1.24 / 1.20 / 1.07 / 1.18 s => MEDIAN +1.20 s, CPU (`user`+`sys`) deltas 0.61 / 1.09 / 1.27 /
    // 1.32 / 1.25 s => MEDIAN +1.25 s over 7 children = 0.179 s PER ADDED CHILD. Sign agrees 5/5 on
    // both. ALL THREE CLAUSES ARE MET: 7 <= 7, 1.20 <= 2.0, 0.179 <= 0.30 — the count clause at its
    // ceiling and the CPU clause at 60% of it.
    //
    // `NFR-008` IS NOT GRADED HERE AND NO `N8-LANE` LINE IS CLAIMED. `user` alone exceeds that
    // NFR's 13 s CPU clause on BOTH sides of every pair above — it is `ABC-108`'s to rule, this
    // ticket's ~0.18 s per child is reported to it as a contribution, and `ABC-108`'s `OQ-1` still
    // has the lane's own total under open question.
    //
    // TWENTY-FOUR UNTIL `ABC-045`, which adds ONE: its `A4` is "a scripted game driven through the
    // entry point where the human resigns", which no existing child plays, and `A5`'s unconsumed
    // next line rides the same child. `A1`-`A3` and `A5`'s loop half are unit rows in
    // `src/command-input.test.ts` at zero spawn cost. The ticket names `N8-LANE` by name and no
    // `N8-SPAWN` figure; the child is reported to the lane measurement on that ticket, not netted.
    //
    // TWENTY-FIVE UNTIL `ABC-046`, which adds TWO, counted off its criteria: `A2`/`A3` need a
    // session ENDED BY `quit` through the delivered entry point (no screen, `QUIT_NOTICE` last,
    // exit 0) — `quits`; `A6` needs `new`'s redrawn frame byte-compared with the opening frame
    // through the delivered entry point — `renews`, which also carries `A1`'s quit-then-EOF
    // sequence. `A1`'s other sequences, `A4`, `A5` and `A7` are unit rows in
    // `src/command-input.test.ts` at zero spawn cost. The ticket names `N8-LANE` by name and no
    // `N8-SPAWN` figure; the two children are reported to the lane measurement on that ticket,
    // not netted.
    //
    // TWENTY-SEVEN IS A CEILING, NOT A TARGET.
    //
    // WRITTEN AS `17 + 7 + 1 + 2` AND NOT AS ITS VALUE. At `17 + 6` the form was FORCED: `A6`'s
    // `ADR-0009` clause 9a row bars any literal equal to a frame's height from this file's
    // executable code, the frame is 23 rows, and the budget was 23 children — two unrelated numbers
    // that happened to be equal, so a literal would have redded `A6`. AT 24 THE COLLISION WAS GONE
    // and the form is now a choice, kept because the derivation says what the value cannot: WHICH
    // ticket bought WHICH children. A hop that "tidies" it to a literal reds nothing today and loses
    // that, and the next raise may collide again.
    const N8_SPAWN = 17 + 7 + 1 + 2;
    expect(spawned).toBe(N8_SPAWN);
    expect(Object.keys(CHILDREN)).toHaveLength(N8_SPAWN);
    // THE PIN ABOVE IS SELF-REFERENTIAL: `spawned` counts only children made through `childOf`, so
    // a direct `spawnSync` adds a child the counter never sees, and that build was green. The child
    // count is the instrument the spawn account rests on (no `N8-LANE` line is claimed in this
    // file — see above) — so the count is closed at its source rather than at the wrapper:
    // `spawnSync` is the ONLY name this file takes from `node:child_process`, and it has exactly
    // one call site. Both are counted over EXECUTABLE CODE, COMMENTS STRIPPED (`ABC-058` `S5`), so
    // a comment that names the call in prose cannot red a correct file.
    const self = executableCodeOf("cli.test.ts");
    const imported = [...self.matchAll(/import\s*\{([^}]*)\}\s*from\s*"node:child_process"/g)].map(
      (match) => (match[1] as string).trim(),
    );
    expect(imported).toEqual(["spawnSync"]);
    expect(self.match(/\bspawnSync\s*\(/g)).toHaveLength(1);
  });
});

describe("ABC-066 — the usage line is a command the user can actually run", () => {
  it("A1/A2/A3 — every refusal advertises the separator, and all it advertises resolves", () => {
    // THE REFUSAL CHILDREN, DERIVED FROM THE CAPTURE, NOT LISTED: every child whose COMMAND LINE THE
    // RESOLVER REFUSES. Zero new spawns — `spawned` stays at what this file's `N8-LANE` row pins —
    // and a listed set would go stale the day a further criterion refuses a command line this row
    // cannot see. That promise is kept HERE, by deriving; it was not kept by the exit-code
    // derivation this replaces, and `G-QE115-5` is the audit that found out why.
    //
    // THE SENTENCE THAT USED TO STAND HERE IS DELETED BECAUSE IT STOPPED BEING TRUE, and it is
    // written out rather than quietly dropped (`ABC-114`'s defect is a true-sounding sentence that
    // is not true). It read: *"a refusal is a non-zero exit that is NOT marked an internal error"*.
    // `ABC-043` had given the product a second non-zero exit (the crashed session, exit `70`, which
    // that clause excluded), and the sentence was true of the two shapes that then existed.
    // `ABC-115` gave it a THIRD on 2026-08-21: a failed non-`EPIPE` stdout write re-thrown out of
    // the sink's error arm arrives as an UNHANDLED exception — Node's own banner and stack, exit
    // `1`, no usage line, and NOT marked an internal error, because the re-throw fires on a later
    // tick than the entry point's `try`. MEASURED at this hop on the delivered build, and this is
    // the whole reason the clause had to go: `1` is also `USAGE_EXIT_CODE`, so a non-zero exit that
    // is not an internal error is no longer enough to identify a refused command line.
    //
    // THE OLD FILTER WAS GREEN ONLY BECAUSE IT COULD NOT SEE THAT CHILD. It read `child.status` —
    // the WRAPPER's — and `A10`'s wrapper exits `0` on the trailing `echo` whatever the product did.
    // That is `unwritableStdout`'s own documented trap ("A ROW THAT FALLS IN IT IS GREEN ON EVERY
    // BUILD") and this row had fallen into it. MEASURED both ways at `G-QE115-5`: reading the
    // wrapper, 6 refusal children; reading the product (`productExitOf`), 7 — and the seventh
    // carries `Node.js v24.12.0` as its last stderr line, which the row then asserts should contain
    // the separator. THAT RED WOULD HAVE BEEN THE INSTRUMENT'S, NOT THE PRODUCT'S: it would be this
    // row demanding a usage line from a CRASH. `ABC-066` `A1` asks it of refusals only.
    //
    // SO THE SUBJECT IS SELECTED IN THE CRITERION'S OWN TERMS AND NOT OFF AN EXIT CODE AT ALL. A
    // refused command line is one `resolveOptions` refuses; the exit code is then something this row
    // ASSERTS about that set, below, rather than something it identifies the set by. `A10`'s child
    // is excluded because its command line (`--ascii`) is ACCEPTED and its session started — not
    // because a wrapper hid it.
    //
    // NOT CIRCULAR, IN EITHER DIRECTION, and both were measured. Narrowing by the usage line would
    // have made `A1` circular — `A1` is what asserts that line exists — and that is still refused.
    // `resolveOptions` is not that: a build that accepted everything empties this set and reds the
    // count; a build that refused everything fills it with all 24 and reds it too. `A2` reads the
    // same function in the OPPOSITE direction (advertised argvs must resolve `ok`), over different
    // inputs, so neither row can be satisfied by the other's mutation.
    const refused = Object.values(CHILDREN).filter(
      (child) => !resolveOptions([...child.productArgv]).ok,
    );
    expect(refused, "the captured refusal children").toHaveLength(6);

    // WHAT THE DELETED CLAUSE USED TO SAY, NOW ASSERTED RATHER THAN ASSUMED — and it is strictly
    // more than the filter said, because the filter only ever SELECTED on these. Read through
    // `productExitOf`, so a wrapper can never again stand between this row and the product.
    for (const child of refused) {
      const argv = JSON.stringify(child.productArgv);
      expect(productExitOf(child), `refused ${argv} exit status`).not.toBe(0);
      expect(/internal error/i.test(child.union), `refused ${argv} marked internal error`).toBe(
        false,
      );
    }

    // AND THE CONVERSE, WHICH IS WHAT ENDS THE BLINDNESS RATHER THAN MERELY MOVING IT: no child
    // OUTSIDE the derived set advertises the separator. A future criterion that refuses a command
    // line this derivation somehow cannot see would print the usage line from outside the set and
    // red HERE, so the row can no longer be green by looking at too few children. It also reds a
    // build that started printing usage at a crash or on a session that ran.
    const advertisingOutside = Object.values(CHILDREN).filter(
      (child) => !refused.includes(child) && child.union.includes(SEPARATOR_FORM),
    );
    expect(
      advertisingOutside.map((child) => child.productArgv),
      "children advertising the separator from outside the refusal set",
    ).toEqual([]);

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

describe("ABC-059 — every claim AGENTS.md makes about `Dev / run` agrees with the delivered command", () => {
  /** The token every claim about the slot names, wherever and however it is written. */
  const OCCURRENCE = "Dev / run";

  /**
   * WHAT THIS GUARD IS FOR: THE FACT, NOT ONE SPELLING OF IT. `ABC-042`'s `A1` row bars one
   * rendering of "there is no entry point", the list item, and `Q13` shipped the same claim in
   * PROSE, split across a line break, for a day while that row stayed green. So this block looks
   * for no sentence. It finds every `Dev / run` in the file and reads what the text after it says.
   *
   * DO NOT "SIMPLIFY" IT BACK INTO A SUBSTRING TEST, AND DO NOT MAKE IT PER LINE. All whitespace is
   * collapsed to single spaces first; a literal or per-line check is blind to the newline that hid
   * `Q13`. Nor does it bar the phrase `UNKNOWN - verify`, which the file uses for other slots.
   *
   * THE SPAN, stated mechanically: from an occurrence of `Dev / run` up to and including the next
   * sentence terminator, a `.`, `!` or `?` followed by a space or the end of the text. A `.` inside
   * a path such as `src/cli.ts` ends nothing. Pure, over a string, so every mutant is in memory.
   */
  const spansIn = (agents: string): string[] => {
    const text = agents.replace(/\s+/g, " ");
    const spans: string[] = [];
    for (let at = text.indexOf(OCCURRENCE); at >= 0; at = text.indexOf(OCCURRENCE, at + 1)) {
      const end = text.slice(at).search(/[.!?]( |$)/);
      spans.push(end < 0 ? text.slice(at) : text.slice(at, at + end + 1));
    }
    return spans;
  };

  it("A1-A4 — no span says `UNKNOWN - verify`, every command span names the entry point's script, and `Q13` reds", () => {
    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
    const { scripts } = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as {
      scripts: Record<string, string>;
    };

    // `A4` — the command is READ, never transcribed: the one script whose value runs this file's
    // own `ENTRY_POINT`. The script's name is spelled nowhere in this block.
    const entry = ENTRY_POINT.slice(REPOSITORY.length);
    const runners = Object.keys(scripts).filter((name) =>
      scripts[name]?.split(/\s+/).includes(entry),
    );
    expect(runners, `package.json scripts that run ${entry}`).toHaveLength(1);
    const command = `npm run ${runners[0]}`;

    // `A1` (i) and (ii): a span disagrees when it says `UNKNOWN - verify`, or when it names any
    // `npm run` other than the delivered one. A span naming no command (a pointer) agrees.
    const disagreeingIn = (text: string): string[] =>
      spansIn(text).filter(
        (span) =>
          span.includes("UNKNOWN - verify") ||
          (span.match(/npm run [\w:-]*/g) ?? []).some((named) => named !== command),
      );

    // The floors, so the verdict below cannot be green by finding nothing to read.
    const spans = spansIn(agents);
    expect(spans.length, "`Dev / run` occurrences in AGENTS.md").toBeGreaterThanOrEqual(1);
    const commandSpans = spans.filter((span) => span.includes(command));
    expect(commandSpans.length, `spans naming ${command}`).toBeGreaterThanOrEqual(1);
    // `A1` and `A3` — the file as delivered, legitimate `UNKNOWN - verify` slots and all.
    expect(disagreeingIn(agents), "AGENTS.md spans that disagree with package.json").toEqual([]);

    // `A2` — the historical sentence, WITH its original line break, at the head, middle and tail.
    const q13 =
      "There is also no CLI entry point yet, which is why `Dev / run` above is\n" +
      "`UNKNOWN - verify` and stays that way.";
    const middle = agents.indexOf("\n\n", agents.length / 2);
    for (const at of [0, middle, agents.length]) {
      const mutant = `${agents.slice(0, at)}\n\n${q13}\n\n${agents.slice(at)}`;
      expect(disagreeingIn(mutant), `Q13 inserted at offset ${at}`).toHaveLength(1);
    }

    // `A1` (ii)'s own witness: every command span re-pointed at another script disagrees.
    const other = `npm run ${Object.keys(scripts).find((name) => name !== runners[0])}`;
    expect(disagreeingIn(agents.replaceAll(command, other))).toHaveLength(commandSpans.length);
  });
});

describe("ABC-109 — AGENTS.md stays inside its byte budget", () => {
  /** `ABC-109` `A1`'s target: a quarter under the inherited 32,768 B reader cap, which truncates silently from the tail. */
  const AGENTS_MD_BUDGET_BYTES = 24_576;

  it("A5 — AGENTS.md's size on disk, in BYTES, is at most the budget", () => {
    // Bytes, not characters (`## Test notes` 1): no encoding, so `.length` is the `wc -c` figure.
    // A byte count against a budget and nothing else — no hash, no line count (`ABC-059`).
    expect(
      readFileSync(`${REPOSITORY}AGENTS.md`).length,
      `AGENTS.md bytes against its ${AGENTS_MD_BUDGET_BYTES} B budget (ABC-109)`,
    ).toBeLessThanOrEqual(AGENTS_MD_BUDGET_BYTES);
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
    // `ABC-044` MOVED THIS ROW AND DID NOT WEAKEN IT. The history is now HELD by the entry point —
    // the result screen is a function of the game as well as of the outcome, so the entry point has
    // to still have it when the loop returns — so the option is a shorthand and the factory call is
    // one line above it. BOTH halves are pinned, which is what keeps the criterion ("every option is
    // the merged factory's own return value") standing: a shorthand row alone would be green on
    // `const history = someOtherThing`, and the initializer row alone would be green on a build that
    // constructed the game and then passed a different one. The count row below is unchanged.
    //
    // THE SHORTHAND ROW IS ANCHORED IN THE CALL'S OWN WINDOW (repair, 2026-08-20), and the build
    // that forced it was measured rather than imagined: `const decoy = { ...history }; const both =
    // [history, decoy];` with `history: decoy` at the call typechecks and ran the WHOLE suite green
    // when this row was an unanchored `/\bhistory,/` over the module — the token it matched was the
    // array element, not the option. The option's key and its value are pinned in ONE place again,
    // the way the other five options are (`humanColour:\s*colour` and so on); the window is the same
    // one this test's cast/adapter rows use, and it THROWS rather than coming back empty.
    expect(entry).toMatch(/const history = newGame\(START_FEN\);/);

    // THE BINDER COUNT (`ABC-113` `A1`): `history` is BOUND EXACTLY ONCE in the executable view of
    // the entry point. The initializer row above and the shorthand row below pin a name and a
    // shorthand, and a regex over source text cannot do scope analysis — a shadowing-parameter
    // rebind (`D3`) or a flat copy bound under the same name (`M9`, `history: decoy,`) hands the
    // loop a different object with both of those rows still green. It is placed BEFORE them so the
    // COUNT is the row that speaks first on such a build. Measured at the cut and re-measured on
    // this branch: delivered → `["history ="]`, 1; `D3` → 2; `M9` → 2.
    // Counted over `executableCodeOf` and never the raw file (`## Test notes` 1 — the word
    // `history` in a comment reddens a raw count), and written as a COUNT rather than a
    // `not.toContain("decoy")` (`## Test notes` 2 — a negative row on a literal passes on every
    // build that spells its decoy differently).
    //
    // `ABC-043` `A1`'S PRE- AND POST-REPAIR INSTRUMENTS ARE INCOMPARABLE, NOT ORDERED: the old
    // single `/history:\s*newGame\(START_FEN\)/` row was blind to `M10` (a SECOND
    // `newGame(START_FEN)` in the entry point) and the repair's triple is blind to `D3` (a
    // shadowing-parameter rebind), so neither dominates the other — and THIS row is what makes the
    // current instrument stronger than both.
    expect(
      entry.match(/\bhistory\s*[:=]/g),
      "the entry point binds `history` more than once — the loop may not be getting the game it built",
    ).toHaveLength(1);

    expect(
      windowOf(entry, "runTurnLoop(", "sink,"),
      "the `history` option is not the shorthand for the game the entry point built",
    ).toMatch(/\bhistory,/);

    expect(entry.match(/\bnewGame\s*\(/g)).toHaveLength(1);
    expect(entry).toMatch(/humanColour:\s*colour/);
    expect(entry).toMatch(/render:\s*makeRenderSeam\(mode,\s*orientation\)/);
    expect(entry).toMatch(/input:\s*createLineInputSeam\(/);
    expect(entry).toMatch(/engine:\s*createEngine\(\{\s*budgetMs:\s*DEFAULT_BUDGET_MS\s*\}\)/);
    expect(entry).toMatch(/\bsink,/);

    // NO CAST AND NO ADAPTER, over the CALL — which is what the criterion is about, and scoped
    // there rather than over the module because `ABC-042`'s byte filter legitimately casts
    // (`codePointAt(0) as number`, `src/cli.ts:67-75`) and is none of this ticket's business. The
    // window runs from the call to the closing brace of its options object.
    // THE WINDOW THROWS RATHER THAN COMING BACK EMPTY (`ABC-043` repair). The slice this replaces
    // returned "" for a build that HOISTED the options object out of the call — `sink,` then
    // precedes `runTurnLoop(` — and both refusals below passed over nothing. QE shipped a real `as`
    // cast through this row that way, `tsc` clean and 50 rows green.
    const call = windowOf(entry, "runTurnLoop(", "sink,");
    // NON-VACUITY, and it is also the property `A1` is about: the six options are the call's OWN
    // argument, written inline, so there is no name between the wiring and the loop.
    expect(call, "the options bag is not the call's own argument").toContain(
      "createLineInputSeam(",
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
    // THE CLAUSE THAT WAS MISSING, and it is the one that made this row's other three PROXIES rather
    // than the property (QE, 2026-08-19). All three above are green on a build that hoists the
    // options bag to a name and then calls the seam THROUGH THE BAG — `void options.input(…)` —
    // because none of them names the bag. Measured at this hop on a LIVE stdin (a FIFO carrying one
    // move and held open, which is a human at a keyboard): that build renders ONE board, writes
    // THREE prompts and NEVER PLAYS THE MOVE, where the delivered build plays it and renders TWO.
    // The bag is the call's own argument, so there is no name reaching the seam AT ALL, which is the
    // property "called nowhere" actually states. `windowOf` throws on the hoist rather than
    // returning an empty window — the same derivation `A1` uses, and the same repair.
    expect(
      windowOf(entry, "runTurnLoop(", "sink,"),
      "the seam reachable through a hoisted options bag",
    ).toContain("createLineInputSeam(");
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
    const child = CHILDREN.inputSeamThrows;

    // NON-VACUITY FIRST, and on this criterion it is the whole risk: a child that died before the
    // game started would satisfy every absence below by never having played. It rendered a frame,
    // which is the loop's own work and happens before the seam is ever called, so the throw happened
    // where the criterion says it happens. The prompt is NOT the witness any more: with the fault
    // constructed at the seam, the prompt would be the DOUBLE's output, and a criterion asserted
    // against its own instrument is (N2)'s refusal.
    expect(framesIn(child.stdout, "ascii", "white-bottom"), "frames before the throw").toHaveLength(
      1,
    );

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
    // THE TWO CODES BY VALUE, NOT BY RELATION (`ABC-043` repair, 2026-08-20). The rule — 0 for a
    // session that ran, 1 for a refused command line, 70 for a bug that ended the session — is
    // written in `src/cli.ts`'s header, in `AGENTS.md` and on the ticket, and until this pair it was
    // asserted NOWHERE: QE swapped the usage arm and the catch arm and the whole suite stayed green,
    // with `node src/cli.ts --colour purple` exiting 70. A relation survives a swap; a value does
    // not. `A8`'s transcription pins that both numbers EXIST in the module — this pins which path
    // uses which, which is the half `A8` structurally cannot see.
    expect(child.status, "a crashed session is `EX_SOFTWARE`").toBe(70);
    expect(CHILDREN.badColour.status, "a refused command line").toBe(1);
  });

  it("A4 — end-of-input is the CLEAN path, and it is distinguishable from A3 by message and by code", () => {
    const clean = CHILDREN.truncated;
    const crashed = CHILDREN.inputSeamThrows;

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

// ---------------------------------------------------------------------------------------------
// `ABC-044` `A6` — the result screen reaches the player, after the last frame, in ONE write.
//
// NO NEW CHILD IS SPAWNED (`## Test notes` 5, and `N8-SPAWN`'s pin of 17 does not move). `A6`'s
// Given is "a scripted game driven to checkmate through the entry point with stdout a pipe", and
// `CHILDREN.mate` — `ABC-043` `A2`'s fool's-mate child — IS that game. It is read again here rather
// than re-spawned; a third harness is exactly what the ticket forbids.
// ---------------------------------------------------------------------------------------------

describe("ABC-044 — the result screen reaches the player", () => {
  const entry = executableCodeOf("cli.ts");
  /** `CHILDREN.mate`'s game, as the engine double names its plies. Fool's mate — Black mates. */
  const PLIES = ["f2f3", "e7e5", "g2g4", "d8h4"];

  /**
   * The screen the delivered stream must end with, composed HERE from the merged renderer over the
   * game the child actually played — never a transcription of what a result screen looks like. The
   * outcome is `gameStatus`'s own, which is what `ABC-019`'s loop returns for the position it last
   * rendered, so this is the same value the entry point was handed.
   */
  const expectedScreen = (): readonly string[] => {
    const mated = playedOut(PLIES);
    const status = gameStatusOf(mated);
    // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: if the replay did not reach a terminal
    // position there is no screen to expect, and this says so instead of comparing against a
    // silently in-progress one.
    if (status.result === "in-progress") throw new Error("the replayed game did not end");
    return renderResultScreen({ result: status.result, reason: status.reason, exitCode: 0 }, mated);
  };

  it("A6 — the stream ENDS with the screen, after the final frame's last row, and exits 0", () => {
    const child = CHILDREN.mate;
    const written = `${expectedScreen().join("\n")}\n`;

    // NON-VACUITY FIRST: the scripted game ran to the mate. Without this every property below is
    // satisfiable by a child that died before playing.
    expect(child.status, `the scripted game failed: ${child.stderr}`).toBe(0);
    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    expect(frames.length).toBeGreaterThanOrEqual(1);

    // IT ENDS WITH THE SCREEN, byte for byte. `slice` rather than `endsWith` so a mismatch prints
    // the two strings instead of `false`.
    expect(child.stdout.slice(-written.length)).toBe(written);

    // AFTER THE FINAL FRAME'S LAST ROW, and asserted from both sides. (i) the screen begins past the
    // last row of the last frame; (ii) NOTHING frame-shaped follows it — a build that wrote the
    // screen mid-session would satisfy (i) on some other frame and fail here.
    const lastFrame = frames[frames.length - 1] as readonly string[];
    const lastRow = [...lastFrame].reverse().find((row) => row.trim() !== "") as string;
    expect(child.stdout.indexOf(written)).toBeGreaterThan(child.stdout.lastIndexOf(lastRow));
    expect(
      framesIn(child.stdout.slice(child.stdout.indexOf(written)), "ascii", "white-bottom"),
      "frames after the screen",
    ).toHaveLength(0);

    // ZERO ANSI CSI SEQUENCES OF ITS OWN. The whole stream is asserted at zero by `ABC-043` `A6`;
    // this is the screen's own contribution, so a regression is located in the renderer.
    expect(
      [...written].filter((character) => character === "\u001b"),
      "escape bytes on the screen",
    ).toHaveLength(0);

    // THE EXIT CODE IS THE LOOP'S, VERBATIM. `LoopOutcome.exitCode` is typed `0` and only `0`, so a
    // build that derived a code from `reason` — a mate as a failure — is what this row refuses.
    expect(child.status).toBe(0);
  });

  it("A6 — the screen is ONE write, and it is the only thing the entry point writes to the sink", () => {
    // "In one write" is not observable from outside a pipe, so it is asserted where it is decided:
    // the entry point has exactly one `sink.write` call site, guarded on a non-empty screen. A build
    // that wrote row by row would interleave with nothing today and would be a different contract.
    expect(entry.match(/sink\.write\(/g)).toHaveLength(1);
    expect(entry).toMatch(/renderResultScreen\(outcome,\s*history\)/);
  });

  it("A4 — end of input writes ZERO BYTES for the screen: the notice is still the last thing said", () => {
    // The module's half of `A4` (zero ROWS) is in `src/result-screen.test.ts`. This is the entry
    // point's half: nothing at all follows `ABC-019`'s notice — not a blank line, not a newline. A
    // build that wrote the joined rows unguarded appends one byte here and nothing else in this
    // suite would see it.
    const clean = CHILDREN.truncated;
    const notice = `${INPUT_ENDED_NOTICE}\n`;

    expect(clean.status).toBe(0);
    expect(clean.stdout.slice(-notice.length)).toBe(notice);
  });

  it("A3 — a faulty engine gets a screen that is not a chess outcome, and says the game did not finish", () => {
    // `ABC-043` `A5`'s two fault children already assert the ABSENCE half over the whole stream —
    // none of the ten reasons, none of the five words, on either channel — and those rows now cover
    // the result screen too, because the screen is on that stream. What is added here is the
    // PRESENCE half, which absence rows structurally cannot give: the player is told the game did
    // not finish rather than being shown nothing at all.
    const FAULTS = [
      { name: "engine-threw", child: CHILDREN.engineThrows },
      { name: "engine-failure", child: CHILDREN.engineForeign },
    ] as const;

    for (const { name, child } of FAULTS) {
      expect(child.status, `${name} exited non-zero: ${child.stderr}`).toBe(0);
      expect(child.stdout, `${name}: the screen is missing`).toContain("did not finish");
    }
  });
});

describe("ABC-045 — `resign` reaches the screen as reason 8", () => {
  /** `CHILDREN.resigns`'s game before the human resigned: one move each, as the engine names them. */
  const PLIES = ["e2e4", "e7e5"];

  it("A4 — the stream ends with ABC-044's screen naming resignation and the opponent as winner, exit 0", () => {
    const child = CHILDREN.resigns;

    // NON-VACUITY FIRST: the session ran, and it did not run out of script.
    expect(child.status, `the resigning game failed: ${child.stderr}`).toBe(0);
    expect(child.stdout, "the game ended on end-of-input").not.toContain(INPUT_ENDED_NOTICE);

    // THE SCREEN, composed from the merged renderer over the game the child played and the outcome
    // the loop returns for a white resignation — never a transcription of the wording, which is
    // `ABC-044`'s. `slice` rather than `endsWith` so a mismatch prints both strings.
    const screen = renderResultScreen(
      { result: "black-wins", reason: "resignation", exitCode: 0 },
      playedOut(PLIES),
    );
    const written = `${screen.join("\n")}\n`;
    expect(child.stdout.slice(-written.length)).toBe(written);
    // And the two words the criterion names, so the row cannot pass on an empty screen.
    expect(written).toContain("resignation");
    expect(written).toContain("Black wins");

    // `A5`'S ENTRY-POINT WITNESS: `1 + plies` frames and NOTHING after the screen. The script's
    // third line is a legal move; a build that read it as a confirmation would have played it and
    // either rendered a fourth frame or ended on `engine-threw` with a "did not finish" screen.
    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    expect(frames).toHaveLength(1 + PLIES.length);
    expect(
      framesIn(child.stdout.slice(child.stdout.indexOf(written)), "ascii", "white-bottom"),
      "frames after the screen",
    ).toHaveLength(0);
    expect(child.stdout).not.toContain("did not finish");
  });
});

describe("ABC-046 — `quit` and `new` through the delivered entry point", () => {
  /** Both children's game before the command: one move each, as the engine names them. */
  const PLIES = ["e2e4", "e7e5"];

  it("A2/A3 — quit / quit ends the session on `QUIT_NOTICE`, writes NO result screen, exit 0", () => {
    const child = CHILDREN.quits;

    // NON-VACUITY FIRST: the session ran, and it did not run out of script.
    expect(child.status, `the quitting game failed: ${child.stderr}`).toBe(0);
    expect(child.stdout, "the game ended on end-of-input").not.toContain(INPUT_ENDED_NOTICE);
    expect(child.stdout).not.toContain("did not finish");

    // `A3` — the LAST line names quitting: the prompt that read the second `quit`, then the
    // notice, then nothing. Asserted on the exported constant and its inequality, never a
    // substring (test note 4).
    expect(child.stdout.endsWith(`${PROMPT}${QUIT_NOTICE}\n`)).toBe(true);
    expect(QUIT_NOTICE).not.toBe(INPUT_ENDED_NOTICE);

    // `A2` — ZERO result-screen rows: the notice is the last thing said, so what `ABC-044` writes
    // for the outcome the loop returns on `quit` must be empty, and the stream must show it. The
    // loop's outcome on a quit is `{ null, null, 0 }`, byte-identical to end-of-input's.
    expect(
      renderResultScreen({ result: null, reason: null, exitCode: 0 }, playedOut(PLIES)),
    ).toEqual([]);
    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    // 1 + 2 plies + ONE re-emit for the confirmation; the second `quit` re-emits nothing, and the
    // fourth line (`d4`) was never read — a fifth frame or a "did not finish" screen would show it.
    expect(frames).toHaveLength(1 + PLIES.length + 1);
    const lastFrame = frames[frames.length - 1] as readonly string[];
    expect(lastFrame.join("\n")).toContain(QUIT_CONFIRMATION_MESSAGES[0] as string);
    // Nothing but the prompt and the notice follows the last frame.
    const afterLastFrame = child.stdout.slice(child.stdout.lastIndexOf(lastFrame[0] as string));
    expect(afterLastFrame.split("\n").filter((line) => line !== "")).toHaveLength(
      lastFrame.filter((line) => line !== "").length + 1,
    );
  });

  it("A6 — `new` redraws the OPENING frame byte for byte: colour, glyph mode and orientation kept", () => {
    const child = CHILDREN.renews;

    expect(child.status, `the renewing game failed: ${child.stderr}`).toBe(0);
    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    // 1 + 2 plies + 1 for the take-back + 1 for the single `quit`'s confirmation.
    expect(frames).toHaveLength(1 + PLIES.length + 2);
    const opening = frames[0] as readonly string[];
    const renewed = frames[3] as readonly string[];
    // The two plies really happened: the frame before `new` is NOT the opening frame.
    expect(frames[2]).not.toEqual(opening);
    // The BOARD REGION, named by the criterion, then the whole frame — same colour, same glyphs,
    // same orientation, same empty history pane, same status, no message.
    const board = boardRegionOf("ascii", "white-bottom");
    expect(renewed.slice(0, board.length)).toEqual(opening.slice(0, board.length));
    expect(renewed).toEqual(opening);
  });

  it("A1 — quit / EOF: a single `quit` asks and does NOT end the session; end-of-input does", () => {
    const child = CHILDREN.renews;

    const frames = framesIn(child.stdout, "ascii", "white-bottom");
    // The fifth frame is the confirmation the single `quit` re-emitted...
    expect((frames[4] as readonly string[]).join("\n")).toContain(
      QUIT_CONFIRMATION_MESSAGES[0] as string,
    );
    // ...and the session then ended on END-OF-INPUT, in `ABC-019`'s words, never in `quit`'s.
    expect(child.stdout.endsWith(`${PROMPT}${INPUT_ENDED_NOTICE}\n`)).toBe(true);
    expect(child.stdout.split(`${QUIT_NOTICE}\n`)).toHaveLength(1);
    expect(child.status).toBe(0);
  });
});

// =============================================================================================
// `ABC-115` — A CLOSED STDOUT READER ENDS THE SESSION QUIETLY AT EXIT `0`.
//
// The defect these rows close: with stdout piped to a reader that stops reading, the delivered
// entry point died on an unhandled `write EPIPE`, printed a raw Node stack — internal paths, the
// absolute path of the checkout — at the player, and exited `1`, the code this product reserves for
// a REFUSED COMMAND LINE. Nothing had crashed; a consumer stopped consuming.
//
// The fix is `ADR-0016`: whoever ACQUIRES a stream owns its error policy, so ONE `sink.on("error")`
// at `src/cli.ts:148` — installed before the handle is passed on — ends the session on `EPIPE`
// (`process.stdin.destroy()`, driving the delivered end-of-input transition) and RE-THROWS every
// other code. Exit `0`, three codes, no fourth: `AGENTS.md` `## Development` and `src/cli.ts`'s
// exit-code docblock stay true VERBATIM, which is `A8` satisfied by its first branch.
//
// WHY `A9` EXISTS AND WHY IT IS NOT DECORATION. The cheap fix — a bare swallow that silences
// `EPIPE` and does nothing else — passes `A1` and `A2` COMPLETELY, and was measured doing so twice
// by two independent hops. It leaves the game running blind into a dead pipe. `A9` is the only row
// that kills it, and it reds against a bare-swallow mutant rather than against the unfixed build:
// the unfixed build crashes fast, so it DOES end. Both RED rounds were run at the repair hop and
// both outputs are verbatim in `.grugops/context/ticket-to-pr-ABC-115-2026-08-20/notes/`.
// =============================================================================================

describe("ABC-115 — a reader that closes early ends the session quietly, at the right code", () => {
  /** Every stack frame Node prints starts with indentation and `at `. */
  const STACK_FRAME = /^\s+at /gm;

  it("A1 — the player is shown NO stack, no `write EPIPE`, no checkout path, no crash claim", () => {
    const { stderr } = CHILDREN.asciiClosedAt2;

    // NON-VACUITY FIRST, and here it is structural rather than a witness in the stream: this
    // criterion is a set of ABSENCES over stderr, so a child that never ran would satisfy all of
    // them by writing nothing. The child's own stdout carries the wrapper's `NODE_EXIT` marker, and
    // `productStatusOf` THROWS if it is missing — so the product is known to have run and exited.
    expect(productStatusOf(CHILDREN.asciiClosedAt2)).toBeTypeOf("number");

    expect(stderr.split("write EPIPE").length - 1, "`write EPIPE` on stderr").toBe(0);
    expect(stderr.split("Unhandled 'error' event").length - 1, "an unhandled error").toBe(0);
    expect(stderr.match(STACK_FRAME) ?? [], "stack frames").toHaveLength(0);
    // The security half of this criterion: the delivered stack named the absolute path of the
    // checkout twice, to whatever captures stderr.
    expect(stderr.split(REPOSITORY).length - 1, "the checkout path").toBe(0);
    // And it does not claim a bug either — `70`'s line here would be the `ABC-114` defect, a
    // true-sounding sentence that is not true. Nothing crashed.
    expect(stderr).not.toMatch(/internal error/i);

    // "Either empty or <= 1 line that names no file path." Measured at this hop: EMPTY, 0 bytes.
    const written = stderr.split("\n").filter((line) => line.trim() !== "");
    expect(written.length, `stderr: ${JSON.stringify(stderr)}`).toBeLessThanOrEqual(1);
    for (const line of written) expect(line, "a file path on stderr").not.toContain("/");
  });

  it("A2 — it exits 0, and independently of that it is neither a refusal nor a crash", () => {
    const child = CHILDREN.asciiClosedAt2;
    const status = productStatusOf(child);

    // (i) The ruled code — `ADR-0016`, confirming BA/PM's `## Ruling`. "0 when the session ran": it
    // ran, and the consumer's choice to stop consuming is not this session's failure.
    expect(status, "a closed reader is not a failure of this product").toBe(0);

    // (ii) THE HALF THAT BINDS EVEN IF THE RULING IS LATER REPLACED. If a fourth, SIGPIPE-shaped
    // code is ever adopted, (i)'s literal changes and this does not: a shell must be able to tell
    // this path from a refused command line and from a crashed session, which is exactly what the
    // delivered build could not do — it exited `1`, `USAGE_EXIT_CODE`, on both.
    expect(status, "`1` is USAGE_EXIT_CODE, a refused command line").not.toBe(1);
    expect(status, "`70` is INTERNAL_ERROR_EXIT_CODE, a bug that ended the session").not.toBe(70);

    // NOT killed by a signal, asserted on BOTH processes: the wrapper by name, and the product by
    // value — a shell reports a signal death as 128+n, so a status under 128 is that clause on the
    // process the criterion is actually about.
    expect(child.signal, "the wrapper was signalled").toBeNull();
    expect(status, "the product died of a signal").toBeLessThan(128);
  });

  it("A3 — the trigger is the RULE: any reader that closes before the session's last write", () => {
    // THE BOUNDARY, CROSS-CHECKED AGAINST A REAL STREAM rather than trusted from `frameHeight`'s
    // arithmetic alone. `CHILDREN.white` is a delivered session on a closed stdin, captured whole,
    // and its line count IS the total this criterion's close points are derived against. Without
    // this, a build whose frame grew by a row would leave `near` sampling the middle of the stream
    // and the "control" closing early, and every row below would still be green.
    // ONLY THE TRAILING EMPTY ELEMENT IS DROPPED, never every empty line: the frame's own message
    // region is blank rows, and filtering all empties silently shortened the stream by one and made
    // this cross-check disagree with `wc -l` — caught here, at this hop, by watching it red.
    const lines = CHILDREN.white.stdout.split("\n");
    const written = lines[lines.length - 1] === "" ? lines.slice(0, -1) : lines;
    expect(written, "the delivered session's whole output").toHaveLength(CLOSE_POINTS.total);
    expect(CLOSE_POINTS.near, "the last line before the total").toBe(CLOSE_POINTS.total - 1);
    expect(CLOSE_POINTS.far, "far from the boundary").toBeLessThan(CLOSE_POINTS.near);

    // FOUR CLOSE POINTS ON TWO GLYPH MODES. Both modes, because this is not an `--ascii` defect —
    // measured identically on the default; and both distances, because a guard that samples only
    // the boundary is the flaky one and one that samples only 2 lines misses a build that fixed
    // the common case. `grep -q` is NOT among them: it was measured 5/5 exit 0 and would ship a
    // guard that cannot go red.
    const CLOSING_EARLY = [
      ["--ascii, 2 lines", CHILDREN.asciiClosedAt2],
      [`--ascii, ${CLOSE_POINTS.near} lines`, CHILDREN.asciiClosedAt23],
      ["default glyphs, 2 lines", CHILDREN.defaultClosedAt2],
      [`default glyphs, ${CLOSE_POINTS.near} lines`, CHILDREN.defaultClosedAt23],
    ] as const;

    for (const [name, child] of CLOSING_EARLY) {
      expect(productStatusOf(child), `${name}: ${child.stderr}`).toBe(0);
      expect(child.stderr, `${name} wrote to stderr`).toBe("");
    }

    // THE CONTROL. A reader that takes the whole stream never goes away before the last write, so
    // it never reproduced and must not have changed: exit 0, stderr empty. It is what proves the
    // arm did not buy silence by making every session look successful.
    expect(productStatusOf(CHILDREN.fullRead), CHILDREN.fullRead.stderr).toBe(0);
    expect(CHILDREN.fullRead.stderr, "the full read wrote to stderr").toBe("");
  });

  it("A4 — the arm swallows NO real failure: 70 still means a crash and 1 still means a refusal", () => {
    // THE REGRESSION GUARD ON `ABC-043` `A3`, and the reason `A4` is a criterion rather than a test
    // note. A global `process.on("uncaughtException")`, a blanket `process.exitCode = 0`, or a
    // muted stderr each satisfy `A1` and `A2` in full and destroy the crash path the whole of
    // `ABC-043` `A3` and `[D31]` exist to guarantee. This is what stands between the ticket and
    // that build, and it re-reads the DELIVERED entry point's own children — zero new spawns.
    const crashed = CHILDREN.inputSeamThrows;
    expect(crashed.status, "an InputSeam that throws").toBe(70);
    expect(crashed.union, "the internal-error line").toMatch(/internal error/i);
    expect(crashed.stderr, "stderr was muted").not.toBe("");

    const refused = CHILDREN.badColour;
    expect(refused.status, "a refused command line").toBe(1);
    expect(usageLineOf(refused.stderr)).toContain(SEPARATOR_FORM);

    // AND THE CLEAN PATH IS STILL CLEAN: end-of-input exits 0 with the notice. Three codes, three
    // meanings, all three still distinguishable in the delivered build — which is `A8`'s first
    // branch measured rather than asserted in prose: `AGENTS.md` and `src/cli.ts`'s exit-code
    // docblock describe this build VERBATIM and neither is edited by this ticket.
    expect(CHILDREN.truncated.status, "end of input").toBe(0);
    expect(CHILDREN.truncated.stdout).toContain(INPUT_ENDED_NOTICE);
  });

  it("A9 — THE SESSION ENDS: stdin stays open behind the closed reader and the child still exits", () => {
    // THE ONLY ROW THAT KILLS A BARE SWALLOW, and the criterion is the BOUND, not a stopwatch.
    // `heldOpen` is built at module scope with `timeout: T_BOUND`; `childOf` THROWS on
    // `child.error`, so a build that never exits fails at construction with
    // `child /bin/sh failed to start: Error: spawnSync /bin/sh ETIMEDOUT` and this file does not
    // load at all. Reaching this line is therefore already the ENDING clause: the child came back.
    //
    // THE FIRST UNKNOWN THE TICKET HANDED THIS HOP was whether that timeout kill reports cleanly
    // through `childOf` inside vitest — it had only ever been run as shell commands. MEASURED: it
    // does, `status: null`, `signal: "SIGTERM"`, at the bound, 5/5. No criterion was weakened.
    expect(A9_BOUND_MS / 1000, "T_bound must be strictly under T_open").toBeLessThan(
      A9_OPEN_SECONDS,
    );
    expect(
      A9_SETTLE_SECONDS,
      "the settle the amendment measured flaky below 0.5 s",
    ).toBeGreaterThanOrEqual(0.5);

    const child = CHILDREN.heldOpen;
    // Non-vacuity: it exited because the SESSION ended, not because its input ran out — the writer
    // holds the FIFO for T_open (10 s) and the bound is T_bound (4 s), so an input-ended exit
    // cannot be what is being observed here. `A3` already covers end-of-input.
    expect(productStatusOf(child), `A9: ${child.stderr}`).toBe(0);
    expect(child.signal, "the wrapper was signalled").toBeNull();
    expect(child.stderr, "A9 wrote to stderr").toBe("");
  });

  it("A10 — a REAL write failure is not absorbed: the arm narrows to EPIPE and nothing wider", () => {
    // THE ONLY ROW THAT KILLS A WIDENED ARM, and it is `A9` one level down. `A9` exists because a
    // bare-swallow mutant passed every row there was; the arm's NARROWING clause — `ADR-0016`
    // clause 4, the central design decision of a 13-line production diff — was in the same position
    // until this row: deleting `code !== "EPIPE"` from the delivered arm left all 40 files, all
    // 1212 tests and all four mandatory gates GREEN. Measured twice, independently, by QE and by
    // BA/PM, on a copy of the tree outside the repository.
    //
    // WHAT THE MUTANT ACTUALLY DOES, because "the branch is untested" understates it: it writes no
    // board at all — the first frame write fails — and then tells the shell `0`. That is the
    // false-success end of the very exit-code contract this ticket was cut to make honest, and it
    // is worse than the defect being repaired, since `1` at least says something went wrong.
    //
    // NON-ZERO AND NON-EMPTY IS THE WHOLE ASSERTION, and the omissions are the criterion, not
    // laziness: no status literal, no errno name, no byte count, no stack shape. The delivered
    // status on this path is `1`, which is `USAGE_EXIT_CODE` — a collision this ticket neither
    // fixes nor endorses and which its `## Residual ruling` accepts knowingly, with a named cut
    // trigger. A row pinning `1` would pin that defect and would go red for the WRONG reason the
    // day a later ticket correctly routes non-`EPIPE` to `70`; this row stays green through that
    // change. Readings at this hop, for the record and NEVER as assertions: delivered
    // `NODE_EXIT=1` with ~1.5 kB of stderr whose caret sits on the delivered `throw error` itself
    // (`src/cli.ts:159` — so the branch is genuinely reached and is not dead code); the one-token
    // mutant `NODE_EXIT=0` with 0 bytes.
    //
    // IT DOES NOT GO RED AGAINST `main`, and a hop reporting it as if it did is wrong: `main`
    // installs no arm at all, so it dies loudly on this path and passes this row by accident. It
    // reds against the one-token mutant and against nothing else, which is where `A5`'s
    // watched-RED round for this row was run — the shape `A9` already set.
    const child = CHILDREN.unwritableStdout;
    const status = productStatusOf(child);

    // Non-vacuity, structural as in `A1`: `productStatusOf` THROWS if the marker is missing, so
    // reaching this line is already proof the product ran and exited rather than never starting.
    expect(status, "the product ran and reported a status").toBeTypeOf("number");
    expect(status, `a failed write was absorbed: ${JSON.stringify(child.stdout)}`).not.toBe(0);
    expect(child.stderr, "a failed write was absorbed silently").not.toBe("");
  });
});
