import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import { parseSquareName } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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

  it("reports a draw by threefold repetition when a position occurs a third time", () => {
    const position = parseFen(START_FEN);
    const counts = new Map<bigint, number>();
    const record = () => {
      const key = zobristKey(position);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    };
    const play = (from: string, to: string) => {
      const move = legalMoves(position).find(
        (candidate) =>
          candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
      );
      if (move === undefined) throw new Error(`no legal move ${from}${to}`);
      makeMove(position, move);
      record();
    };

    record(); // the start position, occurrence 1
    // Two full knight round-trips return to the exact start position twice more (each 4-ply
    // cycle: white knight out and back, black knight out and back).
    for (let cycle = 0; cycle < 2; cycle++) {
      play("g1", "f3");
      play("g8", "f6");
      play("f3", "g1");
      play("f6", "g8");
    }

    expect(gameStatus(position, counts)).toEqual({
      result: "draw",
      reason: "threefold-repetition",
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

  it("reports a draw by the fifty-move rule when the halfmove clock reaches 100", () => {
    // Clock at 99; a quiet non-pawn, non-capture rook move ticks it to 100.
    const position = parseFen("4k3/8/8/8/8/8/8/R3K3 w - - 99 60");
    const rookMove = legalMoves(position).find(
      (move) => move.from === parseSquareName("a1") && move.to === parseSquareName("a2"),
    );
    if (rookMove === undefined) throw new Error("expected a quiet rook move");
    makeMove(position, rookMove);

    expect(gameStatus(position)).toEqual({ result: "draw", reason: "fifty-move" });
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
