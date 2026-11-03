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
    legalCapturesAndQueenPromotions: vi.fn(actual.legalCapturesAndQueenPromotions),
  };
});

vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return { ...actual, makeMove: vi.fn(actual.makeMove) };
});

vi.mock("./moves.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./moves.ts")>();
  return {
    ...actual,
    generateMoves: vi.fn(actual.generateMoves),
    generateCaptures: vi.fn(actual.generateCaptures),
    isSquareAttackedBy: vi.fn(actual.isSquareAttackedBy),
  };
});

vi.mock("./zobrist.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./zobrist.ts")>();
  return { ...actual, zobristKey: vi.fn(actual.zobristKey) };
});

import { makeMove } from "./apply.ts";
import { phaseOf } from "./evaluate.ts";
import { gameStatus, leafEndReason } from "./gameend.ts";
import {
  hasLegalMove,
  isInCheck,
  legalCaptures,
  legalCapturesAndQueenPromotions,
  legalMoves,
} from "./legal.ts";
import { FLAG_NONE, generateCaptures, generateMoves, isSquareAttackedBy } from "./moves.ts";
import { EMPTY, KING, PAWN, parseSquareName } from "./position.ts";
import { QUIESCENCE_MAX_PLY, quiesce } from "./quiescence.ts";
import { lateMoveReduction } from "./search.ts";
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

describe("NFR-001 — gameStatus stays cheap (call counts, spied)", () => {
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
    // `ABC-228` (`ADR-0053` decision 7): a work reading, so it passes the pre-ticket record, with
    // `ABC-229`'s quiet promotions off too. In check the shipped rules build the full list by
    // design; the evasion rows own that path.
    quiesce(
      position,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      0,
      0,
      { evasions: false, quietPromotions: false },
      () => visited++,
      phaseOf(position),
    );

    expect(visited).toBeGreaterThan(0); // the capture search ran, so the zero below is earned
    expect(legalCaptures).toHaveBeenCalled();
    expect(legalMoves).toHaveBeenCalledTimes(0);
  });

  it("lateMoveReduction never plays an unflagged move to learn whether it gives check", () => {
    // G-1, White to move: Re8 is mate (it gives check), Rd1 is quiet. Both unflagged, both
    // non-captures, at a node where every other condition for a reduction holds.
    const position = parseFen(G1_FEN);
    const move = (from: string, to: string) => {
      const found = legalMoves(position).find(
        (m) => m.from === parseSquareName(from) && m.to === parseSquareName(to),
      );
      if (found === undefined || found.flags !== FLAG_NONE) throw new Error(`${from}${to}`);
      return found;
    };
    const check = move("e1", "e8");
    const quiet = move("e1", "d1");
    vi.clearAllMocks();

    expect(lateMoveReduction(position, check, 3, 3, false)).toBe(0);
    expect(lateMoveReduction(position, quiet, 3, 3, false)).toBe(1);
    expect(makeMove).toHaveBeenCalledTimes(0);
  });

  // ABC-217 A2 (QE-206-b): the spies above see only cross-module calls, so a rebuild on
  // `legalMoves` inside legal.ts would pass them. `makeMove` is cross-module from there.
  // ABC-254 (ADR-0003 (1-A)) tightened both bars below: out of check, a move that is not a king
  // move, an en-passant capture or a pinned piece's move is accepted untested, and an unflagged
  // tested move is played on the board bytes alone, so neither call plays a move with `makeMove`.
  // A rebuild on the full filter (`fullLegalMoves`, `fullLegalCaptures`) still plays 20 and 8.
  it("hasLegalMove on the start position plays NO move (it was exactly one before ABC-254)", () => {
    const position = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    vi.clearAllMocks();

    expect(hasLegalMove(position)).toBe(true);
    expect(makeMove).toHaveBeenCalledTimes(0);
  });

  // ABC-261 (QE-254-b): the bar above cannot tell the early exit from `legalMoves(p).length > 0`,
  // because the lazy list plays no `makeMove` on the start position either. The attack tests can:
  // out of check, the early exit tests the first king move only, and the lazy list tests every king
  // move (the ABC-217 A2 / ABC-206 class). On this board production makes 2 calls (the check test
  // and the first king move); the lazy list makes 1 + 5.
  it("hasLegalMove out of check stops at the first legal king move: at most 2 attack tests", () => {
    const position = parseFen("4k3/8/8/8/8/8/PPP5/4K3 w - - 0 1");
    const pseudo = generateMoves(position);
    const kingMoves = pseudo.filter((move) => move.piece === KING).length;
    expect(isInCheck(position)).toBe(false);
    expect(pseudo[0]?.piece).toBe(KING); // the first generated move is a king move...
    expect(legalMoves(position)).toContainEqual(pseudo[0]); // ...and it is legal
    expect(kingMoves).toBeGreaterThanOrEqual(3); // so a full lazy list tests at least 1 + 3
    vi.clearAllMocks();

    expect(hasLegalMove(position)).toBe(true);
    const attackTests = vi.mocked(isSquareAttackedBy).mock.calls.length;
    expect(attackTests).toBeGreaterThan(0); // the spy sees legal.ts's calls, so the bar is live
    expect(attackTests).toBeLessThanOrEqual(2);
  });

  // ABC-262 (QE-261-a): the ABC-261 row above reads a king-first board only. Here the first
  // generated move is a pawn move, which out of check answers untested at once: production makes 1
  // call (the check test). A lost early exit pays the lazy list over the 8 king moves, and an
  // untested move that does not return at once pays one more test. Bound, like ABC-261's
  // precondition, to `generateMoves`' scan order.
  it("hasLegalMove out of check answers a pawn-first board at once: at most 1 attack test", () => {
    const position = parseFen("4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1");
    const pseudo = generateMoves(position);
    const kingMoves = pseudo.filter((move) => move.piece === KING).length;
    expect(isInCheck(position)).toBe(false);
    expect(pseudo[0]?.piece).toBe(PAWN); // the first generated move is a pawn move
    expect(kingMoves).toBeGreaterThanOrEqual(3); // so a lazy list without the early exit tests more
    vi.clearAllMocks();

    expect(hasLegalMove(position)).toBe(true);
    const attackTests = vi.mocked(isSquareAttackedBy).mock.calls.length;
    expect(attackTests).toBeGreaterThan(0); // the spy sees legal.ts's calls, so the bar is live
    expect(attackTests).toBeLessThanOrEqual(1);
  });

  it("legalCaptures on kiwipete plays none of the pseudo-legal captures (all of them before ABC-254)", () => {
    const position = parseFen(
      "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    );
    const pseudo = generateMoves(position);
    const captures = pseudo.filter((move) => move.captured !== EMPTY).length;
    expect(captures).toBeGreaterThan(0);
    expect(captures).toBeLessThan(pseudo.length); // so a full-list rebuild plays more
    vi.clearAllMocks();

    legalCaptures(position);
    expect(makeMove).toHaveBeenCalledTimes(0);
  });

  /**
   * ABC-235 cut 3 (P3): `legalCaptures` builds its list from `generateCaptures` and never from the
   * full generator. A reintroduced `generateMoves` call changes no returned value, so every value
   * row is blind to it; this count is not (the ABC-206 precedent above).
   */
  it("legalCaptures runs generateCaptures once and generateMoves never", () => {
    for (const fen of [
      "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
    ]) {
      const position = parseFen(fen);
      vi.clearAllMocks();
      legalCaptures(position);
      expect(generateMoves, fen).toHaveBeenCalledTimes(0);
      expect(generateCaptures, fen).toHaveBeenCalledTimes(1);
    }
  });

  /**
   * `ABC-229` (`ADR-0053` decisions 5 and 9, the one-pass row): out of check, the shipped rules
   * build captures and quiet queen promotions from ONE generation call per quiescence node, never
   * a second `generateMoves` or `legalMoves` pass (the probe's second pass cost 1.7x CPU at 1.01x
   * nodes, and changes no value). The node sits one ply below the cap, so its children stand pat
   * without generating: exactly one node generates, and it must generate once.
   */
  it("quiesce out of check generates once per node with quiet promotions on: one generateCaptures, no generateMoves", () => {
    for (const fen of [
      "8/P6k/8/8/8/8/8/K7 w - - 0 1", // QP-1, a quiet queen promotion and no capture
      "k7/8/8/8/8/8/p6K/8 b - - 0 1", // QP-9, black promotes
      "5r2/3qP2k/8/8/8/8/5PPP/3B2K1 w - - 0 1", // QP-5, captures and a quiet promotion
      "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", // kiwipete
    ]) {
      const position = parseFen(fen);
      vi.clearAllMocks();
      let visited = 0;
      quiesce(
        position,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        QUIESCENCE_MAX_PLY - 1,
        0,
        { evasions: true, quietPromotions: true },
        () => visited++,
        phaseOf(position),
      );
      expect(visited, fen).toBeGreaterThan(1); // the node and at least one child, so it expanded
      expect(generateCaptures, fen).toHaveBeenCalledTimes(1);
      expect(generateMoves, fen).toHaveBeenCalledTimes(0);
      expect(legalMoves, fen).toHaveBeenCalledTimes(0);
      expect(legalCaptures, fen).toHaveBeenCalledTimes(0);
      expect(legalCapturesAndQueenPromotions, fen).toHaveBeenCalledTimes(1);
    }
  });
});
