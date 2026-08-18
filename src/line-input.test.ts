/**
 * `ABC-037`'s eight acceptance criteria, its three security bars, and the guards that make each of
 * them bite. ONE test file, which is the page's whole lane allotment.
 *
 * THE SOURCE IS A REAL `PassThrough`, not a hand-rolled emitter. `A2`'s "reads exactly one line per
 * call" is only worth asserting against real pause/resume semantics: the assertion that matters is
 * that a third line written into the pipe is STILL IN THE PIPE afterwards, and only a real stream
 * can be asked that question (`stream.readableLength`, `stream.read()`).
 *
 * ---------------------------------------------------------------------------------------------
 * THE `A6` GUARD, AND THE FIVE CHANNELS IT WAS BUILT AGAINST — read this before trusting it.
 * ---------------------------------------------------------------------------------------------
 * `ABC-035`'s QE proved that a `vi.spyOn` stream guard is blind to four channels — `console.log`,
 * `console.error`, a `process.stdout.write` reference BOUND AT MODULE LOAD, and `fs.writeSync` —
 * and to a `globalThis` flag. Vitest intercepts `console.*` before it reaches `process.stdout`, and
 * `vi.spyOn` replaces a property that a load-time binding already copied out.
 *
 * That weakness is LIVE here in a way it was not there, because this module legitimately writes.
 * So the guard is not one spy, it is three layers, and each channel is named against the layer that
 * actually sees it:
 *
 *   1. `console.log` / `console.error`  — seen at RUNTIME. The spy is on `console` itself, which is
 *      what vitest intercepts THROUGH, so a call is counted even though its bytes never reach
 *      `process.stdout.write`. Layer 3 also catches it.
 *   2. a load-time-bound `process.stdout.write` — NOT seen by any runtime spy, and no spy is
 *      claimed to see it. It is closed BY CONSTRUCTION and verified by layer 3: the delivered
 *      module contains the token `process` zero times in code, so there is no reference to bind,
 *      early or late.
 *   3. `fs.writeSync` — NOT seen by any runtime spy either, and mocking `node:fs` would cost a
 *      hoisted `vi.mock` this ticket's lane cannot spend. Closed by layer 2: the module's import
 *      set is asserted to be EXACTLY four relative project modules, so there is no `fs` binding.
 *   4. a `globalThis` flag — seen at RUNTIME by a key-set diff across a full exercise, AND by
 *      layer 3's token scan.
 *   5. the module's own legitimate write — seen directly: the injected `PromptOutput` records every
 *      byte, and the assertion is byte-exact (`PROMPT` per call, nothing else, zero ESC).
 *
 * The three layers:
 *   layer 1 — RUNTIME spies: the injected output, the loop's `FrameSink` counted only while the
 *             seam is on the stack, `console.*`, `process.stdout.write` / `process.stderr.write`,
 *             and a `globalThis` key diff.
 *   layer 2 — the module's IMPORT SET, extracted from the delivered file: exactly four relative
 *             project modules. Zero Node builtins, zero packages. This is what makes "the module
 *             cannot reach a stream it was not handed" a fact rather than a hope.
 *   layer 3 — a TOKEN SCAN over the delivered file with comments stripped: `process`, `console`,
 *             `globalThis`, `eval`, `Function`, `require`, dynamic `import(`, `child_process`,
 *             `writeSync`, `fetch` — all zero. Comments are stripped first because the module's own
 *             header NAMES those tokens to say it does not use them, and a guard that fired on
 *             prose would be deleted by the next engineer.
 *
 * THE LIMIT, STATED PLAINLY RATHER THAN GLOSSED. Layer 3 is lexical. It sees `process.stdout` and
 * it does not see a deliberately obfuscated reconstruction of it. Nothing in this suite would catch
 * a module that assembled a global's name from fragments at runtime. What it does catch is every
 * channel `ABC-035` measured, in the form that ticket measured them, plus the plain-text form of
 * the two that no runtime spy can see at all — and it catches them on the DELIVERED bytes, so a
 * later edit that adds `import fs from "node:fs"` reds this file rather than shipping.
 *
 * ---------------------------------------------------------------------------------------------
 * LANE COST. `ABC-108` records the default lane at or over `NFR-008`'s 13 s CPU clause, so
 * `N8-LANE`'s 650 ms slice is not honestly available and this file does not claim it. The default
 * lane here is kept to the criteria and one boundary row per bar; the BREADTH — the 16 MiB
 * unterminated-flood memory bound, the chunk-boundary permutation sweep and the 10,000-character
 * totality row — runs only under `INPUT_DEEP=1`. Unset, those cases are NOT DEFINED rather than
 * skipped, so the gate's skip count stays 0 — the same shape as `PERFT_DEEP`, `SEARCH_DEEP` and
 * `ENGINE_DEEP`.
 */
import { readFileSync } from "node:fs";
import { PassThrough } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { helpMessages } from "./command-input.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import { assembleFrame, type FrameSink } from "./frame.ts";
import { type GameHistory, newGame } from "./history.ts";
import { legalMoves } from "./legal.ts";
import {
  createLineInputSeam,
  LINE_TOO_LONG_MESSAGES,
  MAX_LINE_LENGTH,
  PROMPT,
} from "./line-input.ts";
import type { MoveInputDeps } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { parseSan, toSan } from "./san.ts";
import {
  type EngineSeam,
  INPUT_ENDED_NOTICE,
  type InputSeam,
  type PromptOutcome,
  type RenderSeam,
  runTurnLoop,
} from "./turn-loop.ts";

const RUN_DEEP = process.env.INPUT_DEEP === "1";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** One macrotask. Enough for a `resume()`d stream to deliver the chunks already in its buffer. */
const tick = (): Promise<void> => new Promise<void>((resolve) => setImmediate(resolve));

/** Every byte the seam wrote, in order. `A6`'s primary instrument. */
interface RecordingOutput {
  readonly writes: string[];
  write(text: string): void;
}

function recordingOutput(): RecordingOutput {
  const writes: string[] = [];
  return {
    writes,
    write(text: string) {
      writes.push(text);
    },
  };
}

interface SpiedDeps {
  readonly deps: MoveInputDeps;
  /** Every text either resolver was asked about — `A2`'s "the third line was never read". */
  readonly texts: string[];
}

/**
 * The real resolvers, spied. `MoveInputDeps` is `ABC-033`'s test seam and it is why `A4`, `A5` and
 * `A7` need no hoisted `vi.mock`, which is what keeps this ticket at one test file.
 */
function spiedDeps(overrides: Partial<MoveInputDeps> = {}): SpiedDeps {
  const texts: string[] = [];
  const deps: MoveInputDeps = {
    legalMoves: vi.fn(legalMoves),
    parseCoordinateMove: vi.fn((position, text, legal) => {
      texts.push(text);
      return parseCoordinateMove(position, text, legal);
    }),
    parseSan: vi.fn((position, text, legal) => {
      texts.push(text);
      return parseSan(position, text, legal);
    }),
    toSan: vi.fn(toSan),
    ...overrides,
  };
  return { deps, texts };
}

interface RecordingSink extends FrameSink {
  readonly writes: string[];
}

function recordingSink(): RecordingSink {
  const writes: string[] = [];
  return {
    writes,
    isTTY: false,
    rows: 0,
    write(text: string) {
      writes.push(text);
    },
  };
}

/** A three-row frame. This ticket composes no frame; the loop needs one and nothing here reads it. */
const stubRender: RenderSeam = (_history, _status, _thinking, messages) => [
  "board",
  "status",
  messages.join("|"),
];

/** Plays the scripted coordinate moves, in order. Every move comes from `legalMoves`. */
function scriptedEngine(script: readonly string[]): EngineSeam {
  let index = 0;
  return async (history: GameHistory): Promise<Move> => {
    const text = script[index++] as string;
    const parsed = parseCoordinateMove(history.position, text, legalMoves(history.position));
    if (parsed.outcome !== "move") throw new Error(`engine script bad: ${text}`);
    return parsed.move;
  };
}

describe("ABC-037 — the production InputSeam", () => {
  describe("A1 — it IS the seam, by type and by use", () => {
    it("binds into runTurnLoop as options.input with no adapter and no cast, and runs a scripted game to a terminal result", async () => {
      const source = new PassThrough();
      const output = recordingOutput();
      const history = newGame(START_FEN);
      // NO CAST AND NO ADAPTER: the declared type is `InputSeam` and the value is the export.
      const input: InputSeam = createLineInputSeam({ source, output });

      // Scholar's mate: four human plies, three engine replies, terminal by checkmate.
      source.write("e4\nBc4\nQh5\nQxf7\n");

      const outcome = await runTurnLoop({
        history,
        humanColour: "white",
        render: stubRender,
        input,
        engine: scriptedEngine(["e7e5", "b8c6", "g8f6"]),
        sink: recordingSink(),
      });

      expect(outcome).toEqual({ result: "white-wins", reason: "checkmate", exitCode: 0 });
      expect(history.moves.length).toBe(7);
      expect(output.writes).toEqual([PROMPT, PROMPT, PROMPT, PROMPT]);
    });
  });

  describe("A2 — one line, one outcome, one call, and the rest stays unread", () => {
    it("resolves once per line in order, and leaves a third line still in the pipe", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      const history = newGame(START_FEN);

      // THREE SEPARATE WRITES, so the pipe holds three chunks and "still buffered" is answerable.
      source.write("e4\n");
      source.write("Nf3\n");
      source.write("d4\n");

      const first = await seam(history);
      const second = await seam(history);

      expect(first.kind).toBe("move");
      expect(second.kind).toBe("move");
      expect(
        toSan(history.position, (first as { move: Move }).move, legalMoves(history.position)),
      ).toBe("e4");
      expect(
        toSan(history.position, (second as { move: Move }).move, legalMoves(history.position)),
      ).toBe("Nf3");

      // THE WITNESS. A reader that drained stdin passes every content assertion above and eats
      // the player's next move; here the third line is still in the pipe, unread.
      expect(texts).not.toContain("d4");
      expect(source.readableLength).toBe(Buffer.byteLength("d4\n"));
      expect((source.read() as Buffer).toString()).toBe("d4\n");
    });

    it("serves a surplus from ONE chunk in order, and asks no resolver about it before it is wanted", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      const history = newGame(START_FEN);

      // One chunk, three lines. There is no un-read, so the surplus is the module's own queue —
      // and the point of the assertion is that it is still not RESOLVED until it is asked for.
      source.write("e4\nNf3\nd4\n");

      await seam(history);
      await seam(history);
      expect(texts).not.toContain("d4");

      const third = await seam(history);
      expect(third.kind).toBe("move");
      expect(texts).toContain("d4");
    });
  });

  describe("A3 — EOF is `eof`, in both end shapes, and the loop's merged behaviour is unchanged", () => {
    it("resolves eof when the stream ends with a trailing line that has no newline", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      const history = newGame(START_FEN);

      source.write("e4\nNf3");
      source.end();

      expect((await seam(history)).kind).toBe("move");
      // The partial tail was never submitted — the player did not press Enter on it.
      expect(await seam(history)).toEqual({ kind: "eof" });
      expect(texts).not.toContain("Nf3");
    });

    it("resolves eof when the stream ends MID-LINE while a read is in flight", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      const history = newGame(START_FEN);

      const pending = seam(history);
      await tick();
      source.write("e");
      await tick();
      source.end();

      expect(await pending).toEqual({ kind: "eof" });
      expect(texts).toEqual([]);
    });

    it("terminates the merged loop with result null, reason null, exitCode 0 and INPUT_ENDED_NOTICE", async () => {
      const source = new PassThrough();
      const sink = recordingSink();
      const history = newGame(START_FEN);
      source.end();

      const outcome = await runTurnLoop({
        history,
        humanColour: "white",
        render: stubRender,
        input: createLineInputSeam({ source, output: recordingOutput() }),
        engine: scriptedEngine([]),
        sink,
      });

      expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
      expect(sink.writes).toContain(`${INPUT_ENDED_NOTICE}\n`);
      expect(history.moves.length).toBe(0);
    });
  });

  describe("A4 — commands are classified before grammars, through the delegated table", () => {
    it("resolves `help` to kind command with the folded help, and calls NEITHER resolver", async () => {
      const source = new PassThrough();
      const { deps } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });

      source.write("help\n");
      const outcome = await seam(newGame(START_FEN));

      expect(outcome).toEqual({ kind: "command", messages: helpMessages() });
      expect(deps.parseCoordinateMove).toHaveBeenCalledTimes(0);
      expect(deps.parseSan).toHaveBeenCalledTimes(0);
      expect(deps.legalMoves).toHaveBeenCalledTimes(0);
    });

    it("routes `claim` to the dedicated claim arm and a non-command to the dispatcher", async () => {
      const source = new PassThrough();
      const { deps } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      const history = newGame(START_FEN);

      source.write("claim\n");
      expect(await seam(history)).toEqual({ kind: "claim" });
      expect(deps.legalMoves).toHaveBeenCalledTimes(0);

      source.write("zz\n");
      expect((await seam(history)).kind).toBe("rejected");
      expect(deps.legalMoves).toHaveBeenCalledTimes(1);
    });
  });

  describe("A5 — a throw from below is NOT caught. The ruling, run THROUGH runTurnLoop", () => {
    it("propagates out of runTurnLoop, leaves toFen byte-identical, and produces no PromptOutcome", async () => {
      const source = new PassThrough();
      const boom = new Error("parser defect");
      const { deps } = spiedDeps({
        parseSan: vi.fn(() => {
          throw boom;
        }),
      });
      const history = newGame(START_FEN);
      const fenBefore = toFen(history.position);

      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
      // Every outcome the seam produces is recorded here. A build that wrapped the resolver call in
      // a try/catch returning `rejected` would put one in this array, re-render, and re-prompt.
      const produced: PromptOutcome[] = [];
      const observed: InputSeam = async (h) => {
        const outcome = await seam(h);
        produced.push(outcome);
        return outcome;
      };
      let renders = 0;
      const countingRender: RenderSeam = (h, s, t, m) => {
        renders++;
        return stubRender(h, s, t, m);
      };

      source.write("e4\n");

      await expect(
        runTurnLoop({
          history,
          humanColour: "white",
          render: countingRender,
          input: observed,
          engine: scriptedEngine([]),
          sink: recordingSink(),
        }),
      ).rejects.toBe(boom);

      // `A9b`'s repair is the LOOP's, which is why this criterion is worthless asserted in isolation.
      expect(toFen(history.position)).toBe(fenBefore);
      expect(history.moves.length).toBe(0);
      // No `PromptOutcome` at all — in particular not `rejected` and not `eof`.
      expect(produced).toEqual([]);
      // One frame: the initial one. A rejecting build renders a second, carrying the message.
      expect(renders).toBe(1);
    });

    it("contains no `try` and no `catch` at all — the ruling as a property of the file", () => {
      const code = deliveredCode();
      expect(code).not.toMatch(/\btry\b/);
      expect(code).not.toMatch(/\bcatch\b/);
    });
  });

  describe("A6 — the seam writes the prompt and nothing else, on any channel", () => {
    it("writes exactly PROMPT per call, zero ESC bytes, zero CSI sequences, zero FrameSink writes, and touches no other channel", async () => {
      const globalsBefore = new Set(Reflect.ownKeys(globalThis).map(String));
      const consoleSpies = (["log", "error", "warn", "info", "debug"] as const).map((method) =>
        vi.spyOn(console, method).mockImplementation(() => {}),
      );
      const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

      const source = new PassThrough();
      const output = recordingOutput();
      const sink = recordingSink();
      const history = newGame(START_FEN);

      // The loop's FrameSink, counted ONLY while the seam is on the stack. The loop writes frames
      // through it legitimately; what `A6` forbids is the SEAM writing through it.
      let insideSeam = false;
      let sinkWritesDuringSeam = 0;
      const watchedSink: FrameSink = {
        isTTY: false,
        rows: 0,
        write(text: string) {
          if (insideSeam) sinkWritesDuringSeam++;
          sink.write(text);
        },
      };

      const seam = createLineInputSeam({ source, output });
      const watched: InputSeam = async (h) => {
        insideSeam = true;
        try {
          return await seam(h);
        } finally {
          insideSeam = false;
        }
      };

      // A line carrying an ESC and a full CSI sequence, plus a legal move and an EOF.
      source.write("\x1b[2Jzz\ne4\n");
      source.end();

      await runTurnLoop({
        history,
        humanColour: "white",
        render: stubRender,
        input: watched,
        engine: scriptedEngine(["e7e5"]),
        sink: watchedSink,
      });

      const written = output.writes.join("");
      expect(output.writes.every((text) => text === PROMPT)).toBe(true);
      // biome-ignore lint/suspicious/noControlCharactersInRegex: asserting the ABSENCE of ESC is the point
      expect(written).not.toMatch(/\x1b/);
      // biome-ignore lint/suspicious/noControlCharactersInRegex: CSI is `ESC [` by definition
      expect(written).not.toMatch(/\x1b\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]/);
      expect(sinkWritesDuringSeam).toBe(0);

      for (const spy of consoleSpies) expect(spy).toHaveBeenCalledTimes(0);
      expect(stdoutSpy).toHaveBeenCalledTimes(0);
      expect(stderrSpy).toHaveBeenCalledTimes(0);
      expect(
        [...Reflect.ownKeys(globalThis).map(String)].filter((k) => !globalsBefore.has(k)),
      ).toEqual([]);

      vi.restoreAllMocks();
    });

    it("writes the prompt BEFORE it waits for the line, not after", async () => {
      const source = new PassThrough();
      const output = recordingOutput();
      const seam = createLineInputSeam({ source, output });

      const pending = seam(newGame(START_FEN));
      await tick();
      // Nothing has been typed yet and the player must already be able to see the prompt.
      expect(output.writes).toEqual([PROMPT]);

      source.write("e4\n");
      await pending;
      expect(output.writes).toEqual([PROMPT]);
    });
  });

  describe("A7 — no per-keystroke work. NFR-003 as a count, not a clock", () => {
    it("calls legalMoves exactly 0 times before the line is submitted and exactly 1 time after", async () => {
      const source = new PassThrough();
      const { deps } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });

      const pending = seam(newGame(START_FEN));
      for (const character of "Nf3") {
        source.write(character);
        await tick();
      }
      expect(deps.legalMoves).toHaveBeenCalledTimes(0);
      expect(deps.parseSan).toHaveBeenCalledTimes(0);
      expect(deps.parseCoordinateMove).toHaveBeenCalledTimes(0);

      source.write("\n");
      expect((await pending).kind).toBe("move");
      expect(deps.legalMoves).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------------------------
  // Security. Three bars, each with the measurement that fires it. NOT waived — this is the first
  // production module in the repository that reads input from outside the process.
  // -------------------------------------------------------------------------------------------

  describe("security bar 1 — the read line is data, never code", () => {
    it("contains zero occurrences of eval, Function, require, dynamic import, shell or child_process", () => {
      const code = deliveredCode();
      for (const banned of [
        /\beval\b/,
        /\bFunction\b/,
        /\brequire\b/,
        /\bimport\s*\(/,
        /child_process/,
        /\bexec(Sync|File)?\b/,
        /\bspawn(Sync)?\b/,
        /\bfetch\b/,
        /\bwriteSync\b/,
        /\bprocess\b/,
        /\bconsole\b/,
        /\bglobalThis\b/,
        /\bBuffer\b/,
      ]) {
        expect(code, `banned token ${banned} present in the delivered module`).not.toMatch(banned);
      }
    });

    it("imports exactly four relative project modules and no Node builtin and no package", () => {
      const specifiers = [...deliveredCode().matchAll(/from\s+"([^"]+)"/g)].map(
        (match) => match[1] as string,
      );
      expect([...specifiers].sort()).toEqual([
        "./command-input.ts",
        "./history.ts",
        "./move-input.ts",
        "./turn-loop.ts",
      ]);
      expect(specifiers.some((s) => s.startsWith("node:") || !s.startsWith("."))).toBe(false);
    });

    it("adds no runtime dependency — package.json still has no `dependencies` key at all", () => {
      const manifest = JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ) as Record<string, unknown>;
      expect("dependencies" in manifest).toBe(false);
    });
  });

  describe("security bar 2 — unbounded input is bounded. The cap is 1024 characters", () => {
    it("states the cap as 1024", () => {
      expect(MAX_LINE_LENGTH).toBe(1024);
    });

    it("passes a line of exactly 1024 characters to the resolver — the boundary is not off by one", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });

      const atCap = "z".repeat(MAX_LINE_LENGTH);
      source.write(`${atCap}\n`);
      expect((await seam(newGame(START_FEN))).kind).toBe("rejected");
      expect(texts).toContain(atCap);
    });

    it("rejects a line of 1025 characters, never passes it to a resolver, and never grows the frame", async () => {
      const source = new PassThrough();
      const { deps, texts } = spiedDeps();
      const seam = createLineInputSeam({ source, output: recordingOutput(), deps });

      const overCap = "z".repeat(MAX_LINE_LENGTH + 1);
      source.write(`${overCap}\n`);
      const outcome = await seam(newGame(START_FEN));

      expect(outcome).toEqual({ kind: "rejected", messages: LINE_TOO_LONG_MESSAGES });
      expect(texts).toEqual([]);
      expect(deps.legalMoves).toHaveBeenCalledTimes(0);
      // Never grows the frame: `rejected` is non-advancing, and its two items are inside the
      // message region's own width at the narrowest board-only frame (`W` = 18).
      for (const item of LINE_TOO_LONG_MESSAGES) expect(item.length).toBeLessThanOrEqual(18);
    });

    it("recovers on the very next line — an over-cap line poisons nothing", async () => {
      const source = new PassThrough();
      const seam = createLineInputSeam({ source, output: recordingOutput() });
      const history = newGame(START_FEN);

      source.write(`${"z".repeat(MAX_LINE_LENGTH + 1)}\ne4\n`);
      expect((await seam(history)).kind).toBe("rejected");
      expect((await seam(history)).kind).toBe("move");
    });
  });

  describe("security bar 3 — every byte that reaches the terminal goes through the frame's sanitizer", () => {
    it("never writes the typed line at all, and the outcome's messages survive assembleFrame with zero ESC", async () => {
      const source = new PassThrough();
      const output = recordingOutput();
      const seam = createLineInputSeam({ source, output });

      const hostile = "\x1b[2J\x1b[Hzz\x07";
      source.write(`${hostile}\n`);
      const outcome = await seam(newGame(START_FEN));

      // The line is DATA. It is resolved and it is never echoed by this module.
      expect(output.writes.join("")).toBe(PROMPT);
      expect(output.writes.join("")).not.toContain("\x1b");
      expect(outcome.kind).toBe("rejected");

      // And the one door anything player-derived could take to the terminal is the sanitizer.
      const messages = (outcome as { messages: readonly string[] }).messages;
      const frame = assembleFrame(
        {
          board: ["board"],
          status: ["status"],
          history: ["history"],
          messages: [...messages, hostile],
        },
        "unicode",
      );
      for (const row of frame) {
        // biome-ignore lint/suspicious/noControlCharactersInRegex: the sanitizer's whole job
        expect(row).not.toMatch(/[\x00-\x1f\x7f]/);
      }
    });
  });

  // -------------------------------------------------------------------------------------------
  // The breadth. Opt-in only — see the lane-cost paragraph in this file's header.
  // -------------------------------------------------------------------------------------------

  if (RUN_DEEP) {
    describe("breadth [deep, INPUT_DEEP=1]", () => {
      it("bounds memory on a 16 MiB unterminated flood — the cap frees the partial line rather than holding it", async () => {
        const source = new PassThrough();
        const { deps, texts } = spiedDeps();
        const seam = createLineInputSeam({ source, output: recordingOutput(), deps });

        globalThis.gc?.();
        const before = process.memoryUsage().heapUsed;
        const pending = seam(newGame(START_FEN));
        for (let index = 0; index < 16; index++) {
          source.write("z".repeat(1024 * 1024));
          await tick();
        }
        const peak = process.memoryUsage().heapUsed - before;
        source.write("\n");

        expect(await pending).toEqual({ kind: "rejected", messages: LINE_TOO_LONG_MESSAGES });
        expect(texts).toEqual([]);
        // A build that kept accumulating holds all 16 MiB; the capped one holds ~1 KiB.
        expect(peak).toBeLessThan(8 * 1024 * 1024);
      });

      it("reads the same three lines however the chunk boundaries fall", async () => {
        const script = "e4\nNf3\nd4\n";
        for (let split = 1; split < script.length; split++) {
          const source = new PassThrough();
          const seam = createLineInputSeam({ source, output: recordingOutput() });
          const history = newGame(START_FEN);
          source.write(script.slice(0, split));
          source.write(script.slice(split));
          source.end();

          const kinds = [
            (await seam(history)).kind,
            (await seam(history)).kind,
            (await seam(history)).kind,
            (await seam(history)).kind,
          ];
          expect(kinds, `split at ${split}`).toEqual(["move", "move", "move", "eof"]);
        }
      });

      it("stays total on a 10,000-character line — the cap answers before the resolvers do", async () => {
        const source = new PassThrough();
        const { deps, texts } = spiedDeps();
        const seam = createLineInputSeam({ source, output: recordingOutput(), deps });
        source.write(`${"e4".repeat(5000)}\n`);
        expect(await seam(newGame(START_FEN))).toEqual({
          kind: "rejected",
          messages: LINE_TOO_LONG_MESSAGES,
        });
        expect(texts).toEqual([]);
      });
    });
  }
});

/**
 * The delivered module's own bytes, with comments stripped.
 *
 * Comments are stripped because the module's header NAMES the tokens it does not use — "no
 * `eval`, no `Function`, no `globalThis`" — and a guard that fired on that prose would be deleted
 * by the next engineer rather than fixed. Stripped, the scan reads CODE, which is the only thing it
 * was ever meant to read.
 */
function deliveredCode(): string {
  const text = readFileSync(new URL("./line-input.ts", import.meta.url), "utf8");
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}
