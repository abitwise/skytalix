/**
 * `ABC-200` — the startup questions. On a terminal, a flag the command line left out is asked for,
 * colour first, then difficulty, before the first frame. Enter keeps today's default.
 *
 * IT ASKS ONLY ON A TERMINAL. Both the source and the output must say `isTTY === true`; otherwise
 * this returns the parsed options untouched, with 0 reads and 0 writes, and never builds a reader —
 * so a pipe behaves byte for byte as it did before (scope 6). The flag is read off the objects it is
 * handed, so the entry point reads no `isTTY` of its own.
 *
 * IT READS THROUGH THE SOURCE'S ONE READER (`lineReaderOf`), the same one the game's prompt reads
 * through afterwards, so lines typed ahead or pasted in one chunk are consumed in order: the
 * questions take exactly the lines they need and the game's first prompt reads the next (scope 7,
 * `A7`). The caller awaits this before the loop starts, which is what keeps the reader's single
 * `waiting` slot to one caller at a time.
 *
 * THE ACCEPTED ANSWERS ARE THE FLAGS' OWN VALUES, imported, matched by exact equality after trimming
 * (and, for the colour, lower-casing). An empty line keeps what the command line resolved to with
 * the flag absent — `white`, and `DEFAULT_DIFFICULTY` — so no default is spelled a second time here.
 * The result is built by `optionsFor`, so an answered `random` is `--colour random`'s coin.
 *
 * A WRONG ANSWER is one line naming the accepted answers and echoing what was typed, then the same
 * question again; there is no retry cap, because end of input ends it. The echo drops C0 and `U+007F`
 * — this module's own copy of the entry point's `printableOf`, which stays there. An over-cap line is
 * a wrong answer with an empty echo: the reader keeps no text past the cap.
 *
 * END OF INPUT AT A QUESTION resolves `null`, and the entry point ends the session with exit `0`.
 *
 * IT REACHES FOR NOTHING: no ambient handle, no Node builtin, no error listener (`ADR-0016` clause
 * 3), no cursor control, no `try`.
 */

import {
  COLOUR_VALUES,
  type ColourValue,
  DIFFICULTY_VALUES,
  type Difficulty,
  optionsFor,
  type Resolution,
  type ResolvedOptions,
} from "./cli-options.ts";
import { type LineReader, type LineSource, lineReaderOf } from "./line-reader.ts";

/** Where the questions go: a writer that may say it is a terminal. */
interface QuestionOutput {
  write(text: string): void;
  readonly isTTY?: boolean;
}

/** Drop C0 controls (`\x1b` included) and `U+007F` from an echoed answer. */
function printableOf(text: string): string {
  let kept = "";
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) continue;
    kept += character;
  }
  return kept;
}

/**
 * Ask one question until an answer is accepted. `choose` gets the trimmed line and returns the
 * value, or `undefined` for a wrong answer. `null` is end of input.
 */
async function ask<T>(
  reader: LineReader,
  output: QuestionOutput,
  question: string,
  accepted: string,
  choose: (answer: string) => T | undefined,
): Promise<T | null> {
  for (;;) {
    output.write(question);
    const line = await reader.read();
    if (line === null) return null;
    const chosen = line.overlong ? undefined : choose(line.text.trim());
    if (chosen !== undefined) return chosen;
    const echo = line.overlong ? "" : printableOf(line.text);
    output.write(`"${echo}" is not one of ${accepted}\n`);
  }
}

/**
 * The options to play with: the parsed ones, with each absent flag asked for on a terminal.
 * `null` means input ended at a question.
 */
export async function askAbsentOptions(
  parsed: Extract<Resolution, { ok: true }>,
  io: {
    readonly source: LineSource & { readonly isTTY?: boolean };
    readonly output: QuestionOutput;
  },
): Promise<{ readonly options: ResolvedOptions } | null> {
  const { source, output } = io;
  const { options, absent } = parsed;
  const terminal = source.isTTY === true && output.isTTY === true;
  if (!terminal || (!absent.colour && !absent.difficulty)) return { options };

  const reader = lineReaderOf(source);

  let colour: ColourValue = options.colour;
  if (absent.colour) {
    const colours = COLOUR_VALUES.join("|");
    const answer = await ask(
      reader,
      output,
      `colour (${colours}) [${options.colour}]: `,
      colours,
      (text): ColourValue | undefined => {
        if (text === "") return options.colour;
        const word = text.toLowerCase();
        return COLOUR_VALUES.find((candidate) => candidate === word);
      },
    );
    if (answer === null) return null;
    colour = answer;
  }

  let difficulty: Difficulty = options.difficulty;
  if (absent.difficulty) {
    const levels = DIFFICULTY_VALUES.join("|");
    const answer = await ask(
      reader,
      output,
      `difficulty (${levels}) [${options.difficulty}]: `,
      levels,
      (text): Difficulty | undefined => {
        if (text === "") return options.difficulty;
        const value = DIFFICULTY_VALUES.find((candidate) => candidate === text);
        return value === undefined ? undefined : (Number(value) as Difficulty);
      },
    );
    if (answer === null) return null;
    difficulty = answer;
  }

  return { options: optionsFor(colour, options.flags, difficulty) };
}
