---
id: ABC-043
title: The live session — `runTurnLoop` driven for real, and the top-level handler that catches a rethrown parser bug
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-006
feature: —
---

# ABC-043 — the entry point stops printing a board and starts running a game

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition.
>
> **THIS TICKET CARRIES `ABC-019` `[D31]`'s SECOND HALF.** *Does a parser bug end the game?* —
> `EPIC-003`'s half is ruled on `ABC-037` (the prompt catches nothing; the merged repair-then-rethrow
> runs). **What the top-level handler prints and what it exits with is ruled below, under
> `## The ruling on a parser bug — `EPIC-006`'s half`.** It has now been owed by three documents;
> it is owed by none after this.

## Problem

*User*: every player, for the whole of a game.

*Pain*: **`src/turn-loop.ts` has 0 production importers.** 392 lines of merged, gated, mutation-tested
game loop — eight states, sixteen transitions, both seams typed, clean termination — reachable only
from `src/turn-loop.test.ts`. `ABC-042` gives a human a board to look at and nothing to type into.

*Value*: **this is the ticket after which a human plays chess.** It is also the ticket that turns
`EPIC-002`'s nine `Done` tickets into a thing that has been exercised by a person rather than by a
suite.

## Scope

**A change to `ABC-042`'s entry point, and no new module.**

- **`runTurnLoop` is called exactly once**, with the resolved `history`, the resolved `humanColour`,
  `ABC-041`'s `RenderSeam`, `ABC-037`'s `InputSeam`, an `EngineSeam`, and `process.stdout` as the
  `FrameSink` — every one of them already typed in merged code (`src/turn-loop.ts:140-153`).
- **The top-level handler.** The one `try`/`catch` in this product, around the whole session. It owns
  what happens when an exception leaves `runTurnLoop` — the case `ABC-019`'s `A9b` and `A10b` both
  create deliberately and hand here.
- **The exit-code rule for the whole product**, stated once and ruled below.
- **The end of the session is handed to `ABC-044`** — this ticket returns from `runTurnLoop` and exits;
  the result screen is that ticket's.

## The ruling on a parser bug — `EPIC-006`'s half of `ABC-019` `[D31]`

**BA/PM, 2026-08-13. It ends the game, loudly, as an internal error that is never a chess outcome,
and the process exits NON-ZERO.**

`ABC-019` repairs the borrowed board and **rethrows** (`src/turn-loop.ts:293-309`), and `ABC-037` rules
that the prompt catches nothing. So the exception arrives here, with the position already repaired by
merged code. Three options, and two lose:

- **Swallow it and continue the loop.** **Rejected.** The next frame would be drawn from a game whose
  parser is known broken, and the player would keep typing into it.
- **Catch it and exit 0 with a result screen.** **Rejected**, twice over: `ABC-019` `A10` forbids a
  result screen presenting an engine or parser bug as a chess outcome, and `[D31]` already ruled that
  a quiet termination is *"the one option that is definitely wrong"* because it is byte-identical to
  `A8`'s clean end-of-input.
- **Catch it at the top, print an internal-error line that names no chess result, and exit non-zero.**
  **ADOPTED.** The crash surfaces as a crash, the exit code distinguishes it from every path the loop
  itself can return, and nothing invents a tenth `TerminalReason`.

**The exit-code rule this forces, stated once for the whole product:**

> **Exit 0 means the process did what it was asked; non-zero means it could not.**
> The entry point exits with `LoopOutcome.exitCode` **verbatim** for every value `runTurnLoop`
> returns — and that type is `0` and only `0` (`src/turn-loop.ts:172`), **including for
> `engine-failure` and `engine-threw`**. Non-zero is reserved for exactly two things: a **usage error
> before the game starts** (`ABC-042` `A5`/`A6`) and an **exception that never became a
> `LoopOutcome`** (this ticket).

**Why an engine crash still exits 0, since that reads wrong at first glance.** `ABC-019` typed
`exitCode` as the literal `0` and ruled the reason on the record: the safety lives in the assertion,
not in the code. An engine fault *did* become a `LoopOutcome`; the loop handled it, repaired the board
and terminated cleanly. What distinguishes it from a real game is the **message**, and that is
`ABC-044`'s `A3`. Overriding a merged `Done` contract to make an exit code carry that distinction
would re-open `ABC-019` for a signal nothing in this project consumes.

## Out of scope

- **The result screen** — `ABC-044`. This ticket returns a `LoopOutcome`; that ticket renders it.
- **`undo` / `resign` / `new` / `quit`** — `ABC-045` / `ABC-046`, and `undo` is not cut.
- **Any change to `src/turn-loop.ts`.** It is `Done`, it is correct, and every seam this ticket wires
  is already published on it. **A build that edits it has misread this ticket.**
- **Anything `ABC-042` fenced**: packaging, `--difficulty`, a second output channel.
- **Choosing or writing an engine.** See the blocker below.

## Acceptance (Given/When/Then)

Everything is provable with **stdin and stdout as pipes**, driving the delivered entry point as a
child process — `EPIC-002` `4c` and this epic's own `## Test notes`.

- **`A1` (it wires the merged loop, with no adapter).** **Given** the delivered entry point, **when**
  it is typechecked, **then** `runTurnLoop` is called **exactly once** with all six options and **no
  cast and no adapter** on any of them.
- **`A2` (a scripted game runs end to end, through the real interface).** **Given** a piped stdin
  carrying a scripted mating line and a deterministic opponent, **when** the entry point runs, **then**
  the last frame written shows the mated position, the loop's `result` is the mating side's win with
  `reason: "checkmate"`, and the process exits **0**. **The frame count equals
  `1 + plies + non-advancing outcomes that carry a message`** — `ABC-019`'s cadence, asserted rather
  than assumed, with end-of-input excluded (`[D29]`).
- **`A3` (`[D31]`'s ruling, as a criterion).** **Given** an `InputSeam` that throws, **when** the
  session runs, **then** the process writes a line that (i) marks it an internal error, (ii) contains
  **none** of the ten `TerminalReason` values and none of the words `win`, `draw`, `resign`,
  `checkmate`, `stalemate`, (iii) is followed by **no result screen**, and (iv) the exit code is
  **non-zero**. **The discriminating requirement:** a build that catches the throw and exits 0 — or
  one that reports it as a draw or an abort — passes every other criterion on this page and fails this
  one.
- **`A4` (end-of-input is unchanged, and is NOT the error path).** **Given** a piped stdin that ends
  with no trailing newline, **then** the sink receives `INPUT_ENDED_NOTICE` exactly once, no result
  screen is written, and the exit code is **0** — byte-for-byte the merged `A8` behaviour, and
  **distinguishable from `A3`'s output by the message and by the exit code**.
- **`A5` (an engine fault is not a chess outcome).** **Given** an `EngineSeam` that throws, and again
  one that returns a move `legalMoves` did not produce, **then** the loop returns
  `reason: "engine-threw"` / `"engine-failure"` with `result: null`, the process exits **0**, and the
  written output contains **no** `EndReason` word. *(`ABC-019` `A9`/`A10`, re-asserted through the real
  entry point rather than through a stub harness.)*
- **`A6` (one frame session, one writer, no recomposition).** **Given** any run of ≥ 6 frames,
  **then** `beginFrameSession` is called **exactly once**, every frame reaches the writer with the row
  count the seam returned, and the delivered diff contains **no numeric row-count literal**
  (`ADR-0009` clause 9a).
- **`A7` (the human's colour still decides who moves first).** **Given** `--colour black`, **when**
  the session starts, **then** the **engine** acts first and **no prompt is read** before the first
  engine move — asserted by feeding a stdin whose first line is never consumed. **Given**
  `--colour white`, the reverse. *(`ABC-019` `A1`/`A1b`: both directions, because either alone is
  satisfied by a loop that always opens with the engine.)*
- **`A8` (no production change outside the entry point).** `git diff --numstat` shows the entry point
  and its test file and **nothing else** under `src/` — **`src/turn-loop.ts`, `src/frame.ts` and
  `ABC-041`'s seam module byte-identical**. Suite green, skip **0**, `PERFT_DEEP=1` **32/32**.

## Dependencies — ALL THREE ARE DISCHARGED (re-measured 2026-08-19)

**Re-measured by BA/PM at task `refine-ABC-043-2026-08-19` against `main` `e70fda1`. Every ordering
blocker this section was cut with has landed; the original wording is replaced rather than annotated,
because a stale blocker is read as a live one.**

- **`ABC-041` and `ABC-042` — DISCHARGED.** Both are in `Done`. The entry point this ticket edits is
  `src/cli.ts`, delivered by `ABC-042`; `ABC-041`'s `RenderSeam` is `src/render-seam.ts` and `cli.ts`
  already calls `makeRenderSeam`.
- **`ABC-037` — DISCHARGED.** Merged; `src/line-input.ts` is in the tree and exports
  `createLineInputSeam(options): InputSeam` (`src/line-input.ts:150`). Its QE hop
  (`quality-gate-ABC-037-qe-2026-08-19`) passed it with gaps, one of which this page now carries — see
  `## Scope`'s single-caller constraint.
- **AN `EngineSeam` NOW EXISTS — DISCHARGED, and this was the blocker the ticket was cut around.**
  `src/engine.ts` is merged (`ABC-078`) and `createEngine(options): EngineSeam`
  (`src/engine.ts:305`) is the seam `src/turn-loop.ts:138` has been waiting on. **`ADR-0013` is
  therefore moot in practice for this ticket:** a real opponent exists, so nothing here needs a
  placeholder and the ruling below is not weakened — it is simply no longer load-bearing on the
  schedule.

**So the *"a playable game waits for `EPIC-004`"* consequence recorded below has been overtaken by
`ABC-078` landing.** It is left in place unedited because it records what was ruled and why; read it
as history, not as a live blocker.

### The named decision this ticket cannot make for itself

> **Does the composition root supply a default opponent before `EPIC-004` lands?**

The Factory Coach's ruling presumes **yes** — *"even if the opponent is a stub that plays the first
legal move"*. **`ADR-0009` clause 9c and `src/turn-loop.ts:45-47` say the opposite for a module:**
*"a `src/` stub module would be production code that is dead the day the real parser and engine land"*,
which is why both merged stubs live in `turn-loop.test.ts`. **Whether a one-line default inside a
non-exporting entry point — which dies in one line the day `EPIC-004` lands, and which no module can
import — is the same thing clause 9c forbids is a conformance question, and its owner is
Architect/Design, not BA/PM and not this ticket.**

**The consequence, stated so the sequencing is visible rather than discovered:**

- **If the ruling is YES**, this ticket becomes buildable the moment `ABC-037` merges, and it is then
  the ticket that first makes the game playable.
- **If the ruling is NO**, a playable game waits for `EPIC-004`'s decomposition and its spike, and
  this epic's `P0` work stops at `ABC-042`.

**I am not ruling it, and I am not smoothing it into a dependency line.** It is the reason this
ticket's Definition of Ready is not met.

**RULED 2026-08-18 by Architect/Design — the answer is NO. `ADR-0013` is `accepted`
(`memory-bank/50-decisions/ADR-0013-no-placeholder-opponent-ships-in-src.md`), at task
`design-p0-chain-rulings-2026-08-18`.** The composition root may **not** supply a default opponent
before `EPIC-004` lands — not as a module, not as a one-line `EngineSeam` literal in the entry point,
not behind a flag. **`ADR-0009` clause 9c does not decide it by its letter** (its subject is a `src/`
stub *module*, and the entry point exports nothing), so `ADR-0013` adds the rule instead, with this
discriminator: **code only tests can exercise is a test double and belongs in a test file (9c); code
a human can exercise by running the delivered product is not a stub at all — it is an undelivered
feature, and it needs a cut ticket and the owner.** A default opponent is the second kind, because
`npm run chess` would play a human against it. **A YES was not Architect/Design's to give**; the
owner may license one, and it would then arrive as a cut ticket with criteria.

**So the consequence above resolves to the second branch: a playable game waits for `EPIC-004`.**
This changes no dependency on this page — the `EngineSeam` blocker was already stated — and it is
**independent of `ABC-078`**, which is in development at the time of the ruling: `ADR-0013` clause 6
records that the answer would be identical if that ticket did not exist. **Column moves and the DoR
re-score are not made here.**

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **This ticket shares `ABC-042`'s test file
  (see `## Lane cost`), so the two tickets' spawn costs land in ONE file and must be read together
  against one bar.**
- **`NFR-002` (< 16 ms per frame) — carried, not re-decided.** The loop's own per-ply derive count is
  merged and mutation-tested; this ticket adds **zero** derives. `A6` is the structural guard.
- **`NFR-004` (the engine may occupy 3 s) — not measurable here** and it is `EPIC-004`'s. Named so it
  is not silently inherited.
- **Security: triggered by composition, not by new input surface.** This is the ticket that connects
  the first module reading outside input (`ABC-037`) to the first module writing to a terminal
  (`ABC-042`). Two measurable bars: **(1)** every byte reaching stdout is either a frame row from
  `assembleFrame` (already sanitized, `src/frame.ts:123-132`), `INPUT_ENDED_NOTICE`, or `A3`'s
  internal-error line — asserted by feeding an input line containing `\x1b[2J` and counting **zero**
  `\x1b` bytes in the emitted stream; **(2)** the diff adds no runtime dependency and no Node builtin.
  **Firing threshold:** the security half fires if the diff touches any file under `src/` other than
  the entry point and its test file.

## Test notes

1. **`A3` must be driven through the real entry point**, not by calling a handler. The repair it
   depends on is the loop's, and the exit code is the process's.
2. **`A4` and `A3` must be asserted against each other**, not only in isolation — `[D31]`'s whole
   point is that the wrong build makes them identical.
3. **`A7` needs the unconsumed-line witness.** A build that reads a line and discards it before the
   engine's first move passes a content assertion and eats the player's first input.
4. **The frame count in `A2` is `ABC-019`'s formula, with EOF excluded.** Re-deriving it here rather
   than reading it is how `[D29]` got written the first time.
5. **Reuse `ABC-042`'s spawn harness. Do not build a second one**, and keep the total spawn count
   across both tickets in single digits.

## Lane cost — how many test FILES this ticket implies

**Zero new files.** The module under test is `ABC-042`'s entry point, so every criterion here extends
that ticket's existing `*.test.ts`. **This is a deliberate budget choice and it is the single largest
file-count saving available in this epic** — see `plans/epics/EPIC-006-game-session-and-packaging.md`
§ decomposition, where the two epics' totals are set out.

**Weight: this ticket makes `ABC-042`'s file heavier, and it is the one to watch.** It adds
scripted-game spawns to a file that already spawns. The two tickets share one `N8-LANE` budget by
construction; if the shared file cannot hold both inside 650 ms, **split the file rather than raise the
bar**, and record the split's cost.

## Size and priority rationale

**Size `M` (3).** No new module and no new algorithm, but: six wired seams, the product's one
top-level handler, an exit-code rule that had to be ruled rather than chosen, `[D31]`'s second half,
and the first end-to-end scripted game this repository has ever run. Calibrated against `ABC-037`
(`M` — the other end of the same wire) and `ABC-018` (`M`).

**Not `XL`. The split line if it moves:** **(a)** the wiring and the happy path — `A1`, `A2`, `A6`,
`A7`; **(b)** the failure paths and the ruling — `A3`, `A4`, `A5`. Part (a) is `S` and ships alone,
but **only if an opponent exists**.

**Priority `P0`.** It is the ticket that makes the product a product. It is `P0` **and blocked**, which
is a legitimate state and is exactly why the blocker is named at the top of `## Dependencies` instead
of being discovered at a pull.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 7 of 10 clean, 3 recorded ⚠️ — NOT MET, and not close. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** every player; `src/turn-loop.ts` at a measured **0** production importers; `ABC-042` gives a board with nothing to type into |
| 2 | scope and out-of-scope clear | **✅** no new module, six wired options, one handler, one exit-code rule; five fences including an explicit no-edit on `src/turn-loop.ts` |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: three open ordering dependencies, one of them in another epic |
| 4 | acceptance testable and measurable | **✅** eight criteria: `runTurnLoop` called **exactly once** with no cast, an asserted frame-count formula, a non-zero exit with a word-list exclusion, a byte-identical EOF path asserted **against** it, an unconsumed-line witness for colour, **zero** row-count literals, `32/32` |
| 5 | dependencies known | **✅** three open tickets named with their epics; every merged contract named with line numbers; the missing `EngineSeam` named rather than assumed |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU** shared with `ABC-042` and stated as shared; `NFR-002` as a zero-derive structural guard; `NFR-004` named as not-inherited; two security bars with a falsifiable threshold |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `M` (3), calibrated, with the split line named |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️⚠️ TWO.** **(a) `ABC-037` is OPEN** and is `EPIC-003`'s, with two open dependencies of its own. **(b) NO `EngineSeam` EXISTS and `EPIC-004` is undecomposed** — and the question of whether the composition root may supply a default opponent before then is a **conformance ruling owned by Architect/Design**, stated in full under `## Dependencies` and **not decided here** |
