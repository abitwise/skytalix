/**
 * ABC-012's acceptance criteria, one test each.
 *
 * ADR-0002 says it plainly and it is why these are not optional: NO EXISTING TEST WOULD CATCH
 * GETTING THIS WRONG. The perft and FEN suites assert the rules core's behaviour and never touch
 * game history, so this file is the module's only safety net.
 *
 * Every oracle below is built from the CORE's own primitives — `parseFen` + `makeMove`, never
 * `history.ts` compared against itself. A test that replayed with `keyHistory` to check
 * `keyHistory` would pass on a module that is consistently wrong.
 */
import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import {
  type GameHistory,
  gameStatusOf,
  keyHistory,
  newGame,
  playMove,
  repetitionCounts,
  takeBack,
} from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, parseSquareName } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

/**
 * The start position — a fifth literal copy of this string, deliberately. ABC-012's
 * `## Out of scope` flags the four existing copies (`src/perft-bench.ts:26` and three test files)
 * and forbids introducing a shared constant here (AGENTS.md rules 9 and 12); every other test
 * file in this suite declares its own.
 */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Plays the named move through `playMove`, throwing if it is not legal in the live position. */
function play(history: GameHistory, from: string, to: string): void {
  const move = legalMoves(history.position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  playMove(history, move);
}

/** One 4-ply knight round trip: both knights out and back, returning the exact start position. */
const KNIGHT_CYCLE = [
  ["g1", "f3"],
  ["g8", "f6"],
  ["f3", "g1"],
  ["f6", "g8"],
] as const;

/**
 * `cycles` knight round trips from the start position, so the start position occurs
 * `cycles + 1` times with White to move. Knights and never a pawn: ABC-012's test notes require
 * a repeated line that never sets an en-passant square, and this is the shape
 * `src/gameend.test.ts:27-58` already uses for the same reason.
 *
 * The REASON on the ticket is stale and is not repeated here. It says the ep file is hashed
 * whenever `epSquare` is set, which described the pre-ABC-011 tree; `src/zobrist.ts:85` now hashes
 * it only when a LEGAL ep capture exists, so a double push with no capture available would hash
 * equal today. The INSTRUCTION still stands and is followed — see the Orchestrator's pull note
 * `20260804T120000Z-orchestrator-decision-f066a9d0`.
 */
function knightCycles(cycles: number): GameHistory {
  const history = newGame(START_FEN);
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (const [from, to] of KNIGHT_CYCLE) play(history, from, to);
  }
  return history;
}

/**
 * Plays `plies` deterministically-chosen legal moves, so "ANY sequence of N legal moves" is more
 * than one hand-picked line. The choice is a fixed LCG over the generator's own deterministic
 * ordering, so the game is identical on every run and every machine. It stops early only if the
 * game ends; every caller asserts the resulting length, so a short game cannot silently weaken a
 * test into vacuity.
 */
function playPseudoRandomGame(history: GameHistory, plies: number): void {
  let seed = 0x2f6e2b1;
  for (let ply = 0; ply < plies; ply++) {
    const moves = legalMoves(history.position);
    if (moves.length === 0) return;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    playMove(history, moves[seed % moves.length] as Move);
  }
}

/** Rebuilds a position with the CORE's primitives — the independent oracle, never this module. */
function replay(fen: string, moves: readonly Move[]): Position {
  const position = parseFen(fen);
  for (const move of moves) makeMove(position, move);
  return position;
}

describe("ABC-012 acceptance", () => {
  it("rewinds the repetition history too, not just the board, when moves are taken back", () => {
    // Acceptance 2 — EPIC-006's named test, the corruption ADR-0002 clause 2 exists to make
    // unrepresentable.
    //
    // THE CRITERION'S FIRST HALF IS ASSERTED AS THE MERGED CODE DEFINES IT, AND THE DIFFERENCE IS
    // NOT A CHOICE THIS FILE MADE. ABC-012 words it as `result: "draw", reason:
    // "threefold-repetition"`, which `src/gameend.ts` cannot return and its TYPE cannot even
    // express: `threefold-repetition` is a `ClaimableDraw`, not an `EndReason`, because ABC-020
    // ruled on FIDE 9.2.1 that the third occurrence is a draw the side to move MAY CLAIM and may
    // just as well decline. `src/gameend.test.ts:68-92` pins exactly the shape asserted below.
    // Making `gameStatusOf` return the ticket's literal wording would mean changing merged,
    // `Done`, 100%-covered `gameend.ts`, which this ticket's `## Out of scope` forbids. The
    // criterion's INTENT — threefold is reported before the take-back and gone after it — is what
    // is tested, and the wording is handed to BA/PM rather than silently satisfied or ignored.
    const history = knightCycles(2); // the start position, three times

    expect(repetitionCounts(history).get(zobristKey(history.position))).toBe(3);
    expect(gameStatusOf(history)).toEqual({
      result: "in-progress",
      reason: null,
      claimable: { by: "white", draws: ["threefold-repetition"] },
    });

    takeBack(history, 2);

    expect(gameStatusOf(history)).toEqual({ result: "in-progress", reason: null });

    // ...and the counts are those of a freshly replayed history built from the truncated list,
    // which is the half that fails on an undo that rewinds the board and forgets the history.
    const fresh = newGame(START_FEN);
    for (const move of history.moves) playMove(fresh, move);
    expect(repetitionCounts(history)).toEqual(repetitionCounts(fresh));
  });

  it("reaches the same position by forward apply as by replay, byte-identically at 120 plies", () => {
    // Acceptance 1 — the one property the module's two code paths must share. `position` is
    // maintained by forward application and `takeBack` rebuilds it by replay; if those two ever
    // disagree, every derived answer in the module is quietly wrong.
    const history = newGame(START_FEN);
    playPseudoRandomGame(history, 120);

    expect(history.moves.length).toBe(120);
    expect(toFen(history.position)).toBe(toFen(replay(START_FEN, history.moves)));
  });

  it("is exact when k plies are taken back and the same k are played again", () => {
    // Acceptance 5 — truncate-then-replay, on both the FEN and the whole key list.
    const history = newGame(START_FEN);
    playPseudoRandomGame(history, 40);
    expect(history.moves.length).toBe(40);

    const fenBefore = toFen(history.position);
    const keysBefore = keyHistory(history);
    const undone = history.moves.slice(-8); // copied BEFORE the list is truncated in place

    takeBack(history, 8);
    expect(history.moves.length).toBe(32);
    for (const move of undone) playMove(history, move);

    expect(toFen(history.position)).toBe(fenBefore);
    expect(keyHistory(history)).toEqual(keysBefore);
  });

  it("truncates the key list to an exact prefix of the full one", () => {
    // Acceptance 4 — the prefix property is what makes EPIC-004's per-search seeding sound: the
    // search seeds its per-ply array from this list once, and a truncated game must not shift it.
    const history = newGame(START_FEN);
    playPseudoRandomGame(history, 40);
    const full = keyHistory(history);
    expect(full.length).toBe(41);

    takeBack(history, 15);

    expect(history.moves.length).toBe(25);
    expect(keyHistory(history)).toEqual(full.slice(0, 26));
  });

  it("counts the CURRENT position, so a third occurrence reads exactly 3 and not 2", () => {
    // Acceptance 6 — the off-by-one that would make threefold fire one repetition late, silently.
    // `src/gameend.ts:106` tests `>= 3` and its doc comment states the count includes the current
    // occurrence. Pinned at all three occurrences, not only the third.
    for (const cycles of [0, 1, 2]) {
      const history = knightCycles(cycles);
      const counts = repetitionCounts(history);
      expect(counts.get(zobristKey(history.position)), `${cycles} cycles`).toBe(cycles + 1);
    }
  });

  it("returns exactly moves.length + 1 keys, the last of which is the live position's", () => {
    // Acceptance 3 — the seeding invariants. Held at zero plies as well, where `moves.length + 1`
    // is the one entry an off-by-one is most likely to drop.
    const history = newGame(START_FEN);
    expect(keyHistory(history)).toEqual([zobristKey(history.position)]);

    playPseudoRandomGame(history, 40);
    expect(history.moves.length).toBe(40);

    const keys = keyHistory(history);
    expect(keys.length).toBe(41);
    expect(keys[40]).toBe(zobristKey(history.position));
  });

  it("clamps an over-large take-back at zero rather than throwing or building a different game", () => {
    // Acceptance 7 — a silent-corruption path, not an impossible scenario: `slice(0, negative)`
    // would quietly produce a DIFFERENT game. `moves.length === 0` is a legal state, the initial
    // position, so the clamp must land there and stay usable afterwards.
    const history = knightCycles(2);

    expect(() => takeBack(history, history.moves.length + 5)).not.toThrow();

    expect(history.moves.length).toBe(0);
    expect(toFen(history.position)).toBe(START_FEN);
    expect(keyHistory(history)).toEqual([zobristKey(parseFen(START_FEN))]);
  });
});
