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
 * ONE LINE PER CALL, AND THE REST STAYS UNREAD. The source is left PAUSED between calls and resumed
 * for the duration of one read, so a script's later lines are still in the pipe when the loop has
 * not asked for them yet (`A2`). A reader that drains stdin passes every content assertion and eats
 * the player's next move. When a single chunk overshoots — the pipe hands over three lines at once
 * and there is no un-read — the surplus waits in this module's own queue and is served, in order, to
 * the calls that ask for it; the stream is paused before the first of them returns, so that queue is
 * bounded by ONE chunk (a Node `Readable`'s `highWaterMark`, 64 KiB by default) and never by the
 * writer's total.
 *
 * EOF IS AN OUTCOME, NEVER AN ERROR, AND A TRAILING PARTIAL LINE IS NOT A SUBMISSION. `A3` requires
 * `{ kind: "eof" }` for BOTH end shapes — ended with no trailing newline, and ended mid-line — so
 * text held when the stream ends is discarded rather than resolved. The player never pressed Enter
 * on it. The loop then writes `INPUT_ENDED_NOTICE` (`src/turn-loop.ts` `INPUT_ENDED_NOTICE`) and
 * returns `exitCode: 0`, which `ABC-019` ruled and this module does not re-decide.
 *
 * WHAT IS DELIBERATELY ABSENT: tab completion (`ABC-038`), raw mode, arrow keys and input-history
 * recall (`EPIC-003` § Out of scope, and coding rules 5 and 7); any handling of an `error` event on
 * the source, which is a process-level concern `EPIC-006` owns along with the rethrown parser bug.
 */

import { createPromptLineResolver } from "./command-input.ts";
import type { GameHistory } from "./history.ts";
import type { MoveInputDeps } from "./move-input.ts";
import type { InputSeam, PromptOutcome } from "./turn-loop.ts";

/**
 * What is written into the frame's reserved prompt row. Two bytes, both printable, no escape and no
 * CSI introducer — `A6` asserts that over the whole written stream rather than trusting this line.
 */
export const PROMPT = "> ";

/**
 * The input cap of one submitted line, in **UTF-16 CODE UNITS**. **1024.**
 *
 * The unit is `String.prototype.length`'s, not the character's, and the difference is real rather
 * than pedantic: every astral-plane character is a surrogate PAIR, so a line of emoji or of
 * historic script caps at **512** of them. That is the honest statement of what the check counts
 * and it is deliberately not "fixed" by counting code points — this is a MEMORY bound and UTF-16
 * code units are the unit memory is actually spent in.
 *
 * The number is this ticket's to pick and it is stated here and in the test rows. It is a MEMORY
 * bound, not a parsing one: `ABC-031` `A4` and `ABC-032` `A5` already require totality on a
 * 10,000-character string, so the resolvers would survive a long line — what they would not survive
 * is a writer that never sends a newline, which without a cap grows one string until the process
 * dies. 1024 is three orders of magnitude above the longest line a chess prompt can want (the
 * longest legal SAN is 7 characters, the longest command 5) and small enough that a hostile pipe
 * buys nothing.
 *
 * Over the cap the line is REJECTED, never truncated: a truncated line would be handed to the
 * resolver as if the player had typed it, and a 1024-character prefix of a flood can be a legal
 * move. It never reaches a resolver and it never grows the frame — `rejected` is one of `ABC-019`'s
 * four non-advancing outcomes and its messages travel through `assembleFrame`'s sanitizer
 * (`src/frame.ts:123`) inside the bounded message region. It is still a line the player submitted,
 * so it clears the `quit` confirmation (`ADR-0021` clause 6) through the wrapper's `disarm`, which
 * takes no line — the over-cap text still reaches no resolver.
 */
export const MAX_LINE_LENGTH = 1024;

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
 * The stream this module reads, described by the four members it uses and nothing else.
 *
 * A structural interface rather than an import of `node:stream`: `process.stdin` satisfies it, a
 * test can satisfy it with twenty lines, and the delivered module imports no Node builtin at all —
 * which is one of the three things this ticket's security threshold is measured on.
 */
export interface LineSource {
  on(event: "data", listener: (chunk: string | Uint8Array) => void): unknown;
  on(event: "end", listener: () => void): unknown;
  off(event: "data", listener: (chunk: string | Uint8Array) => void): unknown;
  off(event: "end", listener: () => void): unknown;
  pause(): unknown;
  resume(): unknown;
  /** Node's `Readable` sets it once `end` has fired; absent on a source that cannot have ended. */
  readonly readableEnded?: boolean;
}

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

/** One completed line. `overlong` is the cap verdict, carried rather than re-derived from `text`. */
interface SubmittedLine {
  readonly text: string;
  readonly overlong: boolean;
}

/**
 * Build the seam. One reader's state per call to this function, so two seams over two sources do not
 * share a buffer.
 */
export function createLineInputSeam(options: LineInputOptions): InputSeam {
  const { source, output, deps } = options;
  // ONE per seam, so the `quit` confirmation is this session's and no other's (`ABC-046`).
  const resolve = createPromptLineResolver(deps);
  const decoder = new TextDecoder("utf-8");

  /** Completed lines a chunk overshot by, in order. Bounded by one chunk — see the header. */
  const queued: SubmittedLine[] = [];
  /** The line being typed. Held at or below the cap: over it, `overlong` is set and this is freed. */
  let pending = "";
  let overlong = false;
  let ended = false;
  /** Set while a read is in flight, so `end` can answer a waiter that `data` never will. */
  let waiting: ((line: SubmittedLine | null) => void) | undefined;

  const absorb = (text: string): void => {
    if (overlong) return; // already over the cap: the rest of this line is not kept at all
    pending += text;
    // ONE character of slack, and it is the carriage return's. `absorb` is the MEMORY bound and it
    // runs before the terminator is known, so a `\r\n` line at exactly the cap is still one
    // character short of its own terminator here; `completeLine` gives the cap verdict once the
    // `\r` has been stripped and the line's real length is known. Capping at `MAX_LINE_LENGTH`
    // here made the effective cap 1023 on a Windows pipe.
    if (pending.length > MAX_LINE_LENGTH + 1) {
      overlong = true;
      pending = "";
    }
  };

  const completeLine = (): void => {
    // `\r\n` from a Windows pipe: the carriage return is part of the terminator, not of the line.
    const text = pending.endsWith("\r") ? pending.slice(0, -1) : pending;
    // The cap verdict, on the line WITHOUT its terminator. `overlong` may already be set by
    // `absorb`'s memory bound, which never un-sets here.
    queued.push({ text, overlong: overlong || text.length > MAX_LINE_LENGTH });
    pending = "";
    overlong = false;
  };

  const onData = (chunk: string | Uint8Array): void => {
    const text = typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
    let start = 0;
    for (;;) {
      const newline = text.indexOf("\n", start);
      if (newline === -1) {
        absorb(text.slice(start));
        break;
      }
      absorb(text.slice(start, newline));
      completeLine();
      start = newline + 1;
    }
    if (queued.length > 0) deliver(queued.shift() as SubmittedLine);
  };

  const onEnd = (): void => {
    ended = true;
    // `A3`: BOTH end shapes are `eof`. Text held when the stream ends was never submitted — the
    // player did not press Enter on it — so it is dropped rather than resolved as a line.
    pending = "";
    overlong = false;
    if (waiting !== undefined) deliver(null);
  };

  function deliver(line: SubmittedLine | null): void {
    const resolve = waiting;
    if (resolve === undefined) return;
    waiting = undefined;
    source.off("data", onData);
    source.pause();
    resolve(line);
  }

  // Attached ONCE, for the session. `end` fires exactly once, and a listener attached per read would
  // be detached before it ever fired and the next read would wait forever. `end` does not flow a
  // paused stream; only the `data` listener does, and that one is attached per read.
  source.on("end", onEnd);
  source.pause();

  const readLine = (): Promise<SubmittedLine | null> => {
    const carried = queued.shift();
    if (carried !== undefined) return Promise.resolve(carried);
    if (ended || source.readableEnded === true) return Promise.resolve(null);
    return new Promise<SubmittedLine | null>((resolve) => {
      waiting = resolve;
      source.on("data", onData);
      source.resume();
    });
  };

  return async (history: GameHistory): Promise<PromptOutcome> => {
    output.write(PROMPT);
    const line = await readLine();
    if (line === null) return { kind: "eof" };
    if (line.overlong) {
      resolve.disarm();
      return { kind: "rejected", messages: LINE_TOO_LONG_MESSAGES };
    }
    return resolve(history, line.text);
  };
}
