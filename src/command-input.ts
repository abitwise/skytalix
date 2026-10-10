/**
 * ABC-035 — the command table, classified in front of `ABC-033`'s entry point.
 *
 * GRAMMAR, PLUS ONE FLAG. This module decides whether a submitted line IS one of eight commands
 * and, for six of them, nothing about what any of them DOES beyond naming the arm. `help` carries
 * the one message set `ABC-035` owns; `moves` carries `ABC-036`'s count and listing (below);
 * `board` carries none; `claim` is a REQUEST the loop
 * adjudicates. There is no exit here, no second render and no availability test — `ABC-021` owns
 * both edges of a claim, and this file owns the vocabulary.
 *
 * `quit` (`ABC-046`) IS THE ONE TOKEN THAT CARRIES STATE, and the state is a PER-SESSION FLAG in
 * `createPromptLineResolver`, never in the loop (`ADR-0021` clause 6): the first `quit` is a
 * `command` outcome carrying `QUIT_CONFIRMATION_MESSAGES` — transition 9, a re-emitted frame — and
 * the second CONSECUTIVE `quit` is `{ kind: "quit" }`, transition 17. Any other line in between
 * clears the flag. Two states, no second read: a handler that read a confirmation line itself
 * would break `ABC-037`'s one-line-per-call contract. `resolvePromptLine` stays a PURE function
 * over a string and always answers the first-`quit` shape; the wrapper is what knows about the
 * second.
 *
 * `new` (`ABC-046`) is the one token whose effect MUTATES the game, and this module still mutates
 * nothing: the row resolves to `ADR-0021`'s `take-back` arm carrying `plies: moves.length`, and the
 * LOOP calls `takeBack` and re-evaluates (transition 18). `undo` (`ABC-102`) rides the same arm
 * with `plies: 2` — the human's move and the engine's reply — and below two plies it is REFUSED as
 * a `command` carrying `UNDO_REFUSAL_MESSAGES`: `takeBack` clamps, so an unguarded two-ply
 * take-back at ply 1 would silently reset the game, and that boundary is this seam's (`ADR-0021`
 * clause 4).
 *
 * `resign` (`ABC-045`) IS THE ONE TOKEN THAT CARRIES A VERDICT, and it is still grammar: the row
 * resolves to the EXISTING `game-over` arm (`src/turn-loop.ts`, `ABC-019`'s transition) with the
 * resigner's loss and the merged `"resignation"` reason — no new arm, no new reason, no
 * confirmation (BA/PM's ruling on that ticket: the modifier in the epic attaches to `quit`), and
 * no derive. The loser is the side to move, read off ONE field of the borrowed position; the loop
 * prompts only when that side is the human's, which is what makes the field the answer.
 *
 * THE BOUNDARY RULING IT IMPLEMENTS — BA/PM 2026-08-12, `ABC-035` `## The boundary ruling this
 * ticket implements`. `quit` is named by `EPIC-003` (the token) and by `EPIC-006` ("`quit` with
 * confirmation"), and the two do not conflict: the epic that names the grammar ships the grammar,
 * the epic that names the effect ships the effect. `claim` was split the same way on 2026-07-31.
 *
 * CLASSIFIED BEFORE EITHER RESOLVER IS ASKED — `A2`, and `ADR-0004` (2a): *"`parseSan` does not
 * classify commands … teaching `src/san.ts` the command set would drag `EPIC-003`'s command
 * vocabulary into a module whose entire justification is that it owns one grammar."* The
 * behaviour-equivalent-looking alternative is to ask `resolveMoveInput` first and fall back to the
 * table on a rejection. It is not equivalent: it hands `help` to both readers, and the day a token
 * collides with legal notation the player who typed the command gets the move instead. `b4` is a
 * legal move in most positions; `board` must never be reachable from it, and no resolver may ever
 * see `help`.
 *
 * TOLERANCE, AND ONLY THIS MUCH — `A1`. Surrounding whitespace trimmed, case folded, then an EXACT
 * whole-token match. No abbreviations, no aliases, no arguments: `hel`, `helpme`, `h` and `boards`
 * are not commands and fall through to the resolvers, which is the half of `A1` a prefix matcher
 * fails. The normalisation is used for the LOOKUP ONLY — the line handed on to `resolveMoveInput`
 * is the one the player typed, byte for byte, because case is MEANING in SAN (`bxc4` is a pawn
 * capture, `Bxc4` a bishop capture) and `ABC-033` owns that decision, not this module.
 *
 * AVAILABILITY-BLIND — `A6`. This module calls neither `gameStatusOf` nor `repetitionCounts`, and
 * it does not import `./history.ts` at all beyond the `GameHistory` type. A `claim` is classified
 * identically whether or not a draw is claimable; the loop adjudicates it against the status it
 * already evaluated for this ply (`src/turn-loop.ts`, `runTurnLoop`'s "TRANSITION 16" branch), and
 * the unavailable-case wording is `claimShortfall`'s (`src/turn-loop.ts` `claimShortfall`), merged
 * and asserted by `ABC-021` `A3`. A second derive here would cost 46-50 µs at 120 plies against
 * `NFR-002`'s 100 µs per-ply bar, for a value the loop already holds.
 *
 * THE HELP TEXT IS DERIVED FROM THE TABLE AND IS NEVER TYPED TWICE — `A4`. `helpMessages()` folds
 * `COMMAND_TABLE`, so a token added to the table appears in `help` by construction. `ABC-030`
 * exists because a hand-written list went stale; `ABC-059` exists because a guard pinned a spelling
 * instead of a fact.
 */

import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { type MoveInputDeps, resolveMoveInput } from "./move-input.ts";
import type { Position } from "./position.ts";
import { toSan } from "./san.ts";
import type { PromptOutcome } from "./turn-loop.ts";

/** The eight tokens, and the type that makes a ninth a compile error rather than a string typo. */
export type CommandToken =
  | "help"
  | "board"
  | "quit"
  | "claim"
  | "resign"
  | "new"
  | "undo"
  | "moves";

/**
 * One row of the table: the token, and WHICH arm of `PromptOutcome` classifying it produces.
 *
 * `outcome` is here because the eight tokens do NOT share one arm. Four are `command` — the merged
 * non-advancing outcome (`src/turn-loop.ts`) — `claim` is the dedicated payload-free
 * `{ kind: "claim" }` arm, `resign` is the `game-over` arm with a result, and `new` and `undo` are
 * the `take-back` arm with a ply count. A parser that returned `command` for `claim` would never reach
 * transition 16 and the player's claim would silently become a redraw; the ticket page said
 * exactly that until it was repaired on 2026-08-13.
 *
 * `quit` is `command` here because CLASSIFYING it produces the confirmation; the `{ kind: "quit" }`
 * arm is produced by the session flag in `createPromptLineResolver`, not by a row. `undo` is the
 * same in the other direction: its row is `take-back`, and below two plies the resolver answers
 * `command` with the refusal instead — the boundary is product policy, not a second row.
 */
export interface CommandSpec {
  readonly token: CommandToken;
  readonly outcome: "command" | "claim" | "game-over" | "take-back";
}

/**
 * The table. It is the single source of the vocabulary: `help`'s message set is folded out of it,
 * the classifier looks up in it, and `ABC-038`'s tab completion will read it rather than repeat it.
 *
 * `resign` IS here, `ABC-045`'s row, `new` IS here, `ABC-046`'s, `undo` IS here, `ABC-102`'s,
 * and `moves` IS here, `ABC-036`'s — LAST, because `help` folds this table in order and its two
 * rows are at zero headroom at the narrowest frame with `moves` at the end (`ABC-036` `A7`). A
 * token absent from this table is not a command, and the tests assert that in both directions.
 */
export const COMMAND_TABLE: readonly CommandSpec[] = [
  { token: "help", outcome: "command" },
  { token: "board", outcome: "command" },
  { token: "quit", outcome: "command" },
  { token: "claim", outcome: "claim" },
  { token: "resign", outcome: "game-over" },
  { token: "new", outcome: "take-back" },
  { token: "undo", outcome: "take-back" },
  { token: "moves", outcome: "command" },
];

/**
 * What the FIRST `quit` says. One item, 17 columns — the message region's bound (`W` is 18 at the
 * narrowest frame; `claimShortfall`'s reasoning in `src/turn-loop.ts`), so it is placed whole at
 * every frame this project draws. It names the token the player must repeat, because the
 * confirmation IS the repeat: there is no `y`, no `yes` and no second reader.
 */
export const QUIT_CONFIRMATION_MESSAGES: readonly string[] = ["quit again to end"];

/**
 * What `undo` says with fewer than two plies played (`ABC-102` ruling 3). One item, 15 columns —
 * within the same 17-column bound as the `quit` confirmation. True at ply 0, and at ply 1, where
 * the human is always Black and has not yet moved.
 */
export const UNDO_REFUSAL_MESSAGES: readonly string[] = ["nothing to undo"];

/**
 * `help`'s message set, FOLDED OUT OF THE TABLE — never a second copy of the vocabulary.
 *
 * One item per token and nothing else: the `commands:` heading was dropped at `ABC-102` (ruling 6)
 * so the seventh token fits the two rows at the narrowest frame. The frame's message region takes a LIST and places each
 * item whole or not at all (`src/frame.ts` `layoutMessageRegion`), so short items are what makes
 * `A7`'s hidden count 0 reachable at all: the delivered panel width is 21 columns at the start
 * position, and one prose sentence per command would not fit in the two rows the region has.
 * `A7`'s instruction on that collision is explicit — shorten the help, never widen the frame.
 */
export function helpMessages(): readonly string[] {
  return COMMAND_TABLE.map((spec) => spec.token);
}

/**
 * `moves`' message set (`ABC-036`): the EXACT legal count FIRST, then every legal move in SAN,
 * ascending by SAN string (code-unit order, so `Na3` sorts before `a3` on every machine).
 *
 * The count is the first item because the frame's message region places items in order and hides
 * the tail behind its `(+N more)` marker (`src/frame.ts` `layoutMessageRegion`): the count is the
 * half that must survive, the list the half that is reduced. ONE `legalMoves` per line, and that
 * array is handed to every `toSan` — without it `toSan` re-derives for each disambiguation
 * (`ADR-0004` clause 2: 0.10 µs instead of 4.31 µs per move). `deps` is `ABC-033`'s seam, so both
 * calls can be spied.
 */
function movesMessages(position: Position, deps?: MoveInputDeps): readonly string[] {
  const { legalMoves: derive, toSan: san } = deps ?? { legalMoves, toSan };
  const legal = derive(position);
  const listing = legal.map((move) => san(position, move, legal)).sort();
  return [`legal moves: ${legal.length}`, ...listing];
}

/**
 * Classify one line as a command, or `undefined` if it is not one.
 *
 * Exported because the TOKEN is what an effect owner needs and `PromptOutcome`'s `command` arm does
 * not carry it — `{ kind: "command"; messages }` cannot tell `quit` from `board`. `EPIC-006` binds
 * this to decide which effect to run; this module decides nothing about the effect itself.
 */
export function classifyCommand(line: string): CommandSpec | undefined {
  const token = line.trim().toLowerCase();
  return COMMAND_TABLE.find((spec) => spec.token === token);
}

/**
 * The arms one submitted line can produce: `ABC-033`'s three, `ABC-035`'s two, `ABC-045`'s one,
 * `ABC-046`'s two (`quit` from the wrapper only, `take-back` from the table).
 */
export type PromptLineOutcome = Extract<
  PromptOutcome,
  {
    readonly kind:
      | "move"
      | "rejected"
      | "ambiguous"
      | "command"
      | "claim"
      | "game-over"
      | "quit"
      | "take-back";
  }
>;

/**
 * Resolve one submitted line: a command if the table names it, otherwise `ABC-033`'s answer.
 *
 * A PURE FUNCTION OVER A STRING, exactly as `resolveMoveInput` is. It advances no ply, applies
 * nothing to the history and reads no availability — on every arm `toFen(history.position)` is
 * byte-identical afterwards and `history.moves` is untouched.
 *
 * `history` is consulted on FOUR command paths and derived from on ONE: every token is classified
 * without the position being asked anything; `moves` derives the legal moves of the position ONCE
 * to state and list them (`ABC-036`); `resign` then reads `position.blackToMove` — a
 * field, not a derive — to name the loser, `new` reads `moves.length` — a field, not a
 * derive — to name the ply count, and `undo` reads the same field to choose between the two-ply
 * take-back and the refusal, so no other derive can hide here. It is taken so this function can
 * stand in the `InputSeam` shape the loop already binds, and it is handed to `resolveMoveInput`
 * unchanged when the line is not a command.
 *
 * `quit` ALWAYS answers the first-`quit` shape here — the confirmation. This function has no
 * memory, by design; `createPromptLineResolver` is where the second `quit` becomes an exit.
 *
 * `deps` is `ABC-033`'s test seam, passed straight through — and called from this module on the
 * `moves` path only, for its `legalMoves` and `toSan`.
 */
export function resolvePromptLine(
  history: GameHistory,
  line: string,
  deps?: MoveInputDeps,
): PromptLineOutcome {
  const spec = classifyCommand(line);
  if (spec === undefined) {
    // The line the PLAYER typed, unmodified — not the folded lookup key. `ABC-033` and the two
    // resolvers under it own every question of case and whitespace from here on.
    return resolveMoveInput(history, line, deps);
  }
  if (spec.outcome === "claim") return { kind: "claim" };
  if (spec.token === "undo") {
    // `ABC-102` rulings 1 and 3: two plies — the human's move and the engine's reply — or, below
    // two, the refusal. `takeBack` clamps, so this guard is what stops ply 1 from silently
    // resetting the game. `moves.length` is read and nothing is mutated; the loop splices.
    return history.moves.length >= 2
      ? { kind: "take-back", plies: 2, messages: [] }
      : { kind: "command", messages: UNDO_REFUSAL_MESSAGES };
  }
  if (spec.outcome === "take-back") {
    // `ABC-046` `A4`: ALL plies, so the loop's `takeBack` replays nothing and the position, the
    // key list and the repetition counts rewind together (`ADR-0002`). Nothing is mutated HERE —
    // `moves.length` is read, the loop does the splice — so this stays a pure function over a
    // string with the history borrowed, exactly as on every other arm.
    return { kind: "take-back", plies: history.moves.length, messages: [] };
  }
  if (spec.outcome === "game-over") {
    // `ABC-045` `A1`, both directions from ONE expression: the resigner is the side to move, and
    // the opponent wins. `blackToMove` is read, never `humanColour` — the loop prompts only when
    // the side to move is the human's (`src/turn-loop.ts`), so the field IS the human's colour on
    // this path, and this module never learns the option.
    return {
      kind: "game-over",
      result: history.position.blackToMove ? "white-wins" : "black-wins",
      reason: "resignation",
    };
  }
  if (spec.token === "quit") return { kind: "command", messages: QUIT_CONFIRMATION_MESSAGES };
  if (spec.token === "moves")
    return { kind: "command", messages: movesMessages(history.position, deps) };
  return { kind: "command", messages: spec.token === "help" ? helpMessages() : [] };
}

/** What `createPromptLineResolver` returns: `resolvePromptLine`'s shape with `deps` bound. */
export type PromptLineResolver = ((history: GameHistory, line: string) => PromptLineOutcome) & {
  /** Clear the `quit` flag without resolving a line: the reader's over-cap branch (`ADR-0021` clause 6). */
  readonly disarm: () => void;
};

/**
 * The stateful wrapper `ABC-037`'s reader binds — ONE per session, holding the `quit` flag
 * (`ADR-0021` clause 6). It reads the token off `classifyCommand` and nothing else off the line:
 * a `quit` in any of `ABC-035`'s tolerated spellings arms it, and ANY other line — a move, a
 * rejection, another command — clears it. Armed and asked again, it answers `{ kind: "quit" }`
 * without calling `resolvePromptLine` or reading the row's `outcome`, though it has still
 * classified the line through `COMMAND_TABLE` by `classifyCommand`, as it does every line.
 * Otherwise it delegates to `resolvePromptLine` unchanged, so every pure property asserted of that
 * function holds of this one on every line but the second `quit`.
 *
 * The wrapper does not see every line. A line the reader refuses before resolving it — today only
 * the over-cap line (`src/line-input.ts`, `MAX_LINE_LENGTH`) — never reaches it, so the reader
 * calls `disarm` instead. `disarm` sets the flag to false and does nothing else: it takes no line,
 * returns nothing and calls no resolver.
 *
 * Why here and not in the loop: the loop is the mechanism and confirmation is product policy
 * (`ADR-0021` clause 6). Why not a module-level flag: two seams in one process — two tests, or a
 * future second session — would share it, and a flag armed by one player's `quit` must never end
 * another's session.
 */
export function createPromptLineResolver(deps?: MoveInputDeps): PromptLineResolver {
  let quitArmed = false;
  const resolve = (history: GameHistory, line: string): PromptLineOutcome => {
    const wasArmed = quitArmed;
    quitArmed = classifyCommand(line)?.token === "quit";
    if (wasArmed && quitArmed) return { kind: "quit" };
    return resolvePromptLine(history, line, deps);
  };
  return Object.assign(resolve, {
    disarm: (): void => {
      quitArmed = false;
    },
  });
}
