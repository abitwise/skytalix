import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import {
  type ClaimableDraw,
  type DrawClaims,
  type GameStatus,
  gameStatus,
  leafEndReason,
} from "./gameend.ts";
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
// QE review (ABC-020, In Review) — independent probes, each of which kills a mutant the
// delivered suite did not. Measured by mutating src/gameend.ts in a throwaway worktree: the
// four probes below were the surviving holes, and every one of them is an ORDER or an
// ASYMMETRY, which is the same class of defect as G-1 itself.
// ---------------------------------------------------------------------------

/** The G-1 shuffle with the colours swapped: WHITE's move makes the third occurrence. */
const G1_SHUFFLE_MIRROR = [
  ["a5", "b6"],
  ["g1", "h1"],
  ["b6", "a5"],
  ["h1", "g1"],
  ["a5", "b6"],
  ["g1", "h1"],
  ["b6", "a5"],
  ["h1", "g1"],
] as const;

describe("QE review — the claim's asymmetry, the check order, and the coupling", () => {
  it("gives the claim to Black when it is WHITE's move that makes the third occurrence", () => {
    // The played-line mirror of A1, and the half A7 does not reach: A7 flips the side to move
    // on a hand-built counts map, which cannot express who CREATED the occurrence. A1 has
    // Black create it and White claim; this has White create it and Black claim. An
    // implementation that attributed the claim to the creator passes exactly one of the two.
    const position = parseFen("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 0 1");
    const counts = new Map<bigint, number>();
    record(counts, position);
    for (const [from, to] of G1_SHUFFLE_MIRROR) {
      play(position, from, to);
      record(counts, position);
    }

    expect(gameStatus(position, counts)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "black", draws: ["threefold-repetition"] },
    });
  });

  it("decides no-legal-moves and thin material BEFORE the clock and the counts map", () => {
    // ABC-020's `## Out of scope` calls this ordering load-bearing and says A6 pins it. A6
    // pins checkmate against the CLOCK, which is a different pair: moving either check below
    // the 150-ply test or below the fivefold test changes no RESULT, only the reason, so no
    // existing whole-object assertion notices. Both mutants survived the delivered suite.
    // The `stalemate` label is QE gap G-4's known divergence — FIDE would call 5.2.2 the
    // operative article here. This pins the ORDER the ticket chose, not the label.
    const stalemated = parseFen("7k/5K2/5N2/8/8/8/8/8 b - - 150 90");
    expect(gameStatus(stalemated, new Map([[zobristKey(stalemated), 5]]))).toEqual({
      result: "draw",
      reason: "stalemate",
    });

    const bare = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 150 90");
    expect(gameStatus(bare, new Map([[zobristKey(bare), 5]]))).toEqual({
      result: "draw",
      reason: "insufficient-material",
    });
  });

  it("terminates the locked wall on a second no-progress line, not just A5's first-quiet one", () => {
    // A5 drives the FIRST quiet move at every ply. This drives the LAST legal move, which on
    // this board is also a king shuffle — an independent line reaching the same verdict, so
    // the 150-ply termination is a property of the position and not of A5's move filter.
    const position = parseFen("8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1");

    let plies = 0;
    let status = gameStatus(position);
    while (status.result === "in-progress" && plies < 400) {
      const moves = legalMoves(position);
      const move = moves[moves.length - 1];
      if (move === undefined) throw new Error(`no legal move at ply ${plies}`);
      makeMove(position, move);
      plies++;
      status = gameStatus(position);
    }

    expect(plies).toBe(150);
    expect(status).toEqual({ result: "draw", reason: "seventy-five-move" });
  });

  it("still terminates the locked wall on a line that DOES capture — 150 plies per epoch", () => {
    // A5's Given says the wall offers "no capture and no pawn move ... to either side". That
    // is true only at the starting position: a king that walks to rank 3 can take a loose pawn
    // on rank 4, and the pawn behind it is then free to move. Driving the first legal move at
    // every ply, the clock resets three times and the game runs PAST ply 150 — and still ends
    // automatically, 150 plies after the LAST irreversible move, which is what FIDE 9.6.2
    // actually bounds. This is the coupling A5 is about, pinned on the line A5 excludes: no
    // claim is ever made and the game cannot run forever either way.
    const position = parseFen("8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1");

    let plies = 0;
    let lastIrreversible = 0;
    let previousClock = position.halfmoveClock;
    let status = gameStatus(position);
    while (status.result === "in-progress" && plies < 400) {
      const move = legalMoves(position)[0];
      if (move === undefined) throw new Error(`no legal move at ply ${plies}`);
      makeMove(position, move);
      plies++;
      if (position.halfmoveClock < previousClock) lastIrreversible = plies;
      previousClock = position.halfmoveClock;
      status = gameStatus(position);
    }

    expect(status).toEqual({ result: "draw", reason: "seventy-five-move" });
    expect(lastIrreversible).toBeGreaterThan(0); // the line really does reset the clock
    expect(plies).toBeGreaterThan(150); // so the bound is NOT 150 from the starting FEN
    expect(plies - lastIrreversible).toBe(150); // it is 150 from the last irreversible move
  });
});

// ---------------------------------------------------------------------------
// QE review — the ratified shape's rule 3: state (b) spelled as `result: "draw"` is a COMPILE
// error, not a test failure. Nothing in the delivered suite guards it, so a later widening of
// the union would reinstate G-1 with every runtime assertion still green. Each
// `@ts-expect-error` below is checked by `npm run typecheck`: if the line stops being an
// error, tsc fails with "Unused '@ts-expect-error' directive".
// ---------------------------------------------------------------------------

/** A well-formed claim, so the negatives below fail for their own reason and not for this. */
const CLAIM: DrawClaims = { by: "white", draws: ["fifty-move"] };

describe("QE review — the forbidden states are unrepresentable", () => {
  it("cannot spell a claimable draw as a completed draw, or a claim without a claimant", () => {
    const forbidden: GameStatus[] = [
      // @ts-expect-error a claimable draw has not ended anything (FIDE 9.2)
      { result: "draw", reason: "threefold-repetition" },
      // @ts-expect-error nor has a claimable fifty-move draw (FIDE 9.3)
      { result: "draw", reason: "fifty-move" },
      // @ts-expect-error a terminal status carries no claim
      { result: "draw", reason: "stalemate", claimable: CLAIM },
      // @ts-expect-error an in-progress status carries no end reason
      { result: "in-progress", reason: "fivefold-repetition" },
      // @ts-expect-error there is no fourth result value
      { result: "claimable-draw", reason: null },
    ];
    expect(forbidden).toHaveLength(5);

    const unattributed: DrawClaims[] = [
      // @ts-expect-error `by` is required, so A7's defect is unrepresentable
      { draws: ["fifty-move"] },
    ];
    expect(unattributed).toHaveLength(1);
  });

  it("lets a consumer read the claim off the bare union with no narrowing", () => {
    // ABC-016's panel cell and ABC-021's prompt both depend on this being a one-liner.
    const status: GameStatus = gameStatus(parseFen(START_FEN));
    const draws: readonly ClaimableDraw[] = status.claimable?.draws ?? [];
    expect(draws).toEqual([]);
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

// ---------------------------------------------------------------------------
// ABC-206 A2 — the search leaf's game-end answer equals a bare `gameStatus` call. The lane
// walks the six perft FENs to depth 1, plus the terminal and clock FENs; `ENGINE_DEEP=1` walks
// the same roots to depth 3, as the ticket's A2 reads.
// ---------------------------------------------------------------------------

const RUN_DEEP = process.env.ENGINE_DEEP === "1";

const A2_FENS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["start", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
  ["checkmate", "4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80"],
  ["stalemate, thin", "7k/5K2/5N2/8/8/8/8/8 b - - 0 1"],
  ["stalemate, queen", "k7/8/1K6/8/8/8/8/2Q5 b - - 0 1"],
  ["insufficient material", "4k3/8/8/8/8/8/8/4K3 w - - 0 1"],
  ["seventy-five moves", "r3k3/8/8/8/8/8/8/4K2R w - - 150 120"],
  ["fifty-move claim, in progress", "r3k3/8/8/8/8/8/8/4K2R w - - 100 120"],
];

/** Every field of a Position, the 128 board bytes included, as one comparable string. */
const stateOf = (position: Position): string =>
  [
    position.board.join(","),
    position.blackToMove,
    position.castling,
    position.epSquare,
    position.halfmoveClock,
    position.fullmoveNumber,
  ].join("|");

describe("ABC-206 A2 — leafEndReason(p) === gameStatus(p).reason", () => {
  const leafRow = (depth: number) => () => {
    const reasons = new Map<string, number>();
    const walk = (position: Position, where: string, left: number): void => {
      const before = stateOf(position);
      const want = gameStatus(position).reason;
      expect(leafEndReason(position), where).toBe(want);
      expect(stateOf(position), where).toBe(before);
      reasons.set(String(want), (reasons.get(String(want)) ?? 0) + 1);
      if (left === 0) return;
      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);
        walk(position, `${where} ${move.from}-${move.to}`, left - 1);
        unmakeMove(position, move, undo);
      }
    };
    for (const [name, fen] of A2_FENS) walk(parseFen(fen), name, depth);

    // Every answer the leaf can give was reached, so no branch of it is unread.
    for (const reason of [
      "null",
      "checkmate",
      "stalemate",
      "insufficient-material",
      "seventy-five-move",
    ]) {
      expect(reasons.get(reason) ?? 0, reason).toBeGreaterThan(0);
    }
  };

  it("on the perft roots to depth 1 and every terminal or clock FEN; p is unchanged", leafRow(1));

  if (RUN_DEEP) {
    it("to depth 3 [deep, ENGINE_DEEP=1]", leafRow(3), 600_000);
  }
});
