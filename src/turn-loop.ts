/**
 * ABC-019 — the turn loop: ply dispatch, both seams stubbed, clean termination.
 *
 * A PLY LOOP THAT DISPATCHES ON SIDE-TO-MOVE, not a human-turn loop with an engine tail. The first
 * actor is a function of `position.blackToMove` versus the human's colour, so `--colour black` opens
 * with the engine and no prompt appears first, and `--colour white` asks the human first. Both
 * directions are criteria (`A1`, `A1b`) because either one alone is satisfied by a loop that always
 * opens with the engine.
 *
 * THE EXIT TEST SITS BETWEEN RENDER AND ACT, and its position is normative. With the test at the top
 * of the loop, `terminal` can only be the status computed before the PREVIOUS act — one ply stale —
 * so the mated frame renders, the reason is recorded, and the loop then acts on a checkmated
 * position where `legalMoves` returns `[]`. `A7b` spies both seams at exactly zero after the terminal
 * status is computed, because `A7` stays green through that bug.
 *
 * THE ORDER INSIDE A PLY IS LOAD-BEARING: append → derive → evaluate → render. `repetitionCounts`
 * counts each position INCLUDING THE CURRENT ONE (`history.ts:128-135`), so evaluating before the
 * append makes the *n*th occurrence read as *n−1* and both the automatic fivefold draw and the
 * threefold claim arrive one ply late, silently. Rendering after the evaluation is what makes the
 * last board a player sees the mated one.
 *
 * `gameStatus` IS NEVER CALLED BARE. Every evaluation goes through `gameStatusOf(history)`
 * (`history.ts:152`), which is `ADR-0002` clause 4's "`positionCounts` gets exactly one supplier"
 * made a call-site default. A loop that passes `gameStatus(position, new Map())` satisfies "carries a
 * counts map" at every call site and reports `in-progress` on the fifth occurrence of a position that
 * is a fivefold draw.
 *
 * THE LOOP NAMES NO ROW COUNT — `ADR-0009` clause 9. The render seam returns a frame's rows; the
 * session height is the FIRST frame's `.length`; `beginFrameSession` is called exactly once with it;
 * and every frame reaches the writer exactly as the seam returned it — no padding, no truncation, no
 * re-composition. This module imports no panel and does not import `frameHeight`: it does not need
 * the arithmetic when it has the rows. A declared height fails five of six row-count mutants and on
 * two of them emits 25 rows into a 24-row viewport, which is a live breach of epic acceptance `4b`.
 *
 * IT COMPOSES NO FRAME AND CHOOSES NO WRITE STRATEGY. Frame content is `ABC-014` / `ABC-016` /
 * `ABC-017` / `ABC-018`; the panels sit behind the one render seam (`ADR-0009` clause 9b). What this
 * module owns is DRIVING the writer `beginFrameSession` returns.
 *
 * BOTH SEAMS ARE ASYNCHRONOUS BY CONTRACT. Not because either is I/O-bound — the engine is pure CPU —
 * but because a loop shaped around a synchronous call cannot later accept a yielding or worker-based
 * engine without being rewritten, and `NFR-004` permits a 3-second occupancy. Nothing derived from a
 * `Position` is held across a suspension: `GameHistory.position` is BORROWED, never a snapshot
 * (`history.ts:39-44`), so the frame's inputs are read after the await, never before it (`A16`).
 *
 * THE STUBS ARE NOT HERE. The coordinate reader and the seeded engine are test seams, not designs for
 * `EPIC-003` and `EPIC-004`, and they live in `turn-loop.test.ts` — a `src/` stub module would be
 * production code that is dead the day the real parser and engine land (`ADR-0009` clause 9c).
 */

import { beginFrameSession, type FrameSink, type FrameWriter } from "./frame.ts";
import type { ClaimableDraw, EndReason, GameResult, GameStatus } from "./gameend.ts";
import { type GameHistory, gameStatusOf, playMove, takeBack } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";

/** A finished game's result — `GameResult` minus the one value a finished game cannot have. */
export type FinalResult = Exclude<GameResult, "in-progress">;

/**
 * Why the loop stopped. A SUPERSET of the rules core's `EndReason`, and `src/gameend.ts` is not
 * changed to build it: the core owns the five automatic conditions, and the loop owns the reasons a
 * game can end that are not chess conditions at all.
 *
 * - the five `EndReason` values — checkmate, stalemate, insufficient material, fivefold repetition,
 *   seventy-five-move;
 * - `resignation` — `EPIC-006`'s, whose transition this loop provides and whose command it does not
 *   implement;
 * - `engine-failure` and `engine-threw` — `A10` and `A9`. Both are DISTINCT FROM EVERY `EndReason`,
 *   so a result screen can never present an engine bug as a chess outcome;
 * - the two `ClaimableDraw` values — `ABC-021`'s claimed draws. That ticket owns the `claim` outcome
 *   itself; what this ticket owes is that the type has room for them WITHOUT a change to the rules
 *   core, which is why they are read from `gameend.ts` rather than re-spelled here.
 *
 * A criterion that names a count cannot pin a set, so the set is enumerated: `EndReason |
 * "resignation"` satisfies "admits resignation in addition to the five core values" word for word and
 * can represent none of the other four.
 */
export type TerminalReason =
  | EndReason
  | ClaimableDraw
  | "resignation"
  | "engine-failure"
  | "engine-threw";

/**
 * The render seam: the loop supplies everything the frame draws, and the seam derives nothing.
 *
 * The `GameHistory`, the `GameStatus` THE LOOP EVALUATED FOR THIS PLY, the `thinking` flag and the
 * message-region items — and a frame's ROWS back. The status is supplied rather than derived because
 * that is what makes `A5` and `A6`'s "no re-evaluation" satisfiable at all, and it is what keeps
 * `NFR-002`'s `O(window)` statement standing: that row voids itself if a renderer ever pulls the
 * repetition derive into a frame, and this loop is the only place the derive belongs.
 *
 * A seam that WRITES instead of returning leaves the loop holding no rows, and then the session
 * height cannot be derived at all (`ADR-0009` clause 9b, and this ticket's `[D26]`/`[D27]`).
 */
export type RenderSeam = (
  history: GameHistory,
  status: GameStatus,
  thinking: boolean,
  messages: readonly string[],
) => readonly string[];

/**
 * What a prompt returns. FOUR of these do not advance a ply, and that is the loop's most-travelled
 * edge — the epic's one-line specification does not contain it at all.
 *
 * `rejected`, `ambiguous` and `command` reach `rendering` WITHOUT passing through
 * `evaluating-terminal`, which is the structural reason `A5`/`A6`'s "not re-evaluated" is a property
 * of the machine and not only of a spy. Their message items are the loop's only channel for a
 * rejection line or an ambiguity candidate list: those live in the frame's own message region and
 * there is no second output channel.
 *
 * `game-over` is the transition `EPIC-006`'s `resign` and `ABC-021`'s `claim` both drive. THIS
 * TICKET OWNS ONLY THAT THE TRANSITION EXISTS — that `game-over` is reachable from `awaiting-human`
 * at all. Neither verb, its availability nor its wording is decided here.
 */
export type PromptOutcome =
  | { readonly kind: "move"; readonly move: Move }
  | { readonly kind: "rejected"; readonly messages: readonly string[] }
  | { readonly kind: "ambiguous"; readonly messages: readonly string[] }
  | { readonly kind: "command"; readonly messages: readonly string[] }
  | { readonly kind: "eof" }
  | { readonly kind: "game-over"; readonly result: FinalResult; readonly reason: TerminalReason };

/** The human's turn. `EPIC-003` replaces it; the loop waits on it and never reads stdin itself. */
export type InputSeam = (history: GameHistory) => Promise<PromptOutcome>;

/** The engine's turn. `EPIC-004` replaces it. Asynchronous by contract — see the module header. */
export type EngineSeam = (history: GameHistory) => Promise<Move>;

export interface TurnLoopOptions {
  /** The game. The loop appends to it; it never builds one, and `EPIC-006` supplies the anchor. */
  readonly history: GameHistory;
  /**
   * A RESOLVED colour. `EPIC-006`'s startup offers white / black / random and resolves `random`
   * before the loop sees it — the loop discovers nothing and defaults nothing.
   */
  readonly humanColour: "white" | "black";
  readonly render: RenderSeam;
  readonly input: InputSeam;
  readonly engine: EngineSeam;
  /** Where frames and the end-of-input notice go. `process.stdout` satisfies it. */
  readonly sink: FrameSink;
}

export interface LoopOutcome {
  /**
   * `gameStatus`'s OWN result, never re-derived — a loop computing `blackToMove ? "black-wins" :
   * "white-wins"` reports the LOSER as the winner and satisfies every other clause of `A7`.
   *
   * `null` when the loop stopped without a chess outcome: stdin ended (`A8` — no terminal result at
   * all), or the engine seam failed, which is not a chess outcome and must never be shown as one.
   */
  readonly result: FinalResult | null;
  /** `null` only on end-of-input. An engine failure has a reason but no result. */
  readonly reason: TerminalReason | null;
  /**
   * Always 0, and the type says so. BA/PM's EOF ruling: a truncated script exits cleanly and the
   * safety lives in the test's assertion — `EPIC-006`'s end-to-end test asserts the checkmate result
   * screen, so a truncated script fails on the missing screen. Putting the safety in the exit code
   * would make the game report a failure for a situation in which nothing is broken.
   */
  readonly exitCode: 0;
}

/** `A8`'s one-line notice. Exported so a caller asserts the line rather than restating it. */
export const INPUT_ENDED_NOTICE = "input ended";

const sideToMove = (history: GameHistory): "white" | "black" =>
  history.position.blackToMove ? "black" : "white";

/**
 * Did the generator produce this move for the position in hand? `A10` and `A10b` — ONE membership
 * test, shared by the two seams that can violate `playMove`'s precondition, because the question is
 * the same on both sides and a second copy is a second thing to get wrong.
 *
 * All SIX fields, not `from`/`to`: `playMove` reads `captured`, `flags` and `promotion` to build the
 * undo record, so a move with the right squares and a wrong `captured` corrupts the board exactly as
 * a foreign move does. What the two call sites do NOT share is the answer to a false — the engine
 * seam terminates with `engine-failure` and the input seam throws (`A10b`, `[D42]`).
 */
const wasGenerated = (history: GameHistory, move: Move): boolean =>
  legalMoves(history.position).some(
    (candidate) =>
      candidate.from === move.from &&
      candidate.to === move.to &&
      candidate.piece === move.piece &&
      candidate.captured === move.captured &&
      candidate.flags === move.flags &&
      candidate.promotion === move.promotion,
  );

/**
 * Run the game to a stop. Eight states and fifteen transitions; the sixteenth,
 * `awaiting-human` → `game-over` via the `claim` verb, is `ABC-021`'s.
 *
 * The render cadence is `1 + plies + RE-EMITTING non-advancing outcomes` frames, not one per ply:
 * the initial position is rendered BEFORE the first act — a loop that renders one frame per ply
 * prompts the human before any board has been shown — and the THREE non-advancing outcomes that
 * carry a message re-emit a frame, because that is where the message goes. END-OF-INPUT RE-EMITS
 * NOTHING: transition 10 goes to `exiting`, not to `rendering`, and its notice is a `sink.write`
 * rather than a frame. FOUR outcomes are non-advancing and only three of them emit a frame, so the
 * count-every-outcome form of this sentence is satisfied by a build that emits a frame on EOF —
 * which is why `A2` now carries the exclusion as its own clause (`[D29]`).
 */
export async function runTurnLoop(options: TurnLoopOptions): Promise<LoopOutcome> {
  const { history, humanColour, render, input, engine, sink } = options;

  let writer: FrameWriter | undefined;
  let messages: readonly string[] = [];
  // Transition 1 → 2. The status is computed before the first frame — always, terminal or not.
  let status = gameStatusOf(history);

  for (;;) {
    const humanToMove = sideToMove(history) === humanColour;
    // The frame that precedes an engine ply is the one the player watches while the engine thinks,
    // so the flag is the same predicate that drives transition 5 (`rendering` → `engine-thinking`).
    const thinking = status.result === "in-progress" && !humanToMove;

    // `rendering`. The session height is the FIRST frame's own row count, held for the session, and
    // `beginFrameSession` is called exactly once — the property `frame.ts`'s header rests on.
    const frame = render(history, status, thinking, messages);
    writer ??= beginFrameSession(sink, frame.length);
    writer(frame);
    messages = [];

    // The exit test, between render and act. The frame just shown is the final one.
    if (status.result !== "in-progress") {
      return { result: status.result, reason: status.reason, exitCode: 0 };
    }

    if (humanToMove) {
      let outcome: PromptOutcome;
      try {
        outcome = await input(history);
      } catch (error) {
        // `A9b`. REPAIR is symmetric across both seams; TERMINATING WITH A NAMED REASON is the
        // engine seam's alone. The input seam calls `legalMoves` — a real parser must, to reject an
        // illegal move — and `legalMoves` runs `makeMove`/`unmakeMove` on the LIVE borrowed object
        // (`legal.ts:42-53`), so a throw mid-filter can leave the position a ply ahead. Same repair
        // as transition 12, and nobody downstream is ever handed a mid-mutation board.
        //
        // RETHROWN, not terminated: stopping quietly would return `{ result: null, reason: null,
        // exitCode: 0 }`, which is BYTE-IDENTICAL to `A8`'s end-of-input and would present a crashed
        // parser as a clean exit — the failure `A10`'s "a result screen can never present an engine
        // bug as a chess outcome" exists to forbid. A named reason is the other option and it is
        // worse: it would invent a tenth `A14` value and decide whether a parser bug ends the game,
        // which is `EPIC-003`'s and `EPIC-006`'s question, not this skeleton's. The exception is
        // `EPIC-003`'s to own and `EPIC-006`'s to catch.
        takeBack(history, 0);
        throw error;
      }

      if (outcome.kind === "eof") {
        // Transition 10 — `exiting`, not `game-over`: a notice, exit 0, and NO terminal result.
        sink.write(`${INPUT_ENDED_NOTICE}\n`);
        return { result: null, reason: null, exitCode: 0 };
      }
      if (outcome.kind === "game-over") {
        return { result: outcome.result, reason: outcome.reason, exitCode: 0 };
      }
      if (outcome.kind !== "move") {
        // Transitions 7, 8, 9 — back to `rendering`, carrying the message, WITHOUT re-evaluating.
        messages = outcome.messages;
        continue;
      }

      // `A10b`. THE SAME GUARD AS TRANSITION 13, ON THE OTHER SEAM. `A10` named the engine seam and
      // nothing else, so this loop played a move no generator produced straight onto the board:
      // measured from the start position, `moves.length` 1 and a FEN no legal move can reach. The
      // stub "returns a generator-owned `Move`" is a property of the TEST DOUBLE, not of the
      // `InputSeam` contract `EPIC-003` replaces it under (`[D31]`, `[D42]`).
      //
      // THROWN, not terminated and not converted to `rejected`. A `{kind: "move"}` that is not legal
      // is a PARSER BUG, not a user typo — a real parser reports the user's illegal move as
      // `rejected` itself — so presenting it as a typo would hide a broken parser forever. A named
      // terminal reason is worse: it would invent a tenth `A14` value and decide whether a parser bug
      // ends the game, which is `EPIC-003`'s and `EPIC-006`'s question. Reusing `engine-failure`
      // would report an input fault as an engine fault. This is `A9b`'s answer, and the two paths are
      // now symmetric: the loop invents nothing and throws.
      if (!wasGenerated(history, outcome.move)) {
        throw new Error("input seam returned a move that is not in `legalMoves`");
      }
      playMove(history, outcome.move);
    } else {
      let move: Move;
      try {
        move = await engine(history);
      } catch {
        // Transition 12. A search descends with `makeMove`/`unmakeMove` on the LIVE object, so a
        // throw mid-operation can leave it plies ahead. `takeBack(history, 0)` splices nothing off
        // the list and replays it from `initialFen`, which is "rebuilt by replay" exactly. Nothing
        // in `src/` clones a `Position`, and continuing on the object in hand is the alternative.
        takeBack(history, 0);
        return { result: null, reason: "engine-threw", exitCode: 0 };
      }

      // Transition 13. `playMove` does not validate legality — its precondition is that the move
      // came from `legalMoves` — so a seam that returns a foreign move would corrupt the board
      // silently. Failing loudly beats playing a corrupt one.
      if (!wasGenerated(history, move)) {
        return { result: null, reason: "engine-failure", exitCode: 0 };
      }
      playMove(history, move);
    }

    // Transition 14 → 2: appended, then derived, then evaluated. One derive per ply, and none at all
    // on a non-advancing outcome — `A3b`'s spied count, which is what binds `NFR-002` here, because
    // a two-derives-per-ply build reads 93.58 µs against a 100 µs bar and MEETS it.
    status = gameStatusOf(history);
  }
}
