---
id: ABC-043
title: The live session — `runTurnLoop` driven for real, and the top-level handler that catches a rethrown parser bug
status: done
column: Done
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

**Two composition constraints added 2026-08-19 by BA/PM, now that the modules they name are merged.**

- **The opponent is the MERGED engine at its MERGED default budget.** `createEngine` from
  `src/engine.ts` (`:305`), with `DEFAULT_BUDGET_MS` (`:83`) — **no new number, no `--difficulty`, no
  new flag and no new constant**; `--difficulty` is fenced by `ABC-042` and stays fenced. This is a
  scope statement, not a design choice: it forbids inventing a budget here, and it is what keeps
  `ADR-0013` satisfied — a real opponent ships, not a placeholder.
- **`createLineInputSeam` HAS A SINGLE-CALLER PRECONDITION, and this is the ticket that wires it.**
  QE recorded it at `ABC-037` (`G6`, `quality-gate-ABC-037-qe-2026-08-19`): `waiting` is a **single
  slot**, so **two overlapping `seam()` calls orphan the first read FOREVER** — the first promise never
  settles and the session hangs with no output and no exit. `runTurnLoop` awaits the seam before
  calling it again, so the merged loop is safe **by its own sequencing, not by any guard in the
  module**, and the precondition is written down in neither the module header nor the suite. **The
  entry point therefore builds the input seam ONCE, passes it to `runTurnLoop`, and calls it
  NOWHERE ELSE.** No new criterion is cut for this: `A1` already pins `runTurnLoop` at exactly one
  call with no adapter, and `A8` reads the whole delivered diff — a second `seam()` call would have to
  appear there. **A build that "helpfully" pre-reads a line before the loop starts hangs the product,
  and this is where that gets caught rather than at integration.**

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
  cast and no adapter** on any of them. *(Pointer added 2026-10-12 by BA/PM; the criterion text is
  unchanged. Since `ABC-095`, the `engine:` value is `withBook(book, createEngine({ budgetMs:
  DEFAULT_BUDGET_MS }))` (`ADR-0012` clause 2(3); `ABC-095` `A7`). A same-type decorator,
  `EngineSeam → EngineSeam`, is not an "adapter" in this criterion's sense, which is a type adapter
  that `tsc` decides. The `engine:` row's pin moves in `ABC-095`'s diff, with both halves pinned. See
  § Amendment — 2026-10-12.)*
- **`A2` (a scripted game runs end to end, through the real interface).** **Given** a piped stdin
  carrying a scripted mating line and a deterministic opponent, **when** the entry point runs, **then**
  the last frame written shows the mated position, the loop's `result` is the mating side's win with
  `reason: "checkmate"`, and the process exits **0**. **The frame count equals
  `1 + plies + non-advancing outcomes that carry a message`** — `ABC-019`'s cadence, asserted rather
  than assumed, with end-of-input excluded (`[D29]`). **The deterministic opponent is a TEST DOUBLE
  substituted into the child process — never the merged search, and nothing in `src/`** (see
  `## The ruling on `A5` and `A2`'s testability`): the merged engine is wall-clock bound, so a
  scripted line asserted against it would be flaky by construction and would cost 3 s of wall per ply.
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
  entry point rather than through a stub harness.)* **Both faulty seams are TEST DOUBLES substituted
  into the child process; the DRIVER is the delivered entry point, spawned, with its own exit code —
  that is what *"rather than through a stub harness"* asks for and it is met without one production
  line changing** (see `## The ruling on `A5` and `A2`'s testability`). **The discriminating
  requirement is unchanged: a build that catches the throw and exits non-zero here, or names a chess
  outcome, fails.**
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

## The ruling on `A5` and `A2`'s testability — 2026-08-19 by BA/PM

**Both are SATISFIABLE AS WRITTEN. Neither is weakened, neither is re-scoped, and no ADR has to
move.** Ruled at task `refine-ABC-043-2026-08-19` on Architect/Design's flag
(`design-p0-chain-rulings-2026-08-18`, and `ADR-0013` clause 7, which hands this criterion question
here by name). **`ADR-0011` clause 4 is untouched: the entry point still exports NOTHING, and this
ruling depends on it continuing to export nothing.**

**The mistake the flag rests on, named first because it is the whole ruling.** *"Through the real
entry point rather than through a stub harness"* constrains **the DRIVER**, not **the SEAM**. `A5`
cannot be asking for a real engine that really throws — it asks for *"an `EngineSeam` that throws"*
and *"one that returns a move `legalMoves` did not produce"*, which are **faults, deliberately
constructed**, i.e. test doubles at the seam by definition. What the clause forbids is proving them
by calling a handler in-process with a hand-built options bag: the exit code, the frame stream and
the top-level handler must be the **process's**. **A double at the engine seam plus a real spawned
entry point satisfies both halves at once.** So the question was never *"may the entry point export
an injection point"* — it is *"can the child process be given a different `./engine.ts` without any
production line changing"*.

**It can, and it was measured rather than reasoned. Node's module customization hooks
(`node:module`'s `registerHooks`), loaded into the child with `--import`, replace the module the
entry point imports.** Verified at this hop on **Node v24.12.0** (the interpreter this repo runs), on
a throwaway three-file replica outside the repository — **no file under `src/` was read into a build
and none was written**:

**The four probes, their commands and their outputs are in this task's notes**
(`.grugops/context/refine-ABC-043-2026-08-19/notes/`, observation *"What was MEASURED at this hop"*) —
measurement belongs there under this project's process rule 2, not on the page. **The four facts they
establish:** the fault reaches the entry point's own handler and the child exits with the code the
build chose; a child spawned WITHOUT the hook is byte-unaffected; a `data:` URL carries the hook, so
the rig needs **zero new files**; and a substituted module's relative imports resolve, so a
deterministic double may call the real `legalMoves`.

**What this buys, criterion by criterion:**

- **`A5`** — two children: one whose substituted `createEngine` returns a seam that **throws**, one
  whose seam returns a **move `legalMoves` did not produce**. The loop's merged `engine-threw` /
  `engine-failure` arms (`src/turn-loop.ts:375,382`) run for real, the process exits **0**, and the
  `EndReason` word-absence is asserted over the child's real stdout+stderr union. **The
  discriminating requirement on this page is untouched.**
- **`A2`** — the *"deterministic opponent"* is the same substitution, carrying a scripted reply list
  (or the first legal move from the real `legalMoves`). **This is required, not merely convenient:**
  the merged engine is an **iterative deepening search against a wall clock**
  (`src/engine.ts:83,305`), so the depth it reaches — and therefore the move it picks — is **hardware
  and load dependent**. A scripted mating line asserted against the real engine would be a **flaky
  criterion**, and at `DEFAULT_BUDGET_MS` = 3 s per engine ply it would also breach `NFR-008`'s 3 s
  wall clause on its own. `A2` says *"a deterministic opponent"* and that is exactly what it gets.

*(Note added 2026-10-12 by BA/PM, `ADR-0037` § Addendum R2; the words above are kept as the record.)*
**Since `ABC-095`, the double stands at `./book-engine.ts` (`withBook`).** That module is the supplier
at `engine:` under `ADR-0015` (S), because `./engine.ts`'s binding now goes to `withBook` and not to the
bag. Read "a different `./engine.ts`" above as "a different `./book-engine.ts`", and "substituted
`createEngine`" as "substituted `withBook`". The double returns the same seam as before (throwing,
foreign-move or scripted). The seam is the same `EngineSeam` at `engine:`, so the ruling's mechanism and
its three limits are unchanged.

**The three shapes that were offered, and what happened to each:**

1. **A spawned-process test that induces the fault without an export — ADOPTED**, in the form above.
2. **An env- or argv-gated fault injection — REFUSED, and this is the important refusal.** It would
   put a fault path **in `src/cli.ts`**: production behaviour, reachable by a human who sets the
   variable, needing its own justification, its own criterion and — by `ADR-0013` clause 3's
   discriminator, *"exercisable by a human running the delivered product"* — the **owner**. The
   adopted rig is the first class instead: **only a test can exercise it**, because a human running
   `npm run chess` never passes `--import`. It is a test double, and `ADR-0009` clause 9c is
   satisfied because it lives **in the test file**, as a string, not in `src/`.
3. **Re-scoping `A5` to what the entry point can be driven through — REFUSED.** It is unnecessary
   now, and it was the outcome the ticket's own text forbids: *a build that catches the throw and
   exits 0 passes every other criterion and fails this one*, and `ABC-019` `A10` is enforced at the
   top level here.

**Three limits on this ruling, so it is not read wider than it is.**

- **No production line, no export, no flag, no env var in `src/`.** The moment a build needs one,
  this ruling has been left behind and the question goes back to Architect/Design.
- **The rig is not a licence to substitute modules generally.** It exists for the **engine seam**
  under `A2` and `A5`. Substituting `./line-input.ts`, `./frame.ts` or `./turn-loop.ts` would test the
  harness instead of the product and is out of scope on this page.
  **AMENDED 2026-08-19 by BA/PM for `A3` ONLY — the original words are kept above as the record.**
  `./line-input.ts` is admissible **as `A3`'s constructed fault and nowhere else**; `./frame.ts` and
  `./turn-loop.ts` are unchanged and are now refused mechanically by `ADR-0015` clause (S). See
  `## The (N) limit — one criterion, one constructed fault, at the seam its Given names` below.
- **`--import` is child-only.** It never appears in `npm run chess`, in `package.json`, or in
  `AGENTS.md`'s `Dev / run` line.

**One consequence that is NOT a criterion and is named so nobody assumes it:** with `A2` and `A5`
both driven by doubles, **no criterion on this page runs the REAL engine end to end**, and that is
deliberate — a real-engine game costs 3 s of wall per ply against a 3 s lane clause. If a real-engine
end-to-end row is wanted it belongs in an **opt-in lane** (`ENGINE_DEEP` is the precedent, `AGENTS.md`
§ Test), never in the default lane. **Not cut as a ticket here; recorded as the honest gap.**

## The (N) limit — one criterion, one constructed fault, at the seam its Given names

Written 2026-08-19 by BA/PM at `refine-abc043-a3-name-2026-08-19`, answering the one question
`ADR-0015` left open. `ADR-0015` clauses **(S)** and **(C)** are Architect/Design's structural filter
and are **not touched here**; clause **(N)** is BA/PM's and this section is what (N) says. Reasoning,
and what this hop refused, are in `.grugops/context/refine-abc043-a3-name-2026-08-19/notes/`.

**The answer: the name-refusal of `./line-input.ts` does NOT extend to `A3`.** `A2` and `A5` are the
criteria it was written for and it stands there unchanged.

**The rule the three names were examples of.** A double substituted into a spawned child, having
already passed `ADR-0015` (S) and (C), is admissible only if **all three** hold:

- **(N1) It stands at the seam the criterion's own Given STIPULATES AS CONSTRUCTED.** `A3` — *"an
  `InputSeam` that throws"*. `A5` — *"an `EngineSeam` that throws"*. A Given that stipulates no
  constructed component licenses no substitution, and that criterion comes back to BA/PM.
- **(N2) It constructs the GIVEN only — never the When, never any Then.** Every observable the
  criterion asserts must be produced by product code that was **not** substituted. **A component the
  Given stipulates as REAL may never be doubled** — that is the sharpest form of testing the harness
  instead of the product.
- **(N3) One criterion, one substituted seam.** A second double, at a seam the Given does not
  stipulate, is refused even when it passes (S) and (C): it is a fixture quietly widening the
  criterion.

**(N) is CRITERION-RELATIVE, and this is the misread to refuse in advance.** A module refused under
one criterion is not thereby refused under another; a module admitted under one criterion is not
thereby admitted generally. **Neither the `A2`/`A5` licence nor this amendment is a module
allow-list**; there is no list, in either direction.

**What the rule decides on this page, so it is checkable rather than argued.**

| criterion + proposed double | (N1) | (N2) | (N3) | verdict |
|---|---|---|---|---|
| `A5` + `./engine.ts` throwing / illegal-move seam | ✅ `EngineSeam` | ✅ exit code, `reason`, output all real | ✅ one | **admissible** — the original grant, reproduced |
| `A3` + `./line-input.ts` seam that throws | ✅ `InputSeam` | ✅ error line, absence of result screen and exit code are `src/turn-loop.ts`, `src/cli.ts` and the process | ✅ one | **ADMISSIBLE — the name is lifted for `A3`** |
| `A2` + `./line-input.ts` | ❌ | **❌ `A2`'s Given stipulates a REAL piped stdin carrying the scripted line** | — | **refused, unchanged** |
| `A5` + `./line-input.ts` alongside the engine double | ❌ | — | **❌ second seam** | **refused, unchanged** |
| `A3` + `./command-input.ts` (the rig that shipped) | **❌ `A3`'s Given stipulates the `InputSeam`, not the parser** | — | — | **refused by (N) as well as by (S)** |
| *(added 2026-10-12)* `A5` + `./book-engine.ts` throwing / illegal-move seam (`engineThrows`, `engineForeign`) | ✅ `EngineSeam`, the same seam at `engine:` | ✅ exit code, `reason`, output all real; the double is the whole opponent, and no Then reads the book | ✅ one (`./engine.ts` is no longer substituted) | **admissible** — the `A5` row above, re-targeted by `ABC-095` |
| *(added 2026-10-12)* `A2` + `./book-engine.ts` scripted opponent (`mate`) | ✅ "a deterministic opponent" | ✅ frames, `result`, `reason` and exit code are product code | ✅ one | **admissible, unchanged.** It also closes a flake: with the book in front, `mate` passed only when the book answered `1. f3` with `e5`, 60 % of runs |
| *(added 2026-10-12)* `A7` + `./book-engine.ts` scripted opponent (`colourBlack`, `colourWhite`) | ✅ as admitted 2026-08-20 (`## Test notes` 8: no default-lane row runs the real search) | ✅ who acts first, the unconsumed line and the frames are product code | ✅ one | **admissible, unchanged.** The re-target moves the module, not the seam |

**The last row is the point.** The shipped `parserBug` child is out under **both** halves of the
fence, independently. Lifting a name for `A3` ratifies **nothing** currently in `src/cli.test.ts`.

**What `A3` becomes.** Rebuilt on a `./line-input.ts` double whose `createLineInputSeam` returns an
`InputSeam` that throws, driven through the real spawned entry point. **One spawn — `N8-SPAWN`'s pin
of 17 does not move**, and no `src/` production line changes. **The shape only: the test is the
engineer's and no line of it was written here.** `A3`'s criterion text is **unchanged** — this
matches its Given more literally than the rig that shipped did.

**`ABC-044` and `ABC-045` inherit (N1)–(N3), not this outcome.** The question to ask there is never
*"is this module on a list"* but *"does my criterion's Given stipulate this component as constructed,
and is everything I assert produced by something I did not replace"*. Where the answer is no,
`ADR-0015` clause 2 already rules: re-scope the criterion or move it to an opt-in lane — never widen
the fence at the point of need.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **This ticket shares `ABC-042`'s test file
  (see `## Lane cost`), so the two tickets' spawn costs land in ONE file and must be read together
  against one bar.**
- **`N8-SPAWN` — SEVEN forced children, counted off the criteria above and fixed here at the cut**
  (added 2026-08-19; the account is `plans/nfr-catalog.md`'s, created 2026-08-15, and writing this row
  is BA/PM's duty at each cut).

  | criterion | children | why deleting the child would delete the criterion |
  |---|---|---|
  | `A1`, `A6`, `A8` | **0** | read off the diff / typecheck, and `A6` rides `A2`'s ≥ 6-frame run |
  | `A2` | **1** | a scripted game end to end IS a run of the delivered command |
  | `A3` | **1** | the exit code and the absence of a result screen are the **process's** |
  | `A4` | **1** | `[D31]` requires `A4` asserted **against** `A3`, so both children exist or neither does |
  | `A5` | **2** | *"an `EngineSeam` that throws, **and again** one that returns a move `legalMoves` did not produce"* — the criterion text names two |
  | `A7` | **2** | *"**Given** `--colour black` … **Given** `--colour white`, the reverse"* — either alone is satisfied by a wrong build |
  | **total** | **7** | |

  **The file's mechanical pin therefore moves 10 → 17** (`src/cli.test.ts:950`), and **17 is a
  ceiling, not a target**: a delivered child that no criterion above names is a finding against this
  ticket, never a charge on the account. **The wall clause has no account** — `NFR-008`'s 3 s wall is
  a total, children are visible on it, and seven more serial `spawnSync` calls are the largest wall
  risk this ticket carries. **Security/NFR checks both at the gate; this row does not pre-empt that
  reading.**
- **`NFR-002` (< 16 ms per frame) — carried, not re-decided.** The loop's own per-ply derive count is
  merged and mutation-tested; this ticket adds **zero** derives. `A6` is the structural guard.
- **`NFR-004` (the engine may occupy 3 s) — still not measured here, and the reason has CHANGED.**
  It was *"`EPIC-004`'s and nothing to measure"*; `src/engine.ts` is merged, and `ABC-078` measured the
  budget on its own deep lane. What this ticket adds is the **composition** — `createEngine` at
  `DEFAULT_BUDGET_MS` — and **no criterion here runs the real search** (`## Test notes` 8), so no row
  on this page may be read as a re-measurement of `NFR-004`. Named so it is not silently inherited.
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
5. **Reuse `ABC-042`'s spawn harness. Do not build a second one.** ~~keep the total spawn count
   across both tickets in single digits~~ **— STRUCK 2026-08-19: that budget was already spent before
   this ticket could honour it.** `src/cli.test.ts` spawns **TEN** children today and pins the number
   mechanically (`"N8-LANE — this file spawns TEN children and no more"`, `src/cli.test.ts:950`), so
   "single digits across both tickets" was unachievable the day `ABC-042` merged. **The budget that
   replaces it is a COUNT DERIVED FROM THIS PAGE'S CRITERIA — `## Security / NFR triggers`'
   `N8-SPAWN` row — and the pin moves from 10 to 17 with that derivation as its reason.** Do not
   raise the pin without moving the row.
6. **The harness needs stdin.** `ABC-042`'s `childOf` spawns with `stdio: ["ignore", "pipe", "pipe"]`
   (`src/cli.test.ts:120-126`) because a board-printer reads nothing. Every criterion on this page
   feeds a script, so the helper gains piped input — **extend the one helper; do not add a second
   `spawnSync` call site.** `src/cli.test.ts:961-965` asserts textually that `spawnSync` is the only
   name taken from `node:child_process` and has **exactly one call site**, and that guard stays green.
7. **The engine double is a string in the test file, injected with `--import`** — see
   `## The ruling on `A5` and `A2`'s testability` for the measured mechanism and its three limits.
   **No new file, nothing under `src/`, no env var read by production code.** A `data:` URL keeps the
   hook in the test file; a hook file placed outside `src/` would sit outside both
   `tsconfig.json`'s and `biome.json`'s `includes` (neither typechecked nor linted — the trap
   `vitest.config.ts`'s header already records) and is the worse of the two.
8. **No criterion here runs the real engine**, deliberately, and no default-lane row may: at
   `DEFAULT_BUDGET_MS` one engine ply costs 3 s of wall against `NFR-008`'s 3 s wall clause for the
   WHOLE lane. A real-engine end-to-end row belongs in an opt-in lane (`ENGINE_DEEP` precedent) and is
   not cut here.

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

### RE-SCORED 2026-08-19 by BA/PM — **9 of 10 clean, 1 ⚠️. STILL NOT MET, and the one ⚠️ is not this ticket's to clear**

Re-assessed at task `refine-ABC-043-2026-08-19` against `main` `e70fda1`, on the same checklist. **The
2026-08-13 table above is kept whole rather than edited in place** — it records what was true at the
cut. **Three of the four marks are discharged BY MEASUREMENT; the one that remains is NEW, and it was
not visible in August 13's table because the lane reading that produced it did not exist yet.**

| # | item | 2026-08-13 | 2026-08-19 | what moved |
|---|---|---|---|---|
| 3 | INVEST-shaped | ⚠️ | **✅** | **Independent now.** `ABC-041`, `ABC-042` in `Done`; `ABC-037` merged (`src/line-input.ts`); `src/engine.ts` merged with `createEngine`. Zero open ordering dependencies — see `## Dependencies`, re-measured |
| 4 | acceptance testable and measurable | ✅ | **✅** | **Held under challenge, which is the point.** Architect/Design flagged `A5` (and `A2`) as possibly unsatisfiable because `src/cli.ts` exports **0** symbols. **Ruled satisfiable AS WRITTEN, with a MEASURED mechanism** (`## The ruling on `A5` and `A2`'s testability`) — no criterion weakened, no criterion re-scoped, `ADR-0011` clause 4 untouched. **Had the mechanism not worked, this row would read ⚠️ and the ticket would be at Architect/Design, not here** |
| 5 | dependencies known | ✅ | **✅** | Re-measured rather than re-asserted; every discharged blocker carries the file that discharges it |
| 6 | security/NFR triggers with a measurable target | ✅ | **⚠️ THE ONE MARK** | **`N8-LANE` ≤ 650 ms is arithmetic over a question `ABC-108` says is OPEN**: the default lane medians **13.400 s CPU against `NFR-008`'s 13 s clause** (n=8), and until Architect/Design rules it *"`N8-LANE` cannot honestly be granted to any ticket"* — `plans/board.md`, 2026-08-18. **This ticket is not a bystander to that:** it adds **7 criterion-forced children** (the new `N8-SPAWN` row) at a **measured 62.5 ms median wall per child** (n=7, board-only child, this hop) ≈ **0.44 s**, and `N8-SPAWN`'s own total-stop clause says the account gives **no relief from the total**. The trigger is stated and the targets are measurable — what is missing is a lane the arithmetic is honest against |
| 7 | test notes present | ✅ (five) | **✅** (eight) | Three added: the moved spawn pin, the stdin-piping harness change, the engine-double mechanism, and the deliberate absence of a real-engine default-lane row |
| 10 | no major unresolved blocker | ⚠️⚠️ | **✅** | **Both discharged.** (a) `ABC-037` merged. (b) `src/engine.ts` merged, so the `EngineSeam` exists and `ADR-0013`'s NO answer is moot in practice — a real opponent ships and nothing needs a placeholder |

**Items 1, 2, 8, 9 unchanged and still ✅** (2 gained two composition constraints; 8's `M` and its split
line still hold — the ruling added no build work, only named the mechanism).

**What clearing the last ⚠️ takes, so it is not mistaken for this ticket's job:** `ABC-108`'s `OQ-1`
ruled by **Architect/Design**. Nothing on this page can clear it, and no wording change here would —
which is exactly why it is recorded as a ⚠️ rather than smoothed into prose. **A pull with it open is
a decision the Orchestrator may take with the number in front of him** (≈ 0.44 s of new child cost, on
a lane already reading over its clause); it is not a decision this table makes for him.

## Amendment — 2026-10-12 (delivered by `ABC-095`'s diff)

BA/PM (task `wave-2026-09-25`, subtask `bapm-amend-ABC-095`), at `main` `85e9d5cc`. **This page stays
`Done`, and no criterion's text changes.** What changes is the instrument. Both changes are delivered by
`ABC-095`'s diff (`ADR-0037` § Addendum — 2026-10-12 R2). Reasons:
`.grugops/context/bapm-amend-ABC-095/notes/`.

- **`A1`: a pointer only** (above). The `engine:` row's pin moves to `withBook(book, createEngine({
  budgetMs: DEFAULT_BUDGET_MS }))`, with both halves pinned and a reason line. "No adapter" means a type
  adapter, and `withBook` is the composition `ADR-0012` clause 2(3) names.
- **`A2`, `A5`, `A7`: the double moves from `./engine.ts` to `./book-engine.ts`.** With the book wired,
  an `./engine.ts` double stands behind the book and is never reached on an in-book ply. The SE's
  attempted wiring went red on `A5` and `A7`, and `A2` became a 40 % flake (`…ef39c9a6`, `…7f2adbae`).
  (N1)–(N3) are re-confirmed in the three rows added to § The (N) limit. **The Givens of `A2`, `A5` and
  `A7` do not change.**
- **Recorded, not re-opened.** `A7`'s Given (`--colour black` / `white`) does not itself stipulate a
  constructed engine. Its double was admitted at the 2026-08-20 build on `## Test notes` 8, and it was
  never tabulated under (N) until now. The re-target does not change that reading.
