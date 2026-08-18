import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COMMAND_TABLE,
  classifyCommand,
  helpMessages,
  resolvePromptLine,
} from "./command-input.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import { assembleFrame, type FrameSink, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import { type GameHistory, gameStatusOf, newGame, playMove, repetitionCounts } from "./history.ts";
import { renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import type { MoveInputDeps } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { renderBoard } from "./render.ts";
import { parseSan, toSan } from "./san.ts";
import { renderStatusPanel } from "./status-panel.ts";
import { type EngineSeam, type InputSeam, type RenderSeam, runTurnLoop } from "./turn-loop.ts";

/**
 * `A6`'s guard, and it is a HOISTED MODULE MOCK rather than a `vi.spyOn` over an imported binding
 * — deliberately, and it is the one lesson from `ABC-033` this file spends a mock on.
 *
 * `quality-gate-ABC-033-qe-2026-08-18` `G3`: `A5`'s spy watched `deps.legalMoves` only, `toSan`
 * imported `legalMoves` DIRECTLY from `./legal.ts`, and mutant M11 tripled the real derive count
 * while the guard still reported 1. A guard blind to a direct import is not a guard. `A6` bars a
 * call this module could only make through a direct import of `./history.ts`, so the guard has to
 * sit where a direct import is still visible: `vi.mock` replaces the module in the graph for EVERY
 * importer, including one that has not been written yet.
 *
 * Everything CALLS THROUGH (`vi.fn(actual.…)`), so no behaviour changes. Known limit, stated rather
 * than papered over: `gameStatusOf` calls `repetitionCounts` INSIDE `history.ts` and a
 * module-boundary mock cannot see an intra-module call — so the `repetitionCounts` count is the
 * count of DIRECT external calls, which is exactly what `A6` bars.
 */
vi.mock("./history.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./history.ts")>();
  return {
    ...actual,
    gameStatusOf: vi.fn(actual.gameStatusOf),
    repetitionCounts: vi.fn(actual.repetitionCounts),
  };
});

const derives = (): number => vi.mocked(gameStatusOf).mock.calls.length;
const repetitionDerives = (): number => vi.mocked(repetitionCounts).mock.calls.length;

beforeEach(() => {
  vi.mocked(gameStatusOf).mockClear();
  vi.mocked(repetitionCounts).mockClear();
});

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/**
 * `ABC-021`'s own shuffle position (`turn-loop.test.ts:184`), White to move. King and bishop only,
 * so the repeated line sets no en-passant square — which `ABC-011` hashes into the key — and makes
 * no irreversible move, so the halfmove clock only ever climbs.
 */
const SHUFFLE_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";
/** `Kh1 Bb6 Kg1 Ba5` — one cycle returns to the exact position, so `n` cycles make `n + 1` of it. */
const SHUFFLE_CYCLE = ["g1h1", "a5b6", "h1g1", "b6a5"] as const;
/**
 * `A5`'s SECOND fixture and the reason the criterion is a PAIR: a position where a bishop capture
 * and a pawn capture are both legal, nothing is claimable, and `b4` is a legal pawn move — so the
 * negative half of `A1` is asserted against a line a prefix matcher would eat.
 */
const RICH_FEN = "4k3/8/8/8/2n5/1P6/4B3/4K3 w - - 0 1";

/** Test note 5's rule, inherited: a FEN is round-tripped before anything is believed of it. */
describe("fixtures — every FEN in this file round-trips through toFen", () => {
  for (const fen of [START_FEN, SHUFFLE_FEN, RICH_FEN]) {
    it(`round-trips ${fen}`, () => {
      expect(toFen(newGame(fen).position)).toBe(fen);
    });
  }
});

/** Play coordinate lines onto a fresh history. Fails loudly rather than playing a non-move. */
function played(fen: string, lines: readonly string[]): GameHistory {
  const history = newGame(fen);
  for (const line of lines) {
    const parsed = parseCoordinateMove(history.position, line);
    expect(parsed.outcome).toBe("move");
    playMove(history, (parsed as { move: Move }).move);
  }
  return history;
}

/** The position at its THIRD occurrence, White to move — `ABC-020`'s FIDE 9.2 claim is available. */
const claimable = (): GameHistory => played(SHUFFLE_FEN, [...SHUFFLE_CYCLE, ...SHUFFLE_CYCLE]);

/**
 * `ABC-033`'s resolver seam, spied and calling through. `A2` reads the COUNTS off it and the
 * control row below reads them for a line that IS a move — without that control this file could
 * assert 0 against a seam nothing ever reaches, which is the `ABC-033` `G4`/`G5` failure shape.
 */
function spied(history: GameHistory): {
  readonly deps: MoveInputDeps;
  readonly coordinateCalls: () => number;
  readonly sanCalls: () => number;
  readonly deriveCalls: () => number;
  readonly texts: () => string[];
} {
  const legal = legalMoves(history.position);
  const deriveLegal = vi.fn(() => legal);
  const coordinate = vi.fn(parseCoordinateMove);
  const san = vi.fn(parseSan);
  return {
    deps: { legalMoves: deriveLegal, parseCoordinateMove: coordinate, parseSan: san, toSan },
    coordinateCalls: () => coordinate.mock.calls.length,
    sanCalls: () => san.mock.calls.length,
    deriveCalls: () => deriveLegal.mock.calls.length,
    texts: () => coordinate.mock.calls.map((call) => call[1]),
  };
}

// ---------------------------------------------------------------------------
// Acceptance — A1-A7. A8 is a property of the delivered diff and is asserted by
// the gate (`git diff --numstat`), not here.
// ---------------------------------------------------------------------------

/** Every spelling `A1` names, with the arm the table says each token produces. */
const TOKEN_SPELLINGS: ReadonlyArray<readonly [line: string, token: string]> = [
  ["help", "help"],
  ["HELP", "help"],
  ["  help  ", "help"],
  ["Help", "help"],
  ["board", "board"],
  ["BOARD", "board"],
  ["\tboard\n", "board"],
  ["quit", "quit"],
  ["QUIT", "quit"],
  [" Quit ", "quit"],
  ["claim", "claim"],
  ["CLAIM", "claim"],
  ["  Claim  ", "claim"],
];

/**
 * `A1`'s negative half, which is the criterion. `b4` is the load-bearing one: it is a LEGAL MOVE in
 * `RICH_FEN` and a prefix matcher turns it into `board`.
 */
const NON_TOKENS: readonly string[] = [
  "hel",
  "helpme",
  "h",
  "boards",
  "b4",
  "he lp",
  "help now",
  "--help",
  "quitt",
  "claims",
  "cl",
  "",
];

describe("ABC-035 A1 — four tokens, case-insensitive, trimmed, EXACT", () => {
  for (const [line, token] of TOKEN_SPELLINGS) {
    it(`classifies ${JSON.stringify(line)} as ${token}, advancing nothing`, () => {
      const history = newGame(RICH_FEN);
      const before = toFen(history.position);
      const spec = COMMAND_TABLE.find((entry) => entry.token === token);

      const outcome = resolvePromptLine(history, line);

      // The arm comes from the TABLE, so `claim`'s dedicated arm is asserted here and not typed:
      // a table row flipped to `command` reds this row rather than passing it.
      expect(outcome.kind).toBe(spec?.outcome);
      expect(classifyCommand(line)?.token).toBe(token);
      expect(toFen(history.position)).toBe(before);
      expect(history.moves).toHaveLength(0);
    });
  }

  for (const line of NON_TOKENS) {
    it(`does NOT classify ${JSON.stringify(line)} as a command`, () => {
      const history = newGame(RICH_FEN);
      const seam = spied(history);

      expect(classifyCommand(line)).toBeUndefined();
      const outcome = resolvePromptLine(history, line, seam.deps);

      // It fell THROUGH: the resolvers saw it, and neither command arm was produced.
      expect(outcome.kind).not.toBe("command");
      expect(outcome.kind).not.toBe("claim");
      expect(seam.coordinateCalls()).toBeGreaterThanOrEqual(1);
    });
  }

  it("b4 is still the pawn move it always was — no prefix reaches `board`", () => {
    const history = newGame(RICH_FEN);
    const seam = spied(history);

    const outcome = resolvePromptLine(history, "b4", seam.deps);

    expect(outcome.kind).toBe("move");
    expect(
      toSan(history.position, (outcome as { move: Move }).move, legalMoves(history.position)),
    ).toBe("b4");
  });
});

describe("ABC-035 A2 — a command never reaches a resolver", () => {
  for (const [line] of TOKEN_SPELLINGS) {
    it(`calls neither resolver for ${JSON.stringify(line)}`, () => {
      const history = newGame(RICH_FEN);
      const seam = spied(history);

      resolvePromptLine(history, line, seam.deps);

      expect(seam.coordinateCalls()).toBe(0);
      expect(seam.sanCalls()).toBe(0);
      // And no legal-move generation either: classification asks the position nothing at all.
      expect(seam.deriveCalls()).toBe(0);
    });
  }

  /**
   * THE CONTROL. Without it every count above could be 0 because the seam is never wired through,
   * which is exactly how `ABC-033`'s M11 survived: a guard that cannot observe the call it forbids
   * reports the forbidden number for free. This row proves the same spies DO see a real call.
   */
  it("control — the same spies count 1 and 1 for a line that is not a command", () => {
    const history = newGame(RICH_FEN);
    const seam = spied(history);

    const outcome = resolvePromptLine(history, "e1d1", seam.deps);

    expect(outcome.kind).toBe("move");
    expect(seam.coordinateCalls()).toBe(1);
    expect(seam.sanCalls()).toBe(1);
    expect(seam.deriveCalls()).toBe(1);
  });

  /**
   * The other direction of `A2`'s rationale: classification steals nothing, because no token is a
   * move in ANY grammar. Asserted through the REAL readers rather than argued on the page.
   */
  for (const spec of COMMAND_TABLE) {
    it(`neither grammar can read ${spec.token} as a move`, () => {
      for (const fen of [START_FEN, RICH_FEN, SHUFFLE_FEN]) {
        const history = newGame(fen);
        const legal = legalMoves(history.position);
        expect(parseCoordinateMove(history.position, spec.token, legal).outcome).toBe("rejected");
        expect(parseSan(history.position, spec.token, legal).outcome).toBe("rejected");
      }
    });
  }

  it("hands the line on UNMODIFIED — the fold is a lookup key, not a normalisation", () => {
    const history = newGame(START_FEN);
    const seam = spied(history);

    resolvePromptLine(history, "  E2E4  ", seam.deps);

    // `ABC-033` owns case and whitespace from here on: it must see what the player typed. A module
    // that passed its trimmed, lower-cased key downstream would break `bxc4` vs `Bxc4`.
    expect(seam.texts()[0]).toBe("  E2E4  ");
  });
});

// ---------------------------------------------------------------------------
// The merged loop, driven for real — A3, A5's second half, and A6's ply total.
// ---------------------------------------------------------------------------

interface LoopRun {
  readonly renders: number;
  readonly messagesPerFrame: readonly (readonly string[])[];
  readonly result: string | null;
  readonly reason: string | null;
}

/**
 * Run the MERGED loop with this module bound as the `InputSeam`, one scripted line per prompt, then
 * end the input. The render seam is a stub of fixed rows: `A3` counts CALLS, and a real panel would
 * drag `gameStatusOf` into `A6`'s ply total for a reason that is not this module's.
 */
async function runLines(history: GameHistory, lines: readonly string[]): Promise<LoopRun> {
  const messagesPerFrame: string[][] = [];
  const render: RenderSeam = (_history, _status, _thinking, messages) => {
    messagesPerFrame.push([...messages]);
    return ["row one", "row two"];
  };
  let next = 0;
  const input: InputSeam = async (current) => {
    const line = lines[next++];
    return line === undefined ? { kind: "eof" } : resolvePromptLine(current, line);
  };
  const engine: EngineSeam = () => {
    throw new Error("the engine seam must not be reached: no scripted line advances a ply");
  };
  const sink: FrameSink = { write: () => {} };

  const outcome = await runTurnLoop({
    history,
    humanColour: "white",
    render,
    input,
    engine,
    sink,
  });
  return {
    renders: messagesPerFrame.length,
    messagesPerFrame,
    result: outcome.result,
    reason: outcome.reason,
  };
}

describe("ABC-035 A3 — `board` carries no message and triggers no second render", () => {
  it("renders exactly once per prompt cycle, plus the loop's own first frame", async () => {
    const history = newGame(RICH_FEN);

    const run = await runLines(history, ["board", "board", "board"]);

    // `1 + one per non-advancing outcome` (`src/turn-loop.ts:246`). A `board` that redrew for
    // itself would add a fourth, a fifth and a sixth.
    expect(run.renders).toBe(4);
    for (const messages of run.messagesPerFrame) expect(messages).toEqual([]);
    expect(toFen(history.position)).toBe(RICH_FEN);
    expect(history.moves).toHaveLength(0);
  });

  it("help puts its messages on exactly ONE frame and the next frame is clean", async () => {
    const history = newGame(RICH_FEN);

    const run = await runLines(history, ["help", "board"]);

    expect(run.renders).toBe(3);
    expect(run.messagesPerFrame[0]).toEqual([]);
    expect(run.messagesPerFrame[1]).toEqual(helpMessages());
    expect(run.messagesPerFrame[2]).toEqual([]);
  });
});

describe("ABC-035 A4 — `help` names every token in the table and no other", () => {
  it("names every token, derived from COMMAND_TABLE", () => {
    const history = newGame(RICH_FEN);

    const outcome = resolvePromptLine(history, "help");

    expect(outcome.kind).toBe("command");
    const messages = (outcome as { messages: readonly string[] }).messages;
    // Over the TABLE, not over a written list: a token added to the table with no help line reds
    // this row. `ABC-030`'s defect is a help string typed a second time.
    for (const spec of COMMAND_TABLE) expect(messages).toContain(spec.token);
  });

  /**
   * The negative half. These are real tokens of the SAME prompt owned by OTHER tickets — `moves` is
   * `ABC-036`, the rest are `EPIC-006`'s — so a help text that lists the epic's whole vocabulary
   * instead of this table's is caught here rather than by a reader noticing.
   */
  for (const foreign of ["moves", "undo", "resign", "new"]) {
    it(`does not name ${foreign}, which is not in this ticket's table`, () => {
      expect(COMMAND_TABLE.map((spec) => spec.token as string)).not.toContain(foreign);
      expect(helpMessages().join(" ")).not.toContain(foreign);
    });
  }

  it("carries one item per table row, plus the heading — no row is folded away", () => {
    expect(helpMessages()).toHaveLength(COMMAND_TABLE.length + 1);
  });
});

describe("ABC-035 A5 — `claim` is a REQUEST and this module adjudicates nothing", () => {
  it("returns the IDENTICAL outcome value whether or not a draw is claimable", () => {
    const unclaimable = newGame(SHUFFLE_FEN);
    const available = claimable();

    const refused = resolvePromptLine(unclaimable, "claim");
    const allowed = resolvePromptLine(available, "claim");

    // The PAIR is the criterion. A parser that inspected availability and branched passes one half
    // and fails the other — and that wrong build is what the ticket specified until 2026-08-13.
    expect(refused).toEqual({ kind: "claim" });
    expect(allowed).toEqual(refused);
    // No message and no article: the arm is payload-free, so `Object.keys` is exactly `["kind"]`.
    expect(Object.keys(allowed)).toEqual(["kind"]);
  });

  it("the claimable position terminates through ABC-021's transition 16", async () => {
    const run = await runLines(claimable(), ["claim"]);

    expect(run.result).toBe("draw");
    expect(run.reason).toBe("threefold-repetition");
  });

  it("the refused claim's teaching text is claimShortfall's, with ZERO items from here", async () => {
    const run = await runLines(newGame(SHUFFLE_FEN), ["claim"]);

    expect(run.result).toBeNull();
    // Merged wording, asserted by shape rather than copied: `ABC-034`/`ABC-021` own the words.
    expect(run.messagesPerFrame[1]).toEqual([
      expect.stringMatching(/^repetition \d+ of \d+$/),
      expect.stringMatching(/^50-move \d+ of \d+$/),
    ]);
    // Exactly two items reached the frame, so this module contributed none of them.
    expect(run.messagesPerFrame[1]).toHaveLength(2);
  });
});

describe("ABC-035 A6 — the parser adds ZERO derives: it does not ask", () => {
  for (const [line] of TOKEN_SPELLINGS) {
    it(`derives nothing for ${JSON.stringify(line)}`, () => {
      const history = newGame(RICH_FEN);

      resolvePromptLine(history, line);

      expect(derives()).toBe(0);
      expect(repetitionDerives()).toBe(0);
    });
  }

  /**
   * THE CONTROL for the mock itself. `ABC-033` `G3` shipped a guard that read 1 while the real
   * count was 3 because the spy could not see the call; a 0 from a mock nothing routes through
   * would be the same lie one step earlier.
   */
  it("control — the module mock DOES see a direct call to each barred function", () => {
    const history = newGame(RICH_FEN);

    gameStatusOf(history);
    repetitionCounts(history);

    expect(derives()).toBe(1);
    expect(repetitionDerives()).toBe(1);
  });

  it("the ply's total is exactly ONE gameStatusOf — the loop's own, unchanged", async () => {
    const history = claimable();
    vi.mocked(gameStatusOf).mockClear();

    // Four prompt cycles, four non-advancing outcomes, no ply. The loop evaluates once before the
    // first frame and never again on this path (`src/turn-loop.ts:269`).
    await runLines(history, ["help", "board", "quit", "claim"]);

    expect(derives()).toBe(1);
    expect(repetitionDerives()).toBe(0);
  });
});

describe("ABC-035 A7 — `help` fits the message region: hidden count exactly 0", () => {
  /** The two rows before the reserved prompt row, at the DELIVERED panel width — no width asserted. */
  function messageRegionOf(history: GameHistory, messages: readonly string[]): string[] {
    const frame = assembleFrame(
      {
        board: renderBoard(history.position, "unicode", "white-bottom"),
        status: renderStatusPanel(history, gameStatusOf(history), false),
        history: renderHistory(history),
        messages,
      },
      "unicode",
    );
    return frame.slice(frame.length - PROMPT_ROWS - MESSAGE_ROWS, frame.length - PROMPT_ROWS);
  }

  // The start position is the NARROWEST frame this project draws — an empty history pane and no
  // claim cell — so it is the hard case for the region, not the easy one.
  for (const [name, history] of [
    ["the start position", () => newGame(START_FEN)],
    ["a mid-game position with a claim on offer", claimable],
  ] as ReadonlyArray<readonly [string, () => GameHistory]>) {
    it(`hides nothing at ${name}`, () => {
      const history_ = history();
      const messages = helpMessages();

      const region = messageRegionOf(history_, messages);

      expect(region).toHaveLength(MESSAGE_ROWS);
      // The hidden count is exactly 0: `withMarker` appended no `(+N more)`...
      expect(region.join("\n")).not.toContain("(+");
      // ...and every item is present in full, not merely fitted.
      for (const message of messages) expect(region.join(" ")).toContain(message);
    });
  }
});

// ---------------------------------------------------------------------------
// Fences — the things this ticket must NOT do.
// ---------------------------------------------------------------------------

describe("ABC-035 fences — grammar only", () => {
  it("no token carries an effect: `quit` and `board` are outcome-identical and payload-free", () => {
    const history = newGame(RICH_FEN);

    const quit = resolvePromptLine(history, "quit");
    const board = resolvePromptLine(history, "board");

    // `EPIC-006` owns what `quit` DOES. If a confirmation prompt or an exit ever appears here, the
    // two stop being identical and this row is where it shows.
    expect(quit).toEqual({ kind: "command", messages: [] });
    expect(board).toEqual(quit);
  });

  it("takes no argument: a token with anything after it is not a command", () => {
    const history = newGame(RICH_FEN);
    for (const line of ["claim threefold", "quit now", "help claim", "board white"]) {
      expect(classifyCommand(line)).toBeUndefined();
      expect(resolvePromptLine(history, line).kind).not.toBe("command");
    }
  });
});
