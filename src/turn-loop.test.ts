/**
 * `ABC-019`'s twenty-seven acceptance criteria, plus the eighteen scripted rows its `## Test notes`
 * enumerate. The loop is testable end to end TODAY, with no parser and no engine, because both
 * stubs are built from merged code — that is the point of the stubs.
 *
 * TWO OF THE TWENTY-SEVEN ARE NOT ASSERTED HERE, and both are named rather than left as gaps.
 * `A17`'s timing half is produced OUT OF TREE by the instrument that criterion names, because a
 * number produced inside `vitest` would be a different measurement wearing its name. `A20` — and
 * `## Test notes` row 18 with it — CANNOT BE SATISFIED until `ABC-027` merges: `ADR-0010` clause 1
 * puts its production change in `src/frame.ts`'s in-place writer, which this ticket does not open.
 * It is written at the rebase, riding with `ADR-0009` clause 9f's real-panel re-gate.
 *
 * THE STUB PANELS LIVE HERE AND NOWHERE ELSE. `ADR-0009` clause 9c: a test double for the render
 * seam lives in a TEST file, never in `src/` as a production module, and option **G** — a shared
 * `src/panel-stubs.ts` imported by this file and by `frame.test.ts` — is rejected as a
 * single-use abstraction that is dead on arrival and would be the third declaration site in person.
 * Merged `frame.test.ts`'s `statusStub` / `historyStub` are `ABC-018`'s own fixtures at 3/8; they
 * are not this seam, and this file does not touch them.
 *
 * NEITHER SHAPE IS 3/8, AND THAT IS `A18` CLAUSE (i) RATHER THAN A PREFERENCE. With stubs at the
 * reference layout's 3 and 8 a loop that hardcodes its height is GREEN on every clause here and
 * breaks only at the rebase onto the real panels, at the one moment nothing in the tree re-checks
 * it — and a 3/8 stub never exercises the append path at all. ONE shape is not enough either: a
 * literal tuned to shape `A` passes every clause of `A19` under `A` alone. Two shapes whose heights
 * differ cannot both be satisfied by any literal, so the derived form is the only build that passes.
 *
 * THE SPIES, AND THE ONE HONEST LIMIT. `gameend.ts`, `history.ts` and `frame.ts` are re-routed by
 * `vi.mock` + `vi.fn(actual)`, so every mock CALLS THROUGH and no behaviour changes. The limit,
 * stated rather than papered over: `gameStatusOf` calls `repetitionCounts` INSIDE `history.ts`, and
 * a module-boundary spy cannot see an intra-module call. So the `repetitionCounts` spy counts only
 * derives the LOOP makes on its own — asserting it at 0 is the proof that every evaluation goes
 * through `gameStatusOf` — while the derive `A3b` actually bars is counted by the `gameStatus` spy,
 * which `history.ts:152` calls exactly once per `gameStatusOf`.
 *
 * All mocks are in this ONE file with the loop's other tests, deliberately: `N8-LANE`'s binding risk
 * is the FILE count at 159-179 ms CPU per file against a 650 ms allowance, not the test count.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import type { FrameSink, FrameWriter } from "./frame.ts";
import type { ClaimableDraw, EndReason, GameStatus } from "./gameend.ts";
import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_NONE, type Move } from "./moves.ts";
import {
  BISHOP,
  EMPTY,
  KNIGHT,
  type Position,
  parseSquareName,
  QUEEN,
  ROOK,
  squareName,
} from "./position.ts";
import { renderBoard } from "./render.ts";
import type {
  EngineSeam,
  FinalResult,
  InputSeam,
  LoopOutcome,
  RenderSeam,
  TerminalReason,
} from "./turn-loop.ts";

vi.mock("./frame.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./frame.ts")>();
  // The session is wrapped, not replaced: the REAL writer is built and then spied, so the strategy
  // is genuinely chosen and genuinely emitted while `A19` (c) can still read the rows it received.
  const beginFrameSession = vi.fn((sink: FrameSink, height: number) =>
    vi.fn(actual.beginFrameSession(sink, height)),
  );
  return { ...actual, beginFrameSession };
});

vi.mock("./gameend.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./gameend.ts")>();
  return { ...actual, gameStatus: vi.fn(actual.gameStatus) };
});

vi.mock("./history.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./history.ts")>();
  return {
    ...actual,
    gameStatusOf: vi.fn(actual.gameStatusOf),
    playMove: vi.fn(actual.playMove),
    repetitionCounts: vi.fn(actual.repetitionCounts),
  };
});

const { assembleFrame, beginFrameSession, MESSAGE_ROWS, PROMPT_ROWS } = await import("./frame.ts");
const { gameStatus } = await import("./gameend.ts");
const { gameStatusOf, newGame, playMove, repetitionCounts } = await import("./history.ts");
const { INPUT_ENDED_NOTICE, runTurnLoop } = await import("./turn-loop.ts");

// ---------------------------------------------------------------------------
// Positions. Every one of them was RUN against merged `src/` before it was written down.
// ---------------------------------------------------------------------------

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Black to move, one ply from mate: `d8h4`. Black wins, so a loop that re-derives reports White. */
const FOOLS_MATE_FEN = "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2";
/** `f1f7` leaves Black with no legal move and no check. */
const STALEMATE_FEN = "7k/8/6K1/8/8/8/8/5Q2 w - - 0 1";
/**
 * `b2c1` takes one of TWO black knights and leaves K+N vs K. Two knights deliberately: with one, the
 * position is ALREADY a dead position by material and the loop stops on the initial evaluation
 * without ever playing the ply — a row that terminates for the right reason and tests nothing.
 */
const THIN_MATERIAL_FEN = "1k6/8/8/8/8/8/1K6/2n4n w - - 0 1";
/** One reversible ply short of 9.6.2's automatic 150. */
const AT_149_FEN = "7k/8/8/8/8/8/8/K5R1 w - - 149 80";
/** One reversible ply short of 9.3's claimable 100. */
const AT_99_FEN = "7k/8/8/8/8/8/8/K5R1 w - - 99 60";
/** `e7e8` names FOUR moves with identical `from`/`to`, so `ambiguous` is reached for free. */
const PROMOTION_FEN = "7k/4P3/8/8/8/8/8/K7 w - - 0 1";
/**
 * Row 16 — `THIN_MATERIAL_FEN` minus one knight, so the game is ALREADY `{draw,
 * insufficient-material}` on the initial evaluation (`isInsufficientMaterial` is true at
 * `minors <= 1`). It is the witness `A3b`'s `+ 1` claimed and did not have: `[D32]` named row 3 and
 * `[D35]`, in the same amendment, took the already-dead start OUT of row 3.
 *
 * SIX legal moves are available, and that is the fixture rule rather than a detail — a dead position
 * with NO legal move is a stalemate fixture and exercises a different branch (`[D43]`).
 */
const DEAD_MATERIAL_FEN = "1k6/8/8/8/8/8/1K6/2n5 w - - 0 1";

/**
 * The knight round trip. Each 4-ply cycle returns to the EXACT start position, so `n` cycles make
 * `n + 1` occurrences. Knights and not pawns: a repeated line must never set an en-passant square,
 * which `ABC-011` would otherwise hash into the key and fail these rows for a reason not this loop's.
 */
const CYCLE = ["g1f3", "g8f6", "f3g1", "f6g8"] as const;
const cycles = (count: number): string[] => Array.from({ length: count }, () => [...CYCLE]).flat();

const EVERY_END_REASON: readonly EndReason[] = [
  "checkmate",
  "stalemate",
  "insufficient-material",
  "fivefold-repetition",
  "seventy-five-move",
];

const EVERY_CLAIMABLE_DRAW: readonly ClaimableDraw[] = ["threefold-repetition", "fifty-move"];

/**
 * `A14`'s enumeration, in ONE place because two criteria assert it and a second copy could drift:
 * `A14` asserts the type admits all ten, and `A9b` (iii) asserts the input-seam handler introduces no
 * eleventh. The annotation is the assertion — `tsc --noEmit` is a blocking gate, and
 * `EndReason | "resignation"`, which satisfies "admits resignation in addition to the five core
 * values" word for word, cannot type this array. `src/gameend.ts` is not changed to make it work.
 */
const EVERY_TERMINAL_REASON: readonly TerminalReason[] = [
  ...EVERY_END_REASON,
  ...EVERY_CLAIMABLE_DRAW,
  "resignation",
  "engine-failure",
  "engine-threw",
];

// ---------------------------------------------------------------------------
// The two stub seams. Both are built from merged code alone.
// ---------------------------------------------------------------------------

const coordinatesOf = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

const movesNamed = (history: GameHistory, token: string): Move[] =>
  legalMoves(history.position).filter((move) => coordinatesOf(move) === token);

const PROMOTION_LETTER: Readonly<Record<number, string>> = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n",
};

const candidateOf = (move: Move): string =>
  `${coordinatesOf(move)}${PROMOTION_LETTER[move.promotion] ?? ""}`;

/**
 * The INPUT stub — a coordinate-only reader over `legalMoves`, and the two stubs share ONE cursor
 * over the script so a scripted game reads as one game in ply order rather than as two interleaved
 * scripts. It returns a GENERATOR-OWNED `Move`, so it cannot get `captured`, `flags` or `promotion`
 * wrong, and it reaches `ambiguous` and `rejected` without either being written into it.
 *
 * It is a TEST SEAM, not a design for `EPIC-003`'s parser.
 */
function scriptedSeams(script: readonly string[]): { input: InputSeam; engine: EngineSeam } {
  let cursor = 0;

  const input: InputSeam = async (history) => {
    if (cursor >= script.length) return { kind: "eof" };
    const token = script[cursor] as string;
    cursor += 1;
    if (token === "board") return { kind: "command", messages: ["board redrawn"] };

    const candidates = movesNamed(history, token);
    if (candidates.length === 0) return { kind: "rejected", messages: [`not a move: ${token}`] };
    if (candidates.length > 1) {
      return { kind: "ambiguous", messages: candidates.map(candidateOf) };
    }
    return { kind: "move", move: candidates[0] as Move };
  };

  const engine: EngineSeam = async (history) => {
    const token = script[cursor] as string;
    cursor += 1;
    const move = movesNamed(history, token)[0];
    // A fixture whose script runs out on the engine's turn surfaces as `engine-threw`, which no row
    // expects — so it fails loudly rather than playing an undefined move.
    if (move === undefined) throw new Error(`fixture: no engine move for "${token}"`);
    return move;
  };

  return { input, engine };
}

/**
 * The ENGINE stub — a move from `legalMoves`, chosen by a fixed LCG so the game is identical on
 * every run and every machine, with an optional artificial delay so the thinking state and `A15`'s
 * macrotask boundary are exercised. A TEST SEAM, not a design for `EPIC-004`.
 */
function seededEngine(seed: number, delay?: () => Promise<void>): EngineSeam {
  let state = seed;
  return async (history) => {
    if (delay !== undefined) await delay();
    const moves = legalMoves(history.position);
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return moves[state % moves.length] as Move;
  };
}

const ENGINE_SEED = 0x2f6e2b1;
const macrotask = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * The line the engine stub plays against itself, as COORDINATE TOKENS, so the coordinate reader can
 * drive BOTH sides of one deterministic game without a third stub being invented for it. No
 * promotion is reachable inside the ply counts used here, so every token names exactly one move.
 */
async function seededLine(plies: number, seed: number): Promise<string[]> {
  const engine = seededEngine(seed);
  const history = newGame(START_FEN);
  const tokens: string[] = [];
  for (let ply = 0; ply < plies; ply++) {
    const move = await engine(history);
    tokens.push(coordinatesOf(move));
    playMove(history, move);
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// The panel stubs and the render seam they sit behind.
// ---------------------------------------------------------------------------

interface Shape {
  readonly name: string;
  readonly statusRows: number;
  readonly historyRows: number;
}

/** `H` = 19 on a 24-row TTY: in place. Not 3, not 8. */
const SHAPE_A: Shape = { name: "A", statusRows: 2, historyRows: 5 };
/** `H` = 25 on a 24-row TTY: append — the branch a 3/8 stub never exercises. Not 3, not 8. */
const SHAPE_B: Shape = { name: "B", statusRows: 4, historyRows: 9 };

/** `ABC-016` is unbuilt. Exactly `rows` rows whatever the state, per `EPIC-002` `4a` and `A11`. */
function statusStub(status: GameStatus, thinking: boolean, rows: number): string[] {
  const lines = [
    `status ${status.result}`,
    thinking ? "thinking" : "ready",
    `reason ${status.reason ?? "-"}`,
    `claim ${status.claimable === undefined ? "-" : status.claimable.draws.join("+")}`,
  ];
  const panel = lines.slice(0, rows);
  while (panel.length < rows) panel.push("");
  return panel;
}

/** `ABC-017` is unbuilt. Exactly `rows` rows, blank-padded, most recent move pairs last. */
function historyStub(moves: readonly Move[], rows: number): string[] {
  const pairs: string[] = [];
  for (let ply = 0; ply < moves.length; ply += 2) {
    const black = moves[ply + 1];
    const reply = black === undefined ? "" : ` ${coordinatesOf(black)}`;
    pairs.push(`${ply / 2 + 1}. ${coordinatesOf(moves[ply] as Move)}${reply}`);
  }
  const window = pairs.slice(-rows);
  while (window.length < rows) window.push("");
  return window;
}

/**
 * The render seam of the exact shape `## Scope` states: the loop supplies everything the frame
 * draws — the history, the status IT evaluated, the thinking flag and the message items — and gets
 * a frame's ROWS back. It derives nothing: it never calls `gameStatusOf`, `repetitionCounts`,
 * `keyHistory` or `gameStatus`, which is the line `ABC-016` was owed and what makes `A5`/`A6`
 * satisfiable at all.
 */
function panelSeam(shape: Shape): RenderSeam {
  return (history, status, thinking, messages) =>
    assembleFrame(
      {
        board: renderBoard(history.position, "unicode", "white-bottom"),
        status: statusStub(status, thinking, shape.statusRows),
        history: historyStub(history.moves, shape.historyRows),
        messages,
      },
      "unicode",
    );
}

// ---------------------------------------------------------------------------
// Sink, harness, and the small readers the assertions share.
// ---------------------------------------------------------------------------

interface RecordingSink extends FrameSink {
  readonly writes: string[];
}

function recordingSink(signals: { isTTY?: boolean; rows?: number } = {}): RecordingSink {
  const writes: string[] = [];
  return {
    writes,
    isTTY: signals.isTTY ?? false,
    rows: signals.rows ?? 0,
    write(text: string) {
      writes.push(text);
    },
  };
}

interface RunOptions {
  readonly fen?: string;
  /**
   * The game itself, when the CALLER must still hold it after the run. `A9b`'s loop rethrows, so its
   * run has no `RunResult` to read the repaired position out of.
   */
  readonly history?: GameHistory;
  readonly humanColour?: "white" | "black";
  readonly script?: readonly string[];
  /** Overrides the coordinate reader, exactly as `engine` overrides the scripted engine. */
  readonly input?: InputSeam;
  readonly engine?: EngineSeam;
  /** Resolve the engine seam on a LATER MACROTASK — `A15`'s asynchronous-by-contract shape. */
  readonly delayEngine?: boolean;
  readonly shape?: Shape;
  readonly sink?: RecordingSink;
  /**
   * Fires on every RENDER-SEAM call. `RunResult.frames` already counts them, but a run that RETHROWS
   * never produces a `RunResult` — so `A9b` (iv) and `A10b` (v), which bound the render calls made
   * between a throw and the rethrow, have no other way to count them.
   */
  readonly onRender?: () => void;
}

interface RunResult {
  readonly outcome: LoopOutcome;
  readonly history: GameHistory;
  /** COPIES of what the seam returned, so a loop that mutates a frame in place is caught by `A19` (c). */
  readonly frames: readonly string[][];
  readonly thinkingFlags: readonly boolean[];
  readonly statuses: readonly GameStatus[];
  /** `frame` / `input` / `engine`, in order — the actor sequence `A1b` and `A7b` assert on. */
  readonly events: readonly string[];
  readonly sink: RecordingSink;
}

async function run(options: RunOptions = {}): Promise<RunResult> {
  const history = options.history ?? newGame(options.fen ?? START_FEN);
  const scripted = scriptedSeams(options.script ?? []);
  const seam = panelSeam(options.shape ?? SHAPE_A);
  const sink = options.sink ?? recordingSink();
  const inputSeam = options.input ?? scripted.input;
  const engineSeam = options.engine ?? scripted.engine;

  const frames: string[][] = [];
  const thinkingFlags: boolean[] = [];
  const statuses: GameStatus[] = [];
  const events: string[] = [];

  const render: RenderSeam = (h, status, thinking, messages) => {
    options.onRender?.();
    const frame = seam(h, status, thinking, messages);
    frames.push([...frame]);
    thinkingFlags.push(thinking);
    statuses.push(status);
    events.push("frame");
    return frame;
  };
  const input: InputSeam = (h) => {
    events.push("input");
    return inputSeam(h);
  };
  const engine: EngineSeam = async (h) => {
    events.push("engine");
    if (options.delayEngine === true) await macrotask();
    return engineSeam(h);
  };

  const outcome = await runTurnLoop({
    history,
    humanColour: options.humanColour ?? "white",
    render,
    input,
    engine,
    sink,
  });

  return { outcome, history, frames, thinkingFlags, statuses, events, sink };
}

/** The frames the WRITER received — not the ones the seam returned. `A19` (c) needs both. */
const writtenFrames = (): readonly string[][] =>
  vi
    .mocked(vi.mocked(beginFrameSession).mock.results[0]?.value as FrameWriter)
    .mock.calls.map(([frame]) => [...frame]);

/** The `height` argument `beginFrameSession` was given. `A19` (b) needs the argument itself. */
const sessionHeight = (): number => vi.mocked(beginFrameSession).mock.calls[0]?.[1] as number;

const actorsIn = (events: readonly string[]): string[] =>
  events.filter((event) => event !== "frame");

/** The two message rows: the frame's last rows before the reserved prompt row. */
const messageRegionOf = (frame: readonly string[]): string[] =>
  frame.slice(-(MESSAGE_ROWS + PROMPT_ROWS), -PROMPT_ROWS).map((row) => row.trimEnd());

const lastFrame = (frames: readonly string[][]): string[] => frames[frames.length - 1] as string[];

/**
 * The board rows of a frame, unpadded. `assembleFrame` pads every row to the widest panel row, and
 * the stub panels can be wider than the board's 18, so the comparison is made against the geometry
 * `renderBoard` delivers rather than against a restated width.
 */
const boardRegionOf = (frame: readonly string[], rows: number): string[] =>
  frame.slice(0, rows).map((row) => row.trimEnd());

/** Rebuilds a position with the CORE's primitives — the independent oracle, never the loop's. */
function replay(history: GameHistory): Position {
  const position = parseFen(history.initialFen);
  for (const move of history.moves) makeMove(position, move);
  return position;
}

const boardOf = (position: Position): string[] => renderBoard(position, "unicode", "white-bottom");

/** The number of positions the counts map holds. A BARE call reads -1 and fails loudly. */
const countsTotal = (counts: ReadonlyMap<bigint, number> | undefined): number =>
  counts === undefined ? -1 : [...counts.values()].reduce((sum, count) => sum + count, 0);

const derivesMade = (): number => vi.mocked(gameStatus).mock.calls.length;

beforeEach(() => vi.clearAllMocks());

// ---------------------------------------------------------------------------
// The eighteen scripted rows — one table-driven file, `N8-LANE`'s own instruction. Rows 15-18 added
// four rows and ZERO new test FILES, which is the count `N8-LANE` actually binds.
// ---------------------------------------------------------------------------

interface Row extends RunOptions {
  readonly n: number;
  readonly name: string;
  readonly result: FinalResult | null;
  readonly reason: TerminalReason | null;
  readonly frameCount: number;
}

/**
 * Throws from INSIDE a `makeMove` bracket, so the live object is left ONE PLY AHEAD. The fixture
 * shape is part of `A9` because without it the criterion is unfalsifiable: a stub that throws
 * before touching the board never corrupts anything, so a loop that repairs nothing passes.
 */
function midBracketThrowingEngine(record: (fen: string) => void): EngineSeam {
  return async (history) => {
    makeMove(history.position, legalMoves(history.position)[0] as Move);
    record(toFen(history.position));
    throw new Error("search exploded inside the bracket");
  };
}

/**
 * `A9b`'s fixture — the INPUT seam's twin of the stub above, and the same shape deliberately rather
 * than incidentally: a real parser filters `legalMoves` to reject an illegal move (the delivered
 * coordinate reader does it at `movesNamed` above), and `legalMoves` runs `makeMove`/`unmakeMove` on
 * the LIVE borrowed object (`legal.ts:42-53`), so a throw mid-filter leaves the position one ply
 * ahead. A stub that threw BEFORE touching the board corrupts nothing, and a loop that repairs
 * nothing would pass against it — which is `[D10]`'s reason, applied to the input side.
 *
 * The error is a module constant so the caller can assert IDENTITY: a loop that catches and rethrows
 * an exception of its own making is a loop that has decided a parser bug is the loop's to describe.
 */
const PARSER_EXPLODED = new Error("parser exploded inside the bracket");

function midBracketThrowingInput(record: (fen: string) => void): InputSeam {
  return async (history) => {
    makeMove(history.position, legalMoves(history.position)[0] as Move);
    record(toFen(history.position));
    throw PARSER_EXPLODED;
  };
}

/**
 * A move no generator produced: a1-a8 is blocked at the start position by White's own pawn and rook
 * traffic. ONE constant behind both foreign-move fixtures, because `A10` and `A10b` are the same
 * violation arriving through two different seams and a second hand-coded `Move` is how the two rows
 * drift apart.
 */
const FOREIGN_MOVE: Move = {
  from: parseSquareName("a1"),
  to: parseSquareName("a8"),
  piece: ROOK,
  captured: EMPTY,
  flags: FLAG_NONE,
  promotion: EMPTY,
};

/** `A10`'s fixture — the ENGINE seam returns it, and the loop terminates with `engine-failure`. */
const foreignEngine: EngineSeam = async () => FOREIGN_MOVE;

/**
 * `A10b`'s fixture — the INPUT seam returns the same foreign move as a `{kind: "move"}` outcome, and
 * the loop THROWS. Not `rejected`: a `{kind: "move"}` that is not legal is a PARSER BUG, and a real
 * parser reports the user's illegal move as `rejected` itself.
 *
 * `record` fires immediately before the outcome is returned, so a caller can snapshot what has
 * reached the writer and the sink at that instant — the only way to bound clause (v)'s window when
 * the run REJECTS and there is no `RunResult` to read.
 */
function foreignInput(record: () => void): InputSeam {
  return async () => {
    record();
    return { kind: "move", move: FOREIGN_MOVE };
  };
}

/** `A8b`'s fixture — the prompt-driven `game-over`, carrying the seam's OWN result and reason. */
const gameOverInput =
  (result: FinalResult, reason: TerminalReason): InputSeam =>
  async () => ({ kind: "game-over", result, reason });

const TABLE: readonly Row[] = [
  {
    n: 1,
    name: "mate line (Fool's mate)",
    fen: FOOLS_MATE_FEN,
    humanColour: "black",
    script: ["d8h4"],
    result: "black-wins",
    reason: "checkmate",
    frameCount: 2,
  },
  {
    n: 2,
    name: "stalemate line",
    fen: STALEMATE_FEN,
    script: ["f1f7"],
    result: "draw",
    reason: "stalemate",
    frameCount: 2,
  },
  {
    n: 3,
    name: "insufficient-material line",
    fen: THIN_MATERIAL_FEN,
    script: ["b2c1"],
    result: "draw",
    reason: "insufficient-material",
    frameCount: 2,
  },
  {
    n: 4,
    name: "fivefold repetition, on the FIFTH occurrence",
    script: cycles(4),
    result: "draw",
    reason: "fivefold-repetition",
    frameCount: 17,
  },
  {
    n: 5,
    name: "75-move line",
    fen: AT_149_FEN,
    script: ["g1g2"],
    result: "draw",
    reason: "seventy-five-move",
    frameCount: 2,
  },
  {
    n: 6,
    name: "THIRD repetition, play on",
    script: cycles(2),
    result: null,
    reason: null,
    frameCount: 9,
  },
  {
    n: 7,
    name: "halfmove clock 100, play on",
    fen: AT_99_FEN,
    humanColour: "black",
    script: ["g1g2"],
    result: null,
    reason: null,
    frameCount: 2,
  },
  {
    n: 8,
    name: "rejected input",
    script: ["zzzz"],
    result: null,
    reason: null,
    frameCount: 2,
  },
  {
    n: 9,
    name: "ambiguous input (a promotion)",
    fen: PROMOTION_FEN,
    script: ["e7e8"],
    result: null,
    reason: null,
    frameCount: 2,
  },
  {
    n: 10,
    name: "`board` redraw",
    script: ["board"],
    result: null,
    reason: null,
    frameCount: 2,
  },
  { n: 11, name: "EOF", script: [], result: null, reason: null, frameCount: 1 },
  {
    n: 12,
    name: "engine throw inside a `makeMove` bracket",
    humanColour: "black",
    engine: midBracketThrowingEngine(() => undefined),
    result: null,
    reason: "engine-threw",
    frameCount: 1,
  },
  {
    n: 13,
    name: "engine returns a foreign move",
    humanColour: "black",
    engine: foreignEngine,
    result: null,
    reason: "engine-failure",
    frameCount: 1,
  },
  // Rows 15 and 16 are APPENDED rather than inserted, and that is load-bearing: `A12`'s enumeration
  // guard reads `TABLE.slice(0, 5)`, so the five named automatic fixtures must stay at the front.
  // Row 16 is a SECOND `insufficient-material` row and takes nothing from row 3 — `A12` asks the
  // table to DECLARE a row for each of the five, which is an existence check and not a uniqueness
  // check. A later hop rewriting it as "exactly one row per value" would break this, and must not.
  {
    n: 15,
    name: "prompt-driven `game-over` (the seam's own result and reason)",
    input: gameOverInput("draw", "resignation"),
    result: "draw",
    reason: "resignation",
    frameCount: 1,
  },
  {
    n: 16,
    name: "already-terminal START — K+N vs K, six legal moves available",
    fen: DEAD_MATERIAL_FEN,
    script: [],
    result: "draw",
    reason: "insufficient-material",
    frameCount: 1,
  },
];

describe("ABC-019 — the eighteen scripted rows: fifteen with an exact reason and an exact frame count, two that throw, and row 18 deferred to `ABC-027`", () => {
  for (const row of TABLE) {
    it(`row ${row.n} — ${row.name}`, async () => {
      const { outcome, frames } = await run(row);

      expect(outcome).toEqual({ result: row.result, reason: row.reason, exitCode: 0 });
      expect(frames).toHaveLength(row.frameCount);
    });
  }

  // Row 14 is not a `TABLE` row because its expectation is neither of the two columns every other
  // row has: the loop RETHROWS, so there is no `LoopOutcome` to compare and `A9b` names no frame
  // count. Giving it a `result` / `reason` / `frameCount` no assertion reads would be three fields
  // of fiction. It sits here so the fourteen rows are enumerated in one place; the criterion's three
  // clauses are asserted by the `A9b` test, exactly as row 12 pairs with `A9`.
  it("row 14 — INPUT seam throws inside a `makeMove` bracket", async () => {
    await expect(run({ input: midBracketThrowingInput(() => undefined) })).rejects.toBe(
      PARSER_EXPLODED,
    );
  });

  // Row 17 is the second row that is not a `TABLE` row, for row 14's reason: the loop RETHROWS, so
  // there is no `LoopOutcome` to put in a `result` / `reason` column. Its five clauses are asserted
  // by the `A10b` test, exactly as row 13 pairs with `A10` and row 14 with `A9b`.
  it("row 17 — INPUT seam returns a move not in `legalMoves`", async () => {
    const history = newGame(START_FEN);

    await expect(run({ history, input: foreignInput(() => undefined) })).rejects.toThrow(
      "not in `legalMoves`",
    );
    // Not applied: the board the caller still holds is the one it handed in.
    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(START_FEN);
  });

  // ROW 18 IS DEFERRED AND IS DELIBERATELY NOT WRITTEN HERE. `A20` states in its own words that it
  // CANNOT BE SATISFIED until `ABC-027` merges: `ADR-0010` clause 1 puts the production change in
  // `src/frame.ts`'s in-place writer, which is `ABC-027`'s module and which THIS TICKET DOES NOT
  // OPEN. It is written at the rebase, riding with `ADR-0009` clause 9f's real-panel re-gate.
  // Writing it now would turn this branch's gate red for a defect in another ticket's module — and
  // writing it as a SKIPPED test would breach the zero-skip gate, so neither is done.
});

// ---------------------------------------------------------------------------
// The twenty-seven acceptance criteria, in the ticket's order. `A17`'s timing half is out of tree
// and `A20` is blocked on `ABC-027` — see the file header; neither is silently absent.
// ---------------------------------------------------------------------------

describe("ABC-019 acceptance", () => {
  it("A1 — the human is BLACK, so the engine acts first and no prompt precedes it", async () => {
    const { events } = await run({ humanColour: "black", engine: seededEngine(ENGINE_SEED) });

    // The actor SEQUENCE, not only the prompt count: a loop dispatching `ply % 2 === 1` opens with
    // the engine whatever the colour, and satisfies a prompt-count clause verbatim.
    expect(actorsIn(events)).toEqual(["engine", "input"]);
    expect(events[0]).toBe("frame");
  });

  it("A1b — the human is WHITE, so the input seam acts first and no engine call precedes it", async () => {
    const { events } = await run({
      humanColour: "white",
      script: ["g1f3"],
      engine: seededEngine(ENGINE_SEED),
    });

    expect(actorsIn(events)).toEqual(["input", "engine", "input"]);
  });

  it("A2 — one full move renders THREE frames, and the cadence is 1 + plies + non-advancing", async () => {
    const full = await run({ script: ["g1f3", "g8f6"] });

    // The initial position, the position after White's ply, and the position after Black's ply. A
    // build that renders one frame per ply prompts the human before any board has been shown.
    expect(full.frames).toHaveLength(3);
    expect(full.history.moves).toHaveLength(2);

    const rejected = await run({ script: ["zzzz", "g1f3", "g8f6"] });
    expect(rejected.frames).toHaveLength(4);
    expect(rejected.history.moves).toHaveLength(2);

    const busy = await run({ script: ["zzzz", "board", "g1f3", "g8f6"] });
    expect(busy.frames).toHaveLength(1 + 2 + 2);
  });

  it("A3 — append then derive then evaluate then render, through `gameStatusOf` every time", async () => {
    const { history } = await run({ script: ["g1f3", "g8f6"] });
    const plies = history.moves.length;

    const appended = vi.mocked(playMove).mock.invocationCallOrder;
    const evaluated = vi.mocked(gameStatus).mock.invocationCallOrder;
    const supplied = vi.mocked(gameStatusOf).mock.invocationCallOrder;

    // The initial evaluation is transition 1 → 2 and happens before the first frame; every ply then
    // appends before the evaluation that follows it.
    expect(evaluated).toHaveLength(plies + 1);
    for (let ply = 0; ply < plies; ply++) {
      expect(appended[ply] as number).toBeLessThan(evaluated[ply + 1] as number);
      expect(evaluated[ply] as number).toBeLessThan(appended[ply] as number);
    }

    // Every evaluation goes through the ADR-0002 clause-4 single supplier, and the loop derives
    // nothing on its own — so no `gameStatus` call is bare and none is handed a foreign map.
    expect(supplied).toHaveLength(plies + 1);
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);

    // The map is THIS game's: after `n` plies the history holds `n + 1` positions. An EMPTY map
    // satisfies "carries a counts map" at every call site and reports `in-progress` on a fivefold.
    vi.mocked(gameStatus).mock.calls.forEach(([, counts], call) => {
      expect(countsTotal(counts)).toBe(call + 1);
    });
  });

  it("A3b — one derive per ply, and ZERO on a non-advancing prompt outcome", async () => {
    const { history } = await run({ script: ["zzzz", "board", "e2e4", "e7e5"] });

    expect(history.moves).toHaveLength(2);
    // Two plies plus the mandatory initial evaluation, and the two non-advancing outcomes between
    // them add nothing. This is a COUNT and not a clock: at 120 plies a two-derives-per-ply build
    // reads 93.58 µs against a 100 µs bar and MEETS it. The spy cannot miss it.
    expect(derivesMade()).toBe(3);

    vi.clearAllMocks();
    const idle = await run({ script: ["zzzz", "board", "qqqq"] });
    expect(idle.history.moves).toHaveLength(0);
    expect(derivesMade()).toBe(1);

    // ROW 16 — the `+ 1` at `N = 0`, which is the strongest form of (a) and the witness this clause
    // claimed and did not have until `[D43]`. From an ALREADY-TERMINAL start the loop evaluates
    // once, renders once and acts NEVER. A build whose exit test does not run on the first pass
    // still reads `N + 1` on every other row: it prompts the human, who then MOVES, in a game the
    // rules core has already ended.
    vi.clearAllMocks();
    const deadOnArrival = newGame(DEAD_MATERIAL_FEN);
    // Dead by material, but NOT stuck — a fixture with no legal move is a stalemate fixture and
    // exercises a different branch entirely.
    expect(legalMoves(deadOnArrival.position)).toHaveLength(6);

    const terminalStart = await run({ history: deadOnArrival });
    expect(derivesMade()).toBe(1);
    expect(terminalStart.history.moves).toHaveLength(0);
    expect(terminalStart.frames).toHaveLength(1);
    expect(actorsIn(terminalStart.events)).toEqual([]);
    expect(terminalStart.outcome).toEqual({
      result: "draw",
      reason: "insufficient-material",
      exitCode: 0,
    });
  });

  it("A4 — the third occurrence is claimable ON THAT PLY, the fifth ends it ON THAT PLY", async () => {
    const third = await run({ script: cycles(2) });

    expect(third.statuses[7]?.claimable).toBeUndefined();
    expect(third.statuses[8]).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["threefold-repetition"] },
    });
    expect(third.outcome.reason).toBeNull();

    const fifth = await run({ script: cycles(4) });
    expect(fifth.statuses[15]?.result).toBe("in-progress");
    expect(fifth.statuses[16]).toEqual({ result: "draw", reason: "fivefold-repetition" });
    expect(fifth.history.moves).toHaveLength(16);
  });

  it("A5 — `rejected` and `ambiguous` advance no ply, re-evaluate nothing, and reach the message region", async () => {
    const before = toFen(parseFen(START_FEN));
    const rejected = await run({ script: ["zzzz"] });

    expect(rejected.history.moves).toHaveLength(0);
    expect(toFen(rejected.history.position)).toBe(before);
    expect(derivesMade()).toBe(1); // the initial evaluation only — the spy reads 0 for the outcome
    expect(messageRegionOf(rejected.frames[1] as string[])).toContain("not a move: zzzz");
    // The prompt is re-issued AFTER the frame carrying the rejection.
    expect(rejected.events).toEqual(["frame", "input", "frame", "input"]);

    vi.clearAllMocks();
    const ambiguous = await run({ fen: PROMOTION_FEN, script: ["e7e8"] });
    expect(ambiguous.history.moves).toHaveLength(0);
    expect(messageRegionOf(ambiguous.frames[1] as string[]).join(" ")).toContain(
      "e7e8q e7e8r e7e8b e7e8n",
    );
  });

  it("A5b — a non-advancing outcome's message items belong to ONE frame and leave with it", async () => {
    // All three outcomes that carry items, because `A5` and `A6` assert only that an item ARRIVES —
    // nothing in twenty-three criteria said it LEAVES. A build that never clears repeats a rejection
    // the player has already fixed on EVERY remaining frame of the game.
    const cases = [
      {
        name: "rejected",
        script: ["zzzz", "g1f3", "g8f6"],
        fen: START_FEN,
        item: "not a move: zzzz",
      },
      { name: "ambiguous", script: ["e7e8", "a1b1", "h8g8"], fen: PROMOTION_FEN, item: "e7e8q" },
      { name: "command", script: ["board", "e2e4", "e7e5"], fen: START_FEN, item: "board redrawn" },
    ] as const;

    for (const { name, script, fen, item } of cases) {
      const { frames } = await run({ fen, script });

      // Frame 2 carries them — this is `A5`/`A6`'s half, restated here so the tail assertion below
      // cannot pass against a build that never delivered the items at all.
      expect(messageRegionOf(frames[1] as string[]).join(" ")).toContain(item);

      // At least TWO further frames, so a build that never clears is red on the whole tail rather
      // than on a single frame — and so this fixture cannot silently decay into a one-frame tail.
      const tail = frames.slice(2);
      expect(tail.length, `${name}: needs a tail of at least two frames`).toBeGreaterThanOrEqual(2);
      for (const frame of tail) expect(messageRegionOf(frame).join("")).toBe("");
    }
  });

  it("A6 — a non-mutating command re-emits a frame, advances no ply and re-evaluates nothing", async () => {
    const { frames, history, events } = await run({ script: ["board"] });

    expect(frames).toHaveLength(2);
    expect(history.moves).toHaveLength(0);
    expect(derivesMade()).toBe(1);
    expect(events).toEqual(["frame", "input", "frame", "input"]);
    // The command's items are NOT optional — `## Scope` groups `board` with the three non-advancing
    // outcomes that CARRY A MESSAGE, and a build that drops them for `kind === "command"` alone was
    // green on all twenty-three criteria.
    expect(messageRegionOf(frames[1] as string[])).toContain("board redrawn");
  });

  it("A7 — the final frame is the MATED position and the winner is `gameStatus`'s own result", async () => {
    const { outcome, frames, history } = await run({
      fen: FOOLS_MATE_FEN,
      humanColour: "black",
      script: ["d8h4"],
    });

    const mated = boardOf(replay(history));
    expect(boardRegionOf(lastFrame(frames), mated.length)).toEqual(mated);
    // Black delivered the mate. A loop computing `blackToMove ? "black-wins" : "white-wins"`
    // satisfies every other clause here and reports the LOSER as the winner.
    expect(outcome).toEqual({ result: "black-wins", reason: "checkmate", exitCode: 0 });
  });

  it("A7b — neither seam is called after the terminal status is computed", async () => {
    for (const script of [cycles(4), ["d8h4"]]) {
      const mate = script.length === 1;
      const { events, history } = await run({
        fen: mate ? FOOLS_MATE_FEN : START_FEN,
        humanColour: mate ? "black" : "white",
        script,
      });

      // The exit test sits between render and act. With it at the top of the loop `terminal` is one
      // ply stale: the mated frame renders, the reason is recorded, and the loop then invokes the
      // engine seam on a checkmated position where `legalMoves` returns `[]` — with `A7` green.
      expect(events[events.length - 1]).toBe("frame");
      expect(actorsIn(events)).toHaveLength(history.moves.length);
    }
  });

  it("A8 — stdin ends: one notice, no further act, exit 0, and NO terminal result", async () => {
    const { outcome, sink, events, frames } = await run({ script: ["e2e4", "e7e5"] });

    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
    const notice = sink.writes[sink.writes.length - 1] as string;
    expect(notice).toBe(`${INPUT_ENDED_NOTICE}\n`);
    expect(notice.split("\n").filter((line) => line !== "")).toHaveLength(1);
    // The run ends ON the prompt that hit end-of-input: no further prompt, no engine call, no frame.
    expect(events[events.length - 1]).toBe("input");
    expect(frames).toHaveLength(3);
  });

  it("A8b — the prompt-driven `game-over` returns the seam's OWN result and reason, unaltered", async () => {
    // (i) — TWO distinct pairs, so a build substituting a constant is RED rather than lucky. One
    // build discarded the seam's `reason` and substituted `"resignation"`: a player who claimed a
    // draw was told they resigned, and the whole branch was unexecuted by the suite.
    const pairs = [
      { result: "draw", reason: "fifty-move" },
      { result: "black-wins", reason: "resignation" },
    ] as const;

    for (const { result, reason } of pairs) {
      const { outcome, frames, events, sink } = await run({ input: gameOverInput(result, reason) });

      expect(outcome).toEqual({ result, reason, exitCode: 0 });
      // (ii) — no further frame, per `A2`: the only frame the player saw is the one that preceded
      // the prompt, and no terminal `GameStatus` exists on this edge to render a second.
      expect(frames).toHaveLength(1);
      // (iii) — neither seam is called afterwards. `A7b`'s form on the edge `A7b` cannot reach,
      // because no terminal status was ever computed here.
      expect(events).toEqual(["frame", "input"]);
      // (iv) — never byte-identical to `A8`'s end-of-input. A build reporting this outcome as EOF
      // was green on all 717 tests, and it is the exact failure `A9b` (iii) exists to forbid,
      // arriving through the one door nobody had looked at.
      expect(outcome).not.toEqual({ result: null, reason: null, exitCode: 0 });
      expect(sink.writes).not.toContain(`${INPUT_ENDED_NOTICE}\n`);
    }
  });

  it("A9 — a mid-bracket throw is repaired by replay, and the loop never continues on the object", async () => {
    const corrupted: string[] = [];
    const { outcome, history } = await run({
      humanColour: "black",
      engine: midBracketThrowingEngine((fen) => corrupted.push(fen)),
    });

    const oracle = toFen(replay(history));
    // The fixture really did corrupt the live object — otherwise a loop that repairs nothing passes.
    expect(corrupted[0]).not.toBe(oracle);
    expect(toFen(history.position)).toBe(oracle);
    expect(history.moves).toHaveLength(0);
    expect(outcome).toEqual({ result: null, reason: "engine-threw", exitCode: 0 });
  });

  it("A9b — an INPUT-seam mid-bracket throw is repaired and then RETHROWN", async () => {
    const history = newGame(START_FEN);
    const corrupted: string[] = [];
    const sink = recordingSink();
    let renders = 0;
    // Snapshots taken AT THE THROW, which is the only way to bound clause (iv)'s window: the run
    // rethrows, so there is no `RunResult` to read the totals out of afterwards.
    let rendersAtThrow = -1;
    let writesAtThrow = -1;

    // ONE run, settled either way, so (ii) and (iii) are read off the same execution: a loop that
    // returns an outcome and a loop that throws are told apart by the value here.
    const settled: LoopOutcome | Error = await run({
      history,
      sink,
      onRender: () => {
        renders += 1;
      },
      input: midBracketThrowingInput((fen) => {
        corrupted.push(fen);
        rendersAtThrow = renders;
        writesAtThrow = sink.writes.length;
      }),
    }).then(
      (result) => result.outcome,
      (error: Error) => error,
    );

    // (i) — repaired by replay, exactly as `A9` requires of the engine side. The fixture really did
    // corrupt the live object, or a loop that repairs nothing would pass this.
    const oracle = toFen(replay(history));
    expect(corrupted[0]).not.toBe(oracle);
    expect(toFen(history.position)).toBe(oracle);
    expect(history.moves).toHaveLength(0);

    // (ii) — the exception propagates out of the loop, and it is the SAME exception: the loop owns
    // the repair and nothing else. `EPIC-003` owns the exception and `EPIC-006` catches it.
    expect(settled).toBe(PARSER_EXPLODED);

    // (iii) — no `LoopOutcome` at all. A quiet stop returns `{ result: null, reason: null,
    // exitCode: 0 }`, which is BYTE-IDENTICAL to `A8`'s end-of-input, so it would present a crashed
    // parser as a clean exit; this assertion is what tells the two apart.
    expect(settled).not.toEqual({ result: null, reason: null, exitCode: 0 });
    // and no eleventh terminal reason was invented to name it — `A14`'s enumeration is unchanged.
    expect(new Set(EVERY_TERMINAL_REASON).size).toBe(10);

    // (iv) — NOTHING REACHES THE PLAYER between the throw and the rethrow. Clauses (i)-(iii) bound
    // only what the CALLER sees. One build handed the MID-MUTATION position to the render seam and
    // wrote that frame before repairing, so the last board the player saw contained a ply that never
    // happened; another wrote `A8`'s notice and showed a clean exit for a crashed parser. Both were
    // green on all 717 tests.
    expect(rendersAtThrow).toBe(1); // the initial frame, and the window is genuinely open here
    expect(renders).toBe(rendersAtThrow);
    expect(sink.writes).toHaveLength(writesAtThrow);
    expect(sink.writes).not.toContain(`${INPUT_ENDED_NOTICE}\n`);
  });

  it("A10 — a foreign move is not applied, and its reason is no chess outcome", async () => {
    const { outcome, history } = await run({ humanColour: "black", engine: foreignEngine });

    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(START_FEN);
    expect(outcome).toEqual({ result: null, reason: "engine-failure", exitCode: 0 });
    // Distinct from every `EndReason`, so a result screen can never show an engine bug as a draw.
    expect(EVERY_END_REASON).not.toContain(outcome.reason);
    expect(outcome.result).toBeNull();
  });

  it("A10b — a foreign move from the INPUT seam is not applied either, and the loop THROWS", async () => {
    const history = newGame(START_FEN);
    const sink = recordingSink();
    let renders = 0;
    let rendersAtMove = -1;
    let writesAtMove = -1;

    const settled: LoopOutcome | Error = await run({
      history,
      sink,
      onRender: () => {
        renders += 1;
      },
      input: foreignInput(() => {
        rendersAtMove = renders;
        writesAtMove = sink.writes.length;
      }),
    }).then(
      (result) => result.outcome,
      (error: Error) => error,
    );

    // (i) — NOT APPLIED. Before this guard the loop played it: `moves.length` 1, and a FEN with the
    // white a1 rook gone from the board, White's queenside castling right lost and the halfmove
    // clock advanced — a position no legal move can reach.
    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(START_FEN);

    // (ii) — the exception propagates and the loop invents no reason: it is the loop's own error
    // because the fault is the SEAM's contract violation, not a value the seam threw.
    expect(settled).toBeInstanceOf(Error);
    expect((settled as Error).message).toContain("not in `legalMoves`");

    // (iii) — no `LoopOutcome` at all, so it can never be mistaken for `A8`'s end-of-input.
    expect(settled).not.toEqual({ result: null, reason: null, exitCode: 0 });
    expect(sink.writes).not.toContain(`${INPUT_ENDED_NOTICE}\n`);

    // (iv) — no new terminal-reason value, and `engine-failure` is NOT reused for an input-side
    // fault: nothing here reports a reason at all. `A14`'s enumeration is asserted unchanged.
    expect(settled).not.toHaveProperty("reason");
    expect(new Set(EVERY_TERMINAL_REASON).size).toBe(10);

    // (v) — zero render calls and zero sink writes between receiving the move and the throw,
    // exactly as `A9b` (iv) requires of the other throw path.
    expect(rendersAtMove).toBe(1);
    expect(renders).toBe(rendersAtMove);
    expect(sink.writes).toHaveLength(writesAtMove);
  });

  it("A11 — the thinking flag is set only in the thinking state, and the row count never moves", async () => {
    const { thinkingFlags, frames } = await run({ script: ["g1f3", "g8f6"] });

    // Frame 2 is the one the player watches while the engine has the move.
    expect(thinkingFlags).toEqual([false, true, false]);
    expect(new Set(frames.map((frame) => frame.length)).size).toBe(1);

    // THE NEGATIVE HALF ON A TERMINAL FRAME — the one state where the flag can be wrong and the one
    // this criterion's "given any other state, then it is clear" reaches in its own words. Every
    // "other state" above is `awaiting-human`, so dropping the `in-progress` guard from the flag
    // leaves all three assertions green while LIGHTING THE THINKING INDICATOR ON THE MATED FINAL
    // FRAME: the game is over and the screen says the engine is still moving. `A7`'s own mate
    // fixture, already in this file.
    const mated = await run({ fen: FOOLS_MATE_FEN, humanColour: "black", script: ["d8h4"] });
    expect(mated.thinkingFlags).toEqual([false, false]);
    expect(new Set(mated.frames.map((frame) => frame.length)).size).toBe(1);
  });

  it("A12 — one fixture per AUTOMATIC terminal value, and no value is missing from the table", async () => {
    // The rows above RUN these; this pins that the table has one row for each of the five, because a
    // table whose rows are not enumerated is a table that can be one row short and still green.
    expect(TABLE.slice(0, 5).map((row) => row.reason)).toEqual(EVERY_END_REASON);
    expect(EVERY_END_REASON).toHaveLength(5);
  });

  it("A13 — a claimable draw does NOT stop the loop, and the claim reaches the render seam", async () => {
    const repetition = await run({ script: cycles(2) });
    expect(repetition.statuses[8]?.claimable).toEqual({
      by: "white",
      draws: ["threefold-repetition"],
    });
    expect(repetition.history.moves).toHaveLength(8);
    expect(repetition.outcome.reason).toBeNull();

    const clock = await run({ fen: AT_99_FEN, humanColour: "black", script: ["g1g2"] });
    // The clause that stops this passing for the wrong reason: a loop supplying an EMPTY counts map
    // also "does not stop", because it never saw the repetition at all.
    expect(clock.statuses[1]?.claimable).toEqual({ by: "black", draws: ["fifty-move"] });
    expect(clock.outcome.reason).toBeNull();
  });

  it("A14 — the terminal-reason type admits, and is assignable from, all ten values", () => {
    // The annotation on `EVERY_TERMINAL_REASON` is the assertion and `tsc --noEmit` is where it runs;
    // the count here is what keeps a deleted value from passing silently.
    expect(new Set(EVERY_TERMINAL_REASON).size).toBe(10);
  });

  it("A15 — a seam resolving on a LATER MACROTASK gives an identical frame sequence and verdict", async () => {
    const script = await seededLine(6, ENGINE_SEED);
    const immediate = await run({ script });
    const delayed = await run({ script, delayEngine: true });

    // A loop that does not await reads a Promise where a Move belongs, which no generator produced,
    // so it terminates `engine-failure` — the verdict clause catches it.
    expect(delayed.outcome).toEqual(immediate.outcome);
    expect(delayed.frames).toEqual(immediate.frames);
    expect(delayed.history.moves.length).toBeGreaterThan(0);
    expect(delayed.history.moves).toEqual(immediate.history.moves);
  });

  it("A16 — a seam that mutates while suspended: the next frame is the position AT THAT MOMENT", async () => {
    let preSuspension = "";
    const searching: EngineSeam = async (history) => {
      const moves = legalMoves(history.position);
      preSuspension = toFen(history.position);
      // Descend on the LIVE object and stay suspended with the board mutated, as a real search does.
      const probe = moves[0] as Move;
      const undo = makeMove(history.position, probe);
      await macrotask();
      unmakeMove(history.position, probe, undo);
      return moves[moves.length - 1] as Move;
    };

    const { frames, history } = await run({ humanColour: "black", engine: searching });

    const now = boardOf(replay(history));
    const snapshot = boardOf(parseFen(preSuspension));
    expect(boardRegionOf(frames[1] as string[], now.length)).toEqual(now);
    expect(boardRegionOf(frames[1] as string[], now.length)).not.toEqual(snapshot);
  });

  it("A18 — TWO stub seams: neither at 3/8, one fits a 24-row TTY and one does not", async () => {
    const history = newGame(START_FEN);
    const status = gameStatusOf(history);
    const heightOf = (shape: Shape): number => panelSeam(shape)(history, status, false, []).length;

    for (const shape of [SHAPE_A, SHAPE_B]) {
      // (i) — the reference layout's numbers are what make a hardcoded height green HERE.
      expect(shape.statusRows).not.toBe(3);
      expect(shape.historyRows).not.toBe(8);
      expect(statusStub(status, false, shape.statusRows)).toHaveLength(shape.statusRows);
      expect(historyStub([], shape.historyRows)).toHaveLength(shape.historyRows);
    }

    expect(heightOf(SHAPE_A)).toBe(19); // (ii) — `H` <= 24
    expect(heightOf(SHAPE_B)).toBe(25); // (iii) — `H` >= 25

    // (iv) — and `beginFrameSession` therefore chooses differently, observed on the emitted stream.
    const inPlace = await run({
      shape: SHAPE_A,
      script: ["board"],
      sink: recordingSink({ isTTY: true, rows: 24 }),
    });
    expect(inPlace.sink.writes[0]?.startsWith("\x1b[H")).toBe(true);

    const appended = await run({
      shape: SHAPE_B,
      script: ["board"],
      sink: recordingSink({ isTTY: true, rows: 24 }),
    });
    expect(appended.sink.writes[0]?.startsWith("\x1b[H")).toBe(false);
  });

  for (const shape of [SHAPE_A, SHAPE_B]) {
    it(`A19 — one session at the first frame's own height, frames untouched (shape ${shape.name})`, async () => {
      const { frames } = await run({
        shape,
        script: ["zzzz", "g1f3", "g8f6"],
        sink: recordingSink({ isTTY: true, rows: 24 }),
      });

      // (a) — a per-frame session re-chooses the strategy `frame.ts`'s header rests on choosing once,
      // and passes (b), (c) and (d).
      expect(vi.mocked(beginFrameSession)).toHaveBeenCalledTimes(1);
      // (b) — the height is the FIRST frame's own row count, never a literal and never `frameHeight`.
      expect(sessionHeight()).toBe((frames[0] as string[]).length);
      // (c) — the frames written are the seam's frames, unmodified. Without it, (d) is a tautology:
      // a loop that derives its height and then pads every frame to it satisfies (d) while eating a row.
      expect(writtenFrames()).toEqual(frames);
      // (d) — `assembleFrame` does not normalise height, so this is a real assertion that can fail.
      for (const frame of writtenFrames()) expect(frame).toHaveLength(sessionHeight());
    });
  }
});
