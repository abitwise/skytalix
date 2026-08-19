/**
 * `ABC-044` `A1`-`A5` — the result screen as a VALUE. No process, no TTY, no spawn.
 *
 * `A6` (it reaches the player, after the last frame, in one write) and `A7` (nothing else changed)
 * are driven through the delivered entry point and live in `src/cli.test.ts`, on `ABC-042`'s
 * existing spawn harness — `## Test notes` 5 and the ticket's lane-cost line both say so, and this
 * file adds no child of its own.
 *
 * THE OUTCOMES ARE BUILT BY HAND (`## Test notes` 4). Driving eight real games to eight real
 * terminal conditions would test `src/gameend.ts`, which is `Done` and mutation-tested, and would
 * cost a search. `LoopOutcome` is three fields and the renderer derives no game state, so a
 * constructed value is the criterion's own Given rather than a shortcut around it.
 *
 * `A1` IS A SET AND `A2` IS A NON-SUBSTRING PROPERTY, and neither is softened here. Eight
 * independent `toContain` rows are green on a build that prints the same string twice, and
 * inequality alone is green on `draw by repetition` versus `draw by repetition (claimed)` — the two
 * wrong builds `## Test notes` 1 and 2 name.
 *
 * THE SAN REFERENCE IS A SECOND, INDEPENDENT REPLAY. `A5` compares the screen's tokens against
 * `parseFen` + `makeMove` + `toSan` walked here, never against SAN this file wrote down: a
 * transcription would move the moment the generator's ordering did, and it would not be a check on
 * the renderer at all.
 */
import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import type { ClaimableDraw, EndReason } from "./gameend.ts";
import { type GameHistory, newGame, playMove } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { renderResultScreen } from "./result-screen.ts";
import { toSan } from "./san.ts";
import type { FinalResult, LoopOutcome, TerminalReason } from "./turn-loop.ts";

/** Every test file in this suite declares its own — `ABC-012` forbids a shared constant for it. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * `ABC-012`'s deterministic pseudo-random game (`src/history.test.ts:74-88`), re-declared here as
 * every test file in this suite re-declares its fixtures. A fixed LCG over the generator's own
 * ordering, so the game is identical on every run and every machine.
 */
function deterministicGame(plies: number, fen: string = START_FEN): GameHistory {
  const history = newGame(fen);
  let seed = 0x2f6e2b1;
  for (let ply = 0; ply < plies; ply++) {
    const moves = legalMoves(history.position);
    if (moves.length === 0) return history;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    playMove(history, moves[seed % moves.length] as Move);
  }
  return history;
}

/**
 * `A5`'s second Given: a history anchored at a BLACK-TO-MOVE FEN with a move number above 1.
 *
 * The anchor is produced by PLAYING an odd number of plies and reading `toFen` — so the FEN is the
 * merged writer's, not this file's, and its `fullmoveNumber` is whatever the game reached rather
 * than a number chosen to make a row look right.
 */
function blackAnchoredGame(plies: number): { readonly anchor: string; readonly game: GameHistory } {
  const anchor = toFen(deterministicGame(9).position);
  return { anchor, game: deterministicGame(plies, anchor) };
}

/** The full ≥ 40-ply fixture `A5` requires: the pane shows 8 rows, so 16 plies cannot tell them apart. */
const LONG_GAME = deterministicGame(41);

/** A short shared game for the vocabulary criteria — `A1`-`A4` are about words, not about plies. */
const SHORT_GAME = deterministicGame(6);

const outcomeOf = (result: FinalResult | null, reason: TerminalReason | null): LoopOutcome => ({
  result,
  reason,
  exitCode: 0,
});

/**
 * The eight game outcomes, with the `result` the ticket's settled table gives each — read off
 * `src/gameend.ts` and `src/turn-loop.ts` at the cut, not decided here.
 *
 * `named` is the vocabulary the criterion demands the screen use for that rule. It is the only
 * transcription in this file and it is the CRITERION's, not the implementation's: a build free to
 * choose its own words for `fifty-move` could satisfy "eight distinct strings" with eight numbers.
 */
const THE_EIGHT: readonly (readonly [TerminalReason, FinalResult, string])[] = [
  ["checkmate", "white-wins", "checkmate"],
  ["stalemate", "draw", "stalemate"],
  ["insufficient-material", "draw", "insufficient material"],
  ["fivefold-repetition", "draw", "fivefold repetition"],
  ["seventy-five-move", "draw", "seventy-five-move"],
  ["threefold-repetition", "draw", "threefold repetition"],
  ["fifty-move", "draw", "fifty-move"],
  ["resignation", "black-wins", "resignation"],
];

/** The screen for one of the eight, over the shared game, as one string. */
const screenFor = (reason: TerminalReason, result: FinalResult): string =>
  renderResultScreen(outcomeOf(result, reason), SHORT_GAME).join("\n");

/** The rows that carry the move list: every row that opens with a move number. */
const moveRowsOf = (rows: readonly string[]): readonly string[] =>
  rows.filter((row) => /^\s*\d+\.(?:\.\.)?(?:\s|$)/.test(row));

/** Every SAN token on the screen, in the order it is printed, with the move numbers dropped. */
const sanTokensOf = (rows: readonly string[]): readonly string[] =>
  moveRowsOf(rows).flatMap((row) => row.trim().split(/\s+/).slice(1));

/** The move NUMBERS the screen printed, as integers — `41.` contains `1.`, so never as substrings. */
const moveNumbersOf = (rows: readonly string[]): readonly number[] =>
  moveRowsOf(rows).map((row) => Number.parseInt(row.trim(), 10));

/**
 * `A5`'s reference: the SAN of every ply, from a FRESH replay of the anchor, computed the way
 * `renderHistory` computes its window — parse, `toSan` before the move, then `makeMove`.
 */
function sanOfEveryPly(history: GameHistory): readonly string[] {
  const position = parseFen(history.initialFen);
  return history.moves.map((move) => {
    const san = toSan(position, move);
    makeMove(position, move);
    return san;
  });
}

describe("ABC-044 A1 — all eight reasons, each named, each distinct", () => {
  it("names each of the eight rules in the vocabulary the criterion asks for", () => {
    for (const [reason, result, named] of THE_EIGHT) {
      expect(screenFor(reason, result), `${reason} is named`).toContain(named);
    }
  });

  it("the eight screens are pairwise distinct — asserted as a SET of size 8", () => {
    // NOT eight independent contains-checks (`## Test notes` 1): those are all green on a build
    // that prints `draw` for six of the six draws. The game is the same on all eight, and six of
    // the eight carry the same `result`, so nothing but the REASON's own words can separate them.
    const screens = new Set(THE_EIGHT.map(([reason, result]) => screenFor(reason, result)));

    expect(screens.size).toBe(THE_EIGHT.length);
  });

  it("states the result each outcome carries", () => {
    expect(screenFor("checkmate", "white-wins")).toContain("White wins");
    expect(screenFor("resignation", "black-wins")).toContain("Black wins");
    expect(screenFor("stalemate", "draw")).toContain("Draw");
  });
});

describe("ABC-044 A2 — a CLAIMED draw and an AUTOMATIC one are distinguishable", () => {
  // The epic's 2026-07-31 amendment, as a criterion. FIDE 9.2/9.3 are claims and 9.6.1/9.6.2 are
  // automatic; a screen that says `draw by repetition` for both under-reports what happened.
  const PAIRS: readonly (readonly [claimed: ClaimableDraw, automatic: EndReason])[] = [
    ["threefold-repetition", "fivefold-repetition"],
    ["fifty-move", "seventy-five-move"],
  ];

  it("the claimed screen says a player claimed it and the automatic screen says it was automatic", () => {
    for (const [claimed, automatic] of PAIRS) {
      expect(screenFor(claimed, "draw"), `${claimed} is claimed`).toMatch(/\bclaimed\b/);
      expect(screenFor(automatic, "draw"), `${automatic} is automatic`).toMatch(/\bautomatic\b/);
      // And each says only its own thing: a screen carrying both words distinguishes nothing.
      expect(screenFor(claimed, "draw"), `${claimed} is not automatic`).not.toMatch(/automatic/i);
      expect(screenFor(automatic, "draw"), `${automatic} is not claimed`).not.toMatch(/claim/i);
    }
  });

  it("NEITHER STRING IS A SUBSTRING OF THE OTHER, which inequality alone does not buy", () => {
    // `## Test notes` 2: `draw by repetition` and `draw by repetition (claimed)` are unequal, pass
    // a `not.toBe` row, and are exactly the wrong build this criterion was written to fail.
    for (const [claimed, automatic] of PAIRS) {
      const one = screenFor(claimed, "draw");
      const other = screenFor(automatic, "draw");

      expect(one, `${claimed} contains ${automatic}`).not.toContain(other);
      expect(other, `${automatic} contains ${claimed}`).not.toContain(one);
    }
  });
});

describe("ABC-044 A3 — a fault is never presented as a chess outcome", () => {
  const FAULTS: readonly TerminalReason[] = ["engine-failure", "engine-threw"];
  const FORBIDDEN_WORDS = /\bwin\b|\bwins\b|\bdraw\b|\bcheckmate\b|\bstalemate\b/i;

  it("carries none of the eight reason strings, none of the five words, and says it did not finish", () => {
    for (const reason of FAULTS) {
      // `result` is `null` on both, which is what `ABC-019` returns for them.
      const screen = renderResultScreen(outcomeOf(null, reason), SHORT_GAME).join("\n");

      // NON-VACUITY FIRST: a build returning nothing here would satisfy every absence below.
      expect(screen, `${reason} renders`).not.toBe("");
      // (i)
      for (const [, , named] of THE_EIGHT) {
        expect(screen, `${reason} names ${named}`).not.toContain(named);
      }
      // (ii)
      expect(screen, `${reason} names a chess word`).not.toMatch(FORBIDDEN_WORDS);
      // (iii)
      expect(screen, `${reason} states the game did not finish`).toMatch(/did not finish/);
    }
  });
});

describe("ABC-044 A4 — end of input gets no screen", () => {
  it("produces ZERO rows for { result: null, reason: null }", () => {
    // The loop has already written `INPUT_ENDED_NOTICE` (`ABC-019` `A8`); a second line would
    // double-report. The entry point's own half of this criterion — zero BYTES — is in cli.test.ts.
    expect(renderResultScreen(outcomeOf(null, null), SHORT_GAME)).toEqual([]);
    expect(renderResultScreen(outcomeOf(null, null), LONG_GAME)).toEqual([]);
  });
});

describe("ABC-044 A5 — the full move list, exactly, in order", () => {
  const screen = renderResultScreen(outcomeOf("draw", "fifty-move"), LONG_GAME);

  it("carries exactly history.moves.length SAN tokens — not the pane's 8-row window", () => {
    // >= 40 plies is the criterion's own number (`## Test notes` 3): `HISTORY_ROWS` is 8, so a
    // 16-ply fixture cannot tell the full list from the pane and a windowing bug survives it.
    expect(LONG_GAME.moves.length).toBeGreaterThanOrEqual(40);
    expect(sanTokensOf(screen)).toHaveLength(LONG_GAME.moves.length);
  });

  it("each token is byte-identical to toSan on a fresh replay from initialFen, in play order", () => {
    expect(sanTokensOf(screen)).toEqual([...sanOfEveryPly(LONG_GAME)]);
  });

  it("the move numbers run 1. upward with no gap", () => {
    const numbers = moveNumbersOf(screen);

    expect(numbers[0]).toBe(1);
    expect(numbers).toEqual(numbers.map((_, index) => index + 1));
  });

  it("a black-to-move anchor: the first pair is numbered from the anchor and its white cell elided", () => {
    const { anchor, game } = blackAnchoredGame(41);
    const anchored = renderResultScreen(outcomeOf("draw", "fifty-move"), game);
    const anchorPosition = parseFen(anchor);

    // The anchor really is black to move and past move 1, or this criterion tests nothing.
    expect(anchorPosition.blackToMove).toBe(true);
    expect(anchorPosition.fullmoveNumber).toBeGreaterThan(1);

    // `src/history-pane.ts`'s merged rule, read not re-invented: the first black ply of a
    // black-to-move anchor opens its OWN row, numbered with the anchor's `fullmoveNumber`, with an
    // EMPTY white cell. This screen has no fixed columns, so the empty cell is elided the way a
    // chess move list elides it.
    const rows = moveRowsOf(anchored);
    expect(moveNumbersOf(anchored)[0]).toBe(anchorPosition.fullmoveNumber);
    expect((rows[0] as string).trim().split(/\s+/)).toEqual([
      `${anchorPosition.fullmoveNumber}...`,
      sanOfEveryPly(game)[0] as string,
    ]);
    // And the whole list is still exact from the anchor.
    expect(sanTokensOf(anchored)).toEqual([...sanOfEveryPly(game)]);
    // The numbers still run upward with no gap — from the ANCHOR's number, not from 1.
    const numbers = moveNumbersOf(anchored);
    expect(numbers).toEqual(numbers.map((_, index) => (numbers[0] as number) + index));
  });
});

describe("ABC-044 — the screen writes nothing and emits no control bytes", () => {
  it("emits zero ANSI CSI introducers of its own, on every reason", () => {
    // `A6` asserts this on the delivered STREAM; here it is the module's own contribution, so a
    // regression is located in the renderer rather than in the entry point.
    for (const [reason, result] of THE_EIGHT) {
      expect(screenFor(reason, result), `${reason} CSI`).not.toContain("[");
    }
  });

  it("does not mutate the caller's history", () => {
    // It is a pure function of `LoopOutcome` and `GameHistory` and derives no game state, so the
    // replay must be its own — `renderHistory`'s construction, and the same failure it avoids.
    const before = toFen(LONG_GAME.position);
    const plies = LONG_GAME.moves.length;

    renderResultScreen(outcomeOf("draw", "fifty-move"), LONG_GAME);

    expect(toFen(LONG_GAME.position)).toBe(before);
    expect(LONG_GAME.moves).toHaveLength(plies);
  });
});
