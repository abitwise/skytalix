/**
 * `NFR-002`'s per-ply derive bar for the turn loop, at `A17`'s three ply counts, as a permanent guard.
 *
 * THESE ARE CALL-COUNT BARS ONLY, and that is the clause the ticket says BINDS rather than a
 * concession. Re-derived at the 2026-08-11 refinement and measured: at 120 plies one derive per ply
 * is 48.34 µs and **two derives is 93.58 µs, which MEETS the ≤ 100 µs bar at 0.94x**. A timing bar
 * with 2x headroom cannot resolve a 2x error, so the bar it exists to enforce — *derive once per ply,
 * not once per call site* — is unenforceable by a clock and is enforced here by a spy. It is the
 * sixth bar on this project to move off a clock and onto a count.
 *
 * WALL-CLOCK COST IS ASSERTED NOWHERE IN THIS SUITE, exactly as merged `gameend.nfr.test.ts` states
 * for its own bars: it is machine-dependent, and `A17`'s instrument is an out-of-tree harness in its
 * own process with a discarded warm-up round, rotated cell order and medians of per-round means. A
 * number produced inside the default lane would be a different measurement wearing that one's name,
 * and `MET`/`MISS` against `≤ 45 @ 40`, `≤ 100 @ 120` and `≤ 200 @ 300` is Security/NFR's at the gate.
 *
 * WHY THREE PLY COUNTS AND NOT ONE: the quantity is `O(plies)` by construction — re-measured at 2.33x
 * from 40 → 120 and 1.97x from 120 → 300 — and one point cannot describe a line. The derive count
 * asserted below is what the timing at each of those points is the cost OF.
 *
 * The honest limit on the spies is the one `turn-loop.test.ts` states: `gameStatusOf` calls
 * `repetitionCounts` INSIDE `history.ts`, where a module-boundary spy cannot see it. So the derive
 * the bar is about is counted by `gameStatus`, which `history.ts:153` calls exactly once per
 * `gameStatusOf`. `repetitionCounts` and `keyHistory` at 0 show only that the loop calls neither
 * export directly — they observe those two exports and nothing else. A replay by any other route
 * (`takeBack`, which rebuilds the position from `initialFen`, called on every ply) leaves all three
 * counts green here: a module-boundary spy on these exports cannot see it. The loop DOES make one
 * derive of its own — `keyHistory`, in `claimShortfall`, on a
 * claim the rules core refused — but that is priced per command and never per ply, and it is
 * ledgered by merged `A8` in `turn-loop.test.ts`, not here. `keyHistory` is spied here because a
 * build that called it on every ply would leave `gameStatus` at `plies + 1` and `repetitionCounts`
 * at 0, and without its zero this file would be green on a second key-list replay per ply.
 */
import { describe, expect, it, vi } from "vitest";
import { assembleFrame } from "./frame.ts";
import type { GameStatus } from "./gameend.ts";
import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { renderBoard } from "./render.ts";
import type { EngineSeam, InputSeam, RenderSeam } from "./turn-loop.ts";

vi.mock("./gameend.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./gameend.ts")>();
  return { ...actual, gameStatus: vi.fn(actual.gameStatus) };
});

vi.mock("./history.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./history.ts")>();
  return {
    ...actual,
    keyHistory: vi.fn(actual.keyHistory),
    repetitionCounts: vi.fn(actual.repetitionCounts),
  };
});

import { gameStatus } from "./gameend.ts";
import { keyHistory, newGame, repetitionCounts } from "./history.ts";
import { runTurnLoop } from "./turn-loop.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * The same 2/5 stub geometry the acceptance suite drives shape `A` through — NOT the reference
 * layout's 3 and 8 (`A18` clause (i), which governs every stub seam this loop's own suite uses).
 */
const seam: RenderSeam = (history, status, thinking) =>
  assembleFrame(
    {
      board: renderBoard(history.position, "unicode", "white-bottom"),
      status: [`status ${status.result}`, thinking ? "thinking" : "ready"],
      history: ["", "", "", "", ""],
      messages: [],
    },
    "unicode",
  );

/**
 * ONE seeded chooser behind BOTH seams. A game of an exact ply count needs no coordinate script, and
 * which seam supplies a ply changes nothing the loop derives — the LCG is
 * `history.test.ts:81-89`'s, so a ply count means the same thing here as it does there and in the
 * out-of-tree harness `A17` names.
 */
function selfPlayingSeams(
  plies: number,
  rejectFirst = 0,
): { input: InputSeam; engine: EngineSeam } {
  let state = 0x2f6e2b1;
  let rejected = 0;

  const choose = (history: GameHistory): Move => {
    const moves = legalMoves(history.position);
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return moves[state % moves.length] as Move;
  };

  return {
    input: async (history) => {
      if (rejected < rejectFirst) {
        rejected += 1;
        return { kind: "rejected", messages: ["not a move"] };
      }
      if (history.moves.length >= plies) return { kind: "eof" };
      return { kind: "move", move: choose(history) };
    },
    engine: async (history) => choose(history),
  };
}

async function play(plies: number, rejectFirst = 0): Promise<GameHistory> {
  vi.clearAllMocks();
  const history = newGame(START_FEN);
  const { input, engine } = selfPlayingSeams(plies, rejectFirst);
  const statuses: GameStatus[] = [];

  await runTurnLoop({
    history,
    humanColour: "white",
    render: (h, status, thinking, messages) => {
      statuses.push(status);
      return seam(h, status, thinking, messages);
    },
    input,
    engine,
    sink: { write: () => undefined },
  });

  // A game that ended early would silently weaken every count below into vacuity.
  expect(history.moves).toHaveLength(plies);
  expect(statuses[statuses.length - 1]?.result).toBe("in-progress");
  return history;
}

describe("NFR-002 — the loop derives once per ply, spied at A17's three ply counts", () => {
  for (const plies of [40, 120, 300]) {
    it(`derives EXACTLY once per ply at ${plies} plies`, async () => {
      await play(plies);

      // `plies` evaluations plus the ONE at transition 1 → 2, which the machine requires before the
      // first frame is shown. A two-derives-per-ply build reads `2 * (plies + 1)` here and MEETS the
      // timing bar at 120.
      expect(vi.mocked(gameStatus)).toHaveBeenCalledTimes(plies + 1);
      // Neither export is called by the loop directly on an advancing run: every `gameStatus` call
      // came through `gameStatusOf`, and the loop's one direct `keyHistory` call (the refused claim)
      // never ran.
      expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);
      expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0);
    });
  }

  it("derives ZERO times on a `rejected` prompt outcome", async () => {
    await play(40, 12);

    // Twelve rejected prompts before the first ply, and the count is unmoved: transitions 7, 8 and 9
    // reach `rendering` without passing through `evaluating-terminal`.
    expect(vi.mocked(gameStatus)).toHaveBeenCalledTimes(41);
    expect(vi.mocked(repetitionCounts)).toHaveBeenCalledTimes(0);
    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0);
  });
});
