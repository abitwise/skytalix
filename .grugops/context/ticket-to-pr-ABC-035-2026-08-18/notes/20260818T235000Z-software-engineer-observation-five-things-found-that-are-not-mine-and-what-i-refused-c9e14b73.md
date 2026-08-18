---
id: 20260818T235000Z-software-engineer-observation-five-things-found-that-are-not-mine-and-what-i-refused-c9e14b73
kind: observation
by: software-engineer
at: 2026-08-18T23:50:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-036
  - ABC-038
  - EPIC-006
  - src/turn-loop.ts
  - plans/tickets/ABC-035-in-game-commands.md
supersedes:
---

# Five things found on the way, none of them mine to fix — and four things I refused

## Found

**1. `PromptOutcome`'s `command` arm carries no token identity, and `EPIC-006` will need one.**
`{ kind: "command"; messages }` (`src/turn-loop.ts:129`) cannot tell `quit` from `board`: after this
ticket, the two are outcome-identical by design (grammar only, no effect, no message). The effect
owner therefore cannot dispatch on the outcome alone. I did **not** widen the merged type — that is a
production change outside this ticket's module and `A8` forbids it — and instead exported
`classifyCommand(line)`, which hands back the `CommandSpec` and changes nothing merged. **Whether
`PromptOutcome` should grow a token field is `EPIC-006`'s and the Architect's call, not mine.**

**2. `A7`'s headroom is real but small, and `ABC-036` is the next ticket to spend it.** The narrowest
frame this project draws is the **start position at `W` = 21 columns** (measured, not assumed:
board + status + empty history pane). `help`'s five items pack as `commands: help board` /
`quit claim` — two rows, hidden count 0, with room for **one** more short token: I measured
`["commands:", "help", "board", "quit", "claim", "moves"]` and it still fits with hidden count 0.
**A seventh item, or any token longer than about five characters, overflows and `A7` goes red.** When
`ABC-036` adds `moves` to a command table, its `A7`-equivalent must be re-measured rather than
assumed — and `A7`'s own instruction stands: **shorten the help, never widen the frame** (widening
breaks epic acceptance `4a`).

**3. The ticket page's line references all verify at this tip**, which is worth recording because six
of them were wrong before BA/PM's 2026-08-13 repair: `PromptOutcome` **`:125`**, the `command` arm
**`:129`**, the `claim` arm **`:130`**, `claimShortfall` **`:234`**, `MESSAGE_ROWS = 2`
**`src/frame.ts:45`**. All checked at `main` `8b055cb`. Nothing to fix; recorded so the next reader
does not re-check them.

**4. The base commit moved between the brief being written and the work starting, and I took the
later one.** The brief names `main` @ `23312b3`; `main` is at **`8b055cb`**, two commits later
(`30300d2` board/queue, `8b055cb` board fix — the one that put `ABC-035` in `In Development`).
`23312b3` is an ancestor, both commits are board/queue chores about this very ticket, and branching
off the older one would have delivered a branch that silently reverted them. **Branched off `main`'s
tip; the brief's baseline suite figure (1049 / 36 / skip 0) is unaffected — neither commit touches
`src/`.**

**5. `.grugops/queue/pending/` still holds three `ABC-078` subtask files.** Not mine, not touched,
named only so a later sweep does not read this hop as having left them.

## Refused

- **I did not edit the Definition of Ready table.** It still reads **9/10, ⚠️ × 1** — items 3 and 10,
  which are the same fact (the open ordering dependency on `ABC-033`). The dependency is discharged by
  measurement (`ABC-033` merged at `0d0f635`; `resolveMoveInput` exported; suite green), and the brief
  is explicit that the **re-score is BA/PM's pen**. Recorded, not applied.
- **I did not move a board column.** `plans/board.md` is untouched. The `In Development → In Review`
  move is the Orchestrator's per the brief, and QE's hop is still owed before this can go further —
  `AGENTS.md` § QE validation authority, every ticket, no exception.
- **I did not merge and I did not deploy.** The branch stands on its own; `main` is untouched.
- **I did not modify `src/move-input.ts`.** Merged, gated twice, not mine. `git diff main..HEAD --
  src/` shows the two `command-input` files and nothing else. **I also did not implement what `quit`
  does**, which is the fence I was most likely to walk through: `quit` returns a recognised,
  non-advancing, message-free outcome and there is a test asserting it is byte-identical to `board`'s,
  so the first line of `EPIC-006`'s effect written here reds a guard.
