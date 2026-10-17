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
 * `status-panel.test.ts` would re-route the module graph for every test there to buy these. That
 * is `src/gameend.nfr.test.ts`'s lesson, recorded in the catalog and followed here.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./history.ts", { spy: true });

vi.mock("./gameend.ts", { spy: true });

vi.mock("./legal.ts", { spy: true });

vi.mock("./san.ts", { spy: true });

// `squareAt` is how the material scan steps the board, and spying it is the only way to count the
// scan itself: the scan returns one integer, so every assertion in `status-panel.test.ts` is blind
// to it running twice.
vi.mock("./position.ts", { spy: true });

import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { gameStatusOf, keyHistory, repetitionCounts } from "./history.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { parseSquareName, squareAt } from "./position.ts";
import { toSan } from "./san.ts";
import { renderStatusPanel } from "./status-panel.ts";

type GameHistory = import("./history.ts").GameHistory;
type Move = import("./moves.ts").Move;

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Three pieces, so the scan's 64 cannot be confused with the board's occupancy. */
const SPARSE_FEN = "4k3/8/8/8/8/8/8/R5K1 w - - 0 1";

/** Two plies on the sparse anchor — `A13`'s stated minimum depth for a counting clause. */
const SPARSE_PLIES = ["a1a2", "e8d8"] as const;

/** Four plies on the same anchor: the count must not move with the depth. */
const SPARSE_PLIES_DEEP = ["a1a2", "e8d8", "a2a4", "d8c8"] as const;

/**
 * The occupied squares of a FEN's board field. `parseFen` places one piece per occupied square
 * (`src/fen.ts:90`), so this is the replay's whole `squareAt` contribution — derived from the
 * anchor rather than written down as a literal, which is what lets the scan clause be stated
 * ply-independently instead of as a second magic number.
 */
const occupiedIn = (fen: string): number =>
  [...(fen.split(" ")[0] as string)].filter((character) => /[a-zA-Z]/.test(character)).length;

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

    // From the first move on, `toSan` makes its own `isInCheck` call inside `suffix` — it makes the
    // move, asks whether the side moved against is in check, and unmakes it (`src/san.ts:104`).
    // That call is SAN's, not the panel's, and it arrives through the one `toSan` the test above
    // pins.
    //
    // THE DIFFERENCE FORM BELOW IS THE CRITERION AND IS NOT A DEPARTURE FROM IT. `A13` was ruled on
    // 2026-08-11 and no longer says "exactly 1" for the render's TOTAL: it pins the panel's own
    // call in two ways that name no other module's count — directly on an empty history, above,
    // and by difference on a longer one, here. Written as a difference precisely so that it holds
    // whatever `suffix()` does; stating the total as "1 empty, 2 thereafter" was REJECTED, because
    // it would make this ticket restate a number `src/san.ts` owns.
    //
    // [CORRECTED — D26] The sentence that stood here said `A13` was unsatisfiable and pointed at a
    // flag that had already been ruled. Taken at face value it told the next reader that this form
    // is the engineer's improvisation around a broken criterion — AND YOU DO NOT PROBE THE DEPTH OF
    // A CLAUSE YOU HAVE BEEN TOLD IS A WORKAROUND. QE reports it did exactly that: the two probes
    // that found the depth gap below are the ones that sentence argued against writing. A stale
    // comment on this ticket has now been measured to suppress a real gap.
    //
    // THE DEPTH IS PART OF THE CRITERION. Both counting clauses are measured at a ply depth of AT
    // LEAST 2, because a build adding a second `isInCheck` from ply 2 on reads 1 at one ply — PASS
    // — and 2 at four plies. The four-ply fixture is reused from the first test above rather than a
    // second game being built.
    const played = gameFrom(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6"]);
    expect(played.moves.length).toBeGreaterThanOrEqual(2);
    renderStatusPanel(played, statusFor(played), false);
    const withSan = (isInCheck as ReturnType<typeof vi.fn>).mock.calls.length;

    // The baseline is `toSan` on the SAME move against the SAME position the panel replays to —
    // ply n-1, so a 3-ply replay here — and any other move would compare two quantities that are
    // only equal by accident. The mocks are cleared IMMEDIATELY BEFORE the call so the replay's own
    // work never enters the baseline.
    const position = parseFen(START_FEN);
    for (let ply = 0; ply < played.moves.length - 1; ply++) {
      makeMove(position, played.moves[ply] as Move);
    }

    vi.clearAllMocks();
    toSan(position, played.moves[played.moves.length - 1] as Move);
    const sanAlone = (isInCheck as ReturnType<typeof vi.fn>).mock.calls.length;

    // [ADDED — D26] An executable guard on the comment above, and NOT a protection of the panel.
    // The flag that asked for it was raised as a discrimination gap and measured NOT to be one:
    // SAN's call enters both terms with the same coefficient and cancels, so `2 - 1` and `1 - 0`
    // give identical verdicts on every build and the difference form is sound either way. What the
    // line records is PROVENANCE — that the spy does intercept SAN's internal call today, the fact
    // the whole routing of two hops turned on and that nothing else in the repo records. It is
    // deliberately not `toBe(1)`: `> 0` names no number `src/san.ts` owns.
    expect(sanAlone).toBeGreaterThan(0);

    expect(withSan - sanAlone).toBe(1);
  });

  it("scans the 64 squares exactly once, whatever the board holds and however deep the game", () => {
    // The scan clause is stated PLY-INDEPENDENTLY: one render's `squareAt` count is 64 plus the
    // occupied squares of `history.initialFen`. The 64 is the scan; the rest is the single
    // `parseFen` the replay pays, which places one piece per occupied square (`src/fen.ts:90`).
    // `makeMove` never calls `squareAt` at all, which is why the depth does not enter the count —
    // and that is what makes a stated DEPTH meaningful here rather than a second magic number.
    //
    // [ADDED — D22] Every depth asserted is AT LEAST 2. The clause was measured at 0 and 1 ply
    // only, so a build whose 64-square scan runs a second time FROM PLY 2 ON read 67 at one ply —
    // PASS — and 131 at four. Two occupancies (32 pieces and 3) because a scan that walked the
    // OCCUPIED squares rather than the 64 would agree with neither, and two depths because the
    // count must not move with the depth.
    const shapes: [name: string, history: GameHistory][] = [
      ["32 pieces, 4 plies", gameFrom(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6"])],
      ["3 pieces, 2 plies", gameFrom(SPARSE_FEN, SPARSE_PLIES)],
    ];

    for (const [name, history] of shapes) {
      expect(history.moves.length, name).toBeGreaterThanOrEqual(2);
      const status = statusFor(history);

      renderStatusPanel(history, status, false);

      expect(squareAt, name).toHaveBeenCalledTimes(64 + occupiedIn(history.initialFen));
    }
  });

  it("replays the history exactly once for the last move, and never twice", () => {
    // The same count, one anchor, deeper — 64 + 3 = 67 at four plies exactly as at two, because
    // the replay pays ONE `parseFen`. A panel that replayed a second time reads 70 here, and a
    // panel whose replay cost grew with the game would not read the same number at both depths.
    const history = gameFrom(SPARSE_FEN, SPARSE_PLIES_DEEP);
    const status = statusFor(history);

    renderStatusPanel(history, status, false);

    expect(squareAt).toHaveBeenCalledTimes(64 + occupiedIn(SPARSE_FEN));
  });

  it("pays no replay at all before the first move", () => {
    // RETAINED DELIVERED COVERAGE, and it is deliberately NOT the ply-independent formula above.
    // On an empty history `lastMoveSan` returns before it reaches `parseFen`, so there is no
    // replay and the count is the scan ALONE: exactly 64, on any occupancy. The formula above
    // describes the render that DOES replay and reads 64 + occupied; it is not claimed here,
    // because at depth 0 the two disagree by the anchor's piece count.
    //
    // Moving the scan clause to a depth of at least 2 (D22) would otherwise have dropped this
    // assertion, and dropping it would leave a panel that pays a POINTLESS `parseFen` before the
    // first move invisible to everything: the deeper counts are unchanged by it, and it emits the
    // same rows. That is `A13`'s own class — a cost regression no output can see — so it is kept
    // rather than removed. Two occupancies, because a scan walking the OCCUPIED squares rather
    // than the 64 would agree with neither.
    for (const fen of [START_FEN, SPARSE_FEN]) {
      const history = gameFrom(fen, []);
      expect(history.moves, fen).toHaveLength(0);
      const status = statusFor(history);

      renderStatusPanel(history, status, false);

      expect(squareAt, fen).toHaveBeenCalledTimes(64);
    }
  });
});
