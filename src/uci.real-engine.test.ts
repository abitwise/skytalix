/**
 * `ABC-168` (`ADR-0044` D9) — the one opt-in lane that spawns the DELIVERED UCI entry point,
 * `src/uci.ts`, and talks to it as a GUI would: one scripted dialogue, one real child, the real
 * engine, the real book file. `src/uci-session.test.ts` drives the session in-process with a virtual
 * clock and an in-memory book; this lane runs the composition the session cannot see.
 *
 * OPT-IN: `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`.
 * Two real `go movetime 1000` searches cost ~2 s of wall per run, so it is priced OUT of the default
 * lane (`NFR-008`: the default lane adds 0 spawns).
 *
 * THE `ABC-119` FORM, read rather than imported (`src/cli.real-engine.test.ts`):
 *   - unset, the deep cases are NOT DEFINED (`if (RUN_DEEP) { describe }`), never `describe.runIf` /
 *     `it.skipIf`, which report a skip and move the gate's skip count off 0;
 *   - the file always defines one default-lane test, which spawns nothing and can fail;
 *   - argument-array form, no shell, `process.execPath`, a fixed argv, a fixed script, a hang guard,
 *     a loud throw on the child's `error`, and an EMPTY child environment. One token crosses, in argv
 *     before the entry point: the last `--max-old-space-size=<digits>` of this worker's
 *     `NODE_OPTIONS` (`ABC-173`). Absent, this file throws.
 *
 * ONE DIALOGUE, ONE SPAWN (the page's test note 1). It is asynchronous because `A6` times each reply:
 *   1. `uci` → `uciok` (spawn to `uciok`, `A6` ≤ 2 s);
 *   2. `isready` → `readyok` (the first, book load included, `A6` ≤ 1 000 ms);
 *   3. `position startpos`, `go movetime 1000` → `info string book`, then a `bestmove` (`A5`, book on);
 *   4. an idle `isready` → `readyok` (`A6` ≤ 100 ms);
 *   5. `setoption name OwnBook value false` sent before `isready`, then the same `position` / `go` →
 *      an `info depth …` line and no `info string book` (`A5`, book off);
 *   6. `quit` → exit 0, nothing on stderr.
 * Every stdout line is checked against `EPIC-007` M4's keyword set. The `A6` readings are printed
 * with the host and load1 on every run; a miss is a red row, never a trimmed number.
 *
 * NO ASSERTION NAMES A MOVE. The book's choice is random and the search is the real one; each
 * `bestmove` is checked against the project's own move generator.
 *
 * The child runs from the repository, so `src/book-file.ts` finds the delivered book beside it
 * (`ADR-0044` D8, D10). A book that could not be read writes its one `info string` warning to
 * stdout, which `A5`'s `info string book` row and the empty-stderr row both see.
 */

import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { cpus, loadavg } from "node:os";
import { beforeAll, describe, expect, it } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { HARD_CEILING_MS } from "./engine.ts";
import { parseFen } from "./fen.ts";

const RUN_DEEP = process.env.UCI_DEEP === "1";

const ENTRY_POINT = new URL("uci.ts", import.meta.url).pathname;
const REPOSITORY = new URL("..", import.meta.url).pathname;
const CHILD_ENV: Readonly<Record<string, string>> = {};

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** `EPIC-007` M4: the engine-to-GUI keywords a stdout line may begin with. */
const M4_KEYWORDS: ReadonlySet<string> = new Set([
  "id",
  "option",
  "uciok",
  "readyok",
  "info",
  "bestmove",
]);

/** `A6` (`EPIC-007` M3), proposed targets: Security/NFR may change them, and a miss is reported. */
const UCIOK_WITHIN_MS = 2_000;
const FIRST_READYOK_WITHIN_MS = 1_000;
const IDLE_READYOK_WITHIN_MS = 100;

/** A HANG GUARD, NOT A CRITERION: the whole dialogue is two 1 s searches plus start-up. */
const HANG_GUARD_MS = 4 * HARD_CEILING_MS;

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

interface Line {
  readonly text: string;
  /** `performance.now()` when the line arrived. */
  readonly at: number;
}

interface Dialogue {
  readonly lines: readonly Line[];
  readonly stderr: string;
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly uciokMs: number;
  readonly firstReadyokMs: number;
  readonly idleReadyokMs: number;
  /** The lines of step 3 (book on) and step 5 (book off), each up to and including its `bestmove`. */
  readonly bookOn: readonly string[];
  readonly bookOff: readonly string[];
}

/** The lane's one spawn, and the scripted dialogue over it. */
const runDialogue = async (): Promise<Dialogue> => {
  const started = performance.now();
  const child: ChildProcessWithoutNullStreams = spawn(process.execPath, childArgv(), {
    cwd: REPOSITORY,
    env: CHILD_ENV,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const lines: Line[] = [];
  let pending = "";
  let stderr = "";
  let waiter: (() => void) | null = null;
  const wake = (): void => waiter?.();

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    const at = performance.now();
    pending += chunk;
    let newline = pending.indexOf("\n");
    while (newline !== -1) {
      lines.push({ text: pending.slice(0, newline), at });
      pending = pending.slice(newline + 1);
      newline = pending.indexOf("\n");
    }
    wake();
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });

  /** Set synchronously when the child ends (closed or failed to start), before any waiter wakes. */
  let closed = false;
  let failure: Error | null = null;
  const exited = new Promise<{ status: number | null; signal: NodeJS.Signals | null }>(
    (resolve) => {
      child.on("error", (error) => {
        failure = new Error(`child ${process.execPath} ${childArgv().join(" ")} failed: ${error}`);
        closed = true;
        wake();
        resolve({ status: null, signal: null });
      });
      child.on("close", (status, signal) => {
        closed = true;
        wake();
        resolve({ status, signal });
      });
    },
  );

  const guard = setTimeout(() => child.kill("SIGTERM"), HANG_GUARD_MS);

  const send = (line: string): number => {
    child.stdin.write(`${line}\n`);
    return performance.now();
  };
  /** Waits for the first line at or after `from` that `matches`; returns it. Throws if the child ends first. */
  const waitFor = async (from: number, matches: (text: string) => boolean): Promise<Line> => {
    for (;;) {
      const found = lines.slice(from).find((line) => matches(line.text));
      if (found !== undefined) return found;
      if (failure !== null) throw failure;
      if (closed)
        throw new Error(
          `the child ended before the awaited line; stdout so far:\n${lines.map((l) => l.text).join("\n")}\nstderr:\n${stderr}`,
        );
      await new Promise<void>((resolve) => {
        waiter = resolve;
      });
      waiter = null;
    }
  };
  const isBestmove = (text: string): boolean => text.startsWith("bestmove");
  const segment = (from: number, to: number): string[] =>
    lines.slice(from, to).map((line) => line.text);

  try {
    // 1. spawn → uciok
    send("uci");
    const uciok = await waitFor(0, (text) => text === "uciok");
    const uciokMs = uciok.at - started;

    // 2. the first isready → readyok, book load included
    let mark = lines.length;
    let sent = send("isready");
    const firstReadyokMs = (await waitFor(mark, (text) => text === "readyok")).at - sent;

    // 3. book on
    const bookOnFrom = lines.length;
    send("position startpos");
    send("go movetime 1000");
    await waitFor(bookOnFrom, isBestmove);
    const bookOn = segment(bookOnFrom, lines.length);

    // 4. a later, idle isready → readyok
    mark = lines.length;
    sent = send("isready");
    const idleReadyokMs = (await waitFor(mark, (text) => text === "readyok")).at - sent;

    // 5. book off: setoption before isready, then the same position and go
    const bookOffFrom = lines.length;
    send("setoption name OwnBook value false");
    send("isready");
    await waitFor(bookOffFrom, (text) => text === "readyok");
    send("position startpos");
    send("go movetime 1000");
    await waitFor(bookOffFrom, isBestmove);
    const bookOff = segment(bookOffFrom, lines.length);

    // 6. quit
    send("quit");
    child.stdin.end();
    const { status, signal } = await exited;
    if (failure !== null) throw failure;
    return {
      lines,
      stderr,
      status,
      signal,
      uciokMs,
      firstReadyokMs,
      idleReadyokMs,
      bookOn,
      bookOff,
    };
  } finally {
    clearTimeout(guard);
    if (!closed) child.kill("SIGTERM");
  }
};

/** The `bestmove`'s move, checked against the project's own generator from the start position. */
const expectLegalFromStart = (lines: readonly string[]): void => {
  const bestmoves = lines.filter((line) => line.startsWith("bestmove"));
  expect(bestmoves, "exactly one bestmove in the segment").toHaveLength(1);
  expect(lines.at(-1), "the bestmove ends the segment").toBe(bestmoves[0]);
  const move = (bestmoves[0] as string).split(" ")[1] as string;
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
  });
});

if (RUN_DEEP) {
  describe("ABC-168 — one real UCI dialogue against node src/uci.ts [deep, UCI_DEEP=1]", () => {
    let dialogue: Dialogue;
    beforeAll(async () => {
      dialogue = await runDialogue();
      // `A6`'s record, with the host and load1, on every run of this lane.
      console.log(
        `UCI_DEEP A6 readings: spawn→uciok ${dialogue.uciokMs.toFixed(0)} ms, first isready→readyok ${dialogue.firstReadyokMs.toFixed(0)} ms, idle isready→readyok ${dialogue.idleReadyokMs.toFixed(1)} ms; host ${cpus()[0]?.model ?? "unknown"}, node ${process.version}, load1 ${loadavg()[0]?.toFixed(2)}`,
      );
    }, 2 * HANG_GUARD_MS);

    it("A5 (book on) — the output holds info string book, then a legal bestmove", () => {
      const at = dialogue.bookOn.indexOf("info string book");
      expect(at, `info string book in ${JSON.stringify(dialogue.bookOn)}`).toBeGreaterThanOrEqual(
        0,
      );
      expect(dialogue.bookOn.findIndex((line) => line.startsWith("bestmove"))).toBeGreaterThan(at);
      expectLegalFromStart(dialogue.bookOn);
    });

    it("A5 (book off) — after setoption OwnBook false before isready: an info depth line, no info string book, a legal bestmove", () => {
      expect(dialogue.bookOff).not.toContain("info string book");
      expect(dialogue.bookOff.some((line) => /^info depth \d+/.test(line))).toBe(true);
      expectLegalFromStart(dialogue.bookOff);
    });

    it("A6 — spawn→uciok ≤ 2 s, the first isready→readyok ≤ 1 000 ms, an idle isready→readyok ≤ 100 ms", () => {
      expect(dialogue.uciokMs).toBeLessThanOrEqual(UCIOK_WITHIN_MS);
      expect(dialogue.firstReadyokMs).toBeLessThanOrEqual(FIRST_READYOK_WITHIN_MS);
      expect(dialogue.idleReadyokMs).toBeLessThanOrEqual(IDLE_READYOK_WITHIN_MS);
    });

    it("M4 — every stdout line begins with an engine-to-GUI keyword", () => {
      expect(dialogue.lines.length).toBeGreaterThan(0);
      for (const { text } of dialogue.lines) {
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
