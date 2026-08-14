/**
 * `ABC-042` — the entry point and its argv resolver: `A1`…`A10` and `A12`'s structural halves, plus
 * the security bars this ticket's page states in a form a test can decide.
 *
 * ONE FILE FOR BOTH MODULES, and it is the heaviest file either epic adds. It holds no `vi.mock`, so
 * it is not an `*.nfr.test.ts`: nothing here re-routes the module graph.
 *
 * THE SPAWN BUDGET IS THE POINT OF THE LAYOUT. `CHILDREN` below spawns each command line EXACTLY
 * ONCE, at module scope, with stdout AND stderr piped — a child cannot be re-run to add a pipe
 * afterwards, and `A5`, `A6` and security bar 3 all assert over the union of the two. Every
 * spawn-provable criterion that can share a child's output does. Everything else — `A4`'s 1000
 * `random` resolutions, all of `A6`(i) and (ii), `A5`'s spy — is a unit call at ZERO spawn cost,
 * which is the whole reason the resolver is a separate module (`## Scope` 2).
 *
 * BAR 1b GOVERNS THIS FILE, and bars 1, 3 and 4 do not: they are scoped to the delivered PRODUCTION
 * modules. `node:child_process` is reached only in argument-array form; there is no `exec(` or
 * `execSync(` call site, no `shell:`, and no spawn argument built by string concatenation. The file
 * MUST contain `process.execPath` — which is why the bar counts call sites and never occurrences.
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { ACCEPTED_ARGUMENTS, resolveOptions } from "./cli-options.ts";
import { frameHeight } from "./frame.ts";
import * as glyphMode from "./glyph-mode.ts";
import { gameStatusOf, newGame } from "./history.ts";
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { makeRenderSeam } from "./render-seam.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";

const SOURCE_DIRECTORY = new URL(".", import.meta.url).pathname;
const REPOSITORY = new URL("..", import.meta.url).pathname;
const ENTRY_POINT = new URL("cli.ts", import.meta.url).pathname;

/** Every test file in this repository defines its own; there is no exported constant to import. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const startGame = () => newGame(START_FEN);

const sourceOf = (file: string): string => readFileSync(`${SOURCE_DIRECTORY}${file}`, "utf8");

/** The delivered module with its comments removed — what the structural rows assert over. */
const executableCodeOf = (file: string): string =>
  sourceOf(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

/** `ADR-0011` clause 1's own expression: a `.ts` under `src/` that is not a `.test.ts`. */
const productionModules = (): readonly string[] =>
  readdirSync(SOURCE_DIRECTORY).filter(
    (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
  );

// ---------------------------------------------------------------------------------------------
// The reference frames. Composed from the MERGED modules, so a build that drifts from them is red
// rather than compared against a second copy of their behaviour.
// ---------------------------------------------------------------------------------------------

const frameOf = (mode: GlyphMode, orientation: Orientation): readonly string[] => {
  const history = startGame();
  return makeRenderSeam(mode, orientation)(history, gameStatusOf(history), false, []);
};

/**
 * `A4`'s board region: the merged renderer's rows padded to the frame's width, where the width is
 * taken over the PANELS — `src/render-seam.test.ts`'s own method, never read off the frame, so a
 * build that padded the board itself could not inflate both sides of the comparison at once.
 */
const boardRegionOf = (mode: GlyphMode, orientation: Orientation): readonly string[] => {
  const history = startGame();
  const status = gameStatusOf(history);
  const board = renderBoard(history.position, mode, orientation);
  const width = Math.max(
    ...[...board, ...renderStatusPanel(history, status, false), ...renderHistory(history)].map(
      (row) => row.length,
    ),
  );
  return board.map((row) => row.padEnd(width));
};

const MODES: readonly GlyphMode[] = ["ascii", "unicode"];
const ORIENTATIONS: readonly Orientation[] = ["white-bottom", "black-bottom"];

/**
 * Every row any legal first frame can carry, in either mode and either orientation. A rejection path
 * that emitted one of these on EITHER channel is the build test note 4 names, and this set is what
 * sees it.
 */
const FRAME_ROWS: ReadonlySet<string> = new Set(
  MODES.flatMap((mode) => ORIENTATIONS.flatMap((orientation) => frameOf(mode, orientation)))
    .map((row) => row.trimEnd())
    .filter((row) => row !== ""),
);

const frameRowsIn = (text: string): readonly string[] =>
  text
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => FRAME_ROWS.has(line));

const codePointsOf = (text: string): readonly number[] =>
  [...text].map((character) => character.codePointAt(0) as number);

// ---------------------------------------------------------------------------------------------
// THE CHILDREN. Ten, spawned once each, and the count is asserted below so it cannot creep.
// ---------------------------------------------------------------------------------------------

interface Child {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
  /** stdout and stderr, unioned — what an absence property is asserted over. */
  readonly union: string;
}

let spawned = 0;

const childOf = (command: string, args: readonly string[]): Child => {
  spawned++;
  const child = spawnSync(command, [...args], {
    cwd: REPOSITORY,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a child that never started says so here,
  // loudly, instead of arriving as an empty capture that every absence assertion would swallow.
  if (child.error !== undefined)
    throw new Error(`child ${command} failed to start: ${child.error}`);
  return {
    status: child.status,
    stdout: child.stdout,
    stderr: child.stderr,
    union: `${child.stdout}${child.stderr}`,
  };
};

/** The delivered entry point, run as a child the way a human's shell runs it. */
const run = (...args: readonly string[]): Child =>
  childOf(process.execPath, [ENTRY_POINT, ...args]);

const CHILDREN = {
  /** `A1` — the real command, and the only one that goes through `npm`. */
  npmRun: childOf("npm", ["run", "chess"]),
  /** `A4` white + `A7`'s unicode half: one child, two criteria. */
  white: run("--colour", "white", "--unicode"),
  black: run("--colour", "black"),
  random: run("--colour", "random"),
  /** `A5` end to end. */
  conflict: run("--ascii", "--unicode"),
  /** `A6`(iii)'s four, exactly as the criterion names them. */
  difficulty: run("--difficulty", "3"),
  shortFlag: run("-x"),
  badColour: run("--colour", "purple"),
  bareWord: run("foo"),
  /** Security bar 3 — one spawn, one token carrying a literal escape sequence. */
  escape: run("--colour", "\u001b[2Jpurple"),
} as const;

describe("ABC-042 — a human can run it", () => {
  it("A1 — `npm run chess` writes the start position and exits 0", () => {
    const frame = frameOf("ascii", "white-bottom");
    const child = CHILDREN.npmRun;

    expect(child.status, `npm run chess failed: ${child.stderr}`).toBe(0);
    // The height, through `frameHeight`'s own arithmetic on the merged constants. There is no
    // exported board-row constant, so the board term is read off `renderBoard(...).length`.
    expect(frame.length).toBe(
      frameHeight({
        board: renderBoard(startGame().position, "ascii", "white-bottom").length,
        status: STATUS_ROWS,
        history: HISTORY_ROWS,
      }),
    );

    // `npm` prints its own two-line banner on stdout before the script's output, so the frame is
    // asserted as the TAIL of the stream, byte for byte. Nothing about the banner is asserted —
    // it is npm's, not this ticket's — but the rows before the frame carry no frame row.
    const rows = child.stdout.split("\n");
    const tail = rows.slice(rows.length - frame.length - 1, rows.length - 1);
    expect(tail).toEqual([...frame]);
    expect(frameRowsIn(rows.slice(0, rows.length - frame.length - 1).join("\n"))).toEqual([]);
    // The eight ranks, named as `A1` names them, so the row count alone cannot satisfy it.
    for (const rank of ["8", "7", "6", "5", "4", "3", "2", "1"]) {
      expect(
        tail.some((row) => row.startsWith(`${rank} `)),
        `rank ${rank}`,
      ).toBe(true);
    }
  });

  it("A1 — AGENTS.md's `Dev / run` line is the command that was run", () => {
    // The command in the docs and the command in `package.json` are one string in two files; a
    // ticket whose whole purpose is "a human types one command" cannot leave them free to drift.
    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
    const packaged = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(agents).toContain("- Dev / run: `npm run chess`");
    expect(agents).not.toContain("- Dev / run: `UNKNOWN - verify`");
    expect(packaged.scripts.chess).toBe("node src/cli.ts");
  });

  it("A7 — no flags on a pipe: zero code points above U+007F on the emitted stream", () => {
    // `selectGlyphMode` row 3 — a sink that cannot be seen gets the portable form. The stream is
    // the child's STDOUT (ruled), and on this Given stderr is empty, so every reading coincides.
    const child = CHILDREN.npmRun;

    expect(child.stderr).toBe("");
    expect(Math.max(...codePointsOf(child.stdout))).toBeLessThanOrEqual(0x7f);
  });

  it("A7 — `--unicode` on a pipe puts real chess glyphs in the board region", () => {
    const child = CHILDREN.white;
    const region = child.stdout
      .split("\n")
      .slice(0, boardRegionOf("unicode", "white-bottom").length);
    const glyphs = codePointsOf(region.join("")).filter((code) => code >= 0x2654 && code <= 0x265f);

    expect(child.status).toBe(0);
    expect(glyphs.length).toBeGreaterThan(0);
  });

  it("A8 — the append strategy: no cursor control, and exactly one newline after the last row", () => {
    const frame = frameOf("ascii", "white-bottom");
    const stream = CHILDREN.npmRun.stdout;

    expect(stream).not.toContain("\u001b[");
    // "Ends with exactly one `\n` after the last row" as a byte assertion: the frame joined by
    // newlines, one newline, and nothing more. The second expectation is what makes the first
    // exact rather than a lower bound.
    expect(stream.endsWith(`${frame.join("\n")}\n`)).toBe(true);
    expect(stream.endsWith(`${frame.join("\n")}\n\n`)).toBe(false);
  });

  it("A8 — `beginFrameSession` is called once, with the first frame's own length", () => {
    const code = executableCodeOf("cli.ts");

    expect(code.match(/\bbeginFrameSession\s*\(/g)).toHaveLength(1);
    expect(code).toMatch(/beginFrameSession\(process\.stdout,\s*frame\.length\)/);
  });
});

describe("ABC-042 — the resolved colour reaches the board", () => {
  it("A4 — `--colour random` resolves to white or black 1000 times, with zero spawns", () => {
    const colours: string[] = [];
    let leaked = 0;

    for (let attempt = 0; attempt < 1000; attempt++) {
      const resolution = resolveOptions(["--colour", "random"]);
      if (!resolution.ok) throw new Error("`--colour random` was rejected");
      colours.push(resolution.options.colour);
      // The word itself reaches nothing: not the colour, not the orientation, not the flags.
      if (JSON.stringify(resolution.options).includes("random")) leaked++;
    }

    expect(colours).toHaveLength(1000);
    expect(colours.filter((colour) => colour !== "white" && colour !== "black")).toEqual([]);
    expect(new Set(colours)).toEqual(new Set(["white", "black"]));
    expect(leaked).toBe(0);
  });

  it("A4 — the orientation follows the colour, and it is resolved before anyone sees it", () => {
    const white = resolveOptions(["--colour", "white"]);
    const black = resolveOptions(["--colour", "black"]);
    if (!white.ok || !black.ok) throw new Error("a documented colour was rejected");

    expect(white.options.orientation).toBe("white-bottom");
    expect(black.options.orientation).toBe("black-bottom");
  });

  it("A4 — the running entry point draws each colour from the human's side", () => {
    // The mode differs per child by design: `white` also carries `--unicode` (it is `A7`'s second
    // Given), the other two run on a pipe with no glyph flag and so are `ascii`.
    const white = boardRegionOf("unicode", "white-bottom");
    const black = boardRegionOf("ascii", "black-bottom");

    expect(CHILDREN.white.stdout.split("\n").slice(0, white.length)).toEqual([...white]);
    expect(CHILDREN.black.stdout.split("\n").slice(0, black.length)).toEqual([...black]);
    expect(CHILDREN.white.status).toBe(0);
    expect(CHILDREN.black.status).toBe(0);

    // `--colour random`: exactly one of the two, and the arming half is that the two differ.
    const drawn = CHILDREN.random.stdout.split("\n").slice(0, black.length);
    expect(CHILDREN.random.status).toBe(0);
    expect([boardRegionOf("ascii", "white-bottom"), black]).toContainEqual(drawn);
    expect(boardRegionOf("ascii", "white-bottom")).not.toEqual(black);
  });
});

describe("ABC-042 — a rejected command line starts no game", () => {
  it("A5 — `--ascii --unicode` is refused at the resolver, and selectGlyphMode is not called", () => {
    const spy = vi.spyOn(glyphMode, "selectGlyphMode");
    try {
      // ARMING CONTROL FIRST: a zero call count is worthless if the spy cannot see a call at all.
      glyphMode.selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} });
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockClear();

      const resolution = resolveOptions(["--ascii", "--unicode"]);

      expect(resolution.ok).toBe(false);
      if (resolution.ok) return;
      expect(resolution.problem).toContain("--ascii");
      expect(resolution.problem).toContain("--unicode");
      expect(resolution.offending).toEqual(["--ascii", "--unicode"]);
      expect(spy).toHaveBeenCalledTimes(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("A5 — end to end: both flags named, non-zero exit, and zero frame rows on either channel", () => {
    const child = CHILDREN.conflict;

    expect(child.status).not.toBe(0);
    expect(child.stderr).toContain("--ascii");
    expect(child.stderr).toContain("--unicode");
    expect(frameRowsIn(child.stdout)).toEqual([]);
    expect(frameRowsIn(child.stderr)).toEqual([]);
  });

  it("A6(iii) — four unrecognised command lines: named, non-zero, and no frame anywhere", () => {
    const cases: readonly (readonly [name: string, child: Child, offending: string])[] = [
      ["--difficulty 3", CHILDREN.difficulty, "--difficulty"],
      ["-x", CHILDREN.shortFlag, "-x"],
      ["--colour purple", CHILDREN.badColour, "purple"],
      ["foo", CHILDREN.bareWord, "foo"],
    ];

    for (const [name, child, offending] of cases) {
      expect(child.status, `${name} exit code`).not.toBe(0);
      expect(child.union, `${name} names the offending argument`).toContain(offending);
      expect(frameRowsIn(child.stdout), `${name} frame rows on stdout`).toEqual([]);
      expect(frameRowsIn(child.stderr), `${name} frame rows on stderr`).toEqual([]);
    }
  });
});

describe("ABC-042 — the accepted set is closed", () => {
  /**
   * `## Scope`'s table, TRANSCRIBED HERE BY HAND. This is the test's own copy: comparing the
   * resolver's enumeration to itself would pass on anything, and comparing it to a derivation of
   * itself is the same tautology one step removed.
   */
  const TABLE_FLAGS = ["--ascii", "--unicode"] as const;
  const TABLE_COLOUR = "--colour";
  const TABLE_VALUES = ["white", "black", "random"] as const;
  const TABLE = [...TABLE_FLAGS, TABLE_COLOUR, ...TABLE_VALUES];

  it("A6(i) — the exported enumeration EQUALS the table, element for element, both ways", () => {
    expect([...ACCEPTED_ARGUMENTS].sort()).toEqual([...TABLE].sort());
    expect(new Set(ACCEPTED_ARGUMENTS).size).toBe(ACCEPTED_ARGUMENTS.length);
    expect(ACCEPTED_ARGUMENTS).toHaveLength(TABLE.length);
  });

  it("A6(i) — every documented spelling resolves in its legal argv position", () => {
    const accepted: readonly (readonly string[])[] = [
      [],
      ["--ascii"],
      ["--unicode"],
      ...TABLE_VALUES.map((value) => [TABLE_COLOUR, value]),
    ];

    for (const argv of accepted) {
      expect(resolveOptions(argv).ok, `argv ${JSON.stringify(argv)}`).toBe(true);
    }
  });

  it("A6(i) — the enumeration is the ONLY argv literal in the delivered resolver", () => {
    // The two builds a resolver that quietly recognises a fifth flag can take, and both are red
    // here: enlarging the enumeration fails the equality above; writing the literal anywhere else
    // fails this row. `A6`(ii)'s random corpus is blind to both (P ~ 1.4e-9, measured).
    const code = executableCodeOf("cli-options.ts");
    const literals = [...code.matchAll(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g)].map((match) =>
      match[0].slice(1, -1),
    );
    // Import specifiers and `render.ts`'s own orientation vocabulary: space-free literals that are
    // NOT argv spellings, transcribed here so a new one cannot arrive unnoticed.
    const NOT_ARGV = ["./glyph-mode.ts", "./render.ts", "white-bottom", "black-bottom"];

    expect(literals.length).toBeGreaterThan(0);
    for (const literal of literals) {
      // Every dash-led token in every literal — the shape a command-line argument has.
      for (const token of literal.match(/(?<![\w-])--?[A-Za-z][A-Za-z0-9-]*/g) ?? []) {
        expect(ACCEPTED_ARGUMENTS, `argv literal ${token}`).toContain(token);
      }
      // Every space-free literal: a bare extra value word (`purple`) has no dash to catch it.
      if (!/\s/.test(literal)) {
        expect([...ACCEPTED_ARGUMENTS, ...NOT_ARGV], `bare literal ${literal}`).toContain(literal);
      }
    }
  });

  it("A6(i) — the 18 near misses derived from the table are rejected in their legal position", () => {
    // Derived FROM THE TABLE so they cannot go stale, and aimed at the two mutants data-equality
    // alone does not catch: prefix matching (`startsWith`) and case folding.
    const nearMisses = (spelling: string): readonly string[] => [
      spelling.toUpperCase(),
      `${spelling}x`,
      spelling.slice(0, -1),
    ];
    const derived: string[] = [];
    const cases: (readonly string[])[] = [];

    for (const flag of [...TABLE_FLAGS, TABLE_COLOUR]) {
      for (const miss of nearMisses(flag)) {
        derived.push(miss);
        cases.push([miss]);
      }
    }
    for (const value of TABLE_VALUES) {
      for (const miss of nearMisses(value)) {
        derived.push(miss);
        cases.push([TABLE_COLOUR, miss]);
      }
    }

    expect(derived).toHaveLength(18);
    // It cannot false-RED a legal build: none of the 18 is an accepted spelling.
    expect(
      derived.filter((miss) => (ACCEPTED_ARGUMENTS as readonly string[]).includes(miss)),
    ).toEqual([]);
    for (const argv of cases) {
      expect(resolveOptions(argv).ok, `argv ${JSON.stringify(argv)}`).toBe(false);
    }
  });

  it("A6(i) — an undocumented fifth flag is rejected and named", () => {
    const resolution = resolveOptions(["--debug"]);

    expect(resolution.ok).toBe(false);
    if (resolution.ok) return;
    expect(resolution.offending).toContain("--debug");
  });

  it("A6(ii) — 1000 generated tokens, 250 per shape, every one rejected and named", () => {
    const PRINTABLE = Array.from({ length: 0x7f - 0x20 }, (_, index) =>
      String.fromCodePoint(0x20 + index),
    );
    const word = (length: number): string =>
      Array.from(
        { length },
        () => PRINTABLE[Math.floor(Math.random() * PRINTABLE.length)] as string,
      ).join("");
    const between = (low: number, high: number): number =>
      low + Math.floor(Math.random() * (high - low + 1));

    // The four shapes. Each returns one argv plus the token its rejection must name.
    const SHAPES: Readonly<Record<string, () => readonly [readonly string[], string]>> = {
      "--<word>": () => {
        const token = `--${word(between(1, 22))}`;
        return [[token], token];
      },
      "-<char>": () => {
        const token = `-${word(1)}`;
        return [[token], token];
      },
      "<word>": () => {
        const token = word(between(1, 24));
        return [[token], token];
      },
      "--colour <word>": () => {
        const token = word(between(1, 24));
        return [["--colour", token], token];
      },
    };

    // FILTERED BY WHOLE ACCEPTED FORM ONLY — never because an argv CONTAINS an accepted token,
    // which is the reading that would empty the `--colour <word>` shape and with it the build that
    // shape exists to catch.
    const isAcceptedForm = (argv: readonly string[]): boolean => {
      const whole = JSON.stringify(argv);
      return (
        whole === JSON.stringify([]) ||
        whole === JSON.stringify(["--ascii"]) ||
        whole === JSON.stringify(["--unicode"]) ||
        TABLE_VALUES.some((value) => whole === JSON.stringify(["--colour", value]))
      );
    };

    const corpus = new Map<string, (readonly [readonly string[], string])[]>();
    for (const [shape, generate] of Object.entries(SHAPES)) {
      const drawn: (readonly [readonly string[], string])[] = [];
      while (drawn.length < 250) {
        const candidate = generate();
        if (!isAcceptedForm(candidate[0])) drawn.push(candidate);
      }
      corpus.set(shape, drawn);
    }

    // ASSERTED FIRST: the non-vacuity control. Each shape still contributes 250 AFTER filtering.
    for (const [shape, drawn] of corpus) expect(drawn, `shape ${shape}`).toHaveLength(250);
    expect([...corpus.values()].flat()).toHaveLength(1000);

    const accepted: string[] = [];
    const unnamed: string[] = [];
    for (const [argv, offending] of [...corpus.values()].flat()) {
      const resolution = resolveOptions(argv);
      if (resolution.ok) accepted.push(JSON.stringify(argv));
      else if (!resolution.offending.includes(offending)) unnamed.push(JSON.stringify(argv));
    }

    expect(accepted).toEqual([]);
    expect(unnamed).toEqual([]);
  });
});

describe("ABC-042 — the shape of what was delivered", () => {
  it("A2 — the entry point exports nothing", () => {
    expect(executableCodeOf("cli.ts")).not.toMatch(/\bexport\b/);
  });

  it("A3 — the entry point is flat in src/, where the licence guard can see it", () => {
    // The wrong build — `src/cli/main.ts` — is invisible to `productionModulesIn`'s flat read AND
    // to the `"./history.ts"` specifier, so it goes GREEN by not being looked at. This row and
    // `ADR-0011` clause 1's trigger check are the same assertion from two directions.
    expect(productionModules()).toContain("cli.ts");
    expect(productionModules()).toContain("cli-options.ts");
    expect(productionModules()).toHaveLength(20);
    const nested = (readdirSync(SOURCE_DIRECTORY, { recursive: true }) as string[]).filter(
      (entry) => entry.includes("/") && entry.endsWith(".ts"),
    );
    expect(nested).toEqual([]);
  });

  it("A9 — process.stdout is acquired once, in the entry point, and only as the FrameSink", () => {
    const entry = executableCodeOf("cli.ts");

    // SCOPE IS THE NEW PRODUCTION MODULES, RULED — `ADR-0011` clause 1's expression, minus what was
    // merged before this ticket. A whole-tree reading reds on `src/frame.ts`, whose docblock names
    // the handle in order to say it never reaches for it, and on `glyph-mode.ts`, which legitimately
    // reads `isTTY` and is the one merged exception the ticket names. Neither is this ticket's.
    expect(entry.match(/process\.stdout/g)).toHaveLength(1);
    expect(entry).toMatch(/beginFrameSession\(process\.stdout,/);
    expect(sourceOf("cli-options.ts")).not.toContain("process.stdout");
    // And the new modules are the two named ones: a third would put this row out of date silently.
    expect(productionModules().filter((module) => module.startsWith("cli"))).toEqual([
      "cli-options.ts",
      "cli.ts",
    ]);
  });

  it("A9 — process.argv occurs EXACTLY once and only as the resolver's argument", () => {
    const entry = executableCodeOf("cli.ts");

    expect(entry.match(/process\.argv/g)).toHaveLength(1);
    expect(entry).toMatch(/resolveOptions\(process\.argv\.slice\(2\)\)/);
    // The resolver is the exclusive validator: nothing branches on the argument vector after it
    // returns, so there is no second, unvalidated input path (ASVS V2.2.2).
    expect(entry.match(/\bresolveOptions\s*\(/g)).toHaveLength(1);
  });

  it("A9 — the resolver names no ambient handle at all, comments included", () => {
    // Over the WHOLE source, the way `src/render-seam.test.ts` asserts the same absence: an
    // ambient read reached through `globalThis[\"process\"]` shipped green against the narrow form.
    const source = sourceOf("cli-options.ts");

    expect(source).not.toContain("process.");
    expect(source).not.toContain("process");
    expect(source).not.toContain("globalThis");
    expect(source).not.toContain("import.meta");
  });

  it("A8 — neither delivered module names a row count", () => {
    // The instrument is a TRANSCRIPTION, not a denylist of the row counts: every numeric literal in
    // the two modules is listed here with what it is, so a new number cannot arrive unexplained and
    // none of the listed ones is a count of rows.
    const numbersIn = (file: string): readonly string[] => {
      const code = executableCodeOf(file)
        .replace(/"(?:[^"\\]|\\.)*"/g, '""')
        .replace(/'(?:[^'\\]|\\.)*'/g, "''")
        .replace(/`(?:[^`\\$]|\\.|\$(?!\{))*`/g, "``");
      return [...new Set(code.match(/0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?/g) ?? [])].sort();
    };

    // `2` skips the two argv entries node supplies; `1` is the usage exit code; `0`, `0x20` and
    // `0x7f` are the byte filter's C0/DEL bounds.
    expect(numbersIn("cli.ts")).toEqual(["0", "0x20", "0x7f", "1", "2"]);
    // `0` starts the scan, `1` steps over `--colour`'s value, `0.5` is a fair coin.
    expect(numbersIn("cli-options.ts")).toEqual(["0", "0.5", "1"]);
  });

  it("A10 — package.json gains exactly one scripts key and nothing else", () => {
    // Asserted KEY BY KEY against the merged file, transcribed here rather than read off the diff:
    // a diff read cannot see a key that was added and removed, and this can.
    const packaged = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as Record<
      string,
      unknown
    >;
    const AT_HEAD = [
      "name",
      "version",
      "private",
      "type",
      "description",
      "engines",
      "scripts",
      "devDependencies",
    ];
    const SCRIPTS_AT_HEAD = {
      typecheck: "tsc --noEmit",
      test: "vitest run",
      "test:watch": "vitest",
      lint: "biome check .",
      "lint:fix": "biome check --write .",
      format: "biome format --write",
      build: "tsc --noEmit",
      perft: "node src/perft-bench.ts",
      "spike:perft": "node spike/perft-bench.ts",
    };

    expect(Object.keys(packaged).sort()).toEqual([...AT_HEAD].sort());
    for (const reserved of ["bin", "main", "files", "publishConfig", "dependencies"]) {
      expect(packaged, `package.json gained ${reserved}`).not.toHaveProperty(reserved);
    }
    expect(packaged.private).toBe(true);

    const scripts = packaged.scripts as Record<string, string>;
    for (const [name, command] of Object.entries(SCRIPTS_AT_HEAD)) {
      expect(scripts[name], `scripts.${name}`).toBe(command);
    }
    const added = Object.keys(scripts).filter((name) => !(name in SCRIPTS_AT_HEAD));
    expect(added).toEqual(["chess"]);
  });

  it("A12 — the licence gained exactly the entry point, and the guard still equals", () => {
    // The merged equality at `src/history-pane.nfr.test.ts:329` is what actually holds this; this
    // row asserts the BOUND `A12` puts on the edit — one element, and the array is still a
    // two-name list rather than a widened one.
    const probe = sourceOf("history-pane.nfr.test.ts");
    const declared = probe.match(/const LICENSED_DRIVERS: readonly string\[\] = \[([^\]]*)\]/);
    if (declared === null) throw new Error("no LICENSED_DRIVERS list in the probe");

    const entries = (declared[1] as string)
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry !== "");
    expect(entries.sort()).toEqual(['"cli.ts"', '"turn-loop.ts"']);
  });

  it("bar 1 — the production modules treat arguments as data, never as code", () => {
    for (const module of ["cli.ts", "cli-options.ts"]) {
      const source = sourceOf(module);
      for (const forbidden of ["eval", "Function(", "child_process", "import("]) {
        expect(source, `${module} contains ${forbidden}`).not.toContain(forbidden);
      }
      // Bar 4 — no filesystem and no network, as a GRAMMAR over specifiers plus the three globals
      // that need no import at all.
      const specifiers = [...source.matchAll(/from\s+"([^"]+)"|import\("([^"]+)"\)/g)].map(
        (match) => (match[1] ?? match[2]) as string,
      );
      for (const specifier of specifiers) {
        expect(specifier, `${module} imports ${specifier}`).not.toMatch(
          /^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/,
        );
      }
      for (const global of ["fetch", "WebSocket", "XMLHttpRequest"]) {
        expect(source, `${module} reaches ${global}`).not.toContain(global);
      }
    }
  });

  it("bar 3 — an argument carrying an escape sequence is echoed, stripped of its control bytes", () => {
    const child = CHILDREN.escape;
    const echoed = child.union.split("\n")[0] as string;

    // (i) NON-VACUITY FIRST: a build whose message never echoes the argument would satisfy every
    // absence below by saying nothing at all.
    expect(child.union).toContain("[2Jpurple");
    // (ii) The echoed LINE — a superset of the echoed token, so this is stronger, never weaker —
    // carries no C0, no U+007F and no escape. The newline that terminates it is excluded, which is
    // why the assertion is scoped to the line rather than to the whole message.
    expect(codePointsOf(echoed).filter((code) => code < 0x20 || code === 0x7f)).toEqual([]);
    expect(echoed).not.toContain("\u001b");
    // (iii) And no frame, on either channel.
    expect(frameRowsIn(child.stdout)).toEqual([]);
    expect(frameRowsIn(child.stderr)).toEqual([]);
    expect(child.status).not.toBe(0);
  });

  it("N8-LANE — this file spawns TEN children and no more", () => {
    // The budget, pinned mechanically. Every child is spawned once at module scope; a later hop
    // that adds one has to change this number and say why.
    expect(spawned).toBe(10);
    expect(Object.keys(CHILDREN)).toHaveLength(10);
  });
});
