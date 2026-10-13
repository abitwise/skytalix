/**
 * `ABC-042` — the argv resolver: one pure function from a command line to either the options the
 * entry point composes with, or a usage error naming what was wrong.
 *
 * IT IS SEPARATE FROM THE ENTRY POINT FOR TESTABILITY, NOT FOR DESIGN, and the ticket says so in its
 * own words: an entry point exports nothing (`ADR-0011` clause 4), so everything inside one is
 * provable only by spawning a child. `A4`'s 1000 `random` resolutions and `A6`(ii)'s 1000-token
 * complement sweep are unaffordable at one spawn each and cost 0.112 ms as unit calls. So the rules
 * live here, where they can be called, and `src/cli.ts` keeps only what a running program is needed
 * for: the two handles, and the write.
 *
 * IT READS NO AMBIENT SIGNAL AND WRITES NOTHING. `A9`(3): the word for the running program does not
 * occur in this file AT ALL — not the argument vector, which the entry point reads exactly once and
 * hands here as a value, and not the error channel, which only the entry point may acquire as a
 * writable handle. Its absence is asserted textually over this whole source, comments included, the
 * way `src/render-seam.test.ts` asserts the same absence for the seam — one keystroke is all the
 * difference between this module and one that reaches for the environment behind the test's back.
 * `Math.random` is the one non-determinism and it is deliberate: `--colour random` is
 * resolved HERE, before any renderer or seam can see the word (`A4`, `ABC-019` `[D24]`).
 * `Math.random` suffices — a CSPRNG is ASVS **V11.5.1 [L2]**, outside this project's active L1 set.
 *
 * THE ACCEPTED SET IS DATA AND IT IS THE ONLY ARGV LITERAL IN THIS FILE (`A6`(i)). One exported,
 * closed enumeration, destructured into the names the code below compares against — so there is no
 * second spelling of any accepted token anywhere in this module, and a resolver that quietly
 * recognised a fifth flag would have to either enlarge the enumeration (which the test's
 * element-for-element equality against `## Scope`'s table catches) or write a new argv literal
 * (which the test's textual assertion catches). Membership is EXACT STRING EQUALITY — never
 * `startsWith`, never `toLowerCase` — and REJECTION IS THE DEFAULT BRANCH: the loop returns a usage
 * error for every token it did not recognise, so the complement is closed by construction rather
 * than by a denylist that has to be kept complete.
 *
 * THE USAGE ERROR CARRIES THE OFFENDING TOKENS RAW, AS DATA. It does not build the line that reaches
 * the terminal, because the bytes of an echoed argument are the entry point's to filter (security
 * bar 3, and Architect/Design's ruling that the rejection message never routes through the frame
 * path). A caller that never echoes them is caught by that bar's non-vacuity arm, not by this file.
 */

import type { GlyphFlags } from "./glyph-mode.ts";
import type { Orientation } from "./render.ts";

/**
 * `## Scope`'s table, as one closed enumeration: the two glyph flags, `--colour`, and `--colour`'s
 * three value words. THE ORDER IS LOAD-BEARING — the destructuring below names each element by
 * position, which is what keeps every accepted spelling written exactly once in this module.
 *
 * `ABC-101` adds `--difficulty` and its five value words, the ordinals `1`-`5`, weakest to
 * strongest (ruling 1). They are opaque here: this module gives a level no meaning (`RISK-002`).
 */
export const ACCEPTED_ARGUMENTS = [
  "--ascii",
  "--unicode",
  "--colour",
  "white",
  "black",
  "random",
  "--difficulty",
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

const [ASCII, UNICODE, COLOUR, WHITE, BLACK, RANDOM, DIFFICULTY, ...DIFFICULTY_VALUES] =
  ACCEPTED_ARGUMENTS;

/** A difficulty level: a plain ordinal, `1` weakest to `5` strongest. */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** The level when `--difficulty` is absent: the middle of the set, never the top (ruling 2). */
export const DEFAULT_DIFFICULTY: Difficulty = 3;

/** `--colour`'s three value words, in the table's order. It introduces no literal of its own. */
const COLOUR_VALUES = [WHITE, BLACK, RANDOM] as const;

/** What `--colour` may say. `random` is one of them on the command line and nowhere after it. */
type ColourValue = (typeof COLOUR_VALUES)[number];

/** What the human plays, after `random` has been resolved. `random` is not one of these. */
export type Colour = typeof WHITE | typeof BLACK;

/** Everything the entry point needs from the command line, and nothing else. */
export interface ResolvedOptions {
  /** The human's colour — `"white"` or `"black"`, never `"random"`. */
  readonly colour: Colour;
  /**
   * The orientation that follows the colour: the board is drawn from the human's side (BA/PM's
   * `ABC-041` ruling). It is derived HERE rather than at the entry point so the rule sits in the
   * one module that can be unit-tested, and so the entry point holds no branch at all.
   */
  readonly orientation: Orientation;
  /** Straight into `beginGlyphModeSession` — this module never decides a glyph mode. */
  readonly flags: GlyphFlags;
  /** The chosen level, fixed for the session (ruling 3). The entry point decides what it does. */
  readonly difficulty: Difficulty;
}

/** Why an argv was rejected, and which of its tokens is to blame. */
export interface UsageError {
  /** Prose, and never an echo of user input: the whole of it is this module's own text. */
  readonly problem: string;
  /** The offending tokens, RAW. The entry point filters their bytes before echoing them. */
  readonly offending: readonly string[];
}

export type Resolution =
  | { readonly ok: true; readonly options: ResolvedOptions }
  | ({ readonly ok: false } & UsageError);

const UNRECOGNISED = "unrecognised argument";
const MISSING_VALUE = "--colour needs one of white|black|random";
const MISSING_DIFFICULTY = "--difficulty needs one of 1|2|3|4|5";
const CONFLICTING_FLAGS = "--ascii and --unicode cannot be used together";

const reject = (problem: string, ...offending: readonly string[]): Resolution => ({
  ok: false,
  problem,
  offending,
});

/** A fair coin. `--colour random` is resolved before anything downstream can see the word. */
const coin = (): Colour => (Math.random() < 0.5 ? WHITE : BLACK);

/**
 * Resolve one command line. Pure, total, and the EXCLUSIVE validator of the argument vector (ASVS
 * **V2.2.2 [L1]**): the entry point reads it once, hands it here, and branches on nothing after.
 */
export function resolveOptions(argv: readonly string[]): Resolution {
  let colour: ColourValue = WHITE; // the table's "no arguments" row
  let ascii = false;
  let unicode = false;
  let difficulty = DEFAULT_DIFFICULTY;

  for (let index = 0; index < argv.length; index++) {
    const token = argv[index] as string;

    if (token === ASCII) {
      ascii = true;
      continue;
    }
    if (token === UNICODE) {
      unicode = true;
      continue;
    }
    if (token === COLOUR) {
      const next = argv[index + 1];
      const value = COLOUR_VALUES.find((candidate) => candidate === next);
      // The value word is what is wrong when there is one; `--colour` itself is what is wrong when
      // the command line simply stops. Either way the message names a token the human typed.
      if (value === undefined) return reject(MISSING_VALUE, next ?? token);
      colour = value;
      index++;
      continue;
    }
    if (token === DIFFICULTY) {
      const next = argv[index + 1];
      // The same exact-equality lookup as `--colour`: `0`, `6`, `03`, `+3` and `3.0` are not members.
      const value = DIFFICULTY_VALUES.find((candidate) => candidate === next);
      if (value === undefined) return reject(MISSING_DIFFICULTY, next ?? token);
      difficulty = Number(value) as Difficulty;
      index++;
      continue;
    }

    // THE DEFAULT BRANCH — every token that is not in the enumeration lands here, which is what
    // makes the accepted set closed rather than a denylist of the four arguments anyone thought of.
    return reject(UNRECOGNISED, token);
  }

  // `src/glyph-mode.ts:76-80` assigns this rejection to this epic BY NAME, and keeps its own
  // `(true, true)` fail-safe row for callers that are not a command line. The rule stays in one
  // place: nothing here decides a mode, and `selectGlyphMode` is not called on this path.
  if (ascii && unicode) return reject(CONFLICTING_FLAGS, ASCII, UNICODE);

  const resolved = colour === RANDOM ? coin() : colour;

  return {
    ok: true,
    options: {
      colour: resolved,
      orientation: resolved === WHITE ? "white-bottom" : "black-bottom",
      flags: { ascii, unicode },
      difficulty,
    },
  };
}
