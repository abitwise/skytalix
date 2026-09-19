/**
 * NFR-005's no-ep sub-bar for `zobristKey`, as a permanent guard.
 *
 * The bar on `ABC-011` reads: `zobristKey` stays within 1.5x of the audit's per-call cost at
 * kiwipete/startpos, "and the no-ep-square path, which is the overwhelming majority of nodes, is
 * not made slower at all." The second half is the half no other test in this repo can fail.
 *
 * Under ADR-0005 the guard was a pair of spied call counts — `hasLegalEnPassant` called 0 times on
 * a no-ep position and exactly once on an ep-set one — because the ep component entered the key
 * through `epSquare !== NO_SQUARE && hasLegalEnPassant(position)` and only the call count could
 * see a reordering of those operands. ADR-0020 Decision 1 (ABC-075) removed the conjunct: "the
 * `hasLegalEnPassant(position)` conjunct is removed from the hash's definition" and `zobristKey`
 * is "a pure read of the board again — no probe move, no transient mutation, no `legal.ts` edge".
 * The no-ep guarantee is therefore STRUCTURAL now, and the spy rows became one: `zobristKey` calls
 * the predicate zero times on EVERY input, ep square or not. The "exactly once when set" row went
 * red under the ruling (0 calls, not 1) and was retired, not deleted from history — ADR-0020
 * Consequences names it.
 *
 * This lives in its own file on purpose, following `src/gameend.nfr.test.ts` (ABC-020): a `vi.mock`
 * factory is hoisted to file scope, so putting this in `zobrist.test.ts` would re-route the module
 * graph for every test there to buy one assertion. Here it re-routes nothing else.
 *
 * These are CALL-COUNT and BYTE-IDENTITY bars only. Wall-clock cost is NOT asserted anywhere in
 * this suite — it is machine-dependent, and it is measured with its machine and recorded in
 * `plans/nfr-catalog.md`.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseFen } from "./fen.ts";
import { NO_SQUARE } from "./position.ts";

vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return { ...actual, hasLegalEnPassant: vi.fn(actual.hasLegalEnPassant) };
});

const { hasLegalEnPassant } = await import("./legal.ts");
const { zobristKey } = await import("./zobrist.ts");

/** Ordinary positions carrying NO en-passant square — the overwhelming majority of search nodes. */
const NO_EP: [string, string][] = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["a bare king-and-pawn ending", "4k3/8/8/8/8/8/p7/4K3 b - - 0 1"],
];

/** Positions that DO carry an ep square — under ADR-0005 the only ones that paid for the predicate. */
const WITH_EP: [string, string][] = [
  ["ep set, no capture at all", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"],
  ["ep set, capture available", "rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"],
  ["ep set, pseudo-legal only", "7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1"],
];

describe("NFR-005 — zobristKey never consults hasLegalEnPassant (structural since ADR-0020, spied)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asks nothing on any input, with or without an ep square", () => {
    // The one row the two ADR-0005 spy rows became: the no-ep path runs exactly the code it ran
    // before ABC-011, and so does the ep-set path. Kills any re-introduction of a probe move into
    // the hash — the shape ADR-0020 removed and the audit called "the one place the current shape
    // does not simply extend".
    for (const [label, fen] of [...NO_EP, ...WITH_EP]) {
      vi.clearAllMocks();
      const position = parseFen(fen);

      zobristKey(position);

      expect(hasLegalEnPassant, label).toHaveBeenCalledTimes(0);
    }
  });
});

describe("NFR-005 — hasLegalEnPassant's own NO_SQUARE guard", () => {
  // CORRECTED at ABC-011's SECOND Security/NFR gate. This block was written when deleting the
  // predicate's internal early return ALONE put a stray pawn on OFF-BOARD square 15 of the 0x88
  // board, and the comment here said so. ABC-011's two guards changed that, and the old comment
  // would now mislead a reader about what these two cases defend.
  //
  // What is true after the fix, measured at that gate by deleting each combination in turn:
  //   early return gone, both guards present  -> false, board untouched (guard (a): `board[-1]`
  //                                              is `undefined`, and `undefined !== EMPTY`)
  //   early return gone + guard (a) gone      -> false, board untouched (guard (b) catches it)
  //   early return gone + guard (b) gone      -> false, board untouched (guard (a) catches it)
  //   early return gone + BOTH guards gone    -> the stray pawn on square 15 is back, and both
  //                                              cases below fail
  // So these two cases are now a THREE-deletion regression guard rather than a one-deletion kill.
  // They are kept, not deleted, because they are still the only thing in this repository that
  // fails when the last of those three defences goes, and the damage they describe is invisible
  // to `toFen`: it breaks the invariant `src/position.ts` states ("Off-board squares stay EMPTY
  // and are never read") that `kingSquareOf`'s whole-array `indexOf` scan leans on.
  //
  // Deleting the early return on its own is now a pure COST change, and through `zobristKey` it
  // costs NOTHING: `zobristKey` is the only production caller of this predicate and its own
  // `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters here at all.
  // NO per-call figure is quoted for the direct call, because this project's instrument cannot
  // support one — measured at the gate, the same benchmark reads +0.9 to +2.9 ns on cells where
  // this deletion's delta is STRUCTURALLY zero (an ep square is set, so the deleted branch is
  // never taken), which is the same size as the reading on the no-ep shape.
  // It is deliberately NOT pinned here: no spied call count distinguishes it (makeMove,
  // unmakeMove and isSquareAttackedBy are identical on 9 of 9 call shapes, at this predicate and
  // through `zobristKey`), and a wall-clock assertion would pass or fail on the machine that runs
  // it. What figures exist live in `plans/nfr-catalog.md` with their machine, which is this
  // file's standing rule.
  const NO_EP_PROBES: [string, string][] = [
    // Return value AND board both go wrong here: a2 holds the only candidate capturer and the
    // probe is not illegal, so the deletion makes the predicate answer `true` on a position with
    // no ep square at all.
    ["a candidate capturer, probe legal", "4k3/8/8/8/8/8/p7/4K3 b - - 0 1"],
    // Return value stays CORRECT here — the black king on a3 is discovered to the a1 rook the
    // moment the a2 pawn steps off, so the probe is illegal and the answer is `false` either way.
    // Only the board tells you anything happened. This is the case the byte assertion alone pins.
    ["a candidate capturer, probe illegal", "4K3/8/8/8/8/k7/p7/R7 b - - 0 1"],
  ];

  it.each(NO_EP_PROBES)("returns false and touches no board byte (%s)", (_label, fen) => {
    const position = parseFen(fen);
    expect(position.epSquare).toBe(NO_SQUARE);
    const before = Uint8Array.from(position.board);

    // The spy wraps the real implementation (`vi.fn(actual.hasLegalEnPassant)`), so calling it
    // here runs the shipped predicate, not a stub.
    expect(hasLegalEnPassant(position)).toBe(false);

    expect(Array.from(position.board)).toEqual(Array.from(before));
  });
});
