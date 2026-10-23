/**
 * `ABC-200` — the startup questions: on a terminal, a flag that is absent is asked for, and Enter
 * keeps today's default. `A1`–`A7` and `A9`; `A8` is QE's hand reading on a real pseudo-terminal.
 *
 * THE STREAMS ARE IN MEMORY AND THE TEST SETS `isTTY`. The source is a real `PassThrough`, so the
 * one-chunk overshoot and pause-between-reads are Node's own semantics rather than a stub's. The
 * output records every write. No child is spawned (`NFR-008`, `N8-SPAWN` unchanged), and nothing is
 * spied on a module namespace (`ADR-0042`): the streams are injected.
 *
 * A QUESTION IS A WRITE WITHOUT A NEWLINE (the answer is typed on its line) and a REJECTION IS ONE
 * WRITE ENDING IN ONE. The accepted answers are spelled here, independently of the module, so a
 * question or a rejection that stopped naming them is red.
 *
 * `A7` USES THE REAL `createLineInputSeam` over the same source, inside a real `runTurnLoop`, with
 * the whole input written in one `write` — the shape in which a second private reader loses `e5`
 * (plant `P6`).
 */

import { readFileSync } from "node:fs";
import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { type Resolution, resolveOptions } from "./cli-options.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import type { FrameSink } from "./frame.ts";
import { type GameHistory, newGame } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { createLineInputSeam, MAX_LINE_LENGTH, PROMPT } from "./line-input.ts";
import type { Move } from "./moves.ts";
import { askAbsentOptions } from "./startup-questions.ts";
import { type EngineSeam, type RenderSeam, runTurnLoop } from "./turn-loop.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const COLOURS = "white|black|random";
const LEVELS = "1|2|3|4|5";

/** One macrotask. Enough for a `resume()`d stream to deliver the chunks already in its buffer. */
const tick = (): Promise<void> => new Promise<void>((resolve) => setImmediate(resolve));

/** A source whose `isTTY` the test decides. `undefined` is what Node gives a pipe. */
const sourceOf = (isTTY: boolean | undefined): PassThrough & { isTTY?: boolean } =>
  isTTY === undefined ? new PassThrough() : Object.assign(new PassThrough(), { isTTY });

interface RecordingOutput {
  readonly writes: string[];
  readonly isTTY?: boolean;
  write(text: string): void;
}

function outputOf(isTTY: boolean | undefined): RecordingOutput {
  const writes: string[] = [];
  const write = (text: string): void => {
    writes.push(text);
  };
  return isTTY === undefined ? { writes, write } : { writes, isTTY, write };
}

type Parsed = Extract<Resolution, { ok: true }>;

function parsedOf(argv: readonly string[]): Parsed {
  const resolution = resolveOptions(argv);
  if (!resolution.ok) throw new Error(`argv refused: ${argv.join(" ")}`);
  return resolution;
}

/** What each write was: a colour question, a difficulty question, a rejection, or something else. */
function kindOf(text: string): string {
  if (text.endsWith("\n")) return "rejection";
  if (text.includes(COLOURS)) return "colour";
  if (text.includes(LEVELS)) return "difficulty";
  return `other:${JSON.stringify(text)}`;
}

const kindsOf = (output: RecordingOutput): string[] => output.writes.map(kindOf);

/** Today's no-argument options, spelled out: `white`, from White's side, both glyph flags off, `5`. */
const BASE_OPTIONS = {
  colour: "white",
  orientation: "white-bottom",
  flags: { ascii: false, unicode: false },
  difficulty: 5,
};

/** A source file's code, with comments stripped, so prose naming a token is not a hit. */
const codeOf = (file: string): string =>
  readFileSync(new URL(file, import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

describe("ABC-200 — the startup questions", () => {
  describe("A1 — both questions, both answered", () => {
    it("asks colour then difficulty, writes nothing else before the second answer, and resolves black / 1", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf([]), { source, output });

      source.write("black\n");
      await tick();
      // Before the second answer: exactly the two questions, colour first — no frame byte.
      expect(kindsOf(output)).toEqual(["colour", "difficulty"]);

      source.write("1\n");
      const result = await asked;

      expect(kindsOf(output)).toEqual(["colour", "difficulty"]);
      expect(result).toEqual({
        options: {
          colour: "black",
          orientation: "black-bottom",
          flags: { ascii: false, unicode: false },
          difficulty: 1,
        },
      });
    });

    it("ignores case and surrounding spaces on both answers (scope 2 and 3)", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--unicode"]), { source, output });
      source.write("  BlAcK \r\n 2  \n");

      const result = await asked;
      expect(kindsOf(output)).toEqual(["colour", "difficulty"]);
      expect(result).toEqual({
        options: {
          colour: "black",
          orientation: "black-bottom",
          flags: { ascii: false, unicode: true },
          difficulty: 2,
        },
      });
    });

    it("resolves an answered `random` to white or black, never `random`, with the orientation that follows", async () => {
      const seen = new Set<string>();
      for (let run = 0; run < 64; run++) {
        const source = sourceOf(true);
        const asked = askAbsentOptions(parsedOf(["--difficulty", "3"]), {
          source,
          output: outputOf(true),
        });
        source.write("random\n");
        const result = await asked;
        const options = result?.options;
        expect(options?.orientation).toBe(
          options?.colour === "white" ? "white-bottom" : "black-bottom",
        );
        seen.add(options?.colour ?? "none");
      }
      expect([...seen].sort()).toEqual(["black", "white"]);
    });
  });

  describe("A2 — Enter keeps today's game", () => {
    it("two empty answers resolve exactly base's no-argument options", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf([]), { source, output });
      source.write("\n\n");

      const result = await asked;
      expect(kindsOf(output)).toEqual(["colour", "difficulty"]);
      expect(result).toEqual({ options: BASE_OPTIONS });
      expect(result?.options).toEqual(parsedOf([]).options);
    });

    it("each question shows its default, which is base's", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf([]), { source, output });
      source.write("\n\n");
      await asked;
      expect(output.writes[0]).toContain("[white]");
      expect(output.writes[1]).toContain("[5]");
    });
  });

  describe("A3 — a flag skips its question", () => {
    it("with --colour black --difficulty 3, 0 questions are written and nothing is read", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const parsed = parsedOf(["--colour", "black", "--difficulty", "3"]);

      const result = await askAbsentOptions(parsed, { source, output });

      expect(output.writes).toEqual([]);
      expect(result).toEqual({ options: parsed.options });
      expect(source.listenerCount("end")).toBe(0);
    });

    it("with --colour black alone, exactly 1 question is written, and it is the difficulty question", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--colour", "black"]), { source, output });
      source.write("2\n");

      const result = await asked;
      expect(kindsOf(output)).toEqual(["difficulty"]);
      expect(output.writes[0]).toContain("[5]");
      expect(result?.options).toMatchObject({ colour: "black", difficulty: 2 });
    });

    it("with --difficulty 2 alone, exactly 1 question is written, and it is the colour question", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--difficulty", "2"]), { source, output });
      source.write("black\n");

      const result = await asked;
      expect(kindsOf(output)).toEqual(["colour"]);
      expect(result?.options).toMatchObject({
        colour: "black",
        orientation: "black-bottom",
        difficulty: 2,
      });
    });
  });

  describe("A4 — a wrong answer teaches and asks again", () => {
    it("`purple` writes one rejection naming the accepted colours and echoing it, then the colour question again", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--difficulty", "3"]), { source, output });
      source.write("purple\nblack\n");

      const result = await asked;
      expect(kindsOf(output)).toEqual(["colour", "rejection", "colour"]);
      const rejection = output.writes[1] as string;
      expect(rejection.split("\n")).toHaveLength(2); // one line: its text, then its newline
      expect(rejection).toContain(COLOURS);
      expect(rejection).toContain("purple");
      expect(output.writes[2]).toBe(output.writes[0]);
      expect(result?.options.colour).toBe("black");
    });

    it("a typed ESC never reaches the echo, and no C0 or DEL byte is written at all", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--difficulty", "3"]), { source, output });
      source.write("purple\x1b[2J\x07\x7f\nwhite\n");

      await asked;
      expect(kindsOf(output)).toEqual(["colour", "rejection", "colour"]);
      expect(output.writes[1]).toContain("purple[2J");
      const written = output.writes.join("").replace(/\n/g, "");
      expect([...written].filter((c) => c < " " || c === "\x7f")).toEqual([]);
    });

    it("difficulty `6`, `0`, `03` and a 1 025-character line are each one rejection, then the question again", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf(["--colour", "white"]), { source, output });
      const overCap = "3".repeat(MAX_LINE_LENGTH + 1);
      source.write(`6\n0\n03\n${overCap}\n4\n`);

      const result = await asked;
      expect(kindsOf(output)).toEqual([
        "difficulty",
        "rejection",
        "difficulty",
        "rejection",
        "difficulty",
        "rejection",
        "difficulty",
        "rejection",
        "difficulty",
      ]);
      const rejections = output.writes.filter((text) => kindOf(text) === "rejection");
      for (const rejection of rejections) {
        expect(rejection).toContain(LEVELS);
        expect(rejection.split("\n")).toHaveLength(2);
      }
      expect(rejections[0]).toContain('"6"');
      expect(rejections[1]).toContain('"0"');
      expect(rejections[2]).toContain('"03"');
      // Over the cap the reader keeps no text, so the echo is empty and the line is never written.
      expect(rejections[3]).toContain('""');
      expect(rejections[3]?.length).toBeLessThan(MAX_LINE_LENGTH);
      expect(result?.options.difficulty).toBe(4);
    });
  });

  describe("A5 — end of input at a question", () => {
    it("at the colour question resolves null and writes nothing after the question", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf([]), { source, output });
      source.end();

      expect(await asked).toBeNull();
      expect(kindsOf(output)).toEqual(["colour"]);
    });

    it("at the difficulty question resolves null, and a held partial line is not an answer", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const asked = askAbsentOptions(parsedOf([]), { source, output });
      source.end("black\n3");

      expect(await asked).toBeNull();
      expect(kindsOf(output)).toEqual(["colour", "difficulty"]);
    });

    it("the entry point returns on null before any frame or result screen, inside the one `try`", () => {
      const entry = codeOf("./cli.ts");
      expect(entry).toMatch(
        /const resolution = await askAbsentOptions\(parsed, \{ source: stdin, output: sink \}\);\s*if \(resolution === null\) return;/,
      );
      const returned = entry.indexOf("if (resolution === null) return;");
      expect(entry.indexOf("try {")).toBeLessThan(returned);
      expect(returned).toBeLessThan(entry.indexOf("runTurnLoop("));
      expect(returned).toBeLessThan(entry.indexOf("renderResultScreen("));
    });
  });

  describe("A6 — a pipe is unchanged", () => {
    const PIPES: readonly [string, boolean | undefined, boolean | undefined][] = [
      ["stdin a pipe", undefined, true],
      ["stdout a pipe", true, undefined],
      ["both pipes", undefined, undefined],
      ["isTTY false on both", false, false],
    ];

    for (const [name, inTTY, outTTY] of PIPES) {
      it(`${name}: 0 questions, 0 reads, and the script's first line is the human's first move`, async () => {
        const source = sourceOf(inTTY);
        const output = outputOf(outTTY);
        source.write("e4\n");
        const parsed = parsedOf([]);

        const result = await askAbsentOptions(parsed, { source, output });

        expect(result).toEqual({ options: parsed.options });
        expect(output.writes).toEqual([]);
        // 0 reads: the line is still in the pipe and no reader was ever attached.
        expect(source.readableLength).toBe("e4\n".length);
        expect(source.listenerCount("end")).toBe(0);
        expect(source.listenerCount("data")).toBe(0);

        const seam = createLineInputSeam({ source, output });
        const first = await seam(newGame(START_FEN));
        expect(first.kind).toBe("move");
      });
    }
  });

  describe("A7 — no line is lost or stolen", () => {
    /** A three-row frame. Nothing here reads it. */
    const stubRender: RenderSeam = () => ["board", "status", ""];

    const scriptedEngine = (script: readonly string[]): EngineSeam => {
      let index = 0;
      return async (history: GameHistory): Promise<Move> => {
        const text = script[index++] as string;
        const parsed = parseCoordinateMove(history.position, text, legalMoves(history.position));
        if (parsed.outcome !== "move") throw new Error(`engine script bad: ${text}`);
        return parsed.move;
      };
    };

    it("`black\\n1\\ne5\\n` in one chunk: the questions take black and 1, and e5 is the game's first prompt after the engine's first move", async () => {
      const source = sourceOf(true);
      const output = outputOf(true);
      const frames: string[] = [];
      const sink: FrameSink = {
        isTTY: false,
        rows: 0,
        write(text: string) {
          frames.push(text);
        },
      };
      source.write("black\n1\ne5\n");
      source.end();

      const result = await askAbsentOptions(parsedOf([]), { source, output });
      expect(result?.options).toMatchObject({ colour: "black", difficulty: 1 });

      const history = newGame(START_FEN);
      const outcome = await runTurnLoop({
        history,
        humanColour: "black",
        render: stubRender,
        input: createLineInputSeam({ source, output }),
        engine: scriptedEngine(["e2e4", "g1f3"]),
        sink,
      });

      // e4 (engine), e5 (the third line, the human's first move), Nf3 (engine), then end of input:
      // 0 lines dropped, and none read twice — the second prompt reads end of input, not `e5`.
      expect(history.moves).toHaveLength(3);
      expect(toFen(history.position)).toBe(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
      );
      expect(outcome).toMatchObject({ result: null, exitCode: 0 });
      expect(kindsOf(output).slice(0, 2)).toEqual(["colour", "difficulty"]);
      expect(output.writes.slice(2)).toEqual([PROMPT, PROMPT]);
    });
  });

  describe("A9 — the first question comes before the book is read", () => {
    it("the entry point asks before it builds the book probe, the glyph-mode session or the history", () => {
      const entry = codeOf("./cli.ts");
      const asked = entry.indexOf("askAbsentOptions(");
      expect(asked).toBeGreaterThan(-1);
      for (const later of [
        "createBookProbe(",
        "readBookFile,",
        "beginGlyphModeSession(",
        "newGame(",
        "runTurnLoop(",
      ]) {
        expect(entry.indexOf(later), later).toBeGreaterThan(asked);
      }
    });
  });

  describe("the module reaches for nothing (ADR-0016 clause 3, security)", () => {
    it("imports only ./line-reader.ts and ./cli-options.ts at runtime", () => {
      const code = codeOf("./startup-questions.ts");
      const runtime = [...code.matchAll(/^import\s+(?!type\b)[^;]*?from\s+"([^"]+)"/gm)].map(
        (match) => match[1],
      );
      expect(runtime.sort()).toEqual(["./cli-options.ts", "./line-reader.ts"]);
      expect(code).not.toMatch(/from\s+"\.\/(line-input|history)\.ts"/);
    });

    it("holds no ambient handle, no listener, no cursor control and no `try`", () => {
      const code = codeOf("./startup-questions.ts");
      for (const banned of [
        /\bprocess\b/,
        /\bconsole\b/,
        /\bglobalThis\b/,
        /\bBuffer\b/,
        /node:/,
        /\beval\b/,
        /\bFunction\b/,
        /\brequire\b/,
        /\bimport\s*\(/,
        /\.on\(/,
        /\btry\b/,
        /\bcatch\b/,
        /\\x1b|\\u001b|\\u\{1b\}|\\033/i,
      ]) {
        expect(code, `${banned}`).not.toMatch(banned);
      }
    });
  });
});
