---
id: ABC-037
title: The real prompt — a line reader over stdin that IS `ABC-019`'s `InputSeam`, with EOF and a ruling on a parser bug
status: in-review
column: In Review
size: M
priority: P0
epic: EPIC-003
feature: —
---

# ABC-037 — the production `InputSeam`: read a line, ask the dispatcher, answer the loop

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition.
>
> **THIS TICKET INHERITS A THIRD OWED PARAGRAPH, FOUND AT THIS HOP AND NOT PREVIOUSLY ROUTED.**
> `ABC-019` `[D31]` left one question open by name — ***does a parser bug end the game?*** — and handed
> it to *"`EPIC-003` and `EPIC-006`, not to a skeleton"*. `EPIC-003`'s half is ruled below, under
> `## The ruling on a parser bug`. It is recorded here rather than left in a merged ticket's comment,
> for the same reason the other two paragraphs were placed on `ABC-032`: a question owned by a document
> nobody re-reads arrives too late.

## Problem

*User*: every player, at the only moment they interact with this product.

*Pain*: **`ABC-019` shipped the loop that awaits an `InputSeam` and there is no production
implementation of one.** `InputSeam = (history: GameHistory) => Promise<PromptOutcome>` is published
in merged code (`src/turn-loop.ts:127`) with the comment *"`EPIC-003` replaces it; the loop waits on it
and never reads stdin itself"*, and the only implementation is a scripted stub inside
`src/turn-loop.test.ts`. That module's header says why a stub was not shipped under `src/`
(`src/turn-loop.ts:45-47`, `ADR-0009` clause 9c): *"a `src/` stub module would be production code that
is dead the day the real parser and engine land."* **Measured 2026-08-12: no non-test file in `src/`
imports `turn-loop.ts`.**

*Value*: this is the ticket that turns three resolvers and a dispatcher into something a human can type
into. **With this ticket and `EPIC-006`'s render-seam closure, and nothing else, the merged loop plus
the merged panels plus the merged stub-shaped engine become a game a person can play.**

## Scope

**One module that reads a line from stdin and returns a `PromptOutcome`.**

- **It IS the `InputSeam`** — the exact published signature, so `EPIC-006` binds it into
  `runTurnLoop({ input })` with no adapter.
- **One line per call.** The loop awaits it once per human ply; the reader does not loop and does not
  re-prompt itself. `ABC-019`'s four non-advancing outcomes are how a re-prompt happens, and the loop
  owns the cycle.
- **Classification order, delegated not duplicated:** the line goes to `ABC-035`'s command table, then
  to `ABC-033`'s dispatcher. This module contains **no grammar and no token table**.
- **EOF is an outcome, not an error.** When stdin ends, the call resolves `{ kind: "eof" }`
  (`src/turn-loop.ts:123`) and the loop terminates with `INPUT_ENDED_NOTICE` and `exitCode: 0` — the
  merged behaviour `ABC-019`'s `A8` specifies and this ticket must not re-decide.
- **The reserved prompt row is the frame's, not this module's.** `PROMPT_ROWS = 1`
  (`src/frame.ts:53`) is reserved by the frame and *"deliberately NOT padded"*; this module writes the
  prompt string into the cursor position the writer leaves it at, and **emits no cursor-control
  sequence of its own**.

## The ruling on a parser bug — `ABC-019` `[D31]`'s open question, `EPIC-003`'s half

**BA/PM, 2026-08-12. A parser bug ends the game, loudly, and never as a chess outcome. This module
catches nothing.**

`ABC-019` shipped repair-then-**rethrow** on the input seam (`A9b`): the loop repairs the borrowed
board — `legalMoves` runs `makeMove`/`unmakeMove` on the live object (`src/legal.ts:47-51`;
`GameHistory.position` is *"BORROWED, never a snapshot"*, `src/history.ts:39-44`) — and then lets the
exception out. *"The exception is `EPIC-003`'s to own and `EPIC-006`'s to catch."*

**`EPIC-003` owns it by not catching it, and that is a decision rather than an omission.** The three
options and why two lose:

- **Catch it here and return `rejected`.** **Rejected.** The player sees *that is not a legal move* for
  a defect in the parser — the product teaches a false rule and hides a real bug, which is the same
  class as `ABC-019` `A10`'s forbidden *"a result screen can never present an engine bug as a chess
  outcome"*.
- **Catch it here and terminate.** **Rejected.** `ABC-019` `[D31]` already ruled that terminating
  quietly is *"the one option that is definitely wrong"* — with no result and no reason the outcome is
  byte-identical to `A8`'s end-of-input, presenting a crashed parser as a clean exit.
- **Do not catch. Let `ABC-019`'s repair-then-rethrow run, and let `EPIC-006` catch at the top.**
  **ADOPTED.** The board is repaired by merged code, nothing downstream is handed a mid-mutation
  position, and the crash surfaces as a crash. **`EPIC-006`'s half of the question — what the top-level
  handler prints and what it exits with — is still `EPIC-006`'s, and it is named here so it is not lost
  a second time.**

**Why this costs nothing to hold:** by `ADR-0004` (2a) `parseSan` is a **total function** that never
throws, and `ABC-031`'s `A4` requires the same of the coordinate reader. **So any throw reaching this
module is by construction a defect, never a user input** — which is exactly why swallowing it would be
the wrong shape.

## Out of scope

- **Any grammar, token or reason vocabulary** — `ABC-031` / `ABC-032` / `ABC-033` / `ABC-034` /
  `ABC-035` / `ABC-036`.
- **Tab-completion** — `ABC-038`. This module reads a line; the completer is added to it there.
- **What the top-level handler prints on a rethrown parser bug, and its exit code** — `EPIC-006`,
  named above.
- **Composing the frame, choosing the write strategy, or calling `runTurnLoop`** — `EPIC-006`'s
  render-seam closure and startup (`ADR-0009` clause 9b, `ABC-019` `[D30]`).
- **`--colour`, `--ascii`, `--unicode`, argv of any kind** — `EPIC-006`'s argv surface (`EPIC-002`
  § Dependencies).
- **Raw mode, key handling, arrow keys, history recall (up-arrow).** Arrow-key board navigation is a
  named non-goal in `EPIC-003` § Out of scope; input-history recall is not in any epic's scope and is
  **not added here** (coding rules 5 and 7).

## Acceptance (Given/When/Then)

Every criterion below is provable with **stdin and stdout as pipes**, which is the mode `EPIC-006`'s
end-to-end test runs in (`EPIC-002` `4c`) and the mode that needs no TTY.

- **`A1` (it is the seam, by type and by use).** **Given** the merged `runTurnLoop`, **when** this
  module's export is passed as `options.input`, **then** it typechecks with **no adapter and no cast**,
  and a scripted game of at least four plies runs to a terminal result through it.
- **`A2` (one line, one outcome, one call).** **Given** a piped stdin carrying `e4\nNf3\n`, **when** the
  seam is awaited twice, **then** it resolves once per line, in order, and reads **exactly one line per
  call** — asserted by feeding a third line that is never consumed and observing it still buffered.
- **`A3` (EOF is `eof`, and the loop's merged behaviour is unchanged).** **Given** a piped stdin that
  ends with no trailing newline, and again one that ends mid-line, **when** the seam is awaited, **then**
  it resolves `{ kind: "eof" }` in both cases; **and** driving the merged loop with it terminates with
  `result: null`, `reason: null`, `exitCode: 0`, and the sink receives `INPUT_ENDED_NOTICE`
  (`src/turn-loop.ts:168`). *(`ABC-019`'s `A8`, re-asserted through a real reader rather than a stub.)*
- **`A4` (commands are classified before grammars, through the delegated table).** **Given** a piped
  line `help`, **when** the seam resolves, **then** the outcome is `kind: "command"` and neither
  resolver was called — asserted by spy, the same assertion `ABC-035` `A2` makes, re-asserted here
  because this module owns the order in production.
- **`A5` (a throw from below is NOT caught — the ruling, as a criterion).** **Given** an injected
  resolver that throws, **when** the seam is awaited **through `runTurnLoop`**, **then** the exception
  **propagates out of `runTurnLoop`** — the loop's `A9b` repair runs and `toFen(history.position)` is
  byte-identical to its value before the call, `history.moves.length` is unchanged — and **no
  `PromptOutcome` is produced**, in particular not `rejected` and not `eof`. **The discriminating
  requirement:** a build that wraps the resolver call in a `try`/`catch` returning `rejected` passes
  every other criterion on this page and fails this one.
- **`A6` (the seam writes nothing to the frame and emits no cursor control).** **Given** a piped stdout,
  **when** a line is read, **then** the bytes this module writes are **the prompt string only** — zero
  bytes matching an ANSI CSI sequence, and zero writes to the loop's `FrameSink`. *(`ADR-0009`
  clause 9: the loop hands the writer every frame exactly as the seam returned it — no re-composition.
  A reader that emits its own cursor moves corrupts `4b`'s single erase-to-end operation.)*
- **`A7` (no per-keystroke work — `NFR-003` as a count, not a clock).** **Given** a line typed one
  character at a time into a piped stdin, **when** it is read, **then** `legalMoves` is called
  **exactly 0** times before the line is submitted and **exactly 1** time after, asserted by spy.
  *(This is the structural form of `NFR-003`'s < 50 ms keystroke echo; the wall-clock reading belongs
  in `plans/nfr-catalog.md` with its machine — this suite asserts no wall clock, `src/gameend.nfr.test.ts:16-17`.)*
- **`A8` (no production change outside this ticket's module).** `git diff --numstat` shows this ticket's
  module and test file(s) and nothing else under `src/` — **`src/turn-loop.ts` and `src/frame.ts` in
  particular byte-identical** — suite green, skip **0**, `PERFT_DEEP=1` **32/32**.

## Dependencies

- **`ABC-033` must land first — OPEN.** The dispatcher this module delegates to.
- **`ABC-035` must land first — OPEN.** The command table this module consults first.
- **`ABC-019` is merged** and supplies `InputSeam`, `PromptOutcome`, `INPUT_ENDED_NOTICE`, the `A9b`
  repair and the `exitCode: 0` contract. **None of them is re-decided here.**
- **`EPIC-006` is the consumer, and it is NOT a dependency of this ticket.** It binds this seam into
  `runTurnLoop`; this module neither imports nor knows about it. **The direction matters: this ticket
  can be built, tested and merged with no entry point in existence.**
- **`EPIC-006` owes the other half of the `[D31]` ruling** — what the top-level handler prints on a
  rethrown parser bug and what it exits with. Recorded in `## The ruling on a parser bug` and in
  `plans/epics/EPIC-006-game-session-and-packaging.md` so it does not go missing a second time.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added, scope = every file the branch adds under `src/`.
- **`NFR-003` (input responsiveness — keystroke echo < 50 ms). THIS TICKET OWNS IT** and it is the only
  ticket in the epic that does. Measurable form: `A7`'s counts (**0** derives per keystroke, **1** per
  submitted line). The wall-clock number is a catalog reading with its machine, not a suite assertion.
- **`NFR-002` (render latency < 16 ms) — not triggered, and `A6` and `A8` are what hold it.** This
  module composes no frame, writes no frame row, and leaves `src/frame.ts` byte-identical.
- **`ADR-0011` / `NFR-002` module scope: this adds a production module.** It is **not** in the render
  closure — no renderer imports it — but the next `NFR-002` re-derivation counts it. Named so the count
  moves deliberately rather than being discovered by a probe.
- **Security: this is the FIRST production module in the repository that reads input from outside the
  process, and the trigger is therefore NOT waived.** Three named bars, each measurable:
  1. **The read line is data, never code.** No `eval`, no `Function`, no `require`/dynamic `import` of
     anything derived from input, no shell, no `child_process`. Asserted by the diff: **zero occurrences
     of those constructs in the delivered module.**
  2. **Unbounded input is bounded here.** A single line longer than a stated cap (the engineer picks the
     number; it is stated in the ticket's test rows) is truncated or rejected — it is **never** passed
     to a resolver, and it never grows the frame. `ABC-031` `A4` and `ABC-032` `A5` already require
     totality on a 10,000-character string; this bar is about memory, not parsing.
  3. **Every byte that reaches the terminal goes through the frame's sanitizer.** Any echo of the typed
     line travels as a message through `assembleFrame`, which **sanitizes** (`src/frame.ts:202`,
     `ABC-018`'s ownership of terminal escape-sequence injection). `A6` is what pins it: this module
     writes the prompt string and nothing else.
  **Firing threshold, falsifiable:** the security half fires — and the added lines get read for
  spawns, network calls, secrets and unbounded loops before the ticket leaves review — if the delivered
  diff touches any file under `src/` other than this module and its test file(s), adds a runtime
  dependency (`package.json` has **no `dependencies` key**, verified 2026-08-12 — absent, not `{}`), or
  imports any Node builtin other than the line-reading one.

## Test notes

1. **Everything is provable over pipes.** No TTY, no `node-pty`, no interactive harness. That is the
   mode `EPIC-006`'s end-to-end test uses anyway (`EPIC-002` `4c`).
2. **`A5` is the ruling and it must be run THROUGH `runTurnLoop`**, not against the seam in isolation —
   the repair it asserts is the loop's, and asserting it on the seam alone proves nothing.
3. **Assert the buffered third line** (`A2`). A reader that drains stdin passes every content
   assertion and eats the player's next move.
4. **Assert zero CSI bytes** (`A6`), not "looks right". A regex over the written bytes is the assertion.
5. **Two EOF shapes** (`A3`): ended with no trailing newline, and ended mid-line. They are different
   code paths in every line reader ever written.
6. **Do not re-decide `exitCode: 0`.** `ABC-019` ruled it, the type says so, and the safety lives in
   `EPIC-006`'s end-to-end assertion of the result screen.

## Lane cost — how many test FILES this ticket implies

**One.** `A4`/`A5`/`A7`'s spies are `vi.spyOn` over injected seams, so **no `*.nfr.test.ts` file is
added** — even though this is the ticket that owns `NFR-003`, because `A7` is a count over an injected
spy rather than a hoisted `vi.mock`. ≈ 160 ms CPU, **≈ 1.2% of the 13 s clause** (arithmetic over the
published floor, not a new measurement).

## Size and priority rationale

**Size `M` (3).** One module, but it is the first production code in this repository that touches
`process.stdin`, it is asynchronous by contract, it has two EOF shapes, a no-catch ruling that must be
asserted through the loop, a byte-level output criterion and a three-bar security section that no
previous ticket in this project has needed. Calibrated against `ABC-018` (frame output and redraw — the
other I/O boundary ticket on this board, and the closest analogue) and `ABC-013` (`M`). It is below
`L` (`ABC-019`) because there is no state machine, no design decision left open and no new dependency
edge beyond one Node builtin.

**Not `XL`. The split line if it moves:** **(a) the reader and EOF** — `A1`, `A2`, `A3`, `A6`, `A7`;
and **(b) the classification order and the no-catch ruling** — `A4`, `A5`. Part (a) is `S` and ships
alone.

**Priority `P0`.** It is the production `InputSeam` — the thing `ABC-019` shipped a hole for and named
`EPIC-003` as the filler of. **Not `P1`:** with `EPIC-006`'s render-seam closure this is the last piece
between a repository of 17 tested modules and a game a person can play, and `AGENTS.md` currently
records `Dev / run: UNKNOWN - verify`.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 9 of 10 clean, 1 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** every player at the only moment they interact; the seam is published in merged code and has no production implementation (measured) |
| 2 | scope and out-of-scope clear | **✅** one module, the exact published signature, EOF as an outcome; six fences, including two named non-goals (arrow keys, input-history recall) |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: two open sibling dependencies (`ABC-033`, `ABC-035`). **It IS independent of `EPIC-006`**, in the direction that matters: it can be built, tested and merged with no entry point in existence |
| 4 | acceptance testable and measurable | **✅** eight criteria: typechecks with no adapter, exactly one line per call with a buffered witness, two EOF shapes with `exitCode: 0`, propagation asserted through the loop with byte-identical `toFen`, **zero** CSI bytes, spied counts of **0** and **1**, `32/32`, skip **0** |
| 5 | dependencies known | **✅** two open sibling dependencies; three merged contracts named with their line numbers; `EPIC-006` named as consumer-not-dependency with the direction stated, and its owed half of `[D31]` recorded |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-003` **owned here** with a count form; three named security bars with a falsifiable firing threshold — the first module in this repo to read outside input, and **not pre-waived** |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M` (3), calibrated against `ABC-018`, with the split line named |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **two ordering dependencies are OPEN** — `ABC-033` and `ABC-035`. Named, owned, and the reason this sits in `Backlog`. **The `[D31]` question this ticket inherited is RULED, not open** — `EPIC-003`'s half is decided on this page and `EPIC-006`'s half is recorded against that epic |
