/**
 * `ABC-019`'s twenty-seven acceptance criteria, plus the eighteen scripted rows its `## Test notes`
 * enumerate. The loop is testable end to end TODAY, with no parser and no engine, because both
 * stubs are built from merged code — that is the point of the stubs.
 *
 * ONE OF THE TWENTY-SEVEN IS NOT ASSERTED HERE, and it is named rather than left as a gap. `A17`'s
 * timing half is produced OUT OF TREE by the instrument that criterion names, because a number
 * produced inside `vitest` would be a different measurement wearing its name.
 *
 * `A20` — and `## Test notes` row 18 with it — IS WRITTEN NOW, at the rebase and riding with
 * `ADR-0009` clause 9f's real-panel re-gate, exactly where the ticket said it would be written. It
 * could not be SATISFIED before `ABC-027` merged, because `ADR-0010` clause 1 put its production
 * change in `src/frame.ts`'s in-place writer — a module THIS TICKET STILL DOES NOT OPEN and which is
 * merged on this tip. That the criterion asserts something was measured at this hop rather than
 * assumed, and OUT OF TREE because the merged writer is not this ticket's to edit: with that
 * writer's per-row `\x1b[K` stripped from the byte stream — the pre-`ABC-027` writer, byte for byte
 * — FOUR of this run's five redraws go RED at both screen widths. The wrong build is not bought as a
 * test here for `A19` (c)'s recorded reason: it would assert a failure of the CRITERION rather than
 * of the loop, and it would spend a `N8-LANE` file to do it.
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
 * AND THE REAL PANELS ARE HERE TOO, ADDED TO THOSE TWO SHAPES AND NOT REPLACING THEM (`[D51]` (2)).
 * Both are merged on this tip, so `ADR-0009` clause 9f's re-gate runs the loop through the real
 * `renderStatusPanel` and the real `renderHistory` below — the real pair IS 3/8, which is exactly
 * what clause (i) forbids a STUB from being, and a real-panels-only suite assembles to `H` = 23 and
 * would never take the append branch once. Importing the two panels FROM A TEST FILE is exit 0 now
 * that both exist (`[D50]`), and it gives the loop no import edge of its own: `src/turn-loop.ts`
 * imports neither panel and reads neither constant, which is `[C9-3]` and is a rule rather than an
 * accident.
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
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
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
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import type {
  EngineSeam,
  FinalResult,
  InputSeam,
  LoopOutcome,
  PromptOutcome,
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
    // `ABC-021` opened the FIRST production import edge from the loop to `keyHistory`, and until
    // this spy existed that edge was the one derive door NEITHER standing bar could see: a build
    // calling `keyHistory` once per ply reads `repetitionCounts` at 0 and `gameStatus` at
    // `plies + 1` — both bars' exact green values — while paying a second `O(plies)` replay a ply.
    // Measured: that build passes 814/814 unedited. Spied here, it is caught by `A8` below.
    keyHistory: vi.fn(actual.keyHistory),
    playMove: vi.fn(actual.playMove),
    repetitionCounts: vi.fn(actual.repetitionCounts),
  };
});

const { assembleFrame, beginFrameSession, MESSAGE_ROWS, PROMPT_ROWS } = await import("./frame.ts");
const { gameStatus } = await import("./gameend.ts");
const { gameStatusOf, keyHistory, newGame, playMove, repetitionCounts } = await import(
  "./history.ts"
);
const { INPUT_ENDED_NOTICE, QUIT_NOTICE, runTurnLoop } = await import("./turn-loop.ts");

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
 * `A20`'s anchor — row 18. The halfmove clock is at `FIFTY_MOVE_PLIES`, so the status the LOOP
 * evaluates carries `claimable`, the REAL status panel's third row spends 32 columns on
 * `White may claim: fifty-move rule`, and the first frame is 45 columns wide. The first ply is a
 * PAWN move: the clock resets, the claim cell goes, and the frame NARROWS to 22 — the widening and
 * the narrowing both come from a PANEL row, which is the fixture rule `## Test notes` states,
 * because `W` is the max over the panel rows ONLY and a fixture narrowing via `messages` narrows
 * nothing at all (`src/frame.ts:176-179`).
 *
 * Measured at this hop against merged `src/`: widths 45, 22, 23, 27, 24 over five frames — TWO
 * narrowings, and the second one (the check on ply 3 clearing) is not the first redraw, so
 * "after EVERY redraw" is not satisfiable by looking only at the frame after the narrowing.
 */
const FIFTY_MOVE_ANCHOR_FEN = "7k/8/8/8/8/8/P7/K5R1 w - - 100 60";

/**
 * The knight round trip. Each 4-ply cycle returns to the EXACT start position, so `n` cycles make
 * `n + 1` occurrences. Knights and not pawns: a repeated line must never set an en-passant square,
 * which `ABC-011` would otherwise hash into the key and fail these rows for a reason not this loop's.
 */
const CYCLE = ["g1f3", "g8f6", "f3g1", "f6g8"] as const;
const cycles = (count: number): string[] => Array.from({ length: count }, () => [...CYCLE]).flat();

/**
 * `ABC-021`'s acceptance line, which is `ABC-020` `A1`'s position (`gameend.test.ts:144`) — the ONE
 * fixture this ticket's first two criteria both run from. White to move has `Re8#` AND a shuffle, so
 * the same position offers two legal continuations with two different correct results, and neither
 * result can be reached by accident from the other.
 */
const SHUFFLE_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";

/**
 * `Kh1 Bb6 Kg1 Ba5` twice — eight plies back to the position's THIRD occurrence, with White to move
 * and the claim White's under FIDE 9.2.1. King and bishop only: a repeated line must never set an
 * en-passant square, which `ABC-011` hashes into the key (the instruction `ABC-012`, `ABC-019` and
 * `ABC-020` all carry). It is also irreversible-move-free, so the halfmove clock only ever climbs.
 */
const SHUFFLE_CYCLE = ["g1h1", "a5b6", "h1g1", "b6a5"] as const;
const shuffle = (cycleCount: number): string[] =>
  Array.from({ length: cycleCount }, () => [...SHUFFLE_CYCLE]).flat();

/** `SHUFFLE_FEN` at 9.3's claimable clock with an empty move list — `ABC-020` `A2`'s twin. */
const AT_100_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60";

/** Eight plies short of BOTH: the shuffle takes the clock 92 → 100 as it makes the third occurrence. */
const AT_92_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60";

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
 *
 * `claim` is ONE MORE LITERAL TOKEN beside `board` and the coordinates (`ABC-021` `## Test notes`),
 * and it is deliberately dumb: it neither derives a status nor decides whether a claim is available,
 * because a stub that adjudicated would test itself instead of the loop. `ABC-035` owns the real
 * verb's grammar and tolerance; this is the two-line seam that reaches transition 16.
 *
 * `quit`, `new` and `undo` are `ABC-120`'s three tokens, and they are TEST-SEAM TOKENS, NOT GRAMMAR:
 * the real words, `quit`'s confirmation and `undo`'s boundary refusal are `ABC-046`'s and
 * `ABC-102`'s (`ADR-0021` clauses 6 and 7). This seam maps each straight to its arm — `new` is a
 * take-back of every ply played so far and `undo` a take-back of two — and decides nothing.
 */
function scriptedSeams(script: readonly string[]): { input: InputSeam; engine: EngineSeam } {
  let cursor = 0;

  const input: InputSeam = async (history) => {
    if (cursor >= script.length) return { kind: "eof" };
    const token = script[cursor] as string;
    cursor += 1;
    if (token === "board") return { kind: "command", messages: ["board redrawn"] };
    if (token === "claim") return { kind: "claim" };
    if (token === "quit") return { kind: "quit" };
    if (token === "new") return { kind: "take-back", plies: history.moves.length, messages: [] };
    if (token === "undo") return { kind: "take-back", plies: 2, messages: ["took back 2"] };

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
  /**
   * The whole render seam, for the runs that drive the REAL panels rather than a stub shape
   * (`ADR-0009` clause 9f). One harness for both, because a second `run` is how the stub runs and
   * the real-panel run stop being comparable — and comparing them is the entire point of a re-gate.
   */
  readonly seam?: RenderSeam;
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
  const seam = options.seam ?? panelSeam(options.shape ?? SHAPE_A);
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

/** The frame's `W` — every row but the reserved prompt row is padded to it (`src/frame.ts:194`). */
const widthOf = (frame: readonly string[]): number =>
  frame.reduce((widest, row) => Math.max(widest, row.length), 0);

const rightTrimmed = (rows: readonly string[]): string[] => rows.map((row) => row.trimEnd());

// ---------------------------------------------------------------------------
// The REAL panels, and the screen `A20` replays into. `ADR-0009` clause 9f's re-gate.
// ---------------------------------------------------------------------------

/**
 * The REAL render seam — merged `src/status-panel.ts` and merged `src/history-pane.ts` behind the
 * same four-argument seam the stubs sit behind, so what the re-gate tests is the SEAM WIRING, which
 * is the only thing a real-panel run tests that a stub run cannot (`[C9-4]`).
 *
 * IT IS NOT A THIRD STUB. `A18` inspects the STUB seams this suite drives the loop through and
 * there are still exactly two of those — `SHAPE_A` and `SHAPE_B`, both alive below, neither at 3/8
 * and one of them the only run in this tree that takes the append branch. This seam is ADDED to
 * them (`[D51]` (2)); nothing is replaced and no criterion is amended.
 */
const realPanelSeam: RenderSeam = (history, status, thinking, messages) =>
  assembleFrame(
    {
      board: renderBoard(history.position, "unicode", "white-bottom"),
      status: renderStatusPanel(history, status, thinking),
      history: renderHistory(history),
      messages,
    },
    "unicode",
  );

/** The three escapes this writer emits (`src/frame.ts:59-83`), declared locally as `frame.test.ts:75-78` declares them. */
const CURSOR_HOME = "\x1b[H";
const ERASE_TO_END_OF_SCREEN = "\x1b[0J";
const ERASE_TO_END_OF_LINE = "\x1b[K";

interface Screen {
  write(text: string): void;
  lines(): string[];
}

/**
 * A terminal small enough to reason about, LOCAL TO THIS FILE — merged `src/frame.test.ts`'s model
 * is not exported (`:190`, verified again here) and `ADR-0009` clause 9c keeps this ticket's
 * fixtures in this ticket's own test file. That file is not touched by this ticket.
 *
 * Four behaviours are modelled and each is an assumption stated rather than buried:
 *
 *   - `\n` moves to column 0 of the next row — the ONLCR translation a terminal in cooked mode
 *     does, which is what lets the writer emit a multi-row frame with no carriage return;
 *   - the wrap at the right margin is DEFERRED, as xterm and Terminal.app do it: a row of exactly
 *     `columnCount` characters leaves the cursor AT the margin and does not move down until the
 *     next printable character, and an erase fired from there erases that last cell rather than
 *     doing nothing. `ABC-027`'s `A7` measured that second half on GNU screen 5.0.2 and pins it in
 *     `frame.test.ts`; it is INHERITED here, not re-measured, and `A20` is why it matters — at
 *     `W`(frame 1) every row of the widest frame ends exactly at the margin;
 *   - moving below the last row scrolls the whole screen up by one;
 *   - AN ESCAPE THIS MODEL DOES NOT IMPLEMENT THROWS. That is the property that makes the model
 *     evidence rather than decoration: an ignored sequence is how a screen model quietly certifies
 *     a writer that emitted something the terminal would have obeyed.
 */
function createScreen(rowCount: number, columnCount: number): Screen {
  const blankRow = (): string[] => new Array<string>(columnCount).fill(" ");
  const grid: string[][] = Array.from({ length: rowCount }, blankRow);
  let row = 0;
  let column = 0;

  const scrollIfBelow = (): void => {
    if (row < rowCount) return;
    grid.shift();
    grid.push(blankRow());
    row = rowCount - 1;
  };

  /** Where an erase fires from: at the margin the cursor sits ON the last cell, never past it. */
  const eraseToEndOfLine = (): void => {
    const current = grid[row] as string[];
    for (let index = Math.min(column, columnCount - 1); index < columnCount; index++) {
      current[index] = " ";
    }
  };

  const eraseToEndOfScreen = (): void => {
    eraseToEndOfLine();
    for (let below = row + 1; below < rowCount; below++) grid[below] = blankRow();
  };

  return {
    write(text: string): void {
      let index = 0;
      while (index < text.length) {
        if (text.startsWith(CURSOR_HOME, index)) {
          row = 0;
          column = 0;
          index += CURSOR_HOME.length;
          continue;
        }
        if (text.startsWith(ERASE_TO_END_OF_SCREEN, index)) {
          eraseToEndOfScreen();
          index += ERASE_TO_END_OF_SCREEN.length;
          continue;
        }
        if (text.startsWith(ERASE_TO_END_OF_LINE, index)) {
          eraseToEndOfLine();
          index += ERASE_TO_END_OF_LINE.length;
          continue;
        }
        const character = text[index] as string;
        index++;
        if (character === "\n") {
          column = 0;
          row++;
          scrollIfBelow();
          continue;
        }
        if (character === "\x1b") {
          throw new Error(
            `screen model: unmodelled escape ${JSON.stringify(text.slice(index - 1))}`,
          );
        }
        if (column >= columnCount) {
          column = 0;
          row++;
          scrollIfBelow();
        }
        (grid[row] as string[])[column] = character;
        column++;
      }
    },
    lines: () => grid.map((cells) => cells.join("")),
  };
}

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

describe("ABC-019 — the eighteen scripted rows: fifteen with an exact reason and an exact frame count, two that throw, and row 18 a SCREEN property", () => {
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

  // Row 18 is the third row that is not a `TABLE` row, and for a different reason than rows 14 and
  // 17: its Expected is a SCREEN property rather than a `result` / `reason` / frame count, which is
  // the one thing every `TABLE` column asserts. It was DEFERRED here until `ABC-027` merged and it
  // is written now, with the `A20` test below — the criterion's five redraws are asserted there
  // rather than duplicated into a row whose three columns would say nothing about it.
});

// ---------------------------------------------------------------------------
// The twenty-seven acceptance criteria, in the ticket's order. `A17`'s timing half is out of tree —
// see the file header; it is not silently absent. Every other criterion is asserted here, `A20`
// included, now that `ABC-027` is merged on this tip.
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

  it("A3b — one derive per ply, and ZERO on a non-mutating prompt outcome", async () => {
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

  // `## Test notes` row 18. It runs against the REAL panels because that is where a narrowing comes
  // from without one being invented: the real status panel's claim cell is 32 columns wide and the
  // real history pane is a fixed 21, so a claim that appears and goes moves `W` by more than 20.
  it("A20 — after EVERY redraw the screen equals the frame, at `W`(frame 1) and at 80 columns", async () => {
    const { sink } = await run({
      fen: FIFTY_MOVE_ANCHOR_FEN,
      script: ["a2a3", "h8h7", "g1g7", "h7g7"],
      seam: realPanelSeam,
      // EXACTLY `H` rows: `beginFrameSession` takes the in-place branch at `>=`, so this is the
      // tightest viewport that still redraws in place, nothing scrolls at that size, and the screen
      // the model holds IS the frame's viewport — which is what makes "the same number of rows"
      // mean something rather than being satisfied by a taller screen's blank remainder.
      sink: recordingSink({ isTTY: true, rows: 23 }),
    });

    const written = writtenFrames();
    const widths = written.map(widthOf);

    // THE `GIVEN`, ASSERTED RATHER THAN ASSUMED. A fixture that stopped narrowing would satisfy
    // every assertion below vacuously, which is the failure mode this criterion is most exposed to.
    const narrowedAt = widths.flatMap((width, index) =>
      index > 0 && width < (widths[index - 1] as number) ? [index] : [],
    );
    expect(narrowedAt.length).toBeGreaterThan(0);
    // ...and redraws continue after the first narrowing, so "after EVERY redraw — not the last, and
    // not only the narrowing one" is not satisfiable by a run whose narrowed frame is its last.
    expect(narrowedAt[0]).toBeLessThan(written.length - 1);

    // The narrowing comes from a PANEL row and not from a message item: `W` is the max over the
    // panel rows only and the message region is bounded BY it (`src/frame.ts:176-179`), so a
    // fixture that narrowed via `messages` would narrow nothing and this criterion would pass
    // vacuously. This run carries NO message item at all — asserted, not arranged — and the claim
    // cell that widens frame 1 is the real status panel's third row.
    for (const frame of written) expect(messageRegionOf(frame)).toEqual(["", ""]);
    expect((written[0] as string[]).join("\n")).toContain("White may claim: fifty-move rule");
    expect((written[1] as string[]).join("\n")).not.toContain("may claim");

    // The redraws are the writer's writes, one per frame (`src/frame.ts:233-245`). The ONE trailing
    // write is `EPIC-006`'s end-of-input notice, which is a `sink.write` and NOT a frame (`A2`,
    // `[D29]`) — asserted here so that pairing byte `i` with frame `i` below is checked rather than
    // assumed, and so a loop that started writing anything else would break this test first.
    expect(sink.writes).toHaveLength(written.length + 1);
    expect(sink.writes[sink.writes.length - 1]).toBe(`${INPUT_ENDED_NOTICE}\n`);

    // A FIXTURE PRECONDITION, AND DELIBERATELY NOT A WIDTH CRITERION. `[D47]` forbids this ticket
    // asserting that `W` is constant, that it equals the session's, that it equals the first
    // frame's, or that any panel pads to a fixed width — this asserts none of those and `W` varies
    // by design here, measured 45/22/23/27/24. What it says is that THIS FIXTURE's first frame is
    // its widest, which is what makes `W`(frame 1) a screen the whole run fits inside instead of
    // one a later frame wraps on and fails for a reason that is not the writer's.
    expect(widths[0]).toBe(Math.max(...widths));
    expect(Math.max(...widths)).toBeLessThan(80);

    // The second `Given`: `W`(frame 1) is the artificial width epic `4b` fires at, and 80 is a real
    // terminal — the untrimmed comparison (`ADR-0010`'s form `F2`) false-positives on every frame
    // at 80 and is why both this loop and the trim exist.
    for (const columns of [widths[0] as number, 80]) {
      const screen = createScreen((written[0] as string[]).length, columns);
      written.forEach((frame, index) => {
        screen.write(sink.writes[index] as string);
        expect(rightTrimmed(screen.lines()), `redraw ${index} at ${columns} columns`).toEqual(
          rightTrimmed(frame),
        );
      });
    }
  });
});

// ---------------------------------------------------------------------------
// `ADR-0009` clause 9f — the real-panel re-gate, run at the rebase and stating WHICH panels were
// real: BOTH of them. `[D51]` (1) asked for that sentence because the swap was PARTIAL when it was
// written — `src/status-panel.ts` was merged and the history pane was not — and a re-gate that
// swapped one panel and reported the clause discharged would have tested half the seam. On this tip
// `STATUS_ROWS` = 3 and `HISTORY_ROWS` = 8 are both read off merged modules by the tests below, so
// the partial is discharged IN FULL and no half of the wiring is left untested.
//
// The clause asks for this run IN ADDITION. `A18`'s two stub shapes above are untouched and still
// run: the real pair is 3/8, which clause (i) forbids a stub from being, and it assembles to
// `H` = 23 — in place on a 24-row TTY — so a suite that had swapped the stubs out would have lost
// the only append-branch run in this tree along with the criterion that catches a tuned literal.
// ---------------------------------------------------------------------------

describe("ADR-0009 clause 9f — the loop against the REAL panels, both of them", () => {
  it("the real pair is 3/8, assembles to H = 23, and redraws IN PLACE on a 24-row TTY", async () => {
    const history = newGame(START_FEN);
    const status = gameStatusOf(history);

    // Read off the producers, never restated: `ADR-0009` clause 1 gives each count to its panel, and
    // a consumer that restates one cannot fail on the panel it restates.
    expect(STATUS_ROWS).toBe(3);
    expect(HISTORY_ROWS).toBe(8);
    expect(renderStatusPanel(history, status, false)).toHaveLength(STATUS_ROWS);
    expect(renderHistory(history)).toHaveLength(HISTORY_ROWS);
    expect(realPanelSeam(history, status, false, [])).toHaveLength(23);

    // 23 <= 24, so the real pair takes the in-place branch — and shape `B` at 25 remains the only
    // run in this tree that takes the other one. That is `[D51]` (2), observed rather than quoted.
    const { sink } = await run({
      seam: realPanelSeam,
      script: ["board"],
      sink: recordingSink({ isTTY: true, rows: 24 }),
    });
    expect(sink.writes[0]?.startsWith(CURSOR_HOME)).toBe(true);
  });

  it("`A19`'s four clauses hold at the real geometry, and the height is DERIVED there too", async () => {
    const { frames } = await run({
      seam: realPanelSeam,
      script: ["zzzz", "g1f3", "g8f6"],
      sink: recordingSink({ isTTY: true, rows: 24 }),
    });

    expect(vi.mocked(beginFrameSession)).toHaveBeenCalledTimes(1); // (a)
    expect(sessionHeight()).toBe((frames[0] as string[]).length); // (b)
    expect(writtenFrames()).toEqual(frames); // (c)
    for (const frame of writtenFrames()) expect(frame).toHaveLength(sessionHeight()); // (d)

    // The one figure the swap moves, and the reason `A18`(i) + `A19`(b) — not the compiler — is what
    // kills the IMPORTED form (`[D50]`): a loop that had imported the two constants and computed
    // `frameHeight` would read 23 here and be RED at both stub shapes' 19 and 25.
    expect(sessionHeight()).toBe(23);
  });

  it("the WIRING: the real panels derive nothing, and the status, the thinking flag and the messages are the LOOP's", async () => {
    const { frames, thinkingFlags, statuses } = await run({
      seam: realPanelSeam,
      script: ["zzzz", "g1f3", "g8f6"],
    });

    // The line `ABC-016` was owed, now measurable for the first time: with STUB panels this was
    // vacuous, because a stub derives nothing by construction. The real panels are on the other side
    // of the seam here and the counts do not move — `N + 1` derives for `N` = 2 plies, and the
    // rejected prompt adds none.
    expect(derivesMade()).toBe(3);
    expect(vi.mocked(gameStatusOf)).toHaveBeenCalledTimes(3);
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);

    // The thinking flag is the LOOP's and it reaches the real panel — the real
    // `renderStatusPanel` blanks that cell to spaces of the same length when it is false, so this
    // crosses the flag with the panel rather than merely observing that the flag exists.
    expect(frames.map((frame) => frame.join("\n").includes("thinking..."))).toEqual(thinkingFlags);
    expect(thinkingFlags).toContain(true);

    // The fourth seam argument (`[D28]`) reaches the real geometry's message region, which is the
    // one part of the wiring `A5` depends on and no stub run can prove.
    expect(messageRegionOf(frames[1] as string[])).toEqual(["not a move: zzzz", ""]);

    // ...and the status the panel renders is the one the LOOP evaluated and handed across, not one
    // the panel derived for itself.
    expect(statuses).toHaveLength(frames.length);
    for (const status of statuses) expect(status.result).toBe("in-progress");
  });

  it("the loop is SWAP-INVARIANT: same verdict, same cadence, same plies at stub 2/5, stub 4/9 and the real 3/8", async () => {
    const script = ["g1f3", "g8f6", "zzzz", "b1c3", "b8c6"];
    const stubA = await run({ script, shape: SHAPE_A });
    const stubB = await run({ script, shape: SHAPE_B });
    const real = await run({ script, seam: realPanelSeam });

    for (const swapped of [stubB, real]) {
      expect(swapped.outcome).toEqual(stubA.outcome);
      expect(swapped.frames).toHaveLength(stubA.frames.length);
      expect(swapped.history.moves).toEqual(stubA.history.moves);
      expect(swapped.events).toEqual(stubA.events);
    }

    // ...and the FRAMES differ, so the four equalities above are about the loop rather than about
    // three seams that happen to return the same rows. Without this the invariance is a tautology.
    expect(real.frames).not.toEqual(stubA.frames);
    expect(stubB.frames).not.toEqual(stubA.frames);
  });
});

// ---------------------------------------------------------------------------
// `ABC-021` — TRANSITION 16 only. `ABC-019` owns that `game-over` is reachable from
// `awaiting-human` at all (`turn-loop.ts:114-116`); what is asserted below is the player having the
// move CLAIMING, with a claimed reason, and the loop ending the game — plus the availability value
// and the refusal. The other fifteen transitions are not re-litigated here.
//
// ZERO NEW TEST FILES, which is the count `N8-LANE` binds: these rows sit beside `ABC-019`'s in the
// file that already mocks `gameend.ts`, `history.ts` and `frame.ts`, exactly as the ticket's
// re-verification expected. They are their own `describe` rather than four more `TABLE` rows because
// `TABLE` is `ABC-019`'s eighteen and `A12` reads its first five positionally.
// ---------------------------------------------------------------------------

describe("ABC-021 acceptance — transition 16, the draw claim", () => {
  it("A1 — the human claims the third occurrence: the loop stops with the CLAIMED article, and the final frame is that position", async () => {
    const { outcome, frames, history, events } = await run({
      fen: SHUFFLE_FEN,
      script: [...shuffle(2), "claim"],
    });

    // The reason names the claimed article and can name nothing else: `ClaimableDraw` is disjoint
    // from `EndReason` BY CONSTRUCTION (`gameend.ts:47-48`), so `gameStatus` never returns
    // `threefold-repetition` as the reason a game ended — only a claim can put it here.
    expect(outcome).toEqual({ result: "draw", reason: "threefold-repetition", exitCode: 0 });
    expect(EVERY_END_REASON).not.toContain(outcome.reason);

    // The claim advanced no ply, so the last frame the player saw IS the position they claimed in.
    expect(history.moves).toHaveLength(8);
    const claimed = boardOf(replay(history));
    expect(boardRegionOf(lastFrame(frames), claimed.length)).toEqual(claimed);

    // Cadence `1 + plies`: the claim TERMINATES rather than re-emitting, and no terminal
    // `GameStatus` exists on this edge to render a tenth frame from (`A8b` (ii)'s shape).
    expect(frames).toHaveLength(9);
    expect(events[events.length - 1]).toBe("input");
  });

  it("A2 — the same position played ON instead: mate, and NO draw is reported at any point in the run", async () => {
    const { outcome, statuses, history } = await run({
      fen: SHUFFLE_FEN,
      script: [...shuffle(2), "e1e8"],
    });

    expect(outcome).toEqual({ result: "white-wins", reason: "checkmate", exitCode: 0 });
    expect(history.moves).toHaveLength(9);

    // THE WHOLE RUN'S VERDICTS, not only the last one. A build with `ABC-020` undone underneath this
    // ticket reports `draw` at the third occurrence — one frame before the mate — and the final
    // verdict alone never sees it. This is the owner's directive end to end: the draw was available
    // for the whole shuffle and it was never imposed.
    for (const status of statuses) expect(status.result).not.toBe("draw");
    expect(statuses[8]?.claimable).toEqual({ by: "white", draws: ["threefold-repetition"] });
  });

  it("A3 — a claim the rules core refuses takes `rejected`'s path, and the message names BOTH gaps in numbers", async () => {
    const before = toFen(parseFen(START_FEN));
    const { history, frames, events } = await run({ script: ["claim"] });

    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(before);
    // NOT re-evaluated: the initial evaluation only. The claim is adjudicated against the status the
    // ply already holds, which is why this reads exactly as `A5` does for `rejected`/`ambiguous`.
    expect(derivesMade()).toBe(1);
    // The prompt is re-issued AFTER the frame carrying the refusal.
    expect(events).toEqual(["frame", "input", "frame", "input"]);

    const region = messageRegionOf(frames[1] as string[]).join(" ");
    // Never a bare "cannot claim": each rule, the value in hand, and the value a claim needs.
    expect(region).toContain("repetition 1 of 3");
    expect(region).toContain("50-move 0 of 100");
    // ...and both items are SHOWN. An item too wide for the region is dropped whole behind a
    // `(+N more)` marker (`frame.ts:134,146-172`), and a teaching message nobody can read teaches
    // nothing — this is the clause that keeps the wording inside the frame's own `W`.
    expect(region).not.toContain("more)");

    // The boundary, from the other side: at TWO occurrences the message says so and the claim is
    // refused, and at three (`A1`, same fixture, one cycle further) it is allowed. The restated
    // `3` and `100` are pinned by the pair rather than by a comment.
    const nearly = await run({ fen: SHUFFLE_FEN, script: [...shuffle(1), "claim"] });
    expect(nearly.history.moves).toHaveLength(4);
    // Frame 5, not 4: `1 + 4 plies` frames precede the prompt, and the refusal RE-EMITS one.
    expect(nearly.frames).toHaveLength(6);
    expect(messageRegionOf(nearly.frames[5] as string[]).join(" ")).toContain("repetition 2 of 3");
    expect(nearly.outcome).toEqual({ result: null, reason: null, exitCode: 0 });
  });

  it("A4 — the ENGINE is never asked for a claim: it is handed the game, it answers with a move, and the game goes on", async () => {
    // The human is BLACK, so the side holding the claim at the third occurrence is the ENGINE's.
    const seams = scriptedSeams([...shuffle(2), "g1h1"]);
    const engineSpy = vi.fn(seams.engine);
    const { outcome, statuses, history } = await run({
      fen: SHUFFLE_FEN,
      humanColour: "black",
      input: seams.input,
      engine: engineSpy,
    });

    // The claim really was on offer to the engine's own side on that ply — without this clause the
    // whole test passes against a game in which nothing was ever claimable.
    expect(statuses[8]?.claimable).toEqual({ by: "white", draws: ["threefold-repetition"] });

    // THE SPY. Every call is the loop handing the seam the GAME and nothing else: there is no second
    // argument through which a claim could be asked for, and every answer is a `Move` that was
    // played. An engine that starts claiming has to change this shape to do it, so it fails a test
    // rather than surprising a player — and the loop never claimed on its behalf either.
    expect(engineSpy.mock.calls).toHaveLength(5);
    for (const call of engineSpy.mock.calls) expect(call).toHaveLength(1);
    for (const answer of engineSpy.mock.results) {
      expect(history.moves).toContainEqual(await answer.value);
    }

    // It played ON: the ply advanced past the claimable position and no claimed draw was recorded.
    expect(history.moves).toHaveLength(9);
    expect(EVERY_CLAIMABLE_DRAW).not.toContain(outcome.reason);
    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
  });

  it("A5 — neither side ever claims: the FIFTH occurrence ends it automatically, reached through the LOOP", async () => {
    const { outcome, history, statuses } = await run({ fen: SHUFFLE_FEN, script: shuffle(4) });

    expect(outcome).toEqual({ result: "draw", reason: "fivefold-repetition", exitCode: 0 });
    expect(history.moves).toHaveLength(16);
    // Claimable from the third occurrence onward and declined every time. This is FIDE 9.6.1 reached
    // through the loop rather than through the rules core in isolation: declining a claim is always
    // legal and it cannot hang the game.
    expect(statuses[8]?.claimable).toEqual({ by: "white", draws: ["threefold-repetition"] });
    expect(statuses[16]).toEqual({ result: "draw", reason: "fivefold-repetition" });
  });

  it("A6 — the availability reaches the FRAME, off the ONE derive that ply already makes", async () => {
    const { frames, statuses } = await run({
      fen: SHUFFLE_FEN,
      script: shuffle(2),
      shape: SHAPE_B,
    });

    // In the frame's own text and not merely in the value the seam was handed: shape `B`'s status
    // stub is four rows, so the claim cell is INSIDE the frame instead of sliced off it.
    expect(rightTrimmed(frames[8] as string[])).toContain("claim threefold-repetition");
    expect(statuses[8]?.claimable).toEqual({ by: "white", draws: ["threefold-repetition"] });

    // Eight plies plus the mandatory initial evaluation. A build that read availability from a
    // SECOND `gameStatusOf` on the frame path is 2x here and identical on every content assertion —
    // and it would spend 46-50 µs a ply of `NFR-002`'s 100 µs on a value already in hand.
    expect(derivesMade()).toBe(9);
    expect(vi.mocked(gameStatusOf)).toHaveBeenCalledTimes(9);
    // The loop derives nothing of its own on an advancing ply — every evaluation went through
    // `gameStatusOf`. (The honest limit on this spy is the module-boundary one in the header.)
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);
  });

  it("A7 — BOTH claimed reasons are reachable through the loop, and the ratified order decides when both are", async () => {
    const fifty = await run({ fen: AT_100_FEN, script: ["claim"] });

    expect(fifty.outcome).toEqual({ result: "draw", reason: "fifty-move", exitCode: 0 });
    expect(fifty.history.moves).toHaveLength(0);

    // Both claimable at once — the shuffle carries the clock 92 → 100 as it makes the third
    // occurrence. `draws` is ordered threefold-first by `gameend.ts:53` and is never re-sorted
    // (`status-panel.ts:169` reads the same order), so the loop takes the first and the stub token
    // needs no article; WHICH article a player may name is `ABC-035`'s grammar.
    const both = await run({ fen: AT_92_FEN, script: [...shuffle(2), "claim"] });
    expect(both.statuses[8]?.claimable).toEqual({
      by: "white",
      draws: ["threefold-repetition", "fifty-move"],
    });
    expect(both.outcome).toEqual({ result: "draw", reason: "threefold-repetition", exitCode: 0 });

    // `A14` pins the TYPE at ten values; this pins which of them transition 16 can actually emit,
    // and both are read FROM `gameend.ts` rather than re-spelled — that module is not changed by
    // this ticket to make either of them typable.
    expect(new Set([fifty.outcome.reason, both.outcome.reason])).toEqual(
      new Set(EVERY_CLAIMABLE_DRAW),
    );
  });

  // -------------------------------------------------------------------------
  // The two rows below are QE's, added at the `quality-gate-ABC-021` gate. ZERO new test FILES:
  // they sit in the file that already mocks `history.ts`, so the lane `ABC-026` measures moves by
  // two `it` bodies and no `+160 ms` file. `A8` exists because a MUTANT SURVIVED the delivered
  // suite; `A9` exists because the width argument was carried in a comment and by nothing else.
  // -------------------------------------------------------------------------

  it("A8 — the ONE derive the loop makes on its own, ledgered: `keyHistory` fires on the REFUSED claim and nowhere else", async () => {
    // (i) An ADVANCING run. Both standing bars read their green values here...
    await run({ fen: SHUFFLE_FEN, script: shuffle(2) });
    expect(derivesMade()).toBe(9);
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);
    // ...and so must the door this ticket opened. WITHOUT THIS LINE a build that calls
    // `keyHistory` once per ply — a second `O(plies)` replay a ply, which is exactly the 46-50 µs
    // at 120 plies `NFR-002` prices and forbids — passes every other assertion in this file AND
    // `turn-loop.nfr.test.ts` unedited, because `repetitionCounts` still reads 0 and `gameStatus`
    // still reads `plies + 1`. Measured at the gate: 814 of 814, green. A count nothing counts is
    // not a bar.
    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0);

    // (ii) A REFUSED claim costs EXACTLY ONE, and it is `claimShortfall`'s — the module declares it
    // rather than leaving it for a spy to discover, and this is the spy that holds it to the number.
    vi.clearAllMocks();
    await run({ script: ["claim"] });
    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(1);
    expect(derivesMade()).toBe(1);
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);

    // (iii) The price is PER REFUSAL and is never cached: two refusals, two replays. `history.ts`
    // recomputes on every call by ratified design (`ADR-0002` clause 2, `history.ts:12-15`), so a
    // build that memoised here would be changing that contract from the wrong module.
    vi.clearAllMocks();
    await run({ script: ["claim", "claim"] });
    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(2);

    // (iv) An ALLOWED claim derives NOTHING: it is answered from the ply's own `status`, which is
    // the whole reason transition 16 lives in the loop and not behind the seam.
    vi.clearAllMocks();
    const allowed = await run({ fen: SHUFFLE_FEN, script: [...shuffle(2), "claim"] });
    expect(allowed.outcome.reason).toBe("threefold-repetition");
    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0);
    expect(derivesMade()).toBe(9);
  });

  it("A9 — the WIDEST refusal message the loop can emit still fits the NARROWEST frame it can emit it into", async () => {
    const { frames } = await run({ fen: AT_99_FEN, script: ["claim"] });
    const refusal = frames[1] as string[];

    // `W` is the max over the PANEL rows only (`frame.ts:198-201`), and the board is 18 columns in
    // both glyph modes at every position — so 18 is the floor under `W`, not a property of this
    // fixture. Asserted rather than reasoned, because it is what the next clause spends.
    expect(widthOf(refusal)).toBe(18);

    // `50-move 99 of 100` is 17 columns and is the WIDEST value either item can hold on this path:
    // 100 makes the claim AVAILABLE and never reaches the refusal, and `repetition 2 of 3` is the
    // other 17. `A3` proves the ONE-column margin at `50-move 0 of 100` (16); this proves it at the
    // maximum. The ticket's own illustrative prose measures 53 and 43 columns and is dropped WHOLE
    // behind `(+2 more)` at this width — which is why the numbers shipped and the sentences did not.
    const region = messageRegionOf(refusal);
    expect(region).toEqual(["repetition 1 of 3", "50-move 99 of 100"]);
    for (const row of region) expect(row.length).toBeLessThanOrEqual(widthOf(refusal));
    expect(region.join(" ")).not.toContain("more)");
  });
});

// ---------------------------------------------------------------------------
// `ABC-120` — TRANSITIONS 17 and 18 only, `ADR-0021` clauses 3, 4 and 9. `quit` is a sibling of
// transition 10 with a different notice; `take-back` is the one edge into `evaluating-terminal`
// that does not come from `applying`. Nothing existing reds on the arms (measured: 42 / 1291 green
// with the arms and none of these rows), which is the whole reason these rows exist.
//
// ZERO NEW TEST FILES, again the count `N8-LANE` binds: the rows sit beside `ABC-019`'s and
// `ABC-021`'s in the file that already mocks `gameend.ts`, `history.ts` and `frame.ts`. `A6`'s
// no-re-evaluation mutant was watched RED on `A3`, `A4` and `A5` and green on `A1` before these rows
// were trusted; the raw output is in the delivery note, and `src/` never carried the mutant.
// ---------------------------------------------------------------------------

describe("ABC-120 acceptance — transitions 17 (quit) and 18 (take-back)", () => {
  it("A1 — `quit` ends the session with NO result, NO frame, one notice, and NO further read", async () => {
    const seams = scriptedSeams(["board", "quit", "e2e4"]);
    // The seam THROWS on a third read: a loop that read past `quit` would fail here rather than
    // quietly playing `e2e4` into a session the player has already left.
    let reads = 0;
    const input: InputSeam = (history) => {
      reads += 1;
      if (reads > 2) throw new Error("input seam read past `quit`");
      return seams.input(history);
    };

    const { outcome, frames, sink, events, history } = await run({ input });

    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
    // `board` re-emits one frame; `quit` re-emits nothing — `eof`'s cadence, transition 10's shape.
    expect(frames).toHaveLength(2);
    const notice = sink.writes[sink.writes.length - 1] as string;
    expect(notice).toBe(`${QUIT_NOTICE}\n`);
    expect(notice.split("\n").filter((line) => line !== "")).toHaveLength(1);
    // The false sentence shape (a) would have shown: NOWHERE in the run, not merely not last.
    for (const write of sink.writes) expect(write).not.toContain(INPUT_ENDED_NOTICE);
    // The run ends ON the prompt that read `quit`: no engine call, no frame after it.
    expect(events[events.length - 1]).toBe("input");
    expect(reads).toBe(2);
    expect(derivesMade()).toBe(1);
    expect(history.moves).toHaveLength(0);
  });

  it("A2 — `QUIT_NOTICE` is exported, is not `INPUT_ENDED_NOTICE`, is one line, and names no chess outcome", () => {
    expect(typeof QUIT_NOTICE).toBe("string");
    // Asserted on the two CONSTANTS, never a substring: `ABC-046` `A3` reads the same pair.
    expect(QUIT_NOTICE).not.toBe(INPUT_ENDED_NOTICE);
    expect(QUIT_NOTICE).not.toContain("\n");
    expect(QUIT_NOTICE.length).toBeGreaterThan(0);
    // None of the ten `TerminalReason` words and none of the five result words — a loop over the
    // array plus the five, so a value deleted from `EVERY_TERMINAL_REASON` cannot pass silently.
    const forbidden = [...EVERY_TERMINAL_REASON, "win", "draw", "resign", "checkmate", "stalemate"];
    expect(forbidden).toHaveLength(15);
    for (const word of forbidden) expect(QUIT_NOTICE.toLowerCase()).not.toContain(word);
  });

  it("A3 — `take-back` on a CLAIMABLE position: ONE derive clears the stale claim cell, and the three rewind together", async () => {
    // `A4`'s own fixture: the third occurrence is claimable by White at frame 9.
    const { statuses, frames, history, outcome } = await run({
      script: [...cycles(2), "new", "quit"],
    });

    // The GIVEN, asserted: frame 9 really did carry the claim.
    expect(statuses[8]?.claimable).toEqual({ by: "white", draws: ["threefold-repetition"] });
    // Frame 10 is the rewound position's OWN status — not the discarded game's claim. Shape (a)'s
    // defect reads the stale `{ by: "white" }` here, which is `ABC-046` `## Problem`'s sentence.
    expect(statuses[9]?.claimable).toBeUndefined();
    expect(statuses[9]?.result).toBe("in-progress");
    // 1 + 8 plies + 1 re-emit for the take-back; `quit` adds none.
    expect(frames).toHaveLength(10);
    // 1 + 8 + EXACTLY one for the take-back, none for `quit`. A build that re-evaluates a
    // non-mutating outcome reads 11; a build that does not re-evaluate the take-back reads 9.
    expect(derivesMade()).toBe(10);
    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });

    // The three that `ADR-0002` clause 2 rewinds TOGETHER, asserted as three numbers: a build that
    // rewinds the move list and not the key list passes any one of them.
    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(START_FEN);
    expect(keyHistory(history)).toHaveLength(1);
    const counts = repetitionCounts(history);
    expect(counts.size).toBe(1);
    expect([...counts.values()]).toEqual([1]);
  });

  it("A4 — `take-back` of two plies WITH a message: the message reaches the next frame and leaves with it", async () => {
    // The FEN is read INSIDE the render seam, at the frame it belongs to: after the run two more
    // plies are on, and `statuses[]` / `frames[]` are copies while `history` is the live object.
    const fensAtRender: string[] = [];
    const stub = panelSeam(SHAPE_A);
    const seam: RenderSeam = (history, status, thinking, messages) => {
      fensAtRender.push(toFen(history.position));
      return stub(history, status, thinking, messages);
    };

    const { frames, history } = await run({
      script: ["e2e4", "e7e5", "undo", "g1f3", "g8f6"],
      seam,
    });

    // Two on, two off, two on.
    expect(history.moves).toHaveLength(2);
    expect(history.moves.map(coordinatesOf)).toEqual(["g1f3", "g8f6"]);
    // 1 + 2 + 1 (the take-back re-emits) + 2.
    expect(frames).toHaveLength(6);
    expect(derivesMade()).toBe(6);
    // Frame 4 carries the item; frames 5 and 6 do not (`A5b`'s shape, on the new arm).
    expect(messageRegionOf(frames[3] as string[])).toContain("took back 2");
    expect(messageRegionOf(frames[4] as string[]).join("")).toBe("");
    expect(messageRegionOf(frames[5] as string[]).join("")).toBe("");
    // The position the player saw on frame 4 IS the start position — rewound, then rendered.
    expect(fensAtRender[3]).toBe(START_FEN);
    expect(fensAtRender[2]).not.toBe(START_FEN);
  });

  it("A5 — `take-back` of ZERO plies at ply 0: one derive, one frame, nothing else", async () => {
    const { frames, history, events, outcome } = await run({ script: ["new"] });

    expect(frames).toHaveLength(2);
    expect(derivesMade()).toBe(2);
    expect(history.moves).toHaveLength(0);
    expect(toFen(history.position)).toBe(START_FEN);
    expect(keyHistory(history)).toHaveLength(1);
    expect(events).toEqual(["frame", "input", "frame", "input"]);
    // The `eof` after the script, byte-identical to `A8`'s — `quit` was not in this script.
    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
  });

  it("A7 — `A14`'s ten, every unchanged type, and EXACTLY nine `PromptOutcome` members", () => {
    expect(new Set(EVERY_TERMINAL_REASON).size).toBe(10);
    expect(INPUT_ENDED_NOTICE).toBe("input ended");

    // `exitCode` stays the LITERAL type `0`: `[number] extends [0]` is false, so a widened field is
    // a `tsc --noEmit` error here rather than a surprise at the entry point.
    const exitCodeIsLiteralZero: [LoopOutcome["exitCode"]] extends [0] ? true : false = true;
    expect(exitCodeIsLiteralZero).toBe(true);
    const outcome: LoopOutcome = { result: null, reason: null, exitCode: 0 };
    expect(outcome.exitCode).toBe(0);

    // The union ENUMERATED and made executable: a `Record` keyed by every `kind` is a type error
    // with a tenth arm missing from it AND with a deleted arm still in it, so the enumeration
    // `ABC-019` fixed at seven and `ADR-0021` moved to nine cannot drift unnoticed.
    const everyKind: Record<PromptOutcome["kind"], true> = {
      move: true,
      rejected: true,
      ambiguous: true,
      command: true,
      claim: true,
      eof: true,
      quit: true,
      "take-back": true,
      "game-over": true,
    };
    expect(Object.keys(everyKind)).toHaveLength(9);
    expect(Object.keys(everyKind)).toContain("quit");
    expect(Object.keys(everyKind)).toContain("take-back");
  });
});
