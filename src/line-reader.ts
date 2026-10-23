/**
 * `ABC-200` — `ABC-037`'s line reader, moved out of `src/line-input.ts` unchanged in behaviour, so
 * that the startup questions and the game's prompt read ONE stream through ONE reader.
 *
 * ONE READER PER SOURCE. `lineReaderOf` memoizes by the source object, so every caller that names
 * the same stream shares one decoder, one partial line, one overshoot queue and one `waiting` slot.
 * A second private reader over the same stream would keep the lines a chunk overshot by in ITS
 * queue, and the next caller would never see them: on `black\n1\ne5\n` in one chunk the questions
 * would take `black` and `1` and the game's first prompt would read end of input instead of `e5`
 * (`ABC-200` `A7`, plant `P6`). The single `waiting` slot is safe only while callers take turns:
 * the questions are awaited before the loop starts, and the loop awaits each read before the next.
 *
 * WHY A MODULE OF ITS OWN rather than one more export of `src/line-input.ts`: `src/cli.test.ts`'s
 * `inputSeamThrows` child substitutes `./line-input.ts` with a double that exports only
 * `createLineInputSeam`, so any module the entry point loads that imported a new name from there
 * would fail at link time.
 *
 * ONE LINE PER CALL, AND THE REST STAYS UNREAD. The source is left PAUSED between calls and resumed
 * for the duration of one read, so a script's later lines are still in the pipe when the loop has
 * not asked for them yet (`ABC-037` `A2`). A reader that drains stdin passes every content assertion
 * and eats the player's next move. When a single chunk overshoots — the pipe hands over three lines
 * at once and there is no un-read — the surplus waits in this reader's own queue and is served, in
 * order, to the calls that ask for it; the stream is paused before the first of them returns, so
 * that queue is bounded by ONE chunk (a Node `Readable`'s `highWaterMark`, 64 KiB by default) and
 * never by the writer's total.
 *
 * EOF IS AN OUTCOME, NEVER AN ERROR, AND A TRAILING PARTIAL LINE IS NOT A SUBMISSION. `ABC-037` `A3`
 * requires end of input for BOTH end shapes — ended with no trailing newline, and ended mid-line —
 * so text held when the stream ends is discarded rather than resolved. The player never pressed
 * Enter on it.
 *
 * IT REACHES FOR NOTHING AND CATCHES NOTHING, as `src/line-input.ts` does not: no Node builtin
 * import, no ambient stream, no error listener, no `try`. The source is a parameter.
 */

/**
 * The input cap of one submitted line, in **UTF-16 CODE UNITS**. **1024.**
 *
 * The unit is `String.prototype.length`'s, not the character's, and the difference is real rather
 * than pedantic: every astral-plane character is a surrogate PAIR, so a line of emoji or of
 * historic script caps at **512** of them. That is the honest statement of what the check counts
 * and it is deliberately not "fixed" by counting code points — this is a MEMORY bound and UTF-16
 * code units are the unit memory is actually spent in.
 *
 * The number is `ABC-037`'s to pick and it is stated here and in the test rows. It is a MEMORY
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
 * The stream this module reads, described by the four members it uses and nothing else.
 *
 * A structural interface rather than an import of `node:stream`: `process.stdin` satisfies it, a
 * test can satisfy it with twenty lines, and the delivered module imports no Node builtin at all —
 * which is one of the three things `ABC-037`'s security threshold is measured on.
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

/** One completed line. `overlong` is the cap verdict, carried rather than re-derived from `text`. */
export interface SubmittedLine {
  readonly text: string;
  readonly overlong: boolean;
}

/** The source's one reader. `null` is end of input. */
export interface LineReader {
  read(): Promise<SubmittedLine | null>;
}

/** One reader per source, for the life of the source. Weak, so a dropped source frees its reader. */
const readers = new WeakMap<LineSource, LineReader>();

/** The reader of this source: built on the first call, the same object on every later one. */
export function lineReaderOf(source: LineSource): LineReader {
  const known = readers.get(source);
  if (known !== undefined) return known;
  const reader = createLineReader(source);
  readers.set(source, reader);
  return reader;
}

function createLineReader(source: LineSource): LineReader {
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
    // `ABC-037` `A3`: BOTH end shapes are end of input. Text held when the stream ends was never
    // submitted — the player did not press Enter on it — so it is dropped rather than resolved.
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

  // Attached ONCE, for the source. `end` fires exactly once, and a listener attached per read would
  // be detached before it ever fired and the next read would wait forever. `end` does not flow a
  // paused stream; only the `data` listener does, and that one is attached per read.
  source.on("end", onEnd);
  source.pause();

  return {
    read(): Promise<SubmittedLine | null> {
      const carried = queued.shift();
      if (carried !== undefined) return Promise.resolve(carried);
      if (ended || source.readableEnded === true) return Promise.resolve(null);
      return new Promise<SubmittedLine | null>((resolve) => {
        waiting = resolve;
        source.on("data", onData);
        source.resume();
      });
    },
  };
}
