import { describe, expect, it, vi } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import { assembleFrame, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import { type GameHistory, gameStatusOf, newGame } from "./history.ts";
import { renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import { type MoveInputDeps, resolveMoveInput } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { renderBoard } from "./render.ts";
import { parseSan, toSan } from "./san.ts";
import { renderStatusPanel } from "./status-panel.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * A2 — white knights on b1 and f3, both of which reach d2, so `Nd2` names two legal moves. The
 * white king on e1 also reaches d2, which is deliberate: it proves the candidate list is the SAN
 * grammar's answer (`Nbd2`, `Nfd2`) and not "everything that can go to d2".
 */
const TWO_KNIGHTS_FEN = "4k3/8/8/8/8/5N2/8/1N2K3 w - - 0 1";
/** A3 row 1 — bishop e2 takes on c4, and there is no white pawn on b3, so `bxc4` names nothing. */
const BISHOP_ONLY_FEN = "4k3/8/8/8/2n5/8/4B3/4K3 w - - 0 1";
/** A3 row 2 — pawn b3 AND bishop e2 both capture on c4: `bxc4` and `Bxc4` are both legal. */
const BOTH_CAPTURES_FEN = "4k3/8/8/8/2n5/1P6/4B3/4K3 w - - 0 1";
/** A3 row 3 — the pawn capture only. No bishop, so the fold has nothing extra to find. */
const PAWN_ONLY_FEN = "4k3/8/8/8/2n5/1P6/8/4K3 w - - 0 1";
/** A4 — `e7d8` is four promotion captures, the widest candidate list a coordinate can produce. */
const PROMOTION_CAPTURE_FEN = "3q1k2/4P3/8/8/8/8/8/4K3 w - - 0 1";
/**
 * A4's adversarial rows — NOT positions from a game, deliberately. Five white knights all reach d2
 * and six white queens all take on d4, which is the widest candidate list this module was able to
 * produce at all, so the frame is measured against the worst case found rather than the pleasant
 * one. Both are legal positions and both round-trip below.
 */
const FIVE_KNIGHTS_FEN = "4k3/8/8/8/2N1N3/1N3N2/8/1N3KN1 w - - 0 1";
const SIX_QUEENS_FEN = "3Q1k2/8/1Q4Q1/8/Q2q3Q/8/1Q6/3Q1K2 w - - 0 1";
/** The folded castle case — `o-o` / `o-o-o`, which `parseSan` refuses case-exact, deliberately. */
const CASTLE_FEN = "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1";

/**
 * Test note 5: the fixtures are round-tripped through `toFen` before anything is believed of them.
 * A mis-transcribed FEN that still parses produces a position where the criterion is vacuous.
 */
describe("fixtures — every FEN in this file round-trips through toFen", () => {
  for (const fen of [
    START_FEN,
    TWO_KNIGHTS_FEN,
    BISHOP_ONLY_FEN,
    BOTH_CAPTURES_FEN,
    PAWN_ONLY_FEN,
    PROMOTION_CAPTURE_FEN,
    CASTLE_FEN,
    FIVE_KNIGHTS_FEN,
    SIX_QUEENS_FEN,
  ]) {
    it(`round-trips ${fen}`, () => {
      expect(toFen(newGame(fen).position)).toBe(fen);
    });
  }
});

/**
 * The production behaviour with the resolver seam SPIED rather than replaced: every call goes to
 * the real function, and the spies exist so `A5`'s count and `A3`'s attempt order are observable.
 * `legalMoves` returns THE SAME array on every call in a fixture, which is what makes `A1`'s
 * reference identity across four independent submissions assertable at all.
 */
function spied(history: GameHistory): {
  readonly deps: MoveInputDeps;
  readonly legal: readonly Move[];
  readonly derives: () => number;
  readonly sanTexts: () => string[];
  readonly coordinateTexts: () => string[];
} {
  const legal = legalMoves(history.position);
  const deriveLegal = vi.fn(() => legal);
  const coordinate = vi.fn(parseCoordinateMove);
  const san = vi.fn(parseSan);
  return {
    deps: { legalMoves: deriveLegal, parseCoordinateMove: coordinate, parseSan: san },
    legal,
    derives: () => deriveLegal.mock.calls.length,
    sanTexts: () => san.mock.calls.map((call) => call[1]),
    coordinateTexts: () => coordinate.mock.calls.map((call) => call[1]),
  };
}

/** The SAN of a move against the fixture's own legal list — never a hand-written string. */
const sanOf = (history: GameHistory, move: Move, legal: readonly Move[]): string =>
  toSan(history.position, move, legal);

/** The one legal move whose SAN is `text`. Fails loudly rather than returning `undefined`. */
function moveNamed(history: GameHistory, legal: readonly Move[], text: string): Move {
  const found = legal.filter((move) => sanOf(history, move, legal) === text);
  expect(found).toHaveLength(1);
  return found[0] as Move;
}

// ---------------------------------------------------------------------------
// Acceptance — ABC-033's A1-A6. A7 is a property of the delivered diff and is
// asserted by the gate (`git diff --numstat`), not here.
// ---------------------------------------------------------------------------

describe("ABC-033 A1 — both formats, one prompt, no mode switch", () => {
  it("resolves e4, e2e4, E2E4 and e2-e4 to the SAME legal move by reference", () => {
    const history = newGame(START_FEN);
    const seam = spied(history);
    const before = toFen(history.position);

    const outcomes = ["e4", "e2e4", "E2E4", "e2-e4"].map((line) =>
      // No state is carried between the four calls: each is a fresh submission.
      resolveMoveInput(history, line, seam.deps),
    );

    for (const outcome of outcomes) expect(outcome.kind).toBe("move");
    const moves = outcomes.map((outcome) => (outcome as { move: Move }).move);
    // Reference identity, not deep equality: a fabricated Move passes `toEqual` and would hide an
    // ADR-0004 (2b) violation completely.
    expect(seam.legal).toContain(moves[0]);
    expect(moves[1]).toBe(moves[0]);
    expect(moves[2]).toBe(moves[0]);
    expect(moves[3]).toBe(moves[0]);
    expect(sanOf(history, moves[0] as Move, seam.legal)).toBe("e4");
    // Asking never applies: four submissions, no ply.
    expect(toFen(history.position)).toBe(before);
    expect(history.moves).toHaveLength(0);
  });
});

describe("ABC-033 A2 — ambiguity lists the candidates in SAN", () => {
  it("returns ambiguous with exactly 2 messages naming Nbd2 and Nfd2", () => {
    const history = newGame(TWO_KNIGHTS_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "Nd2", seam.deps);

    expect(outcome.kind).toBe("ambiguous");
    const messages = (outcome as { messages: readonly string[] }).messages;
    expect(messages).toHaveLength(2);
    expect([...messages].sort()).toEqual(["Nbd2", "Nfd2"]);
  });

  // Separately, per test note 1: a content assertion alone stays green through a build that lists
  // the candidates and THEN plays one of them.
  it("applies nothing — toFen is byte-identical and the ply did not advance", () => {
    const history = newGame(TWO_KNIGHTS_FEN);
    const seam = spied(history);
    const before = toFen(history.position);
    const pliesBefore = history.moves.length;

    resolveMoveInput(history, "Nd2", seam.deps);

    expect(toFen(history.position)).toBe(before);
    expect(history.moves).toHaveLength(pliesBefore);
  });
});

describe("ABC-033 A3 — the case-folded retry, both directions", () => {
  it("row 1: bxc4 resolves to the bishop capture when only Bxc4 is legal", () => {
    const history = newGame(BISHOP_ONLY_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "bxc4", seam.deps);

    expect(outcome.kind).toBe("move");
    expect((outcome as { move: Move }).move).toBe(moveNamed(history, seam.legal, "Bxc4"));
    // It got there on the FOLD: the exact attempt was made first, with the line as typed.
    expect(seam.sanTexts()[0]).toBe("bxc4");
    expect(seam.sanTexts()).toContain("Bxc4");
  });

  it("row 2: BXC4 is ambiguous with exactly 2 candidates when both captures are legal", () => {
    const history = newGame(BOTH_CAPTURES_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "BXC4", seam.deps);

    expect(outcome.kind).toBe("ambiguous");
    const messages = (outcome as { messages: readonly string[] }).messages;
    expect(messages).toHaveLength(2);
    expect([...messages].sort()).toEqual(["Bxc4", "bxc4"]);
  });

  // THE ROW THAT RULES THIS TICKET. An implementation that folds case FIRST passes rows 1 and 2
  // and fails only here.
  it("row 3: bxc4 resolves to the PAWN capture on the EXACT attempt, and the fold never runs", () => {
    const history = newGame(PAWN_ONLY_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "bxc4", seam.deps);

    expect(outcome.kind).toBe("move");
    expect((outcome as { move: Move }).move).toBe(moveNamed(history, seam.legal, "bxc4"));
    // Exactly two attempts were made — coordinate then SAN, both on the line as typed. No variant
    // of the line was ever handed to a resolver, so the fold demonstrably did not run.
    expect(seam.coordinateTexts()).toEqual(["bxc4"]);
    expect(seam.sanTexts()).toEqual(["bxc4"]);
  });

  it("row 3, the same discriminator on content: with BOTH legal, exact bxc4 is the pawn, not ambiguous", () => {
    const history = newGame(BOTH_CAPTURES_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "bxc4", seam.deps);

    expect(outcome.kind).toBe("move");
    expect((outcome as { move: Move }).move).toBe(moveNamed(history, seam.legal, "bxc4"));
  });

  it("the fold is tried in the fixed order — coordinate before SAN, exact before folded", () => {
    const history = newGame(BISHOP_ONLY_FEN);
    const seam = spied(history);

    resolveMoveInput(history, "BXC4", seam.deps);

    // Every attempt, in order: the line as typed first, and each variant asked of the coordinate
    // reader before the SAN reader.
    expect(seam.coordinateTexts()[0]).toBe("BXC4");
    expect(seam.sanTexts()[0]).toBe("BXC4");
    expect(seam.coordinateTexts().length).toBe(seam.sanTexts().length);
  });

  // `parseSan` refuses lowercase castles deliberately (case is meaning) and the 2026-08-18
  // tolerance ruling did NOT widen it — so this is ABC-033's case, asserted here.
  it("o-o and o-o-o fold to O-O / O-O-O with exactly one candidate each", () => {
    const history = newGame(CASTLE_FEN);
    const seam = spied(history);

    for (const [line, san] of [
      ["o-o", "O-O"],
      ["o-o-o", "O-O-O"],
    ] as const) {
      const outcome = resolveMoveInput(history, line, seam.deps);
      expect(outcome.kind).toBe("move");
      expect((outcome as { move: Move }).move).toBe(moveNamed(history, seam.legal, san));
    }
  });
});

describe("ABC-033 A4 — the candidate list fits the frame's message region", () => {
  /**
   * The message region is the two rows before the reserved prompt row. Test note 4: no width is
   * asserted anywhere here — the width is whatever the delivered panels set, and the criterion is
   * the HIDDEN COUNT that merged code computes, read through the `(+N more)` marker `withMarker`
   * appends (`src/frame.ts:134-141`).
   */
  function messageRegionOf(history: GameHistory, messages: readonly string[]): string[] {
    const frame = assembleFrame(
      {
        board: renderBoard(history.position, "unicode", "white-bottom"),
        status: renderStatusPanel(history, gameStatusOf(history), false),
        history: renderHistory(history),
        messages,
      },
      "unicode",
    );
    return frame.slice(frame.length - PROMPT_ROWS - MESSAGE_ROWS, frame.length - PROMPT_ROWS);
  }

  const AMBIGUITIES: ReadonlyArray<readonly [name: string, fen: string, line: string]> = [
    ["two knights (A2)", TWO_KNIGHTS_FEN, "Nd2"],
    ["both captures, folded (A3)", BOTH_CAPTURES_FEN, "BXC4"],
    ["four promotion captures", PROMOTION_CAPTURE_FEN, "e7d8"],
    ["four promotions", PROMOTION_CAPTURE_FEN, "e7e8"],
    ["five knights, adversarial", FIVE_KNIGHTS_FEN, "Nd2"],
    ["six queens, adversarial", SIX_QUEENS_FEN, "Qxd4"],
  ];

  for (const [name, fen, line] of AMBIGUITIES) {
    it(`hides nothing for ${name}`, () => {
      const history = newGame(fen);
      const outcome = resolveMoveInput(history, line);
      expect(outcome.kind).toBe("ambiguous");
      const messages = (outcome as { messages: readonly string[] }).messages;
      expect(messages.length).toBeGreaterThanOrEqual(2);

      const region = messageRegionOf(history, messages);

      expect(region).toHaveLength(MESSAGE_ROWS);
      // The hidden count is exactly 0: no marker was appended...
      expect(region.join("\n")).not.toContain("(+");
      // ...and every candidate is present in full, not merely fitted.
      for (const message of messages) expect(region.join(" ")).toContain(message);
    });
  }
});

describe("ABC-033 A5 — one derive per prompt", () => {
  const LINES: ReadonlyArray<readonly [name: string, fen: string, line: string]> = [
    ["a move on the first attempt", START_FEN, "e2e4"],
    ["a move on the last exact attempt", START_FEN, "e4"],
    ["a move on the fold", BISHOP_ONLY_FEN, "bxc4"],
    ["a folded castle", CASTLE_FEN, "o-o"],
    ["an ambiguity", TWO_KNIGHTS_FEN, "Nd2"],
    ["an ambiguity found by the fold", BOTH_CAPTURES_FEN, "BXC4"],
    ["a line nothing resolves", START_FEN, "hello"],
  ];

  for (const [name, fen, line] of LINES) {
    it(`calls legalMoves exactly once for ${name}`, () => {
      const history = newGame(fen);
      const seam = spied(history);

      resolveMoveInput(history, line, seam.deps);

      // Every attempt is handed the ONE array, so no resolver derives its own either.
      expect(seam.derives()).toBe(1);
    });
  }
});

describe("ABC-033 A6 — rejection does not advance and does not re-evaluate", () => {
  for (const line of ["hello", "e9e9", "Qz9", "", "   "]) {
    it(`rejects ${JSON.stringify(line)} without touching the position`, () => {
      const history = newGame(START_FEN);
      const seam = spied(history);
      const before = toFen(history.position);

      const outcome = resolveMoveInput(history, line, seam.deps);

      expect(outcome.kind).toBe("rejected");
      // A CODE, never display copy — ABC-034 owns the wording.
      expect((outcome as { messages: readonly string[] }).messages).toEqual([
        expect.stringMatching(/^(unreadable|no-such-move)$/),
      ]);
      expect(toFen(history.position)).toBe(before);
      expect(history.moves).toHaveLength(0);
      expect(seam.derives()).toBe(1);
    });
  }

  it("a well-formed move that is not legal here is rejected as no-such-move, not unreadable", () => {
    const history = newGame(START_FEN);

    const outcome = resolveMoveInput(history, "e2e5");

    expect(outcome.kind).toBe("rejected");
    expect((outcome as { messages: readonly string[] }).messages).toEqual(["no-such-move"]);
  });
});

describe("ABC-033 fences — the line is handed over unmodified, and nothing is guessed", () => {
  it("does not trim: the untrimmed line reaches both resolvers exactly as typed", () => {
    const history = newGame(START_FEN);
    const seam = spied(history);

    // Both resolvers already trim (ABC-032's 2026-08-18 tolerance ruling), so this still resolves —
    // and it resolves because THEY trimmed, not because this module did.
    const outcome = resolveMoveInput(history, "  e2e4  ", seam.deps);

    expect(outcome.kind).toBe("move");
    expect(seam.coordinateTexts()[0]).toBe("  e2e4  ");
  });

  it("never picks between two legal moves — every multi-match is ambiguous", () => {
    const history = newGame(PROMOTION_CAPTURE_FEN);

    const outcome = resolveMoveInput(history, "e7d8");

    expect(outcome.kind).toBe("ambiguous");
    expect((outcome as { messages: readonly string[] }).messages).toHaveLength(4);
  });

  it("returns an element of the legal array in every ambiguous candidate, by SAN over that array", () => {
    const history = newGame(TWO_KNIGHTS_FEN);
    const seam = spied(history);

    const outcome = resolveMoveInput(history, "Nd2", seam.deps);

    const messages = (outcome as { messages: readonly string[] }).messages;
    for (const message of messages) expect(moveNamed(history, seam.legal, message)).toBeDefined();
  });
});
