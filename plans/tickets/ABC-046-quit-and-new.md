---
id: ABC-046
title: `quit` with confirmation, and `new` — the two session commands the merged `PromptOutcome` has no arm for
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-006
feature: —
---

# ABC-046 — the two commands that do not fit the loop, and the contract question they both turn on

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition.
>
> **THIS TICKET IS CUT TO RECORD A CONTRACT GAP WHERE THE NEXT ENGINEER WILL READ IT, NOT TO SMOOTH
> IT.** Both commands are in `EPIC-006` § Scope. **Neither has a representable outcome in merged
> code**, `ABC-019` is `Done`, and the ruling that closes them is Architect/Design's. Its Definition
> of Ready is deliberately not met.

## Problem

*User*: the player who wants to stop, and the player who wants to start again.

*Pain, measured against merged types rather than argued:*

**`quit` has no outcome.** `PromptOutcome`'s terminal arm is
`{ kind: "game-over"; result: FinalResult; reason: TerminalReason }` and
`FinalResult = Exclude<GameResult, "in-progress">` — **every `game-over` carries a win or a draw**
(`src/turn-loop.ts:57,132`). Quitting is neither. The only no-result exit the loop has is
`{ kind: "eof" }`, and it writes `INPUT_ENDED_NOTICE` — the literal string `"input ended"`
(`src/turn-loop.ts:176,313`) — which is not what happened when a player typed `quit`.

**`new` leaves one stale frame.** The reset itself is clean and in-contract:
`takeBack(history, history.moves.length)` splices the list and replays from `initialFen`, so the
position, the Zobrist keys and the repetition counts rewind **together** — `ADR-0002`'s binding
contract, and the structural answer to this epic's own stated risk. But `new` must return a
non-advancing outcome, and **the loop does not re-evaluate `GameStatus` on one**: transitions 7/8/9 go
straight back to `rendering` (`src/turn-loop.ts:342-346`), by design, because that is what makes
`ABC-019`'s `A5`/`A6` *"not re-evaluated"* a property of the machine. `renderStatusPanel` reads
side-to-move, move number, check, material and last move **live from `history.position`**, but reads
the draw-claim cell from the passed `status` (`src/status-panel.ts:187-216`). **So for exactly one
frame after `new`, a reset board can display a draw claim from the game that was just discarded.**

*Value*: `quit` and `new` are both named in the epic's scope. Recording precisely why they do not fit
is worth more than either of them.

## The product half, ruled here; the contract half, routed

**BA/PM, 2026-08-13. Quitting records NO result.** This product has no persistence, no ratings and no
opponent to award a win to; defining `quit` as a loss would invent a chess rule to fit a type. So the
required behaviour is: the session ends, no result screen is written, and the exit code is **0**
(`ABC-043`'s rule — the process did what it was asked).

**What carries it is NOT mine.** Three shapes, priced, none adopted here:

| shape | cost |
|---|---|
| **(a) `quit` returns `eof`** | in-contract, zero code change to `Done` work, exit 0 — **and the player who typed `quit` is told `input ended`.** A wrong-but-harmless message, and the cheapest option by a wide margin |
| **(b) the loop gains an arm** (`{ kind: "quit" }`, or `LoopOutcome.reason` admits a no-result stop) | correct, and it **re-opens a `Done`, gated, mutation-tested module** whose state machine is enumerated at 8 states / 16 transitions. Needs Architect/Design and its own ticket |
| **(c) `quit` ≡ resignation** | in-contract and **rejected outright**: it invents a rule the epic does not state, makes `quit` and `resign` the same command, and puts a loss on a player who asked to stop |

**`new` turns on the same question** — under (a)/(c) it cannot avoid the stale claim cell; under (b) a
re-evaluating arm removes it. **That is why the two are one ticket.**

## Scope

- **The `quit` token's effect**: confirmation, then the end of the session with no result.
  **`ABC-035` already owns the token** (*"`quit` | `command` **here**; the confirmation and the exit are
  `EPIC-006`'s"*).
- **The `new` token and its effect**: `takeBack(history, history.moves.length)`, then a non-advancing
  outcome, then a redrawn board.
- **The confirmation mechanism**, used by `quit` and available to anything later: **two-state, no
  second read** — the first `quit` produces a `command` outcome whose message asks for confirmation,
  the second consecutive `quit` ends the session. *(A mechanism that reads a second line inside the
  command handler would break `ABC-037`'s one-line-per-call contract and give the command layer its
  own access to stdin. This shape needs neither.)*

## Out of scope

- **`resign`** — `ABC-045`.
- **`undo`** — **not cut**; it needs an engine reply.
- **Choosing shape (a), (b) or (c)** — Architect/Design's, and the reason this ticket is not `Ready`.
- **Changing `src/turn-loop.ts`.** If shape (b) is ruled, that change is **its own ticket**, not a
  quiet edit inside this one.
- **`play again?` on the result screen.** `new` restarts a game **in progress**; the game-over screen
  is `ABC-044`'s and offers nothing.

## Acceptance (Given/When/Then)

**Written to be shape-neutral where the ruling has not landed, and exact everywhere else.** `A3` is
the criterion the ruling decides; it is written so that shape (a) FAILS it, which is the honest
statement of what is open.

- **`A1` (confirmation: one `quit` does not end anything).** **Given** a running session, **when** a
  single `quit` is entered, **then** the session continues, a frame is written carrying a message that
  asks for confirmation, and the process does **not** exit. **When** a second consecutive `quit`
  follows, **then** the session ends. **Given** `quit`, then a legal move, then `quit`, **then** the
  session does **not** end — the confirmation does not survive an intervening command.
- **`A2` (quitting records no result).** **When** the session ends by `quit`, **then** **no result
  screen is written** (`ABC-044` produces zero rows), and the exit code is **0**.
- **`A3` (the message is about quitting — THE CRITERION THE RULING DECIDES).** **When** the session
  ends by `quit`, **then** the last line written names quitting and is **not** `INPUT_ENDED_NOTICE`.
  **A build on shape (a) fails this criterion.** *(It is stated rather than softened so that adopting
  (a) is a recorded, deliberate acceptance of a wrong message and not an accident.)*
- **`A4` (`new` rewinds everything, not just the board).** **Given** a game at ply ≥ 6 including a
  repeated position, **when** `new` is entered, **then** `toFen(history.position)` is byte-identical to
  the start FEN, `history.moves.length` is **0**, `keyHistory(history).length` is **1**, and
  `repetitionCounts(history)` has **exactly one entry with count 1**. *(The epic's own stated risk —
  *"a shallow undo that forgets repetition history would corrupt draw detection"* — asserted on the
  one command that can carry it today. `ADR-0002` says all three rewind together; this proves it.)*
- **`A5` (`new` redraws, and the stale claim cell is not silently shipped).** **Given** a position
  where `status.claimable` is present, **when** `new` is entered, **then** the **next frame's status
  panel shows no draw claim**. *(This is the criterion shape (a)/(c) cannot satisfy inside merged code.
  If the ruling is (a) or (c), this criterion must be **explicitly amended by BA/PM with the defect
  recorded**, not quietly dropped.)*
- **`A6` (`new` keeps the session's other settings).** **After** `new`, the human's colour, the glyph
  mode and the board orientation are unchanged — asserted by byte-comparing the redrawn board region
  with the session's opening frame.
- **`A7` (both are commands, classified before the grammars).** **Given** the lines `quit` and `new`,
  **then** each outcome comes from the command table with **neither move resolver called** (spied).
- **`A8` (nothing else changed).** `git diff --numstat` shows `ABC-035`'s command module, the entry
  point if `A2` requires it, and the test file(s) — and **nothing else** under `src/`.
  **`src/turn-loop.ts` byte-identical**, unless shape (b) is ruled, in which case that change is a
  separate ticket and this criterion still holds for this one. Suite green, skip **0**.

## Dependencies

- **THE BLOCKER IS A RULING, NOT A TICKET: shape (a), (b) or (c) above. Owner: Architect/Design.**
  Until it lands, `A3` and `A5` cannot both be satisfiable and the ticket cannot be pulled.
- **`ABC-035`, `ABC-037` and `ABC-043` must all land first — all OPEN**, and `ABC-043` is itself
  blocked.
- **`ABC-019`, `ABC-012` (`takeBack`, `keyHistory`, `repetitionCounts`) and `ADR-0002` are MERGED** and
  supply everything `new`'s reset needs. **`new` needs no new state logic at all** — that is the one
  genuinely cheap half of this ticket.
- **Cross-epic check:** if `ABC-038` (tab-completion) has merged, `new` must be a completion target;
  `quit` already is.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol.
- **`NFR-002` — not triggered.** No frame is composed here. **`A5` is a `NFR-002`-adjacent
  *correctness* criterion, not a latency one**, and is named so the two are not confused.
- **Cost of `new`, priced:** `takeBack(history, n)` replays from `initialFen` — `O(plies)`, the same
  operation the loop already performs on both seam-failure paths. It runs once per `new`, never per
  ply.
- **Security — not triggered.** Two tokens in an existing table already covered by `ABC-037`'s three
  bars. **Firing threshold:** it fires if the diff touches any file under `src/` other than `ABC-035`'s
  command module, the entry point and the test file(s).

## Test notes

1. **`A1`'s third clause is the one that catches a sloppy confirmation** — a build that latches "quit
   was asked once" forever ends the game on a `quit` typed ten moves later.
2. **`A4` must assert `repetitionCounts`, not just the FEN.** A reset that rebuilds the position but
   keeps the key list passes a FEN check and corrupts the next draw detection — the epic's own risk.
3. **`A5` needs a position with a live claim.** `src/turn-loop.test.ts` already builds threefold
   positions; reuse the fixture rather than constructing a new one.
4. **Do not write `A3` as a `contains` on a substring of `INPUT_ENDED_NOTICE`.** Assert inequality
   against the merged exported constant, so a rename cannot make it pass.
5. **Reuse the entry-point spawn harness.** Do not build another.

## Lane cost — how many test FILES this ticket implies

**Zero new files, and one is achievable only if the ruling stays inside merged code.** `A1`, `A4`,
`A5`, `A6`, `A7` extend `ABC-035`'s command test file; `A2`, `A3` extend the entry-point file
`ABC-042`/`ABC-043` share. No `vi.mock`, so **no `*.nfr.test.ts`**.

**If shape (b) is ruled**, the loop change is a separate ticket with its own file count, and it is
**not** counted in this epic's total. Stated so the epic's arithmetic is honest about what it does and
does not cover.

**Weight: nil** — it adds no file.

## Size and priority rationale

**Size `S` (2).** Two tokens, one two-state confirmation, one list-truncating reset that needs no new
state logic, and seven criteria. It is above `XS` because of the confirmation's state and because two
of its criteria are contingent on a ruling. Calibrated against `ABC-035` (`S`).

**Not `XL`. The split line if it moves:** **(a)** `new` and the reset — `A4`–`A7`; **(b)** `quit` and
the confirmation — `A1`–`A3`. Both are `XS` alone, and **(a) is the half that is nearly unblocked.**

**Priority `P2`, and the reason is measured rather than felt: the player already has a working exit.**
`ABC-019`'s merged EOF path means Ctrl-D ends the session cleanly with exit **0** today, and `ABC-037`
`A3` re-asserts it through the real reader. **`quit` is a convenience over a capability that already
exists**, and `new` is a convenience over restarting the process. `P2` on this board is the drop-first
tier (`ABC-017`, `ABC-021`) — **and this ticket is the correct occupant of it: if `EPIC-006` runs
long, cut this one first.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 7 of 10 clean, 3 recorded ⚠️ — NOT MET. Stays in `Backlog`, and it is the
only ticket in this epic blocked by a DECISION rather than by an ordering.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two commands in the epic's scope; both gaps read off merged types and merged transitions with line numbers, neither argued |
| 2 | scope and out-of-scope clear | **✅** two tokens, one confirmation mechanism whose shape is chosen to avoid a second stdin read; five fences, including an explicit "shape (b) is its own ticket" |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: three open ordering dependencies **and** an open ruling |
| 4 | acceptance testable and measurable | **✅** eight criteria: a confirmation that does not survive an intervening command, **zero** result-screen rows, inequality against an exported constant, `moves.length` **0** / `keyHistory` **1** / one repetition entry, a byte-compared redraw, both resolvers spied at 0 |
| 5 | dependencies known | **✅** the ruling named with its owner and three priced shapes; three open tickets; three merged contracts named as supplying the reset; one cross-epic completion check |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` not triggered, with `A5` explicitly labelled correctness rather than latency; `takeBack` priced; security not triggered with a falsifiable threshold |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` (2), calibrated, with the split line named and the nearly-unblocked half identified |
| 9 | priority assigned | **✅** `P2`, on the measured fact that Ctrl-D already exits cleanly |
| 10 | no major unresolved blocker | **⚠️⚠️ TWO.** **(a) THE CONTRACT RULING IS OPEN** — `quit` has no representable outcome and `new` cannot clear the stale claim cell without one; three shapes are priced and **none is adopted here**. **(b) three ordering dependencies are OPEN**, one of them itself blocked |
