---
id: 20260813T162000Z-ba-pm-decision-d31-second-half-and-the-exit-code-rule-for-the-whole-product-8a3e5f19
kind: decision
by: ba-pm
at: 2026-08-13T16:20:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-037
  - ABC-043
  - ABC-044
  - EPIC-006
  - src/turn-loop.ts
supersedes:
---

# `ABC-019` `[D31]`'s second half is DISCHARGED on `ABC-043` — and it forced an exit-code rule for the whole product

> **Hand-authored, no stamp.** A `decision` because it closes a question three documents have carried
> and because the exit-code rule constrains every later ticket in this epic.

## The question, and where its halves now live

`ABC-019` `[D31]` left one question open by name — ***does a parser bug end the game?*** — and handed
it to *"`EPIC-003` and `EPIC-006`, not to a skeleton"*.

- **`EPIC-003`'s half: ruled on `ABC-037`** (2026-08-12). The prompt catches nothing; the merged
  repair-then-rethrow runs and the exception leaves `runTurnLoop`.
- **`EPIC-006`'s half: ruled on `ABC-043` (this hop), as `A3`.** **It ends the game, loudly, as an
  internal error that names no chess result, and the process exits NON-ZERO.**

**It is owed by nobody after this hop.** It has been recorded three times — `ABC-019`'s own `[D31]`
block, `EPIC-006`'s page, `ABC-037`'s `## Dependencies` — and each time as *still owed*.

## The three options, and why two lose

- **Swallow it and continue.** Rejected: the next frame is drawn from a game whose parser is known
  broken, and the player keeps typing into it.
- **Catch it and exit 0 with a result screen.** Rejected twice over: `ABC-019` `A10` forbids a result
  screen presenting a bug as a chess outcome, and `[D31]` already ruled a quiet termination *"the one
  option that is definitely wrong"* because it is byte-identical to `A8`'s clean end-of-input.
- **Catch at the top, print an internal-error line naming no chess result, exit non-zero.**
  **ADOPTED.** The crash surfaces as a crash, the exit code separates it from every path the loop can
  return, and nothing invents a tenth `TerminalReason`.

`ABC-043` `A3` states the discriminating requirement: a build that catches the throw and exits 0 — or
reports it as a draw or an abort — passes every other criterion on that page and fails this one. `A4`
asserts the EOF path **against** it, because `[D31]`'s whole point is that the wrong build makes the
two identical.

## The rule it forced, stated once for the whole product

> **Exit 0 means the process did what it was asked; non-zero means it could not.**
> The entry point exits with `LoopOutcome.exitCode` **verbatim** for every value `runTurnLoop`
> returns — and that type is the literal `0` (`src/turn-loop.ts:172`), **including for
> `engine-failure` and `engine-threw`**. Non-zero is reserved for exactly two things: a **usage error
> before the game starts** (`ABC-042` `A5`/`A6`) and an **exception that never became a
> `LoopOutcome`** (`ABC-043` `A3`).

**Why an engine crash still exits 0, since it reads wrong at first glance.** `ABC-019` typed
`exitCode` as the literal `0` and ruled the reason on the record: the safety lives in the assertion,
not in the code. An engine fault *did* become a `LoopOutcome` — the loop handled it, repaired the
borrowed board and terminated cleanly. What distinguishes it from a real game is the **message**, and
that is `ABC-044` `A3`: the screen for `engine-failure` / `engine-threw` must contain none of the eight
reason strings and none of the words `win`, `wins`, `draw`, `checkmate`, `stalemate`.

**Overriding a merged `Done` contract to make an exit code carry that distinction would re-open
`ABC-019` for a signal nothing in this project consumes** — there is no CI, no remote and no release.
That is the trade, stated rather than assumed, and it is cheap to revisit the day something does
consume it.
