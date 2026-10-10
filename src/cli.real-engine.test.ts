/**
 * `ABC-119` (`G-06`, with the hyphen) — the one lane that spawns the DELIVERED CLI and lets the REAL
 * `src/engine.ts` search choose a move. Every engine turn in `src/cli.test.ts` runs on a double
 * (`DEFAULT_BUDGET_MS = 0`), and its wiring row reads the entry point's SOURCE; `ENGINE_DEEP` runs
 * the search in-process. Neither runs the composition. This lane does.
 *
 * OPT-IN: `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`. One real ply costs ~3.1 s of wall
 * and ~3 s of CPU per child, so it is priced OUT of the default lane (the page's arithmetic).
 *
 * TWO MEASURED TRAPS, both binding (the page's construction constraints):
 *   1. `describe.runIf` / `it.skipIf` REPORT A SKIP and move the gate's skip count off 0. The deep
 *      cases are therefore NOT DEFINED when the variable is unset — `if (RUN_DEEP) { describe }`,
 *      the `src/engine.test.ts` form.
 *   2. A file that registers nothing fails the default lane (`No test suite found`). So this file
 *      always defines one default-lane test. It spawns nothing, and it can fail.
 *
 * WHY IT IS NOT IN `src/cli.test.ts`: that file pins its child count (`N8_SPAWN`) and holds exactly
 * one `spawnSync` call site; no real-engine child fits inside either pin (BA/PM's placement ruling).
 * This file brings its own spawn and follows that file's discipline by reading it, not importing it:
 * argument-array form, no shell, a fixed argv, a fixed stdin script, a `timeout`, and a loud throw on
 * `child.error`. The child gets an EMPTY environment, so nothing outside this file — no secret, and
 * no `NODE_OPTIONS=--import=…` that would slip a double in — reaches it.
 *
 * `A3`: NO ASSERTION NAMES A MOVE, A SCORE, A DEPTH OR A NODE COUNT. The opponent is
 * non-deterministic; every assertion is on a property the real search cannot legally violate. The
 * reply is checked against the project's own move generator, never against a literal.
 */

import { spawnSync } from "node:child_process";
import { lstatSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { HARD_CEILING_MS } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { rejectionMessage } from "./rejection.ts";
import { toSan } from "./san.ts";
import { INPUT_ENDED_NOTICE } from "./turn-loop.ts";

const RUN_DEEP = process.env.CLI_DEEP === "1";

const REPOSITORY = new URL("..", import.meta.url).pathname;
const ENTRY_POINT = new URL("cli.ts", import.meta.url).pathname;

/**
 * The deep child's whole command line, fixed. `--colour black` hands the first move to the engine;
 * `--ascii` fixes the glyph mode so no environment is consulted. No `--import`, no hook, no double.
 */
const ARGV: readonly string[] = [ENTRY_POINT, "--colour", "black", "--ascii"];
const CHILD_ENV: Readonly<Record<string, string>> = {};

/** The position `src/cli.ts` starts every game from — the same literal it holds. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * A HANG GUARD, NOT A CRITERION. Four times `A3`(ii)'s ceiling, so a slow child is a red ROW on
 * `HARD_CEILING_MS` and only a child that never returns reaches this.
 */
const HANG_GUARD_MS = 4 * HARD_CEILING_MS;

/** `A1`'s floor: a reply faster than this means a double or a budget-less engine leaked in. */
const REAL_SEARCH_FLOOR_MS = 1_000;

interface RealChild {
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  /** Spawn to exit, measured around the blocking call — an upper bound on the engine's reply. */
  readonly wallMs: number;
}

const spawnReal = (script: string): RealChild => {
  const started = performance.now();
  const child = spawnSync(process.execPath, ARGV, {
    cwd: REPOSITORY,
    encoding: "utf8",
    env: CHILD_ENV,
    input: script,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: HANG_GUARD_MS,
  });
  const wallMs = performance.now() - started;
  if (child.error !== undefined)
    throw new Error(`child ${process.execPath} ${ARGV.join(" ")} failed: ${child.error}`);
  // `A1`'s record: the command verbatim and the measured wall, on every run of this lane.
  console.log(
    `[CLI_DEEP] ${process.execPath} ${ARGV.join(" ")} <<< ${JSON.stringify(script)} — ` +
      `wall ${wallMs.toFixed(0)} ms, exit ${child.status}, signal ${child.signal}`,
  );
  return {
    status: child.status,
    signal: child.signal,
    stdout: child.stdout,
    stderr: child.stderr,
    wallMs,
  };
};

interface Frame {
  readonly side: "White" | "Black";
  /** Half-moves played before this frame, read off the status row's `N.` / `N...`. */
  readonly ply: number;
  /** The printed board as a FEN placement field, whatever the orientation. */
  readonly placement: string;
  /** The SAN on the `last:` row, when there is one. */
  readonly last: string | undefined;
  readonly text: string;
}

/**
 * Every frame on the child's stdout, located by its status row (`White to move  1.`). The eight rank
 * rows and the file-label row above it are read back into a placement, so the board is compared with
 * the generator's position rather than with a picture.
 */
const framesOf = (stdout: string): Frame[] => {
  const lines = stdout.split("\n").map((line) => line.replace(/^> /, ""));
  const starts: number[] = [];
  const found: Omit<Frame, "text">[] = [];
  lines.forEach((line, at) => {
    const status = /^(White|Black) to move\s+(\d+)\.(\.\.)?(?:\s|$)/.exec(line);
    if (status === null) return;
    const files = (lines[at - 1] ?? "").trim().split(/\s+/);
    const squares = new Map<string, string>();
    for (const row of lines.slice(at - 9, at - 1)) {
      const rank = /^([1-8]) (.{16})/.exec(row);
      if (rank === null) throw new Error(`not a rank row above a status row: ${row}`);
      for (let file = 0; file < 8; file++) {
        const piece = (rank[2] as string)[2 * file + 1] as string;
        if (/[pnbrqk]/i.test(piece)) squares.set(`${files[file]}${rank[1]}`, piece);
      }
    }
    let placement = "";
    for (let rank = 8; rank >= 1; rank--) {
      let empty = 0;
      for (const file of "abcdefgh") {
        const piece = squares.get(`${file}${rank}`);
        if (piece === undefined) empty++;
        else {
          placement += `${empty > 0 ? empty : ""}${piece}`;
          empty = 0;
        }
      }
      placement += `${empty > 0 ? empty : ""}${rank > 1 ? "/" : ""}`;
    }
    starts.push(at - 9);
    found.push({
      side: status[1] as "White" | "Black",
      ply: 2 * (Number(status[2]) - 1) + (status[3] === undefined ? 0 : 1),
      placement,
      last: /last: (\S+)/.exec(lines[at + 1] ?? "")?.[1],
    });
  });
  return found.map((frame, index) => ({
    ...frame,
    text: lines.slice(starts[index], starts[index + 1]).join("\n"),
  }));
};

const placementOf = (fen: string): string => fen.split(" ")[0] as string;

describe("ABC-119 — the real-engine lane's child is the delivered composition (default lane; spawns nothing)", () => {
  it("the deep child runs the delivered entry point with no --import, loader or hook, and an empty environment", () => {
    expect(lstatSync(ENTRY_POINT).isFile()).toBe(true);
    expect(ARGV[0]).toBe(ENTRY_POINT);
    expect(
      ARGV.slice(1).filter((arg) => /import|loader|require|hook|conditions/.test(arg)),
    ).toEqual([]);
    expect(Object.keys(CHILD_ENV)).toEqual([]);
  });
});

if (RUN_DEEP) {
  describe("ABC-119 — CLI_DEEP: the delivered CLI against the REAL engine", () => {
    /** Empty stdin: the engine plays its ply, the prompt reads end of input, the session ends. */
    let played: RealChild;
    /** One unreadable line after the engine's ply: the `ABC-019` rejection cadence, for real. */
    let rejected: RealChild;
    const UNREADABLE = "zz9";

    beforeAll(() => {
      played = spawnReal("");
      rejected = spawnReal(`${UNREADABLE}\n`);
    }, 4 * HANG_GUARD_MS);

    it("A1 — the real search answered: the child took at least 1 s and exited 0", () => {
      for (const child of [played, rejected]) {
        expect(child.wallMs).toBeGreaterThanOrEqual(REAL_SEARCH_FLOOR_MS);
        expect(child.status).toBe(0);
        expect(child.signal).toBeNull();
      }
    });

    it("A3(i) — the reply is a legal move in the position it was played in, by the project's own generator", () => {
      const frames = framesOf(played.stdout);
      expect(frames).toHaveLength(2);
      const [before, after] = frames as [Frame, Frame];

      const position = parseFen(START_FEN);
      expect(before.placement).toBe(placementOf(START_FEN));
      const legal = legalMoves(position);
      const replies = legal.filter((move) => toSan(position, move, legal) === after.last);
      expect(replies).toHaveLength(1);

      makeMove(position, replies[0] as (typeof legal)[number]);
      expect(after.placement).toBe(placementOf(toFen(position)));
    });

    it("A3(ii) — the whole child, spawn to exit, stays inside NFR-004's 5 s hard ceiling (clause B)", () => {
      expect(played.wallMs).toBeLessThanOrEqual(HARD_CEILING_MS);
    });

    it("A3(iii) — the session advances: the side to move and the ply number both change", () => {
      const [before, after] = framesOf(played.stdout) as [Frame, Frame];
      expect(after.side).not.toBe(before.side);
      expect(after.ply).toBe(before.ply + 1);
    });

    it("A3(iv) — no stack trace on stderr, and the exit code is 0, never 70", () => {
      expect(played.stderr).not.toMatch(/^\s*at\s|Error\b/m);
      expect(played.status).toBe(0);
    });

    it("A4 — an unreadable line against the real engine does not advance, carries a message, and the session continues", () => {
      const frames = framesOf(rejected.stdout);
      expect(frames).toHaveLength(3);
      const [, replied, refused] = frames as [Frame, Frame, Frame];

      expect(refused.side).toBe(replied.side);
      expect(refused.ply).toBe(replied.ply);
      expect(refused.placement).toBe(replied.placement);

      const message = rejectionMessage({ reason: "unreadable" });
      expect(replied.text).not.toContain(message);
      expect(refused.text).toContain(message);

      // It continued: it went back to the prompt, and the session ended on END OF INPUT, not on
      // the rejection.
      expect(refused.text.trimEnd().endsWith(INPUT_ENDED_NOTICE)).toBe(true);
      expect(rejected.status).toBe(0);
      expect(rejected.stderr).not.toMatch(/^\s*at\s|Error\b/m);
    });
  });
}
