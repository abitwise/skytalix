/**
 * ABC-037 — the production `InputSeam`: read one line, ask the dispatcher, answer the loop.
 *
 * THE HOLE `ABC-019` SHIPPED. `InputSeam = (history: GameHistory) => Promise<PromptOutcome>` is
 * published in merged code (`src/turn-loop.ts` `InputSeam`) with the comment
 * "`EPIC-003` replaces it"; until this module the only implementation was a scripted stub inside
 * `src/turn-loop.test.ts`. This is the real one, and it binds into `runTurnLoop({ input })` with no
 * adapter and no cast.
 *
 * IT CONTAINS NO GRAMMAR AND NO TOKEN TABLE. One submitted line goes to the per-session resolver
 * `createPromptLineResolver` returns (`src/command-input.ts`, `ABC-046` — it holds the `quit`
 * confirmation flag and nothing else), which delegates to `resolvePromptLine`: `ABC-035`'s command
 * table first, anything else to `ABC-033`'s dispatcher. The classification ORDER is delegated, not
 * duplicated: a second copy of it here is a second thing to get wrong, and `A4` is asserted by spy
 * for exactly that reason.
 *
 * IT CATCHES NOTHING, AND THAT IS THE TICKET'S RULING RATHER THAN AN OMISSION (`ABC-019` `[D31]`,
 * `EPIC-003`'s half). There is no `try` in this file. A throw from below is by construction a defect
 * — `parseSan` is total by `ADR-0004` (2a) and `ABC-031` `A4` requires the same of the coordinate
 * reader — so catching it and returning `rejected` would teach the player a false rule and hide a
 * real bug, and catching it and terminating would be byte-identical to `A8`'s clean end-of-input.
 * The loop's `A9b` repair (`src/turn-loop.ts`, `runTurnLoop`'s `A9b` arm) runs on the way out and
 * rethrows; what the top-level handler prints is `EPIC-006`'s half and is not decided here.
 *
 * IT REACHES FOR NOTHING. No `process`, no `console`, no Node builtin import, no dynamic import, no
 * `eval`, no `Function`, no `globalThis`. The source stream and the prompt's output are PARAMETERS,
 * the same posture `src/frame.ts` takes about `process.stdout` ("this module never reaches for it"),
 * and `EPIC-006` supplies `process.stdin` / `process.stdout` at startup. That is not tidiness: it is
 * what makes `A6`'s "the bytes this module writes are the prompt string only" a property of the
 * module rather than of a spy — a module with no reference to a global stream has no second channel
 * to write down, so there is nothing for a stream guard to miss.
 *
 * IT EMITS NO CURSOR CONTROL. `PROMPT_ROWS = 1` (`src/frame.ts:53`) is the frame's reserved last
 * row, deliberately unpadded, and the in-place writer leaves the cursor at its start; this module
 * writes `PROMPT` into that position and nothing else. A reader that emitted its own cursor moves
 * would corrupt the single erase-to-end operation epic acceptance `4b` rests on.
 *
 * ONE LINE PER CALL, THE REST STAYS UNREAD, AND EOF IS AN OUTCOME — properties of the reader,
 * which `ABC-200` moved into `src/line-reader.ts` unchanged, so that the startup questions and this
 * seam share one reader per stream. A trailing partial line is still not a submission: on end of
 * input this seam returns `{ kind: "eof" }`, the loop then writes `INPUT_ENDED_NOTICE`
 * (`src/turn-loop.ts` `INPUT_ENDED_NOTICE`) and returns `exitCode: 0`, which `ABC-019` ruled and
 * this module does not re-decide.
 *
 * WHAT IS DELIBERATELY ABSENT: tab completion (`ABC-038`), raw mode, arrow keys and input-history
 * recall (`EPIC-003` § Out of scope, and coding rules 5 and 7); any handling of an `error` event on
 * the source, which is a process-level concern `EPIC-006` owns along with the rethrown parser bug.
 */

import { createPromptLineResolver } from "./command-input.ts";
import type { GameHistory } from "./history.ts";
import { type LineSource, lineReaderOf, MAX_LINE_LENGTH } from "./line-reader.ts";
import type { MoveInputDeps } from "./move-input.ts";
import type { InputSeam, PromptOutcome } from "./turn-loop.ts";

/**
 * What is written into the frame's reserved prompt row. Two bytes, both printable, no escape and no
 * CSI introducer — `A6` asserts that over the whole written stream rather than trusting this line.
 */
export const PROMPT = "> ";

/**
 * The input cap of one submitted line, in UTF-16 code units — `src/line-reader.ts` states it and
 * why. Re-exported, so no importer of this module changes.
 */
export { type LineSource, MAX_LINE_LENGTH };

/**
 * What an over-cap line reports. Short by construction, for the reason `ABC-035`'s help is: the
 * message region is bounded BY the frame's `W` and never widens it, and `W` is 18 at the narrowest
 * board-only frame. Both items are 13 and 14 columns.
 */
export const LINE_TOO_LONG_MESSAGES: readonly string[] = [
  "line too long",
  `max ${MAX_LINE_LENGTH} chars`,
];

/**
 * Where the prompt goes. The same shape as `FrameSink.write` and deliberately NOT that type: this
 * module must never be handed the loop's frame sink, and `A6` counts the writes it did not make to
 * it. `process.stdout` satisfies it.
 */
export interface PromptOutput {
  write(text: string): void;
}

export interface LineInputOptions {
  readonly source: LineSource;
  readonly output: PromptOutput;
  /**
   * `ABC-033`'s test seam, passed straight through to the resolver and never called from this
   * module. It is what lets `A4`, `A5` and `A7` spy a call count without a hoisted `vi.mock`,
   * which is what keeps this ticket at one test file.
   */
  readonly deps?: MoveInputDeps;
}

/**
 * Build the seam. It reads through the source's ONE reader (`lineReaderOf`), so a seam built after
 * the startup questions continues the same stream where they stopped.
 */
export function createLineInputSeam(options: LineInputOptions): InputSeam {
  const { source, output, deps } = options;
  // ONE per seam, so the `quit` confirmation is this session's and no other's (`ABC-046`).
  const resolve = createPromptLineResolver(deps);
  const reader = lineReaderOf(source);

  return async (history: GameHistory): Promise<PromptOutcome> => {
    output.write(PROMPT);
    const line = await reader.read();
    if (line === null) return { kind: "eof" };
    if (line.overlong) {
      resolve.disarm();
      return { kind: "rejected", messages: LINE_TOO_LONG_MESSAGES };
    }
    return resolve(history, line.text);
  };
}
