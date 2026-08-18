/**
 * ABC-035 — the command table, classified in front of `ABC-033`'s entry point.
 *
 * GRAMMAR ONLY. This module decides whether a submitted line IS one of four commands and nothing
 * about what any of them DOES. `help` carries the one message set this ticket owns; `board` and
 * `quit` carry none; `claim` is a REQUEST the loop adjudicates. There is no state change here, no
 * exit, no confirmation prompt, no second render and no availability test — `EPIC-006` owns what
 * `quit` does, `ABC-021` owns both edges of a claim, and this file owns the vocabulary.
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
 * already evaluated for this ply (`src/turn-loop.ts:319-341`), and the unavailable-case wording is
 * `claimShortfall`'s (`src/turn-loop.ts:234`), merged and asserted by `ABC-021` `A3`. A second
 * derive here would cost 46-50 µs at 120 plies against `NFR-002`'s 100 µs per-ply bar, for a value
 * the loop already holds.
 *
 * THE HELP TEXT IS DERIVED FROM THE TABLE AND IS NEVER TYPED TWICE — `A4`. `helpMessages()` folds
 * `COMMAND_TABLE`, so a token added to the table appears in `help` by construction. `ABC-030`
 * exists because a hand-written list went stale; `ABC-059` exists because a guard pinned a spelling
 * instead of a fact.
 */

import type { GameHistory } from "./history.ts";
import { type MoveInputDeps, resolveMoveInput } from "./move-input.ts";
import type { PromptOutcome } from "./turn-loop.ts";

/** The four tokens, and the type that makes a fifth a compile error rather than a string typo. */
export type CommandToken = "help" | "board" | "quit" | "claim";

/**
 * One row of the table: the token, and WHICH arm of `PromptOutcome` classifying it produces.
 *
 * `outcome` is here because the four tokens do NOT share one arm. Three are `command` — the merged
 * non-advancing outcome (`src/turn-loop.ts:129`) — and `claim` is the dedicated payload-free
 * `{ kind: "claim" }` arm (`:130`). A parser that returned `command` for `claim` would never reach
 * transition 16 and the player's claim would silently become a redraw; the ticket page said exactly
 * that until it was repaired on 2026-08-13.
 */
export interface CommandSpec {
  readonly token: CommandToken;
  readonly outcome: "command" | "claim";
}

/**
 * The table. It is the single source of the vocabulary: `help`'s message set is folded out of it,
 * the classifier looks up in it, and `ABC-038`'s tab completion will read it rather than repeat it.
 *
 * `moves` is NOT here — it is `ABC-036`. `undo`, `resign` and `new` are NOT here — they are
 * `EPIC-006`'s command set. A token absent from this table is not a command, and the tests assert
 * that in both directions.
 */
export const COMMAND_TABLE: readonly CommandSpec[] = [
  { token: "help", outcome: "command" },
  { token: "board", outcome: "command" },
  { token: "quit", outcome: "command" },
  { token: "claim", outcome: "claim" },
];

/** The heading item. It is not a token, and `help` naming it costs the message region nothing. */
const HELP_HEADING = "commands:";

/**
 * `help`'s message set, FOLDED OUT OF THE TABLE — never a second copy of the vocabulary.
 *
 * One item per token, plus the heading. The frame's message region takes a LIST and places each
 * item whole or not at all (`src/frame.ts` `layoutMessageRegion`), so short items are what makes
 * `A7`'s hidden count 0 reachable at all: the delivered panel width is 21 columns at the start
 * position, and one prose sentence per command would not fit in the two rows the region has.
 * `A7`'s instruction on that collision is explicit — shorten the help, never widen the frame.
 */
export function helpMessages(): readonly string[] {
  return [HELP_HEADING, ...COMMAND_TABLE.map((spec) => spec.token)];
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

/** The arms one submitted line can produce: `ABC-033`'s three, plus this ticket's two. */
export type PromptLineOutcome = Extract<
  PromptOutcome,
  { readonly kind: "move" | "rejected" | "ambiguous" | "command" | "claim" }
>;

/**
 * Resolve one submitted line: a command if the table names it, otherwise `ABC-033`'s answer.
 *
 * A PURE FUNCTION OVER A STRING, exactly as `resolveMoveInput` is. It advances no ply, applies
 * nothing to the history and reads no availability — on every arm `toFen(history.position)` is
 * byte-identical afterwards and `history.moves` is untouched.
 *
 * `history` is UNUSED on the command path and that is the point rather than an oversight: the four
 * tokens are classified without the position being consulted, so no derive can hide here. It is
 * taken so this function can stand in the `InputSeam` shape the loop already binds, and it is
 * handed to `resolveMoveInput` unchanged when the line is not a command.
 *
 * `deps` is `ABC-033`'s test seam, passed straight through and never called from this module.
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
  return { kind: "command", messages: spec.token === "help" ? helpMessages() : [] };
}
