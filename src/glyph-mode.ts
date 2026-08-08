/**
 * ABC-015 — which glyph table a session draws with: the five-row precedence rule, and the session
 * constant it is decided into exactly once.
 *
 * THIS MODULE IS TWO THINGS AND THE SPLIT IS THE WHOLE POINT.
 *
 *   - `selectGlyphMode(signals)` is the RULE. It reads NOTHING ambient — every signal, including
 *     the two flags, arrives as a value on its argument. That is acceptance criterion 10, and it is
 *     also what makes the nine input tuples testable in ONE run: a rule that read `process.env`
 *     directly could be exercised for one tuple per process.
 *   - `beginGlyphModeSession(flags)` is the SESSION. It reads the two ambient signals ONCE, hands
 *     them to the rule, and closes over the answer. That is epic acceptance `2b` — "decided exactly
 *     once, before the first frame" — and `ABC-015` owns it: `ABC-018` says in its own words that
 *     this ticket "owns that rule and runs it once at startup".
 *
 * WHERE THE CACHED VALUE LIVES IS A DELIBERATE CHOICE, recorded so it is not undone by tidying. It
 * lives in the CLOSURE `beginGlyphModeSession` returns — not in a module-level `let`, and not in a
 * value the caller merely holds:
 *
 *   - A module-level memo would need an exported reset for the tests to run more than one session,
 *     and that export is a loaded gun: anything able to reset the session can break the
 *     session-constant promise this module exists to keep. A closure needs no reset — a new session
 *     is a new closure.
 *   - A plain value the caller holds pushes the once-ness back to `EPIC-006`, which is the exact
 *     ownership seam BA/PM closed onto this ticket on 2026-08-08, and it makes acceptance criterion
 *     11 unfalsifiable: the only test a bare `const` admits is that a `const` does not mutate.
 *
 * SO THE ACCESSOR IS A FUNCTION ON PURPOSE, AND `() => mode` IS NOT A WRAPPER TO BE INLINED. Its
 * job is to be CALLABLE A SECOND TIME, so that the implementation which re-probes the environment
 * on every call — the named mutant in the ticket's `## Test notes`, which passes all nine table
 * rows — has somewhere to fail. Inline it and criterion 11 stops testing this module.
 *
 * NFR: `NFR-007`'s bar is ZERO filesystem and ZERO process operations to reach the answer. This
 * module imports one TYPE and nothing else; it reads `process.stdout.isTTY` and `process.env`,
 * which are in-memory property reads and are the only ambient reads the ticket permits. There is no
 * font probe and there is no `locale` subprocess — wave 1 established that what a terminal actually
 * draws is not observable in-process, and `src/glyph-mode.nfr.test.ts` pins the absence.
 *
 * It decides a mode and returns it. It writes nothing, prints nothing and throws nothing.
 */

import type { GlyphMode } from "./render.ts";

/**
 * The two flags, already parsed. `EPIC-006` owns argv and takes them off the command line; this
 * module takes them as booleans, which is why `(true, true)` is constructible here — see
 * `selectGlyphMode`.
 */
export interface GlyphFlags {
  readonly ascii: boolean;
  readonly unicode: boolean;
}

/** One complete input tuple for the rule: the two flags plus the two ambient signals, as VALUES. */
export interface GlyphSignals extends GlyphFlags {
  readonly isTTY: boolean;
  readonly env: Readonly<Record<string, string | undefined>>;
}

/**
 * Case-insensitive and hyphen-optional, so `UTF-8`, `utf8` and `en_US.utf8` all match. No `g` flag:
 * a global regex carries `lastIndex` between calls and would make this rule answer differently on
 * every other call.
 */
const UTF8 = /utf-?8/i;

/** POSIX precedence: the FIRST of these that is set decides, and the rest are not consulted. */
const LOCALE_VARIABLES = ["LC_ALL", "LC_CTYPE", "LANG"] as const;

/**
 * The mode for one input tuple. Pure: it reads only `signals`.
 *
 * The five rows of the ticket's table, IN ORDER, and the order is load-bearing rather than
 * incidental. `--ascii` and `--unicode` are independent booleans, so both can be true; rows 1 and 2
 * both match that tuple and row 1 wins, giving `ascii` — the fail-safe direction, which is the
 * whole of `RISK-005`'s mitigation. Ruled by BA/PM on 2026-08-08. This function does NOT throw and
 * does NOT print on the conflicting pair: rejecting `--ascii --unicode` with a message that names
 * the conflict is `EPIC-006`'s obligation, and the same rule in two places is how two places come
 * to disagree.
 */
export function selectGlyphMode(signals: GlyphSignals): GlyphMode {
  if (signals.ascii) return "ascii"; // row 1 — the flag beats every signal
  if (signals.unicode) return "unicode"; // row 2 — and so does the override, in the other direction
  if (!signals.isTTY) return "ascii"; // row 3 — a sink that cannot be seen gets the portable form

  for (const name of LOCALE_VARIABLES) {
    const value = signals.env[name];
    // ASSUMPTION, stated rather than buried: an EMPTY variable counts as UNSET, which is the POSIX
    // reading and the one the ticket's own rationale for row 4 requires — "unset is the normal
    // Windows case and carries no information; treating it as a negative signal would smuggle the
    // platform rule back in through the side door". An empty `LANG=` carries no information either.
    // The ticket's nine tuples do not cover it; this is the engineer's call and it is flagged.
    if (value === undefined || value === "") continue;
    return UTF8.test(value) ? "unicode" : "ascii"; // rows 4 and 5, on the first SET variable
  }

  return "unicode"; // row 5 — none set, and unset is NOT a negative signal
}

/**
 * The session's mode, for the rest of the process. Call it as often as you like; it answers with
 * the value decided when the session began.
 */
export type GlyphModeSession = () => GlyphMode;

/**
 * Begin the session: read the ambient signals ONCE, decide, and hold the answer.
 *
 * `process.stdout.isTTY` is typed `boolean` by `@types/node` but Node leaves it `undefined` on a
 * stream that is not a terminal — a pipe, a file, CI. The table's row 3 is written against FALSY,
 * so the coercion below is doing real work and is not decoration.
 */
export function beginGlyphModeSession(flags: GlyphFlags): GlyphModeSession {
  const mode = selectGlyphMode({
    ascii: flags.ascii,
    unicode: flags.unicode,
    isTTY: Boolean(process.stdout.isTTY),
    env: process.env,
  });

  return () => mode;
}
