/**
 * ABC-016 `A13` — the panel derives nothing, as a spied CALL COUNT.
 *
 * A count and not a clock, and the reason is this project's own record: `plans/nfr-catalog.md` has
 * moved a bar off the clock and onto a count three times, each after a timing bar with an order of
 * magnitude of headroom could not fail on the regression it existed to catch. This is the test that
 * fails if anybody puts the repetition derive back inside the panel — at zero timing sensitivity —
 * and no assertion here reads a wall clock.
 *
 * It lives in its own file because a `vi.mock` factory is hoisted to file scope: putting it in
 * `status-panel.test.ts` would re-route the module graph for all 26 tests there to buy these. That
 * is `src/gameend.nfr.test.ts`'s lesson, recorded in the catalog and followed here.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./history.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./history.ts")>();
  return {
    ...actual,
    gameStatusOf: vi.fn(actual.gameStatusOf),
    repetitionCounts: vi.fn(actual.repetitionCounts),
    keyHistory: vi.fn(actual.keyHistory),
  };
});

vi.mock("./gameend.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./gameend.ts")>();
  return { ...actual, gameStatus: vi.fn(actual.gameStatus) };
});

vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return { ...actual, isInCheck: vi.fn(actual.isInCheck) };
});

vi.mock("./san.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./san.ts")>();
  return { ...actual, toSan: vi.fn(actual.toSan) };
});

// `squareAt` is how the material scan steps the board, and spying it is the only way to count the
// scan itself: the scan returns one integer, so every assertion in `status-panel.test.ts` is blind
// to it running twice.
vi.mock("./position.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./position.ts")>();
  return { ...actual, squareAt: vi.fn(actual.squareAt) };
});

const { gameStatusOf, keyHistory, repetitionCounts } = await import("./history.ts");
const { gameStatus } = await import("./gameend.ts");
const { isInCheck, legalMoves } = await import("./legal.ts");
const { toSan } = await import("./san.ts");
const { squareAt, parseSquareName } = await import("./position.ts");
const { makeMove } = await import("./apply.ts");
const { parseFen } = await import("./fen.ts");
const { renderStatusPanel } = await import("./status-panel.ts");

type GameHistory = import("./history.ts").GameHistory;
type Move = import("./moves.ts").Move;

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Three pieces, so the scan's 64 cannot be confused with the board's occupancy. */
const SPARSE_FEN = "4k3/8/8/8/8/8/8/4R1K1 w - - 0 1";

/** As in `status-panel.test.ts`: the core's own primitives, never `history.ts`. */
function gameFrom(initialFen: string, plies: readonly string[]): GameHistory {
  const position = parseFen(initialFen);
  const moves: Move[] = [];

  for (const ply of plies) {
    const from = parseSquareName(ply.slice(0, 2));
    const to = parseSquareName(ply.slice(2, 4));
    const move = legalMoves(position).find(
      (candidate) => candidate.from === from && candidate.to === to,
    );
    if (move === undefined) throw new Error(`no legal move ${ply}`);
    moves.push(move);
    makeMove(position, move);
  }

  return { initialFen, moves, position };
}

/** The status the loop hands in. Built here, then the mocks are cleared: it is a fixture, not a call. */
function statusFor(history: GameHistory) {
  const status = gameStatus(history.position);
  vi.clearAllMocks();
  return status;
}

describe("ABC-016 A13 — the panel derives nothing (call counts, spied)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("never touches the repetition machinery, on any shape", () => {
    const shapes: [name: string, history: GameHistory][] = [
      ["empty history", gameFrom(START_FEN, [])],
      ["one ply", gameFrom(START_FEN, ["g1f3"])],
      ["a played game", gameFrom(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6"])],
      ["a loaded sparse position", gameFrom(SPARSE_FEN, [])],
    ];

    for (const [name, history] of shapes) {
      const status = statusFor(history);
      renderStatusPanel(history, status, false);

      // The four calls that would make two of `ABC-019`'s acceptance criteria false: the loop
      // re-emits a frame on a rejected input and on the `board` command WITHOUT re-evaluating
      // `gameStatus`, and re-emitting the frame is what runs this panel.
      expect(gameStatusOf, name).toHaveBeenCalledTimes(0);
      expect(repetitionCounts, name).toHaveBeenCalledTimes(0);
      expect(keyHistory, name).toHaveBeenCalledTimes(0);
      expect(gameStatus, name).toHaveBeenCalledTimes(0);
    }
  });

  it("calls toSan exactly once, and not at all before the first move", () => {
    const played = gameFrom(START_FEN, ["e2e4", "e7e5", "g1f3"]);
    renderStatusPanel(played, statusFor(played), false);
    expect(toSan).toHaveBeenCalledTimes(1);

    const empty = gameFrom(START_FEN, []);
    renderStatusPanel(empty, statusFor(empty), false);
    expect(toSan).toHaveBeenCalledTimes(0);
  });

  it("asks isInCheck exactly once ITSELF — the panel's own call is the only one it makes", () => {
    // Before the first move the panel is the only caller in the render, so the total IS the
    // panel's own: exactly one.
    const empty = gameFrom(START_FEN, []);
    renderStatusPanel(empty, statusFor(empty), false);
    expect(isInCheck).toHaveBeenCalledTimes(1);

    // From the first move on, `toSan` makes its own `isInCheck` call inside `suffix` — it makes
    // the move, asks whether the side moved against is in check, and unmakes it (`src/san.ts:101`).
    // That call is SAN's, not the panel's, and it arrives through the one `toSan` the test above
    // pins. See the ticket flag raised at this hop: `A13` says "exactly 1" for the total, which no
    // build satisfying items 2 and 4 together can reach on a non-empty history. The panel's own
    // count is what the criterion is about and it is one; the delta below is exactly SAN's.
    const played = gameFrom(START_FEN, ["g1f3"]);
    renderStatusPanel(played, statusFor(played), false);
    const withSan = (isInCheck as ReturnType<typeof vi.fn>).mock.calls.length;

    vi.clearAllMocks();
    const position = parseFen(START_FEN);
    toSan(position, played.moves[0] as Move);
    const sanAlone = (isInCheck as ReturnType<typeof vi.fn>).mock.calls.length;

    expect(withSan - sanAlone).toBe(1);
  });

  it("scans the 64 squares exactly once, whatever the board holds", () => {
    // On an empty history nothing else in the render steps a square: there is no replay, so no
    // `parseFen`, and `legalMoves` does not use `squareAt` at all. The count is the scan, alone.
    // Two occupancies — 32 pieces and 3 — because a scan that walked the OCCUPIED squares would
    // agree with 64 on neither.
    for (const fen of [START_FEN, SPARSE_FEN]) {
      const history = gameFrom(fen, []);
      const status = statusFor(history);
      renderStatusPanel(history, status, false);
      expect(squareAt, fen).toHaveBeenCalledTimes(64);
    }
  });

  it("replays the history exactly once for the last move, and never twice", () => {
    // With a move played, the render's `squareAt` calls are the scan's 64 plus the one `parseFen`
    // the replay pays, which places one piece per occupied square (`src/fen.ts:90`). Three pieces
    // here, so 67 — and a panel that replayed a second time would read 70.
    const history = gameFrom(SPARSE_FEN, ["e1e2"]);
    const status = statusFor(history);

    renderStatusPanel(history, status, false);

    expect(squareAt).toHaveBeenCalledTimes(64 + 3);
  });
});
