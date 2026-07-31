import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import { EMPTY, PAWN, type Position, parseSquareName, pieceType } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Plays the named move on `position` in place, throwing if it is not legal there. */
function play(position: Position, from: string, to: string): void {
  const move = legalMoves(position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  makeMove(position, move);
}

/** Folds the position's Zobrist key into `counts`, as a caller holding the history would. */
function record(counts: Map<bigint, number>, position: Position): void {
  const key = zobristKey(position);
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

/**
 * Drives `cycles` knight round-trips from the start position: each 4-ply cycle (white knight
 * out and back, black knight out and back) returns to the exact start position, so `cycles`
 * of them make `cycles + 1` occurrences with White to move. Knights, not pawns, deliberately:
 * a repeated line must never set an en-passant square, which ABC-011 would hash into the key.
 */
function knightCycles(cycles: number): { position: Position; counts: Map<bigint, number> } {
  const position = parseFen(START_FEN);
  const counts = new Map<bigint, number>();

  record(counts, position); // the start position, occurrence 1
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (const [from, to] of [
      ["g1", "f3"],
      ["g8", "f6"],
      ["f3", "g1"],
      ["f6", "g8"],
    ] as const) {
      play(position, from, to);
      record(counts, position);
    }
  }

  return { position, counts };
}

// ---------------------------------------------------------------------------
// Acceptance — the seven Given/When/Then criteria on ABC-007. Each is a FEN (or a
// short move list, for repetition) with an exact expected verdict.
// ---------------------------------------------------------------------------

describe("ABC-007 acceptance", () => {
  it("reports checkmate and the winner from the fool's-mate position", () => {
    const fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(gameStatus(parseFen(fen))).toEqual({ result: "black-wins", reason: "checkmate" });
  });

  it("reports stalemate as a draw when the side to move has no move and is not in check", () => {
    const fen = "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1";
    expect(gameStatus(parseFen(fen))).toEqual({ result: "draw", reason: "stalemate" });
  });

  it("makes threefold repetition claimable at the third occurrence, and draws at the fifth", () => {
    // ABC-020 (A3): three and four occurrences are a CLAIM the side to move may decline; only
    // the fifth (FIDE 9.6.1) draws on its own. The count includes the current occurrence.
    const claimable = { by: "white", draws: ["threefold-repetition"] };

    const third = knightCycles(2);
    expect(gameStatus(third.position, third.counts)).toEqual({
      result: "in-progress",
      reason: null,
      claimable,
    });

    const fourth = knightCycles(3);
    expect(gameStatus(fourth.position, fourth.counts)).toEqual({
      result: "in-progress",
      reason: null,
      claimable,
    });

    const fifth = knightCycles(4);
    expect(gameStatus(fifth.position, fifth.counts)).toEqual({
      result: "draw",
      reason: "fivefold-repetition",
    });
  });

  it("does not report repetition for a position that is absent from the history", () => {
    // A counts map that holds a different position (three times) but not this one: the current
    // position has occurred zero recorded times, so it is not a repetition.
    const position = parseFen(START_FEN);
    const other = zobristKey(parseFen(START_FEN.replace(" w ", " b ")));
    const counts = new Map<bigint, number>([[other, 3]]);
    expect(gameStatus(position, counts)).toEqual({ result: "in-progress", reason: null });
  });

  it("makes the fifty-move draw claimable by the side to move when the clock reaches 100", () => {
    // Clock at 99; a quiet non-pawn, non-capture rook move ticks it to 100.
    const position = parseFen("4k3/8/8/8/8/8/8/R3K3 w - - 99 60");
    play(position, "a1", "a2");

    // ABC-020 (A7): WHITE made the move that reached 100, so the claim is BLACK's — the claim
    // belongs to the player having the move, never to the one who just moved. The call is bare,
    // which is also the proof that the 9.3 claim needs no counts map.
    expect(gameStatus(position)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "black", draws: ["fifty-move"] },
    });
  });

  it("reports a draw by insufficient material for king versus king", () => {
    expect(gameStatus(parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1"))).toEqual({
      result: "draw",
      reason: "insufficient-material",
    });
  });

  it("does NOT draw king-and-bishop versus king-and-bishop on opposite colours", () => {
    // White bishop c1 (dark), black bishop c8 (light) — mate is still constructible.
    const status = gameStatus(parseFen("2b1k3/8/8/8/8/8/8/2B1K3 w - - 0 1"));
    expect(status.result).toBe("in-progress");
    expect(status.reason).toBeNull();
  });

  it("reports in-progress with no reason for a normal position", () => {
    expect(gameStatus(parseFen(START_FEN))).toEqual({ result: "in-progress", reason: null });
  });
});

// ---------------------------------------------------------------------------
// Acceptance — ABC-020's ten criteria. FIDE 9.2/9.3 are a CLAIM by the player having the
// move, so a claimable draw is a game in progress; only 9.6's fivefold and 75-move draw
// automatically. Every FEN and move list below is QE's, driven against merged src.
// ---------------------------------------------------------------------------

/** QE's G-1 position: White to move has Re8#, and both sides can shuffle instead. */
const G1_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";

/** 1.Kh1 Bb6 2.Kg1 Ba5 3.Kh1 Bb6 4.Kg1 Ba5 — Black's move makes the third occurrence. */
const G1_SHUFFLE = [
  ["g1", "h1"],
  ["a5", "b6"],
  ["h1", "g1"],
  ["b6", "a5"],
  ["g1", "h1"],
  ["a5", "b6"],
  ["h1", "g1"],
  ["b6", "a5"],
] as const;

describe("ABC-020 acceptance", () => {
  it("A1 — the third occurrence is White's to claim, and White plays the mate instead", () => {
    const position = parseFen(G1_FEN);
    const counts = new Map<bigint, number>();
    record(counts, position);
    for (const [from, to] of G1_SHUFFLE) {
      play(position, from, to);
      record(counts, position);
    }

    expect(gameStatus(position, counts)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["threefold-repetition"] },
    });

    const re8 = legalMoves(position).some(
      (move) => move.from === parseSquareName("e1") && move.to === parseSquareName("e8"),
    );
    expect(re8).toBe(true);

    play(position, "e1", "e8");
    expect(gameStatus(position, counts)).toEqual({ result: "white-wins", reason: "checkmate" });
  });

  it("A2 — the fifty-move twin is White's to claim, and White mates instead", () => {
    const position = parseFen("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60");

    expect(gameStatus(position)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["fifty-move"] },
    });

    play(position, "e1", "e8");
    expect(gameStatus(position)).toEqual({ result: "white-wins", reason: "checkmate" });
  });

  it("A5 — the locked wall still terminates, on the 75-move backstop, with no claim made", () => {
    // QE's locked pawn wall: every pawn frozen by the pawn in front of it, and neither king can
    // cross the wall — the ranks beyond it are all covered by a pawn. Taking the fifty-move rule
    // away without FIDE 9.6.2 is what would make this game run forever, which is why the two
    // halves of ABC-020 land together. Every call below is BARE, so this is also A8's second
    // half: a caller with no counts map can never produce a non-terminating game.
    const position = parseFen("8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1");
    expect(legalMoves(position).length).toBe(3); // a1a2, a1b1, a1b2 — king moves, forever

    let plies = 0;
    let status = gameStatus(position);
    while (status.result === "in-progress" && plies < 150) {
      // Shuffle only: a king walk that took a loose pawn would reset the clock and restart the
      // 150-ply count, so the no-progress line is the one this criterion is about.
      const shuffle = legalMoves(position).find(
        (move) => move.captured === EMPTY && pieceType(move.piece) !== PAWN,
      );
      if (shuffle === undefined) throw new Error(`no quiet move at ply ${plies}`);
      makeMove(position, shuffle);
      plies++;
      status = gameStatus(position);
    }

    expect(plies).toBe(150);
    expect(status).toEqual({ result: "draw", reason: "seventy-five-move" });
  });

  it("A6 — checkmate still outranks the 75-move draw, not only the fifty-move claim", () => {
    // The clock-100 half of this guard is the merged ABC-007 probe below and does not change;
    // 150 is the half that is new, because 150 is now automatic where 100 no longer is.
    expect(gameStatus(parseFen("4Q2k/6pp/8/8/8/8/8/6K1 b - - 150 80"))).toEqual({
      result: "white-wins",
      reason: "checkmate",
    });
  });

  it("A7 — flip the side to move and the claim flips with it", () => {
    // The same board and the same three occurrences, the other player having the move. Flipping
    // changes the Zobrist key, so the counts map is built against the flipped position's key.
    const position = parseFen("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 8 5");
    const counts = new Map<bigint, number>([[zobristKey(position), 3]]);

    expect(gameStatus(position, counts)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "black", draws: ["threefold-repetition"] },
    });
  });

  it("A8 — a bare caller sees neither the fivefold draw nor the threefold claim", () => {
    // Five occurrences on the board and no counts map in hand: the documented consequence of
    // ADR-0002 clause 4, pinned here as a test rather than argued about later.
    const { position } = knightCycles(4);

    expect(gameStatus(position)).toEqual({ result: "in-progress", reason: null });
  });
});

// ---------------------------------------------------------------------------
// Unit — the claim set itself: what goes into it, in what order, and whether the property is
// there at all. The criteria above assert the verdicts; these assert the seam beneath them.
// ---------------------------------------------------------------------------

describe("the claimable set", () => {
  const claimsAt = (occurrences: number, clock: number) => {
    const position = parseFen(`4k3/8/8/8/8/8/8/R3K3 w - - ${clock} 60`);
    return gameStatus(position, new Map([[zobristKey(position), occurrences]]));
  };

  it("reports both draws when both hold, threefold first", () => {
    expect(claimsAt(3, 100).claimable).toEqual({
      by: "white",
      draws: ["threefold-repetition", "fifty-move"],
    });
  });

  it("offers no threefold claim at the second occurrence", () => {
    expect(claimsAt(2, 0).claimable).toBeUndefined();
  });

  it("omits the claimable property entirely rather than carrying an empty one", () => {
    // Load-bearing, and not the same assertion as the one above: an extra property survives a
    // whole-object toEqual only while it is ABSENT. `null` or `[]` here would break every
    // status assertion in this file that was written before claims existed.
    expect(Object.hasOwn(claimsAt(2, 0), "claimable")).toBe(false);
  });

  it("lets an automatic draw outrank a claim that holds at the same time", () => {
    expect(claimsAt(3, 150)).toEqual({ result: "draw", reason: "seventy-five-move" });
    expect(claimsAt(5, 100)).toEqual({ result: "draw", reason: "fivefold-repetition" });
  });
});

// ---------------------------------------------------------------------------
// Unit — the insufficient-material table, the rule easiest to get subtly wrong.
// ---------------------------------------------------------------------------

describe("insufficient material", () => {
  const draws: Array<[string, string]> = [
    ["K vs K", "4k3/8/8/8/8/8/8/4K3 w - - 0 1"],
    ["K+N vs K", "4k3/8/8/8/8/8/8/1N2K3 w - - 0 1"],
    ["K+B vs K", "4k3/8/8/8/8/8/8/2B1K3 w - - 0 1"],
    ["K+B vs K+B same colour", "4kb2/8/8/8/8/8/8/2B1K3 w - - 0 1"],
  ];
  for (const [name, fen] of draws) {
    it(`draws ${name}`, () => {
      expect(gameStatus(parseFen(fen))).toEqual({
        result: "draw",
        reason: "insufficient-material",
      });
    });
  }

  const notDraws: Array<[string, string]> = [
    ["a lone pawn (K+P vs K)", "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1"],
    ["a rook (K+R vs K)", "4k3/8/8/8/8/8/8/R3K3 w - - 0 1"],
    ["bishop vs knight, opposite armies", "2b1k3/8/8/8/8/8/8/1N2K3 w - - 0 1"],
  ];
  for (const [name, fen] of notDraws) {
    it(`does not draw with ${name}`, () => {
      expect(gameStatus(parseFen(fen)).reason).not.toBe("insufficient-material");
    });
  }
});

// QE probes: a checkmate the wrong way round (Black delivers... White delivers), and the
// precedence of mate over a thin-material or high-clock position.
describe("ABC-007 QE edge probes", () => {
  it("reports white-wins when White delivers mate (the colour mirror of fool's mate)", () => {
    // Back-rank mate: white queen e8 checks the black king h8 along the clear 8th rank; the
    // king's own g7/h7 pawns wall off every escape.
    const status = gameStatus(parseFen("4Q2k/6pp/8/8/8/8/8/6K1 b - - 0 1"));
    expect(status).toEqual({ result: "white-wins", reason: "checkmate" });
  });

  it("prefers checkmate over the fifty-move rule when both could apply", () => {
    // The same back-rank mate with the halfmove clock already at 100 — the mate wins, not a draw.
    const status = gameStatus(parseFen("4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80"));
    expect(status.reason).toBe("checkmate");
    expect(status.result).toBe("white-wins");
  });
});

// ---------------------------------------------------------------------------
// QE conformance audit — the two tables the perft suite cannot reach. `npm run perft` counts
// nodes and never calls gameStatus, so every draw rule below rests on these assertions alone.
// ---------------------------------------------------------------------------

describe("dead by material (FIDE 5.2.2), across the combinations that decide it", () => {
  // The FIDE test is "mate is IMPOSSIBLE", not "mate cannot be forced". KNN vs K separates the
  // two: no forced mate exists, but a mate does, so the game must run on. Bishop square colours
  // — not the piece counts — decide the last four rows either way.
  const dead: Array<[string, string]> = [
    ["KBB vs K, both bishops on one colour (b1, f1)", "4k3/8/8/8/8/8/8/1B2KB2 w - - 0 1"],
    ["KBB vs KB, all three bishops on one colour", "2b1k3/8/8/8/8/8/8/1B2KB2 w - - 0 1"],
  ];
  for (const [name, fen] of dead) {
    it(`draws ${name}`, () => {
      expect(gameStatus(parseFen(fen))).toEqual({
        result: "draw",
        reason: "insufficient-material",
      });
    });
  }

  const alive: Array<[string, string]> = [
    ["KNN vs K — unforceable, but mate is constructible", "4k3/8/8/8/8/8/8/1N2K1N1 w - - 0 1"],
    ["KN vs KN", "1n2k3/8/8/8/8/8/8/1N2K3 w - - 0 1"],
    ["KBN vs K — a forced mate", "4k3/8/8/8/8/8/8/1N1BK3 w - - 0 1"],
    ["KBB vs K on opposite colours (c1, f1)", "4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1"],
    ["KBB on one colour vs KB on the other (f8)", "5b2/4k3/8/8/8/8/8/1B2KB2 w - - 0 1"],
    ["KQ vs K", "4k3/8/8/8/8/8/8/3QK3 w - - 0 1"],
  ];
  for (const [name, fen] of alive) {
    it(`does not draw ${name}`, () => {
      expect(gameStatus(parseFen(fen))).toEqual({ result: "in-progress", reason: null });
    });
  }
});

describe("fifty-move rule — the halfmove-clock boundary", () => {
  // 50 moves by EACH player is 100 plies, so 99 is one ply short: Black has made only 49.
  const atClock = (plies: number) => gameStatus(parseFen(`4k3/8/8/8/8/8/8/R3K3 w - - ${plies} 60`));

  it("does not draw at 99 plies", () => {
    expect(atClock(99)).toEqual({ result: "in-progress", reason: null });
    // The other half of the boundary: nothing is claimable either, one ply short.
    expect(atClock(99).claimable).toBeUndefined();
  });

  it("makes the draw claimable at exactly 100 plies", () => {
    expect(atClock(100)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["fifty-move"] },
    });
  });

  it("is still only claimable at 149 plies, one ply short of the automatic draw", () => {
    expect(atClock(149)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["fifty-move"] },
    });
  });

  it("draws automatically at 150 plies, the seventy-five-move backstop", () => {
    // ABC-020 (A4): 150 plies is 75 moves by EACH player — FIDE 9.6.2, and no claim is needed.
    expect(atClock(150)).toEqual({ result: "draw", reason: "seventy-five-move" });
  });
});
