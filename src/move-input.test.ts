import { describe, expect, it, vi } from "vitest";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { toFen } from "./fen.ts";
import { assembleFrame, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import { type GameHistory, gameStatusOf, newGame } from "./history.ts";
import { renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import { type MoveInputDeps, resolveMoveInput } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { classifyRejection, type RejectionReason, rejectionMessage } from "./rejection.ts";
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
const PROMOTION_CAPTURE_FEN = "3q3k/4P3/8/8/8/8/8/4K3 w - - 0 1";
/**
 * A4's adversarial rows — NOT positions from a game, deliberately. Five white knights all reach d2
 * and six white queens all take on d4. Both are legal positions and both round-trip below.
 *
 * THESE ARE NOT THE WIDEST CANDIDATE LISTS THIS MODULE CAN PRODUCE, and an earlier version of this
 * file said they were on a bound that is false. The bound offered was *"exactly six squares attack
 * any given square by knight move"*: that is true of an edge-ish square like **d2**, which is the
 * square every knight fixture here uses, and false of a central one — **d4 has eight knight
 * attackers**, so eight knights of one colour can all name it. QE built exactly that at
 * `quality-gate-ABC-033-qe-2026-08-18` and reached 7 and 8 candidates; at 7 the frame's message
 * region appends `(+2 more)`, which FALSIFIES `A4` (`G1`). The generalisation was taken from the
 * square in hand, which is the ordinary way a bound goes wrong — the fixture chose the square that
 * made it hold.
 *
 * `G1` is NOT repaired here and no seven-knight fixture is added: the overflow is `src/frame.ts`'s
 * packing meeting a list longer than two rows, this module truncates nothing and widens nothing,
 * and `A4`'s own prose routes that outcome to `EPIC-002`'s frame owner and a new ticket. The rows
 * below therefore assert the widest list that is KNOWN TO FIT, and claim nothing beyond it.
 */
const FIVE_KNIGHTS_FEN = "4k3/8/8/8/2N1N3/1N3N2/8/1N3KN1 w - - 0 1";
const SIX_QUEENS_FEN = "3Q4/8/1Q4Q1/4k3/Q2q3Q/8/1Q6/3Q1K2 w - - 0 1";
/**
 * G2 — a pawn on e7 with the promotion square empty, so `e8=Q` names exactly one legal move and
 * the four case spellings of it are four spellings of the SAME move. The black king is on a5 and
 * not on the eighth rank deliberately: from f8 or h8 it would be in check after the promotion and
 * every SAN here would carry a `+`, which is a different string with a different last character
 * and would quietly test something else.
 */
const PROMOTION_FEN = "8/4P3/8/k7/8/8/8/4K3 w - - 0 1";
/** The folded castle case — `o-o` / `o-o-o`, which `parseSan` refuses case-exact, deliberately. */
const CASTLE_FEN = "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1";
/**
 * G5 — the position where the two grammars OVERLAP and disagree. White pawn `b2`, white bishop
 * `d2`: the one line `B2b4` is a legal coordinate move (`b2`→`b4`, the pawn) AND a legal
 * rank-qualified SAN (`Bb4`, the bishop from rank 2), naming two DIFFERENT moves. `b` is the only
 * piece letter that is also a file letter, which is the whole of the overlap.
 */
const SHIFT_SLIP_FEN = "4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1";

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
    PROMOTION_FEN,
    SHIFT_SLIP_FEN,
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
  readonly sanRenderLegals: () => (readonly Move[] | undefined)[];
} {
  const legal = legalMoves(history.position);
  const deriveLegal = vi.fn(() => legal);
  const coordinate = vi.fn(parseCoordinateMove);
  const san = vi.fn(parseSan);
  const render = vi.fn(toSan);
  return {
    deps: {
      legalMoves: deriveLegal,
      parseCoordinateMove: coordinate,
      parseSan: san,
      toSan: render,
    },
    legal,
    derives: () => deriveLegal.mock.calls.length,
    sanTexts: () => san.mock.calls.map((call) => call[1]),
    coordinateTexts: () => coordinate.mock.calls.map((call) => call[1]),
    // The third ARGUMENT of every candidate render, which is the only place the shared array's
    // onward journey is observable — see the A5 guard below and G3.
    sanRenderLegals: () => render.mock.calls.map((call) => call[2]),
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

  /**
   * G5 — the ticket says the order is *"fixed and asserted"*. It was fixed and it was not asserted:
   * QE swapped the two resolvers in `attemptsOn` (mutant M12) and reded 0 of 40 tests.
   *
   * The reason nothing red is worth stating exactly, because it decides what the right repair is.
   * `attemptsOn` returns an ARRAY — both resolvers are called on every text, eagerly — so the order
   * is a PRECEDENCE over two answers already in hand, not a short-circuit.
   *
   * The rest of what this comment used to say was WRONG and is corrected below it: it claimed the
   * two grammars are disjoint on every string either accepts, so that no real line could make both
   * claim a move and the two orderings were indistinguishable by any input. QE falsified that at
   * `quality-gate-ABC-033-delta-2026-08-18` with `B2b4`, and the next test pins it with the REAL
   * readers. M12 reds there, so this stub case is no longer the only thing standing between the
   * precedence and a silent swap.
   *
   * The repair was never to make the module lazy — laziness would be a mechanism built so a test
   * can watch it, and the ticket page has been corrected to say precedence rather than order of
   * attempt, which is what the code does. This case keeps its own job: it asserts the precedence
   * through the seam, on two stub readers that BOTH claim the same text, with no dependence on a
   * grammar overlap existing. Coordinate's answer must win.
   */
  it("coordinate outranks SAN when both readers claim the same text — the precedence, asserted", () => {
    const history = newGame(START_FEN);
    const legal = legalMoves(history.position);
    const coordinateMove = moveNamed(history, legal, "e4");
    const sanMove = moveNamed(history, legal, "Nf3");
    expect(coordinateMove).not.toBe(sanMove);

    // Not a position and not a grammar: two stubs that disagree, which is the only arrangement in
    // which the precedence rule has an observable consequence at all.
    const outcome = resolveMoveInput(history, "whatever", {
      legalMoves: () => legal,
      parseCoordinateMove: () => ({ outcome: "move", move: coordinateMove }),
      parseSan: () => ({ outcome: "move", move: sanMove }),
      toSan,
    });

    expect(outcome.kind).toBe("move");
    expect((outcome as { move: Move }).move).toBe(coordinateMove);
  });

  /**
   * G5, and the guard that bites on a string a player can actually type — NO stubs, NO seam, the
   * production resolvers throughout. `B2b4` on `SHIFT_SLIP_FEN` is claimed by BOTH readers and they
   * claim different moves, so it is the one shape where the precedence has a consequence in
   * production. Swap the two lines of `attemptsOn` (QE's mutant M12) and this case goes red with
   * the bishop; the stub case above stays the weaker of the two.
   *
   * It asserts the pawn, not merely "some move": coordinate-first is right BECAUSE a player typing
   * `B2b4` is a coordinate typist whose shift slipped on `b2b4`.
   */
  it("coordinate outranks SAN on a real line both readers claim — `B2b4` is the pawn, not the bishop", () => {
    const history = newGame(SHIFT_SLIP_FEN);
    const legal = legalMoves(history.position);
    const pawn = moveNamed(history, legal, "b4");
    const bishop = moveNamed(history, legal, "Bb4");
    expect(pawn).not.toBe(bishop);

    // The overlap itself, so this case fails loudly if a future grammar change closes it rather
    // than quietly asserting a precedence that no longer decides anything.
    const asCoordinate = parseCoordinateMove(history.position, "B2b4", legal);
    const asSan = parseSan(history.position, "B2b4", legal);
    expect(asCoordinate.outcome).toBe("move");
    expect(asSan.outcome).toBe("move");
    expect((asCoordinate as { move: Move }).move).toBe(pawn);
    expect((asSan as { move: Move }).move).toBe(bishop);

    const outcome = resolveMoveInput(history, "B2b4");

    expect(outcome.kind).toBe("move");
    // `toEqual`, not `toBe`: with no `deps` the module derives its OWN legal array, so the move it
    // returns is a structurally equal object and never the same reference as this fixture's.
    expect((outcome as { move: Move }).move).toEqual(pawn);
    expect((outcome as { move: Move }).move).not.toEqual(bishop);
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

  /**
   * G2 — the family the first three variants could not reach, and the one a caps-lock player hits.
   *
   * Variants 1-3 all assume the case-significant character is at index 0. That is true of every
   * piece-move SAN (`NF3` is understood through variant 2) and false of promotion SAN, where the
   * piece letter is last. `e8=Q` resolved and `E8=Q` — its exact uppercasing — was refused
   * `unreadable`, which QE found and the engineer's own note reported at half its width (it named
   * only `e8=q`). Variant 4, the mirror of variant 2, closes it; the assertion is that all four
   * spellings name the SAME legal move BY REFERENCE, never merely an equal one.
   */
  it("promotion SAN is reached in every case spelling: e8=Q, E8=Q, e8=q, E8=q are one move", () => {
    const history = newGame(PROMOTION_FEN);
    const seam = spied(history);
    const before = toFen(history.position);

    const outcomes = ["e8=Q", "E8=Q", "e8=q", "E8=q"].map((line) =>
      resolveMoveInput(history, line, seam.deps),
    );

    for (const outcome of outcomes) expect(outcome.kind).toBe("move");
    const moves = outcomes.map((outcome) => (outcome as { move: Move }).move);
    expect(moves[0]).toBe(moveNamed(history, seam.legal, "e8=Q"));
    for (const move of moves) expect(move).toBe(moves[0]);
    expect(toFen(history.position)).toBe(before);
  });

  // The underpromotions too — the variant knows nothing about which letters name a piece, so if it
  // reached only the queen that would be a token table hiding in a string transform.
  it("the same holds for the underpromotions: E8=N and e8=n both name e8=N", () => {
    const history = newGame(PROMOTION_FEN);
    const seam = spied(history);

    for (const line of ["E8=N", "e8=n"]) {
      const outcome = resolveMoveInput(history, line, seam.deps);
      expect(outcome.kind).toBe("move");
      expect((outcome as { move: Move }).move).toBe(moveNamed(history, seam.legal, "e8=N"));
    }
  });

  // NOT asserted, and deliberately: `E8=Q+` and `e8=q+` are still refused, because the
  // case-significant character is no longer last once a check marker follows it. Reaching those
  // needs the knowledge that `+`/`#` is a trailing decoration — grammar, which this module may not
  // hold (see the module header's fences). Left to ABC-032's grammar owner and recorded in the
  // repair notes; no test pins them as rejected, so closing them there will not fight this file.

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

      // Exactly one derive OF THE PROMPT POSITION. This says nothing about other positions — see
      // the guard below, which is where the claim that used to be made here now lives honestly.
      expect(seam.derives()).toBe(1);
    });
  }

  /**
   * G3 — the guard the count alone could never be.
   *
   * This block used to carry the comment *"Every attempt is handed the ONE array, so no resolver
   * derives its own either."* **That was false**, in a way `seam.derives()` is structurally unable
   * to notice. `toSan(position, move, legal)` falls back to `legal ?? legalMoves(position)`
   * (`src/san.ts:78`) and imports `legalMoves` DIRECTLY from `./legal.ts`, so a build that drops
   * the third argument re-derives the prompt position once per candidate and the spy still reports
   * `1` — it is watching `deps.legalMoves`, which nobody called. QE's mutant M11 did precisely that
   * and reded 0 of 40 tests.
   *
   * So the guard is the ARGUMENT, not the count: every candidate render must receive the one array
   * the prompt derived, by reference. `toEqual` would pass on a freshly generated copy holding the
   * same moves, which is the mistake this asserts against.
   *
   * The honest cost, since it is not one derive: `toSan` DOES derive on its own for the `+`/`#`
   * suffix, on the position AFTER each checking candidate (`src/san.ts:105`). Those are other
   * positions, so `A5` as written still holds — but a prompt costs `1 + O(candidates)` derives in
   * total, and six queens on `d4` measured six. Do not quote "one derive per prompt" as a cost
   * bound for an ambiguity.
   */
  const RENDERED: ReadonlyArray<readonly [name: string, fen: string, line: string]> = [
    ["an ambiguity", TWO_KNIGHTS_FEN, "Nd2"],
    ["an ambiguity found by the fold", BOTH_CAPTURES_FEN, "BXC4"],
    ["six queens, the widest known to fit", SIX_QUEENS_FEN, "Qxd4"],
  ];

  for (const [name, fen, line] of RENDERED) {
    it(`hands the ONE derived array to every candidate render for ${name}`, () => {
      const history = newGame(fen);
      const seam = spied(history);

      const outcome = resolveMoveInput(history, line, seam.deps);

      expect(outcome.kind).toBe("ambiguous");
      const rendered = seam.sanRenderLegals();
      // One render per candidate, and not one of them was left to derive its own.
      expect(rendered).toHaveLength((outcome as { messages: readonly string[] }).messages.length);
      expect(rendered.length).toBeGreaterThan(1);
      for (const passed of rendered) expect(passed).toBe(seam.legal);
    });
  }
});

describe("ABC-033 A6 — rejection does not advance and does not re-evaluate", () => {
  /**
   * G4 — each row names the code it expects, and the pair below is what makes the precedence rule
   * an assertion rather than a wish.
   *
   * This loop used to assert `stringMatching(/^(unreadable|no-such-move)$/)`, which pins "a code,
   * not prose" — worth having, and not enough. Because the regex accepts either, `unreadable` was
   * pinned to NO input in the whole suite: QE's mutant M6 returned `no-such-move` for every
   * rejection, including `""` and `"hello"`, and all 40 tests passed. The exact codes fixed that.
   *
   * `ABC-034` moved the code out of `messages` — the loop places PROSE now, and the code is
   * `src/rejection.ts`'s `classifyRejection` — so each row asserts two things: the classifier's
   * code for the line (the `e2e5` row is the one that reds a classifier that cannot tell "read but
   * not a move" from "not read"), and that the dispatcher's message IS the classifier's rendering
   * for that line. No sentence is typed here (`ABC-034` test note 6); the wording is asserted as a
   * set in `src/rejection.test.ts`.
   */
  const REJECTIONS: ReadonlyArray<readonly [line: string, reason: RejectionReason]> = [
    // Nothing in either grammar can read these at all: no reader got as far as a legality question.
    ["hello", "unreadable"],
    ["e9e9", "unreadable"],
    ["Qz9", "unreadable"],
    ["", "unreadable"],
    ["   ", "unreadable"],
    // Read by the coordinate grammar, and the pawn on e2 has no such move — the specific code wins.
    ["e2e5", "piece-cannot-reach"],
  ];

  for (const [line, reason] of REJECTIONS) {
    it(`rejects ${JSON.stringify(line)} as ${reason} without touching the position`, () => {
      const history = newGame(START_FEN);
      const seam = spied(history);
      const before = toFen(history.position);

      const outcome = resolveMoveInput(history, line, seam.deps);

      expect(outcome.kind).toBe("rejected");
      const rejection = classifyRejection(history.position, [line], seam.legal);
      expect(rejection.reason).toBe(reason);
      // THE classifier's sentence for THIS line — display copy is ABC-034's, placed here unchanged.
      expect((outcome as { messages: readonly string[] }).messages).toEqual([
        rejectionMessage(rejection),
      ]);
      expect(toFen(history.position)).toBe(before);
      expect(history.moves).toHaveLength(0);
      expect(seam.derives()).toBe(1);
    });
  }

  it("a well-formed move that is not legal here names the square that cannot make it", () => {
    const history = newGame(START_FEN);

    const outcome = resolveMoveInput(history, "e2e5");

    expect(outcome.kind).toBe("rejected");
    const [message] = (outcome as { messages: readonly string[] }).messages;
    expect(message).toContain("e2");
    expect(message).toBe(
      rejectionMessage(classifyRejection(history.position, ["e2e5"], legalMoves(history.position))),
    );
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
