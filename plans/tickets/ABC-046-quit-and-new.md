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
- **2026-09-19 (BA/PM, `cut-arm-ticket`): the arm ticket is CUT — `ABC-120` (`S`/`P1`, `Ready`) — and this ticket lands AFTER it;** `ABC-120` owns `src/turn-loop.ts`, `QUIT_NOTICE` (literal `"quit"`) and transitions 17/18; DoR item 3 / item 10's ⚠️ (*"the arm ticket is uncut"*) is now an ORDERING on a named id.

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

## Design ruling 2026-09-19 — shape (b) is RULED; the ruling is `ADR-0021`

**Architect/Design, task `owner-rulings-2026-09-19`, subtask `ruling-abc046-quit-arm`, on the owner's
word in session — *"5. b, resign should be separate"* (Olger Oeselg, 2026-09-19).** The authority is
`memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md`; this section is a
pointer plus what changes on THIS page. Reasoning, alternatives and measurements are in the ADR and in
`.grugops/context/ruling-abc046-quit-arm/notes/`, not restated here.

- **The blocker named in `## Dependencies` is CLOSED.** Shape (b). Shape (c) stays rejected, now on the
  owner's word too. `resign` is `ABC-045`'s and separate.
- **What the arm is, for this ticket's engineer:** `PromptOutcome` gains `{ kind: "quit" }` and
  `{ kind: "take-back"; plies; messages }` (transitions 17 and 18; states stay 8). `quit` → the loop
  writes an exported `QUIT_NOTICE` (≠ `INPUT_ENDED_NOTICE`), no frame, returns `{ null, null, 0 }`.
  `new` → `{ kind: "take-back", plies: history.moves.length, messages: [] }` and the loop
  **re-evaluates** before rendering — which is how `A5` is met, and why `A5` needs no BA/PM amendment.
- **The confirmation is the SEAM's, not the loop's** (`ADR-0021` clause 6): a per-session
  `quitArmed` flag in `ABC-035`'s command module, cleared by any other line; first `quit` →
  `{ kind: "command", messages: [<confirmation item, ≤ 17 columns>] }`; second consecutive `quit` →
  `{ kind: "quit" }`. `resolvePromptLine` stays pure and exported; a stateful wrapper around it binds
  `classifyCommand`. That is exactly `## Scope`'s two-state, no-second-read mechanism.
- **`A3` STANDS AS WRITTEN** — it was written to pass under (b), and it does: assert inequality
  against the two exported constants.
- **`A8` IS AMENDED, in one clause:** the file list gains **`src/line-input.ts`, one call-site line
  (`:243`)** — the reader must call the stateful wrapper instead of bare `resolvePromptLine`. The
  rest of `A8` holds verbatim: **`src/turn-loop.ts` byte-identical on this ticket** — the loop change
  is the arm ticket's (cut by BA/PM; `ADR-0021` clause 8), which must land **before** this one.
- **The `Done` assertion this ticket will red, authorised here in writing:**
  `src/command-input.test.ts` → `ABC-035 fences — grammar only` → *"no token carries an effect: `quit`
  and `board` are outcome-identical and payload-free"* (`:486-495`). Its own comment says it reds the
  day `EPIC-006` gives `quit` an effect. Superseded by this ruling; `ABC-035`'s page is NOT re-opened.
- **`ABC-112` becomes a one-line dependency on this ticket** and its own trigger says cancel when
  this one is scheduled. Not this page's call; recorded so the engineer does not deliver a filter
  into a build that honours the command.

### DoR re-check 2026-09-19 (Architect/Design) — **8 of 10 clean, 2 ⚠️, BOTH the same fact**

| # | item | verdict |
|---|---|---|
| 1, 2, 4, 5, 6, 7, 8, 9 | unchanged | **✅** as scored 2026-08-13; `A8` amended by one clause above, `A3` confirmed |
| 3 | INVEST-shaped | **⚠️** still **not independent** — the 2026-08-13 orderings (`ABC-035`, `ABC-037`, `ABC-043`) are ALL `Done`, and ONE new ordering replaces them: **the arm ticket (uncut) must land first** |
| 10 | no major unresolved blocker | **⚠️ ONE (was two).** The ruling is CLOSED. **The arm ticket is not yet cut** — BA/PM's pen; until it lands, `A1`'s second `quit` has no outcome to return |

**Column: unchanged on this page — the board move is the Orchestrator's.** Recommended pull order
(`ADR-0021` § Consequences): `ABC-045` → the arm ticket → **this ticket** → `ABC-102`.
