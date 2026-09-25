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

## Delivery

**Built 2026-09-20 by the Software Engineer** (task `wave-2026-09-19`, subtask
`ticket-to-pr-ABC-046`, Workflow 04) on branch `grugops/ABC-046-quit-and-new` @ **`6cdde15`**, off
`grugops/wave-2026-09-19` @ `d1d431f` — which carries `ABC-120`'s arms (transitions 17/18,
`QUIT_NOTICE`) and `ABC-045`'s `resign`, so the one remaining DoR ⚠️ (the arm ticket landing first)
was met at the pull. **Unmerged; not deployed.**

- **Exactly four files, measured from git:** `git diff --name-only d1d431f...6cdde15 -- src/` →
  `src/command-input.ts` (+99 / −22; **29 added non-comment production lines**),
  `src/line-input.ts` (+12 / −9; **3 code lines**), `src/command-input.test.ts` (+402 / −18),
  `src/cli.test.ts` (+108 / −5). **`A8`: `src/turn-loop.ts` byte-identical** (`git diff --stat`
  empty), as are `turn-loop.test.ts`, `cli.ts`, `result-screen.ts`, `gameend.ts`, `history.ts`,
  `line-input.test.ts`, `move-input.ts`, `rejection.ts`, `zobrist.ts`, `search.ts`,
  `quiescence.ts`, `engine.ts`. 0 new test files.
- **The shape (`ADR-0021` clauses 6–7, built literally):** `COMMAND_TABLE` gains
  `{ token: "new", outcome: "take-back" }`; `CommandToken`, `CommandSpec.outcome` and
  `PromptLineOutcome` widen; `resolvePromptLine` answers
  `{ kind: "take-back", plies: history.moves.length, messages: [] }` for `new` and
  `{ kind: "command", messages: QUIT_CONFIRMATION_MESSAGES }` for `quit` — ALWAYS, because it
  stays a pure function over a string with no memory. `createPromptLineResolver(deps?)` is the
  per-session wrapper holding the ONE flag: `quitArmed = classifyCommand(line)?.token === "quit"`
  on every line (so any other line clears it), and `{ kind: "quit" }` when it was already armed.
  `src/line-input.ts` creates one per seam (`const resolve = createPromptLineResolver(deps)`) and
  calls it at the one call site. `QUIT_CONFIRMATION_MESSAGES = ["quit again to end"]` — one item,
  17 columns, the clause-6 bound. `help` lists `quit` and `new` by construction — **the promise
  `ABC-112` was cut over is TRUE from this commit; its cancel trigger has fired.**
- **`A1`–`A5`, `A7`:** 33 rows in `src/command-input.test.ts` (two `describe("ABC-046 …")`
  blocks), plus `new` in the spelling sweep, three non-tokens (`ne`, `newgame`, `renew`), the
  no-argument fence (`new game`), and `new` OUT of `ABC-035` `A4`'s foreign list. The three
  sequences: **quit/quit** → confirmation then `{ kind: "quit" }` (loop: renders 2, reads 2, the
  next line never read, `{ null, null, 0 }`, last write `QUIT_NOTICE`); **quit/other/quit** →
  confirmation again for `board`, `help`, a legal move `b4`, a rejected `zzz`, and `new` (loop:
  reads 4, ends on `INPUT_ENDED_NOTICE`; with a first-legal opponent, `quit/e4/quit` → reads 4,
  moves 2); **quit/EOF** → `INPUT_ENDED_NOTICE`, `QUIT_NOTICE` written nowhere. Two resolvers are
  independent (a module-level flag reds). `A4` on `claimable()` (8 plies, third occurrence): FEN
  = `SHUFFLE_FEN`, moves 0, `keyHistory` 1, `repetitionCounts` one entry of 1; the pure call
  mutates nothing. `A5`: frame 1's `claimable` is `{ white, threefold }` (the Given), frame 2's is
  undefined, the real panel shows no `may claim`, derives 2 for `new` + `board`. `A7`: 0 / 0 / 0 /
  0 / 0 on both `quit`s and on `new`, control 1 / 1.
- **`A2`, `A3`, `A6`:** two children in `src/cli.test.ts` — `quits` (`--colour white`,
  `e4 / quit / quit / d4`, opponent `e5`): exit 0, stream ends `> quit\n`, frames 4 (1 + 2 plies +
  the confirmation), nothing after the last frame but the prompt and the notice, `d4` never read,
  no `did not finish`, `renderResultScreen({ null, null, 0 })` → `[]`; `renews` (`e4 / new /
  quit`): frames 5, frame 4 byte-equal to frame 1 (board region, and whole), frame 3 ≠ frame 1,
  the trailing single `quit`'s confirmation on frame 5, ends `> input ended\n`. Spawn pin
  `17 + 7 + 1` → `17 + 7 + 1 + 2`, reason written.
- **The `Done` assertions this ticket reds, exactly the two the ruling authorised:** `ABC-035`
  `A4`'s foreign-list row for `new` (`new` joined the table) and the `ABC-035` fence row *"no
  token carries an effect: `quit` and `board` are outcome-identical and payload-free"* — superseded
  and re-written to what is still true of the pure function. `ABC-035`'s page is not opened.
- **Three readings, recorded rather than hidden** (the sibling `decision` note has the reasoning):
  (1) `A8`'s "one call-site line" in `src/line-input.ts` is THREE code lines — the import, the
  per-seam declaration, the call — because a per-session flag needs a per-session binding; read as
  "the reader binds the wrapper instead of bare `resolvePromptLine`". (2) **An over-cap
  (> 1024-character) line between two `quit`s does NOT clear the flag** — the reader rejects it
  before the wrapper sees it; every line the wrapper sees clears. Named for QE / BA/PM. (3) `new`
  carries `messages: []` per the ADR's own clause 7 (the subtask wrote `[...]`).
- **Mutants, 9 watched RED in place and reverted (sha-asserted), control 131 / 65 green:** flag
  never clears, first `quit` exits, module-level flag, `new` → 2 plies, `new` inert, item over 17
  columns, only commands clear, no confirmation message, and the reader bypassing the wrapper —
  the last caught by `CHILDREN.quits` ONLY (`src/line-input.test.ts` has no confirmation row and
  is outside this ticket's file list; named for QE).
- **Gates at the tip:** `npx biome check .` 76 files clean, `npx tsc --noEmit` 0 (typecheck and
  build), `npx vitest run --dir src` **42 / 1361 / 0 skipped** (base MEASURED 42 / 1325 / 0 at
  `d1d431f` — the subtask's 1317 was `ABC-045`'s tip; +36 tests, +0 files), JSON skip count 0,
  test-skip-integrity `No findings.` `self_fix_attempts` spent **1** (a literal-`0` type on one
  test line).
- **`N8-LANE` / `NFR-008`:** in-file `+8 ms` (`command-input.test.ts` 28 → 36 ms, n = 7, matched
  load) and two collect-time children (the `cli.test.ts` in-file pair was taken at load 12–21 vs
  9–14 and is noise; ~0.3–0.35 s CPU expected per `ABC-043`/`ABC-115`'s per-child figure);
  **0 new files** — met on the number this ticket controls, the children reported rather than
  netted. Whole-lane CPU (`/usr/bin/time -p`, n = 3, two sibling hops live): **before 25.79 s at
  load 6.8–8.6, after 26.63 s at load 7.2–14.0** — over 15 s in every run INCLUDING the three
  before the change; the headroom at the delivery base is NEGATIVE, so this reads as a lane
  breach that is the base's, **REPORTED AS NON-CONFORMING, not ruled, nothing trimmed**; not a
  conforming `ADR-0019` reading. The base reads ~7 s above `ABC-045`'s base one merge earlier
  with `src/` unchanged between them — handed up as a number.
- Production lines > 0: the zero-production-lines UAT waiver does NOT apply; the owner's word is
  needed at `In UAT`. Board move (`In Development` → `In Review`), `ABC-112`'s cancellation and
  the QE hop are the Orchestrator's / QE's. `ABC-102` inherits a `help` second row at 21 of 21
  columns — zero headroom. Notes: `.grugops/context/ticket-to-pr-ABC-046/notes/`.

## QE

**Validated 2026-09-24 by QE/E2E** (task `wave-2026-09-24`, subtask `qe-ABC-046`, Workflow 05) on
branch `grugops/qe-ABC-046` off `grugops/wave-2026-09-24` @ `162b2bd`, which carries `6cdde15` via
`8b5114c`; `git diff --stat 6cdde15 HEAD -- src` is empty.

**FAIL. The behaviour meets `A1`–`A8`; the FAIL is two false sentences in the delivered docblock.**
QE added zero tests and changed zero lines under `src/`. Every mutant was reverted, and sha256 plus
`git status --porcelain -- src` were asserted after each of 19 rounds. Load was 3.9–10.2. The
reasoning is not restated here; it is in `.grugops/context/qe-ABC-046/notes/`.

- **D1: `src/command-input.ts:4-5`** says *"one of **seven** commands and, for **six** of them"*.
  `COMMAND_TABLE` has **6** rows, and the same file says "six tokens" at `:69` and `:75`.
- **D2: `src/command-input.ts:222-223`** says the wrapper, armed and asked again, *"never consults
  the table"*. With the `quit` row removed from `COMMAND_TABLE`, `quit`/`quit` answers
  `rejected`/`rejected`, so the exit path reads the table through `classifyCommand`.
- **The repair for both is prose only**, and it is the Engineer's (`ABC-114`: QE does not author
  the replacement). The re-QE is a delta: the two sentences plus the four gates.
- **Gates at the tip, reproduced with no difference:**
  - `npx biome check .`: 76 files.
  - `npx tsc --noEmit`: 0 (typecheck and build).
  - `npx vitest run --dir src`: **42 / 1361 / 0 skipped**.
  - JSON skip count: 0.
  - `test-skip-integrity`: `No findings.`
  - Spawn pin `N8_SPAWN = 17 + 7 + 1 + 2` confirmed; `spawnSync` still has one call site.
- **Ruling 1: the three readings.**
  - **(1)** `A8`'s "one call-site line" built as three lines: **MATCHES**. The literal one-line build
    (`Q1`, a fresh wrapper per line) fails `A1`–`A3` in the product. The module-scope build (`Q2`)
    is `M3`'s shape. Clause 6's "one line" cannot be met under its own per-session rule.
  - **(2)** An over-cap line does not clear the flag: **DOES NOT MATCH `ADR-0021` clause 6**
    (*"cleared by any other line"*). `quit` / 1025 chars / `quit` ENDS the session, and the last
    frame shows `line too long`, not the confirmation. No row fails because none exists, and this
    page's `A1` is MET as written ("an intervening command", "a legal move").
    - The cheap fix (`Q9`, ask the resolver on the over-cap branch) reds 3 of `ABC-037`'s
      security-bar-2 rows. A compliant fix therefore needs a `disarm` on the wrapper, which is
      outside `A8`'s licence.
    - **Routed to Architect/Design:** either narrow clause 6, or license the disarm. It is not a
      FAIL cause.
  - **(3)** `messages: []`, and the two `ABC-035` supersessions: **MATCHES**.
- **Ruling 2: `M9` is caught only by `CHILDREN.quits`, and that is ENOUGH.** The child is
  deterministic, runs the product's own wiring, and also catches `Q1`. `src/line-input.test.ts` is
  outside `A8`'s file list.
  - `G2-INFO`: that child is a single point. One `src/line-input.test.ts` row (`quit` twice through
    `createLineInputSeam` → `{ kind: "quit" }`) is recommended at the next ticket licensed to touch
    that file.
- **Mutants:** the Engineer's nine were reproduced to the row and the count. QE's nine more:
  - `Q1` one-line reader: cli 1.
  - `Q2` module-scope reader: line-input 8.
  - **`Q3` prefix arm (`quit now` arms): 0 of 225, SURVIVES.** Recorded as `G1`: one row closes it
    in `src/command-input.test.ts`, no licence change needed.
  - `Q4` case-sensitive: 1.
  - `Q5` commands do not clear: 3.
  - `Q6` `new` ply-0 guard: 4.
  - `Q7` `new` message: 2 + the `A6` child.
  - `Q8` wrapper drops `deps`: 1 + 8.
  - `Q9` shape probe: 3.
  - Control: 131 / 29 / 65.
- **Edges, through the loop (24/24) and through `node src/cli.ts` (15/15):**
  - `quit` and `new` at ply 0: rows exist.
  - `new` straight after `new`: take-back 4, then 0. There is no row for the sequence, but each
    step is guarded.
  - `quit`/`new` after the game is over: never read, and the checkmate screen stands. This holds by
    the loop's structure.
  - `quit now` / `new game`: rejected, and `quit now` clears the flag. Wrapper arming has no row
    (`G1`).
  - Mixed case (`QUIT`/`Quit`, `NEW`): rows exist.
  - `new` on the engine's turn: the prompt cannot be reached then. As Black, a queued `new` is read
    after the engine's move, takes back that ply, and the engine opens again. The redrawn frame
    equals the opening frame. No row covers it (`G3-INFO`, `A6` is White-only).
- **`help` through the real frame** (ascii and unicode, at the start and after `e4 e5`): shows
  `commands: help board` / `quit claim resign new`, with no `(+` marker (hidden 0).
- **Named, not corrected:** `G4-INFO`, test comment "A1-A7 here … A2/A3/A6 also": there is no `A6`
  row in `src/command-input.test.ts`.
- **Not done at this hop:** `NFR-008` not ruled. `plans/board.md`, `AGENTS.md` and
  `plans/nfr-catalog.md` not opened. `src/search.*`, `src/quiescence.*` and `src/engine.*` not
  opened. Not merged, not deployed.
- **Column:** the move back to `In Development` is the Orchestrator's. Production lines > 0, so
  the UAT waiver does not apply.

## Ruling (clause 6) 2026-09-24: the over-cap line is a line; the `disarm` is licensed; `A8` amended a second time

**Architect/Design, task `wave-2026-09-24`, subtask `ruling-abc046-clause6`**, on QE's reading (2).
This section is a pointer and records what changes on THIS page. The reasoning and measurements live
in `.grugops/context/ruling-abc046-clause6/notes/` and are not repeated here.

- **`ADR-0021` clause 6 stands as written, and is neither superseded nor edited.** "Cleared by any
  other line" includes a line the reader refuses at the cap. The player's last frame said
  `line too long`, not `quit again to end`, so the next `quit` is a first `quit`. The rule is that
  every submitted line either reaches the wrapper's resolve or calls its `disarm`. `eof` is exempt.
- **Probed out of tree** (session scratchpad, not this repo), measured on the licensed shape:
  - production diff +14 / −3;
  - `tsc` and `biome` pass;
  - existing lane **1361 / 1361, 0 skipped**; with the three rows below, **1364 / 1364**;
  - `ABC-037` security bar 2 green in the default lane and in the deep lane (33 / 33). The same 3 +
    3 rows are red under `Q9`;
  - through the real entry point, `quit` / 1025×`x` / `quit` / EOF gives 2 confirmations and ends
    on `input ended`.
- **`A8` IS AMENDED, a second time.** The file list is now exactly the list below. Everything else
  under `src/` stays byte-identical, `src/turn-loop.ts` and `src/cli.test.ts` included. There are
  0 new files and 0 new children.
  1. `src/command-input.ts`:
     - **D1** (`:4-5`) and **D2** (`:222-223`) prose repairs;
     - `PromptLineResolver` gains `readonly disarm: () => void`;
     - `createPromptLineResolver` returns its unchanged closure with `disarm` attached. `disarm`
       sets `quitArmed = false` and does nothing else;
     - the wrapper docblock says, truly, what `disarm` does and who calls it.
  2. `src/line-input.ts`:
     - `:245`: the over-cap branch calls `resolve.disarm()` and then returns the same `rejected`
       outcome;
     - one true sentence in the cap docblock (`:85-88`).
  3. `src/command-input.test.ts`, two rows:
     - **`G1`**: `quit` / `quit now` / `quit` asks again. This kills `Q3`;
     - the **`disarm` unit row**: it clears, it is harmless when unarmed, and the spies read 0.
  4. **`src/line-input.test.ts`**, new to the list, one row:
     - `quit` / 1025×`z` / `quit` / `quit` through `createLineInputSeam` answers confirmation,
       `rejected`, confirmation, then `{ kind: "quit" }`, and no resolver is told;
     - one import name is added;
     - this also closes QE's `G2-INFO`.
- **`A1`–`A7` are unchanged.** The new row enforces `ADR-0021` clause 6 and is not a new criterion.
- **Column: unchanged on this page.** The board move and scheduling the re-hop and the delta re-QE
  are the Orchestrator's.

## Delivery (re-hop) 2026-09-24

**Built by the Software Engineer** (task `wave-2026-09-24`, subtask `ticket-to-pr-ABC-046-rehop`,
Workflow 04 re-hop) on branch `grugops/ABC-046-rehop` @ **`85b66c6`**, off
`grugops/wave-2026-09-24` @ `5d0fdb0`. **It is unmerged and not deployed.** This section is a
pointer. The numbers live in the four `20260924T20…` notes in
`.grugops/context/ticket-to-pr-ABC-046/notes/`.

- **The change is exactly the ruling's list, and nothing else.** `git diff --numstat 5d0fdb0 85b66c6`:

  | file | added | removed |
  | --- | --- | --- |
  | `src/command-input.ts` | 21 | 6 |
  | `src/line-input.ts` | 7 | 2 |
  | `src/command-input.test.ts` | 35 | 0 |
  | `src/line-input.test.ts` | 22 | 1 |

  - Non-comment production lines: +12 / −3.
  - Byte-identical: `src/turn-loop.ts`, `src/cli.test.ts` (spawn pin `17 + 7 + 1 + 2`),
    `src/search.*`, `src/quiescence.*`, `src/engine.*` and `src/zobrist.*`.
  - 0 new files, 0 new children.
- **D1** now reads "one of six commands and, for five of them".
- **D2** now says the armed second `quit` skips `resolvePromptLine` and the row's `outcome`, but the
  line is still classified through `COMMAND_TABLE` by `classifyCommand`.
- **The disarm:**
  - `PromptLineResolver` gains `readonly disarm: () => void`, attached by
    `Object.assign(resolve, { disarm })`.
  - `disarm` only sets `quitArmed = false`.
  - The over-cap branch in `src/line-input.ts` calls `resolve.disarm()` and returns the same
    `rejected` outcome.
  - Both docblocks say so, and the wrapper's docblock no longer implies it sees every line.
- **Rows:**
  - `src/command-input.test.ts`: `G1` and the disarm unit row.
  - `src/line-input.test.ts`: the clause-6 reader row (`quit` / 1025×`z` / `quit` / `quit`). Its
    import gains `QUIT_CONFIRMATION_MESSAGES`.
- **Gates:** all green on the first run, so `self_fix_attempts` 0 of 2.
  - lint: 76 files, exit 0;
  - `tsc` 0, build 0;
  - unit **42 / 1364 / 0**, skip 0;
  - integrity `No findings.`
- **Mutants.** Each one was watched red and then reverted, and `git status -- src` was clean after:

  | mutant | rows it turns red |
  | --- | --- |
  | `Q3` | `G1` |
  | `X1` | the disarm row, the reader row |
  | `X2` | the reader row only |
  | `X3` | the disarm row, the reader row |
  | `M9` | the reader row, `cli.test.ts` `A2/A3` |

  - The control was 0 red of 228.
  - QE's `G2-INFO` is closed in-file.
- **`ABC-037` bar 2 is green in both lanes:**
  - default lane: the file is 30 / 30;
  - deep lane (`INPUT_DEEP=1 NODE_OPTIONS=--expose-gc`): the file is 34 / 34.
- **Real entry point:** `quit` / 1025×`x` / `quit` / EOF shows 4 prompts, 2 confirmations and 1
  `line too long`, then ends on `> input ended`. Exit 0, stderr empty.
- **NFR:**
  - `N8-LANE`: +3 rows, 0 files, 0 children. The in-file charge is within 1 ms.
  - `NFR-008` lane CPU: 20.68 s before and 20.07 s after (n = 3 interleaved, load 20–27). That is
    over 15 s both ways. It is reported as non-conforming, not ruled, and nothing was trimmed.
- **Column: unchanged on this page.** The delta re-QE and the board move are the Orchestrator's.
  Production lines > 0, so the owner's word is still needed at `In UAT`.

## QE (delta) 2026-09-24

**Validated by QE/E2E** (task `wave-2026-09-24`, subtask `qe-ABC-046-delta`, Workflow 05, delta
re-QE after the FAIL) on branch `grugops/qe-ABC-046-delta` off `grugops/wave-2026-09-24` @
`9aec523`, which carries re-hop `85b66c6` via `d8de765`. This section is a pointer. The reasoning and
numbers live in the three `20260924T201…` notes in `.grugops/context/qe-ABC-046/notes/`. The
`decision` supersedes the first-pass FAIL.

**PASS.** QE added zero tests and changed zero lines under `src/`. There were 14 rounds, each
restored, with sha256 and `git status --porcelain -- src` asserted.

- **Ruling 1: D1 and D2 are TRUE.**
  - D1: "one of six commands and, for five of them". `COMMAND_TABLE` has 6 rows.
  - D2: probed three ways. Dropping the `quit` row changes the answer, so the path does classify
    through the table. On the second `quit`, a counter reads 0 calls to `resolvePromptLine` and 1 to
    `classifyCommand`. Changing the `quit` row's `outcome` still gives `{ kind: "quit" }`, so the
    outcome is not read.
  - Every new docblock sentence (the type, the wrapper and the cap) reads true.
- **Ruling 2: the `disarm` is exactly as licensed.**
  - Its body is `quitArmed = false` and nothing else.
  - Its one production caller is `src/line-input.ts:248`, inside the over-cap branch.
  - `A8` holds: exactly the 4 ruled files, and `src/turn-loop.ts` and `src/cli.test.ts` are
    byte-identical.
  - `G5-INFO`: the non-comment production diff is **+13 / −3**, not the +12 / −3 in the Delivery
    (re-hop) section above. It is a paper count only, and the licence names edits, not lines.
- **Ruling 3: PASS on the whole ticket.**
- **Gates:**
  - biome: 76 files.
  - `tsc`: 0 and 0.
  - vitest: **42 / 1364 / 0 skipped**.
  - JSON skip count: 0.
  - integrity: `No findings.`
- **Mutants** (red rows of 228):
  - The ruled five reproduce row for row: `Q3` 1, `X1` 2, `X2` 1, `X3` 2, `M9` 2.
  - QE's `X4`, the disarm before the length check: 2 red (the reader row and `cli` `A2/A3`).
  - `X5`, the disarm before the null check: 2.
  - `X7`, a disarm plus a resolver call: 4 (3 bar-2 rows + the reader row).
  - `X8`, a toggling disarm: 1.
  - `X6` is equivalent: 0 red, and no gap.
  - Control: 0.
- **Sequences:**
  - `quit` / over-cap / `new` ends by `new` clearing the flag. No row plays it, and every mutant that
    changes it is red elsewhere.
  - Over-cap / `quit` / `quit` gives `line too long`, a confirmation, then `quit`. It is RED under
    `X3` and `X8`.
- **`ABC-037` bar 2:** default 30 / 30 (8 bar-2 rows). Deep (`INPUT_DEEP=1 NODE_OPTIONS=--expose-gc`):
  34 / 34 (8 + 4 breadth rows).
- **The real entry point:**
  - `quit` / 1025×`x` / `quit` / EOF: 4 prompts, **2 confirmations**, 1 `line too long`, ends
    `> input ended`, exit 0, stderr empty.
  - The same input with a trailing `quit` ends `> quit`.
- **Still open, INFO only:**
  - `G3-INFO`: `A6` is White-only.
  - `G4-INFO`: the stale "A2/A3/A6 also" and "four tokens" test comments.
  - `G1` and `G2-INFO` are closed.
- **Not done at this hop:**
  - `NFR-008` was not ruled.
  - `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `src/search.*`, `src/quiescence.*` and
    `src/engine.*` were not opened.
  - Nothing was merged or deployed.
- **Column:** the move out of `In Review` is the Orchestrator's. Production lines are > 0, so the
  owner's word is still needed at `In UAT`.
