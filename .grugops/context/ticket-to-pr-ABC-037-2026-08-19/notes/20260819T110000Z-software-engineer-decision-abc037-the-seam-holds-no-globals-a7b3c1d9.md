---
id: 20260819T110000Z-software-engineer-decision-abc037-the-seam-holds-no-globals-a7b3c1d9
kind: decision
by: software-engineer
at: 2026-08-19T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-019
  - ABC-033
  - ABC-035
  - EPIC-003
  - src/line-input.ts
supersedes:
---

# The seam takes its streams as PARAMETERS and reaches for no global — the decision `A6` rests on

## The decision

`createLineInputSeam({ source, output, deps? })` in `src/line-input.ts`. **The module contains no
reference to `process`, `console`, `globalThis`, `Buffer` or any Node builtin import.** The stream it
reads and the stream it writes the prompt to are both injected, described by two small structural
interfaces (`LineSource`, `PromptOutput`) that `process.stdin` and `process.stdout` satisfy without an
adapter. `EPIC-006` supplies them at startup.

## Why, and it is not tidiness

`A6` asserts "the bytes this module writes are the prompt string only". Asserted against a module that
holds a reference to a global stream, that is a claim about a SPY. Asserted against a module that has
no such reference, it is a claim about the MODULE — there is no second channel to write down, so
there is nothing for a stream guard to miss. `ABC-035`'s QE (`G1`) proved that a `vi.spyOn` stream
guard is blind to four channels and to a `globalThis` flag; two of those five (a load-time-bound
`process.stdout.write`, and `fs.writeSync`) cannot be seen by ANY runtime spy. Removing the module's
ability to reach them is the only thing that closes them, and it is cheap.

**Precedent in this repository, not an invention:** `src/frame.ts` says of `process.stdout` that
"this module never reaches for it", and `FrameSink` is the same structural shape for the same reason.

## The four other rulings taken here, each with its loser

1. **No `try` and no `catch` anywhere in the file.** `ABC-019` `[D31]`, `EPIC-003`'s half, exactly as
   the ticket rules it. The loop's `A9b` repair-then-rethrow runs on the way out. `A5` is the
   criterion and mutant `M1` — wrapping the resolver call in `try`/`catch` returning `rejected` — is
   the build that passes every other criterion and fails only this one. It reds 2 tests.
2. **A trailing partial line at EOF is DISCARDED, not submitted.** `A3` requires `{ kind: "eof" }` for
   both end shapes, so `printf 'e4'` (no newline) into the pipe loses that move by design: the player
   never pressed Enter on it. This is a real cost and it is the criterion's choice, recorded here so
   nobody re-derives it as a bug. Mutant `M3` is the other option and it reds 2 tests.
3. **The source is left PAUSED between calls, and a chunk's surplus lines wait in the module's own
   queue.** `A2`'s "exactly one line per call" is only meaningful if the pipe still holds what was not
   asked for; where a single chunk overshoots there is no un-read, so the surplus is queued and served
   in order. The queue is bounded by ONE chunk (a `Readable`'s `highWaterMark`, 64 KiB by default)
   because the stream is paused before the first line of that chunk is returned.
4. **The cap is 1024 characters and an over-cap line is REJECTED, never truncated.** Truncating hands
   the resolver a prefix as if the player had typed it, and a 1024-character prefix of a flood can be
   a legal move. 1024 is three orders of magnitude above the longest line this prompt can want (the
   longest legal SAN is 7 characters, the longest command 5).

## What was refused

- **Any grammar or token table.** The line goes to `resolvePromptLine` (`src/command-input.ts:129`),
  which consults `ABC-035`'s table and then `ABC-033`'s dispatcher. `A4` is asserted by spy, and
  mutant `M8` — calling `resolveMoveInput` directly and skipping the table — reds 3 tests.
- **`node:readline`.** It buffers lines eagerly and would have made `A2`'s "still in the pipe" witness
  unanswerable, and it would have spent the one Node-builtin import the security threshold allows.
- **Any handling of an `error` event on the source.** Named as out of scope in the module header:
  process-level failure handling is `EPIC-006`'s, alongside the rethrown parser bug. A hanging read on
  a stream error is the honest residual and it is written down rather than papered over.
