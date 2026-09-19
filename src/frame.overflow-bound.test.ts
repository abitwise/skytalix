/**
 * `ABC-107` — the message region's overflow BOUND, pinned (`ADR-0022`, option 4).
 *
 * The frame's message region is `MESSAGE_ROWS` (= 2) rows of `W` columns, where `W` is whatever the
 * delivered panels set (21 today, from the history pane). It holds every candidate of an ambiguity
 * of up to SIX same-square SAN items; at seven it shows five and marks `(+2 more)`, at eight it
 * shows five and marks `(+3 more)`. That bound is the product's contract (`ADR-0022` clause 1) and
 * this file is the only thing that holds it in place (clause 2): the `= 0` at six is the
 * REQUIREMENT, the `2` and `3` are the TRIPWIRE. A wider frame, a narrower SAN rendering or a moved
 * `MESSAGE_ROWS` reds one of these rows so the move is deliberate (`ADR-0022` F2 / F4).
 *
 * NO WIDTH IS ASSERTED HERE — ticket test note 2, the same fence `ABC-033`'s test note 4 set. Every
 * number is read from the emitted frame: the hidden count through the `(+N more)` marker
 * `src/frame.ts`'s `withMarker` appends, exactly as `src/move-input.test.ts` reads it.
 *
 * Every FEN below is the ticket's, verbatim (test note 1), plus `ADR-0022`'s eight-queen fixture —
 * the other piece type that reaches the cap of eight. None of them arises in ordinary play (seven
 * knights of one colour is five promotions), which is why the bound is accepted rather than fixed.
 */
import { describe, expect, it } from "vitest";
import { toFen } from "./fen.ts";
import { assembleFrame, frameHeight, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import { type GameHistory, gameStatusOf, newGame } from "./history.ts";
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import { resolveMoveInput } from "./move-input.ts";
import type { Move } from "./moves.ts";
import { KNIGHT, pieceType, QUEEN, squareName } from "./position.ts";
import { renderBoard } from "./render.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";

interface Fixture {
  readonly name: string;
  readonly fen: string;
  /** The ambiguous line the player types. */
  readonly line: string;
  readonly piece: number;
  readonly letter: "N" | "Q";
  readonly candidates: number;
  /** The bound: how many of `candidates` the region cannot show at the delivered width. */
  readonly hidden: number;
}

const FIXTURES: readonly Fixture[] = [
  {
    name: "six knights",
    fen: "7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1",
    line: "Nd4",
    piece: KNIGHT,
    letter: "N",
    candidates: 6,
    hidden: 0,
  },
  {
    name: "seven knights",
    fen: "7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1",
    line: "Nd4",
    piece: KNIGHT,
    letter: "N",
    candidates: 7,
    hidden: 2,
  },
  {
    name: "eight knights",
    fen: "7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1",
    line: "Nd4",
    piece: KNIGHT,
    letter: "N",
    candidates: 8,
    hidden: 3,
  },
  {
    name: "eight queens",
    fen: "3Q3Q/Q7/6k1/8/Q6Q/8/5Q2/QK1Q4 w - - 0 1",
    line: "Qd4",
    piece: QUEEN,
    letter: "Q",
    candidates: 8,
    hidden: 3,
  },
];

/** `A2`'s reference: the everyday two-candidate ambiguity (`ABC-033` `A2`'s own fixture). */
const TWO_KNIGHTS_FEN = "4k3/8/8/8/8/5N2/8/1N2K3 w - - 0 1";

/** One frame through the real pipeline: the delivered panels set `W`; nothing here does. */
function frameOf(history: GameHistory, messages: readonly string[]): string[] {
  return assembleFrame(
    {
      board: renderBoard(history.position, "unicode", "white-bottom"),
      status: renderStatusPanel(history, gameStatusOf(history), false),
      history: renderHistory(history),
      messages,
    },
    "unicode",
  );
}

/** The message region: the `MESSAGE_ROWS` rows before the reserved prompt row. */
const regionOf = (frame: readonly string[]): string[] =>
  frame.slice(frame.length - PROMPT_ROWS - MESSAGE_ROWS, frame.length - PROMPT_ROWS);

/** The hidden count the merged packer computed, read back through its own marker. */
function hiddenIn(region: readonly string[]): number {
  const marker = /\(\+(\d+) more\)/.exec(region.join(" "));
  return marker === null ? 0 : Number(marker[1]);
}

function candidatesOf(history: GameHistory, fixture: Fixture): readonly string[] {
  const outcome = resolveMoveInput(history, fixture.line);
  expect(outcome.kind).toBe("ambiguous");
  return (outcome as { messages: readonly string[] }).messages;
}

describe("ABC-107 A1' / A3 / A5 — the bound is pinned by a test, not by arithmetic", () => {
  for (const fixture of FIXTURES) {
    describe(fixture.name, () => {
      it("is the ticket's position, byte-identical through toFen", () => {
        expect(toFen(newGame(fixture.fen).position)).toBe(fixture.fen);
      });

      it(`hides exactly ${fixture.hidden} of ${fixture.candidates} candidates`, () => {
        const history = newGame(fixture.fen);
        const messages = candidatesOf(history, fixture);
        expect(messages).toHaveLength(fixture.candidates);

        const region = regionOf(frameOf(history, messages));
        expect(region).toHaveLength(MESSAGE_ROWS);
        expect(hiddenIn(region)).toBe(fixture.hidden);
      });

      it("shows the marker exactly when something is hidden", () => {
        const history = newGame(fixture.fen);
        const region = regionOf(frameOf(history, candidatesOf(history, fixture)));
        expect(region.join(" ").includes("(+")).toBe(fixture.hidden > 0);
      });

      if (fixture.hidden === 0) {
        // A3 — six still fits, in full, with no affordance of any kind.
        it("shows every candidate in full", () => {
          const history = newGame(fixture.fen);
          const messages = candidatesOf(history, fixture);
          const shown = regionOf(frameOf(history, messages)).join(" ");
          for (const message of messages) expect(shown).toContain(message);
        });
      } else {
        // The bound is on what is SHOWN, too: candidates minus hidden appear whole, the rest not at all.
        it("shows the first candidates whole and the hidden ones not at all", () => {
          const history = newGame(fixture.fen);
          const messages = candidatesOf(history, fixture);
          const shown = regionOf(frameOf(history, messages)).join(" ");
          const visible = fixture.candidates - fixture.hidden;
          for (const message of messages.slice(0, visible)) expect(shown).toContain(message);
          for (const message of messages.slice(visible)) expect(shown).not.toContain(message);
        });
      }
    });
  }
});

describe("ABC-107 A1' — every candidate stays reachable by typing, without the list", () => {
  for (const fixture of FIXTURES) {
    it(`${fixture.name}: full-origin SAN and coordinate form each resolve every candidate`, () => {
      const history = newGame(fixture.fen);
      const target = fixture.line.slice(1);
      const moves = legalMoves(history.position).filter(
        (move) => squareName(move.to) === target && pieceType(move.piece) === fixture.piece,
      );
      expect(moves).toHaveLength(fixture.candidates);

      for (const move of moves) {
        const from = squareName(move.from);
        // `d4` is empty in every fixture, so neither spelling carries a capture mark.
        for (const line of [`${fixture.letter}${from}${target}`, `${from}${target}`]) {
          const outcome = resolveMoveInput(history, line);
          expect(outcome.kind, line).toBe("move");
          const resolved = (outcome as { move: Move }).move;
          expect([resolved.from, resolved.to], line).toEqual([move.from, move.to]);
        }
      }
    });
  }
});

describe("ABC-107 A2 — the frame's row count does not move", () => {
  const twoKnights = newGame(TWO_KNIGHTS_FEN);
  const reference = frameOf(
    twoKnights,
    (resolveMoveInput(twoKnights, "Nd2") as { messages: readonly string[] }).messages,
  ).length;

  it("the two-candidate reference is the epic's constant height", () => {
    expect(reference).toBe(frameHeight({ board: 9, status: STATUS_ROWS, history: HISTORY_ROWS }));
  });

  for (const fixture of FIXTURES) {
    it(`${fixture.name}: identical row count to a two-candidate ambiguity`, () => {
      const history = newGame(fixture.fen);
      expect(frameOf(history, candidatesOf(history, fixture))).toHaveLength(reference);
    });
  }
});
