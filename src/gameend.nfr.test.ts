/**
 * NFR-001's leaf-cheapness bars for `gameStatus`, as a permanent guard.
 *
 * `plans/nfr-catalog.md` requires these bars to be **spied, not inferred** — a second legal-move
 * generation or a second Zobrist read changes no returned value, so every assertion in
 * `gameend.test.ts` is blind to both. Measured at the ABC-020 Security/NFR gate: with the bars
 * held only by out-of-tree harness runs, three separate mutations of `src/gameend.ts` left all
 * 45 tests in `gameend.test.ts` green — a second `legalMoves()` call, two `zobristKey()` reads
 * instead of one shared local, and the 150-ply clock check moved below the fivefold check. Each
 * assertion below fails on one of them.
 *
 * This lives in its own file on purpose: a `vi.mock` factory is hoisted to file scope, so putting
 * it in `gameend.test.ts` would re-route the module graph for every test there to buy three
 * assertions. Here it re-routes nothing else.
 *
 * These are CALL-COUNT bars only. Wall-clock cost is not asserted anywhere in this suite — it is
 * machine-dependent, and it is measured with its machine and recorded in `plans/nfr-catalog.md`.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseFen } from "./fen.ts";

vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return {
    ...actual,
    legalMoves: vi.fn(actual.legalMoves),
    hasLegalMove: vi.fn(actual.hasLegalMove),
    legalCaptures: vi.fn(actual.legalCaptures),
  };
});

vi.mock("./zobrist.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./zobrist.ts")>();
  return { ...actual, zobristKey: vi.fn(actual.zobristKey) };
});

import { gameStatus, leafEndReason } from "./gameend.ts";
import { hasLegalMove, legalCaptures, legalMoves } from "./legal.ts";
import { quiesce } from "./quiescence.ts";
import { zobristKey } from "./zobrist.ts";

/** The G-1 position: a legal, ordinary board that every state below is a clock/counts edit of. */
const G1_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";

/** The same position with the halfmove clock set to `clock`. */
function atClock(clock: number) {
  const fields = G1_FEN.split(" ");
  fields[4] = String(clock);
  return parseFen(fields.join(" "));
}

/** A counts map holding exactly `occurrences` of `position`, as a history-carrying caller would. */
function countsFor(position: ReturnType<typeof parseFen>, occurrences: number) {
  const counts = new Map([[zobristKey(position), occurrences]]);
  vi.clearAllMocks(); // the key read above is the fixture's, not the call under test
  return counts;
}

describe("NFR-001 — gameStatus stays cheap at a search leaf (call counts, spied)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("generates the legal moves EXACTLY once, on every call shape", () => {
    const shapes: [string, () => unknown][] = [
      ["bare, in progress", () => gameStatus(atClock(0))],
      ["bare, claimable", () => gameStatus(atClock(100))],
      ["bare, automatic 75-move", () => gameStatus(atClock(150))],
      ["with counts, in progress", () => gameStatus(atClock(0), countsFor(atClock(0), 1))],
      ["with counts, claimable", () => gameStatus(atClock(0), countsFor(atClock(0), 3))],
      ["with counts, automatic fivefold", () => gameStatus(atClock(0), countsFor(atClock(0), 5))],
      ["checkmate", () => gameStatus(parseFen("4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80"))],
      ["stalemate", () => gameStatus(parseFen("7k/5K2/5N2/8/8/8/8/8 b - - 0 1"))],
      ["thin material", () => gameStatus(parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1"))],
    ];

    for (const [shape, call] of shapes) {
      vi.clearAllMocks();
      call();
      expect(legalMoves, shape).toHaveBeenCalledTimes(1);
    }
  });

  it("reads the Zobrist key exactly ONCE when the counts map is consulted", () => {
    // The fivefold rule (>= 5) and the threefold claim (>= 3) share a single read. Two reads
    // return the same verdict, so nothing but this assertion would notice.
    const position = atClock(0);
    const counts = countsFor(position, 3);

    const status = gameStatus(position, counts);

    expect(status).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["threefold-repetition"] },
    });
    expect(zobristKey).toHaveBeenCalledTimes(1);
  });

  it("reads the Zobrist key NOT AT ALL when a cheaper branch already decides", () => {
    // A bare caller never pays for a key, and neither does one whose clock has already run out:
    // the 150-ply test sits above the key read. Pins the COST of that order, and only the cost —
    // the counts map here holds ONE occurrence, so no repetition rule is in play and the choice
    // between two automatic rules that both apply is left unpinned, as ABC-020's review intends.
    const at150 = atClock(150);
    const counts = countsFor(at150, 1);

    expect(gameStatus(at150, counts)).toEqual({ result: "draw", reason: "seventy-five-move" });
    expect(zobristKey).toHaveBeenCalledTimes(0);

    vi.clearAllMocks();
    expect(gameStatus(at150)).toEqual({ result: "draw", reason: "seventy-five-move" });
    expect(zobristKey).toHaveBeenCalledTimes(0);

    vi.clearAllMocks();
    expect(gameStatus(parseFen("4k3/8/8/8/8/8/8/4K3 w - - 150 90"), counts)).toEqual({
      result: "draw",
      reason: "insufficient-material",
    });
    expect(zobristKey).toHaveBeenCalledTimes(0);
  });
});

// ABC-206: the search leaf no longer calls `gameStatus`. These guards hold the leaf's own cost —
// a reintroduced generation or key read changes no value, so no value row would see it.
describe("ABC-206 — the search leaf's game-end check stays cheap (call counts, spied)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("leafEndReason never builds the move list or reads a key: hasLegalMove exactly once", () => {
    const shapes: [string, string][] = [
      ["in progress", G1_FEN],
      ["clock at 100, in progress", "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 1"],
      ["automatic 75-move", "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 150 1"],
      ["checkmate", "4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80"],
      ["stalemate", "7k/5K2/5N2/8/8/8/8/8 b - - 0 1"],
      ["thin material", "4k3/8/8/8/8/8/8/4K3 w - - 0 1"],
    ];

    for (const [shape, fen] of shapes) {
      const position = parseFen(fen);
      vi.clearAllMocks();
      leafEndReason(position);
      expect(legalMoves, shape).toHaveBeenCalledTimes(0);
      expect(hasLegalMove, shape).toHaveBeenCalledTimes(1);
      expect(zobristKey, shape).toHaveBeenCalledTimes(0);
    }
  });

  it("quiesce never builds the full move list: captures come from legalCaptures", () => {
    // kiwipete with a full window: no stand-pat cut at the leaf, so the capture search expands.
    const position = parseFen(
      "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    );
    let visited = 0;
    quiesce(position, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, () => visited++);

    expect(visited).toBeGreaterThan(0); // the capture search ran, so the zero below is earned
    expect(legalCaptures).toHaveBeenCalled();
    expect(legalMoves).toHaveBeenCalledTimes(0);
  });
});
