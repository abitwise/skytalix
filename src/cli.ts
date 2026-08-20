/**
 * `ABC-042` — the entry point: the one place that reads `process.argv`, the one place that supplies
 * `process.stdout` as a `FrameSink`, and the first command in this repository's history that puts a
 * chess board in front of a human (`npm run chess`).
 *
 * IT EXPORTS NOTHING (`ADR-0011` clause 4, `A2`). Nothing can import a binding from it, so it is
 * never on the frame path and never a probe root, and the census moves exactly as clause 4 predicted:
 * production 18 -> 20, entry points 1 -> 2, frame producers 6 unchanged. Everything that could be
 * unit-tested was moved OUT, into `src/cli-options.ts`; what is left is composition, and composition
 * is proved by running the command as a child (`A1`).
 *
 * `ABC-043` — IT NOW PLAYS A GAME. The sentence that stood here said it prints a board and does not
 * play one; `runTurnLoop` (`ABC-019`), the production `InputSeam` (`ABC-037`) and the real
 * `EngineSeam` (`ABC-078`) are all merged, and this is the one place that wires them. Six options,
 * one call, no adapter and no cast (`A1`). The frame session belongs to the loop now: this module
 * hands it `process.stdout` as the `FrameSink` and calls `beginFrameSession` nowhere — which is what
 * keeps `A6`'s "exactly once" a property of merged code rather than of a second call site here.
 *
 * THE INPUT SEAM IS BUILT ONCE AND CALLED NOWHERE (`G6`, `ABC-037`'s QE hop, on the ticket under
 * `## Scope`). `createLineInputSeam`'s `waiting` is a SINGLE SLOT, so two overlapping `seam()` calls
 * orphan the first read forever and the product hangs with no output and no exit code. The loop
 * awaits the seam before calling it again, so the merged sequencing is safe; a build that
 * "helpfully" pre-reads a line here would hang. It is constructed, passed, and never invoked.
 *
 * THE OPPONENT IS THE MERGED ENGINE AT ITS MERGED BUDGET — `createEngine({ budgetMs:
 * DEFAULT_BUDGET_MS })`, no new number, no `--difficulty`, no flag (`ADR-0013`: no placeholder
 * opponent ships, and none is needed now that a real one exists).
 *
 * THE ONE `try`/`catch` IN THIS PRODUCT is below, around the whole session. `ABC-019`'s input arm
 * repairs the borrowed board and RETHROWS (`turn-loop.ts:293-309`), and `ABC-037` catches nothing,
 * so a parser bug arrives here — `ABC-019` `[D31]`'s second half, ruled on this ticket: it ends the
 * game, loudly, as an internal error that is never a chess outcome, and the process exits NON-ZERO.
 * EXIT CODES, once for the whole product: `LoopOutcome.exitCode` verbatim for everything the loop
 * returns (the type is `0` and only `0`, `engine-threw` and `engine-failure` INCLUDED — the loop
 * handled those, and what distinguishes them from a real game is the message, `ABC-044`'s `A3`);
 * non-zero for exactly two things, a usage error before the game starts and an exception that never
 * became a `LoopOutcome`.
 *
 * THE HANDLES, AND THE RULE THEY OBEY. Only this module may acquire `process.stdout`,
 * `process.stderr` or `process.stdin`, and `process.stdout` is passed onward twice — as the loop's
 * `FrameSink` and as the prompt's `PromptOutput`, the two shapes merged code accepts (`A9`). It is
 * read ONCE, into `sink`, so this module still names the handle a single time. `process.stdin` is
 * `ABC-043`'s addition and it is passed only as `createLineInputSeam`'s `LineSource`: the reader
 * imports no Node builtin and reaches for nothing, by its own header, and this is where the stream
 * it reads is supplied. Nothing below this file writes on either output channel.
 *
 * THE REJECTION PATH IS STDERR, WHICH IS THIS ENGINEER'S CHOICE UNDER `A6`'s EXPLICIT LICENCE, and
 * the consequence Architect/Design attached to that choice is honoured above: the handle is acquired
 * here and nowhere else. A rejection writes NO frame row on either channel, exits non-zero, and
 * never reaches `beginGlyphModeSession` — so `selectGlyphMode` is not called and the merged
 * `(true, true)` fail-safe row keeps its one home.
 *
 * THE ECHOED TOKEN IS FILTERED HERE (security bar 3). `printableOf` is this module's own byte
 * filter, deliberately NOT `assembleFrame`'s `sanitize`: that one is module-private and its only
 * public route composes a whole frame, which the rejection paths forbid. It drops C0 and `U+007F` —
 * `\x1b` among them — and deliberately does NOT drop code points above `U+007F`, because a rejection
 * message is not a frame and turning a human's `--colour <chess knight glyph>` into `--colour ?`
 * would corrupt the one diagnostic they get.
 *
 * IT NAMES NO ROW COUNT (`ADR-0009` clause 9a, `ABC-042` `A8`, `ABC-043` `A6`): the loop derives the
 * session height from the first frame's own `.length` and this module supplies neither a height nor
 * a count.
 *
 * THERE IS NO EXPORTED START POSITION UNDER `src/` — measured; every test file defines its own
 * `START_FEN` — so the literal below is held here rather than promoted into a merged module, which
 * would be a change this ticket is not licensed to make.
 */

import { resolveOptions } from "./cli-options.ts";
import { createEngine, DEFAULT_BUDGET_MS } from "./engine.ts";
import { beginGlyphModeSession } from "./glyph-mode.ts";
import { newGame } from "./history.ts";
import { createLineInputSeam } from "./line-input.ts";
import { makeRenderSeam } from "./render-seam.ts";
import { renderResultScreen } from "./result-screen.ts";
import { runTurnLoop } from "./turn-loop.ts";

/** The standard start position, in the spelling every test file in this repository uses. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * What a human is shown when their command line is refused. THE `--` IS LOAD-BEARING, NOT NOISE:
 * without it the package runner eats the flag as its own, so the line would teach the reader the
 * command he was just refused for (`ABC-066`). Every form it advertises was run before it was
 * printed. Do not tidy the separator away.
 */
const USAGE = "usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]";

/** A refused command line is a failure, and the shell is told so. Nothing here calls `exit`. */
const USAGE_EXIT_CODE = 1;

/**
 * What a human is shown when an exception leaves the session — `[D31]`'s ruling, as a string.
 *
 * IT NAMES NO CHESS RESULT, and that is the criterion (`A3`(ii)) rather than a style choice: it
 * carries none of the ten `TerminalReason` values and none of the words `win`, `draw`, `resign`,
 * `checkmate`, `stalemate`. A result screen that presented a parser bug as a chess outcome is
 * exactly what `ABC-019` `A10` forbids, enforced here at the top level.
 *
 * THE THROWN VALUE IS DELIBERATELY NOT ECHOED, and the trade is recorded rather than hidden: a bug's
 * own message is written by the code that broke, so echoing it would make `A3`(ii) a property of
 * that message instead of of this build — one `throw new Error("checkmate detection failed")`
 * anywhere below and the product reports a chess word on its crash path. The exit code and this
 * line are what the human gets; the stack belongs to whoever debugs the bug, and no criterion on
 * this page asks for it.
 */
const INTERNAL_ERROR = "internal error: a bug ended this session, and it is not a chess outcome";

/**
 * The other non-zero exit, and the only other one. `70` is `sysexits.h`'s `EX_SOFTWARE` — "an
 * internal software error has been detected" — chosen over a bare `2` so that a shell can tell a
 * refused command line (`1`) from a crashed session at all: both are non-zero, and `A4` is
 * distinguishable from `A3` by message AND by exit code, which leaves nothing to carry this one.
 */
const INTERNAL_ERROR_EXIT_CODE = 70;

/**
 * Drop what must not reach a terminal: C0 controls (`\x1b` included) and `U+007F`. Same shape as
 * `src/frame.ts`'s private `sanitize`, minus the glyph-mode arm — see the docblock.
 */
function printableOf(text: string): string {
  let kept = "";
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) continue;
    kept += character;
  }
  return kept;
}

async function main(): Promise<void> {
  const resolution = resolveOptions(process.argv.slice(2));

  if (!resolution.ok) {
    process.stderr.write(
      `${resolution.problem}: ${resolution.offending.map(printableOf).join(" ")}\n${USAGE}\n`,
    );
    // NOT `process.exit()`. On macOS a pipe is an asynchronous stream, and exiting on the spot
    // truncates what was just written — the message the human is meant to read.
    process.exitCode = USAGE_EXIT_CODE;
    return;
  }

  const { colour, orientation, flags } = resolution.options;
  const mode = beginGlyphModeSession(flags)();
  // Read ONCE and passed twice: the loop's `FrameSink` and the prompt's `PromptOutput` are two
  // shapes over one handle, and `A9`'s "acquired once, in the entry point" is about the acquisition.
  const sink = process.stdout;
  // `ABC-115` / `ADR-0016` clauses 3-4. WHOEVER ACQUIRES A STREAM OWNS ITS ERROR POLICY, so the arm
  // is installed HERE — before the handle is handed on — and never at any of the five write sites.
  // `EPIPE` means the reader went away: not this product's failure, so nothing is written and the
  // session ENDS (`process.stdin.destroy()` drives the delivered end-of-input transition, whose
  // `LoopOutcome.exitCode` is 0 and flows through the ONE existing assignment below — no second
  // exit-status site). A BARE SWALLOW IS THE MEASURED WRONG FIX: it passes the silence and the
  // status and leaves the game running into a dead pipe, which is what `A9` exists to red.
  // Every other code is RE-THROWN: an unmeasured stdout failure (`ENOSPC`, `EIO`) behaves exactly
  // as it does today rather than being absorbed by a listener installed for something else.
  sink.on("error", (error) => {
    if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
    process.stdin.destroy();
  });
  // HELD RATHER THAN PASSED ANONYMOUSLY (`ABC-044`). The result screen is a pure function of the
  // loop's `LoopOutcome` AND of the game that was played, so the entry point is the one place that
  // holds both once the loop has returned. It is still the merged factory's own value and it is
  // still constructed exactly once — `ABC-043` `A1`'s row is pinned on this line now.
  const history = newGame(START_FEN);

  try {
    const outcome = await runTurnLoop({
      history,
      humanColour: colour,
      render: makeRenderSeam(mode, orientation),
      // BUILT HERE, CALLED NOWHERE — `G6`'s single-caller precondition. See the module header.
      input: createLineInputSeam({ source: process.stdin, output: sink }),
      engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
      sink,
    });

    // `ABC-044` — THE RESULT SCREEN, AFTER THE LAST FRAME, IN ONE WRITE. It is NOT a frame: it goes
    // to the same sink the loop wrote its frames to, with no session, no height and no padding, and
    // `INPUT_ENDED_NOTICE` (`src/turn-loop.ts:312`) is the merged precedent for that. The renderer
    // returns ZERO rows on end of input, and the guard turns that into ZERO BYTES rather than a
    // stray newline — the loop has already written the notice and a second line would double-report.
    const screen = renderResultScreen(outcome, history);
    if (screen.length > 0) sink.write(`${screen.join("\n")}\n`);

    // VERBATIM, and the assignment is the rule rather than a formality: `LoopOutcome.exitCode` is
    // typed `0` and only `0`, so a build that computed an exit code from `reason` would be inventing
    // a signal `ABC-019` deliberately did not put there.
    process.exitCode = outcome.exitCode;
  } catch {
    // `[D31]`'s second half. NOT `process.exit()` — same reason the usage path gives: on macOS a
    // pipe is asynchronous and exiting on the spot truncates the line the human is meant to read.
    process.stderr.write(`${INTERNAL_ERROR}\n`);
    process.exitCode = INTERNAL_ERROR_EXIT_CODE;
  }
}

main();
