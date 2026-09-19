import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COMMAND_TABLE,
  classifyCommand,
  createPromptLineResolver,
  helpMessages,
  type PromptLineOutcome,
  QUIT_CONFIRMATION_MESSAGES,
  resolvePromptLine,
} from "./command-input.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import { assembleFrame, type FrameSink, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import type { GameStatus } from "./gameend.ts";
import {
  type GameHistory,
  gameStatusOf,
  keyHistory,
  newGame,
  playMove,
  repetitionCounts,
} from "./history.ts";
import { renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import type { MoveInputDeps } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { renderBoard } from "./render.ts";
import { renderResultScreen } from "./result-screen.ts";
import { parseSan, toSan } from "./san.ts";
import { renderStatusPanel } from "./status-panel.ts";
import {
  type EngineSeam,
  INPUT_ENDED_NOTICE,
  type InputSeam,
  QUIT_NOTICE,
  type RenderSeam,
  runTurnLoop,
} from "./turn-loop.ts";

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

/**
 * `ABC-045` `A2`'s guard, the SAME shape as `A6`'s above and for the same reason: the loop imports
 * `legalMoves` DIRECTLY from `./legal.ts` (`src/turn-loop.ts`, `wasGenerated`) and so does the
 * rules core under `gameStatusOf`, so a spy on the test seam's `deps.legalMoves` sees neither. The
 * criterion is "0 calls AFTER the outcome is produced", counted at the module boundary where every
 * importer's call is visible. Calls through (`vi.fn(actual.legalMoves)`), so no behaviour changes.
 */
vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return { ...actual, legalMoves: vi.fn(actual.legalMoves) };
});

const derives = (): number => vi.mocked(gameStatusOf).mock.calls.length;
const repetitionDerives = (): number => vi.mocked(repetitionCounts).mock.calls.length;
const legalCalls = (): number => vi.mocked(legalMoves).mock.calls.length;

beforeEach(() => {
  vi.mocked(gameStatusOf).mockClear();
  vi.mocked(repetitionCounts).mockClear();
  vi.mocked(legalMoves).mockClear();
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
  // `ABC-045`'s row, under `ABC-035`'s merged tolerance: the same three shapes, no fourth rule.
  ["resign", "resign"],
  ["RESIGN", "resign"],
  ["  Resign  ", "resign"],
  // `ABC-046`'s row, the same way.
  ["new", "new"],
  ["NEW", "new"],
  ["  New  ", "new"],
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
  "resig",
  "resigns",
  "ne",
  "newgame",
  "renew",
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
  /** The status the loop handed the render seam, per frame — `ABC-046` `A5`'s claim cell. */
  readonly statusPerFrame: readonly GameStatus[];
  readonly result: string | null;
  readonly reason: string | null;
  readonly exitCode: number;
  /** How many prompts the loop actually READ. `ABC-045` `A5`'s witness: the unconsumed next line. */
  readonly reads: number;
  /** Every write to the sink — frames and notices alike. `ABC-046` `A3` reads the LAST one. */
  readonly writes: readonly string[];
}

/**
 * `ABC-045`'s two additions to the runner: the colour (`A1`, both directions) and an outcome probe
 * (`A2`). `ABC-046`'s one: an opponent, for the row whose script advances a ply.
 */
interface RunOptions {
  readonly humanColour?: "white" | "black";
  /** Called the instant the seam has produced an outcome and before the loop acts on it. */
  readonly onOutcome?: (outcome: PromptLineOutcome) => void;
  /** Absent, the engine seam THROWS — every row but `ABC-046` `A1`'s intervening-move one. */
  readonly engine?: EngineSeam;
}

/**
 * Run the MERGED loop with this module bound as the `InputSeam`, one scripted line per prompt, then
 * end the input. The render seam is a stub of fixed rows: `A3` counts CALLS, and a real panel would
 * drag `gameStatusOf` into `A6`'s ply total for a reason that is not this module's.
 *
 * Bound through `createPromptLineResolver`, ONE per run — the resolver the delivered reader binds
 * (`src/line-input.ts`), so the `quit` flag here is this run's and no other row's. Before
 * `ABC-046` this called bare `resolvePromptLine`; every earlier row's outcome is unchanged by the
 * wrapper, because it differs from the pure function on the second consecutive `quit` only.
 */
async function runLines(
  history: GameHistory,
  lines: readonly string[],
  options: RunOptions = {},
): Promise<LoopRun> {
  const messagesPerFrame: string[][] = [];
  const statusPerFrame: GameStatus[] = [];
  const render: RenderSeam = (_history, status, _thinking, messages) => {
    messagesPerFrame.push([...messages]);
    statusPerFrame.push(status);
    return ["row one", "row two"];
  };
  let next = 0;
  const resolve = createPromptLineResolver();
  const input: InputSeam = async (current) => {
    const line = lines[next++];
    if (line === undefined) return { kind: "eof" };
    const outcome = resolve(current, line);
    options.onOutcome?.(outcome);
    return outcome;
  };
  const engine: EngineSeam =
    options.engine ??
    (() => {
      throw new Error("the engine seam must not be reached: no scripted line advances a ply");
    });
  const writes: string[] = [];
  const sink: FrameSink = {
    write: (text) => {
      writes.push(text);
    },
  };

  const outcome = await runTurnLoop({
    history,
    humanColour: options.humanColour ?? "white",
    render,
    input,
    engine,
    sink,
  });
  return {
    renders: messagesPerFrame.length,
    messagesPerFrame,
    statusPerFrame,
    result: outcome.result,
    reason: outcome.reason,
    exitCode: outcome.exitCode,
    reads: next,
    writes,
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
   * `ABC-036`, `undo` is `ABC-102`'s — so a help text that lists the epic's whole vocabulary
   * instead of this table's is caught here rather than by a reader noticing. `resign` LEFT this
   * list at `ABC-045` and `new` LEFT it at `ABC-046`, each when its ticket put it in the table;
   * both are asserted present in the positive half above. `ABC-112` — the filter that would have
   * hidden `quit` from `help` until it was honoured — is moot from `ABC-046` on: the table's
   * promise is TRUE for every row in it.
   */
  for (const foreign of ["moves", "undo"]) {
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
// `ABC-045` — `resign`: one row, one `game-over`, and the opponent wins. A1-A3, A5 here; A4 is the
// entry-point child in `src/cli.test.ts`; A6 is the gate's `git diff --numstat`.
// ---------------------------------------------------------------------------

describe("ABC-045 — `resign` resolves to the EXISTING game-over arm with the resigner's loss", () => {
  /** The exact object, so a payload added later (a confirmation flag, a message) reds here. */
  const RESIGNED_AS_WHITE = { kind: "game-over", result: "black-wins", reason: "resignation" };
  const RESIGNED_AS_BLACK = { kind: "game-over", result: "white-wins", reason: "resignation" };

  /** A game at ply 4, White to move, with every piece still on the board: plenty of legal moves. */
  const atPlyFour = (): GameHistory => played(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6"]);

  it("A1 — the pure function: the side to move loses, in BOTH directions", () => {
    // Both, because a build that hardcodes one direction satisfies a single-direction row and
    // reports the winner as the loser half the time (`ABC-019`'s `LoopOutcome` warning).
    expect(resolvePromptLine(newGame(START_FEN), "resign")).toEqual(RESIGNED_AS_WHITE);
    expect(resolvePromptLine(played(START_FEN, ["e2e4"]), "resign")).toEqual(RESIGNED_AS_BLACK);
    // Exactly the arm's three fields — no confirmation flag, no message, nothing to read twice.
    expect(Object.keys(resolvePromptLine(newGame(START_FEN), "resign"))).toEqual([
      "kind",
      "result",
      "reason",
    ]);
  });

  it("A1 — through the MERGED loop: the human as white loses to black, and exits 0", async () => {
    const run = await runLines(newGame(START_FEN), ["resign"], { humanColour: "white" });

    expect(run.result).toBe("black-wins");
    expect(run.reason).toBe("resignation");
    expect(run.exitCode).toBe(0);
  });

  it("A1 — through the MERGED loop: the human as black loses to white, and exits 0", async () => {
    // Black to move after `e4`, so the loop's first prompt is the human's — the engine seam, which
    // throws, is never reached; that throw is what proves the direction rather than the fixture.
    const run = await runLines(played(START_FEN, ["e2e4"]), ["resign"], { humanColour: "black" });

    expect(run.result).toBe("white-wins");
    expect(run.reason).toBe("resignation");
    expect(run.exitCode).toBe(0);
  });

  it("A2 — it ends the game on the ply it is typed: 0 legalMoves after the outcome, no frame after it", async () => {
    const history = atPlyFour();
    const legalBefore = legalMoves(history.position).length;
    expect(legalBefore).toBeGreaterThan(0);
    const fen = toFen(history.position);
    let legalAtOutcome = -1;
    let derivesAtOutcome = -1;

    const run = await runLines(history, ["resign", "d2d4"], {
      onOutcome: () => {
        legalAtOutcome = legalCalls();
        derivesAtOutcome = derives();
      },
    });

    // The loop returned on THAT iteration: the second scripted line was never read.
    expect(run.reads).toBe(1);
    expect(run.result).toBe("black-wins");
    expect(run.reason).toBe("resignation");
    // `legalMoves` — spied at the module boundary, so the loop's own direct import is visible — is
    // called ZERO times after the outcome is produced, and so is the derive.
    expect(legalAtOutcome).toBeGreaterThanOrEqual(0);
    expect(legalCalls() - legalAtOutcome).toBe(0);
    expect(derives() - derivesAtOutcome).toBe(0);
    // THE FRAME COUNT, READ AGAINST THE MERGED LOOP RATHER THAN THE TICKET'S SENTENCE. The
    // criterion says "exactly one further frame is written — the final one". `game-over` returns
    // from `awaiting-human` WITHOUT passing through `rendering` (`src/turn-loop.ts`, the same edge
    // `ABC-021`'s allowed claim takes), so the frame rendered BEFORE the prompt is the final one
    // and ZERO frames follow the outcome; the one further write is the result screen, which is the
    // entry point's (`A4`, `src/cli.test.ts`). Asserted as the loop actually behaves: one frame in
    // the whole session, none after `resign`.
    expect(run.renders).toBe(1);
    expect(toFen(history.position)).toBe(fen);
    expect(history.moves).toHaveLength(4);
  });

  it("A2 control — the same legalMoves spy DOES count a real call on a line that is a move", () => {
    const history = atPlyFour();
    const before = legalCalls();

    resolvePromptLine(history, "d2d4");

    expect(legalCalls() - before).toBeGreaterThanOrEqual(1);
  });

  it("A3 — classified before the grammars: neither resolver and no derive sees `resign`", () => {
    const history = atPlyFour();
    const seam = spied(history);
    const legalBefore = legalCalls();

    const outcome = resolvePromptLine(history, "resign", seam.deps);

    expect(outcome).toEqual(RESIGNED_AS_WHITE);
    expect(seam.coordinateCalls()).toBe(0);
    expect(seam.sanCalls()).toBe(0);
    expect(seam.deriveCalls()).toBe(0);
    // `NFR-002`'s "no derive is added", at the module boundary rather than the test seam: a
    // `legalMoves` reached through a direct import inside the resign path is visible here and
    // invisible to `seam.deriveCalls()`.
    expect(legalCalls() - legalBefore).toBe(0);
    expect(derives()).toBe(0);
  });

  it("A5 — no confirmation: the game ends on the one line and the next line is NEVER read", async () => {
    // The witness is a stdin whose next line is never consumed: a build that read a confirmation
    // nobody asked for would take `d2d4` as the answer and `reads` would be 2.
    const run = await runLines(atPlyFour(), ["resign", "d2d4"]);

    expect(run.reads).toBe(1);
    expect(run.result).toBe("black-wins");
    expect(run.reason).toBe("resignation");
  });

  it("A5 — and it is a command like the other four: no message region, no second render", async () => {
    const run = await runLines(atPlyFour(), ["resign"]);

    expect(run.messagesPerFrame).toEqual([[]]);
  });
});

// ---------------------------------------------------------------------------
// Fences — the things this ticket must NOT do.
// ---------------------------------------------------------------------------

describe("ABC-035 fences — grammar only", () => {
  /**
   * SUPERSEDED AT `ABC-046`, in writing, on that ticket's page (`## Design ruling 2026-09-19`,
   * "The `Done` assertion this ticket will red, authorised here"). The row that stood here said
   * `quit` and `board` are outcome-identical and payload-free, and its own comment said it reds
   * the day `EPIC-006` gives `quit` an effect. That day is `ABC-046`. What is STILL true of the
   * pure function is asserted instead: `board` is payload-free, and `quit` carries the
   * confirmation and NOTHING else — no exit from this function, ever.
   */
  it("`board` is payload-free; the pure function's `quit` is the confirmation and never an exit", () => {
    const history = newGame(RICH_FEN);

    const board = resolvePromptLine(history, "board");
    const quit = resolvePromptLine(history, "quit");
    const again = resolvePromptLine(history, "quit");

    expect(board).toEqual({ kind: "command", messages: [] });
    expect(quit).toEqual({ kind: "command", messages: QUIT_CONFIRMATION_MESSAGES });
    // No memory: the second call to the PURE function is the first call again.
    expect(again).toEqual(quit);
  });

  /**
   * ADDED AFTER A MUTANT SURVIVED, and it is the only guard in this file that was not written from
   * the criterion. `A3`'s render count and the empty-message assertion both catch a `board` arm
   * that draws through the LOOP; mutant `M13` — `process.stdout.write(renderBoard(…))` inside
   * `resolvePromptLine` — reded **0 of 78**, because a module that writes to the stream directly
   * bypasses the render seam the count watches. That is exactly `ABC-035`'s named security firing
   * threshold ("any direct stream write"), so it gets a guard rather than a sentence.
   */
  it("writes to no stream of its own — the outcome is the only channel", () => {
    const history = claimable();
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const errorWrite = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    let written: number;
    let errored: number;
    let control: number;
    try {
      for (const [line] of TOKEN_SPELLINGS) resolvePromptLine(history, line);
      resolvePromptLine(history, "e4");
      written = write.mock.calls.length;
      errored = errorWrite.mock.calls.length;
      // The control, in the same window: a spy nothing routes through reports 0 for free.
      process.stdout.write("probe");
      control = write.mock.calls.length;
    } finally {
      write.mockRestore();
      errorWrite.mockRestore();
    }

    expect(written).toBe(0);
    expect(errored).toBe(0);
    expect(control).toBe(1);
  });

  it("takes no argument: a token with anything after it is not a command", () => {
    const history = newGame(RICH_FEN);
    for (const line of [
      "claim threefold",
      "quit now",
      "help claim",
      "board white",
      "resign now",
      "new game",
    ]) {
      expect(classifyCommand(line)).toBeUndefined();
      expect(resolvePromptLine(history, line).kind).not.toBe("command");
      expect(resolvePromptLine(history, line).kind).not.toBe("take-back");
    }
  });
});

// ---------------------------------------------------------------------------
// `ABC-046` — `quit` with confirmation, and `new`. A1-A7 here (A1's second `quit` and A3 through the
// merged loop; A2/A3/A6 also as entry-point children in `src/cli.test.ts`); A8 is the gate's
// `git diff --numstat`.
// ---------------------------------------------------------------------------

describe("ABC-046 — `quit` asks once, ends on the second consecutive `quit`, and forgets on anything else", () => {
  /** The exact first-`quit` object. A payload added later (a flag, a second item) reds here. */
  const CONFIRMATION = { kind: "command", messages: QUIT_CONFIRMATION_MESSAGES };
  /** The exact exit arm — `Object.keys` exactly `["kind"]`, as `claim`'s row asserts of `claim`. */
  const QUIT = { kind: "quit" };
  /** A first-legal-move opponent, for the ONE row whose script advances a ply. */
  const firstLegal: EngineSeam = async (history) => legalMoves(history.position)[0] as Move;

  it("A1 — quit / quit: the first is the confirmation, the second is the exit, and the exit is payload-free", () => {
    const history = newGame(RICH_FEN);
    const resolve = createPromptLineResolver();

    const first = resolve(history, "quit");
    const second = resolve(history, "quit");

    expect(first).toEqual(CONFIRMATION);
    expect(second).toEqual(QUIT);
    expect(Object.keys(second)).toEqual(["kind"]);
    // The confirmation fits the region's bound (`ADR-0021` clause 6: ≤ 17 columns), as ONE item.
    expect(QUIT_CONFIRMATION_MESSAGES).toHaveLength(1);
    expect((QUIT_CONFIRMATION_MESSAGES[0] as string).length).toBeLessThanOrEqual(17);
    // And the classification is `ABC-035`'s: any tolerated spelling arms, any tolerated spelling ends.
    const spelled = createPromptLineResolver();
    expect(spelled(history, "QUIT")).toEqual(CONFIRMATION);
    expect(spelled(history, "  Quit  ")).toEqual(QUIT);
  });

  it("A1 — quit / other / quit: an intervening COMMAND clears the confirmation", () => {
    const history = newGame(RICH_FEN);
    const resolve = createPromptLineResolver();

    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    expect(resolve(history, "board")).toEqual({ kind: "command", messages: [] });
    // The third line is a FIRST quit again, not a second.
    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    // And so is the fourth after `help`, so a flag that merely counts quits is red here.
    expect(resolve(history, "help").kind).toBe("command");
    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    expect(resolve(history, "quit")).toEqual(QUIT);
  });

  it("A1 — quit / legal move / quit: an intervening MOVE clears it (the third clause, pure)", () => {
    const history = newGame(RICH_FEN);
    const resolve = createPromptLineResolver();

    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    expect(resolve(history, "b4").kind).toBe("move");
    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
  });

  it("A1 — quit / rejected line / quit: a line that is NOT a move clears it too", () => {
    const history = newGame(RICH_FEN);
    const resolve = createPromptLineResolver();

    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    expect(resolve(history, "zzz").kind).toBe("rejected");
    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
  });

  it("A1 — the flag is PER SESSION: a second resolver is not armed by the first", () => {
    const history = newGame(RICH_FEN);
    const one = createPromptLineResolver();
    const two = createPromptLineResolver();

    expect(one(history, "quit")).toEqual(CONFIRMATION);
    // A module-level flag — `ABC-045`'s M5 shape — ends `two`'s session on its FIRST quit.
    expect(two(history, "quit")).toEqual(CONFIRMATION);
    expect(one(history, "quit")).toEqual(QUIT);
  });

  it("A1 — through the MERGED loop: one `quit` continues with a frame that asks; the second ends it and the next line is never read", async () => {
    const history = newGame(RICH_FEN);
    const fen = toFen(history.position);

    const run = await runLines(history, ["quit", "quit", "b4"]);

    // The first `quit` re-emitted ONE frame carrying the confirmation (transition 9); the second
    // re-emitted none (transition 17). Frames: the loop's own first, plus one.
    expect(run.renders).toBe(2);
    expect(run.messagesPerFrame).toEqual([[], QUIT_CONFIRMATION_MESSAGES]);
    // The third scripted line — a legal move — was never read.
    expect(run.reads).toBe(2);
    expect(run.result).toBeNull();
    expect(run.reason).toBeNull();
    expect(run.exitCode).toBe(0);
    expect(toFen(history.position)).toBe(fen);
    expect(history.moves).toHaveLength(0);
  });

  it("A1 — through the MERGED loop: quit / board / quit does NOT end the session", async () => {
    const run = await runLines(newGame(RICH_FEN), ["quit", "board", "quit"]);

    // All three read, then end-of-input: the session ended on EOF, not on `quit`.
    expect(run.reads).toBe(4);
    expect(run.renders).toBe(4);
    expect(run.messagesPerFrame).toEqual([
      [],
      QUIT_CONFIRMATION_MESSAGES,
      [],
      QUIT_CONFIRMATION_MESSAGES,
    ]);
    expect(run.writes[run.writes.length - 1]).toBe(`${INPUT_ENDED_NOTICE}\n`);
  });

  it("A1 — through the MERGED loop with an opponent: quit / e4 / quit does NOT end the session", async () => {
    const history = newGame(START_FEN);

    const run = await runLines(history, ["quit", "e4", "quit"], { engine: firstLegal });

    // `e4` advanced a ply, the opponent answered, and the third line was a FIRST quit again.
    expect(run.reads).toBe(4);
    expect(history.moves).toHaveLength(2);
    expect(run.messagesPerFrame[run.messagesPerFrame.length - 1]).toEqual(
      QUIT_CONFIRMATION_MESSAGES,
    );
    expect(run.writes[run.writes.length - 1]).toBe(`${INPUT_ENDED_NOTICE}\n`);
    expect(run.result).toBeNull();
  });

  it("A1 — quit / EOF: one `quit` then end-of-input is `ABC-019`'s end-of-input, not a quit", async () => {
    const run = await runLines(newGame(RICH_FEN), ["quit"]);

    expect(run.reads).toBe(2);
    expect(run.renders).toBe(2);
    expect(run.writes[run.writes.length - 1]).toBe(`${INPUT_ENDED_NOTICE}\n`);
    for (const write of run.writes) expect(write).not.toBe(`${QUIT_NOTICE}\n`);
    expect(run.result).toBeNull();
    expect(run.exitCode).toBe(0);
  });

  it("A2 — a session ended by `quit` records NO result: the screen has zero rows and the code is 0", async () => {
    const history = played(START_FEN, ["e2e4", "e7e5"]);

    const run = await runLines(history, ["quit", "quit"]);

    expect(run.result).toBeNull();
    expect(run.reason).toBeNull();
    expect(run.exitCode).toBe(0);
    // `ABC-044`'s own renderer, on the loop's own outcome: ZERO rows. The entry-point half — that
    // nothing is written after the notice — is `CHILDREN.quits` in `src/cli.test.ts`. The literal
    // `0` is the type's (`LoopOutcome.exitCode` is the literal); the line above proved the value.
    expect(renderResultScreen({ result: null, reason: null, exitCode: 0 }, history)).toEqual([]);
  });

  it("A3 — the last line written names quitting and is NOT `INPUT_ENDED_NOTICE`", async () => {
    const run = await runLines(newGame(RICH_FEN), ["quit", "quit"]);

    const last = run.writes[run.writes.length - 1];
    // Inequality against the two EXPORTED constants — never a substring of either (test note 4).
    expect(last).toBe(`${QUIT_NOTICE}\n`);
    expect(QUIT_NOTICE).not.toBe(INPUT_ENDED_NOTICE);
    for (const write of run.writes) expect(write).not.toContain(INPUT_ENDED_NOTICE);
  });

  it("A7 — `quit` is classified before the grammars, on BOTH quits: neither resolver, no derive", () => {
    const history = newGame(RICH_FEN);
    const seam = spied(history);
    const legalBefore = legalCalls();
    const resolve = createPromptLineResolver(seam.deps);

    expect(resolve(history, "quit")).toEqual(CONFIRMATION);
    expect(resolve(history, "quit")).toEqual(QUIT);

    expect(seam.coordinateCalls()).toBe(0);
    expect(seam.sanCalls()).toBe(0);
    expect(seam.deriveCalls()).toBe(0);
    expect(legalCalls() - legalBefore).toBe(0);
    expect(derives()).toBe(0);
  });

  it("A7 control — the wrapper DOES hand a non-command to the resolvers, through the deps it was given", () => {
    const history = newGame(RICH_FEN);
    const seam = spied(history);
    const resolve = createPromptLineResolver(seam.deps);

    expect(resolve(history, "e1d1").kind).toBe("move");

    expect(seam.coordinateCalls()).toBe(1);
    expect(seam.sanCalls()).toBe(1);
  });

  it("the confirmation fits the message region at the NARROWEST frame: hidden count exactly 0", () => {
    // `ABC-035` `A7`'s instrument, on this ticket's one item, at the start position — the narrowest
    // frame this project draws.
    const history = newGame(START_FEN);
    const frame = assembleFrame(
      {
        board: renderBoard(history.position, "unicode", "white-bottom"),
        status: renderStatusPanel(history, gameStatusOf(history), false),
        history: renderHistory(history),
        messages: QUIT_CONFIRMATION_MESSAGES,
      },
      "unicode",
    );
    const region = frame.slice(
      frame.length - PROMPT_ROWS - MESSAGE_ROWS,
      frame.length - PROMPT_ROWS,
    );

    expect(region.join("\n")).not.toContain("(+");
    expect(region.join(" ")).toContain(QUIT_CONFIRMATION_MESSAGES[0] as string);
  });
});

describe("ABC-046 — `new` is a take-back of every ply, and the loop rewinds all three together", () => {
  it("A4 — the pure function: `take-back` of `moves.length` plies, nothing mutated HERE", () => {
    const history = claimable();
    const fen = toFen(history.position);

    const outcome = resolvePromptLine(history, "new");

    expect(outcome).toEqual({ kind: "take-back", plies: 8, messages: [] });
    expect(Object.keys(outcome)).toEqual(["kind", "plies", "messages"]);
    // The splice is the LOOP's (`ADR-0021` clause 4): this call changed nothing.
    expect(history.moves).toHaveLength(8);
    expect(toFen(history.position)).toBe(fen);
    // And at ply 0 it is a take-back of zero — `takeBack` clamps, the seam does not guard.
    expect(resolvePromptLine(newGame(START_FEN), "new")).toEqual({
      kind: "take-back",
      plies: 0,
      messages: [],
    });
  });

  it("A4 — through the MERGED loop at ply 8 with a repeated position: FEN, moves, keys and counts rewind TOGETHER", async () => {
    const history = claimable();
    expect(history.moves).toHaveLength(8);
    expect(keyHistory(history)).toHaveLength(9);

    await runLines(history, ["new"]);

    // Test note 2: `repetitionCounts`, not just the FEN. A reset that rebuilds the position but
    // keeps the key list passes the FEN check and corrupts the next draw detection.
    expect(toFen(history.position)).toBe(SHUFFLE_FEN);
    expect(history.moves).toHaveLength(0);
    expect(keyHistory(history)).toHaveLength(1);
    const counts = repetitionCounts(history);
    expect(counts.size).toBe(1);
    expect([...counts.values()]).toEqual([1]);
  });

  it("A5 — on a CLAIMABLE position, the frame after `new` carries NO draw claim (transition 18 re-evaluates)", async () => {
    const history = claimable();

    const run = await runLines(history, ["new"]);

    // The GIVEN, asserted: the frame before `new` really did carry the claim.
    expect(run.statusPerFrame[0]?.claimable).toEqual({
      by: "white",
      draws: ["threefold-repetition"],
    });
    // The frame after it is the rewound position's own status — shape (a)'s stale cell is absent.
    expect(run.renders).toBe(2);
    expect(run.statusPerFrame[1]?.claimable).toBeUndefined();
    expect(run.statusPerFrame[1]?.result).toBe("in-progress");
    // And the delivered PANEL, composed on that status, shows no claim cell.
    const panel = renderStatusPanel(history, run.statusPerFrame[1] as GameStatus, false);
    expect(panel.join("\n")).not.toContain("may claim");
    expect(run.messagesPerFrame[1]).toEqual([]);
  });

  it("A5 — the cost: exactly ONE extra derive for the take-back, none for the discarded game", async () => {
    const history = claimable();
    vi.mocked(gameStatusOf).mockClear();

    await runLines(history, ["new", "board"]);

    // 1 before the first frame + 1 for the take-back + 0 for `board`.
    expect(derives()).toBe(2);
  });

  it("A7 — `new` is classified before the grammars: neither resolver, no derive", () => {
    const history = claimable();
    const seam = spied(history);
    const legalBefore = legalCalls();

    const outcome = resolvePromptLine(history, "new", seam.deps);

    expect(outcome.kind).toBe("take-back");
    expect(seam.coordinateCalls()).toBe(0);
    expect(seam.sanCalls()).toBe(0);
    expect(seam.deriveCalls()).toBe(0);
    expect(legalCalls() - legalBefore).toBe(0);
    expect(derives()).toBe(0);
  });

  it("`new` does not disturb the `quit` flag's rule: quit / new / quit asks again", () => {
    const history = played(START_FEN, ["e2e4", "e7e5"]);
    const resolve = createPromptLineResolver();

    expect(resolve(history, "quit").kind).toBe("command");
    expect(resolve(history, "new").kind).toBe("take-back");
    expect(resolve(history, "quit")).toEqual({
      kind: "command",
      messages: QUIT_CONFIRMATION_MESSAGES,
    });
  });

  it("`help` now names BOTH — the promise `ABC-112` was cut over is TRUE, by construction", () => {
    const messages = helpMessages();

    expect(messages).toContain("quit");
    expect(messages).toContain("new");
    expect(messages).toHaveLength(COMMAND_TABLE.length + 1);
  });
});
