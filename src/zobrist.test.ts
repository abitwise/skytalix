import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { generateMoves } from "./moves.ts";
import { parseSquareName } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("zobristKey", () => {
  it("is deterministic — the same position hashes to the same key", () => {
    expect(zobristKey(parseFen(START_FEN))).toBe(zobristKey(parseFen(START_FEN)));
  });

  it("ignores the move counters, which do not affect repetition", () => {
    const a = parseFen(START_FEN);
    const b = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 7 20");
    expect(zobristKey(a)).toBe(zobristKey(b));
  });

  it("depends on the side to move", () => {
    const white = zobristKey(parseFen(START_FEN));
    const black = zobristKey(parseFen(START_FEN.replace(" w ", " b ")));
    expect(white).not.toBe(black);
  });

  it("depends on castling rights", () => {
    const all = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"));
    const some = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w Kkq - 0 1"));
    expect(all).not.toBe(some);
  });

  it("depends on en-passant availability", () => {
    const withEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1"));
    expect(withEp).not.toBe(withoutEp);
  });

  it("restores the key exactly after a move is made and unmade", () => {
    const position = parseFen(START_FEN);
    const before = zobristKey(position);
    const move = generateMoves(position).find(
      (candidate) =>
        candidate.from === parseSquareName("e2") && candidate.to === parseSquareName("e4"),
    );
    if (move === undefined) throw new Error("expected e2-e4");

    const undo = makeMove(position, move);
    expect(zobristKey(position)).not.toBe(before); // the position genuinely changed
    unmakeMove(position, move, undo);
    expect(zobristKey(position)).toBe(before); // and comes all the way back
  });
});
