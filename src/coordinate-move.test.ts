import { describe, expect, it } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { FenError, parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, FLAG_PROMOTION, type Move } from "./moves.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK, squareName } from "./position.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/**
 * A2's FEN AS PRINTED ON THE TICKET. It is defective and the criterion cannot be met with it:
 * the two kings stand on e2 and e1, ADJACENT, which is not a legal chess position — black, the
 * side not to move, is in check. Since ABC-010 (ADR-0033) `parseFen` rejects it, so it never
 * reaches the generator; the test row below pins that rejection. Repair is BA/PM's; this file
 * does not edit the ticket.
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
    // e2/e1 kings: the side not to move is in check, so the boundary refuses the board.
    expect(() => parseFen(A2_FEN_AS_WRITTEN)).toThrow(FenError);
    expect(() => parseFen(A2_FEN_AS_WRITTEN)).toThrow(/^side not to move \(black\) is in check/);
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

// ---------------------------------------------------------------------------
// Added at the QE hop (task `quality-gate-ABC-031-qe-2026-08-17`), by mutation
// testing against ABC-031's A1-A7. These rows close three gaps where a mutant
// of `src/coordinate-move.ts` stayed GREEN through the whole 895-row suite.
// They ADD coverage only: no existing row was weakened, skipped or deleted, and
// no new test FILE is created, so the ticket's `## Lane cost` of ONE file holds.
// The production module is byte-identical to the engineer's delivery.
// ---------------------------------------------------------------------------

describe("ABC-031 QE — the out-of-scope grammar fence is closed", () => {
  const position = parseFen(START_FEN);
  const legal = legalMoves(position);

  // GAP 1. `## Out of scope` forbids every tolerance not named in `## Scope` —
  // "No `e2 e4`, no `e2,e4`, no `P-K4`, no SAN-ish input" — and coding rules 5
  // and 7 are cited for it. No A1-A7 row watched that fence: a mutant widening
  // COORDINATE to /^([a-h][1-8])[-,. ]*([a-h][1-8])([qrbn])?$/ passed 895/895.
  // Each of these names a string that is a LEGAL move on the board if the
  // grammar is widened, so a widened grammar returns `move` and reds this row.
  for (const text of ["e2 e4", "e2,e4", "e2--e4", "e2.e4", "e2\te4", "e2-e4-", "e2e4-"]) {
    it(`rejects ${JSON.stringify(text)} as unreadable — separator not in Scope`, () => {
      const result = parseCoordinateMove(position, text, legal);
      expect(`${JSON.stringify(text)} -> ${result.outcome}`).toBe(
        `${JSON.stringify(text)} -> rejected`,
      );
      if (result.outcome !== "rejected") return;
      expect(result.reason).toBe("unreadable");
    });
  }

  // This module holds no piece letter, no capture marker and no castle string
  // (ADR-0004 clause 2: two grammars in one module is the thing to avoid).
  for (const text of ["Nf3", "O-O", "O-O-O", "P-K4", "e4", "exd5", "Ng1f3"]) {
    it(`rejects ${JSON.stringify(text)} as unreadable — not this module's grammar`, () => {
      const result = parseCoordinateMove(position, text, legal);
      expect(`${JSON.stringify(text)} -> ${result.outcome}`).toBe(
        `${JSON.stringify(text)} -> rejected`,
      );
    });
  }
});

describe("ABC-031 QE — the `legal`-omitted call is a contract path and must work", () => {
  // GAP 2. `## Scope` makes `legal` OPTIONAL, so `parseCoordinateMove(position, text)`
  // is a supported call. Every A1-A6 row supplies `legal`, so the `legal ?? legalMoves(position)`
  // fallback was executed by NO test: replacing it with `legal ?? []` passed 895/895 AND
  // typechecked. A caller such as ABC-033 using the two-argument form would then get
  // `rejected`/`no-such-move` for every legal move on the board, silently.
  const position = parseFen(START_FEN);

  it("resolves 'e2e4' to a move when `legal` is not supplied", () => {
    const result = parseCoordinateMove(position, "e2e4");
    expect(result.outcome).toBe("move");
    if (result.outcome !== "move") return;
    // Provenance still holds against a freshly generated list: field-equal to the real
    // move, and it must be one the generator produced, not one built from the text.
    const regenerated = legalMoves(position);
    const twin = regenerated.find(
      (move) => squareName(move.from) === "e2" && squareName(move.to) === "e4",
    ) as Move;
    expect(result.move).toEqual(twin);
    expect(result.move.piece).toBe(twin.piece);
    expect(result.move.flags).toBe(twin.flags);
    expect(result.move.captured).toBe(twin.captured);
  });

  it("still classifies both rejection reasons when `legal` is not supplied", () => {
    const wellFormed = parseCoordinateMove(position, "e2e5");
    const garbage = parseCoordinateMove(position, "zz9q");
    expect(wellFormed.outcome).toBe("rejected");
    expect(garbage.outcome).toBe("rejected");
    if (wellFormed.outcome !== "rejected" || garbage.outcome !== "rejected") return;
    expect(wellFormed.reason).toBe("no-such-move");
    expect(garbage.reason).toBe("unreadable");
  });

  it("still returns ambiguous for a bare promotion when `legal` is not supplied", () => {
    const result = parseCoordinateMove(parseFen(PROMOTION_FEN), "e7e8");
    expect(result.outcome).toBe("ambiguous");
    if (result.outcome !== "ambiguous") return;
    expect(result.candidates).toHaveLength(4);
  });
});

describe("ABC-031 QE — en-passant provenance, the ADR-0004 (2b) site A5's corpus misses", () => {
  // GAP 3. Measured over A5's six perft positions: 178 legal moves, 3 castles,
  // 4 promotions, 19 captures — and ZERO en-passant moves (all six FENs carry `-`
  // as the ep square). So A5, the criterion that exists to catch a fabricated
  // `captured`, never renders the one move where `captured` names a piece that is
  // NOT standing on `to`. That is precisely `src/apply.ts:109`, the arm ADR-0004
  // (2b) names as materialising the captured pawn from `move.captured` on unmake.
  const EN_PASSANT_FEN = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1";

  it("resolves 'e5d6' to the en-passant move itself, by reference", () => {
    const position = parseFen(EN_PASSANT_FEN);
    const legal = legalMoves(position);
    const enPassant = legal.find((move) => (move.flags & FLAG_EN_PASSANT) !== 0) as Move;
    expect(enPassant).toBeDefined();

    const result = parseCoordinateMove(position, "e5d6", legal);
    expect(`e5d6 -> ${result.outcome}`).toBe("e5d6 -> move");
    if (result.outcome !== "move") return;
    expect(result.move).toBe(enPassant);
    // The two fields a constructed Move gets wrong here, asserted off the generator's
    // own object rather than hand-rolled: the captured pawn is not on `to`.
    expect(result.move.flags & FLAG_EN_PASSANT).not.toBe(0);
    expect(result.move.captured).not.toBe(0);
  });

  it("resolves every legal move of the en-passant position back by reference", () => {
    const position = parseFen(EN_PASSANT_FEN);
    const legal = legalMoves(position);
    expect(legal.length).toBeGreaterThan(0);
    for (const move of legal) {
      const text = coordinateOf(move);
      const result = parseCoordinateMove(position, text, legal);
      expect(`${text} -> ${result.outcome}`).toBe(`${text} -> move`);
      if (result.outcome !== "move") continue;
      expect(result.move === move, `${text} resolved to a different object`).toBe(true);
    }
  });
});
