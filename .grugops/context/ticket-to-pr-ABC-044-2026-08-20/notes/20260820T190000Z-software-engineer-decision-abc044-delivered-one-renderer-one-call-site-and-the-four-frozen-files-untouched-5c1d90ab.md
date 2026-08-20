---
id: 20260820T190000Z-software-engineer-decision-abc044-delivered-one-renderer-one-call-site-and-the-four-frozen-files-untouched-5c1d90ab
kind: decision
by: software-engineer
role: software-engineer
task: ticket-to-pr-ABC-044-2026-08-20
at: 2026-08-20T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A3
  - ABC-044/A4
  - ABC-044/A5
  - ABC-044/A6
  - ABC-044/A7
  - ABC-043
  - ABC-042
  - ABC-019
  - ABC-020
  - ADR-0002
  - ADR-0011
  - NFR-002
supersedes:
---

# `ABC-044` delivered: one pure renderer, one call site, and the four frozen files byte-identical

## What was built

**`src/result-screen.ts` (172 lines, new).** `renderResultScreen(outcome, history): readonly string[]`.
A pure function of `LoopOutcome` and `GameHistory` that derives no game state. It returns:

1. a blank separator row — the screen is written onto the same stream the loop's frames went to and
   there is no writer between them to space it;
2. the headline — `<result phrase> <reason phrase>.` for the eight game outcomes, or a two-row fault
   statement for `engine-failure` / `engine-threw`;
3. a blank row;
4. **the whole move list**, in SAN, in move-number pairs — unwindowed.

**`src/result-screen.test.ts` (281 lines, new).** `A1`–`A5`, thirteen rows, no process and no TTY.

**`src/cli.ts` (+15/−1).** The history is now HELD (`const history = newGame(START_FEN);`) rather than
constructed inside the options object, because the screen is a function of the game as well as of the
outcome; then `renderResultScreen(outcome, history)` and **one** guarded `sink.write`.

**`src/cli.test.ts` (+116/−1).** `A6` and the entry-point halves of `A3`/`A4`, on `ABC-042`'s
existing spawn harness. **Zero new children** — `N8-SPAWN`'s pin of 17 does not move.

## The wording chosen, and why each phrase is the shape it is

| reason | phrase |
|---|---|
| `checkmate` | `by checkmate` |
| `stalemate` | `by stalemate` |
| `insufficient-material` | `by insufficient material` |
| `fivefold-repetition` | `by fivefold repetition, automatic under FIDE 9.6.1` |
| `seventy-five-move` | `by the seventy-five-move rule, automatic under FIDE 9.6.2` |
| `threefold-repetition` | `by threefold repetition, claimed by the player to move under FIDE 9.2` |
| `fifty-move` | `by the fifty-move rule, claimed by the player to move under FIDE 9.3` |
| `resignation` | `by resignation` |

`REASON_PHRASE` is typed `Readonly<Record<Exclude<TerminalReason, "engine-failure" | "engine-threw">, string>>`,
so **a ninth `TerminalReason` fails to compile here rather than printing `undefined`**. The eight were
READ off `TerminalReason` (`src/turn-loop.ts:78-83`) and `EndReason`/`ClaimableDraw`
(`src/gameend.ts:40-48`), not re-decided.

**Everything is ASCII**, deliberately. `src/cli.test.ts`'s merged `A7` row asserts zero code points
above `U+007F` on a no-flags stream; an em dash in a phrase would have been a live breach the first
time a game ended on that child. Commas carry the clause instead.

**The two fault lines name no rule and no chess word**, so `ABC-043` `A5`'s merged absence rows —
which scan the whole stream for all ten `TerminalReason` values and for `win`/`draw`/`resign`/
`checkmate`/`stalemate` — stay green now that the screen is on that stream. That was checked by
running them, not by reading them.

## Decisions taken in the doing, with the alternative that was rejected

**(1) The black-to-move anchor's first pair is elided as `12... Nf6`, not as an empty column.**
`src/history-pane.ts`'s merged rule was read for what it actually decides — *which pair a ply belongs
to and what number it carries*, both from the REPLAYED position's `fullmoveNumber` / `blackToMove`,
never from the array index. That rule is reused verbatim. What the pane does on top of it — pad the
empty white cell to `SAN_WIDTH` — is a **fixed-column** behaviour, and this screen has no fixed
columns (it is not a frame, `assembleFrame` never sees it). Padding a cell nothing aligns to would
have been copying the pane's layout rather than its rule.

**(2) The move list is printed for the fault screens too.** No criterion asks for it and none forbids
it. A player whose engine crashed still played the moves. It costs nothing: both fault children play
zero plies, so the list is empty in practice.

**(3) `newGame(START_FEN)` was hoisted out of the `runTurnLoop` options object, and `ABC-043` `A1`'s
guard row was moved with it.** This is the one merged criterion's instrument this ticket touched, and
it is recorded rather than slipped in. The old row was
`expect(entry).toMatch(/history:\s*newGame\(START_FEN\)/)`. There is no spelling that keeps the
history reachable after the loop returns AND leaves that literal in the options object.
**The replacement is three rows, not one, and is strictly stronger than what it replaced:**

- `expect(entry).toMatch(/const history = newGame\(START_FEN\);/)` — the binding is the merged
  factory's own value at the merged anchor;
- `expect(entry).toMatch(/\bhistory,/)` — that binding is what the option carries;
- `expect(entry.match(/\bnewGame\s*\(/g)).toHaveLength(1)` — **new**: the game is constructed exactly
  once, which the old single row could not see.

A shorthand row alone would be green on `const history = somethingElse`; an initializer row alone
would be green on a build that constructed one game and passed another. Both are pinned.

## What was deliberately NOT done

- **`src/result-screen.ts` is NOT in `FRAME_PRODUCERS`** (`src/history-pane.nfr.test.ts:187`,
  `ADR-0011` clause 2). It is not a frame producer: it is written once per GAME, after the last
  frame, outside the frame session, and `NFR-002` is not triggered. The stop condition said this is
  easy to get backwards; it was not gotten backwards.
- **`LICENSED_DRIVERS` is unchanged and still `["turn-loop.ts", "cli.ts"]`.** The new module imports
  `./history.ts` and `./turn-loop.ts` as **types only**, so `ADR-0002` clause 4's single-supplier
  EQUALITY holds without an entry. `src/cli.test.ts`'s `A12` row asserts that two-name list and is
  green untouched.
- **`src/gameend.ts`, `src/turn-loop.ts`, `src/history-pane.ts`, `src/frame.ts` were not opened for
  editing.** `git diff --numstat 30482cd -- <the four>` is **empty**. Nothing in the implementation
  wanted them changed, so the stop condition was never reached.
- **No runtime dependency and no Node builtin was added** — the ticket's own falsifiable security
  threshold, still not fired.

## `SPLIT_REQUIRED` was NOT raised, and the size assessment held

`S` (2) was right. The vocabulary (`A1`–`A4`) and the move list (`A5`) are ~50 and ~25 lines of
production code respectively; the named split line was never approached. Total production delivered:
**172 new lines plus 14 in the entry point.**
