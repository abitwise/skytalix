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
 * IT PRINTS A BOARD. IT DOES NOT PLAY A GAME, and the ticket says so before its title can be
 * misread: no move can be typed here. The production `InputSeam` is `ABC-037` and no `EngineSeam`
 * implementation exists, so `runTurnLoop` is `ABC-043`'s. This writes ONE frame and exits.
 *
 * THE TWO HANDLES, AND THE RULE THEY OBEY. Only this module may acquire `process.stdout` or
 * `process.stderr` as a WRITABLE HANDLE, and only `process.stdout` is ever passed onward — as the
 * injected `FrameSink`, which is the only shape `beginFrameSession` accepts (`A9`). Nothing below
 * this file writes on either channel; `beginGlyphModeSession` is the one merged module that reads
 * ambient signals, and it reads them, once, without writing.
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
 * IT NAMES NO ROW COUNT (`ADR-0009` clause 9a, `A8`): `beginFrameSession` is called exactly once,
 * with the first frame's own `.length`, which is why the frame is built before the session begins.
 *
 * THERE IS NO EXPORTED START POSITION UNDER `src/` — measured; every test file defines its own
 * `START_FEN` — so the literal below is held here rather than promoted into a merged module, which
 * would be a change this ticket is not licensed to make.
 */

import { resolveOptions } from "./cli-options.ts";
import { beginFrameSession } from "./frame.ts";
import { beginGlyphModeSession } from "./glyph-mode.ts";
import { gameStatusOf, newGame } from "./history.ts";
import { makeRenderSeam } from "./render-seam.ts";

/** The standard start position, in the spelling every test file in this repository uses. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** What a human is shown when their command line is refused. It names the real command. */
const USAGE = "usage: npm run chess [--colour white|black|random] [--ascii | --unicode]";

/** A refused command line is a failure, and the shell is told so. Nothing here calls `exit`. */
const USAGE_EXIT_CODE = 1;

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

function main(): void {
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

  const { orientation, flags } = resolution.options;
  const mode = beginGlyphModeSession(flags)();
  const history = newGame(START_FEN);
  const frame = makeRenderSeam(mode, orientation)(history, gameStatusOf(history), false, []);

  beginFrameSession(process.stdout, frame.length)(frame);
}

main();
