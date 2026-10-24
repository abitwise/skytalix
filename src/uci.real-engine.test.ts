/**
 * `ABC-168` (`ADR-0044` D9) — the one opt-in lane that spawns the DELIVERED UCI entry point,
 * `src/uci.ts`, and plays one scripted GUI dialogue against it: one real child, the real engine, the
 * real book file. `src/uci-session.test.ts` drives the session in-process with a virtual clock and an
 * in-memory book; this lane runs the composition the session cannot see.
 *
 * OPT-IN: `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`.
 * One real `go movetime 1000` search costs ~1 s of wall per run, so it is priced OUT of the default
 * lane (`NFR-008`: the default lane adds 0 spawns).
 *
 * THE `ABC-119` FORM, read rather than imported (`src/cli.real-engine.test.ts`):
 *   - unset, the deep cases are NOT DEFINED (`if (RUN_DEEP) { describe }`), never `describe.runIf` /
 *     `it.skipIf`, which report a skip and move the gate's skip count off 0;
 *   - the file always defines one default-lane test, which spawns nothing and can fail;
 *   - `spawnSync` (`ABC-173` `C2`: no asynchronous `child_process` form in `src/**\/*.test.ts`), the
 *     argument-array form, no shell, `process.execPath`, a fixed argv, a fixed stdin script, a
 *     `timeout`, a loud throw on `child.error`, and an EMPTY child environment. One token crosses, in
 *     argv before the entry point: the last `--max-old-space-size=<digits>` of this worker's
 *     `NODE_OPTIONS` (`ABC-173` Ruling 3). Absent, this file throws.
 *
 * ONE DIALOGUE, ONE SPAWN (the page's test note 1):
 *   `uci`, `isready`; `position startpos`, `go movetime 1000` (`A5`, book on: `info string book`, then
 *   a `bestmove`); `isready`; `setoption name OwnBook value false` sent before `isready`, then the
 *   same `position` / `go` (`A5`, book off: an `info depth …` line and no `info string book`); `quit`.
 * Every stdout line is checked against `EPIC-007` M4's keyword set.
 *
 * NOT HERE: `A6`'s three reply latencies. A synchronous child hands its parent the whole output at
 * exit, so no per-reply time can be read from it, and `C2` bars the asynchronous form. The child's
 * spawn-to-exit wall is printed on every run, labelled as what it is; it is not an `A6` reading.
 *
 * NO ASSERTION NAMES A MOVE. The book's choice is random and the search is the real one; each
 * `bestmove` is checked against the project's own move generator.
 *
 * The child runs from the repository, so `src/book-file.ts` finds the delivered book beside it
 * (`ADR-0044` D8, D10). A book that could not be read writes its one `info string` warning to
 * stdout, which the book-on row sees.
 */

import { spawnSync } from "node:child_process";
import { cpus, loadavg } from "node:os";
import { beforeAll, describe, expect, it } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { parseFen } from "./fen.ts";

const RUN_DEEP = process.env.UCI_DEEP === "1";

const ENTRY_POINT = new URL("uci.ts", import.meta.url).pathname;
const REPOSITORY = new URL("..", import.meta.url).pathname;
const CHILD_ENV: Readonly<Record<string, string>> = {};

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The one script the child reads, fixed. */
const DIALOGUE = [
  "uci",
  "isready",
  "position startpos",
  "go movetime 1000",
  "isready",
  "setoption name OwnBook value false",
  "isready",
  "position startpos",
  "go movetime 1000",
  "quit",
];

/** `EPIC-007` M4: the engine-to-GUI keywords a stdout line may begin with. */
const M4_KEYWORDS: ReadonlySet<string> = new Set([
  "id",
  "option",
  "uciok",
  "readyok",
  "info",
  "bestmove",
]);

/**
 * A HANG GUARD, NOT A CRITERION: the dialogue is one 1 s search, one book hit and start-up.
 * `ABC-212`: a literal 20 s, today's value, so it does not grow with `HARD_CEILING_MS` (32 000).
 */
const HANG_GUARD_MS = 20_000;

/** `ABC-173`: the last `--max-old-space-size=<digits>` in this worker's `NODE_OPTIONS`, or a throw. */
const heapToken = (): string => {
  const tokens = (process.env.NODE_OPTIONS ?? "").match(
    /(?:^|\s)(--max-old-space-size=\d+)(?=\s|$)/g,
  );
  const last = tokens?.at(-1)?.trim();
  if (last === undefined)
    throw new Error(
      "no --max-old-space-size=<digits> in NODE_OPTIONS: run this lane as AGENTS.md spells it (ABC-173)",
    );
  return last;
};

/** The child's argv after `node`: the heap token, then the delivered entry point. Nothing else. */
const childArgv = (): string[] => [heapToken(), ENTRY_POINT];

interface Dialogue {
  readonly lines: readonly string[];
  readonly stderr: string;
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  /** Spawn to exit, around the blocking call. Not an `A6` reading. */
  readonly wallMs: number;
}

/** The lane's one spawn. */
const runDialogue = (): Dialogue => {
  const argv = childArgv();
  const started = performance.now();
  const child = spawnSync(process.execPath, argv, {
    cwd: REPOSITORY,
    encoding: "utf8",
    env: CHILD_ENV,
    input: `${DIALOGUE.join("\n")}\n`,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: HANG_GUARD_MS,
  });
  const wallMs = performance.now() - started;
  if (child.error !== undefined)
    throw new Error(`child ${process.execPath} ${argv.join(" ")} failed: ${child.error}`);
  const lines = child.stdout.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return { lines, stderr: child.stderr, status: child.status, signal: child.signal, wallMs };
};

/**
 * The lines one `go` answered, by position in the output: after the `readyok` that precedes it, up
 * to and including its `bestmove`. The first `go` follows the 1st `readyok`; the second follows the
 * 3rd (the 2nd answers the `isready` sent after the first `go`).
 */
const segmentAfter = (lines: readonly string[], readyok: number, bestmove: number): string[] => {
  const indexesOf = (matches: (line: string) => boolean): number[] =>
    lines.flatMap((line, index) => (matches(line) ? [index] : []));
  const readyAt = indexesOf((line) => line === "readyok");
  const bestAt = indexesOf((line) => line.startsWith("bestmove"));
  expect(readyAt, `three readyok lines in ${JSON.stringify(lines)}`).toHaveLength(3);
  expect(bestAt, `two bestmove lines in ${JSON.stringify(lines)}`).toHaveLength(2);
  return lines.slice((readyAt[readyok] as number) + 1, (bestAt[bestmove] as number) + 1);
};

/** The segment ends in one `bestmove`, whose move is legal from the start position. */
const expectLegalFromStart = (segment: readonly string[]): void => {
  const last = segment.at(-1) as string;
  expect(last.startsWith("bestmove"), `the segment ends in a bestmove: ${last}`).toBe(true);
  const move = last.split(" ")[1] as string;
  expect(move, "a UCI coordinate move").toMatch(/^[a-h][1-8][a-h][1-8][qrbn]?$/);
  expect(parseCoordinateMove(parseFen(START_FEN), move).outcome, `${move} is legal`).toBe("move");
};

describe("ABC-168 — the UCI lane's child is the delivered entry point (default lane; spawns nothing)", () => {
  it("the child runs src/uci.ts with only the heap token, no --import, loader or hook, and an empty environment", () => {
    const argv = childArgv();
    expect(argv).toHaveLength(2);
    expect(argv[0]).toMatch(/^--max-old-space-size=\d+$/);
    expect(argv[1]).toBe(ENTRY_POINT);
    expect(ENTRY_POINT.endsWith("/src/uci.ts")).toBe(true);
    for (const token of argv) {
      expect(token, "no loader or hook reaches the child").not.toMatch(
        /^--(import|loader|experimental-loader|require)\b|^-r$/,
      );
    }
    expect(Object.keys(CHILD_ENV)).toEqual([]);
    expect(DIALOGUE.at(-1), "the script ends the session itself").toBe("quit");
  });
});

if (RUN_DEEP) {
  describe("ABC-168 — one real UCI dialogue against node src/uci.ts [deep, UCI_DEEP=1]", () => {
    let dialogue: Dialogue;
    beforeAll(() => {
      dialogue = runDialogue();
      console.log(
        `UCI_DEEP child: spawn to exit ${dialogue.wallMs.toFixed(0)} ms (not an A6 reading); host ${cpus()[0]?.model ?? "unknown"}, node ${process.version}, load1 ${loadavg()[0]?.toFixed(2)}`,
      );
    }, 2 * HANG_GUARD_MS);

    it("A5 (book on) — the output holds info string book, then a legal bestmove", () => {
      const segment = segmentAfter(dialogue.lines, 0, 0);
      expect(segment, JSON.stringify(segment)).toContain("info string book");
      expectLegalFromStart(segment);
    });

    it("A5 (book off) — after setoption OwnBook false before isready: an info depth line, no info string book, a legal bestmove", () => {
      const segment = segmentAfter(dialogue.lines, 2, 1);
      expect(segment).not.toContain("info string book");
      expect(segment.some((line) => /^info depth \d+/.test(line))).toBe(true);
      expectLegalFromStart(segment);
    });

    it("M4 — every stdout line begins with an engine-to-GUI keyword", () => {
      expect(dialogue.lines.length).toBeGreaterThan(0);
      for (const text of dialogue.lines) {
        expect(
          M4_KEYWORDS.has(text.split(" ")[0] as string),
          `stdout line ${JSON.stringify(text)}`,
        ).toBe(true);
      }
    });

    it("quit — the child exits 0, by no signal, with nothing on stderr", () => {
      expect(dialogue.signal).toBeNull();
      expect(dialogue.status).toBe(0);
      expect(dialogue.stderr).toBe("");
    });
  });
}
