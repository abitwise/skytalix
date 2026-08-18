---
id: 20260818T233000Z-software-engineer-decision-the-shape-of-the-classifier-and-the-four-things-it-refuses-to-decide-a1c74e30
kind: decision
by: software-engineer
at: 2026-08-18T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - ABC-021
  - EPIC-003
  - EPIC-006
  - src/command-input.ts
  - src/move-input.ts
  - src/turn-loop.ts
supersedes:
---

# `src/command-input.ts` — one table, one lookup, in front of `resolveMoveInput`, and four decisions it refuses to make

## The shape

`resolvePromptLine(history, line, deps?)` classifies, then delegates. `classifyCommand` trims the
line, folds its case, and looks the whole string up in `COMMAND_TABLE` — **exact match, no prefix,
no alias, no argument**. A hit returns the arm the TABLE names for that row; a miss hands the line
to `ABC-033`'s `resolveMoveInput` **unmodified**.

`COMMAND_TABLE` is the single source of the vocabulary. `helpMessages()` folds it, the classifier
looks up in it, and `ABC-038`'s tab completion can read it. **`help`'s text is not written anywhere
in the module** — `["commands:", ...COMMAND_TABLE.map((spec) => spec.token)]` is the whole of it.
`ABC-030` exists because a help string was typed a second time and went stale; `ABC-059` exists
because a guard pinned a spelling instead of a fact. Both are avoided by construction here, and the
guard for it (`A4`) asserts **over the table**, not over a string.

## The arm is a column of the table, not an `if`

Three tokens produce `{ kind: "command" }`; `claim` produces the payload-free `{ kind: "claim" }`
arm (`src/turn-loop.ts:130`). That is a **data cell** (`outcome: "command" | "claim"`) rather than a
branch, so the test asserts the arm by reading the same table the production code reads: flipping
`claim`'s cell to `command` reds three rows instead of passing. The ticket page specified exactly
that wrong build until BA/PM repaired it on 2026-08-13, and a parser returning `command` for
`claim` never reaches transition 16 — the player's claim silently becomes a redraw.

## Four things this module refuses to decide, each with the owner named

1. **What `quit` does.** `quit` returns `{ kind: "command", messages: [] }` — recognised,
   non-advancing, and that is all. The confirmation, the exit and the result screen are `EPIC-006`'s.
   The fence has a guard: `quit` and `board` are asserted **outcome-identical and payload-free**, so
   the first line of effect written here breaks a test rather than shipping.
2. **Whether a claim is available.** The module calls neither `gameStatusOf` nor `repetitionCounts`
   and does not import `./history.ts` for anything but the `GameHistory` type. `ABC-021`'s merged
   loop adjudicates against the status it already evaluated for the ply.
3. **The unavailable-claim wording.** `claimShortfall` (`src/turn-loop.ts:234`) writes it; this
   module contributes **zero message items** to that path, asserted by counting the items that reach
   the frame (exactly 2, both matching `claimShortfall`'s shape).
4. **Case and whitespace beyond the lookup.** The folded, trimmed string is a **lookup key only**.
   `resolveMoveInput` receives the line the player typed, byte for byte, because case is MEANING in
   SAN and `ABC-033` owns that ruling. A guard pins it (`"  E2E4  "` reaches the coordinate reader
   verbatim) and the mutant that normalises it reds.

## Classify FIRST — and the alternative is not behaviour-equivalent

`A2`. The cheap-looking alternative is to ask `resolveMoveInput` first and fall back to the table on
a rejection. Measured, not argued: mutant **M7** builds it and reds **13 of 79**. It hands `help` to
both readers, and on the day a token collides with legal notation the player who typed a command
gets a move. `ADR-0004` (2a) forbids teaching `src/san.ts` the command vocabulary for the same
reason from the other side.

## One export exists for a caller that does not exist yet, and it is named rather than smuggled

`classifyCommand` is exported because **`PromptOutcome`'s `command` arm carries no token identity** —
`{ kind: "command"; messages }` cannot tell `quit` from `board`. `EPIC-006` will need the token to
choose an effect, and the alternatives were to widen the merged `PromptOutcome` (a production change
outside this ticket's module, which `A8` forbids) or to leave the effect owner with no seam at all.
Exporting the classifier costs nothing and changes no merged type. See the separate observation note
for the fact itself, which is `EPIC-006`'s to act on and not mine.
