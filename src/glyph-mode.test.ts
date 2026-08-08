/**
 * `ABC-015`'s acceptance criteria, one test each, in the ticket's order — the NINE input tuples and
 * the TWO session criteria, against the ticket AS CORRECTED on 2026-08-08.
 *
 * THE NINE TUPLES ARE DRIVEN AS A TABLE WITH THE ENVIRONMENT INJECTED, which the ticket's
 * `## Test notes` require and which is only possible because `selectGlyphMode` takes its signals as
 * an argument. A rule that read `process.env` directly could be exercised for one tuple per
 * process.
 *
 * THE TWO SESSION CRITERIA ARE THE ONLY TESTS HERE THAT TOUCH THE REAL AMBIENT SIGNALS, and they do
 * it deliberately: their criteria are written about `process.env` and `process.stdout.isTTY` being
 * REWRITTEN, so injecting a fake reader instead would test a different sentence. Both are written
 * against the mutant the test notes name — the implementation that re-reads `process.env` on every
 * call, which passes all nine table rows above and must fail exactly these two. Each therefore
 * carries the second half that makes it falsifiable: the rule, called directly with the NEW
 * signals, returns the OTHER value. Without that half, "the value did not change" is satisfied by a
 * coincidence.
 *
 * The ambient rewrites are undone in `afterEach` from descriptors captured at module load, before
 * any test has run.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { beginGlyphModeSession, type GlyphSignals, selectGlyphMode } from "./glyph-mode.ts";
import type { GlyphMode } from "./render.ts";

/** A full input tuple: the defaults are "no flag, a TTY, no locale set" — the plain modern case. */
const tuple = (overrides: Partial<GlyphSignals>): GlyphSignals => ({
  ascii: false,
  unicode: false,
  isTTY: true,
  env: {},
  ...overrides,
});

const NO_FLAGS = { ascii: false, unicode: false } as const;

// ---------------------------------------------------------------------------
// The real ambient signals — rewritten only by the two session criteria, restored after every test.
// ---------------------------------------------------------------------------

const LOCALE_VARIABLES = ["LC_ALL", "LC_CTYPE", "LANG"] as const;
const ORIGINAL_ISTTY = Object.getOwnPropertyDescriptor(process.stdout, "isTTY");
const ORIGINAL_LOCALE = LOCALE_VARIABLES.map((name) => [name, process.env[name]] as const);

/** Rewrite the two ambient signals the session is allowed to read. Locale names absent = unset. */
function setAmbient(isTTY: boolean, locale: Readonly<Record<string, string>>): void {
  Object.defineProperty(process.stdout, "isTTY", {
    value: isTTY,
    configurable: true,
    writable: true,
  });
  for (const name of LOCALE_VARIABLES) {
    const value = locale[name];
    if (value === undefined) Reflect.deleteProperty(process.env, name);
    else process.env[name] = value;
  }
}

afterEach(() => {
  if (ORIGINAL_ISTTY === undefined) Reflect.deleteProperty(process.stdout, "isTTY");
  else Object.defineProperty(process.stdout, "isTTY", ORIGINAL_ISTTY);

  for (const [name, value] of ORIGINAL_LOCALE) {
    if (value === undefined) Reflect.deleteProperty(process.env, name);
    else process.env[name] = value;
  }
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Acceptance — the nine input tuples.
// ---------------------------------------------------------------------------

/**
 * Eight of the nine, as a table. Criteria 3 and 9 are pulled out below: criterion 3 asserts that
 * nothing is thrown and nothing is printed, and criterion 9 is only a regression guard if the
 * platform it names is actually in place while the rule runs.
 */
const TUPLES: ReadonlyArray<readonly [string, GlyphSignals, GlyphMode]> = [
  [
    "1 — --ascii passed, a TTY, LANG=en_US.UTF-8: the flag beats every signal",
    tuple({ ascii: true, env: { LANG: "en_US.UTF-8" } }),
    "ascii",
  ],
  [
    "2 — --unicode passed, NO TTY, LANG=C: the override beats every signal the other way",
    tuple({ unicode: true, isTTY: false, env: { LANG: "C" } }),
    "unicode",
  ],
  [
    "4 — no flag and isTTY falsy: ascii regardless of locale",
    tuple({ isTTY: false, env: { LANG: "en_US.UTF-8" } }),
    "ascii",
  ],
  [
    "5 — no flag, a TTY, LC_ALL=C with LANG=en_US.UTF-8 also set: LC_ALL is consulted first and wins",
    tuple({ env: { LC_ALL: "C", LANG: "en_US.UTF-8" } }),
    "ascii",
  ],
  [
    "6 — no flag, a TTY, LC_ALL unset, LC_CTYPE=en_US.utf8: case-insensitive, hyphen-less spelling",
    tuple({ env: { LC_CTYPE: "en_US.utf8" } }),
    "unicode",
  ],
  [
    "7 — no flag, a TTY, none of the three set: unset is NOT a negative signal (the Windows case)",
    tuple({ env: {} }),
    "unicode",
  ],
  [
    "8 — no flag, a TTY, LANG=en_US.ISO-8859-1: set and not UTF-8",
    tuple({ env: { LANG: "en_US.ISO-8859-1" } }),
    "ascii",
  ],
];

describe("ABC-015 acceptance — the selection rule, one test per input tuple", () => {
  it.each(TUPLES)("%s", (_criterion, signals, expected) => {
    expect(selectGlyphMode(signals)).toBe(expected);
  });

  it("3 — BOTH flags passed: the rows are ordered, row 1 wins, and nothing is thrown or printed", () => {
    const both = tuple({ ascii: true, unicode: true, env: { LANG: "en_US.UTF-8" } });

    expect(() => selectGlyphMode(both)).not.toThrow();

    // Counted around the call rather than asserted at zero: the test reporter owns these streams
    // too, and a count taken at zero would be measuring the reporter, not this function.
    const out = vi.spyOn(process.stdout, "write");
    const err = vi.spyOn(process.stderr, "write");
    const writesBefore = out.mock.calls.length + err.mock.calls.length;

    expect(selectGlyphMode(both)).toBe("ascii");

    expect(out.mock.calls.length + err.mock.calls.length).toBe(writesBefore);
  });

  it("9 — win32 with a TTY and a UTF-8 locale is unicode, IDENTICAL to every other platform — a REGRESSION GUARD on the decision not to use the platform as a signal, NOT a platform test", () => {
    // The rule takes no platform argument, so the only way this criterion guards anything is for
    // `process.platform` to actually read "win32" while the rule runs. Then the mutant it exists to
    // catch — `if (process.platform === "win32") return "ascii"` — has somewhere to fail. Do NOT
    // "fix" this by giving the rule a platform signal: `win32` is a proxy for legacy conhost, and
    // Windows Terminal (the Windows 11 default) draws the figurines correctly.
    const realPlatform = Object.getOwnPropertyDescriptor(process, "platform");
    Object.defineProperty(process, "platform", { value: "win32", configurable: true });

    try {
      expect(process.platform).toBe("win32");
      expect(selectGlyphMode(tuple({ env: { LANG: "en_US.UTF-8" } }))).toBe("unicode");
    } finally {
      if (realPlatform !== undefined) Object.defineProperty(process, "platform", realPlatform);
    }
  });
});

// ---------------------------------------------------------------------------
// Acceptance — the two session criteria, written against the named mutant.
// ---------------------------------------------------------------------------

describe("ABC-015 acceptance — the session criteria", () => {
  it("10 — the rule reads NO ambient global: the same tuple answers the same across an ambient rewrite that would flip it", () => {
    const directions = [
      {
        label: "a unicode tuple against an ambient rewritten to ascii",
        signals: tuple({ env: { LANG: "en_US.UTF-8" } }),
        expected: "unicode",
        ambient: { isTTY: false, locale: { LANG: "C" } },
        ambientAnswer: "ascii",
      },
      {
        label: "an ascii tuple against an ambient rewritten to unicode",
        signals: tuple({ isTTY: false, env: { LANG: "C" } }),
        expected: "ascii",
        ambient: { isTTY: true, locale: { LANG: "en_US.UTF-8" } },
        ambientAnswer: "unicode",
      },
    ] as const;

    for (const { label, signals, expected, ambient, ambientAnswer } of directions) {
      const first = selectGlyphMode(signals);
      expect(first, label).toBe(expected);

      setAmbient(ambient.isTTY, ambient.locale);

      // The rewrite is a REAL flip, proven by feeding those same new values in as a tuple. Without
      // this the next assertion is satisfied by an ambient that happens to agree.
      expect(selectGlyphMode(tuple({ isTTY: ambient.isTTY, env: ambient.locale })), label).toBe(
        ambientAnswer,
      );

      // ...and the rule, called again with the SAME tuple, has not moved. The mutant that reads
      // `process.env` on every call answers `ambientAnswer` here and dies.
      expect(selectGlyphMode(signals), label).toBe(first);
    }
  });

  it("11 — the session's value survives an ambient rewrite, while the rule called with the NEW signals returns the OTHER value", () => {
    const directions = [
      {
        label: "a unicode session carried into an ascii ambient",
        begin: { isTTY: true, locale: { LANG: "en_US.UTF-8" } },
        expected: "unicode",
        rewritten: { isTTY: false, locale: { LANG: "C" } },
        otherValue: "ascii",
      },
      {
        label: "an ascii session carried into a unicode ambient",
        begin: { isTTY: false, locale: { LANG: "C" } },
        expected: "ascii",
        rewritten: { isTTY: true, locale: { LANG: "en_US.UTF-8" } },
        otherValue: "unicode",
      },
    ] as const;

    for (const { label, begin, expected, rewritten, otherValue } of directions) {
      setAmbient(begin.isTTY, begin.locale);
      const session = beginGlyphModeSession(NO_FLAGS);
      expect(session(), label).toBe(expected);

      setAmbient(rewritten.isTTY, rewritten.locale);

      // The session is unmoved — this is the call the re-probing mutant fails.
      expect(session(), label).toBe(expected);

      // ...and the rewrite really would have flipped it, which is what makes the line above mean
      // something rather than record a coincidence.
      expect(selectGlyphMode(tuple({ isTTY: rewritten.isTTY, env: rewritten.locale })), label).toBe(
        otherValue,
      );
    }
  });

  it("carries EVERY ambient signal to the rule — one row per signal, each the only thing deciding", () => {
    // Pins the session's WIRING, which neither criterion above reaches. Both criteria are written
    // over ambients where isTTY and the locale AGREE, so a session that read only one of them, or
    // hardcoded one, or forwarded only `LANG`, answers correctly in every one of them and survives.
    //
    // Every row below expects ASCII, and that is the design of the table rather than a coincidence:
    // `unicode` is what this module answers when a signal never arrives, so only a signal that
    // actually travelled can produce `ascii`. Each row isolates one, and the wiring mutant that
    // drops it turns that row unicode.
    const eachSignalAlone = [
      {
        label: "LANG travels: a TTY whose LANG is not UTF-8",
        isTTY: true,
        locale: { LANG: "en_US.ISO-8859-1" },
      },
      {
        label: "LC_ALL travels, and still beats LANG",
        isTTY: true,
        locale: { LC_ALL: "C", LANG: "en_US.UTF-8" },
      },
      { label: "LC_CTYPE travels", isTTY: true, locale: { LC_CTYPE: "C" } },
      {
        label: "isTTY travels: a UTF-8 locale on a sink that is not a terminal",
        isTTY: false,
        locale: { LANG: "en_US.UTF-8" },
      },
    ] as const;

    for (const { label, isTTY, locale } of eachSignalAlone) {
      setAmbient(isTTY, locale);
      expect(beginGlyphModeSession(NO_FLAGS)(), label).toBe("ascii");
    }
  });

  it("hands the flags through, and they still beat the ambient signals", () => {
    // A session that dropped the flags from the tuple it builds passes every criterion above.
    setAmbient(true, { LANG: "en_US.UTF-8" });
    expect(beginGlyphModeSession({ ascii: true, unicode: false })()).toBe("ascii");

    setAmbient(false, { LANG: "C" });
    expect(beginGlyphModeSession({ ascii: false, unicode: true })()).toBe("unicode");
  });
});

// ---------------------------------------------------------------------------
// Beyond the ticket's tuples — one behaviour the engineer had to decide, flagged not buried.
// ---------------------------------------------------------------------------

describe("ABC-015 — an EMPTY locale variable counts as UNSET (the engineer's stated assumption)", () => {
  // The ticket's table says "the first SET of LC_ALL / LC_CTYPE / LANG" and its nine tuples never
  // construct an empty one, so "set" had to be defined here. POSIX treats an empty locale variable
  // as unset, and the ticket's own rationale for row 4 requires the same reading: a variable that
  // carries no information must not become a negative signal. Recorded for QE and Security/NFR
  // rather than left as an unmarked judgement call.
  it("falls through an empty variable to the next one in precedence order", () => {
    expect(selectGlyphMode(tuple({ env: { LC_ALL: "", LANG: "en_US.UTF-8" } }))).toBe("unicode");
    expect(selectGlyphMode(tuple({ env: { LC_ALL: "", LC_CTYPE: "", LANG: "C" } }))).toBe("ascii");
  });

  it("treats all three empty as none set, which is unicode and not a negative signal", () => {
    expect(selectGlyphMode(tuple({ env: { LC_ALL: "", LC_CTYPE: "", LANG: "" } }))).toBe("unicode");
  });
});

// ---------------------------------------------------------------------------
// QE/E2E adversarial coverage — subtask `qe-abc015-review`, Workflow 04.
//
// The eleven acceptance criteria above all pass, and so did three mutants that are real production
// defects. The tests below were written by running mutants, not by reading the code, and each names
// the defect it was added to catch. None of them changes production code — `src/glyph-mode.ts` is
// byte-identical to the Engineer's.
// ---------------------------------------------------------------------------

describe("ABC-015 QE — locale precedence with CONFLICTING values set at once", () => {
  // THE TICKET'S `## Test notes` REQUIRE THIS AND THE DELIVERED SUITE DID NOT HAVE IT:
  // "Test the LC_ALL > LC_CTYPE > LANG precedence with conflicting values set at once, not one
  // variable at a time. One-at-a-time tests pass on an implementation that reads the wrong one."
  //
  // Criterion 5 pins LC_ALL against LANG. Criterion 6 sets LC_CTYPE ALONE, which is precisely the
  // one-at-a-time shape the note forbids, so the MIDDLE rung was never pinned against either
  // neighbour. Two mutants proved it: reordering to LC_ALL > LANG > LC_CTYPE, and promoting
  // LC_CTYPE above LC_ALL, both passed all 271 tests.
  //
  // Each row sets at least two variables to CONFLICTING values, so exactly one of them can produce
  // the expected answer and every other rung points the other way.
  const CONFLICTING: ReadonlyArray<readonly [string, Readonly<Record<string, string>>, GlyphMode]> =
    [
      [
        "LC_ALL beats LC_CTYPE — LC_ALL=C against a UTF-8 LC_CTYPE and a UTF-8 LANG",
        { LC_ALL: "C", LC_CTYPE: "en_US.UTF-8", LANG: "en_US.UTF-8" },
        "ascii",
      ],
      [
        "LC_ALL beats LC_CTYPE in the other direction — a UTF-8 LC_ALL against LC_CTYPE=C and LANG=C",
        { LC_ALL: "en_US.UTF-8", LC_CTYPE: "C", LANG: "C" },
        "unicode",
      ],
      [
        "LC_CTYPE beats LANG — LC_CTYPE=C against a UTF-8 LANG, LC_ALL unset",
        { LC_CTYPE: "C", LANG: "en_US.UTF-8" },
        "ascii",
      ],
      [
        "LC_CTYPE beats LANG in the other direction — a UTF-8 LC_CTYPE against LANG=C, LC_ALL unset",
        { LC_CTYPE: "en_US.UTF-8", LANG: "C" },
        "unicode",
      ],
    ];

  it.each(CONFLICTING)("%s", (_label, env, expected) => {
    expect(selectGlyphMode(tuple({ env }))).toBe(expected);
  });
});

describe("ABC-015 QE — the session's ambient reads, in the shapes production actually presents", () => {
  it("a sink whose isTTY property is ABSENT is ascii — the real non-TTY shape, which no test constructed", () => {
    // Node does not set `isTTY` to `false` on a pipe, a file or CI: it leaves the property ABSENT,
    // so `process.stdout.isTTY` is `undefined`. Every session test above rewrites it to a real
    // boolean via `defineProperty`, so the undefined shape — the ONLY one a non-TTY process ever
    // presents — was never exercised through `beginGlyphModeSession`.
    //
    // Two mutants that survived the delivered suite: `isTTY: process.stdout.isTTY ?? true` and a
    // `typeof ... === "boolean" ? ... : true` guard. Both read a missing property as A TERMINAL,
    // which sends Unicode into a pipe and breaks the determinism `EPIC-006`'s pipe-driven
    // end-to-end test is promised in the ticket's own row-3 rationale.
    //
    // The locale is set to UTF-8 on purpose: it says "unicode", so ascii can only come from row 3.
    setAmbient(true, { LANG: "en_US.UTF-8" });
    Reflect.deleteProperty(process.stdout, "isTTY");
    expect(
      process.stdout.isTTY,
      "the property must be genuinely absent, not false",
    ).toBeUndefined();

    expect(beginGlyphModeSession(NO_FLAGS)()).toBe("ascii");
  });

  it("decides EAGERLY when the session begins, not lazily on the first request", () => {
    // Epic acceptance `2b` is "decided exactly once, BEFORE the first frame". Criterion 11 requests
    // the mode immediately after beginning the session, so a lazy accessor that memoises on FIRST
    // CALL satisfies it — that mutant passed all 271 tests. It is a real defect: it moves the
    // decision from startup to whenever the first frame happens to be drawn, and any ambient change
    // in between silently wins.
    setAmbient(true, { LANG: "en_US.UTF-8" });
    const session = beginGlyphModeSession(NO_FLAGS);

    // The ambient moves BEFORE the value is ever requested — the window a lazy accessor is wrong in.
    setAmbient(false, { LANG: "C" });

    expect(session()).toBe("unicode");

    // ...and the rewrite really would have flipped it, so the line above is not a coincidence.
    expect(selectGlyphMode(tuple({ isTTY: false, env: { LANG: "C" } }))).toBe("ascii");
  });
});
