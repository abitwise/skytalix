import { describe, expect, it } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_PROMOTION, type Move } from "./moves.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK, squareName } from "./position.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/**
 * A2's FEN AS PRINTED ON THE TICKET. It is defective and the criterion cannot be met with it:
 * the two kings stand on e2 and e1, ADJACENT, which is not a legal chess position. White is
 * therefore "in check" from the black king and the ONLY legal move is `e1e2` — there is no
 * promotion to select and no ambiguity to collect. Measured, not asserted: see the test row
 * below, which pins that fact so the repair can be verified. Repair is BA/PM's; this file does
 * not edit the ticket.
 */
const A2_FEN_AS_WRITTEN = "8/4P3/8/8/8/8/4k3/4K3 w - - 0 1";
/**
 * The same position with the black king moved off the white king's neighbourhood (e2 -> e3) and
 * nothing else changed. White pawn on e7, both kings legal, white not in check: `e7e8` now has
 * exactly the four promotion moves A2 describes. This is the minimal correction that makes A2's
 * stated behaviour observable.
 */
const PROMOTION_FEN = "8/4P3/8/8/8/4k3/8/4K3 w - - 0 1";

/** The six perft positions, transcribed from `src/perft.test.ts` — A5's named corpus, not a new one. */
const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["startpos", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

const PROMOTION_LETTERS: Readonly<Record<number, string>> = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n",
};

/** The coordinate string for a move — `from` + `to` + the promotion letter when there is one. */
function coordinateOf(move: Move): string {
  const promotion =
    (move.flags & FLAG_PROMOTION) === 0 ? "" : (PROMOTION_LETTERS[move.promotion] as string);
  return `${squareName(move.from)}${squareName(move.to)}${promotion}`;
}

// ---------------------------------------------------------------------------
// Acceptance — ABC-031's A1-A6. Every move assertion is reference identity
// (`===`) against an element of the ONE `legal` array handed to the call:
// deep equality passes a fabricated Move and cannot see an ADR-0004 (2b)
// violation at all. No fixture in this file constructs a Move.
// A7 is a property of the delivered diff and is asserted by the gate, not here.
// ---------------------------------------------------------------------------

describe("ABC-031 A1 — the four accepted forms are one move", () => {
  const position = parseFen(START_FEN);
  const legal = legalMoves(position);
  const e2e4 = legal.find(
    (move) => squareName(move.from) === "e2" && squareName(move.to) === "e4",
  ) as Move;

  for (const text of ["e2e4", "E2E4", "e2-e4", "  e2e4  "]) {
    it(`resolves ${JSON.stringify(text)} to the same element of legal, by reference`, () => {
      const result = parseCoordinateMove(position, text, legal);
      expect(result.outcome).toBe("move");
      if (result.outcome !== "move") return;
      expect(result.move).toBe(e2e4);
    });
  }
});

describe("ABC-031 A2 — the promotion letter selects one of four", () => {
  const position = parseFen(PROMOTION_FEN);
  const legal = legalMoves(position);

  it("resolves 'e7e8q' to the queen promotion, by reference", () => {
    const expected = legal.find(
      (move) => (move.flags & FLAG_PROMOTION) !== 0 && move.promotion === QUEEN,
    ) as Move;
    const result = parseCoordinateMove(position, "e7e8q", legal);
    expect(result.outcome).toBe("move");
    if (result.outcome !== "move") return;
    expect(result.move.promotion).toBe(QUEEN);
    expect(result.move).toBe(expected);
  });

  it("resolves 'e7e8' to ambiguous with exactly 4 candidates from legal", () => {
    const result = parseCoordinateMove(position, "e7e8", legal);
    expect(result.outcome).toBe("ambiguous");
    if (result.outcome !== "ambiguous") return;
    expect(result.candidates).toHaveLength(4);
    for (const candidate of result.candidates) {
      expect(legal.includes(candidate)).toBe(true);
      expect(squareName(candidate.from)).toBe("e7");
      expect(squareName(candidate.to)).toBe("e8");
    }
    expect(new Set(result.candidates.map((candidate) => candidate.promotion)).size).toBe(4);
  });

  it("records why A2's printed FEN cannot carry the criterion: its kings are adjacent", () => {
    const asWritten = parseFen(A2_FEN_AS_WRITTEN);
    // e2/e1 kings: white is in check from the black king and no promotion is legal at all.
    expect(
      legalMoves(asWritten).map((move) => squareName(move.from) + squareName(move.to)),
    ).toEqual(["e1e2"]);
  });
});

describe("ABC-031 A3 — rejection is classified, not merged", () => {
  const position = parseFen(START_FEN);
  const legal = legalMoves(position);

  /** The reason for a string, or a marker the assertions below can print. */
  function reasonFor(text: string): string {
    const result = parseCoordinateMove(position, text, legal);
    return result.outcome === "rejected" ? result.reason : `NOT-REJECTED:${result.outcome}`;
  }

  it("rejects 'e2e5' as a well-formed coordinate that names no legal move", () => {
    expect(reasonFor("e2e5")).toBe("no-such-move");
  });

  for (const text of ["zz9q", "e2e4e5", "", "e9e4"]) {
    it(`rejects ${JSON.stringify(text)} as unreadable`, () => {
      expect(reasonFor(text)).toBe("unreadable");
    });
  }

  it("never collapses the two reasons onto one code", () => {
    expect(reasonFor("e2e5")).not.toBe(reasonFor("zz9q"));
  });
});

describe("ABC-031 A4 — totality: it never throws", () => {
  const position = parseFen(START_FEN);
  const legal = legalMoves(position);
  // The declared parameter is `string`; these are the runtime values a loop can hand it
  // anyway, which is exactly what A4 is about. The cast is the point of the criterion.
  const hostile: ReadonlyArray<readonly [label: string, value: unknown]> = [
    ["null", null],
    ["undefined", undefined],
    ["42", 42],
    ["{}", {}],
    ["[]", []],
    ["a 10,000-character string", "e".repeat(10_000)],
  ];

  for (const [label, value] of hostile) {
    it(`returns rejected and throws nothing for ${label}`, () => {
      const call = () => parseCoordinateMove(position, value as string, legal);
      expect(call).not.toThrow();
      expect(call().outcome).toBe("rejected");
    });
  }
});

describe("ABC-031 A5 — provenance over the six perft positions", () => {
  for (const [name, fen] of PERFT_POSITIONS) {
    it(`resolves every legal move of ${name} back to the same object, by reference`, () => {
      const position = parseFen(fen);
      const legal = legalMoves(position);
      expect(legal.length).toBeGreaterThan(0);

      for (const move of legal) {
        const text = coordinateOf(move);
        const result = parseCoordinateMove(position, text, legal);
        // The input is named in the failure message: a verdict without its input is unusable.
        expect(`${text} -> ${result.outcome}`).toBe(`${text} -> move`);
        if (result.outcome !== "move") continue;
        expect(result.move === move, `${text} resolved to a different object`).toBe(true);
      }
    });
  }
});

describe("ABC-031 A6 — the supplied list is the list that is used", () => {
  it("returns an element of the exact array handed to the call", () => {
    const position = parseFen(START_FEN);
    const legal = legalMoves(position);
    // A second generation of the same position: field-equal, reference-distinct. A function
    // that generated its own list would return one of THESE objects and fail the identity test.
    const other = legalMoves(position);

    const result = parseCoordinateMove(position, "e2e4", legal);
    expect(result.outcome).toBe("move");
    if (result.outcome !== "move") return;
    expect(legal.includes(result.move)).toBe(true);
    expect(other.includes(result.move)).toBe(false);
  });
});
