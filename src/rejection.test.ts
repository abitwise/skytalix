import { describe, expect, it } from "vitest";
import { parseFen, toFen } from "./fen.ts";
import { assembleFrame, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import { type GameHistory, gameStatusOf, newGame } from "./history.ts";
import { renderHistory } from "./history-pane.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { type MoveInputOutcome, resolveMoveInput } from "./move-input.ts";
import { FLAG_PROMOTION, generateMoves, type Move } from "./moves.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK, squareName } from "./position.ts";
import {
  classifyRejection,
  REJECTION_REASONS,
  type Rejection,
  type RejectionReason,
  rejectionMessage,
} from "./rejection.ts";
import { renderBoard } from "./render.ts";
import { renderStatusPanel } from "./status-panel.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * A1 — an ABSOLUTE PIN with the mover NOT in check: the black rook on e8 pins the white knight on
 * e2 to the king on e1. Every knight move is pseudo-legal and none is legal, and `isInCheck` is
 * false, so the class is `own-king-exposed` and not its in-check sibling.
 */
const PIN_FEN = "4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1";
/**
 * A1's NAMED position. It is not a pin: the black queen on h4 CHECKS the white king on e1 along
 * h4-g3-f2-e1 (f2 is empty), so white's only legal move is `Kf1` and every other pseudo-legal move
 * is in the set difference WHILE IN CHECK. The ticket's table makes that `must-address-check`
 * (`own-king-exposed` AND `isInCheck`), which is what this file asserts of it; the message still
 * names the player's own king, which is `A1`'s sentence.
 */
const CHECK_FEN = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP1BP/RNBQK1NR w KQkq - 1 4";
/** A8 — the pawn on e7 promotes; `e8=K` is a promotion letter the one table holds and no move has. */
const PROMOTION_FEN = "8/4P3/8/8/8/4k3/8/4K3 w - - 0 1";
/** A8 — a king and a rook with NO castling right, so `O-O` has no castle move to be compared to. */
const NO_CASTLE_FEN = "4k3/8/8/8/8/8/8/K6R w - - 0 1";

/**
 * A2's corpus — the six positions of `src/perft.test.ts`'s `PERFT_SUITE`, copied because that
 * table is a `const` inside a test file and is not exported. The round-trip below is what keeps
 * the copy honest.
 */
const PERFT_FENS: readonly string[] = [
  START_FEN,
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];

/**
 * A3 — one exact FEN and one exact input per code, seven rows, one code each. `A4` renders the
 * message SET from these same classifications, so the set asserted is the set the product produces.
 */
const FIXTURES: ReadonlyArray<
  readonly [name: string, fen: string, input: string, reason: RejectionReason]
> = [
  ["a word neither grammar reads", START_FEN, "hello", "unreadable"],
  ["a coordinate from an empty square", START_FEN, "e3e4", "empty-square"],
  ["a coordinate of the other side's pawn", START_FEN, "e7e5", "not-your-piece"],
  ["a coordinate the pawn cannot make", START_FEN, "e2e5", "piece-cannot-reach"],
  ["the pinned knight, not in check", PIN_FEN, "Nc3", "own-king-exposed"],
  ["a knight move while in check", CHECK_FEN, "Nh3", "must-address-check"],
  ["well-formed SAN naming nothing", START_FEN, "Qh5", "no-legal-move-named"],
];

/** Test note 4: every fixture FEN round-trips through `toFen` before anything is believed of it. */
describe("fixtures — every FEN in this file round-trips through toFen", () => {
  for (const fen of [PIN_FEN, CHECK_FEN, PROMOTION_FEN, NO_CASTLE_FEN, ...PERFT_FENS]) {
    it(fen, () => {
      expect(toFen(parseFen(fen))).toBe(fen);
    });
  }

  it("the pin fixture is not in check and the named A1 fixture is — the two halves of A1", () => {
    expect(isInCheck(parseFen(PIN_FEN))).toBe(false);
    expect(isInCheck(parseFen(CHECK_FEN))).toBe(true);
  });
});

const PROMOTION_LETTERS: Readonly<Record<number, string>> = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n",
};

/** The coordinate text of a move — `ABC-031`'s form, promotion letter included when there is one. */
const coordinateOf = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${
    (move.flags & FLAG_PROMOTION) !== 0 ? (PROMOTION_LETTERS[move.promotion] ?? "") : ""
  }`;

const sameMove = (a: Move, b: Move): boolean =>
  a.from === b.from && a.to === b.to && a.promotion === b.promotion;

const messagesOf = (outcome: MoveInputOutcome): readonly string[] =>
  outcome.kind === "move" ? [] : outcome.messages;

describe("ABC-034 A1 — the pin: a move of an absolutely pinned piece names the player's own king", () => {
  for (const line of ["Nc3", "e2c3", "Ng3", "e2g1"]) {
    it(`${line} on the pinned knight is own-king-exposed and the message names the king`, () => {
      const history = newGame(PIN_FEN);

      const rejection = classifyRejection(history.position, [line]);
      expect(rejection.reason).toBe("own-king-exposed");

      const outcome = resolveMoveInput(history, line);
      expect(outcome.kind).toBe("rejected");
      expect(messagesOf(outcome)[0]).toContain("king");
    });
  }

  it("the named position is the same set difference WHILE IN CHECK, and still names the king", () => {
    const history = newGame(CHECK_FEN);

    expect(classifyRejection(history.position, ["Nh3"]).reason).toBe("must-address-check");
    const outcome = resolveMoveInput(history, "Nh3");
    expect(outcome.kind).toBe("rejected");
    expect(messagesOf(outcome)[0]).toContain("king");
  });
});

describe("ABC-034 A2 — the classification is a SET DIFFERENCE over the perft corpus, asserted", () => {
  /**
   * Every pseudo-legal move that is not legal, on every corpus position, classifies as one of the
   * two king classes — and EXACTLY the one `isInCheck` selects, with zero exceptions. A heuristic
   * ("the king is on the same line") fails at least one of these rows; that is the discriminating
   * requirement.
   */
  it("every generateMoves \\ legalMoves move is own-king-exposed or must-address-check", () => {
    let rows = 0;
    for (const fen of PERFT_FENS) {
      const position = parseFen(fen);
      const legal = legalMoves(position);
      const expected: RejectionReason = isInCheck(position)
        ? "must-address-check"
        : "own-king-exposed";
      const exposing = generateMoves(position).filter(
        (move) => !legal.some((other) => sameMove(other, move)),
      );
      for (const move of exposing) {
        const rejection = classifyRejection(position, [coordinateOf(move)], legal);
        expect(rejection.reason, `${fen} ${coordinateOf(move)}`).toBe(expected);
        rows++;
      }
    }
    // The property is over a non-empty set: the corpus has pinned pieces and kings walking into
    // attacks, and a corpus that produced no row would prove nothing.
    expect(rows).toBeGreaterThan(0);
  });

  it("every legalMoves move resolves as a move — none of them is a rejection at all", () => {
    let rows = 0;
    for (const fen of PERFT_FENS) {
      const history = newGame(fen);
      for (const move of legalMoves(history.position)) {
        const outcome = resolveMoveInput(history, coordinateOf(move));
        expect(outcome.kind, `${fen} ${coordinateOf(move)}`).toBe("move");
        expect(sameMove((outcome as { move: Move }).move, move)).toBe(true);
        rows++;
      }
    }
    expect(rows).toBeGreaterThan(0);
  });
});

describe("ABC-034 A3 — each of the seven classes is reached by a named fixture", () => {
  for (const [name, fen, input, reason] of FIXTURES) {
    it(`${name}: ${JSON.stringify(input)} is ${reason}`, () => {
      const history = newGame(fen);

      expect(classifyRejection(history.position, [input]).reason).toBe(reason);

      // And through the dispatcher: the rejection the player actually gets is that code's sentence.
      const outcome = resolveMoveInput(history, input);
      expect(outcome.kind).toBe("rejected");
      expect(messagesOf(outcome)).toEqual([
        rejectionMessage(classifyRejection(history.position, [input])),
      ]);
    });
  }

  it("seven rows reach seven codes — no code is reached by two rows and none is unreached", () => {
    const reached = new Set(FIXTURES.map(([, , , reason]) => reason));
    expect(reached.size).toBe(REJECTION_REASONS.length);
    expect([...reached].sort()).toEqual([...REJECTION_REASONS].sort());
  });
});

describe("ABC-034 A4 — no bare rejection survives, asserted over the SET", () => {
  /** The seven messages, rendered from the seven real classifications of `A3`'s rows. */
  const messages = FIXTURES.map(([, fen, input]) =>
    rejectionMessage(classifyRejection(parseFen(fen), [input])),
  );

  it("the reason set is closed at seven", () => {
    expect(REJECTION_REASONS).toHaveLength(7);
  });

  it("the seven messages are seven distinct strings", () => {
    expect(new Set(messages).size).toBe(7);
  });

  it("each message names a concrete referent — a square, a piece, or the king", () => {
    for (const message of messages) expect(message).toMatch(/[a-h][1-8]|king/);
  });

  it("no message is a substring of another", () => {
    for (const outer of messages)
      for (const inner of messages)
        if (outer !== inner) expect(outer.includes(inner), `${outer} ⊇ ${inner}`).toBe(false);
  });

  it("the renderer is total by exhaustive mapping, not by a default branch", () => {
    // Every member of the closed set renders, and the render of each member is the member's own
    // sentence. The absence of a `default` arm is enforced by `tsc` on `rejectionMessage`'s
    // switch (an eighth `Rejection` member without a `case` fails typecheck); this row pins the
    // runtime half — each code has a sentence and no two codes share one.
    const rendered = new Map<RejectionReason, string>();
    for (const [, fen, input, reason] of FIXTURES) {
      rendered.set(reason, rejectionMessage(classifyRejection(parseFen(fen), [input])));
    }
    expect([...rendered.keys()].sort()).toEqual([...REJECTION_REASONS].sort());
    expect(new Set(rendered.values()).size).toBe(REJECTION_REASONS.length);
  });
});

describe("ABC-034 A5 — every message fits the frame's message region with hidden count 0", () => {
  /**
   * The message region is the two rows before the reserved prompt row, at whatever width the
   * DELIVERED panels set — no width is asserted here. Hidden items are read through the
   * `(+N more)` marker merged code appends (`src/frame.ts` `withMarker`), exactly as
   * `src/move-input.test.ts` reads it.
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

  const SHOWN: ReadonlyArray<readonly [name: string, fen: string, input: string]> = [
    ...FIXTURES.map(([name, fen, input]) => [name, fen, input] as const),
    ["A8 — the impossible promotion", PROMOTION_FEN, "e8=K"],
    ["A8 — the castle no rule allows", NO_CASTLE_FEN, "O-O"],
  ];

  for (const [name, fen, input] of SHOWN) {
    it(`${name}: the sentence is shown whole, nothing is hidden`, () => {
      const history = newGame(fen);
      const outcome = resolveMoveInput(history, input);
      expect(outcome.kind).toBe("rejected");
      const [message] = messagesOf(outcome);

      const region = messageRegionOf(history, messagesOf(outcome));

      expect(region.join("\n")).not.toMatch(/\(\+\d+ more\)/);
      expect(region.map((row) => row.trimEnd())).toContain(message);
    });
  }
});

describe("ABC-034 A6 — the position is unchanged and the ply is not advanced", () => {
  for (const [name, fen, input] of FIXTURES) {
    it(`${name}: toFen is byte-identical across the rejection and no move is recorded`, () => {
      const history = newGame(fen);
      const before = toFen(history.position);

      classifyRejection(history.position, [input]);
      expect(toFen(history.position)).toBe(before);

      const outcome = resolveMoveInput(history, input);
      expect(outcome.kind).toBe("rejected");
      expect(toFen(history.position)).toBe(before);
      expect(history.moves).toHaveLength(0);
    });
  }
});

describe("ABC-034 A8 — the two ill-formed-SAN cases are placed inside the seven, at no eighth code", () => {
  it("e8=K, a promotion letter no move has, is well-formed SAN naming no move here", () => {
    const history = newGame(PROMOTION_FEN);

    const rejection = classifyRejection(history.position, ["e8=K"]);
    expect(rejection.reason).toBe("no-legal-move-named");
    expect(REJECTION_REASONS).toContain(rejection.reason);
    // The sentence names the square from the input.
    expect(rejectionMessage(rejection)).toContain("e8");
  });

  it("O-O with no castle legal is unreadable — the SAN reader's own castle price, placed as such", () => {
    const history = newGame(NO_CASTLE_FEN);

    const rejection = classifyRejection(history.position, ["O-O"]);
    expect(rejection.reason).toBe("unreadable");
    expect(REJECTION_REASONS).toContain(rejection.reason);
    expect(rejectionMessage(rejection)).toMatch(/[a-h][1-8]/);
  });

  it("e8=P and e8=Q do not collapse: one is a move, the other is not read at all", () => {
    const history = newGame(PROMOTION_FEN);

    expect(resolveMoveInput(history, "e8=Q").kind).toBe("move");
    expect(resolveMoveInput(history, "e8=P").kind).toBe("rejected");
    expect(classifyRejection(history.position, ["e8=P"]).reason).toBe("unreadable");
  });
});

describe("ABC-034 — the texts the dispatcher tried are the texts the classifier explains", () => {
  it("a case-folded line that the fold made readable is classified on the readable variant", () => {
    const history = newGame(PIN_FEN);

    const outcome = resolveMoveInput(history, "nc3");

    expect(outcome.kind).toBe("rejected");
    expect(messagesOf(outcome)[0]).toContain("king");
  });

  it("the echo in no-legal-move-named is the SAN the reader accepted, not the raw line", () => {
    const history = newGame(START_FEN);

    const outcome = resolveMoveInput(history, "qh5");

    expect(outcome.kind).toBe("rejected");
    expect(messagesOf(outcome)[0]).toContain("Qh5");
    expect(messagesOf(outcome)[0]).not.toContain("qh5");
  });

  it("classification is ordered — the first text that a grammar reads decides", () => {
    const position = parseFen(START_FEN);
    const rejection: Rejection = classifyRejection(position, ["hello", "e2e5", "e3e4"]);
    expect(rejection.reason).toBe("piece-cannot-reach");
  });
});
